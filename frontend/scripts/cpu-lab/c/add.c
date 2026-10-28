/* add.c — cùng bài toán với chương trình "add" của CPU đồ chơi (Load X · Add Y · Store Z) */
int x = 5, y = 7;   /* biến có giá trị đầu  → đoạn .data */
int z;              /* biến chưa gán        → đoạn .bss  */

int main(void) {
    z = x + y;
    return z;       /* chạy xong: echo $?  → 12 */
}
