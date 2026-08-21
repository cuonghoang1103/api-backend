/**
 * ============================================================
 * thu_banh — bàn kiểm hai bánh xích, KHÔNG cần WiFi/màn/server
 * ============================================================
 *
 *     pio run -e thu-banh -t upload && pio device monitor
 *
 * Chạy được với đúng những thứ đã có trên tay: ESP32-S3 + 2 mạch IBT-2
 * + 2 động cơ + khung TP101 + nguồn 12V. Không đụng tới màn hình, vỏ,
 * mạng, hay server — nên thử được ngay trong lúc còn chờ hàng.
 *
 * ⚠️ CỐ Ý KHÔNG dùng lại `banh_xe.cpp`. Bàn kiểm này để đo ĐỘNG CƠ, còn
 * `banh_xe.cpp` là mã sẽ chạy thật. Trộn hai thứ vào nhau thì lúc số đo
 * ra lạ sẽ không biết lỗi ở cơ hay ở mã. Đo xong lấy số điền ngược vào
 * `banh_xe.cpp` — đó mới là thứ tự đúng.
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │ ⛔⛔ TRƯỚC KHI CẤP ĐIỆN — ĐỌC HẾT BA DÒNG NÀY            │
 * ├──────────────────────────────────────────────────────────┤
 * │ 1. Chân VCC của IBT-2 cắm vào 3V3, KHÔNG PHẢI 5V.        │
 * │ 2. Kê xe lên hộp cho xích quay hẫng. Lần đầu chạy rất    │
 * │    hay sai chiều, mà 320 rpm thì nó lao khỏi bàn.        │
 * │ 3. GND của nguồn 12V và GND của ESP32 phải NỐI CHUNG.    │
 * │    Không chung mát thì tín hiệu PWM không có gốc so, và  │
 * │    triệu chứng là "lúc chạy lúc không" — rất mất công dò.│
 * └──────────────────────────────────────────────────────────┘
 *
 * NỐI DÂY (mỗi bánh một mạch IBT-2 riêng):
 *
 *   Mạch TRÁI                      Mạch PHẢI
 *   ─────────────────────────      ─────────────────────────
 *   RPWM ← GPIO 39                 RPWM ← GPIO 41
 *   LPWM ← GPIO 40                 LPWM ← GPIO 42
 *   R_EN + L_EN → 3V3              R_EN + L_EN → 3V3
 *   VCC → 3V3   GND → GND          VCC → 3V3   GND → GND
 *   B+ / B− → nguồn 12V            B+ / B− → nguồn 12V
 *   M+ / M− → động cơ trái         M+ / M− → động cơ phải
 *
 *   Hai chân R_IS / L_IS để trống ở bàn kiểm này.
 */

#include <Arduino.h>
#include <Wire.h>
#include "config.h"

static constexpr int CHAN[4] = {PIN_MOTOR_AIN1, PIN_MOTOR_AIN2,
                                PIN_MOTOR_BIN1, PIN_MOTOR_BIN2};
static const char* TEN[4] = {"TRAI tien (RPWM)", "TRAI lui (LPWM)",
                             "PHAI tien (RPWM)", "PHAI lui (LPWM)"};
static constexpr int KENH[4] = {0, 1, 2, 3};
static constexpr int PWM_HZ = 20000, PWM_BIT = 8;

static int  _toc = 120;          // mức đang đặt, 0..255
static uint32_t _hanDung = 0;    // chốt an toàn: tự tắt sau ngần này

// ── MPU6050, chỉ để xem có đọc được không ──
static constexpr uint8_t MPU_ADDR = 0x68, REG_PWR = 0x6B, REG_GYRO_Z = 0x47;
static bool _coGyro = false;

static void xuat(int trai, int phai) {
  trai = constrain(trai, -255, 255);
  phai = constrain(phai, -255, 255);
  // Chân kia LUÔN về 0 trước. Đổ xung vào cả RPWM lẫn LPWM là chập
  // thẳng 12V qua hai nửa cầu H — cháy mạch trong tích tắc.
  if (trai >= 0) { ledcWrite(1, 0); ledcWrite(0, trai); }
  else           { ledcWrite(0, 0); ledcWrite(1, -trai); }
  if (phai >= 0) { ledcWrite(3, 0); ledcWrite(2, phai); }
  else           { ledcWrite(2, 0); ledcWrite(3, -phai); }
}

static void dung() { xuat(0, 0); _hanDung = 0; }

static void chay(int trai, int phai, const char* nhan) {
  xuat(trai, phai);
  _hanDung = millis() + 8000;   // không lệnh mới thì 8 giây sau tự tắt
  Serial.printf("  ▶ %s   trai=%d  phai=%d   (tu tat sau 8s)\n",
                nhan, trai, phai);
}

static float docGyroZ() {
  if (!_coGyro) return 0;
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(REG_GYRO_Z);
  if (Wire.endTransmission(false) != 0) return 0;
  if (Wire.requestFrom((int)MPU_ADDR, 2) != 2) return 0;
  return (int16_t)((Wire.read() << 8) | Wire.read()) / 131.0f;
}

/**
 * PHÉP ĐO QUAN TRỌNG NHẤT CỦA CẢ BÀN KIỂM.
 *
 * `DAP_MOI_MUC = 115` trong `banh_xe.cpp` hiện là con số TÔI ĐOÁN. Nó
 * phải là mức PWM thấp nhất mà động cơ thật sự bứt được ma sát tĩnh,
 * với đúng khối lượng robot thật và đúng độ căng xích thật — ba thứ đó
 * không tra bảng ra được.
 *
 * Đặt xe XUỐNG SÀN cho phép đo này (không kê hộp): ma sát khi có tải
 * mới là con số cần, chạy hẫng luôn cho ra mức thấp giả tạo.
 */
static void doNguongKhoiDong() {
  Serial.println("\n╔════════════════════════════════════════════════╗");
  Serial.println("║  DO NGUONG KHOI DONG                           ║");
  Serial.println("╚════════════════════════════════════════════════╝");
  Serial.println("  1. Dat xe XUONG SAN (khong ke hop) — can ma sat co tai.");
  Serial.println("  2. Nhin BANH XE. PWM se tang dan tung nac 5.");
  Serial.println("  3. Banh vua NHUC NHICH  -> bam phim BAT KY (lan 1)");
  Serial.println("  4. Banh QUAY DEU        -> bam phim BAT KY (lan 2)");
  Serial.println("\n  Bat dau sau 3 giay...\n");
  delay(3000);
  while (Serial.available()) Serial.read();   // bỏ phím gõ nhầm lúc chờ

  int nhucNhich = 0, quayDeu = 0;
  for (int v = 20; v <= 220; v += 5) {
    xuat(v, v);
    Serial.printf("  PWM %3d  (%2d%%)%s\n", v, v * 100 / 255,
                  nhucNhich ? "   [dang cho moc 2]" : "");
    // Chia nhỏ nhịp chờ để bắt phím ngay, không để người dùng bấm xong
    // còn phải đợi gần một giây mới thấy phản hồi.
    for (int k = 0; k < 18 && !Serial.available(); k++) delay(50);

    if (Serial.available()) {
      while (Serial.available()) Serial.read();
      if (!nhucNhich) {
        nhucNhich = v;
        Serial.printf("\n  ✱ MOC 1 — banh bat dau nhuc nhich o PWM %d (%d%%)\n\n",
                      v, v * 100 / 255);
      } else {
        quayDeu = v;
        Serial.printf("\n  ✱ MOC 2 — banh quay deu o PWM %d (%d%%)\n", v, v * 100 / 255);
        break;
      }
    }
  }
  dung();

  Serial.println("\n╔════════════════════════════════════════════════╗");
  Serial.println("║  KET QUA                                       ║");
  Serial.println("╠════════════════════════════════════════════════╣");
  Serial.printf ("║  Nhuc nhich : PWM %-3d  (%2d%%)                  ║\n",
                 nhucNhich, nhucNhich * 100 / 255);
  Serial.printf ("║  Quay deu   : PWM %-3d  (%2d%%)                  ║\n",
                 quayDeu, quayDeu * 100 / 255);
  Serial.println("╚════════════════════════════════════════════════╝");
  if (!nhucNhich)
    Serial.println("  (khong bam moc nao — chay lai lenh r)");
  else
    Serial.printf("  -> DAP_MOI_MUC nen dat khoang %d\n", quayDeu ? quayDeu : nhucNhich + 15);
  Serial.println();
}

static void menu() {
  Serial.println("\n┌──────────────────────────────────────────────┐");
  Serial.println("│  BAN KIEM HAI BANH XICH                      │");
  Serial.println("├──────────────────────────────────────────────┤");
  Serial.println("│  w  ca hai TIEN        s  ca hai LUI          │");
  Serial.println("│  a  quay TRAI          d  quay PHAI           │");
  Serial.println("│  1  RIENG banh trai    2  RIENG banh phai     │");
  Serial.println("│  +  nhanh hon 20       -  cham hon 20         │");
  Serial.println("│  x  DUNG (hoac Enter)                        │");
  Serial.println("│  r  DO NGUONG KHOI DONG  <- lam cai nay truoc │");
  Serial.println("│  g  doc con quay       ?  hien lai bang nay   │");
  Serial.println("└──────────────────────────────────────────────┘");
  Serial.printf("  Toc do dang dat: %d/255 (%d%%)\n\n", _toc, _toc * 100 / 255);
}

void setup() {
  // ⛔⛔ DÒNG ĐẦU TIÊN, TRƯỚC CẢ `Serial.begin`. ĐỪNG CHÈN GÌ LÊN TRÊN.
  //
  // Chân GPIO chưa cấu hình thì THẢ NỔI, mà đầu vào IBT-2 đi qua đệm
  // 74HC244 trở kháng rất cao — chỉ cần nhiễu là nó đọc ra mức cao và
  // động cơ chạy HẾT GA. Đo thật 21/08/2026: nạp nhầm firmware không
  // biết gì về động cơ, cấp 12V vào là một bánh tự quay ngay.
  //
  // `Serial.begin` + `delay(600)` ở bản trước nằm TRƯỚC vòng này, tức
  // có 0,6 giây chân thả nổi mỗi lần bật nguồn. Kéo xuống mức thấp
  // trước đã, rồi muốn in gì thì in.
  for (int i = 0; i < 4; i++) { pinMode(CHAN[i], OUTPUT); digitalWrite(CHAN[i], LOW); }

  Serial.begin(115200);
  delay(600);

  for (int i = 0; i < 4; i++) {
    ledcSetup(KENH[i], PWM_HZ, PWM_BIT);
    ledcAttachPin(CHAN[i], KENH[i]);
    ledcWrite(KENH[i], 0);
    Serial.printf("  GPIO %2d = %s\n", CHAN[i], TEN[i]);
  }

  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  Wire.setClock(400000);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(REG_PWR);
  Wire.write((uint8_t)0);
  _coGyro = (Wire.endTransmission() == 0);
  Serial.printf("  Con quay MPU6050: %s\n",
                _coGyro ? "CO" : "khong thay (van thu banh duoc)");

  menu();
}

void loop() {
  // Chốt an toàn. Mất kết nối serial, đóng cửa sổ monitor, hay chỉ là
  // đi pha ấm trà — động cơ không được phép chạy tiếp mãi.
  if (_hanDung && (int32_t)(millis() - _hanDung) >= 0) {
    dung();
    Serial.println("  ■ het 8 giay, tu tat");
  }

  if (!Serial.available()) return;
  const char c = Serial.read();

  switch (c) {
    case 'w': chay( _toc,  _toc, "CA HAI TIEN"); break;
    case 's': chay(-_toc, -_toc, "CA HAI LUI");  break;
    case 'a': chay(-_toc,  _toc, "QUAY TRAI");   break;
    case 'd': chay( _toc, -_toc, "QUAY PHAI");   break;
    case '1': chay( _toc,     0, "RIENG BANH TRAI"); break;
    case '2': chay(    0,  _toc, "RIENG BANH PHAI"); break;
    case '+': _toc = min(255, _toc + 20);
              Serial.printf("  toc do = %d\n", _toc); break;
    case '-': _toc = max( 40, _toc - 20);
              Serial.printf("  toc do = %d\n", _toc); break;
    case 'r': doNguongKhoiDong(); break;
    case 'g':
      if (_coGyro) Serial.printf("  gyro Z = %+.2f do/giay\n", docGyroZ());
      else         Serial.println("  khong co MPU6050");
      break;
    case '?': menu(); break;
    case 'x': case '\n': case '\r': dung(); Serial.println("  ■ DUNG"); break;
    default: break;
  }
}
