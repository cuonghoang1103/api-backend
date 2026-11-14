# 14.4 · cùng laptop mang tới trường (nft-win; trường bỏ MỌI gói UDP) — WireGuard chạy trên UDP
wg-quick up wg0 2>&1 | tail -1
ping -c 3 -W 1 10.66.0.1 | tail -2
wg show wg0 | grep -E "endpoint|handshake|transfer"
curl -sS -m 5 http://news.test/
wg-quick down wg0 2>&1 | tail -1
