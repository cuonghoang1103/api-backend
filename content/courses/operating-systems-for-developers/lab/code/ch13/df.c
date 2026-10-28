// df.c — double free. ASan reports "attempting double-free" with both free() stacks.
#include <stdlib.h>
int main(void) {
    int *a = malloc(16);
    free(a);
    free(a);                 // second free of the same block -> bug
    return 0;
}
