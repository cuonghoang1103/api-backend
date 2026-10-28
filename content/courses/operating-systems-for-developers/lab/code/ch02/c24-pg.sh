# @ chạy TỪ MÁY CHỦ: bash ch02/phien-host.sh ch02/c24-pg.sh
# @ "đĩa VPS" = file ext4 96 MB (trong volume os-c24-img) gắn loop vào /srv/vps của container Postgres 17. Postgres (người dùng
# @ postgres) và "cache build" (root) dùng CHUNG đĩa đó — như /var/lib/docker và volume Postgres cùng nằm trên đĩa gốc VPS.
# @ --restart unless-stopped như docker-compose của dự án. Mọi container/volume --label oslab=1, xoá ở cuối.
@ docker volume create --label oslab=1 os-c24-img > /dev/null; docker run --rm --label oslab=1 -v os-c24-img:/img os-lab bash -c 'truncate -s 96M /img/vps.img && mkfs.ext4 -q -L vps /img/vps.img'
docker run -d --name os-c24-pg --label oslab=1 --privileged --restart unless-stopped -e POSTGRES_PASSWORD=lab -e PGDATA=/srv/vps/pgdata -v os-c24-img:/img postgres:17 bash -c 'mkdir -p /srv/vps && mount -o loop /img/vps.img /srv/vps && exec docker-entrypoint.sh postgres' > /dev/null; sleep 8
docker exec os-c24-pg df -h /srv/vps
docker exec os-c24-pg psql -U postgres -qc "create table orders(id serial primary key, note text)" -c "insert into orders(note) select 'order ' || g from generate_series(1, 20000) g" -c "select count(*) from orders"
docker exec os-c24-pg bash -c 'mkdir -p /srv/vps/buildcache; dd if=/dev/zero of=/srv/vps/buildcache/layer.tar bs=1M count=200 status=none; df -h /srv/vps'
docker exec os-c24-pg psql -U postgres -c "insert into orders(note) select 'order ' || g from generate_series(1, 20000) g"
docker exec os-c24-pg psql -U postgres -c "insert into orders(note) values ('one small order')" -c "select pg_switch_wal()"
docker exec os-c24-pg psql -U postgres -c "checkpoint"
sleep 4; docker ps -a --filter name=os-c24-pg --format '{{.Names}}  {{.Status}}'
docker logs os-c24-pg 2>&1 | grep -E 'PANIC|FATAL|terminated by|due to startup' | head -5 | cut -c 25-
docker exec os-c24-pg psql -U postgres -c "select count(*) from orders"
docker stop os-c24-pg > /dev/null; docker run --rm --label oslab=1 --privileged -v os-c24-img:/img os-lab bash -c 'mount -o loop /img/vps.img /mnt && du -sh /mnt/* && rm -rf /mnt/buildcache && df -h /mnt; umount /mnt'
docker start os-c24-pg > /dev/null; sleep 6; docker ps -a --filter name=os-c24-pg --format '{{.Names}}  {{.Status}}'
docker logs os-c24-pg 2>&1 | grep -E 'redo done|ready to accept' | tail -2 | cut -c 25-
docker exec os-c24-pg psql -U postgres -c "select count(*) from orders"
@ docker rm -f os-c24-pg > /dev/null; docker volume rm os-c24-img > /dev/null
