# @ Chương 7 · bài 7.2 — phân trang, bảng trang, TLB, huge page. Chạy: docker run --rm --label oslab=1 --hostname oslab --cap-add SYS_ADMIN --cap-add PERFMON --security-opt seccomp=unconfined -v "$PWD/ch07":/lab/ch07 -w /lab/ch07 os-lab bash -c "phien c72-trang.sh 2>&1"
getconf PAGESIZE
zcat /proc/config.gz | grep -E 'PGTABLE_LEVELS|ARM64_VA_BITS=|ARM64_4K_PAGES'
gcc -O2 xlate.c -o xlate
./xlate
setpriv --reuid=1001 --regid=1001 --clear-groups ./xlate | tail -2
gcc -O2 touch.c -o touch
for m in 64 256 1024; do ./touch $m nohuge; done
cat /sys/kernel/mm/transparent_hugepage/enabled
cat /sys/kernel/mm/transparent_hugepage/defrag
grep -E 'AnonHugePages|Hugepagesize' /proc/meminfo
for h in nohuge huge; do ./touch 256 $h; done
gcc -O2 tlb.c -o tlb
for m in 1 8 64 1024; do for h in nohuge huge; do ./tlb $m $h; done; done
perf stat -e page-faults,dTLB-loads,dTLB-load-misses ./tlb 64 nohuge 2>&1 | grep -E 'ns per|faults|dTLB|elapsed'
perf stat -e cycles,instructions,cpu-clock true 2>&1 | grep -E 'cycles|instructions|cpu-clock'
@ rm -f xlate touch tlb
