# 14.5 · nft-win: trả lại dòng NAT (MASQUERADE = "đổi địa chỉ nguồn thành địa chỉ của card đi ra")
iptables -t nat -A POSTROUTING -s 192.168.137.0/24 -o sv -j MASQUERADE
