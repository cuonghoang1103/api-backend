/* wait.c — 8 luồng "xử lý đơn hàng": tính một chút (~0,5 ms CPU), rồi GIỮ một khoá chung trong lúc "ghi kiểm toán"
 * (ngủ 1 ms — giả một lần fsync / gọi mạng). Thời gian thật dài, CPU thấp: chỗ chậm nằm NGOÀI CPU (bài 15.3).
 *   gcc -O2 -g -fno-omit-frame-pointer -pthread wait.c -o wait
 *   ./wait inside [N]   (bản gốc: ghi kiểm toán BÊN TRONG khoá; N đơn mỗi luồng, mặc định 150)
 *   ./wait outside [N]  (bản sửa: cập nhật dữ liệu chung trong khoá, "ghi" NGOÀI khoá) */
#include <pthread.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#define NOINLINE __attribute__((noinline))
#define THREADS 8
static pthread_mutex_t audit_lock = PTHREAD_MUTEX_INITIALIZER;
static int outside, orders = 150;
static volatile unsigned long sink;

static double now_ms(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }
NOINLINE void price_order(int id) {                /* việc CPU thật ~0,5 ms */
  unsigned long h = (unsigned long)id;
  for (int i = 0; i < 400000; i++) h = h * 6364136223846793005UL + 1442695040888963407UL;
  sink += h;
}
NOINLINE void write_audit(void) { usleep(1000); sink++; }   /* "fsync" 1 ms: luồng NGỦ, không tốn CPU */
NOINLINE void *worker(void *arg) {
  for (int i = 0; i < orders; i++) {
    price_order(i);
    pthread_mutex_lock(&audit_lock);
    if (!outside) write_audit();                    /* ⚠ ngủ trong khi giữ khoá: 7 luồng kia xếp hàng */
    pthread_mutex_unlock(&audit_lock);
    if (outside) write_audit();
  }
  return arg;
}
int main(int argc, char **argv) {
  outside = argc > 1 && !strcmp(argv[1], "outside");
  if (argc > 2) orders = atoi(argv[2]);
  pthread_t t[THREADS];
  double a = now_ms();
  struct timespec c0, c1; clock_gettime(CLOCK_PROCESS_CPUTIME_ID, &c0);
  for (int i = 0; i < THREADS; i++) pthread_create(&t[i], NULL, worker, NULL);
  for (int i = 0; i < THREADS; i++) pthread_join(t[i], NULL);
  clock_gettime(CLOCK_PROCESS_CPUTIME_ID, &c1);
  double wall = now_ms() - a, cpu = (c1.tv_sec - c0.tv_sec) * 1e3 + (c1.tv_nsec - c0.tv_nsec) / 1e6;
  printf("%d threads x %d orders, audit %s the lock: wall %.0f ms, CPU %.0f ms (%.2f cores busy on average)\n",
         THREADS, orders, outside ? "OUTSIDE" : "inside", wall, cpu, cpu / wall);
  return 0;
}
