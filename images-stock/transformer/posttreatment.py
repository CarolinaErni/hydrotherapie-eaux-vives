from rembg import remove
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

# Chargement du résultat silueta
input_image = Image.open("3.png")
output_image = remove(input_image, model_name="silueta")

# Conversion en RGBA
output_image = output_image.convert("RGBA")
data = np.array(output_image)

# Amélioration du masque alpha
alpha = data[:, :, 3]

# Lissage léger du masque pour les cheveux
alpha_smooth = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.5))
alpha_smooth = np.array(alpha_smooth)

# Augmentation du contraste de l'alpha
alpha_contrast = np.clip(((alpha_smooth - 128) * 1.3) + 128, 0, 255)

# Application du nouveau masque
data[:, :, 3] = alpha_contrast.astype(np.uint8)

# Réduction des artefacts blancs dans les zones semi-transparentes
semi_transparent = (alpha_contrast > 10) & (alpha_contrast < 245)

for channel in range(3):
    channel_data = data[:, :, channel].astype(np.float32)
    # Réduction progressive des tons clairs
    reduction = np.where(channel_data > 200, (channel_data - 200) * 0.3, 0)
    channel_data[semi_transparent] -= reduction[semi_transparent]
    data[:, :, channel] = np.clip(channel_data, 0, 255).astype(np.uint8)

result = Image.fromarray(data, "RGBA")
result.save("4d.png")
print("Image améliorée sauvée")
