// starve.c — 4 luồng ĐỌC liên tục (luôn có ít nhất một người đang đọc) và 1 luồng GHI muốn vào đúng một lần.
//   ./starve readers   khoá đọc-ghi mặc định của glibc (ưu tiên người đọc)       ⇒ người ghi chờ mãi (đói)
//   ./starve writers   PTHREAD_RWLOCK_PREFER_WRITER_NONRECURSIVE_NP              ⇒ người ghi vào ngay
// Người ghi chờ tối đa 3 giây (pthread_rwlock_timedwrlock) rồi bỏ cuộc.
#define _GNU_SOURCE
#include <errno.h>
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

static pthread_rwlock_t rw;
static atomic_int stop;
static atomic_long reads;

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }

static void *reader(void *arg) {
    while (!atomic_load(&stop)) {
        pthread_rwlock_rdlock(&rw);
        usleep(200);                                   // "đọc bảng giá" 0,2 ms
        atomic_fetch_add(&reads, 1);
        pthread_rwlock_unlock(&rw);
    }
    return NULL;
}

int main(int argc, char **argv) {
    pthread_rwlockattr_t a; pthread_rwlockattr_init(&a);
    if (argc > 1 && strcmp(argv[1], "writers") == 0)
        pthread_rwlockattr_setkind_np(&a, PTHREAD_RWLOCK_PREFER_WRITER_NONRECURSIVE_NP);
    pthread_rwlock_init(&rw, &a);
    pthread_t r[4];
    for (int i = 0; i < 4; i++) pthread_create(&r[i], NULL, reader, NULL);
    usleep(100 * 1000);                                // để người đọc chạy ổn định
    struct timespec dl; clock_gettime(CLOCK_REALTIME, &dl); dl.tv_sec += 3;
    double t0 = now();
    long before = atomic_load(&reads);
    int rc = pthread_rwlock_timedwrlock(&rw, &dl);     // người ghi: "cập nhật bảng giá"
    double waited = now() - t0;
    long during = atomic_load(&reads) - before;
    if (rc == 0) { printf("writer got the lock after %.1f ms (readers finished %ld reads meanwhile)\n", waited * 1e3, during); pthread_rwlock_unlock(&rw); }
    else printf("writer GAVE UP after %.1f ms: %s (readers finished %ld reads meanwhile)\n", waited * 1e3, strerror(rc), during);
    atomic_store(&stop, 1);
    for (int i = 0; i < 4; i++) pthread_join(r[i], NULL);
    return 0;
}
