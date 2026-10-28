# @ Chương 8 · bài 8.4 — dòng thời gian memory.high → reclaim → throttling → memory.max → OOM kill, trong một cgroup CON tự tạo.
# @ Container vứt đi 512 MiB; --privileged CHỈ để ghi cây cgroup CỦA CHÍNH container (cgroupns riêng):
# @ docker run --rm --label oslab=1 --name os-c84h --hostname oslab --privileged --memory 512m --memory-swap 768m -v "$PWD/ch08":/lab/ch08 -w /lab/ch08 os-lab bash -c "exec phien c84-high.sh 2>&1"   (exec: phien phải là PID 1 — tiến trình DUY NHẤT trong cgroup gốc của container)
@ gcc -O2 fill.c -o fill
cat /proc/self/cgroup
mkdir /sys/fs/cgroup/init /sys/fs/cgroup/job
echo $$ > /sys/fs/cgroup/init/cgroup.procs
echo +memory > /sys/fs/cgroup/cgroup.subtree_control
echo 96M > /sys/fs/cgroup/job/memory.high; echo 160M > /sys/fs/cgroup/job/memory.max; echo 32M > /sys/fs/cgroup/job/memory.swap.max
grep . /sys/fs/cgroup/job/memory.{high,max,swap.max}
sh -c 'echo $$ > /sys/fs/cgroup/job/cgroup.procs; exec ./fill 240 8'; echo "exit code $?"
cat /sys/fs/cgroup/job/memory.events
grep -E '^(pgscan|pgsteal|pswpout) ' /sys/fs/cgroup/job/memory.stat
cat /sys/fs/cgroup/job/memory.pressure
@ rm -f fill
