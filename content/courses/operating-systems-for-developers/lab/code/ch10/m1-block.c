/* Mô hình 1 — I/O chặn: read() ngủ trong nhân tới khi có dữ liệu. */
#include "cho.h"
int main(void) {
    int fd = slow_pipe();
    char b[64];
    ssize_t n = read(fd, b, sizeof b);          /* luồng ngủ ở đây 1 giây */
    report("1 blocking", n, 1);
}
