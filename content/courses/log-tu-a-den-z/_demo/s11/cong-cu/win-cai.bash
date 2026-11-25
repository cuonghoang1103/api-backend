#!/bin/bash
# win-cai.bash — cài Windows Server 2025 bản đánh giá (ISO chính thức của Microsoft, 180 ngày) KHÔNG người ngồi lên LAN Chương 11.
# Cần: may.bash bat (container lgz-c11 + router đang chạy), ISO ở ~/.rtq-lgz/win/ws2025-eval.iso. ~20–30 phút. Xong ⇒ tạo $C/win.da-cai.
set -e; C=~/.rtq-lgz/c11; S=$(cd "$(dirname "$0")" && pwd)
cp $S/win/autounattend.xml $C/autounattend.xml
docker exec lgz-c11 sh -c 'cd /c11 && rm -f win.qcow2 && qemu-img create -q -f qcow2 win.qcow2 40G && mkdir -p ua && cp autounattend.xml ua/ && genisoimage -quiet -J -r -V UNATTEND -o unattend.iso ua'
docker exec lgz-c11 sh -c 'ip tuntap add dev t-win mode tap 2>/dev/null; ip link set t-win master br0 up; qemu-system-x86_64 -name win -enable-kvm -cpu host -machine q35 -smp 2 -m 4096 \
  -drive file=/c11/win.qcow2,if=none,id=d0 -device ahci,id=ahci -device ide-hd,drive=d0,bus=ahci.0 \
  -drive file=/win/ws2025-eval.iso,media=cdrom,if=none,id=cd0,readonly=on -device ide-cd,drive=cd0,bus=ahci.1 \
  -drive file=/c11/unattend.iso,media=cdrom,if=none,id=cd1,readonly=on -device ide-cd,drive=cd1,bus=ahci.2 \
  -netdev tap,id=lan,ifname=t-win,script=no,downscript=no -device e1000e,netdev=lan,mac=52:54:00:56:00:77 -rtc base=localtime -usb -device usb-tablet \
  -display vnc=127.0.0.1:7 -monitor unix:/c11/win.mon,server,nowait -daemonize -pidfile /c11/win.pid' 
echo "đang cài — theo dõi: ssh -F $S/ssh.cfg win hostname (khi trả LAPTOP-AN là xong)"
