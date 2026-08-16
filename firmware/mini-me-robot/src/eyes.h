#pragma once
/**
 * ============================================================
 * Mini-Me Robot — HAI MẮT trên 2 màn tròn GC9A01 240×240
 * ============================================================
 *
 * Đây là bộ mắt thật của WALL-E: hai ống mắt rời, mỗi ống một màn tròn
 * 1.28". Khác hẳn `face.cpp` — bản đó vẽ nguyên khuôn mặt (mắt + miệng
 * + lông mày) lên MỘT màn chữ nhật 3.5" ILI9488. Hai bản không chạy
 * cùng lúc được: TFT_eSPI chọn driver lúc BIÊN DỊCH, một bản build chỉ
 * nói chuyện được với một loại chip màn. Xem `[env:mini-me-eyes]` trong
 * platformio.ini.
 *
 * ── VÌ SAO PHẢI CHIA LÁT THỜI GIAN ──
 *
 * ⚠️⚠️ ĐÂY LÀ RÀNG BUỘC QUAN TRỌNG NHẤT CỦA CẢ FILE NÀY.
 *
 * `main.cpp` bơm I2S ngay trong `loop()`, không có tác vụ riêng. Đệm
 * DMA của loa chỉ giữ được **128 ms** tiếng. Hàm vẽ nào giữ CPU lâu
 * hơn thế là loa đói đệm, và người dùng nghe thấy NGAY một nhịp vấp.
 *
 * Bản 3.5" đã đụng đúng chuyện này và xử bằng cách **ngừng vẽ mặt khi
 * đang nói** (`if (!audio::speaking())` trong main.cpp). Với một khuôn
 * mặt tĩnh thì chấp nhận được. Với WALL-E thì KHÔNG: lúc nó nói chính
 * là lúc người ta nhìn vào mắt nó nhiều nhất, mà mắt lại đứng hình.
 *
 * Nên bộ này không vẽ cả khung hình trong một lần. Nó vẽ theo **DẢI
 * NGANG 24 hàng**, mỗi lần `loop()` chỉ đẩy vài dải rồi trả CPU lại.
 * Một dải = 11.520 byte = ~2,3 ms ở 40 MHz. Cả khung 240×240 hai mắt
 * là 20 dải ≈ 56 ms, nhưng chia thành 20 khúc ngắn xen kẽ với việc bơm
 * I2S, nên tiếng KHÔNG vấp và mắt vẫn sống trong lúc đang nói.
 *
 * Đổi lại: `loop()` phải được gọi thường xuyên. Gọi thưa thì mắt chậm
 * chứ không hỏng.
 *
 * ── VÌ SAO KHÔNG DÙNG SPRITE CẢ MÀN ──
 *
 * 240×240×16 bit = 115 KB mỗi mắt. Hai mắt là 230 KB RAM trong, trong
 * khi bo còn ~300 KB sau WiFi + I2S — và cái quyết định không phải
 * tổng còn trống mà là KHỐI LIỀN MẠCH lớn nhất (xem nhịp chẩn đoán
 * `khoi=` trong main.cpp). Sprite một dải chỉ tốn 11,5 KB, xin được
 * kể cả lúc heap đã vụn.
 *
 * ── HAI MÀN CHUNG MỘT BUS ──
 *
 * SCLK/MOSI/DC đi chung, chỉ CS riêng. TFT_eSPI biên dịch với
 * `-DTFT_CS=-1` để nó KHÔNG tự đụng vào chân CS, còn file này tự kéo
 * CS xuống trước khi đẩy. Lúc khởi tạo thì kéo CẢ HAI xuống một lượt —
 * hai màn nhận cùng chuỗi lệnh khởi tạo, xong trong một lần.
 */

#include <Arduino.h>
#include <Arduino_GFX_Library.h>

namespace eyes {

/**
 * Mười biểu cảm đầu là đúng bộ mà server gửi xuống
 * (`commands.ts`: neutral|happy|sad|angry|surprised|sleepy|love|
 * thinking|confused|wink) — KHÔNG được đổi thứ tự hay bỏ cái nào.
 *
 * Từ LISTENING trở đi là trạng thái máy và biểu cảm mở rộng: server
 * chưa gửi tên chúng, nhưng `setByName()` nhận hết, nên thêm vào bảng
 * bên server là dùng được ngay, khỏi sửa firmware.
 */
enum Expr : uint8_t {
  NEUTRAL = 0,
  HAPPY,
  SAD,
  ANGRY,
  SURPRISED,
  SLEEPY,
  LOVE,
  THINKING,
  CONFUSED,
  WINK,

  // ── Trạng thái máy ──
  LISTENING,   // đang nghe bạn nói — mống nở, viền sáng chạy vòng
  SPEAKING,    // đang nói — đồng tử nảy theo biên độ tiếng
  SCANNING,    // quét môi trường — vạch sáng chạy dọc như máy quét
  CHARGING,    // đang sạc
  BOOTING,     // vừa bật — mống mở dần như khẩu độ máy ảnh
  ERROR,       // hỏng — nhiễu sọc
  LOWBAT,      // sắp hết pin — mống tối dần rồi chớp
  OFF,         // tắt hẳn, màn đen

  // ── Biểu cảm mở rộng ──
  CURIOUS,     // tò mò — một mắt nheo, đầu nghiêng
  SCARED,      // sợ — mống co tí xíu, mắt mở to, rung
  DIZZY,       // choáng — xoáy ốc
  SUSPICIOUS,  // nghi ngờ — hai mí khép hẹp, liếc ngang
  EXCITED,     // phấn khích — mắt hình ngôi sao
  BORED,       // chán — mí sụp một nửa, mắt trôi
  SHY,         // ngại — nhìn xuống, mí trên sụp
  PROUD,       // tự hào — mí dưới nâng, mống sáng
  ANNOYED,     // khó chịu — một mí sụp lệch
  SLEEPING,    // ngủ — mắt nhắm, thở chậm

  _COUNT
};

/**
 * Nhận hai màn ĐÃ `begin()` sẵn, xin khung nhớ dải, rồi chạy.
 *
 * ⚠️ KHÔNG tự tạo màn, vì cả ba màn của robot (ngực + hai mắt) dùng
 * CHUNG một bus SPI và phải được dựng cùng chỗ — xem `man_hinh.h`.
 * Mắt tự tạo màn riêng thì nó sẽ gọi `SPI.begin()` lần thứ hai với
 * bộ chân khác, và con màn ngực im lặng ngừng nhận lệnh.
 *
 * Gọi SAU `Serial.begin()`: nó in ra lượng RAM đã xin, và đó là con số
 * đầu tiên cần nhìn khi mắt không lên hình.
 */
bool begin(Arduino_TFT* matTrai, Arduino_TFT* matPhai);

/**
 * Đường ĐẨY KHỐI cho mỗi mắt — bắt buộc phải truyền, không suy ra được
 * từ `Arduino_GFX*`.
 *
 * ⚠️⚠️ VÌ SAO KHÔNG DÙNG `draw16bitRGBBitmap()`. Đọc kỹ, đây là bẫy.
 *
 * Tên hàm nghe như "đẩy một khối ảnh", nhưng trong Arduino_GFX 1.4.9
 * nó là **vòng lặp gọi `writePixel()` cho TỪNG ĐIỂM ẢNH** — cả hai bản
 * nạp chồng, const lẫn không const. Mỗi điểm ảnh kéo theo một lần đặt
 * cửa sổ địa chỉ (4 lệnh + 8 byte dữ liệu) rồi mới tới 2 byte màu.
 *
 * Một dải 240×24 = 5.760 điểm ảnh → khoảng **57.600 byte lệnh** thay
 * vì 11.520 byte dữ liệu thuần. Gấp năm lần lưu lượng, và quan trọng
 * hơn: gấp năm lần cơ hội rơi bit trên một đường dây vốn đã có 1 kΩ
 * nối tiếp. Cửa sổ địa chỉ mà hỏng một bit thì điểm ảnh rơi sai chỗ —
 * và đó chính là những vệt SỌC CHÉO đã thấy ngày 15/08/2026.
 *
 * Vì sao `fillScreen()` vẫn sạch: nó đi đường `writeRepeat()`, đặt cửa
 * sổ MỘT lần rồi bơm màu. Đúng cái ta cần, và đúng lý do ô màu đặc
 * suốt buổi tối trông ổn trong khi hình thật thì nát.
 */
void setBus(Arduino_DataBus* busTrai, Arduino_DataBus* busPhai);

/**
 * Gọi mỗi vòng `loop()`. Tự chia lát: làm việc tối đa `budgetUs` micro
 * giây rồi trả CPU lại, dù khung hình chưa xong.
 *
 * ⚠️ 4000 µs là mức đã cân với đệm DMA 128 ms của loa. Nâng lên thì
 * mắt mượt hơn nhưng tiếng bắt đầu vấp; hạ xuống thì tiếng an toàn
 * hơn mà mắt giật. Đo lại bằng `hutDem` trong telemetry nếu chỉnh.
 */
void loop(uint32_t budgetUs = 4000);

/** Đổi biểu cảm. `ms` = 0 nghĩa là giữ tới lệnh sau. */
void set(Expr e, uint32_t ms = 0);

/** Đặt theo tên server gửi xuống ("happy", "sleepy"…). Tên lạ → bỏ qua. */
void setByName(const char* name, uint32_t ms = 0);

/** Biểu cảm nền — hết hạn thì quay về đây. Mặc định NEUTRAL. */
void setBase(Expr e);

/** Hướng nhìn, -1..1 mỗi trục. (0,0) là nhìn thẳng. */
void look(float x, float y);

/** Chớp `lan` cái liên tiếp. Chèn ngay, không đợi nhịp chớp tự động. */
void blink(uint8_t lan = 1);

/** Nháy MỘT mắt. */
void wink(bool matTrai = true);

/**
 * Biên độ tiếng đang phát, thang 24 bit như `audio::level()`.
 *
 * Đồng tử nở theo nó, nên mắt "nói" cùng nhịp với loa. Truyền 0 khi im.
 */
void setLevel(int32_t mucAm);

/** Chấm trạng thái nhỏ ở rìa dưới mắt phải: WiFi + server. */
void setStatus(bool wifiOk, bool serverOk);

/**
 * Phần trăm pin. -1 = giấu hẳn.
 *
 * Giấu chứ không hiện 0% khi chưa hàn bộ chia áp — một con số bịa tệ
 * hơn không có số, vì người ta sẽ tin nó. Cùng lý do với
 * `BAT_DIVIDER_FITTED` trong config.h.
 */
void setBattery(int pct);

/** Bật/tắt màn. Tắt = đen hẳn, không vẽ nữa (tiết kiệm điện lúc ngủ). */
void power(bool on);

/** Ép vẽ lại toàn bộ khung hình tiếp theo. */
void invalidate();

Expr current();

/** Tên tiếng Anh của biểu cảm đang chạy — để in log. */
const char* currentName();

}  // namespace eyes
