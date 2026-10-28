// pi.c — đảo ngược ưu tiên (priority inversion) kiểu Mars Pathfinder, trên MỘT lõi, lập lịch thời gian thực SCHED_FIFO.
//   L (ưu tiên 10) giữ mutex, cần 50 ms nữa mới xong · H (ưu tiên 30) cần đúng mutex đó · M (ưu tiên 20) chạy CPU 500 ms
//   ./pi none      mutex thường                      ⇒ M chặn L, nên M gián tiếp chặn H
//   ./pi inherit   mutex PTHREAD_PRIO_INHERIT        ⇒ L được mượn ưu tiên 30 của H, M không chen được
// Cần quyền đặt lịch thời gian thực: chạy container với --cap-add SYS_NICE.
#define _GNU_SOURCE
#include <pthread.h>
#include <sched.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

static pthread_mutex_t bus;                          // "bus thông tin" dùng chung, như trên Pathfinder
static double t0;
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9 - t0; }
static double cpu(void) { struct timespec t; clock_gettime(CLOCK_THREAD_CPUTIME_ID, &t); return t.tv_sec + t.tv_nsec / 1e9; }
static void burn(double ms) { double end = cpu() + ms / 1e3; while (cpu() < end) {} }   // ms thời gian CPU THẬT của luồng này
static void say(const char *who, const char *what) { printf("%7.1f ms  %s %s\n", now() * 1e3, who, what); }

static void *low(void *a)    { pthread_mutex_lock(&bus); say("L (prio 10)", "locked the bus, needs 50 ms of work");
                               burn(50); say("L (prio 10)", "unlocks the bus"); pthread_mutex_unlock(&bus); return NULL; }
static void *medium(void *a) { say("M (prio 20)", "starts 500 ms of unrelated CPU work"); burn(500); say("M (prio 20)", "done"); return NULL; }
static void *high(void *a)   { say("H (prio 30)", "wants the bus"); double w = now(); pthread_mutex_lock(&bus);
                               printf("%7.1f ms  H (prio 30) got the bus after waiting %.1f ms\n", now() * 1e3, (now() - w) * 1e3);
                               pthread_mutex_unlock(&bus); return NULL; }

static pthread_t start(void *(*fn)(void *), int prio) {
    pthread_attr_t a; pthread_attr_init(&a);
    pthread_attr_setinheritsched(&a, PTHREAD_EXPLICIT_SCHED);
    pthread_attr_setschedpolicy(&a, SCHED_FIFO);
    struct sched_param p = { .sched_priority = prio };
    pthread_attr_setschedparam(&a, &p);
    pthread_t t;
    int rc = pthread_create(&t, &a, fn, NULL);
    if (rc) { fprintf(stderr, "pthread_create SCHED_FIFO: %s\n", strerror(rc)); exit(1); }
    return t;
}

int main(int argc, char **argv) {
    int inherit = argc > 1 && strcmp(argv[1], "inherit") == 0;
    cpu_set_t one; CPU_ZERO(&one); CPU_SET(0, &one);
    sched_setaffinity(0, sizeof one, &one);           // mọi luồng sinh ra sau đều chỉ chạy trên lõi 0
    struct sched_param mp = { .sched_priority = 40 };
    if (sched_setscheduler(0, SCHED_FIFO, &mp)) { perror("sched_setscheduler"); return 1; }
    pthread_mutexattr_t ma; pthread_mutexattr_init(&ma);
    if (inherit) pthread_mutexattr_setprotocol(&ma, PTHREAD_PRIO_INHERIT);
    pthread_mutex_init(&bus, &ma);
    printf("mutex protocol: %s, all threads on CPU 0, SCHED_FIFO\n", inherit ? "PTHREAD_PRIO_INHERIT" : "none");
    t0 = 0; t0 = now();
    pthread_t L = start(low, 10);
    usleep(10 * 1000);                                // main ngủ ⇒ L chạy và cầm khoá
    pthread_t H = start(high, 30);
    pthread_t M = start(medium, 20);
    pthread_join(H, NULL); pthread_join(M, NULL); pthread_join(L, NULL);
    return 0;
}
