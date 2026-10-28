# @ Chương 9 · bài 9.4 — journaling: journal trên đĩa, một giao dịch thật (logdump), phát lại sau "mất điện"; ext2 không
# @ journal: dựng tay đúng một trạng thái sập (chỉ inode kịp xuống đĩa) ⇒ dữ liệu cũ của người khác lộ ra; data=journal ghi 2 lần.
# @ Mọi "đĩa" là file nhỏ gắn loop trong container vứt đi --privileged:
# @ docker run --rm --label oslab=1 --name os-c94 --hostname oslab --privileged -v "$PWD/ch09":/lab/ch09 -w /lab/ch09 os-lab bash -c "phien c94-journal.sh 2>&1"
@ truncate -s 32M /tmp/vps.img && mkfs.ext4 -q -L vps -E lazy_itable_init=0,lazy_journal_init=0 /tmp/vps.img && mkdir -p /srv/data /mnt/crash /mnt/old && mount -o loop /tmp/vps.img /srv/data && sync && sleep 1
dumpe2fs -h /tmp/vps.img 2>/dev/null | grep -E '^(Filesystem features|Total journal size|Journal sequence)'
grep -E '^(data=|commit=|barrier|journal_checksum|auto_da_alloc)' /proc/fs/ext4/$(basename $(findmnt -no SOURCE /srv/data))/options | tr '\n' ' '; echo
dumpe2fs /tmp/vps.img 2>/dev/null | grep -E '^ +(Primary superblock|Reserved GDT|Block bitmap at|Inode bitmap at|Inode table at)' | head -5
mkdir /srv/data/uploads; for i in 1 2 3; do echo "photo $i" > /srv/data/uploads/p$i.jpg; done
sleep 7; cp /tmp/vps.img /tmp/crash.img
debugfs -R 'ls /' /tmp/crash.img 2>/dev/null
dumpe2fs -h /tmp/crash.img 2>/dev/null | grep -o needs_recovery
debugfs -R 'logdump -a' /tmp/crash.img 2>/dev/null | grep -v '^  [0-9a-f]\{4\}' | grep -v '^$'
mount -o loop /tmp/crash.img /mnt/crash; dmesg | grep 'recovery complete' | tail -1 | sed 's/^\[[ 0-9.]*\] //'; ls -l /mnt/crash/uploads
debugfs -R 'icheck 6 1581' /tmp/crash.img 2>/dev/null; debugfs -R 'imap /uploads/p1.jpg' /tmp/crash.img 2>/dev/null
@ umount /mnt/crash; rm -f /tmp/crash.img
D=$(basename $(findmnt -no SOURCE /srv/data)); python3 -c "import os; fd = os.open('/srv/data/events.log', os.O_WRONLY | os.O_CREAT | os.O_APPEND); [(os.write(fd, b'payment ok\n'), os.fsync(fd)) for _ in range(500)]"; head -9 /proc/fs/jbd2/$D-8/info
@ cd /; umount /srv/data
truncate -s 8M /tmp/old.img && mkfs.ext2 -q -b 1024 /tmp/old.img && mount -o loop /tmp/old.img /mnt/old
echo "invoice 2026-10-28: total 1,250,000 VND" > /mnt/old/invoice.txt
echo "DB_PASSWORD=hunter2 (another user's file)" > /mnt/old/old-secret.txt; sync
B=$(debugfs -R 'bmap /old-secret.txt 0' /tmp/old.img 2>/dev/null); echo "old-secret.txt lives in block $B"; rm /mnt/old/old-secret.txt; umount /mnt/old
debugfs -w -R "sif /invoice.txt size 2048" /tmp/old.img 2>/dev/null; debugfs -w -R "sif /invoice.txt blocks 4" /tmp/old.img 2>/dev/null; debugfs -w -R "sif /invoice.txt block[1] $B" /tmp/old.img 2>/dev/null
mount -o loop,ro /tmp/old.img /mnt/old; strings /mnt/old/invoice.txt; umount /mnt/old
e2fsck -fn /tmp/old.img
for mode in ordered writeback journal; do rm -f /tmp/m.img; truncate -s 128M /tmp/m.img; mkfs.ext4 -q /tmp/m.img; mount -o loop,data=$mode /tmp/m.img /srv/data; d=$(basename $(findmnt -no SOURCE /srv/data)); sync; a=$(cat /sys/fs/ext4/$d/session_write_kbytes); head -c 32M /dev/urandom > /srv/data/f; sync; b=$(cat /sys/fs/ext4/$d/session_write_kbytes); echo "data=$mode: app wrote 32768 KiB, the disk received $((b-a)) KiB"; umount /srv/data; done
@ truncate -s 64M /tmp/live.img && mkfs.ext4 -q /tmp/live.img && mount -o loop /tmp/live.img /srv/data
( for i in $(seq 1 6000); do mkdir -p /srv/data/d$((i%80)); echo "file $i" > /srv/data/d$((i%80))/f$i; done ) & W=$!; ( while kill -0 $W 2>/dev/null; do sync; done ) & for k in $(seq 1 12); do sleep 0.25; cp /tmp/live.img /tmp/copy$k.img; done; wait
for k in $(seq 1 12); do e2fsck -fy /tmp/copy$k.img > /tmp/fsck$k.txt 2>&1; echo "copy $k: $(grep -cE '^(Entry|Inode [0-9]+ (was|has|is|ref)|Unattached|Block bitmap differences|Inode bitmap differences|Multiply)' /tmp/fsck$k.txt) real errors after journal replay"; done
grep -hE '^Entry' /tmp/fsck*.txt | head -2
@ umount /srv/data; rm -f /tmp/copy*.img /tmp/live.img
