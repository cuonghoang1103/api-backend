#!/bin/bash
# phien-host FILE — bản rút gọn của lab/moi-truong/phien.sh chạy được bằng bash 3.2 của macOS (không có mapfile), cho
# các lệnh Chương 2 phải gõ TỪ MÁY CHỦ chứ không từ trong container: docker run/stats/inspect/logs/system df, và vài lệnh
# CHỈ ĐỌC của máy Mac (df, du, ps, pgrep) ở bài 2.7 "Đọc cùng Claude". In "$ lệnh" rồi output, cùng một shell.
#   • dòng trống / "#!" / "# @…": bỏ qua · "# …": in nguyên dòng · "@ …": chạy ngầm · dòng kết thúc bằng "\": gom tiếp
#   bash lab/code/ch02/phien-host.sh lab/code/ch02/c23-oom.sh > lab/out/c23-oom.out.txt 2>&1
set +e
__DONG=()
while IFS= read -r l || [ -n "$l" ]; do __DONG+=("$l"); done < "$1"
buf="" ; ngam=0 ; __st=0
__ret() { return "$1"; }
chay() {
  if [ "$ngam" = 0 ]; then
    local i=0
    while IFS= read -r l; do
      if [ $i = 0 ]; then printf '$ %s\n' "$l"; else printf '> %s\n' "$l"; fi
      i=$((i+1))
    done <<< "${buf%$'\n'}"
  fi
  __ret "$__st"; eval "$buf" < /dev/null; __st=$?
  buf="" ; ngam=0
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
  case "$line" in *\\) continue ;; esac
  if bash -n -c "$buf" 2>/dev/null; then chay; fi
done
[ -n "$buf" ] && chay
exit 0
