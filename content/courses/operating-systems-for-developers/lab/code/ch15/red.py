#!/usr/bin/env python3
"""red.py — RED (Rate · Errors · Duration) của một dịch vụ, tính từ nhật ký truy cập "ms đường-dẫn mã ms-xử-lý" (bài 15.1).
   python3 red.py access.log"""
import sys, collections
by = collections.defaultdict(list)
for line in open(sys.argv[1]):
    t, path, code, ms = line.split()
    by[path].append((int(t), int(code), float(ms)))
def pct(a, p): a = sorted(a); return a[min(len(a) - 1, max(0, int(-(-p * len(a) // 100)) - 1))]
print(f'{"endpoint":<10} {"rate":>9} {"errors":>8} {"p50":>8} {"p95":>8} {"p99":>8} {"max":>8}   (duration measured INSIDE the server)')
for path, rows in sorted(by.items()):
    span = max(1, (max(r[0] for r in rows) - min(r[0] for r in rows)) / 1000)
    d = [r[2] for r in rows]; err = sum(1 for r in rows if r[1] >= 500)
    print(f'{path:<10} {len(rows) / span:7.1f}/s {100 * err / len(rows):7.1f}% {pct(d, 50):6.1f}ms {pct(d, 95):6.1f}ms {pct(d, 99):6.1f}ms {max(d):6.1f}ms')
