import os
import re
from pathlib import Path

def check_images_in_html():
    """
    Vérifie si tous les fichiers du répertoire 'images' sont référencés dans index.html
    """
    # Chemin vers le répertoire images et le fichier index.html
    images_dir = Path("images")
    html_file = Path("index.html")

    # Vérifier que le répertoire images existe
    if not images_dir.exists():
        print("❌ Le répertoire 'images' n'existe pas")
        return

    # Vérifier que le fichier index.html existe
    if not html_file.exists():
        print("❌ Le fichier 'index.html' n'existe pas")
        return

    # Lister tous les fichiers du répertoire images
    image_files = []
    for file_path in images_dir.iterdir():
        if file_path.is_file():
            image_files.append(file_path.name)

    if not image_files:
        print("ℹ️  Le répertoire 'images' est vide")
        return

    print(f"📁 Fichiers trouvés dans le répertoire 'images': {len(image_files)}")
    for img in sorted(image_files):
        print(f"   - {img}")

    # Lire le contenu du fichier index.html
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except UnicodeDecodeError:
        # Essayer avec un autre encodage si UTF-8 échoue
        with open(html_file, 'r', encoding='latin-1') as f:
            html_content = f.read()

    # Chercher les références aux fichiers images dans le HTML
    # Motifs de recherche pour différents types de références
    patterns = [
        r'src\s*=\s*["\']([^"\']*)',          # src="..." ou src='...'
        r'href\s*=\s*["\']([^"\']*)',         # href="..." ou href='...'
        r'url\s*\(\s*["\']?([^"\')\s]*)',     # url(...) dans le CSS
        r'background\s*:\s*url\s*\(["\']?([^"\')\s]*)'  # background: url(...)
    ]

    referenced_files = set()
    for pattern in patterns:
        matches = re.findall(pattern, html_content, re.IGNORECASE)
        for match in matches:
            # Extraire le nom du fichier du chemin
            filename = os.path.basename(match)
            if filename:
                referenced_files.add(filename)

    print(f"\n🔍 Références trouvées dans index.html: {len(referenced_files)}")
    for ref in sorted(referenced_files):
        print(f"   - {ref}")

    # Vérifier quels fichiers images ne sont pas référencés
    unreferenced_files = []
    for img_file in image_files:
        if img_file not in referenced_files:
            unreferenced_files.append(img_file)

    # Afficher les résultats
    print("\n" + "="*50)
    if unreferenced_files:
        print("⚠️  AVERTISSEMENT: Fichiers images non référencés dans index.html:")
        for file in sorted(unreferenced_files):
            print(f"   ❌ {file}")
    else:
        print("✅ Tous les fichiers du répertoire 'images' sont référencés dans index.html")

    # Optionnel: vérifier les références mortes (fichiers référencés mais inexistants)
    missing_refs = []
    for ref in referenced_files:
        ref_path = images_dir / ref
        if not ref_path.exists() and any(ref.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp']):
            missing_refs.append(ref)

    if missing_refs:
        print("\n⚠️  AVERTISSEMENT: Références vers des fichiers inexistants:")
        for ref in sorted(missing_refs):
            print(f"   ❌ {ref}")

if __name__ == "__main__":
    check_images_in_html()