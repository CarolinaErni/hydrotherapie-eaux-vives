#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
IP="$(bash "$SCRIPT_DIR/get_ip_of_default_interface.sh")"

PORT="1313"
BASE_URL="http://$IP"
FULL_URL="$BASE_URL:$PORT"

if command -v qrencode >/dev/null 2>&1; then
    qrencode -t ANSI "$FULL_URL"
fi

printf '\n%s\n\n' "$FULL_URL"

hugo server              \
    --watch              \
    -D                   \
    --gc                 \
    --disableFastRender  \
    --baseURL="$BASE_URL" \
    --bind="$IP"        \
    --port="$PORT"      \
    --appendPort=true
