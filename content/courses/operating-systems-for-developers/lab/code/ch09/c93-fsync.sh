# @ Chương 9 · bài 9.3 — write() vs đĩa, Dirty, fsync/fdatasync/O_DSYNC/O_DIRECT đo thật, "rút điện" bằng chép ảnh đĩa.
# @ "Đĩa VPS" = file ext4 64 MB gắn loop trong container vứt đi --privileged (loop + mount); không đụng đĩa thật:
# @ docker run --rm --label oslab=1 --name os-c93 --hostname oslab --privileged -v "$PWD/ch09":/lab/ch09 -w /lab/ch09 os-lab bash -c "phien c93-fsync.sh 2>&1"
@ gcc -O2 wbench.c -o wbench && gcc -O2 incore.c -o incore
@ truncate -s 64M /tmp/vps.img && mkfs.ext4 -q -L vps /tmp/vps.img && mkdir -p /srv/data && mount -o loop /tmp/vps.img /srv/data && sync
sysctl vm.dirty_expire_centisecs vm.dirty_writeback_centisecs vm.dirty_background_ratio vm.dirty_ratio
grep -E '^(Dirty|Writeback):' /proc/meminfo
head -c 24M /dev/urandom > /srv/data/upload.bin; sleep 1; grep -E '^(Dirty|Writeback):' /proc/meminfo
time sync; grep -E '^(Dirty|Writeback):' /proc/meminfo
./wbench /srv/data/bench.dat 2000
for run in 1 2 3; do ./wbench /srv/data/bench.dat 2000 2>/dev/null | awk '{printf "%s %s  ", $1, $6} END {print "(us/write)"}'; done
./wbench /dev/shm/bench.dat 2000 2>&1 | head -2
@ rm -f /srv/data/bench.dat /dev/shm/bench.dat
head -c 8M /dev/urandom > /srv/data/a.bin; ./incore /srv/data/a.bin
gnudd if=/dev/zero of=/srv/data/b.bin bs=1M count=8 oflag=direct status=none; ./incore /srv/data/b.bin
dd --version | head -1; dd if=/dev/zero of=/srv/data/c.bin bs=1M count=8 oflag=direct status=none; ./incore /srv/data/c.bin
strace -e trace=write,fcntl dd if=/dev/zero of=/srv/data/c.bin bs=1M count=1 oflag=direct status=none 2>&1 | grep -E 'EINVAL|F_SETFL' | head -3
cat crash.sh
echo "order #1001 paid" > /srv/data/orders.log; ./crash.sh /tmp/vps.img orders.log
sleep 6; ./crash.sh /tmp/vps.img orders.log
sleep 34; ./crash.sh /tmp/vps.img orders.log
echo "order #1002 paid" > /srv/data/o2.log; sync /srv/data/o2.log; ./crash.sh /tmp/vps.img o2.log
@ echo '{"v":1}' > /srv/data/config.json; sync
node luu.js rename /srv/data/config.json '{"v":2}'; ./crash.sh /tmp/vps.img config.json
sleep 6; ./crash.sh /tmp/vps.img config.json
@ echo '{"v":1}' > /srv/data/config.json; sync
mount -o remount,noauto_da_alloc /srv/data
node luu.js rename /srv/data/config.json '{"v":2}'; sleep 9; ./crash.sh /tmp/vps.img config.json
sleep 30; ./crash.sh /tmp/vps.img config.json
@ echo '{"v":1}' > /srv/data/config.json; sync
node luu.js safe /srv/data/config.json '{"v":2}'; ./crash.sh /tmp/vps.img config.json
mount -o remount,auto_da_alloc /srv/data
node doc-ghi.js inplace 5000
node doc-ghi.js rename 5000
@ cd /; umount /srv/data
