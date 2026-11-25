# THÊM 25/11/2026 — kiểm: -F có theo bộ lọc không? (container lgz-c07, systemd 255)
systemctl --version | head -n 1
journalctl -F SYSLOG_IDENTIFIER | sort | tr '\n' ' '; echo
journalctl -u ssh -F SYSLOG_IDENTIFIER | sort | tr '\n' ' '; echo
journalctl _SYSTEMD_UNIT=ssh.service -F SYSLOG_IDENTIFIER | sort | tr '\n' ' '; echo
journalctl -p crit -F SYSLOG_IDENTIFIER | sort | tr '\n' ' '; echo
journalctl -p crit -o json | jq -r '.SYSLOG_IDENTIFIER' | sort -u
journalctl -u ssh -o json | jq -r '.SYSLOG_IDENTIFIER' | sort -u | tr '\n' ' '; echo
journalctl -t kiem-dia -o json --output-fields=_SYSTEMD_UNIT,_TRANSPORT,PRIORITY | jq -c '{_SYSTEMD_UNIT,_TRANSPORT,PRIORITY}'
