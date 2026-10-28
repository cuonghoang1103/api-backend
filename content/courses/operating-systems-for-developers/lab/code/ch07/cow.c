// cow.c — what Redis BGSAVE does to memory, in 60 lines.
// The parent holds an N MiB "dataset". It forks a child that "saves a snapshot" (here: just sleeps
// 1 s, the time a real save takes to write to disk). While the child is alive, the parent keeps
// serving writes: it changes one byte in W% of the pages, spread across the whole dataset.
// Every first write to a shared page = one page fault = one 4 KiB copy.
//   ./cow <MiB> <percent of pages written> nohuge|huge
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/resource.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

static double ms_since(struct timespec *t0) {
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t);
    return (t.tv_sec - t0->tv_sec) * 1e3 + (t.tv_nsec - t0->tv_nsec) / 1e6;
}
static long rollup(const char *a, const char *b) {          // own smaps_rollup, kB -> MiB
    char line[256], key[64]; long v, sum = 0;
    FILE *f = fopen("/proc/self/smaps_rollup", "r");
    while (fgets(line, sizeof line, f))
        if (sscanf(line, "%63[^:]: %ld", key, &v) == 2 && (!strcmp(key, a) || !strcmp(key, b))) sum += v;
    fclose(f);
    return sum / 1024;
}
static long faults(void) { struct rusage u; getrusage(RUSAGE_SELF, &u); return u.ru_minflt; }

int main(int argc, char **argv) {
    size_t len = strtoul(argv[1], 0, 10) << 20, pages = len / 4096;
    int pct = atoi(argv[2]), huge = !strcmp(argv[3], "huge");
    char *data = mmap(NULL, len, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(data, len, huge ? MADV_HUGEPAGE : MADV_NOHUGEPAGE);
    memset(data, 1, len);                                     // the dataset is really in RAM

    struct timespec t0; clock_gettime(CLOCK_MONOTONIC, &t0);
    pid_t child = fork();
    if (child == 0) { sleep(1); _exit(0); }                   // the "BGSAVE" child: only reads/waits
    double fork_ms = ms_since(&t0);

    long f0 = faults(), step = pct ? 100 / pct : 0, written = 0;
    clock_gettime(CLOCK_MONOTONIC, &t0);
    if (step)
        for (size_t i = 0; i < pages; i += step) { data[i * 4096 + 8]++; written++; }   // 1 byte in W% of pages
    double write_ms = ms_since(&t0);
    long f = faults() - f0;
    printf("%4s MiB %-6s fork %5.1f ms | wrote %3d%% of pages (%6ld) in %6.1f ms: %6ld faults"
           " | parent now Private %4ld MiB, Shared %4ld MiB\n",
           argv[1], argv[3], fork_ms, pct, written, write_ms, f,
           rollup("Private_Clean", "Private_Dirty"), rollup("Shared_Clean", "Shared_Dirty"));
    waitpid(child, NULL, 0);
    return 0;
}
