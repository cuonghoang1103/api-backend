// bb.c — bộ đệm giới hạn (bounded buffer) bằng 3 semaphore, đúng như đề thi: empty = 4, full = 0, mutex = 1.
//   ./bb right   producer: P(empty); P(mutex); đặt; V(mutex); V(full)
//   ./bb wrong   producer: P(mutex); P(empty); …   ← đổi chỗ HAI dòng
// Producer nhanh, consumer chậm (bộ đệm sẽ đầy). main canh: 1 giây không ai tiến ⇒ báo deadlock, thoát mã 3.
#include <pthread.h>
#include <semaphore.h>
#include <stdatomic.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

enum { SIZE = 4, ITEMS = 2000 };
static int buf[SIZE], in, out;
static sem_t empty, full, mutex;
static int wrong;
static atomic_long produced, consumed;

static void *producer(void *a) {
    for (int i = 0; i < ITEMS; i++) {
        if (wrong) { sem_wait(&mutex); sem_wait(&empty); }    // ⛔ giữ mutex rồi mới ngủ chờ chỗ trống
        else       { sem_wait(&empty); sem_wait(&mutex); }
        buf[in] = i; in = (in + 1) % SIZE;
        sem_post(&mutex); sem_post(&full);
        atomic_fetch_add(&produced, 1);
    }
    return NULL;
}
static void *consumer(void *a) {
    for (int i = 0; i < ITEMS; i++) {
        sem_wait(&full); sem_wait(&mutex);
        int x = buf[out]; out = (out + 1) % SIZE; (void)x;
        sem_post(&mutex); sem_post(&empty);
        atomic_fetch_add(&consumed, 1);
        usleep(100);                                          // consumer chậm
    }
    return NULL;
}

int main(int argc, char **argv) {
    wrong = argc > 1 && strcmp(argv[1], "wrong") == 0;
    sem_init(&empty, 0, SIZE); sem_init(&full, 0, 0); sem_init(&mutex, 0, 1);
    pthread_t p, c;
    pthread_create(&p, NULL, producer, NULL); pthread_create(&c, NULL, consumer, NULL);
    long last = -1; int still = 0;
    while (atomic_load(&consumed) < ITEMS) {
        usleep(100 * 1000);
        long now = atomic_load(&produced) + atomic_load(&consumed);
        still = now == last ? still + 1 : 0; last = now;
        if (still >= 10) {
            int e, f, m; sem_getvalue(&empty, &e); sem_getvalue(&full, &f); sem_getvalue(&mutex, &m);
            printf("%s: DEADLOCK after %ld produced, %ld consumed (empty=%d full=%d mutex=%d)\n",
                   argv[1], atomic_load(&produced), atomic_load(&consumed), e, f, m);
            fflush(stdout); _exit(3);
        }
    }
    pthread_join(p, NULL); pthread_join(c, NULL);
    printf("%s: %ld produced, %ld consumed\n", argc > 1 ? argv[1] : "right", atomic_load(&produced), atomic_load(&consumed));
    return 0;
}
