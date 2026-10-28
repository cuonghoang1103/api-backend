// pointers.c — con trỏ chỉ là một con số: địa chỉ của một ô nhớ.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int count = 42;                       /* biến toàn cục: nằm trong .data */

void twice(int *p) { *p = *p * 2; }   /* nhận ĐỊA CHỈ ⇒ sửa được biến của người gọi */

int main(void) {
    int n = 5;                        /* biến cục bộ: nằm trên stack */
    int *p = &n;                      /* p giữ địa chỉ của n */
    printf("n = %d, &n = %p, p = %p, *p = %d\n", n, (void *)&n, (void *)p, *p);
    twice(&n);
    printf("after twice(&n): n = %d\n", n);

    int *arr = malloc(4 * sizeof(int));  /* 16 byte trên heap */
    for (int i = 0; i < 4; i++) arr[i] = i * 10;
    printf("arr = %p, arr[2] = %d, *(arr + 2) = %d\n", (void *)arr, arr[2], *(arr + 2));
    printf("sizeof(int) = %zu, sizeof(p) = %zu\n", sizeof(int), sizeof p);

    char name[8];
    strcpy(name, "Cuong");            /* 5 chữ + '\0' = 6 byte, vừa 8 */
    printf("name = %s (%zu chars)\n", name, strlen(name));
    printf("&count = %p (global), arr = %p (heap), &n = %p (stack)\n", (void *)&count, (void *)arr, (void *)&n);
    free(arr);
    return 0;
}
