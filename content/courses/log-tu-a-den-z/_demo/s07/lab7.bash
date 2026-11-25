# Lab 7 — lời giải mẫu: "Vì sao shop-api khởi động lại lúc 03:12?" (máy ảo lab7, đêm 25/11; mọi lệnh chỉ ĐỌC)
systemctl status shop-api --no-pager | head -n 4
systemctl show shop-api -p NRestarts -p MemoryMax -p MemoryPeak
journalctl --list-boots | tail -n 2
journalctl -u shop-api --since '03:11:58' --until '03:12:06' --no-pager
journalctl -p warning --since '03:11' --until '03:13' --no-pager
journalctl -k --since '03:11' --until '03:13' -g 'Killed process|oom-kill:' --no-pager -o short-precise
journalctl -u shop-report --since '03:11' --no-pager
systemctl list-timers shop-report.timer --no-pager
journalctl -u shop-api --since '03:11' --until '03:13' -o json | jq -r '[._PID, ._SYSTEMD_INVOCATION_ID // "-"] | @tsv' | uniq -c
journalctl -u shop-api --since '03:11:58' --until '03:12:04' -o json | jq -r 'select(.MESSAGE | test("report")) | (.__MONOTONIC_TIMESTAMP | tonumber / 1e6 | tostring) + "s " + .MESSAGE'
journalctl -u shop-api -p debug..debug --since today --no-pager -q | wc -l
