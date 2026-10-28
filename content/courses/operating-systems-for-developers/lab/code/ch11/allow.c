/* allow.c — hồ sơ seccomp kiểu "danh sách cho phép" tự làm: đọc tên syscall từ một bảng "strace -c", CHO PHÉP đúng
 * những syscall đó, mọi syscall khác trả EPERM, rồi exec chương trình.   ./allow node.sc node server.js
 * nrtable.h (tên → số của CHÍNH máy này) sinh lúc build:
 *   echo '#include <asm/unistd.h>' | gcc -dM -E - | awk '$2 ~ /^__NR_[a-z]/ && $3 ~ /^[0-9]+$/ {print "{\"" substr($2,6) "\", " $3 "},"}' > nrtable.h */
#include <errno.h>
#include <linux/audit.h>
#include <linux/filter.h>
#include <linux/seccomp.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/prctl.h>
#include <sys/syscall.h>
#include <unistd.h>

static const struct { const char *name; int nr; } TABLE[] = {
#include "nrtable.h"
};

static void add(int *list, int *n, int nr) {
    for (int i = 0; i < *n; i++) if (list[i] == nr) return;
    list[(*n)++] = nr;
}

int main(int argc, char **argv) {
    if (argc < 3) { fprintf(stderr, "usage: %s <strace -c file> program [args]\n", argv[0]); return 2; }
    int allowed[512], n = 0;
    char line[256], name[64];
    FILE *f = fopen(argv[1], "r");
    if (!f) { perror(argv[1]); return 2; }
    while (fgets(line, sizeof line, f)) {                 /* table rows end with the syscall name */
        if (line[0] == '%' || line[0] == '-' || strstr(line, " total")) continue;
        char *last = strrchr(line, ' ');                  /* a bare name on its own line works too */
        if (sscanf(last ? last : line, "%63s", name) != 1) continue;
        for (size_t i = 0; i < sizeof TABLE / sizeof TABLE[0]; i++)
            if (!strcmp(TABLE[i].name, name)) add(allowed, &n, TABLE[i].nr);
    }
    fclose(f);
    add(allowed, &n, __NR_execve);                        /* needed for the exec below */
    add(allowed, &n, __NR_exit_group);

    struct sock_filter prog[3 + 2 * 512 + 2];
    int k = 0;
    prog[k++] = (struct sock_filter)BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, nr));
    for (int i = 0; i < n; i++) {                         /* if nr == allowed[i] -> ALLOW */
        prog[k++] = (struct sock_filter)BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, (unsigned)allowed[i], 0, 1);
        prog[k++] = (struct sock_filter)BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW);
    }
    prog[k++] = (struct sock_filter)BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ERRNO | EPERM);   /* everything else */
    struct sock_fprog fp = { .len = (unsigned short)k, .filter = prog };
    fprintf(stderr, "allow: %d syscalls allowed, %zu known on this machine, everything else -> EPERM\n",
            n, sizeof TABLE / sizeof TABLE[0]);
    if (prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0) || prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &fp)) { perror("seccomp"); return 1; }
    execvp(argv[2], argv + 2);
    perror("execvp");
    return 127;
}
