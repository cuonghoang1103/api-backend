# Lời giải 🧪 bài 10.8 — chạy thật 24/11/2026 trên Lab 10 dựng lại (~/.rtq-lgz/c10; cùng lưu lượng tất định), jq 1.8.1 trên máy chủ
jq -c '{"@timestamp": .time, "source.ip": .ip, "http.request.method": .method, "url.original": .uri, "http.response.status_code": .status, "event.duration": (.rt * 1e9 | round), "user_agent.original": .ua, "trace.id": .rid}' logs/access.json > ecs.json; wc -l < ecs.json; jq -s '[.[]."http.response.status_code" | type] | unique' ecs.json
jq -c 'select(."http.response.status_code" == 500)' ecs.json | head -n 1 | jq .
jq -R -r '. as $l | try (fromjson | empty) catch $l' logs/app.log | wc -l; jq -R -r '. as $l | try (fromjson | empty) catch $l' logs/app.log | sed -n '1p;$p'
jq -R -r 'fromjson? | paths(scalars) as $p | "\($p | map(tostring) | join("."))\t\(getpath($p) | type)"' logs/app.log | sort -u | cut -f1 | uniq -d | wc -l
jq -R -r 'fromjson? | .res.statusCode | type' logs/app.log | sort | uniq -c
jq -R -r 'fromjson? | select(.res.statusCode == null) | .msg' logs/app.log | sort | uniq -c | sort -rn
jq -r '[(.rt | type), (.urt | type)] | join(" ")' logs/access.json | sort | uniq -c
