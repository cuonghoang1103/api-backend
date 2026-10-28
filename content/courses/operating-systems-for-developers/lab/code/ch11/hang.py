# hang.py — "ứng dụng" kết nối CSDL lúc khởi động; địa chỉ CSDL sai (10.255.255.1 không ai trả lời) ⇒ treo im lặng.
import socket

print("connecting to the database...", flush=True)
s = socket.create_connection(("10.255.255.1", 5432))   # no timeout: the default
print("connected")
