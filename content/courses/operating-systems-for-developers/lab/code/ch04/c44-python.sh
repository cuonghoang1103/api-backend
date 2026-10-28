@ node slow.js > /tmp/slow.log 2>&1 &
@ sleep 1
python3 gil.py
python3 primes.py seq 1 2000000
taskset -c 0-3 python3 primes.py threads 4 2000000
taskset -c 0-3 python3 primes.py procs 4 2000000
./sweep.sh "python3 primes.py threads {k} 2000000" 1 2 4
./sweep.sh "python3 primes.py procs {k} 2000000" 1 2 4 8 10
python3 primes.py threads 4 2000000 & sleep 2; ps -L -o pid,lwp,pcpu,comm -p $!; top -b -n1 -p $! | tail -2; wait $!
python3 fetch.py seq 100
python3 fetch.py threads 100 10
python3 fetch.py threads 100 100
python3 fetch.py asyncio 100
python3 fetch.py asyncio 1000
python3 race.py inline
python3 race.py split
python3 race.py split
python3 race.py lock
python3 giai/hybrid.py
@ pkill -f slow.js
