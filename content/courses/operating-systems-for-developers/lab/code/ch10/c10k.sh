#!/bin/bash
# c10k.sh SERVER N MS — chạy MỘT máy chủ MỚI (echo-epoll | echo-thread), bắn N kết nối, mỗi kết nối 64 byte mỗi MS ms
# trong 4 giây; giữa chừng (giây thứ 3) chụp số luồng/fd/RSS/CPU/chuyển ngữ cảnh của máy chủ và KernelStack của máy.
srv=$1 n=$2 every=$3
./$srv 7000 > /dev/null & S=$!
sleep 0.3
ks0=$(awk '/KernelStack/{print $2}' /proc/meminfo)
./tai 7000 "$n" 4 "$every" > tai.log & T=$!
sleep 3
echo "[$srv] $(./xem.sh $S | cut -d: -f2-)"
echo "[$srv] kernel stacks: +$(( ($(awk '/KernelStack/{print $2}' /proc/meminfo) - ks0) / 1024 )) MiB"
wait $T
sed "s/^/[$srv] /" tai.log
kill $S; wait $S 2>/dev/null
