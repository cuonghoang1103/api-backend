#!/bin/bash
# best3.sh LỆNH… — chạy LỆNH 3 lần, in dòng cuối của lần NHANH NHẤT (máy dùng chung ⇒ lần chậm là nhiễu của người khác).
# Lệnh phải in "… <số> ms" ở cuối dòng cuối.
best=""; line=""
for r in 1 2 3; do
  l=$("$@" | tail -1)
  ms=$(grep -oE '[0-9.]+ ms$' <<< "$l" | grep -oE '^[0-9.]+')
  if [ -z "$best" ] || awk "BEGIN{exit !($ms < $best)}"; then best=$ms; line=$l; fi
done
echo "$line"
