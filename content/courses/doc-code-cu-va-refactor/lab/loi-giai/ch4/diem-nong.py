#!/usr/bin/env python3
"""diem-nong.py — xếp tệp Java theo "điểm nóng" = số lần sửa (git) × độ phức tạp (PMD).  Lab 4.5.

Cách chạy (trong thư mục repo legacy-thu-vien):
    mvn -B -q pmd:pmd -Dpmd.boLuat=tools/do-phuc-tap.xml -Dformat=xml     # ghi target/pmd.xml
    python3 diem-nong.py [nhánh=master]
Ý tưởng: Adam Tornhill, "Your Code as a Crime Scene" (2015) — code phức tạp mà KHÔNG ai sửa thì ít rủi ro;
code phức tạp mà sửa liên tục mới là nơi bug sinh ra.
"""
import re, subprocess, sys, xml.etree.ElementTree as ET
from collections import Counter

nhanh = sys.argv[1] if len(sys.argv) > 1 else 'master'
log = subprocess.run(['git', 'log', nhanh, '--format=', '--name-only', '--', 'src/main/java'],
                     capture_output=True, text=True, check=True).stdout
churn = Counter(l for l in log.splitlines() if l.endswith('.java'))

ns = {'p': 'http://pmd.sourceforge.net/report/2.0.0'}
wmc, cog = {}, Counter()
for f in ET.parse('target/pmd.xml').getroot().findall('p:file', ns):
    ten = f.get('name').split('/src/main/java/')[-1]
    ten = 'src/main/java/' + ten
    for v in f.findall('p:violation', ns):
        msg = v.text.strip()
        m = re.search(r"total cyclomatic complexity of (\d+)", msg)
        if m: wmc[ten] = int(m.group(1))
        m = re.search(r"cognitive complexity of (\d+)", msg)
        if m: cog[ten] = max(cog[ten], int(m.group(1)))

hang = []
for ten in set(churn) | set(wmc):
    hang.append((churn[ten] * wmc.get(ten, 0), churn[ten], wmc.get(ten, 0), cog[ten], ten))
hang.sort(reverse=True)
print(f"{'điểm':>5} {'sửa':>4} {'WMC':>4} {'cogMax':>6}  tệp")
for d, c, w, g, ten in hang:
    print(f"{d:>5} {c:>4} {w:>4} {g:>6}  {ten.replace('src/main/java/com/thuvien/', '')}")
