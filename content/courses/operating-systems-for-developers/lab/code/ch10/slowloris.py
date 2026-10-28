# slowloris.py PORT N SECONDS — mở N kết nối, gửi header HTTP CHẬM: một dòng "X-a: b" mỗi giây, không bao giờ kết thúc.
# (Chỉ chạy vào máy chủ của CHÍNH BẠN trong phòng lab — đây là cách kiểm tra hạn chờ, không phải công cụ tấn công.)
import socket, sys, time
port, n, secs = int(sys.argv[1]), int(sys.argv[2]), float(sys.argv[3])
socks = []
for _ in range(n):
    s = socket.create_connection(("127.0.0.1", port))
    s.send(b"GET / HTTP/1.1\r\nHost: lab\r\n")
    socks.append(s)
t0 = time.time()
end, alive, first_cut = t0 + secs, n, None
while time.time() < end:
    time.sleep(1)
    alive = 0
    for s in socks:
        try:
            s.send(b"X-a: b\r\n"); alive += 1
        except OSError:                               # máy chủ đã đóng kết nối này
            first_cut = first_cut or time.time() - t0
cut = f", server closed the first one after ~{first_cut:.0f} s" if first_cut else ""
print(f"slowloris: {alive}/{n} slow connections still open after {secs:.0f} s{cut}", flush=True)
