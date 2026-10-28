# @ Chương 9 · bài 9.1 — VFS, inode vs dentry, hard/soft link, debugfs. "Đĩa" = file ext4 8 MB, 64 inode, gắn qua loop
# @ trong container vứt đi --privileged (cần loop device) — KHÔNG đụng đĩa thật:
# @ docker run --rm --label oslab=1 --name os-c91 --hostname oslab --privileged -v "$PWD/ch09":/lab/ch09 -w /lab/ch09 os-lab bash -c "phien c91-inode.sh 2>&1"
@ gcc -O2 vfs.c -o vfs
@ truncate -s 8M /tmp/disk.img && mkfs.ext4 -q -N 64 -L lab /tmp/disk.img && mkdir -p /mnt/lab && mount -o loop /tmp/disk.img /mnt/lab
findmnt -lo TARGET,FSTYPE,SOURCE | grep -E '^(/|/proc|/sys/fs/cgroup|/dev/shm|/etc/hosts|/mnt/lab) ' | sed -E 's#containers/[0-9a-f]{64}#containers/<id>#'
@ echo "load 0.42" > /mnt/lab/status.txt; echo "cache line" > /dev/shm/status.txt
strace -e trace=openat,read,close -P /proc/loadavg -P /dev/shm/status.txt -P /mnt/lab/status.txt ./vfs /proc/loadavg /dev/shm/status.txt /mnt/lab/status.txt /etc/os-release 2>&1 | grep -v '^+++'
cd /mnt/lab
echo "PORT=3000" > app.env
ls -li app.env
stat app.env
ln app.env app.env.bak
ln -s app.env current.env
ls -li
mkdir -p releases/v1 releases/v2
stat -c '%n  inode=%i  links=%h' . releases releases/v1
rm app.env
cat app.env.bak
cat current.env
ls -l current.env
@ cd /; sync; umount /mnt/lab
debugfs -R 'ls -l /' /tmp/disk.img
debugfs -R 'stat /app.env.bak' /tmp/disk.img
debugfs -R 'stat /current.env' /tmp/disk.img
debugfs -R 'blocks /' /tmp/disk.img
debugfs -R "bd $(debugfs -R 'blocks /' /tmp/disk.img 2>/dev/null)" /tmp/disk.img 2>/dev/null | head -8
@ mount -o loop /tmp/disk.img /mnt/lab
ln /mnt/lab/app.env.bak /tmp/app.env
ln /mnt/lab/releases /mnt/lab/releases-link
strace -e trace=rename,renameat,renameat2 mv /mnt/lab/app.env.bak /tmp/ 2>&1 | head -2
rm /mnt/lab/current.env; touch /mnt/lab/new.txt; ls -i /mnt/lab/new.txt
cat /proc/sys/fs/dentry-state
grep -E '^(dentry|ext4_inode_cache|proc_inode_cache) ' /proc/slabinfo | awk '{print $1, $2, "objects of", $4, "bytes"}'
@ umount /mnt/lab
