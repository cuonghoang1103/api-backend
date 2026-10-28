/* amdahl.c — một chương trình có phần TUẦN TỰ và phần SONG SONG, đo được tách bạch.
 *
 *   ./amdahl T SERIAL%            tổng việc cố định 4 000 đơn vị (~1 ms mỗi đơn vị): SERIAL% đầu làm bằng MỘT luồng,
 *                                 phần còn lại chia cho T luồng qua hàng đợi                     (strong scaling — Amdahl)
 *   ./amdahl T SERIAL% grow       phần song song LỚN THEO T (T × phần cũ), phần tuần tự giữ nguyên  (weak scaling — Gustafson)
 * In thời gian phần tuần tự, phần song song và tổng.
 */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define UNITS 4000
static long next, total_par;
static pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

static double now_ms(void) {
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t);
    return t.tv_sec * 1e3 + t.tv_nsec / 1e6;
}
static void unit(void) {                         /* một đơn vị việc CPU cố định */
    unsigned long x = 88172645463325252UL;
    for (int i = 0; i < 400000; i++) { x ^= x << 13; x ^= x >> 7; x ^= x << 17; }
    __asm__ volatile("" : : "r"(x));
}
static void *worker(void *p) {
    (void)p;
    for (;;) {
        pthread_mutex_lock(&m);
        long i = next < total_par ? next++ : -1;
        pthread_mutex_unlock(&m);
        if (i < 0) return NULL;
        unit();
    }
}
int main(int argc, char **argv) {
    int t = atoi(argv[1]);
    double s = atof(argv[2]) / 100;
    int grow = argc > 3 && !strcmp(argv[3], "grow");
    long ser = (long)(UNITS * s), par = UNITS - ser;
    if (grow) par *= t;
    double a = now_ms();
    for (long i = 0; i < ser; i++) unit();       /* phần tuần tự: đọc input, khởi tạo, gộp kết quả… */
    double b = now_ms();
    total_par = par;
    pthread_t th[64];
    for (int i = 0; i < t; i++) pthread_create(&th[i], NULL, worker, NULL);
    for (int i = 0; i < t; i++) pthread_join(th[i], NULL);
    double c = now_ms();
    printf("T=%-2d serial=%2.0f%% units=%-5ld serial %5.0f ms + parallel %5.0f ms = %6.0f ms\n",
           t, s * 100, ser + par, b - a, c - b, c - a);
    return 0;
}
