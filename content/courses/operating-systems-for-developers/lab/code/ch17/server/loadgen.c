// loadgen.c — máy tạo tải tí hon cho dự án 17.2 (không cần cài wrk/ab): C kết nối song song, mỗi request một kết nối mới.
//   gcc -Wall -O2 -pthread -o loadgen loadgen.c
//   ./loadgen 127.0.0.1 8080 /work?ms=10 64 5        ⇒ 64 kết nối song song trong 5 giây
// In: số câu trả lời theo mã trạng thái (200/s = thông lượng hữu ích), lỗi kết nối, độ trễ p50/p95/p99/max (ms) của các câu 200.
#define _GNU_SOURCE
#include <arpa/inet.h>
#include <netinet/in.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

static const char *host, *path; static int port, secs;
static double t_end;
typedef struct { double *lat; long n, cap, s200, s503, s408, other, err; } Res;

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }

static void *client(void *arg) {
    Res *r = arg;
    char req[512], buf[4096];
    int len = snprintf(req, sizeof req, "GET %s HTTP/1.1\r\nHost: %s\r\nConnection: close\r\n\r\n", path, host);
    struct sockaddr_in a = {.sin_family = AF_INET, .sin_port = htons(port)};
    inet_pton(AF_INET, host, &a.sin_addr);
    while (now() < t_end) {
        double t0 = now();
        int fd = socket(AF_INET, SOCK_STREAM, 0);
        struct timeval tv = {3, 0};                    // máy chủ không đóng kết nối (rò fd!) ⇒ đừng chờ mãi
        setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof tv);
        if (connect(fd, (void *)&a, sizeof a) < 0 || write(fd, req, len) != len) { r->err++; close(fd); usleep(1000); continue; }
        ssize_t got = 0, k;
        while ((k = read(fd, buf + got, sizeof buf - 1 - got)) > 0 && got < (ssize_t)sizeof buf - 1) got += k;
        close(fd);
        buf[got] = 0;
        int code = 0;
        if (sscanf(buf, "HTTP/1.%*d %d", &code) != 1) { r->err++; continue; }
        if (code == 503) { r->s503++; continue; } else if (code == 408) { r->s408++; continue; } else if (code != 200) { r->other++; continue; }
        r->s200++;                                     // độ trễ chỉ tính cho câu trả lời 200 (503 trả về tức thì, sẽ làm đẹp số giả)
        if (r->n == r->cap) { r->cap = r->cap ? 2 * r->cap : 1024; r->lat = realloc(r->lat, r->cap * sizeof(double)); }
        r->lat[r->n++] = (now() - t0) * 1000;
    }
    return NULL;
}
static int cmp(const void *a, const void *b) { double x = *(double *)a, y = *(double *)b; return (x > y) - (x < y); }

int main(int argc, char **argv) {
    if (argc < 6) { fprintf(stderr, "usage: %s HOST PORT PATH CONNECTIONS SECONDS\n", argv[0]); return 2; }
    host = argv[1]; port = atoi(argv[2]); path = argv[3]; int c = atoi(argv[4]); secs = atoi(argv[5]);
    pthread_t *th = calloc(c, sizeof *th); Res *rs = calloc(c, sizeof *rs);
    double t0 = now(); t_end = t0 + secs;
    for (int i = 0; i < c; i++) pthread_create(&th[i], NULL, client, &rs[i]);
    Res all = {0};
    for (int i = 0; i < c; i++) {
        pthread_join(th[i], NULL);
        all.s200 += rs[i].s200; all.s503 += rs[i].s503; all.s408 += rs[i].s408; all.other += rs[i].other; all.err += rs[i].err;
        all.lat = realloc(all.lat, (all.n + rs[i].n + 1) * sizeof(double));
        memcpy(all.lat + all.n, rs[i].lat, rs[i].n * sizeof(double)); all.n += rs[i].n;
    }
    double el = now() - t0;
    qsort(all.lat, all.n, sizeof(double), cmp);
#define P(q) (all.n ? all.lat[(long)((q) * (all.n - 1))] : 0)
    printf("%s  %d conns  %.1f s: 200=%ld (%.0f/s) 503=%ld 408=%ld other=%ld conn-errors=%ld\n",
           path, c, el, all.s200, all.s200 / el, all.s503, all.s408, all.other, all.err);
    printf("latency of 200s, ms: p50 %.1f  p95 %.1f  p99 %.1f  max %.1f\n", P(0.50), P(0.95), P(0.99), P(1.0));
    return 0;
}
