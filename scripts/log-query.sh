#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# log-query.sh — quick jq-based queries against the backend JSON log stream
#
# Source: `docker logs cuonghoangdev_backend` (production) or a saved file.
# Format: one JSON object per line (NDJSON) — see LOG_PIPELINE.md.
#
# Usage:
# ./scripts/log-query.sh errors # last 50 errors + warnings
# ./scripts/log-query.sh tail # last 20 lines, pretty
# ./scripts/log-query.sh follow # stream live (Ctrl-C to stop)
# ./scripts/log-query.sh since 5m # last 5 minutes, all levels
# ./scripts/log-query.sh since 1h errors # last hour, errors only
# ./scripts/log-query.sh msg="Database connected" # filter on msg field
# ./scripts/log-query.sh level=error # filter on level field
# ./scripts/log-query.sh provider=groq # filter on any field
# ./scripts/log-query.sh count msg="embed job" # group/count
# ./scripts/log-query.sh summary 1h # health summary
# ./scripts/log-query.sh cb-open # circuit-breaker opens
# ./scripts/log-query.sh providers # AI provider usage stats
# ./scripts/log-query.sh ./path/to/saved.log # query a file
#
# Install jq on the VPS: apt install jq  (already on most Ubuntu images)
# ------------------------------------------------------------------------------

set -euo pipefail

CONTAINER="cuonghoangdev_backend"
LIMIT=50

# ---- helpers ----------------------------------------------------------------

usage() {
 sed -n '2,24p' "$0" | sed 's/^# \{0,1\}//'
 exit 1
}

die() { echo "log-query: $*" >&2; exit 1; }

# Drain the source (file or docker) into stdout.
# Args: $1 = path or "-"
stream() {
 local src="${1:-}"
 if [[ "$src" != "-" && -r "$src" ]]; then
 cat "$src"
 else
 if [[ "${FOLLOW:-0}" == "1" ]]; then
 docker logs -f --tail 0 "$CONTAINER" 2>&1
 else
 docker logs --tail 5000 "$CONTAINER" 2>&1
 fi
 fi
}

# Parse a human duration ("5m", "1h", "30s", "2d") into seconds.
parse_duration() {
 local d="${1:-}"
 [[ -z "$d" ]] && die "duration required (e.g. 5m, 1h, 2d)"
 if [[ "$d" =~ ^([0-9]+)([smhd])$ ]]; then
 local n="${BASH_REMATCH[1]}"
 local u="${BASH_REMATCH[2]}"
 case "$u" in
 s) echo $((n)) ;;
 m) echo $((n * 60)) ;;
 h) echo $((n * 3600)) ;;
 d) echo $((n * 86400)) ;;
 esac
 else
 die "invalid duration '$d' (use Ns/Nm/Nh/Nd, e.g. 5m)"
 fi
}

# Convert a relative "5m" / "1h" cutoff to an ISO 8601 UTC stamp.
cutoff_iso() {
 local secs
 secs="$(parse_duration "$1")"
 # BSD/macOS date and GNU date differ: try the GNU flag first, then fall back.
 if date -u -d "@$(( $(date -u +%s) - secs ))" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null; then
 return 0
 fi
 date -u -v-"${secs}"S +%Y-%m-%dT%H:%M:%SZ
}

# Build a tiny jq program that filters the stream. Returns '.' when
# no filters are provided (a no-op). Recognises these forms:
# key=value exact-match on a known field
# key~value regex match on a known field
build_filter() {
 local jq_filter='.'
 local level="" msg=""
 # Strip a single pair of surrounding double or single quotes from a value.
 # Many shells pass `msg="foo bar"` with the quotes intact, which is what
 # the user intended to write but is not what jq wants.
 strip_quotes() {
 local v="$1"
 if [[ "$v" == \"*\" && "$v" == *\" ]]; then
 v="${v#\"}"; v="${v%\"}"
 elif [[ "$v" == \'*\' && "$v" == *\' ]]; then
 v="${v#\'}"; v="${v%\'}"
 fi
 printf '%s' "$v"
 }

 while [[ $# -gt 0 ]]; do
 case "$1" in
 level=) die "empty value for level filter" ;;
 level=*) level="$(strip_quotes "${1#level=}")"; shift ;;
 msg=) die "empty value for msg filter" ;;
 msg=*) msg="$(strip_quotes "${1#msg=}")"; shift ;;
 provider=*) jq_filter+=" | select(.provider == \"$(strip_quotes "${1#provider=}")\")"; shift ;;
 jobId=*) jq_filter+=" | select(.jobId == \"$(strip_quotes "${1#jobId=}")\")"; shift ;;
 name=*) jq_filter+=" | select(.name == \"$(strip_quotes "${1#name=}")\")"; shift ;;
 path=*) jq_filter+=" | select(.path == \"$(strip_quotes "${1#path=}")\")"; shift ;;
 orderCode=*) jq_filter+=" | select(.orderCode == \"$(strip_quotes "${1#orderCode=}")\")"; shift ;;
 userId=*) jq_filter+=" | select(.userId == \"$(strip_quotes "${1#userId=}")\")"; shift ;;
 error~*) jq_filter+=" | select(.error != null and (.error | tostring | test(\"$(strip_quotes "${1#error~}")\")))"; shift ;;
 msg~*) jq_filter+=" | select(.msg != null and (.msg | tostring | test(\"$(strip_quotes "${1#msg~}")\")))"; shift ;;
 *) die "unknown filter '$1'" ;;
 esac
 done
 if [[ -n "$level" ]]; then
 jq_filter+=" | select(.level == \"$level\")"
 fi
 if [[ -n "$msg" ]]; then
 jq_filter+=" | select(.msg == \"$msg\")"
 fi
 echo "$jq_filter"
}

# ---- subcommands ------------------------------------------------------------

cmd_errors() {
 # Args: $1 = optional window like "5m" / "1h", $2 = optional source file
 # Remaining args are filters.
 local window=""
 local src="-"
 local -a filters=()
 for a in "$@"; do
 if [[ "$a" =~ ^[0-9]+[smhd]$ ]]; then
 window="$a"
 elif [[ -r "$a" && "$a" =~ \.(log|ndjson|jsonl|json|txt)$ ]]; then
 src="$a"
 else
 filters+=("$a")
 fi
 done
 local iso=""
 [[ -n "$window" ]] && iso="$(cutoff_iso "$window")"
 local base='. | select(.level == "error" or .level == "warn")'
 [[ -n "$iso" ]] && base+=" | select(.ts >= \"$iso\")"
 local filter
 if [[ ${#filters[@]} -eq 0 ]]; then
 filter="$(build_filter)"
 else
 filter="$(build_filter "${filters[@]}")"
 fi
 # If build_filter returned just '.', keep our base; else combine
 # by chaining the predicates (build_filter already ends with a
 # select(...), so we just pipe the level/window predicates in).
 if [[ "$filter" == "." ]]; then
 filter="$base"
 else
 # `base` already starts with `. | select(...)`. Drop the leading `.`
 # from the right side and pipe the rest in.
 local rest="${base#.}"
 filter="${filter%.} | ${rest# | }"
 fi
 stream "$src" | jq -c "$filter" | tail -n "$LIMIT"
}

cmd_tail() {
 local src="-"
 [[ -r "${1:-}" ]] && src="$1"
 stream "$src" | jq -c '.' 2>/dev/null | tail -n "$LIMIT"
}

cmd_follow() {
 FOLLOW=1
 local -a filters=()
 local src="-"
 for a in "$@"; do
 if [[ -r "$a" && "$a" =~ \.(log|ndjson|jsonl|json|txt)$ ]]; then
 src="$a"
 else
 filters+=("$a")
 fi
 done
 local filter
 if [[ ${#filters[@]} -eq 0 ]]; then
 filter="$(build_filter)"
 else
 filter="$(build_filter "${filters[@]}")"
 fi
 stream "$src" | jq -c --unbuffered "$filter"
}

cmd_since() {
 # Two forms: "since 5m" or "since 5m errors"
 local window="${1:-}"
 [[ -z "$window" ]] && die 'usage: since <window> [level=] [msg=] [..]'
 shift
 local src="-"
 local -a filters=()
 for a in "$@"; do
 if [[ -r "$a" && "$a" =~ \.(log|ndjson|jsonl|json|txt)$ ]]; then
 src="$a"
 else
 filters+=("$a")
 fi
 done
 local iso
 iso="$(cutoff_iso "$window")"
 local filter
 if [[ ${#filters[@]} -eq 0 ]]; then
 filter="$(build_filter)"
 else
 filter="$(build_filter "${filters[@]}")"
 fi
 if [[ "$filter" == "." ]]; then
 filter=". | select(.ts >= \"$iso\")"
 else
 filter="${filter%.} | select(.ts >= \"$iso\")"
 fi
 stream "$src" | jq -c "$filter" | tail -n "$LIMIT"
}

cmd_filter() {
 local src="-"
 local -a filters=()
 for a in "$@"; do
 if [[ -r "$a" && "$a" =~ \.(log|ndjson|jsonl|json|txt)$ ]]; then
 src="$a"
 else
 filters+=("$a")
 fi
 done
 local filter
 if [[ ${#filters[@]} -eq 0 ]]; then
 filter="$(build_filter)"
 else
 filter="$(build_filter "${filters[@]}")"
 fi
 stream "$src" | jq -c "$filter" | tail -n "$LIMIT"
}

cmd_count() {
 # usage: count [key=] [path]
 local group_by="${1:-msg}"
 local src="-"
 # Pull out the optional file arg.
 if [[ "${2:-}" != "" && -r "$2" && "$2" =~ \.(log|ndjson|jsonl|json|txt)$ ]]; then
 src="$2"
 fi
 stream "$src" | jq -c "." \
 | jq -s --arg g "$group_by" '
 group_by(.[$g]) | map({key: .[0][$g], count: length}) | sort_by(-.count) | .[0:20]
 '
}

cmd_summary() {
 # usage: summary [window] [path]
 local window="${1:-1h}"
 local src="-"
 if [[ "${2:-}" != "" && -r "$2" && "$2" =~ \.(log|ndjson|jsonl|json|txt)$ ]]; then
 src="$2"
 fi
 local iso
 iso="$(cutoff_iso "$window")"
 stream "$src" | jq -c "." | jq -s --arg since "$iso" '
 [ .[] | select(.ts >= $since) ]
 | {
 window: $since,
 total: length,
 by_level: (group_by(.level) | map({(.[0].level): length}) | add // {}),
 top_messages: (
 [ .[] | .msg ] | group_by(.) | map({msg: .[0], count: length})
 | sort_by(-.count) | .[0:10]
 ),
 top_errors: (
 [ .[] | select(.level == "error") | .msg ] | group_by(.) | map({msg: .[0], count: length})
 | sort_by(-.count) | .[0:10]
 )
 }
 '
}

cmd_cb_open() {
 local src="-"
 [[ -r "${1:-}" ]] && src="$1"
 stream "$src" | jq -c '. | select(.msg == "CircuitBreaker OPENED")' | tail -n "$LIMIT"
}

cmd_providers() {
 local src="-"
 [[ -r "${1:-}" ]] && src="$1"
 stream "$src" | jq -c '. | select(.msg == "AIProviders answered" or .msg == "CircuitBreaker OPENED")' \
 | jq -s '
 [.[] | select(.msg == "AIProviders answered") | {provider, providerDurationMs, attempts}] as $a
 | {
 answered: ($a | length),
 by_provider: (
 $a | group_by(.provider) | map({
 provider: .[0].provider,
 count: length,
 avg_ms: ((map(.providerDurationMs) | add) / length | floor),
 p95_ms: (map(.providerDurationMs) | sort as $s | $s[($s|length * 0.95 | floor)]),
 max_attempts: (map(.attempts) | max)
 })
 ),
 open_count: ([.[] | select(.msg == "CircuitBreaker OPENED")] | length)
 }
 '
}

# ---- dispatch ---------------------------------------------------------------

[[ $# -eq 0 ]] && usage

case "$1" in
 -h|--help|help) usage ;;
 errors) shift; cmd_errors "$@" ;;
 tail) shift; cmd_tail "$@" ;;
 follow|stream) shift; cmd_follow "$@" ;;
 since) shift; cmd_since "$@" ;;
 count) shift; cmd_count "$@" ;;
 summary) shift; cmd_summary "$@" ;;
 cb-open|cb_open) shift; cmd_cb_open "$@" ;;
 providers) shift; cmd_providers "$@" ;;
 *) cmd_filter "$@" ;; # default: arbitrary filters
esac
