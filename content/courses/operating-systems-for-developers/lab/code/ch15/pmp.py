#!/usr/bin/env python3
"""pmp.py — "poor man's profiler": chụp ngăn xếp của MỌI luồng bằng gdb N lần, đếm luồng đang ĐỨNG Ở ĐÂU.
Thấy cả luồng đang ngủ/chờ khoá (thứ mà profiler CPU không bao giờ lấy mẫu được). Mỗi lần chụp dừng tiến trình vài
chục ms — đừng dùng dày đặc trên production.   python3 pmp.py PID [số lần] [giây giữa hai lần]"""
import subprocess, sys, time, re, collections
pid, n, gap = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 5, float(sys.argv[3]) if len(sys.argv) > 3 else 0.2
acc, total = collections.Counter(), 0
for _ in range(n):
    out = subprocess.run(['gdb', '-batch', '-nx', '-ex', 'set pagination 0', '-ex', 'thread apply all bt', '-p', pid],
                         capture_output=True, text=True).stdout
    for th in re.split(r'\nThread \d+ ', out)[1:]:
        fns = [m.group(1) for m in re.finditer(r'^#\d+\s+(?:0x[0-9a-f]+(?: \[PAC\])? in )?(\S+) \(', th, re.M)]
        keep = [f for f in fns if not f.startswith(('__GI_', '__internal_', 'start_thread', 'thread_start', 'clone'))][:4]
        acc[' <- '.join(keep)] += 1; total += 1
    time.sleep(gap)
print(f'{n} snapshots, {total} thread-stacks')
for k, v in acc.most_common(6): print(f'{v:5d}  {100 * v / total:5.1f}%  {k}')
