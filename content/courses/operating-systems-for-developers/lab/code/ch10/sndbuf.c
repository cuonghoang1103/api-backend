/* sndbuf.c [SNDBUF] — máy chủ KHÔNG đọc; khách ghi không chặn 64 KiB một lần cho tới khi EAGAIN.
 * Bao nhiêu byte "ghi được" trước khi nhân nói "đầy"? (= bộ đệm gửi của khách + bộ đệm nhận của máy chủ) */
#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char **argv) {
    int ls = socket(AF_INET, SOCK_STREAM, 0), one = 1;
    setsockopt(ls, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(7500) };
    inet_pton(AF_INET, "127.0.0.1", &a.sin_addr);
    bind(ls, (struct sockaddr *)&a, sizeof a); listen(ls, 1);
    int c = socket(AF_INET, SOCK_STREAM, 0);
    int v; socklen_t l = sizeof v;
    getsockopt(c, SOL_SOCKET, SO_SNDBUF, &v, &l);
    printf("default SO_SNDBUF = %d bytes\n", v);
    if (argc > 1) {                                      /* đặt tay ⇒ TẮT tự điều chỉnh (autotuning) của nhân */
        int want = atoi(argv[1]);
        setsockopt(c, SOL_SOCKET, SO_SNDBUF, &want, sizeof want);
        getsockopt(c, SOL_SOCKET, SO_SNDBUF, &v, &l);
        printf("setsockopt(SO_SNDBUF, %d) -> kernel reports %d\n", want, v);
    }
    connect(c, (struct sockaddr *)&a, sizeof a);
    int s = accept(ls, NULL, NULL);                      /* máy chủ nhận kết nối nhưng không bao giờ read() */
    fcntl(c, F_SETFL, O_NONBLOCK);
    static char chunk[65536];
    long total = 0, calls = 0;
    for (;;) {
        ssize_t w = write(c, chunk, sizeof chunk);
        calls++;
        if (w < 0) { printf("write #%ld: %s after %ld bytes accepted\n", calls, strerror(errno), total); break; }
        total += w;
    }
    getsockopt(c, SOL_SOCKET, SO_SNDBUF, &v, &l);
    printf("SO_SNDBUF after filling: %d\n", v);
    char cmd[128];
    snprintf(cmd, sizeof cmd, "ss -tnmH 'sport = :7500 or dport = :7500' | awk '{print $1, $2, $3, $4, $5}'");
    fflush(stdout);
    if (system(cmd) < 0) return 1;
    (void)s;
    return 0;
}
