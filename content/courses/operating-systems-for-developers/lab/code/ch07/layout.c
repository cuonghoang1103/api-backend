// layout.c — where each kind of variable lives in a process's address space.
//   ./layout          print one address per region (low → high)
//   ./layout maps     ...then print this process's own /proc/self/maps
//   ./layout short    one line: &main  malloc(32)  libc  &local   (for the ASLR runs)
//   ./layout wait     print, then sleep so another shell can run pmap on us
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <unistd.h>

int global_init = 42;            // initialised global  -> .data
int global_zero;                 // zero global         -> .bss
const char *msg = "hello";       // the string itself   -> .rodata (read-only)

int main(int argc, char **argv) {
    const char *mode = argc > 1 ? argv[1] : "";
    int local = 7;                                         // stack
    char *small = malloc(32);                              // heap (brk)
    char *big = malloc(8 << 20);                           // 8 MiB: malloc asks mmap
    int fd = open("/etc/hostname", O_RDONLY);
    char *file = mmap(NULL, 4096, PROT_READ, MAP_PRIVATE, fd, 0);   // a file mapping

    if (!strcmp(mode, "short")) {
        printf("main %p  heap %p  libc %p  stack %p\n", (void *)main, small, (void *)printf, (void *)&local);
        return 0;
    }
    printf("text    main()         %p\n", (void *)main);
    printf("rodata  \"hello\"        %p\n", (void *)msg);
    printf("data    global_init    %p\n", (void *)&global_init);
    printf("bss     global_zero    %p\n", (void *)&global_zero);
    printf("heap    malloc(32)     %p\n", small);
    printf("mmap    malloc(8 MiB)  %p\n", big);
    printf("mmap    /etc/hostname  %p\n", file);
    printf("lib     printf()       %p\n", (void *)printf);
    printf("stack   local          %p\n", (void *)&local);
    fflush(stdout);
    if (!strcmp(mode, "maps")) {
        FILE *f = fopen("/proc/self/maps", "r");
        char line[512];
        while (fgets(line, sizeof line, f)) fputs(line, stdout);
    }
    if (!strcmp(mode, "wait")) pause();
    return 0;
}
