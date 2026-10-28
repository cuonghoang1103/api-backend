// retaddr.c — the same bug in a called function. A very long copy overruns the saved return
// address; on return the CPU jumps to a clobbered address and the kernel kills the process.
// The payload here is only 'A's: the point is to SEE the crash, not to run anything.
#include <stdio.h>
#include <string.h>
static void victim(const char *in) {
    char buf[16];
    strcpy(buf, in);          // overflow
    printf("copied %zu bytes into buf[16]\n", strlen(in));
}
int main(int argc, char **argv) {
    if (argc < 2) { puts("usage: retaddr <string>"); return 2; }
    victim(argv[1]);
    puts("victim() returned normally");    // only prints if nothing was clobbered
    return 0;
}
