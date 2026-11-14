# 14.4 · nft-win: OpenVPN chết giữa chừng (không có kill switch) — các tuyến của nó bị gỡ, gói đi thẳng ra mạng trường
pkill openvpn; sleep 1
ip route | head -2
curl -sS -m 5 http://198.18.0.10/
