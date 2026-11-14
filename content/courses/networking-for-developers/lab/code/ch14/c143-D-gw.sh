# 14.3 · nft-gw (tường lửa trường): laptop vừa vào social.test và phim.test — trường thấy gì? (cột 1 của iptables -L -v = số gói luật đã bắt)
iptables -L CHAN -v -n | awk '/social/ {print $1, $3, $11, $14}'
conntrack -L -s 10.20.2.159 -p tcp 2>/dev/null | awk '{print $6, $8}' | sort | uniq -c
