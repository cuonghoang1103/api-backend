// race.c — N luồng cùng tăng MỘT biến đếm chung, KHÔNG khoá.  ./race <threads> <iters>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

long counter = 0;            // dữ liệu chung: mọi luồng thấy cùng một ô nhớ
long iters;

void *worker(void *arg) {
    for (long i = 0; i < iters; i++)
        counter++;           // trông như MỘT lệnh, thật ra là nạp – cộng – ghi
    return NULL;
}

int main(int argc, char **argv) {
    int n = argc > 1 ? atoi(argv[1]) : 2;
    iters = argc > 2 ? atol(argv[2]) : 1000000;
    pthread_t t[64];
    for (int i = 0; i < n; i++) pthread_create(&t[i], NULL, worker, NULL);
    for (int i = 0; i < n; i++) pthread_join(t[i], NULL);
    long want = n * iters;
    printf("threads=%d expected=%ld got=%ld lost=%ld (%.1f%%)\n",
           n, want, counter, want - counter, 100.0 * (want - counter) / want);
    return 0;
}
