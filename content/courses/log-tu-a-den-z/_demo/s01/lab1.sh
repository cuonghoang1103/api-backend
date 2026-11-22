# Kiểm đáp án Lab 1: đưa mọi nguồn về UTC theo đúng luật của từng nguồn, rồi xếp lại
awk -F'","' 'NR > 1 {gsub(/"/, "", $1); print $1 "|win " $2 " " $3}' incident/windows-system.csv | while IFS='|' read -r t r; do echo "$(date -u -d "TZ=\"Asia/Ho_Chi_Minh\" $t" +%FT%TZ) $r"; done > /tmp/l1.txt
awk '{print $1 "T" $2 "Z pg  " substr($0, index($0, $5))}' incident/postgresql.log | cut -c1-60 | sed -E 's/\.[0-9]{3}Z/Z/' >> /tmp/l1.txt
jq -r '"\(.time / 1000 | floor | todate) app \(.msg)"' incident/app.jsonl >> /tmp/l1.txt
while read -r d t rest; do echo "$(date -u -d "@$(( $(date -d "TZ=\"Asia/Ho_Chi_Minh\" $d $t" +%s) - 180 ))" +%FT%TZ) ngx $(echo "$rest" | cut -c1-50)"; done < incident/nginx-error.log >> /tmp/l1.txt
while read -r ts h rest; do echo "$(date -u -d "$ts" +%FT%TZ) jrn $(echo "$rest" | cut -c1-50)"; done < incident/journal-api01.txt >> /tmp/l1.txt
sort -s -k1,1 /tmp/l1.txt | nl
