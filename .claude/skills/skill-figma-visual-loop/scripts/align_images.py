#!/usr/bin/env python3
"""
Alinhamento inteligente de imagens Figma vs Browser.
Lida com proporções diferentes usando template matching e feature matching.
"""

import argparse
import base64
import json
import sys
from pathlib import Path
from typing import Optional, Tuple, Dict, Any

import cv2
import numpy as np

try:
    import imagehash
    from PIL import Image
    IMAGEHASH_AVAILABLE = True
except ImportError:
    IMAGEHASH_AVAILABLE = False


def save_base64_image(data_uri: str, output_path: str) -> str:
    """Salva imagem base64 (data URI) como arquivo PNG."""
    if ';base64,' in data_uri:
        _, b64_data = data_uri.split(';base64,')
    else:
        b64_data = data_uri

    image_bytes = base64.b64decode(b64_data)
    Path(output_path).write_bytes(image_bytes)
    return output_path


def quick_phash_check(img1_path: str, img2_path: str) -> Dict[str, Any]:
    """Pré-triagem rápida com perceptual hash."""
    if not IMAGEHASH_AVAILABLE:
        return {"distance": None, "action": "proceed", "error": "imagehash not installed"}

    hash1 = imagehash.phash(Image.open(img1_path))
    hash2 = imagehash.phash(Image.open(img2_path))
    distance = hash1 - hash2

    if distance <= 5:
        interpretation = "muito_similar"
        action = "proceed"
    elif distance <= 15:
        interpretation = "similar"
        action = "proceed"
    elif distance <= 25:
        interpretation = "diferente"
        action = "proceed_with_caution"
    else:
        interpretation = "muito_diferente"
        action = "escalate"

    return {
        "distance": int(distance),
        "interpretation": interpretation,
        "action": action
    }


def find_matching_region(
    large_img: np.ndarray,
    template: np.ndarray,
    scales: np.ndarray = None
) -> Optional[Tuple[int, int, int, int, float]]:
    """
    Multi-scale template matching.
    Encontra a região do template dentro da imagem maior.

    Returns:
        (x, y, w, h, confidence) ou None se não encontrar.
    """
    if scales is None:
        scales = np.linspace(0.5, 1.5, 30)

    gray_large = cv2.cvtColor(large_img, cv2.COLOR_BGR2GRAY)
    gray_template = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)

    best = {"val": -1, "loc": None, "scale": 1.0, "size": None}

    for scale in scales:
        resized = cv2.resize(gray_template, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)

        if resized.shape[0] > gray_large.shape[0] or resized.shape[1] > gray_large.shape[1]:
            continue

        result = cv2.matchTemplate(gray_large, resized, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, max_loc = cv2.minMaxLoc(result)

        if max_val > best["val"]:
            best = {"val": max_val, "loc": max_loc, "scale": scale, "size": resized.shape[::-1]}

    if best["val"] > 0.5:  # threshold mínimo de confiança
        x, y = best["loc"]
        w, h = best["size"]
        return (x, y, w, h, best["val"])

    return None


def align_with_features(
    reference: np.ndarray,
    target: np.ndarray,
    min_matches: int = 10
) -> Tuple[Optional[np.ndarray], Dict[str, Any]]:
    """
    Alinha usando ORB + homografia.

    Returns:
        (imagem_alinhada, metadata)
    """
    ref_gray = cv2.cvtColor(reference, cv2.COLOR_BGR2GRAY)
    tgt_gray = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)

    orb = cv2.ORB_create(nfeatures=5000)
    kp1, des1 = orb.detectAndCompute(ref_gray, None)
    kp2, des2 = orb.detectAndCompute(tgt_gray, None)

    if des1 is None or des2 is None:
        return None, {"error": "Nenhum feature detectado"}

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)

    try:
        matches = bf.knnMatch(des1, des2, k=2)
    except cv2.error:
        return None, {"error": "Falha no matching"}

    # Lowe's ratio test
    good = []
    for match in matches:
        if len(match) == 2:
            m, n = match
            if m.distance < 0.75 * n.distance:
                good.append(m)

    if len(good) < min_matches:
        return None, {"error": f"Poucas correspondências: {len(good)}/{min_matches}"}

    src_pts = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)

    H, mask = cv2.findHomography(dst_pts, src_pts, cv2.RANSAC, 5.0)

    if H is None:
        return None, {"error": "Falha ao calcular homografia"}

    aligned = cv2.warpPerspective(target, H, (reference.shape[1], reference.shape[0]))

    return aligned, {
        "matches": len(good),
        "inliers": int(mask.sum()) if mask is not None else 0
    }


def auto_align_images(
    figma_img: np.ndarray,
    browser_img: np.ndarray
) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
    """
    Auto-alinha imagens de tamanhos/proporções diferentes.

    Estratégia:
    1. Se tamanhos iguais: não faz nada
    2. Tenta template matching (menor dentro do maior)
    3. Tenta feature matching com homografia
    4. Fallback: resize proporcional

    Returns:
        (figma_alinhada, browser_alinhada, metadata)
    """
    # Verificar se já são iguais
    if figma_img.shape == browser_img.shape:
        return figma_img, browser_img, {"method": "none_needed", "confidence": 1.0}

    figma_pixels = figma_img.shape[0] * figma_img.shape[1]
    browser_pixels = browser_img.shape[0] * browser_img.shape[1]

    # Estratégia 1: Template matching (menor dentro do maior)
    if figma_pixels > browser_pixels * 1.2:  # Figma é significativamente maior
        match = find_matching_region(figma_img, browser_img)
        if match:
            x, y, w, h, conf = match
            # Recortar região do Figma que corresponde ao browser
            cropped_figma = figma_img[y:y+h, x:x+w]
            # Redimensionar browser para o tamanho exato
            resized_browser = cv2.resize(browser_img, (w, h), interpolation=cv2.INTER_LANCZOS4)
            return cropped_figma, resized_browser, {
                "method": "template_matching",
                "confidence": float(conf),
                "region": {"x": x, "y": y, "w": w, "h": h},
                "source_cropped": "figma"
            }

    elif browser_pixels > figma_pixels * 1.2:  # Browser é significativamente maior
        match = find_matching_region(browser_img, figma_img)
        if match:
            x, y, w, h, conf = match
            # Recortar região do browser que corresponde ao Figma
            cropped_browser = browser_img[y:y+h, x:x+w]
            # Redimensionar Figma para o tamanho exato
            resized_figma = cv2.resize(figma_img, (w, h), interpolation=cv2.INTER_LANCZOS4)
            return resized_figma, cropped_browser, {
                "method": "template_matching",
                "confidence": float(conf),
                "region": {"x": x, "y": y, "w": w, "h": h},
                "source_cropped": "browser"
            }

    # Estratégia 2: Feature matching com homografia
    # Usar a maior como referência
    if figma_pixels >= browser_pixels:
        aligned, feat_meta = align_with_features(figma_img, browser_img)
        if aligned is not None:
            return figma_img, aligned, {"method": "feature_matching", **feat_meta}
    else:
        aligned, feat_meta = align_with_features(browser_img, figma_img)
        if aligned is not None:
            return aligned, browser_img, {"method": "feature_matching", **feat_meta}

    # Estratégia 3: Resize proporcional para o menor tamanho
    target_h = min(figma_img.shape[0], browser_img.shape[0])
    target_w = min(figma_img.shape[1], browser_img.shape[1])

    # Manter aspect ratio - usar o menor fator de escala
    figma_scale = min(target_w / figma_img.shape[1], target_h / figma_img.shape[0])
    browser_scale = min(target_w / browser_img.shape[1], target_h / browser_img.shape[0])

    new_figma_w = int(figma_img.shape[1] * figma_scale)
    new_figma_h = int(figma_img.shape[0] * figma_scale)
    new_browser_w = int(browser_img.shape[1] * browser_scale)
    new_browser_h = int(browser_img.shape[0] * browser_scale)

    resized_figma = cv2.resize(figma_img, (new_figma_w, new_figma_h), interpolation=cv2.INTER_LANCZOS4)
    resized_browser = cv2.resize(browser_img, (new_browser_w, new_browser_h), interpolation=cv2.INTER_LANCZOS4)

    # Garantir mesmo tamanho (preencher com preto se necessário)
    final_h = min(resized_figma.shape[0], resized_browser.shape[0])
    final_w = min(resized_figma.shape[1], resized_browser.shape[1])

    final_figma = resized_figma[:final_h, :final_w]
    final_browser = resized_browser[:final_h, :final_w]

    return final_figma, final_browser, {
        "method": "resize_fallback",
        "confidence": 0.5,
        "warning": "Imagens têm proporções muito diferentes"
    }


def main():
    parser = argparse.ArgumentParser(
        description="Alinha imagens Figma e Browser para comparação visual"
    )
    parser.add_argument("figma", help="Caminho da imagem do Figma")
    parser.add_argument("browser", help="Caminho da imagem do Browser")
    parser.add_argument(
        "--output-dir", "-o",
        default=".claude/images",
        help="Diretório para salvar imagens alinhadas"
    )
    parser.add_argument(
        "--figma-out",
        help="Nome do arquivo de saída para Figma alinhado (default: aligned_figma.png)"
    )
    parser.add_argument(
        "--browser-out",
        help="Nome do arquivo de saída para Browser alinhado (default: aligned_browser.png)"
    )
    parser.add_argument(
        "--json", "-j",
        action="store_true",
        help="Saída em formato JSON"
    )

    args = parser.parse_args()

    # Carregar imagens
    figma_img = cv2.imread(args.figma)
    browser_img = cv2.imread(args.browser)

    if figma_img is None:
        result = {"error": f"Falha ao carregar: {args.figma}"}
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"ERRO: {result['error']}", file=sys.stderr)
        sys.exit(1)

    if browser_img is None:
        result = {"error": f"Falha ao carregar: {args.browser}"}
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"ERRO: {result['error']}", file=sys.stderr)
        sys.exit(1)

    # Pré-triagem com pHash
    phash_result = quick_phash_check(args.figma, args.browser)

    # Auto-alinhar
    aligned_figma, aligned_browser, align_meta = auto_align_images(figma_img, browser_img)

    # Criar diretório de saída
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Nomes dos arquivos de saída
    figma_out = args.figma_out or "aligned_figma.png"
    browser_out = args.browser_out or "aligned_browser.png"

    aligned_figma_path = str(output_dir / figma_out)
    aligned_browser_path = str(output_dir / browser_out)

    # Salvar
    cv2.imwrite(aligned_figma_path, aligned_figma)
    cv2.imwrite(aligned_browser_path, aligned_browser)

    result = {
        "status": "success",
        "original": {
            "figma": {
                "path": args.figma,
                "size": f"{figma_img.shape[1]}x{figma_img.shape[0]}"
            },
            "browser": {
                "path": args.browser,
                "size": f"{browser_img.shape[1]}x{browser_img.shape[0]}"
            }
        },
        "aligned": {
            "figma": {
                "path": aligned_figma_path,
                "size": f"{aligned_figma.shape[1]}x{aligned_figma.shape[0]}"
            },
            "browser": {
                "path": aligned_browser_path,
                "size": f"{aligned_browser.shape[1]}x{aligned_browser.shape[0]}"
            }
        },
        "alignment": align_meta,
        "phash_triage": phash_result
    }

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print("=== ALINHAMENTO CONCLUÍDO ===")
        print(f"Método: {align_meta.get('method', 'unknown')}")
        print(f"Confiança: {align_meta.get('confidence', 'N/A')}")
        print("")
        print("Original:")
        print(f"  Figma: {result['original']['figma']['size']}")
        print(f"  Browser: {result['original']['browser']['size']}")
        print("")
        print("Alinhado:")
        print(f"  Figma: {aligned_figma_path} ({result['aligned']['figma']['size']})")
        print(f"  Browser: {aligned_browser_path} ({result['aligned']['browser']['size']})")
        print("")
        print(f"pHash: distance={phash_result.get('distance', 'N/A')}, {phash_result.get('interpretation', 'N/A')}")

    sys.exit(0)


if __name__ == "__main__":
    main()
