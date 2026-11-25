# 9.5 — Thu lỗi phía giao diện từ người dùng: bat-loi.js gửi về /rum, CSP gửi về /csp. server.mjs ghi logs/rum.log, logs/csp.log.
: > logs/rum.log; : > logs/csp.log
BAM=1 CHO=1500 node console.mjs pay,reject,storm,pii > /dev/null; sleep 1; wc -l logs/rum.log logs/csp.log
jq -c '{loai, tin, vitri}' logs/rum.log
jq -c 'select(.tin | test("items")) | .stackGoc' logs/rum.log
jq -c 'select(.tin | test("hồ sơ")) | {tin, trang}' logs/rum.log
jq '."csp-report" | {"violated-directive", "blocked-uri", "source-file", "line-number", disposition}' logs/csp.log
grep -c 'logo-moi' logs/rum.log; grep 'logo-moi' logs/web.log | tail -n 1
head -c 9000 /dev/zero | tr '\0' a | curl -s -o /dev/null -w '%{http_code}\n' --data-binary @- http://127.0.0.1:41901/rum
curl -s -o /dev/null -w '%{http_code}\n' -H 'Content-Type: application/json' --data '{"loai":"error","tin":"Lỗi nghiêm trọng! Gọi ngay 0900 000 000 để được hỗ trợ","tep":"http://shop.lgz.test:41901/app.min.js","dong":1,"cot":1}' http://127.0.0.1:41901/rum; tail -n 1 logs/rum.log | jq -c '{ip, tin, ua}'
