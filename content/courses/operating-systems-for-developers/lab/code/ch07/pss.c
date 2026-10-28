// pss.c — one parent fills N MiB, then forks K children that only sleep.
// Every process "has" the same N MiB in its RSS, but the physical pages exist once.
// The parent then prints Rss / Pss / Shared / Private for all of them from smaps_rollup.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <unistd.h>

// Sum the given smaps_rollup lines (kB) for one process, return MiB.
static long field(int pid, const char *a, const char *b) {
    char path[64], line[256], key[64];
    long sum = 0, v;
    snprintf(path, sizeof path, "/proc/%d/smaps_rollup", pid);
    FILE *f = fopen(path, "r");
    while (fgets(line, sizeof line, f))
        if (sscanf(line, "%63[^:]: %ld", key, &v) == 2 && (!strcmp(key, a) || (b && !strcmp(key, b))))
            sum += v;
    fclose(f);
    return sum / 1024;
}

int main(int argc, char **argv) {
    size_t n = strtoul(argv[1], 0, 10) << 20;
    int k = atoi(argv[2]), pids[16];
    char *data = malloc(n);
    memset(data, 7, n);                         // really allocate it
    __asm__ volatile("" : : "r"(data) : "memory");   // keep -O2 from deleting the unused buffer
    pids[0] = getpid();
    for (int i = 1; i <= k; i++)
        if ((pids[i] = fork()) == 0) { sleep(3); _exit(0); }   // child: never writes
    usleep(300 * 1000);
    long rs = 0, ps = 0;
    printf("%-8s %8s %8s %8s %8s   (MiB)\n", "pid", "Rss", "Pss", "Shared", "Private");
    for (int i = 0; i <= k; i++) {
        long r = field(pids[i], "Rss", 0), p = field(pids[i], "Pss", 0);
        printf("%-8d %8ld %8ld %8ld %8ld\n", pids[i], r, p, field(pids[i], "Shared_Clean", "Shared_Dirty"),
               field(pids[i], "Private_Clean", "Private_Dirty"));
        rs += r; ps += p;
    }
    printf("%-8s %8ld %8ld\n", "sum", rs, ps);
    while (wait(NULL) > 0) {}
    return 0;
}
