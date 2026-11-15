#include "chon.h"
#include "chuViet.h"
#include "mau.h"

namespace chon {

static Arduino_GFX* tft = nullptr;
static int Y0 = 4, CAO = 240, W = 480;
static bool mo_ = false;
static uint32_t id_ = 0, hanLuc = 0, dongLuc = 0;
static String cau;
static String nut[4];
static int soNut = 0, dangChon = -1;
static String matDong;

static const uint16_t C_NEN = 0x0000, C_NUT = 0x2124, C_VIEN = 0x6B6D, C_CHU = 0xFFFF;
static const uint16_t C_CHO = 0xFD20, C_DUNG = 0x05E0, C_SAI = 0xC800, C_CAU = 0xFFE0;

static const int CAU_CAO = 56;  // hai dòng câu hỏi

static void oNut(int i, int& x, int& y, int& w, int& h) {
  const int top = Y0 + CAU_CAO, cao = CAO - CAU_CAO;
  if (soNut <= 2) {
    w = (W - 30) / 2; h = cao - 16; x = 10 + i * (w + 10); y = top + 6;
  } else if (soNut == 3) {
    w = (W - 40) / 3; h = cao - 16; x = 10 + i * (w + 10); y = top + 6;
  } else {
    w = (W - 30) / 2; h = (cao - 22) / 2; x = 10 + (i % 2) * (w + 10); y = top + 6 + (i / 2) * (h + 10);
  }
}

static void veNut(int i, uint16_t nen) {
  int x, y, w, h;
  oNut(i, x, y, w, h);
  tft->fillRoundRect(x, y, w, h, 14, nen);
  tft->drawRoundRect(x, y, w, h, 14, C_VIEN);
  // Tối đa hai dòng, giữa nút.
  const int cd = chuViet::caoDong();
  const char* s = nut[i].c_str();
  const int n1 = chuViet::vuaDong(s, w - 16);
  const bool haiDong = n1 < (int)nut[i].length();
  const int yChu = y + (h - cd * (haiDong ? 2 : 1)) / 2;
  chuViet::ve(tft, x + 8, yChu, w - 16, s, C_CHU, nen, chuViet::GIUA, n1);
  if (haiDong) chuViet::ve(tft, x + 8, yChu + cd, w - 16, s + n1, C_CHU, nen, chuViet::GIUA);
}

static void veHet() {
  tft->fillRect(0, Y0, W, CAO, C_NEN);
  const int cd = chuViet::caoDong();
  const char* s = cau.c_str();
  const int n1 = chuViet::vuaDong(s, W - 20);
  chuViet::ve(tft, 10, Y0 + 4, W - 20, s, C_CAU, C_NEN, chuViet::GIUA, n1);
  if (n1 < (int)cau.length()) chuViet::ve(tft, 10, Y0 + 4 + cd, W - 20, s + n1, C_CAU, C_NEN, chuViet::GIUA);
  for (int i = 0; i < soNut; i++) veNut(i, C_NUT);
}

void begin(Arduino_GFX* t, int yTren, int cao) {
  tft = t;
  Y0 = yTren;
  CAO = cao;
  if (t) W = t->width();
}

void mo(uint32_t id, const char* cauHoi, const char* const* luaChon, int n, uint32_t msHan) {
  if (!tft || n < 2) return;
  soNut = n > 4 ? 4 : n;
  for (int i = 0; i < soNut; i++) { nut[i] = luaChon[i]; if (nut[i].length() > 60) nut[i] = nut[i].substring(0, 60); }
  cau = cauHoi ? cauHoi : "";
  if (cau.length() > 140) cau = cau.substring(0, 140);
  id_ = id;
  dangChon = -1;
  dongLuc = 0;
  matDong = "";
  hanLuc = millis() + (msHan ? msHan : 30000);
  mo_ = true;
  veHet();
  Serial.printf("[chon] mo #%lu, %d nut\n", (unsigned long)id, soNut);
}

void ketQua(uint32_t id, int dung, int daChon, const char* mat) {
  if (!mo_ || id != id_) return;
  if (daChon >= 0 && daChon < soNut && daChon != dung) veNut(daChon, C_SAI);
  if (dung >= 0 && dung < soNut) veNut(dung, C_DUNG);
  else if (daChon >= 0 && daChon < soNut) veNut(daChon, C_DUNG);
  matDong = mat ? mat : "";
  dongLuc = millis() + 1600;
}

static bool vuaDong = false;
void dong() {
  if (!mo_) return;
  mo_ = false;
  dongLuc = 0;
  hanLuc = 0;
  tft->fillRect(0, Y0, W, CAO, C_NEN);
  vuaDong = true;
  Serial.println("[chon] dong (server)");
}

bool dangMo() { return mo_; }
uint32_t idHienTai() { return id_; }

int cham(int x, int y) {
  if (!mo_ || dangChon >= 0 || dongLuc) return -1;
  for (int i = 0; i < soNut; i++) {
    int bx, by, bw, bh;
    oNut(i, bx, by, bw, bh);
    if (x >= bx && x < bx + bw && y >= by && y < by + bh) {
      dangChon = i;
      veNut(i, C_CHO);
      return i;
    }
  }
  return -1;
}

bool tick() {
  if (vuaDong) { vuaDong = false; return true; }
  if (!mo_) return false;
  const uint32_t now = millis();
  // Đã chạm mà 6 giây server không trả kết quả ⇒ đóng (mạng rớt), khỏi kẹt khung.
  if ((dongLuc && (int32_t)(now - dongLuc) >= 0) || (hanLuc && (int32_t)(now - hanLuc) >= 0)) {
    mo_ = false;
    dongLuc = hanLuc = 0;
    tft->fillRect(0, Y0, W, CAO, C_NEN);
    Serial.println("[chon] dong");
    return true;
  }
  if (dangChon >= 0 && !dongLuc && hanLuc - now > 6000) hanLuc = now + 6000;
  return false;
}

const char* matSauKhiDong() { return matDong.c_str(); }

}  // namespace chon
