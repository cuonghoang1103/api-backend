// cas.c — tự làm counter++ nguyên tử bằng compare-and-swap (CAS), và đếm số lần CAS THUA phải thử lại.
//   ./cas <threads> <iters>
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>

static atomic_long counter, retries;
static long iters;

static void *worker(void *arg) {
    long r = 0;
    for (long i = 0; i < iters; i++) {
        long old = atomic_load(&counter);
        // "nếu counter VẪN là old thì ghi old+1" — một lệnh máy; thua (ai đó đã đổi) ⇒ old được nạp lại, thử tiếp
        while (!atomic_compare_exchange_weak(&counter, &old, old + 1)) r++;
    }
    atomic_fetch_add(&retries, r);
    return NULL;
}

int main(int argc, char **argv) {
    int n = atoi(argv[1]); iters = atol(argv[2]);
    pthread_t t[64];
    for (int i = 0; i < n; i++) pthread_create(&t[i], NULL, worker, NULL);
    for (int i = 0; i < n; i++) pthread_join(t[i], NULL);
    printf("threads=%d  counter=%ld (%s)  CAS retries=%ld (%.2f per increment)\n", n, atomic_load(&counter),
           atomic_load(&counter) == n * iters ? "correct" : "WRONG", atomic_load(&retries),
           (double)atomic_load(&retries) / (n * iters));
    return 0;
}
