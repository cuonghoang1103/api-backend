#!/usr/bin/env python3
# chay-mau.py <tệp.bash> — Chương 3–5 (EVTX mẫu công khai): mỗi dòng một lệnh, chạy trong container lgz-c03 (ảnh lgz-win-mau:1 = PowerShell 7 + evtx-json + jq,
# --network none, --memory 2g). /lab/mau = bộ EVTX mẫu (chỉ đọc), /lab là thư mục làm việc. Mặc định bash (in "$ lệnh"); tiền tố "@ps " = PowerShell 7 (in "PS> lệnh").
# Dòng '#' bỏ qua; dòng '!' chạy ẩn; ' \' nối dòng. Output thật ⇒ <tệp>.out.txt. Dựng container: bash cong-cu/ct.bash
import subprocess, sys, os
p = sys.argv[1]; cmds, buf = [], ""
for line in open(p, encoding="utf-8").read().splitlines():
    if not buf and (not line.strip() or line.lstrip().startswith("#")): continue
    if line.endswith(" \\"): buf += line[:-1] + "\n"; continue
    cmds.append(buf + line); buf = ""
out = []
for c in cmds:
    an = c.startswith("!")
    if an: c = c[1:].lstrip()
    ps = c.startswith("@ps ")
    if ps: c = c[4:]
    if not an: out.append(("PS> " if ps else "$ ") + c.replace("\n", "\n> " if ps else "\n"))
    argv = ["docker", "exec", "-w", "/lab", "lgz-c03"] + (["pwsh", "-NoProfile", "-NonInteractive", "-Command", "$ProgressPreference='SilentlyContinue'; & { " + c + " } 2>&1 | Out-String -Width 160 -Stream | ForEach-Object { $_.TrimEnd() }"] if ps else ["bash", "-c", c + " 2>&1"])
    r = subprocess.run(argv, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace")
    s = "\n".join(l.rstrip() for l in r.stdout.replace("\r\n", "\n").strip("\n").split("\n"))
    if s.strip() and not an: out.append(s)
open(os.path.splitext(p)[0] + ".out.txt", "w", encoding="utf-8").write("\n".join(out) + "\n")
print("  ✓", os.path.basename(p), len(cmds), "lệnh")
