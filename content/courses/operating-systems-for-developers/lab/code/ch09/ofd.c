// ofd.c — fd, "open file description" (mô tả file mở) và offset. ./ofd <dup|twice|append|fork> <file>
//   dup    : fd 3 = open(), fd 4 = dup(3)      → HAI fd, MỘT mô tả ⇒ chung offset, ghi nối tiếp nhau
//   twice  : fd 3 = open(), fd 4 = open() lần 2 → HAI mô tả ⇒ mỗi cái một offset, ghi ĐÈ lên nhau
//   append : như twice nhưng O_APPEND           → mỗi write nhảy tới cuối file trước khi ghi
//   fork   : open() rồi fork(): cha và con mỗi bên một fd, nhưng CHUNG mô tả ⇒ chung offset
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

static void pos(const char *who, int fd) {          // đọc offset từ /proc/self/fdinfo/<fd> — nhân nói, không phải ta tự đếm
  char p[64], line[128]; snprintf(p, sizeof p, "/proc/self/fdinfo/%d", fd);
  FILE *f = fopen(p, "r"); if (!fgets(line, sizeof line, f)) line[0] = 0; fclose(f);
  printf("  %-7s fd %d  %s", who, fd, line); fflush(stdout);
}
static void w(int fd, const char *s) { if (write(fd, s, strlen(s)) < 0) perror("write"); }

int main(int argc, char **argv) {
  const char *m = argv[1], *file = argv[2];
  int fl = O_WRONLY | O_CREAT | O_TRUNC;
  if (!strcmp(m, "fork")) {
    int fd = open(file, fl, 0644);
    if (fork() == 0) { w(fd, "child  line 1\n"); w(fd, "child  line 2\n"); pos("child", fd); _exit(0); }
    wait(NULL);
    w(fd, "parent line 3\n"); pos("parent", fd);
    return 0;
  }
  int a = open(file, fl, 0644), b;
  if (!strcmp(m, "dup")) b = dup(a);
  else b = open(file, O_WRONLY | (strcmp(m, "append") ? 0 : O_APPEND));
  if (!strcmp(m, "append")) { close(a); a = open(file, O_WRONLY | O_APPEND); }
  w(a, "worker A: order 1001 paid\n");
  w(b, "worker B: hi\n");
  pos("A", a); pos("B", b);
  return 0;
}
