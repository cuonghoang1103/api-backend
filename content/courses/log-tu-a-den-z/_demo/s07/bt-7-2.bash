# Lời giải 🧪 bài 7.2 — chạy thật 24/11/2026 trong container systemd lgz-c07 (Ubuntu 24.04, systemd 255; podman, --network none, 2 GB). Giờ máy = UTC.
sudo usermod -aG systemd-journal hv
# Câu 1 — một unit hỏng giống shop-worker
printf '[Unit]\nDescription=Bao cao don hang (bai tap 7.2)\n[Service]\nExecStart=/usr/bin/python3 -c "import json; print(json.load(open(\x27/etc/bao-cao/cfg.json\x27)))"\nRestart=on-failure\nRestartSec=1\n' | sudo tee /etc/systemd/system/bao-cao.service
sudo systemctl daemon-reload
sudo systemctl start bao-cao
sleep 12
sudo systemctl status bao-cao --no-pager | head -n 4
sudo systemctl show bao-cao -p Result -p NRestarts -p ExecMainStatus
journalctl -b -u bao-cao --no-pager | head -n 8
journalctl -b -u bao-cao -g Error -n 1 --no-pager
sudo mkdir -p /etc/bao-cao
echo '{"ngay": "2026-11-24", "kenh": "email"}' | sudo tee /etc/bao-cao/cfg.json
sudo systemctl reset-failed bao-cao
sudo systemctl start bao-cao
sleep 2
journalctl -b -u bao-cao -n 3 --no-pager
sudo systemctl show bao-cao -p Result -p ExecMainStatus
# Câu 2 — dòng do root viết trong 10 phút qua, trừ chính systemd
journalctl _UID=0 --since '10 min ago' -q | wc -l
journalctl _UID=0 --since '10 min ago' -o json | jq -r 'select(._PID != "1") | ._COMM' | sort | uniq -c | sort -rn
journalctl _UID=0 --since '10 min ago' -o json | jq -r 'select(._PID != "1") | .MESSAGE' | tail -n 3
# Câu 3 — dòng của ssh.service HOẶC nhãn sudo, trong một lệnh
sudo systemctl start ssh
journalctl -u ssh -t sudo --no-pager
journalctl _SYSTEMD_UNIT=ssh.service + SYSLOG_IDENTIFIER=sudo --no-pager | tail -n 5
# Câu 5 — đếm dòng khớp timeout theo giờ (dữ liệu: 5 dòng do logger sinh lúc chạy bài)
for i in 1 2 3 4 5; do logger -t shop-api "order 10$i failed: database timeout after 5000 ms"; done
journalctl -b -q -g timeout -o short-iso --no-pager
journalctl -q -g timeout -o short-iso --no-pager | cut -c1-13 | uniq -c
