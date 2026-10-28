// syscost.c — một lần vào nhân tốn bao nhiêu? so với một lời gọi hàm thường và với clock_gettime (vDSO)
#define _GNU_SOURCE
#include <stdio.h>
#include <time.h>
#include <unistd.h>
#include <sys/syscall.h>
#define N 5000000
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }
__attribute__((noinline)) static long plain(long x) { __asm__ volatile(""); return x + 1; }
int main(void) {
    volatile long s = 0; double t;
    t = now(); for (int i = 0; i < N; i++) s += plain(i);                  t = now() - t;
    printf("plain function call     : %7.1f ns\n", t * 1e9 / N);
    t = now(); for (int i = 0; i < N; i++) s += syscall(SYS_getppid);     t = now() - t;
    printf("getppid() system call   : %7.1f ns\n", t * 1e9 / N);
    struct timespec ts;
    t = now(); for (int i = 0; i < N; i++) { clock_gettime(CLOCK_REALTIME, &ts); s += ts.tv_nsec; } t = now() - t;
    printf("clock_gettime() via vDSO: %7.1f ns\n", t * 1e9 / N);
    char c = 'x';
    int fd[2]; if (pipe(fd)) return 1;
    t = now(); for (int i = 0; i < N / 10; i++) { if (write(fd[1], &c, 1) != 1 || read(fd[0], &c, 1) != 1) return 1; } t = now() - t;
    printf("write()+read() on a pipe: %7.1f ns\n", t * 1e9 / (N / 10));
    return (int)(s & 0);
}
