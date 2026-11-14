# 14.6 · laptop ở ký túc xá (nft-lap): xin địa chỉ từ router nhà bằng DHCP (bỏ IP tĩnh Docker gán)
ip addr flush dev eth0
busybox udhcpc -i eth0 -n -q -t 4 -T 1 -s /lab/k/moi-truong/truong/dhcp.sh 2>&1 | grep -E "lease|select"
ip -4 -br addr show eth0
