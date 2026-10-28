// add.c — a function small enough to read in machine code, and a main that calls it.
// Chapter 13.1: this is the binary we take apart with readelf, nm, objdump and gdb.
#include <stdio.h>
#include <stdlib.h>

// price after a flat discount, then tax — three locals so the frame is worth reading
int total(int price, int qty) {
    int sub = price * qty;      // subtotal
    int disc = sub / 10;        // 10% off
    return (sub - disc) + (sub - disc) / 20;   // + 5% tax on the discounted sum
}

int main(int argc, char **argv) {
    int price = argc > 1 ? atoi(argv[1]) : 100;
    int qty   = argc > 2 ? atoi(argv[2]) : 3;
    int t = total(price, qty);
    printf("total(%d, %d) = %d\n", price, qty, t);
    return 0;
}
