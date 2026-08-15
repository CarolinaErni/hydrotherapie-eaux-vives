#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
REPOSITORY_DIR=$(cd -- "$SCRIPT_DIR/../.." && pwd)
VIDEO_SOURCE_DIR="$REPOSITORY_DIR/assets/videos/source"
VIDEO_OUTPUT_DIR="$REPOSITORY_DIR/static/videos"
VIDEO_IN="$VIDEO_SOURCE_DIR/GettyImages-1655701480.mp4"
MODE=${1:-warm}

usage() {
    printf 'Usage: %s [warm|web]\n' "$(basename -- "$0")"
    printf '  warm  Apply the warm color treatment.\n'
    printf '  web   Optimize the video for web delivery.\n'
}

if [[ ! -f "$VIDEO_IN" ]]; then
    printf 'Error: video file not found: %s\n' "$VIDEO_IN" >&2
    exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
    printf 'Error: ffmpeg is required.\n' >&2
    exit 1
fi

case "$MODE" in
    warm)
        VIDEO_OUT="$VIDEO_OUTPUT_DIR/GettyImages-1655701480-warm.mp4"
        ffmpeg -y -i "$VIDEO_IN" \
            -vf 'eq=brightness=0.07:saturation=1.4,colorbalance=rs=.4:gs=.15:bs=-.25,hqdn3d=1.5:1.5:6:6' \
            -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p \
            -c:a copy -movflags +faststart \
            "$VIDEO_OUT"
        ;;
    web)
        VIDEO_OUT="$VIDEO_OUTPUT_DIR/GettyImages-1655701480-web.mp4"
        ffmpeg -y -i "$VIDEO_IN" \
            -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
            -an -movflags +faststart \
            "$VIDEO_OUT"
        ;;
    -h|--help)
        usage
        exit 0
        ;;
    *)
        printf 'Error: unknown optimization mode: %s\n' "$MODE" >&2
        usage >&2
        exit 2
        ;;
esac

printf 'Created: %s\n' "$VIDEO_OUT"
