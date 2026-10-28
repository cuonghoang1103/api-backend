# @ chạy trong container systemd vứt đi (ảnh os-lab-sd, xem Dockerfile.sd):
# @   docker run -d --name os-c26 --label oslab=1 --hostname vps-lab --privileged --cgroupns=private --tmpfs /run --tmpfs /run/lock -v "$PWD/ch02":/lab/ch02 os-lab-sd
# @   docker exec -w /lab/ch02 os-c26 bash -c "phien c26-log.sh 2>&1"
@ cp systemd/*.service /etc/systemd/system/ && systemctl daemon-reload && systemctl enable --now ctw-api > /dev/null 2>&1 && systemctl start bao-cao; sleep 12
uptime
systemctl status ctw-api --no-pager
systemctl --failed --no-pager
systemctl status bao-cao --no-pager | head -6
journalctl -u bao-cao --no-pager | tail -6
journalctl -u ctw-api --since "-30s" --no-pager | tail -4
journalctl -u ctw-api -p err --no-pager
journalctl -u ctw-api -p err -o short-iso --no-pager -n 1
journalctl --disk-usage
systemctl start chatty; sleep 20; systemctl stop chatty
journalctl --disk-usage
journalctl -u chatty --no-pager | sed -n '2,3p'
journalctl -u chatty --no-pager | wc -l
journalctl --vacuum-size=10M
journalctl --rotate; journalctl --vacuum-size=10M
journalctl --disk-usage
mkdir -p /etc/systemd/journald.conf.d && printf '[Journal]\nSystemMaxUse=200M\nMaxRetentionSec=14day\n' > /etc/systemd/journald.conf.d/size.conf && systemctl restart systemd-journald; cat /etc/systemd/journald.conf.d/size.conf
systemd-run --unit=oom-demo -p MemoryMax=64M -p MemorySwapMax=0 /usr/local/bin/node --max-old-space-size=1024 -e 'const a = []; for (;;) a.push(new Array(1e6).fill(1))'; sleep 4
systemctl status oom-demo --no-pager | head -4
journalctl -u oom-demo --no-pager | grep -iE 'oom|killed|exited' | tail -3
journalctl -k --no-pager | grep -E 'Killed process [0-9]+ \(node\)' | tail -1 | cut -c 1-140
dmesg -T | grep -E 'Killed process [0-9]+ \(node\)' | tail -1 | cut -c 1-110
