#pragma once
/**
 * ============================================================
 * Mini-Me Robot — khuôn mặt trên màn 3.5"
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
#include <TFT_eSPI.h>

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

void begin(TFT_eSPI* tft);

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

}  // namespace face
