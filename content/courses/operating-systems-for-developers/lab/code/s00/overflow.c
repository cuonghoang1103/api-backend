// overflow.c — ghi quá cuối mảng: C không kiểm, AddressSanitizer thì có.
#include <stdio.h>
#include <string.h>
int main(int argc, char **argv) {
    char buf[8];
    strcpy(buf, argc > 1 ? argv[1] : "ok");   /* không kiểm độ dài! */
    printf("buf = %s\n", buf);
    return 0;
}
