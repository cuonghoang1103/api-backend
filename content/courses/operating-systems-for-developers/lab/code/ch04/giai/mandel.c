/* giai/mandel.c — LỜI GIẢI bài tự viết 4.1: vẽ tập Mandelbrot W×H bằng T luồng pthread.
 * Việc mỗi hàng rất KHÔNG đều (hàng cắt qua thân "con bọ" chạy đủ MAXIT vòng cho mỗi điểm, hàng ở rìa thoát ngay).
 *   ./mandel static T     chia tĩnh: luồng i nhận dải hàng liền [i*H/T, (i+1)*H/T)
 *   ./mandel dynamic T    chia động: luồng lấy hàng kế tiếp bằng atomic_fetch_add — một "hàng đợi" chỉ là một số nguyên
 * In: thời gian, tổng số vòng lặp (checksum — phải giống nhau ở mọi cách chia) và thời gian bận của từng luồng.
 * Thêm "ascii" ở cuối để in một bản thu nhỏ 64×24 (kiểm bằng mắt rằng hình đúng).
 */
#include <pthread.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define W 1600
#define H 1200
#define MAXIT 2000
static int iters[H][W];
static atomic_int next_row;
static int T, dynamic_mode;

static double now_ms(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }

static void row(int y) {
    for (int x = 0; x < W; x++) {
        double cr = -2.2 + 3.2 * x / W, ci = -1.2 + 2.4 * y / H, zr = 0, zi = 0;
        int i = 0;
        while (i < MAXIT && zr * zr + zi * zi < 4) { double t = zr * zr - zi * zi + cr; zi = 2 * zr * zi + ci; zr = t; i++; }
        iters[y][x] = i;
    }
}

struct arg { int id; double busy; int rows; };
static void *worker(void *p) {
    struct arg *a = p;
    double t0 = now_ms();
    if (dynamic_mode) {
        int y;
        while ((y = atomic_fetch_add(&next_row, 1)) < H) { row(y); a->rows++; }
    } else {
        for (int y = a->id * H / T; y < (a->id + 1) * H / T; y++) { row(y); a->rows++; }
    }
    a->busy = now_ms() - t0;
    return NULL;
}

int main(int argc, char **argv) {
    dynamic_mode = !strcmp(argv[1], "dynamic");
    T = atoi(argv[2]);
    pthread_t th[64];
    struct arg a[64] = {0};
    double t0 = now_ms();
    for (int i = 0; i < T; i++) { a[i].id = i; pthread_create(&th[i], NULL, worker, &a[i]); }
    for (int i = 0; i < T; i++) pthread_join(th[i], NULL);
    double ms = now_ms() - t0;
    long sum = 0;
    for (int y = 0; y < H; y++) for (int x = 0; x < W; x++) sum += iters[y][x];
    if (argc > 3 && !strcmp(argv[3], "ascii"))
        for (int y = 0; y < H; y += H / 24) { for (int x = 0; x < W; x += W / 64) putchar(iters[y][x] == MAXIT ? '#' : iters[y][x] > 20 ? '+' : iters[y][x] > 6 ? '.' : ' '); putchar('\n'); }
    for (int i = 0; i < T; i++) printf("  thread %d busy %5.0f ms, %4d rows\n", i, a[i].busy, a[i].rows);
    printf("%-7s T=%d checksum=%ld  %6.0f ms\n", argv[1], T, sum, ms);
    return 0;
}
