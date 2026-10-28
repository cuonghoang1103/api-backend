// uaf.c — use-after-free. Compile with -fsanitize=address; AddressSanitizer stops at the exact
// line and prints who freed it and who allocated it. This is Chapter 7's allocator, with a guard.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(void) {
    char *msg = malloc(32);
    strcpy(msg, "session token");
    free(msg);                       // freed here
    printf("len after free = %zu\n", strlen(msg));   // used here -> bug
    return 0;
}
