# Ch11 · 11.3 — đo đường đi: curl -w (DNS/connect/TTFB/total), ping (RTT), mtr (mỗi hop + mất gói), iperf3 (băng thông).
echo "== curl -w: per-stage timing to web =="
curl -s -o /dev/null -w "dns=%{time_namelookup}  connect=%{time_connect}  ttfb=%{time_starttransfer}  total=%{time_total}\n" http://10.10.2.10/
echo "== ping: round-trip time to api (via router) =="
ping -c 3 10.10.2.20 | tail -2
echo "== mtr: per-hop latency and loss =="
mtr --report --report-cycles 3 --no-dns 10.10.2.20 2>/dev/null
echo "== iperf3: throughput client -> api =="
iperf3 -c 10.10.2.20 -t 2 2>/dev/null | grep -E "sender|receiver"
