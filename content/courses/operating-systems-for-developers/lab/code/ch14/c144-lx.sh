# @ Chương 14 · bài 14.4 — trong container lab: docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch14":/lab/ch14 -w /lab/ch14 os-lab bash -c "phien c144-lx.sh 2>&1" > ../out/c144-lx.out.txt
free -m
grep -E '^(MemTotal|MemAvailable|SwapTotal|SwapFree|CommitLimit|Committed_AS):' /proc/meminfo
cat /proc/sys/vm/overcommit_memory
cat /sys/module/zswap/parameters/enabled 2>/dev/null || echo "zswap: not built in"
python3 an.py 512 3 & P=$!; sleep 1.5; ps -o pid,rss,vsz,comm -p $P; grep -E '^(VmRSS|RssAnon|VmSwap):' /proc/$P/status
wait $P
