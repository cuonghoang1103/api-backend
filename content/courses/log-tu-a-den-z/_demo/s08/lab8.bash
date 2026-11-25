# Lab 8 — ĐÁP ÁN: điều tra "một đêm bị dò SSH" trên lab7 (chạy SAU lab8-tan-cong.bash). Chỉ đọc log, không đọc kịch bản.
# Ghi chú: output lệnh "ls -la /home/test/.ssh" là của lượt chạy ĐẦU (trước bước ngăn chặn lab8-ngan.bash chuyển tệp đi làm bằng chứng).
sudo awk '$1>="2026-11-24T22:40" && $1<"2026-11-25T08:30"' /var/log/auth.log > dem8.log; wc -l < dem8.log; head -2 dem8.log; tail -1 dem8.log
grep -oE 'sshd\[[0-9]+\]: [A-Z][a-z]+( [a-z]+)?' dem8.log | sed -E 's/sshd\[[0-9]+\]: //' | sort | uniq -c | sort -rn | head -8
grep -cE 'Failed password' dem8.log; grep -cE 'Invalid user' dem8.log
grep -E 'Failed password' dem8.log | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn
awk '/Failed password/{h=substr($1,9,2)"/"substr($1,12,2)"h"; for(i=1;i<=NF;i++) if($i=="from") ip=$(i+1); c[ip"  "h]++} END{for(k in c) print c[k]"\t"k}' dem8.log | sort -t$'\t' -k2
grep 'Failed password' dem8.log | awk '{for(i=1;i<=NF;i++) if($i=="for"){u=($(i+1)=="invalid")?$(i+3):$(i+1)}; print u}' | sort | uniq -c | sort -rn | head -8
grep 'Failed password' dem8.log | grep 192.168.56.66 | awk '{print substr($1,12,8)}' | sed -n '1p;$p'; grep 'Failed password' dem8.log | grep 192.168.56.77 | awk '{print substr($1,12,8)}' | tr '\n' ' '; echo
grep -E 'Accepted' dem8.log
awk '/Failed password/{for(i=1;i<=NF;i++) if($i=="from") sai[$(i+1)]++} /Accepted/{for(i=1;i<=NF;i++) if($i=="from"){ip=$(i+1); if(sai[ip]>0) print "ĐỎ: " ip " vào được sau " sai[ip] " lần sai —", substr($0,1,26), $(i-3), $(i-1)}}' dem8.log
grep -E 'useradd|chpasswd|COMMAND=/usr/bin/bash' dem8.log | cut -c1-170
grep -E 'sudo: +test|pam_unix\(sshd:session\).*test|systemd-logind.*test' dem8.log | cut -c1-150
sudo last -F -w test; sudo lastb -w | awk 'NF>8{print $3}' | sort | uniq -c | sort -rn
sudo ausearch --input-logs -ua test --format text 2>/dev/null | grep -vE 'acting as root|/usr/lib/systemd|/proc/self|/bin/systemctl' | cut -c1-140
sudo ausearch --input-logs -k identity -ts 11/24/2026 22:40:00 --format text 2>&1 | head -2; sudo ausearch --input-logs -k identity -ts 11/24/26 22:40:00 --format text 2>/dev/null | cut -c1-140 | sort -u | head -6
sudo ls -la /home/test/.ssh; sudo cat /home/test/.ssh/authorized_keys | cut -c1-40,80-; sudo ssh-keygen -lf /home/test/.ssh/authorized_keys
grep 'Accepted publickey for test' dem8.log | grep -oE 'ED25519 SHA256:[^ ]+'
sudo journalctl -u ssh -q --no-pager --since '2026-11-24 22:40' --until '2026-11-25 08:30' | grep -c 'Failed password'; sudo journalctl -u ssh -q --no-pager -o short-iso | grep 'Accepted publickey for test' | cut -c1-100
rm dem8.log
