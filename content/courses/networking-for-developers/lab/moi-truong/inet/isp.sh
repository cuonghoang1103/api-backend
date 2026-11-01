#!/bin/bash
# isp — nhà mạng AS64500: cust0 (khách hàng gia đình 198.51.100.0/24), mob0 (khách 4G sau CGNAT 100.64.0.0/24), ix0 (điểm trao đổi).
# Tuyến ra Internet học bằng BGP (FRR). CGNAT: 100.64.0.0/24 ⇒ 198.51.100.200. Resolver DNS cho khách (dnsmasq).
ip addr add 198.51.100.200/32 dev lo
ip -6 route add 2001:db8:a:50::/64 via 2001:db8:a:1::2
ip -6 route add blackhole 2001:db8:a::/48
ip route del default 2>/dev/null; ip -6 route del default 2>/dev/null
iptables -t nat -A POSTROUTING -s 100.64.0.0/24 -o ix0 -j SNAT --to-source 198.51.100.200
# Chương 3 (dns.yml đặt DNS_LAB=1): resolver đệ quy Unbound hỏi từ máy chủ gốc của lab; Chương 2: dnsmasq chuyển tiếp labflow.test.
if [ "${DNS_LAB:-0}" = 1 ]; then bash /lab/k/moi-truong/dns/unbound.sh isp
else dnsmasq --no-resolv --no-hosts --listen-address=198.51.100.1,100.64.0.1 --bind-interfaces --server=/labflow.test/203.0.113.53 --log-queries=extra --log-facility=/tmp/dnsmasq.log; fi
bash /lab/k/moi-truong/inet/frr.sh "${FRR_VAI:-isp}"
exec sleep infinity
