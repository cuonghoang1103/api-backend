# @ Chương 10 · bài 10.8 — backpressure và bộ đệm socket, khách chậm, và các loại hạn chờ (timeout).
# @ Container vứt đi với tcp_syn_retries=2 (sysctl theo network namespace, chỉ ảnh hưởng container này) để đo hạn chờ connect:
# @ docker run --rm --label oslab=1 --name os-c108 --hostname oslab --sysctl net.ipv4.tcp_syn_retries=2 -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c108-backpressure.sh 2>&1"
@ gcc -O2 -Wall -o sndbuf sndbuf.c && gcc -O2 -Wall -pthread -o pool-http pool-http.c
cat /proc/sys/net/ipv4/tcp_wmem /proc/sys/net/ipv4/tcp_rmem
./sndbuf
./sndbuf 4096
node flood.js ignore & sleep 0.5; python3 slow.py 7600; wait
node flood.js respect & sleep 0.5; python3 slow.py 7600; wait
./pool-http none & P=$!; sleep 0.3
python3 slowloris.py 7700 8 6 & L=$!; sleep 1
curl -s -m 4 -o /dev/null -w 'normal request: HTTP %{http_code} after %{time_total} s\n' http://127.0.0.1:7700/; echo "curl exit=$?"
wait $L; kill $P
./pool-http idle & P=$!; sleep 0.3
python3 slowloris.py 7700 8 6 & L=$!; sleep 1
curl -s -m 4 -o /dev/null -w 'normal request: HTTP %{http_code} after %{time_total} s\n' http://127.0.0.1:7700/; echo "curl exit=$?"
wait $L; kill $P
./pool-http deadline & P=$!; sleep 0.3
python3 slowloris.py 7700 8 6 & L=$!; sleep 1
curl -s -m 4 -o /dev/null -w 'normal request: HTTP %{http_code} after %{time_total} s\n' http://127.0.0.1:7700/; echo "curl exit=$?"
wait $L; kill $P
node slow-node.js & N=$!; sleep 0.5
python3 slowloris.py 7800 1000 8 & L=$!; sleep 1
curl -s -o /dev/null -w 'normal request to Node: HTTP %{http_code} after %{time_total} s\n' http://127.0.0.1:7800/
wait $L; kill $N; sleep 0.3
CHECK=500 node slow-node.js & N=$!; sleep 0.5
python3 slowloris.py 7800 1 5
@ kill $N; sleep 0.3
cat /proc/sys/net/ipv4/tcp_syn_retries
TIMEFORMAT='%R s'; time python3 -c "import socket; socket.create_connection(('10.255.255.1', 5432))" 2>&1 | tail -1
time python3 -c "import socket; socket.create_connection(('10.255.255.1', 5432), timeout=1)" 2>&1 | tail -1
sysctl net.ipv4.tcp_keepalive_time net.ipv4.tcp_keepalive_intvl net.ipv4.tcp_keepalive_probes
