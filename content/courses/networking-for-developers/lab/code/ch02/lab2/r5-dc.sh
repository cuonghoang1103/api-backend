# Lab 2 · R5 — chẩn đoán và sửa trên router dc
ip route get 203.0.113.10
ip route get 203.0.113.100
ip route | grep 203.0.113
ip route del 203.0.113.0/26 via 192.0.2.1
ip route get 203.0.113.10
