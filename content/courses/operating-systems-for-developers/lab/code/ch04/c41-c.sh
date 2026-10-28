gcc -O2 -Wall -pthread primes.c -o primes
nproc
./primes seq 1 20000000
./primes fork 4 20000000 -v
./primes block 4 20000000 -v
./primes queue 4 20000000 -v
strace -f -e trace=clone,clone3,wait4 ./primes fork 2 1000 2>&1 | grep -E 'clone|wait4' | head -4
strace -f -e trace=clone,clone3 ./primes queue 2 1000 2>&1 | grep -E 'clone' | head -2
./sweep.sh "./primes block {k} 20000000" 1 2 4 6 8 10
./sweep.sh "./primes queue {k} 20000000" 1 2 4 6 8 10
./sweep.sh "./primes fork {k} 20000000" 1 2 4 6 8 10
gcc -O2 -pthread giai/mandel.c -o mandel
./mandel static 4 ascii
./mandel dynamic 4
./sweep.sh "./mandel dynamic {k}" 1 2 4 8
@ rm -f primes mandel
