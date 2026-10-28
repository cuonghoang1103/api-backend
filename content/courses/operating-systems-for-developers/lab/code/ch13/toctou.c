// toctou.c — a check-then-use race. access() asks "could the real user open this path?",
// then open() resolves the path a SECOND time. If the path is a symlink that changes in between,
// open() can reach a file the check never approved (time-of-check to time-of-use).
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
static int vuln(const char *p) {
    if (access(p, R_OK) != 0) { printf("vuln : access() denied %s\n", p); return 1; }
    int fd = open(p, O_RDONLY);                 // path resolved again here — the race window
    if (fd < 0) { perror("vuln : open"); return 1; }
    char b[64] = {0}; ssize_t n = read(fd, b, 63); close(fd);
    for (ssize_t i = 0; i < n; i++) if (b[i] == '\n') b[i] = 0;
    printf("vuln : opened %s -> \"%s\"\n", p, b);
    return 0;
}
static int fixed(const char *p) {
    int fd = open(p, O_RDONLY | O_NOFOLLOW);     // refuse a symlink at the final component
    if (fd < 0) { perror("fixed: open O_NOFOLLOW"); return 1; }
    char b[64] = {0}; ssize_t n = read(fd, b, 63); close(fd);
    for (ssize_t i = 0; i < n; i++) if (b[i] == '\n') b[i] = 0;
    printf("fixed: opened %s -> \"%s\"\n", p, b);
    return 0;
}
int main(int argc, char **argv) {
    const char *mode = argc > 1 ? argv[1] : "vuln";
    const char *p = argc > 2 ? argv[2] : "report.txt";
    return !strcmp(mode, "fixed") ? fixed(p) : vuln(p);
}
