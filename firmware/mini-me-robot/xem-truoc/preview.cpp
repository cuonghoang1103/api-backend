// Chạy ĐÚNG mã vẽ của eyes.cpp trên máy Mac, xuất ảnh PPM.
//
// Mục đích: nhìn thấy khuôn mắt TRƯỚC KHI hàn, và bắt lỗi hình học
// (mí lệch, mống tràn ra ngoài kính, đốm loé sai phía) bằng mắt thay
// vì bằng cách đoán qua mã.
#include <Arduino.h>
#include <Arduino_GFX_Library.h>
#include <cstdio>
#include <string>
#include "config.h"
#include "eyes.h"

uint32_t g_ms = 0;
int g_cs = -1;
_Ser Serial;
static Arduino_GFX gT, gP;
#define g_khungT gT.khung
#define g_khungP gP.khung

static void chay(int soKhung) {
  for (int i = 0; i < soKhung; i++) { g_ms += 16; eyes::loop(1000000); }
}

/** Hai mắt cạnh nhau + khe giữa, đúng cách nhìn từ trước mặt robot. */
static void xuat(const std::string& ten) {
  const int KHE = 16, W = 240 * 2 + KHE, H = 240;
  FILE* f = fopen((ten + ".ppm").c_str(), "wb");
  fprintf(f, "P6\n%d %d\n255\n", W, H);
  for (int y = 0; y < H; y++)
    for (int x = 0; x < W; x++) {
      uint16_t c = 0;
      if (x < 240) c = g_khungT[y * 240 + x];
      else if (x >= 240 + KHE) c = g_khungP[y * 240 + (x - 240 - KHE)];
      unsigned char p[3] = {(unsigned char)(((c >> 11) & 0x1F) * 255 / 31),
                            (unsigned char)(((c >> 5) & 0x3F) * 255 / 63),
                            (unsigned char)((c & 0x1F) * 255 / 31)};
      fwrite(p, 1, 3, f);
    }
  fclose(f);
}

int main() {
  if (!eyes::begin(&gT, &gP)) { printf("begin that bai\n"); return 1; }
  chay(120);  // để hoạt ảnh khởi động chạy hết

  struct { eyes::Expr e; const char* ten; } ds[] = {
      {eyes::NEUTRAL,"01-binh-thuong"}, {eyes::HAPPY,"02-vui"},
      {eyes::EXCITED,"03-phan-khich"},  {eyes::LOVE,"04-yeu"},
      {eyes::PROUD,"05-tu-hao"},        {eyes::CURIOUS,"06-to-mo"},
      {eyes::THINKING,"07-dang-nghi"},  {eyes::CONFUSED,"08-kho-hieu"},
      {eyes::SUSPICIOUS,"09-nghi-ngo"}, {eyes::ANNOYED,"10-kho-chiu"},
      {eyes::ANGRY,"11-gian"},          {eyes::SAD,"12-buon"},
      {eyes::SHY,"13-ngai"},            {eyes::SCARED,"14-so"},
      {eyes::SURPRISED,"15-ngac-nhien"},{eyes::DIZZY,"16-choang"},
      {eyes::BORED,"17-chan"},          {eyes::SLEEPY,"18-buon-ngu"},
      {eyes::SLEEPING,"19-dang-ngu"},   {eyes::LISTENING,"20-dang-nghe"},
      {eyes::SPEAKING,"21-dang-noi"},   {eyes::SCANNING,"22-dang-quet"},
      {eyes::CHARGING,"23-dang-sac"},   {eyes::LOWBAT,"24-pin-yeu"},
      {eyes::ERROR,"25-loi"},           {eyes::BOOTING,"26-khoi-dong"},
  };

  eyes::setStatus(true, true);
  eyes::setBattery(78);

  for (auto& m : ds) {
    eyes::look(0, 0);
    if (m.e == eyes::SPEAKING) eyes::setLevel(180000);  // đang phát tiếng to
    else eyes::setLevel(0);
    eyes::set(m.e);
    chay(m.e == eyes::BOOTING ? 45 : 90);
    xuat(m.ten);
  }

  // Vài cảnh riêng không phải "một biểu cảm"
  eyes::set(eyes::NEUTRAL); chay(90);
  eyes::wink(true);         chay(30); xuat("27-nhay-mat-trai");
  eyes::set(eyes::NEUTRAL); chay(60);
  eyes::look(-1.0f, -0.4f); chay(40); xuat("28-liec-trai-len");
  eyes::look(1.0f, 0.5f);   chay(40); xuat("29-liec-phai-xuong");
  eyes::look(0, 0);         chay(40);
  eyes::blink(1);           chay(5);  xuat("30-dang-chop");
  printf("\nxong\n");
  return 0;
}
