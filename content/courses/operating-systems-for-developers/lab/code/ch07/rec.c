// rec.c — recurse until the stack runs out, and report exactly where it died.
// Each call puts a 1 KiB array on the stack. A SIGSEGV handler running on a separate
// "alternate" stack (the normal one is full!) prints the depth and the faulting address.
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static volatile long depth;
static char *stack_top;

static void on_segv(int sig, siginfo_t *si, void *ctx) {
    char buf[160];
    long used = (long)(stack_top - (char *)si->si_addr);
    int n = snprintf(buf, sizeof buf, "SIGSEGV at %p, depth %ld, about %ld KiB below the first frame\n",
                     si->si_addr, depth, used / 1024);
    write(1, buf, n);
    signal(SIGSEGV, SIG_DFL);          // die the normal way: killed by signal 11 -> exit 139
    raise(SIGSEGV);
}

static long dive(void) {
    char frame[1024];                  // 1 KiB of locals per call
    memset(frame, (int)depth, sizeof frame);
    depth++;
    return dive() + frame[depth % 1024];   // not a tail call: the frame must stay
}

int main(void) {
    char here;
    stack_top = &here;
    static char alt[64 * 1024];
    stack_t ss = { .ss_sp = alt, .ss_size = sizeof alt };
    sigaltstack(&ss, NULL);
    struct sigaction sa = { .sa_sigaction = on_segv, .sa_flags = SA_SIGINFO | SA_ONSTACK };
    sigaction(SIGSEGV, &sa, NULL);
    return (int)dive();
}
