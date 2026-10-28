// overc.c — overcommit: malloc một khối thật lớn và KHÔNG chạm vào nó (Chương 8).
//   ./overc <GiB>
// In malloc có thành công không, rồi CommitLimit / Committed_AS của /proc/meminfo trước và sau.
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static long meminfo(const char *key) {          // kB
  FILE *f = fopen("/proc/meminfo", "r"); char k[64]; long v = -1, x;
  while (f && fscanf(f, "%63s %ld kB\n", k, &x) == 2) if (!strncmp(k, key, strlen(key)) && k[strlen(key)] == ':') v = x;
  if (f) fclose(f);
  return v;
}

int main(int argc, char **argv) {
  long gib = argc > 1 ? atol(argv[1]) : 64;
  long before = meminfo("Committed_AS");
  void *p = malloc((size_t)gib << 30);
  int e = errno;
  if (p) printf("malloc(%ld GiB) = %p  OK — nothing touched yet\n", gib, p);
  else   printf("malloc(%ld GiB) = NULL  (%s)\n", gib, strerror(e));
  printf("CommitLimit %ld MiB · Committed_AS %ld → %ld MiB\n", meminfo("CommitLimit") >> 10, before >> 10, meminfo("Committed_AS") >> 10);
  free(p);
  return p ? 0 : 1;
}
