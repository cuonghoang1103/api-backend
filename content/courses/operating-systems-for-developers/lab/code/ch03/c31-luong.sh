gcc -Wall -O2 -pthread luong.c -o luong
./luong > luong.txt & PID=$!; sleep 0.5; cat luong.txt
ps -L -o pid,lwp,nlwp,stat,comm -p $PID
ls /proc/$PID/task
cat /proc/$PID/task/*/comm
T=$(ls /proc/$PID/task | sed -n 2p); grep -E '^(Name|Tgid|Pid|Threads)' /proc/$PID/task/$T/status
readlink /proc/$PID/task/*/fd/1 | sort | uniq -c
wait $PID; tail -1 luong.txt
ulimit -s
gcc -O2 -pthread many.c -o many
for n in 1 100 1000; do ./many $n; done
cat /proc/sys/kernel/threads-max /sys/fs/cgroup/pids.max
node -e 'setTimeout(()=>{},3000)' & sleep 0.5; grep Threads /proc/$!/status; cat /proc/$!/task/*/comm | sort | uniq -c
@ wait
javac -d . Vt.java
java Vt platform 10000
java Vt virtual 10000
