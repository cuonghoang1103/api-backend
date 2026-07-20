#!/bin/sh
# news-autorun.sh — publish the tech-news bulletin as soon as the LLM quota allows.
#
# The daily cron fires at a fixed hour; if the gateway is rate-limited at that
# moment the slot is simply missed and nothing appears until tomorrow. This
# wrapper is for the "publish it when you can" case: it ingests, tries to build
# a bulletin, and on a quota error waits and tries again.
#
#   docker exec -d -e LLM_MODEL_GENERATION=claude-opus-4-8 cuonghoangdev_backend \
#     sh scripts/news-autorun.sh <count> <logfile>
#
# Exits after publishing <count> bulletins (default 1) or once it runs out of
# attempts, so it can never sit publishing forever.
set -u
COUNT="${1:-1}"
LOG="${2:-/tmp/news-autorun.log}"
WAIT="${WAIT:-600}"          # 10 min between attempts
MAX_ATTEMPTS="${MAX_ATTEMPTS:-72}"   # ~12h of retries

published=0
attempt=1
while [ "$attempt" -le "$MAX_ATTEMPTS" ] && [ "$published" -lt "$COUNT" ]; do
  echo "=== attempt $attempt — $(date -u +%H:%M:%SZ)" >> "$LOG"

  out=$(node -e '
    const ing = await import("/app/dist/services/techTrends/newsIngest.service.js");
    const news = await import("/app/dist/services/techTrends/news.service.js");
    try {
      await ing.ingestAllFeeds();
      const a = await news.runDailyBulletin({ authorId: Number(process.env.TECH_NEWS_AUTHOR_ID || 1) });
      console.log("OK " + JSON.stringify(a));
    } catch (e) {
      console.log("ERR " + (e && e.message ? e.message : e));
    }
  ' --input-type=module 2>&1 | tail -3)

  echo "$out" >> "$LOG"

  case "$out" in
    *"OK {"*)
      published=$((published + 1))
      echo "=== published $published/$COUNT" >> "$LOG"
      # Space bulletins out so two do not land in the same minute.
      [ "$published" -lt "$COUNT" ] && sleep 120
      ;;
    *429*|*quota*|*busy*|*"đang bận"*|*AI_UNAVAILABLE*)
      echo "    quota/rate-limited, sleeping ${WAIT}s" >> "$LOG"
      sleep "$WAIT"
      ;;
    *NOT_ENOUGH_NEWS*|*"Chưa đủ tin"*)
      echo "    not enough fresh news, sleeping ${WAIT}s" >> "$LOG"
      sleep "$WAIT"
      ;;
    *)
      # An unexpected error repeats forever if we keep hammering it; back off
      # harder and let the log carry the reason.
      echo "    unexpected error, backing off" >> "$LOG"
      sleep "$WAIT"
      ;;
  esac
  attempt=$((attempt + 1))
done

echo "=== done: published=$published after $((attempt - 1)) attempt(s) — $(date -u +%H:%M:%SZ)" >> "$LOG"
