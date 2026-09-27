#!/usr/bin/env bash
# Render one motion graphic, plus a still frame to check it.
#
# Usage:
#   tools/graphics/render.sh <Template> <output-file> '<props JSON>' [--opaque]
#
# Examples:
#   tools/graphics/render.sh StatCard videos/2026-10-01-demo/graphics/05-graphic-stat-10x-faster.mov \
#     '{"seconds":3,"value":10,"suffix":"x","label":"faster replies"}'
#   tools/graphics/render.sh CtaCard videos/2026-10-01-demo/graphics/09-graphic-cta.mp4 \
#     '{"seconds":3,"headline":"Want one?","action":"Link in bio","fullscreen":true}' --opaque
#
# Default: transparent ProRes 4444 .mov. --opaque: full-screen H.264 .mp4.
# The check still is saved next to the output as <name>-check.png (middle frame).

set -euo pipefail

[[ $# -ge 3 ]] || { sed -n '2,15p' "$0"; exit 1; }
template="$1" out="$2" props="$3" opaque="${4:-}"

here="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$(dirname "$out")"
out_abs="$(cd "$(dirname "$out")" && pwd)/$(basename "$out")"
still="${out_abs%.*}-check.png"

cd "$here"
# Optional: REMOTION_BROWSER=/path/to/chrome uses an existing browser instead of downloading one.
browser=()
[[ -n "${REMOTION_BROWSER:-}" ]] && browser=(--browser-executable="$REMOTION_BROWSER")

if [[ "$opaque" == "--opaque" ]]; then
  npx remotion render "$template" "$out_abs" --props="$props" ${browser[@]+"${browser[@]}"} \
    --codec=h264 --pixel-format=yuv420p --image-format=jpeg --crf=16
else
  npx remotion render "$template" "$out_abs" --props="$props" ${browser[@]+"${browser[@]}"} --prores-profile=4444
fi

seconds=$(jq -r '.seconds // 3' <<<"$props")
mid=$(awk -v s="$seconds" 'BEGIN { printf "%d", s * 30 / 2 }')
npx remotion still "$template" "$still" --props="$props" --frame="$mid" ${browser[@]+"${browser[@]}"}

echo "Rendered: $out_abs"
echo "Check frame: $still"
