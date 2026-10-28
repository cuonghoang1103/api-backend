// philo.c — 5 triết gia, 5 chiếc đũa (mutex). Mỗi người: nghĩ → cầm đũa → ăn → đặt đũa. Chạy 2 giây.
//   ./philo naive     cầm đũa TRÁI rồi đũa PHẢI                         ⇒ cả 5 cùng cầm trái, chờ phải: deadlock
//   ./philo ordered   cầm đũa SỐ NHỎ trước (người cuối đổi chiều)       ⇒ phá "vòng chờ"
//   ./philo waiter    người phục vụ: semaphore 4 — tối đa 4 người ngồi  ⇒ phá "vòng chờ" (luôn có người cầm được 2)
//   ./philo trylock   cầm trái; THỬ phải, hụt thì đặt trái xuống, nghỉ ngẫu nhiên ⇒ phá "giữ-và-chờ"
// main là "bác sĩ trực": nếu suốt 1 giây không ai được ăn ⇒ báo deadlock, in ai đang giữ đũa nào, thoát mã 3.
#include <pthread.h>
#include <semaphore.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

enum { N = 5 };
static pthread_mutex_t fork_[N];
static sem_t seats;
static const char *mode;
static atomic_int stop, holding[N];                 // holding[i] = đũa người i đang cầm (để in khi deadlock)
static atomic_long meals[N], total;

static void take(int me, int f) { pthread_mutex_lock(&fork_[f]); atomic_fetch_add(&holding[me], 1); }
static void put(int me, int f)  { pthread_mutex_unlock(&fork_[f]); atomic_fetch_sub(&holding[me], 1); }

static void *philosopher(void *arg) {
    int me = *(int *)arg, left = me, right = (me + 1) % N;
    unsigned seed = me * 7 + 1;
    while (!atomic_load(&stop)) {
        usleep(rand_r(&seed) % 100);                       // nghĩ
        if (!strcmp(mode, "naive")) {
            take(me, left); usleep(100); take(me, right);
        } else if (!strcmp(mode, "ordered")) {
            int a = left < right ? left : right, b = left < right ? right : left;
            take(me, a); usleep(100); take(me, b);
        } else if (!strcmp(mode, "waiter")) {
            sem_wait(&seats);
            take(me, left); usleep(100); take(me, right);
        } else {                                           // trylock
            for (;;) {
                take(me, left); usleep(100);
                if (pthread_mutex_trylock(&fork_[right]) == 0) { atomic_fetch_add(&holding[me], 1); break; }
                put(me, left);
                usleep(rand_r(&seed) % 200);
            }
        }
        atomic_fetch_add(&meals[me], 1); atomic_fetch_add(&total, 1);
        usleep(50);                                        // ăn
        put(me, right); put(me, left);
        if (!strcmp(mode, "waiter")) sem_post(&seats);
    }
    return NULL;
}

int main(int argc, char **argv) {
    mode = argc > 1 ? argv[1] : "naive";
    sem_init(&seats, 0, N - 1);
    for (int i = 0; i < N; i++) pthread_mutex_init(&fork_[i], NULL);
    pthread_t t[N]; int id[N];
    for (int i = 0; i < N; i++) { id[i] = i; pthread_create(&t[i], NULL, philosopher, &id[i]); }
    long last = -1; int still = 0;
    for (int tick = 0; tick < 20; tick++) {                // 20 × 100 ms = 2 giây
        usleep(100 * 1000);
        long now = atomic_load(&total);
        still = now == last ? still + 1 : 0; last = now;
        if (still >= 10) {
            printf("%s: DEADLOCK - no meal for 1 s after %ld meals. Forks held:", mode, now);
            for (int i = 0; i < N; i++) printf(" P%d=%d", i, atomic_load(&holding[i]));
            printf("\n");
            fflush(stdout);
            _exit(3);
        }
    }
    atomic_store(&stop, 1);
    for (int i = 0; i < N; i++) pthread_join(t[i], NULL);
    printf("%-8s %6ld meals in 2 s; per philosopher:", mode, atomic_load(&total));
    for (int i = 0; i < N; i++) printf(" %ld", atomic_load(&meals[i]));
    printf("\n");
    return 0;
}
