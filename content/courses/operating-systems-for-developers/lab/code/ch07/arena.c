// arena.c — glibc gives each new thread its own malloc "arena" (a private heap, to avoid lock
// contention), up to 8 x number of cores. Each arena reserves a 64 MiB chunk of address space.
//   ./arena <threads>      every thread mallocs a little, then all wait together; print VSZ/RSS
#include <malloc.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static pthread_barrier_t all_here;

static void *worker(void *arg) {
    void *p = malloc(1000);                 // first malloc in this thread picks/creates an arena
    __asm__ volatile("" : : "r"(p) : "memory");   // keep -O2 from deleting the malloc/free pair
    pthread_barrier_wait(&all_here);        // keep every thread alive at the same time
    pthread_barrier_wait(&all_here);
    free(p);
    return arg;
}

static long kb(const char *file, const char *key) {
    char line[256]; long v = 0;
    FILE *f = fopen(file, "r");
    while (fgets(line, sizeof line, f)) if (!strncmp(line, key, strlen(key))) v = atol(line + strlen(key) + 1);
    fclose(f);
    return v;
}

int main(int argc, char **argv) {
    int n = atoi(argv[1]);
    pthread_t t[256];
    pthread_barrier_init(&all_here, NULL, n + 1);
    for (int i = 0; i < n; i++) pthread_create(&t[i], NULL, worker, NULL);
    pthread_barrier_wait(&all_here);
    struct mallinfo2 mi = mallinfo2();
    int arenas = 0;                          // count arenas: malloc_info prints one <heap> per arena
    char *buf; size_t len;
    FILE *m = open_memstream(&buf, &len);
    malloc_info(0, m); fclose(m);
    for (char *s = buf; (s = strstr(s, "<heap nr=")); s++) arenas++;
    printf("%3d threads: %3d arenas   VSZ %7ld kB   RSS %6ld kB (%6ld kB in huge pages)   malloc'd %3zu kB\n",
           n, arenas, kb("/proc/self/status", "VmSize"), kb("/proc/self/status", "VmRSS"),
           kb("/proc/self/smaps_rollup", "AnonHugePages"), mi.uordblks / 1024);
    pthread_barrier_wait(&all_here);
    for (int i = 0; i < n; i++) pthread_join(t[i], NULL);
    return 0;
}
