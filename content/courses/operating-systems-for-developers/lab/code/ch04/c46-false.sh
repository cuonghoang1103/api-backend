gcc -O2 -Wall -pthread fs.c -o fs
getconf LEVEL1_DCACHE_LINESIZE
for g in 8 64 128 256; do ./best3.sh taskset -c 0 ./fs 1 $g; done
for g in 8 64 128 256; do ./best3.sh taskset -c 0-3 ./fs 4 $g; done
for g in 8 64 128 256; do ./best3.sh taskset -c 0-7 ./fs 8 $g; done
./best3.sh taskset -c 0-7 ./fs 8 local
perf stat -e task-clock,context-switches taskset -c 0-3 ./fs 4 8 2>&1 | grep -E 'threads=|task-clock|context|seconds user'
perf stat -e task-clock,context-switches taskset -c 0-3 ./fs 4 128 2>&1 | grep -E 'threads=|task-clock|context|seconds user'
taskset -c 0-3 java giai/FalseShare.java
@ rm -f fs
