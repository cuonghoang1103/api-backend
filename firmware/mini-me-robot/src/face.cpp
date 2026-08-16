#include "face.h"

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

// Đồng hồ góc trên TRÁI — chấm trạng thái ở góc phải nên không đè nhau.
// Xoá đúng ô chữ rồi vẽ đè, KHÔNG fillScreen: khuôn mặt đang nằm đó và
// xoá cả màn mỗi phút thì thành nháy đèn.
static void drawClock() {
  if (!tft) return;
  tft->fillRect(8, 6, 64, 20, C_BG);
  if (!clockTxt[0]) return;
  tft->setTextColor(C_EYE_DIM, C_BG);
  tft->setTextSize(2);
  tft->setCursor(8, 6);
  tft->print(clockTxt);
}

// Pin ngay cạnh đồng hồ. Màu mang thông tin chứ không để trang trí —
// liếc một cái là biết còn nhiều hay sắp chết, khỏi cần đọc số.
static void drawBattery() {
  if (!tft) return;
  tft->fillRect(78, 6, 54, 20, C_BG);
  if (batPct < 0) return;
  const uint16_t col = batPct > 50 ? C_DOT_OK : (batPct > 20 ? 0xFD20 : C_DOT_BAD);
  tft->setTextColor(col, C_BG);
  tft->setTextSize(2);
  tft->setCursor(78, 6);
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
  static Emotion daVe = (Emotion)255;
  if (e == daVe) return;
  daVe = e;

  tft->fillRect(0, H - 30, W, 30, C_BG);

  const char* s;
  uint16_t col;
  switch (e) {
    case LISTENING: s = "DANG NGHE";  col = 0xFFE0; break;  // vàng
    case THINKING:  s = "DANG NGHI";  col = 0xFD20; break;  // cam
    case SPEAKING:  s = "DANG NOI";   col = C_DOT_OK; break;
    default: return;                                        // rảnh thì để trống
  }
  tft->setTextColor(col, C_BG);
  tft->setTextSize(2);
  tft->setCursor(14, H - 26);
  tft->print(s);
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

void begin(Arduino_GFX* t) {
  tft = t;
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
    if (tft) {
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

void loop() {
  if (!tft) return;
  const uint32_t now = millis();

  // Hết hạn biểu cảm tạm → về nền
  if (emoUntil && now > emoUntil) {
    emoUntil = 0;
    emo = baseEmo;
    dirty = true;
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
