# slow.py PORT — khách đọc CHẬM: 64 KiB mỗi 1/16 giây (~1 MiB/s), như điện thoại 3G hay một bên nhận bị nghẽn.
import socket, sys, time
s = socket.create_connection(("127.0.0.1", int(sys.argv[1])))
s.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65536)
end = time.time() + 3.5
while time.time() < end:
    if not s.recv(65536):
        break
    time.sleep(1 / 16)
