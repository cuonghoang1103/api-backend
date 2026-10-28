# @ Chương 11 · bài 11.1 — hành trình của MỘT lời gọi: printf → libc → svc #0 → bảng syscall → handler → giá trị trả về/errno.
# @ docker run --rm --label oslab=1 --name os-c111 --hostname oslab -v "$PWD/ch11":/lab/ch11 -w /lab/ch11 os-lab bash -c "phien c111-hanh-trinh.sh 2>&1"
cat hello.c
gcc -O2 -static hello.c -o hello-static && ls -l hello-static
strace ./hello-static
nm hello-static | grep -E ' (printf|puts|_IO_new_file_write|__libc_write|__internal_syscall_cancel)$'
objdump -d --no-show-raw-insn hello-static | awk '/<__libc_write>:/,/^$/' | grep -v nop
objdump -d --no-show-raw-insn hello-static | awk '/<__internal_syscall_cancel>:/,/^$/' | grep -B1 -A1 'svc'
grep -wE 'define __NR_(openat|close|read|write|exit_group|getpid)' /usr/include/asm-generic/unistd.h
grep -E ' (el0_svc|do_el0_svc|__arm64_sys_write|__arm64_sys_openat)$' /proc/kallsyms
grep -c ' __arm64_sys_' /proc/kallsyms
gdb -q -batch -ex 'catch syscall write' -ex run -ex bt -ex 'info registers x8 x0 x1 x2' -ex 'x/s $x1' -ex 'x/2i $pc-4' -ex stepi -ex 'info registers x0' ./hello-static 2>&1 | grep -v 'address space randomization'
gcc -O2 -static fail.c -o fail && ./fail
strace -e trace=openat ./fail 2>&1 | grep nope
gdb -q -batch -ex 'catch syscall openat' -ex run -ex 'x/s $x1' -ex continue -ex 'info registers x0' -ex 'p (long)$x0' ./fail 2>&1 | grep -v 'address space randomization'
strace -f -qq -e trace=write -e signal=none -o node.txt node -e 'console.log("hi from Node")' >/dev/null; grep 'hi from' node.txt
strace -f -qq -e trace=write -e signal=none python3 -c 'print("hi from Python")' 2>&1 >/dev/null
strace -f -qq -e trace=write -e signal=none -o java.txt java Hello.java >/dev/null; grep 'hi from' java.txt
