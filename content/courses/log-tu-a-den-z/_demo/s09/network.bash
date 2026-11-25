# 9.2 — Bảng Network: mỗi request là một dòng log. net.mjs dựng bảng từ sự kiện CDP Network.* (đúng nguồn DevTools dùng).
node net.mjs me,orders,report,slow
curl -sk -o /dev/null --resolve bank.lgz.test:41903:127.0.0.1 -w 'dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} tong=%{time_total} (giây)\n' https://bank.lgz.test:41903/
CHI_TIET=/api/slow node net.mjs slow | sed -n '/──/,$p'
CURL=/api/me node net.mjs me | sed -n '/Copy as cURL/,$p'
node -e "import('./mo.mjs').then((m) => console.log(m.TOKEN_CU))" > token-cu.txt; cut -d. -f2 token-cu.txt | base64 -d 2>/dev/null; echo
curl -si --resolve api.lgz.test:41902:127.0.0.1 http://api.lgz.test:41902/api/me -H "Authorization: Bearer $(cat token-cu.txt)" -H 'Origin: http://shop.lgz.test:41901'
RID=$(curl -si --resolve api.lgz.test:41902:127.0.0.1 http://api.lgz.test:41902/api/me -H "Authorization: Bearer $(cat token-cu.txt)" | grep -i '^x-request-id' | tr -d '\r' | cut -d' ' -f2); echo "rid=$RID"; grep -h "$RID" logs/api.log logs/app.log
grep '/api/report' logs/api.log | tail -n 1; grep '"/api/report"' logs/app.log | tail -n 1 | jq -r .msg
