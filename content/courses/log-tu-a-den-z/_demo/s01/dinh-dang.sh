ls formats/
cat formats/rfc3164.log formats/rfc5424.log
cut -d' ' -f1-4 formats/rfc5424.log
jq -r '[.user, .src_ip, .event] | @tsv' formats/json.log
grep -oE '(user|src_ip|event)=[^ ]+' formats/logfmt.log
awk -F'|' '{print "vendor=" $2, "product=" $3, "signature=" $5, "severity=" $7}' formats/cef.log
grep -oE '<EventID>[0-9]+|Name="(TargetUserName|IpAddress|LogonType)">[^<]+' formats/event-4625.xml
grep -c 'Failed password' formats/*
