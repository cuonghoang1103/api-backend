#!/usr/bin/env bash
# Soát bảo mật Actions cho một kho — bảy phép kiểm của bài 6.4.
# Chạy từ gốc kho. Không sửa gì, chỉ đọc.
set -uo pipefail
W=.github/workflows
[ -d "$W" ] || { echo "khong co $W"; exit 1; }
ok=0; canh=0
kiem() { # kiem <ten> <so-do> <nguong-ok> <ghi-chu>
  if [ "$2" -le "$3" ]; then printf "  ✅ %-38s %s\n" "$1" "$4"; ok=$((ok+1))
  else printf "  ⚠️  %-38s %s\n" "$1" "$4"; canh=$((canh+1)); fi
}
echo "=== SOAT BAO MAT ACTIONS — $(basename "$PWD") ==="
echo

# 1. bieu thuc SU KIEN noi suy thang vao run:
n=$(grep -h -A40 '^\s*run:' $W/*.yml 2>/dev/null \
    | grep -c '\${{ *github\.event\.' || true)
kiem "bieu thuc github.event trong run:" "$n" 0 "$n cho"

# 2. pull_request_target
n=$(grep -l 'pull_request_target' $W/*.yml 2>/dev/null | wc -l)
kiem "workflow dung pull_request_target" "$n" 0 "$n workflow"

# 3. action ghim bang nhanh
n=$(grep -h -o 'uses: *[^ ]*@\(main\|master\|develop\)$' $W/*.yml 2>/dev/null | wc -l)
kiem "action ghim vao mot NHANH" "$n" 0 "$n cho"

# 4. ti le ghim SHA
tong=$(grep -h -o 'uses: *[^ ]*@[^ ]*' $W/*.yml 2>/dev/null | wc -l)
sha=$(grep -h -o 'uses: *[^ ]*@[0-9a-f]\{40\}' $W/*.yml 2>/dev/null | wc -l)
chua=$((tong - sha))
kiem "action CHUA ghim bang SHA" "$chua" 0 "$sha / $tong da ghim SHA"

# 5. permissions:
nw=$(ls $W/*.yml 2>/dev/null | wc -l)
np=$(grep -l '^permissions:' $W/*.yml 2>/dev/null | wc -l)
kiem "workflow KHONG khai permissions:" "$((nw-np))" 0 "$np / $nw da khai"

# 6. environment:
ne=$(grep -l '^\s*environment:' $W/*.yml 2>/dev/null | wc -l)
kiem "workflow KHONG dung environment:" "$((nw-ne))" 0 "$ne / $nw co dung"

# 7. bi mat di THANG vao run: (canh bao nhe, khong phai loi)
n=$(grep -h -o '\${{ *secrets\.[A-Z_0-9]* *}}' $W/*.yml 2>/dev/null | wc -l)
echo "  ℹ️  $n luot tham chieu secrets.* — kiem tay xem cai nao trong run:"
echo
echo "  ket qua: $ok dat, $canh canh bao"
