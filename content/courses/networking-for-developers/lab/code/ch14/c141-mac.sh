# macOS 27.2, MacBook trên Wi-Fi nhà (không có trang đăng nhập) — 14/11/2026. Chạy bằng chay-mac.sh; MAC thật bị che 3 byte cuối (che-mac.py).
ifconfig en0 | grep -E "ether|inet "
networksetup -getmacaddress Wi-Fi
ipconfig getifaddr en0
ipconfig getpacket en0 | grep -E "yiaddr|chaddr|dhcp_message_type|server_identifier|lease_time|router|domain_name_server"
arp -a -i en0 | head -4
curl -sI http://captive.apple.com | head -3
curl -s http://captive.apple.com
curl -s http://www.msftconnecttest.com/connecttest.txt; echo
curl -s -o /dev/null -w "%{http_code}\n" https://captive.apple.com
