# @ Chương 9 · bài 9.7 — vượt khỏi rwx: capabilities (container root mặc định, bỏ CAP_DAC_OVERRIDE, Node nghe cổng 80, ping),
# @ ACL (namei, setfacl, mask, ACL mặc định), và hai tình huống: thư mục log của root, .env ai cũng đọc được.
# @ Container mặc định của Docker (KHÔNG --privileged) + cổng đặc quyền như một VPS (<1024):
# @ docker run --rm --label oslab=1 --name os-c97 --hostname oslab --sysctl net.ipv4.ip_unprivileged_port_start=1024 -v "$PWD/ch09":/lab/ch09 -w /lab/ch09 os-lab bash -c "phien c97-cap.sh 2>&1"
@ useradd -m -u 1002 -s /bin/bash bob && mkdir -p /srv/app && echo "DB_PASSWORD=s3cret" > /srv/app/.env && chown dev:dev /srv/app/.env && chmod 600 /srv/app/.env
grep -E '^Cap(Eff|Bnd)' /proc/self/status
capsh --decode=$(awk '/^CapEff/ {print $2}' /proc/self/status)
runuser -u dev -- grep CapEff /proc/self/status
ls -l /srv/app/.env; cat /srv/app/.env; capsh --drop=cap_dac_override -- -c 'cat /srv/app/.env'
sysctl net.ipv4.ip_unprivileged_port_start
runuser -u dev -- node -e "require('net').createServer().listen(80).on('error', (e) => console.log(e.code, e.syscall, e.port))"
cp $(which node) /usr/local/bin/node-web; setcap cap_net_bind_service=+ep /usr/local/bin/node-web; getcap /usr/local/bin/node-web
runuser -u dev -- node-web -e "require('net').createServer().listen(80, function () { console.log('listening on :80 as', require('os').userInfo().username); this.close() })"
getcap /usr/bin/ping; ls -l /usr/bin/ping; getfattr -d -m - /usr/bin/ping 2>/dev/null
runuser -u dev -- ping -c1 -W1 127.0.0.1 | head -2
cp /usr/bin/ping /tmp/ping-copy; getcap /tmp/ping-copy; runuser -u dev -- /tmp/ping-copy -c1 -W1 127.0.0.1 | head -2
sysctl net.ipv4.ping_group_range
@ mkdir -p /srv/app/uploads && echo "jpeg bytes" > /srv/app/uploads/a.jpg && chown -R dev:dev /srv/app/uploads && chmod 700 /srv/app/uploads && chmod 600 /srv/app/uploads/a.jpg
runuser -u www-data -- cat /srv/app/uploads/a.jpg
namei -l /srv/app/uploads/a.jpg
setfacl -m u:www-data:x /srv/app/uploads; setfacl -m u:www-data:r /srv/app/uploads/a.jpg; ls -ld /srv/app/uploads /srv/app/uploads/a.jpg
getfacl -p /srv/app/uploads/a.jpg
runuser -u www-data -- cat /srv/app/uploads/a.jpg
runuser -u www-data -- ls /srv/app/uploads
setfacl -d -m u:www-data:r /srv/app/uploads; runuser -u dev -- sh -c 'echo png > /srv/app/uploads/b.png'; getfacl -p /srv/app/uploads/b.png | grep -E 'www-data|mask'; runuser -u www-data -- cat /srv/app/uploads/b.png
chmod 600 /srv/app/uploads/a.jpg; getfacl -p /srv/app/uploads/a.jpg | grep -E 'www-data|mask'; runuser -u www-data -- cat /srv/app/uploads/a.jpg
runuser -u dev -- node -e "require('fs').appendFileSync('/var/log/app/app.log', 'started\n')" 2>&1 | grep -E '^Error'
mkdir -p /var/log/app; ls -ld /var/log/app; runuser -u dev -- node -e "require('fs').appendFileSync('/var/log/app/app.log', 'started\n')" 2>&1 | grep -E '^Error'
install -d -o dev -g dev -m 750 /var/log/app; ls -ld /var/log/app; runuser -u dev -- node -e "require('fs').appendFileSync('/var/log/app/app.log', 'started\n')"; ls -l /var/log/app
@ chmod 644 /srv/app/.env && mkdir -p /srv/api /srv/web && echo "JWT_SECRET=x" > /srv/api/.env && echo "NEXT_PUBLIC_API=/api" > /srv/web/.env.local && chmod 640 /srv/web/.env.local
find /srv -name '.env*' -type f -perm -o=r -printf '%M %u:%g %p\n'
runuser -u bob -- cat /srv/app/.env
chown dev:dev /srv/app/.env /srv/api/.env; chmod 600 /srv/app/.env /srv/api/.env; find /srv -name '.env*' -type f -perm -o=r -printf '%M %u:%g %p\n' | wc -l; runuser -u bob -- cat /srv/app/.env
