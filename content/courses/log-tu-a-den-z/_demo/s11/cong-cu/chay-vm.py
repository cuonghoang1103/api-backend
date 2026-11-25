#!/usr/bin/env python3
# chay-vm.py <tệp.bash> — Chương 11: mỗi dòng một lệnh, mặc định chạy TRONG máy ảo lab7 (ssh, người dùng hv). Tiền tố dòng:
#   "@wrt "     router OpenWrt (ash, root)        "@android " thiết bị android-7f3a      "@keodo " máy người lạ
#   "@win "     PowerShell trên Windows LAPTOP-AN (in "PS> lệnh")     "@host " máy thật (chỉ lệnh docker run --rm …)
# Dòng '#' bỏ qua; dòng '!' chạy ẩn (không in lệnh lẫn output); ' \' nối dòng. Output "$ lệnh   # ← nơi chạy" + stdout/stderr thật ghi vào <tệp>.out.txt.
import os, shlex, subprocess, sys
p = sys.argv[1]; CFG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ssh.cfg")
cmds, buf = [], ""
for line in open(p, encoding="utf-8").read().splitlines():
    if not buf and (not line.strip() or line.lstrip().startswith("#")): continue
    if line.endswith(" \\"): buf += line[:-1]; continue
    cmds.append(buf + line); buf = ""
NHAN = {"wrt": "   # ← trên router wrt-nha", "android": "   # ← trên android-7f3a", "keodo": "   # ← trên keodo", "lab7": "", "host": "", "win": ""}
out = []
for c in cmds:
    may, an = "lab7", c.startswith("!")   # "!" đầu dòng: chạy nhưng KHÔNG in (chờ, dựng cảnh) — output vẫn bỏ
    if an: c = c[1:].lstrip()
    if c.startswith("@"): may, c = c[1:].split(" ", 1)
    if not an: out.append(("PS> " if may == "win" else "$ ") + c + NHAN[may])
    if may in ("lab7", "keodo", "android"): argv = ["ssh", "-F", CFG, may, "bash -c " + shlex.quote(c + " 2>&1")]
    elif may == "wrt": argv = ["ssh", "-F", CFG, may, "sh -c " + shlex.quote(c + " 2>&1")]
    elif may == "win": argv = ["ssh", "-F", CFG, may, "$ProgressPreference='SilentlyContinue'; [Console]::OutputEncoding=[Text.Encoding]::UTF8; & { " + c + " } | Out-String -Width 200 -Stream | ForEach-Object { $_.TrimEnd() }"]
    else: argv = ["bash", "-c", c + " 2>&1"]
    r = subprocess.run(argv, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace")
    s = "\n".join(l.rstrip() for l in r.stdout.replace("\r\n", "\n").rstrip("\n").split("\n"))
    if s.strip() and not an: out.append(s)
open(os.path.splitext(p)[0] + ".out.txt", "w", encoding="utf-8").write("\n".join(out) + "\n")
print("  ✓", os.path.basename(p), len(cmds), "lệnh")
