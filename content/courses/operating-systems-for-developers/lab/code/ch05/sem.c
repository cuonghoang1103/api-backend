// sem.c — 10 "yêu cầu" cùng muốn dùng một tài nguyên chỉ chịu được 3 người cùng lúc (như pool 3 kết nối CSDL).
//   ./sem 3    semaphore đếm khởi tạo = 3         ./sem 0    không giới hạn (để so)
#include <pthread.h>
#include <semaphore.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

static sem_t slots;
static int limit;
static atomic_int inside, peak;

static void *request(void *arg) {
    if (limit) sem_wait(&slots);                 // P(): lấy một chỗ, hết chỗ thì NGỦ chờ
    int now = atomic_fetch_add(&inside, 1) + 1;
    int p = atomic_load(&peak);
    while (now > p && !atomic_compare_exchange_weak(&peak, &p, now)) {}
    usleep(100 * 1000);                          // "truy vấn" mất 100 ms
    atomic_fetch_sub(&inside, 1);
    if (limit) sem_post(&slots);                 // V(): trả chỗ, đánh thức một người đang chờ
    return NULL;
}

int main(int argc, char **argv) {
    limit = atoi(argv[1]);
    if (limit) sem_init(&slots, 0, limit);
    struct timespec a, b; clock_gettime(CLOCK_MONOTONIC, &a);
    pthread_t t[10];
    for (int i = 0; i < 10; i++) pthread_create(&t[i], NULL, request, NULL);
    for (int i = 0; i < 10; i++) pthread_join(t[i], NULL);
    clock_gettime(CLOCK_MONOTONIC, &b);
    printf("limit=%s  peak concurrent=%d  total=%.0f ms\n", limit ? argv[1] : "none", atomic_load(&peak),
           (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6);
    return 0;
}
