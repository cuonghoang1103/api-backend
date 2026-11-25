# 10.4 — Đọc log Node.js (pino) của Lab 10: JSON trộn stack trace thô khi tiến trình sập
head -n 1 logs/app.log
jq -c 'select(.level >= 50) | .msg' logs/app.log | sort | uniq -c
grep -c -v '^{' logs/app.log
jq -R 'fromjson? | .level' logs/app.log | sort -n | uniq -c
jq -R -c 'fromjson? | select(.level >= 50 and .err) | {t: (.time / 1000 | floor | todate), msg, url: .req.url, err: .err.message}' logs/app.log | head -n 2
jq -R -r 'fromjson? | select(.err) | .err.stack' logs/app.log | head -n 7
grep -n -v '^{' logs/app.log | head -n 14
RID=$(awk '$9 == 500 {print $NF}' logs/access.log | head -n 1 | cut -d= -f2); echo "rid = $RID"; grep -c "$RID" logs/access.log logs/app.log
RID=$(awk '$9 == 500 {print $NF}' logs/access.log | head -n 1 | cut -d= -f2); jq -R -c --arg r "$RID" 'fromjson? | select(.req.id == $r) | {level, msg, status: .res.statusCode, ms: .responseTime, err: .err.message}' logs/app.log
grep -A1 -B1 'supervisor' logs/app.log | cut -c1-160
awk '$9 == 502' logs/access.log | awk '{print $4}' | sort | uniq -c
