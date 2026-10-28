gcc -O2 -Wall -pthread amdahl.c -o amdahl
gcc -O2 -Wall -pthread primes.c -o primes
./amdahl 1 10
./sweep.sh "./amdahl {k} 0" 1 2 4 8 10
./sweep.sh "./amdahl {k} 10" 1 2 4 8 10
python3 predict.py 10 1 2 4 8 10
./sweep.sh "./amdahl {k} 25" 1 2 4 8 10
python3 predict.py 25 1 2 4 8 10
for k in 1 2 4 8 10; do taskset -c 0-$((k-1)) ./amdahl $k 10 grow; done
./sweep.sh "./amdahl {k} 10" 1 2 4 8 10 | python3 giai/karp.py -
./sweep.sh "./primes queue {k} 20000000" 1 2 4 8 10 | python3 giai/karp.py -
taskset -c 0-1 java Sizing.java 10 0 1 2 4 8
taskset -c 0-1 java Sizing.java 10 40 1 2 4 8 10 16 32 64
taskset -c 0-1 java Sizing.java 2 98 10 50 100 200
./best3.sh taskset -c 0 ./primes seq 1 2000000; ./best3.sh taskset -c 0-3 ./primes queue 4 2000000
./best3.sh taskset -c 0 java Primes.java threads 1 2000000; ./best3.sh taskset -c 0-3 java Primes.java pool 4 2000000
./best3.sh taskset -c 0 node primes.js 0 2000000; ./best3.sh taskset -c 0-3 node primes.js 4 2000000
./best3.sh taskset -c 0 python3 primes.py seq 1 2000000; ./best3.sh taskset -c 0-3 python3 primes.py threads 4 2000000; ./best3.sh taskset -c 0-3 python3 primes.py procs 4 2000000
@ rm -f amdahl primes
