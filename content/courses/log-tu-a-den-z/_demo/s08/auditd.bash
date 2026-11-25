sudo DEBIAN_FRONTEND=noninteractive apt-get install -y auditd 2>&1 | grep -E '^Setting up (auditd|libauparse)'; auditctl -v 2>/dev/null || sudo auditctl -v
sudo auditctl -s
sudo auditctl -l
cat s08/50-lab.rules
sudo cp s08/50-lab.rules /etc/audit/rules.d/ && sudo augenrules --load >/dev/null && sudo auditctl -l
@keodo sshpass -p 'Dev-Lab-2026!' ssh -o StrictHostKeyChecking=no -b 192.168.56.20 dev@192.168.56.10 'cat /etc/shadow; id; uname -r; true'
@keodo sshpass -p 'An-Lab-2026!' ssh -tt -o StrictHostKeyChecking=no -b 192.168.56.20 an@192.168.56.10 "echo 'An-Lab-2026!' | sudo -S -p '' bash -c 'useradd -m -s /bin/bash backup2; echo \"dev ALL=(ALL) NOPASSWD:ALL\" > /etc/sudoers.d/dev'; true" 2>&1 | tr -d '\r' | grep -v '^$'
sudo grep -E 'key="shadow"' /var/log/audit/audit.log | tail -1
sudo grep -A4 "$(sudo grep -E 'key="shadow"' /var/log/audit/audit.log | tail -1 | grep -oE 'audit\([0-9.:]+\)')" /var/log/audit/audit.log | head -5
sudo ausearch --input-logs -k shadow -i --just-one 2>/dev/null | head -12
sudo ausearch --input-logs -k shadow --format text 2>/dev/null | tail -2
sudo ausearch --input-logs -k sudoers --format text 2>/dev/null
sudo ausearch --input-logs -k identity --format text 2>/dev/null | tail -4
sudo ausearch --input-logs -k exec_nguoi -ua 1001 --format text 2>/dev/null | tail -6
sudo ausearch --input-logs -k exec_nguoi -ua 1001 -i 2>/dev/null | grep -E '^type=SYSCALL' | grep useradd | grep -oE '(auid|uid|euid|exe|comm)=[^ ]+' | tr '\n' ' '; echo
sudo aureport --input-logs --summary 2>/dev/null | head -20
sudo aureport --input-logs -au -i 2>/dev/null | tail -5
sudo aureport --input-logs --failed --summary -i 2>/dev/null | head -12
sudo aureport --input-logs -x --summary -i 2>/dev/null | head -12
sudo aureport --input-logs -k --summary 2>/dev/null
@keodo sshpass -p 'An-Lab-2026!' ssh -tt -o StrictHostKeyChecking=no -b 192.168.56.20 an@192.168.56.10 "echo 'An-Lab-2026!' | sudo -S -p '' auditctl -e 0; true" 2>&1 | tr -d '\r' | grep -v '^$'
sudo ausearch --input-logs -m CONFIG_CHANGE -i 2>/dev/null | tail -3
sudo auditctl -e 1 >/dev/null; sudo auditctl -e 2
sudo auditctl -e 0; sudo auditctl -D; sudo auditctl -w /tmp -p w; echo "exit=$?"
sudo systemctl stop auditd; systemctl show auditd -p RefuseManualStop
sudo auditctl -s | grep -E '^(enabled|failure|backlog_limit|lost)'
