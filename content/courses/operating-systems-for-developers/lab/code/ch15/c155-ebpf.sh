# @ Chương 15 · bài 15.5 — eBPF: bpftrace một dòng + công cụ kiểu BCC (libbpf-tools 0.35): execsnoop, opensnoop, biolatency,
# @ runqlat, tcplife. --privileged (nạp chương trình BPF), nhân VM Docker Desktop 7.0 có BTF.
# @ docker run --rm --label oslab=1 --hostname oslab --privileged -v "$PWD/ch15":/lab/ch15 -v <c15>/debs:/debs:ro \
# @   -w /lab/ch15 os-lab bash -c "phien c155-ebpf.sh 2>&1" > out/c155-ebpf.out.txt
# @ eBPF nhìn thấy CẢ máy ảo (mọi container khác đang chạy trên Mac này): mọi lệnh dưới đây đều LỌC về container của mình
# @ (cgroup == cgroupid("/sys/fs/cgroup"), -c /sys/fs/cgroup, -n tên, -L cổng) để không đọc tiến trình của người khác.
@ dpkg -i /debs/*.deb > /dev/null 2>&1; mount -t tracefs nodev /sys/kernel/tracing 2>/dev/null
@ cd /tmp && cp /lab/ch15/*.c /lab/ch15/*.js /lab/ch15/*.sh . && gcc -O2 cfgload.c -o cfgload
bpftrace --version; ls -l /sys/kernel/btf/vmlinux | awk '{print $5, $9}'
FIX=1 node orders.js 8080 > /dev/null & N=$!; sleep 0.5
hey -z 4s -c 2 http://127.0.0.1:8080/report > /dev/null & H=$!; sleep 0.5
bpftrace -q -e 'tracepoint:raw_syscalls:sys_enter /cgroup == cgroupid("/sys/fs/cgroup")/ { @[comm] = count(); } interval:s:2 { exit(); }'
bpftrace -q -e 'tracepoint:syscalls:sys_exit_read /comm == "node" && cgroup == cgroupid("/sys/fs/cgroup")/ { @bytes = hist(args.ret); } interval:s:2 { exit(); }'
@ wait $H
./healthcheck.sh & HC=$!; sleep 1
top -bn1 -w 100 | sed -n '7,12p'
execsnoop-libbpf -c /sys/fs/cgroup > exec.txt & E=$!; sleep 2; kill -INT $E; wait $E
head -8 exec.txt; echo "...$(( $(wc -l < exec.txt) - 1 )) processes started in 2 s"
awk 'NR > 1 {print $1}' exec.txt | sort | uniq -c | sort -rn
@ kill $HC; wait $HC 2>/dev/null
./cfgload
opensnoop-libbpf -x -n cfgload > open.txt & O=$!; sleep 1; ./cfgload > /dev/null; kill -INT $O; wait $O; cat open.txt
biolatency-libbpf -c /sys/fs/cgroup 3 1 > bio.txt 2>&1 & B=$!; sleep 0.5; dd if=/dev/zero of=/var/tmp/sync.bin bs=4k count=1500 oflag=dsync 2>&1 | tail -1; wait $B; cat bio.txt
bpftrace -q -e 'tracepoint:block:block_rq_issue /cgroup == cgroupid("/sys/fs/cgroup")/ { @start[args.dev, args.sector] = nsecs; } tracepoint:block:block_rq_complete /@start[args.dev, args.sector]/ { @usecs = hist((nsecs - @start[args.dev, args.sector]) / 1000); @start[args.dev, args.sector] = 0; } interval:s:3 { clear(@start); exit(); }' & BT=$!; sleep 0.5; dd if=/dev/zero of=/var/tmp/sync.bin bs=4k count=1500 oflag=dsync 2>&1 | tail -1; wait $BT
bpftrace -q -e 'kprobe:vfs_fsync_range /cgroup == cgroupid("/sys/fs/cgroup")/ { @s[tid] = nsecs; } kretprobe:vfs_fsync_range /@s[tid]/ { @fsync_us = hist((nsecs - @s[tid]) / 1000); @s[tid] = 0; } interval:s:3 { clear(@s); exit(); }' & BT=$!; sleep 0.5; dd if=/dev/zero of=/var/tmp/sync.bin bs=4k count=1000 oflag=dsync 2>&1 | tail -1; wait $BT
@ rm -f /var/tmp/sync.bin
taskset -c 0,1 stress-ng --cpu 2 --timeout 4 -q & S=$!; sleep 0.5; runqlat-libbpf -m -c /sys/fs/cgroup 3 1 | grep -v ' 0 *|'; wait $S
taskset -c 0,1 stress-ng --cpu 8 --timeout 4 -q & S=$!; sleep 0.5; runqlat-libbpf -m -c /sys/fs/cgroup 3 1 | grep -v ' 0 *|'; wait $S
tcplife-libbpf -L 8080 > life1.txt & T=$!; sleep 1; hey -n 200 -c 4 -disable-keepalive http://127.0.0.1:8080/report | grep -E 'Requests/sec|Average'; sleep 0.5; kill -INT $T; wait $T
head -4 life1.txt; echo "... $(( $(wc -l < life1.txt) - 1 )) connections"
tcplife-libbpf -L 8080 > life2.txt & T=$!; sleep 1; hey -n 200 -c 4 http://127.0.0.1:8080/report | grep -E 'Requests/sec|Average'; sleep 0.5; kill $N; sleep 0.5; kill -INT $T; wait $T
cat life2.txt
@ wait $N 2>/dev/null
