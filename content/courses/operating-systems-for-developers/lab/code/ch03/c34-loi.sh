gcc -O2 -pthread crowd.c -o crowd && gcc -O2 hog.c -o hog
nproc; taskset -p $$
lscpu | grep -E '^(CPU\(s\)|On-line|Core|Thread|NUMA)'
taskset -c 0 nproc
taskset -c 0 ./crowd 4 cpu
taskset -c 0-3 ./crowd 4 cpu
./crowd 4 cpu
./hog x > /dev/null & sleep 2; for i in 1 2 3 4 5; do ps -o psr= -p $!; sleep 0.5; done | tr '\n' ' '; echo; kill $!; wait
taskset -c 5 ./hog y > /dev/null & sleep 1; ps -o pid,psr,comm -p $!; taskset -p $!; taskset -p -c 7 $! > /dev/null; sleep 0.5; ps -o pid,psr,comm -p $!; kill $!; wait
perf stat -e cpu-migrations,context-switches ./crowd 64 cpu 2>&1 | grep -E 'threads=|migrations|context'
perf stat -e cpu-migrations,context-switches taskset -c 0-3 ./crowd 64 cpu 2>&1 | grep -E 'threads=|migrations|context'
