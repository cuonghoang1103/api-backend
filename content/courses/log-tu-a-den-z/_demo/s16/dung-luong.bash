# 16.2 — ước lượng và cắt dung lượng log (cwd = _demo/s16/dung-luong; GOI = gói log mẫu của khoá; BASH_ENV=cong-cu/env.bash)
awk '{ b += length($0) + 1 } END { printf "%d dòng, %.0f byte/dòng\n", NR, b/NR }' $GOI/web/access.log; awk '{ b += length($0) + 1 } END { printf "%d dòng, %.0f byte/dòng\n", NR, b/NR }' $GOI/app/app.jsonl
python3 -c 'rps=50; dong=1+2; byte=204; ngay=rps*86400*dong*byte/1e9; print(f"{rps} req/s × {dong} dòng × {byte} B = {ngay:.2f} GB/ngày thô, {ngay*30:.0f} GB/30 ngày")'
f=$GOI/web/access.log; t=$(wc -c < $f); g=$(gzip -6 -c $f | wc -c); z=$(zstd -3 -q -c $f | wc -c); echo "thô $t B · gzip -6 $g B ($(( t / g ))×) · zstd -3 $z B ($(( t / z ))×)"
LOG_LEVEL=info node muc-log.mjs | wc -lc
LOG_LEVEL=debug node muc-log.mjs | wc -lc
docker run -d --name lgz-c16-ng2 --network none -v "$PWD/nginx.conf":/etc/nginx/nginx.conf:ro nginx:1.27-alpine sh -c 'rm /var/log/nginx/*.log; nginx -g "daemon off;"' >/dev/null; sleep 1
docker exec lgz-c16-ng2 sh -c 'for i in $(seq 600); do wget -qO- 127.0.0.1:8080/health >/dev/null; done; for i in $(seq 400); do wget -qO- 127.0.0.1:8080/api/san-pham/$i >/dev/null; done; for i in $(seq 12); do wget -qO- 127.0.0.1:8080/api/loi >/dev/null 2>&1; done; true'
docker exec lgz-c16-ng2 sh -c 'cd /var/log/nginx; wc -l day-du.log gon.log; echo "--- gon.log theo loại:"; awk "{print \$9, (\$7 ~ /health/ ? \"/health\" : \$7 ~ /loi/ ? \"/api/loi\" : \"/api/san-pham\")}" gon.log | sort | uniq -c'
docker rm -f lgz-c16-ng2 >/dev/null
curl -s https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonCloudWatch/current/ap-southeast-1/index.json -o cw.json; jq -r .publicationDate cw.json
jq -r '. as $r | .products | to_entries[] | select(.value.attributes.usagetype | test("^APS1-(DataProcessing|DataProcessingIA|TimedStorage)-(Bytes|ByteHrs)$")) | .key as $k | "\(.value.attributes.usagetype)  \([$r.terms.OnDemand[$k][].priceDimensions[] | "\(.pricePerUnit.USD) USD/\(.unit)"] | join(", "))"' cw.json; rm cw.json
python3 -c 'gb=(50*86400*3*204/1e9)*30; print(f"{gb:.0f} GB/tháng: nạp {gb*0.70:.0f} USD, lưu 30 ngày ~{gb*0.15*0.03:.2f} USD (nén ~15%) — nạp là khoản lớn")'
