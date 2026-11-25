# 10.1 — Mã trạng thái trong log thật của Lab 10 (nginx 1.27 + Node 22). cwd = thư mục lab, log ở ./logs
awk '{print $9}' logs/access.log | sort | uniq -c | sort -k2n
grep -m1 '" 400 ' logs/access.log
grep -m1 '" 401 ' logs/access.log
grep -m1 '" 403 ' logs/access.log
grep -m1 '" 413 ' logs/access.log
grep -m1 '" 429 ' logs/access.log
grep -m1 '" 499 ' logs/access.log
grep -m1 '" 500 ' logs/access.log
grep -m1 '" 502 ' logs/access.log
grep -m1 '" 504 ' logs/access.log
grep -m1 'upstream timed out' logs/error.log
grep -m1 'connect() failed' logs/error.log
grep -m1 'limiting requests' logs/error.log
grep -m1 'too large body' logs/error.log
grep -m1 'access forbidden' logs/error.log
awk '$9 == 404 {split($NF, a, "="); print ($(NF-1) == "urt=-" ? "nginx tu tra" : "app tra"), $7}' logs/access.log
