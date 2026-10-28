# @ Chương 7 · bài 7.3 — page fault, demand paging, copy-on-write, mmap vs read, thay trang. Chạy: docker run --rm --label oslab=1 --hostname oslab --cap-add SYS_ADMIN --cap-add PERFMON --security-opt seccomp=unconfined -v "$PWD/ch07":/lab/ch07 -w /lab/ch07 os-lab bash -c "phien c73-fault.sh 2>&1"
gcc -O2 touch.c -o touch
/usr/bin/time -v ./touch 256 nohuge 2>&1 | grep -E 'MiB|Maximum resident|page faults|Elapsed'
perf stat -e page-faults,minor-faults,major-faults ./touch 256 nohuge 2>&1 | grep -E 'MiB|faults|elapsed'
gcc -O2 demand.c -o demand
./demand
gcc -O2 filemap.c -o filemap
./filemap make /tmp/data 256
./filemap cached /tmp/data
./filemap evict /tmp/data; ./filemap cached /tmp/data
/usr/bin/time -v ./filemap rand /tmp/data 2>&1 | grep -E '^rand|Major|Minor|Elapsed'
./filemap rand /tmp/data
./filemap evict /tmp/data; ./filemap mmap /tmp/data; ./filemap mmap /tmp/data
./filemap evict /tmp/data; ./filemap read /tmp/data; ./filemap read /tmp/data
gcc -O2 cowpfn.c -o cowpfn
./cowpfn
gcc -O2 cow.c -o cow
for w in 0 1 10 50 100; do ./cow 512 $w nohuge; done
./cow 512 10 huge
python3 repl.py 3 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1
for n in 3 4; do python3 repl.py $n 1 2 3 4 1 2 5 1 2 3 4 5; done
for n in 4 5; do python3 repl.py $n 1 2 3 4 5 1 2 3 4 5 1 2 3 4 5 1 2 3 4 5; done
@ rm -f touch demand filemap cowpfn cow /tmp/data
