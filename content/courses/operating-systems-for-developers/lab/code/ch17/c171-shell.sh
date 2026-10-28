# @ Chương 17 · bài 17.1 — dự án mini shell. Chạy: docker run … -v lab/code:/lab -w /lab/ch17 os-lab bash -c "phien c171-shell.sh"
# The starting point: ctsh.c from Chapter 1 scores almost nothing on the acceptance tests ||| Điểm xuất phát: ctsh.c của Chương 1 gần như trượt hết bộ kiểm nghiệm thu
@ rm -rf /tmp/start /tmp/bug; mkdir -p /tmp/start /tmp/bug; cp ../ch01/ctsh.c /tmp/start/msh.c
shell/test-shell.sh /tmp/start | grep -E '^(PASS|FAIL)|^SCORE' | cut -c1-72
# The reference solution passes every milestone ||| Lời giải mẫu qua mọi mốc
wc -l shell/msh.c
shell/test-shell.sh
# One planted bug: the parent forgets to close the write end of each pipe ||| Cài MỘT lỗi: tiến trình cha quên đóng đầu ghi của mỗi ống
sed 's|if (pfd\[1\] >= 0) close(pfd\[1\]);|/* forgot to close pfd[1] */|' shell/msh.c > /tmp/bug/msh.c; diff shell/msh.c /tmp/bug/msh.c
shell/test-shell.sh /tmp/bug 2>&1 | grep -E 'FAIL|SCORE'
# Watching the reference shell build a pipeline, system call by system call ||| Xem shell mẫu dựng một ống dẫn, từng lời gọi hệ thống
@ gcc -Wall -O2 -o /tmp/msh shell/msh.c
echo 'seq 3 | wc -l' | strace -ff -o /tmp/tr -e trace=pipe2,setpgid,dup2,dup3,close,execve,wait4 -e status=successful /tmp/msh
for f in $(ls /tmp/tr.* | sort -t. -k2 -n); do echo "== process ${f##*.}"; grep -vE '^(close\([0-9]+\)|--- SIG|\+\+\+)' "$f" | sed -E 's/execve\("([^"]+)", \[([^]]*)\].*/execve("\1", [\2], ...) = 0/'; done
printf 'sleep 0.2 &\nsleep 0.1 | sleep 0.1\njobs\nsleep 0.3\necho done\n' | /tmp/msh
