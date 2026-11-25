sudo ausearch --input-logs -k shadow -ua 1002 -sv no --format text
sudo ausearch --input-logs -k shadow -ua 1002 -sv no -i | grep -E '^type=(SYSCALL|PATH)' | grep -oE '(syscall|success|exit|auid|uid|comm|name)=[^ ]+' | tr '\n' ' '; echo
sudo ausearch --input-logs -k exec_nguoi -ua 1001 -sv yes --format text | tail -5
sudo ausearch --input-logs -k exec_nguoi -ua 1002 -sv yes -i | grep '^type=EXECVE' | tail -3
systemctl is-active auditd; sudo auditctl -s | grep -E '^(enabled|pid)'
sudo journalctl -k --since '-10min' -q --no-pager -o cat | grep -m2 'type=1305\|auditd'
sudo touch /etc/sudoers.d/thu-khi-auditd-tat; sudo journalctl -k --since '-1min' -q --no-pager -o cat | grep -E 'key="sudoers"' | tail -1 | cut -c1-200
sudo systemctl start auditd; sleep 1; systemctl is-active auditd; sudo rm /etc/sudoers.d/thu-khi-auditd-tat
sudo ausearch --input-logs -m DAEMON_END,DAEMON_START -i | grep -E 'DAEMON_(END|START)' | tail -2 | cut -c1-220
@host docker run --rm rockylinux:9 bash -c 'dnf -q -y install audit >/dev/null 2>&1; grep -E "RefuseManualStop|ExecStart=" /usr/lib/systemd/system/auditd.service; grep -E "^(log_file|max_log_file|num_logs|max_log_file_action|space_left_action|disk_full_action) " /etc/audit/auditd.conf'
grep -E '^(log_file|max_log_file|num_logs|max_log_file_action|space_left_action|disk_full_action) ' /etc/audit/auditd.conf 2>/dev/null || sudo grep -E '^(log_file|max_log_file|num_logs|max_log_file_action|space_left_action|disk_full_action) ' /etc/audit/auditd.conf
