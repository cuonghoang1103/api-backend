/* echo-uring.c — máy chủ echo một luồng bằng io_uring: KHÔNG epoll, không read/write — chỉ nộp yêu cầu
 * (accept nhiều lần, recv, send) vào hàng đợi chung với nhân rồi nhặt kết quả. Mô hình "hoàn tất", không phải "sẵn sàng". */
#include <arpa/inet.h>
#include <liburing.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

enum { RECV = 1, SEND = 2 };
struct conn { int fd, state, len, off; char buf[4096]; };
static struct io_uring ring;

static struct io_uring_sqe *sqe(void) {               /* hết chỗ trong hàng đợi nộp ⇒ nộp bớt rồi lấy tiếp */
    struct io_uring_sqe *s = io_uring_get_sqe(&ring);
    if (!s) { io_uring_submit(&ring); s = io_uring_get_sqe(&ring); }
    return s;
}
static void post_recv(struct conn *c) {
    struct io_uring_sqe *s = sqe(); c->state = RECV;
    io_uring_prep_recv(s, c->fd, c->buf, sizeof c->buf, 0); io_uring_sqe_set_data(s, c);
}
static void post_send(struct conn *c) {
    struct io_uring_sqe *s = sqe(); c->state = SEND;
    io_uring_prep_send(s, c->fd, c->buf + c->off, c->len - c->off, 0); io_uring_sqe_set_data(s, c);
}

int main(int argc, char **argv) {
    int port = argc > 1 ? atoi(argv[1]) : 7400, one = 1;
    int ls = socket(AF_INET, SOCK_STREAM, 0);
    setsockopt(ls, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(port), .sin_addr.s_addr = htonl(INADDR_ANY) };
    if (bind(ls, (struct sockaddr *)&a, sizeof a) < 0 || listen(ls, 4096) < 0) { perror("bind/listen"); return 1; }
    int e = io_uring_queue_init(4096, &ring, 0);
    if (e < 0) { printf("io_uring_queue_init: %s\n", strerror(-e)); return 1; }
    io_uring_prep_multishot_accept(sqe(), ls, NULL, NULL, 0);  /* MỘT yêu cầu accept, nhận MÃI kết quả */
    printf("echo-uring pid %d: port %d, one thread, io_uring\n", getpid(), port);
    fflush(stdout);
    for (;;) {
        io_uring_submit_and_wait(&ring, 1);              /* lời gọi nhân DUY NHẤT của vòng lặp */
        struct io_uring_cqe *cq; unsigned head, n = 0;
        io_uring_for_each_cqe(&ring, head, cq) {
            n++;
            struct conn *c = io_uring_cqe_get_data(cq);
            if (!c) {                                    /* kết quả của accept: cq->res là fd khách mới */
                if (cq->res >= 0) { c = calloc(1, sizeof *c); c->fd = cq->res; post_recv(c); }
                if (!(cq->flags & IORING_CQE_F_MORE)) io_uring_prep_multishot_accept(sqe(), ls, NULL, NULL, 0);
                continue;
            }
            if (cq->res <= 0) { close(c->fd); free(c); continue; }   /* khách đóng / lỗi */
            if (c->state == RECV) { c->len = cq->res; c->off = 0; post_send(c); }   /* dữ liệu ĐÃ nằm trong c->buf */
            else { c->off += cq->res; if (c->off < c->len) post_send(c); else post_recv(c); }
        }
        io_uring_cq_advance(&ring, n);
    }
}
