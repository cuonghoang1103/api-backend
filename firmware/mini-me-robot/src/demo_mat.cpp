/**
 * ============================================================
 * Bàn thử HAI MẮT — chạy độc lập, không cần WiFi/mic/loa/động cơ
 * ============================================================
 *
 * Nạp cái này TRƯỚC KHI đụng vào firmware robot:
 *
 *     pio run -e mat-demo -t upload && pio device monitor
 *
 * Chỉ cần hai màn GC9A01 + bo. Nó dạo hết 28 biểu cảm, và nhận lệnh
 * qua Serial Monitor để bạn dừng lại ở cái nào muốn ngắm kỹ.
 *
 * ⚠️ VÌ SAO PHẢI THỬ RIÊNG. Khi cả robot không chạy, nếu đã biết chắc
 * hai con mắt tự nó tốt thì chỉ còn phải nghi chỗ nối. Cắm tất cả rồi
 * mới bật là có tám nghi phạm cùng lúc — đúng nguyên tắc của
 * `test/README.md`.
 *
 * ── ĐẤU DÂY ──
 *
 *   Cả hai màn:  VCC → 3V3   ·   GND → GND
 *                SCL/SCK → GPIO 12
 *                SDA/MOSI → GPIO 11
 *                DC → GPIO 13
 *                RST → 3V3          (reset bằng phần mềm)
 *                BLK → 3V3          (hoặc để trống, đa số bo tự sáng)
 *   Mắt TRÁI:    CS → GPIO 9
 *   Mắt PHẢI:    CS → GPIO 14
 *
 * (Bàn thử này KHÔNG cần màn ngực 3.5". Nếu đang cắm sẵn thì cứ để —
 *  nó dùng CS 10, không đụng gì tới hai mắt.)
 *
 * ⚠️ CS PHẢI RIÊNG. Đấu chung một chân thì hai màn nhận cùng dữ liệu và
 * hiện y hệt nhau — trông "chạy được" nên rất dễ tưởng là đúng, cho tới
 * lúc thử nháy một mắt và cả hai cùng nhắm.
 *
 * ⚠️ NGUỒN 3V3, KHÔNG PHẢI 5V. Đa số bo GC9A01 bán lẻ KHÔNG có mạch ổn
 * áp trên bo. Cắm 5V là chết chip, và nó chết im — màn cứ đen, không có
 * gì báo.
 */

#include <Arduino.h>

#include "eyes.h"
#include "man_hinh.h"

// Danh sách dạo. Xếp theo mạch cảm xúc chứ không theo thứ tự enum, để
// xem liên tục thì nó ra một câu chuyện chứ không phải một bảng liệt kê.
struct Muc {
  eyes::Expr e;
  const char* ten;
};
static const Muc TOUR[] = {
    {eyes::NEUTRAL, "binh thuong"},     {eyes::HAPPY, "vui"},
    {eyes::EXCITED, "phan khich (sao)"},{eyes::LOVE, "yeu (trai tim)"},
    {eyes::PROUD, "tu hao"},            {eyes::CURIOUS, "to mo"},
    {eyes::THINKING, "dang nghi"},      {eyes::CONFUSED, "kho hieu"},
    {eyes::SUSPICIOUS, "nghi ngo"},     {eyes::ANNOYED, "kho chiu"},
    {eyes::ANGRY, "gian"},              {eyes::SAD, "buon"},
    {eyes::SHY, "ngai"},                {eyes::SCARED, "so"},
    {eyes::SURPRISED, "ngac nhien"},    {eyes::DIZZY, "choang (xoay oc)"},
    {eyes::BORED, "chan"},              {eyes::SLEEPY, "buon ngu"},
    {eyes::SLEEPING, "dang ngu"},       {eyes::WINK, "nhay mat"},
    {eyes::LISTENING, "DANG NGHE"},     {eyes::SPEAKING, "DANG NOI"},
    {eyes::SCANNING, "DANG QUET"},      {eyes::CHARGING, "DANG SAC"},
    {eyes::LOWBAT, "PIN YEU"},          {eyes::ERROR, "LOI"},
    {eyes::BOOTING, "KHOI DONG"},
};
static constexpr int SO_MUC = sizeof(TOUR) / sizeof(TOUR[0]);

static int muc = 0;
static bool tuDong = true;
static uint32_t doiLuc = 0;
static uint32_t nhinLuc = 0;

// Đo hiệu năng thật. Không đoán — số này quyết định có phải hạ
// SPI_FREQUENCY xuống không, và nó khác nhau theo độ dài dây.
static uint32_t soVong = 0, dinhUs = 0;
static uint32_t doLuc = 0;

static void inMenu() {
  Serial.println();
  Serial.println("┌─────────────────────────────────────────────┐");
  Serial.println("│  BAN THU HAI MAT — go vao day roi Enter      │");
  Serial.println("├─────────────────────────────────────────────┤");
  Serial.println("│  <so>   nhay toi bieu cam thu <so>           │");
  Serial.println("│  <ten>  vd: happy, angry, dizzy, scanning    │");
  Serial.println("│  n / p  bieu cam sau / truoc                 │");
  Serial.println("│  a      bat/tat dao tu dong                  │");
  Serial.println("│  b      chop mat   ·   w  nhay mat trai      │");
  Serial.println("│  l      nhin quanh mot vong                  │");
  Serial.println("│  s      mo phong dang noi (dong tu nay)      │");
  Serial.println("├─ CHAN DOAN khi man ra soc / sai mau ─────────┤");
  Serial.println("│  t      hinh kiem: do/luc/lam/trang/luoi     │");
  Serial.println("│  f      doi toc do SPI 20→10→5→40 MHz        │");
  Serial.println("│  i      dao mau (thu co IPS dat sai)         │");
  Serial.println("│  ?      in lai bang nay                      │");
  Serial.println("└─────────────────────────────────────────────┘");
  for (int i = 0; i < SO_MUC; i++)
    Serial.printf("  %2d %-22s%s", i, TOUR[i].ten, (i % 3 == 2) ? "\n" : "");
  Serial.println();
}

static void dat(int i) {
  muc = (i % SO_MUC + SO_MUC) % SO_MUC;
  eyes::set(TOUR[muc].e);
  if (TOUR[muc].e == eyes::WINK) eyes::wink(true);
  Serial.printf("\n▶ %2d  %-24s (%s)\n", muc, TOUR[muc].ten,
                eyes::currentName());
  doiLuc = millis();
}

// ── Bộ kiểm đường truyền ──
//
// ⚠️ VÌ SAO CẦN: màn ra sọc thì có HAI thủ phạm hoàn toàn khác nhau —
// nhiễu trên dây SPI, hoặc mã vẽ sai. Nhìn con mắt thì không phân biệt
// được, mà hai cái sửa theo hai hướng ngược nhau. Ô màu đặc thì phân
// biệt được ngay: mã vẽ ô đặc chỉ là một lệnh `fillScreen`, không thể
// sai; nên ô đặc mà vẫn sọc thì chắc chắn là đường truyền.
//
// Và nó còn trả lời luôn câu hỏi thứ tự byte: tô ĐỎ mà ra XANH LAM thì
// hai byte đang bị đảo.
// ⚠️ `man_hinh::matPhai()` TRẢ VỀ nullptr khi mắt phải chưa có chân CS.
// Gọi thẳng `->fillScreen()` trên đó là `LoadProhibited`, bo sập rồi
// khởi động lại vô hạn — đúng thứ vừa xảy ra ngày 15/08/2026. Mọi lời
// gọi tới hai mắt đi qua hàm này để không sót chỗ nào.
static void moiMat(void (*viec)(Arduino_GFX*)) {
  for (Arduino_TFT* g : {man_hinh::matTrai(), man_hinh::matPhai()})
    if (g) viec(g);
}
static uint16_t _mauTo = 0;
static void _to(Arduino_GFX* g) { g->fillScreen(_mauTo); }

static const struct { uint16_t mau; const char* ten; } HINH_KIEM[] = {
    {0xF800, "DO   — ra xanh lam = DAO THU TU BYTE"},
    {0x07E0, "LUC  — ra tim/hong = dao byte"},
    {0x001F, "LAM  — ra vang/do  = dao byte"},
    {0xFFFF, "TRANG— con soc = NHIEU DUONG TRUYEN, ha toc do (go f)"},
    {0x0000, "DEN  — con dom sang = nhieu duong truyen"},
};
static int hinhKe = 0;
static bool dangKiem = false;   // đang hiện hình kiểm → tạm ngừng vẽ mắt
static int mucTocDo = 0;
static const int32_t TOC_DO_THU[] = {20000000, 10000000, 5000000, 40000000};

static void veHinhKiem() {
  const auto& h = HINH_KIEM[hinhKe % 5];
  _mauTo = h.mau;
  moiMat(_to);
  Serial.printf("\n  [kiem] to kin %s\n", h.ten);
  hinhKe++;
  dangKiem = true;
}

static void veLuoi() {
  // Lưới 20 px: lệch địa chỉ một dòng là thấy ngay bậc thang.
  for (auto* g : {man_hinh::matTrai(), man_hinh::matPhai()}) {
    if (!g) continue;
    g->fillScreen(0x0000);
    for (int i = 0; i <= 240; i += 20) {
      g->drawFastHLine(0, i, 240, 0xFFFF);
      g->drawFastVLine(i, 0, 240, 0xFFFF);
    }
  }
  Serial.println("\n  [kiem] luoi 20px — vuong deu = dia chi dung;"
                 " bac thang/xo lech = mat bit");
  dangKiem = true;
}

static void doiTocDo() {
  mucTocDo = (mucTocDo + 1) % 4;
  const int32_t t = TOC_DO_THU[mucTocDo];
  for (Arduino_TFT* g : {man_hinh::matTrai(), man_hinh::matPhai()})
    if (g) g->begin(t);
  eyes::invalidate();
  Serial.printf("\n  [kiem] SPI -> %ld MHz. Het soc o muc nao thi sua"
                " man_hinh::TOC_DO thanh muc do.\n", (long)(t / 1000000));
}

static bool nhinQuanh = false;
static uint32_t nhinBatDau = 0;
static bool moPhongNoi = false;

static void docSerial() {
  static String d;
  while (Serial.available()) {
    const char c = (char)Serial.read();
    if (c == '\n' || c == '\r') {
      d.trim();
      if (d.length()) {
        if (dangKiem && d != "t" && d != "f") {
          dangKiem = false;
          eyes::invalidate();
          Serial.println("\n  (thoat hinh kiem, ve lai mat)");
        }
        if (d == "?") {
          inMenu();
        } else if (d == "n") {
          tuDong = false;
          dat(muc + 1);
        } else if (d == "p") {
          tuDong = false;
          dat(muc - 1);
        } else if (d == "a") {
          tuDong = !tuDong;
          Serial.printf("\n  dao tu dong: %s\n", tuDong ? "BAT" : "TAT");
        } else if (d == "b") {
          eyes::blink(2);
          Serial.println("\n  chop 2 cai");
        } else if (d == "w") {
          eyes::wink(true);
          Serial.println("\n  nhay mat trai");
        } else if (d == "t") {
          tuDong = false;
          if (hinhKe % 6 == 5) { veLuoi(); hinhKe++; } else { veHinhKiem(); }
        } else if (d == "f") {
          doiTocDo();
        } else if (d == "i") {
          // Cờ IPS đặt sai thì màu bị ĐẢO (đen ra trắng). Thử ngay lúc
          // chạy thay vì nạp lại hai lần để so.
          static bool dao = false;
          dao = !dao;
          for (Arduino_TFT* g : {man_hinh::matTrai(), man_hinh::matPhai()})
            if (g) g->invertDisplay(dao);
          Serial.printf("\n  [kiem] dao mau: %s\n", dao ? "BAT" : "TAT");
        } else if (d == "l") {
          nhinQuanh = true;
          nhinBatDau = millis();
          Serial.println("\n  nhin quanh mot vong");
        } else if (d == "s") {
          moPhongNoi = !moPhongNoi;
          if (moPhongNoi) {
            tuDong = false;
            eyes::set(eyes::SPEAKING);
          } else {
            eyes::setLevel(0);
          }
          Serial.printf("\n  mo phong dang noi: %s\n", moPhongNoi ? "BAT" : "TAT");
        } else if (isdigit((unsigned char)d[0])) {
          tuDong = false;
          dat(d.toInt());
        } else {
          // Thử như một cái tên biểu cảm — cùng đường mà server dùng,
          // nên gõ ở đây đúng thì gửi từ server cũng đúng.
          tuDong = false;
          eyes::setByName(d.c_str());
          Serial.printf("\n▶ theo ten '%s' → %s\n", d.c_str(), eyes::currentName());
        }
      }
      d = "";
    } else if (d.length() < 24) {
      d += c;
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(400);
  Serial.println("\n\n=== Mini-Me Robot — ban thu HAI MAT (GC9A01 x2) ===");

  const int soMan = man_hinh::batTatCa();
  Serial.printf("  %d/3 man da gui xong chuoi khoi tao\n", soMan);

  eyes::setBus(man_hinh::busMatTrai(), man_hinh::busMatPhai());
  if (!eyes::begin(man_hinh::matTrai(), man_hinh::matPhai())) {
    Serial.println("!! eyes::begin() that bai — xem dong loi phia tren.");
    Serial.println("   Man den hoan toan? Kiem 3V3/GND va chan BLK truoc.");
    while (true) delay(1000);
  }

  // ── TỰ KIỂM ĐƯỜNG TRUYỀN, chạy mỗi lần bật ──
  //
  // ⚠️ Bốn ô màu đặc trong 6 giây. Nhìn qua thì thừa, nhưng nó trả lời
  // hai câu hỏi mà nhìn con mắt KHÔNG trả lời được, và hai câu đó sửa
  // theo hai hướng ngược nhau:
  //
  //   ô đặc mà còn sọc      → nhiễu đường truyền, phải hạ tốc độ SPI
  //   ô ĐỎ mà hiện XANH LAM → đảo thứ tự byte, phải sửa mã
  //
  // Mã vẽ ô đặc chỉ là một lệnh `fillScreen`, không thể sai — nên nó là
  // mốc so sánh đáng tin. Giữ luôn trong bản chạy thường: mỗi lần bật
  // máy là một lần chứng minh dây còn tốt, tốn 6 giây.
  {
    const struct { uint16_t mau; const char* ten; } TU_KIEM[] = {
        {0xF800, "DO"}, {0x07E0, "LUC"}, {0x001F, "LAM"}, {0xFFFF, "TRANG"}};
    Serial.println("\n══ TU KIEM DUONG TRUYEN — NHIN VAO MAN NGAY ══");
    Serial.println("   moi mau 2,5 giay. O dac ma con soc = loi DUONG TRUYEN,");
    Serial.println("   khong phai loi ma ve mat.");
    for (auto& k : TU_KIEM) {
      _mauTo = k.mau;
      moiMat(_to);
      Serial.printf("   ▶ %-6s\n", k.ten);
      delay(2500);
    }
    // ⚠️ PHÉP THỬ TÁCH BẠCH: vẽ bằng CHÍNH hàm của thư viện, không đi
    // qua bộ đệm dải của eyes.cpp.
    //
    // Suốt tối nay mọi phép kiểm đều là `fillScreen()` — mà `fillScreen`
    // là đường mã DUY NHẤT không dùng tới cửa sổ địa chỉ con. Nó sạch
    // trong khi hình thật thì nát, nên nó che mất chỗ hỏng.
    //
    // Hình dưới đây dùng `fillCircle`/`fillRect`, tức CÓ đặt cửa sổ con
    // nhưng KHÔNG qua mã của tôi. Nó tách dứt khoát hai khả năng:
    //   hình đúng  → lỗi nằm trong đường đẩy dải của eyes.cpp
    //   hình sọc   → lỗi nằm ở thư viện/phần cứng, ngoài tầm mã của tôi
    for (Arduino_TFT* g : {man_hinh::matTrai(), man_hinh::matPhai()}) {
      if (!g) continue;
      g->fillScreen(0x0000);
      g->fillCircle(120, 120, 70, 0xF800);   // đĩa ĐỎ giữa nền đen
      g->fillCircle(120, 120, 28, 0x0000);   // lỗ đen ở giữa
      g->fillRect(10, 110, 40, 20, 0xFFFF);  // thanh TRẮNG bên trái
    }
    Serial.println("   ▶ HINH THU: dia DO co lo den + thanh TRANG trai (8 giay)");
    Serial.println("     Ve bang ham CUA THU VIEN, khong qua ma cua toi.");
    delay(8000);

    _mauTo = 0;
    moiMat(_to);
    Serial.println("── het tu kiem, bat dau ve mat ──\n");
    eyes::invalidate();
  }

  // Chỉ báo trạng thái: bàn thử không có WiFi nên để đúng như thật —
  // chấm đỏ. Vẫn hiện, để bạn thấy nó nằm đâu trên kính.
  eyes::setStatus(false, false);
  eyes::setBattery(78);

  inMenu();
  Serial.println("\n  (khoi dong: mong mo dan nhu khau do may anh)\n");
  doiLuc = millis();
  doLuc = millis();
}

void loop() {
  const uint32_t t0 = micros();

  // Đang xem hình kiểm thì ngừng vẽ mắt, nếu không nó xoá mất ngay.
  // Bấm phím lệnh nào khác là tự thoát.
  if (!dangKiem) eyes::loop();   // ← việc chính, tự chia lát 4 ms
  docSerial();

  const uint32_t now = millis();

  // Khởi động xong thì vào danh sách dạo.
  if (eyes::current() == eyes::BOOTING && now - doiLuc > 1800) dat(0);

  // Dạo tự động: 3,2 giây mỗi biểu cảm — đủ để hoạt ảnh của nó chạy
  // trọn một vòng (trái tim đập, xoáy ốc quay, vạch quét đi hết màn).
  if (tuDong && !moPhongNoi && eyes::current() != eyes::BOOTING &&
      now - doiLuc > 3200) {
    dat(muc + 1);
  }

  // Nhìn quanh một vòng tròn trong 2,4 giây.
  if (nhinQuanh) {
    const float k = (now - nhinBatDau) / 2400.0f;
    if (k >= 1.0f) {
      nhinQuanh = false;
      eyes::look(0, 0);
    } else {
      eyes::look(sinf(k * TWO_PI), -cosf(k * TWO_PI) * 0.6f);
    }
  } else if (now - nhinLuc > 2600 && tuDong) {
    // Thỉnh thoảng liếc sang chỗ khác, cho giống đang sống.
    nhinLuc = now;
    eyes::look(((int)(esp_random() % 200) - 100) / 100.0f * 0.5f,
               ((int)(esp_random() % 200) - 100) / 100.0f * 0.3f);
  }

  // Mô phỏng biên độ tiếng: hai hình sin lệch nhịp cho ra dáng âm tiết
  // chứ không phải một nhịp đập đều.
  if (moPhongNoi) {
    const float s = now / 1000.0f;
    const float a = 0.5f + 0.5f * sinf(s * 9.1f);
    const float b = 0.5f + 0.5f * sinf(s * 3.7f + 1.1f);
    eyes::setLevel((int32_t)(a * b * b * 220000));
  }

  // Nhịp đo 2 giây: đỉnh thời gian một vòng loop() là con số quyết
  // định. Nó phải ở dưới ~5 ms, vì trong firmware thật cùng vòng đó
  // còn phải bơm I2S — quá 8 ms là tiếng bắt đầu vấp.
  soVong++;
  const uint32_t us = micros() - t0;
  if (us > dinhUs) dinhUs = us;
  if (now - doLuc >= 2000) {
    Serial.printf("   [do] %lu vong/giay · dinh %lu us%s\n", soVong / 2, dinhUs,
                  dinhUs > 8000 ? "  ← QUA LAU, ha SPI_FREQUENCY" : "");
    soVong = 0;
    dinhUs = 0;
    doLuc = now;
  }
}
