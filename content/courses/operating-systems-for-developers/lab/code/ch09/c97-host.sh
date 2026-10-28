# @ Chương 9 · bài 9.7 — gõ TỪ MÁY CHỦ (bash lab/code/ch09/phien-host.sh lab/code/ch09/c97-host.sh): người dùng trong container,
# @ volume, --user, --cap-drop, user namespace; và nginx (ảnh nginx:alpine có sẵn) không đọc được thư mục upload. Mọi
# @ container/volume --label oslab=1, xoá ở cuối.
@ docker volume create --label oslab=1 os-c97-vol > /dev/null
docker run --rm --label oslab=1 os-lab cat /proc/self/uid_map
docker run --rm --label oslab=1 -v os-c97-vol:/data os-lab bash -c 'id -un; touch /data/report.csv; ls -ln /data'
docker run --rm --label oslab=1 --user 1001:1001 -v os-c97-vol:/data os-lab bash -c 'id; touch /data/export.csv'
docker run --rm --label oslab=1 -v os-c97-vol:/data os-lab bash -c 'chown 1001:1001 /data'
docker run --rm --label oslab=1 --user 1001:1001 -v os-c97-vol:/data os-lab bash -c 'touch /data/export.csv; ls -ln /data'
docker run --rm --label oslab=1 --cap-drop ALL os-lab bash -c 'id -un; touch /tmp/x; chown 1001 /tmp/x'
docker run --rm --label oslab=1 --privileged os-lab bash -c 'runuser -u dev -- unshare --user --map-root-user sh -c "id; cat /proc/self/uid_map; touch /tmp/u.txt; ls -ln /tmp/u.txt"; echo "seen from outside the namespace:"; ls -ln /tmp/u.txt'
@ docker run -d --label oslab=1 --name os-c97web nginx:alpine > /dev/null; sleep 1
docker exec os-c97web sh -c 'mkdir -p /srv/uploads && echo "<jpeg>" > /srv/uploads/a.jpg && chmod 700 /srv/uploads && printf "server { listen 8080; location /uploads/ { alias /srv/uploads/; } }\n" > /etc/nginx/conf.d/uploads.conf && nginx -s reload 2>&1'
@ sleep 1
docker exec os-c97web wget -q -O- http://127.0.0.1:8080/uploads/a.jpg
docker logs os-c97web 2>&1 | grep -o 'open() .*Permission denied)' | tail -1
docker exec os-c97web ps -o user,pid,args | grep 'nginx:' | head -3
docker exec os-c97web ls -ld /srv/uploads /srv/uploads/a.jpg
docker exec os-c97web sh -c 'chgrp -R nginx /srv/uploads && chmod 750 /srv/uploads && chmod 640 /srv/uploads/a.jpg && ls -ld /srv/uploads /srv/uploads/a.jpg'
docker exec os-c97web wget -q -O- http://127.0.0.1:8080/uploads/a.jpg
@ docker rm -f os-c97web > /dev/null; docker volume rm os-c97-vol > /dev/null
