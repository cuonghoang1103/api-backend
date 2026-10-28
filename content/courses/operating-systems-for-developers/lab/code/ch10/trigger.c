/* trigger.c — level-triggered vs edge-triggered: khách gửi 10 byte MỘT lần; máy chủ mỗi lần thức chỉ đọc 4 byte.
 *   ./trigger lt | et | et-drain */
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <sys/epoll.h>
#include <sys/socket.h>
#include <unistd.h>

int main(int argc, char **argv) {
    const char *mode = argv[1];
    int sv[2];
    socketpair(AF_UNIX, SOCK_STREAM, 0, sv);
    fcntl(sv[0], F_SETFL, O_NONBLOCK);
    int ep = epoll_create1(0);
    struct epoll_event e = { .events = EPOLLIN | (strcmp(mode, "lt") ? EPOLLET : 0), .data.fd = sv[0] };
    epoll_ctl(ep, EPOLL_CTL_ADD, sv[0], &e);
    if (write(sv[1], "0123456789", 10) != 10) return 1;  /* đúng MỘT lần gửi, 10 byte */

    int left = 10;
    for (int wake = 1; wake <= 5; wake++) {
        struct epoll_event ev;
        if (epoll_wait(ep, &ev, 1, 500) == 0) { printf("  epoll_wait: timeout after 500 ms, %d bytes still unread\n", left); break; }
        char b[4];
        ssize_t n, got = 0;
        do {
            n = read(sv[0], b, sizeof b);                /* chỉ đọc 4 byte mỗi lần */
            if (n > 0) { got += n; left -= n; }
        } while (!strcmp(mode, "et-drain") && n > 0);    /* et-drain: đọc tới khi EAGAIN */
        printf("  wake-up %d: read %zd bytes%s\n", wake, got, (n < 0 && errno == EAGAIN) ? " (then EAGAIN)" : "");
        if (left == 0) { printf("  all 10 bytes read\n"); break; }
    }
    return 0;
}
