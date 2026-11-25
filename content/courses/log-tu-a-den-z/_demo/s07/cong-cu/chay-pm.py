#!/usr/bin/env python3
# chay-pm.py <tệp.bash> — như chay-vm.py nhưng mỗi lệnh chạy TRONG container systemd lgz-c07 (podman không root, Ubuntu 24.04 + systemd 255,
# --network none, 2 GB) bằng người dùng hv, cwd /home/hv. Mỗi lệnh là một phiên `podman exec` MỚI (như một lần đăng nhập mới).
import os, shlex, subprocess, sys
p = sys.argv[1]
cmds, buf = [], ""
for line in open(p, encoding="utf-8").read().splitlines():
    if not buf and (not line.strip() or line.lstrip().startswith("#")): continue
    if line.endswith(" \\"): buf += line[:-1]; continue
    cmds.append(buf + line); buf = ""
out = []
for c in cmds:
    out.append("$ " + c)
    r = subprocess.run(["podman", "exec", "-u", "hv", "-w", "/home/hv", "lgz-c07", "bash", "-c", c + " 2>&1"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace")
    s = r.stdout.rstrip("\n")
    if s: out.append(s)
open(os.path.splitext(p)[0] + ".out.txt", "w", encoding="utf-8").write("\n".join(out) + "\n")
print("  ✓", os.path.basename(p), len(cmds), "lệnh")
