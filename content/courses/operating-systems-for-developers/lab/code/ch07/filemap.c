// filemap.c — read a file two ways and count what each costs.
//   ./filemap make  FILE MiB   create the file (and fsync it)
//   ./filemap evict FILE       drop its pages from the page cache (posix_fadvise DONTNEED)
//   ./filemap cached FILE      how much of it is in RAM right now (mincore)
//   ./filemap read  FILE       read() it in 1 MiB chunks into a buffer, add up every 8-byte word
//   ./filemap mmap  FILE       mmap() it and add up every 8-byte word straight from the mapping
//   ./filemap rand  FILE       mmap() it, MADV_RANDOM (no read-ahead), touch every page in random order
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/resource.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

int main(int argc, char **argv) {
    const char *mode = argv[1], *path = argv[2];
    if (!strcmp(mode, "make")) {
        size_t mib = strtoul(argv[3], 0, 10);
        int fd = open(path, O_CREAT | O_TRUNC | O_WRONLY, 0644);
        char *buf = malloc(1 << 20);
        for (size_t i = 0; i < mib; i++) { memset(buf, (int)i, 1 << 20); if (write(fd, buf, 1 << 20) < 0) return 1; }
        fsync(fd);
        return 0;
    }
    int fd = open(path, O_RDONLY);
    struct stat st; fstat(fd, &st);
    size_t len = st.st_size, pages = len / 4096;
    if (!strcmp(mode, "evict")) return posix_fadvise(fd, 0, 0, POSIX_FADV_DONTNEED);
    if (!strcmp(mode, "cached")) {
        void *m = mmap(NULL, len, PROT_READ, MAP_SHARED, fd, 0);
        unsigned char *v = malloc(pages);
        mincore(m, len, v);
        size_t in = 0;
        for (size_t i = 0; i < pages; i++) in += v[i] & 1;
        printf("%zu of %zu pages in the page cache (%.0f%%)\n", in, pages, 100.0 * in / pages);
        return 0;
    }
    struct rusage a, b; struct timespec t0, t1;
    uint64_t sum = 0;
    getrusage(RUSAGE_SELF, &a); clock_gettime(CLOCK_MONOTONIC, &t0);
    if (!strcmp(mode, "read")) {
        uint64_t *buf = malloc(1 << 20);
        ssize_t n;
        while ((n = read(fd, buf, 1 << 20)) > 0)           // kernel copies page cache -> buf
            for (ssize_t i = 0; i < n / 8; i++) sum += buf[i];
    } else if (!strcmp(mode, "mmap")) {
        uint64_t *m = mmap(NULL, len, PROT_READ, MAP_PRIVATE, fd, 0);   // no copy: map the page cache
        for (size_t i = 0; i < len / 8; i++) sum += m[i];
    } else {                                              // "rand": like a database reading random pages
        unsigned char *m = mmap(NULL, len, PROT_READ, MAP_PRIVATE, fd, 0);
        madvise(m, len, MADV_RANDOM);                       // tell the kernel: don't read ahead
        for (size_t k = 0, i = 0; k < pages; k++, i = (i + 40503) % pages) sum += m[i * 4096];   // odd step over 2^16 pages: visits each page exactly once
    }
    clock_gettime(CLOCK_MONOTONIC, &t1); getrusage(RUSAGE_SELF, &b);
    volatile uint64_t keep = sum; (void)keep;               // the result is "used": the loop can't be skipped
    printf("%-4s %4zu MiB in %6.1f ms   minor faults %6ld   major faults %5ld\n", mode, len >> 20,
           (t1.tv_sec - t0.tv_sec) * 1e3 + (t1.tv_nsec - t0.tv_nsec) / 1e6,
           b.ru_minflt - a.ru_minflt, b.ru_majflt - a.ru_majflt);
    return 0;
}
