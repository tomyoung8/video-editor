#!/usr/bin/env bash
# Generate one B-roll clip with Kie AI, download it, and log it in cost-log.md.
#
# Only run this AFTER the user has approved the model, clip count and cost.
#
# Usage:
#   tools/kie-broll.sh --model <model> --prompt "<prompt>" --out <path.mp4> \
#                      --video <video-folder-name> --cost "<cost, e.g. \$0.40>" \
#                      [--input '<extra JSON merged into "input">'] [--dry-run]
#
# Input field names differ per model (check docs.kie.ai). The default input is
#   {"prompt": ..., "aspect_ratio": "9:16"}
# and --input overrides/extends it, e.g. --input '{"duration": "8"}'.
#
# --dry-run prints the request body and exits without spending anything.

set -euo pipefail

API="https://api.kie.ai/api/v1/jobs"
STUDIO="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$STUDIO/cost-log.md"
POLL_SECONDS=10
MAX_WAIT_SECONDS=900

model="" prompt="" out="" video="" cost="" extra="{}" dry_run=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --model)   model="$2"; shift 2 ;;
    --prompt)  prompt="$2"; shift 2 ;;
    --out)     out="$2"; shift 2 ;;
    --video)   video="$2"; shift 2 ;;
    --cost)    cost="$2"; shift 2 ;;
    --input)   extra="$2"; shift 2 ;;
    --dry-run) dry_run=1; shift ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

for v in model prompt out video cost; do
  [[ -n "${!v}" ]] || { echo "Missing --$v" >&2; exit 1; }
done

body=$(jq -n --arg model "$model" --arg prompt "$prompt" --argjson extra "$extra" \
  '{model: $model, input: ({prompt: $prompt, aspect_ratio: "9:16"} + $extra)}')

if [[ $dry_run -eq 1 ]]; then
  echo "$body"
  exit 0
fi

if [[ -z "${KIE_AI_API_KEY:-}" ]]; then
  echo "KIE_AI_API_KEY is not set. Add it to ~/.zshrc yourself, then open a new terminal." >&2
  exit 1
fi

log_row() { # $1 = file column
  local p=${prompt//|/\\|}
  printf '| %s | %s | %s | %s | %s | %s |\n' \
    "$(date +%Y-%m-%d)" "$video" "$model" "$p" "$cost" "$1" >> "$LOG"
}

# Header is read from stdin so the key never shows up in the process list.
auth() { printf 'header = "Authorization: Bearer %s"\n' "$KIE_AI_API_KEY"; }

create=$(auth | curl -sS -K - -X POST "$API/createTask" \
  -H "Content-Type: application/json" -d "$body")
task_id=$(jq -r '.data.taskId // empty' <<<"$create")
if [[ -z "$task_id" ]]; then
  echo "Kie refused the job: $(jq -r '.msg // .' <<<"$create")" >&2
  exit 1
fi
echo "Task $task_id created — waiting for Kie to render..."

waited=0
while :; do
  sleep "$POLL_SECONDS"; waited=$((waited + POLL_SECONDS))
  info=$(auth | curl -sS -K - "$API/recordInfo?taskId=$task_id")
  state=$(jq -r '.data.state // empty' <<<"$info")
  case "$state" in
    success) break ;;
    fail)
      reason=$(jq -r '.data.failMsg // "no reason given"' <<<"$info")
      log_row "FAILED: $reason (task $task_id)"
      echo "Kie failed: $reason" >&2
      exit 1 ;;
  esac
  if (( waited >= MAX_WAIT_SECONDS )); then
    log_row "TIMED OUT (task $task_id) — check Kie dashboard"
    echo "Gave up after ${MAX_WAIT_SECONDS}s; task $task_id may still finish on Kie." >&2
    exit 1
  fi
  echo "  ...${state:-waiting} (${waited}s)"
done

# resultJson is usually a JSON string, sometimes an object.
url=$(jq -r '.data.resultJson | (if type == "string" then fromjson else . end) | .resultUrls[0] // empty' <<<"$info")
[[ -n "$url" ]] || { echo "Finished but no video URL in the response." >&2; exit 1; }

mkdir -p "$(dirname "$out")"
curl -sS -L -o "$out" "$url"
log_row "$(basename "$out")"
echo "Saved $out"
