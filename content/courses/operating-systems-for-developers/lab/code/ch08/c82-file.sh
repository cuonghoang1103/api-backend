# @ Chương 8 · bài 8.2 — thrashing KHÔNG cần swap: trang của FILE bị đuổi rồi đọc lại. 128 MiB RAM, không swap:
# @ docker run --rm --label oslab=1 --name os-c82f --hostname oslab --memory 128m --memory-swap 128m -v "$PWD/ch08":/lab/ch08 -w /lab/ch08 os-lab bash -c "phien c82-file.sh 2>&1"
@ gcc -O2 ws.c -o ws
cat /sys/fs/cgroup/memory.swap.max
dd if=/dev/urandom of=/tmp/data bs=1M count=200 status=none
./ws 64 3 rand /tmp/data
./ws 200 3 rand /tmp/data
grep -E '^(workingset_refault_file|pgscan|pgsteal) ' /sys/fs/cgroup/memory.stat
cat /sys/fs/cgroup/memory.pressure
cat /sys/fs/cgroup/memory.events | head -5
@ rm -f ws /tmp/data
