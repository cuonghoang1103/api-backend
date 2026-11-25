#!/usr/bin/env python3
# chay.py <tệp.sh> [cwd] — như scripts/log-khoa/chay-demo.py nhưng cho MỘT tệp: mỗi dòng (không '#') là một lệnh bash,
# dòng kết thúc ' \' nối dòng sau; ghi "$ lệnh" + output thật vào <tệp>.out.txt
import os, subprocess, sys
p = sys.argv[1]; cwd = sys.argv[2] if len(sys.argv) > 2 else os.path.expanduser("~/lab")
cmds, buf = [], ""
for line in open(p, encoding="utf-8").read().splitlines():
    if not buf and (not line.strip() or line.lstrip().startswith("#")): continue
    if line.endswith(" \\"): buf += line[:-1]; continue
    cmds.append(buf + line); buf = ""
out = []
for c in cmds:
    out.append("$ " + c)
    r = subprocess.run(["bash", "-c", c], cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    s = r.stdout.rstrip("\n")
    if s: out.append(s)
open(os.path.splitext(p)[0] + ".out.txt", "w", encoding="utf-8").write("\n".join(out) + "\n")
print("  ✓", os.path.basename(p), len(cmds), "lệnh")
