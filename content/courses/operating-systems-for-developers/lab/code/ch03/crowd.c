/* crowd.c T MODE — cùng một khối việc (40 triệu bước) chia cho T luồng. MODE=cpu: mỗi luồng tự đếm riêng (không đụng nhau).
 * MODE=lock: mọi bước đều khoá một mutex chung (vùng găng ngắn — kiểu "cập nhật bộ đếm chung" trong máy chủ). */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define TOTAL 40000000L
static pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
static volatile long shared = 0;
static long per;
static int lockmode;

static void *work(void *a) {
    (void)a;
    volatile long mine = 0;
    for (long i = 0; i < per; i++) {
        if (lockmode) { pthread_mutex_lock(&m); shared++; pthread_mutex_unlock(&m); }
        else mine++;
    }
    return NULL;
}

int main(int argc, char **argv) {
    int t = atoi(argv[1]);
    lockmode = argc > 2 && !strcmp(argv[2], "lock");
    per = (lockmode ? TOTAL / 4 : TOTAL * 10) / t;    /* bản lock làm ít bước hơn cho kịp giờ */
    pthread_t *th = malloc(t * sizeof *th);
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &a);
    for (int i = 0; i < t; i++) pthread_create(&th[i], NULL, work, NULL);
    for (int i = 0; i < t; i++) pthread_join(th[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &b);
    printf("%-4s threads=%-4d  %6.0f ms\n", lockmode ? "lock" : "cpu", t,
           (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6);
    return 0;
}
