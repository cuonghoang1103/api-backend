awk '{print $1}' web/access.log | sort | uniq -c | sort -nr | head -n 5
awk '{print $9}' web/access.log | sort | uniq -c | sort -nr
awk '$9 >= 500 {print $7}' web/access.log | sort | uniq -c | sort -nr | head -n 5
awk '{print substr($4, 2, 17)}' web/access.log | sort | uniq -c | sort -nr | head -n 3
awk '{print substr($4, 14, 2)}' web/access.log | sort | uniq -c | sort -k2n | head -n 5
awk '$9 >= 500 {e++} END {printf "%d/%d = %.2f%%\n", e, NR, 100*e/NR}' web/access.log
awk '{b += $10} END {printf "%.1f MB\n", b/1024/1024}' web/access.log
awk -F'"' '{print $6}' web/access.log | sort | uniq -c | sort -n | head -n 4 | cut -c1-90
cut -d' ' -f1 web/access.log | sort | uniq -c | sort -nr | head -n 1
