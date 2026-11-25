#!/usr/bin/env python3
# chay-vm.py <tệp.bash> — như chay.py nhưng mỗi lệnh chạy TRONG máy ảo lab7 (qua ssh, người dùng hv, cwd /home/hv).
# Ghi "$ lệnh" + output thật (stdout+stderr) vào <tệp>.out.txt. Dòng '#' bỏ qua; ' \' nối dòng.
import os, shlex, subprocess, sys
p = sys.argv[1]; CFG = os.path.expanduser("~/vbg-dp/scratchpad/lgz/vm/ssh.cfg")
cmds, buf = [], ""
for line in open(p, encoding="utf-8").read().splitlines():
    if not buf and (not line.strip() or line.lstrip().startswith("#")): continue
    if line.endswith(" \\"): buf += line[:-1]; continue
    cmds.append(buf + line); buf = ""
out = []
for c in cmds:
    out.append("$ " + c)
    r = subprocess.run(["ssh", "-F", CFG, "lab7", "bash -c " + shlex.quote(c + " 2>&1")], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace")
    s = r.stdout.rstrip("\n")
    if s: out.append(s)
open(os.path.splitext(p)[0] + ".out.txt", "w", encoding="utf-8").write("\n".join(out) + "\n")
print("  ✓", os.path.basename(p), len(cmds), "lệnh")
