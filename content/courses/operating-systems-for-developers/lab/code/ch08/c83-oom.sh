# @ Chương 8 · bài 8.3 — overcommit, oom_score/oom_score_adj, OOM killer chọn ai, dòng dmesg. Container vứt đi 256 MiB, KHÔNG swap;
# @ cap SYSLOG để đọc dmesg, SYS_RESOURCE để HẠ oom_score_adj (nâng thì ai cũng được):
# @ docker run --rm --label oslab=1 --name os-c83 --hostname oslab --memory 256m --memory-swap 256m --cap-add SYSLOG --cap-add SYS_RESOURCE -v "$PWD/ch08":/lab/ch08 -w /lab/ch08 os-lab bash -c "phien c83-oom.sh 2>&1"
@ gcc -O2 overc.c -o overc; gcc -O2 hold.c -o postgres; gcc -O2 fill.c -o api
cat /proc/sys/vm/overcommit_memory /proc/sys/vm/overcommit_ratio
grep -E '^(MemTotal|SwapTotal|CommitLimit|Committed_AS):' /proc/meminfo
./overc 64
./overc 4096
(ulimit -v 1048576; ./overc 2)
cat /proc/self/oom_score_adj /proc/self/oom_score
./postgres 140 &
@ sleep 1
cat /proc/$(pidof postgres)/oom_score /proc/$(pidof postgres)/oom_score_adj
./api 200 16 q; echo "api exit code $?"
pidof postgres || echo "postgres is gone"
dmesg | grep -E '(api|postgres) invoked oom-killer|\] \[ +pid +\]|[0-9] (postgres|api)$|oom-kill:.*task=(postgres|api),|Killed process [0-9]+ \((postgres|api)\)' | tail -6 | sed -E 's/(gfp_mask=[^,]+).*(, oom_score_adj)/\1 …\2/; s/(oom-kill:constraint=[A-Z_]+).*(,task=.*)/\1 …\2/'
./postgres 140 &
@ sleep 1
echo -1000 > /proc/$(pidof postgres)/oom_score_adj
cat /proc/$(pidof postgres)/oom_score /proc/$(pidof postgres)/oom_score_adj
./api 200 16 q; echo "api exit code $?"
pidof postgres && echo "postgres survived"
dmesg | grep -E 'Killed process [0-9]+ \((postgres|api)\)' | tail -1
cat /sys/fs/cgroup/memory.events
@ kill %2 2>/dev/null; rm -f overc postgres api
