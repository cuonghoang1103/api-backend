# @ Chương 12 · bài 12.2 — cgroup v2 bằng tay. Container đặc quyền VỨT ĐI, có trần 1 GiB / 2 CPU / 2000 PID làm lưới an toàn;
# @ mọi cgroup tạo ra nằm DƯỚI cgroup riêng của container này (cgroupns), không đụng cgroup của máy chủ:
# @ docker run --rm --label oslab=1 --name os-c122 --hostname oslab --privileged --memory 1g --cpus 2 --pids-limit 2000 -v "$PWD/ch12":/lab/ch12 -w /lab/ch12 os-lab bash -c "phien c122-cg.sh 2>&1"
cat /proc/self/cgroup; findmnt -no FSTYPE,OPTIONS /sys/fs/cgroup
cat /sys/fs/cgroup/cgroup.controllers; cat /sys/fs/cgroup/cgroup.procs | wc -l
mkdir /sys/fs/cgroup/box; echo "+memory" > /sys/fs/cgroup/cgroup.subtree_control
mkdir /sys/fs/cgroup/init; for p in $(cat /sys/fs/cgroup/cgroup.procs); do echo $p > /sys/fs/cgroup/init/cgroup.procs 2>/dev/null; done; cat /sys/fs/cgroup/cgroup.procs | wc -l
echo "+memory +cpu +pids +io" > /sys/fs/cgroup/cgroup.subtree_control; cat /sys/fs/cgroup/cgroup.subtree_control
cd /sys/fs/cgroup/box; ls | grep -cE '.'; ls | grep -E '^(memory|cpu|pids|io)\.(max|current|events|stat|peak)$' | tr '\n' ' '; echo
cat memory.max cpu.max pids.max io.max; echo "(io.max empty = no limit)"
echo 64M > memory.max; echo 0 > memory.swap.max; cat memory.max
sh -c 'echo $$ > /sys/fs/cgroup/box/cgroup.procs; exec python3 -c "b = bytearray(b\"x\") * (200 << 20); print(\"got 200 MiB\")"'; echo "exit $?"
grep -E '^(oom|oom_kill|max) ' memory.events; echo "peak $(( $(cat memory.peak) >> 20 )) MiB"
dmesg | grep -E 'Memory cgroup out of memory' | tail -1 | sed 's/^\[[ 0-9.]*\] //'
echo max > memory.max
echo "50000 100000" > cpu.max; cat cpu.max
cat cpu.stat | grep -E '^(usage_usec|nr_periods|nr_throttled|throttled_usec) '
sh -c 'echo $$ > /sys/fs/cgroup/box/cgroup.procs; exec stress-ng --cpu 2 --timeout 4s --quiet' & sleep 2.5; ps -eo pid,pcpu,comm | grep -E 'PID|stress'; wait
cat cpu.stat | grep -E '^(usage_usec|nr_periods|nr_throttled|throttled_usec) '
echo max > cpu.max; echo 20 > pids.max; cat pids.max
sh -c 'echo $$ > /sys/fs/cgroup/box/cgroup.procs; exec python3 /lab/ch12/forks.py'
cat pids.events
echo 64 > pids.max
bash -c 'echo $$ > /sys/fs/cgroup/box/cgroup.procs; b(){ b | b & }; b' 2> /dev/null; sleep 3
echo "pids.current=$(cat pids.current)  $(cat pids.events)"; uptime
echo 1 > cgroup.kill; sleep 0.5; echo "after cgroup.kill: pids.current=$(cat pids.current)"; grep populated cgroup.events
echo "254:0 wbps=10485760" > io.max; cat io.max
sh -c 'echo $$ > /sys/fs/cgroup/box/cgroup.procs; exec dd if=/dev/zero of=/var/tmp/io.bin bs=1M count=40 oflag=direct' 2>&1 | tail -1
echo "254:0 wbps=max" > io.max; dd if=/dev/zero of=/var/tmp/io.bin bs=1M count=40 oflag=direct 2>&1 | tail -1; rm -f /var/tmp/io.bin
sleep 300 & S=$!; echo $S > cgroup.procs; echo 1 > cgroup.freeze; sleep 0.3
grep frozen cgroup.events; ps -o pid,stat,wchan:12,comm -p $S
echo 0 > cgroup.freeze; kill $S; wait 2>/dev/null
cd /; rmdir /sys/fs/cgroup/box && echo "box removed"
