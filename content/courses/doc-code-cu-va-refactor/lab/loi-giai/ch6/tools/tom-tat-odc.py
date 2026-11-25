#!/usr/bin/env python3
"""python3 tom-tat-odc.py target/dependency-check-report.json — bài 6.2: mỗi CVE một dòng (jar, CVE, điểm CVSS, mức, đầu mô tả)."""
import json
import sys

d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'target/dependency-check-report.json'))
print(len(d['dependencies']), 'jar duoc quet,', sum(len(x.get('vulnerabilities', [])) for x in d['dependencies']), 'CVE')
for dep in d['dependencies']:
    for v in dep.get('vulnerabilities', []):
        c3 = v.get('cvssv3', {})
        print(f"{dep['fileName'][:28]:30} {v['name']:15} {str(c3.get('baseScore', '?')):5} {c3.get('baseSeverity', ''):9} {' '.join(v['description'].split())[:62]}")
