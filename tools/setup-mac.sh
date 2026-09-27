#!/usr/bin/env bash
# One-time Mac setup for the studio. Safe to run again — it skips anything already done.
# Run from anywhere:  bash ~/Movies/Studio/tools/setup-mac.sh

set -euo pipefail
STUDIO="$(cd "$(dirname "$0")/.." && pwd)"

echo "== Studio setup =="

if ! command -v brew >/dev/null; then
  echo "Homebrew (the Mac installer tool) is missing. Install it first from https://brew.sh, then run this again."
  exit 1
fi

echo "-> Installing Node.js (runs the graphics tool) and ffmpeg (video file jobs)..."
brew install node ffmpeg jq

echo "-> Setting up the graphics tool..."
(cd "$STUDIO/tools/graphics" && npm install)

echo "-> Test-rendering one graphic..."
mkdir -p "$STUDIO/videos/_setup-test"
"$STUDIO/tools/graphics/render.sh" StatCard "$STUDIO/videos/_setup-test/01-graphic-test.mov" \
  '{"seconds":3,"value":10,"suffix":"x","label":"setup works"}'

echo
if [[ -n "${KIE_AI_API_KEY:-}" ]]; then
  echo "OK  Kie AI key found."
else
  echo "TODO  Kie AI key not found. Open ~/.zshrc and add this line (with your real key):"
  echo '        export KIE_AI_API_KEY="your-key-here"'
  echo "      Then close and reopen Terminal."
fi

if command -v claude >/dev/null; then
  echo "OK  Claude Code is installed."
else
  echo "TODO  Install Claude Code: https://claude.com/download (desktop app) or run: npm install -g @anthropic-ai/claude-code"
fi

echo
echo "Done. A test graphic is in videos/_setup-test/ — try dragging it into CapCut."
