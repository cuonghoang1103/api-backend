/* luong.c — ba luồng trong MỘT tiến trình: cùng PID, khác TID; stack riêng, biến toàn cục + heap chung. */
#define _GNU_SOURCE
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int global = 0;                 /* vùng data: MỘT bản, mọi luồng thấy chung */
int *heap;                      /* heap: MỘT bản, mọi luồng thấy chung */
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

static void show(const char *who, int *local) {
    printf("%-8s pid=%d tid=%d  &local=%p  &global=%p  heap=%p\n",
           who, getpid(), gettid(), (void *)local, (void *)&global, (void *)heap);
}

void *worker(void *arg) {
    long id = (long)arg;
    int local = (int)id;                        /* nằm trên stack RIÊNG của luồng này */
    char name[16];
    snprintf(name, sizeof name, "worker-%ld", id);
    pthread_setname_np(pthread_self(), name);   /* tên hiện trong /proc/<pid>/task/<tid>/comm */
    pthread_mutex_lock(&m);
    global++;
    heap[id] = (int)id * 10;
    show(name, &local);
    pthread_mutex_unlock(&m);
    sleep(3);                                   /* đứng yên để ta soi /proc */
    return NULL;
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    heap = calloc(4, sizeof *heap);
    int local = 0;
    show("main", &local);
    pthread_t t[3];
    for (long i = 1; i <= 3; i++) pthread_create(&t[i - 1], NULL, worker, (void *)i);
    for (int i = 0; i < 3; i++) pthread_join(t[i], NULL);
    printf("after join: global=%d  heap[1..3]=%d %d %d\n", global, heap[1], heap[2], heap[3]);
    return 0;
}
