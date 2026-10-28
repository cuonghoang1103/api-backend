// spawncost.c — giá của việc tạo tiến trình: fork+exec+wait /bin/true, posix_spawn, và tạo một luồng
#include <stdio.h>
#include <spawn.h>
#include <pthread.h>
#include <time.h>
#include <unistd.h>
#include <sys/wait.h>
extern char **environ;
#define N 2000
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }
static void *noop(void *a) { return a; }
int main(void) {
    char *argv[] = { "true", NULL };
    double t = now();
    for (int i = 0; i < N; i++) { pid_t p = fork(); if (p == 0) { execv("/bin/true", argv); _exit(127); } waitpid(p, NULL, 0); }
    printf("fork + exec + wait : %6.1f us each\n", (now() - t) * 1e6 / N);
    t = now();
    for (int i = 0; i < N; i++) { pid_t p; posix_spawn(&p, "/bin/true", NULL, NULL, argv, environ); waitpid(p, NULL, 0); }
    printf("posix_spawn + wait : %6.1f us each\n", (now() - t) * 1e6 / N);
    t = now();
    for (int i = 0; i < N; i++) { pid_t p = fork(); if (p == 0) _exit(0); waitpid(p, NULL, 0); }
    printf("fork + wait (no exec): %4.1f us each\n", (now() - t) * 1e6 / N);
    t = now();
    for (int i = 0; i < N; i++) { pthread_t th; pthread_create(&th, NULL, noop, NULL); pthread_join(th, NULL); }
    printf("pthread_create+join: %6.1f us each\n", (now() - t) * 1e6 / N);
    return 0;
}
