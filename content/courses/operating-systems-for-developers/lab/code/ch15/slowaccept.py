#!/usr/bin/env python3
"""slowaccept.py — máy chủ TCP nghe với backlog lớn nhưng 3 GIÂY ĐẦU không accept() (giả một lần khởi động chậm / một lần
dọn rác dài), rồi accept rất nhanh. Kết nối đến dồn vào hàng đợi accept — hàng đợi dài bao nhiêu do min(backlog, somaxconn)
quyết định (bài 15.7).   python3 slowaccept.py CỔNG BACKLOG"""
import socket, sys, time
port, backlog = int(sys.argv[1]), int(sys.argv[2])
s = socket.socket(); s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('127.0.0.1', port)); s.listen(backlog)
print(f'listening on :{port}, listen(backlog={backlog}); not accepting for 3 s', flush=True)
time.sleep(3)
s.settimeout(6)
try:
    while True:
        c, _ = s.accept(); c.close()
except socket.timeout:
    pass
