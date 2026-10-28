/* raw.c — bốn cách in một dòng, từ "cao" xuống "trần", rồi cùng một lỗi qua ba tầng.
 * Biên dịch: gcc -O2 raw.c -o raw   (arm64 hoặc x86-64) */
#define _GNU_SOURCE
#include <errno.h>
#include <stdio.h>
#include <string.h>
#include <sys/syscall.h>
#include <unistd.h>

/* The bottom of the stack: put the number and arguments in registers, trap into the kernel. */
static long raw_write(long fd, const void *buf, long n) {
#if defined(__aarch64__)
    register long x0 asm("x0") = fd;            /* arg 1, and the return value */
    register long x1 asm("x1") = (long)buf;     /* arg 2 */
    register long x2 asm("x2") = n;             /* arg 3 */
    register long x8 asm("x8") = __NR_write;    /* syscall number: 64 on arm64 */
    asm volatile("svc #0" : "+r"(x0) : "r"(x1), "r"(x2), "r"(x8) : "memory");
    return x0;
#elif defined(__x86_64__)
    long ret;                                   /* rax = number (1 on x86-64), rdi/rsi/rdx = args */
    asm volatile("syscall" : "=a"(ret) : "a"((long)__NR_write), "D"(fd), "S"(buf), "d"(n)
                 : "rcx", "r11", "memory");     /* the CPU itself overwrites rcx and r11 */
    return ret;
#else
#error "add your architecture"
#endif
}

int main(void) {
    printf("1  printf  : stdio buffer, write() later\n");
    if (write(1, "2  write() : libc wrapper, sets errno\n", 38) != 38) return 1;
    syscall(SYS_write, 1, "3  syscall(): generic libc wrapper\n", 35);
    raw_write(1, "4  svc #0  : no libc at all\n", 28);

    char line[96];
    long a = write(99, "x", 1);            int ea = errno;
    long b = syscall(SYS_write, 99, "x", 1); int eb = errno;
    errno = 0;
    long c = raw_write(99, "x", 1);        int ec = errno;
    int n = snprintf(line, sizeof line, "fd 99: write()=%ld errno=%d | syscall()=%ld errno=%d | svc=%ld errno=%d (%s)\n",
                     a, ea, b, eb, c, ec, strerror(-c));
    raw_write(1, line, n);
    return 0;
}
