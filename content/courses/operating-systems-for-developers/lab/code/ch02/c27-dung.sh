#!/bin/bash
# c27-dung.sh — dựng hai máy cho bài 2.7 "Đọc cùng Claude" (chạy từ lab/code): "vps" (systemd + sshd + ctw-web) và "may-nha"
# (máy gõ lệnh), cùng mạng os-c27-net. Mọi thứ --label oslab=1; dọn bằng: docker rm -f os-c27-vps os-c27-nha; docker network rm os-c27-net
set -e
docker network create --label oslab=1 os-c27-net > /dev/null
docker run -d --name os-c27-vps --label oslab=1 --hostname vps-lab --network os-c27-net --network-alias vps --privileged --cgroupns=private \
  --tmpfs /run --tmpfs /run/lock -v "$PWD/ch02":/lab/ch02 os-lab-sd > /dev/null
docker run -d --name os-c27-nha --label oslab=1 --hostname may-nha --network os-c27-net -v "$PWD/ch02":/lab/ch02 os-lab-sd sleep infinity > /dev/null
sleep 5
docker exec os-c27-nha bash -c 'mkdir -p ~/.ssh && ssh-keygen -q -t ed25519 -N "" -f ~/.ssh/id_ed25519 && printf "Host vps\n  User root\n  StrictHostKeyChecking accept-new\n  UserKnownHostsFile /root/.ssh/known_hosts\n" > ~/.ssh/config'
PUB=$(docker exec os-c27-nha cat /root/.ssh/id_ed25519.pub)
docker exec os-c27-vps bash -c "mkdir -p ~/.ssh && echo '$PUB' > ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && cp /lab/ch02/systemd/ctw-web.service /etc/systemd/system/ && systemctl daemon-reload && systemctl enable --now ssh ctw-web > /dev/null 2>&1"
docker exec os-c27-nha bash -c 'mkdir -p /srv/build/static && for i in 1 2 3; do head -c 25M /dev/urandom > /srv/build/server-chunk-$i.js; done && for i in $(seq 1 1500); do head -c 3000 /dev/urandom > /srv/build/static/p$i.css; done'
echo "ready"
