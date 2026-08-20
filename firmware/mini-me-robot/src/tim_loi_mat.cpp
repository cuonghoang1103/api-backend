/**
 * ============================================================
 * TÌM LỖI MÀN TRÒN — vẽ MỘT con mắt, một cấu hình, giữ nguyên
 * ============================================================
 *
 *     pio run -e tim-loi -t upload && pio device monitor
 *
 * ⚠️ VÌ SAO PHẢI LÀM THẾ NÀY THAY VÌ ĐỌC TIẾP MÃ THƯ VIỆN.
 *
 * Ngày 15/08/2026 màn tròn ra sọc. Tôi đã đọc mã Arduino_GFX và loại
 * được ba nghi phạm (tốc độ SPI, cờ IPS, lỗi `spiAttachMISO`), nhưng
 * đọc mã chỉ chứng minh được cái gì KHÔNG sai — nó không chỉ ra cái
 * đang sai. Mỗi vòng đoán rồi nạp lại tốn một lượt hỏi người dùng.
 *
 * ⚠️ BẢN ĐẦU thử SÁU cấu hình rồi để người dùng báo cái nào sạch. Bản
 * hiện tại KHÔNG còn làm thế: nó chốt một cấu hình và vẽ một con mắt
 * giữ nguyên mãi. Tiêu đề cũ không được sửa theo, và ngày 21/08/2026
 * chính tôi đọc tiêu đề ấy rồi mô tả sai cho người dùng một phép thử
 * không tồn tại — họ ngồi đếm sáu lượt ô màu không bao giờ tới.
 *
 * Với file gỡ lỗi thì phần chú thích trôi dạt còn nguy hơn mã sai: mã
 * sai thì chạy ra kết quả lạ, chú thích sai thì người đọc tin nó.
 *
 * CHỈ lái MỘT màn tròn (mắt trái, CS = GPIO 9). Bỏ hẳn màn ngực ra
 * khỏi bức tranh — càng ít thứ trong mạch thì càng ít nghi phạm.
 *
 * Mỗi cấu hình tô kín: ĐỎ → LỤC → LAM → TRẮNG, mỗi màu 2 giây.
 * Ô đặc chỉ là một lệnh `fillScreen`, không thể sai vì mã vẽ — nên ô
 * đặc mà sạch nghĩa là cấu hình đó ĐÚNG.
 */

#include <Arduino.h>
#include <Arduino_GFX_Library.h>

#include "config.h"

// SPI_MODE3 là nghi phạm thật: đa số bo GC9A01 chạy mode 0, nhưng có
// lô đòi mode 3, và triệu chứng khi sai mode đúng là ảnh đầy sọc chứ
// không phải màn đen — rất giống thứ đang thấy.
struct CauHinh {
  const char* ten;
  int32_t tocDo;
  bool chungBus;
  int8_t cheDo;      // -1 = mặc định (mode 0)
  bool resetMem;     // tự gửi SWRESET 0x01 trước khi khởi tạo
  bool ips;
  bool rstCung;      // dùng xung reset PHẦN CỨNG trên GPIO 14
};

// ⚠️ RST nối 3V3 là một canh bạc, và ta vừa thua nó.
//
// Chip chỉ rời trạng thái reset khi chân RST ở mức cao VỮNG. Nối cứng
// lên 3V3 thì mọi cú sụt áp trên đường 3V3 — hay một sợi dây lỏng —
// đều giữ chip nằm im trong reset: không nhận lệnh nào, tấm nền tắt,
// còn đèn nền vẫn sáng vì nó nối thẳng nguồn. Nhìn ra ngoài y hệt
// "màn đen nhưng có điện", không có gì chỉ ra nguyên nhân.
//
// Tệ hơn: Arduino_GFX KHÔNG có reset mềm (nhánh `else` trong
// `tftInit()` rỗng, chỉ có chú thích), nên nối 3V3 nghĩa là con màn
// KHÔNG BAO GIỜ được reset sau lần cắm điện đầu tiên.
//
// Bàn thử này chỉ cắm một màn nên GPIO 14 đang rảnh — dùng nó phát
// xung reset thật, đúng cách datasheet yêu cầu.
#define PIN_RST_THU 14

// DC nằm ở GPIO 13, ĐÚNG BẰNG `PIN_TFT_DC` trong config.h.
//
// ⚠️ 16/08/2026 chân này từng bị TẠM DỜI sang GPIO 10 để loại nghi
// phạm trong vụ màn cũ ra sọc, và **không ai dời lại**. Ngày 21/08 nó
// làm mất một vòng: người dùng đấu dây theo `config.h` (DC→13), tôi
// nạp file này (DC→10), màn đen thui và trông y như hỏng phần cứng.
//
// Bài học: bàn thử phải dùng CHUNG hằng số với firmware thật. Lệch một
// chân là phép thử đo nhầm thứ khác, mà nó không hề báo lỗi — `DC` sai
// chỉ khiến màn im lặng, không sinh ra thông báo nào.
//
// Muốn thử dời chân thì đổi ở đây, chạy xong ĐỔI LẠI NGAY.
#define PIN_DC_THU PIN_TFT_DC

// ⚠️ MỘT cấu hình duy nhất, cố định.
//
// Bản trước thử 6 cấu hình cùng lúc — hợp lý khi chưa biết gì, nhưng
// giờ đã biết: ở VCC = 3,3 V con màn ĐÃ đổi màu đúng (chỉ mờ). Tức
// phần mềm không có tội. Biến duy nhất còn lại là DÂY NGUỒN.
//
// Nên bây giờ giữ phần mềm ĐỨNG YÊN và đổi dây: chạy thử ở 3,3 V rồi
// ở 5 V, cùng một bản firmware. Đổi hai thứ một lúc thì không bao giờ
// biết thứ nào gây ra kết quả.
// ⚠️ 2 MHz. Chậm khủng khiếp, và CÓ CHỦ ĐÍCH.
//
// Quy luật đo được 16/08/2026:
//     1 cửa sổ địa chỉ  (fillScreen, fillRect) → ĐÚNG
//     10 cửa sổ         (đẩy dải)              → hỏng
//     ~240 cửa sổ       (fillCircle)           → hỏng
//
// Tức chỗ rơi bit nằm ở đường LỆNH (`CASET`/`RASET`/`RAMWR`), không
// phải đường dữ liệu. Tô kín cả màn chỉ cần một cửa sổ nên nó luôn
// đúng — và đó là lý do mọi phép kiểm bằng ô màu đặc đều báo "tốt".
//
// 2 MHz cho mỗi bit hơn 500 ns để ổn định, thừa sức vượt qua bộ lọc
// do 1 kΩ nối tiếp trên bo màn tạo ra. Nếu ở đây vẫn hỏng thì dứt
// khoát KHÔNG phải tốc độ, và ta đi xét dây `DC` với đường mát.
static const CauHinh DS[] = {
    {"CO DINH: 2MHz (cham co chu dinh) · RST 3V3 + SWRESET · IPS", 2000000, false, -1, false, true, true},
};
static constexpr int SO_CH = sizeof(DS) / sizeof(DS[0]);

static SPIClass spiBus(HSPI);

/**
 * ⚠️ VẼ MỘT LẦN RỒI ĐỨNG IM MÃI MÃI — thời gian là biến cuối cùng phải loại.
 *
 * Ở 4 MHz, tô kín một màn 240×240 mất 230 ms, còn máy ảnh chụp trong
 * 1/30 giây. Nên mọi ảnh chụp suốt tối nay đều bắt được màn ĐANG TÔ DỞ,
 * và những "dải ngang" trong ảnh chỉ là ranh giới giữa phần đã tô với
 * phần chưa — không phải lỗi hiển thị.
 *
 * Ảnh của một hình tĩnh thì không thể hiểu nhầm được nữa: thấy gì trên
 * kính chính là thứ chip đang giữ trong bộ nhớ.
 */
/**
 * ⚠️ TÁCH `fillScreen()` KHỎI `fillRect()` — hai hàm, một câu hỏi.
 *
 * Sau khi thay dây DC (16/08/2026), màn ra ĐEN SẠCH thay vì mấy dải
 * màu. Đen chính là nền tô đầu tiên, nên `fillScreen()` chắc chắn ăn.
 * Câu hỏi còn lại gọn lại đúng một chữ: `fillRect()` có ăn không?
 *
 * Phép thử: tô ĐỎ cả màn, rồi phủ LAM lên đúng NỬA TRÊN.
 *   nửa trên lam / nửa dưới đỏ  → cả hai hàm đều tốt
 *   đỏ toàn bộ                   → `fillRect` không ăn, lỗi ở cửa sổ con
 *   đen / lung tung              → lệnh không tới, quay lại nghi dây
 *
 * Không có hình tròn, không có chữ, không có gì để hiểu nhầm — chỉ hai
 * mảng màu và một đường ranh giới nằm ngang.
 */
/**
 * ⚠️ VẼ MẮT BẰNG CHÍNH HÀM CỦA THƯ VIỆN — bỏ bộ đệm dải.
 *
 * Kết quả bisect 16/08/2026, rõ và dứt khoát:
 *   `fillScreen` + `fillRect` của thư viện  → ĐÚNG (hai mảng màu sạch)
 *   đường đẩy dải của `eyes.cpp`            → SAI (sọc dọc)
 *
 * Đã đọc kỹ `writeAddrWindow` (có phát RAMWR, đúng), `startWrite`
 * (có kéo CS, đúng), `writePixels` (có đảo byte, đúng) — không tìm ra
 * chỗ hỏng bằng cách đọc. Nên thôi đọc, dùng thứ đã chứng minh chạy.
 *
 * Mà hoá ra đổi thế còn ĐƯỢC LỢI: con mắt gần như toàn là mảng màu
 * đặc (đĩa, vành khuyên, mí). Thư viện vẽ chúng bằng `writeRepeat` —
 * một dòng 240 điểm cùng màu tốn 1 lệnh, không phải 480 byte. Nhanh
 * hơn hẳn việc bơm cả khung đệm.
 */
static void veTinhRoiDung(Arduino_GC9A01* g) {
  const int CX = 120, CY = 120;
  g->fillScreen(0x0000);

  // Thân ống kính: ba vành lồng nhau, sáng dần ra ngoài
  g->fillCircle(CX, CY, 119, 0x39E7);   // gờ kim loại
  g->fillCircle(CX, CY, 115, 0x10A2);   // thân tối
  g->fillCircle(CX, CY, 108, 0x0841);
  g->fillCircle(CX, CY, 98, 0x0000);    // lòng ống kính

  // Mống mắt: 14 lớp gradient, sáng ở rìa tối vào giữa
  for (int i = 0; i < 14; i++) {
    const float k = i / 13.0f;
    const int r = (int)(68 * (1.0f - k * 0.92f));
    const uint8_t R = (uint8_t)(18 - 18 * k);
    const uint8_t G = (uint8_t)(61 - 46 * k);
    const uint8_t B = (uint8_t)(31 - 15 * k);
    g->fillCircle(CX, CY, r, (uint16_t)((R << 11) | (G << 5) | B));
  }
  g->fillCircle(CX, CY, 26, 0x0000);          // đồng tử
  g->fillCircle(CX - 11, CY - 12, 9, 0xFFFF); // đốm loé chính
  g->fillCircle(CX + 27, CY + 26, 4, 0xFFFF); // đốm phụ

  Serial.println("\n╔════════════════════════════════════════════╗");
  Serial.println("║  MAT VE BANG HAM THU VIEN — giu mai mai    ║");
  Serial.println("╠════════════════════════════════════════════╣");
  Serial.println("║  Dung phai thay MOT CON MAT:               ║");
  Serial.println("║    · vanh ong kinh xam o ria               ║");
  Serial.println("║    · mong XANH LO co do sang giam vao giua ║");
  Serial.println("║    · dong tu DEN o tam                     ║");
  Serial.println("║    · cham TRANG lech tren-trai             ║");
  Serial.println("╚════════════════════════════════════════════╝");
}

static void chayMot(const CauHinh& c, int stt) {
  Serial.printf("\n════════════════════════════════════════════\n");
  Serial.printf("  ▶ THU CAU HINH %s\n", c.ten);
  Serial.printf("════════════════════════════════════════════\n");

  auto* bus = new Arduino_HWSPI(PIN_DC_THU, PIN_EYE_CS_L, PIN_TFT_SCLK, PIN_TFT_MOSI,
                                GFX_NOT_DEFINED, &spiBus, c.chungBus);
  bus->begin(c.tocDo, c.cheDo);

  if (c.resetMem) {
    bus->sendCommand(0x01);   // SWRESET — datasheet đòi chờ 120 ms
    delay(150);
  }

  // Truyền chân RST vào thư viện → nó tự phát xung cao-thấp-cao đúng
  // nhịp datasheet. Đây là thứ đáng tin hơn hẳn reset mềm.
  auto* g = new Arduino_GC9A01(bus, c.rstCung ? PIN_RST_THU : GFX_NOT_DEFINED, 0, c.ips);
  g->begin(c.tocDo);

  // ⚠️ 6 giây mỗi màu, KHÔNG PHẢI 2. Đèn nền con này rất mờ ở 3,3 V,
  // nên người nhìn cần thời gian để mắt quen tối và để kịp chụp ảnh.
  // Một phép kiểm mà người ta không kịp đọc kết quả thì vô dụng.
  const struct { uint16_t m; const char* t; } MAU[] = {
      {0xF800, "DO"}, {0x07E0, "LUC"}, {0x001F, "LAM"}, {0xFFFF, "TRANG"}};
  for (auto& k : MAU) {
    g->fillScreen(k.m);
    Serial.printf("     %-6s (giu 6 giay)\n", k.t);
    delay(6000);
  }
  // Nửa trên trắng / nửa dưới đen: kiểm tương phản và địa chỉ cùng lúc,
  // và là hình dễ nhận ra nhất khi màn tối om.
  g->fillScreen(0x0000);
  g->fillRect(0, 0, 240, 120, 0xFFFF);
  Serial.println("     NUA TREN TRANG / NUA DUOI DEN (8 giay) <- CHUP ANH LUC NAY");
  delay(8000);
  // Vạch chéo: lệch địa chỉ thì thấy ngay bậc thang.
  g->fillScreen(0x0000);
  for (int i = 0; i < 240; i += 12) g->drawFastHLine(0, i, 240, 0xFFFF);
  Serial.println("     LUOI NGANG 12px (4 giay)");
  delay(4000);

  delete g;
  delete bus;
}

void setup() {
  Serial.begin(115200);
  delay(600);
  Serial.println("\n\n╔══════════════════════════════════════════╗");
  Serial.println("║  TIM LOI MAN TRON — 1 con mat, 1 cau hinh    ║");
  Serial.println("╚══════════════════════════════════════════╝");
  Serial.printf("  Chi lai MOT man: mat trai, CS = GPIO %d\n", PIN_EYE_CS_L);
  Serial.printf("  DC=%d (khop config.h)  SCLK=%d  MOSI=%d\n", PIN_DC_THU, PIN_TFT_SCLK, PIN_TFT_MOSI);
  Serial.printf("  RST -> GPIO %d (xung reset phan cung)\n\n", PIN_RST_THU);
  Serial.println("  ══ PHEP THU: DOI DAY VCC, PHAN MEM DUNG YEN ══");
  Serial.println("   Lan 1: VCC -> 3V3   (truoc day mau DA dung, chi mo)");
  Serial.println("   Lan 2: VCC -> 5V    (den nen sang, nhung mau hong?)");
  Serial.println("   Cung mot firmware. Khac nhau dung MOT soi day.");
}

void loop() {
  static bool xong = false;
  if (xong) { delay(1000); return; }   // đứng im, không vẽ lại

  const CauHinh& c = DS[0];
  auto* bus = new Arduino_HWSPI(PIN_DC_THU, PIN_EYE_CS_L, PIN_TFT_SCLK, PIN_TFT_MOSI,
                                GFX_NOT_DEFINED, &spiBus, c.chungBus);
  bus->begin(c.tocDo, c.cheDo);
  // ⚠️ QUAY VỀ MỐC ĐÃ CHẠY: RST nối 3V3, reset bằng lệnh 0x01.
  //
  // Ngày 15/08 tôi bảo dời RST sang GPIO 14 vì thư viện không có reset
  // mềm. Lý do đó ĐÚNG, nhưng tôi dời khi hệ ĐANG CHẠY — và từ lúc ấy
  // màn không lên hình lần nào nữa. Dời một sợi dây khỏi 3V3 (mức cao
  // tuyệt đối chắc chắn) sang một chân GPIO (phụ thuộc sợi dây ấy) là
  // đánh đổi độ tin cậy lấy sự đúng đắn về lý thuyết.
  //
  // Nguyên tắc bỏ quên: KHÔNG sửa thứ đang chạy để cho nó "đúng hơn".
  // Sửa xong rồi hỏng thì mất luôn cả mốc để lùi về.
  bus->sendCommand(0x01);   // SWRESET, tự gửi vì thư viện không gửi
  delay(150);
  auto* g = new Arduino_GC9A01(bus, GFX_NOT_DEFINED, 0, c.ips);
  g->begin(c.tocDo);
  veTinhRoiDung(g);
  xong = true;
}
