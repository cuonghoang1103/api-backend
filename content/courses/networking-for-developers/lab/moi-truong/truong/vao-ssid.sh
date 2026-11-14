#!/bin/bash
# vao-ssid.sh <dk|sv> — "kết nối SSID": tắt card kia, bật card này, xin DHCP (DORA) bằng udhcpc. In MAC đang dùng + địa chỉ nhận được.
khac=dk; [ "$1" = dk ] && khac=sv
ip addr flush dev $khac 2>/dev/null; ip link set $khac down 2>/dev/null
ip link set "$1" up
busybox udhcpc -i "$1" -s /lab/k/moi-truong/truong/dhcp.sh -n -q -t 4 -T 1 2>&1 | grep -vE "^udhcpc: (started|no lease)"
