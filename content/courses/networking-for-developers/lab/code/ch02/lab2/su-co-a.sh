#!/bin/bash
# Lab 2 · Sự cố A (chạy trên nfi-dc) — ĐỪNG ĐỌC trước khi chẩn đoán xong. Gây lỗi: một tuyến tĩnh "thử" bị quên trên router dc.
ip route add 203.0.113.0/26 via 192.0.2.1 2>/dev/null
echo "incident A injected"
