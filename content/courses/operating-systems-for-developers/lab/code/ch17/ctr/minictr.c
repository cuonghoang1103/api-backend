// minictr.c — LỜI GIẢI MẪU dự án mở rộng 17.5: một "container runtime" tí hon bằng C (~200 dòng).
// Dựng lại bằng lời gọi hệ thống đúng những gì mini-container.sh của bài 12.4 làm bằng lệnh shell:
//   cgroup v2 (memory.max, memory.swap.max, pids.max, cpu.max) · clone() với 5 namespace + unshare(CLONE_NEWCGROUP)
//   · pivot_root vào rootfs · /proc mới · /dev tí hon · bỏ capability nguy hiểm + no_new_privs · exec · thu dọn.
//   gcc -Wall -Wextra -O2 -o minictr minictr.c
//   ./minictr [--mem 64M] [--pids 32] [--cpu "50000 100000"] [--hostname box] ROOTFS CMD [ARGS…]
// CHỈ chạy như root trong container lab VỨT ĐI có --privileged (giống bài 12.4). Không bao giờ trên máy thật.
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <sched.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mount.h>
#include <sys/prctl.h>
#include <sys/stat.h>
#include <sys/syscall.h>
#include <sys/sysmacros.h>
#include <sys/wait.h>
#include <unistd.h>
#include <linux/capability.h>

#define DIE(what) do { fprintf(stderr, "minictr: %s: %s\n", what, strerror(errno)); exit(125); } while (0)

static const char *mem = "64M", *pids = "32", *cpu = "max 100000", *host = "box", *rootfs;
static char **cmd;
static int syncp[2];                                   // cha → con: "đã vào cgroup, đi tiếp đi"
static char cg[256];

static void put(const char *dir, const char *file, const char *val) {
    char p[512]; snprintf(p, sizeof p, "%s/%s", dir, file);
    int fd = open(p, O_WRONLY);
    if (fd < 0 || write(fd, val, strlen(val)) < 0) DIE(p);
    close(fd);
}

static int child(void *arg) {
    (void)arg;
    char c; close(syncp[1]);
    if (read(syncp[0], &c, 1) != 1) DIE("sync");       // chờ cha ghi PID của mình vào cgroup
    close(syncp[0]);
    if (unshare(CLONE_NEWCGROUP) < 0) DIE("unshare cgroup");   // SAU khi vào cgroup ⇒ cgroup của ta hiện là "/"
    if (sethostname(host, strlen(host)) < 0) DIE("sethostname");
    if (mount(NULL, "/", NULL, MS_REC | MS_PRIVATE, NULL) < 0) DIE("make / private");   // mount của ta không lọt ra ngoài
    if (mount(rootfs, rootfs, NULL, MS_BIND | MS_REC, NULL) < 0) DIE("bind rootfs");    // pivot_root đòi một điểm gắn
    if (chdir(rootfs) < 0) DIE("chdir rootfs");
    mkdir(".old", 0700);
    if (syscall(SYS_pivot_root, ".", ".old") < 0) DIE("pivot_root");                  // glibc không có wrapper
    if (chdir("/") < 0) DIE("chdir /");
    mkdir("/proc", 0555); mkdir("/dev", 0755); mkdir("/tmp", 01777);
    if (mount("proc", "/proc", "proc", MS_NOSUID | MS_NOEXEC | MS_NODEV, NULL) < 0) DIE("mount /proc");
    if (mount("dev", "/dev", "tmpfs", MS_NOSUID, "mode=755,size=64k") < 0) DIE("mount /dev");
    mknod("/dev/null", S_IFCHR | 0666, makedev(1, 3)); mknod("/dev/zero", S_IFCHR | 0666, makedev(1, 5));
    mknod("/dev/urandom", S_IFCHR | 0444, makedev(1, 9));
    if (umount2("/.old", MNT_DETACH) < 0) DIE("umount old root");                       // hệ thống file của máy chủ biến mất
    rmdir("/.old");
    /* Bỏ các capability có thể dùng để thoát ra (bài 13.4): mount lại, nạp module, ptrace, đổi giờ, cấu hình mạng… */
    int drop[] = {CAP_SYS_ADMIN, CAP_SYS_MODULE, CAP_SYS_PTRACE, CAP_SYS_TIME, CAP_SYS_RAWIO, CAP_SYS_BOOT,
                  CAP_NET_ADMIN, CAP_MKNOD, CAP_SYS_NICE, CAP_SYS_RESOURCE, CAP_AUDIT_CONTROL, CAP_MAC_ADMIN};
    for (size_t i = 0; i < sizeof drop / sizeof *drop; i++) prctl(PR_CAPBSET_DROP, drop[i], 0, 0, 0);
    struct __user_cap_header_struct h = {_LINUX_CAPABILITY_VERSION_3, 0};
    struct __user_cap_data_struct d[2];
    if (syscall(SYS_capget, &h, d) == 0) {               // bỏ luôn khỏi tập hiệu lực/được phép của chính tiến trình này
        for (size_t i = 0; i < sizeof drop / sizeof *drop; i++) {
            d[drop[i] / 32].effective &= ~(1u << (drop[i] % 32)); d[drop[i] / 32].permitted &= ~(1u << (drop[i] % 32));
            d[drop[i] / 32].inheritable &= ~(1u << (drop[i] % 32));
        }
        syscall(SYS_capset, &h, d);
    }
    prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0);             // chương trình setuid bên trong không leo thang được nữa
    execvp(cmd[0], cmd);
    fprintf(stderr, "minictr: exec %s: %s\n", cmd[0], strerror(errno));
    return 127;
}

int main(int argc, char **argv) {
    int i = 1;
    for (; i + 1 < argc && !strncmp(argv[i], "--", 2); i += 2) {
        if (!strcmp(argv[i], "--mem")) mem = argv[i + 1];
        else if (!strcmp(argv[i], "--pids")) pids = argv[i + 1];
        else if (!strcmp(argv[i], "--cpu")) cpu = argv[i + 1];
        else if (!strcmp(argv[i], "--hostname")) host = argv[i + 1];
    }
    if (argc - i < 2) { fprintf(stderr, "usage: %s [--mem 64M] [--pids 32] [--cpu \"50000 100000\"] [--hostname box] ROOTFS CMD [ARGS...]\n", argv[0]); return 125; }
    rootfs = argv[i]; cmd = argv + i + 1;

    /* 1) cgroup cho hộp này: con của gốc cgroup v2 (gốc phải đã bật +memory +pids +cpu trong cgroup.subtree_control) */
    snprintf(cg, sizeof cg, "/sys/fs/cgroup/minictr-%d", (int)getpid());
    if (mkdir(cg, 0755) < 0) DIE(cg);
    put(cg, "memory.max", mem); put(cg, "memory.swap.max", "0"); put(cg, "pids.max", pids); put(cg, "cpu.max", cpu);

    /* 2) tiến trình con trong namespace mới: pid · mount · uts · ipc · net (cgroup ns: con tự unshare sau khi vào cgroup) */
    if (pipe(syncp) < 0) DIE("pipe");
    static char stack[1 << 20];
    pid_t pid = clone(child, stack + sizeof stack, CLONE_NEWPID | CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWIPC | CLONE_NEWNET | SIGCHLD, NULL);
    if (pid < 0) DIE("clone");
    char s[32]; snprintf(s, sizeof s, "%d", (int)pid);
    put(cg, "cgroup.procs", s);                          // 3) đưa con vào cgroup TRƯỚC khi nó chạy chương trình của người dùng
    close(syncp[0]); if (write(syncp[1], "go", 1) != 1) DIE("sync"); close(syncp[1]);

    int st;
    while (waitpid(pid, &st, 0) < 0 && errno == EINTR) {}
    /* 4) đọc memory.events trước khi xoá cgroup: oom_kill > 0 nghĩa là nhân đã giết vì vượt memory.max */
    char p[300], buf[512] = ""; snprintf(p, sizeof p, "%s/memory.events", cg);
    FILE *f = fopen(p, "r"); long oom = 0;
    if (f) { while (fgets(buf, sizeof buf, f)) if (sscanf(buf, "oom_kill %ld", &oom) == 1) break; fclose(f); }
    if (oom) fprintf(stderr, "minictr: memory.max (%s) exceeded: oom_kill %ld\n", mem, oom);
    snprintf(p, sizeof p, "%s/pids.events", cg); long hit = 0;   // pids.events "max N": số lần fork/clone bị từ chối vì pids.max
    if ((f = fopen(p, "r"))) { while (fgets(buf, sizeof buf, f)) if (sscanf(buf, "max %ld", &hit) == 1) break; fclose(f); }
    if (hit) fprintf(stderr, "minictr: pids.max (%s) refused %ld fork(s)\n", pids, hit);
    if (rmdir(cg) < 0) fprintf(stderr, "minictr: rmdir %s: %s\n", cg, strerror(errno));
    int code = WIFEXITED(st) ? WEXITSTATUS(st) : 128 + WTERMSIG(st);
    if (WIFSIGNALED(st)) fprintf(stderr, "minictr: container killed by signal %d (exit %d)\n", WTERMSIG(st), code);
    return code;
}
