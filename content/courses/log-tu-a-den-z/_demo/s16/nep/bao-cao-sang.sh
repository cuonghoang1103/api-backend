#!/usr/bin/env bash
# bao-cao-sang.sh [khoảng] — báo cáo log buổi sáng cho MỘT máy Linux (mặc định 24 giờ qua). Chạy bằng root (đọc auth.log, journal).
# Mỗi mục: một con số + vài dòng bằng chứng. Lưu số đếm vào /var/lib/bao-cao/ để lần sau so sánh "hôm nay khác gì hôm qua".
set -u
KHOANG=${1:-"24 hours ago"}; SO=/var/lib/bao-cao; mkdir -p "$SO"; HOM_NAY=$SO/$(date +%Y%m%d-%H%M).tsv
dem() { printf '%s\t%s\n' "$1" "$2" >> "$HOM_NAY"; printf '%6s  %s' "$2" "$1"; }
echo "== Báo cáo log $(hostname) — từ $(date -d "$KHOANG" '+%F %T') tới $(date '+%F %T')"
# 1. Đăng nhập & quyền
n=$(journalctl -q --since "$KHOANG" _COMM=sshd | grep -c 'Failed password'); dem "SSH sai mật khẩu" "$n"; echo
journalctl -q --since "$KHOANG" _COMM=sshd | grep -o 'Failed password for .* from [0-9.]*' | awk '{print $NF}' | sort | uniq -c | sort -rn | head -3 | sed 's/^/        /'
n=$(journalctl -q --since "$KHOANG" _COMM=sshd | grep -c 'Accepted'); dem "SSH đăng nhập được" "$n"; echo
n=$(journalctl -q --since "$KHOANG" _COMM=sudo | grep -c 'incorrect password'); dem "sudo sai mật khẩu" "$n"; echo
journalctl -q --since "$KHOANG" _COMM=sudo -o cat | grep 'COMMAND=' | sed 's/ ; PWD=[^;]*//; s/ ; TTY=[^;]*//' | tail -3 | sed 's/^/        /'
n=$(journalctl -q --since "$KHOANG" -o cat _COMM=useradd _COMM=usermod _COMM=groupadd _COMM=passwd | wc -l); dem "đổi tài khoản/nhóm" "$n"; echo
# 2. Dịch vụ
n=$(systemctl --failed --no-legend | wc -l); dem "dịch vụ đang hỏng" "$n"; echo
systemctl --failed --no-legend | awk '{print "        " $2}'
n=$(journalctl -q --since "$KHOANG" -p warning | wc -l); dem "dòng journal mức warning trở lên" "$n"; echo
journalctl -q --since "$KHOANG" -p warning -o json | jq -r '._SYSTEMD_UNIT // .SYSLOG_IDENTIFIER // "?"' | sort | uniq -c | sort -rn | head -3 | sed 's/^/        /'
# 3. Nhân: OOM, lỗi đĩa (máy ảo/máy thật; container không có nhân riêng)
n=$(journalctl -q -k --since "$KHOANG" | grep -ciE 'out of memory|oom-kill|I/O error|remount.*read-only'); dem "OOM / lỗi đĩa (nhân)" "$n"; echo
# 4. Đĩa và dung lượng log
n=$(df --output=pcent / | tail -1 | tr -dc 0-9); dem "đĩa / đã dùng (%)" "$n"; [ "$n" -ge 85 ] && echo "  ⚠" || echo
n=$(du -sm /var/log | cut -f1); dem "/var/log (MB)" "$n"; echo
# 5. Web (nginx)
A=/var/log/nginx/access.log
if [ -r "$A" ]; then
  n=$(awk '$9 ~ /^5/' "$A" | wc -l); dem "nginx 5xx" "$n"; echo
  awk '$9 ~ /^5/ {print $9, $7}' "$A" | sort | uniq -c | sort -rn | head -3 | sed 's/^/        /'
  n=$(awk '$9 == 404' "$A" | awk '{print $1}' | sort | uniq -c | awk '$1 >= 20' | wc -l); dem "IP quét (≥20 lần 404)" "$n"; echo
  awk '$9 == 404 {print $1}' "$A" | sort | uniq -c | sort -rn | awk '$1 >= 20' | head -3 | sed 's/^/        /'
fi
# 6. So với lần trước
TRUOC=$(ls "$SO"/*.tsv 2>/dev/null | grep -v "$HOM_NAY" | tail -1)
if [ -n "$TRUOC" ]; then
  echo "== Khác lần trước ($(basename "$TRUOC" .tsv)):"
  join -t $'\t' <(sort "$TRUOC") <(sort "$HOM_NAY") | awk -F'\t' '$2 != $3 { printf "  %6s → %-6s %s\n", $2, $3, $1 }'
fi
