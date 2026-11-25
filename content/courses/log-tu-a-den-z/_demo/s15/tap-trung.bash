# 15.1 — vì sao gom tập trung (cwd = bản sao thư mục loki; BASH_ENV=cong-cu/loki-env.bash). Loki 3.7.10 + Alloy 1.22.0.
docker compose ps --format '{{.Name}}  {{.Image}}  {{.Status}}'
do_ssh 4 admin; docker exec lgz-c15-vm journalctl -u ssh --no-pager | grep -c 'Failed password'
sleep 3; logcli query --since 10m '{host="lab15", unit="ssh.service"} |= "Failed password"'
docker exec lgz-c15-vm sh -c 'journalctl --rotate >/dev/null 2>&1; journalctl --vacuum-time=1s 2>&1 | grep -E "^Deleted|freed" | sed "s#/[0-9a-f]\{32\}/#/<machine-id>/#"'
docker exec lgz-c15-vm journalctl -u ssh --no-pager | grep -c 'Failed password'
logcli query --since 10m '{host="lab15", unit="ssh.service"} |= "Failed password"' | wc -l
docker stop lgz-c15-loki >/dev/null; date -u +%T; for i in $(seq 30); do goi /api/orders?mat-mang=$i; done; logcli query --since 1m '{container="lgz-c15-api"}' 2>&1 | tail -1
docker exec lgz-c15-net wget -qO- 127.0.0.1:12345/metrics | grep -E '^loki_write_(batch_retries_total|request_duration_seconds_count|sent_entries_total)' | sed -E 's/component_id="[^"]*",component_path="[^"]*",host="[^"]*",?//; s/\{\}//'
sleep 30; docker start lgz-c15-loki >/dev/null; until docker exec lgz-c15-net wget -qO- 127.0.0.1:3100/ready 2>/dev/null | grep -q ready; do sleep 2; done; date -u +%T; sleep 20; logcli query --since 5m --limit 100 '{container="lgz-c15-api"} |= "mat-mang"' | wc -l
logcli instant-query 'sum(count_over_time({container="lgz-c15-api"} |= "mat-mang" [5m]))'
docker exec lgz-c15-net wget -qO- 127.0.0.1:12345/metrics | grep -E '^loki_write_(batch_retries_total|request_duration_seconds_count|sent_entries_total)' | sed -E 's/component_id="[^"]*",component_path="[^"]*",host="[^"]*",?//; s/\{\}//'; docker exec lgz-c15-net wget -qO- 127.0.0.1:12345/metrics | grep -E '^loki_write_dropped_entries_total' | awk '{s+=$2} END {print "loki_write_dropped_entries_total (mọi lý do) =", s}'
docker run -d --name lgz-c15-loki-macdinh --network none grafana/loki:3.7.10 >/dev/null; sleep 25; docker logs lgz-c15-loki-macdinh 2>&1 | grep -m1 'disk usage' | sed 's/ ts=[^ ]*//'; docker rm -f lgz-c15-loki-macdinh >/dev/null
