/* max.c — số lớn nhất của mảng, cùng bài toán với chương trình "max" của CPU đồ chơi */
int arr[] = {3, 9, 4, 7};

int max_of(const int *a, int n) {
    int m = a[0];
    for (int i = 1; i < n; i++)
        if (a[i] > m)
            m = a[i];
    return m;
}

int main(void) {
    return max_of(arr, 4);   /* echo $?  → 9 */
}
