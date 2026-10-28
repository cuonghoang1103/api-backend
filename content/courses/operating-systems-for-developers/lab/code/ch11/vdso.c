/* vdso.c — chép trang vDSO mà nhân ánh xạ vào CHÍNH tiến trình này ra file vdso.so để objdump đọc được. */
#include <stdio.h>
#include <string.h>

int main(void) {
    FILE *m = fopen("/proc/self/maps", "r");
    char line[256];
    unsigned long lo, hi;
    while (fgets(line, sizeof line, m))
        if (strstr(line, "[vdso]") && sscanf(line, "%lx-%lx", &lo, &hi) == 2) {
            FILE *o = fopen("vdso.so", "w");
            fwrite((void *)lo, 1, hi - lo, o);
            fclose(o);
            printf("[vdso] %lx-%lx: %lu bytes -> vdso.so\n", lo, hi, hi - lo);
        }
    return 0;
}
