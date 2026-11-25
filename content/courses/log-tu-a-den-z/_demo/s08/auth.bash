# 8.3 — tạo 2 người dùng lab: an (nhóm sudo) và dev (không sudo). Mật khẩu là của lab, không dùng ở đâu khác.
sudo useradd -m -s /bin/bash -G sudo an && echo 'an:An-Lab-2026!' | sudo chpasswd && sudo useradd -m -s /bin/bash dev && echo 'dev:Dev-Lab-2026!' | sudo chpasswd; id an; id dev
sudo grep -E 'useradd|chpasswd|usermod' /var/log/auth.log | tail -6
@keodo sshpass -p 'Dev-Lab-2026!' ssh -o StrictHostKeyChecking=no -b 192.168.56.20 dev@192.168.56.10 'echo "dev vào được: $(hostname)"'
@keodo sshpass -p 'doan-bua' ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=no -b 192.168.56.88 dev@192.168.56.10 true; echo "exit=$?"
@keodo for u in oracle postgres; do sshpass -p '123456' ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=no -b 192.168.56.88 $u@192.168.56.10 true; done; echo xong
@keodo sshpass -p 'toor' ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=no -b 192.168.56.88 root@192.168.56.10 true; echo "exit=$?"
@keodo ssh -b 192.168.56.20 hv@192.168.56.10 true; echo "hv bằng khoá: exit=$?"
@keodo sshpass -p 'Dev-Lab-2026!' ssh -o StrictHostKeyChecking=no -b 192.168.56.88 dev@192.168.56.10 true; echo "từ .88, mật khẩu đúng: exit=$?"
@keodo sshpass -p 'An-Lab-2026!' ssh -tt -o StrictHostKeyChecking=no -b 192.168.56.20 an@192.168.56.10 "echo 'An-Lab-2026!' | sudo -S -p '' systemctl restart rsyslog; echo 'sai-roi' | sudo -S -k -p '' cat /etc/shadow; true" 2>&1 | tr -d '\r' | grep -v '^$'
@keodo sshpass -p 'Dev-Lab-2026!' ssh -tt -o StrictHostKeyChecking=no -b 192.168.56.20 dev@192.168.56.10 "echo 'Dev-Lab-2026!' | sudo -S -p '' cat /etc/shadow; echo 'sai' | su -c id an; true" 2>&1 | tr -d '\r' | grep -v '^$'
sudo grep -E 'sshd\[[0-9]+\]: (Accepted|Failed|Invalid|Connection closed|Disconnected)' /var/log/auth.log | grep -v ' 172\.17\.' | tail -12
sudo grep -E ' (sudo|su)(\[[0-9]+\])?: ' /var/log/auth.log | grep -E '(an|dev) :|su|for \[an\]' | tail -9
sudo grep -E 'systemd-logind|pam_unix\(sshd:session\)' /var/log/auth.log | grep -E ' (an|dev)' | tail -4
sudo grep -cE 'Failed password|Invalid user' /var/log/auth.log; sudo grep -c 'Failed password' /var/log/auth.log
sudo grep 'Failed password' /var/log/auth.log | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn
sudo grep 'Failed password' /var/log/auth.log | awk '{for(i=1;i<=NF;i++) if($i=="for"){u=($(i+1)=="invalid")?$(i+3):$(i+1)}; print u}' | sort | uniq -c | sort -rn
sudo awk '/Failed password/{for(i=1;i<=NF;i++) if($i=="from") sai[$(i+1)]++} /Accepted/{for(i=1;i<=NF;i++) if($i=="from"){ip=$(i+1); if(sai[ip]>0) print "ĐỎ: " ip " vào được sau " sai[ip] " lần sai —", $0}}' /var/log/auth.log | cut -c1-160
sudo journalctl _COMM=sshd -q --no-pager -o short-iso --since '-10min' | grep -E 'Invalid user' | tail -2
sudo journalctl _COMM=sudo -q --no-pager -o json --since '-10min' | jq -r 'select(.MESSAGE|test("^ *(an|dev) :")) | "\(._PID) \(.MESSAGE)"'
@host docker run --rm rockylinux:9 bash -c 'dnf -q -y install rsyslog openssh-server >/dev/null 2>&1; grep -n "^authpriv" /etc/rsyslog.conf; grep -E "^#?SyslogFacility|^#?LogLevel" /etc/ssh/sshd_config'
sudo sshd -T | grep -E '^(syslogfacility|loglevel|maxauthtries|permitrootlogin|passwordauthentication)'
