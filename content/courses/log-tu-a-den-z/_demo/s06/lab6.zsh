# Lab 6 — máy ngủ/thức lúc nào, ai dùng sudo tuần này, và vì sao "last" ghi crash lúc 19:16 ngày 24/11.
pmset -g log | head -2 | cut -c1-44
pmset -g log | awk -v tu="$(date -v-7d +%F)" '$1 >= tu && ($4=="Sleep" || $4=="Wake" || $4=="DarkWake") {n[$1" "$4]++} END {for (k in n) print k, n[k]}' | sort
pmset -g log | awk '$4=="Sleep" || $4=="Wake"' | tail -4 | cut -c1-150
log show --last 7d --style compact --predicate 'process == "loginwindow" AND eventMessage CONTAINS "sendDistributedNotification: com.apple.screenIs"' | grep -oE '^[0-9-]+ [0-9:]{8}|screenIs(Un)?[Ll]ocked' | paste - - | tail -6
log show --last 7d --style compact --predicate 'process == "sudo"' | tail -n +2 | wc -l
last | grep -E '^(reboot|shutdown)' | head -4
last | grep -B1 -A1 'crash' | head -6
log show --start '2026-11-24 19:09:00' --end '2026-11-24 19:16:30' --style ndjson | jq -r 'select(.timestamp) | .timestamp[0:16]' | awk '$0 > "2026-11-24 19:18" {exit} {n[$0]++} END {for (k in n) print n[k], k}' | sort -k2
log show --start '2026-11-24 19:10:20' --end '2026-11-24 19:10:40' --style compact --predicate '(process == "suhelperd" AND (eventMessage CONTAINS "Rebooting" OR eventMessage CONTAINS "reboot3")) OR eventType == timesyncEvent' | cut -c1-150
grep -E '^2026-11-24 19:(0[5-9]|1[0-9])' /var/log/install.log | grep -E 'Installed "|Rebooting|reboot3' | cut -c1-170
pmset -g log | grep -E '^2026-11-24 19:0' | grep -E 'SoftwareUpdate' | cut -c1-170 | head -3
grep '^2026-11-24 19:10:22' /var/log/install.log | grep -oE 'MSU_UPDATE_[0-9A-Z]+_patch_[0-9.]+' | sort -u; sw_vers -productVersion
