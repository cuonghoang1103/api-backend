# @ Chương 15 · bài 15.1 — USE + RED + "60 giây đầu tiên" trên một container ĐANG QUÁ TẢI (2 CPU, 1 GiB, đĩa ghi 20 MB/s).
# @ docker run --rm --label oslab=1 --hostname oslab --cpus 2 --memory 1g --device-write-bps /dev/vda:20mb \
# @   -v "$PWD/ch15":/lab/ch15 -w /lab/ch15 os-lab bash -c "phien c151-use.sh 2>&1" > out/c151-use.out.txt
# @ Ba "thủ phạm" chạy ngầm: dịch vụ orders.js nhận 100 req/s /report + 20 req/s /health; một tiến trình giữ 600 MiB;
# @ một job sao lưu ghi đĩa liên tục (bị giới hạn 20 MB/s). Người học chỉ thấy: "API chậm".
@ ACCESS_LOG=/tmp/access.log node orders.js 8080 > /tmp/orders.log 2>&1 & NODE=$!
@ node tai.js http://127.0.0.1:8080/report --rate 100 --duration 45 > /tmp/report.txt & L1=$!
@ node tai.js http://127.0.0.1:8080/health --rate 20 --duration 45 > /tmp/health.txt & L2=$!
@ python3 -c "import time; x = bytearray(600 << 20); x[::4096] = b'x' * len(x[::4096]); time.sleep(90)" & MEM=$!
@ (while true; do dd if=/dev/zero of=/var/tmp/backup.img bs=1M count=100 oflag=direct status=none; done) & BAK=$!
@ sleep 6
uptime
dmesg | tail -3
vmstat 1 5
mpstat -P ALL 1 1 | head -16
pidstat 1 1 | sed -n '3,$p'
iostat -dx vda 1 2 | awk '/^Device|^vda/ {printf "%-7s %8s %9s %8s %7s %6s\n", $1, $8, $9, $12, $(NF-1), $NF}' | tail -2
free -m
sar -n DEV 1 1 | grep -E 'IFACE|eth0|lo' | head -3
sar -n TCP,ETCP 1 1 | head -7
top -bn1 -w 110 | head -14
cat /sys/fs/cgroup/cpu.max; grep -E 'usage|throttled' /sys/fs/cgroup/cpu.stat
for r in cpu memory io; do echo "$r: $(head -1 /sys/fs/cgroup/$r.pressure)"; done
pidstat -t -p $NODE 1 1 | sed -n '3,$p' | head -10
python3 use.py 3
@ wait $L1 $L2
python3 red.py /tmp/access.log
cat /tmp/report.txt /tmp/health.txt
@ kill $NODE $MEM $BAK 2>/dev/null; wait 2>/dev/null; rm -f /var/tmp/backup.img
