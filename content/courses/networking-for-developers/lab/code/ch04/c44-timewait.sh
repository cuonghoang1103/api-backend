# Ch4 · 4.4 — ai ĐÓNG TRƯỚC thì ôm TIME-WAIT; client đóng trước nên TIME-WAIT dồn ở client
for i in $(seq 1 20); do curl -so /dev/null http://10.10.2.10/; done
ss -tan '( dport = :80 )' | awk 'NR==1 || /TIME-WAIT/' | head -6
echo "TIME-WAIT đang có: $(ss -tan '( dport = :80 )' | grep -c TIME-WAIT)"
sysctl net.ipv4.tcp_fin_timeout
cat /proc/sys/net/ipv4/tcp_max_tw_buckets
