# 14.5 · nft-win (laptop Windows bật Mobile Hotspot): laptop = một router tí hon — card phát hs, chuyển tiếp gói, NAT ra card Wi-Fi trường
ip -br addr show hs; ip -br addr show sv
sysctl net.ipv4.ip_forward
iptables -t nat -S POSTROUTING | grep 192.168.137
