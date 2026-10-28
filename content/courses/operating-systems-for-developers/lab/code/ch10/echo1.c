/* echo1.c — máy chủ echo NHỎ NHẤT, kiểu "chặn": một luồng, phục vụ từng khách một (accept → read/write → close). */
#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
    int port = argc > 1 ? atoi(argv[1]) : 7000;
    int ls = socket(AF_INET, SOCK_STREAM, 0);                  /* 1. một fd cho "cái tai" */
    int one = 1;
    setsockopt(ls, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(port), .sin_addr.s_addr = htonl(INADDR_ANY) };
    if (bind(ls, (struct sockaddr *)&a, sizeof a) < 0 || listen(ls, 128) < 0) { perror("bind/listen"); return 1; }
    printf("echo1 pid %d listening on fd %d, port %d\n", getpid(), ls, port);
    fflush(stdout);
    for (;;) {
        int c = accept(ls, NULL, NULL);                          /* 2. mỗi khách = một fd MỚI */
        if (c < 0) { perror("accept"); continue; }
        char buf[4096];
        ssize_t n;
        while ((n = read(c, buf, sizeof buf)) > 0)               /* 3. chặn ở đây tới khi khách gửi */
            if (write(c, buf, n) != n) break;
        close(c);                                                /* 4. trả fd */
    }
}
