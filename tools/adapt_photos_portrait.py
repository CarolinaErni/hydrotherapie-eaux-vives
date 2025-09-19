#!/usr/bin/env python3
from PIL import Image
import os

try:
    from rembg import remove

    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False
    print(
        "⚠️  rembg n'est pas installé. Pour utiliser la suppression de "
        "background, installez-le avec : pip install rembg"
    )


def crop_square_shifted(image_path, output_path=None, shift_ratio=-0.03):
    """
    Recadre l'image en carré (ratio 1:1) avec un centre horizontal décalé.

    :param image_path: chemin du fichier source
    :param output_path: chemin du fichier destination (par défaut: suffix '_cropped')
    :param shift_ratio: fraction de la largeur pour décaler vers la gauche (0.1 = 10%)
    """
    img = Image.open(image_path)
    w, h = img.size

    # côté du carré = plus petit côté
    side = min(w, h)

    # centre de base
    cx, cy = w // 2, h // 2

    # décalage horizontal
    shift = int(w * shift_ratio)
    cx = cx - shift

    # limites du crop
    left = cx - side // 2
    right = cx + side // 2
    top = cy - side // 2
    bottom = cy + side // 2

    # éviter de sortir de l'image
    if left < 0:
        left, right = 0, side
    elif right > w:
        right, left = w, w - side

    if top < 0:
        top, bottom = 0, side
    elif bottom > h:
        bottom, top = h, h - side

    cropped = img.crop((left, top, right, bottom))

    if output_path is None:
        dirname, filename = os.path.split(image_path)
        edited_dir = os.path.join(dirname, "edited")
        os.makedirs(edited_dir, exist_ok=True)
        output_path = os.path.join(edited_dir, filename)

    cropped.save(output_path)
    print(f"✅ Sauvé : {output_path}")


def crop_square_vertical_symmetric(image_path, output_path=None, width_ratio=0.8):
    """
    Effectue un second crop carré symétrique verticalement.
    Le nouveau cadre est aligné avec le bord supérieur de l'image existante
    et est centré horizontalement.

    :param image_path: chemin du fichier source (résultat du premier crop)
    :param output_path: chemin du fichier destination (par défaut: suffix '_final')
    :param width_ratio: ratio de largeur par rapport à l'image originale (0.8 = 80% de la largeur)
    """
    img = Image.open(image_path)
    w, h = img.size

    # Largeur réduite selon le ratio
    reduced_width = int(w * width_ratio)

    # Pour un résultat carré final, le côté = largeur réduite
    side = reduced_width

    # Centre horizontal (symétrique)
    cx = w // 2

    # Aligné sur le bord supérieur (top = 0)
    top = 0
    bottom = side

    # Centré horizontalement avec la largeur réduite
    left = cx - side // 2
    right = cx + side // 2

    # Vérifier les limites horizontales
    if left < 0:
        left, right = 0, side
    elif right > w:
        right, left = w, w - side

    # Vérifier les limites verticales
    if bottom > h:
        bottom, top = h, h - side

    cropped = img.crop((left, top, right, bottom))

    if output_path is None:
        dirname, filename = os.path.split(image_path)
        name, ext = os.path.splitext(filename)
        output_path = os.path.join(dirname, f"{name}{ext}")

    cropped.save(output_path)
    print(f"✅ Crop final sauvé : {output_path} (largeur réduite à {width_ratio*100}%)")
    return output_path


def remove_background(image_path, output_path=None):
    """
    Enlève le background derrière la personne en utilisant rembg.

    :param image_path: chemin du fichier source
    :param output_path: chemin du fichier destination (par défaut: suffix '_nobg')
    """
    if not REMBG_AVAILABLE:
        print("❌ rembg n'est pas disponible. Installez-le avec : pip install rembg")
        return None

    try:
        # Ouvrir l'image source
        with open(image_path, "rb") as input_file:
            input_data = input_file.read()

        # Supprimer le background
        output_data = remove(input_data)

        if output_path is None:
            dirname, filename = os.path.split(image_path)
            name, ext = os.path.splitext(filename)
            # Utiliser WebP pour préserver la transparence avec meilleure compression
            output_path = os.path.join(dirname, f"{name}_nobg.webp")

        # Convertir les données binaires en Image PIL pour sauvegarder en WebP
        from PIL import Image
        import io

        # Charger l'image depuis les données de rembg
        image = Image.open(io.BytesIO(output_data))

        # Sauvegarder au format WebP avec transparence
        image.save(output_path, format='WEBP', lossless=True, quality=95)

        print(f"✅ Background supprimé : {output_path}")
        return output_path

    except Exception as e:
        print(f"❌ Erreur lors de la suppression du background : {e}")
        return None


if __name__ == "__main__":

    imgs_path = "../stock/images/photographe_christian_bromley-nogit/"

    # Options de traitement
    REMOVE_BACKGROUND = True  # Changer à True pour supprimer le background

    imgs = sorted(
        [
            os.path.join(imgs_path, f)
            for f in os.listdir(imgs_path)
            if f.lower().endswith(".jpg")
        ]
    )

    # imgs = [imgs[0]]

    for img_path in imgs:
        # Premier crop : décalé horizontalement
        crop_square_shifted(img_path)

        # Générer le chemin du fichier intermédiaire
        dirname, filename = os.path.split(img_path)
        edited_dir = os.path.join(dirname, "edited")
        intermediate_path = os.path.join(edited_dir, filename)

        # Deuxième crop : carré symétrique aligné sur le bord supérieur
        final_path = crop_square_vertical_symmetric(intermediate_path)

        # Optionnel : supprimer le background
        if REMOVE_BACKGROUND and final_path:
            remove_background(final_path)
