# @ Chương 11 · bài 11.6 — XEM TRƯỚC eBPF (Chương 15 đi sâu). bpftrace KHÔNG có trong ảnh os-lab: cài vào container vứt đi
# @ --privileged: gói bpftrace 0.25.0 của Ubuntu 26.04 (+3 thư viện) tải bằng "apt-get install --download-only" rồi gắn vào
# @ /debs và dpkg -i. Nhân VM Docker Desktop có BTF + kprobe + tracepoint (CONFIG_BPF_SYSCALL, CONFIG_DEBUG_INFO_BTF).
# @ docker run --rm --label oslab=1 --name os-c116b --hostname oslab --privileged -v "$PWD/ch11":/lab/ch11 -v <debs>:/debs:ro \
# @   -w /lab/ch11 os-lab bash -c "phien c116-bpf.sh 2>&1"
@ dpkg -i /debs/*.deb > /dev/null 2>&1
@ mount -t tracefs nodev /sys/kernel/tracing 2>/dev/null; mount -t debugfs nodev /sys/kernel/debug 2>/dev/null
bpftrace --version
ls /sys/kernel/btf/vmlinux
node server.js & NODE=$!; sleep 1
TIMEFORMAT='%R s'
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-1000]"
bpftrace -q -e 'tracepoint:syscalls:sys_enter_* /comm == "node"/ { @[probe] = count(); }' -o bt.txt & BT=$!; sleep 8
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-1000]"
kill -INT $BT; wait $BT; awk '/^@/ {print $NF, $1}' bt.txt | sort -rn | head -6
kill $NODE
bpftrace -q -e 'tracepoint:syscalls:sys_enter_openat /comm == "node"/ { printf("%s\n", str(args.filename)); }' -o open.txt & BT=$!; sleep 6
node cfg.js; sleep 0.5; kill -INT $BT; wait $BT; grep -E 'settings|config' open.txt
