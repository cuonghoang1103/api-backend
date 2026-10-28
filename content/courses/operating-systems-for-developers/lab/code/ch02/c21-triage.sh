# @ docker run --rm --label oslab=1 --name os-c21 --hostname oslab --privileged -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien c21-triage.sh 2>&1"
@ cp bao-cao.js sao-luu.sh /tmp/ && cd /tmp && (node bao-cao.js &) && (bash sao-luu.sh &) && sleep 50
uptime
dmesg | tail -2
vmstat 1 5
mpstat 1 1
pidstat 1 1
pidstat -d 1 1 | grep -E 'Command|dd'
iostat -dxyz 1 1 | awk 'NF>10 {print $1, $2, $8, $9, $12, $(NF-1), $NF}' | column -t
free -m
sar -n DEV 1 1 | grep -E 'IFACE|eth0' | head -2
sar -n TCP,ETCP 1 1 | head -6
top -b -n 1 -w 100 | head -12
ps -o pid,stat,%cpu,etime,cmd -p $(pgrep -d, -f 'bao-cao|sao-luu') --ppid $(pgrep -f sao-luu)
grep -E '^(Name|State|Threads)' /proc/$(pgrep -f bao-cao.js)/status
@ pkill -f bao-cao.js; pkill -f sao-luu.sh; pkill -x dd; rm -f /tmp/backup.bin
