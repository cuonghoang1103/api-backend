# @ Chương 11 · bài 11.1 — PHÍA NHÂN của một write(): ftrace (tracer "function") chỉ bật cho chính tiến trình ktrace.
# @ Cần tracefs ⇒ container vứt đi --privileged --pid=host (set_ftrace_pid nhận PID của máy). Cuối kịch bản TRẢ ftrace về
# @ trạng thái cũ (nop, không lọc pid) vì ftrace là của cả nhân VM Docker, không riêng container:
# @ docker run --rm --label oslab=1 --name os-c111k --hostname oslab --privileged --pid=host -v "$PWD/ch11":/lab/ch11 -w /lab/ch11 os-lab bash -c "phien c111-kernel.sh 2>&1"
@ mount -t tracefs nodev /sys/kernel/tracing 2>/dev/null
cat /sys/kernel/tracing/available_tracers
gcc -O2 ktrace.c -o ktrace && ./ktrace; echo "exit=$?"
awk '/do_el0_svc <-/{if(b~/write_null/)printf "%s",b; b=""} {sub(/^.*\] [^ ]+ +[0-9.]+: /,""); b=b $0 "\n"} END{if(b~/write_null/)printf "%s",b}' /sys/kernel/tracing/trace
@ cd /sys/kernel/tracing && echo nop > current_tracer && echo > set_ftrace_pid && echo > trace && cd /lab/ch11
