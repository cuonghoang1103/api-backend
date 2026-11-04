#!/usr/bin/env python3
# Ch9 lab — một yêu cầu STUN Binding tới một máy chủ STUN công cộng để lấy ÁNH XẠ NAT của bạn (IP:cổng công cộng mà
# thế giới bên ngoài thấy). Đây là bước đầu của WebRTC/ICE. IP công cộng ĐƯỢC CHE trong output (quyền riêng tư) —
# cái cần thấy là: STUN TRẢ VỀ một ánh xạ, và cổng công cộng khác cổng cục bộ (chính là NAT đang dịch).
import socket, struct, secrets, sys

HOST, PORT = (sys.argv[1] if len(sys.argv) > 1 else 'stun.l.google.com'), 19302
MAGIC = 0x2112A442
txid = secrets.token_bytes(12)
# Header STUN: type=0x0001 (Binding Request), length=0, magic cookie, transaction id
req = struct.pack('>HHI', 0x0001, 0, MAGIC) + txid

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.settimeout(5)
s.sendto(req, (HOST, PORT))
local_ip, local_port = s.getsockname()[0], s.getsockname()[1]
data, _ = s.recvfrom(1024)

mtype, mlen = struct.unpack('>HH', data[:4])
print(f'STUN server : {HOST}:{PORT}')
print(f'response    : type=0x{mtype:04x} (0x0101 = Binding Success), {mlen} bytes of attributes')

# Duyệt các thuộc tính, tìm XOR-MAPPED-ADDRESS (0x0020)
i = 20
while i < len(data):
    atype, alen = struct.unpack('>HH', data[i:i + 4])
    val = data[i + 4:i + 4 + alen]
    if atype == 0x0020:
        fam = val[1]
        xport = struct.unpack('>H', val[2:4])[0] ^ (MAGIC >> 16)
        raw = struct.unpack('>I', val[4:8])[0] ^ MAGIC
        ip = '.'.join(str((raw >> (24 - 8 * k)) & 0xff) for k in range(4))
        masked = '.'.join(['xxx', 'xxx', 'xxx', ip.split('.')[-1]])   # che 3 octet đầu
        print(f'XOR-MAPPED-ADDRESS (0x0020): family={"IPv4" if fam==1 else fam}  public mapping = {masked}:{xport}  (public IP redacted)')
    i += 4 + alen + ((4 - alen % 4) % 4)

print(f'local socket: {local_ip}:{local_port}  (public port differs from local port = the NAT mapping)')
