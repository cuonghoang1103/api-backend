/* nb.c — cùng một ống rỗng: read() KHÔNG chặn trả EAGAIN ngay; read() chặn thì ngủ — nhìn nó từ /proc. */
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

static double us(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec * 1e6 + t.tv_nsec / 1e3; }

static void show(const char *what, pid_t pid) {
    char path[64], buf[128] = "";
    snprintf(path, sizeof path, "/proc/%d/%s", pid, what);
    FILE *f = fopen(path, "r");
    if (f && fgets(buf, sizeof buf, f)) buf[strcspn(buf, "\n")] = 0;
    if (f) fclose(f);
    printf("  /proc/%d/%-7s %s\n", pid, what, buf);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);           /* no stdio buffer: fork() must not copy half-printed lines */
    int p[2], q[2];
    if (pipe(p) < 0 || pipe(q) < 0) return 1;
    char buf[64];

    fcntl(p[0], F_SETFL, O_NONBLOCK);
    double t = us();
    ssize_t n = read(p[0], buf, sizeof buf);
    printf("non-blocking read() = %zd %s after %.0f us\n", n, n < 0 ? strerror(errno) : "", us() - t);

    pid_t kid = fork();
    if (kid == 0) { ssize_t m = read(q[0], buf, sizeof buf); printf("blocking reader woke up: read() = %zd\n", m); exit(0); }
    usleep(300000);
    printf("blocking reader %d after 0.3 s:\n", kid);
    show("wchan", kid);
    show("syscall", kid);
    if (write(q[1], "data\n", 5) != 5) return 1;
    waitpid(kid, NULL, 0);
    return 0;
}
