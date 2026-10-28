/* ubatch.c FILE pread|uring|sqpoll|sqspin R — R lần "đọc 64 khối 4 KiB ở vị trí ngẫu nhiên" của một file (đã nằm trong cache):
 *   pread  : 64 lời gọi pread() mỗi mẻ           uring : 64 SQE rồi MỘT io_uring_enter (nộp + chờ) mỗi mẻ
 *   sqpoll : một luồng NHÂN (iou-sqp) tự nhặt SQE; ta vẫn vào nhân để NGỦ chờ kết quả
 *   sqspin : như sqpoll nhưng ta tự quay vòng đọc hàng kết quả — không vào nhân lần nào */
#include <fcntl.h>
#include <liburing.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }

int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY), R = atoi(argv[3]);
    const char *mode = argv[2];
    struct stat st; fstat(fd, &st);
    long blocks = st.st_size / 4096;
    static char buf[64][4096];
    struct io_uring ring;
    if (strcmp(mode, "pread")) {
        struct io_uring_params p = { 0 };
        if (!strncmp(mode, "sq", 2)) { p.flags = IORING_SETUP_SQPOLL; p.sq_thread_idle = 2000; }
        int e = io_uring_queue_init_params(64, &ring, &p);
        if (e < 0) { printf("io_uring_queue_init: %s\n", strerror(-e)); return 1; }
    }
    srand(1);
    double t = now();
    for (int r = 0; r < R; r++) {
        if (!strcmp(mode, "pread")) {
            for (int i = 0; i < 64; i++) if (pread(fd, buf[i], 4096, (off_t)(rand() % blocks) * 4096) != 4096) return 1;
            continue;
        }
        for (int i = 0; i < 64; i++) io_uring_prep_read(io_uring_get_sqe(&ring), fd, buf[i], 4096, (off_t)(rand() % blocks) * 4096);
        if (!strcmp(mode, "sqspin")) {                   /* nộp: luồng iou-sqp tự thấy; nhận: tự quay vòng */
            io_uring_submit(&ring);
            for (int got = 0; got < 64; ) {
                struct io_uring_cqe *c;
                if (io_uring_peek_cqe(&ring, &c) == 0) { if (c->res != 4096) return 1; io_uring_cqe_seen(&ring, c); got++; }
            }
            continue;
        }
        io_uring_submit_and_wait(&ring, 64);             /* nộp cả mẻ + chờ đủ 64 kết quả */
        struct io_uring_cqe *cqe; unsigned head, n = 0;
        io_uring_for_each_cqe(&ring, head, cqe) { if (cqe->res != 4096) return 1; n++; }
        io_uring_cq_advance(&ring, n);
    }
    double dt = now() - t;
    printf("%-6s %d x 64 reads: %.3f s, %.2f us per 4 KiB read\n", mode, R, dt, dt / (R * 64.0) * 1e6);
    return 0;
}
