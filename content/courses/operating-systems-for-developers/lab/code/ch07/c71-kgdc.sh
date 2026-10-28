# @ Chương 7 · bài 7.1 — không gian địa chỉ. Chạy: docker run --rm --label oslab=1 --hostname oslab --security-opt seccomp=unconfined -v "$PWD/ch07":/lab/ch07 -w /lab/ch07 os-lab bash -c "phien c71-kgdc.sh 2>&1"
uname -m; getconf PAGESIZE
gcc -O0 -g layout.c -o layout
./layout
./layout maps | tail -n +10
@ ./layout wait > /dev/null & P=$!; sleep 0.3
pmap -x $P
@ kill $P; wait $P 2>/dev/null
cat /proc/sys/kernel/randomize_va_space
for i in 1 2 3; do ./layout short; done
for i in 1 2 3; do setarch -R ./layout short; done
gcc -O0 -no-pie layout.c -o layout-nopie; file layout layout-nopie | cut -c1-80
for i in 1 2 3; do ./layout-nopie short; done
ulimit -s
gcc -O0 rec.c -o rec
./rec; echo "exit code $?"
(ulimit -s 2048; ./rec; echo "exit code $?")
node -e "let d = 0; function f() { d++; f(); } try { f(); } catch (e) { console.log(e.constructor.name + ': ' + e.message + ' after ' + d + ' calls'); }"
javac Deep.java Idle.java
java Deep
java -Xss256k Deep
gcc -O2 reserve.c -o reserve
./reserve 1024 100
@ ./reserve 1024 100 wait > /dev/null & P=$!; sleep 0.3
ps -o pid,vsz,rss,comm -p $P
@ kill $P; wait $P 2>/dev/null
@ node -e "setTimeout(() => {}, 4000)" & N=$!; java Idle & J=$!; sleep 2
ps -o pid,vsz,rss,nlwp,comm -p $N,$J
grep -E '^(Rss|Pss|Shared_Clean|Private_Dirty):' /proc/$N/smaps_rollup
@ wait
gcc -O2 pss.c -o pss
./pss 200 3
@ rm -f layout layout-nopie rec reserve pss *.class
