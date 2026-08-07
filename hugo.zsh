###
# Usage:
# zsh hugo.zsh        # for http
# zsh hugo.zsh https  # for https
##

rm -rf public

NETWORK_INTERFACE=$(route -n get default 2>/dev/null | awk '/interface: / {print $2; exit}')
LOCAL_IP=$(ipconfig getifaddr "$NETWORK_INTERFACE" 2>/dev/null)

if [[ -z "$LOCAL_IP" && -n "$NETWORK_INTERFACE" ]]; then
    LOCAL_IP=$(ifconfig "$NETWORK_INTERFACE" 2>/dev/null | awk '/inet / {print $2; exit}')
fi

if [[ -z "$LOCAL_IP" ]]; then
    print -u2 "Impossible de déterminer l’adresse IP locale."
    exit 1
fi

USE_HTTPS=$([[ "$1" == "https" ]] && echo true || unset USE_HTTPS)
PROTOCOL=http${USE_HTTPS:+s}

PORT="1313"
BASE_URL="$PROTOCOL://$LOCAL_IP"
FULL_URL="$BASE_URL:$PORT"
qrencode -t UTF8 "$FULL_URL"
echo -e "\n\n$FULL_URL\n\n"

hugo server                 \
    -D                      \
    --gc                    \
    --disableFastRender     \
    --baseURL="$BASE_URL"   \
    --bind="$LOCAL_IP"      \
    --port="$PORT"          \
    ${USE_HTTPS:+--tlsAuto} \
    --appendPort=true
