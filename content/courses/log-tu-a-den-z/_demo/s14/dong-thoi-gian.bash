# 14.5 — dựng dòng thời gian: một khoảnh khắc, năm cách ghi giờ; công cụ gộp mọi nguồn về UTC theo dấu hiệu; xoay trục theo IP / tài khoản / request id.
cd vu14/web01/var/log && grep -m1 '192.0.2.10' nginx/access.log | cut -c1-60; grep -m1 'audit_enabled=0' audit/audit.log | cut -c1-48; grep -m1 'Accepted password' /lab/vu14/logsrv/web01/auth-syslog.log | cut -c1-32; jq -c 'select(.user == "hoa@mail.example" and (.ip | startswith("198.")) and .msg == "login ok") | {time}' shop/app.jsonl
date -u -d '19 Nov 2026 02:31:12 +0700' +%FT%TZ; date -u -d @1795029750 +%FT%TZ; date -u -d '2026-11-19T02:14:01.078999+07:00' +%FT%TZ; date -u -d @$((1795026294695 / 1000)) +%FT%TZ
cd vu14 && python3 /lab/s14/mau/dong-thoi-gian.py . 203.0.113.77 198.51.100.165 198.51.100.168 192.0.2.10 sysupdate auid=1001 kworkerd dbus-sync rsyslogd 'COMMAND=/usr/bin/bash' IM_LANG HOI_PHUC > /lab/ra/dtg.tsv; wc -l < /lab/ra/dtg.tsv
cut -f1-4 /lab/ra/dtg.tsv | cut -c1-150
cut -f2 /lab/ra/dtg.tsv | sort | uniq -c | sort -rn
grep -rn 'anh-2041' vu14 | cut -d: -f1 | sort | uniq -c
grep -h 'auid=1001' vu14/web01/var/log/audit/audit.log | grep -oE 'type=[A-Z_]+' | sort | uniq -c
