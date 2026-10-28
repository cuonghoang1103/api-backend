// sb.c — phép thử "store buffering": CPU có được ĐẢO thứ tự ghi-rồi-đọc của một luồng không?
//   Luồng A:  x = 1;  r1 = y;          Luồng B:  y = 1;  r2 = x;
//   Theo thứ tự trong mã, ít nhất một luồng phải thấy 1 ⇒ (r1, r2) = (0, 0) "không thể xảy ra".
//   ./sb relaxed   thao tác nguyên tử nhưng KHÔNG ràng buộc thứ tự    ./sb seq_cst   thứ tự tuần tự (mặc định của C11/Java volatile)
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>
#include <string.h>

#define ITERS 1000000
static atomic_int x, y, go, done;
static int r1, r2, sc;

static void *A(void *arg) {
    for (int i = 1; i <= ITERS; i++) {
        while (atomic_load_explicit(&go, memory_order_acquire) != i) {}
        if (sc) { atomic_store(&x, 1); r1 = atomic_load(&y); }
        else { atomic_store_explicit(&x, 1, memory_order_relaxed); r1 = atomic_load_explicit(&y, memory_order_relaxed); }
        atomic_fetch_add_explicit(&done, 1, memory_order_release);
    }
    return NULL;
}
static void *B(void *arg) {
    for (int i = 1; i <= ITERS; i++) {
        while (atomic_load_explicit(&go, memory_order_acquire) != i) {}
        if (sc) { atomic_store(&y, 1); r2 = atomic_load(&x); }
        else { atomic_store_explicit(&y, 1, memory_order_relaxed); r2 = atomic_load_explicit(&x, memory_order_relaxed); }
        atomic_fetch_add_explicit(&done, 1, memory_order_release);
    }
    return NULL;
}

int main(int argc, char **argv) {
    sc = argc > 1 && !strcmp(argv[1], "seq_cst");
    pthread_t a, b; pthread_create(&a, NULL, A, NULL); pthread_create(&b, NULL, B, NULL);
    long both0 = 0;
    for (int i = 1; i <= ITERS; i++) {
        atomic_store(&x, 0); atomic_store(&y, 0); atomic_store(&done, 0);
        atomic_store_explicit(&go, i, memory_order_release);           // cho hai luồng chạy vòng thứ i
        while (atomic_load_explicit(&done, memory_order_acquire) != 2) {}
        if (r1 == 0 && r2 == 0) both0++;
    }
    pthread_join(a, NULL); pthread_join(b, NULL);
    printf("%-8s %d runs: r1=0 and r2=0 (\"impossible\") seen %ld times\n", sc ? "seq_cst" : "relaxed", ITERS, both0);
    return 0;
}
