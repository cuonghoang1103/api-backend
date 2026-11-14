# 14.4 · nft-vps: máy chủ WireGuard — giao diện wg0, nghe UDP 51820, NAT cho khách đi ra Internet bằng IP của VPS
umask 077; cd /etc/wireguard
wg genkey > server.key; wg pubkey < server.key > server.pub
cat > wg0.conf <<CFG
[Interface]
Address = 10.66.0.1/24
ListenPort = 51820
PrivateKey = $(cat server.key)
PostUp = iptables -t nat -A POSTROUTING -s 10.66.0.0/24 -o net0 -j MASQUERADE
PostDown = iptables -t nat -D POSTROUTING -s 10.66.0.0/24 -o net0 -j MASQUERADE

[Peer]
# laptop
PublicKey = $(cat laptop.pub)
AllowedIPs = 10.66.0.2/32
CFG
wg-quick up wg0
ss -4ulnp | grep 51820
