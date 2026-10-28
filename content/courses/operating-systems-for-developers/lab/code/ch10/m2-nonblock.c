/* Mô hình 2 — I/O không chặn: read() trả EAGAIN ngay; ta tự hỏi lại liên tục ("có chưa? có chưa?"). */
#include "cho.h"
int main(void) {
    int fd = slow_pipe();
    fcntl(fd, F_SETFL, O_NONBLOCK);
    char b[64];
    long calls = 1;
    ssize_t n;
    while ((n = read(fd, b, sizeof b)) < 0 && errno == EAGAIN)
        calls++;                                /* vòng quay bận: đốt một lõi CPU */
    report("2 non-blocking", n, calls);
}
