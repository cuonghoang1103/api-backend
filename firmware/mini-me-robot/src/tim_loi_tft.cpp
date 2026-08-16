/**
 * ============================================================
 * MÀN TRÒN chạy bằng TFT_eSPI — thử xem thư viện có phải thủ phạm
 * ============================================================
 *
 *     pio run -e tft-tron -t upload && pio device monitor
 *
 * ⚠️ DỮ KIỆN DẪN TỚI PHÉP THỬ NÀY, và tôi bỏ qua nó suốt hai ngày:
 *
 * Màn ngực 3.5" ILI9488 chạy **ổn định** trên ĐÚNG ba chân này —
 * MOSI 11, SCLK 12, DC 13 — ở **20 MHz**, bằng **TFT_eSPI**, suốt
 * nhiều tuần. Cùng bo, cùng dây dupont, cùng kiểu đấu.
 *
 * Vậy phần cứng thừa sức tải SPI. Thứ DUY NHẤT khác giữa "chạy ổn" và
 * "hỏng liên tục" là thư viện: TFT_eSPI ↔ Arduino_GFX.
 *
 * Tôi chuyển sang Arduino_GFX vì TFT_eSPI chốt loại chip màn lúc BIÊN
 * DỊCH, nên không lái nổi cùng lúc ILI9488 (ngực) và GC9A01 (mắt). Lý
 * do đó đúng, nhưng nó khiến tôi đổi thư viện CÙNG LÚC với việc lắp
 * một con màn mới — hai biến một lúc, và suốt hai ngày tôi đổ hết cho
 * con màn.
 *
 * Bản này lái màn tròn bằng TFT_eSPI, vẽ đúng con mắt tĩnh như bản
 * Arduino_GFX. So sánh trực tiếp:
 *
 *   hình sạch → Arduino_GFX là thủ phạm. Mắt quay về TFT_eSPI, và màn
 *               ngực phải tách sang thư viện khác (hoặc bỏ).
 *   vẫn hỏng  → thư viện vô can, quay lại xét dây và nguồn.
 */

#include <Arduino.h>
#include <TFT_eSPI.h>

static TFT_eSPI tft = TFT_eSPI();

// CS kéo tay: build này khai `-DTFT_CS=-1` để sau còn dùng chung bus
// cho hai mắt. Ở đây chỉ có một mắt nên kéo xuống rồi giữ luôn.
#define CS_MAT 9

void setup() {
  Serial.begin(115200);
  delay(600);
  Serial.println("\n\n╔══════════════════════════════════════════════╗");
  Serial.println("║  MAN TRON chay bang TFT_eSPI (khong Arduino_GFX) ║");
  Serial.println("╚══════════════════════════════════════════════╝");
  Serial.println("  Cung day, cung chan, cung con man — chi khac THU VIEN.");
  Serial.println("  MOSI 11 · SCLK 12 · DC 13 · CS 9 · RST 3V3");
  Serial.println();

  pinMode(CS_MAT, OUTPUT);
  digitalWrite(CS_MAT, LOW);   // chọn và giữ, chỉ có một màn

  tft.init();
  tft.setRotation(0);

  Serial.println("╔════════════════════════════════════════════╗");
  Serial.println("║  PHEP THU TOI GIAN: chi fillScreen, doi mau ║");
  Serial.println("╠════════════════════════════════════════════╣");
  Serial.println("║  DO → LUC → LAM → TRANG, moi mau 3 giay    ║");
  Serial.println("║  Khong ve hinh gi khac. Mot cua so dia chi. ║");
  Serial.println("╚════════════════════════════════════════════╝\n");
}

/**
 * ⚠️ DỰNG LẠI MỐC — chỉ `fillScreen`, không gì khác.
 *
 * Qua hai ngày và mười mấy lần đổi dây/đổi chân/đổi thư viện, tôi đã
 * theo dõi hụt trạng thái đấu nối. Ảnh mới nhất cho thấy nền ra XANH
 * LAM trong khi mã tô ĐEN TUYỀN — mà `0x0000` là chuỗi toàn số 0, xô
 * lệch bit kiểu gì cũng vẫn là số 0. Tức `fillScreen` KHÔNG ăn nữa,
 * dù trước đó nó từng ăn.
 *
 * Nên bỏ hết mọi thứ phức tạp, quay về phép thử rẻ nhất: đổi màu cả
 * màn. Một cửa sổ địa chỉ duy nhất, không hình khối, không đệm.
 *
 * Bốn màu chạy đúng → dây tốt, ta đi tiếp từ đây.
 * Không đúng       → dây sai, và mọi kết luận hai ngày qua đều dựa
 *                    trên một nền móng đã đổi lúc nào không hay.
 */
void loop() {
  const struct { uint16_t m; const char* t; } MAU[] = {
      {TFT_RED, "DO"}, {TFT_GREEN, "LUC"}, {TFT_BLUE, "LAM"}, {TFT_WHITE, "TRANG"}};
  for (auto& k : MAU) {
    digitalWrite(CS_MAT, LOW);
    tft.fillScreen(k.m);
    Serial.printf("  ▶ %s\n", k.t);
    delay(3000);
  }

}
