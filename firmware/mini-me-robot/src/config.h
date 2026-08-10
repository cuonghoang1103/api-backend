#pragma once
// ============================================================
// Mini-Me Robot — pin map & tunables
// ============================================================
//
// ⚠️ ESP32-S3-DevKitC-1 (N16R8) pin constraints. Getting these wrong
// costs an evening of "why does it reboot at random":
//
//   GPIO 26–32  SPI flash            — NEVER usable
//   GPIO 33–37  OCTAL PSRAM (R8)     — NEVER usable on this variant.
//                                      They ARE free on quad-PSRAM
//                                      boards, which is why every
//                                      tutorial using them "works"
//                                      for someone else.
//   GPIO 19/20  USB D−/D+            — using them kills the USB port
//   GPIO 0/3/45/46  strapping        — sampled at boot; safe as
//                                      outputs/ADC, risky if something
//                                      pulls them at power-up
//
// Everything below stays clear of all of that.

// ─── Nghe: I2S0 ← INMP441 ─────────────────────────────────
#define PIN_MIC_SCK      4
#define PIN_MIC_WS       5
#define PIN_MIC_SD       6
#define MIC_SAMPLE_RATE  16000   // what Whisper wants; higher is wasted bandwidth

// ─── Nói: I2S1 → MAX98357A ────────────────────────────────
#define PIN_AMP_BCLK     15
#define PIN_AMP_LRC      16
#define PIN_AMP_DIN      7

// ─── Mắt: SPI ×2 GC9A01 ───────────────────────────────────
// SCLK/MOSI/DC are shared (see platformio.ini build flags); only the
// chip-selects differ, so two displays cost one extra GPIO.
#define PIN_EYE_SCLK     12
#define PIN_EYE_MOSI     11
#define PIN_EYE_DC       13
#define PIN_EYE_CS_L     10
#define PIN_EYE_CS_R     9
// RST tied to 3V3 — reset in software instead, saves a pin.

// ─── Cảm biến: I2C (MPU6050 0x68 + VL53L0X 0x29) ──────────
#define PIN_I2C_SDA      8
#define PIN_I2C_SCL      18

// ─── Động cơ: DRV8833 ─────────────────────────────────────
#define PIN_MOTOR_AIN1   39
#define PIN_MOTOR_AIN2   40
#define PIN_MOTOR_BIN1   41
#define PIN_MOTOR_BIN2   42
// nSLEEP tied to 3V3 = always awake.

// ─── Encoder (1 kênh mỗi bánh — chiều quay đã biết) ───────
#define PIN_ENC_L        47
#define PIN_ENC_R        48
#define ENCODER_TICKS_PER_REV 374   // 11 xung × tỉ số truyền 34

// ─── Phụ trợ ──────────────────────────────────────────────
#define PIN_LED_RING     21
#define LED_RING_COUNT   16
#define PIN_TOUCH_HEAD   14
#define PIN_CLIFF_L      1
#define PIN_CLIFF_R      2
#define PIN_BATTERY_ADC  3      // qua chia áp 100k/47k
// GPIO38 và GPIO45 CÒN TRỐNG — servo đã chuyển hết sang PCA9685.

// ─── Servo qua PCA9685 (I2C 0x40) ─────────────────────────
// Sáu servo: 2 cổ + 4 tay (mỗi tay vai + khuỷu). Điều thẳng từ GPIO
// thì xung PWM lệch mỗi khi WiFi/I2S chen vào — mắt thường thấy rõ
// cái giật, nhất là lúc tay đang giơ giữa chừng. PCA9685 phát xung
// bằng phần cứng riêng nên đều tuyệt đối, và trả lại 6 chân GPIO.
#define PCA9685_ADDR     0x40
#define SERVO_FREQ_HZ    50

#define CH_NECK_PAN      0
#define CH_NECK_TILT     1
#define CH_ARM_L_SHOULDER 2
#define CH_ARM_L_ELBOW   3
#define CH_ARM_R_SHOULDER 4
#define CH_ARM_R_ELBOW   5

// Giới hạn cơ khí. Khuỷu chỉ gập MỘT chiều — cho nó vượt 0° là đẩy
// cẳng tay vào cánh tay trên, servo kẹt cứng rồi cháy trong ~1 phút.
// Nếu lắp xong thấy đụng sớm hơn, nới ELBOW_MIN lên -100.
#define NECK_PAN_MIN     -90
#define NECK_PAN_MAX      90
#define NECK_TILT_MIN    -35
#define NECK_TILT_MAX     35
#define SHOULDER_MIN     -90
#define SHOULDER_MAX      90
#define ELBOW_MIN       -120
#define ELBOW_MAX          0

// ─── Điện ─────────────────────────────────────────────────
// Chia áp 100k/47k: 8.4V → 2.68V, nằm gọn dưới trần 3.3V của ADC.
#define BATTERY_DIVIDER  3.128f
#define BATTERY_FULL_MV  8400
#define BATTERY_EMPTY_MV 6000

// ─── An toàn ──────────────────────────────────────────────
// Nằm trong FIRMWARE, không phải trên server: mất mạng thì robot
// phải tự dừng, không được chạy tiếp theo lệnh cuối cùng nhận được.
#define MOTION_WATCHDOG_MS   500   // không có lệnh mới → cắt động cơ
#define OBSTACLE_STOP_MM     120   // phanh khi laser báo gần hơn mức này
#define MAX_MOTOR_DUTY       255

// ─── Mạng ─────────────────────────────────────────────────
#define WS_RECONNECT_BASE_MS 3000
#define WS_RECONNECT_MAX_MS  30000
#define TELEMETRY_INTERVAL_MS 1000
#define HEARTBEAT_TIMEOUT_MS  90000  // 3 lần ping của server bị lỡ

// ─── Âm thanh ─────────────────────────────────────────────
//
// ⚠️ MỌI CON SỐ DƯỚI ĐÂY GẮN CHẶT VỚI MỘT PHÉP DỊCH BIT. Đọc kỹ
// đoạn này trước khi chỉnh, nếu không sẽ chỉnh mò.
//
// INMP441 là mic I2S 24 bit. Bo đọc về từ mỗi khe 32 bit, mẫu nằm ở
// 24 bit CAO (bit 31..8), 8 bit thấp là số 0. Từ đó có hai thang:
//
//   raw >> 8   → thang 24 bit, biên độ ±8.388.608   ← VAD dùng thang này
//   raw >> 13  → thang gửi đi, đã khuếch đại 8 lần  ← gửi lên server
//
// Số đo THẬT trên đúng con mic này, 10/08/2026, nói cách ~30 cm
// (thang 24 bit): nền phòng yên **1200** · nói bình thường **9000** ·
// đỉnh **539466**. Ngưỡng 2800 nằm gọn giữa nền và tiếng nói — cao
// gấp đôi nền nên quạt/gõ bàn không kích, thấp hơn tiếng nói nhiều
// lần nên không sót câu.
#define VAD_THRESHOLD        2800   // thang 24 bit (raw >> 8), đo thật

// Ngưỡng = nền × hệ số này. ×3 vẫn để lọt tiếng phòng (đo trên server
// 10/08: 30 lượt/phút toàn tiếng động), ×4 thì tiếng nói bình thường
// vẫn vượt thoải mái vì giọng cách 30 cm cao gấp 6-8 lần nền.
#define VAD_GATE_MULT        4

// Bộ đếm RỈ phải đạt bấy nhiêu mới mở lượt nghe (mỗi khối 16 ms).
// Tăng khi to, giảm khi nhỏ — xem chú thích trong audio.cpp.
//
// 5 chứ không phải 8: bắt 8 thì mic "không nhạy, nói 2-3 lần mới
// nghe", vì tiếng Việt có khoảng lặng giữa các âm tiết và phụ âm đầu
// gần như im. 5 khối vẫn loại được tiếng gõ bàn (chỉ to một hai khối
// rồi tắt hẳn nên bộ đếm rỉ hết trước khi chạm ngưỡng).
#define VAD_OPEN_BLOCKS      5
// Im lặng bấy nhiêu = hết lượt nói. 650 chứ không 800: đây là thời
// gian CHẾT cộng thẳng vào mỗi lượt, người dùng cảm nhận nó y hệt độ
// trễ của server. Dưới 600 thì bắt đầu cắt ngang lúc người ta ngập
// ngừng giữa câu.
#define VAD_SILENCE_MS       650
#define VAD_MAX_TURN_MS      15000
#define VAD_COOLDOWN_MS      300    // vừa dứt lượt, đừng kích lại ngay

// Khuếch đại lúc chuyển sang int16 gửi đi. Đỉnh 539466 ở thang 24 bit
// chia 32 còn 16858 — vừa đủ to cho Whisper mà còn thừa chỗ trước khi
// chạm trần 32767. Để nguyên `raw >> 16` (khuếch đại 1 lần) thì tiếng
// nói chỉ còn biên độ ~35, Whisper nghe ra im lặng.
#define MIC_GAIN_SHIFT       13
#define AUDIO_BLOCK_SAMPLES  256    // 16 ms mỗi khối @16 kHz

// Đệm trước: lúc VAD nhận ra "có người nói" thì âm đầu ĐÃ trôi qua
// rồi. Giữ sẵn 320 ms gần nhất và gửi kèm khi mở lượt, nếu không
// Whisper mất chữ đầu tiên của mọi câu.
#define AUDIO_PREROLL_BLOCKS 20

// Đệm phát trong PSRAM: 512 KB = 16 giây tiếng @16 kHz 16 bit mono.
// Một câu trả lời thường 3–5 giây, nên đây là mức dư thoải mái.
#define AUDIO_PLAY_BUF_BYTES (512 * 1024)

// Nói xong thì đợi tiếng vang trong phòng tắt hẳn rồi hãy nghe lại.
// Không có quãng này thì robot nghe thấy chính nó và tự nói chuyện
// với mình đến hết pin.
#define MIC_RESUME_DELAY_MS  250
