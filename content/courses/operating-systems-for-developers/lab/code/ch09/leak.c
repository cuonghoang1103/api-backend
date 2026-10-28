// leak.c — mở một file bí mật rồi exec một chương trình khác. ./leak [cloexec]
// Không O_CLOEXEC: fd đi THEO sang chương trình mới (exec giữ nguyên bảng fd). Có O_CLOEXEC: nhân tự đóng lúc exec.
#include <fcntl.h>
#include <string.h>
#include <unistd.h>
int main(int argc, char **argv) {
  int flags = O_RDONLY | (argc > 1 && !strcmp(argv[1], "cloexec") ? O_CLOEXEC : 0);
  open("/tmp/app/.env", flags);                       // fd 3 — chương trình "quên" đóng
  execl("/bin/ls", "ls", "-l", "/proc/self/fd", (char *)0);  // chạy một tiện ích bên thứ ba
  return 1;
}
