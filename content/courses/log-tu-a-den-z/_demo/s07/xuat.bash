# 7.3 — Định dạng xuất và trường của journalctl (máy ảo lab7)
journalctl -u shop-api -n 2 --no-pager -o short
journalctl -u shop-api -n 2 --no-pager -o short-iso
journalctl -u shop-api -n 2 --no-pager -o short-iso --utc
journalctl -u shop-api -n 2 --no-pager -o short-precise
journalctl -u shop-api -n 2 --no-pager -o short-monotonic
journalctl -u shop-api -n 2 --no-pager -o cat
journalctl -u shop-api -n 2 --no-pager -o with-unit
journalctl -u shop-api -n 1 -o json
journalctl -u shop-api -n 1 -o json --output-fields=MESSAGE,PRIORITY,_PID
journalctl -u shop-api -n 1 -o json | jq -r '(.__REALTIME_TIMESTAMP | tonumber / 1000000 | todate) + " " + .MESSAGE'
journalctl -F _SYSTEMD_UNIT | sort | head -n 12
journalctl -F PRIORITY | sort | tr '\n' ' '; echo
journalctl -b -F _COMM | sort | tr '\n' ' '; echo
journalctl -b -o json | jq -r 'select((.PRIORITY | tonumber) <= 3) | ._SYSTEMD_UNIT // .SYSLOG_IDENTIFIER' | sort | uniq -c | sort -nr
journalctl -b -o json | jq -r 'select(.PRIORITY == null) | ._COMM // .SYSLOG_IDENTIFIER' | sort | uniq -c
journalctl -b -o json | jq -r 'select((.PRIORITY // "6" | tonumber) <= 3) | ._SYSTEMD_UNIT // .SYSLOG_IDENTIFIER' | sort | uniq -c | sort -nr
journalctl -b -u shop-api -o json | jq -r '.MESSAGE' | grep -oE '^(GET [^ ]+|order [0-9]+ failed|login failed)' | sed -E 's/[0-9]+/N/g' | sort | uniq -c | sort -nr
journalctl -b -u shop-api -p err -o json | jq -s 'length'
printf 'scan \xff\xfe from 203.0.113.7\n' | systemd-cat -t binary-thu
journalctl -t binary-thu -n 1 --no-pager
journalctl -t binary-thu -n 1 -o json --output-fields=MESSAGE
journalctl -t binary-thu -n 1 -o json | jq -r '.MESSAGE | if type == "array" then implode else . end'
mkdir -p ~/bang-chung && sudo cp /var/log/journal/$(cat /etc/machine-id)/system@*.journal ~/bang-chung/ && sudo chown hv ~/bang-chung/* && ls ~/bang-chung | head -n 3
journalctl -D ~/bang-chung --list-boots
journalctl -D ~/bang-chung -u shop-worker -n 2 --no-pager
