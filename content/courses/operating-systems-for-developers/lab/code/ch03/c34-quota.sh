gcc -O2 -pthread crowd.c -o crowd && gcc -O2 -pthread lat.c -o lat
cat /sys/fs/cgroup/cpu.max
bash cores.sh
cat /sys/fs/cgroup/cpu.stat | grep -E 'nr_periods|nr_throttled|throttled_usec'
time ./crowd 4 cpu
cat /sys/fs/cgroup/cpu.stat | grep -E 'nr_periods|nr_throttled|throttled_usec'
./lat 0
./lat 3
