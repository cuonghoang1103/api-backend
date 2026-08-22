#pragma once
// Lớp giả của Arduino_GFX: chỉ đủ những gì `eyes.cpp` gọi tới.
// `draw16bitRGBBitmap()` chép thẳng khối vào khung hình trong bộ nhớ.
#include <Arduino.h>
#include <cstring>
#define GFX_NOT_DEFINED -1
#define RGB565_BLACK 0
class Arduino_GFX {
 public:
  uint16_t khung[240 * 240] = {0};
  void fillScreen(uint16_t c) { for (int i = 0; i < 240 * 240; i++) khung[i] = c; }
  void draw16bitRGBBitmap(int16_t x, int16_t y, uint16_t* bm, int16_t w, int16_t h) {
    for (int r = 0; r < h; r++)
      if (y + r >= 0 && y + r < 240) memcpy(khung + (y + r) * 240 + x, bm + r * w, w * 2);
  }
};
