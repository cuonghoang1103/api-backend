/* fs.c — false sharing: T luồng, mỗi luồng tăng BỘ ĐẾM RIÊNG của mình 100 triệu lần. Không luồng nào đụng biến của
 * luồng khác — vậy mà nhanh hay chậm tuỳ các bộ đếm nằm cách nhau bao nhiêu byte.
 *
 *   ./fs T GAP      GAP = khoảng cách giữa hai bộ đếm liền nhau, tính bằng byte (8, 64, 128, 256)
 *   ./fs T local    mỗi luồng cộng vào biến cục bộ (thanh ghi), cuối cùng mới ghi kết quả ra mảng chung một lần
 */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define ITERS 100000000L
static char *base;        /* vùng nhớ chung, căn theo 256 byte */
static long gap;          /* byte giữa hai bộ đếm */
static int local;

static void *work(void *p) {
    long id = (long)p;
    volatile long *mine = (volatile long *)(base + id * gap);
    if (local) {
        long x = 0;
        for (long i = 0; i < ITERS; i++) { x++; __asm__ volatile("" : "+r"(x)); }  /* chặn gcc gộp vòng lặp thành x = ITERS */
        *mine = x;
    } else {
        for (long i = 0; i < ITERS; i++) (*mine)++;   /* volatile: mỗi lần tăng là một lần nạp + một lần ghi bộ nhớ */
    }
    return NULL;
}

int main(int argc, char **argv) {
    int t = atoi(argv[1]);
    local = !strcmp(argv[2], "local");
    gap = local ? 8 : atol(argv[2]);
    base = aligned_alloc(256, 256 * 64);
    memset(base, 0, 256 * 64);
    pthread_t th[64];
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &a);
    for (long i = 0; i < t; i++) pthread_create(&th[i], NULL, work, (void *)i);
    for (int i = 0; i < t; i++) pthread_join(th[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &b);
    long sum = 0;
    for (int i = 0; i < t; i++) sum += *(long *)(base + i * gap);
    printf("threads=%d %-9s sum=%ld  %6.0f ms\n", t, local ? "local" : argv[2], sum,
           (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6);
    return 0;
}
