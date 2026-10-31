# Ch2 · 2.4 IPv6 — laptop: hai địa chỉ v6 trên một card, tuyến v6, và máy chủ thấy gì (KHÔNG có NAT)
ip -br -6 addr show eth0
ip -6 route
python3 -c "import ipaddress as i; a = i.ip_address('2001:db8:a:50::10'); print(a.exploded, '->', a.compressed)"
python3 -c "import ipaddress as i; print(i.ip_address('2001:0db8:0000:0000:0001:0000:0000:0001').compressed)"
python3 -c "import ipaddress as i; n = i.ip_network('2001:db8:a:50::/64'); print(n, 'holds', n.num_addresses, 'addresses')"
ping -6 -c 1 2001:db8:d::10
curl -s "http://[2001:db8:d::10]/"
curl -s http://203.0.113.10/
