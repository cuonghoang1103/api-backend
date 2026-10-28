// safe.c — the same job done safely: bounded copy, explicit length check, always NUL-terminated.
#include <stdio.h>
#include <string.h>
int main(int argc, char **argv) {
    char buf[16];
    if (argc < 2) { puts("usage: safe <string>"); return 2; }
    if (strlen(argv[1]) >= sizeof buf) {
        fprintf(stderr, "input too long (%zu), max %zu\n", strlen(argv[1]), sizeof buf - 1);
        return 1;
    }
    snprintf(buf, sizeof buf, "%s", argv[1]);   // can never write past buf
    printf("buf = \"%s\"\n", buf);
    return 0;
}
