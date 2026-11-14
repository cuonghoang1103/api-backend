# 14.6 · router nhà: GIỮ CHỖ DHCP — MAC này luôn nhận 192.168.1.50 (để mở cổng / máy in / NAS không đổi địa chỉ)
echo "dhcp-host=3c:7c:3f:1a:2b:20,192.168.1.50,laptop-nha" > /run/nha/d/giucho.conf
pkill dnsmasq; sleep 0.5; dnsmasq -C /run/nha/dnsmasq.conf
cat /run/nha/leases
