/* noaccept.c — listen(fd, BACKLOG) rồi KHÔNG BAO GIỜ accept(): xem hàng chờ accept đầy ra sao. */
#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
    int backlog = argc > 1 ? atoi(argv[1]) : 4;
    int ls = socket(AF_INET, SOCK_STREAM, 0), one = 1;
    setsockopt(ls, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(7100), .sin_addr.s_addr = htonl(INADDR_ANY) };
    if (bind(ls, (struct sockaddr *)&a, sizeof a) < 0 || listen(ls, backlog) < 0) { perror("bind/listen"); return 1; }
    printf("listening on 7100 with backlog %d, never calling accept()\n", backlog);
    fflush(stdout);
    pause();
}
