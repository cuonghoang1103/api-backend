#pragma once
/**
 * Bí danh màu — tên cũ của TFT_eSPI ánh xạ sang tên của Arduino_GFX.
 *
 * Cùng giá trị RGB565, chỉ khác tên (`TFT_BLACK` ↔ `RGB565_BLACK`).
 * Giữ lớp bí danh mỏng này để lần chuyển thư viện 15/08/2026 không phải
 * đụng vào hai chục dòng vẽ đang chạy tốt: càng ít dòng bị sửa thì càng
 * dễ tin rằng việc chuyển đổi không làm hỏng gì.
 *
 * Tách khỏi `man_hinh.h` có chủ ý — `face.cpp` cần MÀU nhưng không cần
 * biết bo có mấy cái màn hay chúng nối vào chân nào.
 */

#include <Arduino_GFX_Library.h>

#define TFT_BLACK    RGB565_BLACK
#define TFT_WHITE    RGB565_WHITE
#define TFT_DARKGREY RGB565_DARKGREY
#define TFT_YELLOW   RGB565_YELLOW
#define TFT_ORANGE   RGB565_ORANGE
#define TFT_CYAN     RGB565_CYAN
#define TFT_GREEN    RGB565_GREEN
#define TFT_RED      RGB565_RED
