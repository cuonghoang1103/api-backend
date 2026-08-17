/**
 * ============================================================
 * DÒ DÂY — kiểm từng sợi bằng đồng hồ đo, không đoán bằng mắt
 * ============================================================
 *
 *     pio run -e kiem-day -t upload && pio device monitor
 *
 * ⚠️ VÌ SAO CẦN. Nhìn bằng mắt chỉ thấy "sợi dây có cắm", không thấy
 * nó cắm ĐÚNG CHÂN, cũng không thấy lõi bên trong có đứt không. Cả
 * ngày 15/08/2026 mất vì tin vào cái nhìn đó.
 *
 * Bộ này kéo LẦN LƯỢT từng chân lên mức cao, mỗi chân 6 giây, và đọc
 * tên nó ra Serial. Bạn kẹp que đo vào MỘT chân TRÊN BO MÀN rồi xem nó
 * lên 3,3 V đúng vào lúc Serial gọi tên chân ấy.
 *
 * Khớp  → sợi đó nối đúng và lõi còn tốt.
 * Lệch  → nó đang nối sang chân khác, và Serial cho biết chân nào.
 * Không bao giờ lên → đứt hoặc tiếp xúc hỏng.
 *
 * ── ⚠️ BẪY THƯỜNG GẶP: NHÌN MẶT TRƯỚC vs MẶT SAU ──
 *
 * Bo màn tròn in tên chân ở MẶT SAU. Nhìn từ mặt trước thì thứ tự chân
 * ĐẢO NGƯỢC. Đấu theo trí nhớ mặt này rồi cắm theo mặt kia thì cả bảy
 * sợi bị lật gương quanh chân giữa:
 *
 *     RST ↔ VCC     CS ↔ GND     DC ↔ SCL     SDA đứng yên
 *
 * Hậu quả: VCC vào chân RST, GND vào chân CS. Đèn nền vẫn có thể sáng
 * qua đường bảo vệ, nên nhìn thì tưởng "có điện, chắc đúng" — mà không
 * một lệnh nào tới được chip. Đúng triệu chứng "sáng mà đen".
 */

#include <Arduino.h>

#include "config.h"

struct Chan {
  int gpio;
  const char* ten;
};

// Đúng bảy sợi của một con màn. VCC và GND không nằm đây vì chúng là
// nguồn — đo trực tiếp bằng đồng hồ, không cần firmware kéo.
static const Chan DS[] = {
    {PIN_EYE_CS_L, "CS   (mat trai)"},
    {PIN_TFT_DC, "DC"},
    {PIN_TFT_SCLK, "SCL / SCK"},
    {PIN_TFT_MOSI, "SDA / MOSI"},
    {PIN_EYE_CS_R, "CS   (mat phai)"},
};
// ⚠️ KHÔNG có dòng RST ở đây, và đó là CỐ Ý. Cả ba con màn đều nối RST
// cứng vào 3V3, nên `config.h` không khai `PIN_TFT_RST` — bản trước liệt
// nó vào bảng này nên `pio run -e kiem-day` không biên dịch nổi (chỉ
// môi trường này hỏng, `mini-me` vẫn xanh nên không ai thấy).
//
// Muốn kiểm sợi RST thì đo bằng đồng hồ: nó phải thông với chân 3V3,
// firmware không kéo được chân mà nó không giữ.
static constexpr int SO = sizeof(DS) / sizeof(DS[0]);

void setup() {
  Serial.begin(115200);
  delay(600);
  Serial.println("\n\n╔═══════════════════════════════════════════════╗");
  Serial.println("║  DO DAY — kep que do vao MOT chan TREN BO MAN ║");
  Serial.println("╚═══════════════════════════════════════════════╝");
  Serial.println("  Que DEN  -> GND");
  Serial.println("  Que DO   -> chan can kiem tren bo MAN (khong phai tren ESP32)");
  Serial.println();
  Serial.println("  Moi chan duoc keo len 3,3V trong 6 giay, lan luot.");
  Serial.println("  Dong ho nhay len dung luc Serial goi ten nao");
  Serial.println("  → soi day do dang noi toi chan ay.");
  Serial.println();
  Serial.println("  ⚠️ Bo man in ten chan o MAT SAU. Nhin tu mat truoc thi");
  Serial.println("     thu tu DAO NGUOC — day la loi dau day pho bien nhat.");
  Serial.println();

  for (auto& c : DS) {
    pinMode(c.gpio, OUTPUT);
    digitalWrite(c.gpio, LOW);
  }
  Serial.println("  Bat dau sau 3 giay...\n");
  delay(3000);
}

void loop() {
  for (int i = 0; i < SO; i++) {
    // Chỉ MỘT chân lên cao mỗi lượt — nếu hai chân cùng cao thì không
    // phân biệt được sợi nào là sợi nào.
    for (int j = 0; j < SO; j++) digitalWrite(DS[j].gpio, j == i ? HIGH : LOW);
    Serial.printf("  ▶ GPIO %-2d  =  %-18s  ← dang o muc CAO (6 giay)\n", DS[i].gpio,
                  DS[i].ten);
    delay(6000);
  }
  for (auto& c : DS) digitalWrite(c.gpio, LOW);
  Serial.println("  ── tat ca ve muc THAP 3 giay, roi chay lai ──\n");
  delay(3000);
}
