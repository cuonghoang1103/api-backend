# 14.5 · nft-win: thử gỡ dòng NAT — chuyển tiếp vẫn bật, nhưng gói của điện thoại đi ra với địa chỉ 192.168.137.50
iptables -t nat -D POSTROUTING -s 192.168.137.0/24 -o sv -j MASQUERADE
