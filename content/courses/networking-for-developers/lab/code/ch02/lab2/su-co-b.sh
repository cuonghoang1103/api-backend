#!/bin/bash
# Lab 2 · Sự cố B (chạy trên nfi-rogue) — ĐỪNG ĐỌC trước khi chẩn đoán xong. Gây lỗi: AS64511 quảng bá một dải cụ thể hơn của LabFlow.
ip route add blackhole 203.0.113.0/25 2>/dev/null
vtysh -c 'configure terminal' -c 'router bgp 64511' -c 'address-family ipv4 unicast' -c 'network 203.0.113.0/25' -c 'end'
echo "incident B injected"
