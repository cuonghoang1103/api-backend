#!/bin/bash
# traffic.sh — người dùng giả: bốn vòng lặp ĐỘC LẬP bắn request vào năm dịch vụ (chạy trong container "traffic").
# Độc lập là có chủ đích: một dịch vụ treo không được làm chậm tải lên các dịch vụ khác (như người dùng thật).
shop()    { while true; do for i in 1 2 3 4; do curl -s -o /dev/null -m 2 "http://shop-api:3000/product?id=$((RANDOM % 50))&t=$RANDOM$RANDOM" & done; wait; sleep 0.02; done; }
report()  { while true; do curl -s -o /dev/null -m 2 "http://report:3001/report"; sleep 0.1; done; }
billing() { while true; do for i in 1 2 3 4; do a=$((RANDOM % 4)); b=$(( (a + 1 + RANDOM % 3) % 4 )); curl -s -o /dev/null -m 3 "http://billing:3003/transfer?from=$a&to=$b" & done; wait; done; }
audit()   { while true; do curl -s -o /dev/null -m 5 "http://audit:3004/event?id=$RANDOM"; sleep 0.05; done; }
shop & report & billing & audit & wait
