/* randread.c FILE N — N lần pread 4 KiB ở vị trí ngẫu nhiên; in độ trễ p50/p99/max của MỘT lời gọi read. */
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>
static double us(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e6 + t.tv_nsec / 1e3; }
static int cmp(const void *a, const void *b) { double x = *(const double *)a, y = *(const double *)b; return (x > y) - (x < y); }
int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY), n = atoi(argv[2]);
    struct stat st; fstat(fd, &st);
    long blocks = st.st_size / 4096;
    double *lat = malloc(n * sizeof *lat);
    char buf[4096];
    srand(42);
    for (int i = 0; i < n; i++) {
        off_t off = (off_t)(rand() % blocks) * 4096;
        double t = us();
        if (pread(fd, buf, sizeof buf, off) != sizeof buf) return 1;
        lat[i] = us() - t;
    }
    qsort(lat, n, sizeof *lat, cmp);
    printf("%d random 4 KiB reads: p50 %.1f us  p99 %.1f us  max %.1f us\n", n, lat[n / 2], lat[(int)(n * 0.99)], lat[n - 1]);
    return 0;
}
