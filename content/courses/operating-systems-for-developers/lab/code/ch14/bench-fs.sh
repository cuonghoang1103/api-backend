#!/bin/bash
# bench-fs.sh DIR [N] — ghi N file nhỏ, đọc lại, xoá; in thời gian mỗi bước (Chương 14, bài 14.6: kiểu việc của npm install / git status).
cd "$1" || exit 1; N=${2:-3000}; mkdir -p b && cd b
t() { local a=$(date +%s.%N); "$@"; local b=$(date +%s.%N); awk -v a=$a -v b=$b 'BEGIN{printf "%6.3f s", b-a}'; }
w() { for i in $(seq $N); do echo $i > f$i.txt; done; }
r() { cat f*.txt > /dev/null; }
s() { for i in $(seq $N); do [ -e f$i.txt ]; done; stat -c %s f*.txt > /dev/null; }
d() { rm -f f*.txt; }
printf '%-28s write %s | stat %s | read %s | delete %s\n' "$1 ($N files)" "$(t w)" "$(t s)" "$(t r)" "$(t d)"
cd .. && rmdir b
