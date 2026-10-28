// wbench.c — ghi N bản ghi 4 KiB vào một file theo 6 cách, đo thời gian mỗi lần ghi.   ./wbench <file> <N>
//   buffered        : write() vào page cache, không đợi đĩa                       (mặc định của mọi ngôn ngữ)
//   fsync-each      : write() + fsync() sau MỖI bản ghi                            (dữ liệu + metadata xuống đĩa)
//   fdatasync-each  : write() + fdatasync() sau mỗi bản ghi                        (bỏ qua metadata không cần để đọc lại)
//   O_DSYNC         : mở file với O_DSYNC — mỗi write() tự đợi như fdatasync
//   O_DIRECT        : bỏ qua page cache, DMA thẳng từ bộ đệm căn lề 4096 (vẫn KHÔNG bảo đảm bền nếu không fsync)
//   O_DIRECT+fdsync : O_DIRECT + fdatasync() mỗi bản ghi
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }

int main(int argc, char **argv) {
  const char *file = argv[1]; int n = atoi(argv[2]);
  const char *mode[] = { "buffered", "fsync-each", "fdatasync-each", "O_DSYNC", "O_DIRECT", "O_DIRECT+fdsync" };
  setvbuf(stdout, NULL, _IOLBF, 0);                  // in theo dòng để thứ tự khớp với stderr
  char *buf; if (posix_memalign((void **)&buf, 4096, 4096)) return 1;
  memset(buf, 'x', 4096);
  for (int m = 0; m < 6; m++) {
    unlink(file);
    int fl = O_WRONLY | O_CREAT | (m == 3 ? O_DSYNC : 0) | (m >= 4 ? O_DIRECT : 0);
    int fd = open(file, fl, 0644);
    if (fd < 0) { perror(mode[m]); continue; }
    double t0 = now();
    for (int i = 0; i < n; i++) {
      if (write(fd, buf, 4096) != 4096) { perror("write"); return 1; }
      if (m == 1) fsync(fd);
      if (m == 2 || m == 5) fdatasync(fd);
    }
    double t = now() - t0;
    close(fd);
    printf("%-16s %5d writes  %8.1f ms  %8.1f us/write\n", mode[m], n, t * 1e3, t * 1e6 / n);
  }
  int fd = open(file, O_WRONLY | O_DIRECT);           // O_DIRECT với bộ đệm KHÔNG căn lề 4096 byte
  ssize_t r = write(fd, buf + 1, 4096);
  if (r < 0) perror("O_DIRECT, buffer at an odd address"); else printf("unaligned O_DIRECT wrote %zd\n", r);
  return 0;
}
