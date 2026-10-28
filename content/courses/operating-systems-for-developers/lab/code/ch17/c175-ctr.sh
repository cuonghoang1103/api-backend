# @ Chương 17 · bài 17.5 — dự án mở rộng: mini container runtime bằng C. Container lab VỨT ĐI có --privileged:
# @ docker run --rm --privileged --label oslab=1 --name os-c175 --hostname oslab -v lab/code:/lab -w /lab/ch17 os-lab bash -c "phien c175-ctr.sh"
# The acceptance tests against the reference runtime ||| Bộ kiểm nghiệm thu chạy trên runtime mẫu
wc -l ctr/minictr.c
ctr/test-ctr.sh
# Same rootfs, by hand: a busybox root file system on a tmpfs ||| Cùng rootfs đó, tự tay: một hệ thống file gốc busybox trên tmpfs
@ mkdir -p /sys/fs/cgroup/init; for p in $(cat /sys/fs/cgroup/cgroup.procs); do echo $p > /sys/fs/cgroup/init/cgroup.procs 2>/dev/null; done; echo "+memory +pids +cpu" > /sys/fs/cgroup/cgroup.subtree_control
@ gcc -O2 -o /usr/local/bin/minictr ctr/minictr.c; mkdir -p /box; mount -t tmpfs -o size=32m box /box; mkdir /box/bin; cp /bin/busybox /box/bin/; for a in $(busybox --list | grep -vx busybox); do ln -s busybox /box/bin/$a; done
ls /box/bin | wc -l; du -sh /box
minictr --hostname shop-01 --mem 48M --pids 16 /box /bin/sh -c 'hostname; echo "my PID: $$"; ps; cat /proc/self/cgroup; ls /'
grep -E 'CapBnd' /proc/self/status; minictr /box /bin/sh -c 'grep CapBnd /proc/self/status; mount -t tmpfs x /tmp; echo "mount exit=$?"'
minictr --mem 32M /box /bin/sh -c 'head -c 104857600 /dev/zero | tail > /dev/null'; echo "exit=$?"
dmesg | grep -E 'Memory cgroup out of memory' | tail -1 | sed 's/^\[[ 0-9.]*\] //' | cut -c1-80
# The runtime, as seen from the host while a box is running ||| Runtime nhìn từ máy chủ trong lúc một hộp đang chạy
minictr /box /bin/sleep 30 & sleep 0.5; P=$(pgrep -x sleep | head -1); echo "the box's sleep is host PID $P"
grep NSpid /proc/$P/status; cat /proc/$P/cgroup; ls /sys/fs/cgroup | grep minictr; cat /sys/fs/cgroup/minictr-*/memory.max /sys/fs/cgroup/minictr-*/pids.max
for ns in pid mnt uts net ipc cgroup; do echo "$ns: host $(readlink /proc/1/ns/$ns) box $(readlink /proc/$P/ns/$ns)"; done
kill $P; wait; ls /sys/fs/cgroup | grep -c minictr
