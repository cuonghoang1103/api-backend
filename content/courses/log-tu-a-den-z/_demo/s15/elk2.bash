# 15.3 (tiếp) — một lỗi bóc trường THẬT của module system/auth 9.5.7: "invalid user X" ⇒ user.name có dấu cách đầu
es '_query?format=txt' -d '{"query":"FROM filebeat-* | WHERE event.dataset == \"system.auth\" AND system.auth.ssh.event == \"Failed\" | EVAL dai = LENGTH(user.name) | STATS lan = COUNT(*) BY user.name, dai | SORT lan DESC | LIMIT 4"}'
kql 'user.name : "git"'
kql 'user.name : " git"' 'source.ip,user.name'
kql 'event.original : *invalid\ user\ git*'
es 'filebeat-*/_mapping/field/event.original' | jq -c '.[].mappings'
