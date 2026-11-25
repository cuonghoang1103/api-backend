# 10.8 — Cùng một request, ba hình dạng log; một dòng một sự kiện; đổi tên trường sang ECS
RID=$(awk '$9 == 500 {print $NF}' logs/access.log | head -n 1 | cut -d= -f2); grep "$RID" logs/access.log; jq -c --arg r "$RID" 'select(.rid == $r)' logs/access.json
wc -l logs/app.log; jq -R 'fromjson?' logs/app.log | jq -s length
jq -R -c 'fromjson? | select(.level == 50 and .err) | {"@timestamp": (.time / 1000 | todate), "log.level": "error", "service.name": .service, message: .msg, "trace.id": .req.id, "http.request.method": .req.method, "url.path": .req.url, "error.type": .err.type, "error.message": .err.message}' logs/app.log | head -n 1 | jq .
grep -m1 'jndi' logs/access.log | cut -c1-220
jq -c 'select(.ua | test("jndi")) | {ip, uri, ua}' logs/access.json
grep -c 'login failed' logs/app.log; grep 'level\\":30' logs/app.log | jq -c '{level, msg, user}'
