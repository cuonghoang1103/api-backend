# @ docker run --rm --label oslab=1 --name os-c23 --hostname oslab --mount type=volume,dst=/data -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien c23-mem.sh 2>&1"
free -m
grep -E '^(MemTotal|MemFree|MemAvailable|Buffers|Cached|Dirty|Shmem|SwapTotal|SwapFree):' /proc/meminfo
dd if=/dev/urandom of=/data/big.bin bs=1M count=400 status=none; ls -lh /data/big.bin
free -m | head -2
python3 -c "import os; fd = os.open('/data/big.bin', os.O_RDONLY); os.fsync(fd); os.posix_fadvise(fd, 0, 0, os.POSIX_FADV_DONTNEED)"; free -m | head -2
dd if=/data/big.bin of=/dev/null bs=1M
free -m | head -2
dd if=/data/big.bin of=/dev/null bs=1M
rm /data/big.bin; free -m | head -2
vmstat -S M 1 3
node ro-ri.js & sleep 0.5
ps -o pid,rss,vsz,comm -p $(pgrep -f ro-ri.js)
for i in $(seq 1 1500); do curl -s "localhost:3001/?id=$i" > /dev/null; done; curl -s localhost:3001/?id=x
ps -o pid,rss,vsz,comm -p $(pgrep -f ro-ri.js)
grep -E '^(VmRSS|VmHWM|RssAnon|RssFile)' /proc/$(pgrep -f ro-ri.js)/status
ps -eo pid,rss,vsz,%mem,comm --sort=-rss | head -3
@ kill %1
