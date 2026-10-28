// tlb.c — pointer-chase through memory touching ONE cache line per 4 KiB page, in random page order.
// Every step needs a new page, so it needs a new address translation: the TLB either has it or the
// CPU walks the page table. Same loop, same data — only the page size (4 KiB vs 2 MiB) changes.
//   ./tlb <MiB> nohuge|huge
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <time.h>

int main(int argc, char **argv) {
    size_t len = strtoul(argv[1], 0, 10) << 20, two = 2 << 20, pages = len / 4096;
    int huge = !strcmp(argv[2], "huge");
    char *raw = mmap(NULL, len + two, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    char *p = (char *)(((unsigned long)raw + two - 1) & ~(two - 1));
    madvise(p, len, huge ? MADV_HUGEPAGE : MADV_NOHUGEPAGE);
    memset(p, 0, len);                                   // fault everything in before timing

    // random cyclic order of the pages; slot i lives at page i, cache line (i % 64)
    size_t *order = malloc(pages * sizeof *order);
    for (size_t i = 0; i < pages; i++) order[i] = i;
    srand(42);
    for (size_t i = pages - 1; i > 0; i--) { size_t j = rand() % (i + 1), t = order[i]; order[i] = order[j]; order[j] = t; }
    #define SLOT(i) ((void **)(p + (i) * 4096 + ((i) % 64) * 64))
    for (size_t i = 0; i < pages; i++) *SLOT(order[i]) = SLOT(order[(i + 1) % pages]);

    long steps = 20 * 1000 * 1000;
    void **q = SLOT(order[0]);
    struct timespec t0, t1;
    clock_gettime(CLOCK_MONOTONIC, &t0);
    for (long s = 0; s < steps; s++) q = (void **)*q;    // each load depends on the previous one
    clock_gettime(CLOCK_MONOTONIC, &t1);
    double ns = ((t1.tv_sec - t0.tv_sec) * 1e9 + (t1.tv_nsec - t0.tv_nsec)) / steps;
    printf("%5s MiB  %7zu pages  %-6s  %6.1f ns per access%s\n", argv[1], pages, argv[2], ns, q ? "" : "!");
    return 0;
}
