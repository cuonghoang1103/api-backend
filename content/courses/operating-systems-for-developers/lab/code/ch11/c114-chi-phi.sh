# @ Chương 11 · bài 11.4 — giá một syscall đo thật, vDSO (đọc giờ không vào nhân), gộp lời gọi: writev/stdio/Buffered,
# @ sendfile/copy_file_range; Node/Python/Java chép file và đọc giờ bằng gì. File thử nằm trong /dev/shm và /tmp CỦA CONTAINER.
# @ docker run --rm --label oslab=1 --name os-c114 --hostname oslab -v "$PWD/ch11":/lab/ch11 -w /lab/ch11 os-lab bash -c "phien c114-chi-phi.sh 2>&1"
gcc -O2 -Wall cost.c -o cost && ./cost
strace -c -o cost.sc ./cost 10000 1 > /dev/null; grep -E 'getppid|clock_gettime|gettimeofday|total' cost.sc
gcc -O2 vdso.c -o vdso && ./vdso && objdump -T vdso.so | grep __kernel | awk '{print $NF}'
cat /sys/devices/system/clocksource/clocksource0/current_clocksource
strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt node -e 'let s = 0; for (let i = 0; i < 1e6; i++) s += Date.now() + performance.now()'; wc -l < k.txt
strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt python3 -c 'import time; sum(time.time() + time.perf_counter() for _ in range(10**6))'; wc -l < k.txt
javac Clock.java && strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt java Clock > /dev/null; wc -l < k.txt
gcc -O2 -Wall batch.c -o batch && for m in line writev stdio big; do ./batch $m /dev/shm/out.txt; done
for m in line writev stdio big; do strace -qq -c -e trace=write,writev -o b.sc ./batch $m /dev/shm/out.txt > /dev/null; echo "$m: $(awk '$NF ~ /^write/ {print $4, $NF}' b.sc | xargs)"; done
javac Ghi.java && java Ghi raw /dev/shm/g.txt && java Ghi buffered /dev/shm/g.txt
strace -f -qq -c -e trace=write -o g.sc java Ghi raw /dev/shm/g.txt > /dev/null; tail -1 g.sc
strace -f -qq -c -e trace=write -o g.sc java Ghi buffered /dev/shm/g.txt > /dev/null; tail -1 g.sc
gcc -O2 -Wall copy.c -o copy && head -c 256M /dev/urandom > /tmp/src.bin
@ for m in rw4k rw128k sendfile cfr; do ./copy $m /tmp/src.bin /tmp/dst.bin > /dev/null; done
for m in rw4k rw128k sendfile cfr; do ./copy $m /tmp/src.bin /tmp/dst.bin; done
cmp /tmp/src.bin /tmp/dst.bin && echo identical
strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o n.sc node -e 'require("fs").copyFileSync("/tmp/src.bin", "/tmp/n.bin")'; grep -E 'copy_file_range|sendfile|total' n.sc
strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o p.sc python3 -c 'import shutil; shutil.copyfile("/tmp/src.bin", "/tmp/p.bin")'; grep -E 'copy_file_range|sendfile|total' p.sc
javac Chep.java && strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o j.sc java Chep /tmp/src.bin /tmp/j.bin; grep -E 'copy_file_range|sendfile|total' j.sc
