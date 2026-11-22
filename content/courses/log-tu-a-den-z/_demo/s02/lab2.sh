wc -l < web/access.log
awk '{print $1}' web/access.log | sort | uniq -c | sort -nr | head -n 10
awk '$9 >= 400 {print $9, $7}' web/access.log | sort | uniq -c | sort -nr | head -n 5
awk '{print substr($4, 2, 17)}' web/access.log | sort | uniq -c | sort -nr | head -n 1
awk '$9 >= 500 {e++} END {printf "%.2f%%\n", 100*e/NR}' web/access.log
awk -F'"' '{print $6}' web/access.log | sort | uniq -c | sort -n | head -n 3 | cut -c1-80
awk '$9 == 401 {print $1}' web/access.log | sort | uniq -c | sort -nr | head -n 1
grep '^203.0.113.66 ' web/access.log | awk '$9 == 200 {print $4, $6, $7, $9}'
awk '{print substr($4, 14, 2)}' web/access.log | sort | uniq -c | sort -nr | head -n 1
awk '{b += $10} END {printf "%.1f MB\n", b/1024/1024}' web/access.log
