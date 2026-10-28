// hold.c — chiếm N MiB (chạm mọi trang) rồi nằm yên chờ, như một CSDL đã nạp xong bộ đệm (Chương 8).
//   ./hold <MiB>        (chép thành tên khác, vd "postgres", để dòng dmesg dễ đọc)
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char **argv) {
  setvbuf(stdout, NULL, _IOLBF, 0);
  long mib = argc > 1 ? atol(argv[1]) : 100;
  char *p = malloc(mib << 20);
  if (!p) { perror("malloc"); return 1; }
  memset(p, 0x5a, mib << 20);
  __asm__ volatile("" : : "r"(p) : "memory");   // cấm gcc -O2 xoá memset "vô dụng" (không ai đọc p)
  printf("%s pid %d holds %ld MiB\n", argv[0], getpid(), mib);
  for (;;) pause();
}
