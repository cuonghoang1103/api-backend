#include "camUng.h"

#include <Wire.h>

#include "eyes.h"
#include "face.h"

namespace camUng {

/** Địa chỉ mặc định của họ FT6336U / FT6236 / FT6206. */
static constexpr uint8_t DIA_CHI = 0x38;

/** ~30 lần/giây. Dày hơn mắt người cũng không thấy khác, chỉ tốn I2C. */
static constexpr uint32_t NHIP_MS = 33;

/** Giữ yên bao lâu thì tính là vuốt ve. */
static constexpr uint32_t VUOT_VE_MS = 1200;
/** Ngón trôi quá bao nhiêu điểm ảnh thì là KÉO, không còn là giữ yên. */
static constexpr int TROI_TOI_DA = 40;
/** Chạm ngắn hơn chừng này mới là một cú CHẠM (không phải kéo/giữ). */
static constexpr uint32_t CHAM_NGAN_MS = 350;
/** Hai cú chạm cách nhau ít hơn chừng này là chạm-hai-lần. */
static constexpr uint32_t HAI_LAN_MS = 400;
/** Nhả tay ra bao lâu thì mắt trôi về giữa. */
static constexpr uint32_t NHIN_VE_MS = 1200;
/** Vuốt dọc trên dải dưới: bao nhiêu điểm ảnh là một nấc âm lượng. Dải
 *  chỉ cao 76px nên nấc phải nhỏ — vuốt xuống hết dải mới được ~5 nấc. */
static constexpr int NAC_AM_LUONG_PX = 14;

static bool coMat = false;
static int manW = 480, manH = 320;

static uint32_t lanHoi = 0;
static bool dangCham = false;
static uint32_t chamLuc = 0;
static int xDau = 0, yDau = 0;
static bool daVuotVe = false;
static uint32_t chamTruocLuc = 0;   // lúc NHẢ của cú chạm ngắn trước
static uint32_t nhinVeLuc = 0;
/** Cú chạm này BẮT ĐẦU trong dải dưới ⇒ nó là nút, không phải cử chỉ. */
static bool trongDai = false;
static int nacDaGui = 0;            // số nấc âm lượng đã báo trong cú vuốt này
static bool daVuotAmLuong = false;
static void (*suKienChamDai)() = nullptr;
static void (*suKienAmLuong)(int) = nullptr;

void datSuKien(void (*khiChamDai)(), void (*khiDoiAmLuong)(int buoc)) {
  suKienChamDai = khiChamDai;
  suKienAmLuong = khiDoiAmLuong;
}

/** Đọc một điểm chạm. `false` = không có ngón nào trên kính. */
static bool doc(uint16_t& rx, uint16_t& ry) {
  Wire.beginTransmission(DIA_CHI);
  Wire.write(0x02);   // TD_STATUS: số điểm đang chạm, rồi tới toạ độ điểm 1
  if (Wire.endTransmission(false) != 0) return false;
  if (Wire.requestFrom((int)DIA_CHI, 5) != 5) return false;
  const uint8_t so = Wire.read() & 0x0F;
  const uint8_t xh = Wire.read(), xl = Wire.read();
  const uint8_t yh = Wire.read(), yl = Wire.read();
  if (so == 0 || so > 2) return false;
  // Bốn bit CAO nằm ở nibble thấp; hai bit trên cùng là cờ sự kiện
  // (nhấn/nhả/giữ) — không che là toạ độ nhảy vọt lên vài nghìn.
  rx = ((uint16_t)(xh & 0x0F) << 8) | xl;
  ry = ((uint16_t)(yh & 0x0F) << 8) | yl;
  return true;
}

/**
 * Nhìn về một điểm trên màn.
 *
 * Quy về khoảng -1..1 quanh TÂM HAI MẮT (không phải tâm màn): mắt nằm ở
 * nửa trên, nên chạm vào dải dưới phải đọc thành "nhìn xuống", không
 * phải "nhìn giữa".
 */
static void nhinVe(int sx, int sy) {
  const float tamY = MAT_Y + 120;
  float lx = (sx - manW / 2.0f) / (manW / 2.0f);
  float ly = (sy - tamY) / 120.0f;
  if (ly > 1) ly = 1;
  if (ly < -1) ly = -1;
  face::look(lx, ly);
}

bool begin(int W, int H) {
  manW = W;
  manH = H;
  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);   // đã chạy rồi thì chỉ cảnh báo, vô hại
  // FT6336U cần ~300 ms sau khi có điện mới trả lời. Thử ba lần thay vì
  // một: bỏ cuộc sớm là mất cảm ứng cho tới lần khởi động sau.
  for (int i = 0; i < 3 && !coMat; i++) {
    Wire.beginTransmission(DIA_CHI);
    coMat = Wire.endTransmission() == 0;
    if (!coMat) delay(100);
  }
  Serial.printf("[cham] FT6336U 0x%02X: %s\n", DIA_CHI,
                coMat ? "CO — cham de mat nhin theo" : "KHONG THAY (robot van chay, chi khong cam ung)");
  return coMat;
}

void tick() {
  if (!coMat) return;
  const uint32_t now = millis();

  // Nhả tay đủ lâu → mắt trôi về giữa. Đặt TRƯỚC cổng nhịp để không bị
  // trễ thêm tới 33 ms.
  if (nhinVeLuc && !dangCham && now > nhinVeLuc) {
    nhinVeLuc = 0;
    face::look(0, 0);
  }

  if (now - lanHoi < NHIP_MS) return;
  lanHoi = now;

  uint16_t rx, ry;
  const bool co = doc(rx, ry);
  int sx = 0, sy = 0;
  if (co) anhXa(rx, ry, manW, manH, sx, sy);

  if (co && !dangCham) {
    // ── Ngón vừa đặt xuống ──
    dangCham = true;
    chamLuc = now;
    xDau = sx;
    yDau = sy;
    daVuotVe = false;
    nhinVeLuc = 0;
    trongDai = sy >= DAI_Y;
    nacDaGui = 0;
    daVuotAmLuong = false;
    nhinVe(sx, sy);
    if (trongDai) Serial.printf("[cham] dai (%d,%d)\n", sx, sy);
  } else if (co && dangCham && trongDai) {
    // ── Ngón đang trên DẢI DƯỚI: vuốt dọc = âm lượng ──
    // Mắt vẫn liếc xuống theo ngón — robot "nhìn" vào nút đang bị bấm.
    nhinVe(sx, sy);
    const int nac = (yDau - sy) / NAC_AM_LUONG_PX;   // vuốt LÊN là to lên
    if (nac != nacDaGui) {
      if (suKienAmLuong) suKienAmLuong(nac - nacDaGui);
      nacDaGui = nac;
      daVuotAmLuong = true;
    }
  } else if (co && dangCham) {
    // ── Ngón đang trên kính ──
    nhinVe(sx, sy);
    const int troi = abs(sx - xDau) + abs(sy - yDau);
    if (!daVuotVe && troi < TROI_TOI_DA && now - chamLuc >= VUOT_VE_MS) {
      daVuotVe = true;
      face::set(face::LOVE, 3000);
      Serial.println("[cham] vuot ve -> mat trai tim");
    }
  } else if (!co && dangCham && trongDai) {
    // ── Nhấc tay khỏi DẢI DƯỚI ──
    dangCham = false;
    trongDai = false;
    // Cú chạm ngắn, không vuốt ⇒ bấm nút. Ngưỡng dài hơn cú chạm ở vùng
    // mắt một chút: bấm nút thì người ta hay ấn rồi mới nhả.
    if (!daVuotAmLuong && now - chamLuc < 600) {
      Serial.println("[cham] dai -> nut noi");
      if (suKienChamDai) suKienChamDai();
    }
    nhinVeLuc = now + NHIN_VE_MS;
  } else if (!co && dangCham) {
    // ── Ngón vừa nhấc lên ──
    dangCham = false;
    const uint32_t dai = now - chamLuc;
    if (!daVuotVe && dai < CHAM_NGAN_MS) {
      // Đo từ lúc NHẢ cú trước tới lúc ĐẶT cú này — đúng khoảng hở giữa
      // hai cú. Đo tới lúc nhả thì độ dài cú thứ hai bị cộng vào, và
      // người chạm chậm tay sẽ không bao giờ nháy được mắt.
      if (chamTruocLuc && chamLuc - chamTruocLuc < HAI_LAN_MS) {
        eyes::wink(true);
        chamTruocLuc = 0;
        Serial.println("[cham] cham hai lan -> nhay mat");
      } else {
        chamTruocLuc = now;
      }
    }
    nhinVeLuc = now + NHIN_VE_MS;
  }
}

}  // namespace camUng
