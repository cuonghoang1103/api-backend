// cache.c — cùng một số lần đọc RAM, ba cách đi: tuần tự, mỗi lần một dòng cache (64 B), ngẫu nhiên.
// gcc -O2 cache.c -o cache && ./cache
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>

#define N (32u * 1024 * 1024)          /* 32 Mi phần tử int = 128 MiB, lớn hơn mọi cache */
#define READS (16u * 1024 * 1024)      /* số lần đọc của mỗi phép đo */

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }

int main(void) {
    int *a = malloc((size_t)N * sizeof *a);
    for (uint32_t i = 0; i < N; i++) a[i] = (int)i;      /* chạm mọi trang trước khi đo */
    volatile long sink = 0;
    long sum; double t;

    sum = 0; t = now();
    for (uint32_t i = 0; i < READS; i++) sum += a[i];                 /* 1, 2, 3, … */
    t = now() - t; sink += sum; printf("sequential      : %6.2f ns/read\n", t * 1e9 / READS);

    sum = 0; t = now();
    for (uint32_t i = 0; i < READS; i++) sum += a[(i * 16u) % N];     /* nhảy 64 B: mỗi lần một dòng cache mới */
    t = now() - t; sink += sum; printf("stride 64 bytes : %6.2f ns/read\n", t * 1e9 / READS);

    sum = 0; t = now(); uint32_t x = 12345;
    for (uint32_t i = 0; i < READS; i++) { x = x * 1664525u + 1013904223u; sum += a[x % N]; }   /* ngẫu nhiên */
    t = now() - t; sink += sum; printf("random          : %6.2f ns/read\n", t * 1e9 / READS);
    /* đuổi con trỏ: lần đọc sau phụ thuộc lần đọc trước ⇒ CPU không thể đọc chồng ⇒ lộ độ trễ thật của RAM */
    for (uint32_t i = 0; i < N; i++) a[i] = (int)i;
    for (uint32_t i = N - 1; i > 0; i--) { x = x * 1664525u + 1013904223u; uint32_t j = x % i; int tmp = a[i]; a[i] = a[j]; a[j] = tmp; } /* Sattolo: một vòng duy nhất */
    uint32_t p = 0; t = now();
    for (uint32_t i = 0; i < READS / 4; i++) p = (uint32_t)a[p];
    t = now() - t; sink += p; printf("pointer chasing : %6.2f ns/read\n", t * 1e9 / (READS / 4));
    free(a);
    return (int)(sink & 0);
}
