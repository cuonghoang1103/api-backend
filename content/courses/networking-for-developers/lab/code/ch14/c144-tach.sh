# 14.4 · laptop ở nhà: split tunnel — gói tới đâu đi đường nào, và trang web thấy ai
ip route get 10.66.0.1 | head -1
ip route get 198.18.0.10 | head -1
curl -s http://news.test/
traceroute -n -q 1 -w 1 198.18.0.10
# đổi sang FULL tunnel: AllowedIPs = 0.0.0.0/0 — MỌI gói vào hầm
wg-quick down wg0 2>/dev/null; sed -i 's|^AllowedIPs = 10.66.0.0/24|AllowedIPs = 0.0.0.0/0|' /etc/wireguard/wg0.conf
wg-quick up wg0
ip route get 198.18.0.10 | head -1
curl -s http://news.test/
traceroute -n -q 1 -w 1 198.18.0.10
