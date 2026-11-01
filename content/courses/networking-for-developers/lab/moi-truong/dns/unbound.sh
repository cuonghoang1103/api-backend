#!/bin/bash
# unbound.sh <isp|pop1|pop2> — dựng cấu hình Unbound cho vai này rồi chạy (nền).
#   isp  : resolver của nhà mạng 198.51.100.1 (+100.64.0.1 cho 4G), có DoT :853 và DoH :443 (/dns-query) — chỉ khách của nhà mạng dùng.
#   pop1 : DNS công cộng 198.19.1.1 (anycast) — điểm Hà Nội ở IX.   pop2 : cùng 198.19.1.1 — điểm Singapore sau router DC.
vai=$1; M=/lab/k/moi-truong/dns
case $vai in
  isp)  id="resolver.isp (AS64500)"
        nghe=$'interface: 198.51.100.1\n  interface: 100.64.0.1\n  interface: 198.51.100.1@853\n  interface: 198.51.100.1@443\n  tls-port: 853\n  https-port: 443\n  http-endpoint: "/dns-query"\n  http-notls-downstream: no\n  tls-service-key: "/dnsz/tls/isp.key"\n  tls-service-pem: "/dnsz/tls/isp.pem"'
        cho=$'access-control: 0.0.0.0/0 refuse\n  access-control: 198.51.100.0/24 allow\n  access-control: 100.64.0.0/24 allow' ;;
  pop1) id="pop1.hn (public DNS 198.19.1.1, Hanoi)"; nghe='interface: 198.19.1.1'; cho='access-control: 0.0.0.0/0 allow' ;;
  pop2) id="pop2.sg (public DNS 198.19.1.1, Singapore)"; nghe='interface: 198.19.1.1'; cho='access-control: 0.0.0.0/0 allow' ;;
esac
awk -v id="$id" -v nghe="$nghe" -v cho="$cho" '{ gsub(/@ID@/, id); gsub(/@NGHE@/, nghe); gsub(/@CHO@/, cho); print }' $M/unbound.conf.mau > /etc/unbound/unbound.conf   # đường mặc định ⇒ unbound-control dùng luôn, không cần -c
unbound
