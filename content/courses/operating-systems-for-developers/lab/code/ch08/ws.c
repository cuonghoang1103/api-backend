// ws.c — một "working set" N MiB được chạm đi chạm lại; đo mỗi lượt tốn bao lâu và bao nhiêu major fault (Chương 8).
//   ./ws <MiB> <lượt> [rand|seq]            bộ nhớ ẩn danh (anonymous): ghi 1 byte mỗi trang mỗi lượt
//   ./ws <MiB> <lượt> [rand|seq] <file>     ánh xạ một FILE (mmap, chỉ đọc): đọc 1 byte mỗi trang mỗi lượt
// Vừa RAM: mỗi lượt vài ms, 0 major fault. Không vừa RAM: mỗi trang phải đọc lại từ swap (hoặc từ file) ⇒ thrashing.
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/resource.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }
static long majflt(void) { struct rusage r; getrusage(RUSAGE_SELF, &r); return r.ru_majflt; }

int main(int argc, char **argv) {
  setvbuf(stdout, NULL, _IOLBF, 0);
  if (argc < 3) { fprintf(stderr, "usage: ws MiB passes [rand|seq] [file]\n"); return 2; }
  long mib = atol(argv[1]), passes = atol(argv[2]), pages = mib * 256;
  int rnd = !(argc > 3 && !strcmp(argv[3], "seq"));
  const char *path = argc > 4 ? argv[4] : NULL;
  volatile unsigned char *m;
  if (path) {
    int fd = open(path, O_RDONLY); struct stat st;
    if (fd < 0 || fstat(fd, &st) || st.st_size < (off_t)mib << 20) { perror(path); return 1; }
    m = mmap(NULL, mib << 20, PROT_READ, MAP_SHARED, fd, 0);
  } else {
    m = mmap(NULL, mib << 20, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  }
  if (m == MAP_FAILED) { perror("mmap"); return 1; }
  long *ord = malloc(pages * sizeof *ord);
  for (long i = 0; i < pages; i++) ord[i] = i;
  srand(42);
  if (rnd) for (long i = pages - 1; i > 0; i--) { long j = rand() % (i + 1), t = ord[i]; ord[i] = ord[j]; ord[j] = t; }
  unsigned sum = 0;
  if (!path) for (long i = 0; i < pages; i++) m[i * 4096] = 1;          // lượt 0: tạo working set
  printf("working set %ld MiB (%ld pages, %s, %s)\n", mib, pages, path ? "file" : "anon", rnd ? "random order" : "sequential");
  for (long p = 1; p <= passes; p++) {
    long f0 = majflt(); double t = now();
    for (long i = 0; i < pages; i++) {
      if (path) sum += m[ord[i] * 4096]; else m[ord[i] * 4096] += 1;
    }
    double ms = now() - t;
    printf("pass %ld: %8.1f ms  %7.0f ns/page  major faults %6ld\n", p, ms, ms * 1e6 / pages, majflt() - f0);
  }
  return sum == 12345 ? 3 : 0;
}
