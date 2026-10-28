// frag.c — memory that is free but cannot be given back (fragmentation), measured.
#include <malloc.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define N 1000000
static char *blk[N], *big[N / 2];

static void show(const char *step, double live_mb) {
    char line[256]; long rss = 0;
    FILE *f = fopen("/proc/self/status", "r");
    while (fgets(line, sizeof line, f)) if (!strncmp(line, "VmRSS:", 6)) rss = atol(line + 6);
    fclose(f);
    printf("%-46s live data %6.1f MB   RSS %6.1f MB\n", step, live_mb, rss / 1024.0);
}

int main(void) {
    show("start", 0);
    for (int i = 0; i < N; i++) { blk[i] = malloc(100); memset(blk[i], 1, 100); }
    show("1. malloc 1,000,000 x 100 B", N * 100 / 1e6);
    for (int i = 0; i < N; i += 2) { free(blk[i]); blk[i] = 0; }
    show("2. free every other block", N / 2 * 100 / 1e6);
    malloc_trim(0);
    show("3. malloc_trim(0)", N / 2 * 100 / 1e6);
    for (int i = 0; i < N / 2; i++) { big[i] = malloc(200); memset(big[i], 2, 200); }
    show("4. malloc 500,000 x 200 B (won't fit the holes)", N / 2 * 300 / 1e6);
    for (int i = 0; i < N / 2; i++) free(big[i]);
    for (int i = 1; i < N - 1; i += 2) free(blk[i]);     // free everything except the very last block
    show("5. free all but the last 100 B block", 100 / 1e6);
    malloc_trim(0);
    show("6. malloc_trim(0)", 100 / 1e6);
    return 0;
}
