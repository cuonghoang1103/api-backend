// greet.c — a stand-in for "the one C program you are asked to understand from its binary".
#include <stdio.h>
#include <string.h>
int main(int argc, char **argv) {
    char name[32];
    if (argc > 1) { strncpy(name, argv[1], sizeof name - 1); name[sizeof name - 1] = 0; }
    else strcpy(name, "world");
    printf("hello, %s\n", name);
    return 0;
}
