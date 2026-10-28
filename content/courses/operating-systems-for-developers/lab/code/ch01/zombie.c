// zombie.c — con thoát, cha không wait() ⇒ con thành zombie
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
int main(void) {
    for (int i = 0; i < 3; i++)
        if (fork() == 0) exit(0);          /* con thoát ngay */
    printf("parent %d sleeping, never calls wait()\n", getpid());
    fflush(stdout);
    sleep(30);
    return 0;
}
