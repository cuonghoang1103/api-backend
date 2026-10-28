// flag.c — cùng chuyện đó trong C: luồng chờ quay vòng trên một cờ thường, gcc -O2.
//   ./flag plain     int ready            ./flag atomic    _Atomic int ready
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int ready;                  // biến thường
atomic_int aready;          // biến nguyên tử
int use_atomic;

void *waiter(void *arg) {
    if (use_atomic) while (!atomic_load(&aready)) {}
    else while (!ready) {}  // -O2: trình biên dịch được phép đọc ready MỘT lần rồi quay vòng mãi
    puts("waiter: saw ready = 1");
    return NULL;
}

int main(int argc, char **argv) {
    setvbuf(stdout, NULL, _IONBF, 0);   // in ngay (bị timeout giết thì không mất chữ trong bộ đệm — bài 1.2)
    use_atomic = argc > 1 && !strcmp(argv[1], "atomic");
    pthread_t t; pthread_create(&t, NULL, waiter, NULL);
    usleep(100000);
    ready = 1; atomic_store(&aready, 1);
    puts("main: ready = 1");
    pthread_join(t, NULL);
    return 0;
}
