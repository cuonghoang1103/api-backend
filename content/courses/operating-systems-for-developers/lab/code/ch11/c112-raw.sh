# @ Chương 11 · bài 11.2 — tự viết syscall trần (syscall(), svc #0, không libc) và cách Node/JVM/Go bọc syscall.
# @ Go KHÔNG có trong ảnh os-lab: tải go1.27.3.linux-arm64.tar.gz từ go.dev (sha256 a06e9930…f49, khớp go.dev/dl) rồi gắn
# @ chỉ-đọc vào container vứt đi:
# @ docker run --rm --label oslab=1 --name os-c112 --hostname oslab -v "$PWD/ch11":/lab/ch11 -v <goroot>/go:/usr/local/go:ro \
# @   -e PATH=/usr/local/go/bin:/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -e GOCACHE=/tmp/gc -e GOPATH=/tmp/gp \
# @   -w /lab/ch11 os-lab bash -c "phien c112-raw.sh 2>&1"
gcc -O2 -Wall raw.c -o raw && ./raw
strace -qq -e trace=write ./raw > /dev/null
gcc -O2 -static -nostdlib -fno-stack-protector -o tiny tiny.c && ls -l tiny
./tiny; echo "exit=$?"
strace ./tiny > /dev/null
go version
CGO_ENABLED=0 go build -o hello-go hello.go && ls -l hello-go
ldd hello-go
go tool objdump -s 'internal/runtime/syscall/linux.Syscall6' hello-go | grep -E 'R8|SVC'
strace -f -qq -e trace=write -o go.txt ./hello-go > /dev/null; grep 'hi from' go.txt
strace -f -c -o goc.txt ./hello-go > /dev/null; head -8 goc.txt; tail -1 goc.txt
objdump -T $(which node) | grep -wE 'write|epoll_pwait|epoll_ctl|accept4' | awk '{print $NF, $(NF-1)}'
strace -f -qq -e trace=openat,connect,accept4 -o uv.txt node uv.js; head -1 uv.txt | cut -d' ' -f1; grep -E 'hostname|connect\(|accept4\(' uv.txt
javac Hello.java && strace -f -qq -e trace=clone,clone3 -o jt.txt java Hello > /dev/null; grep -c clone jt.txt
objdump -T /opt/java/openjdk/lib/libjava.so | grep -wE 'write|read' | awk '{print $NF, $(NF-1)}'
strace -f -c -o jc.txt java Hello > /dev/null; head -9 jc.txt; tail -1 jc.txt
