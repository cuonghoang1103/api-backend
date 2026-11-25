#!/usr/bin/env python3
# chay-vm.py <tệp.bash> — Chương 8: mỗi dòng một lệnh, mặc định chạy TRONG máy ảo lab7 (ssh, người dùng hv, cwd /home/hv).
# Tiền tố dòng: "@keodo " chạy trong máy ảo kẻ dò; "@logsrv " chạy trong container lgz-logsrv (máy chủ log, Bài 8.2);
# "@host " chạy trên máy thật (chỉ lệnh docker run --rm cho ảnh Rocky/Fedora). Dòng '#' bỏ qua; ' \' nối dòng.
# Output "$ lệnh" (+ chú thích nơi chạy) + stdout/stderr thật ghi vào <tệp>.out.txt.
import os, shlex, subprocess, sys
p = sys.argv[1]; CFG = os.path.expanduser("~/vbg-dp/scratchpad/lgz/vm/ssh.cfg")
cmds, buf = [], ""
for line in open(p, encoding="utf-8").read().splitlines():
    if not buf and (not line.strip() or line.lstrip().startswith("#")): continue
    if line.endswith(" \\"): buf += line[:-1]; continue
    cmds.append(buf + line); buf = ""
out = []
NHAN = {"keodo": "   # ← trên máy keodo", "logsrv": "   # ← trên máy chủ log", "host": ""}
for c in cmds:
    may = "lab7"
    if c.startswith("@"):
        may, c = c[1:].split(" ", 1)
    out.append("$ " + c + NHAN.get(may, ""))
    if may in ("lab7", "keodo"): argv = ["ssh", "-F", CFG, may, "bash -c " + shlex.quote(c + " 2>&1")]
    elif may == "logsrv": argv = ["docker", "exec", "lgz-logsrv", "bash", "-c", c + " 2>&1"]
    else: argv = ["bash", "-c", c + " 2>&1"]
    r = subprocess.run(argv, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace")
    s = r.stdout.rstrip("\n")
    if s: out.append(s)
open(os.path.splitext(p)[0] + ".out.txt", "w", encoding="utf-8").write("\n".join(out) + "\n")
print("  ✓", os.path.basename(p), len(cmds), "lệnh")
