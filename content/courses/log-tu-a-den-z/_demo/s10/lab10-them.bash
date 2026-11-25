# 10.10 — lệnh bổ sung cho video (chạy thật 24/11/2026 trên cùng log Lab 10, scratchpad/lgz/chay/logs)
awk '{print $9}' logs/access.log | sort | uniq -c | sort -rn | head -n 4
awk '$7 ~ /^\/api\/report/ {print $(NF-2), $(NF-1), $9}' logs/access.log | sort -t= -k2 -rn | head -n 4
awk '$9 == 502' logs/access.log | awk '{print $4}' | sort | uniq -c
awk '$9 == 502 {split($7, p, "?"); print p[1]}' logs/access.log | sort | uniq -c | sort -rn
grep -E 'prematurely|timed out' logs/error.log | cut -c1-150
grep -E '" (499|504) ' logs/access.log | awk '{print $4, $1, $9, $7, $(NF-2), $(NF-1)}'
TZ=Asia/Ho_Chi_Minh date -d '2026-11-23 20:35:01Z' '+%d/%m/%Y %H:%M:%S %Z'
