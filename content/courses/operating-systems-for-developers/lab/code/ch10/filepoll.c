/* filepoll.c — hỏi epoll và poll về một FILE THƯỜNG: epoll từ chối, poll luôn nói "sẵn sàng" (kể cả khi đọc sẽ phải chờ đĩa). */
#include <errno.h>
#include <fcntl.h>
#include <poll.h>
#include <stdio.h>
#include <string.h>
#include <sys/epoll.h>
#include <unistd.h>
int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY | O_NONBLOCK);
    int ep = epoll_create1(0);
    struct epoll_event e = { .events = EPOLLIN, .data.fd = fd };
    int r = epoll_ctl(ep, EPOLL_CTL_ADD, fd, &e);
    printf("epoll_ctl(ADD, regular file) = %d %s\n", r, r ? strerror(errno) : "");
    struct pollfd p = { .fd = fd, .events = POLLIN };
    r = poll(&p, 1, 0);
    printf("poll(regular file) = %d, revents = %s\n", r, (p.revents & POLLIN) ? "POLLIN (\"ready\")" : "none");
    return 0;
}
