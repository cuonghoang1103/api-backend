# wrt-dau.sh — cấu hình ban đầu router OpenWrt (chạy MỘT lần sau "may.bash len", từ container qua 192.168.1.1; xem may.bash).
# Như người dùng mới mua router: đặt mật khẩu quản trị, giờ Việt Nam, LAN 192.168.56.1, DHCP .100–.149 + hai địa chỉ giữ chỗ, cài gói.
set -e
echo "root:LabRouter-11" | chpasswd 2>/dev/null || (printf 'LabRouter-11\nLabRouter-11\n' | passwd root)
uci set system.@system[0].hostname='wrt-nha'
uci set system.@system[0].zonename='Asia/Ho Chi Minh'
uci set system.@system[0].timezone='<+07>-7'
uci set network.lan.ipaddr='192.168.56.1/24'   # 25.12: ipaddr dạng CIDR — thiếu /24 thành /32, LAN mất đường
uci set dhcp.lan.start='100'; uci set dhcp.lan.limit='50'
uci add dhcp host >/dev/null; uci set dhcp.@host[-1].mac='52:54:00:56:00:42'; uci set dhcp.@host[-1].ip='192.168.56.142'
uci add dhcp host >/dev/null; uci set dhcp.@host[-1].mac='52:54:00:56:00:77'; uci set dhcp.@host[-1].ip='192.168.56.177'
uci set dhcp.@dnsmasq[0].domain='lan'
uci commit
apk update >/dev/null && apk add kmod-mac80211-hwsim wpad-mbedtls iw tcpdump miniupnpd-nftables luci-app-upnp >/dev/null && echo "apk xong"
(sleep 2; /etc/init.d/system reload; /etc/init.d/network restart; /etc/init.d/dnsmasq restart) >/dev/null 2>&1 &
