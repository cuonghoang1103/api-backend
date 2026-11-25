# 14.4 — khi kẻ tấn công xoá log: so bản cục bộ với bản đã gửi về máy chủ log; phiên "mồ côi"; khoảng lặng; tệp bị tạo lại; lịch sử lệnh; Windows 1102/104.
cd vu14 && wc -l web01/var/log/auth.log logsrv/web01/auth-syslog.log
cd vu14 && grep -E 'sshd|sudo|CRON\[[0-9]+\]: pam_unix|useradd|usermod|chpasswd' logsrv/web01/auth-syslog.log | grep -vxFf web01/var/log/auth.log | awk '{print substr($1, 1, 16)}' | uniq -c
cd vu14 && grep -E 'sshd|sudo|CRON\[[0-9]+\]: pam_unix|useradd|usermod|chpasswd' logsrv/web01/auth-syslog.log | grep -vxFf web01/var/log/auth.log | sed -E 's/^\S+ \S+ ([a-z]+)(\[[0-9]+\])?: +/\1: /' | awk '{print $1, $2, $3}' | sort | uniq -c | sort -rn
cd vu14/web01/var/log && awk '/sshd\[[0-9]+\]: Accepted/ {match($3, /[0-9]+/); ok[substr($3, RSTART, RLENGTH)] = 1} /sshd\[[0-9]+\]: pam_unix\(sshd:session\): session opened/ {match($3, /[0-9]+/); p = substr($3, RSTART, RLENGTH); if (!(p in ok)) print "MỒ CÔI:", $0}' auth.log
cd vu14/logsrv/web01 && awk '{s = substr($1, 1, 19); x = s; gsub(/[-T:]/, " ", x); t = mktime(x); if (NR > 1 && t - tr >= 3600) printf "LẶNG %d phút: %s → %s\n", (t - tr) / 60, truoc, s; tr = t; truoc = s}' auth-syslog.log
cd vu14/web01/var/log/audit && awk -F'[(:.]' '{t = $2; if (NR > 1 && t - tr > 3700) print "auditd LẶNG", int((t - tr) / 60), "phút:", tr, "→", t; tr = t}' audit.log | while read a b c d e f g; do echo "$a $b $c $d $(TZ='<+07>-7' date -d @$e '+%d/%m %H:%M:%S') → $(TZ='<+07>-7' date -d @$g '+%d/%m %H:%M:%S')"; done
cd vu14/logsrv && cat canh-bao.log
cd vu14/web01/var/log && grep rsyslogd syslog
cd vu14/thu-thap && sed -n '/stat -c/,/var\/log\/syslog$/p;/bash_history/,/root\/.bash_history$/p' stat.txt
evtx-rec tc/clear-1102.evtx tc/clear-104.evtx tc/svc-7045.evtx | jq -r 'select(.id == 1102 or .id == 104) | [.t[0:19], .may, .kenh, .id, .data.SubjectUserName, .data.Channel // "Security", .rec] | @tsv'
evtx-rec tc/svc-7045.evtx | jq -r '[.t[0:19], .id, .data.SubjectUserName // .data.ServiceName] | @tsv'
