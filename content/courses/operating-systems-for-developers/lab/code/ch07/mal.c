// mal.c — where does malloc get its memory? Run it under: strace -e trace=brk,mmap,munmap ./mal
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static void say(const char *s) { write(1, s, strlen(s)); }   // write(), not printf: no buffering surprises

int main(void) {
    say("-- malloc(100)\n");        char *a = malloc(100);
    say("-- malloc(100) again\n");  char *b = malloc(100);
    say("-- malloc(200 KiB)\n");    char *c = malloc(200 * 1024);
    say("-- malloc(4 MiB)\n");      char *d = malloc(4 << 20);
    say("-- free(4 MiB)\n");        free(d);
    say("-- malloc(4 MiB) again\n"); d = malloc(4 << 20);
    say("-- done\n");
    return a && b && c && d ? 0 : 1;
}
