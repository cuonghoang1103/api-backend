/* eintr.c — một tín hiệu đến GIỮA lúc tiến trình đang chặn trong read()/poll(). Con viết "data" vào ống sau 2 s;
 * SIGALRM đến sau 1 s.   ./eintr restart | norestart | poll */
#include <errno.h>
#include <poll.h>
#include <signal.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

static double t0;
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9 - t0; }
static void on_alarm(int sig) { (void)sig; }      /* does nothing: its only job is to interrupt */

int main(int argc, char **argv) {
    const char *mode = argv[1];
    setvbuf(stdout, NULL, _IONBF, 0);
    int p[2];
    if (pipe(p) < 0) return 1;
    if (fork() == 0) { sleep(2); if (write(p[1], "data\n", 5) != 5) _exit(1); _exit(0); }
    struct sigaction sa;
    memset(&sa, 0, sizeof sa);
    sa.sa_handler = on_alarm;
    sa.sa_flags = strcmp(mode, "norestart") ? SA_RESTART : 0;
    sigaction(SIGALRM, &sa, NULL);
    t0 = now();
    alarm(1);
    char buf[64];
    if (!strcmp(mode, "poll")) {
        struct pollfd pf = { .fd = p[0], .events = POLLIN };
        int r = poll(&pf, 1, -1);
        printf("%.1fs poll() = %d %s\n", now(), r, r < 0 ? strerror(errno) : "");
        return 0;
    }
    ssize_t n = read(p[0], buf, sizeof buf);
    printf("%.1fs read() = %zd %s\n", now(), n, n < 0 ? strerror(errno) : "");
    while (n < 0 && errno == EINTR) {                 /* the classic C idiom: just ask again */
        n = read(p[0], buf, sizeof buf);
        printf("%.1fs retry: read() = %zd\n", now(), n);
    }
    return 0;
}
