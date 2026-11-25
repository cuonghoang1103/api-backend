# Lab 15 — một giờ "trực" thu nhỏ: lưu lượng bình thường + luật bẫy noData (cwd = bản sao thư mục loki; BASH_ENV=cong-cu/loki-env.bash)
timeout 400 bash -c 'while :; do goi /api/orders; goi /api/pay; sleep 2; done' >/dev/null 2>&1 & echo $! > .luu-luong.pid; echo "lưu lượng bình thường chạy tới 400 s"
cp ../lab15/bay-nodata.yaml grafana/alerting/; docker restart lgz-c15-grafana >/dev/null; until gf /api/health 2>/dev/null | grep -q '"database": *"ok"'; do sleep 2; done; sleep 5; date +%s > .t0; date -u +%T; trang_thai; echo
sleep 240; date -u +%T; trang_thai; echo
gf /api/prometheus/grafana/api/v1/rules | jq -r '.data.groups[].rules[] | select(.name | test("mặc định")) | .alerts[]? | "\(.labels.alertname)  \(.state)  \(.labels.datasource_uid // "")"'
dien_thoai
lcurl "127.0.0.1:2586/lab15-canh-bao/json?poll=1&since=$(cat .t0)" | jq -r '.message' | grep -E '^ - (alertname|rulename|datasource_uid)' | sort -u
kill "$(cat .luu-luong.pid)" 2>/dev/null; rm grafana/alerting/bay-nodata.yaml; docker restart lgz-c15-grafana >/dev/null; echo "đã dừng lưu lượng, gỡ luật bẫy"
