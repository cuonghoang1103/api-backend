/* pingpong.c N — cha và con chuyền nhau 1 byte qua hai pipe, N lượt. Mỗi lượt = cha ngủ → con chạy → con ngủ → cha chạy.
 * Ghim cả hai lên MỘT lõi (taskset -c 0) thì mỗi lượt là đúng HAI lần chuyển ngữ cảnh ⇒ đo được giá một lần chuyển. */
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

int main(int argc, char **argv) {
    long n = argc > 1 ? atol(argv[1]) : 100000;
    int ping[2], pong[2];
    char b = 'x';
    if (pipe(ping) || pipe(pong)) return 1;
    if (fork() == 0) {                       /* con: nhận ping, trả pong */
        for (long i = 0; i < n; i++) { if (read(ping[0], &b, 1) != 1 || write(pong[1], &b, 1) != 1) break; }
        _exit(0);
    }
    struct timespec t0, t1;
    clock_gettime(CLOCK_MONOTONIC, &t0);
    for (long i = 0; i < n; i++) { if (write(ping[1], &b, 1) != 1 || read(pong[0], &b, 1) != 1) break; }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    wait(NULL);
    double ns = ((t1.tv_sec - t0.tv_sec) * 1e9 + (t1.tv_nsec - t0.tv_nsec)) / n;
    printf("%ld round trips: %.0f ns per round trip  (~%.0f ns per switch if both share one core)\n", n, ns, ns / 2);
    return 0;
}
