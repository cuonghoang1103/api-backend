@ node loop-server.js > server.log 2>&1 &
@ sleep 1
cat server.log
node load.js 'http://localhost:8080/io?ms=200' 100
curl -s 'http://localhost:8080/lag'
curl -s 'http://localhost:8080/cpu?ms=1500' > /dev/null & sleep 0.1; curl -s -o /dev/null -w 'GET /fast took %{time_total} s\n' http://localhost:8080/fast; wait $!
curl -s 'http://localhost:8080/lag'
node load.js 'http://localhost:8080/cpu?ms=100' 10
grep Threads /proc/$(pgrep -f loop-server)/status
@ pkill -f loop-server
node pool.js
UV_THREADPOOL_SIZE=8 node pool.js
javac -d . PoolServer.java
@ java PoolServer fixed 10 > j.log & sleep 1.5
cat j.log; node load.js http://localhost:8081/ 100; grep Threads /proc/$(pgrep -f PoolServer)/status
@ pkill -f PoolServer; sleep 0.5
@ java PoolServer fixed 200 > j.log & sleep 1.5
cat j.log; node load.js http://localhost:8081/ 100; grep Threads /proc/$(pgrep -f PoolServer)/status
@ pkill -f PoolServer; sleep 0.5
@ java PoolServer virtual > j.log & sleep 1.5
cat j.log; node load.js http://localhost:8081/ 100; grep Threads /proc/$(pgrep -f PoolServer)/status
@ pkill -f PoolServer
