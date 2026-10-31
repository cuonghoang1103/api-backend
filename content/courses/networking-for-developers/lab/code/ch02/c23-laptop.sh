# Ch2 · 2.3 NAT — laptop ở nhà (địa chỉ riêng 192.168.50.10) gọi cổng LabFlow
ip -br -4 addr show eth0
curl -s http://203.0.113.10/
curl -s --local-port 41000 http://203.0.113.10/
