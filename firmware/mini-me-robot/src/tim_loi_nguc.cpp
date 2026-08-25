/**
 * ============================================================
 * TÌM LỖI MÀN NGỰC — Arduino_GFX, sáu cấu hình, tự chạy hết
 * ============================================================
 *
 *     pio run -e tim-nguc -t upload && pio device monitor
 *
 * ⚠️ VÌ SAO CÓ FILE NÀY. Ngày 25/08/2026 màn ngực ILI9488 ra TRẮNG
 * ĐỤC dưới Arduino_GFX, trong khi CÙNG bo, CÙNG dây, CÙNG 20 MHz nó
 * chạy hoàn hảo dưới TFT_eSPI ở bàn kiểm `test/`. Hai mắt GC9A01 dùng
 * chung đúng bus ấy cũng vẽ đẹp — nên bus, dây và nguồn đều vô can.
 *
 * Thứ khác nhau là THƯ VIỆN, và trong Arduino_GFX thì ILI9488 có ba
 * lớp cùng vài cờ. Đoán từng cái một tốn mỗi lần một lượt hỏi người
 * dùng. File này chạy hết trong một lượt: mỗi cấu hình tô ĐỎ → LỤC →
 * LAM → TRẮNG rồi vẽ một khung chữ nhật, 4 giây một cấu hình.
 *
 * Ô màu ĐẶC không thể sai vì mã vẽ — nó chỉ là `fillScreen`. Nên ô
 * nào ra ĐÚNG MÀU thì cấu hình đó đúng.
 *
 * ⚠️ CHỈ lái màn ngực (CS = GPIO 10). Hai mắt để yên, càng ít thứ
 * trong mạch càng ít nghi phạm.
 */
#include <Arduino.h>
#include <Arduino_GFX_Library.h>
#include "config.h"

struct CauHinh {
  const char* ten;
  uint8_t lop;      // 0 = ILI9488 trần · 1 = _18bit
  bool ips;
  int32_t toc;
};

static const CauHinh DS[] = {
    {"_18bit · IPS tat  · 20MHz", 1, false, 20000000},
    {"_18bit · IPS bat  · 20MHz", 1, true,  20000000},
    {"_18bit · IPS tat  ·  8MHz", 1, false,  8000000},
    {"tran   · IPS tat  · 20MHz", 0, false, 20000000},
    {"tran   · IPS bat  · 20MHz", 0, true,  20000000},
    {"tran   · IPS tat  ·  8MHz", 0, false,  8000000},
};
static constexpr int SO = sizeof(DS) / sizeof(DS[0]);

static SPIClass hspi(HSPI);

void setup() {
  Serial.begin(115200);
  delay(600);
  Serial.println("\n╔══════════════════════════════════════════════╗");
  Serial.println("║  TIM LOI MAN NGUC — Arduino_GFX, 6 cau hinh  ║");
  Serial.println("╚══════════════════════════════════════════════╝");
  Serial.printf("  CS=%d  DC=%d  SCLK=%d  MOSI=%d  (khop config.h)\n",
                PIN_TFT_CS, PIN_TFT_DC, PIN_TFT_SCLK, PIN_TFT_MOSI);
  Serial.println("  Moi cau hinh 4 giay: DO -> LUC -> LAM -> TRANG -> khung");
  Serial.println("  O dac KHONG THE sai vi ma ve. O nao DUNG MAU = cau hinh dung.\n");
  // ⛔⛔ VÔ HIỆU HAI MẮT TRƯỚC KHI LÀM GÌ KHÁC.
  //
  // Chân CS thả nổi thì bắt nhiễu, và con màn tưởng nó ĐANG ĐƯỢC CHỌN
  // nên nuốt luôn dữ liệu gửi cho màn khác. Ngày 25/08/2026 bản đầu của
  // file này quên bước ấy: một mắt sọc nhảy màu, một mắt tắt ngóm, và
  // trông y như hai con mắt vừa hỏng.
  //
  // CS tích cực ở mức THẤP, nên kéo lên CAO là bảo "đừng nghe".
  pinMode(PIN_EYE_CS_L, OUTPUT);
  digitalWrite(PIN_EYE_CS_L, HIGH);
  pinMode(PIN_EYE_CS_R, OUTPUT);
  digitalWrite(PIN_EYE_CS_R, HIGH);

  hspi.begin(PIN_TFT_SCLK, -1, PIN_TFT_MOSI, PIN_TFT_CS);
}

void loop() {
  for (int i = 0; i < SO; i++) {
    const CauHinh& c = DS[i];
    Serial.printf("\n▶ [%d/%d] %s\n", i + 1, SO, c.ten);

    auto* bus = new Arduino_HWSPI(PIN_TFT_DC, PIN_TFT_CS, PIN_TFT_SCLK,
                                  PIN_TFT_MOSI, GFX_NOT_DEFINED, &hspi, true);
    bus->begin(c.toc);
    bus->sendCommand(0x01);          // SWRESET — thư viện không tự làm
    delay(150);

    Arduino_GFX* g = c.lop
        ? (Arduino_GFX*)new Arduino_ILI9488_18bit(bus, GFX_NOT_DEFINED, 3, c.ips)
        : (Arduino_GFX*)new Arduino_ILI9488(bus, GFX_NOT_DEFINED, 3, c.ips);
    Serial.printf("   begin() -> %s\n", g->begin(c.toc) ? "true" : "false");

    const uint16_t mau[] = {RED, GREEN, BLUE, WHITE};
    const char* ten[] = {"DO", "LUC", "LAM", "TRANG"};
    for (int k = 0; k < 4; k++) {
      Serial.printf("   %s\n", ten[k]);
      g->fillScreen(mau[k]);
      delay(900);
    }
    g->fillScreen(BLACK);
    g->drawRect(10, 10, g->width() - 20, g->height() - 20, WHITE);
    g->setCursor(30, 40);
    g->setTextColor(WHITE);
    g->setTextSize(3);
    g->print(i + 1);
    delay(1200);

    delete g;
    delete bus;
  }
  Serial.println("\n══ HET MOT VONG — cau hinh nao SACH? bao lai so ==\n");
  delay(2000);
}
