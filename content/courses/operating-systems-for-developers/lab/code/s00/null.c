// null.c — đọc qua con trỏ NULL: SIGSEGV
#include <stdio.h>
struct user { int id; char name[16]; };
int find_age(struct user *u) { return u->id; }   /* u có thể NULL */
int main(void) {
    struct user *u = NULL;            /* "không tìm thấy user" */
    printf("id = %d\n", find_age(u));
    return 0;
}
