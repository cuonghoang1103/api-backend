// vuln.c — a TOY program that shows what an overflow touches. Built with -fno-stack-protector -O0
// on purpose, so you can watch the mechanism with no safety net. Never write code like this.
// The flag sits right after the buffer in one struct, so an over-long copy reaches it.
#include <stdio.h>
#include <string.h>
int main(int argc, char **argv) {
    struct { char buf[16]; volatile int flag; } s;
    s.flag = 0;
    if (argc < 2) { puts("usage: vuln <string>"); return 2; }
    strcpy(s.buf, argv[1]);                 // no length check — this is the bug
    printf("buf = \"%s\"  flag = %d\n", s.buf, s.flag);
    if (s.flag) puts("  -> the copy ran past buf[16] and changed flag");
    return 0;
}
