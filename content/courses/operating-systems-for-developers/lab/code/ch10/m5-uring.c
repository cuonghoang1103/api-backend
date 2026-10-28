/* Mô hình 5 thật sự — io_uring: đặt một yêu cầu đọc vào hàng đợi chung với nhân; nhân đọc XONG rồi mới báo. */
#include "cho.h"
#include <liburing.h>
int main(void) {
    int fd = slow_pipe();
    struct io_uring ring;
    int e = io_uring_queue_init(8, &ring, 0);
    if (e < 0) { printf("io_uring_queue_init: %s\n", strerror(-e)); return 1; }
    char b[64];
    struct io_uring_sqe *sqe = io_uring_get_sqe(&ring);
    io_uring_prep_read(sqe, fd, b, sizeof b, -1);   /* -1 = vị trí hiện tại (ống không có offset) */
    io_uring_submit(&ring);                     /* gửi yêu cầu, về ngay */
    struct io_uring_cqe *cqe;
    io_uring_wait_cqe(&ring, &cqe);             /* nhận "đã xong", dữ liệu ĐÃ nằm trong b */
    ssize_t n = cqe->res;
    io_uring_cqe_seen(&ring, cqe);
    report("5 io_uring", n, 2);
}
