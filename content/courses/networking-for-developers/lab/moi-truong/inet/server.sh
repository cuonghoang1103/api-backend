#!/bin/bash
# server — cổng vào của LabFlow trong DC (nginx :80, cả IPv4 lẫn IPv6): trả lời "bạn đến từ IP:cổng nào" — máy chủ thấy gì sau NAT.
ip route replace default via 203.0.113.1
ip -6 route replace default via 2001:db8:d::1
cp /lab/k/moi-truong/inet/nginx-edge.conf /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'
