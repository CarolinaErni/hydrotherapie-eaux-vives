
#!/usr/bin/env zsh
set -euo pipefail

# build.sh - robust wrapper for Hugo + post-processing
# Usage:
#   ./build.sh          # run hugo then post-process
#   ./build.sh --skip-hugo  # only run post-processing

SKIP_HUGO=0
if [[ "${1-}" == "--skip-hugo" ]]; then
  SKIP_HUGO=1
fi

# Always resolve repo root as the directory containing this script
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

echo "[i] Working directory: $PWD"
echo "[i] Script location: $REPO_ROOT"

if [[ $SKIP_HUGO -eq 0 ]]; then
  if ! command -v hugo >/dev/null 2>&1; then
    echo "[!] hugo not found in PATH. Install Hugo or run with --skip-hugo to only run post-processing."
    exit 1
  fi
  echo "[i] Running hugo... (from $REPO_ROOT)"
  hugo --minify
  HUGO_EXIT=$?
  echo "[i] Hugo exited with code $HUGO_EXIT"
  if [[ $HUGO_EXIT -ne 0 ]]; then
    echo "[!] Hugo build failed. Aborting post-processing."
    exit $HUGO_EXIT
  fi
else
  echo "[i] Skipping Hugo build (--skip-hugo)"
fi

PUBLIC_INDEX="$REPO_ROOT/public/index.html"
PYTHON_SCRIPT="$REPO_ROOT/tools/pretty_print.py"

if [[ -f "$PUBLIC_INDEX" ]]; then
  if [[ -f "$PYTHON_SCRIPT" ]]; then
    echo "[i] Running post-processing: $PYTHON_SCRIPT $PUBLIC_INDEX"
    python3 "$PYTHON_SCRIPT" "$PUBLIC_INDEX"
    PY_EXIT=$?
    echo "[i] pretty_print.py exited with code $PY_EXIT"
    if [[ $PY_EXIT -ne 0 ]]; then
      echo "[!] pretty_print.py failed."
      exit $PY_EXIT
    fi
  else
    echo "[!] Script $PYTHON_SCRIPT not found!"
    exit 2
  fi
else
  echo "[!] $PUBLIC_INDEX not found; skipping post-processing"
fi

echo "[i] Done."
echo "[i] Done."
