# @ Chương 11 · bài 11.3 — strace thực chiến: vì sao hỏng, vì sao treo, vì sao chậm; đếm syscall mỗi request của Node/Java/
# @ Python; cái giá của strace; ltrace. Mạng ra ngoài: chỉ example.com.
# @ docker run --rm --label oslab=1 --name os-c113 --hostname oslab -v "$PWD/ch11":/lab/ch11 -w /lab/ch11 os-lab bash -c "phien c113-strace.sh 2>&1"
node cfg.js; echo "exit=$?"
strace -f -qq -Z -e trace=%file -o cfg.txt node cfg.js; grep -c . cfg.txt
grep settings cfg.txt
python3 hang.py & APP=$!; sleep 1
timeout 2 strace -p $APP; echo
kill $APP
strace -f -tt -T -e trace=connect,sendmmsg,sendto,recvfrom -o curl.txt curl -s -o /dev/null -w '%{http_code} dns=%{time_namelookup}s connect=%{time_connect}s total=%{time_total}s\n' http://example.com/
grep -E 'htons\((53|80)\)|GET /|HTTP/1.1 200' curl.txt | cut -c1-138
node server.js & NODE=$!; sleep 1
strace -f -qq -tt -T -e trace=accept4,setsockopt,epoll_ctl,read,writev,shutdown,close -p $NODE -o one.txt & ST=$!; sleep 1
curl -s http://127.0.0.1:3000/; sleep 0.3; kill -INT $ST; wait $ST
cut -c1-130 one.txt
TIMEFORMAT='%R s'
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-1000]"
strace -f -qq -c -p $NODE -o node.sc & ST=$!; sleep 1
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-1000]"
kill -INT $ST; wait $ST; head -7 node.sc; tail -1 node.sc
kill $NODE; sleep 0.5
python3 pyserver.py & PY=$!; sleep 1
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-200]"
strace -qq -tt -T -e trace=sendto,recvfrom -o client.txt curl -s -o /dev/null "http://127.0.0.1:3000/[1-2]"; cut -c1-118 client.txt
kill $PY; sleep 0.5
NODELAY=1 python3 pyserver.py & PY=$!; sleep 1
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-200]"
strace -f -qq -c -p $PY -o py.sc & ST=$!; sleep 1
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-1000]"
kill -INT $ST; wait $ST; grep -v '^100.00' py.sc; grep -m1 '^100.00' py.sc
kill $PY; sleep 0.5
javac HelloServer.java && java HelloServer & sleep 2
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-200]"
pkill -f HelloServer; sleep 1
java -Dsun.net.httpserver.nodelay=true HelloServer & sleep 2; JAVA=$(pgrep -f 'HelloServer$')
curl -s -o /dev/null "http://127.0.0.1:3000/[1-3000]"
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-1000]"
strace -f -qq -c -p $JAVA -o java.sc & ST=$!; sleep 1
time curl -s -o /dev/null "http://127.0.0.1:3000/[1-1000]"
kill -INT $ST; wait $ST; head -10 java.sc; tail -1 java.sc
kill $JAVA; sleep 0.5
strace -k -e trace=write ./raw > /dev/null
time dd if=/dev/zero of=/dev/null bs=1 count=100000 status=none
time strace -c -o /dev/null dd if=/dev/zero of=/dev/null bs=1 count=100000 status=none
time strace -o /dev/null -e trace=openat dd if=/dev/zero of=/dev/null bs=1 count=100000 status=none
time strace -o /dev/null --seccomp-bpf -f -e trace=openat dd if=/dev/zero of=/dev/null bs=1 count=100000 status=none
gcc -O2 words.c -o words && ./words /etc/services
ltrace -c ./words /etc/services 2>&1 | head -10
strace -c ./words /etc/services 2>&1 | tail -1
ltrace -S -e malloc+strtok+fgets ./words /etc/services 2>&1 | grep -m1 -B1 -A6 'read@SYS(3, "# Network'
