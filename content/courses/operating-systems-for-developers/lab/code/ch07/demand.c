// demand.c — memory is handed out on first touch, not on malloc.
// Map 64 MiB, then read every page, then write every page; after each step print
// RSS, how many of the 16,384 pages are present in the page table, and the faults it took.
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/resource.h>
#include <unistd.h>

#define LEN (64UL << 20)
static char *p;
static long faults0;

static long rss_kb(void) {
    char line[256]; long v = 0;
    FILE *f = fopen("/proc/self/status", "r");
    while (fgets(line, sizeof line, f)) if (!strncmp(line, "VmRSS:", 6)) v = atol(line + 6);
    fclose(f);
    return v;
}

static void report(const char *step) {
    uint64_t e[LEN / 4096];
    int fd = open("/proc/self/pagemap", O_RDONLY);
    if (pread(fd, e, sizeof e, (uintptr_t)p / 4096 * 8) != sizeof e) return;
    close(fd);
    long present = 0;
    for (size_t i = 0; i < LEN / 4096; i++) present += e[i] >> 63;
    struct rusage u; getrusage(RUSAGE_SELF, &u);
    printf("%-26s RSS %6ld kB   pages present %5ld / %lu   page faults so far %5ld\n",
           step, rss_kb(), present, LEN / 4096, u.ru_minflt - faults0);
}

int main(void) {
    struct rusage u; getrusage(RUSAGE_SELF, &u);
    p = mmap(NULL, LEN, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(p, LEN, MADV_NOHUGEPAGE);                 // plain 4 KiB pages, to keep the count simple
    getrusage(RUSAGE_SELF, &u); faults0 = u.ru_minflt;
    report("after mmap(64 MiB)");
    volatile long sum = 0;
    for (size_t i = 0; i < LEN; i += 4096) sum += p[i];     // READ one byte per page
    report("after reading every page");
    for (size_t i = 0; i < LEN; i += 4096) p[i] = 1;        // WRITE one byte per page
    report("after writing every page");
    return 0;
}
