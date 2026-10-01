#include "chuViet.h"

#include "phong_viet.h"

namespace chuViet {

using phongViet::Chu;

/** Đệm một dòng: rộng tối đa 480 px (cả màn), cao một dòng chữ. ~31 KB,
 *  xin ở PSRAM để khỏi ăn vào heap trong mà TLS cần. */
static constexpr int RONG_MAX = 480;
static uint16_t* dem = nullptr;

int caoDong() { return phongViet::TREN + phongViet::DUOI; }

/** Đọc một mã Unicode từ UTF-8, tiến con trỏ. Hỏng thì trả '?'. */
static uint32_t docMa(const char*& p, const char* het) {
  const uint8_t c = (uint8_t)*p++;
  if (c < 0x80) return c;
  int them = 0;
  uint32_t ma = 0;
  if ((c & 0xE0) == 0xC0) { them = 1; ma = c & 0x1F; }
  else if ((c & 0xF0) == 0xE0) { them = 2; ma = c & 0x0F; }
  else if ((c & 0xF8) == 0xF0) { them = 3; ma = c & 0x07; }
  else return '?';
  while (them-- > 0) {
    if (p >= het || ((uint8_t)*p & 0xC0) != 0x80) return '?';
    ma = (ma << 6) | ((uint8_t)*p++ & 0x3F);
  }
  return ma;
}

/** Tìm chữ theo mã (chia đôi). Không có thì lấy '?' — thà hiện dấu hỏi
 *  còn hơn nuốt mất chữ mà không ai biết. */
static const Chu* timChu(uint32_t ma) {
  int lo = 0, hi = phongViet::SO_CHU - 1;
  while (lo <= hi) {
    const int giua = (lo + hi) / 2;
    const uint16_t m = phongViet::CHU[giua].ma;
    if (m == ma) return &phongViet::CHU[giua];
    if (m < ma) lo = giua + 1;
    else hi = giua - 1;
  }
  return ma == '?' ? nullptr : timChu('?');
}

static const char* hetChuoi(const char* s, int n) {
  const size_t len = strlen(s);
  return s + (n < 0 || (size_t)n > len ? len : (size_t)n);
}

int doRong(const char* utf8, int n) {
  if (!utf8) return 0;
  const char* het = hetChuoi(utf8, n);
  int w = 0;
  for (const char* p = utf8; p < het;) {
    const Chu* c = timChu(docMa(p, het));
    if (c) w += c->tien;
  }
  return w;
}

int vuaDong(const char* utf8, int w) {
  if (!utf8) return 0;
  const char* het = utf8 + strlen(utf8);
  int rong = 0;
  int catTrang = -1;   // byte ngay sau khoảng trắng gần nhất
  for (const char* p = utf8; p < het;) {
    const char* dau = p;
    const uint32_t ma = docMa(p, het);
    const Chu* c = timChu(ma);
    const int t = c ? c->tien : 0;
    if (rong + t > w && dau > utf8) return catTrang > 0 ? catTrang : (int)(dau - utf8);
    rong += t;
    if (ma == ' ') catTrang = (int)(p - utf8);
  }
  return (int)(het - utf8);
}

/** Trộn hai màu RGB565 theo a/15. */
static uint16_t tron(uint16_t mau, uint16_t nen, uint8_t a) {
  if (a >= 15) return mau;
  if (a == 0) return nen;
  const int r = (((mau >> 11) & 31) * a + ((nen >> 11) & 31) * (15 - a)) / 15;
  const int g = (((mau >> 5) & 63) * a + ((nen >> 5) & 63) * (15 - a)) / 15;
  const int b = ((mau & 31) * a + (nen & 31) * (15 - a)) / 15;
  return (uint16_t)((r << 11) | (g << 5) | b);
}

int ve(Arduino_GFX* tft, int x, int y, int w, const char* utf8, uint16_t mau, uint16_t nen,
       Canh canh, int n) {
  if (!tft || w <= 0) return 0;
  if (w > RONG_MAX) w = RONG_MAX;
  const int h = caoDong();
  if (!dem) {
    dem = (uint16_t*)ps_malloc(RONG_MAX * h * sizeof(uint16_t));
    if (!dem) dem = (uint16_t*)malloc(RONG_MAX * h * sizeof(uint16_t));
    if (!dem) return 0;
  }
  // Pha 1 ghi ALPHA (0..15) vào đệm, lấy MAX chỗ hai chữ chồng nhau (dấu
  // của chữ này lấn sang ô chữ kia); pha 2 mới đổi alpha thành màu. Ghi
  // đè thẳng màu thì mép chữ sau xoá mất phần đậm của chữ trước.
  memset(dem, 0, w * h * sizeof(uint16_t));

  if (!utf8) utf8 = "";
  const char* het = hetChuoi(utf8, n);
  const int rong = doRong(utf8, (int)(het - utf8));
  int but = canh == GIUA ? (w - rong) / 2 : canh == PHAI ? w - rong : 0;
  if (but < 0) but = 0;

  for (const char* p = utf8; p < het;) {
    const Chu* c = timChu(docMa(p, het));
    if (!c) continue;
    const int gx = but + c->dx, gy = phongViet::TREN + c->dy;
    const int byteHang = (c->w + 1) / 2;
    for (int yy = 0; yy < c->h; yy++) {
      const int py = gy + yy;
      if (py < 0 || py >= h) continue;
      const uint8_t* hang = phongViet::BITMAP + c->vt + yy * byteHang;
      for (int xx = 0; xx < c->w; xx++) {
        const int px = gx + xx;
        if (px < 0 || px >= w) continue;
        const uint8_t b = hang[xx / 2];
        const uint8_t a = (xx & 1) ? (b & 0x0F) : (b >> 4);
        if (a > dem[py * w + px]) dem[py * w + px] = a;
      }
    }
    but += c->tien;
    if (but >= w) break;
  }

  // 16 màu trộn sẵn cho 16 mức alpha — khỏi trộn lại từng điểm.
  uint16_t bang[16];
  for (int a = 0; a < 16; a++) bang[a] = tron(mau, nen, (uint8_t)a);
  for (int i = 0; i < w * h; i++) dem[i] = bang[dem[i] & 15];
  tft->draw16bitRGBBitmap(x, y, dem, w, h);
  return rong;
}

}  // namespace chuViet
