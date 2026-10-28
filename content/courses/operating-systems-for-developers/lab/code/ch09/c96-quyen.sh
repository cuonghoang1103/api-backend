# @ Chương 9 · bài 9.6 — rwx trên file và thư mục, owner thắng other, umask, ai được xoá file, sticky, setgid thư mục,
# @ setuid (ids.c), root bỏ qua rwx. Người dùng dev (uid 1001, có sẵn trong ảnh) + bob (tạo trong container vứt đi):
# @ docker run --rm --label oslab=1 --name os-c96 --hostname oslab -v "$PWD/ch09":/lab/ch09 -w /lab/ch09 os-lab bash -c "phien c96-quyen.sh 2>&1"
@ useradd -m -u 1002 -s /bin/bash bob && groupadd -g 2000 team && usermod -aG team dev && usermod -aG team bob && gcc -O2 ids.c -o /usr/local/bin/ids
@ mkdir -p /srv/app && cd /srv/app && echo "DB_PASSWORD=s3cret" > .env
id dev; id bob
ls -l /srv/app/.env; stat -c '%A = %a  owner=%U group=%G  %n' /srv/app/.env
umask
umask 077; touch /srv/app/secret.key; mkdir /srv/app/private; umask 022
stat -c '%A %a %n' /srv/app/secret.key /srv/app/private
node -e "require('fs').writeFileSync('/srv/app/token.json', '{}', { mode: 0o666 })"; stat -c '%A %a %n' /srv/app/token.json
@ echo "hello" > /tmp/own.txt && chown dev:dev /tmp/own.txt && chmod 077 /tmp/own.txt
ls -l /tmp/own.txt
runuser -u dev -- cat /tmp/own.txt
runuser -u bob -- cat /tmp/own.txt
@ mkdir -p /srv/box && echo "report" > /srv/box/q3.txt
chmod 744 /srv/box; ls -ld /srv/box; runuser -u dev -- ls -l /srv/box; runuser -u dev -- cat /srv/box/q3.txt
chmod 711 /srv/box; ls -ld /srv/box; runuser -u dev -- ls /srv/box; runuser -u dev -- cat /srv/box/q3.txt
@ mkdir -p /srv/devdir && chown dev /srv/devdir && touch /srv/devdir/owned-by-root && chmod 444 /srv/devdir/owned-by-root
ls -l /srv/devdir/owned-by-root; runuser -u dev -- rm -f /srv/devdir/owned-by-root; ls /srv/devdir
@ touch /srv/app/dev-notes.txt && chown dev /srv/app/dev-notes.txt
ls -ld /srv/app; ls -l /srv/app/dev-notes.txt; runuser -u dev -- rm -f /srv/app/dev-notes.txt
ls -ld /tmp; runuser -u bob -- touch /tmp/bob-session; runuser -u dev -- rm -f /tmp/bob-session
mkdir -m 777 /srv/drop; runuser -u bob -- touch /srv/drop/bob-session; runuser -u dev -- rm -f /srv/drop/bob-session; ls /srv/drop
mkdir /srv/team; chgrp team /srv/team; chmod 2775 /srv/team; ls -ld /srv/team
runuser -u dev -- touch /srv/team/plan.md; runuser -u bob -- touch /srv/team/notes.md; ls -l /srv/team
ls -l /usr/bin/passwd /usr/bin/su
chmod 600 /srv/app/.env; runuser -u dev -- ids
chmod u+s /usr/local/bin/ids; ls -l /usr/local/bin/ids; runuser -u dev -- ids
find / -xdev -perm -4000 -type f 2>/dev/null | sort
@ chmod u-s /usr/local/bin/ids
chmod 000 /srv/app/.env; ls -l /srv/app/.env; cat /srv/app/.env
printf '#!/bin/sh\necho deploy\n' > /srv/app/deploy.sh; chmod 644 /srv/app/deploy.sh; env /srv/app/deploy.sh
