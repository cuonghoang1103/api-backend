# 18.3 — Điều tra: lời giải 13 câu có lệnh (câu 14–15 là phân tích, xem bài). Thư mục làm việc: thư mục chứa su-co18.
# C1 — PC-DEV01 tối thứ Bảy: ai thử đăng nhập, bằng gì, kết quả?
cd su-co18/pc-dev01 && jq -r 'select(.Data.IpAddress == "10.8.0.1" or .Id == 4740) | [.TimeCreated[11:19], .Id, .Data.TargetUserName, (.Data.SubStatus // "-"), .Data.LogonType // "-", .Data.WorkstationName // .Data.TargetDomainName] | @tsv' security.jsonl
cd su-co18/pc-dev01 && jq -r 'select(.Id == 4624) | "\(.Data.LogonType) \(.Data.IpAddress)"' security.jsonl | sort | uniq -c
# C2 — 10.8.0.1 là ai? B0A903430D8B là gì?
cd su-co18 && grep -A1 'allowed-ips' rt01/thu-thap/firewall.txt && grep -E "forward=|dest=" rt01/thu-thap/firewall.txt | head -n 3
cd su-co18/vps01 && grep -i 'b0a903430d8b' journal/vps01-journal.json | jq -r '[(.__REALTIME_TIMESTAMP | tonumber / 1e6 | floor | todate), .SYSLOG_IDENTIFIER, .MESSAGE[0:95]] | @tsv'
cd su-co18/vps01 && jq -r 'select(.MESSAGE | startswith("Started docker-")) | [(.__REALTIME_TIMESTAMP | tonumber / 1e6 | floor | todate), .MESSAGE[15:27]] | @tsv' journal/vps01-journal.json; cat thu-thap/docker-ps.txt
# C3 — Từ 10.8.0.1, chúng nhìn thấy gì trong mạng văn phòng?
cd su-co18/rt01 && grep -c 'query\[PTR\].*from 10.8.0.1' logread.txt && grep -oE 'dhcp\.cfg01411c [0-9.]+ is \S+' logread.txt | sort -u
cd su-co18/rt01 && grep 'wg-lan' logread.txt | grep -oE 'DST=\S+|DPT=[0-9]+' | paste -d' ' - - | sort | uniq -c | sort -k2
# C4 — Trước khi vào được: chúng thử gì vào web? API có bị SQL injection không?
cd su-co18/vps01/var/log/nginx && grep -c 'sqlmap' access.log && grep 'sqlmap' access.log | awk '{print $1, $9}' | sort | uniq -c && grep 'sqlmap' access.log | sed -n '1p;$p' | cut -d' ' -f4
cd su-co18/vps01 && R=$(grep -m1 '" 400 .*sqlmap' var/log/nginx/access.log | grep -oE 'rid=[0-9a-f]+' | cut -d= -f2) && echo "rid=$R" && grep -h "$R" var/lib/docker/containers/*/*-json.log | jq -c '.log | fromjson | {level, msg, url: .req.url, issues: .issues[0].message}'
cd su-co18/vps01/postgresql/log && grep -c -E ',(ERROR|FATAL),' *.csv
# C5 — Rải mật khẩu SSH: bao nhiêu lần, từ đâu, vào tài khoản nào, khi nào?
cd su-co18/vps01 && jq -r 'select(.MESSAGE | test("^Failed password")) | .MESSAGE' journal/vps01-journal.json | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn | head -n 4
cd su-co18/vps01 && jq -r 'select(.MESSAGE | test("^Failed password.*203\\.0\\.113\\.5[0-2]")) | .MESSAGE' journal/vps01-journal.json | sed -E 's/Failed password for (invalid user )?([a-z]+) .*/\2/' | sort | uniq -c | sort -rn | tr '\n' ' '; echo
cd su-co18/vps01 && jq -r 'select(.MESSAGE | test("203\\.0\\.113\\.5[0-2]")) | .__REALTIME_TIMESTAMP | tonumber / 1e6 | floor | todate' journal/vps01-journal.json | sed -n '1p;$p'
# C6 — Lần vào đầu tiên
cd su-co18/vps01 && jq -r 'select(.MESSAGE | startswith("Accepted")) | [(.__REALTIME_TIMESTAMP | tonumber / 1e6 | floor | todate), .MESSAGE] | @tsv' journal/vps01-journal.json | grep -oE '^\S+|password|publickey|for \S+ from \S+' | paste -d' ' - - - | awk '{print $3, $4, $5, $6, $2}' | sort | uniq -c
cd su-co18/vps01 && jq -r 'select(.MESSAGE | test("^Accepted password")) | [(.__REALTIME_TIMESTAMP | tonumber / 1e6 | floor | todate), .MESSAGE] | @tsv' journal/vps01-journal.json
# C7 — auth.log bị sửa: chứng minh, và khoảng nào mất
cd su-co18/vps01 && grep -c 'Accepted password' var/log/auth.log.1 var/log/auth.log; grep -c 'Invalid user' var/log/auth.log.1; grep -c 'check pass; user unknown' var/log/auth.log.1
cd su-co18/vps01 && jq -r 'select(.SYSLOG_FACILITY == "4" or .SYSLOG_FACILITY == "10") | .MESSAGE' journal/vps01-journal.json | sort > /lab/ra/j.txt && cut -d' ' -f3- var/log/auth.log.1 var/log/auth.log | sed -E 's/^[^:]+: //' | sort > /lab/ra/a.txt && comm -23 /lab/ra/j.txt /lab/ra/a.txt | wc -l && comm -13 /lab/ra/j.txt /lab/ra/a.txt | wc -l
cd su-co18/vps01 && comm -23 /lab/ra/j.txt /lab/ra/a.txt | sed -E 's/[0-9]+/N/g; s/(user|for) (invalid user )?[a-z]+ /\1 X /; s/user=[a-z]+/user=X/' | sort | uniq -c | sort -rn | head -n 9
cd su-co18/vps01 && grep 'CRON.*session opened' var/log/auth.log.1 | tail -n 3 | cut -c1-60; head -n 1 var/log/auth.log | cut -c1-60; grep -A3 'auth.log.1' thu-thap/stat.txt | tail -n 3; grep -E 'Modify|Birth' thu-thap/stat.txt | tail -n 2
cd su-co18/vps01 && grep -E 'New session (4[89]|5[0-9]) ' var/log/auth.log.1 && grep -c 'session opened for user deploy' var/log/auth.log.1 && grep -c 'Accepted .* for deploy' var/log/auth.log.1
# C8 — Leo thang: sudo bị chặn, rồi sao?
cd su-co18/vps01 && grep 'deploy' var/log/auth.log.1 | grep -v CRON | tail -n 2 | cut -c1-150; cat thu-thap/id-deploy.txt
cd su-co18/vps01 && jq -r 'select(.MESSAGE | test("b0a903430d8b") and test("Started|Deactivated")) | (.__REALTIME_TIMESTAMP | tonumber / 1e6 | floor | todate)' journal/vps01-journal.json | tr '\n' ' '; echo; grep -c 'session opened for user deploy' var/log/auth.log
# C9 — Bám trụ
cd su-co18/vps01 && grep 'apt-compat' var/log/syslog.1 | cut -c1-110; sed -n '2,3p;6,$p' thu-thap/cron.d.txt
cd su-co18/vps01 && cat var/log/syslog.1 var/log/syslog | grep -c 'cdn-update.example.net' && cat var/log/syslog.1 var/log/syslog | grep 'cdn-update' | sed -n '1p;$p' | cut -c1-32
# C10 — Webshell
cd su-co18/vps01 && grep 'cache.php' var/log/nginx/access.log | awk '{print $1, $6, $9}' | sort | uniq -c && grep 'cache.php' var/log/nginx/access.log | sed -n '1p;$p' | cut -d' ' -f4
cd su-co18/vps01 && grep -c 'cache.php' var/log/nginx/access.log && grep -B1 -A8 'cache.php$' thu-thap/stat.txt | grep -E 'Uid|Modify|Change|Birth'
cd su-co18/vps01 && grep -oE 'PHP Warning: .* on line [0-9]+' var/log/nginx/error.log
# C11 — CSDL: ai, từ đâu, đọc gì?
cd su-co18/vps01/postgresql/log && grep -h 'connection authorized' *.csv | grep -oE 'user=\S+ database=\S+ application_name=[^"]+' | sort | uniq -c
cd su-co18/vps01/postgresql/log && grep -h -oE '"[0-9.]+:[0-9]+"' *.csv | cut -d: -f1 | sort | uniq -c
cd su-co18/vps01/postgresql/log && grep -h -E '(FATAL|duration: [0-9]{4})' postgresql-Sat.csv | cut -d, -f1,2,5,12,14- | cut -c1-210
cd su-co18/vps01/postgresql/log && grep -h 'duration' *.csv | grep -v psql | cut -d, -f1,2 | head -n 3
# C12 — Dữ liệu đã ra ngoài?
cd su-co18/vps01/var/log/nginx && grep 'kh.csv' access.log | cut -d' ' -f1,4,6,7,9,10
cd su-co18/vps01/var/log/nginx && awk '$1 == "198.51.100.77" {n++; b += $10} END {print n, "request,", b, "byte"}' access.log
# C13 — Ứng dụng tour-api có bị khai thác không?
cd su-co18/vps01 && jq -r '.log | fromjson | .level' var/lib/docker/containers/*/*-json.log | sort | uniq -c && jq -r '.log | fromjson | select(.level >= 40) | .msg' var/lib/docker/containers/*/*-json.log | sort | uniq -c
cd su-co18/vps01 && jq -r '.log | fromjson | select(.level == 40 and .msg == "request completed") | .res.statusCode' var/lib/docker/containers/*/*-json.log | sort | uniq -c; awk '$9 >= 500' var/log/nginx/access.log | wc -l
# C14 — nguồn nào lẽ ra phải có?
cd su-co18/vps01 && ls var/log/ && head -n 1 var/lib/docker/containers/*/*-json.log | jq -r .time && head -n 1 var/log/nginx/access.log | cut -d' ' -f4
