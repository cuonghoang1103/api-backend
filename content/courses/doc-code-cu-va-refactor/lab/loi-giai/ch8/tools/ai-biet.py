#!/usr/bin/env python3
"""ai-biet.py <rev> <tệp…> — mỗi tệp: tác giả viết bao nhiêu % dòng (git blame), lần sửa cuối, "hệ số xe buýt" (số người viết ≥ 20 %)."""
import subprocess, sys, collections
rev, tep = sys.argv[1], sys.argv[2:]
print(f"{'tệp':28} {'dòng':>4}  {'ai viết (% dòng)':40} {'sửa cuối':10} xe buýt")
for t in tep:
    out = subprocess.run(['git', 'blame', '--line-porcelain', rev, '--', t], capture_output=True, text=True).stdout
    dem = collections.Counter(l[7:] for l in out.splitlines() if l.startswith('author '))
    n = sum(dem.values())
    if not n: continue
    ai = ', '.join(f"{a.split()[-1]} {100*c//n}" for a, c in dem.most_common(3))
    cuoi = subprocess.run(['git', 'log', '-1', '--format=%ad %an', '--date=format:%m/%Y', rev, '--', t], capture_output=True, text=True).stdout.strip()
    bus = sum(1 for c in dem.values() if c / n >= 0.2)
    print(f"{'/'.join(t.split('/')[-2:]):28} {n:>4}  {ai:40} {cuoi.split()[0]:10} {bus}")
