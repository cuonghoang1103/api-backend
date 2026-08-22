#pragma once
#include <cstdint>
#include <cstdio>
#include <cstdarg>
#include <cstring>
#include <cmath>
#include <algorithm>
#include <cstdlib>
#define MALLOC_CAP_INTERNAL 1
#define MALLOC_CAP_8BIT 2
inline void* heap_caps_malloc(size_t n, int) { return malloc(n); }
using std::min; using std::max;
#define PI 3.14159265358979f
#define TWO_PI 6.28318530718f
#define OUTPUT 1
#define INPUT 0
#define LOW 0
#define HIGH 1
extern uint32_t g_ms;      // đồng hồ giả
extern int      g_cs;      // chân CS đang được kéo xuống
inline uint32_t millis() { return g_ms; }
inline uint32_t micros() { return 0; }   // ngân sách không bao giờ hết → vẽ trọn khung
inline void pinMode(int, int) {}
inline void digitalWrite(int p, int v) { if (v == LOW) g_cs = p; else if (g_cs == p) g_cs = -1; }
template <class T, class A, class B> T constrain(T v, A lo, B hi) {
  return v < (T)lo ? (T)lo : (v > (T)hi ? (T)hi : v);
}
struct _Ser {
  void printf(const char* f, ...) { va_list a; va_start(a, f); vprintf(f, a); va_end(a); }
  void println(const char* s = "") { ::printf("%s\n", s); }
};
extern _Ser Serial;
