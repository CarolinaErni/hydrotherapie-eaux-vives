#!/usr/bin/env python3
import subprocess
import pathlib

IMG_DIR = pathlib.Path("../static/images")
to_delete = []


def get_width(img_path: pathlib.Path) -> int:
    """Retourne la largeur de l'image avec gm identify"""
    try:
        result = subprocess.run(
            ["gm", "identify", "-format", "%w", str(img_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        return int(result.stdout.strip())
    except Exception:
        return -1


def convert_to_webp(img_path: pathlib.Path):
    """Convertit l'image en WebP lossless largeur 1000px"""
    out_path = img_path.with_suffix(".webp")
    try:
        subprocess.run(
            [
                "gm",
                "convert",
                str(img_path),
                "-resize",
                "1000",
                "+profile",
                "*",
                "-define",
                "webp:lossless=true",
                "-define",
                "webp:method=6",
                str(out_path),
            ],
            check=True,
        )
        print(f"✔ {img_path} → {out_path}")
        return out_path
    except subprocess.CalledProcessError:
        print(f"✘ Erreur conversion : {img_path}")
        return None


def main():
    for img_path in IMG_DIR.glob("*"):
        if img_path.suffix.lower() not in [".png", ".jpg", ".jpeg", ".webp"]:
            continue

        if img_path.suffix.lower() == ".webp":
            width = get_width(img_path)
            if width == 1000:
                print(f"↪ {img_path} déjà en webp 1000px → ignoré")
                continue

        out_path = convert_to_webp(img_path)
        if out_path and img_path.suffix.lower() != ".webp":
            to_delete.append(img_path)

    if to_delete:
        print("\nLes fichiers suivants peuvent être supprimés après conversion :")
        for f in to_delete:
            print(f"  {f}")
    else:
        print("\nAucun fichier source à supprimer.")


if __name__ == "__main__":
    main()
