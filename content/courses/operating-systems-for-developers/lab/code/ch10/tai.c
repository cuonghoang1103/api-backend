/* tai.c — máy tạo tải tự viết: MỘT luồng epoll mở N kết nối tới 127.0.0.1:PORT.
 *   ./tai PORT N SECONDS 0        giữ N kết nối im lặng SECONDS giây (đo giá của kết nối "ngủ")
 *   ./tai PORT N SECONDS MS       mỗi kết nối gửi 64 byte mỗi MS ms (rải đều), chờ máy chủ trả lại, đo độ trễ vòng
 * In: thời gian mở kết nối, số lỗi, số tin gửi/nhận, độ trễ p50/p99/max, và CPU của chính máy tạo tải (để chắc nó
 * không phải nút cổ chai). */
#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/epoll.h>
#include <sys/resource.h>
#include <time.h>
#include <unistd.h>

#define MSG 64
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }
static int cmp(const void *a, const void *b) { float x = *(const float *)a, y = *(const float *)b; return (x > y) - (x < y); }

int main(int argc, char **argv) {
    if (argc < 5) { fprintf(stderr, "usage: tai PORT N SECONDS INTERVAL_MS\n"); return 2; }
    int port = atoi(argv[1]), n = atoi(argv[2]);
    double secs = atof(argv[3]), every = atof(argv[4]);
    struct rlimit rl; getrlimit(RLIMIT_NOFILE, &rl); rl.rlim_cur = rl.rlim_max; setrlimit(RLIMIT_NOFILE, &rl);

    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(port) };
    inet_pton(AF_INET, "127.0.0.1", &a.sin_addr);
    int *fd = calloc(n, sizeof *fd), open_ok = 0, fail = 0;
    double t0 = now();
    for (int i = 0; i < n; i++) {
        int s = socket(AF_INET, SOCK_STREAM, 0);
        if (s < 0 || connect(s, (struct sockaddr *)&a, sizeof a) < 0) {
            if (fail++ == 0) printf("connect #%d failed: %s\n", i + 1, strerror(errno));
            if (s >= 0) close(s);
            fd[i] = -1;
            continue;
        }
        fcntl(s, F_SETFL, O_NONBLOCK);
        fd[i] = s; open_ok++;
    }
    printf("opened %d/%d connections in %.0f ms (%d failed)\n", open_ok, n, now() - t0, fail);
    fflush(stdout);

    int ep = epoll_create1(0);
    int maxfd = 0;
    for (int i = 0; i < n; i++) if (fd[i] > maxfd) maxfd = fd[i];
    int *got = calloc(maxfd + 1, sizeof *got);               /* byte đã nhận của tin đang dở, theo fd */
    char (*rb)[MSG] = calloc(maxfd + 1, MSG);
    for (int i = 0; i < n; i++) if (fd[i] >= 0) {
        struct epoll_event e = { .events = EPOLLIN | EPOLLRDHUP, .data.fd = fd[i] };
        epoll_ctl(ep, EPOLL_CTL_ADD, fd[i], &e);
    }
    long cap = every > 0 ? (long)(n * secs * 1000 / every) + 16 : 16, ns = 0, sent = 0, closed = 0, late = 0;
    float *rtt = malloc(cap * sizeof *rtt);
    struct epoll_event ev[512];
    double start = now(), end = start + secs * 1000, gap = every > 0 ? every / n : 1e9;
    long c = 0;                                              /* tin thứ c đến hạn lúc start + c*gap, gửi trên fd[c % n] */
    for (;;) {
        double t = now();
        if (t >= end) break;
        while (every > 0 && start + c * gap <= t) {
            int s = fd[c % n];
            if (s >= 0) {
                char m[MSG] = {0};
                double ts = now();
                memcpy(m, &ts, sizeof ts);
                if (write(s, m, MSG) == MSG) sent++;
                if (t - (start + c * gap) > 10) late++;    /* máy tạo tải tụt hậu > 10 ms */
            }
            c++;
        }
        double due = every > 0 ? start + c * gap : end;      /* ngủ tới hạn gửi kế tiếp (làm tròn LÊN 1 ms: */
        if (due > end) due = end;                            /*  không quay vòng đốt CPU với hạn chờ 0) */
        int wait = (int)(due - now() + 0.999);
        if (wait < 0) wait = 0;
        int k = epoll_wait(ep, ev, 512, wait);
        double tr = now();
        for (int i = 0; i < k; i++) {
            int s = ev[i].data.fd;
            for (;;) {
                ssize_t r = read(s, rb[s] + got[s], MSG - got[s]);
                if (r > 0) {
                    got[s] += r;
                    if (got[s] == MSG) { double ts; memcpy(&ts, rb[s], sizeof ts); if (ns < cap) rtt[ns++] = tr - ts; got[s] = 0; }
                    continue;
                }
                if (r == 0 || (r < 0 && errno != EAGAIN)) { closed++; epoll_ctl(ep, EPOLL_CTL_DEL, s, NULL); close(s); for (int j = 0; j < n; j++) if (fd[j] == s) fd[j] = -1; }
                break;
            }
        }
    }
    struct rusage ru; getrusage(RUSAGE_SELF, &ru);
    double cpu = ru.ru_utime.tv_sec + ru.ru_utime.tv_usec / 1e6 + ru.ru_stime.tv_sec + ru.ru_stime.tv_usec / 1e6;
    if (every > 0) {
        qsort(rtt, ns, sizeof *rtt, cmp);
        printf("%.0f s: sent %ld, echoed %ld, closed by server %ld, late sends %ld\n", secs, sent, ns, closed, late);
        if (ns) printf("round trip: p50 %.2f ms  p99 %.2f ms  max %.2f ms\n", rtt[ns / 2], rtt[(long)(ns * 0.99)], rtt[ns - 1]);
    } else printf("held %d idle connections for %.0f s, closed by server %ld\n", open_ok, secs, closed);
    printf("load generator CPU: %.2f s\n", cpu);
    return 0;
}
