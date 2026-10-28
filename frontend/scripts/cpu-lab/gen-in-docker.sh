#!/bin/sh
# Chạy BÊN TRONG container (xem gen-pipeline.sh). Ra các tệp văn bản thô trong /out.
set -e
if ! command -v x86_64-linux-gnu-gcc >/dev/null 2>&1; then
  apt-get update -qq >/dev/null && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq gcc-x86-64-linux-gnu binutils-x86-64-linux-gnu >/dev/null
fi
cd /work
for p in add sum max; do
  for a in x86_64 aarch64; do
    if [ "$a" = x86_64 ]; then CC=x86_64-linux-gnu-gcc; OD=x86_64-linux-gnu-objdump; RE=x86_64-linux-gnu-readelf; NM=x86_64-linux-gnu-nm; SIZE=x86_64-linux-gnu-size; MASM="-masm=intel"; ODM="-M intel"; else CC=aarch64-linux-gnu-gcc; command -v $CC >/dev/null || CC=gcc; OD=objdump; RE=readelf; NM=nm; SIZE=size; MASM=""; ODM=""; fi
    for o in O0 O2; do
      d=/out/$p/$a/$o; mkdir -p $d
      F="-$o -fno-asynchronous-unwind-tables -fno-unwind-tables -fno-stack-protector -fcf-protection=none"
      [ "$a" = aarch64 ] && F="-$o -fno-asynchronous-unwind-tables -fno-unwind-tables -fno-stack-protector -mbranch-protection=none"
      $CC $F $MASM -S c/$p.c -o $d/asm.s
      $CC $F -c c/$p.c -o $d/obj.o
      $OD -d $ODM --no-addresses $d/obj.o > $d/objdump-noaddr.txt 2>/dev/null || true
      $OD -d $ODM $d/obj.o > $d/objdump.txt
      $CC $F c/$p.c -o $d/prog
      $RE -SW $d/prog > $d/sections.txt
      $RE -lW $d/prog > $d/segments.txt
      $RE -hW $d/prog > $d/header.txt
      $NM -n $d/prog > $d/nm.txt
      $SIZE $d/prog > $d/size.txt
      od -A x -t x1 -N 64 $d/prog > $d/head64.txt
      wc -c < $d/prog > $d/bytes.txt
      if [ "$a" = "$(uname -m)" ]; then set +e; $d/prog; echo $? > $d/exit.txt; set -e; fi
    done
  done
done
$CC --version | head -1 > /out/x86cc.txt 2>/dev/null || true
x86_64-linux-gnu-gcc --version | head -1 > /out/x86cc.txt
gcc --version | head -1 > /out/armcc.txt
x86_64-linux-gnu-objdump --version | head -1 > /out/binutils.txt
