#!/bin/sh
# dhcp.sh — kịch bản cho busybox udhcpc: nhận lease (bound/renew) thì ghi địa chỉ, tuyến mặc định, DNS vào máy.
case "$1" in
  deconfig) ip addr flush dev "$interface" ;;
  bound|renew)
    ip addr flush dev "$interface"
    ip addr add "$ip/$mask" dev "$interface"
    ip route replace default via "$router" dev "$interface"
    echo "nameserver $dns" > /etc/resolv.conf ;;
esac
