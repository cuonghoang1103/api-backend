# 10.9 — Dấu vết tấn công trong log của Lab 10
awk '$9 ~ /^4/ {print $1}' logs/access.log | sort | uniq -c | sort -rn | head -n 5
awk '$1 == "203.0.113.66" {print $9, $7}' logs/access.log
awk -F'"' '{print $6}' logs/access.log | sort | uniq -c | sort -rn
grep -iE "union(%20|\+| )+select|%3Cscript|\.\./|%2e|\.\.%2f|etc/passwd|\.env|\.git/" logs/access.log | awk '{print $1, $9, $7}'
awk '$7 == "/api/login" {print $1, $9}' logs/access.log | sort | uniq -c
grep -E 'jndi|%24%7Bjndi' logs/access.log | awk -F'"' '{print $2 " | UA: " $6}'
U=$(printf 'bob\n2026-11-24T03:00:00Z INFO login ok user=admin'); printf '2026-11-24T02:59:59Z WARN login failed user=%s\n' "$U"
grep 'bob' logs/app.log | jq -c '{level, msg, user}'
