// greetexec.c — a second common mistake: exec a bare command NAME. execlp searches $PATH but
// does NOT go through a shell, so nothing drops the extra privilege — the planted binary runs
// with euid 0. (system() above is saved on Ubuntu only because /bin/sh is dash, which drops
// privilege when euid != uid. Never rely on that.)
#include <stdio.h>
#include <unistd.h>
int main(void) {
    printf("uid=%d euid=%d — running: execlp(\"hostname\")\n", getuid(), geteuid());
    fflush(stdout);
    execlp("hostname", "hostname", (char *)NULL);   // PATH search, no shell -> no privilege drop
    perror("execlp");
    return 1;
}
