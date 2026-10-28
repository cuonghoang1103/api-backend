#!/usr/bin/env python3
"""stats.py — đọc một cột số (ms) từ stdin, in: n, nhỏ nhất (best-of-N), trung vị, trung bình ± độ lệch chuẩn, p90, lớn nhất.
   for i in $(seq 30); do ./hot 20000; done | grep -o '[0-9]* ms' | python3 stats.py "nhãn"   (bài 15.6)"""
import sys, statistics as st, re
xs = [float(m) for line in sys.stdin for m in re.findall(r'([0-9.]+) ms', line)]
xs.sort()
p = lambda q: xs[min(len(xs) - 1, int(-(-q * len(xs) // 100)) - 1)]
label = sys.argv[1] if len(sys.argv) > 1 else ''
print(f'{label:<14} n={len(xs)}  best {xs[0]:.0f}  median {st.median(xs):.0f}  mean {st.mean(xs):.0f} ± {st.stdev(xs):.0f}  p90 {p(90):.0f}  worst {xs[-1]:.0f}  (ms)')
