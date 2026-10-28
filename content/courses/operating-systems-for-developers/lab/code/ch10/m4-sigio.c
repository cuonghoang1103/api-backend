/* Mô hình 4 — I/O theo tín hiệu: nhờ nhân gửi SIGIO khi fd sẵn sàng; trong lúc đó luồng tự do (ở đây: ngủ trong sigsuspend). */
#include "cho.h"
#include <signal.h>
static volatile sig_atomic_t ready;
static void on_io(int sig) { (void)sig; ready = 1; }
int main(void) {
    int fd = slow_pipe();
    struct sigaction sa = { .sa_handler = on_io };
    sigaction(SIGIO, &sa, NULL);
    fcntl(fd, F_SETOWN, getpid());              /* gửi SIGIO cho tiến trình này */
    fcntl(fd, F_SETFL, O_ASYNC | O_NONBLOCK);
    sigset_t io, old;
    sigemptyset(&io); sigaddset(&io, SIGIO);
    sigprocmask(SIG_BLOCK, &io, &old);
    long calls = 1;
    while (!ready) { sigsuspend(&old); calls++; }   /* "làm việc khác" — ở đây là ngủ chờ tín hiệu */
    char b[64];
    ssize_t n = read(fd, b, sizeof b);
    report("4 signal (SIGIO)", n, calls);
}
