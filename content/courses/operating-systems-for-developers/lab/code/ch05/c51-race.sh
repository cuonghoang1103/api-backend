nproc
gcc -O0 -pthread race.c -o race
./race 1 1000000
./race 2 1000000
for i in 1 2 3 4 5; do ./race 4 1000000; done
objdump -d --no-show-raw-insn race | awk '/<worker>:/,/ret/' | sed -n '6,12p'
taskset -c 0 ./race 4 1000000
gcc -O2 -pthread race.c -o race-O2
for i in 1 2 3; do ./race-O2 4 1000000; done
objdump -d --no-show-raw-insn race-O2 | awk '/<worker>:/,/ret/'
java Race.java
java Race.java
node race-sab.js plain
node race-sab.js plain
@ rm -f race race-O2
