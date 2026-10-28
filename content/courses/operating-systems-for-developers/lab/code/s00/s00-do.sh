gcc -O2 -Wall cache.c -o cache
./cache
/usr/bin/time -v python3 -c "x = [0] * 50_000_000" 2>&1 | grep -E "Elapsed|Maximum resident|page faults|context switches"
strace -c -f ls /etc > /dev/null 2> strace.txt; head -12 strace.txt; tail -2 strace.txt
