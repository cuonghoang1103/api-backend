#!/bin/bash
# may.bash len|bat|xuong — Chương 11: MỘT LAN "nhà" ảo thật (KVM, qemu trong container lgz-c11, cầu br0 + tap; không tạo mạng docker):
#   wrt      router OpenWrt 25.12.6 x86-64 THẬT — LAN 192.168.56.1 (eth0 = tap), WAN = mạng user của qemu (eth1, NAT ra Internet để apk cài gói)
#   lab7     máy ảo Ubuntu của bạn (đĩa Ch7–8) — LAN tĩnh 192.168.56.10, nhận syslog của router; ssh -F ssh.cfg lab7 (cổng 41707)
#   keodo    "người lạ" bắt được Wi‑Fi (đĩa Ch8) — LAN tĩnh 192.168.56.66; ssh -F ssh.cfg keodo (cổng 41709)
#   android  thiết bị cần lần theo ở Lab 11 (Ubuntu đóng vai, hostname android-7f3a) — CHỈ có LAN, DHCP từ router; ssh qua lab7
#   win      máy Windows Server 2025 (bản đánh giá 180 ngày) — CHỈ có LAN, DHCP; ssh qua lab7 (cài lần đầu: win-cai.bash)
# len = tạo đĩa mới cho wrt + android (lab7/keodo giữ đĩa cũ); bat = bật lại giữ đĩa; xuong = tắt sạch.
set -e
D=~/.rtq-lgz/vm; C=~/.rtq-lgz/c11; S=$(cd "$(dirname "$0")" && pwd); CFG=$S/ssh.cfg
WRT_IMG=openwrt-25.12.6-x86-64-generic-ext4-combined.img
q() { docker exec lgz-c11 "$@"; }
cho() { for i in $(seq 1 100); do ssh -F $CFG $1 "${2:-true}" >/dev/null 2>&1 && { echo "$1 sẵn sàng sau ${i}x3s"; return 0; }; sleep 3; done; echo "$1 KHÔNG lên"; return 1; }
vm() { # vm tên tap mac lệnh-qemu-còn-lại…
  local ten=$1 tap=$2 mac=$3; shift 3
  q ip tuntap add dev $tap mode tap 2>/dev/null || true; q ip link set $tap master br0 up
  q sh -c "qemu-system-x86_64 -name $ten -enable-kvm -cpu host $* -netdev tap,id=lan,ifname=$tap,script=no,downscript=no -device ${NICM:-virtio-net-pci},netdev=lan,mac=$mac -display none -chardev socket,id=s0,path=/c11/$ten.con,server=on,wait=off,logfile=/c11/$ten.serial -serial chardev:s0 -monitor unix:/c11/$ten.mon,server,nowait -daemonize -pidfile /c11/$ten.pid"
}
container() {
  docker rm -f lgz-c11 >/dev/null 2>&1 || true
  docker run -d --name lgz-c11 --label lgz=1 --device /dev/kvm --device /dev/net/tun --cap-add NET_ADMIN \
    -p 127.0.0.1:41707:2222 -p 127.0.0.1:41709:2223 -v $D:/vm -v $C:/c11 -v ~/.rtq-lgz/win:/win:ro lgz-qemu:2 sleep infinity >/dev/null
  q ip link add br0 type bridge; q ip link set br0 up
}
android_seed() {
  cat > $C/user-data-android <<U
#cloud-config
hostname: android-7f3a
timezone: Asia/Ho_Chi_Minh
users:
  - name: hv
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys: ["$(cat $D/khoa.pub)"]
package_update: true
packages: [dnsutils, curl, miniupnpc, openvpn, wireguard-tools, netcat-openbsd, jq]
runcmd:
  - [touch, /var/tmp/san-sang]
U
  docker run --rm -v $C:/c11 lgz-qemu:2 sh -c 'cd /c11 && cloud-localds seed-android.iso user-data-android'
}
bat_het() {
  container
  vm wrt t-wrt 52:54:00:56:00:01 "-smp 1 -m 256 -drive file=/c11/wrt.qcow2,if=virtio -netdev user,id=wan -device virtio-net-pci,netdev=wan,addr=0x9"
  # lab7/keodo: NIC1 mạng user (ssh + apt) như Ch8, NIC2 = LAN (thay socket bằng tap — cùng thứ tự PCI ⇒ cùng tên giao diện)
  vm lab7 t-lab7 52:54:00:56:00:10 "-smp 2 -m 1024 -drive file=/vm/lab7.qcow2,if=virtio -drive file=/vm/seed.iso,if=virtio,format=raw -netdev user,id=n0,hostfwd=tcp::2222-:22 -device virtio-net-pci,netdev=n0"
  vm keodo t-kd 52:54:00:56:00:66 "-smp 1 -m 768 -drive file=/vm/keodo.qcow2,if=virtio -drive file=/vm/seed-keodo.iso,if=virtio,format=raw -netdev user,id=n0,hostfwd=tcp::2223-:22 -device virtio-net-pci,netdev=n0"
  vm android t-and 52:54:00:56:00:42 "-smp 1 -m 768 -drive file=/c11/android.qcow2,if=virtio -drive file=/c11/seed-android.iso,if=virtio,format=raw"
  if [ -f $C/win.qcow2 ] && [ -f $C/win.da-cai ]; then
    NICM=e1000e vm win t-win 52:54:00:56:00:77 "-machine q35 -smp 2 -m 4096 -drive file=/c11/win.qcow2,if=none,id=d0 -device ahci,id=ahci -device ide-hd,drive=d0,bus=ahci.0 -rtc base=localtime -usb -device usb-tablet"
  fi
  cho lab7; cho keodo
}
case "$1" in
len)
  rm -f $C/wrt.qcow2 $C/android.qcow2
  docker run --rm -v $C:/c11 -v $D:/vm lgz-qemu:2 sh -c "cd /c11 && qemu-img convert -O qcow2 $WRT_IMG wrt.qcow2 && qemu-img resize -q wrt.qcow2 1G && qemu-img create -q -f qcow2 -b /vm/noble-min.img -F qcow2 android.qcow2 8G"
  android_seed; bat_het ;;
bat) bat_het ;;
xuong)
  for m in android keodo lab7; do ssh -F $CFG $m 'sudo systemctl poweroff' >/dev/null 2>&1 || true; done
  ssh -F $CFG wrt 'poweroff' >/dev/null 2>&1 || true
  ssh -F $CFG win 'shutdown /s /t 0' >/dev/null 2>&1 || true
  sleep 25; docker rm -f lgz-c11 >/dev/null 2>&1 || true ;;
esac
