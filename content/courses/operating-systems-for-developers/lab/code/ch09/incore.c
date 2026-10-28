// incore.c — bao nhiêu trang của một file đang nằm trong page cache? (mincore; giống fincore/vmtouch, Chương 8)
//   ./incore <file>          in số trang đang trong RAM
//   ./incore <file> evict    xin nhân bỏ các trang SẠCH của RIÊNG file này khỏi cache (posix_fadvise DONTNEED)
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>

int main(int argc, char **argv) {
  if (argc < 2) { fprintf(stderr, "usage: incore FILE [evict]\n"); return 2; }
  int fd = open(argv[1], O_RDONLY); struct stat st;
  if (fd < 0 || fstat(fd, &st)) { perror(argv[1]); return 1; }
  if (argc > 2 && !strcmp(argv[2], "evict")) {
    fdatasync(fd);
    posix_fadvise(fd, 0, 0, POSIX_FADV_DONTNEED);
  }
  long pages = (st.st_size + 4095) / 4096, in = 0;
  void *m = mmap(NULL, st.st_size, PROT_READ, MAP_SHARED, fd, 0);
  unsigned char *v = malloc(pages);
  if (m == MAP_FAILED || mincore(m, st.st_size, v)) { perror("mincore"); return 1; }
  for (long i = 0; i < pages; i++) in += v[i] & 1;
  printf("%s: %ld MiB, %ld of %ld pages in page cache (%.0f%%)\n", argv[1], (long)(st.st_size >> 20), in, pages, 100.0 * in / pages);
  return 0;
}
