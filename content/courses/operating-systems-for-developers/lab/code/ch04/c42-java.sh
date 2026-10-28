@ node slow.js > /tmp/slow.log 2>&1 &
@ sleep 1
java -version 2>&1 | head -1
taskset -c 0 java Primes.java threads 1 20000000
for m in threads pool cf stream virtual; do ./best3.sh taskset -c 0-3 java Primes.java $m 4 20000000; done
./sweep.sh "java Primes.java pool {k} 20000000" 1 2 4 8 10
./sweep.sh "java Primes.java stream {k} 20000000" 1 2 4 8 10
cat /tmp/slow.log
java Fetch.java seq 100
java Fetch.java pool 100 10
java Fetch.java pool 100 100
java Fetch.java virtual 100
java Fetch.java async 100
taskset -c 0 java Fetch.java virtual 100
java giai/Limited.java 300 20
@ pkill -f slow.js
