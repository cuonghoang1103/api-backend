// dl.c — hai "lệnh chuyển tiền" chạy song song: T1 chuyển A→B, T2 chuyển B→A, mỗi lệnh khoá CẢ HAI tài khoản.
//   ./dl naive      khoá theo thứ tự "từ → tới"  (T1: A rồi B, T2: B rồi A)  ⇒ deadlock
//   ./dl ordered    luôn khoá tài khoản có id NHỎ trước                      ⇒ không bao giờ deadlock
//   ./dl trylock    khoá "từ", rồi chờ "tới" tối đa 2 ms; quá hạn ⇒ nhả hết, lùi ngẫu nhiên, thử lại
#include <errno.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

typedef struct { int id; long balance; pthread_mutex_t m; } account;
static account A = { 1, 1000000, PTHREAD_MUTEX_INITIALIZER };
static account B = { 2, 1000000, PTHREAD_MUTEX_INITIALIZER };
static const char *mode;
static long retries;                                   // chỉ đếm ở chế độ trylock (mỗi luồng cộng phần của nó ở cuối)
enum { N = 5000 };

static void move(account *from, account *to) { from->balance -= 1; to->balance += 1; }

static void transfer(account *from, account *to, long *my_retries) {
    if (strcmp(mode, "naive") == 0) {
        pthread_mutex_lock(&from->m);
        usleep(1);                                     // "đọc số dư, kiểm hạn mức…" — đủ để luồng kia chen vào
        pthread_mutex_lock(&to->m);
    } else if (strcmp(mode, "ordered") == 0) {
        account *first = from->id < to->id ? from : to, *second = from->id < to->id ? to : from;
        pthread_mutex_lock(&first->m);
        usleep(1);
        pthread_mutex_lock(&second->m);
    } else {                                           // trylock: chờ có hạn rồi lùi
        for (;;) {
            pthread_mutex_lock(&from->m);
            usleep(1);
            struct timespec dl; clock_gettime(CLOCK_REALTIME, &dl);
            dl.tv_nsec += 2 * 1000 * 1000; if (dl.tv_nsec >= 1000000000) { dl.tv_sec++; dl.tv_nsec -= 1000000000; }
            if (pthread_mutex_timedlock(&to->m, &dl) == 0) break;   // ETIMEDOUT ⇒ thả khoá đang giữ
            pthread_mutex_unlock(&from->m);
            (*my_retries)++;
            usleep(rand() % 1000);                     // lùi NGẪU NHIÊN 0–1 ms để hai bên không đụng nhau lần nữa
        }
    }
    move(from, to);
    pthread_mutex_unlock(&to->m);
    pthread_mutex_unlock(&from->m);
}

static void *worker(void *arg) {
    int dir = *(int *)arg; long r = 0;
    for (int i = 0; i < N; i++) dir == 0 ? transfer(&A, &B, &r) : transfer(&B, &A, &r);
    __atomic_fetch_add(&retries, r, __ATOMIC_RELAXED);
    return NULL;
}

int main(int argc, char **argv) {
    mode = argc > 1 ? argv[1] : "naive";
    srand(getpid());
    printf("pid %d, mode %s: T1 moves A->B, T2 moves B->A, %d transfers each\n", getpid(), mode, N);
    fflush(stdout);
    struct timespec a, b; clock_gettime(CLOCK_MONOTONIC, &a);
    pthread_t t1, t2; int d0 = 0, d1 = 1;
    pthread_create(&t1, NULL, worker, &d0);
    pthread_create(&t2, NULL, worker, &d1);
    pthread_join(t1, NULL); pthread_join(t2, NULL);
    clock_gettime(CLOCK_MONOTONIC, &b);
    printf("done in %.2f s: A=%ld B=%ld (sum %ld), timed-out waits %ld\n",
           (b.tv_sec - a.tv_sec) + (b.tv_nsec - a.tv_nsec) / 1e9, A.balance, B.balance, A.balance + B.balance, retries);
    return 0;
}
