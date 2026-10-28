/* echo-thread.c — máy chủ echo kiểu "mỗi kết nối một luồng": accept() rồi pthread_create(); luồng chặn trong read(). */
#include <arpa/inet.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static void *serve(void *arg) {
    int c = (int)(long)arg;
    char buf[4096];
    ssize_t n;
    while ((n = read(c, buf, sizeof buf)) > 0)               /* luồng ngủ ở đây khi khách im lặng */
        if (write(c, buf, n) != n) break;
    close(c);
    return NULL;
}

int main(int argc, char **argv) {
    int port = argc > 1 ? atoi(argv[1]) : 7001, one = 1;
    int ls = socket(AF_INET, SOCK_STREAM, 0);
    setsockopt(ls, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(port), .sin_addr.s_addr = htonl(INADDR_ANY) };
    if (bind(ls, (struct sockaddr *)&a, sizeof a) < 0 || listen(ls, 4096) < 0) { perror("bind/listen"); return 1; }
    printf("echo-thread pid %d: port %d, one thread per connection\n", getpid(), port);
    fflush(stdout);
    for (long accepted = 1, failed = 0;; accepted++) {
        int c = accept(ls, NULL, NULL);
        if (c < 0) { perror("accept"); continue; }
        pthread_t t;
        int e = pthread_create(&t, NULL, serve, (void *)(long)c);
        if (e) {                                             /* hết luồng: từ chối khách này */
            if (failed++ == 0) { printf("pthread_create failed at connection %ld: %s\n", accepted, strerror(e)); fflush(stdout); }
            close(c);
            continue;
        }
        pthread_detach(t);
    }
}
