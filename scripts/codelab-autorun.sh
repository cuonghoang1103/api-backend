#!/bin/sh
# codelab-autorun.sh — keep a Code Lab exercise shard going across quota resets.
#
# codelab-bulk-gen exits as soon as the shared token window is exhausted
# ("[stop] quota/AI off — stopping"). Nothing restarts it, so a shard that hits
# the ceiling at 03:00 is simply dead until a human notices. This wrapper waits
# out the window and resumes; because bulk-gen only tops modules up to
# --per-module, re-running it is safe and picks up exactly where it stopped.
#
#   docker exec -d -e LLM_MODEL_GENERATION=claude-opus-4-8 cuonghoangdev_backend \
#     sh scripts/codelab-autorun.sh <tracks-csv> <logfile>
#
# Stops on its own when a full pass adds nothing AND did not stop for quota —
# that means every module in the shard is already at its target.
set -u
TRACKS="${1:?usage: codelab-autorun.sh <tracks-csv> <log>}"
LOG="${2:-/tmp/autorun-$(echo "$TRACKS" | cut -c1-8).log}"
PER_MODULE="${PER_MODULE:-10}"
BUDGET="${BUDGET:-4500000}"
WAIT="${WAIT:-900}"          # 15 min between attempts
MAX_PASSES="${MAX_PASSES:-60}"

i=1
while [ "$i" -le "$MAX_PASSES" ]; do
  echo "=== pass $i — $(date -u +%H:%M:%SZ) — tracks=$TRACKS" >> "$LOG"
  node scripts/codelab-bulk-gen.mjs --tracks "$TRACKS" \
       --per-module "$PER_MODULE" --budget "$BUDGET" >> "$LOG" 2>&1

  tail_line=$(grep '\[codelab-bulk\] done' "$LOG" | tail -1)
  echo "    -> $tail_line" >> "$LOG"

  # Quota stop → the window is exhausted; wait it out and try again.
  if tail -40 "$LOG" | grep -q 'quota/AI off'; then
    echo "    quota exhausted, sleeping ${WAIT}s" >> "$LOG"
    sleep "$WAIT"
    i=$((i + 1))
    continue
  fi

  # No quota stop and nothing added → the shard is complete.
  case "$tail_line" in
    *"exercises +0"*)
      echo "=== shard complete (nothing left to add) — $(date -u +%H:%M:%SZ)" >> "$LOG"
      exit 0
      ;;
  esac

  # Ran fine and added work; go straight into the next pass after a short pause.
  sleep 30
  i=$((i + 1))
done
echo "=== stopped after $MAX_PASSES passes — $(date -u +%H:%M:%SZ)" >> "$LOG"
