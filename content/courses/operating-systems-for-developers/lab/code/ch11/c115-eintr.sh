# @ Chương 11 · bài 11.5 — errno, tín hiệu cắt ngang syscall (EINTR, SA_RESTART), chặn vs không chặn (EAGAIN), SIGPIPE,
# @ và runtime xử lý hộ ra sao (Python PEP 475, Go async preemption bằng SIGURG). Go gắn từ go.dev như kịch bản 11.2:
# @ docker run --rm --label oslab=1 --name os-c115 --hostname oslab -v "$PWD/ch11":/lab/ch11 -v <goroot>/go:/usr/local/go:ro \
# @   -e PATH=/usr/local/go/bin:/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -e GOCACHE=/tmp/gc -e GOPATH=/tmp/gp \
# @   -w /lab/ch11 os-lab bash -c "phien c115-eintr.sh 2>&1"
python3 -c 'import errno, os; [print(f"{n:>3} {errno.errorcode[n]:<13} {os.strerror(n)}") for n in (1, 2, 4, 9, 11, 13, 17, 22, 24, 28, 32, 110, 111)]'
gcc -O2 -Wall eintr.c -o eintr && ./eintr norestart
strace -qq -e trace=read,rt_sigreturn ./eintr norestart 2>&1 | grep -v ELF
strace -qq -e trace=read,rt_sigreturn ./eintr restart 2>&1 | grep -v ELF
strace -qq -e trace=ppoll,rt_sigreturn ./eintr poll 2>&1
strace -qq -e trace=read,rt_sigreturn -e signal=SIGALRM python3 pyeintr.py 2>&1 | grep -A4 'read(3, 0x'
gcc -O2 -Wall nb.c -o nb && ./nb
strace -qq -o yes.txt -e trace=write -e signal=SIGPIPE gnuyes | head -1; tail -3 yes.txt | cut -c1-96
strace -qq -o py.txt -e trace=write -e signal=SIGPIPE python3 -c 'while True: print("y")' | head -1; grep -m2 -E 'EPIPE|SIGPIPE' py.txt | cut -c1-96
TIMEFORMAT='%R s'
CGO_ENABLED=0 go build -o spin spin.go && time GOMAXPROCS=1 strace -f -qq -e trace=none -e signal=SIGURG -o spin.txt ./spin
grep -c SIGURG spin.txt; head -1 spin.txt
