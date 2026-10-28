// sig.c — bắt SIGTERM để dọn dẹp; SIGKILL thì không bắt được
#include <stdio.h>
#include <signal.h>
#include <unistd.h>
static volatile sig_atomic_t stop = 0;
static void on_term(int s) { (void)s; stop = 1; }          /* handler chỉ đặt cờ — việc nặng làm ở vòng chính */
int main(void) {
    struct sigaction sa = { .sa_handler = on_term };
    sigaction(SIGTERM, &sa, NULL);
    printf("pid %d working…\n", getpid()); fflush(stdout);
    while (!stop) pause();                                  /* ngủ tới khi có tín hiệu */
    printf("got SIGTERM: flushing, closing files, exiting cleanly\n");
    return 0;
}
