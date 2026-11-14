# 14.4 · nft-gw: luật "bỏ mọi UDP" của trường (bài 14.2) — bộ đếm (cột 1 = số gói)
iptables -L CHAN -v -n | awk '$4 == "udp" && $3 == "DROP" && NF == 9 {print $1, $3, $4}'
