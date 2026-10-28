/* sum.c — tổng 1..n, cùng bài toán với chương trình "sum" của CPU đồ chơi */
int sum_to(int n) {
    int sum = 0;
    for (int i = 1; i <= n; i++)
        sum += i;
    return sum;
}

int main(void) {
    return sum_to(5);   /* echo $?  → 15 */
}
