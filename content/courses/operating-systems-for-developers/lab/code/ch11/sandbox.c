/* sandbox.c — tự gắn MỘT bộ lọc seccomp (BPF cổ điển, viết tay — không cần libseccomp) rồi exec một lệnh.
 *   ./sandbox <hành-động>:<syscall> lệnh [đối số…]
 *   hành-động: eperm (trả -EPERM) · enosys (trả -ENOSYS, "nhân không có syscall này") · kill (giết cả tiến trình, SIGSYS)
 *   syscall  : mkdirat · clone3 · socket · getppid
 * Bộ lọc được KẾ THỪA qua fork() và execve() và không gỡ ra được — lệnh bạn exec chạy bên trong nó. */
#include <errno.h>
#include <linux/audit.h>
#include <linux/filter.h>
#include <linux/seccomp.h>
#include <stddef.h>
#include <stdio.h>
#include <string.h>
#include <sys/prctl.h>
#include <sys/syscall.h>
#include <unistd.h>

#if defined(__aarch64__)
#define MY_ARCH AUDIT_ARCH_AARCH64
#elif defined(__x86_64__)
#define MY_ARCH AUDIT_ARCH_X86_64
#endif

static const struct { const char *name; int nr; } NR[] = {
    { "mkdirat", __NR_mkdirat }, { "clone3", __NR_clone3 }, { "socket", __NR_socket }, { "getppid", __NR_getppid },
};

int main(int argc, char **argv) {
    char *colon = argc > 2 ? strchr(argv[1], ':') : NULL;
    if (!colon) { fprintf(stderr, "usage: %s eperm|enosys|kill:<syscall> command...\n", argv[0]); return 2; }
    *colon = 0;
    int nr = -1;
    for (size_t i = 0; i < sizeof NR / sizeof NR[0]; i++) if (!strcmp(colon + 1, NR[i].name)) nr = NR[i].nr;
    unsigned action = !strcmp(argv[1], "kill") ? SECCOMP_RET_KILL_PROCESS
                    : !strcmp(argv[1], "enosys") ? SECCOMP_RET_ERRNO | ENOSYS
                    : SECCOMP_RET_ERRNO | EPERM;
    if (nr < 0) { fprintf(stderr, "unknown syscall %s\n", colon + 1); return 2; }

    struct sock_filter f[] = {
        BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, arch)),   /* which ABI is calling?     */
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, MY_ARCH, 1, 0),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_KILL_PROCESS),                       /* a foreign ABI: kill       */
        BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, nr)),     /* load the syscall number   */
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, (unsigned)nr, 0, 1),                   /* is it the one we block?   */
        BPF_STMT(BPF_RET | BPF_K, action),                                         /*   yes: our action         */
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),                              /*   no: let it through      */
    };
    struct sock_fprog prog = { .len = sizeof f / sizeof f[0], .filter = f };
    if (prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0) || prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &prog)) {
        perror("seccomp"); return 1;
    }
    execvp(argv[2], argv + 2);
    perror("execvp");
    return 127;
}
