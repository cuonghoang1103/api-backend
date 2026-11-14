# 14.1 · bộ điều khiển (nft-gw): bốn gói DHCP vừa bắt trên card dk0, sổ "tài khoản ↔ MAC", luật tường lửa portal.py vừa thêm
tshark -r /tmp/dora.pcap -T fields -e eth.src -e ip.dst -e _ws.col.Info 2>/dev/null
cat /run/truong/dnsmasq.leases
cat /run/truong/dang-ky.tsv
iptables -S DADK; iptables -t nat -S DADK_NAT
