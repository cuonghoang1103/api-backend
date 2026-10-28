# @ Chương 14 · bài 14.1 — gõ TỪ MÁY MAC (lệnh CHỈ ĐỌC, không sudo), từ lab/code/ch14:
# @   bash phien-host.sh c141-mac.sh 2>&1 | bash an-danh.sh > ../../out/c141-mac.out.txt
sw_vers
uname -srm
sysctl -n kern.version
sysctl hw.model hw.ncpu hw.perflevel0.physicalcpu hw.perflevel1.physicalcpu hw.memsize hw.pagesize
ps -o pid,ppid,user,comm -p 1
kmutil showloaded --list-only 2>/dev/null | grep -c com.apple
otool -L /usr/bin/true
SDK=$(xcrun --show-sdk-path); grep -c '^#define[[:space:]]SYS_' $SDK/usr/include/sys/syscall.h
grep -E 'SYS_(fork|write|open|posix_spawn)[[:space:]]' $SDK/usr/include/sys/syscall.h
docker run --rm --label oslab=1 --name os-c141-lx os-lab bash -c 'uname -srm; getconf PAGESIZE; nproc'
docker run --rm --label oslab=1 --name os-c141-vm --pid=host os-lab ps -o pid,ppid,comm -p 1,2
docker run --rm --label oslab=1 --name os-c141-vm --pid=host os-lab bash -c 'echo "kernel threads (children of kthreadd): $(ps --ppid 2 --no-headers | wc -l)"'
