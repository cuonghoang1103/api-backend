#include "servo.h"
#include "config.h"
#include <Wire.h>

namespace servo {

// ════════════════════════════════════════════════════════════
// Thanh ghi PCA9685 — viết thô, không kéo thư viện
// ════════════════════════════════════════════════════════════
//
// Cùng lý do đã đọc MPU6050 bằng tay trong `banh_xe.cpp`: ở đây chỉ cần
// bốn thanh ghi. Thêm một thư viện là thêm một thứ phải tải, phải khớp
// phiên bản, và phải gỡ khi nó cãi nhau với thư viện khác.
static constexpr uint8_t REG_MODE1    = 0x00;
static constexpr uint8_t REG_MODE2    = 0x01;
static constexpr uint8_t REG_PRESCALE = 0xFE;
static constexpr uint8_t REG_LED0_ON  = 0x06;   // mỗi kênh 4 byte kể từ đây

static constexpr uint8_t M1_NGU     = 0x10;  // SLEEP
static constexpr uint8_t M1_TU_TANG = 0x20;  // AI — ghi liền 4 byte một lần
static constexpr uint8_t M1_KHOI_DONG_LAI = 0x80;
static constexpr uint8_t M2_DAY_KEO = 0x04;  // OUTDRV: ngõ ra đẩy-kéo

// PCA9685 chạy dao động nội 25 MHz, bộ đếm 12 bit.
static constexpr float TAN_NOI   = 25000000.0f;
static constexpr float SO_DEM    = 4096.0f;
static constexpr float CHU_KY_US = 1000000.0f / SERVO_FREQ_HZ;  // 20000 µs

// ════════════════════════════════════════════════════════════
// Góc → độ rộng xung
// ════════════════════════════════════════════════════════════
//
// MG90S và SG90 nhận 500-2500 µs cho trọn 180°. Vài lô chỉ ăn 1000-2000
// và sẽ CHẠM CỨNG ở hai đầu nếu bị đẩy tới 500/2500 — servo rít lên rồi
// nóng. Ở robot này chuyện đó không xảy ra, vì mọi khớp đã bị `config.h`
// bó chặt hơn nhiều (cổ ±35…±90, khuỷu −120…0) nên xung thực tế không
// bao giờ chạm mép dải.
//
// Thấy servo rít ở hai đầu hành trình thì kéo hai số này vào 600/2400.
static constexpr float XUNG_MIN_US  = 500.0f;
static constexpr float XUNG_GIUA_US = 1500.0f;
static constexpr float XUNG_MAX_US  = 2500.0f;

static uint16_t gocSangDem(float goc) {
  goc = constrain(goc, -90.0f, 90.0f);
  const float us = XUNG_GIUA_US + goc * (XUNG_MAX_US - XUNG_MIN_US) / 180.0f;
  return (uint16_t)(us * SO_DEM / CHU_KY_US + 0.5f);
}

// ════════════════════════════════════════════════════════════
// Trạng thái sáu khớp
// ════════════════════════════════════════════════════════════

static constexpr int SO_KHOP = 6;

struct Khop {
  float    gocDau    = 0;   // nơi xuất phát của lần đi hiện tại
  float    gocDich   = 0;
  float    gocNay    = 0;
  uint32_t lucDau    = 0;
  uint32_t thoiLuong = 0;
  bool     dangDi    = false;
  bool     coXung    = false;  // đã từng phát xung chưa
};
static Khop _k[SO_KHOP];
static bool _co = false;
static uint32_t _lanGhiTruoc = 0;

/** Trần dưới/trên của từng kênh, lấy thẳng từ `config.h`. */
static void bo(int kenh, float& goc) {
  switch (kenh) {
    case CH_NECK_PAN:       goc = constrain(goc, (float)NECK_PAN_MIN,  (float)NECK_PAN_MAX);  break;
    case CH_NECK_TILT:      goc = constrain(goc, (float)NECK_TILT_MIN, (float)NECK_TILT_MAX); break;
    case CH_ARM_L_SHOULDER:
    case CH_ARM_R_SHOULDER: goc = constrain(goc, (float)SHOULDER_MIN,  (float)SHOULDER_MAX);  break;
    case CH_ARM_L_ELBOW:
    case CH_ARM_R_ELBOW:    goc = constrain(goc, (float)ELBOW_MIN,     (float)ELBOW_MAX);     break;
    default:                goc = constrain(goc, -90.0f, 90.0f);                              break;
  }
}

// ════════════════════════════════════════════════════════════
// I2C
// ════════════════════════════════════════════════════════════

static bool ghi1(uint8_t reg, uint8_t v) {
  Wire.beginTransmission(PCA9685_ADDR);
  Wire.write(reg);
  Wire.write(v);
  return Wire.endTransmission() == 0;
}

static int doc1(uint8_t reg) {
  Wire.beginTransmission(PCA9685_ADDR);
  Wire.write(reg);
  if (Wire.endTransmission(false) != 0) return -1;
  if (Wire.requestFrom((int)PCA9685_ADDR, 1) != 1) return -1;
  return Wire.read();
}

static void datXung(int kenh, uint16_t tat) {
  Wire.beginTransmission(PCA9685_ADDR);
  Wire.write(REG_LED0_ON + 4 * kenh);
  Wire.write(0); Wire.write(0);                 // bật ở đếm 0
  Wire.write(tat & 0xFF); Wire.write(tat >> 8); // tắt ở đây
  Wire.endTransmission();
}

/** Bit 12 của thanh ghi TẮT = tắt hoàn toàn, ngõ ra nằm im ở mức thấp. */
static void tatKenh(int kenh) {
  Wire.beginTransmission(PCA9685_ADDR);
  Wire.write(REG_LED0_ON + 4 * kenh);
  Wire.write(0); Wire.write(0);
  Wire.write(0); Wire.write(0x10);
  Wire.endTransmission();
}

// ════════════════════════════════════════════════════════════

bool begin() {
  // `banh_xe::begin()` cũng gọi `Wire.begin` — gọi hai lần vô hại, và
  // để ở đây thì module này không phụ thuộc thứ tự dựng của module kia.
  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  Wire.setClock(400000);

  Wire.beginTransmission(PCA9685_ADDR);
  if (Wire.endTransmission() != 0) {
    Serial.println("[servo] KHONG thay PCA9685 0x40 — robot van chay, chi la khong cu dong");
    return false;
  }

  ghi1(REG_MODE1, M1_KHOI_DONG_LAI);
  delay(10);
  ghi1(REG_MODE2, M2_DAY_KEO);

  // Đặt tần số: phải cho chip NGỦ mới ghi được bộ chia. Đó là quy định
  // của phần cứng chứ không phải mẹo.
  const int chia = (int)(TAN_NOI / (SO_DEM * SERVO_FREQ_HZ) + 0.5f) - 1;
  const int cu = doc1(REG_MODE1);
  ghi1(REG_MODE1, (cu & ~M1_KHOI_DONG_LAI) | M1_NGU);
  ghi1(REG_PRESCALE, (uint8_t)chia);
  ghi1(REG_MODE1, cu);
  delay(5);
  ghi1(REG_MODE1, cu | M1_KHOI_DONG_LAI | M1_TU_TANG);

  // ⛔⛔ CỐ Ý KHÔNG ĐẨY SERVO VỀ VỊ TRÍ NÀO Ở ĐÂY.
  //
  // Servo không biết nó đang ở đâu. Nhận xung đầu tiên là nó LAO tới
  // chỗ được bảo, bằng tốc độ tối đa (MG90S: 60° trong 0,1 giây). Nếu
  // firmware tự đẩy về "nhà" lúc khởi động thì mỗi lần bật nguồn là hai
  // cánh tay quật một phát — mà lúc này cơ khí chưa lắp, chưa ai biết 0°
  // thật nằm ở đâu, nên phát quật đó có thể đập tay vào thân.
  //
  // Nên: tắt hết kênh, servo thả lỏng, tay buông thõng. Chỉ cử động khi
  // có lệnh thật. Muốn về tư thế nghỉ thì gọi `dau()`/`tay()` tường
  // minh, SAU KHI đã đo giới hạn thật bằng bàn thử `thu-servo`.
  for (int i = 0; i < SO_KHOP; i++) tatKenh(i);

  _co = true;
  Serial.printf("[servo] PCA9685 0x%02X · %d Hz · bo chia %d · 6 kenh dang THA LONG\n",
                PCA9685_ADDR, SERVO_FREQ_HZ, chia);
  return true;
}

bool co() { return _co; }
float gocCua(int kenh) { return (kenh >= 0 && kenh < SO_KHOP) ? _k[kenh].gocNay : 0; }

static void diToi(int kenh, float goc, uint32_t ms) {
  if (!_co || kenh < 0 || kenh >= SO_KHOP) return;
  bo(kenh, goc);
  Khop& k = _k[kenh];
  // Chưa từng phát xung thì không có "điểm xuất phát" nào có thật —
  // nội suy từ một con số bịa ra chỉ làm chậm chứ không mượt hơn.
  k.gocDau    = k.coXung ? k.gocNay : goc;
  k.gocDich   = goc;
  k.lucDau    = millis();
  k.thoiLuong = k.coXung ? ms : 0;
  k.dangDi    = true;
}

void dau(float pan, float tilt, uint32_t ms) {
  diToi(CH_NECK_PAN,  pan,  ms);
  diToi(CH_NECK_TILT, tilt, ms);
}

void tay(int ben, float vai, float khuyu, uint32_t ms) {
  if (ben == 0 || ben == 2) {
    diToi(CH_ARM_L_SHOULDER, vai,   ms);
    diToi(CH_ARM_L_ELBOW,    khuyu, ms);
  }
  if (ben == 1 || ben == 2) {
    // Tay phải soi gương tay trái: cùng một lệnh "giơ ra ngoài" phải
    // thành hai chiều quay ngược nhau, không thì robot giơ một tay ra
    // trước một tay ra sau. Khuỷu KHÔNG lật — nó chỉ gập một chiều ở
    // cả hai bên.
    diToi(CH_ARM_R_SHOULDER, -vai,  ms);
    diToi(CH_ARM_R_ELBOW,    khuyu, ms);
  }
}

void nghi() {
  if (!_co) return;
  for (int i = 0; i < SO_KHOP; i++) { tatKenh(i); _k[i].coXung = false; _k[i].dangDi = false; }
}

// ════════════════════════════════════════════════════════════
// Bài nhảy
// ════════════════════════════════════════════════════════════

struct Nhip { int kenh; float goc; uint32_t ms; uint32_t cho; };

static const Nhip MUA_GAT[]  = {{CH_NECK_TILT,-25,300,320},{CH_NECK_TILT,25,300,320},
                                {CH_NECK_TILT,-25,300,320},{CH_NECK_TILT,0,300,320}};
static const Nhip MUA_LAC[]  = {{CH_NECK_PAN,-45,260,280},{CH_NECK_PAN,45,320,340},
                                {CH_NECK_PAN,-45,320,340},{CH_NECK_PAN,0,300,320}};
static const Nhip MUA_NGO[]  = {{CH_ARM_L_SHOULDER,-40,300,120},{CH_ARM_R_SHOULDER,40,300,320},
                                {CH_ARM_L_SHOULDER,-70,300,120},{CH_ARM_R_SHOULDER,70,300,320},
                                {CH_ARM_L_SHOULDER,-40,300,120},{CH_ARM_R_SHOULDER,40,300,320}};
static const Nhip MUA_QUAY[] = {{CH_NECK_PAN,60,400,420},{CH_NECK_PAN,-60,700,720},
                                {CH_NECK_PAN,0,400,420}};
static const Nhip MUA_MUNG[] = {{CH_ARM_L_SHOULDER,-80,320,60},{CH_ARM_R_SHOULDER,80,320,60},
                                {CH_NECK_TILT,-30,320,360},
                                {CH_ARM_L_ELBOW,-90,260,60},{CH_ARM_R_ELBOW,-90,260,300},
                                {CH_ARM_L_ELBOW,-20,260,60},{CH_ARM_R_ELBOW,-20,260,300},
                                {CH_NECK_TILT,0,300,320}};

static const Nhip* _bai = nullptr;
static int _soNhip = 0, _nhipNay = 0;
static uint32_t _hetNhip = 0;

bool mua(const char* ten) {
  if (!_co || !ten) return false;
  if      (!strcmp(ten, "nod"))       { _bai = MUA_GAT;  _soNhip = sizeof(MUA_GAT)  / sizeof(Nhip); }
  else if (!strcmp(ten, "shake"))     { _bai = MUA_LAC;  _soNhip = sizeof(MUA_LAC)  / sizeof(Nhip); }
  else if (!strcmp(ten, "wiggle"))    { _bai = MUA_NGO;  _soNhip = sizeof(MUA_NGO)  / sizeof(Nhip); }
  else if (!strcmp(ten, "spin"))      { _bai = MUA_QUAY; _soNhip = sizeof(MUA_QUAY) / sizeof(Nhip); }
  else if (!strcmp(ten, "celebrate")) { _bai = MUA_MUNG; _soNhip = sizeof(MUA_MUNG) / sizeof(Nhip); }
  else return false;
  _nhipNay = 0;
  _hetNhip = 0;
  return true;
}

bool dangMua() { return _bai != nullptr; }

// ════════════════════════════════════════════════════════════

void tick() {
  if (!_co) return;
  const uint32_t nay = millis();

  // Chạy bài nhảy: mỗi nhịp đặt một khớp rồi chờ `cho` mili giây. Đặt
  // `cho` NGẮN HƠN `ms` của chính nhịp đó là hai khớp chồng lên nhau —
  // đó là cách hai tay giơ cùng lúc trong bài `celebrate`.
  if (_bai && (int32_t)(nay - _hetNhip) >= 0) {
    if (_nhipNay >= _soNhip) {
      _bai = nullptr;
    } else {
      const Nhip& n = _bai[_nhipNay++];
      diToi(n.kenh, n.goc, n.ms);
      _hetNhip = nay + n.cho;
    }
  }

  // Ghìm nhịp ghi I2C: servo chỉ đọc xung 50 lần mỗi giây, ghi dày hơn
  // là ném băng thông bus — mà bus này còn chia cho con quay trong
  // `banh_xe::tick()`, thứ chạy mỗi vòng loop.
  if (nay - _lanGhiTruoc < 20) return;
  _lanGhiTruoc = nay;

  for (int i = 0; i < SO_KHOP; i++) {
    Khop& k = _k[i];
    if (!k.dangDi) continue;

    float t = k.thoiLuong ? (float)(nay - k.lucDau) / k.thoiLuong : 1.0f;
    if (t >= 1.0f) { t = 1.0f; k.dangDi = false; }

    // Làm mượt hai đầu: khởi hành chậm, tới nơi chậm. Nội suy thẳng
    // trông vẫn máy móc vì nó dừng đột ngột đúng lúc chạm đích.
    const float m = t * t * (3.0f - 2.0f * t);
    k.gocNay = k.gocDau + (k.gocDich - k.gocDau) * m;

    datXung(i, gocSangDem(k.gocNay));
    k.coXung = true;
  }
}

} // namespace servo
