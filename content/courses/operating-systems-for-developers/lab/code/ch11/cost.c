/* cost.c — một lời gọi hệ thống tốn bao nhiêu nano-giây, so với lời gọi hàm thường và với vDSO.
 * ./cost [N] [RUNS] : mỗi phép đo N lần, lấy lượt NHANH NHẤT trong RUNS lượt (mặc định 1 000 000 × 5). */
#define _GNU_SOURCE
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/syscall.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

static long N = 1000000;
static int RUNS = 5, devnull, devzero;

__attribute__((noinline)) static long plain(long x) { asm volatile(""); return x + 1; }

static long svc_getppid(void) {
#if defined(__aarch64__)
    register long x0 asm("x0"), x8 asm("x8") = __NR_getppid;
    asm volatile("svc #0" : "=r"(x0) : "r"(x8) : "memory");
    return x0;
#else
    long r; asm volatile("syscall" : "=a"(r) : "a"((long)__NR_getppid) : "rcx", "r11", "memory"); return r;
#endif
}

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e9 + t.tv_nsec; }

#define MEASURE(label, body) do {                                   \
    double best = 1e30;                                             \
    for (int r = 0; r < RUNS; r++) {                                \
        double t0 = now();                                          \
        for (long i = 0; i < N; i++) { body; }                      \
        double ns = (now() - t0) / N; if (ns < best) best = ns;     \
    }                                                               \
    printf("%-38s %8.1f ns\n", label, best);                        \
} while (0)

int main(int argc, char **argv) {
    if (argc > 1) N = atol(argv[1]);
    if (argc > 2) RUNS = atoi(argv[2]);
    devnull = open("/dev/null", O_WRONLY); devzero = open("/dev/zero", O_RDONLY);
    struct timespec ts; struct timeval tv; char c = 'x'; volatile long sink = 0;

    MEASURE("plain function call", sink += plain(i));
    MEASURE("getppid()          libc wrapper", sink += getppid());
    MEASURE("syscall(SYS_getppid)", sink += syscall(SYS_getppid));
    MEASURE("svc #0 getppid     inline asm", sink += svc_getppid());
    MEASURE("clock_gettime()    vDSO", clock_gettime(CLOCK_MONOTONIC, &ts));
    MEASURE("gettimeofday()     vDSO", gettimeofday(&tv, NULL));
    MEASURE("syscall(SYS_clock_gettime) forced", syscall(SYS_clock_gettime, CLOCK_MONOTONIC, &ts));
    MEASURE("write(/dev/null, 1 byte)", sink += write(devnull, &c, 1));
    MEASURE("read(/dev/zero, 1 byte)", sink += read(devzero, &c, 1));
    return sink == 42;
}
