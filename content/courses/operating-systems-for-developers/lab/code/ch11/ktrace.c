/* ktrace.c — nhìn PHÍA NHÂN của MỘT lời gọi write(): bật ftrace (tracer "function") chỉ cho chính tiến trình này,
 * ghi 3 byte vào /dev/null, tắt ftrace. Chỉ chạy trong container vứt đi --privileged --pid=host (cần tracefs;
 * set_ftrace_pid nhận PID của máy, không phải PID trong namespace của container). */
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

static void put(const char *file, const char *s) {
    char path[128];
    snprintf(path, sizeof path, "/sys/kernel/tracing/%s", file);
    int fd = open(path, O_WRONLY | O_TRUNC);
    if (write(fd, s, strlen(s)) < 0) perror(path);
    close(fd);
}

int main(void) {
    int devnull = open("/dev/null", O_WRONLY);
    char pid[16];
    snprintf(pid, sizeof pid, "%d", getpid());
    put("set_ftrace_pid", pid);
    put("current_tracer", "function");
    put("tracing_on", "1");
    ssize_t n = write(devnull, "hi\n", 3);   /* <- the one call we want to see */
    put("tracing_on", "0");
    return n == 3 ? 0 : 1;
}
