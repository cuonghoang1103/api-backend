# Lab 1 · R1 — bản đồ phòng lab: chạy trên TỪNG máy (ở đây: router)
hostname
ip -br addr | grep -E '^eth'
ip -br link | grep -E '^eth'
sysctl net.ipv4.ip_forward
ss -tlnp
