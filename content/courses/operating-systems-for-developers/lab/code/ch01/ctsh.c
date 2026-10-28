// ctsh.c — shell tí hon: đọc dòng, tách từ, fork + exec + wait, có cd và exit. ~60 dòng.
// gcc -Wall -O2 ctsh.c -o ctsh && ./ctsh
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <sys/wait.h>

#define MAXARGS 32

static int split(char *line, char **argv) {          /* "ls -l /tmp" → {"ls","-l","/tmp",NULL} */
    int n = 0;
    for (char *tok = strtok(line, " \t\n"); tok && n < MAXARGS - 1; tok = strtok(NULL, " \t\n"))
        argv[n++] = tok;
    argv[n] = NULL;
    return n;
}

int main(void) {
    char line[1024], *argv[MAXARGS];
    int last = 0;                                      /* $? của lệnh trước */
    for (;;) {
        printf("ctsh[%d]$ ", last);
        fflush(stdout);
        if (!fgets(line, sizeof line, stdin)) break;   /* Ctrl-D ⇒ EOF ⇒ thoát */
        if (split(line, argv) == 0) continue;

        if (strcmp(argv[0], "exit") == 0) return argv[1] ? atoi(argv[1]) : last;
        if (strcmp(argv[0], "cd") == 0) {              /* PHẢI là lệnh dựng sẵn: chdir trong con không đổi thư mục của cha */
            if (chdir(argv[1] ? argv[1] : getenv("HOME")) < 0) { perror("cd"); last = 1; } else last = 0;
            continue;
        }
        pid_t pid = fork();
        if (pid < 0) { perror("fork"); last = 1; continue; }
        if (pid == 0) {                                /* con: thành chương trình được gọi */
            execvp(argv[0], argv);
            fprintf(stderr, "ctsh: %s: %s\n", argv[0], strerror(errno));
            _exit(errno == ENOENT ? 127 : 126);
        }
        int status;                                    /* cha: chờ con */
        while (waitpid(pid, &status, 0) < 0 && errno == EINTR) {}
        if (WIFEXITED(status)) last = WEXITSTATUS(status);
        else if (WIFSIGNALED(status)) { last = 128 + WTERMSIG(status); printf("[killed by signal %d]\n", WTERMSIG(status)); }
    }
    return last;
}
