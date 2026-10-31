# Ch2 · 2.2 — gỡ tuyến sai trên dc; tuyến nối trực tiếp /24 lại được dùng
ip route del 203.0.113.10/32 via 192.0.2.1
ip route get 203.0.113.10
