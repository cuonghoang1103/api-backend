/* pollbench.c — giá MỘT lần thức dậy khi đang theo dõi N fd mà chỉ 1 fd có sự kiện.
 *   ./pollbench select|poll|epoll N      (N eventfd; fd cuối cùng được "đánh thức" lặp lại trong 0,5 giây) */
#include <poll.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/epoll.h>
#include <sys/eventfd.h>
#include <sys/select.h>
#include <time.h>
#include <unistd.h>

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }

int main(int argc, char **argv) {
    const char *mode = argv[1];
    int n = atoi(argv[2]);
    int *fd = malloc(n * sizeof *fd);
    for (int i = 0; i < n; i++) fd[i] = eventfd(0, EFD_NONBLOCK);
    int hot = fd[n - 1], maxfd = hot;                    /* chỉ fd cuối cùng có việc */
    if (!strcmp(mode, "select") && maxfd >= FD_SETSIZE) { printf("%-6s N=%5d: impossible, fd %d >= FD_SETSIZE\n", mode, n, maxfd); return 0; }

    struct pollfd *p = calloc(n, sizeof *p);
    for (int i = 0; i < n; i++) { p[i].fd = fd[i]; p[i].events = POLLIN; }
    int ep = epoll_create1(0);
    for (int i = 0; i < n; i++) { struct epoll_event e = { .events = EPOLLIN, .data.fd = fd[i] }; epoll_ctl(ep, EPOLL_CTL_ADD, fd[i], &e); }

    uint64_t one = 1, v;
    long it = 0;
    double t0 = now(), t;
    do {
        if (write(hot, &one, 8) != 8) return 1;          /* làm fd "nóng" sẵn sàng */
        int ready = 0;
        if (!strcmp(mode, "select")) {
            fd_set s; FD_ZERO(&s);
            for (int i = 0; i < n; i++) FD_SET(fd[i], &s);   /* phải dựng lại cả tập MỖI lần */
            select(maxfd + 1, &s, NULL, NULL, NULL);
            ready = FD_ISSET(hot, &s);
        } else if (!strcmp(mode, "poll")) {
            poll(p, n, -1);                              /* nhân duyệt cả N phần tử, ta cũng duyệt lại */
            for (int i = 0; i < n; i++) if (p[i].revents) { ready = 1; p[i].revents = 0; }
        } else {
            struct epoll_event ev[8];
            ready = epoll_wait(ep, ev, 8, -1);           /* nhân trả về ĐÚNG những fd sẵn sàng */
        }
        if (!ready || read(hot, &v, 8) != 8) return 1;
        it++;
    } while ((t = now()) - t0 < 0.5);
    printf("%-6s N=%5d: %8.2f us per wake-up\n", mode, n, (t - t0) / it * 1e6);
    return 0;
}
