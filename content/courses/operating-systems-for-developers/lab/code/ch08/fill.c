// fill.c — chiếm bộ nhớ từng mẩu và cho thấy cgroup phản ứng ra sao (Chương 8).
//   ./fill <MiB> [mẩu MiB] [q]
// Mỗi mẩu: malloc + ghi mọi trang (để RAM thật bị dùng), đo thời gian của mẩu đó, rồi đọc memory.current,
// memory.swap.current và memory.events của CHÍNH cgroup mình (/proc/self/cgroup). "q" = chỉ in mỗi 64 MiB.
// stdout theo dòng: bị SIGKILL giữa chừng thì những dòng đã in vẫn còn.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

static char cg[512];

static long num(const char *file) {           // đọc một số trong /sys/fs/cgroup/<cg>/<file>
  char p[700]; snprintf(p, sizeof p, "%s/%s", cg, file);
  FILE *f = fopen(p, "r"); long v = -1;
  if (f) { if (fscanf(f, "%ld", &v) != 1) v = -1; fclose(f); }
  return v;
}
static long ev(const char *key) {             // một dòng của memory.events, vd "high 12"
  char p[700], k[64]; long v; snprintf(p, sizeof p, "%s/memory.events", cg);
  FILE *f = fopen(p, "r"); if (!f) return -1;
  while (fscanf(f, "%63s %ld", k, &v) == 2) if (!strcmp(k, key)) { fclose(f); return v; }
  fclose(f); return -1;
}
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }

int main(int argc, char **argv) {
  setvbuf(stdout, NULL, _IOLBF, 0);
  long total = argc > 1 ? atol(argv[1]) : 256, chunk = argc > 2 ? atol(argv[2]) : 16;
  int quiet = argc > 3 && argv[3][0] == 'q';
  FILE *f = fopen("/proc/self/cgroup", "r"); char line[256] = "0::/";
  if (f) { if (!fgets(line, sizeof line, f)) strcpy(line, "0::/"); fclose(f); }
  line[strcspn(line, "\n")] = 0;
  snprintf(cg, sizeof cg, "/sys/fs/cgroup%s", strcmp(line + 3, "/") ? line + 3 : "");
  printf("%s pid %d: filling %ld MiB in %ld MiB chunks (cgroup %s)\n", argv[0], getpid(), total, chunk, line + 3);
  double t0 = now();
  for (long have = chunk; have <= total; have += chunk) {
    double t = now();
    char *p = malloc(chunk << 20);
    if (!p) { printf("malloc failed at %ld MiB\n", have); return 1; }
    memset(p, 0x5a, chunk << 20);                     // chạm mọi trang ⇒ RAM thật
    __asm__ volatile("" : : "r"(p) : "memory");   // cấm gcc -O2 xoá memset "vô dụng" (không ai đọc p)
    double ms = now() - t;
    if (!quiet || have % 64 == 0)
      printf("%4ld MiB  +%7.1f ms  t=%6.0f ms  current %4ld MiB  swap %4ld MiB  high %ld  max %ld  oom_kill %ld\n",
             have, ms, now() - t0, num("memory.current") >> 20, num("memory.swap.current") >> 20,
             ev("high"), ev("max"), ev("oom_kill"));
  }
  printf("%s: done, holding %ld MiB\n", argv[0], total);
  return 0;
}
