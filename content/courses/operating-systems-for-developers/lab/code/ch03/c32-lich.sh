gcc -O2 hog.c -o hog && gcc -O2 wakeup.c -o wakeup
# Two CPU hogs on 10 idle cores: nice changes nothing ||| Hai việc đốt CPU trên 10 lõi rảnh: nice chẳng đổi gì
./hog nice0 & ./hog nice5-free & sleep 0.1; renice -n 5 -p $! > /dev/null; sleep 4; kill $(jobs -p); wait
# Now force both onto ONE core (CPU 0) ||| Giờ ép cả hai lên MỘT lõi (CPU 0)
taskset -c 0 ./hog nice0 & taskset -c 0 nice -n 5 ./hog nice5 & sleep 4; kill $(jobs -p); wait
taskset -c 0 ./hog nice0 & taskset -c 0 nice -n 19 ./hog nice19 & sleep 4; kill $(jobs -p); wait
taskset -c 0 nice -n 5 ./hog w & sleep 0.3; grep -E 'load.weight|^prio|se.slice|^policy' /proc/$!/sched; chrt -p $!; kill $!; wait
# Interactive task (sleep 1 ms, wake, repeat) sharing CPU 0 with CPU hogs ||| Việc tương tác (ngủ 1 ms, thức, lặp) chung CPU 0 với việc đốt CPU
taskset -c 0 ./wakeup "alone on CPU 0"
for i in 1 2 3; do taskset -c 0 ./hog bg > /dev/null & done; sleep 0.3; taskset -c 0 ./wakeup "+3 hogs (nice 0)"; kill $(jobs -p); wait
for i in 1 2 3; do taskset -c 0 nice -n 19 ./hog bg > /dev/null & done; sleep 0.3; taskset -c 0 ./wakeup "+3 hogs (nice 19)"; kill $(jobs -p); wait
for i in 1 2 3; do taskset -c 0 ./hog bg > /dev/null & done; sleep 0.3; taskset -c 0 chrt -f 10 ./wakeup "+3 hogs, me SCHED_FIFO"; kill $(jobs -p); wait
