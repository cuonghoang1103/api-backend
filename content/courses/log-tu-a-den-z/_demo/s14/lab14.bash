# Lab 14 — LỜI GIẢI (che trong bài): vụ api02 (log sinh bởi tao-vu.py) + hai máy Windows trong mẫu EVTX công khai.
cat lab14/DE-BAI.txt
cd lab14/api02/var/log && grep -E 'CRON\[[0-9]+\]: \((www-data)\)' syslog | sed -n '1p;$p'; grep -c 'kthreadd' syslog
cd lab14/api02/var/log && grep -E 'crontab\[' syslog
cd lab14/api02/var/log && awk '$1 == "192.0.2.66" {print substr($4, 2, 17)}' nginx/access.log | uniq -c | awk '{print $2, $1}' | head -n 3; awk '$1 == "192.0.2.66"' nginx/access.log | wc -l
cd lab14/api02/var/log && awk '$1 == "192.0.2.66" && $4 < "[21/Nov/2026:22:17" {print $9}' nginx/access.log | sort | uniq -c | sort -rn; awk '$1 == "192.0.2.66" && $9 != 404 && $4 < "[21/Nov/2026:22:17" {print $9, $7}' nginx/access.log
cd lab14/api02/var/log && grep -o '"Fuzz Faster U Fool[^"]*"' nginx/access.log | sort | uniq -c
cd lab14/api02/var/log && grep '"POST /admin/login' nginx/access.log | awk '{print $1, $9}' | sort | uniq -c
cd lab14/api02/var/log && grep '192.0.2.66.*"POST /admin/login[^"]*" 200' nginx/access.log | cut -c1-80; grep -c '192.0.2.66.*"POST /admin/login[^"]*" 401' nginx/access.log
cd lab14/api02/var/log && grep -E '192\.0\.2\.66.*"(GET|POST) /admin/media' nginx/access.log | cut -d'"' -f1,2 | cut -c15-; grep 'tai-len' nginx/error.log | cut -c1-120
cd lab14/api02/var/log && grep -oE '"GET /uploads/2026/11/logo-moi\.php\?cmd=[^ ]+ HTTP/1\.1" [0-9]+ [0-9]+' nginx/access.log | sed -E 's/"GET [^=]+=//; s/ HTTP\/1\.1"//' | python3 -c "import sys, urllib.parse as u; [print(u.unquote(l.rstrip())) for l in sys.stdin]"
cd lab14/api02/var/log && grep 'sudo' auth.log
cd lab14/api02/var/log && grep -c 'COMMAND=' auth.log; grep -c 'Accepted' auth.log; awk '/192\.0\.2\.66/ && /logo-moi/ {print substr($4, 2), $9}' nginx/access.log | tail -n 2
cd lab14/api02/var/log && grep 'logo-moi' nginx/error.log | cut -c1-130
evtx-rec tc/user-4720.evtx tc/admin-4732.evtx tc/apt-4720-4698.evtx | jq -r '[.t[0:19], .may, .id, (.data.TargetUserName // .data.TaskName), .data.SubjectUserName] | @tsv' | sort -u
evtx-rec tc/apt-4720-4698.evtx | jq -r 'select(.id == 4698) | .data.TaskContent' | grep -oE '<(Date|Author|Command|Hidden|StartBoundary)>[^<]*'
