#!/bin/bash
# test-shell.sh — BỘ KIỂM NGHIỆM THU dự án 17.1 (mini shell). Chạy trong ảnh os-lab:
#   ./test-shell.sh [thư-mục-chứa-msh.c]        (mặc định: thư mục hiện tại)
# Dịch msh.c với -Wall -Wextra -Werror, chạy 14 ca kiểm theo 6 mốc, in PASS/FAIL + điểm, tổng /10.
# Mỗi ca so output của msh với output mong đợi (nhiều ca lấy mong đợi từ chính bash ⇒ không đoán tay).
cd "$(dirname "$0")"; SRC=${1:-.}
W=$(mktemp -d /tmp/msh-test.XXXX); trap 'pkill -P $$ 2>/dev/null; rm -rf "$W"' EXIT
if ! gcc -Wall -Wextra -Werror -O2 -o "$W/msh" "$SRC/msh.c" 2> "$W/cc.txt"; then
  echo "BUILD FAILED (gcc -Wall -Wextra -Werror):"; head -20 "$W/cc.txt"; echo "SCORE 0/10"; exit 1
fi
M="$W/msh"; cd "$W"; score=0; total=0
norm() { sed -E 's/^\[([0-9]+)\] [0-9]+$/[\1] PID/; s/ +/ /g'; }   # "[1] 4321" ⇒ "[1] PID" (PID đổi mỗi lần chạy); gộp dấu cách
ok() {  # ok "mốc" "tên ca" điểm "mong đợi" "thực tế"
  total=$(echo "$total + $3" | bc)
  if [ "$4" == "$5" ]; then score=$(echo "$score + $3" | bc); printf 'PASS %-4s %-52s +%s\n' "$1" "$2" "$3"
  else printf 'FAIL %-4s %-52s  0 / %s\n' "$1" "$2" "$3"; diff <(echo "$4") <(echo "$5") | sed 's/^/       /' | head -8; fi
}
sh_() { printf '%s\n' "$@" | timeout 5 "$M" 2>&1 | norm; }        # chạy các dòng lệnh qua msh

# M1 — chạy lệnh, mã thoát, lệnh dựng sẵn (dựa trên ctsh.c của Chương 1)
ok M1 "run a program with arguments"           0.5 "$(echo hello world)"            "$(sh_ 'echo hello world')"
ok M1 "exit status: \$? after a failing command"  0.5 "2"                              "$(sh_ 'ls /nope 2> /dev/null' 'echo $?' | tail -1)"
ok M1 "unknown command: message + 127"          0.5 "$(printf 'msh: nosuchcmd: No such file or directory\n127')" "$(sh_ 'nosuchcmd' 'echo $?')"
ok M1 "cd changes the shell's own directory"    0.5 "/tmp"                             "$(sh_ 'cd /tmp' 'pwd')"
# M2 — chuyển hướng
ok M2 "> creates/truncates, < reads, >> appends" 0.5 "$(printf 'a b c\n2')"           "$(sh_ 'echo a b c > o.txt' 'cat < o.txt' 'echo d >> o.txt' 'wc -l < o.txt')"
ok M2 "2> sends only stderr to a file"          0.5 "$(ls /nope 2>&1)"                "$(sh_ 'ls /nope 2> e.txt' 'cat e.txt')"
ok M2 "2>&1 merges stderr into a pipe"          0.5 "1"                               "$(sh_ 'ls /nope 2>&1 | wc -l')"
# M3 — ống dẫn
ok M3 "two-stage pipe with quoted argument"     0.5 "$(printf 'b\na\nc\n' | sort | head -2)" "$(sh_ "printf 'b\\na\\nc\\n' | sort | head -2")"
ok M3 "five-stage pipe, exit status of the last" 0.5 "$(seq 1 100000 | grep 7 | sort -n | tail -3 | wc -l; echo 0)" "$(sh_ 'seq 1 100000 | grep 7 | sort -n | tail -3 | wc -l' 'echo $?')"
ok M3 "yes | head -3 terminates (write ends closed)" 0.5 "$(printf 'y\ny\ny')"         "$(sh_ 'yes | head -3')"
ok M3 "children inherit only fds 0 1 2"         0.5 "$(printf '0\n1\n2')"            "$(sh_ "sh -c 'ls /proc/\$\$/fd' | cat")"
# M4 — việc chạy nền + không để lại zombie
ok M4 "background job, jobs, Done, no zombie"   2  "$(printf '[1] PID\n[1] Running\tsleep 0.3 &\n[1] Done (0)\tsleep 0.3 &\nR ps')" \
   "$(sh_ 'sleep 0.3 &' 'jobs' 'sleep 0.6' 'ps -o stat=,comm= --ppid $$')"
# M5 — tín hiệu: Ctrl-C giết việc đang chạy, không giết shell
mkfifo in.fifo; ( exec "$M" < in.fifo > sig.out 2>&1 ) & MP=$!; exec 9> in.fifo     # MP = PID của chính msh (exec thay subshell)
echo 'sleep 5' >&9; sleep 0.5
kill -INT "$MP"                                                                  # 1) Ctrl-C trúng shell: phải sống
SL=$(pgrep -P "$MP" -x sleep); JP=$(ps -o pgid= -p "$SL" | tr -d ' '); SP=$(ps -o pgid= -p "$MP" | tr -d ' ')
PG=$([ -n "$JP" ] && [ "$JP" != "$SP" ] && echo "own process group")         # (ghi riêng: sig.out đang do msh ghi KHÔNG O_APPEND)
if [ -n "$PG" ]; then kill -INT -- "-$JP"; elif [ -n "$SL" ]; then kill -INT "$SL"; fi; sleep 0.3   # 2) Ctrl-C trúng NHÓM của job
#    (job không có nhóm riêng ⇒ chỉ bắn vào đúng sleep đó — bắn vào nhóm của shell sẽ giết luôn cả bộ kiểm này)
echo 'echo status=$?' >&9; echo 'echo alive' >&9; exec 9>&-; wait "$MP"; echo "msh exit=$?" >> sig.out
ok M5 "SIGINT kills the job's group, not the shell" 1.5 "$(printf 'own process group\n[killed by signal 2]\nstatus=130\nalive\nmsh exit=0')" "$(echo "$PG"; cat sig.out)"
# M6 — dọn dẹp: exit n, EOF, không rò fd trong chính shell sau 200 ống dẫn
ok M6 "exit 3 returns 3"                        0.5 "3"                               "$(printf 'exit 3\n' | "$M"; echo $?)"
ok M6 "no fd leak in the shell after 200 pipes" 0.5 "$(printf '0\n1\n2')"          "$( (for i in $(seq 200); do echo 'true | true'; done; echo 'ls /proc/$$/fd') | "$M" 2>&1)"
echo "SCORE $score/$total"
