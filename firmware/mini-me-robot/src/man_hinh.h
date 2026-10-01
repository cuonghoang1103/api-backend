#pragma once
/**
 * ============================================================
 * BA MÀN, MỘT BUS — màn ngực + hai mắt
 * ============================================================
 *
 *   ngực   ILI9488 3.5" 480×320  ← bảng trạng thái, như tấm pin mặt
 *                                   trời trên ngực WALL-E thật
 *   mắt T  GC9A01  1.28" 240×240
 *   mắt P  GC9A01  1.28" 240×240
 *
 * Cả ba nối chung MOSI / SCLK / DC, mỗi con một chân CS riêng. Thư
 * viện tự kéo CS và tự bọc `beginTransaction/endTransaction`, nên ba
 * con nói chuyện xen kẽ trên cùng sợi dây mà không giẫm lên nhau.
 *
 * ── VÌ SAO KHÔNG DÙNG TFT_eSPI NỮA ──
 *
 * TFT_eSPI chốt LOẠI CHIP MÀN lúc biên dịch: một bản build chỉ nói
 * chuyện được với một driver. Muốn vừa ILI9488 vừa GC9A01 thì bắt buộc
 * phải có thư viện chọn driver lúc CHẠY — Arduino_GFX làm đúng việc đó
 * (mỗi màn là một đối tượng, driver nào cũng được).
 *
 * Giá phải trả: `main.cpp` và `face.cpp` đổi từ `TFT_eSPI` sang
 * `Arduino_GFX*`. Rất may hai thư viện cùng gốc Adafruit_GFX nên **tên
 * hàm giống hệt nhau** (`fillRect`, `setCursor`, `print`, `fillCircle`…);
 * chỉ `init()` đổi thành `begin(tốc độ)`.
 *
 * ── XUNG ĐỘT CHÂN ĐÃ SỬA (15/08/2026) ──
 *
 * GPIO 10 trước đây vừa là CS màn ngực vừa là `PIN_EYE_CS_L`. Hai con
 * màn cùng nghe một chân CS thì con nào cũng nhận mọi thứ gửi cho con
 * kia — và triệu chứng KHÔNG phải màn đen, mà là hai hình chồng nhau
 * nhấp nháy, rất dễ đổ cho nhiễu dây.
 *
 * Lấy lại GPIO 14 bằng cách nối RST màn ngực thẳng lên 3V3 và reset
 * bằng lệnh phần mềm — đúng cách hai con mắt vẫn làm. Bảng cuối:
 *
 *      ngực  CS 10   ·  mắt trái CS 9  ·  mắt phải CS 14
 *      chung MOSI 11 · SCLK 12 · DC 13
 *
 * ⚠️ PHẢI DỜI MỘT SỢI DÂY: chân RST của màn 3.5" đang cắm ở GPIO 14,
 * rút ra cắm sang 3V3.
 *
 * Không hỏng phần cứng nếu quên — GPIO 14 là MỘT đầu ra, còn RST của
 * màn ngực và CS của mắt phải đều là đầu VÀO, một đầu ra nuôi hai đầu
 * vào là chuyện bình thường. Hỏng ở chỗ CHỨC NĂNG: GPIO 14 nay bật/tắt
 * liên tục theo nhịp chọn chip, nên màn ngực bị RESET không ngừng và
 * không bao giờ kịp hiện gì.
 */

#include <Arduino_GFX_Library.h>

#include "config.h"
#include "mau.h"

namespace man_hinh {

// ⚠️ 20 MHz, KHÔNG PHẢI 40 — và đây là bài học đã có sẵn mà tôi quên áp.
//
// `test/platformio.ini` viết cho màn 3.5" từ trước: "20 MHz để bắt đầu:
// dây Dupont dài đủ sinh nhiễu ở tốc độ cao, BIỂU HIỆN LÀ MÀN HIỆN SỌC.
// Chạy được rồi hãy tăng dần." Tôi vẫn đặt 40 cho hai con mắt, và màn
// tròn đầu tiên cắm lên đúng là ra sọc (ảnh 15/08/2026).
//
// Chạy ổn định rồi thì tăng dần lên 27, rồi 40 — nhưng CHỈ sau khi đã
// nhìn thấy nó chạy sạch ở mức thấp. Bàn thử `mat-demo` có phím `f` để
// đổi tốc độ ngay lúc chạy, khỏi nạp lại.
// ⚠️ 4 MHz — CHẬM CÓ CHỦ ĐÍCH, đừng "tối ưu" lên mà chưa đo.
//
// Bo màn XY1.28YYFT-S7P có **1 kΩ mắc nối tiếp trên MỌI đường tín
// hiệu** (`R1–R5 = 102`, đọc từ mặt sau). Điện trở đó cùng điện dung
// dây làm tròn cạnh xung, và ở 10 MHz nó đã đủ để rơi bit.
//
// Triệu chứng của mất bit KHÔNG phải màn đen hay màn trắng, mà là ảnh
// bị KÉO XIÊN THÀNH SỌC CHÉO: mỗi hàng lệch thêm vài điểm ảnh so với
// hàng trước, cộng dồn qua 240 hàng.
//
// ⚠️ Và nó ẨN HOÀN TOÀN sau ô màu đặc — mọi điểm ảnh cùng màu thì lệch
// bao nhiêu cũng không ai thấy. Suốt 15/08/2026 chúng tôi kiểm bằng ô
// đặc, thấy "màu đổi đúng" và tưởng đường truyền tốt. Nó chỉ chứng
// minh LỆNH tới được chip, không chứng minh DỮ LIỆU tới nguyên vẹn.
//
// Muốn nâng tốc độ thì phải kiểm bằng HÌNH THẬT (con mắt), không bao
// giờ bằng ô màu đặc.
//
// ── 40 MHz, ĐO THẬT 23/08/2026 trên bo hshop + vỏ đã lắp ──
//
// Con số cũ là 4 MHz, hạ xuống 15/08 để né bo GC9A01 CŨ — con bo
// `XY1.28YYFT-S7P` có R1–R5 đều 1kΩ mắc NỐI TIẾP năm đường tín hiệu,
// cộng điện dung dây dupont thành bộ lọc thông thấp làm nhoè sườn xung.
// Bo hshop `1.28"TFT V1.0` KHÔNG có mấy con trở đó (ba con trở của nó
// nằm ở đường nguồn và mạch lái đèn nền), nên nó gánh được cao hơn hẳn.
//
// Đo bằng `-e mat-demo`, lệnh `f`, nhìn HÌNH MẮT THẬT chứ không ô đặc:
//
//      4 MHz →  41 vòng/giây · đỉnh 25,1 ms   ✗ vượt ngưỡng gấp 3
//     10 MHz →  94 vòng/giây · đỉnh 11,2 ms   ✗
//     20 MHz → 167 vòng/giây · đỉnh  6,5 ms   ✓ sạch, biên 1,5 ms
//     40 MHz → 271 vòng/giây · đỉnh  4,2 ms   ✓ sạch, biên 3,8 ms
//
// Ngưỡng là 8 ms: quá đó thì CPU không bơm kịp I2S và TIẾNG BẮT ĐẦU
// VẤP — xem `demo_mat.cpp`. Nên 4 MHz không chỉ chậm, nó vốn đã nằm
// ngoài mức chạy được cho robot vừa vẽ mắt vừa nói.
//
// Chọn 40 thay vì 20 vì biên rộng gấp đôi: lúc chạy `mini-me`, hai mắt
// còn chia bus với màn ngực, vẽ xong sớm bao nhiêu thì tiếng có thêm
// chừng ấy thời gian không bị vấp.
//
// ⚠️ Quay lại bo màn CŨ thì phải hạ về 4 MHz. Con số này gắn với BO,
// không phải với chip GC9A01.
// ⛔⛔ 24/08/2026 — HẠ VỀ 20 MHz. 40 MHz LÀM MÀN BỤNG RA SỌC.
//
// Phép đo 23/08 chạy bằng `-e mat-demo`, mà bàn thử đó CHỈ VẼ HAI MẮT
// GC9A01 — nó không đụng tới màn ngực. Tôi lấy kết quả "40 MHz sạch"
// rồi áp cho CẢ BA màn, trong khi màn ngực là ILI9488, chip khác hẳn,
// và bàn kiểm riêng của nó (`test/` env `test-ili9488`) vốn chạy 20 MHz.
//
// Kết quả: hai mắt vẽ đẹp ở 40 MHz, còn màn ngực đầy sọc dọc.
//
// Bài học: đo trên MỘT loại màn không kết luận được cho loại kia, dù
// chúng dùng chung một bus SPI. Muốn nâng riêng cho mắt thì phải tách
// `TOC_DO` thành hai hằng số — nhưng cả ba đang chia chung một bus nên
// tốc độ phải lấy theo con CHẬM NHẤT.
//
// 20 MHz vẫn dư: đo được 167 vòng/giây, đỉnh 6,5 ms, dưới ngưỡng 8 ms
// mà CPU cần để bơm kịp I2S.
// ⚠️ 27/08 — hạ tạm xuống 4 MHz để chẩn đoán vụ hai mắt tối, nay trả về
// 20 MHz. Thủ phạm KHÔNG phải tốc độ: mối xoắn trần chia `DC` cho ba màn
// chỉ ăn một lõi (màn ngực), hai lõi kia chạm hờ. Hàn xong là hết.
//
// Bài học: đo `DC` trên bo mắt ra 3,3V PHẲNG LÌ trong lúc SCK/SDA/CS đều
// có xung — chân im lìm giữa những chân đang chạy là chữ ký của MỘT SỢI
// ĐỨT, không phải của nhiễu hay tốc độ. Tôi đã đổi firmware ba lần
// (bỏ MISO, tắt init màn ngực, hạ tốc độ) trước khi chịu đi đo.
static constexpr int32_t TOC_DO = 20000000;

// ⚠️ HSPI (SPI3), KHÔNG phải bus mặc định. Bus mặc định của ESP32-S3
// dùng chân trùng GPIO 33–37 — vốn đã bị PSRAM octal của bản N16R8
// chiếm. Chọn nhầm thì `begin()` TREO CỨNG: không lỗi, không timeout,
// chỉ đứng im, và mất vài lần thử mới lần ra vì không có gì để bám.
inline SPIClass& bus() {
  static SPIClass s(HSPI);
  return s;
}

/**
 * ⚠️⚠️ TỰ GỬI LỆNH RESET MỀM — THƯ VIỆN KHÔNG LÀM, DÙ CHÚ THÍCH NÓI CÓ.
 *
 * `Arduino_GC9A01::tftInit()` (và cả ILI9488) viết thế này:
 *
 *     if (_rst != GFX_NOT_DEFINED) { ...xung reset phần cứng... }
 *     else { // Software Rest }        ← CHỈ LÀ CHÚ THÍCH, KHÔNG CÓ MÃ
 *
 * Thiết kế của mình nối cả ba dây RST lên 3V3 để tiết kiệm chân, tức
 * `_rst == GFX_NOT_DEFINED`, tức KHÔNG có reset nào hết — rồi chuỗi
 * khởi tạo được bắn vào một con màn đang ở trạng thái bất định.
 *
 * Lúc cắm điện lần đầu thì panel tự reset bên trong (POR) nên có khi
 * vẫn lên. Nhưng mỗi lần NẠP FIRMWARE, ESP32 khởi động lại còn màn thì
 * KHÔNG mất điện — nó giữ nguyên trạng thái cũ, và chuỗi khởi tạo
 * không ăn. Kết quả nhìn thấy: màn đầy sọc và vệt màu, y như hỏng.
 *
 * 0x01 là SWRESET của cả GC9A01 lẫn ILI9488; datasheet đòi chờ 120 ms
 * sau đó trước khi gửi lệnh tiếp.
 */
inline void resetMem(Arduino_DataBus* b) {
  b->begin(TOC_DO);
  b->sendCommand(0x01);
  delay(150);
}

/**
 * ⚠️ CHỈ BUS NÀY KHAI `MISO`, và nó phải được `begin()` TRƯỚC hai mắt.
 *
 * `SPIClass::begin()` của ESP32 thoát sớm nếu bus đã khởi tạo — lần gọi
 * ĐẦU TIÊN quyết định chân nào được gắn. Hai mắt khai `GFX_NOT_DEFINED`
 * cho MISO (bo GC9A01 không đưa chân ấy ra), nên nếu một trong hai chạy
 * trước thì MISO không bao giờ được gắn và phép hỏi ID im lặng thất bại.
 *
 * `batTatCa()` gọi `resetMem(busNguc())` đầu tiên đúng vì lý do này.
 */
inline Arduino_DataBus* busNguc() {
  // ⚠️ 27/08 CHIỀU — TẠM BỎ MISO. Xin đọc kỹ lý do.
  //
  // Bản trước khai MISO=PIN_TFT_MISO (GPIO 3) để hỏi ID chip. Ngay sau khi
  // deploy, hai màn mắt tắt ngóm dù `mat-demo` vẫn báo `3/3 khoi tao xong`
  // và chip vẫn chạy. Đèn nền mắt sáng (nguồn tới nơi), chỉ hình không ra.
  // Đo VCC ở mắt: 3,24V — đủ.
  //
  // Manh mối: ba màn dùng CHUNG một `SPIClass`. `SPIClass::begin()` của
  // ESP32 thoát sớm nếu bus đã khởi tạo, nên lần gọi ĐẦU TIÊN quyết định
  // chân nào được gắn — mà `batTatCa()` gọi `resetMem(busNguc())` trước
  // hai mắt. Kết quả: cả bus SPI dùng chung có MISO gắn vào GPIO 3.
  //
  // GPIO 3 trên ESP32-S3 là chân strapping và JTAG. Attach nó làm MISO
  // trong lúc bo màn kéo đường ấy có thể sinh tương tác mà tôi không
  // tính tới. Bỏ MISO khỏi đây là quay về đúng cấu hình đã chạy tốt
  // trước sáng nay.
  //
  // Cái giá: không hỏi được ID chip nữa. Không sao — phép hỏi ID hôm nay
  // đã trả về `FF FF FF FF` chứng tỏ đường MISO của bo màn không hoạt
  // động (nhiều khả năng con đệm 74x245 chạy một chiều), nên mất cũng
  // không mất gì thực sự.
  static Arduino_DataBus* b = new Arduino_HWSPI(PIN_TFT_DC, PIN_TFT_CS, PIN_TFT_SCLK,
                                                PIN_TFT_MOSI, GFX_NOT_DEFINED, &bus(), true);
  return b;
}
// ⚠️ Mỗi mắt dùng chân `DC` RIÊNG (xem chú thích ở `config.h`). Chỉ
// `SCLK` và `MOSI` là chung — đó là bản chất bus SPI, không tách được.
inline Arduino_DataBus* busMatTrai() {
  static Arduino_DataBus* b = new Arduino_HWSPI(PIN_EYE_DC_L, PIN_EYE_CS_L, PIN_TFT_SCLK,
                                                PIN_TFT_MOSI, GFX_NOT_DEFINED, &bus(), true);
  return b;
}
inline Arduino_DataBus* busMatPhai() {
  static Arduino_DataBus* b = new Arduino_HWSPI(PIN_EYE_DC_R, PIN_EYE_CS_R, PIN_TFT_SCLK,
                                                PIN_TFT_MOSI, GFX_NOT_DEFINED, &bus(), true);
  return b;
}


inline Arduino_GFX* nguc() {
  Arduino_DataBus* b = busNguc();
  /**
   * ── BO MỚI: `ST7796U`, thay `ILI9488` đã cháy 26/08 ──
   *
   * Hai khác biệt so với lớp cũ, cả hai đều là nâng cấp:
   *
   * 1. **RST THẬT** (`PIN_TFT_RST`) thay cho `GFX_NOT_DEFINED`. Thư viện
   *    tự phát xung reset phần cứng, nên không còn phụ thuộc vào việc
   *    đường 3V3 có đủ vững để giữ chân RST cao hay không — đúng cái đã
   *    làm màn trắng suốt hai ngày.
   *
   * 2. **`Arduino_ST7796` gửi RGB565** (`COLMOD 0x55`, 2 byte/điểm),
   *    trong khi `Arduino_ILI9488_18bit` buộc phải gửi 18 bit (3 byte).
   *    Cùng 480×320 nhưng ít hơn một phần ba dữ liệu: 307 KB thay vì
   *    460 KB mỗi khung. Đó là lý do màn mới nhanh hơn, không phải vì
   *    chip chạy nhanh hơn.
   *
   *    Muốn 262k màu như bo cũ thì đổi `0x55` thành `0x66` trong
   *    `Arduino_ST7796.h` — thư viện để sẵn trong chú thích. Đổi lại
   *    màn vẽ chậm hơn một phần ba.
   *
   * ⚠️ HƯỚNG 1, KHÔNG PHẢI 3 — và đừng chép số này từ driver khác.
   *
   * Bo `ILI9488` cũ cần hướng **3** (đo thật 25/08: hướng 1 cho hình
   * ngược lên trên). Tôi chép thẳng con số đó sang `ST7796` và hình lại
   * ra ngược — đo thật 27/08.
   *
   * Lý do: mỗi driver tự đặt thanh ghi `MADCTL` theo cách riêng, nên
   * "hướng 3" của lớp này không phải "hướng 3" của lớp kia. Con số này
   * gắn với CẶP (driver + cách bắt màn vào vỏ), không mang từ chip này
   * sang chip khác được — kể cả khi màn nằm y nguyên chỗ cũ.
   *
   * Cờ IPS thì giữ: sai nó thì `fillScreen(0)` — lệnh tô ĐEN — lại ra
   * màn TRẮNG, và đó là một buổi chiều đi tìm nhầm chỗ.
   */
  static Arduino_TFT* g = new Arduino_ST7796(b, PIN_TFT_RST, 1, true /* IPS */);
  return g;
}

/**
 * Cùng con màn ngực, nhưng kiểu `Arduino_TFT*`.
 *
 * `eyes` cần `writeAddrWindow()` để đẩy từng dải 240×24, mà hàm đó chỉ có
 * ở lớp TFT. `Arduino_ST7796` kế thừa `Arduino_TFT` nên ép xuống là đúng
 * kiểu thật của đối tượng, không phải đoán.
 */
inline Arduino_TFT* ngucTft() { return static_cast<Arduino_TFT*>(nguc()); }

inline Arduino_TFT* matTrai() {
  Arduino_DataBus* b = busMatTrai();
  static Arduino_TFT* g = new Arduino_GC9A01(b, GFX_NOT_DEFINED, 0, true /* IPS */);
  return g;
}

/** Trả nullptr khi mắt phải chưa có chân CS — robot chạy một mắt vẫn được. */
inline Arduino_TFT* matPhai() {
  if (PIN_EYE_CS_R < 0) return nullptr;
  Arduino_DataBus* b = busMatPhai();
  static Arduino_TFT* g = new Arduino_GC9A01(b, GFX_NOT_DEFINED, 0, true /* IPS */);
  return g;
}

/**
 * Bật cả ba màn. Trả về số màn `begin()` thành công.
 *
 * ⚠️ `begin()` của Arduino_GFX gần như KHÔNG BAO GIỜ trả false — chân
 * MISO để trống nên không đọc được ID chip, tức là nó không có cách
 * nào biết đầu kia có gì. Trả về 3 chỉ chứng minh đã gửi xong chuỗi
 * lệnh khởi tạo, KHÔNG chứng minh màn nào đang sống. Bằng chứng thật
 * duy nhất là nhìn vào kính.
 */
inline int batTatCa() {
  int ok = 0;
  // Reset mềm TỪNG CON trước khi khởi tạo — thư viện không tự làm.
  // Reset mềm phòng hờ — thư viện nay đã có chân RST thật nên nó tự
  // phát xung phần cứng, nhưng gửi thêm 0x01 không hại gì.
#if MAT_TREN_NGUC
  // ── MỘT MÀN DUY NHẤT ──
  //
  // Hai màn tròn KHÔNG được chạm tới: không reset, không khởi tạo, không
  // tạo cả đối tượng bus của chúng. Cắm hay rút chúng ra cũng không đổi
  // gì — nhưng tốt nhất là RÚT, để bus SPI chỉ còn đúng một thiết bị.
  resetMem(busNguc());
  if (nguc()->begin(TOC_DO)) ok++;
  nguc()->fillScreen(0);
  return ok;
#endif
#if CO_MAN_NGUC
  resetMem(busNguc());
#endif
  resetMem(busMatTrai());
  if (PIN_EYE_CS_R >= 0) resetMem(busMatPhai());
  for (Arduino_GFX* g : {
#if CO_MAN_NGUC
           (Arduino_GFX*)nguc(),
#endif
           (Arduino_GFX*)matTrai(), (Arduino_GFX*)matPhai()}) {
    if (!g) continue;
    if (g->begin(TOC_DO)) ok++;
    g->fillScreen(0);
  }
  return ok;
}

}  // namespace man_hinh
