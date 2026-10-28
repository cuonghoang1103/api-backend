@ node slow.js > /tmp/slow.log 2>&1 &
@ sleep 1
node -v
node primes.js 0 20000000
./sweep.sh "node primes.js {k} 20000000" 1 2 4 8 10
node fetch.js seq 100
node fetch.js all 100
node fetch.js limit 100 10
node fetch.js all 1000
@ node cluster.js 1 > /tmp/c.log 2>&1 &
@ sleep 1
cat /tmp/c.log
node hit.js http://localhost:8080/ 400 32
@ pkill -f cluster.js; sleep 0.5
@ node cluster.js 0 > /tmp/c.log 2>&1 &
@ sleep 1
cat /tmp/c.log
node hit.js http://localhost:8080/ 400 32 > /tmp/h.txt & sleep 2; ss -ltn 'sport = :8080'; wait $!; cat /tmp/h.txt
@ pkill -f cluster.js; sleep 0.5
@ node cluster.js 4 > /tmp/c.log 2>&1 &
@ sleep 1
cat /tmp/c.log
ps -o pid,ppid,rss,nlwp,args --ppid $(pgrep -f 'cluster.js 4' | head -1)
node hit.js http://localhost:8080/ 400 32
@ pkill -f cluster.js; sleep 0.5
@ node cluster.js 8 > /tmp/c.log 2>&1 &
@ sleep 1
node hit.js http://localhost:8080/ 400 32
@ pkill -f cluster.js; sleep 0.5
@ node giai/pool-server.js inline > /tmp/p.log 2>&1 &
@ sleep 0.5
cat /tmp/p.log
node hit.js http://localhost:8080/hash 80 20 > /dev/null & sleep 0.3; curl -s -o /dev/null -w 'GET /fast while /hash runs: %{time_total} s\n' localhost:8080/fast; wait $!
@ pkill -f pool-server; sleep 0.5
@ node giai/pool-server.js pool 4 > /tmp/p.log 2>&1 &
@ sleep 0.5
cat /tmp/p.log
node hit.js http://localhost:8080/hash 80 20 > /dev/null & sleep 0.3; curl -s -o /dev/null -w 'GET /fast while /hash runs: %{time_total} s\n' localhost:8080/fast; wait $!
node hit.js http://localhost:8080/hash 80 20
@ pkill -f pool-server; pkill -f slow.js
