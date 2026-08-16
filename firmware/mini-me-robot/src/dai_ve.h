#pragma once
/**
 * ============================================================
 * DaiVe — khung nhớ MỘT DẢI NGANG, không phụ thuộc thư viện nào
 * ============================================================
 *
 * Một mảng `uint16_t` rộng 240, cao vài chục hàng, cùng đúng sáu phép
 * vẽ mà `eyes.cpp` cần. Vẽ xong thì đẩy nguyên khối xuống màn bằng một
 * lệnh `draw16bitRGBBitmap()`.
 *
 * ── VÌ SAO TỰ VIẾT THAY VÌ DÙNG SPRITE CỦA THƯ VIỆN ──
 *
 * Bản đầu dùng `TFT_eSprite` của TFT_eSPI. Nó chạy tốt, nhưng buộc mắt
 * phải sống trong cùng một thư viện với màn ngực — mà TFT_eSPI chốt
 * loại chip màn lúc BIÊN DỊCH, nên ILI9488 (ngực) và GC9A01 (mắt)
 * không thể ở chung một tệp .bin.
 *
 * Cắt bỏ phụ thuộc ấy thì mắt vẽ được lên bất cứ thứ gì nhận một khối
 * RGB565. Cái giá là sáu hàm dưới đây — tổng cộng chưa tới 60 dòng, và
 * chúng đơn giản tới mức đọc là biết đúng hay sai.
 *
 * ⚠️ MỌI HÀM ĐỀU TỰ CẮT BIÊN. Toạ độ truyền vào là toạ độ MÀN (0..239),
 * còn dải chỉ giữ một lát trong đó, nên đại đa số lời gọi sẽ rơi ra
 * ngoài — đó là chuyện bình thường, không phải lỗi. Thiếu một phép
 * kiểm biên ở đây là ghi đè ra ngoài mảng: hỏng ở chỗ khác hẳn, và
 * hỏng theo kiểu đổi mỗi lần chạy.
 */

#include <Arduino.h>

class DaiVe {
 public:
  uint16_t* bo = nullptr;
  int rong = 0, cao = 0;

  bool tao(int w, int h) {
    rong = w;
    cao = h;
    // heap_caps_malloc với MALLOC_CAP_INTERNAL: ÉP vào RAM trong.
    // Nằm ở PSRAM thì vẽ vẫn đúng nhưng lúc đẩy đi phải kéo qua bus
    // PSRAM, chậm hơn khoảng ba lần — và chi phí đó rơi thẳng vào
    // ngân sách thời gian đang giữ cho loa khỏi vấp.
    bo = (uint16_t*)heap_caps_malloc((size_t)w * h * 2, MALLOC_CAP_INTERNAL | MALLOC_CAP_8BIT);
    return bo != nullptr;
  }

  void fillSprite(uint16_t c) {
    const int n = rong * cao;
    for (int i = 0; i < n; i++) bo[i] = c;
  }

  inline void drawPixel(int x, int y, uint16_t c) {
    if ((unsigned)x >= (unsigned)rong || (unsigned)y >= (unsigned)cao) return;
    bo[y * rong + x] = c;
  }

  void drawFastHLine(int x, int y, int w, uint16_t c) {
    if ((unsigned)y >= (unsigned)cao || w < 1) return;
    if (x < 0) { w += x; x = 0; }
    if (x >= rong) return;
    if (x + w > rong) w = rong - x;
    if (w < 1) return;
    uint16_t* p = bo + y * rong + x;
    for (int i = 0; i < w; i++) p[i] = c;
  }

  void drawFastVLine(int x, int y, int h, uint16_t c) {
    if ((unsigned)x >= (unsigned)rong || h < 1) return;
    if (y < 0) { h += y; y = 0; }
    if (y >= cao) return;
    if (y + h > cao) h = cao - y;
    for (int i = 0; i < h; i++) bo[(y + i) * rong + x] = c;
  }

  /** Bresenham. Dùng cho vân toả tia và xoáy ốc. */
  void drawLine(int x0, int y0, int x1, int y1, uint16_t c) {
    const int dx = abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const int dy = -abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    int e = dx + dy;
    for (;;) {
      drawPixel(x0, y0, c);
      if (x0 == x1 && y0 == y1) break;
      const int e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  }

  /** Tam giác đặc, quét theo hàng. Chỉ ngôi sao của biểu cảm EXCITED dùng. */
  void fillTriangle(int x0, int y0, int x1, int y1, int x2, int y2, uint16_t c) {
    if (y0 > y1) { std::swap(y0, y1); std::swap(x0, x1); }
    if (y1 > y2) { std::swap(y1, y2); std::swap(x1, x2); }
    if (y0 > y1) { std::swap(y0, y1); std::swap(x0, x1); }
    // Kẹp vòng lặp vào đúng phần dải — tam giác nằm ngoài thì không
    // quét hàng nào cả, thay vì quét đủ rồi vứt ở khâu ghi.
    const int ya = max(0, y0), yb = min(cao - 1, y2);
    for (int y = ya; y <= yb; y++) {
      const float ka = (y2 == y0) ? 0.f : (float)(y - y0) / (y2 - y0);
      int xa = x0 + (int)((x2 - x0) * ka), xb2;
      if (y < y1) {
        const float k = (y1 == y0) ? 0.f : (float)(y - y0) / (y1 - y0);
        xb2 = x0 + (int)((x1 - x0) * k);
      } else {
        const float k = (y2 == y1) ? 0.f : (float)(y - y1) / (y2 - y1);
        xb2 = x1 + (int)((x2 - x1) * k);
      }
      if (xa > xb2) std::swap(xa, xb2);
      drawFastHLine(xa, y, xb2 - xa + 1, c);
    }
  }
};
