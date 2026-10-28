/* tiny.c — một chương trình KHÔNG có libc: không printf, không main, không errno. Chỉ hai lời gọi hệ thống.
 * gcc -O2 -static -nostdlib -fno-stack-protector -o tiny tiny.c        (arm64; x86-64 xem raw.c) */
#include <asm/unistd.h>

static long sys3(long nr, long a, long b, long c) {
    register long x0 asm("x0") = a, x1 asm("x1") = b, x2 asm("x2") = c, x8 asm("x8") = nr;
    asm volatile("svc #0" : "+r"(x0) : "r"(x1), "r"(x2), "r"(x8) : "memory");
    return x0;
}

void _start(void) {                       /* the kernel jumps here after execve; there is no main() */
    static const char msg[] = "hello with no libc\n";
    sys3(__NR_write, 1, (long)msg, sizeof msg - 1);
    sys3(__NR_exit_group, 7, 0, 0);       /* exit code 7, so you can see it was us */
    for (;;) {}
}
