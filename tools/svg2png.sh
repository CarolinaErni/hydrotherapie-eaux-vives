shopt -s expand_aliases
alias inkscape='/Applications/Inkscape.app/Contents/MacOS/Inkscape'
FNAME_IN=../static/favicon.svg
FNAME_OUT=../static/favicon.png
inkscape --export-type=png --export-filename=$FNAME_OUT $FNAME_IN

FNAME_IN=$FNAME_OUT
FNAME_OUT=../static/favicon.ico
magick $FNAME_IN -define icon:auto-resize=16,32,48,256 $FNAME_OUT
