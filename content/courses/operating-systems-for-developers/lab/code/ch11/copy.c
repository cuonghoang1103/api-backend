/* copy.c — chép một file theo bốn cách và đếm số syscall: read+write 4 KiB, read+write 128 KiB, sendfile, copy_file_range.
 * ./copy <rw4k|rw128k|sendfile|cfr> <src> <dst> */
#define _GNU_SOURCE
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/sendfile.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

int main(int argc, char **argv) {
    const char *mode = argv[1];
    int in = open(argv[2], O_RDONLY), out = open(argv[3], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    struct stat st; fstat(in, &st);
    long calls = 0; off_t left = st.st_size;
    struct timespec t0, t1; clock_gettime(CLOCK_MONOTONIC, &t0);
    if (!strncmp(mode, "rw", 2)) {
        size_t sz = strcmp(mode, "rw4k") ? 128 * 1024 : 4096;
        char *buf = malloc(sz); ssize_t n;
        while ((n = read(in, buf, sz)) > 0) { calls++; if (write(out, buf, n) != n) return 1; calls++; }
        calls++;                                   /* the final read() that returned 0 */
    } else if (!strcmp(mode, "sendfile")) {
        while (left > 0) { ssize_t n = sendfile(out, in, NULL, left); if (n <= 0) return 1; left -= n; calls++; }
    } else {
        while (left > 0) { ssize_t n = copy_file_range(in, NULL, out, NULL, left, 0); if (n <= 0) return 1; left -= n; calls++; }
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    double s = (t1.tv_sec - t0.tv_sec) + (t1.tv_nsec - t0.tv_nsec) / 1e9;
    printf("%-9s %4ld MiB in %6.3f s  %6.0f MiB/s  %6ld syscalls\n", mode, (long)(st.st_size >> 20), s, (st.st_size >> 20) / s, calls);
    return 0;
}
