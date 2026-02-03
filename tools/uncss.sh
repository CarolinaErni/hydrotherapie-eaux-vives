
HTMLFILE=../public/index.html
CSSFILE=../static/style.css
UNCSSFILE=style_uncss.css

check_no_git_change() {
    # Ensure CSSFILE is staged or has no local unstaged modifications
    if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        # is CSSFILE staged?
        if git diff --name-only --staged | grep -q "$(basename "$CSSFILE")"; then
            echo "[uncss] $CSSFILE is staged — proceeding."
            return 0
        else
            # if not staged, check if it has unstaged modifications
            if git diff --name-only -- "$CSSFILE" | grep -q .; then
                echo "[uncss] ERROR: $CSSFILE has unstaged modifications. Please stage or discard them before running this script." >&2
                return 1
            else
                echo "[uncss] $CSSFILE has no unstaged changes — proceeding."
                return 0
            fi
        fi
    else
        echo "[uncss] Not a git repository. Exiting to avoid accidental overwrite." >&2
        return 1
    fi
}

# Run the check and exit on failure
check_no_git_change || exit 1

uncss $HTMLFILE -s $CSSFILE > $UNCSSFILE

mv $UNCSSFILE $CSSFILE
