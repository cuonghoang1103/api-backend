# Lab 10 — lời giải mẫu (ba kết luận, mỗi kết luận có dòng log làm bằng chứng)
awk '{split($7, p, "?"); for (i = 1; i <= NF; i++) if ($i ~ /^rt=/) {s[p[1]] += substr($i, 4); n[p[1]]++}} END {for (k in s) if (n[k] >= 5) printf "%.3f %4d %s\n", s[k] / n[k], n[k], k}' logs/access.log | sort -rn | head -n 3
awk '$9 == 502 {print substr($4, 2)}' logs/access.log | sed -n '1p;$p'
grep -E 'connect\(\) failed' logs/error.log | head -n 1 | cut -c1-200
grep -n -B2 'supervisor' logs/app.log | cut -c1-140 | grep -v '^[0-9]*-\s*at '
jq -R -c 'fromjson? | select(.req.url == "/api/crash") | {t: (.time / 1000 | floor | todate), ip: .req.headers["x-forwarded-for"], url: .req.url, status: .res.statusCode}' logs/app.log
awk '$9 >= 400 {print $1}' logs/access.log | sort | uniq -c | sort -rn | head -n 1
awk '$1 == "203.0.113.66"' logs/access.log | awk '{print $4}' | sed -n '1p;$p'
