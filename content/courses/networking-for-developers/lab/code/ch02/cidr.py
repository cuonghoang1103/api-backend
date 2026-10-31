#!/usr/bin/env python3
"""cidr.py ĐỊA_CHỈ/PREFIX — tính một mạng IPv4 đúng như cách làm BẰNG TAY của bài 2.1: viết ra nhị phân, AND với mặt nạ,
bật hết bit phần host để có broadcast — rồi đối chiếu với thư viện chuẩn ipaddress của Python.
   python3 cidr.py 10.10.1.10/24"""
import sys, ipaddress

def bits(n):                      # 32 bit, chấm sau mỗi 8 bit (mỗi octet)
    s = format(n, '032b')
    return '.'.join(s[i:i + 8] for i in range(0, 32, 8))

def dotted(n):                    # số 32 bit -> a.b.c.d
    return '.'.join(str((n >> s) & 255) for s in (24, 16, 8, 0))

addr, p = sys.argv[1].split('/')
p = int(p)
ip = sum(int(o) << s for o, s in zip(addr.split('.'), (24, 16, 8, 0)))
mask = (0xFFFFFFFF << (32 - p)) & 0xFFFFFFFF      # p bit 1 rồi (32 - p) bit 0
net = ip & mask                                   # giữ phần mạng, xoá phần host
bcast = net | (~mask & 0xFFFFFFFF)                # phần host toàn bit 1
size = 2 ** (32 - p)
if p <= 30:
    first, last, usable = net + 1, bcast - 1, size - 2
else:                                             # /31: 2 địa chỉ cho đường điểm-điểm (RFC 3021) · /32: đúng một máy
    first, last, usable = net, bcast, size

print(f'address    {addr:<15}  {bits(ip)}')
print(f'mask /{p:<2}   {dotted(mask):<15}  {bits(mask)}')
print(f'network    {dotted(net):<15}  {bits(net)}   (address AND mask)')
if p <= 30:
    print(f'broadcast  {dotted(bcast):<15}  {bits(bcast)}   (host bits all 1)')
else:
    print(f'broadcast  none             (/{p}: too few host bits to spare one for broadcast)')
print(f'hosts      {dotted(first)} - {dotted(last)}   usable {usable} of {size} addresses')
n = ipaddress.ip_interface(sys.argv[1]).network
hs = list(n.hosts())
same = str(n.network_address) == dotted(net) and len(hs) == usable and str(hs[0]) == dotted(first) and str(hs[-1]) == dotted(last)
print(f'check      ipaddress: {n}, {len(hs)} usable, {hs[0]} - {hs[-1]}  -> {"same" if same else "DIFFERENT"}')
