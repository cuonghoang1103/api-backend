# @ Chương 8 · bài 8.5 — Buffer ngoài heap V8; một "mini-oomd" đọc PSI rồi giết sớm. Container vứt đi 128 MiB, KHÔNG swap:
# @ docker run --rm --label oslab=1 --name os-c85 --hostname oslab --memory 128m --memory-swap 128m -v "$PWD/ch08":/lab/ch08 -w /lab/ch08 os-lab bash -c "phien c85-lim.sh 2>&1"
@ gcc -O2 ws.c -o ws
node --max-old-space-size=64 buf.js
grep oom_kill /sys/fs/cgroup/memory.events
dd if=/dev/urandom of=/tmp/data bs=1M count=200 status=none
./ws 200 50 rand /tmp/data > /dev/null &
for t in $(seq 1 30); do
  sleep 1
  read -r _ a _ < /sys/fs/cgroup/memory.pressure; v=${a#avg10=}
  echo "t=${t}s  memory some avg10=${v}%"
  if [ "${v%.*}" -ge 20 ]; then p=$(pidof ws); kill $p; echo "mini-oomd: pressure ${v}% >= 20% -> killed ws (pid $p)"; break; fi
done
@ wait 2>/dev/null
grep oom_kill /sys/fs/cgroup/memory.events
@ rm -f ws /tmp/data
