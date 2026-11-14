# 14.4 · laptop ở nhà (nft-lap): cặp khoá WireGuard — khoá riêng ở lại máy, khoá công khai đưa cho máy chủ (như SSH ở 14.3)
umask 077; mkdir -p /etc/wireguard; cd /etc/wireguard
wg genkey > laptop.key; wg pubkey < laptop.key > laptop.pub
ls -l /etc/wireguard
cat laptop.pub
