head -n 1 app/app.jsonl | jq -c .
jq -c 'select(.level >= 50) | {time, msg, code: .err.code}' app/app.jsonl | head -n 2
jq -r 'select(.level == 40) | [.reqId, .durationMs] | @tsv' app/app.jsonl | head -n 3
jq -r '.res.statusCode // "-"' app/app.jsonl | sort | uniq -c
jq -s 'length' app/app.jsonl
jq -s 'group_by(.level) | map({level: .[0].level, count: length})' -c app/app.jsonl
jq -s '[.[] | select(.responseTime)] | (map(.responseTime) | add / length | floor)' app/app.jsonl
jq -s 'map(select(.level == 40)) | max_by(.durationMs) | {reqId, durationMs}' -c app/app.jsonl
jq -r '[(.time / 1000 | floor | todate), .level, .msg] | @csv' app/app.jsonl | head -n 2
jq -c . app/app-hong.jsonl
jq -R -c 'fromjson? | {level, msg}' app/app-hong.jsonl
