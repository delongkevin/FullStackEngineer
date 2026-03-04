#!/usr/bin/env bash
# Verifies that all expected pages are present in the static build output (out/).
# Run this after `npm run build` to catch missing or broken pages.

set -euo pipefail

OUT_DIR="${1:-out}"

pages=(
  "$OUT_DIR/index.html"
  "$OUT_DIR/about/index.html"
  "$OUT_DIR/contact/index.html"
  "$OUT_DIR/resume/index.html"
  "$OUT_DIR/projects/index.html"
  "$OUT_DIR/projects/1/index.html"
  "$OUT_DIR/projects/2/index.html"
  "$OUT_DIR/projects/3/index.html"
  "$OUT_DIR/projects/4/index.html"
  "$OUT_DIR/projects/5/index.html"
  "$OUT_DIR/projects/6/index.html"
  "$OUT_DIR/projects/7/index.html"
  "$OUT_DIR/projects/8/index.html"
  "$OUT_DIR/projects/blackjack/index.html"
  "$OUT_DIR/projects/circle-clicker/index.html"
  "$OUT_DIR/projects/color-match/index.html"
  "$OUT_DIR/projects/ride-sharing/index.html"
  "$OUT_DIR/projects/tic-tac-toe/index.html"
  "$OUT_DIR/projects/PokerApp/PokerApp.html"
)

echo "Checking that all expected pages exist in the build output ($OUT_DIR)..."
missing=0

for page in "${pages[@]}"; do
  if [ ! -f "$page" ]; then
    echo "MISSING: $page"
    missing=$((missing + 1))
  else
    echo "OK: $page"
  fi
done

if [ "$missing" -gt 0 ]; then
  echo "Page check failed: $missing page(s) missing from build output."
  exit 1
fi

echo "All pages present in build output."
