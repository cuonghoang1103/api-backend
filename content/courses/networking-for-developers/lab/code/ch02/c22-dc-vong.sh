# Ch2 · 2.2 — lúc bảo trì, ai đó thêm tay một tuyến thử trên router dc rồi quên gỡ: 203.0.113.10/32 "qua" isp
ip route add 203.0.113.10/32 via 192.0.2.1
ip route | grep 203.0.113
ip route get 203.0.113.10
