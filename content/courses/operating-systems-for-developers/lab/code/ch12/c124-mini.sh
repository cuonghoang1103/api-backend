# @ Chương 12 · bài 12.4 — tự dựng một container bằng tay (Alpine). Container đặc quyền VỨT ĐI; ảnh Alpine xuất sẵn gắn chỉ-đọc ở /opt/c12:
# @ docker run --rm --label oslab=1 --name os-c124 --hostname oslab --privileged --memory 1g --cpus 2 --pids-limit 2000 -v "$PWD/ch12":/lab/ch12 -v <scratch>/c12:/opt/c12:ro -w /lab/ch12 os-lab bash -c "phien c124-mini.sh 2>&1"
@ mkdir /sys/fs/cgroup/init; for p in $(cat /sys/fs/cgroup/cgroup.procs); do echo $p > /sys/fs/cgroup/init/cgroup.procs 2>/dev/null; done
@ echo "+memory +cpu +pids" > /sys/fs/cgroup/cgroup.subtree_control
ls -lh /opt/c12/alpine-3.24.tar; tar -tf /opt/c12/alpine-3.24.tar | grep -cv /$
cat /etc/os-release | head -1; hostname; ps -e | wc -l
./mini-container.sh box1 /bin/sh -c 'echo "hostname: $(hostname)"; head -2 /etc/os-release; echo "my PID: $$"; ps; id'
./mini-container.sh box1 /bin/sh -c 'ls /; df -h / | tail -1; ls /dev; ip -o link | grep -v NONE'
./mini-container.sh box1 /bin/sh -c 'cat /proc/self/cgroup; cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/cpu.max /sys/fs/cgroup/pids.max'
./mini-container.sh box1 /bin/sh -c 'dd if=/dev/zero of=/dev/null bs=200M count=1'; echo "exit $?"
dmesg | grep -E 'Memory cgroup out of memory' | tail -1 | sed 's/^\[[ 0-9.]*\] //' | cut -c1-90
./mini-container.sh box1 /bin/sh -c 'for i in $(seq 40); do sleep 1 & done; sleep 1.5; echo "survived"' 2>&1 | sort | uniq -c
./mini-container.sh box1 /bin/sh -c 'time -f "%e s wall, %U s user" sh -c "i=0; while [ \$i -lt 300000 ]; do i=\$((i+1)); done"'
CPU="max 100000" ./mini-container.sh box1 /bin/sh -c 'time -f "%e s wall, %U s user" sh -c "i=0; while [ \$i -lt 300000 ]; do i=\$((i+1)); done"'
./mini-container.sh box2 /bin/sh -c 'echo "hello from box2" > /root/note; rm /etc/motd; sleep 300' &
sleep 1; P=$(pgrep -f 'sleep 300' | tail -1); echo "box2's sleep, seen from outside: PID $P"
grep -E '^NSpid' /proc/$P/status; cat /proc/$P/cgroup; cat /proc/$P/root/etc/alpine-release
ls -la /var/lib/mini/box2/upper/root /var/lib/mini/box2/upper/etc; ls /var/lib/mini/image/etc/motd
nsenter -t $P --all /bin/sh -c 'hostname; cat /root/note; ps'
kill -KILL $P; wait; ls /sys/fs/cgroup | grep -c mini; findmnt -t overlay -n | wc -l
