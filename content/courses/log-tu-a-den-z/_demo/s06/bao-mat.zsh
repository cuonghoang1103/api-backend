# 6.5 — bảo mật: đăng nhập/khởi động lại, sudo, dòng sudo GIẢ, TCC, Gatekeeper, XProtect, launchd/BTM, dấu vết của chính lệnh log.
last | head -6
last | grep -E '^(reboot|shutdown)' | head -4
log show --last 7d --style compact --predicate 'process == "sudo"' | wc -l
logger -p authpriv.notice -t sudo "sv : TTY=ttys009 ; PWD=/Users/sv ; USER=root ; COMMAND=/bin/cat /etc/master.passwd"
sleep 1; log show --last 30s --style compact --predicate 'process == "sudo"'
log show --last 30s --style compact --predicate 'eventMessage CONTAINS "COMMAND=/bin/cat"' | grep -v 'log run'
log show --last 30s --style ndjson --predicate 'process == "logger" AND eventMessage CONTAINS "TTY="' | jq '{processImagePath, processID, userID, messageType, subsystem, eventMessage}'
log show --last 1h --style ndjson --predicate 'subsystem == "com.apple.TCC" AND eventMessage BEGINSWITH "AUTHREQ_"' | jq -r 'select(.eventMessage) | .eventMessage' > tcc.txt; wc -l < tcc.txt
grep -oE 'AUTHREQ_[A-Z]+' tcc.txt | sort | uniq -c
grep '^AUTHREQ_CTX' tcc.txt | grep -oE 'service=kTCCService[A-Za-z]+' | sort | uniq -c | sort -nr | head -6
grep '^AUTHREQ_RESULT' tcc.txt | grep -oE 'authValue=[0-9]' | sort | uniq -c
M=$(grep '^AUTHREQ_ATTRIBUTION' tcc.txt | grep 'accessing={TCCDProcess: identifier=com.apple.' | head -1 | grep -oE 'msgID=[0-9.]+'); grep "$M," tcc.txt | grep -v SUBJECT | cut -c1-330; rm -f tcc.txt
spctl --status
spctl -a -vv -t execute ./motep
spctl -a -vv /System/Applications/Calculator.app
cp motep motep-tai; xattr -w com.apple.quarantine "0083;$(printf %x $(date +%s));Safari;" motep-tai; xattr -l motep-tai | cut -c1-80; spctl -a -vv -t execute motep-tai; rm -f motep-tai
log show --last 30m --style compact --predicate 'process == "syspolicyd" AND eventMessage CONTAINS "(id: motep)"' | head -3 | cut -c1-200
xprotect version
grep -E 'Installed "XProtect' /var/log/install.log | tail -3
launchctl print gui/$(id -u) | sed -n '1,9p'
ls ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons | grep -c 'plist$'
plutil -lint vi-du-launchagent.plist; plutil -p vi-du-launchagent.plist
log show --last 1d --style compact --predicate 'subsystem == "com.apple.backgroundtaskmanagement" AND eventMessage BEGINSWITH "register"' | head -3 | cut -c1-200
log show --last 5m --style compact --predicate 'process == "log" AND eventMessage BEGINSWITH "log run"' | tail -2 | cut -c1-230
