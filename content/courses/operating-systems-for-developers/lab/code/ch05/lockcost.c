// lockcost.c — cùng một việc (N luồng × iters lần counter++), năm cách bảo vệ, đo giá mỗi lần tăng.
//   ./lockcost <none|mutex|spin|atomic|local> <threads> <iters>
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

static volatile long counter;              // none / mutex / spin / local dùng (volatile: buộc nạp/ghi THẬT mỗi vòng,
                                           //  để -O2 không gộp cả vòng lặp thành một phép cộng — xem bài 5.1)
static atomic_long acounter;               // atomic dùng
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static pthread_spinlock_t sp;
static long iters;
static const char *mode;

static void *worker(void *arg) {
    if (!strcmp(mode, "none"))
        for (long i = 0; i < iters; i++) counter++;
    else if (!strcmp(mode, "mutex"))
        for (long i = 0; i < iters; i++) { pthread_mutex_lock(&mu); counter++; pthread_mutex_unlock(&mu); }
    else if (!strcmp(mode, "spin"))
        for (long i = 0; i < iters; i++) { pthread_spin_lock(&sp); counter++; pthread_spin_unlock(&sp); }
    else if (!strcmp(mode, "atomic"))
        for (long i = 0; i < iters; i++) atomic_fetch_add(&acounter, 1);
    else {                                 // local: mỗi luồng đếm riêng, chỉ khoá MỘT lần lúc gộp
        volatile long mine = 0;              // biến RIÊNG của luồng — không ai tranh
        for (long i = 0; i < iters; i++) mine++;
        pthread_mutex_lock(&mu); counter += mine; pthread_mutex_unlock(&mu);
    }
    return NULL;
}

int main(int argc, char **argv) {
    mode = argv[1]; int n = atoi(argv[2]); iters = atol(argv[3]);
    pthread_spin_init(&sp, PTHREAD_PROCESS_PRIVATE);
    pthread_t t[64]; struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &a);
    for (int i = 0; i < n; i++) pthread_create(&t[i], NULL, worker, NULL);
    for (int i = 0; i < n; i++) pthread_join(t[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &b);
    long got = !strcmp(mode, "atomic") ? atomic_load(&acounter) : counter;
    double ms = (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6;
    printf("%-6s threads=%d  got=%-9ld %s  %7.1f ms  %6.1f ns/increment\n", mode, n, got,
           got == n * iters ? "correct" : "WRONG  ", ms, ms * 1e6 / (n * iters));
    return 0;
}
