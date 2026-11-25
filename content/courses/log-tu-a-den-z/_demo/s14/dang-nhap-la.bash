# 14.2 — đăng nhập bất thường: lập đường nền 14 ngày trước rồi tìm "lần đầu tiên"; giờ lạ; di chuyển bất khả; RDP qua đường hầm (EVTX công khai).
cd vu14/logsrv/web01 && grep -oE 'Accepted \S+ for \S+ from \S+' auth-syslog.log | sort | uniq -c | sort -rn
cd vu14/logsrv/web01 && grep -E 'Accepted \S+ for deploy ' auth-syslog.log | cut -c12-13 | sort | uniq -c
cd vu14/logsrv/web01 && grep -E 'Accepted ' auth-syslog.log | awk '{split($0, a, "Accepted "); split(a[2], b, " "); k = b[1] " " b[3] " " b[5]} $1 < "2026-11-19" {nen[k] = 1; next} !(k in nen) {print "MỚI:", substr($1, 1, 19), k}'
cd vu14 && grep -vE '^#' geo.csv
cd vu14 && python3 /lab/s14/mau/di-chuyen.py web01/var/log/shop/app.jsonl geo.csv
cd vu14 && jq -r 'select(.user == "lan@mail.example" and .msg == "login ok") | [(.time / 1000 | floor | todate), .ip] | @tsv' web01/var/log/shop/app.jsonl | tail -n 4
cd vu14/web01/var/log && jq -r 'select(.reqId == "0eaea4ce741d937dffaea1d394d5986a") | .msg' shop/app.jsonl; grep -c 'rid=0eaea4ce741d937dffaea1d394d5986a' nginx/access.log; awk '$1 == "198.51.100.165" {print $4, $6, $7, $9}' nginx/access.log | tail -n 3
evtx-rec tc/rdp-tunnel-4624.evtx | jq -r 'select(.data.LogonType == 10 or .data.LogonType == 2) | [.t[0:19], .data.LogonType, .data.IpAddress, .data.TargetUserName, .data.LogonProcessName] | @tsv'
evtx-rec tc/rdp-tunnel-4624.evtx | jq -r 'select(.data.TargetUserName == "sshd_server") | [.t[0:19], .data.LogonType, .data.TargetUserName] | @tsv'
