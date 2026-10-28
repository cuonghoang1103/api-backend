// exec.c — exec thay chương trình nhưng giữ nguyên PID
#include <stdio.h>
#include <unistd.h>
int main(void) {
    printf("I am exec.c, pid=%d — now becoming ps\n", getpid());
    fflush(stdout);
    execlp("ps", "ps", "-o", "pid,ppid,comm", NULL);   /* thành công thì không bao giờ quay lại */
    perror("execlp");                                  /* chỉ chạy tới đây khi exec thất bại */
    return 127;
}
