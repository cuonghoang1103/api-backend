#!/bin/bash
# chay-tat-ca.sh — tạo lại TOÀN BỘ output Chương 16 (chạy từ thư mục lab/code/ch16 trên máy soạn bài).
#   c163-lich · c164-bo-nho · c165-banker-dia : lời giải các bài thi (osgcalc.py)
#   c168-thi                                  : các câu có tính toán của bài thi cuối khoá 16.8
#   c16-engine                                : đối chiếu lần hai bằng bộ máy mô phỏng của /os-lab
set -e
ENGINE=$(cd ../../../../../../frontend/src/components/os-lab/engine && pwd)
for f in c163-lich c164-bo-nho c165-banker-dia c168-thi c16-engine; do
  docker run --rm --label oslab=1 --name "os-$f" --hostname oslab -v "$PWD":/lab/ch16 -v "$ENGINE":/engine:ro -w /lab/ch16 \
    os-lab bash -c "phien $f.sh 2>&1" > "../../out/$f.out.txt"
  echo "$f: $(wc -l < ../../out/$f.out.txt) dòng"
done
