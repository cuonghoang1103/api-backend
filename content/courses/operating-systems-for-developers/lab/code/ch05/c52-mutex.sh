gcc -O2 -pthread lockcost.c -o lockcost
for m in none mutex spin atomic local; do ./lockcost $m 1 10000000; done
for m in none mutex spin atomic local; do ./lockcost $m 4 2500000; done
strace -f -c -e trace=futex ./lockcost mutex 1 1000000 2>&1 | tail -4
strace -f -c -e trace=futex ./lockcost mutex 4 2500000 2>&1 | tail -4
/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./lockcost mutex 32 250000
/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./lockcost spin 32 250000
java Locks.java
gcc -O2 -pthread pc.c -o pc
./pc while
./pc if
./pc if
@ rm -f lockcost pc
