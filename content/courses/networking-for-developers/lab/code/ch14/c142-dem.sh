# 14.2 · nft-gw: toàn bộ luật chặn của "trường" và số gói mỗi luật đã chặn
iptables -L CHAN -v -n --line-numbers
iptables -t mangle -L PREROUTING -v -n | grep -E "pkts|TTL"
