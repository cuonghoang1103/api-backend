// pc.c — producer–consumer trên bộ đệm vòng 4 ô, mutex + hai biến điều kiện.
//   ./pc while   (đúng: chờ trong vòng while)      ./pc if   (SAI kinh điển: chờ bằng if)
#include <pthread.h>
#include <stdio.h>
#include <string.h>

#define CAP 4
#define ITEMS 200000              // mỗi producer
#define P 2
#define C 4
static int buf[CAP], head, tail, count;
static long consumed, sum, empty_takes;
static int use_if;
static pthread_mutex_t mu = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t not_full = PTHREAD_COND_INITIALIZER, not_empty = PTHREAD_COND_INITIALIZER;
static int producers_left = P;

static void *producer(void *arg) {
    for (int i = 1; i <= ITEMS; i++) {
        pthread_mutex_lock(&mu);
        while (count == CAP) pthread_cond_wait(&not_full, &mu);   // đầy ⇒ ngủ, NHẢ khoá trong lúc ngủ
        buf[tail] = i; tail = (tail + 1) % CAP; count++;
        pthread_cond_broadcast(&not_empty);                        // đánh thức người tiêu thụ
        pthread_mutex_unlock(&mu);
    }
    pthread_mutex_lock(&mu); producers_left--; pthread_cond_broadcast(&not_empty); pthread_mutex_unlock(&mu);
    return NULL;
}

static void *consumer(void *arg) {
    for (;;) {
        pthread_mutex_lock(&mu);
        if (use_if) { if (count == 0 && producers_left) pthread_cond_wait(&not_empty, &mu); }
        else        { while (count == 0 && producers_left) pthread_cond_wait(&not_empty, &mu); }
        if (count == 0 && !producers_left) { pthread_mutex_unlock(&mu); return NULL; }
        if (count == 0) { empty_takes++; pthread_mutex_unlock(&mu); continue; }  // tỉnh dậy mà bộ đệm RỖNG
        sum += buf[head]; head = (head + 1) % CAP; count--; consumed++;
        pthread_cond_signal(&not_full);
        pthread_mutex_unlock(&mu);
    }
}

int main(int argc, char **argv) {
    use_if = argc > 1 && !strcmp(argv[1], "if");
    pthread_t t[P + C];
    for (int i = 0; i < P; i++) pthread_create(&t[i], NULL, producer, NULL);
    for (int i = 0; i < C; i++) pthread_create(&t[P + i], NULL, consumer, NULL);
    for (int i = 0; i < P + C; i++) pthread_join(t[i], NULL);
    long want = (long)P * ITEMS * (ITEMS + 1) / 2;
    printf("%s: consumed=%ld/%d sum %s, woke up to an EMPTY buffer %ld times\n",
           use_if ? "if   " : "while", consumed, P * ITEMS, sum == want ? "ok" : "WRONG", empty_takes);
    return 0;
}
