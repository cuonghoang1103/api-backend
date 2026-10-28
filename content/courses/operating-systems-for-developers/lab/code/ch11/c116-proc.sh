# @ Chương 11 · bài 11.6 — /proc và /sys là một API của nhân: ps/free/uptime/sysctl chỉ đọc file; trạng thái một tiến trình
# @ đang chặn (wchan, syscall), bộ đếm syscall có sẵn (/proc/PID/io), giới hạn cgroup mà JVM/Node tự đọc.
# @ Container có giới hạn như một VPS nhỏ:
# @ docker run --rm --label oslab=1 --name os-c116 --hostname oslab --memory 512m --cpus 1.5 -v "$PWD/ch11":/lab/ch11 -w /lab/ch11 os-lab bash -c "phien c116-proc.sh 2>&1"
strace -qq -c -o ps.sc ps aux > /dev/null; grep -E ' (openat|read|close|total)$' ps.sc
strace -qq -y -e trace=openat,read -o ps.txt ps aux > /dev/null; grep -c '</proc/' ps.txt; grep -m3 '</proc/1/' ps.txt | cut -c1-100
strace -qq -e trace=openat -o free.txt free -m > /dev/null; grep proc free.txt
strace -qq -e trace=openat -o up.txt uptime > /dev/null; grep proc up.txt
strace -qq -e trace=openat,read,write -o sysctl.txt sysctl vm.swappiness; grep -E 'swappiness' sysctl.txt
sysctl -w vm.swappiness=10
grep -E ' /(proc|sys) ' /proc/mounts
sleep 300 & S=$!; sleep 0.3
grep -E '^State' /proc/$S/status; cat /proc/$S/wchan; echo
cat /proc/$S/syscall
cat /proc/$S/stack
kill $S
python3 hang.py > /dev/null & APP=$!; sleep 1
cat /proc/$APP/wchan; echo; cut -d' ' -f1-4 /proc/$APP/syscall
ls -l /proc/$APP/fd/3 | awk '{print $NF}'; grep -E '^ *[0-9]+: .* 02 ' /proc/net/tcp | head -2
kill $APP
node server.js & NODE=$!; sleep 1
grep -E '^sysc' /proc/$NODE/io
curl -s -o /dev/null "http://127.0.0.1:3000/[1-1000]"
grep -E '^sysc' /proc/$NODE/io
kill $NODE
cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/cpu.max /sys/fs/cgroup/pids.max
java -XshowSettings:system -version 2>&1 | grep -E 'Effective CPU|Memory Limit'
strace -f -qq -e trace=openat -o jvm.txt java -version 2> /dev/null; grep -oE '/sys/fs/cgroup/[a-z._]+|/proc/self/(cgroup|mountinfo)' jvm.txt | sort -u
node -e 'console.log(require("os").availableParallelism(), process.constrainedMemory())'
strace -f -qq -e trace=openat -o nd.txt node -e 'process.constrainedMemory()'; grep -oE '/sys/fs/cgroup/+[a-z._]+|/proc/self/cgroup' nd.txt | sort -u
cat /sys/class/net/eth0/statistics/rx_bytes /sys/devices/system/cpu/online /sys/kernel/mm/transparent_hugepage/enabled
