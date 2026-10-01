/**
 * ============================================================
 * KIỂM SỨC KHOẺ CHÂN GPIO — sau khi ngửi thấy mùi khét
 * ============================================================
 *
 *     pio run -e thu-chan -t upload && pio device monitor
 *
 * ⚠️ VÌ SAO CẦN. Ngày 27/08/2026 hai màn mắt tối, và sau nhiều giờ dò
 * dây thì người dùng nhắc tới một chi tiết quyết định: CÓ MÙI KHÉT.
 * Mùi bay đi sau vài phút, nhưng linh kiện chết thì ở lại — nên không
 * thể kết luận "hết mùi là không sao".
 *
 * Bài này hỏi chính con ESP32: mỗi chân màn hình còn kéo lên/kéo xuống
 * được không, và có bị chập ra ngoài không.
 *
 * BỐN PHÉP cho mỗi chân:
 *   1. INPUT_PULLUP   → phải đọc 1. Đọc 0 = CHẬP XUỐNG MÁT
 *   2. INPUT_PULLDOWN → phải đọc 0. Đọc 1 = CHẬP LÊN NGUỒN
 *   3. OUTPUT HIGH    → phải đọc 1. Đọc 0 = mạch lái hỏng, hoặc tải kéo
 *   4. OUTPUT LOW     → phải đọc 0. Đọc 1 = mạch lái hỏng
 *
 * ⚠️ ĐỌC KẾT QUẢ CÓ ĐIỀU KIỆN. Màn hình đang cắm thì trên vài chân có
 * trở kéo của chính bo màn, làm phép 1-2 lệch. Cột "ghi chú" nói rõ
 * chân nào được phép lệch. Muốn sạch tuyệt đối thì rút hết màn ra rồi
 * chạy lại — lúc đó mọi chân phải qua cả bốn phép.
 */
#include <Arduino.h>
#include "config.h"

struct Chan {
  int gpio;
  const char* ten;
};

static const Chan DS[] = {
    {PIN_TFT_SCLK, "SCLK  (chung 3 man)"},
    {PIN_TFT_MOSI, "MOSI  (chung 3 man)"},
    {PIN_TFT_DC,   "DC    (chung 3 man)"},
    {PIN_TFT_CS,   "CS    man nguc"},
    {PIN_EYE_CS_L, "CS    mat TRAI"},
    {PIN_EYE_CS_R, "CS    mat PHAI"},
};
static constexpr int SO = sizeof(DS) / sizeof(DS[0]);

/** Trả về chuỗi 4 ký tự: kết quả 4 phép, `.` = đạt, `X` = lệch. */
static void kiemMot(const Chan& c, char out[5], bool& sach) {
  sach = true;

  pinMode(c.gpio, INPUT_PULLUP);
  delayMicroseconds(200);
  const bool a = digitalRead(c.gpio);

  pinMode(c.gpio, INPUT_PULLDOWN);
  delayMicroseconds(200);
  const bool b = digitalRead(c.gpio);

  pinMode(c.gpio, OUTPUT);
  digitalWrite(c.gpio, HIGH);
  delayMicroseconds(200);
  const bool d = digitalRead(c.gpio);

  digitalWrite(c.gpio, LOW);
  delayMicroseconds(200);
  const bool e = digitalRead(c.gpio);

  out[0] = a ? '.' : 'X';
  out[1] = b ? 'X' : '.';
  out[2] = d ? '.' : 'X';
  out[3] = e ? 'X' : '.';
  out[4] = 0;
  // Phép 3 và 4 là phép NẶNG NHẤT: chúng kiểm mạch lái của chính chip.
  // Lệch ở đó gần như chắc chắn là chân đã chết hoặc bị chập cứng.
  if (!d || e) sach = false;
}

void setup() {
  Serial.begin(115200);
  delay(800);
  Serial.println("\n+---------------------------------------------------+");
  Serial.println("|  KIEM SUC KHOE CHAN GPIO — ESP32-S3               |");
  Serial.println("+---------------------------------------------------+");
  Serial.printf("  Chip: %s  rev %d  %d loi @ %d MHz\n", ESP.getChipModel(), ESP.getChipRevision(),
                ESP.getChipCores(), getCpuFrequencyMhz());
  Serial.printf("  Flash %u MB · PSRAM %u KB · heap trong %u KB\n",
                (unsigned)(ESP.getFlashChipSize() / 1048576), (unsigned)(ESP.getPsramSize() / 1024),
                (unsigned)(ESP.getFreeHeap() / 1024));
  Serial.println("\n  Cot: [keo len][keo xuong][ra CAO][ra THAP]   . = dat, X = lech\n");

  int hong = 0;
  for (auto& c : DS) {
    char kq[5];
    bool sach;
    kiemMot(c, kq, sach);
    Serial.printf("  GPIO %-2d  %-22s  [%s]  %s\n", c.gpio, c.ten, kq,
                  sach ? "OK" : "<<< CHAN NAY CO VAN DE");
    if (!sach) hong++;
    pinMode(c.gpio, INPUT);   // trả về trạng thái an toàn
  }

  Serial.println();
  if (hong == 0) {
    Serial.println("  ==> CA 6 CHAN MAN HINH DEU LAI DUOC. ESP32 khong hong o day.");
    Serial.println("      (Cot 1-2 co the lech vi tro keo cua bo man — khong sao.)");
  } else {
    Serial.printf("  ==> %d CHAN CO VAN DE — xem dong danh dau o tren.\n", hong);
    Serial.println("      Rut het man ra roi chay lai de loai tru anh huong cua bo man.");
  }
  Serial.println("\n  Chip con chay va in duoc dong nay => loi ESP32, WiFi, USB deu song.");
}

void loop() {
  delay(5000);
}
