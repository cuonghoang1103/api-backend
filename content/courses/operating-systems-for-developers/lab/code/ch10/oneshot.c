/* oneshot.c — 4 luồng cùng chờ MỘT epoll; một kết nối nhận 2 gói (lúc 0 và 50 ms); mỗi luồng xử lý mất 100 ms.
 *   ./oneshot lt | et | oneshot      Ai thức? Có hai luồng cùng làm MỘT kết nối không? */
#include <errno.h>
#include <fcntl.h>
#include <pthread.h>
#include <stdio.h>
#include <string.h>
#include <sys/epoll.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

static int ep, sv[2], oneshot, busy;
static double t0;
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static double ms(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6 - t0; }

static void *worker(void *arg) {
    long id = (long)arg;
    struct epoll_event ev;
    while (epoll_wait(ep, &ev, 1, 300) == 1) {
        pthread_mutex_lock(&mu); int also = busy++; pthread_mutex_unlock(&mu);
        printf("%4.0f ms  thread %ld woke for the connection%s\n", ms(), id, also ? "  <-- another thread is ALREADY handling it" : "");
        usleep(100000);                                  /* "xử lý request" 100 ms */
        char b[64]; ssize_t n = read(sv[0], b, sizeof b);
        if (n < 0) printf("%4.0f ms  thread %ld read nothing: %s (another thread took the data)\n", ms(), id, strerror(errno));
        else printf("%4.0f ms  thread %ld read %zd bytes\n", ms(), id, n);
        pthread_mutex_lock(&mu); busy--; pthread_mutex_unlock(&mu);
        if (oneshot) {                                   /* xong việc mới "lên dây cót" lại */
            struct epoll_event e = { .events = EPOLLIN | EPOLLONESHOT, .data.fd = sv[0] };
            epoll_ctl(ep, EPOLL_CTL_MOD, sv[0], &e);
        }
    }
    return NULL;
}

int main(int argc, char **argv) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    const char *mode = argv[1];
    oneshot = !strcmp(mode, "oneshot");
    socketpair(AF_UNIX, SOCK_STREAM, 0, sv);
    fcntl(sv[0], F_SETFL, O_NONBLOCK);
    ep = epoll_create1(0);
    unsigned ev = EPOLLIN | (!strcmp(mode, "et") ? EPOLLET : 0) | (oneshot ? EPOLLONESHOT : 0);
    struct epoll_event e = { .events = ev, .data.fd = sv[0] };
    epoll_ctl(ep, EPOLL_CTL_ADD, sv[0], &e);
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); t0 = t.tv_sec * 1e3 + t.tv_nsec / 1e6;
    pthread_t th[4];
    for (long i = 0; i < 4; i++) pthread_create(&th[i], NULL, worker, (void *)(i + 1));
    usleep(20000);
    t0 += 20;
    if (write(sv[1], "request-part-1", 14) < 0) return 1;      /* 0 ms */
    usleep(50000);
    if (write(sv[1], "request-part-2", 14) < 0) return 1;      /* 50 ms */
    for (int i = 0; i < 4; i++) pthread_join(th[i], NULL);
    return 0;
}
