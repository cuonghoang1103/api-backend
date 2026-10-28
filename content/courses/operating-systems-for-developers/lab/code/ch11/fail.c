#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    int fd = open("/nope/config.json", O_RDONLY);   /* the file does not exist */
    printf("open returned %d, errno = %d (%s)\n", fd, errno, strerror(errno));
    return 0;
}
