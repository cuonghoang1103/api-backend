# Ch3 · 3.1 — máy Ubuntu có systemd-resolved: resolv.conf trỏ về 127.0.0.53 (một bộ đệm DNS cục bộ), máy chủ thật nằm sau nó
ls -l /etc/resolv.conf
grep -v '^#' /etc/resolv.conf | grep .
resolvectl status | sed -n '1,4p'
resolvectl query www.labflow.test
resolvectl query www.labflow.test
resolvectl statistics | sed -n '/Cache/,/Misses/p'
