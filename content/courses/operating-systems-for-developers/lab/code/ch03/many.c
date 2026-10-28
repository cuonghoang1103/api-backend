/* many.c N — tạo N luồng ngủ, rồi đọc /proc/self/status: mỗi luồng giữ một stack ẢO 8 MB nhưng gần như không tốn RAM thật. */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static void *nap(void *a) { (void)a; sleep(2); return NULL; }

int main(int argc, char **argv) {
    int n = argc > 1 ? atoi(argv[1]) : 1;
    pthread_t *t = malloc(n * sizeof *t);
    for (int i = 0; i < n; i++)
        if (pthread_create(&t[i], NULL, nap, NULL) != 0) { printf("pthread_create failed at %d\n", i); n = i; break; }
    usleep(200000);
    FILE *f = fopen("/proc/self/status", "r");
    char line[256];
    printf("threads requested=%-5d ", n);
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, "Threads:", 8) || !strncmp(line, "VmSize:", 7) || !strncmp(line, "VmRSS:", 6)) {
            line[strcspn(line, "\n")] = 0;
            for (char *p = line; *p; p++) if (*p == '\t') *p = ' ';
            printf("| %s ", line);
        }
    printf("\n");
    for (int i = 0; i < n; i++) pthread_join(t[i], NULL);
    return 0;
}
