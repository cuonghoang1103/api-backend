/* spawn.c — chạy /usr/bin/true N lần bằng ba cách, đo µs mỗi lần (Chương 14, bài 14.2).
 *   ./spawn N MiB   — MiB = cỡ bộ nhớ cha đã chạm (fork phải sao bảng trang của chừng ấy bộ nhớ)
 * Chạy được cả trên macOS (clang) lẫn Linux (gcc): cùng một mã POSIX. */
#include <spawn.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>
#ifdef __linux__
#include <sys/mman.h>
#endif
extern char **environ;

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e6 + t.tv_nsec / 1e3; }

int main(int argc, char **argv) {
  int n = argc > 1 ? atoi(argv[1]) : 200;
  size_t mib = argc > 2 ? strtoul(argv[2], 0, 10) : 0;
  char *heap = NULL;
  if (mib) {
    heap = malloc(mib << 20);
#ifdef __linux__
    madvise((void *)((unsigned long)heap & ~4095UL), mib << 20, MADV_NOHUGEPAGE);  /* trang 4 KiB thật, không gộp 2 MiB (THP) */
#endif
    memset(heap, 1, mib << 20);                                                   /* chạm mọi trang */
  }
  char *args[] = { "true", NULL };
  const char *path = "/usr/bin/true";
  double t0, fk = 0, vf = 0, ps = 0;
  int st;

  t0 = now();
  for (int i = 0; i < n; i++) {
    pid_t p = fork();
    if (p == 0) { execve(path, args, environ); _exit(127); }
    waitpid(p, &st, 0);
  }
  fk = (now() - t0) / n;

  t0 = now();
  for (int i = 0; i < n; i++) {
    pid_t p = vfork();
    if (p == 0) { execve(path, args, environ); _exit(127); }
    waitpid(p, &st, 0);
  }
  vf = (now() - t0) / n;

  t0 = now();
  for (int i = 0; i < n; i++) {
    pid_t p;
    if (posix_spawn(&p, path, NULL, NULL, args, environ) != 0) { perror("posix_spawn"); return 1; }
    waitpid(p, &st, 0);
  }
  ps = (now() - t0) / n;

  printf("parent touched %4zu MiB | fork+exec %7.1f us | vfork+exec %7.1f us | posix_spawn %7.1f us\n", mib, fk, vf, ps);
  free(heap);
  return 0;
}
