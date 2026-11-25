# 14.1 — dò mật khẩu: nhồi thông tin đăng nhập trên web, rải mật khẩu qua SSH, rải mật khẩu Kerberos trên Windows. Dữ liệu: vu14 (sinh bởi tao-vu.py) + EVTX công khai.
cd vu14/web01/var/log && grep '"POST /api/login[^"]*" 401' nginx/access.log | awk '{print substr($4, 2, 14) "h"}' | uniq -c | sort -rn | head -n 4
cd vu14/web01/var/log && jq -r 'select(.msg == "login failed") | [(.time / 1000 | floor | todate[0:13]), .ip, .user] | @tsv' shop/app.jsonl | awk '$1 == "2026-11-18T18" {n++; ip[$2]++; u[$3]++} END {print n, "lần hỏng |", length(ip), "IP |", length(u), "tài khoản"}'
cd vu14/web01/var/log && jq -r 'select(.msg == "login failed" and (.ip | startswith("198.51.100.1"))) | .user' shop/app.jsonl | sort | uniq -c | awk '{print $1}' | sort -n | uniq -c
cd vu14/web01/var/log && jq -r 'select(.msg == "login failed" and (.ip | startswith("198.51.100.1"))) | .reason' shop/app.jsonl | sort | uniq -c
cd vu14/web01/var/log && jq -r 'select(.msg == "login ok" and (.ip | startswith("198.51.100.1"))) | [(.time / 1000 | floor | todate), .user, .ip, .reqId] | @tsv' shop/app.jsonl
cd vu14/web01/var/log && grep -c '"POST /api/login[^"]*" [0-9]* [0-9]* "-" "python-requests' nginx/access.log
cd vu14/logsrv/web01 && grep -oE 'Failed password for (invalid user )?\S+ from \S+' auth-syslog.log | awk '{print $NF}' | sort | uniq -c | sort -rn | head -n 5
cd vu14/logsrv/web01 && grep 'from 203.0.113.77' auth-syslog.log | grep -oE 'Failed password for (invalid user )?\S+' | awk '{print $NF}' | sort | uniq -c | awk '{print $1 " lần/tài khoản"}' | sort | uniq -c
cd vu14/logsrv/web01 && grep 'Failed password.*from 203.0.113.77' auth-syslog.log | cut -c1-16 | uniq -c
cd vu14/logsrv/web01 && grep -E 'Accepted \S+ for \S+ from 203\.0\.113\.77' auth-syslog.log
cd vu14/web01/var/log && grep -c '203.0.113.77' auth.log
cd vu14/logsrv/web01 && grep -E 'Failed password' auth-syslog.log | awk '{ip = $(NF-3); h = substr($1, 1, 13); u = $(NF-5); k = ip " " h; if (!((k, u) in da)) {da[k, u] = 1; so[k]++}} END {for (k in so) if (so[k] >= 10) print so[k], "tài khoản khác nhau |", k}' | sort -rn
@ps evtx-rec tc/kerberos-spray-4771.evtx | ConvertFrom-Json | Where-Object id -in 4768, 4771 | Select-Object @{n='Gio'; e={$_.t.ToString('HH:mm:ss.fff')}}, id, @{n='TaiKhoan'; e={$_.data.TargetUserName}}, @{n='Status'; e={$_.data.Status}}, @{n='IP'; e={$_.data.IpAddress}} | Format-Table -AutoSize
evtx-rec tc/local-4776-4625.evtx | jq -r '[.data.TargetUserName, .data.SubStatus, .data.ProcessName] | @tsv' | sort | uniq -c
