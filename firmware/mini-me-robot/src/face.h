#pragma once
/**
 * ============================================================
 * Mini-Me Robot — khuôn mặt trên màn NGỰC 3.5"
 * ============================================================
 *
 * Vẽ mặt chiếm trọn màn 480×320, đủ 10 biểu cảm mà hệ lệnh đã khai
 * báo: neutral · happy · sad · angry · surprised · sleepy · love ·
 * thinking · confused · wink.
 *
 * Vì sao vẽ bằng hình khối thay vì ảnh bitmap: mười biểu cảm × 480×320
 * × 16 bit là 3 MB ảnh, mà flash còn trống 5,6 MB và còn phải chừa
 * cho OTA. Vẽ bằng hình khối tốn vài KB, đổi được cỡ mắt và độ cong
 * miệng theo tham số, và pha trộn được — nheo mắt lúc đang vui chẳng
 * hạn.
 *
 * Hai thứ làm mặt "sống" mà không tốn gì:
 *   - CHỚP MẮT ngẫu nhiên 3-6 giây một lần
 *   - Con ngươi đảo nhẹ khi đứng yên
 * Thiếu hai cái đó thì nó là hình vẽ, không phải khuôn mặt.
 */

#include <Arduino.h>
#include <Arduino_GFX_Library.h>

#include "mau.h"

namespace face {

enum Emotion : uint8_t {
  NEUTRAL,
  HAPPY,
  SAD,
  ANGRY,
  SURPRISED,
  SLEEPY,
  LOVE,
  THINKING,
  CONFUSED,
  WINK,
  // Trạng thái máy, không phải cảm xúc — nhưng hiện lên cùng chỗ.
  LISTENING,
  SPEAKING,
};

void begin(Arduino_GFX* tft);

/**
 * Chế độ CHỈ VẼ DẢI DƯỚI (đồng hồ · NGHE/NGHĨ/NÓI · pin), bắt đầu từ
 * hàng `yDai` tới đáy màn. Dùng khi hai mắt `eyes` vẽ lên chính màn này
 * (`MAT_TREN_NGUC`). Mọi API khác giữ nguyên và vẫn chuyển xuống `eyes`.
 */
void beginDai(Arduino_GFX* tft, int yDai);

/**
 * Hiện "AM LUONG 35%" + thanh ngang ở ô giữa dải dưới trong 1,5 giây,
 * rồi tự trả về nhãn trạng thái. Chỉ có ở chế độ dải.
 */
void hienAmLuong(int pct);

/**
 * Lời dặn trên nhãn NGHE (01/10/2026). Ở quán, robot không tự biết khi nào
 * người ta nói xong (xem `nenCao` trong audio.cpp), nên nhãn phải nói cách
 * báo "xong rồi" — không thì chẳng ai đoán ra.
 */
enum KieuNghe : uint8_t {
  NGHE_TU_DO = 0,   // "DANG NGHE"       — VAD tự mở, tự dứt
  NGHE_CHAM = 1,    // "CHAM LAI DE GUI" — mở bằng một cú chạm
  NGHE_GIU = 2,     // "THA TAY DE GUI"  — đang giữ dải để nói
};
void datNhanNghe(KieuNghe k);

/**
 * TRẠNG THÁI của robot cho dải dưới (01/10/2026) — tách khỏi CẢM XÚC.
 *
 * ⚠️ Bản trước suy nhãn từ biểu cảm của mắt: LISTENING → "DANG NGHE"…
 * Từ khi mỗi câu trả lời kèm một cảm xúc (happy, love…), lúc robot đang
 * nói thì mắt là HAPPY chứ không phải SPEAKING — và nhãn rơi vào nhánh
 * mặc định "CHAM DE NOI". Người dùng thấy robot đang nói mà màn bảo
 * "chạm để nói". Mắt chở CẢM XÚC, dải chở TRẠNG THÁI — hai thứ khác nhau.
 *
 * `main.cpp` gọi mỗi vòng loop; chỉ vẽ lại khi đổi.
 */
enum TrangThai : uint8_t { RANH, NGHE, NGHI, NOI };
void datTrangThai(TrangThai t);

/** Mức tiếng cho vạch sóng cạnh nhãn — mic lúc nghe, loa lúc nói (thang 24 bit). */
void datMuc(int32_t muc);

/** Robot đang ngủ (xem songDong) — lúc rảnh dải ghi "ĐANG NGỦ" thay cho
 *  "CHẠM ĐỂ NÓI", màu tối hơn. */
void datNgu(bool ngu);

/**
 * Phụ đề dòng dưới, UTF-8 có dấu. `nguoiDung` = câu robot NGHE được
 * (hiện "Bạn: …", màu xám); không thì là câu robot đang NÓI (màu trắng).
 * Dài quá một dòng thì tự lật trang theo nhịp đọc. `nullptr`/"" = xoá.
 */
void phuDe(const char* utf8, bool nguoiDung = false);

/** Đổi biểu cảm. `ms` = 0 nghĩa là giữ mãi tới lệnh sau. */
void set(Emotion e, uint32_t ms = 0);

/** Đặt theo tên mà server gửi xuống ("happy", "sleepy"…). */
void setByName(const char* name, uint32_t ms = 0);

/** Hướng nhìn của con ngươi, -1..1 mỗi trục. */
void look(float x, float y);

/** Gọi mỗi vòng loop(): lo chớp mắt, đảo mắt, và hết hạn biểu cảm. */
void loop();

/** Chấm trạng thái nhỏ ở góc — thay cho cả bảng chữ của chặng A. */
void setStatus(bool wifiOk, bool serverOk);

/**
 * Đồng hồ ở góc trên trái, dạng "HH:MM".
 *
 * Truyền chuỗi rỗng để tắt (lúc chưa đồng bộ được giờ). Vẽ lại chỉ khi
 * chuỗi ĐỔI — màn ILI9488 nối SPI vẽ chậm, mà vòng loop() còn phải bơm
 * I2S 16.000 mẫu mỗi giây; vẽ lại mỗi vòng là tiếng bị vấp.
 */
void setClock(const char* hhmm);

/**
 * Phần trăm pin cạnh đồng hồ. Truyền -1 để giấu hẳn.
 *
 * Giấu chứ không hiện "0%" khi chưa cắm bộ chia áp: một con số sai còn
 * tệ hơn không có số, vì người ta sẽ tin nó.
 */
void setBattery(int pct);

Emotion current();
/** Biểu cảm NỀN (cái `current()` trả về khi hết biểu cảm tạm). */
Emotion base();

}  // namespace face
