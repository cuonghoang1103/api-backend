/* primes.c — đếm số nguyên tố trong [2, N) bằng phép chia thử: việc CPU thuần, KHÔNG đều (số càng lớn càng tốn).
 *
 *   ./primes seq   1 N        một luồng, làm mốc
 *   ./primes fork  P N        P tiến trình con (fork), mỗi con một khúc liền, gửi kết quả qua pipe, cha wait()
 *   ./primes block T N        T luồng pthread, mỗi luồng một khúc LIỀN — chia tĩnh
 *   ./primes queue T N        T luồng lấy việc từ một HÀNG ĐỢI các khúc 10 000 số (mutex) — chia động
 *   thêm "-v" ở cuối: in thời gian bận của từng luồng/tiến trình (thấy mất cân bằng)
 */
#define _GNU_SOURCE
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

static double now_ms(void) {
    struct timespec t;
    clock_gettime(CLOCK_MONOTONIC, &t);
    return t.tv_sec * 1e3 + t.tv_nsec / 1e6;
}

static int is_prime(long n) {
    if (n < 2) return 0;
    if (n % 2 == 0) return n == 2;
    for (long d = 3; d * d <= n; d += 2)
        if (n % d == 0) return 0;
    return 1;
}

/* noinline: MỌI cách chia việc chạy CÙNG một bản mã máy của vòng lặp nóng — nếu không, gcc dựng mỗi chỗ gọi một bản
 * hơi khác và trên Apple M1 riêng chuyện căn lề vòng lặp đã lệch nhau tới ~20% (đo được trước khi thêm dòng này). */
__attribute__((noinline)) static long count_range(long lo, long hi) {           /* [lo, hi) */
    long c = 0;
    for (long n = lo; n < hi; n++) c += is_prime(n);
    return c;
}

/* ---------- hàng đợi việc: các khúc [i*CHUNK, (i+1)*CHUNK) ---------- */
#define CHUNK 10000
static long N, next_chunk, nchunks;
static pthread_mutex_t qlock = PTHREAD_MUTEX_INITIALIZER;

static long take_chunk(void) {                          /* -1 = hết việc */
    pthread_mutex_lock(&qlock);
    long c = next_chunk < nchunks ? next_chunk++ : -1;
    pthread_mutex_unlock(&qlock);
    return c;
}

struct arg { long lo, hi, found; int chunks; double busy; };

static void *block_worker(void *p) {
    struct arg *a = p;
    double t0 = now_ms();
    a->found = count_range(a->lo, a->hi);
    a->busy = now_ms() - t0;
    return NULL;
}

static void *queue_worker(void *p) {
    struct arg *a = p;
    double t0 = now_ms();
    long c;
    while ((c = take_chunk()) >= 0) {
        long lo = c * CHUNK, hi = lo + CHUNK < N ? lo + CHUNK : N;
        a->found += count_range(lo, hi);
        a->chunks++;
    }
    a->busy = now_ms() - t0;
    return NULL;
}

int main(int argc, char **argv) {
    if (argc < 4) { fprintf(stderr, "usage: %s seq|fork|block|queue T N [-v]\n", argv[0]); return 2; }
    const char *mode = argv[1];
    int t = atoi(argv[2]);
    N = atol(argv[3]);
    int verbose = argc > 4 && !strcmp(argv[4], "-v");
    long total = 0;
    double t0 = now_ms();

    if (!strcmp(mode, "seq")) {
        total = count_range(0, N);
    } else if (!strcmp(mode, "fork")) {
        int fd[2];
        if (pipe(fd) < 0) { perror("pipe"); return 1; }
        for (int i = 0; i < t; i++) {
            if (fork() == 0) {                          /* con: đếm khúc của mình, ghi kết quả vào pipe, thoát */
                close(fd[0]);
                long lo = N * i / t, hi = N * (i + 1) / t;
                double s = now_ms();
                long r[2] = { count_range(lo, hi), 0 };
                r[1] = (long)(now_ms() - s);
                if (write(fd[1], r, sizeof r) != sizeof r) _exit(1);
                _exit(0);
            }
        }
        close(fd[1]);
        long r[2];
        int k = 0;
        while (read(fd[0], r, sizeof r) == sizeof r) {
            total += r[0];
            if (verbose) printf("  child %d finished after %ld ms\n", k++, r[1]);
        }
        while (wait(NULL) > 0) ;                        /* dọn hết con — không để zombie */
    } else {
        int q = !strcmp(mode, "queue");
        if (q) { next_chunk = 0; nchunks = (N + CHUNK - 1) / CHUNK; }
        pthread_t *th = calloc(t, sizeof *th);
        struct arg *a = calloc(t, sizeof *a);
        for (int i = 0; i < t; i++) {
            a[i].lo = N * i / t; a[i].hi = N * (i + 1) / t;
            pthread_create(&th[i], NULL, q ? queue_worker : block_worker, &a[i]);
        }
        for (int i = 0; i < t; i++) {
            pthread_join(th[i], NULL);
            total += a[i].found;
        }
        if (verbose)
            for (int i = 0; i < t; i++) {
                if (q) printf("  thread %d busy %5.0f ms, %3d chunks\n", i, a[i].busy, a[i].chunks);
                else   printf("  thread %d busy %5.0f ms  [%ld, %ld)\n", i, a[i].busy, a[i].lo, a[i].hi);
            }
    }
    printf("%-5s x%-2d N=%ld primes=%ld  %6.0f ms\n", mode, t, N, total, now_ms() - t0);
    return 0;
}
