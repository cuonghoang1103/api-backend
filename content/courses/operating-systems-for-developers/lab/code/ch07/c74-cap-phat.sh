# @ Chương 7 · bài 7.4 — bộ cấp phát, GC, rò rỉ. Chạy: docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch07":/lab/ch07 -w /lab/ch07 os-lab bash -c "phien c74-cap-phat.sh 2>&1"
gcc -O0 mal.c -o mal
strace -e trace=brk,mmap,munmap ./mal 2>&1 | sed -n '/-- malloc(100)/,$p'
gcc -O2 -pthread arena.c -o arena
for n in 1 4 16 100; do ./arena $n; done
MALLOC_ARENA_MAX=2 ./arena 100
gcc -O2 frag.c -o frag
./frag
gcc -g -O0 leak.c -o leak
valgrind --leak-check=full ./leak 2>&1 | grep -vE '^==[0-9]+== *$' | tail -12
gcc -g -O0 -fsanitize=address leak.c -o leak-asan
./leak-asan 2>&1 | head -7
./leak-asan uaf 2>&1 | sed -n '2,4p;9,12p'
node gc.js limits
node --max-old-space-size=64 gc.js limits | head -1
node --max-old-space-size=64 gc.js grow 2>&1 | grep -E 'objects|FATAL'; echo "exit code ${PIPESTATUS[0]}"
node gc.js snapshot
node --expose-gc leak.js bug
node --expose-gc leak.js fixed
javac Gc.java
java -XX:+PrintFlagsFinal -version 2>/dev/null | grep -E ' (MaxHeapSize|MaxRAMPercentage|UseG1GC) '
java -Xmx256m -XX:+UseG1GC Gc
java -Xmx256m -XX:+UseG1GC -Xlog:gc Gc | grep 'Pause Young' | sed -n '1,3p'
java -Xmx256m -XX:+UseZGC -XX:+ZGenerational Gc
java -Xmx256m -XX:+UseZGC -XX:+ZGenerational -Xlog:gc+phases Gc | grep 'Pause' | sed -n '1,3p'
@ rm -f mal arena frag leak leak-asan *.class
