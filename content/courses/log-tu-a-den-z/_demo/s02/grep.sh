grep -c ' 502 ' web/access.log
grep -ci 'nikto' web/access.log
grep -c -v ' 200 ' web/access.log
grep -E '" 5[0-9]{2} ' web/access.log | head -n 2 | cut -c1-100
grep -oE '^[0-9]{1,3}(\.[0-9]{1,3}){3}' web/access.log | sort -u | wc -l
grep -n 'Accepted' -B 2 -A 2 linux/auth.log | cut -c1-110
grep -c 'ECONNREFUSED' app/app.jsonl incident/app.jsonl
grep -h 'ECONNREFUSED' app/app.jsonl incident/app.jsonl | wc -l
grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[+-][0-9]{2}:[0-9]{2}' incident/journal-api01.txt | head -n 2
grep -F '${jndi:' web/access.log | cut -c1-120
grep -o '".*"' incident/nginx-error.log | head -n 1 | cut -c1-120
grep -o '"[^"]*"' incident/nginx-error.log | head -n 2
sed -E 's/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\.[0-9]{1,3}/\1.x/' web/access.log | head -n 1 | cut -c1-70
rg -c ' 50[24] ' web/
