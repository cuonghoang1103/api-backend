// leak.c — a request handler that forgets to free, and one that frees too early.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static char *handle_request(int id) {
    char *buf = malloc(100);                          // a per-request buffer
    snprintf(buf, 100, "response %d", id);
    return buf;
}

int main(int argc, char **argv) {
    for (int i = 0; i < 1000; i++) {
        char *r = handle_request(i);
        if (r[0] != 'r') return 1;                    // ...use it, then forget to free(r): LEAK
    }
    if (argc > 1) {                                   // "./leak uaf": use after free
        char *r = handle_request(1);
        free(r);
        printf("%c\n", r[0]);                         // reading memory we already gave back
    }
    return 0;
}
