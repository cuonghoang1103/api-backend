// ids.c — in "danh tính" của tiến trình đang chạy: uid/gid THẬT (ai gọi) và HIỆU LỰC (nhân dùng để kiểm quyền).
// Chương trình setuid đổi uid hiệu lực thành chủ của FILE thực thi, uid thật giữ nguyên.
#include <stdio.h>
#include <unistd.h>
int main(void) {
  printf("real uid=%d  effective uid=%d  real gid=%d  effective gid=%d\n", getuid(), geteuid(), getgid(), getegid());
  FILE *f = fopen("/srv/app/.env", "r");
  printf("open /srv/app/.env: %s\n", f ? "OK" : "Permission denied");
  return 0;
}
