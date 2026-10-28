// greetsuid.c — a TOY setuid-root helper with the classic bug: it shells out to "hostname"
// by name, so it trusts whatever PATH the caller set. Never ship a setuid program that calls
// system() or a bare command name. The fixed version is greetfix.c.
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
int main(void) {
    printf("uid=%d euid=%d — running: hostname\n", getuid(), geteuid());
    fflush(stdout);
    system("hostname");          // uses /bin/sh and $PATH -> attacker-controllable
    return 0;
}
