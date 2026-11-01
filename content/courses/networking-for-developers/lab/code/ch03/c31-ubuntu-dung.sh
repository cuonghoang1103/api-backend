#!/bin/bash
# Dựng máy nfi-ubuntu (systemd + systemd-resolved) vào mạng nhà 192.168.50.20 của "Internet trong một hộp" — chạy trên MÁY CỦA BẠN.
docker rm -f nfi-ubuntu >/dev/null 2>&1
docker run -d --name nfi-ubuntu --hostname ubuntu --label netlab=1 --network nfi-home --ip 192.168.50.20 \
  --cap-add SYS_ADMIN --cap-add NET_ADMIN --cap-add NET_RAW --security-opt seccomp=unconfined \
  --tmpfs /run --tmpfs /run/lock --cgroupns=host -v /sys/fs/cgroup:/sys/fs/cgroup:rw \
  -v "$(cd "$(dirname "$0")/../.." && pwd)":/lab/k:ro net-lab-systemd >/dev/null
sleep 6
docker exec nfi-ubuntu bash -c 'ip route replace default via 192.168.50.1 && umount /etc/resolv.conf && ln -sf ../run/systemd/resolve/stub-resolv.conf /etc/resolv.conf && systemctl restart systemd-resolved'
echo "nfi-ubuntu: $(docker exec nfi-ubuntu systemctl is-active systemd-resolved)"
