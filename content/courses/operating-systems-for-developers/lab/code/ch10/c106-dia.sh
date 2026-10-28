# @ Chương 10 · bài 10.6 — I/O đĩa vs I/O mạng trong event loop: epoll không nhận file thường, page cache trúng/trượt,
# @ Node đẩy việc file sang pool libuv (và hệ quả), Go chặn cả luồng OS khi đọc file. File thử nằm trong /tmp của container.
# @ Đĩa bị GHÌM 50 MB/s (--device-read-bps, như một VPS rẻ hay ổ mạng hết "burst") để thấy rõ hệ quả của đĩa chậm:
# @ docker run --rm --label oslab=1 --name os-c106 --hostname oslab --device-read-bps /dev/vda:50mb -v "$PWD/ch10":/lab/ch10 \
# @   -v <go>:/usr/local/go:ro -e PATH=/usr/local/go/bin:$PATH -e GOCACHE=/tmp/gc -w /lab/ch10 os-lab-ch10 bash -c "phien c106-dia.sh 2>&1"
@ gcc -O2 -Wall -o filepoll filepoll.c && gcc -O2 -Wall -o evict evict.c && gcc -O2 -Wall -o incache incache.c && gcc -O2 -Wall -o randread randread.c && CGO_ENABLED=0 go build -o gofile gofile.go
@ head -c 64M /dev/urandom > /tmp/data; for i in $(seq 0 15); do head -c 4M /dev/urandom > /tmp/f$i; done; for i in $(seq 0 31); do head -c 2M /dev/urandom > /tmp/small$i; done; sync
cat /sys/fs/cgroup/io.max
./filepoll /tmp/data
./evict /tmp/data; ./incache /tmp/data
./randread /tmp/data 500
./incache /tmp/data
./randread /tmp/data 500
./evict /tmp/data; TIMEFORMAT='%R s'; time cat /tmp/data > /dev/null
time cat /tmp/data > /dev/null
node threads.js
strace -f -qq -e trace=openat,read -e signal=none -o nodefs.txt node -e "require('fs').readFile('/etc/hostname', () => {})"; echo "main thread: $(head -1 nodefs.txt | cut -d' ' -f1)"; sed -n '/"\/etc\/hostname"/,$p' nodefs.txt | grep -E 'hostname|read\(1[67],' | head -5 | cut -c1-100
node loop-lag.js sync
node loop-lag.js async
UV_THREADPOOL_SIZE=64 node loop-lag.js async
UV_USE_IO_URING=1 strace -f -qq -e trace=io_uring_setup -o ur.txt node -e "require('fs').readFile('/etc/hostname', () => {})"; cat ur.txt
./evict /tmp/small*; ./gofile
