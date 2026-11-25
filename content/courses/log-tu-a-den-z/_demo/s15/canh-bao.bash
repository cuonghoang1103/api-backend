# 15.5 — cảnh báo từ log bằng Grafana Alerting trên LogQL, gửi về ntfy (cwd = bản sao thư mục loki; BASH_ENV=cong-cu/loki-env.bash)
gf /api/v1/provisioning/alert-rules | jq -r '.[] | "\(.title) | for=\(.for) | noData=\(.noDataState) | \(.data[0].model.expr)"'
gf /api/v1/provisioning/contact-points | jq -c '.[] | {name, type, url: .settings.url}'
date +%s > .t0; trang_thai; echo
date -u +%T; do_ssh 12 root; date -u +%T; cho_luat 'SSH thất bại tăng vọt' firing 120
sleep 15; dien_thoai
lcurl "127.0.0.1:2586/lab15-canh-bao/json?poll=1&since=$(cat .t0)" | jq -r 'select(.title | test("SSH")) | .message' | head -12
goi /admin/fail-on; date -u +%T; for i in $(seq 8); do goi /api/pay; sleep 1; done; cho_luat 'API trả 5xx' firing 150
goi /admin/fail-off; sleep 15; dien_thoai | tail -1
docker stop lgz-c15-api >/dev/null; date -u +%T; cho_luat 'shop-api im lặng' firing 300
sleep 15; dien_thoai | tail -1
docker start lgz-c15-api >/dev/null; date -u +%T; cho_luat 'shop-api im lặng' inactive 180
sleep 70; dien_thoai
