/* incache.c FILE — bao nhiêu phần trăm file đang nằm trong page cache (mincore). */
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>
int main(int argc, char **argv) {
    int fd = open(argv[1], O_RDONLY);
    struct stat st; fstat(fd, &st);
    long pg = sysconf(_SC_PAGESIZE), n = (st.st_size + pg - 1) / pg, in = 0;
    void *m = mmap(NULL, st.st_size, PROT_READ, MAP_SHARED, fd, 0);
    unsigned char *v = malloc(n);
    mincore(m, st.st_size, v);
    for (long i = 0; i < n; i++) in += v[i] & 1;
    printf("%s: %ld of %ld pages in page cache (%.0f%%)\n", argv[1], in, n, 100.0 * in / n);
    return 0;
}
