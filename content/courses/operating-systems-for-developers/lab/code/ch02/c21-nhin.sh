# @ docker run --rm --label oslab=1 --name os-c21b --hostname oslab --cpus 1 --memory 512m -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien c21-nhin.sh 2>&1"
nproc
cat /sys/fs/cgroup/cpu.max
free -m | head -2
cat /sys/fs/cgroup/memory.max
cat /proc/loadavg
ps -e --no-headers | wc -l
