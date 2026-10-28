# @ Chương 10 · bài 10.5 — Node/libuv, nginx, Java NIO, Netty, Go, Python asyncio: cùng một epoll bên dưới (strace từng cái),
# @ rồi cùng một tải 2.000 kết nối × 10 tin/giây để so luồng, RSS, CPU, độ trễ. Go 1.27.3 (go.dev, sha256 a06e9930…f49) và
# @ Netty 4.2.19.Final (Maven Central, sha1 khớp) gắn CHỈ-ĐỌC vào container vứt đi:
# @ docker run --rm --label oslab=1 --name os-c105 --hostname oslab -v "$PWD/ch10":/lab/ch10 -v <go>:/usr/local/go:ro \
# @   -v <netty-jars>:/opt/netty:ro -e PATH=/usr/local/go/bin:$PATH -e GOCACHE=/tmp/gc -w /lab/ch10 os-lab-ch10 bash -c "phien c105-runtime.sh 2>&1"
@ gcc -O2 -Wall -o tai tai.c && CGO_ENABLED=0 go build -o echo-go echo.go && CGO_ENABLED=0 go build -o echo-go-copy echo-copy.go && javac -cp "/opt/netty/*" -d /tmp/jc EchoNio.java EchoNetty.java
node --version; python3 --version; java -version 2>&1 | head -1; go version; nginx -v
node echo.js 7301 & NODE=$!
python3 echo_async.py 7302 & PY=$!
java -cp /tmp/jc EchoNio 7303 & NIO=$!
java -cp "/tmp/jc:/opt/netty/*" EchoNetty 7304 & NETTY=$!
./echo-go 7305 & GO=$!
./echo-go-copy 7306 & GOC=$!
strace -f -qq -o ngx.txt -e trace=epoll_create1,epoll_ctl,epoll_wait,epoll_pwait,accept4,recvfrom,writev,close nginx -c /lab/ch10/nginx-min.conf -g 'daemon off;' & sleep 3
@ for p in 7301 7302 7303 7304 7305 7306; do for i in 1 2 3; do printf 'warm\n' | nc -N 127.0.0.1 $p > /dev/null; done; done
@ T='trace=epoll_ctl,epoll_pwait,epoll_pwait2,epoll_wait,accept,accept4,read,recvfrom,write,writev,sendto'
strace -f -qq -e signal=none -e $T -p $NODE -o node.txt & ST=$!; sleep 1; printf 'hi\n' | nc -N 127.0.0.1 7301; sleep 0.3; kill -INT $ST; wait $ST; cut -c1-118 node.txt
strace -f -qq -e signal=none -e $T -p $PY -o py.txt & ST=$!; sleep 1; printf 'hi\n' | nc -N 127.0.0.1 7302; sleep 0.3; kill -INT $ST; wait $ST; cut -c1-118 py.txt
strace -f -qq -e signal=none -e $T -p $NIO -o nio.txt & ST=$!; sleep 1; printf 'hi\n' | nc -N 127.0.0.1 7303; sleep 0.3; kill -INT $ST; wait $ST; cut -c1-118 nio.txt
strace -f -qq -e signal=none -e $T -p $NETTY -o netty.txt & ST=$!; sleep 1; printf 'hi\n' | nc -N 127.0.0.1 7304; sleep 0.3; kill -INT $ST; wait $ST; grep -v 'epoll_pwait2(.*= 0$' netty.txt | cut -c1-118
strace -f -qq -e signal=none -e $T -p $GO -o go.txt & ST=$!; sleep 1; printf 'hi\n' | nc -N 127.0.0.1 7305; sleep 0.3; kill -INT $ST; wait $ST; cut -c1-118 go.txt
curl -s http://127.0.0.1:8080/hello; sleep 0.3; grep -E 'EPOLLEXCLUSIVE' ngx.txt | cut -c1-118; grep -A8 'accept4(4' ngx.txt | grep -v EAGAIN | cut -c1-118
@ nginx -c /lab/ch10/nginx-min.conf -s stop 2>/dev/null; sleep 1; nginx -c /lab/ch10/nginx-min.conf -g 'daemon off;' & sleep 1
for p in $NODE $PY $NIO $NETTY $GO; do echo "$(cat /proc/$p/comm) ($(ls /proc/$p/task | wc -l) threads): $(cat /proc/$p/task/*/comm | sort | uniq -c | sort -rn | awk '{printf "%s×%s ", $1, $2}')"; done
# Same load for everyone: 2,000 connections, each sends 64 bytes 10 times a second (20,000 messages/s, 3 s) ||| Cùng một tải cho tất cả: 2.000 kết nối, mỗi kết nối gửi 64 byte 10 lần mỗi giây (20.000 tin/giây, 3 giây)
./do-tai.sh node 7301 $NODE
./do-tai.sh python 7302 $PY
./do-tai.sh java-nio 7303 $NIO
./do-tai.sh netty 7304 $NETTY
./do-tai.sh go 7305 $GO
./do-tai.sh go-copy 7306 $GOC
strace -f -qq -c -p $GOC -o goc.txt & ST=$!; sleep 0.5; ./tai 7306 200 1 100 > /dev/null; kill -INT $ST; wait $ST; head -7 goc.txt
./tai 8080 2000 3 0 & T=$!; sleep 2; for w in $(pgrep -f 'nginx: worker'); do ./xem.sh $w; done; wait $T
@ kill $NODE $PY $NIO $NETTY $GO $GOC; nginx -c /lab/ch10/nginx-min.conf -s stop 2>/dev/null
