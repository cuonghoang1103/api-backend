#pragma once
#include <cstdint>
// PRNG cố định → ảnh xem trước tái lập được, chạy lại ra đúng ảnh cũ.
inline uint32_t esp_random() {
  static uint32_t s = 0x2545F491u;
  s ^= s << 13; s ^= s >> 17; s ^= s << 5;
  return s;
}
