#!/usr/bin/env python3
"""folded.py — đọc "folded stacks" (định dạng của flame graph: "main;handle;crc 802" — mỗi dòng một ngăn xếp + số mẫu)
và in ra hai bảng mà flame graph vẽ bằng hình (bài 15.2–15.4):
  • SELF  — hàm ở ĐỈNH ngăn xếp (đang chạy thật lúc lấy mẫu)      = mép trên cùng của flame graph
  • TOTAL — hàm ở BẤT KỲ đâu trong ngăn xếp (nó + mọi thứ nó gọi) = độ rộng khung của nó trong flame graph
Dùng được cho: perf script | stackcollapse-perf.pl · py-spy record -f raw · asprof -o collapsed · offcputime -f
   python3 folded.py FILE [số dòng] [--us]"""
import sys, collections, re
args = [a for a in sys.argv[1:] if not a.startswith('--')]
path, top = args[0], int(args[1]) if len(args) > 1 else 6
unit = 'us off-CPU' if '--us' in sys.argv else 'samples'
short = lambda f: re.sub(r' \(.*\)$', '', f)[:58]          # py-spy: "func (file.py:12)" ⇒ "func"
self_c, total_c, n, stacks = collections.Counter(), collections.Counter(), 0, 0
for line in open(path):
    line = line.rstrip('\n')
    if ' ' not in line: continue
    stack, cnt = line.rsplit(' ', 1)
    frames = [short(f) for f in stack.split(';') if f]
    cnt, stacks, n = int(cnt), stacks + 1, n + int(cnt)
    self_c[frames[-1]] += cnt
    for f in set(frames): total_c[f] += cnt
tot = [(f, c) for f, c in total_c.most_common() if c < 0.98 * n][:top]   # bỏ các khung gốc (≥ 98%: _start, main, uv_run…)
w = max([30] + [len(f) for f, _ in self_c.most_common(top) + tot])
print(f'{n} {unit} in {stacks} distinct stacks')
print(f'  {"SELF (top of the stack)":<{w}}  share')
for f, c in self_c.most_common(top): print(f'  {f:<{w}}  {100 * c / n:5.1f}%')
print(f'  {"TOTAL (anywhere in the stack)":<{w}}  share')
for f, c in tot: print(f'  {f:<{w}}  {100 * c / n:5.1f}%')
