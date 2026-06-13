#!/usr/bin/env python3
"""
Compare two images using multiple perceptual metrics.

Metrics (Main - used for pass/fail):
- SSIM (Structural Similarity Index)
- Pixel diff percentage
- ΔE2000 (CIE color difference)

Metrics (Secondary - informative):
- MS-SSIM (Multi-Scale SSIM)
- PSNR (Peak Signal-to-Noise Ratio)

Heuristics (Triage only - not for pass/fail):
- pHash (Perceptual Hash)

Usage:
    python compare_images.py <reference> <test> [options]

Exit codes:
    0 = PASS (all metrics within thresholds)
    1 = REVIEW (one or more metrics failed)
    2 = ERROR (invalid input, file not found, etc.)
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import TypedDict

import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim

try:
    import colour

    HAS_COLOUR = True
except ImportError:
    HAS_COLOUR = False

try:
    import imagehash
    from PIL import Image

    HAS_IMAGEHASH = True
except ImportError:
    HAS_IMAGEHASH = False

try:
    from sewar.full_ref import msssim as compute_msssim_sewar

    HAS_SEWAR = True
except ImportError:
    HAS_SEWAR = False


# Constants
MAX_FILE_SIZE_MB = 10
MAX_DIMENSION = 4096
SUPPORTED_FORMATS = [".png", ".jpg", ".jpeg", ".webp", ".bmp"]


class MetricResult(TypedDict):
    value: float
    threshold: float | None
    passed: bool
    is_main: bool


class AlignmentResult(TypedDict):
    aligned: bool
    reason: str | None
    offset_applied: dict | None
    warning: str | None


# Threshold presets - REVISED with clear units
# Main metrics: SSIM, pixel_diff_pct, delta_e_mean (ANY-FAIL rule)
# Secondary metrics: msssim, psnr_db (informative)
# Heuristics: phash_distance (triage only)
THRESHOLDS = {
    "strict": {
        # Main metrics (pass/fail)
        "ssim": 0.98,  # 0-1 (1 = identical)
        "pixel_diff_pct": 0.5,  # % of different pixels
        "delta_e_mean": 1.0,  # ΔE2000 mean (< 1 = imperceptible)
        # Secondary metrics (informative)
        "msssim": 0.98,  # 0-1
        "psnr_db": 35,  # dB
        # Heuristics
        "phash_distance": None,  # Triage only, not a gate
        # Auto-align DISABLED in strict mode
        "auto_align_enabled": False,
    },
    "normal": {
        "ssim": 0.95,
        "pixel_diff_pct": 2.0,
        "delta_e_mean": 2.0,
        "msssim": 0.95,
        "psnr_db": 30,
        "phash_distance": None,
        "auto_align_enabled": True,
    },
    "loose": {
        "ssim": 0.90,
        "pixel_diff_pct": 5.0,
        "delta_e_mean": 5.0,
        "msssim": 0.90,
        "psnr_db": 25,
        "phash_distance": None,
        "auto_align_enabled": True,
    },
}

# Main metrics used for pass/fail decision
MAIN_METRICS = ["ssim", "pixel_diff_pct", "delta_e_mean"]
SECONDARY_METRICS = ["msssim", "psnr_db"]
HEURISTICS = ["phash_distance"]


def validate_file(path: str) -> tuple[bool, str]:
    """Validate file exists, size, and format."""
    if not os.path.exists(path):
        return False, f"File not found: {path}"

    size_mb = os.path.getsize(path) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        return False, f"File too large: {size_mb:.1f}MB > {MAX_FILE_SIZE_MB}MB"

    ext = Path(path).suffix.lower()
    if ext not in SUPPORTED_FORMATS:
        return False, f"Unsupported format: {ext}"

    return True, ""


def normalize_image(
    path: str, target_size: tuple[int, int] | None = None
) -> tuple[np.ndarray, dict]:
    """
    Phase 0: Normalize image before comparison.

    Normalization steps:
    1. Flatten alpha channel (composite on white background)
    2. Convert to BGR (consistent color space)
    3. Resize to target size if provided
    4. Ensure uint8 format

    Returns:
        tuple: (normalized_image, metadata_dict)
    """
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)

    if img is None:
        raise ValueError(f"Failed to load image: {path}")

    original_shape = img.shape
    h, w = img.shape[:2]

    if h > MAX_DIMENSION or w > MAX_DIMENSION:
        raise ValueError(f"Image too large: {w}x{h} > {MAX_DIMENSION}x{MAX_DIMENSION}")

    metadata = {
        "original_size": f"{w}x{h}",
        "had_alpha": False,
        "was_grayscale": False,
        "was_resized": False,
    }

    # Handle alpha channel (composite on white background)
    if len(img.shape) == 3 and img.shape[2] == 4:
        alpha = img[:, :, 3:4] / 255.0
        bgr = img[:, :, :3]
        white_bg = np.ones_like(bgr) * 255
        img = (bgr * alpha + white_bg * (1 - alpha)).astype(np.uint8)
        metadata["had_alpha"] = True
    elif len(img.shape) == 2:
        # Grayscale to BGR
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        metadata["was_grayscale"] = True

    # Resize if needed
    if target_size is not None and (w, h) != target_size:
        img = cv2.resize(img, target_size, interpolation=cv2.INTER_AREA)
        metadata["was_resized"] = True
        metadata["final_size"] = f"{target_size[0]}x{target_size[1]}"
    else:
        metadata["final_size"] = f"{img.shape[1]}x{img.shape[0]}"

    return img, metadata


def apply_blur_preprocessing(img: np.ndarray, sigma: float = 0.5) -> np.ndarray:
    """
    Apply light Gaussian blur to tolerate antialiasing differences.

    This is applied AUTOMATICALLY to reduce false positives from
    font rendering and edge antialiasing differences between
    Figma exports and browser screenshots.

    Args:
        img: Image to blur
        sigma: Gaussian blur sigma (default 0.5 for light blur)

    Returns:
        Blurred image
    """
    if sigma <= 0:
        return img
    return cv2.GaussianBlur(img, (0, 0), sigma)


def generate_smart_warnings(
    ssim_score: float,
    phash_result: dict | None,
) -> list[dict]:
    """
    Generate intelligent warnings based on metric combinations.

    Returns list of warnings with actionable suggestions.
    """
    warnings = []

    # SSIM = 1.0 is suspicious (same image twice?)
    if ssim_score == 1.0:
        warnings.append({
            "type": "PERFECT_MATCH",
            "message": "SSIM = 1.0 perfeito - verifique se as imagens sao capturas diferentes",
            "severity": "warning",
        })

    if phash_result:
        phash_distance = phash_result.get("distance", 0)

        # Very different images
        if phash_distance > 30:
            warnings.append({
                "type": "VERY_DIFFERENT",
                "message": f"Imagens muito diferentes (pHash distance={phash_distance}) - verifique se sao do mesmo componente",
                "severity": "error",
            })

        # Low SSIM but similar pHash = likely alignment/scale issue
        elif ssim_score < 0.7 and phash_distance < 10:
            warnings.append({
                "type": "ALIGNMENT_ISSUE",
                "message": "SSIM baixo mas pHash similar - provavel problema de alinhamento/escala, nao de conteudo",
                "severity": "info",
            })

    return warnings


# =============================================================================
# LAYERED METRICS - Each metric is MAIN and influences the final verdict
# =============================================================================


def compute_layout_similarity(
    img1: np.ndarray, img2: np.ndarray, mask: np.ndarray | None = None
) -> dict:
    """
    Compare structure using Canny edge detection.

    Detects differences in layout, element positioning, and visual structure.
    Ignores colors and textures, focuses purely on edges/borders.

    Args:
        img1: First image
        img2: Second image
        mask: Boolean mask (True = include, False = ignore)

    Returns:
        dict with value, pass status, and action_if_fail
    """
    edges1 = cv2.Canny(cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY), 50, 150)
    edges2 = cv2.Canny(cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY), 50, 150)

    # Dilate to connect nearby edges
    kernel = np.ones((3, 3), np.uint8)
    edges1 = cv2.dilate(edges1, kernel, iterations=1)
    edges2 = cv2.dilate(edges2, kernel, iterations=1)

    # Apply mask if provided
    if mask is not None:
        edges1[~mask] = 0
        edges2[~mask] = 0

    # IoU of edges
    intersection = np.logical_and(edges1, edges2).sum()
    union = np.logical_or(edges1, edges2).sum()

    score = float(intersection / union) if union > 0 else 1.0
    passed = score >= 0.85

    return {
        "value": round(score, 4),
        "threshold": 0.85,
        "pass": passed,
        "is_main": True,
        "action_if_fail": "Verificar CSS flex/grid, ordem de elementos, containers" if not passed else None,
    }


def compute_regional_color_diff(
    img1: np.ndarray,
    img2: np.ndarray,
    grid_size: int = 4,
    mask: np.ndarray | None = None,
) -> dict:
    """
    Compare color histograms by region.

    Divides images into NxN grid and compares color distribution in each cell.
    Returns WHERE the color differences are, not just IF they exist.

    Args:
        img1: First image
        img2: Second image
        grid_size: Number of cells in each dimension
        mask: Boolean mask (True = include, False = ignore)

    Returns:
        dict with value, pass status, problem_regions, and action_if_fail
    """
    h, w = img1.shape[:2]
    cell_h, cell_w = h // grid_size, w // grid_size

    hsv1 = cv2.cvtColor(img1, cv2.COLOR_BGR2HSV)
    hsv2 = cv2.cvtColor(img2, cv2.COLOR_BGR2HSV)

    problem_regions = []
    scores = []

    for i in range(grid_size):
        for j in range(grid_size):
            y1, y2 = i * cell_h, (i + 1) * cell_h
            x1, x2 = j * cell_w, (j + 1) * cell_w

            # Check if cell is mostly masked (>50% ignored)
            if mask is not None:
                cell_mask = mask[y1:y2, x1:x2]
                mask_ratio = cell_mask.sum() / cell_mask.size
                if mask_ratio < 0.5:
                    # Skip this cell, mostly masked
                    continue
                # Use mask for histogram calculation
                cell_mask_uint8 = cell_mask.astype(np.uint8) * 255
            else:
                cell_mask_uint8 = None

            hist1 = cv2.calcHist(
                [hsv1[y1:y2, x1:x2]], [0, 1], cell_mask_uint8, [50, 60], [0, 180, 0, 256]
            )
            hist2 = cv2.calcHist(
                [hsv2[y1:y2, x1:x2]], [0, 1], cell_mask_uint8, [50, 60], [0, 180, 0, 256]
            )

            cv2.normalize(hist1, hist1)
            cv2.normalize(hist2, hist2)

            score = cv2.compareHist(hist1, hist2, cv2.HISTCMP_BHATTACHARYYA)
            scores.append(score)

            if score > 0.3:
                problem_regions.append({"row": i, "col": j, "score": round(score, 3)})

    # Handle case where all cells were masked
    if not scores:
        return {
            "value": 0.0,
            "threshold": 0.2,
            "pass": True,
            "is_main": True,
            "problem_regions": [],
            "action_if_fail": None,
        }

    mean_diff = float(np.mean(scores))
    passed = mean_diff < 0.2

    action = None
    if not passed and problem_regions:
        regions_str = ", ".join(f"({r['row']},{r['col']})" for r in problem_regions[:3])
        action = f"Verificar tokens de cor nas regioes: {regions_str}"

    return {
        "value": round(mean_diff, 4),
        "threshold": 0.2,
        "pass": passed,
        "is_main": True,
        "problem_regions": problem_regions,
        "action_if_fail": action,
    }


def compute_text_similarity(
    img1: np.ndarray, img2: np.ndarray, mask: np.ndarray | None = None
) -> dict:
    """
    Extract and compare text via OCR.

    Uses Tesseract to extract text from both images and compares content.
    Shows specific differences (missing/extra words).

    Args:
        img1: First image
        img2: Second image
        mask: Boolean mask (True = include, False = ignore). Masked regions
              are painted white before OCR to exclude dynamic content.

    Returns:
        dict with value, pass status, word differences, and action_if_fail
    """
    try:
        import pytesseract
        from difflib import SequenceMatcher
    except ImportError:
        return {
            "value": None,
            "pass": True,
            "is_main": False,
            "error": "pytesseract not installed",
            "action_if_fail": None,
        }

    # Apply mask by painting ignored regions white (OCR will skip them)
    if mask is not None:
        img1_masked = img1.copy()
        img2_masked = img2.copy()
        img1_masked[~mask] = 255
        img2_masked[~mask] = 255
    else:
        img1_masked = img1
        img2_masked = img2

    try:
        text1 = pytesseract.image_to_string(img1_masked, lang="por+eng")
        text2 = pytesseract.image_to_string(img2_masked, lang="por+eng")
    except Exception as e:
        return {
            "value": None,
            "pass": True,
            "is_main": False,
            "error": f"OCR failed: {str(e)}",
            "action_if_fail": None,
        }

    text1_norm = " ".join(text1.split()).lower()
    text2_norm = " ".join(text2.split()).lower()

    if not text1_norm and not text2_norm:
        # No text in either image
        return {
            "value": 1.0,
            "threshold": 0.90,
            "pass": True,
            "is_main": True,
            "action_if_fail": None,
        }

    similarity = SequenceMatcher(None, text1_norm, text2_norm).ratio()
    passed = similarity > 0.90

    # Find word differences
    words1 = set(text1_norm.split())
    words2 = set(text2_norm.split())
    missing = list(words1 - words2)[:5]
    extra = list(words2 - words1)[:5]

    action = None
    if not passed:
        parts = []
        if missing:
            parts.append(f"Palavras faltando: {missing}")
        if extra:
            parts.append(f"Palavras extras: {extra}")
        action = "; ".join(parts) if parts else "Texto diferente entre Figma e browser"

    return {
        "value": round(similarity, 4),
        "threshold": 0.90,
        "pass": passed,
        "is_main": True,
        "missing_words": missing,
        "extra_words": extra,
        "action_if_fail": action,
    }


def compute_spacing_similarity(
    img1: np.ndarray, img2: np.ndarray, mask: np.ndarray | None = None
) -> dict:
    """
    Analyze gaps between components.

    Detects connected components and measures vertical gaps between them.
    Compares gap values between Figma and browser with 4px tolerance.

    Args:
        img1: First image
        img2: Second image
        mask: Boolean mask (True = include, False = ignore)

    Returns:
        dict with value, pass status, gap values, and action_if_fail
    """

    def analyze_gaps(img: np.ndarray, img_mask: np.ndarray | None) -> list[int]:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY_INV)

        # Apply mask if provided
        if img_mask is not None:
            binary[~img_mask] = 0

        num_labels, _, stats, _ = cv2.connectedComponentsWithStats(binary)

        # Get component positions sorted by Y
        components = sorted(
            [
                (stats[i, cv2.CC_STAT_TOP], stats[i, cv2.CC_STAT_HEIGHT])
                for i in range(1, num_labels)
                if stats[i, cv2.CC_STAT_AREA] > 100
            ]
        )

        gaps = []
        for i in range(len(components) - 1):
            gap = components[i + 1][0] - (components[i][0] + components[i][1])
            if 0 < gap < 100:
                gaps.append(gap)

        return sorted(set(gaps))

    def match_with_tolerance(set1: list, set2: list, tol: int = 4) -> float:
        if not set1:
            return 1.0 if not set2 else 0.0
        matches = sum(1 for v1 in set1 if any(abs(v1 - v2) <= tol for v2 in set2))
        return matches / len(set1)

    gaps1 = analyze_gaps(img1, mask)
    gaps2 = analyze_gaps(img2, mask)

    ratio = match_with_tolerance(gaps1, gaps2)
    passed = ratio > 0.7

    action = None
    if not passed:
        action = f"Gaps Figma: {gaps1} vs Browser: {gaps2}"

    return {
        "value": round(ratio, 4),
        "threshold": 0.7,
        "pass": passed,
        "is_main": True,
        "figma_gaps": gaps1,
        "browser_gaps": gaps2,
        "action_if_fail": action,
    }


# =============================================================================
# DYNAMIC REGION DETECTION (AUTOMATIC)
# =============================================================================


def detect_dynamic_regions(img: np.ndarray) -> list[dict]:
    """
    Automatically detect dynamic content regions (timestamps, IDs, dates).

    Uses OCR to find text that matches dynamic patterns and returns
    their bounding boxes for masking during comparison.

    This runs AUTOMATICALLY - no configuration needed.

    Patterns detected:
    - Timestamps: "12:34", "12:34:56"
    - Dates: "01/02/2024", "1/2/24"
    - IDs/Hashes: "ABC123DEF456" (8+ alphanumeric chars)

    Returns:
        List of regions: [{"x": int, "y": int, "w": int, "h": int, "type": str}]
    """
    try:
        import pytesseract
        import re
    except ImportError:
        return []

    patterns = [
        (r"\d{1,2}:\d{2}(:\d{2})?", "timestamp"),
        (r"\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}", "date"),
        (r"[A-Z0-9]{8,}", "id_hash"),
    ]

    try:
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
    except Exception:
        return []

    dynamic_regions = []

    for i, text in enumerate(data["text"]):
        if not text or int(data["conf"][i]) < 50:
            continue

        text = text.strip()
        for pattern, region_type in patterns:
            if re.match(pattern, text):
                x = data["left"][i]
                y = data["top"][i]
                w = data["width"][i]
                h = data["height"][i]

                # Add padding around detected region
                padding = 4
                dynamic_regions.append({
                    "x": max(0, x - padding),
                    "y": max(0, y - padding),
                    "w": w + padding * 2,
                    "h": h + padding * 2,
                    "type": region_type,
                    "text": text,
                })
                break

    return dynamic_regions


def combine_dynamic_masks(
    img1: np.ndarray,
    img2: np.ndarray,
    existing_mask: np.ndarray | None = None,
) -> tuple[np.ndarray, list[dict]]:
    """
    Detect dynamic regions in both images and combine into a single mask.

    Returns:
        tuple: (combined_mask, detected_regions)
    """
    h, w = img1.shape[:2]
    mask = existing_mask.copy() if existing_mask is not None else np.ones((h, w), dtype=bool)

    regions1 = detect_dynamic_regions(img1)
    regions2 = detect_dynamic_regions(img2)

    all_regions = regions1 + regions2

    for region in all_regions:
        x1 = max(0, region["x"])
        y1 = max(0, region["y"])
        x2 = min(w, region["x"] + region["w"])
        y2 = min(h, region["y"] + region["h"])
        mask[y1:y2, x1:x2] = False

    return mask, all_regions


# =============================================================================
# MASK AND REGION UTILITIES
# =============================================================================


def create_mask(img_shape: tuple, ignore_regions: list[dict]) -> np.ndarray:
    """
    Create boolean mask for excluding regions from metrics.

    True = include in comparison, False = ignore

    Args:
        img_shape: (height, width, channels) or (height, width)
        ignore_regions: list of {"x": int, "y": int, "w": int, "h": int}

    Returns:
        Boolean mask array
    """
    h, w = img_shape[:2]
    mask = np.ones((h, w), dtype=bool)

    for region in ignore_regions:
        x, y, rw, rh = region["x"], region["y"], region["w"], region["h"]
        # Clamp to image bounds
        x1 = max(0, x)
        y1 = max(0, y)
        x2 = min(w, x + rw)
        y2 = min(h, y + rh)
        mask[y1:y2, x1:x2] = False  # Exclude region

    return mask


def apply_mask_to_diff(
    diff_img: np.ndarray, mask: np.ndarray, color: tuple = (128, 128, 128)
) -> np.ndarray:
    """
    Visualize masked regions in diff image (for display only, not metrics).
    """
    result = diff_img.copy()
    result[~mask] = color
    return result


def is_antialiased_yiq(
    img: np.ndarray, x: int, y: int, threshold: float = 0.1
) -> bool:
    """
    Detect if a pixel is part of antialiasing using YIQ color space.
    Based on Pixelmatch/Playwright algorithm.

    YIQ is more perceptually accurate for edge detection than RGB.
    """
    h, w = img.shape[:2]
    if x <= 0 or x >= w - 1 or y <= 0 or y >= h - 1:
        return False

    # Convert pixel to YIQ
    def rgb_to_yiq(rgb):
        r, g, b = rgb[2] / 255.0, rgb[1] / 255.0, rgb[0] / 255.0  # BGR to RGB
        y = 0.299 * r + 0.587 * g + 0.114 * b
        i = 0.596 * r - 0.275 * g - 0.321 * b
        q = 0.212 * r - 0.523 * g + 0.311 * b
        return y, i, q

    def yiq_distance(yiq1, yiq2):
        return abs(yiq1[0] - yiq2[0]) * 0.5053 + abs(yiq1[1] - yiq2[1]) * 0.299 + abs(
            yiq1[2] - yiq2[2]
        ) * 0.1957

    center_yiq = rgb_to_yiq(img[y, x])

    # Check 8 neighbors
    neighbors = [
        (x - 1, y - 1),
        (x, y - 1),
        (x + 1, y - 1),
        (x - 1, y),
        (x + 1, y),
        (x - 1, y + 1),
        (x, y + 1),
        (x + 1, y + 1),
    ]

    similar_count = 0
    brightness_values = []

    for nx, ny in neighbors:
        neighbor_yiq = rgb_to_yiq(img[ny, nx])
        dist = yiq_distance(center_yiq, neighbor_yiq)
        if dist < threshold:
            similar_count += 1
        brightness_values.append(neighbor_yiq[0])

    # Antialiasing characteristics:
    # 1. Has some similar neighbors (but not all)
    # 2. Has brightness gradient
    has_similar_neighbors = 2 <= similar_count <= 6
    brightness_range = max(brightness_values) - min(brightness_values)
    has_gradient = brightness_range > 0.15

    return has_similar_neighbors and has_gradient


def align_images_ecc(
    reference: np.ndarray,
    test: np.ndarray,
    preset: str = "normal",
    max_offset: int = 5,
) -> tuple[np.ndarray, AlignmentResult]:
    """
    Align test image with reference using ECC (Enhanced Correlation Coefficient).

    SAFETY GATES:
    1. DISABLED in preset "strict" (may hide regressions)
    2. max_offset limited to 5px (more = real problem)
    3. Always log applied offset in output

    Args:
        reference: Reference image
        test: Test image to align
        preset: Threshold preset (strict disables alignment)
        max_offset: Maximum allowed offset in pixels

    Returns:
        tuple: (aligned_image, alignment_metadata)
    """
    # GATE 1: Disable in strict mode
    if preset == "strict" or not THRESHOLDS.get(preset, {}).get(
        "auto_align_enabled", True
    ):
        return test, {
            "aligned": False,
            "reason": "disabled_in_strict_mode",
            "offset_applied": None,
            "warning": "Auto-align disabled to prevent hiding regressions",
        }

    gray_ref = cv2.cvtColor(reference, cv2.COLOR_BGR2GRAY)
    gray_test = cv2.cvtColor(test, cv2.COLOR_BGR2GRAY)

    warp_mode = cv2.MOTION_TRANSLATION
    warp_matrix = np.eye(2, 3, dtype=np.float32)
    criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 1000, 1e-7)

    try:
        _, warp_matrix = cv2.findTransformECC(
            gray_ref, gray_test, warp_matrix, warp_mode, criteria
        )

        dx, dy = float(warp_matrix[0, 2]), float(warp_matrix[1, 2])

        # GATE 2: Limit maximum offset
        if abs(dx) > max_offset or abs(dy) > max_offset:
            return test, {
                "aligned": False,
                "reason": "offset_too_large",
                "offset_applied": None,
                "offset_detected": {"x": round(dx, 2), "y": round(dy, 2)},
                "warning": f"Offset >{max_offset}px indicates real problem, not applying correction",
            }

        # Apply alignment only if offset is small
        if abs(dx) < 0.1 and abs(dy) < 0.1:
            return test, {
                "aligned": False,
                "reason": "no_significant_offset",
                "offset_applied": None,
                "offset_detected": {"x": round(dx, 2), "y": round(dy, 2)},
                "warning": None,
            }

        aligned = cv2.warpAffine(
            test,
            warp_matrix,
            (reference.shape[1], reference.shape[0]),
            flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP,
        )

        # GATE 3: Always log applied offset
        return aligned, {
            "aligned": True,
            "reason": "ecc_alignment",
            "offset_applied": {"x": round(dx, 2), "y": round(dy, 2)},
            "warning": "⚠️ Offset corrected automatically - verify if expected",
        }

    except cv2.error:
        return test, {
            "aligned": False,
            "reason": "convergence_failed",
            "offset_applied": None,
            "warning": "ECC alignment failed to converge",
        }


def compute_ssim(
    img1: np.ndarray, img2: np.ndarray, mask: np.ndarray | None = None
) -> float:
    """Compute SSIM between two images, optionally with mask."""
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    if mask is not None:
        # Apply mask by setting ignored pixels to same value
        # This is a workaround since skimage SSIM doesn't support masks directly
        gray1_masked = gray1.copy()
        gray2_masked = gray2.copy()
        gray1_masked[~mask] = 0
        gray2_masked[~mask] = 0
        score, _ = ssim(gray1_masked, gray2_masked, full=True)
    else:
        score, _ = ssim(gray1, gray2, full=True)

    return float(score)


def compute_msssim(img1: np.ndarray, img2: np.ndarray) -> float | None:
    """Compute MS-SSIM (Multi-Scale SSIM) between two images."""
    if not HAS_SEWAR:
        return None

    try:
        # sewar expects RGB images
        rgb1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
        rgb2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
        score = compute_msssim_sewar(rgb1, rgb2)
        # Handle complex numbers (can happen with certain image pairs)
        if np.iscomplex(score):
            score = np.abs(score)
        return float(np.real(score))
    except Exception:
        return None


def compute_psnr(img1: np.ndarray, img2: np.ndarray) -> float:
    """Compute PSNR between two images."""
    psnr_value = cv2.PSNR(img1, img2)
    return float(psnr_value) if not np.isinf(psnr_value) else 100.0


def compute_pixel_diff(
    img1: np.ndarray,
    img2: np.ndarray,
    tolerance: int = 2,
    mask: np.ndarray | None = None,
) -> float:
    """
    Compute percentage of different pixels.

    Uses tolerance to account for antialiasing differences.

    Args:
        img1: First image
        img2: Second image
        tolerance: Pixel value tolerance
        mask: Boolean mask (True = include, False = ignore)

    Returns:
        Percentage of different pixels (0-100)
    """
    diff = np.abs(img1.astype(int) - img2.astype(int))
    different_pixels = np.any(diff > tolerance, axis=2)

    if mask is not None:
        # Only count pixels that are in the mask
        valid_pixels = mask.sum()
        if valid_pixels == 0:
            return 0.0
        different_valid = (different_pixels & mask).sum()
        return float(different_valid / valid_pixels * 100)
    else:
        return float(np.sum(different_pixels) / different_pixels.size * 100)


def compute_delta_e(
    img1: np.ndarray, img2: np.ndarray, mask: np.ndarray | None = None
) -> float | None:
    """
    Compute mean ΔE2000 color difference.

    Returns None if colour-science is not available.
    """
    if not HAS_COLOUR:
        return None

    # Convert BGR to RGB then to Lab
    rgb1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB).astype(float) / 255.0
    rgb2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB).astype(float) / 255.0

    # Convert to CIE Lab
    lab1 = colour.XYZ_to_Lab(colour.sRGB_to_XYZ(rgb1))
    lab2 = colour.XYZ_to_Lab(colour.sRGB_to_XYZ(rgb2))

    if mask is not None:
        # Only compute for masked pixels
        lab1_flat = lab1[mask].reshape(-1, 3)
        lab2_flat = lab2[mask].reshape(-1, 3)
    else:
        lab1_flat = lab1.reshape(-1, 3)
        lab2_flat = lab2.reshape(-1, 3)

    if lab1_flat.size == 0:
        return 0.0

    # Compute ΔE2000 for each pixel and take mean
    delta_e = colour.delta_E(lab1_flat, lab2_flat, method="CIE 2000")
    return float(np.mean(delta_e))


def compute_phash(img1_path: str, img2_path: str) -> dict | None:
    """
    Compute perceptual hash distance.

    ⚠️ HEURISTIC ONLY - Not for pass/fail decision.
    Use for quick triage to identify very different images.
    """
    if not HAS_IMAGEHASH:
        return None

    try:
        hash1 = imagehash.phash(Image.open(img1_path))
        hash2 = imagehash.phash(Image.open(img2_path))
        distance = int(hash1 - hash2)  # Hamming distance

        return {
            "distance": distance,
            "interpretation": "heuristic_only",
            "skip_detailed_comparison": bool(distance > 20),  # Very different
        }
    except Exception:
        return None


def find_diff_contours(
    img1: np.ndarray, img2: np.ndarray, min_area: int = 100
) -> list[dict]:
    """
    Find bounding boxes of different regions.

    Args:
        img1: First image
        img2: Second image
        min_area: Minimum contour area to consider

    Returns:
        List of bounding boxes: [{"x": int, "y": int, "w": int, "h": int, "area": int}]
    """
    diff = cv2.absdiff(img1, img2)
    gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)

    # Threshold + dilation to group nearby differences
    _, thresh = cv2.threshold(gray_diff, 25, 255, cv2.THRESH_BINARY)
    thresh = cv2.dilate(thresh, None, iterations=2)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    bboxes = []
    for c in contours:
        area = cv2.contourArea(c)
        if area >= min_area:
            x, y, w, h = cv2.boundingRect(c)
            bboxes.append({"x": int(x), "y": int(y), "w": int(w), "h": int(h), "area": int(area)})

    # Sort by area descending
    bboxes.sort(key=lambda b: b["area"], reverse=True)
    return bboxes


def create_diff_image(
    img1: np.ndarray,
    img2: np.ndarray,
    bboxes: list[dict] | None = None,
    mask: np.ndarray | None = None,
) -> np.ndarray:
    """
    Create a visual diff/heatmap image with bounding boxes.

    Args:
        img1: Reference image
        img2: Test image
        bboxes: Bounding boxes to draw
        mask: Regions to mark as ignored (gray)

    Returns:
        Diff image with heatmap and bounding boxes
    """
    diff = cv2.absdiff(img1, img2)
    gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)

    # Apply colormap for better visualization
    heatmap = cv2.applyColorMap(gray_diff * 3, cv2.COLORMAP_JET)

    # Blend with original for context
    blended = cv2.addWeighted(img1, 0.5, heatmap, 0.5, 0)

    # Draw bounding boxes
    if bboxes:
        for bbox in bboxes:
            x, y, w, h = bbox["x"], bbox["y"], bbox["w"], bbox["h"]
            cv2.rectangle(blended, (x, y), (x + w, y + h), (0, 0, 255), 2)

    # Mark masked regions as gray
    if mask is not None:
        blended = apply_mask_to_diff(blended, mask)

    return blended


def compute_final_verdict(metrics: dict, preset: str = "normal") -> dict:
    """
    Decision rule: ANY-FAIL on ALL main metrics (original + layered).

    Main metrics (any failure = REVIEW):
    - Original: SSIM, pixel_diff_pct, delta_e_mean
    - Layered: layout_similarity, regional_color_diff, text_similarity, spacing_match

    Secondary metrics (informative, don't block):
    - MS-SSIM, PSNR → reported but don't block
    - pHash → triage only

    Returns dict with:
    - status: "PASS" or "REVIEW"
    - actions: List of actionable suggestions for fixing issues
    - failed_metrics: Names of metrics that failed
    """
    failed_metrics = []
    actions = []

    # Check ALL metrics with is_main=True
    for metric_name, m in metrics.items():
        if m.get("is_main", False) and not m.get("pass", True):
            failed_metrics.append(metric_name)
            # Collect action_if_fail for actionable feedback
            action = m.get("action_if_fail")
            if action:
                actions.append(action)

    all_pass = len(failed_metrics) == 0

    return {
        "status": "PASS" if all_pass else "REVIEW",
        "failed_metrics": failed_metrics,
        "failed_count": len(failed_metrics),
        "actions": actions,  # Actionable suggestions for fixing issues
        "decision_rule": "any_fail_on_main_metrics",
        "main_metrics_checked": [name for name, m in metrics.items() if m.get("is_main")],
        "secondary_metrics": SECONDARY_METRICS,
        "heuristics": HEURISTICS,
    }


def compare_images(
    reference_path: str,
    test_path: str,
    preset: str = "normal",
    thresholds: dict | None = None,
    diff_output: str | None = None,
    ignore_regions: list[dict] | None = None,
    auto_align: bool = False,
    html_report: str | None = None,
) -> dict:
    """
    Compare two images and return metrics.

    Args:
        reference_path: Path to reference image (e.g., Figma export)
        test_path: Path to test image (e.g., browser screenshot)
        preset: Threshold preset (strict/normal/loose)
        thresholds: Custom threshold overrides
        diff_output: Path to save diff image
        ignore_regions: Regions to ignore in comparison
        auto_align: Whether to auto-align images
        html_report: Path to save HTML report

    Returns:
        dict with metrics, status, and metadata
    """
    # Use preset thresholds with custom overrides
    effective_thresholds = THRESHOLDS[preset].copy()
    if thresholds:
        effective_thresholds.update(thresholds)

    # Validate files
    valid, msg = validate_file(reference_path)
    if not valid:
        return {"error": msg, "status": "ERROR"}

    valid, msg = validate_file(test_path)
    if not valid:
        return {"error": msg, "status": "ERROR"}

    try:
        # Phase 0: Normalization
        ref_img, ref_meta = normalize_image(reference_path)
        ref_size = (ref_img.shape[1], ref_img.shape[0])

        test_img, test_meta = normalize_image(test_path, target_size=ref_size)

        # Phase 0.5: Apply light blur to tolerate antialiasing (AUTOMATIC)
        ref_img = apply_blur_preprocessing(ref_img, sigma=0.5)
        test_img = apply_blur_preprocessing(test_img, sigma=0.5)
        ref_meta["blur_applied"] = True
        test_meta["blur_applied"] = True

        # Quick triage with pHash (heuristic only)
        phash_result = compute_phash(reference_path, test_path)

        # Auto-alignment (with safety gates)
        alignment_result: AlignmentResult = {
            "aligned": False,
            "reason": "not_requested",
            "offset_applied": None,
            "warning": None,
        }
        if auto_align:
            test_img, alignment_result = align_images_ecc(
                ref_img, test_img, preset=preset
            )

        # Create mask from ignore_regions and auto-detect dynamic regions
        mask = None
        dynamic_regions_detected = []

        if ignore_regions:
            mask = create_mask(ref_img.shape, ignore_regions)

        # AUTOMATIC: Detect and mask dynamic content (timestamps, IDs, dates)
        mask, dynamic_regions_detected = combine_dynamic_masks(
            ref_img, test_img, existing_mask=mask
        )

        # Compute main metrics
        ssim_score = compute_ssim(ref_img, test_img, mask)
        pixel_diff = compute_pixel_diff(ref_img, test_img, mask=mask)
        delta_e = compute_delta_e(ref_img, test_img, mask)

        # Compute secondary metrics
        psnr_value = compute_psnr(ref_img, test_img)
        msssim_score = compute_msssim(ref_img, test_img)

        # Compute layered metrics (MAIN - influence verdict)
        layout_result = compute_layout_similarity(ref_img, test_img, mask)
        color_result = compute_regional_color_diff(ref_img, test_img, mask=mask)
        text_result = compute_text_similarity(ref_img, test_img, mask)
        spacing_result = compute_spacing_similarity(ref_img, test_img, mask)

        # Find diff regions for bounding boxes
        bboxes = find_diff_contours(ref_img, test_img)

        # Build metrics dict
        metrics: dict[str, MetricResult] = {
            "ssim": {
                "value": round(ssim_score, 4),
                "threshold": effective_thresholds["ssim"],
                "pass": ssim_score >= effective_thresholds["ssim"],
                "is_main": True,
            },
            "pixel_diff_pct": {
                "value": round(pixel_diff, 2),
                "threshold": effective_thresholds["pixel_diff_pct"],
                "pass": pixel_diff <= effective_thresholds["pixel_diff_pct"],
                "is_main": True,
                "unit": "%",
            },
            "psnr_db": {
                "value": round(psnr_value, 2),
                "threshold": effective_thresholds["psnr_db"],
                "pass": psnr_value >= effective_thresholds["psnr_db"],
                "is_main": False,
                "unit": "dB",
            },
        }

        # Add ΔE if available
        if delta_e is not None:
            metrics["delta_e_mean"] = {
                "value": round(delta_e, 2),
                "threshold": effective_thresholds["delta_e_mean"],
                "pass": delta_e <= effective_thresholds["delta_e_mean"],
                "is_main": True,
                "unit": "ΔE2000",
            }

        # Add MS-SSIM if available
        if msssim_score is not None:
            metrics["msssim"] = {
                "value": round(msssim_score, 4),
                "threshold": effective_thresholds.get("msssim"),
                "pass": msssim_score >= effective_thresholds.get("msssim", 0),
                "is_main": False,
            }

        # Add layered metrics (MAIN - these influence the verdict)
        metrics["layout_similarity"] = layout_result
        metrics["regional_color_diff"] = color_result
        if text_result.get("value") is not None:
            metrics["text_similarity"] = text_result
        metrics["spacing_match"] = spacing_result

        # Compute verdict
        verdict = compute_final_verdict(metrics, preset)

        # Generate smart warnings based on metric combinations
        smart_warnings = generate_smart_warnings(ssim_score, phash_result)

        # Generate diff image if requested
        if diff_output:
            diff_img = create_diff_image(ref_img, test_img, bboxes, mask)
            cv2.imwrite(diff_output, diff_img)

        # Build result
        result = {
            "status": verdict["status"],
            "preset": preset,
            # Actionable feedback - TOP LEVEL for easy access
            "actions": verdict.get("actions", []),
            "failed_count": verdict.get("failed_count", 0),
            "metrics": metrics,
            "verdict": verdict,
            "reference": {
                "path": reference_path,
                "size": ref_meta["final_size"],
                "normalization": ref_meta,
            },
            "test": {
                "path": test_path,
                "size": test_meta["final_size"],
                "normalization": test_meta,
            },
            "diff_regions": bboxes[:10] if bboxes else [],  # Top 10 regions
            "diff_output": diff_output,
            "alignment": alignment_result,
        }

        # Add pHash heuristic if available
        if phash_result:
            result["phash_heuristic"] = phash_result

        # Add smart warnings
        if smart_warnings:
            result["warnings"] = smart_warnings

        # Add ignore regions info
        if ignore_regions:
            result["ignored_regions"] = {
                "count": len(ignore_regions),
                "regions": ignore_regions,
                "pixels_ignored": int((~mask).sum()) if mask is not None else 0,
            }

        # Add auto-detected dynamic regions (AUTOMATIC)
        if dynamic_regions_detected:
            result["auto_masked_dynamic"] = {
                "count": len(dynamic_regions_detected),
                "regions": dynamic_regions_detected,
                "note": "Timestamps, IDs, e datas foram automaticamente ignorados",
            }

        # Generate HTML report if requested
        if html_report:
            generate_html_report(result, ref_img, test_img, html_report, diff_output)
            result["html_report"] = html_report

        return result

    except Exception as e:
        return {"error": str(e), "status": "ERROR"}


def generate_html_report(
    result: dict,
    ref_img: np.ndarray,
    test_img: np.ndarray,
    output_path: str,
    diff_path: str | None = None,
) -> None:
    """Generate interactive HTML report for visual comparison."""
    import base64

    def img_to_base64(img: np.ndarray) -> str:
        _, buffer = cv2.imencode(".png", img)
        return base64.b64encode(buffer).decode("utf-8")

    ref_b64 = img_to_base64(ref_img)
    test_b64 = img_to_base64(test_img)

    diff_b64 = ""
    if diff_path and os.path.exists(diff_path):
        diff_img = cv2.imread(diff_path)
        if diff_img is not None:
            diff_b64 = img_to_base64(diff_img)

    status = result["status"]
    status_class = "pass" if status == "PASS" else "fail"
    status_emoji = "✅" if status == "PASS" else "⚠️"

    metrics_html = ""
    for name, m in result["metrics"].items():
        m_class = "pass" if m["pass"] else "fail"
        main_badge = ' <span class="badge main">MAIN</span>' if m.get("is_main") else ""
        unit = m.get("unit", "")
        metrics_html += f"""
        <div class="metric {m_class}">
            <strong>{name}</strong>{main_badge}<br>
            Value: {m['value']}{unit}<br>
            Threshold: {m['threshold']}{unit}<br>
            Status: {"✓ PASS" if m['pass'] else "✗ FAIL"}
        </div>
        """

    # Diff regions table
    regions_html = ""
    if result.get("diff_regions"):
        regions_html = "<h3>Diff Regions (Top 10)</h3><table><tr><th>X</th><th>Y</th><th>W</th><th>H</th><th>Area</th></tr>"
        for r in result["diff_regions"][:10]:
            regions_html += f"<tr><td>{r['x']}</td><td>{r['y']}</td><td>{r['w']}</td><td>{r['h']}</td><td>{r['area']}px²</td></tr>"
        regions_html += "</table>"

    # Alignment info
    alignment_html = ""
    if result.get("alignment", {}).get("aligned"):
        offset = result["alignment"]["offset_applied"]
        alignment_html = f"""
        <div class="warning">
            ⚠️ Auto-alignment applied: X={offset['x']}px, Y={offset['y']}px
        </div>
        """

    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Comparison Report - {status}</title>
    <style>
        * {{ box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }}
        h1 {{ margin: 0 0 20px; }}
        .status {{ display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; }}
        .status.pass {{ background: #d4edda; color: #155724; }}
        .status.fail {{ background: #f8d7da; color: #721c24; }}
        .comparison {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }}
        .image-container {{
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .image-container h3 {{ margin: 0 0 10px; }}
        .image-container img {{
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
        }}
        .metrics {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }}
        .metric {{
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid;
        }}
        .metric.pass {{ border-color: #28a745; }}
        .metric.fail {{ border-color: #dc3545; }}
        .badge {{
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.75em;
            margin-left: 5px;
        }}
        .badge.main {{ background: #007bff; color: white; }}
        table {{
            width: 100%;
            border-collapse: collapse;
            background: white;
            margin: 10px 0;
        }}
        th, td {{
            padding: 8px 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{ background: #f8f9fa; }}
        .warning {{
            background: #fff3cd;
            color: #856404;
            padding: 10px 15px;
            border-radius: 4px;
            margin: 15px 0;
        }}
        .meta {{
            color: #666;
            font-size: 0.9em;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <h1>{status_emoji} Visual Comparison Report <span class="status {status_class}">{status}</span></h1>

    <p><strong>Preset:</strong> {result['preset']} | <strong>Decision Rule:</strong> {result['verdict']['decision_rule']}</p>

    {alignment_html}

    <h2>Metrics</h2>
    <div class="metrics">
        {metrics_html}
    </div>

    <h2>Images</h2>
    <div class="comparison">
        <div class="image-container">
            <h3>Reference (Figma)</h3>
            <img src="data:image/png;base64,{ref_b64}" alt="Reference">
            <p class="meta">Size: {result['reference']['size']}</p>
        </div>
        <div class="image-container">
            <h3>Test (Browser)</h3>
            <img src="data:image/png;base64,{test_b64}" alt="Test">
            <p class="meta">Size: {result['test']['size']}</p>
        </div>
        {f'''<div class="image-container">
            <h3>Diff Heatmap</h3>
            <img src="data:image/png;base64,{diff_b64}" alt="Diff">
        </div>''' if diff_b64 else ''}
    </div>

    {regions_html}

    <div class="meta">
        <p>Generated: {datetime.now().isoformat()}</p>
        <p>Reference: {result['reference']['path']}</p>
        <p>Test: {result['test']['path']}</p>
    </div>
</body>
</html>
"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)


def main():
    parser = argparse.ArgumentParser(
        description="Compare two images using perceptual metrics",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("reference", help="Reference image (e.g., Figma export)")
    parser.add_argument("test", help="Test image (e.g., browser screenshot)")
    parser.add_argument(
        "--preset",
        choices=["strict", "normal", "loose"],
        default="strict",  # Changed default to strict per user CONFIG
        help="Threshold preset (default: strict)",
    )
    parser.add_argument("--ssim", type=float, help="Custom SSIM threshold (0-1)")
    parser.add_argument("--psnr", type=float, help="Custom PSNR threshold (dB)")
    parser.add_argument(
        "--pixel-diff", type=float, help="Custom pixel diff threshold (%%)"
    )
    parser.add_argument("--delta-e", type=float, help="Custom ΔE threshold")
    parser.add_argument("--diff-out", help="Output path for diff/heatmap image")
    parser.add_argument("--html-report", help="Output path for HTML report")
    parser.add_argument(
        "--auto-align",
        action="store_true",
        help="Auto-align images before comparison (disabled in strict mode)",
    )
    parser.add_argument(
        "--ignore-regions",
        type=str,
        help='JSON array of regions to ignore: [{"x":0,"y":0,"w":100,"h":30}]',
    )
    parser.add_argument("--quiet", action="store_true", help="Only output JSON")

    args = parser.parse_args()

    # Build custom thresholds from CLI args
    custom_thresholds = {}
    if args.ssim is not None:
        custom_thresholds["ssim"] = args.ssim
    if args.psnr is not None:
        custom_thresholds["psnr_db"] = args.psnr
    if args.pixel_diff is not None:
        custom_thresholds["pixel_diff_pct"] = args.pixel_diff
    if args.delta_e is not None:
        custom_thresholds["delta_e_mean"] = args.delta_e

    # Parse ignore regions
    ignore_regions = None
    if args.ignore_regions:
        try:
            ignore_regions = json.loads(args.ignore_regions)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid ignore-regions JSON: {e}", "status": "ERROR"}))
            sys.exit(2)

    # Run comparison
    result = compare_images(
        args.reference,
        args.test,
        preset=args.preset,
        thresholds=custom_thresholds if custom_thresholds else None,
        diff_output=args.diff_out,
        ignore_regions=ignore_regions,
        auto_align=args.auto_align,
        html_report=args.html_report,
    )

    # Output
    print(json.dumps(result, indent=2))

    # Exit code
    if result["status"] == "PASS":
        sys.exit(0)
    elif result["status"] == "REVIEW":
        sys.exit(1)
    else:
        sys.exit(2)


if __name__ == "__main__":
    main()
