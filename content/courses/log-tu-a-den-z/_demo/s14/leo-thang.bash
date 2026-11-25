# 14.3 — leo thang quyền và bám trụ: sudo khác đường nền, tài khoản mới vào nhóm sudo, auditd (khoá SSH, tải công cụ, cron, systemd), cron chạy công cụ; Windows 4720/4732/4698/7045/Sysmon 13.
cd vu14/logsrv/web01 && grep -oE 'sudo: +\S+ : .*COMMAND=.*' auth-syslog.log | sed -E 's/TTY=\S+ ; PWD=\S+ ; //' | sort | uniq -c | sort -rn
cd vu14/logsrv/web01 && grep -E 'useradd|usermod|chpasswd|groupadd' auth-syslog.log | cut -c1-19,33-
cd vu14/web01/var/log/audit && grep -oE 'key="[^"]+"' audit.log | sort | uniq -c
cd vu14/web01/var/log/audit && awk '/key="(ssh_keys|tai_ve|cron|systemd)"/ {match($0, /audit\([0-9.]+:[0-9]+\)/); id = substr($0, RSTART, RLENGTH); k[id] = $0} /^type=(PATH|EXECVE)/ {match($0, /audit\([0-9.]+:[0-9]+\)/); id = substr($0, RSTART, RLENGTH); if (id in k) {split(id, a, /[(:.]/); match(k[id], /key="[^"]+"/); kk = substr(k[id], RSTART, RLENGTH); match(k[id], /auid=[0-9]+/); au = substr(k[id], RSTART, RLENGTH); match(k[id], /comm="[^"]+"/); cm = substr(k[id], RSTART, RLENGTH); sub(/^type=[A-Z]+ msg=audit\([0-9.:]+\): /, ""); print a[2], kk, au, cm, $0}}' audit.log | while read e r; do echo "$(TZ='<+07>-7' date -d @$e +%H:%M:%S) $r" | cut -c1-150; done
cd vu14/web01/var/log/audit && grep -E 'CONFIG_CHANGE|ADD_USER|ADD_GROUP|USER_CMD' audit.log | while read l; do e=$(echo "$l" | grep -oE 'audit\([0-9]+' | tr -dc 0-9); echo "$(TZ='<+07>-7' date -d @$e '+%d/%m %H:%M:%S') ${l%% msg=*} $(echo "$l" | grep -oE "(op=[a-z-]+|audit_enabled=[0-9]+|old=[0-9]+|auid=[0-9]+|acct=\"[^\"]+\"|grp=\"[^\"]+\"|cmd=\"[^\"]+\")" | tr '\n' ' ')"; done
cd vu14/web01/var/log && grep -E 'dbus-sync|kworkerd' syslog | head -n 4; grep -c 'kworkerd' syslog
cd vu14/thu-thap && sed -n '/cron.d/,/kworkerd -q/p' stat.txt
evtx-rec tc/user-4720.evtx tc/admin-4732.evtx | jq -r '[.t[0:19], .may, .id, .data.TargetUserName, .data.SamAccountName, .data.MemberSid, .data.SubjectUserName] | @tsv' | sort -u
evtx-rec tc/apt-4720-4698.evtx | jq -r '[.t[0:19], .id, .data.TargetUserName // .data.TaskName, .data.SubjectUserName] | @tsv'
evtx-rec tc/apt-4720-4698.evtx | jq -r 'select(.id == 4698) | .data.TaskContent' | grep -oE '<(Command|Arguments|UserId|RunLevel)>[^<]*' | cut -c1-120
evtx-rec tc/svc-7045.evtx | jq -r 'select(.id == 7045) | [.t[0:19], .may, .data.ServiceName, .data.ImagePath, .data.StartType, .data.AccountName] | @tsv'
evtx-rec tc/runkey-sysmon13.evtx | jq -r '[.t[0:19], .data.Image, .data.TargetObject, .data.Details] | @tsv'
