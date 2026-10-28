# @ Chương 8 · bài 8.2 — swap, thrashing đo được, PSI, swappiness. Container vứt đi: 128 MiB RAM + 256 MiB swap (--privileged CHỈ để ghi memory.reclaim của chính nó):
# @ docker run --rm --label oslab=1 --name os-c82 --hostname oslab --privileged --memory 128m --memory-swap 384m -v "$PWD/ch08":/lab/ch08 -w /lab/ch08 os-lab bash -c "phien c82-swap.sh 2>&1"
@ gcc -O2 ws.c -o ws; gcc -O2 hold.c -o hold
swapon --show
cat /proc/sys/vm/swappiness
cat /sys/module/zswap/parameters/enabled; ls /sys/block | grep zram || echo "no zram device"
cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.swap.max
./hold 40 &
@ sleep 2
grep -E '^(anon|file) ' /sys/fs/cgroup/memory.stat; cat /sys/fs/cgroup/memory.swap.current
echo "200M swappiness=0" | tee /sys/fs/cgroup/memory.reclaim > /dev/null
grep -E '^(anon|file) ' /sys/fs/cgroup/memory.stat; cat /sys/fs/cgroup/memory.swap.current
echo "10M swappiness=200" | tee /sys/fs/cgroup/memory.reclaim > /dev/null
grep -E '^(anon|file) ' /sys/fs/cgroup/memory.stat; cat /sys/fs/cgroup/memory.swap.current
dd if=/dev/zero of=/tmp/f bs=1M count=20 status=none; cat /tmp/f > /dev/null
grep -E '^(anon|file) ' /sys/fs/cgroup/memory.stat; cat /sys/fs/cgroup/memory.swap.current
echo "10M swappiness=0" | tee /sys/fs/cgroup/memory.reclaim > /dev/null
grep -E '^(anon|file) ' /sys/fs/cgroup/memory.stat; cat /sys/fs/cgroup/memory.swap.current
@ kill %1; wait 2>/dev/null; sleep 1
./ws 64 3 rand
./ws 160 3 rand
grep -E '^(pswpin|pswpout) ' /sys/fs/cgroup/memory.stat; cat /sys/fs/cgroup/memory.swap.current
cat /sys/fs/cgroup/memory.pressure
./ws 160 3 seq
./hold 150 &
@ sleep 2
./ws 80 3 rand
grep -E 'VmRSS|VmSwap' /proc/$(pidof hold)/status
@ kill %1; wait 2>/dev/null; sleep 1
@ rm -f ws hold /tmp/f
