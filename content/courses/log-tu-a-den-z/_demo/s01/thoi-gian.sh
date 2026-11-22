date -u -d @1795158253
date -d @1795158253
date -u -d @$((1795158253088 / 1000)) +%FT%TZ
TZ=UTC date -d '2026-11-20 14:05:15 +0700' +%FT%TZ
date -u -d '2026-11-20T14:06:02+07:00' +%FT%TZ
date -u -d @$(( $(date -d 'TZ="Asia/Ho_Chi_Minh" 2026/11/20 14:09:02' +%s) - 180 )) +%FT%TZ
jq -r '(.time / 1000 | floor | todate) + "  " + .msg' incident/app.jsonl
date -d '20 Nov 2026 14:05:31 +0700' +%s
TZ=America/New_York date -d @1795158253
date -u -d @1795158253088
date -u -d '2026/11/20 14:05:15' +%FT%TZ
date -u -d 'TZ="Asia/Ho_Chi_Minh" 2026/11/20 14:05:15' +%FT%TZ
date -u -d 'TZ="Asia/Ho_Chi_Minh" 11/20/2026 2:07:30 PM' +%FT%TZ
