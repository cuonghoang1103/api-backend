#!/usr/bin/env python3
"""che-mac.py <out.txt> — che 3 byte cuối của mọi địa chỉ MAC THẬT trong output chạy trên máy soạn (giữ 3 byte đầu = OUI/
byte có bit tự quản, đủ để bài giảng về bit đó). Bỏ qua broadcast ff:…, multicast 01:00:5e/1:0:5e/33:33 và MAC lab 02:00:0a:…"""
import re, sys, pathlib
p = pathlib.Path(sys.argv[1]); s = p.read_text()
def che(m):
    mac = m.group(0); b = mac.split(':')
    if mac.lower().startswith(('ff:ff', '01:00:5e', '1:0:5e', '33:33', '02:00:0a')) or 'xx' in mac: return mac
    return ':'.join(b[:3] + ['xx', 'xx', 'xx'])
p.write_text(re.sub(r'\b[0-9a-fA-F]{1,2}(?::[0-9a-fA-F]{1,2}){5}\b', che, s)); print('đã che', p)
