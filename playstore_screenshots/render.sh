#!/usr/bin/env bash
# Renders the Play Store frames from src/*.html to 1080x1920 PNGs.
set -euo pipefail
cd "$(dirname "$0")"

declare -A OUT=(
  [f1-brand]=01-brand
  [f2-picture]=02-pick-a-picture
  [f3-song]=03-pick-the-song
  [f4-trim]=04-choose-the-moment
  [f5-share]=05-ready-to-share
  [f6-steps]=06-three-taps
)

for src in "${!OUT[@]}"; do
  google-chrome --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1080,1920 --force-device-scale-factor=1 \
    --screenshot="${OUT[$src]}.png" "file://$PWD/src/$src.html" 2>/dev/null
  echo "rendered ${OUT[$src]}.png"
done

# Feature-graphic cover — its own 1024x500 aspect (Play Store feature graphic).
google-chrome --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1024,500 --force-device-scale-factor=1 \
  --screenshot="00-cover.png" "file://$PWD/src/cover.html" 2>/dev/null
echo "rendered 00-cover.png"
