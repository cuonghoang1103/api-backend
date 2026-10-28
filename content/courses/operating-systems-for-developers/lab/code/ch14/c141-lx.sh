# @ Chương 14 · bài 14.1 — trong container lab: docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch14":/lab/ch14 -w /lab/ch14 os-lab bash -c "phien c141-lx.sh 2>&1" > ../out/c141-lx.out.txt
uname -srm
cat /proc/version
grep -cE '^#define __NR_' /usr/include/asm-generic/unistd.h
grep -E '^#define __NR_(openat|write|clone|execve) ' /usr/include/asm-generic/unistd.h
ldd /usr/bin/true
wc -l < /proc/modules
ls /sys/module | wc -l
