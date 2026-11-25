#!/bin/bash
# may.bash bat|xuong — Chương 8: HAI máy ảo Ubuntu 24.04 thật (KVM) trên một mạng LAN riêng 192.168.56.0/24
#   lab7  (máy bị dò, đĩa của Chương 7, giữ nguyên lịch sử) — NIC2 192.168.56.10 — ssh -F ssh.cfg lab7  (cổng 41707)
#   keodo (máy "kẻ dò", đĩa mới từ ảnh cloud)               — NIC2 192.168.56.66 — ssh -F ssh.cfg keodo (cổng 41709)
# LAN = netdev socket của qemu trên 127.0.0.1 BÊN TRONG container lgz-vm (không tạo mạng docker, không ra Internet).
# NIC1 mỗi máy là mạng user của qemu (chỉ để apt cài gói). Máy chủ log trung tâm (Bài 8.2) = 10.0.2.2 nhìn từ lab7 = container lgz-logsrv chung netns.
set -e; D=~/.rtq-lgz/vm; V=~/vbg-dp/scratchpad/lgz/vm
cho() { for i in $(seq 1 120); do ssh -F $V/ssh.cfg $1 test -f /var/tmp/san-sang 2>/dev/null && { echo "$1 sẵn sàng sau ${i}x3s"; return 0; }; sleep 3; done; echo "$1 KHÔNG lên"; return 1; }
case "$1" in
bat)
  docker rm -f lgz-vm >/dev/null 2>&1 || true
  if [ ! -f $D/keodo.qcow2 ]; then
    cat > $D/user-data-keodo <<U
#cloud-config
hostname: keodo
timezone: Asia/Ho_Chi_Minh
users:
  - name: hv
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys: ["$(cat $D/khoa.pub)"]
package_update: true
packages: [hydra, sshpass, openssh-client, jq]
runcmd:
  - [touch, /var/tmp/san-sang]
U
    docker run --rm -v $D:/vm lgz-qemu:1 sh -c 'cd /vm && qemu-img create -q -f qcow2 -b noble-min.img -F qcow2 keodo.qcow2 8G && cloud-localds seed-keodo.iso user-data-keodo'
  fi
  docker run -d --name lgz-vm --label lgz=1 --device /dev/kvm -p 127.0.0.1:41707:2222 -p 127.0.0.1:41709:2223 -v $D:/vm lgz-qemu:1 \
    qemu-system-x86_64 -enable-kvm -cpu host -smp 2 -m 1024 -drive file=/vm/lab7.qcow2,if=virtio -drive file=/vm/seed.iso,if=virtio,format=raw \
    -netdev user,id=n0,hostfwd=tcp::2222-:22 -device virtio-net-pci,netdev=n0 \
    -netdev socket,id=n1,listen=127.0.0.1:41708 -device virtio-net-pci,netdev=n1,mac=52:54:00:56:00:10 \
    -device qemu-xhci -device usb-tablet -nographic >/dev/null
  sleep 2
  docker exec -d lgz-vm qemu-system-x86_64 -enable-kvm -cpu host -smp 1 -m 768 -drive file=/vm/keodo.qcow2,if=virtio -drive file=/vm/seed-keodo.iso,if=virtio,format=raw \
    -netdev user,id=n0,hostfwd=tcp::2223-:22 -device virtio-net-pci,netdev=n0 \
    -netdev socket,id=n1,connect=127.0.0.1:41708 -device virtio-net-pci,netdev=n1,mac=52:54:00:56:00:66 -nographic
  cho lab7; cho keodo ;;
xuong)
  for m in keodo lab7; do ssh -F $V/ssh.cfg $m 'sudo systemctl poweroff' 2>/dev/null || true; done; sleep 15
  docker rm -f lgz-vm lgz-logsrv >/dev/null 2>&1 || true ;;
esac
