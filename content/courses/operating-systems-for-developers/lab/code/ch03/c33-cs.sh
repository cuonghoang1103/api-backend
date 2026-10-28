gcc -O2 pingpong.c -o pingpong && gcc -O2 -pthread crowd.c -o crowd && gcc -O2 hog.c -o hog
vmstat 1 3
./pingpong 4000000 > /dev/null & sleep 0.5; vmstat 1 3; kill $!; wait
taskset -c 0 ./pingpong 200000
taskset -c 0,1 ./pingpong 200000
perf stat -e context-switches,cpu-migrations,task-clock taskset -c 0 ./pingpong 100000 2>&1 | grep -E 'round|context|migrations|task-clock|elapsed'
taskset -c 0 ./hog A > /dev/null & taskset -c 0 ./hog B > /dev/null & sleep 3; grep ctxt /proc/$!/status; kill $(jobs -p); wait
sleep 2 & S=$!; ./pingpong 1 > /dev/null; grep ctxt /proc/$S/status; wait
taskset -c 0 ./pingpong 3000000 > /dev/null & sleep 0.5; pidstat -w -p $! 1 2 | sed -n '3,$p'; kill $!; wait
# Same total work split over more and more threads, on 4 cores ||| Cùng một khối việc chia cho càng lúc càng nhiều luồng, trên 4 lõi
for t in 1 4 64 512; do taskset -c 0-3 ./crowd $t cpu; done
for t in 1 4 64; do perf stat -e context-switches,task-clock taskset -c 0-3 ./crowd $t lock 2>&1 | grep -E 'threads=|context|task-clock'; done
