#include "banh_xe.h"
#include "config.h"
#include <Wire.h>

namespace banhXe {

// ════════════════════════════════════════════════════════════
// Đấu dây IBT-2
// ════════════════════════════════════════════════════════════
//
// Mỗi mạch IBT-2 có 4 chân điều khiển: RPWM · LPWM · R_EN · L_EN.
//
// ⛔ `R_EN` và `L_EN` của CẢ HAI mạch nối chung vào **3V3**, không tốn
//    chân nào. Chúng chỉ là cho phép chạy, không cần điều khiển.
//
// ⛔ Chân `VCC` của IBT-2 cũng lấy **3V3**, KHÔNG phải 5V.
//    Mạch có con đệm 74HC244; ngưỡng nhận mức cao của họ HC là
//    0,7 × VCC. Cấp 5V thì ngưỡng thành 3,5V, mà ESP32-S3 chỉ ra 3,3V
//    — THẤP HƠN NGƯỠNG. Nó sẽ lúc ăn lúc không, hoặc chạy được ở bàn
//    rồi chết khi nóng lên. Cấp 3V3 thì ngưỡng còn 2,31V, dư thoải mái.
//
// Bốn chân PWM dùng lại đúng chân đã khai cho DRV8833 trong config.h —
// cùng số lượng, cùng chức năng, chỉ khác tên gọi trên mạch.
static constexpr int PIN_TRAI_TIEN = PIN_MOTOR_AIN1; // RPWM bánh trái
static constexpr int PIN_TRAI_LUI  = PIN_MOTOR_AIN2; // LPWM bánh trái
static constexpr int PIN_PHAI_TIEN = PIN_MOTOR_BIN1;
static constexpr int PIN_PHAI_LUI  = PIN_MOTOR_BIN2;

// 20 kHz: trên ngưỡng nghe. Để 1-2 kHz thì động cơ rít the thé cả ngày,
// mà con robot này ngồi ngay cạnh người.
static constexpr int PWM_HZ  = 20000;
static constexpr int PWM_BIT = 8; // 0…255, khớp thang `MAX_MOTOR_DUTY`

// ⚠️ API LEDC ĐỜI 2.x — `ledcWrite` nhận KÊNH, không nhận CHÂN.
//
// `platformio.ini` ghim `espressif32@^6.9.0`, tức Arduino-ESP32 **2.x**.
// Bản 3.x đổi sang `ledcAttach(chân, hz, bit)` rồi `ledcWrite(chân, ...)`
// — viết theo bản đó thì ở đây không biên dịch nổi. Cùng lý do đã ghim
// Arduino_GFX ở 1.4.9: thư viện 1.6.7 đòi `esp32-hal-periman.h` của
// core 3.x.
//
// Bốn kênh 0-3 đang trống: cả firmware không chỗ nào khác dùng LEDC
// (âm thanh đi I2S, đèn nền màn nối cứng 3V3).
static constexpr int KENH_TRAI_TIEN = 0;
static constexpr int KENH_TRAI_LUI  = 1;
static constexpr int KENH_PHAI_TIEN = 2;
static constexpr int KENH_PHAI_LUI  = 3;

// ════════════════════════════════════════════════════════════
// Đạp mồi — bứt ma sát tĩnh
// ════════════════════════════════════════════════════════════
//
// 320 rpm × nhông ⌀47 = 0,79 m/s ở PWM tối đa. Muốn bò 0,15 m/s thì
// PWM chỉ ~19%, và ở mức đó động cơ chổi than không thắng nổi ma sát
// tĩnh của hộp số 18,7:1 cộng cả dải xích.
//
// Nên khi CHUYỂN TỪ ĐỨNG YÊN sang chạy, đạp một nhịp mạnh rồi tụt ngay
// về mức đặt. Người nhìn không thấy nhịp đó — 120 ms là chớp mắt — mà
// động cơ thì đã quay.
static constexpr int  DAP_MOI_MUC = 115; // ~45%
static constexpr uint32_t DAP_MOI_MS = 120;

// ════════════════════════════════════════════════════════════
// MPU6050 — chỉ đọc trục Z, không dùng thư viện
// ════════════════════════════════════════════════════════════
//
// Cố ý không kéo Adafruit_MPU6050 về: ở đây chỉ cần MỘT thanh ghi, mà
// thêm một thư viện là thêm một thứ phải tải, phải khớp phiên bản, và
// phải gỡ khi nó xung đột. Ba chục dòng I2C thô thì không hỏng bao giờ.
static constexpr uint8_t MPU_ADDR   = 0x68;
static constexpr uint8_t REG_PWR    = 0x6B;
static constexpr uint8_t REG_GYRO_Z = 0x47;
static constexpr uint8_t REG_WHOAMI = 0x75;

// ±250 °/s ⇒ 131 LSB mỗi °/s (mặc định sau khi thức dậy).
static constexpr float LSB_TREN_DPS = 131.0f;

static bool  _coGyro = false;
static float _lechGyro = 0;   // trôi lúc đứng yên, trừ đi mỗi lần đọc
static float _goc = 0;        // tích luỹ, độ
static uint32_t _docLan = 0;

static bool ghiMpu(uint8_t reg, uint8_t v) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(reg);
  Wire.write(v);
  return Wire.endTransmission() == 0;
}

/** °/s quanh trục đứng. Dương = quay theo chiều kim đồng hồ nhìn từ trên. */
static float docTocDoQuay() {
  if (!_coGyro) return 0;
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(REG_GYRO_Z);
  if (Wire.endTransmission(false) != 0) return 0;
  if (Wire.requestFrom((int)MPU_ADDR, 2) != 2) return 0;
  int16_t raw = (int16_t)((Wire.read() << 8) | Wire.read());
  return raw / LSB_TREN_DPS - _lechGyro;
}

/**
 * Đo độ trôi lúc ĐỨNG YÊN rồi trừ đi.
 *
 * ⚠️ Bỏ bước này thì góc tự trôi vài độ mỗi phút dù robot bất động, và
 * hiệu chỉnh giữ hướng sẽ tự bẻ lái sang một bên — triệu chứng là
 * "robot đi thẳng nhưng cứ vòng dần", rất khó đoán ra nguyên nhân.
 */
static void doLechGyro() {
  _lechGyro = 0;
  float tong = 0;
  const int N = 200;
  for (int i = 0; i < N; i++) { tong += docTocDoQuay(); delay(3); }
  _lechGyro = tong / N;
}

// ════════════════════════════════════════════════════════════
// Trạng thái
// ════════════════════════════════════════════════════════════

static int  _datTrai = 0, _datPhai = 0;   // mức người dùng yêu cầu
static bool _giuHuong = false;
static uint32_t _hanChay = 0;             // hạn tự dừng, tính lúc nhận lệnh
static uint32_t _lucDapMoi = 0;           // 0 = không đang đạp mồi
static int  _tran = 100;                  // trần tốc độ, %
static float _gocMuc = 0;                 // đích khi đang quay góc
static bool _dangQuay = false;
static int  _tocQuay = 160;
static uint32_t _hanQuay = 0;             // chốt chặn thời gian khi quay
static uint32_t _tickTruoc = 0;

/**
 * Ghi thẳng xuống phần cứng. `v` −255…255, âm = lùi.
 *
 * Chiều quay quyết định bởi VIỆC ĐỔ PWM VÀO CHÂN NÀO, không phải bởi
 * dấu: IBT-2 tiến khi có xung ở RPWM và LPWM = 0, lùi thì ngược lại.
 *
 * ⛔ TUYỆT ĐỐI KHÔNG đổ xung vào cả hai chân cùng lúc — đó là chập
 * thẳng nguồn 12V qua hai nửa cầu H, cháy mạch trong tích tắc. Vì thế
 * chân kia luôn được kéo về 0 TRƯỚC.
 */
static void xuatMotBanh(int kenhTien, int kenhLui, int v) {
  v = constrain(v, -MAX_MOTOR_DUTY, MAX_MOTOR_DUTY);
  if (v >= 0) {
    ledcWrite(kenhLui, 0);
    ledcWrite(kenhTien, v);
  } else {
    ledcWrite(kenhTien, 0);
    ledcWrite(kenhLui, -v);
  }
}

static void xuat(int trai, int phai) {
  xuatMotBanh(KENH_TRAI_TIEN, KENH_TRAI_LUI, trai);
  xuatMotBanh(KENH_PHAI_TIEN, KENH_PHAI_LUI, phai);
}

// ════════════════════════════════════════════════════════════

void tatSom() {
  const int chan[4] = {PIN_TRAI_TIEN, PIN_TRAI_LUI, PIN_PHAI_TIEN, PIN_PHAI_LUI};
  for (int i = 0; i < 4; i++) { pinMode(chan[i], OUTPUT); digitalWrite(chan[i], LOW); }
}

bool begin() {
  const int chan[4]  = {PIN_TRAI_TIEN, PIN_TRAI_LUI, PIN_PHAI_TIEN, PIN_PHAI_LUI};
  const int kenh[4]  = {KENH_TRAI_TIEN, KENH_TRAI_LUI, KENH_PHAI_TIEN, KENH_PHAI_LUI};
  for (int i = 0; i < 4; i++) {
    ledcSetup(kenh[i], PWM_HZ, PWM_BIT);
    ledcAttachPin(chan[i], kenh[i]);
    ledcWrite(kenh[i], 0);
  }

  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  Wire.setClock(400000);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(REG_WHOAMI);
  if (Wire.endTransmission(false) == 0 && Wire.requestFrom((int)MPU_ADDR, 1) == 1) {
    Wire.read();
    _coGyro = ghiMpu(REG_PWR, 0); // thoát chế độ ngủ
    if (_coGyro) {
      delay(50);
      doLechGyro();
    }
  }

  Serial.printf("[banh-xe] PWM %d Hz · gyro %s\n", PWM_HZ,
                _coGyro ? "CÓ" : "KHÔNG (chạy mù, vẫn đi được)");
  _tickTruoc = millis();
  return true;
}

void datTranTocDo(int phanTram) { _tran = constrain(phanTram, 10, 100); }
int  tranTocDo() { return _tran; }
bool coGyro() { return _coGyro; }
float gocHienTai() { return _goc; }
bool dangQuay() { return _dangQuay; }

void datToDo(int trai, int phai, uint32_t ms, bool giuHuong) {
  const bool dangDung = (_datTrai == 0 && _datPhai == 0);
  const bool sapChay  = (trai != 0 || phai != 0);

  _datTrai = (int)(constrain(trai, -255, 255) * _tran / 100.0f);
  _datPhai = (int)(constrain(phai, -255, 255) * _tran / 100.0f);
  _giuHuong = giuHuong && (trai == phai) && trai != 0;
  _dangQuay = false;

  // Trần 5 giây khớp `durationMs` của schema trên server. Chốt lại lần
  // nữa ở đây vì đây là chỗ CUỐI CÙNG còn chặn được: firmware không có
  // quyền tin rằng gói tin xuống tới nó đã đi qua bộ kiểm nào.
  _hanChay = millis() + (ms ? constrain(ms, (uint32_t)1, (uint32_t)5000)
                            : (uint32_t)MOTION_WATCHDOG_MS);

  // Chỉ đạp mồi khi ĐANG ĐỨNG mà sắp chạy. Đạp ở mọi lần đổi tốc thì
  // robot giật cục suốt, nhìn như hỏng.
  if (dangDung && sapChay) {
    _lucDapMoi = millis();
    xuat(_datTrai >= 0 ? DAP_MOI_MUC : -DAP_MOI_MUC,
         _datPhai >= 0 ? DAP_MOI_MUC : -DAP_MOI_MUC);
  } else {
    _lucDapMoi = 0;
    xuat(_datTrai, _datPhai);
  }
}

void dung() {
  _datTrai = _datPhai = 0;
  _giuHuong = false;
  _dangQuay = false;
  _lucDapMoi = 0;
  xuat(0, 0);
}

void quayGoc(float goc, int toc) {
  _gocMuc = _goc + goc;
  _tocQuay = constrain(abs(toc), 60, 255);
  _dangQuay = true;
  _giuHuong = false;
  _lucDapMoi = millis();

  // Trần thời gian: không có gyro thì đây là thứ DUY NHẤT dừng nó lại.
  // Ước 90°/giây ở tốc 160, cộng hệ số rộng tay rồi chặn ở 6 giây.
  const float giay = fabsf(goc) / (90.0f * _tocQuay / 160.0f);
  _hanQuay = millis() + (uint32_t)(giay * 1000) + 400;
  if (_hanQuay - millis() > 6000) _hanQuay = millis() + 6000;

  const int d = (goc >= 0) ? DAP_MOI_MUC : -DAP_MOI_MUC;
  xuat(d, -d); // hai bánh ngược chiều = xoay tại chỗ
}

void tick() {
  const uint32_t nay = millis();
  const float dt = (nay - _tickTruoc) / 1000.0f;
  _tickTruoc = nay;

  if (_coGyro && dt > 0 && dt < 0.5f) _goc += docTocDoQuay() * dt;

  // ── Đang quay tới một góc ──
  if (_dangQuay) {
    const bool hetGio = (int32_t)(nay - _hanQuay) >= 0;
    const bool toiNoi = _coGyro && fabsf(_gocMuc - _goc) < 3.0f;
    if (hetGio || toiNoi) {
      dung();
      Serial.printf("[banh-xe] quay xong: %s, lệch %.1f°\n",
                    toiNoi ? "theo gyro" : "hết giờ", _gocMuc - _goc);
      return;
    }
    if (nay - _lucDapMoi > DAP_MOI_MS) {
      const int d = (_gocMuc >= _goc) ? _tocQuay : -_tocQuay;
      xuat(d, -d);
    }
    return;
  }

  // ── HẠN TỰ DỪNG: chốt chặn quan trọng nhất cả module ──
  //
  // Mất mạng, server treo, hay người dùng đóng tab — robot phải TỰ
  // DỪNG. Không có dòng này thì một cú rớt WiFi giữa lúc đang đi là
  // robot lao thẳng cho tới khi đâm vào tường hoặc hết pin.
  //
  // Hạn đã được chốt lúc NHẬN lệnh (xem `datToDo`), nên mạng chết cũng
  // không kéo dài thêm được một mili giây nào. Muốn chạy tiếp thì phải
  // có lệnh mới xuống tới nơi.
  //
  // ⚠️ So bằng `(int32_t)(a - b) >= 0` chứ không phải `a > b`:
  // `millis()` tràn về 0 sau 49 ngày, và phép so trực tiếp sẽ kẹt cứng
  // ở đúng khoảnh khắc đó.
  if ((_datTrai || _datPhai) && (int32_t)(nay - _hanChay) >= 0) {
    dung();
    return;
  }

  if (!_datTrai && !_datPhai) return;

  // ── Hết nhịp đạp mồi thì tụt về mức đặt ──
  if (_lucDapMoi && nay - _lucDapMoi >= DAP_MOI_MS) {
    _lucDapMoi = 0;
    xuat(_datTrai, _datPhai);
    return;
  }
  if (_lucDapMoi) return; // còn đang đạp, để yên

  // ── Giữ hướng bằng gyro ──
  //
  // Đi thẳng thì tốc độ quay PHẢI bằng 0. Lệch bao nhiêu thì bù bấy
  // nhiêu vào chênh lệch hai bánh. Chỉ bộ P, không cần I hay D: đây là
  // giữ cho thẳng chứ không phải bám một quỹ đạo chính xác, mà thêm I
  // vào là nó tích luỹ rồi vọt lố mỗi lần xích trượt.
  if (_giuHuong && _coGyro) {
    const float lech = docTocDoQuay();       // °/s, dương = đang lệch phải
    const int bu = constrain((int)(lech * 1.8f), -60, 60);
    xuat(constrain(_datTrai - bu, -255, 255),
         constrain(_datPhai + bu, -255, 255));
  }
}

} // namespace banhXe
