// greetfix.c — the same helper done safely: drop the extra privilege first, then exec an
// absolute path with a clean environment. No shell, no PATH search.
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
int main(void) {
    if (setgid(getgid()) != 0 || setuid(getuid()) != 0) { perror("drop privs"); return 1; }
    printf("uid=%d euid=%d — running: /bin/hostname\n", getuid(), geteuid());
    fflush(stdout);
    char *empty[] = { NULL };
    execle("/bin/hostname", "hostname", (char *)NULL, empty);   // absolute path, no $PATH
    perror("execle");
    return 1;
}
