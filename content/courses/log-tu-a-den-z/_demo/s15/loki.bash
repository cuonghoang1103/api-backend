# 15.2 — Loki + Alloy + Grafana: nhãn, LogQL (cwd = bản sao thư mục loki; BASH_ENV=cong-cu/loki-env.bash)
docker exec lgz-c15-net wget -qO- 127.0.0.1:12345/api/v0/web/components | jq -r '.[] | "\(.localID)\t\(.health.state)"'
logcli labels
logcli labels unit --since 1h
logcli series --since 1h '{job=~".+"}' | sort
for i in $(seq 40); do goi /api/orders; done; goi /admin/fail-on; for i in $(seq 5); do goi /api/pay; done; goi /admin/fail-off; goi /khong-co; do_ssh 3 root; do_ssh 2 an; sleep 4; echo xong
logcli query --since 5m --limit 3 '{container="lgz-c15-api"}'
logcli query --since 5m --limit 3 '{container="lgz-c15-api", level="error"}'
logcli query --since 5m --limit 3 '{container="lgz-c15-api"} | json | status >= 500 | line_format "{{.time}} {{.method}} {{.path}} {{.status}} err={{.err}}"'
logcli query --since 5m --limit 3 '{container="lgz-c15-api"} | json | path != "/healthz" | ms > 40 | line_format "{{.rid}} {{.path}} {{.ms}} ms"'
logcli query --since 10m --limit 5 '{unit="ssh.service"} |~ "Failed password|Accepted" | regexp "(?P<ket_qua>Failed|Accepted) password for (invalid user )?(?P<user>\\S+) from (?P<ip>\\S+)" | line_format "{{.ket_qua}} user={{.user}} ip={{.ip}}"'
logcli instant-query 'sum by (user) (count_over_time({unit="ssh.service"} |= "Failed password" | regexp "for (invalid user )?(?P<user>\\S+) from" [10m]))' | jq -c '.[] | {metric, value: .value[1]}'
logcli instant-query 'sum by (status) (count_over_time({container="lgz-c15-api"} | json | path != "/healthz" [5m]))' | jq -c '.[] | {metric, value: .value[1]}'
logcli instant-query 'quantile_over_time(0.95, {container="lgz-c15-api"} | json | path="/api/orders" | unwrap ms [5m])' | jq 'length'
logcli instant-query 'quantile_over_time(0.95, {container="lgz-c15-api"} | json | path="/api/orders" | unwrap ms [5m]) by (path)' | jq -c '.[] | {metric, value: .value[1]}'
logcli instant-query 'sort_desc(topk(3, sum by (path) (count_over_time({container="lgz-c15-api"} | json [5m]))))' | jq -c '.[] | {metric, value: .value[1]}'
logcli query --limit 2 --from 2026-11-19T17:00:00Z --to 2026-11-20T17:00:00Z '{job="file", host="web-01"} |= "Accepted"'
logcli query --since 1h '{job="file"}' 2>&1 | wc -l
logcli series --since 1h --analyze-labels '{job=~".+"}' 2>&1
lcurl -u admin:$GF_SECURITY_ADMIN_PASSWORD 127.0.0.1:3000/api/datasources | jq -c '.[] | {name, type, url, isDefault}'
lcurl -u admin:$GF_SECURITY_ADMIN_PASSWORD -H 'content-type: application/json' 127.0.0.1:3000/api/ds/query -d '{"from":"now-5m","to":"now","queries":[{"refId":"A","datasource":{"uid":"loki-lab"},"expr":"sum(count_over_time({container=\"lgz-c15-api\", level=\"error\"}[5m]))","queryType":"instant"}]}' | jq -c '.results.A.frames[0].data.values'
