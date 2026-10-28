/* lat.c BURNERS — luồng chính phục vụ 300 "yêu cầu", mỗi yêu cầu cần 2 ms CPU rồi nghỉ 8 ms. BURNERS luồng khác đốt CPU
 * liên tục (một job nền cùng container). Đo độ trễ từng yêu cầu: dưới CPU quota (--cpus), job nền ăn hết quota của chu kỳ
 * 100 ms ⇒ cả container bị "throttle" ⇒ yêu cầu bị kẹt chờ chu kỳ sau. */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

static double now(clockid_t c) { struct timespec t; clock_gettime(c, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }
static int cmp(const void *a, const void *b) { double x = *(double *)a, y = *(double *)b; return (x > y) - (x < y); }
static void *burn(void *a) { (void)a; volatile unsigned long n = 0; for (;;) n++; return NULL; }

int main(int argc, char **argv) {
    int burners = argc > 1 ? atoi(argv[1]) : 0;
    for (int i = 0; i < burners; i++) { pthread_t t; pthread_create(&t, NULL, burn, NULL); }
    enum { N = 300 };
    static double lat[N];
    struct timespec rest = {0, 8000000};
    for (int i = 0; i < N; i++) {
        double w0 = now(CLOCK_MONOTONIC), c0 = now(CLOCK_THREAD_CPUTIME_ID);
        while (now(CLOCK_THREAD_CPUTIME_ID) - c0 < 2.0) ;          /* 2 ms CPU thật của "yêu cầu" */
        lat[i] = now(CLOCK_MONOTONIC) - w0;
        nanosleep(&rest, NULL);
    }
    qsort(lat, N, sizeof lat[0], cmp);
    printf("background burners=%d  request (2 ms of CPU) latency: p50 %.1f ms  p99 %.1f ms  max %.1f ms\n",
           burners, lat[N / 2], lat[N * 99 / 100], lat[N - 1]);
    return 0;
}
