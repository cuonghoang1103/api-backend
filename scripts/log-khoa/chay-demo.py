#!/usr/bin/env python3
# chay-demo.py — chạy mọi lệnh mẫu của khoá log-tu-a-den-z TRÊN gói log mẫu, ghi output THẬT cạnh lệnh.
# Gọi qua scripts/log-khoa/chay-demo.sh (chạy trong container Ubuntu 24.04 / PowerShell, không chạy trên máy thật).
#   _demo/sNN/<ten>.sh   → mỗi dòng không bắt đầu bằng '#' là một lệnh bash, cwd = ~/log-lab  → <ten>.out.txt
#   _demo/sNN/<ten>.ps1  → mỗi dòng là một lệnh PowerShell (pwsh), cwd = ~/log-lab               → <ten>.out.txt
# Dòng kết thúc bằng ' \' nối với dòng sau. Output ghi dạng "$ lệnh" / "PS> lệnh" rồi kết quả.
import os, subprocess, sys
DEMO, KIEU = sys.argv[1], sys.argv[2]   # KIEU = sh | ps1
LAB = os.path.expanduser("~/log-lab")
for d, _, fs in sorted(os.walk(DEMO)):
    for f in sorted(fs):
        if not f.endswith("." + KIEU): continue
        p = os.path.join(d, f)
        cmds, buf = [], ""
        for line in open(p, encoding="utf-8").read().splitlines():
            if not buf and (not line.strip() or line.lstrip().startswith("#")): continue
            if line.endswith(" \\"): buf += line[:-1]; continue
            cmds.append(buf + line); buf = ""
        out = []
        for c in cmds:
            out.append(("$ " if KIEU == "sh" else "PS> ") + c)
            argv = ["bash", "-c", c] if KIEU == "sh" else ["pwsh", "-NoProfile", "-NonInteractive", "-Command", "$PSStyle.OutputRendering = 'PlainText'; " + c]
            r = subprocess.run(argv, cwd=LAB, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            s = r.stdout.rstrip("\n")
            if s: out.append(s)
        open(p[: -len(KIEU) - 1] + (".out.txt" if KIEU == "sh" else ".ps.out.txt"), "w", encoding="utf-8").write("\n".join(out) + "\n")
        print("  ✓", os.path.relpath(p, DEMO), len(cmds), "lệnh")
