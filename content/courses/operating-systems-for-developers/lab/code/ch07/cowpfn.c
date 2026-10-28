// cowpfn.c — watch copy-on-write happen to ONE page, by its physical frame number.
// Run as root with CAP_SYS_ADMIN (otherwise the kernel hides PFNs and prints 0).
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <sys/mman.h>
#include <sys/resource.h>
#include <sys/wait.h>
#include <unistd.h>

static uint64_t pfn(void *va) {
    uint64_t e = 0;
    int fd = open("/proc/self/pagemap", O_RDONLY);
    if (pread(fd, &e, 8, (uintptr_t)va / 4096 * 8) != 8) e = 0;
    close(fd);
    return e & ((1ULL << 55) - 1);
}
static long faults(void) { struct rusage u; getrusage(RUSAGE_SELF, &u); return u.ru_minflt; }

int main(void) {
    char *page = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    page[0] = 'P';
    printf("parent  before fork        va %p -> frame %#lx  holds '%c'\n", page, pfn(page), page[0]);
    fflush(stdout);
    if (fork() == 0) {
        printf("child   after fork         va %p -> frame %#lx  holds '%c'\n", page, pfn(page), page[0]);
        long f = faults();
        page[0] = 'C';                                  // first write: the kernel copies the page NOW
        printf("child   after its write    va %p -> frame %#lx  holds '%c'  (%ld page fault)\n",
               page, pfn(page), page[0], faults() - f);
        return 0;
    }
    wait(NULL);
    printf("parent  after child exit   va %p -> frame %#lx  holds '%c'\n", page, pfn(page), page[0]);
    return 0;
}
