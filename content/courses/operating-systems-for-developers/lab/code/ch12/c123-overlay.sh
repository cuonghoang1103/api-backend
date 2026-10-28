# @ Chương 12 · bài 12.3 — OverlayFS bằng tay trên một tmpfs (overlay không nhận upperdir nằm trên overlay khác).
# @ docker run --rm --label oslab=1 --name os-c123 --hostname oslab --privileged --memory 1g -v "$PWD/ch12":/lab/ch12 -w /lab/ch12 os-lab bash -c "phien c123-overlay.sh 2>&1"
mkdir /ovl && mount -t tmpfs -o size=700m ovl /ovl && cd /ovl && mkdir -p base/etc app/etc upper work merged
echo "port=80" > base/etc/app.conf; echo "old" > base/etc/legacy.conf; echo "Debian 13" > base/os-release
echo "port=8080" > app/etc/app.conf; echo "console.log('hi')" > app/server.js
dd if=/dev/zero of=base/big.db bs=1M count=200 status=none; ls -s --block-size=M base/big.db
mount -t overlay overlay -o lowerdir=app:base,upperdir=upper,workdir=work merged
findmnt -no FSTYPE,OPTIONS /ovl/merged
ls merged merged/etc; cat merged/etc/app.conf
echo "GET /" > merged/access.log; ls upper
echo "workers=4" >> merged/etc/app.conf; cat merged/etc/app.conf; echo "--- lower layers untouched:"; cat app/etc/app.conf base/etc/app.conf
ls -l upper/etc
rm merged/etc/legacy.conf; ls merged/etc; ls -l upper/etc/legacy.conf; ls base/etc
rm -rf merged/etc && mkdir merged/etc && ls merged/etc; getfattr -d -m 'trusted.overlay' upper/etc 2>/dev/null
du -sm upper; time sh -c 'echo x >> merged/big.db'; du -sm upper
time sh -c 'echo y >> merged/big.db'
cat /proc/self/mountinfo | grep -E ' / / ' | grep -oE 'lowerdir=[^,]*' | tr ':' '\n' | wc -l
cat /proc/self/mountinfo | grep -E ' / / ' | grep -oE '(upperdir|workdir)=[^,]*' | sed 's|/var/lib/desktop-containerd/daemon/io.containerd.snapshotter.v1.overlayfs|…|'
umount /ovl/merged; ls upper upper/etc
