#!/bin/bash
# rnha.sh — router Wi-Fi ở nhà/ký túc xá (14.3/14.6): WAN 100.64.0.2 (nhà mạng cấp — CGNAT), LAN 192.168.1.1, NAT lần thứ nhất.
ip route replace default via 100.64.0.1
iptables -t nat -A POSTROUTING -o wan -j MASQUERADE
echo 'nameserver 198.18.0.53' > /etc/resolv.conf
# 14.6: DHCP + DNS cho LAN nhà (dnsmasq), trang quản trị (admin/admin — mặc định chưa đổi)
mkdir -p /run/nha
cat > /run/nha/dnsmasq.conf <<'CFG'
interface=lan
bind-interfaces
no-hosts
server=198.18.0.53
no-ping
dhcp-authoritative
dhcp-range=192.168.1.100,192.168.1.199,255.255.255.0,12h
dhcp-option=option:router,192.168.1.1
dhcp-option=option:dns-server,192.168.1.1
dhcp-leasefile=/run/nha/leases
conf-dir=/run/nha/d/,*.conf
CFG
mkdir -p /run/nha/d; dnsmasq -C /run/nha/dnsmasq.conf
python3 /lab/k/moi-truong/truong/rnha-admin.py > /dev/null 2>&1 &
exec sleep infinity
