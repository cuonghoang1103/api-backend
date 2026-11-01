# Lab 3 · R4 (sự cố A) — trên resolver nhà mạng: mỗi vòng quên cache + quên hiểu biết về máy chủ, rồi hỏi một lần
for i in 1 2 3 4 5 6; do unbound-control flush_zone labflow.test >/dev/null; unbound-control flush_infra all >/dev/null; dig @198.51.100.1 api.labflow.test | grep -E 'status|Query time' | tr '\n' ' '; echo; done
