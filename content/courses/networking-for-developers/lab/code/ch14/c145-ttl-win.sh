# 14.5 · nft-win: chuẩn hoá TTL — đặt lại TTL = 64 cho mọi gói đi ra card trường (bộ đếm luật TTL 63 của trường ở 14.2 sẽ không tăng)
iptables -t mangle -A POSTROUTING -o sv -j TTL --ttl-set 64
iptables -t mangle -S POSTROUTING
curl -s http://198.18.0.10/
