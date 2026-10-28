// fork3.c — câu thi kinh điển
#include <stdio.h>
#include <unistd.h>
int main(void) {
    fork();
    fork();
    fork();
    printf("hi from %d\n", getpid());
    return 0;
}
