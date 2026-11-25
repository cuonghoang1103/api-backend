# Lời giải 🧪 bài 7.1 — chạy thật 24/11/2026 trong container systemd lgz-c07 (Ubuntu 24.04, systemd 255; podman, --network none, 2 GB).
# Câu 1 — có giữ log sau khởi động lại không?
ls -ld /var/log/journal /run/log/journal
systemd-analyze cat-config systemd/journald.conf | grep -v '^#' | grep .
systemctl --version | head -n 1
# Câu 2 — người dùng thường
id
journalctl --disk-usage
sudo usermod -aG systemd-journal hv
id
journalctl --disk-usage
# Câu 3 — một bản ghi thật của dịch vụ SSH
journalctl -u ssh -g Accepted -n 1 -o verbose --output-fields=MESSAGE,PRIORITY,SYSLOG_IDENTIFIER,SYSLOG_FACILITY,_PID,_UID,_COMM,_EXE,_SYSTEMD_UNIT,_TRANSPORT
# Câu 4 — dòng sshd giả và lệnh chỉ hiện dòng thật
logger -t sshd 'Accepted password for root from 203.0.113.9 port 50122 ssh2'
journalctl -t sshd -g Accepted --no-pager
journalctl _SYSTEMD_UNIT=ssh.service -g Accepted --no-pager
journalctl -t sshd -g Accepted --no-pager -o verbose --output-fields=_UID,_COMM,_SYSTEMD_UNIT | grep -E '^ +_|^[A-Z][a-z]{2} '
# Câu 5 — trường riêng TICKET
printf 'MESSAGE=deploy xong ban 1.4.2\nTICKET=OJT-17\n' | logger --journald
journalctl TICKET=OJT-17 -o verbose --output-fields=MESSAGE,TICKET,_UID,_TRANSPORT --no-pager
journalctl -F TICKET
