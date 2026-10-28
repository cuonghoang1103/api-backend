/* Mô hình 3 — dồn kênh I/O (select/poll/epoll): ngủ trong poll() cho TỚI KHI một trong các fd sẵn sàng, rồi read(). */
#include "cho.h"
#include <poll.h>
int main(void) {
    int fd = slow_pipe();
    struct pollfd p = { .fd = fd, .events = POLLIN };   /* mảng này có thể chứa hàng nghìn fd */
    poll(&p, 1, -1);                            /* ngủ ở đây — giai đoạn 1: chờ dữ liệu */
    char b[64];
    ssize_t n = read(fd, b, sizeof b);          /* giai đoạn 2: chép dữ liệu, không chờ nữa */
    report("3 poll", n, 2);
}
