#!/bin/bash
# check.sh — BỘ CHẤM dự án 17.3 "chẩn đoán sự cố cài sẵn". Chạy TỪ MÁY CHỦ (cần docker compose; chạy được với bash 3.2 của macOS).
#   ./check.sh                 chấm mã trong services/ (bản của bạn)       ./check.sh fixed   chấm lời giải mẫu
#   SECS=90 ./check.sh         để hệ thống chịu tải lâu hơn trước khi chấm  KEEP=1 ./check.sh  chấm xong KHÔNG tắt (để điều tra)
# Bật cả 6 container, để máy tạo tải chạy SECS giây (mặc định 75), rồi kiểm 5 điều kiện sức khoẻ — mỗi sự cố 2 điểm, tổng /10.
# Chỉ đụng tới project "os17" (container os-17-*, nhãn oslab=1) — không bao giờ động vào container khác trên máy.
cd "$(dirname "$0")"
SRC=${1:-services}; SECS=${SECS:-75}; P="docker compose -p os17"
export SRC
$P down -v --remove-orphans > /dev/null 2>&1
START=$(date +%s)
$P up -d --build > /tmp/os17-up.log 2>&1 || { echo "compose up failed:"; tail -20 /tmp/os17-up.log; exit 1; }
echo "running $SRC/ under traffic for ${SECS}s ..."
sleep "$SECS"
score=0
ok() { # ok "sự cố" điểm 1|"" "chi tiết"
  if [ "$3" = 1 ]; then score=$((score + $2)); printf 'PASS  %-46s +%s   %s\n' "$1" "$2" "$4"
  else printf 'FAIL  %-46s  0/%s  %s\n' "$1" "$2" "$4"; fi; }
T() { docker exec os-17-traffic bash -c "$1" 2>/dev/null; }

# 1 — bộ nhớ: không bị OOM giết, không khởi động lại, RSS ổn định
R=$(docker inspect -f '{{.RestartCount}}' os-17-shop)
OOMS=$(docker events --since "$START" --until "$(date +%s)" --filter container=os-17-shop --filter event=oom --format x | wc -l | tr -d ' ')
S=$(T 'curl -s -m 3 shop-api:3000/stats'); RSS=$(echo "$S" | sed -n 's/.*"rssMiB":\([0-9]*\).*/\1/p')
ok "1 shop-api: no OOM kill, no restart, RSS < 150 MiB" 2 "$([ "$R" = 0 ] && [ "$OOMS" = 0 ] && [ -n "$RSS" ] && [ "$RSS" -lt 150 ] && echo 1)" "restarts: $R, oom events: $OOMS; stats: ${S:-no answer}"
# 2 — file descriptor: không rò, vẫn phục vụ được
FD=$(docker exec os-17-report sh -c 'ls /proc/1/fd | wc -l' 2>/dev/null); C=$(T 'curl -s -o /dev/null -w "%{http_code}" -m 3 report:3001/report')
ok "2 report: fds stay low, /report answers 200" 2 "$([ -n "$FD" ] && [ "$FD" -lt 64 ] && [ "$C" = 200 ] && echo 1)" "open fds of PID 1: $FD; /report: $C"
# 3 — đĩa: ổ log chưa đầy, không có file đã xoá mà vẫn mở, việc nền không lỗi
USE=$(docker exec os-17-worker sh -c "df --output=pcent /var/log/app | tail -1 | tr -dc 0-9" 2>/dev/null)
DEL=$(docker exec os-17-worker sh -c 'ls -l /proc/[0-9]*/fd 2>/dev/null | grep -c "(deleted)"' 2>/dev/null)
H=$(T 'curl -s -m 3 worker:3002/')
ok "3 worker: log disk < 50%, no deleted-open files" 2 "$([ -n "$USE" ] && [ "$USE" -lt 50 ] && [ "$DEL" = 0 ] && [[ "$H" == *"failed=0 "* ]] && echo 1)" "df ${USE}%, deleted-but-open: $DEL; health: ${H:-no answer}"
# 4 — deadlock: 100 lệnh chuyển hai chiều cùng lúc đều xong trong 10 s, tổng tiền không đổi
DONE=$(T 'for i in $(seq 50); do curl -s -m 10 "billing:3003/transfer?from=0&to=1" & curl -s -m 10 "billing:3003/transfer?from=1&to=0" & done; wait' | grep -c done)
TOT=$(T 'curl -s -m 3 billing:3003/total')
ok "4 billing: 100 opposite transfers finish, money kept" 2 "$([ "$DONE" = 100 ] && [ "$TOT" = 4000000 ] && echo 1)" "finished $DONE/100 in 10 s; total = ${TOT:-no answer}"
# 5 — I/O: một sự kiện lưu xong (kể cả fsync) trong < 10 ms (trung vị 30 lần), và log không bị xen byte
MED=$(T 'for i in $(seq 30); do curl -s -m 10 "audit:3004/event?id=$i"; done' | sed -n 's/stored in \([0-9.]*\) ms/\1/p' | sort -n | sed -n 15p)
BAD=$(docker exec os-17-audit sh -c "grep -cvE '^[0-9]+\.[0-9]{6} /event\?id=[0-9]+ user=42 action=transfer amount=1$' /data/audit.log" 2>/dev/null)
ok "5 audit: median store < 10 ms, no corrupted lines" 2 "$([ -n "$MED" ] && awk "BEGIN{exit !($MED < 10)}" && [ "$BAD" = 0 ] && echo 1)" "median ${MED:-?} ms; malformed lines: ${BAD:-?}"
echo "SCORE $score/10"
[ -n "$KEEP" ] || $P down -v --remove-orphans > /dev/null 2>&1
