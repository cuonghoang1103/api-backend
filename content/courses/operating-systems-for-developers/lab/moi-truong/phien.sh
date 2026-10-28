#!/bin/bash
# phien FILE — chạy FILE như người gõ từng lệnh vào terminal Linux: in "$ lệnh" (dòng nối tiếp in "> ", y như PS2 của
# bash) rồi chạy lệnh đó trong CÙNG một shell (cd, biến, hàm còn nguyên cho lệnh sau). stdout + stderr của lệnh đi chung
# một luồng (bên gọi đã 2>&1) nên thứ tự y như trên màn hình.
#   • dòng trống: bỏ qua · dòng "#!…" và dòng cờ "# @…": bỏ qua
#   • dòng chú thích "# …" (đứng riêng): in NGUYÊN dòng (không có "$ ") — để ghi chú bước làm; "# EN ||| VI" được
#     generator tách theo ngôn ngữ lúc hiện
#   • dòng bắt đầu "@ " : chạy NGẦM (không in lệnh) — dùng cho bước chuẩn bị không đáng xem
#   • lệnh nhiều dòng (if/for/while, heredoc, "\" cuối dòng): gom đến khi `bash -n` chấp nhận và heredoc đã đóng
# stdin của các lệnh = stdin của chính phien (file .in của bài, hoặc trống). Script được đọc HẾT vào mảng trước (mapfile)
# rồi mới chạy ⇒ không có fd nào của phien lọt sang tiến trình con (ls /proc/self/fd chỉ thấy 0 1 2 như terminal thật).
set +e
mapfile -t __DONG < "$1"
buf="" ; first="" ; ngam=0 ; hd="" ; __st=0
__ret() { return "$1"; }   # khôi phục $? của lệnh TRƯỚC (việc in "$ lệnh" không được làm mất nó)
chay() {
  if [ "$ngam" = 0 ]; then
    local i=0
    while IFS= read -r l; do
      if [ $i = 0 ]; then printf '$ %s\n' "$l"; else printf '> %s\n' "$l"; fi
      i=$((i+1))
    done <<< "${buf%$'\n'}"
  fi
  __ret "$__st"; eval "$buf"; __st=$?
  buf="" ; ngam=0 ; hd=""
}
for line in "${__DONG[@]}"; do
  if [ -z "$buf" ]; then
    case "$line" in
      '#!'*|'# @'*) continue ;;
      '') continue ;;
      '#'*) printf '%s\n' "$line" ; continue ;;
      '@ '*) ngam=1 ; line="${line#@ }" ;;
    esac
  fi
  buf+="$line"$'\n'
  # heredoc: nhớ dấu kết thúc của heredoc MỞ GẦN NHẤT ( <<EOF / <<'EOF' / <<-EOF ) cho tới khi gặp dòng đóng
  if [ -n "$hd" ]; then
    t="$line"; [ "${hdtab:-0}" = 1 ] && t="${t#"${t%%[!$'\t']*}"}"
    [ "$t" = "$hd" ] && hd=""
  elif [[ "$line" =~ \<\<(-?)[[:space:]]*[\'\"]?([A-Za-z_][A-Za-z0-9_]*)[\'\"]? ]]; then
    hd="${BASH_REMATCH[2]}"; hdtab=0; [ -n "${BASH_REMATCH[1]}" ] && hdtab=1
  fi
  [ -n "$hd" ] && continue
  case "$line" in *\\) continue ;; esac
  if bash -n <(printf '%s' "$buf") 2>/dev/null; then chay; fi
done
[ -n "$buf" ] && chay
exit 0
