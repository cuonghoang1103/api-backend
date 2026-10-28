// crash.c — ghi vào địa chỉ 0 ⇒ SIGSEGV
int main(void) { *(volatile int *)0 = 1; return 0; }
