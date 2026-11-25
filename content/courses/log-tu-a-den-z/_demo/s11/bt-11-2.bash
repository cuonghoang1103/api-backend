# Lời giải 🧪 Bài 11.2 (chạy thật ngay sau dns.bash)
@win Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-DNS-Client/Operational'; Id=3008; StartTime=(Get-Date).AddHours(-1)} | ForEach-Object { ($_.Message -split ' ')[7].TrimEnd(',') } | Group-Object | Sort-Object Count -Descending | Select-Object -First 10 Count,Name
sudo awk '/ is NXDOMAIN/ {split($5, a, "/"); print a[1]}' /var/log/remote/wrt-nha.log | sort | uniq -c
sudo awk '$6 == "query[TXT]" {split($7, n, "."); printf "%s", n[1]}' /var/log/remote/wrt-nha.log | tr a-z A-Z | awk '{ s = $0; while (length(s) % 8) s = s "="; print s }' | base32 -d; echo
