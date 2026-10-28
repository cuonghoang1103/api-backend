// livelock.c — hai luồng "lịch sự": giữ khoá của mình, THỬ khoá của người kia; không được thì nhả ra và thử lại.
//   ./livelock lockstep         hai luồng đi ĐÚNG CÙNG NHỊP (barrier ép từng bước — như hai người tránh nhau ở hành lang
//                               cùng bước sang một bên): ai cũng bận, không ai xong việc  ⇒ LIVELOCK
//   ./livelock lockstep-random  cùng nhịp, nhưng thử hụt thì tung đồng xu: ngửa ⇒ nhường một nhịp   ⇒ việc chạy
//   ./livelock real             không ép nhịp, chờ cố định 50 µs — bộ lập lịch thật tự làm lệch nhịp
// lockstep*: 100.000 nhịp. real: chạy 2 giây.
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

enum { ROUNDS = 100000 };
static pthread_mutex_t m[2] = { PTHREAD_MUTEX_INITIALIZER, PTHREAD_MUTEX_INITIALIZER };
static pthread_barrier_t step;
static atomic_int stop;
static const char *mode;
static long done[2], failed[2];

static void *lockstep(void *arg) {
    int me = *(int *)arg, other = 1 - me, polite = 0;
    unsigned seed = me + 1;
    for (int r = 0; r < ROUNDS; r++) {
        int play = !polite;                           // nhịp này mình có thử không?
        pthread_barrier_wait(&step);
        if (play) pthread_mutex_lock(&m[me]);         // bước 1: cầm khoá của mình
        pthread_barrier_wait(&step);
        int got = play && pthread_mutex_trylock(&m[other]) == 0;   // bước 2: thử khoá của người kia
        pthread_barrier_wait(&step);
        if (got) { done[me]++; pthread_mutex_unlock(&m[other]); }
        if (play) pthread_mutex_unlock(&m[me]);       // bước 3: nhả (xong việc, hoặc "mời bạn trước")
        if (play && !got) failed[me]++;
        polite = play && !got && strcmp(mode, "lockstep-random") == 0 && (rand_r(&seed) & 1);
    }
    return NULL;
}

static void *real(void *arg) {
    int me = *(int *)arg, other = 1 - me;
    while (!atomic_load(&stop)) {
        pthread_mutex_lock(&m[me]);
        usleep(50);
        if (pthread_mutex_trylock(&m[other]) == 0) {
            done[me]++;
            pthread_mutex_unlock(&m[other]); pthread_mutex_unlock(&m[me]);
            continue;
        }
        pthread_mutex_unlock(&m[me]);
        failed[me]++;
        usleep(50);
    }
    return NULL;
}

int main(int argc, char **argv) {
    mode = argc > 1 ? argv[1] : "lockstep";
    int is_real = strcmp(mode, "real") == 0;
    pthread_barrier_init(&step, NULL, 2);
    pthread_t t[2]; int id[2] = { 0, 1 };
    for (int i = 0; i < 2; i++) pthread_create(&t[i], NULL, is_real ? real : lockstep, &id[i]);
    if (is_real) { sleep(2); atomic_store(&stop, 1); }
    for (int i = 0; i < 2; i++) pthread_join(t[i], NULL);
    for (int i = 0; i < 2; i++)
        printf("thread %d: %6ld jobs done, %6ld polite retries\n", i, done[i], failed[i]);
    return 0;
}
