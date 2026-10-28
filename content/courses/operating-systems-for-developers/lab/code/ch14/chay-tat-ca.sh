#!/bin/bash
# chay-tat-ca.sh — tạo lại MỌI output của Chương 14 (chạy từ lab/code/ch14, cần Docker + ảnh os-lab + tarball pwsh ở $CACHE).
#   CH14_WORK=<thư mục tạm, sẽ bị ghi> CACHE=<thư mục chứa powershell-7.6.9-linux-arm64.tar.gz> bash chay-tat-ca.sh
# Phần "-mac" chạy TRÊN MÁY MAC (lệnh chỉ đọc + chương trình của chính mình, không sudo) rồi qua an-danh.sh;
# phần "-lx"/"-pwsh" chạy trong container vứt đi --label oslab=1.
set -u
OUT=../../out
for s in c141 c142 c143 c144 c145 c146 c147 c148; do
  [ -f $s-mac.sh ] && bash phien-host.sh $s-mac.sh 2>&1 | bash an-danh.sh > $OUT/$s-mac.out.txt
done
for s in c141 c142 c144 c148; do
  docker run --rm --label oslab=1 --name os-$s --hostname oslab -v "$PWD":/lab/ch14 -w /lab/ch14 os-lab bash -c "phien $s-lx.sh 2>&1" > $OUT/$s-lx.out.txt
done
mkdir -p "$CH14_WORK/m5"
docker run --rm --label oslab=1 --name os-c145 --hostname oslab -v "$PWD":/lab/ch14 -v "$CH14_WORK/m5":/mac -w /lab/ch14 os-lab bash -c "phien c145-lx.sh 2>&1" > $OUT/c145-lx.out.txt
docker run --rm --label oslab=1 --name os-c147 --hostname oslab -v "$PWD":/lab/ch14 -v "$CACHE":/cache:ro -w /lab/ch14 os-lab bash -c "phien c147-pwsh.sh 2>&1" > $OUT/c147-pwsh.out.txt
echo done
