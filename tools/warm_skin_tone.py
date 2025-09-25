import cv2
import numpy as np


def apply_warm_skin_filter(
    image_path, output_path, reference_image_path=None, strength=1.0, warmth=1.0
):
    """Applique une légère chauffe (warm) uniquement sur les zones peau.

    Préserve le canal alpha (transparence) s'il existe et blend le rendu
    pour des transitions douces vers le fond transparent.
    """
    # Charger l'image en conservant le canal alpha si présent
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image is None:
        print(f"[✖] Impossible de charger l'image : {image_path}")
        return

    # Séparer BGR et alpha si besoin
    if image.ndim == 3 and image.shape[2] == 4:
        bgr = image[:, :, :3]
        alpha = image[:, :, 3]
    else:
        bgr = image
        alpha = None

    # Conversion en YCrCb pour détection de peau
    image_ycrcb = cv2.cvtColor(bgr, cv2.COLOR_BGR2YCrCb)

    # Détecter la peau avec un masque YCrCb (gamme courante de tons de peau)
    lower = np.array([0, 133, 77], dtype=np.uint8)
    upper = np.array([255, 173, 127], dtype=np.uint8)
    skin_mask = cv2.inRange(image_ycrcb, lower, upper)

    # Appliquer un flou au masque pour adoucir les bords
    skin_mask = cv2.GaussianBlur(skin_mask, (15, 15), 0)

    # Normaliser le masque en float [0,1] et en 3 canaux pour le blending
    mask_f = skin_mask.astype(np.float32) / 255.0
    mask_3ch = cv2.merge([mask_f, mask_f, mask_f])

    # Si l'image a un canal alpha, éviter toute modification sur les pixels
    # complètement transparents (protéger le fond transparent)
    if alpha is not None:
        alpha_f = alpha.astype(np.float32) / 255.0
        # créer un 3-canaux pour multiplier le masque
        alpha_3ch = cv2.merge([alpha_f, alpha_f, alpha_f])
        # réduire le masque là où alpha est nul (ou presque nul)
        mask_3ch = mask_3ch * alpha_3ch

    # Si une image de référence est fournie, calculer la couleur moyenne de peau
    if reference_image_path:
        ref = cv2.imread(reference_image_path, cv2.IMREAD_UNCHANGED)
        if ref is not None:
            # récupérer BGR (ignorer alpha si présent)
            if ref.ndim == 3 and ref.shape[2] == 4:
                ref_bgr = ref[:, :, :3]
            else:
                ref_bgr = ref
            ref_ycrcb = cv2.cvtColor(ref_bgr, cv2.COLOR_BGR2YCrCb)
            ref_mask = cv2.inRange(ref_ycrcb, lower, upper)
            ref_mask = cv2.GaussianBlur(ref_mask, (15, 15), 0)
            # extraire couleur moyenne de la peau dans la référence
            mask_bool = ref_mask.astype(bool)
            if mask_bool.any():
                mean_ref = cv2.mean(ref_bgr, mask=ref_mask.astype(np.uint8))[
                    :3
                ]  # B,G,R
                mean_ref = np.array(mean_ref, dtype=np.float32)
            else:
                mean_ref = None
        else:
            mean_ref = None
    else:
        mean_ref = None

    # Préparer l'image source en float pour modification
    src = bgr.astype(np.float32)

    if mean_ref is not None:
        # Calculer la couleur moyenne actuelle de la peau dans l'image cible
        tgt_mask = skin_mask
        tgt_mask = cv2.GaussianBlur(tgt_mask, (15, 15), 0)
        tgt_mask_bool = tgt_mask.astype(bool)
        if tgt_mask_bool.any():
            # Utiliser l'espace Lab pour un transfert colorimétrique plus naturel
            # Convertir en uint8 puis Lab (OpenCV opère en uint8 pour cvtColor)
            src_uint8 = src.astype(np.uint8)
            src_lab = cv2.cvtColor(src_uint8, cv2.COLOR_BGR2LAB).astype(np.float32)
            ref_lab = cv2.cvtColor(ref_bgr.astype(np.uint8), cv2.COLOR_BGR2LAB).astype(
                np.float32
            )
            tgt_lab = src_lab

            # Calculer moyennes et écarts-types sur les pixels peau (référence & cible)
            ref_mean, ref_std = cv2.meanStdDev(ref_lab, mask=ref_mask.astype(np.uint8))
            tgt_mean, tgt_std = cv2.meanStdDev(tgt_lab, mask=tgt_mask.astype(np.uint8))
            ref_mean = ref_mean.flatten()
            ref_std = ref_std.flatten()
            tgt_mean = tgt_mean.flatten()
            tgt_std = tgt_std.flatten()

            # Éviter division par zéro
            eps = 1e-6
            tgt_std = np.where(tgt_std < eps, 1.0, tgt_std)

            # Transfert Reinhard-like sur Lab
            transferred_lab = np.empty_like(src_lab)
            for c in range(3):
                transferred_lab[:, :, c] = (src_lab[:, :, c] - tgt_mean[c]) * (
                    ref_std[c] / tgt_std[c]
                ) + ref_mean[c]

            # Clip puis reconvertir vers BGR
            transferred_lab = np.clip(transferred_lab, 0, 255).astype(np.uint8)
            transferred_bgr = cv2.cvtColor(transferred_lab, cv2.COLOR_LAB2BGR).astype(
                np.float32
            )

            # Blend entre source et transferred selon strength
            warm = src * (1.0 - strength) + transferred_bgr * strength

            # Appliquer un renforcement de la chaleur optionnel (post-transfer)
            red_mult = 1.0 + 0.12 * (warmth - 1.0)
            blue_mult = 1.0 - 0.06 * (warmth - 1.0)
            warm[:, :, 2] = np.clip(warm[:, :, 2] * red_mult, 0, 255)
            warm[:, :, 0] = np.clip(warm[:, :, 0] * blue_mult, 0, 255)
            warm = np.clip(warm, 0, 255)
        else:
            warm = src.copy()
    else:
        # Comportement fallback : appliquer un réchauffement contrôlé par `warmth`
        warm = src.copy()
        warm[:, :, 2] = np.clip(
            warm[:, :, 2] * (1.0 + 0.12 * warmth), 0, 255
        )  # Red channel
        warm[:, :, 0] = np.clip(
            warm[:, :, 0] * (1.0 - 0.06 * warmth), 0, 255
        )  # Blue channel
    # --- Subtile teinte cuivrée (copper) appliquée sur les zones peau ---
    # On crée une variante légèrement plus cuivrée et on la blend localement
    # contrôlée par `warmth` et `strength` pour laisser l'effet discret.
    try:
        # Augmenté légèrement pour une teinte cuivrée plus visible
        copper_intensity = 0.12 * float(warmth)
    except Exception:
        copper_intensity = 0.08

    if copper_intensity > 0:
        copper = warm.copy()
        # Renforcer le canal rouge, légèrement augmenter le vert, diminuer le bleu
        copper[:, :, 2] = np.clip(copper[:, :, 2] * (1.0 + copper_intensity), 0, 255)
        copper[:, :, 1] = np.clip(
            copper[:, :, 1] * (1.0 + copper_intensity * 0.6), 0, 255
        )
        copper[:, :, 0] = np.clip(
            copper[:, :, 0] * (1.0 - copper_intensity * 0.4), 0, 255
        )

        # Force de mélange locale: modérée pour ne pas sur-saturer
        copper_blend_factor = 0.6 * copper_intensity * float(strength)
        # créer un masque 3 canaux pour l'application du cuivre
        copper_mask = np.clip(mask_3ch * copper_blend_factor, 0.0, 1.0)

        # Blend cuivre vs warm localement
        warm = warm * (1.0 - copper_mask) + copper * copper_mask

    # Blend : appliquer la correction seulement là où le masque indique de la peau
    result_rgb = (warm * mask_3ch + src * (1.0 - mask_3ch)).astype(np.uint8)

    # Réassembler avec alpha si nécessaire
    if alpha is not None:
        # s'assurer que alpha est de type uint8
        if alpha.dtype != np.uint8:
            alpha = (alpha * 255).astype(np.uint8)
        result = cv2.merge([result_rgb, alpha])
    else:
        result = result_rgb

    # Sauvegarder l'image modifiée en essayant d'abord OpenCV
    ok = cv2.imwrite(output_path, result)
    if ok:
        print(f"[✔] Image sauvegardée : {output_path}")
        return

    # Si cv2.imwrite n'a pas fonctionné (ex: OpenCV compilé sans support WebP alpha),
    # utiliser Pillow comme solution de secours pour garantir la transparence.
    try:
        from PIL import Image

        # Convertir BGRA -> RGBA pour Pillow
        if result.ndim == 3 and result.shape[2] == 4:
            b, g, r, a = cv2.split(result)
            rgba = cv2.merge([r, g, b, a])
            pil_img = Image.fromarray(rgba, mode="RGBA")
        else:
            # BGR -> RGB
            if result.ndim == 3 and result.shape[2] == 3:
                b, g, r = cv2.split(result)
                rgb = cv2.merge([r, g, b])
                pil_img = Image.fromarray(rgb, mode="RGB")
            else:
                # Image en niveaux de gris
                pil_img = Image.fromarray(result)

        # Forcer WebP et garder la transparence (use lossless to preserve quality)
        pil_img.save(output_path, format="WEBP", lossless=True)
        print(f"[✔] Image sauvegardée via Pillow : {output_path}")
    except Exception as e:
        print(f"[✖] Échec lors de la sauvegarde (cv2 + Pillow) : {e}")


# Exemple d'utilisation (valeurs codées en dur)
if __name__ == "__main__":

    INPUTS = [
        "../stock/images/_DSC7498-Modifier_copie.webp",
        "../stock/images/_DSC7504-Modifier_copie.webp",
    ]
    for INPUT in INPUTS:
        OUTPUT = INPUT.replace(".webp", "_warm.webp")
        # Image de référence : None signifie pas de transfert colorimétrique basé sur référence
        REFERENCE = None
        # Paramètres de traitement
        STRENGTH = 1.0
        WARMTH = 1.0

        print(f"[i] INPUT = {INPUT}")
        print(f"[i] OUTPUT = {OUTPUT}")
        print(f"[i] REF = {REFERENCE}")

        apply_warm_skin_filter(
            INPUT,
            OUTPUT,
            reference_image_path=REFERENCE,
            strength=STRENGTH,
            warmth=WARMTH,
        )
