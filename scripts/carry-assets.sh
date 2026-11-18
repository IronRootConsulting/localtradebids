#!/usr/bin/env bash
# Keep hashed /assets/* from recent deploys so pages cached by browsers/CDN
# (GitHub Pages serves HTML with max-age=600) never point at a deleted stylesheet or chunk.
# Each deploy publishes /assets-manifest.txt: "<file> <epoch first deployed>".
# This step downloads files the live site still lists (kept for KEEP_SECONDS) and adds them back.
set -euo pipefail
OUT="${1:-.output/public}"
SITE="${SITE_URL:-https://localtradebids.com}"
KEEP_SECONDS="${KEEP_SECONDS:-172800}"   # 48 hours
NOW=$(date +%s)
NEW="$OUT/assets-manifest.txt"
: > "$NEW.tmp"
( cd "$OUT" && find assets -type f | sort ) | while read -r f; do echo "$f $NOW" >> "$NEW.tmp"; done
if curl -fsS --max-time 20 "$SITE/assets-manifest.txt" -o /tmp/prev-manifest.txt; then
  carried=0; failed=0
  while read -r f t; do
    [[ "$f" =~ ^assets/[A-Za-z0-9._/-]+$ ]] || continue
    [[ "$t" =~ ^[0-9]+$ ]] || continue
    (( NOW - t > KEEP_SECONDS )) && continue
    if [[ -e "$OUT/$f" ]]; then
      # same file still built: keep the older first-deployed time out of the list (current wins)
      continue
    fi
    mkdir -p "$OUT/$(dirname "$f")"
    if curl -fsS --compressed --max-time 20 "$SITE/$f" -o "$OUT/$f"; then
      echo "$f $t" >> "$NEW.tmp"; carried=$((carried+1))
    else
      rm -f "$OUT/$f"; failed=$((failed+1))
    fi
  done < /tmp/prev-manifest.txt
  echo "carry-assets: carried $carried older asset files, $failed not found"
else
  echo "carry-assets: no live manifest yet (first deploy with carry-forward)"
fi
sort -u "$NEW.tmp" > "$NEW" && rm -f "$NEW.tmp"
echo "carry-assets: manifest has $(wc -l < "$NEW") files"
