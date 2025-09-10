rm -rf public

source $HOME/.zshrc
ip >/dev/null 2>&1

PORT="1313"
BASE_URL="http://$IP"
FULL_URL="$BASE_URL:$PORT"
qrencode -t ANSI $FULL_URL
echo -e "\n\n$FULL_URL\n\n"

hugo server             \
    -D                  \
    --gc                \
    --disableFastRender \
    --baseURL=$BASE_URL \
    --bind=$IP          \
    --port=$PORT        \
    --appendPort=true

    # --minify            \