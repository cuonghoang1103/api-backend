/* hog.c TÊN — đốt CPU tới khi nhận SIGTERM, rồi in mình đã chạy được bao nhiêu vòng (triệu) và bao nhiêu giây CPU. */
#include <signal.h>
#include <stdio.h>
#include <sys/resource.h>
#include <unistd.h>

static volatile sig_atomic_t stop = 0;
static void on_term(int s) { (void)s; stop = 1; }

int main(int argc, char **argv) {
    signal(SIGTERM, on_term);
    unsigned long long n = 0;
    while (!stop) n++;
    struct rusage ru; getrusage(RUSAGE_SELF, &ru);
    printf("%-7s nice=%-3d loops=%6llu M  cpu=%.2f s\n", argc > 1 ? argv[1] : "hog",
           getpriority(PRIO_PROCESS, 0), n / 1000000, ru.ru_utime.tv_sec + ru.ru_utime.tv_usec / 1e6);
    return 0;
}
