#!/bin/bash
# test-server.sh — BỘ KIỂM NGHIỆM THU dự án 17.2 (máy chủ HTTP có thread pool). Chạy trong ảnh os-lab:
#   ./test-server.sh                         dịch tpserver.c ở thư mục này rồi kiểm
#   ./test-server.sh "java Server.java"      kiểm một bản viết bằng ngôn ngữ khác — chỉ cần theo HỢP ĐỒNG dòng lệnh:
#                                            <lệnh> PORT --threads N --queue Q --timeout-ms T
# 9 ca kiểm theo 5 mốc, PASS/FAIL + điểm, tổng /10. Mỗi ca khởi động máy chủ MỚI trên một cổng riêng.
cd "$(dirname "$0")"
W=$(mktemp -d /tmp/tps-test.XXXX); trap 'kill $(jobs -p) 2>/dev/null; rm -rf "$W"' EXIT
gcc -Wall -Wextra -Werror -O2 -pthread -o "$W/loadgen" loadgen.c || exit 1
if [ -z "$1" ]; then
  gcc -Wall -Wextra -Werror -O2 -pthread -o "$W/tpserver" tpserver.c 2> "$W/cc.txt" || { echo "BUILD FAILED"; head "$W/cc.txt"; echo "SCORE 0/10"; exit 1; }
  CMD="$W/tpserver"
else CMD="$1"; fi
score=0; total=0; port=9100
ok() { total=$(echo "$total + $3" | bc)
  if [ "$4" = 1 ]; then score=$(echo "$score + $3" | bc); printf 'PASS %-4s %-58s +%s\n' "$1" "$2" "$3"
  else printf 'FAIL %-4s %-58s  0 / %s   (%s)\n' "$1" "$2" "$3" "$5"; fi; }
start() { port=$((port + 1)); $CMD $port "$@" 2> "$W/log.$port" & SP=$!
  for i in $(seq 50); do curl -s -o /dev/null "localhost:$port/healthz" && return; sleep 0.1; done; }
stop() { kill -TERM $SP 2>/dev/null; wait $SP 2>/dev/null; }
code() { curl -s -o /dev/null -w '%{http_code}' -m 10 "localhost:$port$1"; }
ms() { echo $(( $(date +%s%N) / 1000000 )); }

# S1 — HTTP cơ bản
start --threads 2 --queue 4 --timeout-ms 1000
B=$(curl -s localhost:$port/); C404=$(code /nope); CH=$(code /healthz)
ok S1 "GET / = 200 hello, /healthz = 200, unknown = 404" 1 "$([ "$B" = hello ] && [ "$CH" = 200 ] && [ "$C404" = 404 ] && echo 1)" "body=$B healthz=$CH nope=$C404"
stop
# S2 — đúng N luồng làm việc, và chúng thật sự chạy song song
start --threads 4 --queue 16 --timeout-ms 2000
T=$(ls /proc/$SP/task | wc -l)
ok S2 "exactly --threads workers (+ the accept thread)" 1 "$([ "$T" = 5 ] && echo 1)" "threads in /proc/PID/task: $T, want 5"
t0=$(ms); for i in $(seq 8); do curl -s -o /dev/null "localhost:$port/work?ms=500" & done; wait $(jobs -p | grep -v "^$SP$"); el=$(( $(ms) - t0 ))
ok S2 "8 x 500 ms requests on 4 threads take two waves (~1 s)" 1.5 "$([ $el -ge 950 ] && [ $el -le 1600 ] && echo 1)" "took $el ms"
stop
# S3 — hàng đợi có giới hạn: đầy thì 503 NGAY, không treo khách
start --threads 2 --queue 2 --timeout-ms 3000
for i in $(seq 10); do ( t=$(ms); c=$(code "/work?ms=1000"); echo "$c $(( $(ms) - t ))" >> "$W/q.txt" ) & sleep 0.02; done; wait $(jobs -p | grep -v "^$SP$")
N200=$(grep -c '^200' "$W/q.txt"); N503=$(grep -c '^503' "$W/q.txt"); SLOW503=$(awk '$1==503 && $2>300' "$W/q.txt" | wc -l)
ok S3 "2 threads + queue 2: 4 served, 6 rejected with 503 at once" 2 "$([ "$N200" = 4 ] && [ "$N503" = 6 ] && [ "$SLOW503" = 0 ] && echo 1)" "200=$N200 503=$N503 slow503=$SLOW503"
stop
# S4 — timeout: khách mở kết nối rồi im lặng ⇒ 408 sau --timeout-ms, luồng được giải phóng
start --threads 1 --queue 4 --timeout-ms 1000
t0=$(ms); R=$(exec 3<>/dev/tcp/127.0.0.1/$port; timeout 5 head -1 <&3 | tr -d '\r'); el=$(( $(ms) - t0 ))
C=$(code /)
ok S4 "silent client gets 408 after ~1 s, the only worker is free again" 1.5 "$([[ "$R" == *408* ]] && [ $el -ge 900 ] && [ $el -le 1800 ] && [ "$C" = 200 ] && echo 1)" "got '$R' after $el ms, then / = $C"
stop
# S5 — tắt êm bằng SIGTERM: thôi nhận mới, xong việc dở, thoát 0
start --threads 2 --queue 4 --timeout-ms 2000
( curl -s -o "$W/inflight" -w '%{http_code}' "localhost:$port/work?ms=1500" > "$W/inflight.code" ) & CP=$!
sleep 0.3; t0=$(ms); kill -TERM $SP; sleep 0.2
NEW=$(curl -s -o /dev/null -w '%{http_code}' -m 2 "localhost:$port/" ; echo " exit=$?")
wait $SP; RC=$?; el=$(( $(ms) - t0 )); wait $CP
ok S5 "after SIGTERM new connections are refused" 0.5 "$([[ "$NEW" == *"exit=7"* ]] && echo 1)" "curl: $NEW (7 = connection refused)"
ok S5 "the in-flight 1.5 s request still completes with 200" 1 "$([ "$(cat "$W/inflight.code")" = 200 ] && echo 1)" "in-flight got $(cat "$W/inflight.code")"
ok S5 "server exits 0 once drained (within 3 s)" 0.5 "$([ $RC = 0 ] && [ $el -le 3000 ] && echo 1)" "exit=$RC after $el ms"
# S6 — không rò fd sau 2 000 request (gồm cả 503 và 404)
start --threads 2 --queue 2 --timeout-ms 1000
F0=$(ls /proc/$SP/fd | wc -l); "$W/loadgen" 127.0.0.1 $port "/nope" 16 1 > /dev/null; "$W/loadgen" 127.0.0.1 $port "/work?ms=5" 32 1 > /dev/null
sleep 0.2; F1=$(ls /proc/$SP/fd | wc -l)
ok S6 "open fds unchanged after thousands of requests" 1 "$([ "$F0" = "$F1" ] && echo 1)" "fds before=$F0 after=$F1"
stop
echo "SCORE $score/$total"
