/**
 * ============================================================
 * NGHIỆM THU MÀN NGỰC ST7796U — chạy TRƯỚC khi bắt vào vỏ
 * ============================================================
 *
 *     pio run -e tim-nguc -t upload && pio device monitor
 *
 * Bàn này thay bản cũ (quay 6 cấu hình ILI9488 để mò driver). Không cần
 * mò nữa: bo mới là `ST7796U`, có chân RST thật và có MISO.
 *
 * ⚠️ VÌ SAO NÓ HỎI ID TRƯỚC KHI VẼ.
 *
 * Ngày 25-26/08/2026 màn ngực ILI9488 chết dần vì ổn áp trên bo hỏng.
 * Firmware in `3/3 màn khởi tạo xong` suốt hai ngày, vì
 * `Arduino_GFX::begin()` gần như không bao giờ trả false — bo cũ không
 * đưa MISO ra nên thư viện KHÔNG CÓ CÁCH NÀO biết đầu kia có gì. Nó gửi
 * lệnh vào chỗ trống và báo thành công.
 *
 * Bo mới có MISO. Nên trước khi vẽ một điểm ảnh nào, hỏi thẳng con chip
 * "còn sống không" và đọc câu trả lời. Bốn byte về mà KHÔNG phải toàn
 * 0x00 hay toàn 0xFF nghĩa là có ai đó đang lái đường MISO — tức là chip
 * còn sống và đang nghe.
 *
 * Toàn 0x00  → không ai lái, coi như đường MISO chết hoặc chip câm.
 * Toàn 0xFF  → đường thả nổi (kéo lên), gần như chắc chắn chưa nối MISO.
 *
 * ⚠️ ĐỌC PHẢI CHẬM. Ghi thì ST7796 chịu được 40 MHz+, nhưng ĐỌC thì chỉ
 * quanh 6 MHz — chip cần thời gian lái đường dây ra. Đọc ở tốc độ ghi
 * cho ra rác, và rác thì trông y hệt chip hỏng.
 */
#include <Arduino.h>
#include <Arduino_GFX_Library.h>
#include <SPI.h>

#include "config.h"

static SPIClass hspi(HSPI);

/** Giữ lại cho `loop()` quay bốn hướng. */
static Arduino_GFX* gCon = nullptr;

/** Xung reset phần cứng — thứ bo cũ không làm được. */
static void resetCung() {
  pinMode(PIN_TFT_RST, OUTPUT);
  digitalWrite(PIN_TFT_RST, HIGH);
  delay(10);
  digitalWrite(PIN_TFT_RST, LOW);
  delay(20);   // datasheet đòi ≥10 µs, cho rộng tay
  digitalWrite(PIN_TFT_RST, HIGH);
  delay(150);  // ≥120 ms trước lệnh đầu tiên
}

/**
 * Hỏi ID chip qua MISO. Trả `true` nếu có ai đó thật sự trả lời.
 *
 * `0x04` là RDDID: gửi lệnh, rồi đọc 1 byte rác + 3 byte ID.
 */
static bool hoiId(uint8_t out[4]) {
  hspi.beginTransaction(SPISettings(4000000, MSBFIRST, SPI_MODE0));
  digitalWrite(PIN_TFT_CS, LOW);
  digitalWrite(PIN_TFT_DC, LOW);
  hspi.transfer(0x04);
  digitalWrite(PIN_TFT_DC, HIGH);
  for (int i = 0; i < 4; i++) out[i] = hspi.transfer(0x00);
  digitalWrite(PIN_TFT_CS, HIGH);
  hspi.endTransaction();

  bool toanKhong = true, toanMot = true;
  for (int i = 0; i < 4; i++) {
    if (out[i] != 0x00) toanKhong = false;
    if (out[i] != 0xFF) toanMot = false;
  }
  return !toanKhong && !toanMot;
}

void setup() {
  Serial.begin(115200);
  delay(600);
  Serial.println("\n╔═══════════════════════════════════════════════╗");
  Serial.println("║  NGHIEM THU MAN NGUC — ST7796U 480x320        ║");
  Serial.println("╚═══════════════════════════════════════════════╝");
  Serial.printf("  CS=%d  DC=%d  SCLK=%d  MOSI=%d  MISO=%d  RST=%d\n", PIN_TFT_CS, PIN_TFT_DC,
                PIN_TFT_SCLK, PIN_TFT_MOSI, PIN_TFT_MISO, PIN_TFT_RST);
  Serial.println("  ⛔ VCC = 3V3. Chi doi sang 5V neu man TRANG o buoc ve.\n");

  // ⛔ Hai mắt phải bị vô hiệu trước khi làm gì khác.
  //
  // Chân CS thả nổi thì bắt nhiễu, và con màn tưởng nó ĐANG ĐƯỢC CHỌN
  // nên nuốt luôn dữ liệu gửi cho màn khác. Bản đầu của file này quên
  // bước ấy: một mắt sọc nhảy màu, một mắt tắt ngóm, trông y như hai
  // con mắt vừa hỏng. CS tích cực mức THẤP → kéo CAO là "đừng nghe".
  pinMode(PIN_EYE_CS_L, OUTPUT);
  digitalWrite(PIN_EYE_CS_L, HIGH);
  pinMode(PIN_EYE_CS_R, OUTPUT);
  digitalWrite(PIN_EYE_CS_R, HIGH);

  pinMode(PIN_TFT_CS, OUTPUT);
  digitalWrite(PIN_TFT_CS, HIGH);
  pinMode(PIN_TFT_DC, OUTPUT);
  hspi.begin(PIN_TFT_SCLK, PIN_TFT_MISO, PIN_TFT_MOSI, PIN_TFT_CS);

  Serial.println("▶ [1/3] Reset phan cung qua chan RST that...");
  resetCung();
  Serial.println("   xong.");

  Serial.println("▶ [2/3] Hoi ID chip qua MISO...");
  uint8_t id[4];
  const bool song = hoiId(id);
  Serial.printf("   tra ve: %02X %02X %02X %02X  →  %s\n", id[0], id[1], id[2], id[3],
                song ? "CO AI TRA LOI — chip song" : "KHONG AI TRA LOI");
  if (!song) {
    Serial.println("   ⚠ Toan 00 = khong ai lai duong MISO.");
    Serial.println("   ⚠ Toan FF = duong tha noi, nhieu kha nang CHUA NOI MISO -> GPIO 3.");
    Serial.println("   Van ve tiep o buoc 3: man co the hien dung ma chi hong duong doc.");
  }

  Serial.println("▶ [3/3] Ve mau...");
  auto* bus = new Arduino_HWSPI(PIN_TFT_DC, PIN_TFT_CS, PIN_TFT_SCLK, PIN_TFT_MOSI,
                                PIN_TFT_MISO, &hspi, true);
  auto* g = new Arduino_ST7796(bus, PIN_TFT_RST, 1, true /* IPS */);
  gCon = g;
  Serial.printf("   begin() -> %s\n", g->begin(20000000) ? "true" : "false");
  Serial.println("   (⚠ begin() gan nhu luon true — bang chung that la KINH, khong phai dong nay)\n");

  const uint16_t mau[] = {RED, GREEN, BLUE, WHITE, BLACK};
  const char* ten[] = {"DO", "LUC", "LAM", "TRANG", "DEN"};
  for (int k = 0; k < 5; k++) {
    Serial.printf("   %s\n", ten[k]);
    g->fillScreen(mau[k]);
    delay(800);
  }
  Serial.println("\n== QUAY BON HUONG — doc SO nao co mui ten chi LEN ==\n");
}

/**
 * Quay vòng cả bốn hướng, mỗi hướng tự in SỐ của chính nó.
 *
 * ⚠️ VÌ SAO CHO XEM CẢ BỐN THAY VÌ ĐOÁN TIẾP.
 *
 * Bo `ILI9488` cũ đúng ở hướng 3. Chép số đó sang `ST7796` thì hình ra
 * ngược; đổi sang 1 thì vẫn báo ngược — mà 1 và 3 cách nhau đúng 180°,
 * không thể cả hai cùng sai. Nghĩa là chữ "ngược" đang chỉ một thứ khác
 * với thứ tôi tưởng (xoay 90°, không phải lộn đầu).
 *
 * Hỏi lại bằng lời thì vòng lặp còn dài. Cho xem cả bốn rồi bảo người
 * dùng đọc SỐ thì hết đường hiểu nhầm — con số tự nó là câu trả lời.
 */
void loop() {
  static const uint16_t VIEN[] = {RED, GREEN, BLUE, YELLOW};
  for (uint8_t r = 0; r < 4; r++) {
    gCon->setRotation(r);
    gCon->fillScreen(BLACK);
    const int W = gCon->width(), H = gCon->height();

    // Viền + mũi tên chỉ LÊN, đặt sát mép trên của hướng đang thử.
    gCon->drawRect(3, 3, W - 6, H - 6, VIEN[r]);
    gCon->fillTriangle(W / 2, 16, W / 2 - 22, 54, W / 2 + 22, 54, VIEN[r]);
    gCon->fillRect(W / 2 - 7, 54, 14, 34, VIEN[r]);

    gCon->setTextColor(WHITE);
    gCon->setTextSize(2);
    gCon->setCursor(W / 2 - 30, 96);
    gCon->print("TREN");

    // Số hướng, to hết cỡ để đọc được từ xa.
    gCon->setTextSize(9);
    gCon->setCursor(W / 2 - 27, H / 2 - 32);
    gCon->printf("%d", r);

    gCon->setTextSize(2);
    gCon->setCursor(12, H - 26);
    gCon->printf("huong %d  ·  %dx%d", r, W, H);

    Serial.printf("  > huong %d  (%dx%d) — mui ten co chi LEN khong?\n", r, W, H);
    delay(3500);
  }
  Serial.println("  -- het mot vong --\n");
}
