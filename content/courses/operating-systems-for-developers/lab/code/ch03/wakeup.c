/* wakeup.c — việc "tương tác": ngủ 1 ms rồi thức, 2000 lần. Đo trễ khi thức (thức muộn hơn hẹn bao nhiêu µs). */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

static long long now_ns(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1000000000LL + t.tv_nsec; }
static int cmp(const void *a, const void *b) { long long x = *(long long *)a, y = *(long long *)b; return (x > y) - (x < y); }

int main(int argc, char **argv) {
    const int N = 2000;
    static long long late[2000];
    struct timespec one_ms = {0, 1000000};
    for (int i = 0; i < N; i++) {
        long long t0 = now_ns();
        nanosleep(&one_ms, NULL);
        late[i] = (now_ns() - t0 - 1000000) / 1000;   /* µs trễ so với hẹn */
    }
    qsort(late, N, sizeof late[0], cmp);
    printf("%-22s wake-up delay: median %4lld us   p99 %5lld us   max %5lld us\n",
           argc > 1 ? argv[1] : "", late[N / 2], late[N * 99 / 100], late[N - 1]);
    return 0;
}
