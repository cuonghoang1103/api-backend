/* dial.c — mở N kết nối TCP lần lượt, mỗi lần connect() có hạn chờ T ms; in thời gian từng lần (hàng chờ accept đầy ⇒ treo). */
#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <poll.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

static double ms(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }

int main(int argc, char **argv) {
    int port = atoi(argv[1]), n = atoi(argv[2]), limit = argc > 3 ? atoi(argv[3]) : 2000;
    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(port) };
    inet_pton(AF_INET, "127.0.0.1", &a.sin_addr);
    for (int i = 1; i <= n; i++) {
        int s = socket(AF_INET, SOCK_STREAM, 0);
        fcntl(s, F_SETFL, O_NONBLOCK);
        double t = ms();
        int r = connect(s, (struct sockaddr *)&a, sizeof a);
        const char *res = "connected";
        if (r < 0 && errno == EINPROGRESS) {
            struct pollfd p = { .fd = s, .events = POLLOUT };
            if (poll(&p, 1, limit) == 0) res = "still waiting (SYN not answered)";
            else { int e = 0; socklen_t l = sizeof e; getsockopt(s, SOL_SOCKET, SO_ERROR, &e, &l); if (e) res = strerror(e); }
        } else if (r < 0) res = strerror(errno);
        printf("connection %2d: %-34s after %6.1f ms\n", i, res, ms() - t);
    }
    return 0;
}
