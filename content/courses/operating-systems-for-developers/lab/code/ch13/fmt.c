// fmt.c — why a user string must never BE the format string.
//   ./fmt bad  "<user text>"   -> printf(user)        (format string bug)
//   ./fmt good "<user text>"   -> printf("%s", user)  (fixed)
#include <stdio.h>
#include <string.h>
int main(int argc, char **argv) {
    const char *mode = argc > 1 ? argv[1] : "good";
    const char *user = argc > 2 ? argv[2] : "%p.%p.%p";
    if (!strcmp(mode, "bad")) printf(user);        // user controls conversions -> can leak stack
    else                      printf("%s", user);  // user is only ever data
    printf("\n");
    return 0;
}
