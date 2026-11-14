# 14.6 · laptop: xin lại địa chỉ
ip addr flush dev eth0
busybox udhcpc -i eth0 -n -q -t 4 -T 1 -s /lab/k/moi-truong/truong/dhcp.sh 2>&1 | grep -E "lease|select"
