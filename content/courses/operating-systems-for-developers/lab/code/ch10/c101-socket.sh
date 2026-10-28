# @ Chương 10 · bài 10.1 — một kết nối là một fd: vòng đời socket (strace), hàng chờ accept (backlog), giá một kết nối.
# @ docker run --rm --label oslab=1 --name os-c101 --hostname oslab -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c101-socket.sh 2>&1"
gcc -O2 -Wall -o echo1 echo1.c && gcc -O2 -Wall -o noaccept noaccept.c && gcc -O2 -Wall -o dial dial.c && echo built
@ gcc -O2 -Wall -o tai tai.c && gcc -O2 -Wall -o echo-epoll echo-epoll.c
strace -qq -e trace=socket,setsockopt,bind,listen,accept,read,write,close -o echo1.txt ./echo1 7000 & sleep 0.5
printf 'hello\n' | nc -N 127.0.0.1 7000
sed -n '/^socket/,$p' echo1.txt; echo
E=$(pgrep -x echo1); (printf 'first\n'; sleep 3) | nc 127.0.0.1 7000 & sleep 0.5
ls -l /proc/$E/fd | awk 'NR>1 {print $9, $10, $11}'
ss -tnp '( sport = :7000 )' | cut -c1-120
printf 'second\n' | timeout 1 nc 127.0.0.1 7000; echo "second client: exit=$? (no echo)"
ss -ltn '( sport = :7000 )'
@ sleep 3; pkill -x echo1; sleep 0.2
./noaccept 4 & sleep 0.3
./dial 7100 8 1500
ss -ltn '( sport = :7100 )'
nstat -az TcpExtListenOverflows TcpExtListenDrops
@ pkill -x noaccept; sleep 0.2
@ node -e "require('net').createServer().listen(7201)" & java Listen.java 7202 & python3 -m http.server 7203 > /dev/null 2>&1 & nginx -c /lab/ch10/nginx-min.conf -g 'daemon off;' & sleep 3
ss -ltnp | awk 'NR==1 || /:720[1-3]|:8080/' | cut -c1-110
@ pkill node; pkill java; pkill -f http.server; nginx -c /lab/ch10/nginx-min.conf -s stop 2>/dev/null; sleep 0.3
cat /proc/sys/net/core/somaxconn
./echo-epoll 7000 > /dev/null & S=$!; sleep 0.3
grep -E '^(TCP|sockets)' /proc/net/sockstat; grep -E '^(Slab|SUnreclaim):' /proc/meminfo
./tai 7000 10000 3 0 & T=$!; sleep 1.5
grep -E '^(TCP|sockets)' /proc/net/sockstat; grep -E '^(Slab|SUnreclaim):' /proc/meminfo
./xem.sh $S
wait $T
@ kill $S
