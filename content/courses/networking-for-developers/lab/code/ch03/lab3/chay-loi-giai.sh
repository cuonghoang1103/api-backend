#!/bin/bash
# Lab 3 — chạy lại toàn bộ LỜI GIẢI trên một lab DNS SẠCH (thư mục lab/). Khoá DNSSEC sinh mới khi dựng lại.
set -e
I="docker compose -f moi-truong/internet.yml -f moi-truong/dns.yml -p nfi"
$I down -v >/dev/null 2>&1 || true; docker rm -f nfi-ubuntu >/dev/null 2>&1 || true; $I up -d >/dev/null 2>&1; sleep 25
./chay.sh nfi-laptop ch03/lab3/r1-trace.sh lab3-r1
./chay.sh nfi-ns ch03/lab3/r2-ns.sh lab3-r2-ns; sleep 3
./chay.sh nfi-laptop ch03/lab3/r2-hoi.sh lab3-r2-hoi
# R3: dòng thời gian ~3 phút (hạ TTL → chờ 125 s → đổi IP)
docker exec nfi-isp unbound-control flush_zone labflow.test >/dev/null
docker exec -d nfi-laptop bash -c 'cd /lab/k/code/ch03/lab3 && bash r3-theo.sh'; sleep 2
./chay.sh nfi-ns ch03/lab3/r3-ha.sh lab3-r3-ha; sleep 125
./chay.sh nfi-ns ch03/lab3/r3-doi.sh lab3-r3-doi; sleep 45
./chay.sh nfi-laptop ch03/lab3/r3-doc.sh lab3-r3
# R4: sự cố A (ủy quyền gõ sai ns3)
docker exec nfi-tld bash /lab/k/code/ch03/lab3/su-co-a.sh; sleep 2
./chay.sh nfi-isp ch03/lab3/r4-trieu-chung.sh lab3-r4-isp
./chay.sh nfi-laptop ch03/lab3/r4-laptop.sh lab3-r4-laptop
./chay.sh nfi-tld ch03/lab3/r4-tld-sua.sh lab3-r4-tld; sleep 2
./chay.sh nfi-isp ch03/lab3/r4-isp.sh lab3-r4-flush
./chay.sh nfi-laptop ch03/lab3/r4-ok.sh lab3-r4-ok
# R5: sự cố B (đổi KSK mà không gửi DS)
docker exec nfi-ns bash /lab/k/code/ch03/lab3/su-co-b.sh; sleep 3
docker exec nfi-isp unbound-control flush_zone labflow.test >/dev/null
./chay.sh nfi-laptop ch03/lab3/r5-laptop.sh lab3-r5-laptop
./chay.sh nfi-tld ch03/lab3/r5-tld-sua.sh lab3-r5-tld; sleep 2
./chay.sh nfi-laptop ch03/lab3/r5-laptop-sau.sh lab3-r5-sau
./chay.sh nfi-isp ch03/lab3/r5-isp.sh lab3-r5-flush
./chay.sh nfi-laptop ch03/lab3/r5-ok.sh lab3-r5-ok
