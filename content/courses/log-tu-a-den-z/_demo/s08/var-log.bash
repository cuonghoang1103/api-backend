. /etc/os-release; echo "$PRETTY_NAME"; uname -r
ls -l /var/log
ls /var/log/syslog /var/log/auth.log /var/log/messages /var/log/secure
systemctl status rsyslog --no-pager; dpkg -l rsyslog logrotate 2>&1 | tail -2
journalctl -t sshd --since today -q --no-pager | grep -E 'Accepted|Invalid|Failed' | tail -4
file /var/log/wtmp /var/log/btmp /var/log/lastlog /var/log/journal/*/system.journal
last -n 6
last -x reboot shutdown -n 4
sudo lastb
lastlog | head -4; lastlog -u hv
sudo utmpdump /var/log/wtmp 2>/dev/null | tail -2
grep ' install ' /var/log/dpkg.log | tail -4
tail -6 /var/log/apt/history.log
sudo grep -E 'Cloud-init v.*(running|finished)' /var/log/cloud-init.log | tail -2
sudo apt-get install -y rsyslog logrotate 2>&1 | grep -E '^(Setting up|Created symlink)'
ls -l /var/log | grep -E 'syslog|auth|kern|cron|mail'
@keodo sshpass -p 'sai-mat-khau' ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=no -b 192.168.56.88 admin@192.168.56.10 true; echo "exit=$?"
sudo grep -h 'admin' /var/log/auth.log | tail -3
grep -vE '^#|^$' /etc/rsyslog.d/50-default.conf
@host docker run --rm rockylinux:9 bash -c 'dnf -q -y install rsyslog >/dev/null 2>&1; cat /etc/redhat-release; grep -E "^[a-z*].*(/var/log|:omusrmsg)" /etc/rsyslog.conf'
@host docker run --rm fedora:44 bash -c 'cat /etc/fedora-release; rpm -q rsyslog; for f in /usr/bin/last /usr/bin/lastlog2 /usr/bin/wtmpdb; do echo "$f ← $(dnf -q repoquery --qf "%{name}\n" --whatprovides $f 2>/dev/null | sort -u | tr "\n" " ")"; done'
