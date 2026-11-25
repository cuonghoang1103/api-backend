# 10.3 — Log IIS (W3C) trong gói log mẫu: dòng #Fields là "bản đồ cột"; giờ ghi theo UTC
head -n 5 windows/u_ex261120.log
grep -m1 '^#Fields' windows/u_ex261120.log | tr ' ' '\n' | tail -n +2 | nl
awk '!/^#/ {print $12 "." $13}' windows/u_ex261120.log | sort | uniq -c | sort -rn
awk '!/^#/ && $12 >= 500 {print $1, $2, $5, $12, $15 " ms"}' windows/u_ex261120.log | head -n 4
awk '!/^#/ {s[$5] += $15; n[$5]++} END {for (k in s) printf "%-22s %4d req  tb %5.0f ms\n", k, n[k], s[k] / n[k]}' windows/u_ex261120.log | sort -k4 -rn
