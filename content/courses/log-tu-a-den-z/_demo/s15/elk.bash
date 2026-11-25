# 15.3 — Elasticsearch + Kibana + Filebeat 9.5.7 (cwd = bản sao thư mục elk; cần BASH_ENV=cong-cu/elk-env.bash; Kibana qua cầu socket cổng 45601)
docker compose ps --format '{{.Name}}  {{.Status}}'
docker stats --no-stream --format '{{.Name}}  {{.MemUsage}}' lgz-c15e-es lgz-c15e-kibana lgz-c15e-filebeat
es '_cat/indices/.ds-filebeat-*?v&h=index,docs.count,store.size'
es 'filebeat-*/_search?size=1&q=event.dataset:nginx.access&sort=@timestamp:desc' | jq '.hits.hits[0]._source | {"@timestamp", "source.ip": .source.ip, "http.request.method": .http.request.method, "url.original": .url.original, "http.response.status_code": .http.response.status_code, "user_agent.name": .user_agent.name, "event.original": .event.original}'
es 'filebeat-*/_search?size=1&q=event.dataset:system.auth%20AND%20source.ip:198.51.100.23&sort=@timestamp:desc' | jq -c '.hits.hits[0]._source | {"@timestamp", tz: .event.timezone, user: .user.name, ip: .source.ip, ssh: .system.auth.ssh.event}'
grep 'from 198.51.100.23' mau/linux/auth.log | tail -1
kql 'event.dataset : "system.auth" and system.auth.ssh.event : "Failed"' 'source.ip,user.name'
docker compose -f compose.yaml -f tz.yaml stop filebeat >/dev/null 2>&1; es '_data_stream/filebeat-9.5.7' -XDELETE; echo; docker compose -f compose.yaml -f tz.yaml rm -f -v filebeat >/dev/null 2>&1; docker volume rm lgz-c15e_fb-data >/dev/null; docker compose -f compose.yaml -f tz.yaml up -d filebeat 2>/dev/null; for i in $(seq 40); do [ "$(es 'filebeat-*/_count' | jq .count)" = 4268 ] && break; sleep 3; done; es 'filebeat-*/_count' | jq -c '{count}'
es 'filebeat-*/_search?size=1&q=event.dataset:system.auth%20AND%20source.ip:198.51.100.23&sort=@timestamp:desc' | jq -c '.hits.hits[0]._source | {"@timestamp", tz: .event.timezone, user: .user.name, ip: .source.ip, ssh: .system.auth.ssh.event}'
kql 'event.dataset : "system.auth" and system.auth.ssh.event : "Failed"' 'source.ip,user.name'
kql 'event.dataset : "nginx.access" and http.response.status_code >= 500' 'source.ip,url.original,http.response.status_code'
kql 'url.original : /api/v1/auth/* and not http.response.status_code : 200' 'source.ip,url.original,http.response.status_code'
kql 'source.ip : "203.0.113.0/24" and event.dataset : "nginx.access"' 'source.ip,url.original,user_agent.original'
kql 'user_agent.original : *python* or user_agent.original : *sqlmap*' 'source.ip,user_agent.original'
kql 'http.response.status_code >= 500 and not url.original : /api/*'
kql 'status : 500'
es '_query?format=txt' -d '{"query":"FROM filebeat-* | WHERE event.dataset == \"system.auth\" AND system.auth.ssh.event == \"Failed\" | STATS lan = COUNT(*) BY source.ip | SORT lan DESC | LIMIT 5"}'
es '_query?format=txt' -d '{"query":"FROM filebeat-* | WHERE event.dataset == \"nginx.access\" | EVAL gio = DATE_TRUNC(1 hour, @timestamp) | STATS loi5xx = COUNT(*) WHERE http.response.status_code >= 500, tong = COUNT(*) BY gio | WHERE loi5xx > 0 | SORT gio"}'
