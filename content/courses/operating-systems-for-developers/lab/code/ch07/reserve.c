// reserve.c — ask for a lot, touch a little: VSZ vs RSS.
//   ./reserve <MiB to malloc> <MiB to actually write>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static void show(const char *when) {
    char line[256];
    FILE *f = fopen("/proc/self/status", "r");
    printf("%-28s", when);
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, "VmSize", 6) || !strncmp(line, "VmRSS", 5)) {
            line[strcspn(line, "\n")] = 0;
            printf("  %s", line);
        }
    printf("\n");
    fclose(f);
}

int main(int argc, char **argv) {
    size_t ask = strtoul(argv[1], 0, 10) << 20, touch = strtoul(argv[2], 0, 10) << 20;
    show("start");
    char *p = malloc(ask);
    show("after malloc");
    memset(p, 1, touch);
    __asm__ volatile("" : : "r"(p) : "memory");   // keep -O2 from deleting the unused buffer
    show("after writing");
    fflush(stdout);
    if (argc > 3) pause();             // "./reserve 1024 100 wait" stays alive for ps
    return 0;
}
