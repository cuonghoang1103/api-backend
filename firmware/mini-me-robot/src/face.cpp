#include "face.h"

#include "chuViet.h"
#include "eyes.h"

namespace face {

static Arduino_GFX* tft = nullptr;

// ─── Bảng màu ──────────────────────────────────────────────
// Nền đen tuyền + mắt xanh lơ phát sáng: đây là bảng màu của mọi con
// robot dễ thương từ trước tới nay, và nó dễ thương vì tương phản cao
// nên mắt nổi bật, chứ không phải vì ngẫu nhiên.
static const uint16_t C_BG = TFT_BLACK;
static const uint16_t C_EYE = 0x07FF;      // lơ sáng
static const uint16_t C_EYE_DIM = 0x03BF;  // lơ tối, dùng cho buồn ngủ
static const uint16_t C_PUPIL = TFT_BLACK;
static const uint16_t C_SHINE = TFT_WHITE;
static const uint16_t C_LOVE = 0xFB56;   // hồng
static const uint16_t C_ANGRY = 0xFB2C;  // đỏ cam
static const uint16_t C_DOT_OK = 0x07E0;
static const uint16_t C_DOT_BAD = 0xF800;

// ─── Bố cục ────────────────────────────────────────────────
// Màn 480×320 xoay ngang. Mắt to và đặt cao hơn giữa một chút — mặt
// nào có mắt đặt thấp cũng trông buồn ngủ hoặc đần.
static int W = 480, H = 320;
static int EYE_W = 132, EYE_H = 116;
static int EYE_Y = 118;               // tâm mắt
static int EYE_LX = 138, EYE_RX = 342;  // tâm mắt trái/phải
static int MOUTH_Y = 244;

// ─── Trạng thái ────────────────────────────────────────────
static Emotion emo = NEUTRAL;
static Emotion baseEmo = NEUTRAL;  // quay về đây khi hết hạn
static uint32_t emoUntil = 0;

static float lookX = 0, lookY = 0;
static float lookTargetX = 0, lookTargetY = 0;

static bool blinking = false;
static uint32_t nextBlinkAt = 0;
static uint32_t blinkUntil = 0;

static bool wifiOk = false, serverOk = false;

// Đồng hồ góc trên trái. Giữ lại chuỗi đã vẽ để chỉ vẽ khi ĐỔI phút.
static char clockTxt[6] = "";
static int batPct = -1;
static bool dirty = true;
static Emotion drawnEmo = (Emotion)255;
static bool drawnBlink = false;
static int drawnLX = -999, drawnLY = -999;

// ─── Hình cơ bản ───────────────────────────────────────────

/**
 * Cung dày, vẽ bằng cách xếp các cột dọc theo một parabol.
 *
 * Thư viện có drawArc nhưng cung của nó là cung TRÒN, và cung của nó là cung
 * TRÒN — mắt cười hay miệng cười thì cung parabol trông tự nhiên hơn
 * nhiều, vì nó dẹt ở giữa và cong nhanh ở hai đầu, giống nét vẽ tay.
 */
static void arcThick(int cx, int cy, int w, int h, int thick, bool up, uint16_t color) {
  const int half = w / 2;
  for (int dx = -half; dx <= half; dx++) {
    const float t = (float)dx / half;             // -1..1
    const int dy = (int)(h * (t * t) - h);        // parabol, đỉnh ở giữa
    const int y = up ? cy - dy - h : cy + dy + h;
    tft->fillRect(cx + dx, y - thick / 2, 1, thick, color);
  }
}

/** Mắt mở: chữ nhật bo tròn rất tròn — vừa "robot" vừa mềm. */
static void eyeOpen(int cx, int w, int h, uint16_t color, float px, float py) {
  const int x = cx - w / 2, y = EYE_Y - h / 2;
  tft->fillRoundRect(x, y, w, h, w / 3, color);

  // Con ngươi. Không để chạm mép — chạm mép trông như mắt lồi.
  const int pr = w / 5;
  const int maxOff = w / 2 - pr - 12;
  const int pxx = cx + (int)(px * maxOff);
  const int pyy = EYE_Y + (int)(py * (h / 2 - pr - 10));
  tft->fillCircle(pxx, pyy, pr, C_PUPIL);

  // Đốm sáng lệch trên-trái: đây là thứ khiến con mắt trông "ướt" và
  // có hồn. Bỏ nó đi thì mắt thành hai cái lỗ.
  tft->fillCircle(pxx - pr / 3, pyy - pr / 3, pr / 3, C_SHINE);
}

/** Mắt nhắm / nheo: một nét cong mảnh. */
static void eyeClosed(int cx, int w, uint16_t color, bool smile) {
  arcThick(cx, EYE_Y, w, smile ? 16 : 2, 12, smile, color);
}

/** Mắt hình trái tim, cho biểu cảm love. */
static void eyeHeart(int cx, int size, uint16_t color) {
  const int r = size / 3;
  tft->fillCircle(cx - r / 2 - 2, EYE_Y - r / 2, r, color);
  tft->fillCircle(cx + r / 2 + 2, EYE_Y - r / 2, r, color);
  tft->fillTriangle(cx - r - r / 2 - 2, EYE_Y - r / 2 + 2, cx + r + r / 2 + 2,
                    EYE_Y - r / 2 + 2, cx, EYE_Y + size / 2, color);
}

/** Lông mày — thứ chở gần hết cảm xúc trên một khuôn mặt. */
static void brow(int cx, int tiltPx, uint16_t color) {
  const int w = EYE_W - 20;
  const int y = EYE_Y - EYE_H / 2 - 26;
  const int x0 = cx - w / 2, x1 = cx + w / 2;
  // Vẽ dày bằng ba đường kề nhau: drawLine chỉ dày 1 px.
  for (int k = -4; k <= 4; k++)
    tft->drawLine(x0, y - tiltPx + k, x1, y + tiltPx + k, color);
}

// ─── Vẽ cả mặt ─────────────────────────────────────────────

// ─── Chế độ "chỉ dải dưới" (MAT_TREN_NGUC, 01/10/2026) ──────
//
// Khi hai mắt `eyes.cpp` vẽ lên chính màn ngực này, module `face` KHÔNG
// được vẽ khuôn mặt nữa — nó sẽ đè lên mắt. Nó chỉ còn lo dải 76px bên
// dưới: đồng hồ trái, NGHE/NGHĨ/NÓI giữa, pin phải, cùng một dòng.
//
// Mọi API (`set`, `look`, `setStatus`…) vẫn giữ nguyên và vẫn chuyển
// tiếp xuống `eyes` như cũ — `main.cpp` gọi `face::` ở tám chỗ khác nhau,
// đổi hết sang `eyes::` thì chỉ cần sót một chỗ là mặt và mắt nói hai
// chuyện khác nhau.
static bool chiDai = false;
static int dY = 0;                          // mép trên của dải

// ── Dải hai dòng (01/10/2026) ──
// Dòng trên: giờ · TRẠNG THÁI (chấm màu + chữ + vạch sóng) · pin.
// Dòng dưới: phụ đề — câu robot nghe được, rồi câu nó đang nói.
// Mỗi dòng cao `chuViet::caoDong()` (32 px, đủ chữ hoa hai dấu "Ặ").
static int yDong1() { return dY + 2; }
static int yDong2() { return dY + 40; }
static constexpr int O1_X = 92, O1_W = 296;     // ô trạng thái, giữa giờ và pin
static constexpr int O2_X = 12;                 // ô phụ đề, gần trọn bề ngang
static int o2W() { return W - 2 * O2_X; }

// Nhãn đang nằm trên kính — ở phạm vi FILE chứ không trong hàm, để
// `beginDai()` đặt lại được sau khi cổng WiFi đã vẽ đè cả màn. Để nó là
// biến static trong hàm thì sau khi màn bị xoá, hàm vẫn tưởng nhãn còn
// đó và không vẽ lại.
static Emotion nhanDaVe = (Emotion)255;
static KieuNghe kieuNghe = NGHE_TU_DO;

// Đồng hồ góc trên TRÁI — chấm trạng thái ở góc phải nên không đè nhau.
// Xoá đúng ô chữ rồi vẽ đè, KHÔNG fillScreen: khuôn mặt đang nằm đó và
// xoá cả màn mỗi phút thì thành nháy đèn.
static void drawClock() {
  if (!tft) return;
  const int x = chiDai ? 16 : 8, y = chiDai ? dY + 13 : 6;
  tft->fillRect(x, y, 64, 20, C_BG);
  if (!clockTxt[0]) return;
  tft->setTextColor(C_EYE_DIM, C_BG);
  tft->setTextSize(2);
  tft->setCursor(x, y);
  tft->print(clockTxt);
}

// Pin ngay cạnh đồng hồ. Màu mang thông tin chứ không để trang trí —
// liếc một cái là biết còn nhiều hay sắp chết, khỏi cần đọc số.
static void drawBattery() {
  if (!tft) return;
  const int x = chiDai ? W - 16 - 54 : 78, y = chiDai ? dY + 13 : 6;
  tft->fillRect(x, y, 54, 20, C_BG);
  if (batPct < 0) return;
  const uint16_t col = batPct > 50 ? C_DOT_OK : (batPct > 20 ? 0xFD20 : C_DOT_BAD);
  tft->setTextColor(col, C_BG);
  tft->setTextSize(2);
  tft->setCursor(x, y);
  tft->printf("%d%%", batPct);
}

/**
 * Dải chữ trạng thái ở đáy màn: NGHE → NGHĨ → NÓI.
 *
 * ⚠️ Bản trước vẽ chữ "dang nghe" ngay trong nhánh LISTENING và KHÔNG
 * có ai xoá nó. drawFace() cố ý chỉ xoá hai hốc mắt với vùng miệng (xem
 * lý do ngay dưới đây), nên dòng chữ nằm ngoài ba vùng ấy đọng lại vĩnh
 * viễn — robot nghe xong, nghĩ xong, nói xong, màn vẫn ghi "dang nghe".
 *
 * Người dùng báo đúng hậu quả của nó: không biết robot đã nghe được hay
 * chưa nên cứ nói đi nói lại. Một chỉ báo SAI còn hại hơn không có chỉ
 * báo, vì nó khiến người ta tin nhầm.
 *
 * Nên chỗ này XOÁ TRƯỚC rồi mới vẽ, mỗi lần mặt đổi. Dải nằm ở y đáy
 * màn, dưới miệng, nên không đụng vùng nào drawFace() đang lo.
 *
 * Màu chở thông tin chứ không trang trí: vàng = đến lượt bạn nói, cam =
 * nó đang nghĩ (chờ đi), xanh = nó đang nói. Liếc là biết, khỏi đọc.
 */
static void drawStateLabel(Emotion e) {
  if (!tft) return;

  // Chỉ đụng vào màn khi trạng thái ĐỔI THẬT. drawFace() còn chạy mỗi
  // lần chớp mắt (2,5-6 giây một lần), mà xoá dải 480x30 tốn ~11 ms
  // SPI — đúng loại chi phí mà cả hàm này được viết ra để né.
  if (e == nhanDaVe) return;
  nhanDaVe = e;

  // Chỉ còn cho màn tròn cũ — chế độ dải đã có `loopDai()` riêng.
  tft->fillRect(0, H - 30, W, 30, C_BG);

  const char* s;
  uint16_t col;
  switch (e) {
    case LISTENING:   // vàng — cùng màu, chỉ khác lời dặn
      s = kieuNghe == NGHE_GIU ? "THA TAY DE GUI" : kieuNghe == NGHE_CHAM ? "CHAM LAI DE GUI" : "DANG NGHE";
      col = 0xFFE0;
      break;
    case THINKING:  s = "DANG NGHI";  col = 0xFD20; break;  // cam
    case SPEAKING:  s = "DANG NOI";   col = C_DOT_OK; break;
    default:
      return;
  }
  tft->setTextColor(col, C_BG);
  tft->setTextSize(2);
  tft->setCursor(14, H - 26);
  tft->print(s);
}

// ─── Dải hai dòng: trạng thái + phụ đề (01/10/2026) ─────────

static TrangThai trangThai = RANH;
static int trangThaiDaVe = -1;
static bool dangNgu = false;
static uint32_t amLuongDenLuc = 0;   // đang hiện thanh âm lượng tới lúc này
static KieuNghe kieuDaVe = NGHE_TU_DO;

// Vạch sóng: 5 cột, mỗi cột là mức tiếng của một nhịp 70 ms trước —
// trông như sóng trôi, và nó NẢY THEO TIẾNG THẬT chứ không phải hoạt
// hình đóng sẵn: nghe thì theo mic (người ta thấy robot đang nghe mình),
// nói thì theo tiếng ra loa.
static int32_t mucSong = 0;
static uint8_t cotSong[5] = {0, 0, 0, 0, 0};
static uint32_t songLuc = 0;
static int songX = -1;     // mép trái ô sóng trên màn; -1 = trạng thái này không có sóng
static uint8_t nhipNghi = 0;

// Phụ đề
static String phuDeChu;
static bool phuDeNguoi = false;
static int phuDeDau = 0;          // byte đầu của trang đang hiện
static int phuDeHet = 0;          // byte cuối (không tính) của trang đang hiện
static uint32_t trangSauLuc = 0;  // lúc lật trang kế; 0 = không lật nữa
static uint32_t xoaPhuDeLuc = 0;  // rảnh đủ lâu thì xoá dòng dưới
static bool dong2Ban = true;      // dòng dưới cần vẽ lại

static const uint16_t C_NGHE = 0xFFE0;   // vàng — đến lượt bạn nói
static const uint16_t C_NGHI = 0xFD20;   // cam  — chờ đi, nó đang nghĩ
static const uint16_t C_NOI = 0x07E0;    // xanh — nó đang nói
static const uint16_t C_RANH = 0x7BEF;   // xám  — gợi ý, không tranh chỗ
static const uint16_t C_PHU_DE = 0xEF7D; // trắng ngà — chữ dài đọc đỡ chói
static const uint16_t C_BAN = 0xAD55;    // xám sáng — lời người dùng

static uint16_t mauTrangThai(TrangThai t) {
  if (t == RANH && dangNgu) return 0x4A69;   // xám tối — đang ngủ, đừng chói
  return t == NGHE ? C_NGHE : t == NGHI ? C_NGHI : t == NOI ? C_NOI : C_RANH;
}

static const char* chuTrangThai(TrangThai t) {
  switch (t) {
    case NGHE: return "ĐANG NGHE";
    case NGHI: return "ĐANG NGHĨ";
    case NOI:  return "ĐANG NÓI";
    default:   return dangNgu ? "ĐANG NGỦ" : "CHẠM ĐỂ NÓI";
  }
}

/** Dòng trên, ô giữa: chấm màu + chữ trạng thái (+ chỗ cho vạch sóng). */
static void veDong1() {
  const uint16_t mau = mauTrangThai(trangThai);
  const char* chu = chuTrangThai(trangThai);
  const bool coSong = trangThai != RANH;
  const int lw = chuViet::doRong(chu);
  const int tong = (coSong ? 18 : 0) + lw + (coSong ? 12 + 32 : 0);
  int x0 = O1_X + (O1_W - tong) / 2;
  if (x0 < O1_X) x0 = O1_X;
  const int y = yDong1();
  tft->fillRect(O1_X, y, O1_W, chuViet::caoDong(), C_BG);
  int xc = x0;
  if (coSong) {
    tft->fillCircle(x0 + 5, y + 17, 5, mau);
    xc += 18;
  }
  chuViet::ve(tft, xc, y, lw, chu, mau, C_BG);
  songX = coSong ? xc + lw + 12 : -1;
  memset(cotSong, 0, sizeof cotSong);
  songLuc = 0;
}

/** Vạch sóng (nghe/nói) hoặc ba chấm chạy (nghĩ), ~14 hình/giây. Ô nhỏ
 *  32×20 px nên mỗi lần vẽ chỉ vài trăm điểm — không làm loa đói đệm. */
static void veSong(uint32_t now) {
  if (songX < 0 || now - songLuc < 70) return;
  songLuc = now;
  const int y = yDong1() + 7, cao = 20;
  if (trangThai == NGHI) {
    nhipNghi = (nhipNghi + 1) % 12;
    const int sang = nhipNghi / 4;   // 0..2, mỗi chấm sáng ~280 ms
    for (int i = 0; i < 3; i++)
      tft->fillCircle(songX + 5 + i * 11, y + cao / 2, 3, i == sang ? C_NGHI : 0x4208);
    return;
  }
  // Mức → chiều cao, thang log như đồng tử của mắt (eyes.cpp) để tiếng
  // nhỏ vẫn nhúc nhích mà tiếng to không chạm trần mãi.
  const float m = mucSong <= 0 ? 0.0f : min(1.0f, logf(1.0f + mucSong / 4000.0f) / 4.8f);
  for (int i = 4; i > 0; i--) cotSong[i] = cotSong[i - 1];
  cotSong[0] = (uint8_t)(3 + m * (cao - 3));
  const uint16_t mau = mauTrangThai(trangThai);
  for (int i = 0; i < 5; i++) {
    const int x = songX + i * 7, h = cotSong[i];
    tft->fillRect(x, y, 4, cao - h, C_BG);
    tft->fillRect(x, y + cao - h, 4, h, mau);
  }
}

/** Lời dặn ở dòng dưới khi đang nghe sau một cú chạm. */
static const char* loiDanNghe() {
  return kieuNghe == NGHE_GIU ? "Thả tay ra để gửi"
       : kieuNghe == NGHE_CHAM ? "Nói xong thì chạm lần nữa để gửi"
       : "";
}

/** Tính trang đang hiện của phụ đề: [phuDeDau, phuDeHet). */
static void tinhTrang() {
  const char* c = phuDeChu.c_str();
  const int len = phuDeChu.length();
  if (phuDeDau >= len) { phuDeHet = len; return; }
  const int vua = chuViet::vuaDong(c + phuDeDau, o2W());
  phuDeHet = phuDeDau + (vua > 0 ? vua : len - phuDeDau);
}

static void veDong2() {
  dong2Ban = false;
  const int y = yDong2();
  const int w = o2W();
  if (phuDeChu.length()) {
    const char* c = phuDeChu.c_str();
    // Bỏ khoảng trắng đầu trang — chỗ ngắt dòng để lại.
    int dau = phuDeDau;
    while (dau < phuDeHet && c[dau] == ' ') dau++;
    chuViet::ve(tft, O2_X, y, w, c + dau, phuDeNguoi ? C_BAN : C_PHU_DE, C_BG, chuViet::GIUA,
                phuDeHet - dau);
    return;
  }
  const char* dan = trangThai == NGHE ? loiDanNghe() : "";
  chuViet::ve(tft, O2_X, y, w, dan, C_RANH, C_BG, chuViet::GIUA);
}

/** Lật trang phụ đề theo nhịp ĐỌC: ~60 ms mỗi byte (tiếng Việt ~1,2 byte
 *  một chữ, máy đọc ~14 chữ/giây), không nhanh hơn 1,6 giây một trang. */
static void henTrangSau(uint32_t now) {
  if (phuDeHet >= (int)phuDeChu.length()) {
    trangSauLuc = 0;
    return;
  }
  const uint32_t ms = max<uint32_t>(1600, (uint32_t)(phuDeHet - phuDeDau) * 60);
  trangSauLuc = now + ms;
  if (!trangSauLuc) trangSauLuc = 1;
}

static void loopDai(uint32_t now) {
  // Đang hiện thanh âm lượng (dòng dưới) thì đừng vẽ đè lên nó.
  const bool dangAmLuong = amLuongDenLuc && (int32_t)(now - amLuongDenLuc) < 0;
  if (!dangAmLuong && amLuongDenLuc) {
    amLuongDenLuc = 0;
    dong2Ban = true;
  }

  if ((int)trangThai != trangThaiDaVe) {
    trangThaiDaVe = trangThai;
    veDong1();
    // Lượt nghe mới: phụ đề của lượt trước không còn nghĩa gì. Và "Bạn: …"
    // chỉ sống lúc ĐANG NGHĨ — robot cất tiếng là xoá: người dùng không
    // muốn chữ chạy bên dưới lúc nó đang nói (01/10/2026).
    if ((trangThai == NGHE || (trangThai == NOI && phuDeNguoi)) && phuDeChu.length()) {
      phuDeChu = "";
      trangSauLuc = 0;
    }
    // Rảnh rồi thì để câu cuối nằm lại 4 giây cho người ta đọc nốt.
    xoaPhuDeLuc = trangThai == RANH && phuDeChu.length() ? now + 4000 : 0;
    dong2Ban = true;
  }
  if (kieuNghe != kieuDaVe) {
    kieuDaVe = kieuNghe;
    dong2Ban = true;
  }
  if (xoaPhuDeLuc && (int32_t)(now - xoaPhuDeLuc) >= 0) {
    xoaPhuDeLuc = 0;
    phuDeChu = "";
    trangSauLuc = 0;
    dong2Ban = true;
  }
  if (trangSauLuc && (int32_t)(now - trangSauLuc) >= 0) {
    phuDeDau = phuDeHet;
    tinhTrang();
    henTrangSau(now);
    dong2Ban = true;
  }
  if (dong2Ban && !dangAmLuong) veDong2();
  veSong(now);
}

void datTrangThai(TrangThai t) { trangThai = t; }

void datMuc(int32_t muc) { mucSong = muc; }

void datNgu(bool ngu) {
  if (ngu == dangNgu) return;
  dangNgu = ngu;
  trangThaiDaVe = -1;   // cùng là RANH nhưng chữ khác: vẽ lại dòng trên
}

void phuDe(const char* utf8, bool nguoiDung) {
  phuDeChu = utf8 ? utf8 : "";
  phuDeChu.trim();
  phuDeNguoi = nguoiDung;
  if (nguoiDung && phuDeChu.length()) phuDeChu = String("Bạn: ") + phuDeChu;
  phuDeDau = 0;
  tinhTrang();
  xoaPhuDeLuc = 0;
  henTrangSau(millis());
  dong2Ban = true;
}

static void drawFace() {
  // ⚠️ KHÔNG dùng fillScreen().
  //
  // Xoá cả màn 480x320 ở 20 MHz mất ~90 ms, mà đệm DMA của I2S chỉ
  // giữ được 128 ms tiếng. Nên mỗi lần chớp mắt là loa bị bỏ đói gần
  // cạn đệm — người dùng nghe thành tiếng "giật giật" đều đặn 3-6
  // giây một lần, đúng bằng nhịp chớp mắt.
  //
  // Chỉ xoá ba vùng thật sự đổi: hai hốc mắt và vùng miệng. Tổng diện
  // tích còn khoảng một phần tư, và quan trọng hơn là nó chia thành ba
  // lần ghi ngắn thay vì một lần dài.
  // Hai DẢI NGANG TRỌN CHIỀU RỘNG, không phải bốn ô rời.
  //
  // Bản đầu xoá hai ô quanh mắt và một ô quanh miệng — và để lại rác ở
  // đúng những khe không ai xoá: một vạch dọc 10 px giữa hai mắt, hai
  // dải hai bên mép, cùng dấu "?" của biểu cảm thinking nằm ngoài
  // vùng. Nhìn trên màn thì mặt đúng mà nền bẩn.
  //
  // Cắt vùng xoá để tiết kiệm thời gian là đúng hướng, nhưng cắt tới
  // mức không phủ hết những gì mình VẼ RA thì thành lỗi. Dải ngang
  // trọn chiều rộng vẫn nhanh hơn fillScreen ~40% mà không bỏ sót chỗ
  // nào.
  const int eyeTop = EYE_Y - EYE_H / 2 - 46;
  const int eyeH = EYE_H + 96;
  tft->fillRect(0, eyeTop, W, eyeH, C_BG);
  tft->fillRect(0, MOUTH_Y - 44, W, 96, C_BG);
  // Góc phải trên: chữ Z của sleepy và dấu ? của thinking nằm cao hơn
  // dải mắt, nên phải xoá riêng.
  tft->fillRect(W - 130, 0, 130, eyeTop > 0 ? eyeTop : 1, C_BG);

  const bool blink = blinking;
  uint16_t col = C_EYE;
  int ew = EYE_W, eh = EYE_H;
  float px = lookX, py = lookY;

  switch (emo) {
    case HAPPY:
      col = C_EYE;
      if (!blink) { eyeClosed(EYE_LX, EYE_W, col, true); eyeClosed(EYE_RX, EYE_W, col, true); }
      else { eyeClosed(EYE_LX, EYE_W, col, false); eyeClosed(EYE_RX, EYE_W, col, false); }
      arcThick(W / 2, MOUTH_Y, 150, 26, 12, true, col);  // miệng cười
      break;

    case SAD:
      eh = EYE_H - 26;
      py = 0.45f;
      if (blink) { eyeClosed(EYE_LX, EYE_W, col, false); eyeClosed(EYE_RX, EYE_W, col, false); }
      else { eyeOpen(EYE_LX, ew, eh, col, px, py); eyeOpen(EYE_RX, ew, eh, col, px, py); }
      brow(EYE_LX, 14, col);   // trong cao ngoài thấp
      brow(EYE_RX, -14, col);
      arcThick(W / 2, MOUTH_Y + 14, 130, 22, 10, false, col);  // miệng méo xuống
      break;

    case ANGRY:
      col = C_ANGRY;
      eh = EYE_H - 34;
      if (blink) { eyeClosed(EYE_LX, EYE_W, col, false); eyeClosed(EYE_RX, EYE_W, col, false); }
      else { eyeOpen(EYE_LX, ew, eh, col, px, py); eyeOpen(EYE_RX, ew, eh, col, px, py); }
      brow(EYE_LX, -20, col);  // chụm vào giữa
      brow(EYE_RX, 20, col);
      arcThick(W / 2, MOUTH_Y + 10, 120, 18, 10, false, col);
      break;

    case SURPRISED:
      ew = EYE_W + 16; eh = EYE_H + 24;
      eyeOpen(EYE_LX, ew, eh, col, px, py);
      eyeOpen(EYE_RX, ew, eh, col, px, py);
      tft->fillCircle(W / 2, MOUTH_Y + 6, 26, col);       // miệng chữ O
      tft->fillCircle(W / 2, MOUTH_Y + 6, 18, C_BG);
      break;

    case SLEEPY:
      col = C_EYE_DIM;
      eyeClosed(EYE_LX, EYE_W, col, false);
      eyeClosed(EYE_RX, EYE_W, col, false);
      arcThick(W / 2, MOUTH_Y, 70, 10, 8, false, col);
      // Chữ Z bay lên — dấu hiệu ai cũng đọc được ngay
      tft->setTextColor(col, C_BG);
      tft->setTextSize(2); tft->setCursor(392, 74);  tft->print("z");
      tft->setTextSize(3); tft->setCursor(412, 46);  tft->print("z");
      tft->setTextSize(4); tft->setCursor(438, 10);  tft->print("Z");
      break;

    case LOVE:
      eyeHeart(EYE_LX, EYE_H, C_LOVE);
      eyeHeart(EYE_RX, EYE_H, C_LOVE);
      arcThick(W / 2, MOUTH_Y, 140, 24, 12, true, C_LOVE);
      break;

    case THINKING:
      eh = EYE_H - 18;
      px = 0.8f; py = -0.5f;              // liếc lên trên bên phải
      eyeOpen(EYE_LX, ew, eh, col, px, py);
      eyeOpen(EYE_RX, ew, eh, col, px, py);
      brow(EYE_RX, -12, col);
      arcThick(W / 2 - 20, MOUTH_Y, 60, 6, 9, false, col);  // miệng lệch
      break;

    case CONFUSED:
      eyeOpen(EYE_LX, ew, eh - 20, col, -0.4f, 0.1f);
      eyeOpen(EYE_RX, ew + 10, eh + 10, col, 0.5f, -0.2f);   // hai mắt lệch cỡ
      brow(EYE_LX, 16, col);
      // Miệng lượn sóng — không có nét nào nói "khó hiểu" rõ bằng
      for (int i = -60; i <= 60; i += 2) {
        const int y = MOUTH_Y + (int)(9 * sinf(i / 14.0f));
        tft->fillRect(W / 2 + i, y, 2, 9, col);
      }
      break;

    case WINK:
      eyeClosed(EYE_LX, EYE_W, col, true);                  // nháy mắt trái
      eyeOpen(EYE_RX, ew, eh, col, px, py);
      arcThick(W / 2, MOUTH_Y, 140, 24, 12, true, col);
      break;

    case LISTENING:
      // Mắt mở to, con ngươi đứng yên giữa: "đang chú ý nghe".
      eyeOpen(EYE_LX, ew, eh, col, 0, 0);
      eyeOpen(EYE_RX, ew, eh, col, 0, 0);
      arcThick(W / 2, MOUTH_Y, 60, 4, 8, true, col);
      break;

    case SPEAKING:
      eyeOpen(EYE_LX, ew, eh - 14, col, px, py);
      eyeOpen(EYE_RX, ew, eh - 14, col, px, py);
      tft->fillRoundRect(W / 2 - 46, MOUTH_Y - 16, 92, 34, 16, col);  // miệng mở
      break;

    case NEUTRAL:
    default:
      if (blink) { eyeClosed(EYE_LX, EYE_W, col, false); eyeClosed(EYE_RX, EYE_W, col, false); }
      else { eyeOpen(EYE_LX, ew, eh, col, px, py); eyeOpen(EYE_RX, ew, eh, col, px, py); }
      arcThick(W / 2, MOUTH_Y, 96, 12, 9, true, col);
      break;
  }

  // Chấm trạng thái ở góc: nhỏ, không cướp sự chú ý khỏi khuôn mặt,
  // nhưng vẫn cho biết ngay robot có mạng và có server hay không.
  tft->fillCircle(W - 22, 16, 6, wifiOk ? C_DOT_OK : C_DOT_BAD);
  tft->fillCircle(W - 42, 16, 6, serverOk ? C_DOT_OK : C_DOT_BAD);
  drawClock();
  drawBattery();
  drawStateLabel(emo);

  drawnEmo = emo;
  drawnBlink = blink;
  drawnLX = (int)(lookX * 100);
  drawnLY = (int)(lookY * 100);
  dirty = false;
}

// ─── API ───────────────────────────────────────────────────

void hienAmLuong(int pct) {
  if (!tft || !chiDai) return;
  pct = constrain(pct, 0, 100);
  // Dòng dưới: "Âm lượng 35%" bên trái, thanh ngang bên phải, cả cụm ở giữa.
  char s[24];
  snprintf(s, sizeof s, "Âm lượng %d%%", pct);
  const int lw = chuViet::doRong(s);
  const int rong = 160, tong = lw + 16 + rong;
  const int x0 = (W - tong) / 2, y = yDong2();
  tft->fillRect(O2_X, y, o2W(), chuViet::caoDong(), C_BG);
  chuViet::ve(tft, x0, y, lw, s, TFT_WHITE, C_BG);
  const int bx = x0 + lw + 16, by = y + 13;
  tft->drawRect(bx, by, rong, 8, C_RANH);
  tft->fillRect(bx + 1, by + 1, (rong - 2) * pct / 100, 6, C_NOI);
  amLuongDenLuc = millis() + 1500;
  if (!amLuongDenLuc) amLuongDenLuc = 1;
}

void datNhanNghe(KieuNghe k) {
  if (k == kieuNghe) return;
  kieuNghe = k;
  nhanDaVe = (Emotion)255;   // cùng là LISTENING nhưng chữ khác: phải vẽ lại
}

void beginDai(Arduino_GFX* t, int yDai) {
  tft = t;
  if (!tft) return;
  chiDai = true;
  dY = yDai;
  W = tft->width();
  H = tft->height();
  // Xoá đúng dải của mình — phần trên là của hai mắt, chúng tự xoá ô
  // của chúng trong `eyes::begin()`.
  tft->fillRect(0, dY, W, H - dY, C_BG);
  nhanDaVe = (Emotion)255;   // ép nhãn vẽ lại ở vòng loop kế tiếp
  trangThaiDaVe = -1;        // … và cả hai dòng của dải
  dong2Ban = true;
  drawClock();
  drawBattery();
}

void begin(Arduino_GFX* t) {
  tft = t;
  // `nullptr` = chưa cắm màn ngực (xem `CO_MAN_NGUC` trong config.h).
  // Mọi hàm khác đã sẵn `if (!tft) return`, nên chỉ cần chặn ở đây là
  // cả module tự im lặng — không cần rải `#if` khắp nơi.
  if (!tft) return;
  // Xoá TOÀN màn đúng MỘT lần lúc khởi động. Sau đó chỉ xoá theo dải.
  // Không có dòng này thì rác lúc bật nguồn nằm lại vĩnh viễn ở những
  // chỗ khuôn mặt không đi qua — đúng dải sáng ở mép trên và mép trái
  // đã nhìn thấy trên màn thật.
  t->fillScreen(C_BG);
  W = tft->width();
  H = tft->height();
  EYE_LX = W * 29 / 100;
  EYE_RX = W * 71 / 100;
  EYE_Y = H * 37 / 100;
  MOUTH_Y = H * 76 / 100;
  nextBlinkAt = millis() + 2500;
  dirty = true;
}

/**
 * ⚠️ HAI ENUM PHẢI KHỚP 12 GIÁ TRỊ ĐẦU.
 *
 * `face::Emotion` (màn ngực) và `eyes::Expr` (hai mắt) khai cùng 12 tên
 * theo cùng thứ tự, nên ép kiểu thẳng là đúng. Ai thêm một giá trị vào
 * GIỮA một trong hai bảng sẽ làm lệch toàn bộ phần còn lại — và triệu
 * chứng là mặt vẫn có biểu cảm, chỉ là SAI biểu cảm, kiểu lỗi khó ngờ
 * nhất. Mấy dòng dưới bắt nó ngay lúc biên dịch.
 */
static_assert((int)NEUTRAL   == (int)eyes::NEUTRAL   && (int)HAPPY     == (int)eyes::HAPPY &&
              (int)SAD       == (int)eyes::SAD       && (int)ANGRY     == (int)eyes::ANGRY &&
              (int)SURPRISED == (int)eyes::SURPRISED && (int)SLEEPY    == (int)eyes::SLEEPY &&
              (int)LOVE      == (int)eyes::LOVE      && (int)THINKING  == (int)eyes::THINKING &&
              (int)CONFUSED  == (int)eyes::CONFUSED  && (int)WINK      == (int)eyes::WINK &&
              (int)LISTENING == (int)eyes::LISTENING && (int)SPEAKING  == (int)eyes::SPEAKING,
              "face::Emotion va eyes::Expr da lech thu tu");

void set(Emotion e, uint32_t ms) {
  if (ms == 0) baseEmo = e;
  emo = e;
  emoUntil = ms ? millis() + ms : 0;
  dirty = true;

  // ⚠️ CHUYỂN TIẾP TỚI HAI MẮT NGAY TẠI ĐÂY, không phải ở chỗ gọi.
  //
  // `main.cpp` gọi `face::set()` từ tám chỗ khác nhau (nghe xong, nghĩ
  // xong, nói xong, chạm đầu, lệnh từ server…). Thêm một dòng
  // `eyes::set()` cạnh mỗi chỗ thì chỉ cần quên một chỗ là mắt và mặt
  // ngực nói hai chuyện khác nhau — mà không có gì báo lỗi.
  //
  // Chặn ở đây thì không thể sót. Cùng lý do với `catTheoByte()` đặt ở
  // chỗ nghẽn thay vì ở tám nơi gọi.
  eyes::set((eyes::Expr)e, ms);
}

void setByName(const char* name, uint32_t ms) {
  struct { const char* n; Emotion e; } map[] = {
      {"neutral", NEUTRAL},   {"happy", HAPPY},         {"sad", SAD},
      {"angry", ANGRY},       {"surprised", SURPRISED}, {"sleepy", SLEEPY},
      {"love", LOVE},         {"thinking", THINKING},   {"confused", CONFUSED},
      {"wink", WINK},
  };
  for (auto& m : map)
    if (!strcmp(name, m.n)) { set(m.e, ms); return; }

  // Tên màn ngực không biết vẫn đưa xuống mắt: bảng của mắt rộng hơn
  // (28 tên, có scanning/charging/dizzy/excited…). Server thêm biểu cảm
  // mới thì mắt hiện được ngay, màn ngực giữ nguyên mặt cũ.
  eyes::setByName(name, ms);
}

void look(float x, float y) {
  lookTargetX = constrain(x, -1.0f, 1.0f);
  lookTargetY = constrain(y, -1.0f, 1.0f);
  eyes::look(x, y);
}

void setStatus(bool w, bool s) {
  if (w != wifiOk || s != serverOk) {
    wifiOk = w;
    serverOk = s;
    // Chế độ dải KHÔNG vẽ hai chấm: góc trên phải lúc này là ô của mắt
    // phải, vẽ vào đó là đè lên ống kính. Hai chấm WiFi/máy chủ đã có sẵn
    // ở rìa dưới mắt trái — `eyes.cpp` vẽ chúng.
    if (tft && !chiDai) {
      tft->fillCircle(W - 22, 16, 6, wifiOk ? C_DOT_OK : C_DOT_BAD);
      tft->fillCircle(W - 42, 16, 6, serverOk ? C_DOT_OK : C_DOT_BAD);
    }
  }
  eyes::setStatus(w, s);
}

void setClock(const char* hhmm) {
  if (!hhmm) hhmm = "";
  if (!strcmp(hhmm, clockTxt)) return;   // chưa sang phút mới thì thôi
  strncpy(clockTxt, hhmm, sizeof(clockTxt) - 1);
  clockTxt[sizeof(clockTxt) - 1] = 0;
  drawClock();
}

void setBattery(int pct) {
  eyes::setBattery(pct);
  if (pct == batPct) return;
  batPct = pct;
  drawBattery();
}

Emotion current() { return emo; }
Emotion base() { return baseEmo; }

void loop() {
  if (!tft) return;
  const uint32_t now = millis();

  // Hết hạn biểu cảm tạm → về nền
  if (emoUntil && now > emoUntil) {
    emoUntil = 0;
    emo = baseEmo;
    dirty = true;
  }

  // Chế độ dải: chớp mắt và đảo mắt là việc của `eyes`, ở đây chỉ còn
  // nhãn NGHE/NGHĨ/NÓI — và nó tự bỏ qua khi chưa đổi, nên gọi mỗi vòng
  // chỉ tốn một phép so sánh.
  if (chiDai) {
    loopDai(now);
    return;
  }

  // Chớp mắt. Khoảng cách ngẫu nhiên 3-6 giây — chớp đều tăm tắp
  // trông như máy đếm nhịp chứ không như sinh vật.
  if (!blinking && now > nextBlinkAt) {
    blinking = true;
    blinkUntil = now + 110;
    dirty = true;
  } else if (blinking && now > blinkUntil) {
    blinking = false;
    nextBlinkAt = now + 3000 + (esp_random() % 3000);
    dirty = true;
  }

  // Con ngươi trôi nhẹ về đích. Nhảy cóc trông giật; trôi dần trông sống.
  if (fabsf(lookX - lookTargetX) > 0.02f || fabsf(lookY - lookTargetY) > 0.02f) {
    lookX += (lookTargetX - lookX) * 0.25f;
    lookY += (lookTargetY - lookY) * 0.25f;
    if ((int)(lookX * 100) != drawnLX || (int)(lookY * 100) != drawnLY) dirty = true;
  }

  if (dirty || emo != drawnEmo || blinking != drawnBlink) drawFace();
}

}  // namespace face
