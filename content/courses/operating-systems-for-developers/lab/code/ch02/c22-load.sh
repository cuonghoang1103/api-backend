# @ docker run --rm --label oslab=1 --name os-c22l --hostname oslab --cpuset-cpus 0,1 -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien c22-load.sh 2>&1"
nproc
cat /proc/loadavg
for i in 1 2 3 4 5 6; do node -e 'for(;;){}' & done; sleep 65
uptime
cat /proc/loadavg
mpstat -P 0,1 1 1 | grep -v Average
top -b -n 1 -w 100 | head -14
ps -o pid,psr,stat,%cpu,comm -C node
@ pkill node
