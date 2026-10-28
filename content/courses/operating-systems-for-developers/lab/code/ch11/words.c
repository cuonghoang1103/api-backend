/* words.c — đếm từ trong một file: nhiều lời gọi THƯ VIỆN (strlen, strtok, malloc), ít lời gọi HỆ THỐNG. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv) {
    FILE *f = fopen(argc > 1 ? argv[1] : "/etc/services", "r");
    if (!f) { perror("fopen"); return 1; }
    char line[512];
    long words = 0;
    while (fgets(line, sizeof line, f)) {
        char *copy = malloc(strlen(line) + 1);
        strcpy(copy, line);
        for (char *w = strtok(copy, " \t\n"); w; w = strtok(NULL, " \t\n")) words++;
        free(copy);
    }
    fclose(f);
    printf("%ld words\n", words);
    return 0;
}
