# Ch2 · 2.1 IPv4 & CIDR — máy client của lab Ch1 (10.10.1.10/24)
ip -br -4 addr show eth0
ip route
python3 cidr.py 10.10.1.10/24
python3 cidr.py 10.10.1.10/16
python3 cidr.py 192.168.50.77/26
python3 cidr.py 203.0.113.10/32
python3 cidr.py 192.0.2.0/31
ip route get 10.10.1.11
ip route get 10.10.1.200
ip route get 10.10.2.10
