// tpserver.c — LỜI GIẢI MẪU dự án 17.2: máy chủ HTTP tí hon có thread pool, hàng đợi CÓ GIỚI HẠN, timeout, tắt êm.
//   gcc -Wall -Wextra -O2 -pthread -o tpserver tpserver.c
//   ./tpserver 8080 --threads 4 --queue 16 --timeout-ms 2000
// Hợp đồng dòng lệnh (bộ kiểm dùng đúng nó — viết bằng Java/Go cũng phải theo): PORT --threads N --queue Q --timeout-ms T
// Tuyến:  GET /            200 "hello"          GET /healthz   200 "ok"
//         GET /work?ms=N   ngủ N ms (giả một lần gọi CSDL/API) rồi 200
//         GET /cpu?n=N     quay N triệu vòng (việc nặng CPU) rồi 200
//         GET /stats       bộ đếm: served, rejected, timeouts, queued, busy
//         khác             404
// Hàng đợi đầy ⇒ 503 + Retry-After NGAY ở luồng accept (cắt tải, không xếp hàng vô hạn).
// Khách không gửi xong header trong T ms ⇒ 408 rồi đóng (chặn kiểu slowloris giữ luồng).
// SIGTERM/SIGINT ⇒ thôi nhận kết nối mới, làm NỐT việc đang chạy + việc đã xếp hàng (tối đa 8 s), rồi thoát 0.
#define _GNU_SOURCE
#include <errno.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <poll.h>
#include <pthread.h>
#include <signal.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/signalfd.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

static int nthreads = 4, qcap = 16, timeout_ms = 2000;

/* ── hàng đợi vòng có giới hạn: mutex + hai biến điều kiện (Chương 5) ── */
static int *q; static int qhead, qlen;
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;
static int stopping;                                   // đọc/ghi dưới mu
static atomic_long served, rejected, timeouts, busy;

static int push(int fd) {                              // 0 = vào hàng, -1 = đầy
    pthread_mutex_lock(&mu);
    if (qlen == qcap) { pthread_mutex_unlock(&mu); return -1; }
    q[(qhead + qlen++) % qcap] = fd;
    pthread_cond_signal(&not_empty);
    pthread_mutex_unlock(&mu);
    return 0;
}
static int pop(void) {                                 // -1 = đang tắt và hàng đã cạn ⇒ luồng thoát
    pthread_mutex_lock(&mu);
    while (qlen == 0 && !stopping) pthread_cond_wait(&not_empty, &mu);
    int fd = -1;
    if (qlen) { fd = q[qhead]; qhead = (qhead + 1) % qcap; qlen--; }
    pthread_mutex_unlock(&mu);
    return fd;
}

static void reply(int fd, int code, const char *reason, const char *body, const char *extra) {
    char h[512];
    int n = snprintf(h, sizeof h, "HTTP/1.1 %d %s\r\nContent-Type: text/plain\r\nContent-Length: %zu\r\nConnection: close\r\n%s\r\n",
                     code, reason, strlen(body), extra ? extra : "");
    struct iovec iov[2] = {{h, (size_t)n}, {(void *)body, strlen(body)}};
    struct msghdr m = {.msg_iov = iov, .msg_iovlen = 2};
    sendmsg(fd, &m, MSG_NOSIGNAL);                     // MỘT lần ghi (Nagle, 11.3) · MSG_NOSIGNAL: khách đã đi thì EPIPE, không chết vì SIGPIPE
}

static long now_ms(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1000L + t.tv_nsec / 1000000; }

static void handle(int fd) {
    char buf[8192]; size_t got = 0;
    long deadline = now_ms() + timeout_ms;
    while (!memmem(buf, got, "\r\n\r\n", 4)) {         // đọc tới hết header, nhưng KHÔNG chờ quá deadline
        long left = deadline - now_ms();
        struct pollfd p = {fd, POLLIN, 0};
        if (left <= 0 || poll(&p, 1, (int)left) == 0) {
            reply(fd, 408, "Request Timeout", "timeout\n", NULL); timeouts++; return;
        }
        ssize_t r = recv(fd, buf + got, sizeof buf - 1 - got, 0);
        if (r <= 0) return;                            // khách đóng giữa chừng
        got += r;
        if (got >= sizeof buf - 1) { reply(fd, 431, "Request Header Fields Too Large", "too large\n", NULL); return; }
    }
    buf[got] = 0;
    char path[1024] = "";
    if (sscanf(buf, "GET %1023s HTTP/", path) != 1) { reply(fd, 400, "Bad Request", "bad request\n", NULL); return; }
    char body[256];
    if (!strcmp(path, "/")) reply(fd, 200, "OK", "hello\n", NULL);
    else if (!strcmp(path, "/healthz")) reply(fd, 200, "OK", "ok\n", NULL);
    else if (!strncmp(path, "/work?ms=", 9)) {
        int ms = atoi(path + 9);
        struct timespec t = {ms / 1000, (ms % 1000) * 1000000L};
        while (nanosleep(&t, &t) < 0 && errno == EINTR) {}
        snprintf(body, sizeof body, "worked %d ms\n", ms); reply(fd, 200, "OK", body, NULL);
    } else if (!strncmp(path, "/cpu?n=", 7)) {
        volatile unsigned long x = 0; long n = atol(path + 7) * 1000000L;
        for (long i = 0; i < n; i++) x += i ^ (x >> 3);
        snprintf(body, sizeof body, "spun %ld\n", n); reply(fd, 200, "OK", body, NULL);
    } else if (!strcmp(path, "/stats")) {
        pthread_mutex_lock(&mu); int ql = qlen; pthread_mutex_unlock(&mu);
        snprintf(body, sizeof body, "served %ld\nrejected %ld\ntimeouts %ld\nqueued %d\nbusy %ld\nthreads %d\n",
                 (long)served, (long)rejected, (long)timeouts, ql, (long)busy, nthreads);
        reply(fd, 200, "OK", body, NULL);
    } else reply(fd, 404, "Not Found", "not found\n", NULL);
    served++;
}

static void *worker(void *arg) {
    (void)arg;
    for (int fd; (fd = pop()) >= 0;) {
        busy++; handle(fd); busy--;
        close(fd);                                     // ⚠️ quên dòng này = rò fd, tới ulimit thì accept() báo EMFILE (Chương 10)
    }
    return NULL;
}

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: %s PORT [--threads N] [--queue Q] [--timeout-ms T]\n", argv[0]); return 2; }
    int port = atoi(argv[1]);
    for (int i = 2; i + 1 < argc; i += 2) {
        if (!strcmp(argv[i], "--threads")) nthreads = atoi(argv[i + 1]);
        else if (!strcmp(argv[i], "--queue")) qcap = atoi(argv[i + 1]);
        else if (!strcmp(argv[i], "--timeout-ms")) timeout_ms = atoi(argv[i + 1]);
    }
    q = calloc(qcap, sizeof *q);

    /* SIGTERM/SIGINT đi qua signalfd ⇒ xử lý trong vòng lặp như một sự kiện, không cần handler bất đồng bộ (11.5). */
    sigset_t ss; sigemptyset(&ss); sigaddset(&ss, SIGTERM); sigaddset(&ss, SIGINT);
    pthread_sigmask(SIG_BLOCK, &ss, NULL);             // chặn TRƯỚC khi tạo luồng ⇒ mọi luồng thừa hưởng mặt nạ này
    int sfd = signalfd(-1, &ss, SFD_CLOEXEC);

    int ls = socket(AF_INET, SOCK_STREAM | SOCK_CLOEXEC, 0), one = 1;
    setsockopt(ls, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = {.sin_family = AF_INET, .sin_port = htons(port), .sin_addr.s_addr = htonl(INADDR_ANY)};
    if (bind(ls, (void *)&a, sizeof a) < 0 || listen(ls, 511) < 0) { perror("bind/listen"); return 1; }

    pthread_t *th = calloc(nthreads, sizeof *th);
    for (int i = 0; i < nthreads; i++) pthread_create(&th[i], NULL, worker, NULL);
    fprintf(stderr, "tpserver: port %d, %d threads, queue %d, timeout %d ms, pid %d\n", port, nthreads, qcap, timeout_ms, (int)getpid());

    struct pollfd pf[2] = {{ls, POLLIN, 0}, {sfd, POLLIN, 0}};
    for (;;) {
        if (poll(pf, 2, -1) < 0) { if (errno == EINTR) continue; perror("poll"); break; }
        if (pf[1].revents) { struct signalfd_siginfo si; if (read(sfd, &si, sizeof si) > 0) fprintf(stderr, "tpserver: got signal %u, draining\n", si.ssi_signo); break; }
        if (pf[0].revents) {
            int c = accept4(ls, NULL, NULL, SOCK_CLOEXEC);
            if (c < 0) { if (errno == EMFILE || errno == ENFILE) usleep(10000); continue; }
            setsockopt(c, IPPROTO_TCP, TCP_NODELAY, &one, sizeof one);
            if (push(c) < 0) {                         // hàng đầy: trả lời 503 ngay, không bắt khách chờ
                reply(c, 503, "Service Unavailable", "busy, retry later\n", "Retry-After: 1\r\n");
                rejected++; close(c);
            }
        }
    }
    /* ── tắt êm ── */
    close(ls);                                         // 1) thôi nhận: kết nối mới bị từ chối (ECONNREFUSED)
    long t0 = now_ms();
    pthread_mutex_lock(&mu); stopping = 1; int left = qlen; pthread_cond_broadcast(&not_empty); pthread_mutex_unlock(&mu);
    struct timespec dl; clock_gettime(CLOCK_REALTIME, &dl); dl.tv_sec += 8;   // 2) làm nốt việc dở + việc trong hàng, tối đa 8 s
    for (int i = 0; i < nthreads; i++)                 //    (< 10 s mà docker stop chờ trước khi gửi SIGKILL — exit 137)
        if (pthread_timedjoin_np(th[i], NULL, &dl) == ETIMEDOUT) {
            fprintf(stderr, "tpserver: drain deadline hit, %ld requests abandoned; exit 1\n", (long)busy); return 1;
        }
    fprintf(stderr, "tpserver: drained (%d queued at signal) in %ld ms; served %ld, rejected %ld, timeouts %ld; exit 0\n",
            left, now_ms() - t0, (long)served, (long)rejected, (long)timeouts);
    return 0;
}
