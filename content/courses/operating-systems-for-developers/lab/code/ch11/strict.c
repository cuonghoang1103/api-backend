/* strict.c — chế độ seccomp ĐẦU TIÊN (2005): sau prctl chỉ còn read, write, _exit, sigreturn. Gọi gì khác ⇒ SIGKILL. */
#include <errno.h>
#include <linux/seccomp.h>
#include <stdio.h>
#include <string.h>
#include <sys/prctl.h>
#include <sys/syscall.h>
#include <unistd.h>

int main(void) {
    printf("before: pid %d\n", getpid());
    fflush(stdout);
    if (prctl(PR_SET_SECCOMP, SECCOMP_MODE_STRICT) != 0) {   /* refused if a seccomp FILTER is already on us */
        printf("prctl(SECCOMP_MODE_STRICT) failed: %s\n", strerror(errno));
        return 1;
    }
    if (write(1, "inside strict mode: write() still works\n", 40) != 40) return 1;
    syscall(SYS_getpid);                                 /* not on the list: the kernel kills us right here */
    if (write(1, "never printed\n", 14) != 14) return 1;
    return 0;
}
