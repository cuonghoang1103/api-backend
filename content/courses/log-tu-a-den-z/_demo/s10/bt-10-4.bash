# Lời giải 🧪 bài 10.4 — chạy thật 24/11/2026 trên Lab 10 dựng lại (~/.rtq-lgz/c10; cùng lưu lượng tất định), jq 1.8.1 trên máy chủ
# Khởi động lại app: giết tiến trình node, vòng supervisor của lab tự chạy lại (docker restart lgz-node làm nginx mất mạng chung).
RID=$(awk '$9 == 502 {print $NF}' logs/access.log | head -n 1 | cut -d= -f2); echo "rid = $RID"; grep -c "$RID" logs/access.log logs/app.log
awk '$9 == 502 {print $4, $7}' logs/access.log | head -n 3
jq -R -r 'fromjson? | select(.level >= 50) | .req.url // "(không có req)" | sub("[0-9]+$"; ":id")' logs/app.log | sort | uniq -c
jq -R -r 'fromjson? | select(.msg == "request errored") | .req.url | sub("[0-9]+$"; ":id")' logs/app.log | sort | uniq -c
docker exec lgz-node node -e "require('net').connect(5432, 'db')" 2>&1 | head -n 8
sed -i "s/redact: \['req.headers.authorization', /redact: [/" app.js && grep -n 'redact:' app.js && docker exec lgz-node pkill -x node && sleep 4
curl -s -o /dev/null -w '%{http_code}\n' -H 'Authorization: Bearer GIA_TOKEN·VIDU' http://127.0.0.1:41080/api/products; sleep 1; grep -o '"authorization":"[^"]*"' logs/app.log | tail -n 1
sed -i "s/redact: \[/redact: ['req.headers.authorization', /" app.js && grep -n 'redact:' app.js && docker exec lgz-node pkill -x node && sleep 4
curl -s -o /dev/null -w '%{http_code}\n' -H 'Authorization: Bearer GIA_TOKEN·VIDU' http://127.0.0.1:41080/api/products; sleep 1; grep -o '"authorization":"[^"]*"' logs/app.log | tail -n 1
