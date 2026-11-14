# 14.4 · router nhà (nft-rnha): giả lập một đường mạng thật để đo — trễ 20 ms, 50 Mbit/s (chiều đi ra)
tc qdisc add dev wan root netem delay 20ms rate 50mbit
tc qdisc show dev wan
