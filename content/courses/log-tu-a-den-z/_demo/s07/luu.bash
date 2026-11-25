# 7.1 — journald lưu log ở đâu, dưới dạng gì, ai được đọc, và mỗi dòng có những trường nào (máy ảo lab7: Ubuntu 24.04, systemd 255)
journalctl --disk-usage
ls -l /var/log/journal/
cat /etc/machine-id
sudo ls -l /var/log/journal/$(cat /etc/machine-id)/
sudo head -c 8 /var/log/journal/$(cat /etc/machine-id)/system.journal; echo
sudo grep -c 'shop-api' /var/log/journal/$(cat /etc/machine-id)/system.journal
systemd-analyze cat-config systemd/journald.conf | grep -v '^#' | grep .
sudo usermod -aG systemd-journal hv
id
journalctl --disk-usage
journalctl -u shop-api -n 1 -o verbose
logger -t sshd 'Accepted password for root from 203.0.113.9 port 50122 ssh2'
journalctl -b -t sshd -g 203.0.113.9 -n 1 --no-pager
journalctl -b -t sshd -g 203.0.113.9 -n 1 -o verbose --output-fields=SYSLOG_IDENTIFIER,MESSAGE,_UID,_COMM,_EXE,_TRANSPORT
printf 'MESSAGE=order 1042 paid\nORDER_ID=1042\nAMOUNT_VND=350000\n_PID=1\n_UID=0\n' | logger --journald
journalctl ORDER_ID=1042 -n 1 -o verbose --output-fields=MESSAGE,ORDER_ID,AMOUNT_VND,_PID,_UID,_COMM
echo 'backup: disk 91% full' | systemd-cat -t backup -p warning
journalctl -t backup -n 1 -o json-pretty --output-fields=MESSAGE,PRIORITY,SYSLOG_IDENTIFIER,_TRANSPORT
