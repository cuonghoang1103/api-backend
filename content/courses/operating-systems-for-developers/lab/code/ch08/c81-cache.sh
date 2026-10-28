# @ Chương 8 · bài 8.1 — page cache, free vs available, reclaim trong cgroup, drop_caches. Chạy (container vứt đi, --privileged CHỈ để ghi drop_caches):
# @ docker run --rm --label oslab=1 --name os-c81 --hostname oslab --privileged --memory 1g -v "$PWD/ch08":/lab/ch08 -w /lab/ch08 os-lab bash -c "phien c81-cache.sh 2>&1"
@ gcc -O2 incore.c -o incore
@ TIMEFORMAT='real %R s'
free -m
grep -E '^(MemTotal|MemFree|MemAvailable|Buffers|Cached|Active\(anon\)|Inactive\(anon\)|Active\(file\)|Inactive\(file\)|Dirty|Shmem|SwapTotal|SwapFree):' /proc/meminfo
cat /sys/fs/cgroup/memory.max
grep -E '^(anon|file|file_dirty|active_file|inactive_file) ' /sys/fs/cgroup/memory.stat
dd if=/dev/urandom of=/tmp/big bs=1M count=200 status=none
./incore /tmp/big
grep -E '^(anon|file|file_dirty) ' /sys/fs/cgroup/memory.stat
sync; grep -E '^(file|file_dirty) ' /sys/fs/cgroup/memory.stat
./incore /tmp/big evict
time cat /tmp/big > /dev/null
./incore /tmp/big
time cat /tmp/big > /dev/null
free -m | head -2
dd if=/dev/zero of=/tmp/huge bs=1M count=1000 status=none; cat /tmp/huge > /dev/null
free -m | head -2
./incore /tmp/big; ./incore /tmp/huge
cat /sys/fs/cgroup/memory.current /sys/fs/cgroup/memory.peak
grep -E '^(pgscan|pgsteal|pgscan_kswapd|pgscan_direct|workingset_refault_file) ' /sys/fs/cgroup/memory.stat
cat /sys/fs/cgroup/memory.events
grep -A5 'zone   Normal' /proc/zoneinfo | grep -E 'zone|min|low|high'
grep -E '^(pgscan_kswapd|pgscan_direct|allocstall_movable) ' /proc/vmstat
sync; echo 1 > /proc/sys/vm/drop_caches
free -m | head -2
@ rm -f /tmp/big /tmp/huge incore
