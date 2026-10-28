@ node server.js > /tmp/server.log 2>&1 &
@ sleep 1
PID=$(pgrep -f "node server.js"); echo $PID
ps -o pid,ppid,stat,nlwp,rss,vsz,etime,cmd -p $PID
grep -E '^(Name|State|Pid|PPid|Uid|Threads|VmRSS|VmSize|voluntary|nonvoluntary)' /proc/$PID/status
tr '\0' ' ' < /proc/$PID/cmdline; echo
readlink /proc/$PID/cwd /proc/$PID/exe
ls -l /proc/$PID/fd | awk '{print $9, $10, $11}'
ls /proc/$PID/task | head; ls /proc/$PID/task | wc -l
grep -E 'heap|stack|node$' /proc/$PID/maps | head -6
grep -E 'Max open files|Max processes' /proc/$PID/limits
cat /proc/$PID/stat | cut -d' ' -f1-5,14-15,20
