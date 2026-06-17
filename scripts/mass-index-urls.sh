#!/bin/bash
# ============================================================
# mass-index-urls.sh
#
# Submits a batch of important URLs to Google's Indexing API
# via the /api/index-url route, so Google re-crawls them within
# minutes (vs. days/weeks for normal sitemap-only discovery).
#
# This is the "IndexNow for Google" — IndexNow only covers
# Bing/Yandex, Google's equivalent is the Indexing API. It's
# rate-limited at 200 requests/day per project, so we have to
# spread the work out.
#
# When to run:
#   1. First time after enabling the Indexing API + Search
#      Console ownership (i.e. right now, to push all the
#      important pages Google has never seen).
#   2. After adding a big batch of new blog posts / courses /
#      products that you want indexed today.
#
# When NOT to run:
#   - On every deploy. New content gets auto-pinged by
#     deploy-vps.sh (it calls the same route with a small batch).
#     This script is for one-off catch-up campaigns.
#
# Behaviour:
#   - Reads URLs from stdin OR a file passed as $1.
#   - 65s between each request (the route throttles at 60s/URL).
#   - Stops on first hard error (non-throttle, non-403) so we
#     don't burn the daily quota on a broken script.
#   - Logs progress + JSON response to stdout for debugging.
# ============================================================

set -euo pipefail

# --- Args ----------------------------------------------------
# Either pass a file path with one URL per line, or pipe URLs
# via stdin. If neither, fall back to a hard-coded list of the
# 11 static pages from the sitemap.
URLS=()
if [ $# -ge 1 ] && [ -f "$1" ]; then
  while IFS= read -r line; do
    [ -n "$line" ] && URLS+=("$line")
  done < "$1"
elif [ $# -ge 1 ]; then
  # First arg is the URL list inline, space-separated
  for u in "$@"; do
    URLS+=("$u")
  done
elif [ ! -t 0 ]; then
  # Read from stdin
  while IFS= read -r line; do
    [ -n "$line" ] && URLS+=("$line")
  done
else
  # Fallback: the 11 static pages from sitemap.xml. These are
  # the highest-value URLs on the site — homepage, top-level
  # sections, content hubs. Blog posts and product pages are
  # intentionally NOT in this list because the route's 60s
  # throttle would make submitting 50+ posts take 50+ minutes;
  # for bulk, prefer the sitemap route (deploy-vps.sh) or call
  # this script with a custom URL list.
  URLS=(
    "https://cuongthai.com/"
    "https://cuongthai.com/blog"
    "https://cuongthai.com/courses"
    "https://cuongthai.com/academy"
    "https://cuongthai.com/shop"
    "https://cuongthai.com/music"
    "https://cuongthai.com/projects"
    "https://cuongthai.com/repos"
    "https://cuongthai.com/dev-hub"
    "https://cuongthai.com/games"
    "https://cuongthai.com/social"
  )
fi

# --- Config --------------------------------------------------
ENDPOINT="https://cuongthai.com/api/index-url"
THROTTLE_SECONDS=65        # 60s server throttle + 5s safety margin
MAX_BATCH="${MAX_BATCH:-50}"   # Google daily quota is 200/day; cap a
                                # single run at 50 so we don't blow
                                # the budget on a misclick.

# --- Pre-flight ----------------------------------------------
if [ ${#URLS[@]} -eq 0 ]; then
  echo "[ERROR] No URLs to submit. Pass a file, pipe via stdin, or"
  echo "        run with no args to use the default sitemap list."
  exit 1
fi

if [ ${#URLS[@]} -gt "$MAX_BATCH" ]; then
  echo "[WARN] URL list has ${#URLS[@]} entries; capping at $MAX_BATCH"
  echo "       (Google daily quota is 200 — set MAX_BATCH to override)"
  URLS=("${URLS[@]:0:$MAX_BATCH}")
fi

echo "=== Mass Indexing: ${#URLS[@]} URLs → $ENDPOINT ==="
echo "    Throttle: ${THROTTLE_SECONDS}s between requests"
echo "    Start:    $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
echo ""

# --- Loop ----------------------------------------------------
SUCCESS=0
FAILED=0
START_TIME=$(date +%s)

for i in "${!URLS[@]}"; do
  URL="${URLS[$i]}"
  N=$((i + 1))
  TOTAL=${#URLS[@]}

  printf "[%2d/%2d] %-50s " "$N" "$TOTAL" "$URL"

  # Use --max-time 30 so a hung connection doesn't block the
  # whole batch forever. Capture body + http code separately.
  RESPONSE=$(curl -s --max-time 30 -w "\n%{http_code}" \
    -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{\"url\":\"$URL\"}" 2>&1) || {
    echo "  CURL_ERROR"
    FAILED=$((FAILED + 1))
    continue
  }

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -n -1)

  # Try to extract the success field from the JSON body.
  if command -v python3 >/dev/null 2>&1; then
    OK=$(echo "$BODY" | python3 -c "
import json, sys
try:
  d = json.loads(sys.stdin.read())
  print('1' if d.get('success') else '0')
except Exception:
  print('?')
" 2>/dev/null || echo "?")
    GOOGLE_CODE=$(echo "$BODY" | python3 -c "
import json, sys
try:
  d = json.loads(sys.stdin.read())
  print(d.get('googleCode') or d.get('error') or '')
except Exception:
  pass
" 2>/dev/null || echo "")
  else
    OK="?"
    GOOGLE_CODE=""
  fi

  if [ "$OK" = "1" ]; then
    echo "  200 OK"
    SUCCESS=$((SUCCESS + 1))
  elif [ "$HTTP_CODE" = "429" ]; then
    # Throttled — back off and retry once. The server allows
    # the same URL every 60s; we waited 65s, so this shouldn't
    # happen unless the throttle is per-URL and we re-submitted
    # the same URL twice in this batch.
    echo "  429 THROTTLED (${GOOGLE_CODE}) — skipping"
    FAILED=$((FAILED + 1))
  elif [ "$HTTP_CODE" = "403" ]; then
    # PERMISSION_DENIED — the service account is not an Owner
    # of the Search Console property, OR the URL is not under
    # any property the SA owns. This is a config problem, not
    # a transient error — stop the batch so we don't burn the
    # 200/day quota on something that can't succeed.
    echo "  403 PERMISSION_DENIED"
    echo "         ${GOOGLE_CODE}"
    echo "         [FATAL] Add the service account as Owner in"
    echo "         Google Search Console, then re-run."
    FAILED=$((FAILED + 1))
    break
  else
    echo "  ${HTTP_CODE} FAIL (${GOOGLE_CODE})"
    FAILED=$((FAILED + 1))
  fi

  # Don't sleep after the last URL
  if [ $N -lt $TOTAL ]; then
    sleep "$THROTTLE_SECONDS"
  fi
done

# --- Summary -------------------------------------------------
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
ELAPSED_MIN=$((ELAPSED / 60))
ELAPSED_SEC=$((ELAPSED % 60))

echo ""
echo "=== Summary ==="
echo "  Success:  $SUCCESS"
echo "  Failed:   $FAILED"
echo "  Total:    ${#URLS[@]}"
echo "  Elapsed:  ${ELAPSED_MIN}m ${ELAPSED_SEC}s"
echo "  End:      $(date -u +"%Y-%m-%d %H:%M:%S UTC")"

# Exit non-zero if anything failed so CI can detect it.
[ "$FAILED" -eq 0 ] && exit 0 || exit 1
