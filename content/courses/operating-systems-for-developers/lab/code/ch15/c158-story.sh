# @ Chương 15 · bài 15.8 — một câu chuyện tinh chỉnh trọn vẹn trên dịch vụ nhỏ checkout.js: triệu chứng → đo → giả thuyết →
# @ đổi MỘT thứ → kiểm → giữ hay hoàn tác. --privileged (eBPF + io.max của cgroup).
# @ docker run --rm --label oslab=1 --hostname oslab --privileged -v "$PWD/ch15":/lab/ch15 -v <c15>/debs:/debs:ro \
# @   -w /lab/ch15 os-lab bash -c "phien c158-story.sh 2>&1" > out/c158-story.out.txt
# @ io.max "254:0 wiops=300": cho container này đúng 300 lần ghi/giây trên đĩa vda — ngân sách IOPS của một ổ mạng nhỏ trên
# @ cloud (đĩa của máy ảo Docker Desktop nhanh hơn nhiều, không giới hạn thì phải bắn hàng nghìn req/s mới thấy).
@ dpkg -i /debs/*.deb > /dev/null 2>&1; mount -t tracefs nodev /sys/kernel/tracing 2>/dev/null
@ cd /tmp && cp /lab/ch15/*.js /lab/ch15/*.py .
@ gpid() { bpftrace -q -e "tracepoint:raw_syscalls:sys_enter /pid == $1/ { printf(\"%d\\n\", curtask->tgid); exit(); }" 2>/dev/null; }
echo "254:0 wiops=300" > /sys/fs/cgroup/io.max; cat /sys/fs/cgroup/io.max
LOG=sync node checkout.js 8080 & C=$!; sleep 0.5
node tai.js http://127.0.0.1:8080/checkout --rate 200 --duration 8
node tai.js http://127.0.0.1:8080/checkout --rate 400 --duration 10 > /tmp/sale.txt & T=$!; sleep 3
python3 use.py 2
pidstat -p $C 1 2 | sed -n '3,4p;6p'
G=$(gpid $C); echo "pid $C in the container = pid $G for the kernel"; offcputime-libbpf -t $G 2 2>/dev/null | python3 offcpu2folded.py > off.folded; python3 folded.py off.folded 4 --us
sort -t' ' -k2 -nr off.folded | head -1 | tr ';' '\n' | tail -10
@ wait $T
cat /tmp/sale.txt; curl -s localhost:8080/stats
@ kill $C; wait $C 2>/dev/null; rm -f /var/tmp/audit.log
UV_THREADPOOL_SIZE=64 LOG=sync node checkout.js 8080 & C=$!; sleep 0.5
node tai.js http://127.0.0.1:8080/checkout --rate 400 --duration 10
@ kill $C; wait $C 2>/dev/null; rm -f /var/tmp/audit.log
LOG=async node checkout.js 8080 & C=$!; sleep 0.5
node tai.js http://127.0.0.1:8080/checkout --rate 400 --duration 10; curl -s localhost:8080/stats
@ kill $C; wait $C 2>/dev/null; rm -f /var/tmp/audit.log
LOG=group node checkout.js 8080 & C=$!; sleep 0.5
node tai.js http://127.0.0.1:8080/checkout --rate 400 --duration 10; curl -s localhost:8080/stats
node tai.js http://127.0.0.1:8080/checkout --rate 800 --duration 10; curl -s localhost:8080/stats
node tai.js http://127.0.0.1:8080/checkout --rate 200 --duration 8
tail -2 /var/tmp/audit.log; wc -l < /var/tmp/audit.log
@ kill $C; wait $C 2>/dev/null; rm -f /var/tmp/audit.log
