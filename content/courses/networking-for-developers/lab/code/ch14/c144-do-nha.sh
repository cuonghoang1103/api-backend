# 14.4 · đo ở nhà (router nhà giả lập đường mạng thật bằng tc netem) — đi thẳng, WireGuard (UDP), OpenVPN (TCP), mỗi kiểu 8 giây
wg-quick down wg0 2>/dev/null
ping -c 10 -q 198.18.0.30 | tail -1
iperf3 -c 198.18.0.30 -t 8 | grep receiver
wg-quick up wg0 2>/dev/null
ping -c 10 -q 10.66.0.1 | tail -1
iperf3 -c 10.66.0.1 -t 8 | grep receiver
wg-quick down wg0 2>/dev/null
cd /etc/openvpn/lab; openvpn --config client.conf --daemon --log /tmp/ovpn.log
@ for i in $(seq 1 40); do grep -q "Initialization Sequence Completed" /tmp/ovpn.log && break; sleep 0.5; done
ping -c 10 -q 10.67.0.1 | tail -1
iperf3 -c 10.67.0.1 -t 8 | grep receiver
pkill openvpn
