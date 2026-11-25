# 6.1 — unified log nằm ở đâu, lệnh nào đọc nó, cái bẫy "log" của zsh.
sw_vers
zsh -f -c 'type log; log show --last 1m'
grep -n -A1 'Disable the log builtin' /etc/zshrc
type log
ls -l /var/db/diagnostics | head -12
ls /var/db/diagnostics/Persist | head -3; ls /var/db/diagnostics/Persist | wc -l
du -sh /var/db/diagnostics /var/db/uuidtext 2>/dev/null
log config --status
