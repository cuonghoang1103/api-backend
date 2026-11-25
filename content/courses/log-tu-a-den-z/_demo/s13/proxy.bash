# 13.3 — CDN biên (nginx giả lập) → nginx gốc → Express 5. cwd = thư mục làm việc có proxy/* + node_modules. Mạng lab 10.113.0.0/24:
# Chạy: BASH_ENV=cong-cu/proxy-env.bash python3 chay.py proxy.bash <thư mục>  (khach = hàm curl theo IP nguồn)
#   .5 edge (giả lập CDN) · .10 nginx gốc · .20 app · .101 khách thật · .66 kẻ tấn công
docker network create --subnet 10.113.0.0/24 lgz-c13p >/dev/null && mkdir -p logs && echo "mạng lgz-c13p sẵn sàng"
docker run -d --name lgz-app --network lgz-c13p --ip 10.113.0.20 --user "$(id -u):$(id -g)" -v "$PWD":/w -w /w node:22-alpine node app.mjs >/dev/null
docker run -d --name lgz-goc --network lgz-c13p --ip 10.113.0.10 -v "$PWD/origin.conf":/etc/nginx/conf.d/default.conf:ro -v "$PWD/logs":/var/log/nginx nginx:1.27-alpine >/dev/null
docker run -d --name lgz-edge --network lgz-c13p --ip 10.113.0.5 -v "$PWD/edge.conf":/etc/nginx/conf.d/default.conf:ro -v "$PWD/logs/edge":/var/log/nginx nginx:1.27-alpine >/dev/null; sleep 2; echo "edge, gốc, app đã chạy"
khach 10.113.0.101 'http://10.113.0.5/?cong=80'; echo; khach 10.113.0.101 'http://10.113.0.5/?cong=8080'
tail -n 1 logs/goc-sai.log logs/goc-dung.log
docker logs lgz-app 2>&1 | tail -2
khach 10.113.0.66 -H 'X-Forwarded-For: 203.0.113.7' 'http://10.113.0.5/?cong=80'; echo; khach 10.113.0.66 -H 'X-Forwarded-For: 203.0.113.7' 'http://10.113.0.5/?cong=8080'
tail -1 logs/edge/edge.log; tail -1 logs/goc-sai.log; tail -1 logs/goc-dung.log
docker logs lgz-app 2>&1 | tail -2 | jq -c '{cong, ip, ips, xff}'
khach 10.113.0.66 -H 'CF-Connecting-IP: 198.51.100.9' -H 'X-Forwarded-For: 198.51.100.9' 'http://10.113.0.10:8080/'; echo; tail -1 logs/goc-dung.log
for i in 1 2 3 4 5 6 7 8; do khach 10.113.0.66 -o /dev/null -w '%{http_code} ' -X POST -H "X-Forwarded-For: 203.0.113.$i" 'http://10.113.0.5/login?cong=80'; done; echo
for i in 1 2 3 4 5 6 7 8; do khach 10.113.0.66 -o /dev/null -w '%{http_code} ' -X POST -H "X-Forwarded-For: 203.0.113.$i" 'http://10.113.0.5/login?cong=8080'; done; echo
docker logs lgz-app 2>&1 | jq -rR 'fromjson? | select(.path == "/login") | "\(.cong) ip=\(.ip) \(.status)"' | sort | uniq -c
docker logs lgz-app 2>&1 | grep -m1 -A3 ValidationError | cut -c1-160
khach 10.113.0.101 -i 'http://10.113.0.5/loi?cong=8080' | grep -iE '^HTTP|"error"'; docker stop lgz-app >/dev/null; khach 10.113.0.101 'http://10.113.0.5/?cong=8080'
R=$(grep -o 'ray=[0-9a-f]*-SIN' logs/edge/edge.log | tail -1 | cut -d= -f2); echo "Ray ID khách báo: $R"; grep -h "$R" logs/edge/edge.log logs/goc-dung.log; grep -c "$R" logs/goc-dung.log
R=$(grep '/loi' logs/edge/edge.log | grep -o 'ray=[0-9a-f]*-SIN' | tail -1 | cut -d= -f2); grep -h "$R" logs/goc-dung.log; docker logs lgz-app 2>&1 | grep "$R" | jq -c '{ray, path, status}'
curl -s https://www.cloudflare.com/ips-v4 | head -3; echo; curl -s https://www.cloudflare.com/ips-v4 | grep -c .
curl -s https://www.cloudflare.com/ips-v4 | awk 'NF {print "set_real_ip_from " $1 ";"}' | head -3; echo 'real_ip_header CF-Connecting-IP;'
docker rm -f lgz-app lgz-goc lgz-edge >/dev/null; docker network rm lgz-c13p >/dev/null; echo "đã dọn"
