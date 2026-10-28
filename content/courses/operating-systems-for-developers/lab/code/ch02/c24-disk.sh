# @ docker run --rm --label oslab=1 --name os-c24 --hostname oslab --privileged -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien c24-disk.sh 2>&1"
# @ "đĩa VPS" = một file 64 MB định dạng ext4 với đúng 2048 inode, gắn qua loop device — KHÔNG đụng đĩa thật
@ truncate -s 64M /tmp/vps.img && mkfs.ext4 -q -N 2048 -L vps /tmp/vps.img && mkdir -p /mnt/vps && mount -o loop /tmp/vps.img /mnt/vps
df -h /mnt/vps
df -i /mnt/vps
tune2fs -l $(findmnt -no SOURCE /mnt/vps) | grep -E '^(Block size|Block count|Reserved block count):'
mkdir -p /mnt/vps/log; python3 ghi-log.py /mnt/vps/log/app.log & sleep 2
df -h /mnt/vps; du -sh /mnt/vps/log
rm /mnt/vps/log/app.log
df -h /mnt/vps; du -sh /mnt/vps/log
lsof -nP +L1 /mnt/vps
ls -l /proc/$(pgrep -f ghi-log.py)/fd
: > /proc/$(pgrep -f ghi-log.py)/fd/3; df -h /mnt/vps
@ disown -a; pkill -f ghi-log.py
mkdir /mnt/vps/sessions && for i in $(seq 1 2100); do { echo x > /mnt/vps/sessions/sess_$i; } 2> /dev/null || { echo "write failed at file $i"; break; }; done
touch /mnt/vps/deploy.lock
df -h /mnt/vps
df -i /mnt/vps
for d in /mnt/vps/*/; do echo "$(find "$d" | wc -l) $d"; done | sort -rn
find /mnt/vps/sessions -name 'sess_*' -mmin -5 -delete; df -i /mnt/vps | tail -1
@ mkdir -p /mnt/vps/cache /mnt/vps/uploads && fallocate -l 22M /mnt/vps/cache/build.pack && fallocate -l 9M /mnt/vps/uploads/a.jpg && fallocate -l 6M /mnt/vps/log/app.log.1
du -xh --max-depth=1 /mnt/vps | sort -h
dd if=/dev/zero of=/mnt/vps/log/big bs=1M count=40; echo "exit=$?"; ls -lh /mnt/vps/log/big; df -h /mnt/vps | tail -1
@ umount /mnt/vps
