#!/usr/bin/env bash
# Chạy lại lab, ghi output vào _dung/out/<tai-nan>.txt (mã băm đổi mỗi lần chạy ⇒ SAU ĐÓ phải dựng lại bài bằng dung.sh).
set -u
cd "$(dirname "$0")/.."
OUT="$(pwd)/_dung/out"; mkdir -p "$OUT"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/lab18-lay.XXXXXX")"
for t in build xung-dot-web-xml keo-main-nham push-tu-choi push-tu-choi-rebase push-force sua-nham-main sua-nham-main-da-push tu-merge hoan-tac-merge hoan-tac-merge-chua-push tong-hop; do
  LAB18_DIR="$TMP/$t" bash tao-nhom.sh "$t" --sua 2>&1 | sed '$d' > "$OUT/$t.txt"
done
rm -rf "$TMP"; echo "đã ghi $(ls "$OUT" | wc -l) tệp vào $OUT"
