// fork1.c — fork() trả về HAI lần; biến được chép (copy-on-write) chứ không dùng chung
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
int main(void) {
    int x = 100;
    printf("before fork: pid=%d\n", getpid());
    fflush(stdout);
    pid_t pid = fork();
    if (pid < 0) { perror("fork"); return 1; }
    if (pid == 0) {                          /* tiến trình con */
        x += 1;
        printf("child : pid=%d ppid=%d fork() returned %d, x=%d\n", getpid(), getppid(), pid, x);
        return 7;                            /* mã thoát của con */
    }
    int status;                              /* tiến trình cha */
    waitpid(pid, &status, 0);
    printf("parent: pid=%d fork() returned %d, x=%d\n", getpid(), pid, x);
    if (WIFEXITED(status)) printf("parent: child %d exited with %d\n", pid, WEXITSTATUS(status));
    return 0;
}
