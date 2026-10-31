# Ch2 · 2.3 — điện thoại cùng nhà, cố ý dùng ĐÚNG cổng nguồn 41000 như laptop vừa dùng
ip -br -4 addr show eth0
curl -s --local-port 41000 http://203.0.113.10/
