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
#define PIN_SERVO_PAN    38
#define PIN_SERVO_TILT   45

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
#define WS_RECONNECT_BASE_MS 1000
#define WS_RECONNECT_MAX_MS  30000
#define TELEMETRY_INTERVAL_MS 1000
#define HEARTBEAT_TIMEOUT_MS  90000  // 3 lần ping của server bị lỡ

// ─── Âm thanh ─────────────────────────────────────────────
// Ngưỡng VAD: chỉ gửi lên server khi thực sự có người nói. Gửi liên
// tục tốn 32 KB/s cả ngày và làm cạn pin trong khoảng hai tiếng.
#define VAD_THRESHOLD        1800
#define VAD_SILENCE_MS       800    // im lặng bấy nhiêu = hết lượt nói
#define VAD_MAX_TURN_MS      15000
#define AUDIO_CHUNK_SAMPLES  512
