# @ Chương 17 · bài 17.2 — dự án máy chủ HTTP có thread pool. docker run … --cpus 4 -v lab/code:/lab -w /lab/ch17 os-lab bash -c "phien c172-server.sh"
# The reference solution passes the acceptance tests ||| Lời giải mẫu qua bộ kiểm nghiệm thu
wc -l server/tpserver.c server/loadgen.c
server/test-server.sh
# Two planted bugs, each caught by exactly the test written for it ||| Hai lỗi cài sẵn, mỗi lỗi bị đúng ca kiểm của nó bắt
@ rm -rf /tmp/b1 /tmp/b2; mkdir -p /tmp/b1 /tmp/b2; cp server/loadgen.c server/test-server.sh /tmp/b1; cp server/loadgen.c server/test-server.sh /tmp/b2
sed 's|        close(fd);  |        /* forgot close(fd) */|' server/tpserver.c > /tmp/b1/tpserver.c; /tmp/b1/test-server.sh | grep -E 'FAIL|SCORE'
sed 's|    pthread_sigmask(SIG_BLOCK, &ss, NULL); |    /* no signal handling: SIGTERM kills at once */|' server/tpserver.c > /tmp/b2/tpserver.c; /tmp/b2/test-server.sh | grep -E 'FAIL|SCORE'
# Measuring it: 4 threads, each request "waits for the database" 10 ms ||| Đo: 4 luồng, mỗi request "chờ CSDL" 10 ms
@ gcc -O2 -pthread -o /tmp/tps server/tpserver.c; gcc -O2 -pthread -o /tmp/lg server/loadgen.c
@ /tmp/tps 8001 --threads 4 --queue 4096 2> /dev/null & sleep 0.3
/tmp/lg 127.0.0.1 8001 '/work?ms=10' 4 3
/tmp/lg 127.0.0.1 8001 '/work?ms=10' 16 3
/tmp/lg 127.0.0.1 8001 '/work?ms=10' 64 3
# Same 64 clients, but the queue holds only 8: shed load instead of making everyone wait ||| Vẫn 64 khách, nhưng hàng đợi chỉ chứa 8: cắt tải thay vì bắt mọi người chờ
@ /tmp/tps 8002 --threads 4 --queue 8 2> /dev/null & sleep 0.3
/tmp/lg 127.0.0.1 8002 '/work?ms=10' 64 3
# More threads help when requests WAIT; they do not help when requests COMPUTE ||| Thêm luồng có ích khi request CHỜ; vô ích khi request TÍNH
@ /tmp/tps 8003 --threads 32 --queue 4096 2> /dev/null & sleep 0.3
/tmp/lg 127.0.0.1 8003 '/work?ms=10' 64 3
nproc
@ for t in 1 4 16; do /tmp/tps 801$t --threads $t --queue 4096 2> /dev/null & done; sleep 0.3
for t in 1 4 16; do echo "threads=$t"; /tmp/lg 127.0.0.1 801$t '/cpu?n=2' 16 3; done
# Graceful shutdown, seen from the server's log ||| Tắt êm, nhìn từ log của máy chủ
@ /tmp/tps 8020 --threads 2 --queue 8 2> /tmp/g.log & GP=$!; sleep 0.3
(for i in 1 2 3; do curl -s "localhost:8020/work?ms=800" & done; wait) & sleep 0.2; kill -TERM $GP; wait $GP; echo "exit=$?"; sleep 1; cat /tmp/g.log
@ pkill tps; sleep 0.2
