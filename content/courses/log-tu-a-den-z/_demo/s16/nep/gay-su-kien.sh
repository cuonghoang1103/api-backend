#!/usr/bin/env bash
# gay-su-kien.sh <số SSH sai> <số 5xx> — tạo sự kiện THẬT trên may16 để báo cáo có cái mà đọc (chỉ chạy trên máy lab)
ssh_sai=${1:-6}; loi=${2:-4}
printf '#!/bin/sh\necho sai-mat-khau\n' > /tmp/pass; chmod +x /tmp/pass
for i in $(seq "$ssh_sai"); do SSH_ASKPASS=/tmp/pass SSH_ASKPASS_REQUIRE=force setsid ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  -o PreferredAuthentications=password -o NumberOfPasswordPrompts=1 -o LogLevel=ERROR root@127.0.0.1 true 2>/dev/null; done
printf '#!/bin/sh\necho MatKhauLab-15\n' > /tmp/pass
SSH_ASKPASS=/tmp/pass SSH_ASKPASS_REQUIRE=force setsid ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR an@127.0.0.1 \
  'echo doan-bua | sudo -S -k -p "" true 2>/dev/null; echo MatKhauLab-15 | sudo -S -p "" cat /etc/shadow >/dev/null' 2>/dev/null; rm -f /tmp/pass
python3 - "$loi" <<'PY'
import sys, urllib.request
def goi(p):
    try: urllib.request.urlopen("http://127.0.0.1" + p, timeout=2).read()
    except Exception: pass
for i in range(30): goi(f"/san-pham/{i}")
for p in ["/.env", "/wp-login.php", "/.git/config", "/phpmyadmin/", "/admin.php"] * 5: goi(p)
for i in range(int(sys.argv[1])): goi("/api/thanh-toan")
PY
