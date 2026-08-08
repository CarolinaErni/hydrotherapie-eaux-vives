#!/usr/bin/env bash

set -euo pipefail

os_name="$(uname -s 2>/dev/null || printf '%s' 'unknown')"

case "$os_name" in
    Darwin)
        default_interface="$(route -n get 0.0.0.0 2>/dev/null | awk '/interface: / {print $2}' || true)"
        ip_address="$(ipconfig getifaddr "$default_interface" 2>/dev/null || true)"
        ;;
    Linux)
        ip_address="$(hostname -I 2>/dev/null | awk '{print $1}')"
        ;;
    CYGWIN*|MINGW*|MSYS*)
        ip_address="$(ipconfig.exe 2>/dev/null | awk -F': ' '/IPv4 Address|Adresse IPv4/ {print $2; exit}' | tr -d '\r')"
        ;;
    *)
        ip_address=""
        ;;
esac

printf '%s\n' "${ip_address:-127.0.0.1}"
