/**
 * ============================================================
 * HIỆU CHỈNH CẢM ỨNG — chấm xanh có nằm đúng dưới ngón tay không
 * ============================================================
 *
 *     pio run -e thu-cham -t upload && pio device monitor
 *
 * ⚠️ VÌ SAO CẦN. Tấm cảm ứng FT6336U có hệ toạ độ riêng (dọc 320×480),
 * màn đang xoay ngang 480×320. Bốn cách ghép trục đều trông hợp lý trên
 * giấy, và chọn nhầm thì ngón tay đi một đằng mắt nhìn một nẻo — nhưng
 * vẫn CHẠY, nên rất dễ tưởng là đúng.
 *
 * Bàn này dùng ĐÚNG hàm `camUng::anhXa()` mà firmware dùng. Chỉnh xong ở
 * đây là firmware đúng theo — không có hai phép ghép trôi xa nhau.
 *
 * CÁCH LÀM: chạm vào ô "1" (góc trên-trái) rồi ô "2" (góc dưới-phải).
 * Chấm xanh phải hiện NGAY DƯỚI ngón. Lệch thì lật cờ trong config.h:
 *
 *   chấm chạy ngang khi ngón chạy dọc → CHAM_DOI_TRUC
 *   chấm ngược trái/phải               → CHAM_LAT_X
 *   chấm ngược trên/dưới               → CHAM_LAT_Y
 *
 * KHÔNG khởi tạo hai mắt: mắt vẽ lại liên tục sẽ xoá chấm xanh trong
 * vòng 16 ms, người dùng không kịp thấy.
 */
#include <Arduino.h>
#include <Wire.h>

#include "camUng.h"
#include "config.h"
#include "man_hinh.h"

static Arduino_GFX* g = nullptr;
static bool coCham = false;

static void oDich(int x, int y, const char* so) {
  g->drawRect(x, y, 56, 56, TFT_YELLOW);
  g->drawRect(x + 1, y + 1, 54, 54, TFT_YELLOW);
  g->setTextColor(TFT_YELLOW);
  g->setTextSize(3);
  g->setCursor(x + 19, y + 16);
  g->print(so);
}

static void veNen() {
  const int W = g->width(), H = g->height();
  g->fillScreen(TFT_BLACK);
  oDich(8, 8, "1");
  oDich(W - 64, H - 64, "2");
  g->setTextColor(TFT_WHITE);
  g->setTextSize(2);
  g->setCursor(90, 120);
  g->print(coCham ? "Cham o 1, roi o 2" : "KHONG THAY CAM UNG 0x38");
  g->setTextColor(TFT_DARKGREY);
  g->setCursor(90, 150);
  g->print("Cham xanh phai nam DUOI ngon");
}

void setup() {
  Serial.begin(115200);
  delay(600);
  Serial.println("\n+-----------------------------------------------+");
  Serial.println("|  HIEU CHINH CAM UNG — FT6336U                 |");
  Serial.println("+-----------------------------------------------+");
  Serial.printf("  Co hien tai: DOI_TRUC=%d  LAT_X=%d  LAT_Y=%d\n\n", CHAM_DOI_TRUC, CHAM_LAT_X,
                CHAM_LAT_Y);

  man_hinh::batTatCa();
  g = man_hinh::nguc();

  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL, 400000);
  for (int i = 0; i < 3 && !coCham; i++) {
    Wire.beginTransmission(0x38);
    coCham = Wire.endTransmission() == 0;
    if (!coCham) delay(100);
  }
  Serial.printf("  FT6336U 0x38: %s\n", coCham ? "CO" : "KHONG THAY — kiem CTP_SCL->18, CTP_SDA->8, CTP_RST->3V3");
  veNen();
  if (coCham) Serial.println("  Cham o 1 (tren-trai) roi o 2 (duoi-phai).\n");
}

void loop() {
  static uint32_t lan = 0;
  if (millis() - lan < 33) return;
  lan = millis();
  if (!coCham) return;

  Wire.beginTransmission(0x38);
  Wire.write(0x02);
  if (Wire.endTransmission(false) != 0) return;
  if (Wire.requestFrom(0x38, 5) != 5) return;
  const uint8_t so = Wire.read() & 0x0F;
  const uint8_t xh = Wire.read(), xl = Wire.read(), yh = Wire.read(), yl = Wire.read();
  if (so == 0 || so > 2) return;
  const uint16_t rx = ((uint16_t)(xh & 0x0F) << 8) | xl;
  const uint16_t ry = ((uint16_t)(yh & 0x0F) << 8) | yl;

  int sx, sy;
  camUng::anhXa(rx, ry, g->width(), g->height(), sx, sy);
  g->fillCircle(sx, sy, 7, TFT_CYAN);

  g->setTextColor(TFT_YELLOW, TFT_BLACK);
  g->setTextSize(2);
  g->setCursor(90, 200);
  g->printf("tho %3u,%3u  man %3d,%3d ", rx, ry, sx, sy);

  // Góc nào → cho biết luôn phải lật cờ nào. Người dùng chỉ cần đọc
  // một dòng, khỏi phải tự suy ra từ bốn con số.
  const int W = g->width(), H = g->height();
  const char* goi = "";
  if (sx < W / 3 && sy < H / 3) goi = "  <- chấm ở TRÊN-TRÁI";
  else if (sx > 2 * W / 3 && sy > 2 * H / 3) goi = "  <- chấm ở DƯỚI-PHẢI";
  else if (sx > 2 * W / 3 && sy < H / 3) goi = "  <- chấm ở TRÊN-PHẢI";
  else if (sx < W / 3 && sy > 2 * H / 3) goi = "  <- chấm ở DƯỚI-TRÁI";
  Serial.printf("  tho X=%3u Y=%3u  ->  man (%3d,%3d)%s\n", rx, ry, sx, sy, goi);
}
