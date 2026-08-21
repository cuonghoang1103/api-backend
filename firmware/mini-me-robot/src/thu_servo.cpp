/**
 * ============================================================
 * thu_servo — bàn kiểm sáu khớp, KHÔNG cần WiFi/màn/server
 * ============================================================
 *
 *     pio run -e thu-servo -t upload && pio device monitor
 *
 * ⚠️ KHÁC `thu_banh.cpp` Ở MỘT ĐIỂM CÓ CHỦ Ý: bàn này DÙNG LẠI
 * `servo.cpp`, còn bàn kia thì cố ý KHÔNG dùng `banh_xe.cpp`.
 *
 * Lý do: bàn thử động cơ đo ĐỘNG CƠ, nên phải loại mã của tôi ra khỏi
 * phép đo. Bàn này thì ngược lại — thứ cần kiểm là CƠ KHÍ khớp với
 * BẢNG GÓC, tức đúng cái đường mà `servo.cpp` sẽ chạy thật. Đo bằng mã
 * khác thì hiệu chỉnh xong vẫn không biết mã thật có ra đúng thế không.
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │ 🔧 QUY TRÌNH LẮP CÀNG SERVO — làm đúng thứ tự này        │
 * ├──────────────────────────────────────────────────────────┤
 * │ 1. Cắm servo vào PCA9685 khi CHƯA gắn càng nhựa lên trục │
 * │ 2. Chạy bàn này, chọn khớp, bấm `c` để đưa về 0°         │
 * │ 3. GIỜ MỚI gắn càng, đặt sao cho khớp ở tư thế trung lập │
 * │ 4. Bắt vít càng                                          │
 * │                                                          │
 * │ Gắn càng TRƯỚC rồi mới cấp điện thì servo nhảy về 0° kéo │
 * │ theo cả cánh tay — và tư thế trung lập rơi vào đâu là do │
 * │ may rủi, sau phải bù bằng phần mềm cho tới hết đời.      │
 * └──────────────────────────────────────────────────────────┘
 *
 * ⛔ Chân `V+` của PCA9685 phải có NGUỒN RIÊNG (5V, LM2596). Sáu MG90S
 *    cùng gồng vượt khả năng con XL1509 trên shield, và servo giật gây
 *    sụt áp thì ESP32 reset giữa chừng.
 *
 * ⛔ ĐỪNG cắm vào cụm `I2C` của shield MKE-B01: cụm đó dùng `SCL` =
 *    GPIO 9, mà GPIO 9 là chân `CS` của mắt trái. Lấy `SDA` ở đó được
 *    (GPIO 8), `SCL` phải lấy ở hàng `SIG` chỗ số 18.
 */

#include <Arduino.h>
#include "servo.h"
#include "config.h"

struct Ten { int kenh; const char* ten; int min_; int max_; };
static const Ten DS[] = {
    {CH_NECK_PAN,        "co: quay trai/phai", NECK_PAN_MIN,  NECK_PAN_MAX},
    {CH_NECK_TILT,       "co: gat len/xuong",  NECK_TILT_MIN, NECK_TILT_MAX},
    {CH_ARM_L_SHOULDER,  "tay TRAI - vai",     SHOULDER_MIN,  SHOULDER_MAX},
    {CH_ARM_L_ELBOW,     "tay TRAI - khuyu",   ELBOW_MIN,     ELBOW_MAX},
    {CH_ARM_R_SHOULDER,  "tay PHAI - vai",     SHOULDER_MIN,  SHOULDER_MAX},
    {CH_ARM_R_ELBOW,     "tay PHAI - khuyu",   ELBOW_MIN,     ELBOW_MAX},
};
static constexpr int SO = sizeof(DS) / sizeof(DS[0]);

static int   _chon = 0;
static float _goc[SO] = {0};
static const char* BAI[] = {"nod", "shake", "wiggle", "spin", "celebrate"};
static int _baiNay = 0;

static void bang() {
  Serial.println("\n┌────────────────────────────────────────────────┐");
  Serial.println("│  BAN KIEM SAU KHOP SERVO                       │");
  Serial.println("├────────────────────────────────────────────────┤");
  Serial.println("│  0..5  chon khop                               │");
  Serial.println("│  j / l   -5°  / +5°                            │");
  Serial.println("│  , / .   -1°  / +1°   (chinh tinh)             │");
  Serial.println("│  c     ve 0°  <- bam CAI NAY truoc khi gan cang │");
  Serial.println("│  s     quet CHAM ca dai cho phep               │");
  Serial.println("│  x     tha long khop dang chon                 │");
  Serial.println("│  X     tha long TAT CA                         │");
  Serial.println("│  m     chay thu mot bai nhay                   │");
  Serial.println("│  ?     hien lai bang nay + goc hien tai        │");
  Serial.println("└────────────────────────────────────────────────┘");
  for (int i = 0; i < SO; i++)
    Serial.printf("   %c %d  %-22s  goc %+6.1f   (cho phep %d..%d)\n",
                  i == _chon ? '>' : ' ', i, DS[i].ten, _goc[i], DS[i].min_, DS[i].max_);
  Serial.println();
}

static void di(float goc) {
  const Ten& t = DS[_chon];
  goc = constrain(goc, (float)t.min_, (float)t.max_);
  _goc[_chon] = goc;
  // Đi qua đúng API thật. 250ms cho mỗi bước tay — đủ chậm để kịp thấy
  // khớp chạm cữ cơ khí và rút tay ra trước khi servo è vào đó.
  if (t.kenh == CH_NECK_PAN || t.kenh == CH_NECK_TILT)
    servo::dau(t.kenh == CH_NECK_PAN ? goc : _goc[0],
               t.kenh == CH_NECK_TILT ? goc : _goc[1], 250);
  else if (t.kenh == CH_ARM_L_SHOULDER || t.kenh == CH_ARM_L_ELBOW)
    servo::tay(0, _goc[2], _goc[3], 250);
  else
    servo::tay(1, -_goc[4], _goc[5], 250);   // `tay()` tự lật vai phải
  Serial.printf("   [%d] %s  ->  %+6.1f°\n", _chon, DS[_chon].ten, goc);
}

static void quet() {
  const Ten& t = DS[_chon];
  Serial.printf("\n  QUET %s: %d° -> %d° -> 0°, tung nac 5°\n", t.ten, t.min_, t.max_);
  Serial.println("  Nghe thay servo RIT hoac thay khop DUNG CUNG thi bam phim bat ky.");
  Serial.println("  Do la cu co khi that — bao toi con so do de siet lai config.h.\n");
  for (int g = t.min_; g <= t.max_; g += 5) {
    if (Serial.available()) { while (Serial.available()) Serial.read();
                              Serial.printf("  ✱ DUNG o %+d°\n", g); return; }
    di(g); for (int i = 0; i < 6 && !Serial.available(); i++) delay(50);
  }
  di(0);
  Serial.println("  Quet xong, khong cham cu nao.\n");
}

void setup() {
  Serial.begin(115200);
  delay(600);
  Serial.println("\n\n=== THU SERVO ===");
  if (!servo::begin()) {
    Serial.println("!! Khong thay PCA9685 tai 0x40. Kiem lai:");
    Serial.println("   - SDA -> GPIO 8   SCL -> GPIO 18  (KHONG dung cum I2C cua shield)");
    Serial.println("   - VCC cua PCA9685 -> 3V3    GND -> GND chung");
    Serial.println("   - V+ (coc vit) -> nguon 5V RIENG cho servo");
  }
  bang();
}

void loop() {
  servo::tick();
  if (!Serial.available()) return;
  const char c = Serial.read();
  if (c >= '0' && c <= '5') {
    _chon = c - '0';
    Serial.printf("\n   >>> dang chon [%d] %s  (cho phep %d..%d)\n",
                  _chon, DS[_chon].ten, DS[_chon].min_, DS[_chon].max_);
    return;
  }
  switch (c) {
    case 'j': di(_goc[_chon] - 5); break;
    case 'l': di(_goc[_chon] + 5); break;
    case ',': di(_goc[_chon] - 1); break;
    case '.': di(_goc[_chon] + 1); break;
    case 'c': di(0); break;
    case 's': quet(); break;
    case 'x': servo::nghi(); Serial.println("   (tha long tat ca — PCA9685 tat theo ca cum)"); break;
    case 'X': servo::nghi(); Serial.println("   (tha long TAT CA)"); break;
    case 'm': {
      const char* t = BAI[_baiNay];
      _baiNay = (_baiNay + 1) % (int)(sizeof(BAI) / sizeof(BAI[0]));
      Serial.printf("   bai nhay: %s -> %s\n", t, servo::mua(t) ? "chay" : "KHONG nhan");
      break;
    }
    case '?': bang(); break;
    default: break;
  }
}
