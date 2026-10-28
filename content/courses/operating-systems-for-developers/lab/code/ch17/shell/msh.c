// msh.c — LỜI GIẢI MẪU dự án 17.1 "mini shell": ống dẫn, chuyển hướng, việc chạy nền, tín hiệu. ~330 dòng.
// Dựng tiếp từ ctsh.c (Chương 1): fork + exec + wait, cd, exit — rồi thêm từng mốc của đề.
//   gcc -Wall -Wextra -O2 -o msh msh.c && ./msh
// Ngữ pháp:  dòng := lệnh (';' lệnh)*      lệnh := ống ['&']      ống := đơn ('|' đơn)*
//            đơn := từ+ với  < file  > file  >> file  2> file  2>&1     từ: '…' "…" $? $$
// Lệnh dựng sẵn: cd, exit [n], jobs, fg [%n], wait.
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/wait.h>
#include <unistd.h>

#define MAXW 64
#define MAXC 16
#define MAXJ 32

typedef struct { char *argv[MAXW]; char *in, *out, *err; int append, err2out; } Cmd;
typedef struct { pid_t pgid; pid_t pids[MAXC]; int n, alive, status; char text[128]; } Job;

static Job jobs[MAXJ];            // việc chạy nền; pgid = 0 ⇒ ô trống
static int last_status = 0;       // $?
static volatile sig_atomic_t got_chld = 0;
static int interactive;

static void on_chld(int s) { (void)s; got_chld = 1; }   // chỉ ĐÁNH DẤU; việc thu dọn làm ở vòng lặp chính (an toàn)

static int code_of(int st) { return WIFEXITED(st) ? WEXITSTATUS(st) : 128 + WTERMSIG(st); }

/* Thu dọn mọi tiến trình con đã xong (không chặn) ⇒ không còn zombie; báo "[n] Done" cho việc nền. */
static void reap(void) {
    int st; pid_t p;
    got_chld = 0;
    while ((p = waitpid(-1, &st, WNOHANG)) > 0) {
        for (int j = 0; j < MAXJ; j++) {
            if (!jobs[j].pgid) continue;
            for (int k = 0; k < jobs[j].n; k++) if (jobs[j].pids[k] == p) {
                jobs[j].pids[k] = -1;
                if (k == jobs[j].n - 1) jobs[j].status = st;
                if (--jobs[j].alive == 0) {
                    printf("[%d] Done (%d)\t%s\n", j + 1, code_of(jobs[j].status), jobs[j].text);
                    fflush(stdout);
                    jobs[j].pgid = 0;
                }
            }
        }
    }
}

/* Tách từ: hiểu '…' "…" và các dấu | < > >> 2> 2>&1 & ; — trả về mảng con trỏ vào vùng đệm `buf`. */
static int lex(const char *line, char *buf, char **tok) {
    int n = 0; char *o = buf;
    for (const char *p = line; *p;) {
        if (*p == ' ' || *p == '\t' || *p == '\n') { p++; continue; }
        if (n >= 255) break;
        tok[n++] = o;
        if (strncmp(p, "2>&1", 4) == 0) { strcpy(o, "2>&1"); o += 5; p += 4; continue; }
        if (strncmp(p, ">>", 2) == 0 || strncmp(p, "2>", 2) == 0) { *o++ = p[0]; *o++ = p[1]; *o++ = 0; p += 2; continue; }
        if (strchr("|<>&;", *p)) { *o++ = *p++; *o++ = 0; continue; }
        while (*p && !strchr(" \t\n|<>&;", *p)) {
            if (*p == '\'' || *p == '"') {                       // chuỗi trong dấu nháy: chép nguyên, bỏ dấu nháy
                char q = *p++;
                while (*p && *p != q) *o++ = *p++;
                if (*p) p++;
            } else if (p[0] == '$' && p[1] == '?') { o += sprintf(o, "%d", last_status); p += 2; }
            else if (p[0] == '$' && p[1] == '$') { o += sprintf(o, "%d", (int)getpid()); p += 2; }
            else *o++ = *p++;
        }
        *o++ = 0;
    }
    tok[n] = NULL;
    return n;
}

/* Mở file chuyển hướng và đặt nó vào fd đích (chạy trong tiến trình CON, trước exec). */
static void redirect(const char *path, int flags, int target) {
    int fd = open(path, flags, 0644);
    if (fd < 0) { fprintf(stderr, "msh: %s: %s\n", path, strerror(errno)); _exit(1); }
    if (fd != target) { dup2(fd, target); close(fd); }
}

static int builtin(Cmd *c) {
    char **a = c->argv;
    if (!strcmp(a[0], "exit")) { exit(a[1] ? atoi(a[1]) : last_status); }
    if (!strcmp(a[0], "cd")) {
        const char *d = a[1] ? a[1] : getenv("HOME");
        if (chdir(d) < 0) { fprintf(stderr, "msh: cd: %s: %s\n", d, strerror(errno)); last_status = 1; } else last_status = 0;
        return 1;
    }
    if (!strcmp(a[0], "jobs")) {
        reap();
        for (int j = 0; j < MAXJ; j++) if (jobs[j].pgid) printf("[%d] Running\t%s\n", j + 1, jobs[j].text);
        last_status = 0; return 1;
    }
    if (!strcmp(a[0], "fg") || !strcmp(a[0], "wait")) {
        for (int j = 0; j < MAXJ; j++) {
            if (!jobs[j].pgid) continue;
            if (a[1] && atoi(a[1] + (a[1][0] == '%')) != j + 1) continue;
            if (!strcmp(a[0], "fg")) printf("%s\n", jobs[j].text);
            for (int k = 0; k < jobs[j].n; k++) {
                int st;
                if (jobs[j].pids[k] > 0 && waitpid(jobs[j].pids[k], &st, 0) > 0 && k == jobs[j].n - 1) jobs[j].status = st;
            }
            last_status = code_of(jobs[j].status);
            jobs[j].pgid = 0;
            if (!strcmp(a[0], "fg")) break;
        }
        return 1;
    }
    return 0;
}

/* Chạy MỘT ống dẫn c[0] | c[1] | … | c[n-1]. bg = chạy nền. */
static void run_pipeline(Cmd *c, int n, int bg, const char *text) {
    if (n == 1 && !bg && builtin(&c[0])) return;      // lệnh dựng sẵn chạy NGAY trong shell (cd phải đổi thư mục của chính shell)
    pid_t pids[MAXC], pgid = 0;
    int prev = -1;                                    // đầu ĐỌC của ống trước
    for (int i = 0; i < n; i++) {
        int pfd[2] = {-1, -1};
        if (i < n - 1 && pipe2(pfd, O_CLOEXEC) < 0) { perror("msh: pipe"); return; }
        pid_t p = fork();
        if (p < 0) { perror("msh: fork"); return; }
        if (p == 0) {
            setpgid(0, pgid);                         // cả ống chung MỘT nhóm tiến trình (job) ⇒ Ctrl-C tới cả nhóm
            signal(SIGINT, SIG_DFL); signal(SIGQUIT, SIG_DFL); signal(SIGTSTP, SIG_DFL);
            signal(SIGTTOU, SIG_DFL); signal(SIGCHLD, SIG_DFL); signal(SIGPIPE, SIG_DFL);
            if (prev >= 0) { dup2(prev, 0); close(prev); }
            if (pfd[1] >= 0) { dup2(pfd[1], 1); close(pfd[1]); close(pfd[0]); }
            if (bg && prev < 0 && !c[i].in) redirect("/dev/null", O_RDONLY, 0);   // việc nền không giành stdin
            if (c[i].in) redirect(c[i].in, O_RDONLY, 0);
            if (c[i].out) redirect(c[i].out, O_WRONLY | O_CREAT | (c[i].append ? O_APPEND : O_TRUNC), 1);
            if (c[i].err) redirect(c[i].err, O_WRONLY | O_CREAT | O_TRUNC, 2);
            if (c[i].err2out) dup2(1, 2);
            execvp(c[i].argv[0], c[i].argv);
            fprintf(stderr, "msh: %s: %s\n", c[i].argv[0], strerror(errno));
            _exit(errno == ENOENT ? 127 : 126);
        }
        if (!pgid) pgid = p;
        setpgid(p, pgid);                             // làm ở CẢ cha lẫn con: tránh tranh chấp ai chạy trước
        pids[i] = p;
        if (prev >= 0) close(prev);                   // ⚠️ cha phải đóng MỌI đầu ống — sót một đầu ghi là "yes | head" treo mãi
        if (pfd[1] >= 0) close(pfd[1]);
        prev = pfd[0];
    }
    if (bg) {
        for (int j = 0; j < MAXJ; j++) if (!jobs[j].pgid) {
            jobs[j].pgid = pgid; jobs[j].n = n; jobs[j].alive = n; jobs[j].status = 0;
            memcpy(jobs[j].pids, pids, sizeof(pid_t) * n);
            snprintf(jobs[j].text, sizeof jobs[j].text, "%s", text);
            printf("[%d] %d\n", j + 1, (int)pgid); fflush(stdout);
            break;
        }
        last_status = 0;
        return;
    }
    if (interactive) tcsetpgrp(0, pgid);              // trao bàn phím cho job ⇒ Ctrl-C của người dùng tới job, không tới shell
    int st = 0;
    for (int i = 0; i < n; i++) {
        int s;
        while (waitpid(pids[i], &s, 0) < 0 && errno == EINTR) {}
        if (i == n - 1) st = s;                        // mã thoát của ống = của lệnh CUỐI (như bash)
    }
    if (interactive) tcsetpgrp(0, getpgrp());
    last_status = code_of(st);
    if (WIFSIGNALED(st) && WTERMSIG(st) != SIGPIPE) printf("[killed by signal %d]\n", WTERMSIG(st));
}

/* Tách một lệnh (giữa hai dấu ';') thành các Cmd của ống dẫn rồi chạy. */
static void run_command(char **t, int nt) {
    Cmd c[MAXC]; int n = 0, w = 0, bg = 0;
    char text[128] = "";
    memset(c, 0, sizeof c);
    for (int i = 0; i < nt; i++) {
        size_t L = strlen(text);
        if (L < sizeof text - 2) snprintf(text + L, sizeof text - L, "%s%s", L ? " " : "", t[i]);
        if (!strcmp(t[i], "|")) { c[n].argv[w] = NULL; if (++n >= MAXC) return; w = 0; continue; }
        if (!strcmp(t[i], "&")) { bg = 1; continue; }
        if (!strcmp(t[i], "2>&1")) { c[n].err2out = 1; continue; }
        if ((!strcmp(t[i], "<") || !strcmp(t[i], ">") || !strcmp(t[i], ">>") || !strcmp(t[i], "2>")) ) {
            if (i + 1 >= nt) { fprintf(stderr, "msh: syntax error near %s\n", t[i]); last_status = 2; return; }
            if (t[i][0] == '<') c[n].in = t[i + 1];
            else if (t[i][0] == '2') c[n].err = t[i + 1];
            else { c[n].out = t[i + 1]; c[n].append = t[i][1] == '>'; }
            i++; continue;
        }
        if (w < MAXW - 1) c[n].argv[w++] = t[i];
    }
    c[n].argv[w] = NULL;
    n++;
    for (int i = 0; i < n; i++) if (!c[i].argv[0]) { fprintf(stderr, "msh: syntax error: empty command\n"); last_status = 2; return; }
    run_pipeline(c, n, bg, text);
}

int main(void) {
    char line[4096], buf[8192], *tok[256];
    interactive = isatty(0);
    setvbuf(stdout, NULL, _IOLBF, 0);   // ⚠️ stdout vào file/ống là đệm KHỐI: không có dòng này, "[killed…]" in SAU output của lệnh kế tiếp
    signal(SIGINT, SIG_IGN); signal(SIGQUIT, SIG_IGN); signal(SIGTSTP, SIG_IGN); signal(SIGTTOU, SIG_IGN);
    struct sigaction sa = {0};
    sa.sa_handler = on_chld; sa.sa_flags = SA_RESTART | SA_NOCLDSTOP;
    sigaction(SIGCHLD, &sa, NULL);
    if (interactive) { setpgid(0, 0); tcsetpgrp(0, getpgrp()); }
    for (;;) {
        if (got_chld) reap();
        if (interactive) { printf("msh$ "); fflush(stdout); }
        if (!fgets(line, sizeof line, stdin)) { if (errno == EINTR && !feof(stdin)) { clearerr(stdin); continue; } break; }
        if (got_chld) reap();
        int nt = lex(line, buf, tok), s = 0;
        for (int i = 0; i <= nt; i++) {                // chạy từng lệnh giữa các dấu ';'
            if (i == nt || !strcmp(tok[i], ";")) {
                if (i > s) run_command(tok + s, i - s);
                s = i + 1;
            }
        }
    }
    reap();
    return last_status;
}
