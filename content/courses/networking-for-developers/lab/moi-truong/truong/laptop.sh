#!/bin/bash
# laptop.sh <MAC-phần-cứng> — một laptop của sinh viên: hai card ảo dk (SSID TRUONG-DANGKY) và sv (SSID TRUONG-SV), mỗi card một MAC
# RIÊNG như macOS "Cố định"/Windows "Random hardware addresses". Lúc đầu Wi-Fi TẮT: cả hai card down, không địa chỉ (bỏ IP tĩnh Docker gán),
# không tuyến mặc định. "Vào một SSID" = bật card đó rồi xin DHCP (vao-ssid.sh). MAC phần cứng ghi ở /run/mac-phan-cung.
echo "$1" > /run/mac-phan-cung
for c in dk sv; do ip addr flush dev $c; ip link set $c down; done
ip route del default 2>/dev/null
: > /etc/resolv.conf
# máy có card hs (laptop Windows phát Wi-Fi): NAT điện thoại ra card sv — đúng việc "Mobile Hotspot" làm
if ip link show hs >/dev/null 2>&1; then iptables -t nat -A POSTROUTING -s 192.168.137.0/24 -o sv -j MASQUERADE; fi
exec sleep infinity
