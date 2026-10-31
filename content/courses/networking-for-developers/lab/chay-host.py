#!/usr/bin/env python3
"""chay-host.py <kich-ban.sh> <ten-output> — như `phien` nhưng chạy trên MÁY CỦA BẠN (macOS/Linux, ngoài container):
in "$ lệnh" rồi output thật (stdout+stderr chung). Chỉ cho các lệnh docker/compose nhìn từ ngoài vào lab.
Dòng "# …" in nguyên; dòng trống bỏ qua."""
import subprocess, sys, pathlib
src, ten = sys.argv[1], sys.argv[2]
out = []
for line in pathlib.Path(src).read_text().splitlines():
    if not line.strip(): continue
    if line.startswith('#'): out.append(line); continue
    out.append('$ ' + line)
    r = subprocess.run(['/bin/bash', '-c', line], capture_output=True, text=True, cwd=pathlib.Path(__file__).parent)
    out.extend((r.stdout + r.stderr).rstrip('\n').split('\n') if (r.stdout + r.stderr).strip() else [])
p = pathlib.Path(__file__).parent / 'out' / f'{ten}.out.txt'
p.write_text('\n'.join(out) + '\n'); print(f'✓ {p.relative_to(pathlib.Path.cwd()) if p.is_relative_to(pathlib.Path.cwd()) else p} ({len(out)} dòng)')
