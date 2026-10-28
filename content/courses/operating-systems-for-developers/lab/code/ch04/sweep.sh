#!/bin/bash
# sweep.sh "LỆNH có {k}" k1 k2 … — chạy LỆNH với {k} = số lõi, ghim vào lõi 0..k-1 (taskset), mỗi mức 3 lần lấy NHANH NHẤT
# (máy dùng chung ⇒ lần chậm là nhiễu của người khác). Lệnh phải in "… <số> ms" ở cuối dòng cuối.
# In: số lõi · thời gian · speedup so với mức đầu · hiệu suất (speedup ÷ lõi).
cmd="$1"; shift
printf '%5s %9s %8s %6s\n' cores ms speedup eff
base=""
for k in "$@"; do
  best=""
  for r in 1 2 3; do
    ms=$(taskset -c 0-$((k-1)) bash -c "${cmd//\{k\}/$k}" | tail -1 | grep -oE '[0-9.]+ ms$' | grep -oE '^[0-9.]+')
    if [ -z "$best" ] || awk "BEGIN{exit !($ms < $best)}"; then best=$ms; fi
  done
  [ -z "$base" ] && base=$best
  awk -v k="$k" -v b="$best" -v z="$base" 'BEGIN{ s=z/b; printf "%5d %9.0f %7.2fx %5.0f%%\n", k, b, s, 100*s/k }'
done
