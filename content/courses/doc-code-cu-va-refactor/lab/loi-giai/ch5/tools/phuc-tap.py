#!/usr/bin/env python3
"""phuc-tap.py <target/pmd.xml> [lọc] — bảng cyclomatic / cognitive từng hàm từ báo cáo PMD (bộ luật tools/do-phuc-tap.xml)."""
import re, sys, xml.etree.ElementTree as ET
ns = {'p': 'http://pmd.sourceforge.net/report/2.0.0'}
bang = {}
for f in ET.parse(sys.argv[1]).getroot().findall('p:file', ns):
    lop = f.get('name').rsplit('/', 1)[-1].replace('.java', '')
    for v in f.findall('p:violation', ns):
        m = re.search(r"The (?:method|constructor) '([^']+)' has a (cyclomatic|cognitive) complexity of (\d+)", v.text)
        if m: bang.setdefault(f'{lop}.{m.group(1).split("(")[0]}', {})[m.group(2)] = int(m.group(3))
loc = sys.argv[2] if len(sys.argv) > 2 else ''
print(f"{'hàm':42} {'cyclomatic':>10} {'cognitive':>9}")
for k, v in sorted(bang.items(), key=lambda kv: -kv[1].get('cognitive', 0)):
    if loc in k: print(f"{k:42} {v.get('cyclomatic', '-'):>10} {v.get('cognitive', '-'):>9}")
