/* Mô hình 5 kiểu POSIX — aio_read(): xin đọc rồi về NGAY, nhân/thư viện báo khi XONG CẢ chép dữ liệu.
 * Nhưng glibc làm AIO bằng… một luồng phụ gọi read() chặn (xem peek bên dưới). */
#include "cho.h"
#include <aio.h>
int main(void) {
    int fd = slow_pipe();
    char b[64];
    struct aiocb cb = { .aio_fildes = fd, .aio_buf = b, .aio_nbytes = sizeof b };
    aio_read(&cb);                              /* trả về ngay: luồng chính rảnh */
    const struct aiocb *list[1] = { &cb };
    aio_suspend(list, 1, NULL);                 /* ở đây ta chọn chờ; app thật làm việc khác */
    report("5 POSIX aio", aio_return(&cb), 2);
}
