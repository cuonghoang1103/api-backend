// sys.c — gọi nhân qua libc: getpid, write, open thất bại ⇒ errno
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <string.h>
int main(void) {
    printf("my pid is %d, my parent is %d\n", getpid(), getppid());
    fflush(stdout);
    write(1, "written by write(2)\n", 20);                 /* fd 1 = stdout */
    int fd = open("/etc/shadow", O_RDONLY);
    if (fd < 0) printf("open failed: errno=%d (%s)\n", errno, strerror(errno));
    fd = open("/nope.txt", O_RDONLY);
    if (fd < 0) perror("open /nope.txt");
    return 0;
}
