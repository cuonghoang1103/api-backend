// orphan.c — cha chết trước ⇒ con được PID 1 (hoặc subreaper) nhận nuôi
#include <stdio.h>
#include <unistd.h>
int main(void) {
    if (fork() == 0) {
        printf("child: my parent is %d\n", getppid());
        fflush(stdout);
        sleep(1);                           /* đợi cha chết */
        printf("child: my parent is now %d\n", getppid());
        return 0;
    }
    printf("parent %d exits now\n", getpid());
    return 0;
}
