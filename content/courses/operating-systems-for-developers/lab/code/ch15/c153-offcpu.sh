# @ Chương 15 · bài 15.3 — thời gian NGOÀI CPU: profile (on-CPU) vs offcputime (off-CPU) vs gdb "poor man's profiler",
# @ flame graph off-CPU, sửa rồi đo lại. --privileged (eBPF, ptrace).
# @ docker run --rm --label oslab=1 --hostname oslab --privileged -v "$PWD/ch15":/lab/ch15 -v <c15>/tools:/tools:ro \
# @   -v <c15>/debs:/debs:ro -w /lab/ch15 os-lab bash -c "phien c153-offcpu.sh 2>&1" > out/c153-offcpu.out.txt
# @ /debs = libbpf-tools 0.35 + bpftrace 0.25 của Ubuntu 26.04 (apt-get install --download-only, rồi dpkg -i trong container vứt đi).
@ dpkg -i /debs/*.deb > /dev/null 2>&1; mount -t tracefs nodev /sys/kernel/tracing 2>/dev/null
@ cd /tmp && cp /lab/ch15/*.c /lab/ch15/*.py . && mkdir -p /lab/ch15/fg
gcc -O2 -g -fno-omit-frame-pointer -pthread wait.c -o wait
time ./wait inside
./wait inside 600 > /dev/null & W=$!; sleep 0.5
profile-libbpf -F 499 -f -p $W 3 > on.folded 2>/dev/null; python3 folded.py on.folded 4
@ wait $W
./wait inside 300 > /dev/null & W=$!; sleep 0.5; pidstat -wt -p $W 1 1 | sed -n '3,8p'
@ wait $W
./wait inside 600 > /dev/null & W=$!; sleep 0.5
G=$(bpftrace -q -e 'tracepoint:syscalls:sys_enter_futex /comm == "wait"/ { printf("%d\n", curtask->tgid); exit(); }'); echo "pid $W in the container = pid $G for the kernel"
offcputime-libbpf -p $G 3 > off.txt 2>/dev/null; awk 'BEGIN{RS=""} /futex_do_wait/ {print; exit}' off.txt | grep -v bpf
python3 offcpu2folded.py < off.txt > off.folded; python3 folded.py off.folded 3 --us
python3 pmp.py $W 5 0.2
@ wait $W
perl /tools/flamegraph.pl --title "wait.c: on-CPU (profile)" --width 1200 on.folded > /lab/ch15/fg/wait-on.svg
perl /tools/flamegraph.pl --title "wait.c: off-CPU time (offcputime)" --colors io --countname us --width 1200 off.folded > /lab/ch15/fg/wait-off.svg; ls /lab/ch15/fg | grep wait
time ./wait outside
./wait outside 3000 > /dev/null & W=$!; sleep 0.5
G=$(bpftrace -q -e 'tracepoint:syscalls:sys_enter_futex /comm == "wait"/ { printf("%d\n", curtask->tgid); exit(); }'); offcputime-libbpf -p $G 2 2>/dev/null | python3 offcpu2folded.py > off2.folded; python3 folded.py off2.folded 3 --us
@ wait $W
