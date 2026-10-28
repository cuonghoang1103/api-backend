// touch.c — map N MiB of anonymous memory and write ONE byte in every 4 KiB page.
//   ./touch <MiB> nohuge   ask for normal 4 KiB pages   (madvise MADV_NOHUGEPAGE)
//   ./touch <MiB> huge     ask for 2 MiB huge pages     (madvise MADV_HUGEPAGE)
// Then print what the kernel did: page faults, RSS, page-table size, huge pages used.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/resource.h>
#include <time.h>

static long kb(const char *file, const char *key) {          // "VmRSS:   1234 kB" -> 1234
    char line[256];
    long v = -1;
    FILE *f = fopen(file, "r");
    while (fgets(line, sizeof line, f))
        if (!strncmp(line, key, strlen(key)) && line[strlen(key)] == ':') v = atol(line + strlen(key) + 1);
    fclose(f);
    return v;
}

int main(int argc, char **argv) {
    size_t mib = strtoul(argv[1], 0, 10), len = mib << 20, two = 2 << 20;
    int huge = !strcmp(argv[2], "huge");
    // over-map by 2 MiB and round up, so the region starts on a 2 MiB boundary
    char *raw = mmap(NULL, len + two, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    char *p = (char *)(((unsigned long)raw + two - 1) & ~(two - 1));
    madvise(p, len, huge ? MADV_HUGEPAGE : MADV_NOHUGEPAGE);

    struct rusage a, b;
    struct timespec t0, t1;
    getrusage(RUSAGE_SELF, &a);
    clock_gettime(CLOCK_MONOTONIC, &t0);
    for (size_t off = 0; off < len; off += 4096) p[off] = 1;      // one write per 4 KiB page
    clock_gettime(CLOCK_MONOTONIC, &t1);
    getrusage(RUSAGE_SELF, &b);

    printf("%5zu MiB %-6s  %7zu pages written  %7ld faults  %6.1f ms  RSS %7ld kB  page tables %5ld kB  huge %7ld kB\n",
           mib, argv[2], len / 4096, b.ru_minflt - a.ru_minflt,
           (t1.tv_sec - t0.tv_sec) * 1e3 + (t1.tv_nsec - t0.tv_nsec) / 1e6,
           kb("/proc/self/status", "VmRSS"), kb("/proc/self/status", "VmPTE"),
           kb("/proc/self/smaps_rollup", "AnonHugePages"));
    return 0;
}
