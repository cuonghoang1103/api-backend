#!/bin/bash
# Lab 2 — chạy lại toàn bộ LỜI GIẢI trên một lab "Internet trong một hộp" SẠCH (gọi từ code/dung-output-ch2.sh; thư mục lab/).
set -e
I="docker compose -f moi-truong/internet.yml -p nfi"
$I down >/dev/null 2>&1 || true; $I up -d >/dev/null 2>&1; sleep 15
./chay.sh nfi-laptop ch02/lab2/r1-ke-hoach.sh lab2-r1
./chay.sh nfi-laptop ch02/lab2/r2-laptop.sh lab2-r2-laptop; ./chay.sh nfi-mobile ch02/lab2/r2-mobile.sh lab2-r2-mobile; ./chay.sh nfi-isp ch02/lab2/r2-isp.sh lab2-r2-isp
docker exec nfi-homegw conntrack -F >/dev/null 2>&1 || true
./chay.sh nfi-laptop ch02/lab2/r3-laptop.sh lab2-r3-laptop; ./chay.sh nfi-phone ch02/lab2/r3-phone.sh lab2-r3-phone; ./chay.sh nfi-mobile ch02/lab2/r3-mobile.sh lab2-r3-mobile
./chay.sh nfi-homegw ch02/lab2/r3-homegw.sh lab2-r3-homegw
docker exec -d nfi-laptop sh -c 'cd /tmp && echo "LabFlow demo build (laptop 192.168.50.10:8080)" > index.html && exec python3 -m http.server 8080 >/dev/null 2>&1'; sleep 1
./chay.sh nfi-homegw ch02/lab2/r4-homegw.sh lab2-r4-homegw; ./chay.sh nfi-server ch02/lab2/r4-server.sh lab2-r4-server
docker exec nfi-laptop pkill -f http.server || true
docker exec nfi-dc bash /lab/k/code/ch02/lab2/su-co-a.sh >/dev/null
./chay.sh nfi-laptop ch02/lab2/r5-laptop.sh lab2-r5-laptop; ./chay.sh nfi-dc ch02/lab2/r5-dc.sh lab2-r5-dc; ./chay.sh nfi-laptop ch02/lab2/r5-laptop-ok.sh lab2-r5-ok
docker exec nfi-rogue bash /lab/k/code/ch02/lab2/su-co-b.sh >/dev/null; sleep 3
./chay.sh nfi-laptop ch02/lab2/r6-laptop.sh lab2-r6-laptop; ./chay.sh nfi-isp ch02/lab2/r6-isp.sh lab2-r6-isp; ./chay.sh nfi-laptop ch02/lab2/r6-laptop-ok.sh lab2-r6-ok
