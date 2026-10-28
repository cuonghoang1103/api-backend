// buffer.c — bẫy: bộ đệm của printf bị fork() chép làm đôi
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
int main(void) {
    printf("hello\n");    /* tới terminal: xả ngay ở \n · vào pipe/file: còn nằm trong bộ đệm 4 KiB */
    if (fork() == 0) { printf("child says bye\n"); return 0; }
    wait(NULL);
    printf("parent says bye\n");
    return 0;
}
