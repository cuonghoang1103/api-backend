#!/usr/bin/env python3
"""npm audit --json (npm 6) | python3 tom-tat-audit.py — bài 6.2: mỗi lỗ hổng một dòng (mức, gói, dải phiên bản lỗi, CVE, tiêu đề)."""
import json
import sys

d = json.load(sys.stdin)
for a in d['advisories'].values():
    print(f"{a['severity']:9} {a['module_name']:15} {a['vulnerable_versions']:18} {','.join(a.get('cves', []))[:16]:17} {a['title'][:58]}")
m = d['metadata']['vulnerabilities']
print('tong:', sum(m.values()), m)
