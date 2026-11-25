# 14.7 — đọc và CHẤM quy tắc Sigma thật (SigmaHQ) trên log mẫu: logsource, detection, condition, filter; quy tắc nào bắt được gì, cái nào bỏ sót.
!for f in tc/*.evtx mau/*.evtx; do evtx-rec "$f" > /lab/ra/$(basename "$f" .evtx).jsonl; done
ls /lab/ra/*.jsonl | wc -l; cat /lab/ra/*.jsonl | wc -l
python3 s14/mau/sigma-mini.py s14/mau/sigma/win_security_audit_log_cleared.json /lab/ra/*.jsonl
python3 s14/mau/sigma-mini.py s14/mau/sigma/win_system_eventlog_cleared.json /lab/ra/*.jsonl
cat /lab/ra/*.jsonl | jq -r 'select(.id == 104 and .nguon == "Microsoft-Windows-Eventlog") | [.kenh, .data.Channel] | @tsv' | awk -F'\t' '{print "kênh ghi:", $1, "| log bị xoá:", ($2 == "System" || $2 == "Security" ? $2 : "(kênh khác)")}' | sort | uniq -c
python3 s14/mau/sigma-mini.py s14/mau/sigma/win_security_user_added_to_local_administrators.json /lab/ra/*.jsonl
python3 s14/mau/sigma-mini.py s14/mau/sigma/win_system_susp_service_installation_folder.json /lab/ra/*.jsonl
python3 s14/mau/sigma-mini.py s14/mau/sigma/win_security_susp_failed_logon_reasons.json /lab/ra/*.jsonl
cat /lab/ra/*.jsonl | jq -r 'select(.id == 4625) | .data.SubStatus' | sort | uniq -c | sort -rn | head -n 5
cat /lab/ra/*.jsonl | jq -c 'select(.id == 4625 and .data.SubStatus == "0xc0000072") | {t: .t[0:19], may, d: (.data | {TargetUserName, SubjectUserSid, LogonType, IpAddress})}'
python3 s14/mau/sigma-mini.py s14/mau/sigma/lnx_sshd_susp_ssh.json vu14/logsrv/web01/auth-syslog.log lab14/api02/var/log/auth.log
