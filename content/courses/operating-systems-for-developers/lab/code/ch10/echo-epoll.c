/* echo-epoll.c — máy chủ echo MỘT LUỒNG phục vụ hàng nghìn kết nối: socket không chặn + epoll (level-triggered).
 * Ghi không hết (bộ đệm gửi đầy vì khách đọc chậm) ⇒ giữ phần còn lại, đổi sang chờ EPOLLOUT, NGỪNG đọc khách đó
 * tới khi gửi xong — đó chính là backpressure (bài 10.8). */
#define _GNU_SOURCE                     /* accept4 */
#include <arpa/inet.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/epoll.h>
#include <unistd.h>

struct conn { int len, off; char buf[4096]; };
static struct conn *C[1 << 20];                 /* chỉ số = số fd */
static int ep;

static void watch(int fd, unsigned events, int op) {
    struct epoll_event e = { .events = events, .data.fd = fd };
    epoll_ctl(ep, op, fd, &e);
}
static void drop(int fd) { close(fd); free(C[fd]); C[fd] = NULL; }   /* close() tự gỡ fd khỏi epoll */

int main(int argc, char **argv) {
    int port = argc > 1 ? atoi(argv[1]) : 7000, one = 1;
    int ls = socket(AF_INET, SOCK_STREAM | SOCK_NONBLOCK, 0);
    setsockopt(ls, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(port), .sin_addr.s_addr = htonl(INADDR_ANY) };
    if (bind(ls, (struct sockaddr *)&a, sizeof a) < 0 || listen(ls, 4096) < 0) { perror("bind/listen"); return 1; }
    ep = epoll_create1(0);
    watch(ls, EPOLLIN, EPOLL_CTL_ADD);
    printf("echo-epoll pid %d: port %d, one thread, epoll fd %d\n", getpid(), port, ep);
    fflush(stdout);

    struct epoll_event ev[256];
    for (;;) {
        int n = epoll_wait(ep, ev, 256, -1);                     /* chỗ DUY NHẤT luồng này ngủ */
        if (n < 0) { if (errno == EINTR) continue; perror("epoll_wait"); return 1; }
        for (int i = 0; i < n; i++) {
            int fd = ev[i].data.fd;
            if (fd == ls) {                                      /* khách mới: nhận hết những ai đang xếp hàng */
                int c;
                while ((c = accept4(ls, NULL, NULL, SOCK_NONBLOCK)) >= 0) {
                    C[c] = calloc(1, sizeof *C[c]);
                    watch(c, EPOLLIN, EPOLL_CTL_ADD);
                }
                continue;
            }
            struct conn *k = C[fd];
            if (k->len) {                                        /* còn nợ khách này dữ liệu: gửi tiếp */
                ssize_t w = write(fd, k->buf + k->off, k->len - k->off);
                if (w < 0) { if (errno != EAGAIN) drop(fd); continue; }
                k->off += w;
                if (k->off == k->len) { k->len = k->off = 0; watch(fd, EPOLLIN, EPOLL_CTL_MOD); }
                continue;
            }
            ssize_t r = read(fd, k->buf, sizeof k->buf);
            if (r == 0 || (r < 0 && errno != EAGAIN)) { drop(fd); continue; }   /* khách đóng / lỗi */
            if (r < 0) continue;                                 /* EAGAIN: báo động giả, chờ tiếp */
            ssize_t w = write(fd, k->buf, r);
            if (w < 0) { if (errno != EAGAIN) { drop(fd); continue; } w = 0; }
            if (w < r) { k->len = r; k->off = w; watch(fd, EPOLLOUT, EPOLL_CTL_MOD); }
        }
    }
}
