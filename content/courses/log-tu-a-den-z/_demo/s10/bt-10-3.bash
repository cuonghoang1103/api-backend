# Lời giải 🧪 10.3 câu 2–3 — trên mẫu IIS của gói log (giờ trong tệp là UTC)
awk '!/^#/ {print substr($2, 1, 2)}' windows/u_ex261120.log | sort | uniq -c | sort -rn | head -n 3
awk '!/^#/ {print substr($2, 1, 2)}' windows/u_ex261120.log | sort | uniq -c | sort -rn | head -n 3 | awk '{printf "%s req  %s:00 UTC = %02d:00 gio VN\n", $1, $2, ($2 + 7) % 24}'
awk '!/^#/ && $5 == "/portal/report.aspx" {printf "%.3f s  %s  %s %s\n", $15 / 1000, $12, $1, $2}' windows/u_ex261120.log | sort -rn | head -n 5
awk '!/^#/ {print substr($2, 1, 2)}' windows/u_ex261120.log | sort | uniq -c | sort -rn | sed -n 4p
