/* cho.h — khung chung cho NĂM mô hình I/O (bài 10.2): một ống dẫn, một tiến trình con ghi "hello" sau đúng 1 giây.
 * Mỗi chương trình m1…m5 chờ dữ liệu theo một cách, rồi báo: chờ bao lâu, tốn bao nhiêu CPU, gọi nhân bao nhiêu lần. */
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/resource.h>
#include <time.h>
#include <unistd.h>

static double t0;
static double ms(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }

static int slow_pipe(void) {                 /* trả về đầu ĐỌC của ống; dữ liệu tới sau 1 giây */
    int p[2];
    if (pipe(p) < 0) exit(1);
    if (fork() == 0) { close(p[0]); sleep(1); if (write(p[1], "hello\n", 6) < 0) _exit(1); _exit(0); }
    close(p[1]);
    t0 = ms();
    return p[0];
}

static void report(const char *model, ssize_t n, long calls) {
    struct rusage ru;
    getrusage(RUSAGE_SELF, &ru);
    printf("%-15s %zd bytes after %4.0f ms | CPU user %4.0f ms, sys %4.0f ms | %ld calls\n", model, n, ms() - t0,
           ru.ru_utime.tv_sec * 1e3 + ru.ru_utime.tv_usec / 1e3, ru.ru_stime.tv_sec * 1e3 + ru.ru_stime.tv_usec / 1e3, calls);
}
