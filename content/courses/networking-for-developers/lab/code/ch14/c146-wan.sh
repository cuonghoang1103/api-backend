# 14.6 · router nhà (nft-rnha): địa chỉ WAN mà nhà mạng cấp — có thuộc dải CGNAT 100.64.0.0/10 không?
ip -4 -br addr show wan
python3 -c "import ipaddress as i; a='100.64.0.2'; print(a, 'thuoc 100.64.0.0/10 (CGNAT):', i.ip_address(a) in i.ip_network('100.64.0.0/10'))"
curl -s http://news.test/
