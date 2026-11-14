# 14.4 · router nhà: cùng đường đó nhưng Wi-Fi/4G chập chờn — mất 2% gói
tc qdisc change dev wan root netem delay 20ms rate 50mbit loss 2%
tc qdisc show dev wan
