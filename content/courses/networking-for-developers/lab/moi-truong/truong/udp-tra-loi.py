#!/usr/bin/env python3
"""udp-tra-loi.py <ip> <cổng> <câu trả lời> — máy chủ UDP tí hon: nhận gói nào thì trả lại một dòng (máy chủ game / VPN giả của lab)."""
import socket, sys
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.bind((sys.argv[1], int(sys.argv[2])))
while True:
    d, peer = s.recvfrom(2048); s.sendto((sys.argv[3] + '\n').encode(), peer)
