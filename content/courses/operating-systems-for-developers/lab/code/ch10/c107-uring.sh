# @ Chương 10 · bài 10.7 — io_uring: bị chặn trong container mặc định (seccomp của Docker), chạy được khi seccomp=unconfined
# @ trong container VỨT ĐI này; gộp lời gọi, SQPOLL, máy chủ echo io_uring, libuv + io_uring, sendfile của nginx.
# @ docker run --rm --label oslab=1 --name os-c107 --hostname oslab --security-opt seccomp=unconfined --device-read-bps /dev/vda:50mb \
# @   -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c107-uring.sh 2>&1"
@ gcc -O2 -Wall -o tai tai.c && gcc -O2 -Wall -o echo-epoll echo-epoll.c && gcc -O2 -Wall -o evict evict.c && gcc -O2 -Wall -o m5-uring m5-uring.c -luring
@ head -c 64M /dev/urandom > /tmp/data; for i in $(seq 0 15); do head -c 4M /dev/urandom > /tmp/f$i; done; mkdir -p /tmp/www; head -c 1M /dev/urandom > /tmp/www/big.bin; sync
grep Seccomp: /proc/self/status; cat /proc/sys/kernel/io_uring_disabled
curl -s https://raw.githubusercontent.com/moby/profiles/main/seccomp/default.json -o /tmp/d.json; python3 -c "import json; p=json.load(open('/tmp/d.json')); print('default action:', p['defaultAction'], 'errno', p['defaultErrnoRet'], '| io_uring syscalls allowed:', [n for r in p['syscalls'] for n in r['names'] if 'io_uring' in n])"
./m5-uring & P=$!; sleep 0.5; ./peek.sh $P; wait $P
gcc -O2 -Wall -o ubatch ubatch.c -luring && cat /tmp/data > /dev/null && for m in pread uring sqpoll sqspin; do ./ubatch /tmp/data $m 2000; done
strace -f -qq -c -o pr.txt ./ubatch /tmp/data pread 100; grep -E 'calls|pread|total' pr.txt
strace -f -qq -c -o ur.txt ./ubatch /tmp/data uring 100; grep -E 'calls|io_uring|total' ur.txt
strace -f -qq -c -o sq.txt ./ubatch /tmp/data sqpoll 100; grep -E 'calls|io_uring|total' sq.txt
strace -f -qq -c -o ss.txt ./ubatch /tmp/data sqspin 100; grep -E 'calls|io_uring|total' ss.txt
./ubatch /tmp/data sqspin 20000 & P=$!; sleep 1; ps -L -o tid,comm,stat,pcpu -p $P; ps -eLo tid,comm,stat,pcpu | grep iou-; wait $P
gcc -O2 -Wall -o echo-uring echo-uring.c -luring
./echo-uring 7400 & U=$!; ./echo-epoll 7000 > /dev/null & E=$!; sleep 0.3
strace -f -qq -c -p $E -o ep.txt & ST=$!; sleep 0.5; ./tai 7000 200 2 100 > /dev/null; kill -INT $ST; wait $ST; grep -v -- '----' ep.txt | head -6
strace -f -qq -c -p $U -o eu.txt & ST=$!; sleep 0.5; ./tai 7400 200 2 100 > /dev/null; kill -INT $ST; wait $ST; grep -v -- '----' eu.txt | head -3
./do-tai.sh epoll 7000 $E 2000
./do-tai.sh io_uring 7400 $U 2000
./do-tai.sh epoll 7000 $E 10000
./do-tai.sh io_uring 7400 $U 10000
@ kill $U $E
strace -f -qq -e trace=io_uring_setup,io_uring_enter -o uv0.txt node -e "require('fs').readFile('/etc/hostname', () => {})"; cut -c1-100 uv0.txt | head -4
UV_USE_IO_URING=1 strace -f -qq -e trace=io_uring_setup,io_uring_enter,openat,read -e signal=none -o uv.txt node -e "require('fs').readFile('/etc/hostname', () => {})"; echo "main thread: $(head -1 uv.txt | cut -d' ' -f1)"; grep -E 'io_uring_setup|io_uring_enter|hostname' uv.txt | head -6 | cut -c1-110
node loop-lag.js async
UV_USE_IO_URING=1 node loop-lag.js async
strace -f -qq -o sf.txt -e trace=sendfile,pread64,writev nginx -c /lab/ch10/nginx-min.conf & sleep 1
curl -s -o /dev/null -w '%{size_download} bytes\n' http://127.0.0.1:8080/big.bin; sleep 0.3; grep -vE 'writev\(2,|nginx-min' sf.txt | cut -c1-110
@ nginx -c /lab/ch10/nginx-min.conf -s stop 2>/dev/null; sleep 0.5
sed 's/sendfile on;/sendfile off;/' nginx-min.conf > /tmp/ngx-off.conf; strace -f -qq -o nf.txt -e trace=sendfile,pread64,writev nginx -c /tmp/ngx-off.conf & sleep 1
curl -s -o /dev/null -w '%{size_download} bytes\n' http://127.0.0.1:8080/big.bin; sleep 0.3; grep -vE 'writev\(2,|nginx-min' nf.txt | head -4 | cut -c1-110; grep -v nginx-min nf.txt | grep -cE 'pread64|writev\([0-9]'
@ nginx -c /tmp/ngx-off.conf -s stop 2>/dev/null
