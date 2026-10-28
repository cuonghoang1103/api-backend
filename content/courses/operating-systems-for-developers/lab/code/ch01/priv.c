// priv.c — thử làm việc của nhân khi đang ở user mode: CPU từ chối, nhân giết tiến trình
#include <stdio.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
int main(int argc, char **argv) {
    if (argc > 1 && strcmp(argv[1], "kernel") == 0) {
#if defined(__aarch64__)
        volatile long *k = (long *)0xffff800008000000UL;   /* một địa chỉ trong nửa trên = vùng của nhân */
#else
        volatile long *k = (long *)0xffffffff81000000UL;
#endif
        printf("reading kernel memory at %p ...\n", (void *)k); fflush(stdout);
        return (int)*k;
    }
    printf("disabling interrupts from user mode ...\n"); fflush(stdout);
#if defined(__aarch64__)
    __asm__ volatile("msr daifset, #2");    /* tắt ngắt IRQ: lệnh đặc quyền (EL1) */
#else
    __asm__ volatile("cli");                /* tắt ngắt: lệnh đặc quyền (ring 0) */
#endif
    printf("still alive?!\n");
    return 0;
}
