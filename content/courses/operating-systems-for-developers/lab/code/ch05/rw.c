// rw.c — bảng cấu hình chung: 8 luồng, 99% là ĐỌC, 1% là GHI. So mutex với khoá đọc-ghi (pthread_rwlock).
//   ./rw mutex|rwlock
#include <pthread.h>
#include <stdio.h>
#include <string.h>
#include <time.h>

#define SZ 2000
static long table[SZ];
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static pthread_rwlock_t rw = PTHREAD_RWLOCK_INITIALIZER;
static int use_rw;

static void *worker(void *arg) {
    unsigned seed = (unsigned)(long)arg;
    volatile long sink = 0;
    for (int i = 0; i < 20000; i++) {
        seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;   // số ngẫu nhiên giả (xorshift)
        int write = (seed % 100) == 0;
        if (use_rw) write ? pthread_rwlock_wrlock(&rw) : pthread_rwlock_rdlock(&rw);
        else pthread_mutex_lock(&mu);
        if (write) for (int j = 0; j < SZ; j++) table[j]++;      // ghi: sửa cả bảng
        else { long s = 0; for (int j = 0; j < SZ; j++) s += table[j]; sink = s; }  // đọc: quét cả bảng
        if (use_rw) pthread_rwlock_unlock(&rw); else pthread_mutex_unlock(&mu);
    }
    return NULL;
}

int main(int argc, char **argv) {
    use_rw = !strcmp(argv[1], "rwlock");
    struct timespec a, b; clock_gettime(CLOCK_MONOTONIC, &a);
    pthread_t t[8];
    for (long i = 0; i < 8; i++) pthread_create(&t[i], NULL, worker, (void *)(i + 1));
    for (int i = 0; i < 8; i++) pthread_join(t[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &b);
    double ms = (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6;
    printf("%-6s 8 threads x 20000 ops (99%% reads): %6.0f ms  = %6.0f ops/ms\n", argv[1], ms, 160000 / ms);
    return 0;
}
