/* pool-http.c MODE — máy chủ HTTP kiểu "pool 8 luồng", đọc header bằng read() CHẶN (giống Tomcat/Apache cổ điển).
 *   none     : không hạn chờ nào
 *   idle     : SO_RCVTIMEO 2 s — mỗi lần read() chờ tối đa 2 s (hạn chờ "im lặng")
 *   deadline : cả phần header phải tới đủ trong 2 s kể từ lúc nhận kết nối (hạn chờ TỔNG) */
#include <arpa/inet.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

static int ls;
static const char *mode;
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }

static void *worker(void *arg) {
    (void)arg;
    for (;;) {
        int c = accept(ls, NULL, NULL);
        double start = now();
        char buf[4096]; int len = 0;
        if (strcmp(mode, "none")) {
            struct timeval tv = { .tv_sec = 2 };
            setsockopt(c, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof tv);
        }
        while (len < (int)sizeof buf - 1) {
            if (!strcmp(mode, "deadline")) {             /* còn bao lâu tới hạn TỔNG? đặt lại hạn cho lần read này */
                double left = 2.0 - (now() - start);
                if (left <= 0) break;
                struct timeval tv = { .tv_sec = (long)left, .tv_usec = (long)((left - (long)left) * 1e6) };
                setsockopt(c, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof tv);
            }
            ssize_t n = read(c, buf + len, sizeof buf - 1 - len);
            if (n <= 0) break;                           /* đóng, lỗi, hoặc EAGAIN do hết hạn chờ */
            len += n; buf[len] = 0;
            if (strstr(buf, "\r\n\r\n")) {
                const char *r = "HTTP/1.1 200 OK\r\nContent-Length: 3\r\nConnection: close\r\n\r\nok\n";
                if (write(c, r, strlen(r)) < 0) break;
                break;
            }
        }
        close(c);
    }
    return NULL;
}

int main(int argc, char **argv) {
    mode = argv[1];
    int one = 1;
    ls = socket(AF_INET, SOCK_STREAM, 0);
    setsockopt(ls, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = { .sin_family = AF_INET, .sin_port = htons(7700), .sin_addr.s_addr = htonl(INADDR_ANY) };
    if (bind(ls, (struct sockaddr *)&a, sizeof a) < 0 || listen(ls, 128) < 0) { perror("bind/listen"); return 1; }
    printf("pool-http (%s): 8 worker threads on port 7700\n", mode);
    fflush(stdout);
    pthread_t t[8];
    for (int i = 0; i < 8; i++) pthread_create(&t[i], NULL, worker, NULL);
    pause();
}
