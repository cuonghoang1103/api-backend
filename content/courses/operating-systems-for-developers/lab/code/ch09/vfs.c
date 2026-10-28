// vfs.c — đọc mấy file nằm trên các hệ thống file KHÁC NHAU bằng đúng một bộ syscall (open/read/close),
// rồi hỏi nhân "file này thuộc hệ thống file nào" (fstatfs → f_type, số ma thuật của từng loại).
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/vfs.h>

int main(int argc, char **argv) {
  for (int i = 1; i < argc; i++) {
    char buf[64];
    int fd = open(argv[i], O_RDONLY);
    ssize_t n = read(fd, buf, sizeof buf - 1);
    buf[n > 0 ? n : 0] = 0;
    for (char *c = buf; *c; c++) if (*c == '\n') *c = ' ';
    struct statfs s;
    fstatfs(fd, &s);
    close(fd);
    const char *t = s.f_type == 0x9fa0 ? "proc" : s.f_type == 0x01021994 ? "tmpfs"
                  : s.f_type == 0xef53 ? "ext4" : s.f_type == 0x794c7630 ? "overlay" : "?";
    printf("%-22s f_type=0x%lx (%s)  first bytes: %.12s\n", argv[i], (long)s.f_type, t, buf);
  }
}
