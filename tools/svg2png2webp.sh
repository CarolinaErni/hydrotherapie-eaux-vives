shopt -s expand_aliases
alias inkscape='/Applications/Inkscape.app/Contents/MacOS/Inkscape'
# shopt -s nullglob

# FNAME_SVG=../static/images/1-1-logo.svg
# FNAME_PNG=../static/images/1-1-logo.png
# FNAME_WEBP=../static/images/1-1-logo.webp
# FNAME_ICO=../static/images/1-1-logo.ico

FNAME_SVG=../static/favicon.svg
FNAME_PNG=../static/favicon.png
FNAME_WEBP=../static/favicon.webp
FNAME_ICO=../static/favicon.ico

inkscape --export-type=png --export-filename=$FNAME_PNG $FNAME_SVG

pngquant                    \
    --strip                 \
    --speed 1               \
    --verbose               \
    --force                 \
    --skip-if-larger        \
    --quality 0-100         \
    10                      \
    --output "$FNAME_PNG"   \
    "$FNAME_PNG"

magick $FNAME_PNG -define icon:auto-resize=16,32,48,256 $FNAME_ICO

magick $FNAME_PNG -define icon:auto-resize=16,32,48,256 $FNAME_WEBP

open -a ImageOptim.app $FNAME_PNG
