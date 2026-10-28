#include <stdio.h>
#include <unistd.h>
int main(void){ printf("  >>> planted 'hostname' ran, effective uid = %d  (0 = root)\n", geteuid()); return 0; }
