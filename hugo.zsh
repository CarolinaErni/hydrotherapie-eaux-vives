###
# Usage:
# zsh hugo.zsh        # for http
# zsh hugo.zsh https  # for https
##

rm -rf public

source $HOME/.zshrc
ip >/dev/null 2>&1

MINIFY=false
[[ "$MINIFY" != "true" ]] && unset MINIFY

USE_HTTPS=$([[ "$1" == "https" ]] && echo true || unset USE_HTTPS)
PROTOCOL=http${USE_HTTPS:+s}

PORT="1313"
BASE_URL="$PROTOCOL://$IP"
FULL_URL="$BASE_URL:$PORT"
qrencode -t ANSI $FULL_URL
echo -e "\n\n$FULL_URL\n\n"

hugo server                 \
    -D                      \
    --gc                    \
    --disableFastRender     \
    --baseURL=$BASE_URL     \
    --bind=$IP              \
    --port=$PORT            \
    ${USE_HTTPS:+--tlsAuto} \
    ${MINIFY:+--minify}     \
    --appendPort=true
