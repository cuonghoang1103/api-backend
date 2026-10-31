# Mục 0 · container net-lab rời, ra Internet thật qua NAT của Docker (hostname netlab)
dig +short cuongthai.com
curl -sv -o /dev/null https://cuongthai.com/ 2>&1 | grep -E '^\* (Host|IPv4|  Trying|Connected to|SSL connection|ALPN: server)|TLS handshake, (Client|Server) hello|^> (GET|Host)|^< (HTTP|server|content-type)'
for i in 1 2 3; do curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' https://cuongthai.com/; done
curl -s -o /dev/null -o /dev/null -w 'url=%{url} dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' https://cuongthai.com/ https://cuongthai.com/about
curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total} ip=%{remote_ip}\n' https://example.com/
ping -c 3 cuongthai.com
