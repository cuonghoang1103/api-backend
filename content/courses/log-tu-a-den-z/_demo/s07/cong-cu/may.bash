#!/bin/bash
# may.sh len|xuong|bat — máy ảo Ubuntu 24.04 THẬT (KVM, qemu trong container lgz-vm) cho Chương 7–8 khoá log. SSH: ssh -F ssh.cfg lab7
# len = tạo đĩa mới từ ảnh cloud minimal noble (SHA256 đã so) + cloud-init; bat = khởi động lại container giữ nguyên đĩa (lần boot mới)
set -e; D=~/.rtq-lgz/vm; V=~/vbg-dp/scratchpad/lgz/vm
chay() {
  docker rm -f lgz-vm >/dev/null 2>&1 || true
  docker run -d --name lgz-vm --label lgz=1 --device /dev/kvm -p 127.0.0.1:41707:2222 -v $D:/vm lgz-qemu:1 \
    qemu-system-x86_64 -enable-kvm -cpu host -smp 2 -m 1024 -drive file=/vm/lab7.qcow2,if=virtio -drive file=/vm/seed.iso,if=virtio,format=raw \
    -netdev user,id=n0,hostfwd=tcp::2222-:22 -device virtio-net-pci,netdev=n0 -device qemu-xhci -device usb-tablet -nographic >/dev/null
  for i in $(seq 1 120); do ssh -F $V/ssh.cfg lab7 test -f /var/tmp/san-sang 2>/dev/null && { echo "lab7 sẵn sàng sau ${i}x3s"; return 0; }; sleep 3; done; echo "lab7 KHÔNG lên"; return 1
}
case "$1" in
len)
  [ -f $D/khoa ] || ssh-keygen -q -t ed25519 -N '' -C khoa-tam-lgz -f $D/khoa
  rm -f $D/known_hosts
  cat > $D/user-data <<U
#cloud-config
hostname: lab7
timezone: Asia/Ho_Chi_Minh
users:
  - name: hv
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys: ["$(cat $D/khoa.pub)"]
package_update: true
packages: [jq, python3, procps, util-linux, less]
runcmd:
  - [touch, /var/tmp/san-sang]
U
  docker run --rm -v $D:/vm lgz-qemu:1 sh -c 'cd /vm && rm -f lab7.qcow2 seed.iso && qemu-img create -q -f qcow2 -b noble-min.img -F qcow2 lab7.qcow2 8G && cloud-localds seed.iso user-data'
  chay ;;
bat) chay ;;
xuong) docker rm -f lgz-vm >/dev/null 2>&1 || true ;;
xoa) docker rm -f lgz-vm >/dev/null 2>&1 || true; rm -f $D/lab7.qcow2 $D/seed.iso ;;
esac
