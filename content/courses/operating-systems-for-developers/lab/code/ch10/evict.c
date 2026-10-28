/* evict.c FILE… — đẩy các file ra khỏi page cache (posix_fadvise DONTNEED): lần đọc sau là đọc "lạnh" từ đĩa.
 * Chỉ đụng tới đúng các file được chỉ định — không cần quyền root, không xoá cache của ai khác. */
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>
int main(int argc, char **argv) {
    for (int i = 1; i < argc; i++) {
        int fd = open(argv[i], O_RDONLY);
        if (fd < 0) { perror(argv[i]); return 1; }
        fdatasync(fd);
        posix_fadvise(fd, 0, 0, POSIX_FADV_DONTNEED);
        close(fd);
    }
    return 0;
}
