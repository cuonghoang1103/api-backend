/* sel1024.c — select() chỉ biết các fd < FD_SETSIZE (1024): fd_set là một mảng bit CỐ ĐỊNH 1024 bit. */
#include <stdio.h>
#include <sys/select.h>
#include <unistd.h>
int main(void) {
    printf("FD_SETSIZE = %d, sizeof(fd_set) = %zu bytes\n", FD_SETSIZE, sizeof(fd_set));
    int fd = 0;
    for (int i = 0; i < 1100; i++) fd = dup(0);          /* một máy chủ bận rộn dễ dàng có fd > 1024 */
    printf("newest fd = %d, now FD_SET(%d, &set) ...\n", fd, fd);
    fflush(stdout);
    fd_set set;
    FD_ZERO(&set);
    FD_SET(fd, &set);                                    /* ghi ra NGOÀI mảng 128 byte */
    printf("survived (no fortify): stack is now corrupted\n");
    return 0;
}
