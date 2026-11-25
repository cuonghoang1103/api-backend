# 9.1 — Bảng Console đọc như một tệp log. cwd = thư mục làm việc Lab 9 (server.mjs đang chạy). console.mjs in đúng những gì DevTools nhận qua CDP.
node console.mjs me,warn
KHONG_MAP=1 BAM=1 CHO=500 node console.mjs pay | tail -n 5
BAM=1 CHO=500 node console.mjs pay | tail -n 5
CHO=3500 node console.mjs orders,report,reject | grep -v 'Content Security\|logo-moi\|\[boot\]\|products'
grep '/api/orders' logs/api.log | tail -n 1
grep '"/api/orders"' logs/app.log | tail -n 1 | jq -c '{level, reqId, msg}'
head -c 220 public/app.min.js; echo
jq -c '{version, sources, names: (.names | length), coNguon: (.sourcesContent | length)}' public/app.min.js.map
curl -s -o /dev/null -w '%{http_code} %{content_type} %{size_download} byte\n' http://127.0.0.1:41901/app.min.js.map
