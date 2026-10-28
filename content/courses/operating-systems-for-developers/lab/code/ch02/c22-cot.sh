# @ docker run --rm --label oslab=1 --name os-c22c --hostname oslab -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien c22-cot.sh 2>&1"
@ cd /tmp
dd if=/dev/zero of=/dev/null bs=1 count=30000000 2>/dev/null &
nice -n 19 node -e 'for(;;){}' &
node -e 'for(;;){}' &
sleep 2; top -b -n 1 -w 100 | head -11
vmstat 1 3
mpstat -P ALL 1 1 | grep -v Average | awk 'NR<4 || $NF < 90'
@ kill %1 %2 %3 2>/dev/null; wait 2>/dev/null
sleep 300 &
sleep 301 & sleep 0.2; kill -STOP $!
nice -n 10 node -e 'for(;;){}' &
python3 -c 'import os, time; os.fork() or os._exit(0); time.sleep(300)' &
sleep 1; ps -eo pid,ppid,stat,ni,%cpu,rss,vsz,etime,comm
ps -eo pid,comm,%cpu,%mem,rss --sort=-rss | head -4
@ kill -9 $(jobs -p) 2>/dev/null
