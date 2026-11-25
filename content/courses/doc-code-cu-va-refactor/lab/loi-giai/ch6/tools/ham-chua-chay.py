#!/usr/bin/env python3
"""ham-chua-chay.py <jacoco.xml> — bài 6.1: mỗi lớp in "hàm đã chạy/tổng" và tên các hàm CHƯA chạy lần nào (đọc báo cáo XML của JaCoCo)."""
import sys
import xml.etree.ElementTree as ET

r = ET.parse(sys.argv[1] if len(sys.argv) > 1 else 'target/site/jacoco/jacoco.xml').getroot()
print("# JaCoCo sau mot-ngay.sh (12 request) — lớp: hàm đã chạy/tổng · hàm CHƯA chạy lần nào")
for p in r.iter('package'):
    for c in p.iter('class'):
        ms = [(m.get('name'), {x.get('type'): int(x.get('covered')) for x in m.findall('counter')}.get('METHOD', 0)) for m in c.findall('method')]
        chua = [n for n, cv in ms if cv == 0 and n != '<clinit>']
        ten = c.get('name').replace('com/thuvien/', '').replace('/', '.')
        print(f"{ten:30} {sum(1 for _, cv in ms if cv)}/{len(ms)}  {', '.join(chua)}")
