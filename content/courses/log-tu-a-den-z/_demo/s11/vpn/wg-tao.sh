#!/bin/bash
# wg-tao.sh — chạy TRÊN lab7 (sudo): viết wg0.conf cho lab7 (máy chủ), android (đã khai báo), keodo (khoá KHÔNG có trong máy chủ); thêm explicit-exit-notify cho .ovpn
set -e; D=/root/vpn-lab; cd $D
printf '[Interface]\nAddress = 10.66.0.1/24\nListenPort = 51820\nPrivateKey = %s\n\n[Peer]\n# android-7f3a\nPublicKey = %s\nAllowedIPs = 10.66.0.2/32\n' "$(cat lab7.key)" "$(cat android.pub)" > /etc/wireguard/wg0.conf
for m in android keodo; do ip=10.66.0.2; [ $m = keodo ] && ip=10.66.0.9
  printf '[Interface]\nAddress = %s/24\nPrivateKey = %s\n\n[Peer]\nPublicKey = %s\nEndpoint = 192.168.56.10:51820\nAllowedIPs = 10.66.0.0/24\n' $ip "$(cat $m.key)" "$(cat lab7.pub)" > $m-wg0.conf
  grep -q explicit-exit-notify $m.ovpn || sed -i '1a explicit-exit-notify 1' $m.ovpn; done
chmod 600 /etc/wireguard/wg0.conf; echo "wg-tao xong"
