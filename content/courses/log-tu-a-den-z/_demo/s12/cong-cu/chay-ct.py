#!/usr/bin/env python3
# chay-ct.py <tệp.bash> — Chương 12: mỗi dòng một lệnh, mặc định chạy TRONG container máy chủ CSDL lgz-pg12 (bash, người dùng postgres,
# thư mục dữ liệu /var/lib/postgresql/data) — đúng như bạn ssh vào máy chủ CSDL. Tiền tố dòng: "@<tên> " chạy trong container lgz-<tên>
# (vd. @mysql, @mssql, @app), "@host " chạy trên máy thật. Dòng '#' bỏ qua; dòng '!' chạy ẩn (dựng cảnh, chờ); ' \' nối dòng.
# Biến môi trường MAC đổi container mặc định (vd. MAC=mysql). Output "$ lệnh" + stdout/stderr thật ghi vào <tệp>.out.txt.
import os, subprocess, sys
p = sys.argv[1]; MAC = os.environ.get("MAC", "pg12")
NGUOI = {"pg12": "postgres", "lab12db": "postgres"}   # "@root " = lgz-pg12 với quyền root
cmds, buf = [], ""
for line in open(p, encoding="utf-8").read().splitlines():
    if not buf and (not line.strip() or line.lstrip().startswith("#")): continue
    if line.endswith(" \\"): buf += line + "\n"; continue
    cmds.append(buf + line); buf = ""
out = []
for c in cmds:
    may, an = MAC, c.startswith("!")
    if an: c = c[1:].lstrip()
    if c.startswith("@"): may, c = c[1:].split(" ", 1)
    if not an: out.append("$ " + c)
    if may == "host": argv = ["bash", "-c", c + " 2>&1"]
    else:
        ten = "pg12" if may == "root" else may
        u = ["-u", NGUOI[ten], "-w", "/var/lib/postgresql/data"] if may in NGUOI else []
        argv = ["docker", "exec", "-i", *u, "lgz-" + ten, "bash", "-c", c + " 2>&1"]
    r = subprocess.run(argv, cwd=os.path.dirname(os.path.abspath(p)), stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace")
    s = "\n".join(l.rstrip() for l in r.stdout.rstrip("\n").split("\n"))
    if s.strip() and not an: out.append(s)
open(os.path.splitext(p)[0] + ".out.txt", "w", encoding="utf-8").write("\n".join(out) + "\n")
print("  ✓", os.path.basename(p), len(cmds), "lệnh")
