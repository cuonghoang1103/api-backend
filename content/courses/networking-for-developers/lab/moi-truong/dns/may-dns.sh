#!/bin/bash
# may-dns.sh <vai> — khởi động một máy DNS của lab Chương 3 (dns.yml): đặt tuyến rồi chạy named / unbound / FRR.
M=/lab/k/moi-truong/dns
o_ix() { ip route replace default via 192.0.2.1; ip route replace 203.0.113.0/24 via 192.0.2.3; ip route replace 198.19.255.0/24 via 192.0.2.3; }
case $1 in
  root) o_ix; exec named -g -c $M/named-root.conf ;;
  tld)  o_ix; rndc-confgen -a 2>/dev/null; chown root:root /etc/bind/rndc.key; exec named -g -c $M/named-tld.conf ;;
  cdn)  o_ix; exec named -g -c $M/named-cdn.conf ;;
  ns1)  ip route replace default via 203.0.113.1; rndc-confgen -a 2>/dev/null; chown root:root /etc/bind/rndc.key; exec named -g -c $M/named-ns1.conf ;;
  ns2)  ip route replace default via 203.0.113.1; rndc-confgen -a 2>/dev/null; chown root:root /etc/bind/rndc.key; exec named -g -c $M/named-ns2.conf ;;
  pop1) ip addr add 198.19.1.1/32 dev lo; bash /lab/k/moi-truong/inet/frr.sh pop1; bash $M/unbound.sh pop1; exec sleep infinity ;;
  pop2) ip addr add 198.19.1.1/32 dev lo; ip route replace default via 198.19.255.1
        bash /lab/k/moi-truong/inet/frr.sh pop2; bash $M/unbound.sh pop2; exec sleep infinity ;;
  dc)   iptables -I FORWARD -d 203.0.113.99 -j DROP   # "máy chủ tên chết" của dead.test: gói tới nó bị bỏ lặng lẽ (không ICMP)
        exec bash /lab/k/moi-truong/inet/dc.sh ;;
  server) ip route replace default via 203.0.113.1; ip -6 route replace default via 2001:db8:d::1
        ip addr add 203.0.113.11/24 dev eth0; cp $M/nginx-edge-dns.conf /etc/nginx/nginx.conf; exec nginx -g 'daemon off;' ;;
esac
