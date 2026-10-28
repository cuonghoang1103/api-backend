# @ Chương 15 · bài 15.4 — profiler của từng ngôn ngữ trên CÙNG một dịch vụ chậm (orders.js / Orders.java / orders.py):
# @ Node --cpu-prof và --prof · Java JFR và async-profiler 4.6 · Python cProfile và py-spy 0.4.2; sửa (Set) rồi đo lại.
# @ docker run --rm --label oslab=1 --hostname oslab --privileged -v "$PWD/ch15":/lab/ch15 -v <c15>/tools:/tools:ro \
# @   -w /lab/ch15 os-lab bash -c "phien c154-prof.sh 2>&1" > out/c154-prof.out.txt
# @ /tools: async-profiler-4.6-linux-arm64 (github.com/async-profiler), py-spy 0.4.2 (wheel PyPI), FlameGraph.
# @ Đo bằng tai.js vòng kín 1 kết nối, 5 giây, SAU khi đã làm nóng (JIT) — chạy tuần tự, máy soạn bài dùng chung nên số có nhiễu.
@ export PATH=$PATH:/tools/async-profiler-4.6-linux-arm64/bin:/tools/pyspy/py_spy-0.4.2.data/scripts
@ cd /tmp && cp /lab/ch15/*.js /lab/ch15/*.py /lab/ch15/*.java . && mkdir -p /lab/ch15/fg
@ cpu() { awk '{print ($14 + $15) * 10}' /proc/$1/stat; }
node orders.js 8081 & N=$!; sleep 0.5
node tai.js http://127.0.0.1:8081/report --closed 1 --duration 5
@ kill $N; wait $N 2>/dev/null
node --cpu-prof --cpu-prof-dir=prof orders.js 8082 & N=$!; sleep 0.5
node tai.js http://127.0.0.1:8082/report --closed 1 --duration 5 > /dev/null; kill -INT $N; wait $N; ls prof
node cpuprofile.js prof/*.cpuprofile 4
node --prof orders.js 8083 & N=$!; sleep 0.5
node tai.js http://127.0.0.1:8083/report --closed 1 --duration 5 > /dev/null; kill -INT $N; wait $N; ls isolate*.log
node --prof-process isolate*.log 2>/dev/null | sed -n '/Bottom up/,$p' | sed -n '6,10p'
FIX=1 node orders.js 8084 & N=$!; sleep 0.5
node tai.js http://127.0.0.1:8084/report --closed 1 --duration 5
@ kill $N; wait $N 2>/dev/null
java -XX:StartFlightRecording=filename=/tmp/orders.jfr,settings=profile Orders.java 8085 > /tmp/java.log 2>&1 & J=$!; sleep 6; tail -1 /tmp/java.log
node tai.js http://127.0.0.1:8085/report --closed 1 --duration 3 > /dev/null
C0=$(cpu $J); node tai.js http://127.0.0.1:8085/report --closed 1 --duration 5; echo "JVM CPU time during those 5 s: $(( $(cpu $J) - C0 )) ms"
node tai.js http://127.0.0.1:8085/report --closed 1 --duration 6 > /dev/null & T=$!; sleep 1
asprof -d 4 -e cpu -i 1ms -o collapsed -f /tmp/java.folded $J; python3 folded.py /tmp/java.folded 4
@ wait $T
jcmd $J JFR.dump filename=/tmp/orders.jfr > /dev/null; jfr view --width 100 hot-methods /tmp/orders.jfr | sed -n '3,8p'
perl /tools/flamegraph.pl --title "Orders.java (async-profiler -e cpu)" --width 1200 /tmp/java.folded > /lab/ch15/fg/java.svg
@ kill $J; wait $J 2>/dev/null
java -Dsun.net.httpserver.nodelay=true Orders.java 8086 > /tmp/java2.log 2>&1 & J=$!; sleep 6
node tai.js http://127.0.0.1:8086/report --closed 1 --duration 3 > /dev/null
C0=$(cpu $J); node tai.js http://127.0.0.1:8086/report --closed 1 --duration 5; echo "JVM CPU time during those 5 s: $(( $(cpu $J) - C0 )) ms"
@ kill $J; wait $J 2>/dev/null
FIX=1 java -Dsun.net.httpserver.nodelay=true Orders.java 8087 > /tmp/java3.log 2>&1 & J=$!; sleep 6
node tai.js http://127.0.0.1:8087/report --closed 1 --duration 3 > /dev/null
node tai.js http://127.0.0.1:8087/report --closed 1 --duration 5
@ kill $J; wait $J 2>/dev/null
python3 -c "import cProfile, orders; cProfile.run('for _ in range(30): orders.report(4000)', sort='tottime')" | sed -n '1,10p' | cut -c1-110
python3 orders.py 8088 & P=$!; sleep 1
C0=$(cpu $P); node tai.js http://127.0.0.1:8088/report --closed 1 --duration 5; echo "Python CPU time during those 5 s: $(( $(cpu $P) - C0 )) ms"
node tai.js http://127.0.0.1:8088/report --closed 1 --duration 6 > /dev/null & T=$!; sleep 1
py-spy dump --pid $P | grep -B1 -A3 'active'
py-spy record -d 4 -r 99 -p $P -f raw -o /tmp/py.folded 2>&1 | tail -1; python3 folded.py /tmp/py.folded 4
perl /tools/flamegraph.pl --title "orders.py (py-spy)" --width 1200 /tmp/py.folded > /lab/ch15/fg/python.svg
@ wait $T; kill $P; wait $P 2>/dev/null
NODELAY=1 python3 orders.py 8089 & P=$!; sleep 1
node tai.js http://127.0.0.1:8089/report --closed 1 --duration 5
@ kill $P; wait $P 2>/dev/null
NODELAY=1 FIX=1 python3 orders.py 8090 & P=$!; sleep 1
node tai.js http://127.0.0.1:8090/report --closed 1 --duration 5
@ kill $P; wait $P 2>/dev/null
