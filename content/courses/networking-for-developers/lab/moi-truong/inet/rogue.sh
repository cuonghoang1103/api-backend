#!/bin/bash
# rogue — một mạng khác AS64511 cùng cắm ở IX. Bình thường chỉ quảng bá dải của chính nó (198.18.0.0/24); bài 2.5 cho nó "cướp tuyến".
ip addr add 198.18.0.1/24 dev lo
ip route del default 2>/dev/null; ip -6 route del default 2>/dev/null
bash /lab/k/moi-truong/inet/frr.sh rogue
exec sleep infinity
