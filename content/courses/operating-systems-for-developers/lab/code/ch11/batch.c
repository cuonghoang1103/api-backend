/* batch.c — ghi 100 000 dòng 32 byte theo bốn cách: mỗi dòng một write(), writev 64 dòng/lần, stdio, một write() lớn.
 * ./batch <line|writev|stdio|big> <file> */
#define _GNU_SOURCE
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/uio.h>
#include <time.h>
#include <unistd.h>

#define LINES 100000
#define LEN 32

int main(int argc, char **argv) {
    const char *mode = argv[1];
    char line[LEN + 1];
    memset(line, 'x', LEN - 1); line[LEN - 1] = '\n'; line[LEN] = 0;
    int fd = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    long calls = 0;
    struct timespec t0, t1;
    clock_gettime(CLOCK_MONOTONIC, &t0);
    if (!strcmp(mode, "line")) {
        for (int i = 0; i < LINES; i++) { if (write(fd, line, LEN) != LEN) return 1; calls++; }
    } else if (!strcmp(mode, "writev")) {
        struct iovec v[64];
        for (int k = 0; k < 64; k++) { v[k].iov_base = line; v[k].iov_len = LEN; }
        for (int i = 0; i < LINES; i += 64) {
            int n = LINES - i < 64 ? LINES - i : 64;
            if (writev(fd, v, n) != n * LEN) return 1;
            calls++;
        }
    } else if (!strcmp(mode, "stdio")) {
        FILE *f = fdopen(fd, "w");
        for (int i = 0; i < LINES; i++) fputs(line, f);
        fflush(f);                       /* the writes stdio made are counted by strace below */
    } else {
        char *buf = malloc((size_t)LINES * LEN);
        for (int i = 0; i < LINES; i++) memcpy(buf + (size_t)i * LEN, line, LEN);
        if (write(fd, buf, (size_t)LINES * LEN) != LINES * LEN) return 1;
        calls++;
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    double ms = (t1.tv_sec - t0.tv_sec) * 1e3 + (t1.tv_nsec - t0.tv_nsec) / 1e6;
    printf("%-7s %7.2f ms  %6.1f ns/line\n", mode, ms, ms * 1e6 / LINES);
    return 0;
}
