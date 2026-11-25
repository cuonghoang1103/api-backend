# 6.3 — lệnh log: show/stream/collect, --last/--start/--end, --style, --info/--debug, .logarchive.
log show --last 1m | wc -l; log show --last 1m --info --debug | wc -l
log show --last 10m --style default --predicate 'subsystem == "com.example.shopmac" AND category == "db"'
log show --last 10m --style syslog --predicate 'subsystem == "com.example.shopmac" AND category == "db"'
log show --last 10m --timezone UTC --style compact --predicate 'subsystem == "com.example.shopmac" AND category == "db"'
log show --last 10m --source --predicate 'process == "motep" AND eventMessage BEGINSWITH "M"' | cut -c1-200
log show --last 10m --style ndjson --predicate 'subsystem == "com.example.shopmac"' | tail -2 | cut -c1-160
log show --last 10m --style ndjson --predicate 'subsystem == "com.example.shopmac"' | jq -r 'select(.eventMessage) | [.timestamp[11:23], .messageType, .category, .eventMessage] | @tsv'
log show --last 10m --style ndjson --predicate 'subsystem == "com.example.shopmac"' | jq -r 'select(.messageType) | .messageType' | sort | uniq -c
log show --process shopmac --last 10m --style compact | tail -2
log show --last 1m --style compact | tail -n +2 | awk '{print $1, $2}' | grep -vc '^20'
./shopmac khach@example.com >/dev/null; log collect --last 2m --output ./ca-may.logarchive; du -sh ca-may.logarchive
log show --archive ./ca-may.logarchive --style compact --predicate 'subsystem == "com.example.shopmac" AND messageType == fault'; rm -rf ./ca-may.logarchive
