# @ Chương 9 · bài 9.5 — điểm gắn và bind mount: Docker tự bind-mount /etc/hosts…; gắn đè lên thư mục có sẵn file; bind
# @ mount thư mục vs MỘT file; sed -i / mv / vim đổi inode nên bind mount một file đứng yên (sự cố nginx.conf 25/08/2026);
# @ noexec/nosuid. mount cần quyền ⇒ container vứt đi --privileged:
# @ docker run --rm --label oslab=1 --name os-c95 --hostname oslab --privileged -v "$PWD/ch09":/lab/ch09 -w /lab/ch09 os-lab bash -c "phien c95-mount.sh 2>&1"
@ truncate -s 16M /tmp/data.img && mkfs.ext4 -q -L data /tmp/data.img
findmnt -lo TARGET,SOURCE,FSTYPE | grep -E '^/etc/(hosts|hostname|resolv.conf) ' | sed -E 's#containers/[0-9a-f]{12}[0-9a-f]+#containers/<id>#'
grep ' /etc/hosts ' /proc/self/mountinfo | sed -E 's#containers/[0-9a-f]{12}[0-9a-f]+#containers/<id>#'
mkdir -p /srv/uploads; echo "uploaded while the data disk was NOT mounted" > /srv/uploads/avatar-17.txt; ls /srv/uploads
mount -o loop /tmp/data.img /srv/uploads; ls /srv/uploads; findmnt /srv/uploads
mkdir -p /tmp/rootview; mount --bind / /tmp/rootview; ls -l /tmp/rootview/srv/uploads; umount /tmp/rootview
umount /srv/uploads
mkdir -p /host/nginx /ctr/conf.d /ctr/etc; echo 'worker_connections 512;' > /host/nginx/nginx.conf; touch /ctr/etc/nginx.conf
mount --bind /host/nginx /ctr/conf.d
mount --bind /host/nginx/nginx.conf /ctr/etc/nginx.conf
findmnt -lo TARGET,SOURCE | grep /ctr/
stat -c '%n  inode=%i' /host/nginx/nginx.conf /ctr/conf.d/nginx.conf /ctr/etc/nginx.conf
echo 'worker_connections 1024;' > /host/nginx/nginx.conf; cat /ctr/etc/nginx.conf
strace -f -e trace=openat,rename,renameat,renameat2 sed -i 's/1024/4096/' /host/nginx/nginx.conf 2>&1 | grep -E 'nginx|sed[A-Za-z0-9]{6}' | grep -v ENOENT
stat -c '%n  inode=%i' /host/nginx/nginx.conf /ctr/conf.d/nginx.conf /ctr/etc/nginx.conf
cat /host/nginx/nginx.conf /ctr/conf.d/nginx.conf /ctr/etc/nginx.conf
grep '/ctr/etc/nginx.conf' /proc/self/mountinfo | awk '{print $4, $5}'
echo 'worker_connections 8192;' > /host/nginx/nginx.conf; cat /ctr/etc/nginx.conf
umount /ctr/etc/nginx.conf; mount --bind /host/nginx/nginx.conf /ctr/etc/nginx.conf; cat /ctr/etc/nginx.conf
vi -es -c 's/8192/2048/' -c 'wq' /host/nginx/nginx.conf; stat -c '%n  inode=%i' /host/nginx/nginx.conf /ctr/etc/nginx.conf; cat /ctr/etc/nginx.conf
mount --bind -o ro /host/nginx /ctr/conf.d; touch /ctr/conf.d/new.conf; grep ' /ctr/conf.d ' /proc/self/mountinfo | tail -1 | awk '{print $5, $6}'
mkdir -p /srv/public-uploads; mount -t tmpfs -o size=4m,noexec,nosuid,nodev tmpfs /srv/public-uploads
printf '#!/bin/sh\necho "attacker code runs as $(id -un)"\n' > /srv/public-uploads/shell.sh; chmod +x /srv/public-uploads/shell.sh; ls -l /srv/public-uploads/shell.sh
env /srv/public-uploads/shell.sh
sh /srv/public-uploads/shell.sh
findmnt -lo TARGET,FSTYPE,OPTIONS /srv/public-uploads
