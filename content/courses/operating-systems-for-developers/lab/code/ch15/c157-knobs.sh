# @ Chương 15 · bài 15.7 — núm chỉnh và khi nào KHÔNG đụng: sysctl net (somaxconn) đo trước/sau, ulimit -n đo trước/sau,
# @ các núm vm.* (chỉ đọc: chung cả máy ảo), CPU governor và NUMA (máy ảo không có).
# @ docker run --rm --label oslab=1 --hostname oslab --privileged -v "$PWD/ch15":/lab/ch15 -w /lab/ch15 os-lab \
# @   bash -c "phien c157-knobs.sh 2>&1" > out/c157-knobs.out.txt
# @ --privileged để sysctl -w được net.* — các núm net.* có NAMESPACE (chỉ đổi trong netns của container vứt đi này);
# @ vm.*, kernel.* là của CẢ máy ảo Docker Desktop (dùng chung với container của người khác) ⇒ chỉ đọc, không ghi.
@ cd /tmp && cp /lab/ch15/*.py /lab/ch15/*.js .
sysctl -a 2>/dev/null | wc -l
sysctl net.core.somaxconn net.ipv4.tcp_max_syn_backlog net.ipv4.tcp_syncookies net.ipv4.ip_local_port_range
sysctl -w net.core.somaxconn=128
python3 slowaccept.py 9000 1024 & A=$!; sleep 0.3; ss -lnt 'sport = :9000'
nstat -n; python3 burst.py 9000 600; nstat -z TcpExtListenOverflows TcpExtListenDrops | tail -2
@ wait $A
sysctl -w net.core.somaxconn=4096
python3 slowaccept.py 9001 1024 & A=$!; sleep 0.3; ss -lnt 'sport = :9001'
nstat -n; python3 burst.py 9001 600; nstat -z TcpExtListenOverflows TcpExtListenDrops | tail -2
@ wait $A
(ulimit -n 1024; exec node hold.js 9100) & H=$!; sleep 0.5; python3 burst.py 9100 2000 4; ss -lnt 'sport = :9100'
@ wait $H
(ulimit -n 65536; exec node hold.js 9101) & H=$!; sleep 0.5; python3 burst.py 9101 2000 4
@ wait $H
sysctl vm.swappiness vm.overcommit_memory vm.dirty_ratio vm.dirty_background_ratio vm.max_map_count fs.file-max
cat /sys/kernel/mm/transparent_hugepage/enabled
ls /sys/devices/system/cpu/cpu0/cpufreq 2>&1; ls /sys/devices/system/cpu/cpu0/ | head -8 | tr '\n' ' '; echo
lscpu | grep -E 'NUMA|^CPU\(s\)'; ls /sys/devices/system/node/
