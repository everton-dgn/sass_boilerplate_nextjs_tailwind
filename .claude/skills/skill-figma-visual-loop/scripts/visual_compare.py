#!/usr/bin/env python3
"""
Visual Compare - Wrapper completo para comparação Figma vs Browser.

Automatiza:
1. Alinhamento inteligente (template matching / feature matching)
2. Redimensionamento se necessário
3. Comparação com métricas
4. Geração de relatório

Uso:
    python visual_compare.py figma.png browser.png [--output-dir DIR]
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

import cv2


def resize_if_needed(img_path: str, max_size: int = 4096) -> str:
    """Redimensiona imagem se exceder max_size."""
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Não foi possível carregar imagem: {img_path}")
    h, w = img.shape[:2]

    if w <= max_size and h <= max_size:
        return img_path

    scale = min(max_size / w, max_size / h)
    new_w = int(w * scale)
    new_h = int(h * scale)

    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

    # Salvar com sufixo _resized
    path = Path(img_path)
    new_path = path.parent / f"{path.stem}_resized{path.suffix}"
    cv2.imwrite(str(new_path), resized)

    return str(new_path)


def main():
    parser = argparse.ArgumentParser(
        description="Comparação visual completa Figma vs Browser"
    )
    parser.add_argument("figma", help="Caminho da imagem do Figma")
    parser.add_argument("browser", help="Caminho da imagem do Browser")
    parser.add_argument(
        "--output-dir", "-o",
        default=".claude/images",
        help="Diretório de saída"
    )
    parser.add_argument(
        "--preset", "-p",
        default="normal",
        choices=["strict", "normal", "loose"],
        help="Preset de comparação"
    )
    parser.add_argument(
        "--skip-align",
        action="store_true",
        help="Pular alinhamento (usar se imagens já estão alinhadas)"
    )

    args = parser.parse_args()

    scripts_dir = Path(__file__).parent
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    figma_path = args.figma
    browser_path = args.browser

    print("=" * 60)
    print("VISUAL COMPARE - Figma vs Browser")
    print("=" * 60)

    # Fase 1: Alinhamento
    if not args.skip_align:
        print("\n📐 Fase 1: Alinhamento...")

        align_result = subprocess.run(
            [
                sys.executable,
                str(scripts_dir / "align_images.py"),
                figma_path,
                browser_path,
                "--output-dir", str(output_dir),
                "--figma-out", "aligned_figma.png",
                "--browser-out", "aligned_browser.png",
                "--json"
            ],
            capture_output=True,
            text=True
        )

        try:
            align_data = json.loads(align_result.stdout or align_result.stderr)
        except json.JSONDecodeError:
            print(f"❌ Erro no alinhamento: {align_result.stderr or align_result.stdout}")
            sys.exit(1)

        if align_result.returncode != 0:
            error_msg = align_data.get("error", "Erro desconhecido")
            print(f"❌ Erro no alinhamento: {error_msg}")
            sys.exit(1)
        print(f"   Método: {align_data['alignment']['method']}")
        print(f"   Confiança: {align_data['alignment'].get('confidence', 'N/A')}")
        print(f"   pHash distance: {align_data['phash_triage']['distance']}")

        figma_path = str(output_dir / "aligned_figma.png")
        browser_path = str(output_dir / "aligned_browser.png")

    # Fase 2: Redimensionar se necessário
    print("\n📏 Fase 2: Verificando tamanho...")

    figma_path = resize_if_needed(figma_path)
    browser_path = resize_if_needed(browser_path)

    img = cv2.imread(figma_path)
    print(f"   Tamanho final: {img.shape[1]}x{img.shape[0]}")

    # Fase 3: Comparação
    print(f"\n📊 Fase 3: Comparação ({args.preset})...")

    compare_result = subprocess.run(
        [
            sys.executable,
            str(scripts_dir / "compare_images.py"),
            figma_path,
            browser_path,
            "--preset", args.preset,
            "--diff-out", str(output_dir / "diff.png"),
            "--html-report", str(output_dir / "report.html")
        ],
        capture_output=True,
        text=True
    )

    # Parse resultado (ignora exit code pois REVIEW retorna 1)
    try:
        compare_data = json.loads(compare_result.stdout or compare_result.stderr)
    except json.JSONDecodeError:
        print(f"❌ Erro na comparação: {compare_result.stderr or compare_result.stdout}")
        sys.exit(1)

    # Fase 4: Resultado
    print("\n" + "=" * 60)
    status = compare_data.get("status", "UNKNOWN")

    if status == "PASS":
        print("✅ RESULTADO: PASS")
    elif status == "REVIEW":
        print("⚠️  RESULTADO: REVIEW")
    else:
        print(f"❌ RESULTADO: {status}")

    print("=" * 60)

    # Métricas
    metrics = compare_data.get("metrics", {})
    print("\n📈 Métricas:")

    for name, data in metrics.items():
        if data.get("is_main"):
            value = data.get("value", "N/A")
            threshold = data.get("threshold", "N/A")
            passed = "✓" if data.get("pass") else "✗"
            unit = data.get("unit", "")
            print(f"   {passed} {name}: {value:.4f}{unit} (threshold: {threshold}{unit})")

    # pHash
    phash = compare_data.get("phash_heuristic", {})
    if phash.get("distance") is not None:
        dist = phash["distance"]
        interp = "muito similar" if dist <= 5 else "similar" if dist <= 15 else "diferente"
        print(f"\n🔗 pHash distance: {dist} ({interp})")

    # Arquivos gerados
    print("\n📁 Arquivos:")
    print(f"   Diff: {output_dir / 'diff.png'}")
    print(f"   Report: {output_dir / 'report.html'}")

    # Regiões com diferença
    regions = compare_data.get("diff_regions", [])
    if regions:
        print(f"\n🔍 Top {min(3, len(regions))} regiões com diferença:")
        for i, r in enumerate(regions[:3]):
            area = r.get("area", 0)
            print(f"   {i+1}. ({r['x']}, {r['y']}) {r['w']}x{r['h']} - {area:,} pixels")

    print()

    # Exit code baseado no status
    sys.exit(0 if status == "PASS" else 1)


if __name__ == "__main__":
    main()
