#!/bin/bash
# do-tai.sh TEN PORT PID [N] — bắn N (mặc định 2.000) kết nối × 10 tin/giây trong 3 giây vào PORT; in luồng/fd/RSS của PID giữa chừng,
# CPU PID đã tiêu trong lượt đo, và độ trễ vòng p50/p99/max mà máy tạo tải thấy.
n=$1 port=$2 pid=$3 conns=${4:-2000}
c0=$(awk '{print $14+$15}' /proc/$pid/stat)
./tai "$port" "$conns" 3 100 > t.log & T=$!
sleep 2.5
s=$(./xem.sh "$pid" | sed 's/.*threads/threads/; s/ cpu=.*//')
wait $T
c1=$(awk '{print $14+$15}' /proc/$pid/stat)
printf '%-9s %s cpu=%.2fs | %s\n' "$n" "$s" "$(echo "($c1-$c0)/$(getconf CLK_TCK)" | bc -l)" "$(grep -o 'p50.*' t.log)"
