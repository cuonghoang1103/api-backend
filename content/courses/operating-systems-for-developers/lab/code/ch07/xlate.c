// xlate.c — translate virtual addresses by hand, then ask the kernel for the real answer.
// A 48-bit virtual address on x86-64 and arm64 (4 KiB pages) splits into
//   [ L0: 9 bits | L1: 9 bits | L2: 9 bits | L3: 9 bits | offset: 12 bits ]
// = an index into each of the 4 page-table levels, then the byte inside the 4 KiB page.
// /proc/self/pagemap holds one 64-bit entry per virtual page: bit 63 = present in RAM,
// bits 0-54 = the physical frame number (PFN). Only root with CAP_SYS_ADMIN sees real PFNs.
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <unistd.h>

static uint64_t pagemap(void *va) {
    uint64_t e = 0;
    int fd = open("/proc/self/pagemap", O_RDONLY);
    if (pread(fd, &e, sizeof e, (uintptr_t)va / 4096 * sizeof e) != sizeof e) e = 0;
    close(fd);
    return e;
}

static void show(const char *what, void *p) {
    uintptr_t va = (uintptr_t)p;
    uint64_t e = pagemap(p), pfn = e & ((1ULL << 55) - 1);
    printf("%-18s %#14lx  %3lu %3lu %3lu %3lu  %#5lx  %-7s %#9lx  %#12lx\n", what, va,
           (va >> 39) & 511, (va >> 30) & 511, (va >> 21) & 511, (va >> 12) & 511, va & 4095,
           (e >> 63) ? "yes" : "no", pfn, pfn ? pfn * 4096 + (va & 4095) : 0);
}

int global = 1;

int main(void) {
    int local = 2;
    char *two = mmap(NULL, 2 * 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    two[100] = 'x';                                   // touch the first page only
    printf("%-18s %14s  %3s %3s %3s %3s  %5s  %-7s %9s  %12s\n", "what", "virtual addr", "L0", "L1", "L2", "L3",
           "off", "in RAM", "PFN", "physical");
    show("code   main()", (void *)main);
    show("data   global", &global);
    show("stack  local", &local);
    show("mmap   page 1", two + 100);
    show("mmap   page 2", two + 4096 + 100);             // never touched
    return 0;
}
