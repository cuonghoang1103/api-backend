#!/usr/bin/env bash
# Chấm đề thi thực hành Bài 11.2 (CT Cinema). Chạy từ _demo/:   ./pe11/cham.sh pe11/<thư-mục-bài-làm>
# Mỗi câu chấm trên dữ liệu NẠP LẠI từ đầu (câu này không làm hỏng câu kia). Cần mgo-lab đang chạy (Bài 0.2).
set -uo pipefail
BAI=/demo/${1%/}
nap() { docker exec mgo-lab mongosh --quiet /demo/pe11/nap.js >/dev/null; }
cham() { docker exec mgo-lab mongosh --quiet pe11 --eval "var BAI='$BAI', CAU='$1'" /demo/pe11/cham.js; }
{
  for c in q1 q2 q3 q4 q5 q6; do
    nap; cham $c
    if [ $c = q5 ]; then
      T0=$(( $(date +%s%3N) + 3000 ))
      for p in 1 2 3 4; do docker exec mgo-lab mongosh --quiet pe11 --eval "var BAI='$BAI', P=$p, T0=$T0" /demo/pe11/dong.js & done; wait
      cham q5kiem
    fi
  done
} | tee /tmp/mgo-pe11-cham.txt | grep -v '^DIEM '
awk '/^DIEM /{s+=$2} END{printf "TỔNG: %.2f/10 — %s\n", s, (s>=5 ? "ĐẠT" : "CHƯA ĐẠT")}' /tmp/mgo-pe11-cham.txt
rm -f /tmp/mgo-pe11-cham.txt
