# 14.4 · laptop ở nhà: cấu hình khách SPLIT tunnel — chỉ mạng 10.66.0.0/24 đi vào hầm, còn lại đi đường thường
cd /etc/wireguard
cat > wg0.conf <<CFG
[Interface]
Address = 10.66.0.2/24
PrivateKey = $(cat laptop.key)

[Peer]
PublicKey = $(cat server.pub)
Endpoint = vps.example:51820
AllowedIPs = 10.66.0.0/24
PersistentKeepalive = 25
CFG
wg-quick up wg0
ping -c 3 -W 1 10.66.0.1 | tail -2
wg show wg0 | grep -E "endpoint|allowed|handshake|transfer"
