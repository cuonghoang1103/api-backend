# 10.9 — lệnh bổ sung cho video (chạy thật 24/11/2026 trên cùng log Lab 10, scratchpad/lgz/chay/logs)
awk '$1 == "203.0.113.66" {print substr($4, 14)}' logs/access.log | sort | sed -n '1p;$p'
awk '$7 == "/api/login" && $1 ~ /^192\.0\.2\./ {print substr($4, 14), $1, $9}' logs/access.log | head -n 9
awk '$7 == "/api/login" && $9 == 200' logs/access.log | wc -l
