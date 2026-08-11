/**
 * ============================================================
 * Mini-Me Robot — CHẶNG B: robot nghe và trả lời
 * ============================================================
 *
 * Chặng A đã chứng minh đường truyền hai chiều thông. Chặng này nối
 * tiếng vào hai đầu đó:
 *
 *   mic INMP441 ──I2S0──► VAD ──► khung nhị phân ──► server
 *                                                      │
 *                                          Whisper → LLM → TTS
 *                                                      │
 *   loa MAX98357A ◄──I2S1── đệm PSRAM ◄── PCM 16 kHz ◄──┘
 *
 * Hai điều đáng nói về màn hình ở chặng này:
 *
 * 1. Chặng A vẽ lại CẢ BẢY vùng mỗi giây bất kể có đổi hay không —
 *    mắt thấy rõ cái giật mỗi nhịp. Giờ mỗi ô nhớ chuỗi nó đang hiện
 *    và chỉ vẽ lại khi khác. Đứng yên thì màn hình đứng yên thật.
 * 2. Cú xả SPI mỗi giây đó còn làm sụt nguồn 3V3, và MAX98357A ở
 *    chặng A chưa có driver I2S nào nên ba chân của nó thả nổi và
 *    khuếch đại đúng cú sụt ấy thành tiếng rè theo nhịp. `audio::begin()`
 *    cài driver rồi xoá đệm DMA — amp nhận dòng số 0 liên tục và im
 *    thật. Xem chú thích trong `audio.cpp`.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <TFT_eSPI.h>
#include <esp_heap_caps.h>

#include "audio.h"
#include "face.h"
#include "ota.h"
#include "config.h"
#include "secrets.h"

static TFT_eSPI tft = TFT_eSPI();
static WebSocketsClient ws;

// ─── Trạng thái ────────────────────────────────────────────
enum Mode : uint8_t { MODE_IDLE, MODE_HEAR, MODE_THINK, MODE_TALK };

struct State {
  bool wifiUp = false;
  bool wsUp = false;
  String ip = "-";
  int rssi = 0;
  uint32_t uptimeSec = 0;
  uint32_t cmdCount = 0;
  String lastCmd = "-";
  String lastNote = "khoi dong...";
  Mode mode = MODE_IDLE;
  String heard = "-";   // câu server nghe được
  String said = "-";    // câu robot vừa nói
  uint32_t turns = 0;
} st;

static uint32_t lastTelemetryMs = 0;
static uint32_t lastUiMs = 0;
static uint32_t thinkSinceMs = 0;
// Đã chào chưa — chỉ chào một lần mỗi lần khởi động, không phải mỗi
// lần nối lại WebSocket.
static bool greeted = false;

// ─── Người gác ─────────────────────────────────────────────
// Một tác vụ RIÊNG, in mỗi giây bất kể loop() đang làm gì.
//
// Vì sao cần: khi loop() kẹt trong một lời gọi chặn, mọi thứ in từ
// bên trong loop() cũng kẹt theo — triệu chứng là serial im hoàn
// toàn, và im lặng thì không phân biệt được "kẹt ở mạng" với "kẹt ở
// I2S". Người gác đứng ngoài nên nó vẫn nói được, và nó nói đúng cái
// cần biết: loop() dừng lại ở CHẶNG NÀO.
static volatile const char* gStage = "boot";
static volatile uint32_t gLoops = 0;

static void watchTask(void*) {
  const char* last = "";
  uint32_t stuckSec = 0;
  uint32_t lastLoops = 0;
  for (;;) {
    // Đứng yên ở một chặng KHÔNG có nghĩa là kẹt — loop() nằm ở chặng
    // `audio` phần lớn thời gian là chuyện bình thường (mỗi lượt đọc
    // mic chờ đúng một khối 16 ms). Thứ phân biệt được là SỐ VÒNG: nó
    // không tăng thì mới là kẹt thật.
    const char* s = (const char*)gStage;
    const uint32_t loops = gLoops;
    stuckSec = (loops == lastLoops) ? stuckSec + 1 : 0;
    last = s;
    lastLoops = loops;
    if (stuckSec >= 2)
      Serial.printf("[gac] KET THAT o chang=%s, %lu giay khong quay duoc vong nao\n", s,
                    (unsigned long)stuckSec);
    vTaskDelay(pdMS_TO_TICKS(1000));
  }
}

// ─── Bỏ dấu tiếng Việt để hiện lên màn ─────────────────────
// Phông GLCD/Font2 của TFT_eSPI chỉ có ASCII. Đưa thẳng UTF-8 vào thì
// mỗi chữ có dấu hiện ra hai ô vuông rác. Câu robot nghe/nói là thứ
// đáng nhìn nhất trên màn này, nên bỏ dấu còn hơn bỏ luôn.

static char viBase(uint32_t cp) {
  if (cp < 0x80) return (char)cp;

  // Khối chính của tiếng Việt: từng CẶP hoa/thường liền nhau, nên chỉ
  // cần biết dải và xét chẵn/lẻ.
  if (cp >= 0x1EA0 && cp <= 0x1EF9) {
    const char* b;
    if (cp <= 0x1EB7) b = "Aa";
    else if (cp <= 0x1EC7) b = "Ee";
    else if (cp <= 0x1ECB) b = "Ii";
    else if (cp <= 0x1EE3) b = "Oo";
    else if (cp <= 0x1EF1) b = "Uu";
    else b = "Yy";
    return b[cp & 1];
  }

  switch (cp) {
    case 0x0102: return 'A';  case 0x0103: return 'a';   // Ă ă
    case 0x0110: return 'D';  case 0x0111: return 'd';   // Đ đ
    case 0x0128: return 'I';  case 0x0129: return 'i';   // Ĩ ĩ
    case 0x0168: return 'U';  case 0x0169: return 'u';   // Ũ ũ
    case 0x01A0: return 'O';  case 0x01A1: return 'o';   // Ơ ơ
    case 0x01AF: return 'U';  case 0x01B0: return 'u';   // Ư ư
    default: break;
  }

  if (cp >= 0xC0 && cp <= 0xC5) return 'A';
  if (cp == 0xC8 || (cp >= 0xC9 && cp <= 0xCB)) return 'E';
  if (cp >= 0xCC && cp <= 0xCF) return 'I';
  if (cp == 0xD0) return 'D';
  if (cp >= 0xD2 && cp <= 0xD6) return 'O';
  if (cp >= 0xD9 && cp <= 0xDC) return 'U';
  if (cp == 0xDD) return 'Y';
  if (cp >= 0xE0 && cp <= 0xE5) return 'a';
  if (cp >= 0xE8 && cp <= 0xEB) return 'e';
  if (cp >= 0xEC && cp <= 0xEF) return 'i';
  if (cp == 0xF0) return 'd';
  if (cp >= 0xF2 && cp <= 0xF6) return 'o';
  if (cp >= 0xF9 && cp <= 0xFC) return 'u';
  if (cp == 0xFD || cp == 0xFF) return 'y';

  return '?';
}

static String deaccent(const String& in, size_t maxLen) {
  String out;
  out.reserve(in.length());
  size_t i = 0;
  const size_t n = in.length();
  while (i < n && out.length() < maxLen) {
    const uint8_t c = (uint8_t)in[i];
    uint32_t cp;
    if (c < 0x80) {
      cp = c;
      i += 1;
    } else if ((c & 0xE0) == 0xC0 && i + 1 < n) {
      cp = ((uint32_t)(c & 0x1F) << 6) | ((uint8_t)in[i + 1] & 0x3F);
      i += 2;
    } else if ((c & 0xF0) == 0xE0 && i + 2 < n) {
      cp = ((uint32_t)(c & 0x0F) << 12) | (((uint8_t)in[i + 1] & 0x3F) << 6) |
           ((uint8_t)in[i + 2] & 0x3F);
      i += 3;
    } else {
      i += 1;
      continue;  // byte hỏng — bỏ qua, đừng để lệch cả câu
    }
    out += viBase(cp);
  }
  return out;
}

// ─── Màn hình ──────────────────────────────────────────────

#define C_BG      TFT_BLACK
#define C_TITLE   TFT_GREEN
#define C_LABEL   TFT_DARKGREY
#define C_VALUE   TFT_WHITE
#define C_OK      TFT_GREEN
#define C_WARN    TFT_ORANGE
#define C_BAD     TFT_RED
#define C_ACCENT  TFT_CYAN
#define C_YOU     TFT_YELLOW

#define UI_ROWS   7
#define UI_Y0     46
#define UI_DY     20
#define UI_VALX   92

// Bộ nhớ đệm của màn: ô nào đang hiện chuỗi gì. Đây là toàn bộ bí
// quyết chống nháy — không có nó thì mỗi giây cả bảng bị xoá và vẽ lại.
static String uiShown[UI_ROWS];
static uint16_t uiShownColor[UI_ROWS];
static String uiNoteShown, uiHeardShown, uiSaidShown, uiModeShown;
static int uiBarShown = -1;

static void uiInvalidate() {
  for (int i = 0; i < UI_ROWS; i++) {
    uiShown[i] = "";
    uiShownColor[i] = 0;
  }
  uiNoteShown = uiHeardShown = uiSaidShown = uiModeShown = "";
  uiBarShown = -1;
}

static void uiFrame() {
  tft.fillScreen(C_BG);

  tft.setTextColor(C_TITLE, C_BG);
  tft.setTextSize(2);
  tft.setCursor(12, 8);
  tft.print("MINI-ME ROBOT");

  tft.setTextSize(1);
  tft.setTextColor(C_LABEL, C_BG);
  tft.setCursor(tft.width() - 96, 14);
  tft.print("chang B");

  tft.drawFastHLine(12, 32, tft.width() - 24, C_LABEL);

  const char* labels[UI_ROWS] = {"WiFi", "IP", "Song", "Server",
                                 "Uptime", "Lenh", "Luot noi"};
  for (int i = 0; i < UI_ROWS; i++) {
    tft.setTextColor(C_LABEL, C_BG);
    tft.setCursor(12, UI_Y0 + i * UI_DY);
    tft.print(labels[i]);
    tft.setCursor(80, UI_Y0 + i * UI_DY);
    tft.print(":");
  }

  const int yAudio = UI_Y0 + UI_ROWS * UI_DY + 6;
  tft.drawFastHLine(12, yAudio, tft.width() - 24, C_LABEL);
  tft.setTextColor(C_LABEL, C_BG);
  tft.setCursor(12, yAudio + 10);
  tft.print("Mic");

  tft.setCursor(12, yAudio + 40);
  tft.print("Ban noi");
  tft.setCursor(12, yAudio + 58);
  tft.print("Robot");
  tft.setCursor(12, yAudio + 80);
  tft.print("Ghi chu");

  uiInvalidate();
}

static int uiAudioTop() { return UI_Y0 + UI_ROWS * UI_DY + 6; }

/** Ghi giá trị vào một dòng — bỏ qua nếu chuỗi và màu không đổi. */
static void uiValue(int row, const String& text, uint16_t color) {
  if (uiShown[row] == text && uiShownColor[row] == color) return;
  uiShown[row] = text;
  uiShownColor[row] = color;

  const int y = UI_Y0 + row * UI_DY;
  tft.fillRect(UI_VALX, y, tft.width() - UI_VALX - 12, 9, C_BG);
  tft.setTextSize(1);
  tft.setTextColor(color, C_BG);
  tft.setCursor(UI_VALX, y);
  tft.print(text);
}

/** Một dòng chữ tự do, cũng chỉ vẽ lại khi đổi. */
static void uiLine(int y, const String& text, uint16_t color, String& cache) {
  if (cache == text) return;
  cache = text;
  tft.fillRect(78, y, tft.width() - 90, 9, C_BG);
  tft.setTextSize(1);
  tft.setTextColor(color, C_BG);
  tft.setCursor(78, y);
  tft.print(text);
}

/** Thanh mức mic — chia 30 nấc để đứng yên khi phòng yên. */
static void uiLevelBar() {
  const int x = 78, y = uiAudioTop() + 10, w = tft.width() - 90, h = 8;

  int step;
  if (audio::speaking()) {
    step = -1;  // đang nói: mic câm, vẽ vạch riêng
  } else {
    const int32_t lv = audio::level();
    step = (int)((int64_t)lv * 30 / (VAD_THRESHOLD * 6));
    if (step > 30) step = 30;
    if (step < 0) step = 0;
  }
  if (step == uiBarShown) return;
  uiBarShown = step;

  tft.fillRect(x, y, w, h, C_BG);
  if (step < 0) {
    tft.drawRect(x, y, w, h, C_LABEL);
    return;
  }
  // Vạch ngưỡng VAD: qua vạch này là robot bắt đầu ghi âm.
  const int gate = 30 / 6;
  tft.drawFastVLine(x + w * gate / 30, y - 2, h + 4, C_WARN);
  if (step) {
    const int fill = w * step / 30;
    tft.fillRect(x, y, fill, h, step > gate ? C_OK : C_LABEL);
  }
}

static void uiMode() {
  String s;
  uint16_t c;
  switch (st.mode) {
    case MODE_HEAR:  s = "DANG NGHE";  c = C_YOU;    break;
    case MODE_THINK: s = "DANG NGHI";  c = C_WARN;   break;
    case MODE_TALK:  s = String("DANG NOI  ") + audio::volume() + "%"; c = C_ACCENT; break;
    default:         s = "cho...";     c = C_LABEL;  break;
  }
  if (uiModeShown == s) return;
  uiModeShown = s;
  const int y = uiAudioTop() + 24;
  tft.fillRect(78, y, tft.width() - 90, 9, C_BG);
  tft.setTextSize(1);
  tft.setTextColor(c, C_BG);
  tft.setCursor(78, y);
  tft.print(s);
}

static void uiRefresh() {
  uiValue(0, st.wifiUp ? String(WIFI_SSID) : String("dang tim..."),
          st.wifiUp ? C_OK : C_WARN);
  uiValue(1, st.ip, C_VALUE);
  uiValue(2, st.wifiUp ? String(st.rssi) + " dBm" : String("-"),
          st.rssi > -70 ? C_OK : C_WARN);
  uiValue(3, st.wsUp ? String("ONLINE") : String("dang noi..."),
          st.wsUp ? C_OK : C_WARN);

  char up[24];
  snprintf(up, sizeof(up), "%lu:%02lu:%02lu",
           st.uptimeSec / 3600, (st.uptimeSec / 60) % 60, st.uptimeSec % 60);
  uiValue(4, String(up), C_VALUE);
  uiValue(5, String(st.cmdCount) + "  (" + st.lastCmd + ")", C_ACCENT);
  uiValue(6, String(st.turns), C_ACCENT);

  const int top = uiAudioTop();
  uiLine(top + 40, st.heard, C_YOU, uiHeardShown);
  uiLine(top + 58, st.said, C_ACCENT, uiSaidShown);
  uiLine(top + 80, st.lastNote, st.wsUp ? C_ACCENT : C_WARN, uiNoteShown);
  uiMode();
}

/** Chấm tròn báo còn sống. Nhỏ, ở góc, không phải cái gây giật. */
static void uiHeartbeat() {
  static bool on = false;
  on = !on;
  tft.fillCircle(tft.width() - 22, 16, 5,
                 st.wsUp ? (on ? C_OK : C_BG) : (on ? C_BAD : C_BG));
}

// ─── Gửi lên server ────────────────────────────────────────

static void sendHello() {
  StaticJsonDocument<256> doc;
  doc["t"] = "hello";
  doc["fw"] = FW_VERSION;
  doc["ip"] = WiFi.localIP().toString();
  doc["rssi"] = WiFi.RSSI();
  // Khai báo bo này phát được PCM thô. Server sẽ dùng ffmpeg đổi MP3
  // sang PCM 16 kHz trước khi gửi — bo chỉ việc đẩy byte vào I2S, khỏi
  // cần thư viện giải mã nào.
  doc["audio"] = "pcm";
  String out;
  serializeJson(doc, out);
  ws.sendTXT(out);
}

static void sendLog(const char* level, const String& msg) {
  StaticJsonDocument<256> doc;
  doc["t"] = "log";
  doc["level"] = level;
  doc["msg"] = msg;
  String out;
  serializeJson(doc, out);
  ws.sendTXT(out);
}

static void sendTelemetry() {
  StaticJsonDocument<256> doc;
  doc["t"] = "telemetry";
  doc["rssi"] = WiFi.RSSI();
  doc["uptime"] = millis() / 1000;
  doc["heapKb"] = ESP.getFreeHeap() / 1024;
  doc["psramKb"] = ESP.getFreePsram() / 1024;
  doc["micLevel"] = audio::level();
  doc["turns"] = st.turns;
  String out;
  serializeJson(doc, out);
  ws.sendTXT(out);
}

static void sendAck(uint32_t id, bool ok, const char* err = nullptr) {
  StaticJsonDocument<192> doc;
  doc["t"] = "ack";
  doc["id"] = id;
  doc["ok"] = ok;
  if (err) doc["error"] = err;
  String out;
  serializeJson(doc, out);
  ws.sendTXT(out);
}

// ─── Đường tiếng đi lên ────────────────────────────────────
//
// audio.cpp trả về từng khối 16 ms (512 byte). Gửi ngay từng khối là
// ~62 khung WebSocket mỗi giây, mỗi khung cõng thêm phần đầu TLS —
// tốn băng thông vào phần bao bì chứ không phải tiếng nói. Gom bốn
// khối thành 2 KB rồi mới gửi: còn ~15 khung/giây, độ trễ thêm 64 ms,
// không tai nào nghe ra.

static uint8_t upBuf[2048];
static size_t upLen = 0;
// Số liệu một lượt nghe, gửi kèm log lên server. Không có nó thì lúc
// robot không nghe ra câu nào ta chỉ đoán được là "mic hỏng" hay
// "Whisper kém" — mà hai thứ đó sửa theo hai hướng ngược nhau.
static uint32_t upBytes = 0;
static int32_t upPeak = 0;
static uint32_t upStartMs = 0;

static void upFlush() {
  if (!upLen) return;
  if (st.wsUp) ws.sendBIN(upBuf, upLen);
  upBytes += upLen;
  upLen = 0;
}

static void onTurnStart() {
  upLen = 0;
  upBytes = 0;
  upPeak = 0;
  upStartMs = millis();
  st.mode = MODE_HEAR;
  st.lastNote = "nghe thay tieng noi";
  face::set(face::LISTENING);
  if (st.wsUp) ws.sendTXT("{\"t\":\"audio_start\"}");
}

static void onChunk(const uint8_t* data, size_t len) {
  const int32_t lv = audio::level();
  if (lv > upPeak) upPeak = lv;
  while (len) {
    const size_t room = sizeof(upBuf) - upLen;
    const size_t take = len < room ? len : room;
    memcpy(upBuf + upLen, data, take);
    upLen += take;
    data += take;
    len -= take;
    if (upLen == sizeof(upBuf)) upFlush();
  }
}

static void onTurnEnd() {
  upFlush();

  // "Nghe rồi." Phát NGAY, trước cả khi gói tin rời ăng-ten — vì thứ
  // cần khẳng định là mic đã bắt được, và bo tự biết điều đó.
  //
  // ⚠️ TIẾNG BÍP XÁC NHẬN ĐÃ TẮT — người dùng thấy ồn.
  //
  // Ý tưởng đúng (báo "nghe rồi" để khỏi phải hỏi lại) nhưng thực tế
  // sai: VAD kích nhầm bao nhiêu lần thì bíp bấy nhiêu lần, và một
  // tiếng động lặp đi lặp lại trong phòng khó chịu hơn nhiều so với
  // vài giây im lặng chờ câu trả lời.
  //
  // Tín hiệu "nghe rồi" vẫn còn, chỉ là ở dạng KHÔNG gây ồn: màn hình
  // 3.5" đổi sang "DANG NGHE" rồi "DANG NGHI". Nhìn là biết, mà không
  // ai phải nghe thêm cái gì.
  //
  // Muốn bật lại thì bỏ chú thích khối dưới:
  //   static uint32_t lastBeepMs = 0;
  //   if (millis() - lastBeepMs > 4000) { lastBeepMs = millis(); audio::beep(1047, 55, 35); }

  st.mode = MODE_THINK;
  thinkSinceMs = millis();
  st.lastNote = "dang cho server tra loi";
  face::set(face::THINKING);
  if (st.wsUp) {
    ws.sendTXT("{\"t\":\"audio_end\"}");
    const uint32_t ms = millis() - upStartMs;
    sendLog("info", String("nghe: ") + (upBytes / 1024) + " KB / " + (ms / 100) / 10.0 +
                        " giay, dinh=" + upPeak + " (nguong " + VAD_THRESHOLD + ")");
  }
}

// ─── Lệnh từ server ────────────────────────────────────────

static void handleCommand(JsonDocument& doc) {
  const uint32_t id = doc["id"] | 0;
  const char* type = doc["type"] | "";

  st.cmdCount++;
  st.lastCmd = String(type);

  if (!strcmp(type, "face")) {
    const char* emo = doc["payload"]["emotion"] | "neutral";
    const uint32_t ms = doc["payload"]["ms"] | 3000;
    face::setByName(emo, ms);
    st.lastNote = String("bieu cam: ") + emo;
    sendAck(id, true);
    return;
  }

  if (!strcmp(type, "look")) {
    face::look(doc["payload"]["x"] | 0.0f, doc["payload"]["y"] | 0.0f);
    sendAck(id, true);
    return;
  }

  if (!strcmp(type, "volume")) {
    const int lv = doc["payload"]["level"] | 100;
    audio::setVolume((uint8_t)lv);
    st.lastNote = String("am luong ") + audio::volume() + "%";
    sendAck(id, true);
    sendLog("info", String("dat am luong ") + audio::volume() + "%");
    return;
  }

  if (!strcmp(type, "reboot")) {
    sendAck(id, true);
    sendLog("warn", "Dang khoi dong lai theo yeu cau");
    delay(300);
    ESP.restart();
    return;
  }

  if (!strcmp(type, "ota")) {
    // Trả lời TRƯỚC khi bắt đầu. `ota::capNhat` chặn luồng vài chục
    // giây rồi khởi động lại — không có cơ hội trả lời sau, và web sẽ
    // ngồi chờ một cái ack không bao giờ tới.
    sendAck(id, true);

    // Câm mồm trước khi nạp. Đang phát dở mà ghi flash là hai việc
    // nặng tranh nhau: vòng đệm 512 KB ở PSRAM, hai đường DMA, cộng
    // TLS tải về — chuốc lỗi ở đúng chỗ khó truy nhất.
    audio::playStop();

    const char* muon = doc["cmd"]["payload"]["version"] | (const char*)nullptr;
    sendLog("warn", "Bat dau cap nhat firmware qua WiFi");
    face::set(face::THINKING);

    // ⚠️ `batDauNen`, KHÔNG phải `capNhat`.
    //
    // Gọi thẳng `capNhat()` ở đây thì nó chạy trên ngăn xếp 8 KB của
    // tác vụ loop(), và bắt tay TLS làm tràn ngăn xếp → bo reset sau 5
    // giây, quay về bản cũ, không một dòng lỗi. Đã dính đúng hai lần
    // ngày 11/08 trước khi tìm ra. Xem ghi chú dài trong ota.h.
    ota::batDauNen(muon);
    return;
  }

  // Động cơ, servo, mắt LED vẫn chưa có phần cứng — ghi nhận và nói rõ.
  sendAck(id, true);
  sendLog("info", String("chang B: ghi nhan lenh '") + type +
                      "' (chua co phan cung de thuc thi)");
}

static void handleSayStart(JsonDocument& doc) {
  const char* mime = doc["mime"] | "";
  const uint32_t rate = doc["sampleRate"] | 16000;

  // Bo đã khai báo `audio:"pcm"` nên server luôn gửi PCM. Nếu vẫn nhận
  // MP3 thì hoặc server cũ, hoặc ffmpeg trên VPS hỏng và nó đã lùi về
  // MP3 — nói thẳng ra chứ đừng phát ra tiếng rác.
  if (strstr(mime, "mpeg")) {
    st.lastNote = "server gui MP3 - bo khong giai ma duoc";
    sendLog("warn", "nhan MP3 nhung firmware chi phat duoc PCM");
    return;
  }

  st.mode = MODE_TALK;
  st.lastNote = "dang nhan tieng noi";
  face::set(face::SPEAKING);
  audio::playBegin(rate);
}

static void handleSayEnd() {
  audio::playEnd();
  st.turns++;
  const uint32_t kb = audio::lastClipBytes() / 1024;
  st.lastNote = String("da noi ") + kb + " KB";
  sendLog("info", String("noi: ") + kb + " KB = " + (audio::lastClipBytes() / 32000) +
                      "s | hut dem " + audio::lastUnderruns() + " lan / " +
                      audio::lastUnderrunMs() + " ms");
}

static void onWsEvent(WStype_t type, uint8_t* payload, size_t len) {
  switch (type) {
    case WStype_CONNECTED:
      st.wsUp = true;
      st.lastNote = "da noi server";
      Serial.println("[ws] connected");
      sendHello();
      sendLog("info", "Mini-Me chang B: da co tai va mieng");
      ws.enableHeartbeat(15000, 3000, 2);

      // Chào một câu ngay khi lên mạng — MỘT LẦN mỗi lần khởi động.
      //
      // Đây là phép thử toàn tuyến rẻ nhất có thể: một lượt nói đi qua
      // đúng những mắt xích mà mic không kiểm được — LLM, TTS, đổi
      // sang PCM, truyền nhị phân, I2S ra loa. Nghe thấy tiếng là cả
      // chuỗi thông; im lặng là biết ngay hỏng, khỏi phải ngồi nói
      // chuyện với con robot để dò.
      //
      // Chỉ một lần: mất mạng rồi nối lại mà lần nào cũng chào thì
      // vừa phiền vừa tốn tiền gọi model.
      if (!greeted) {
        greeted = true;
        st.mode = MODE_THINK;
        thinkSinceMs = millis();
        ws.sendTXT("{\"t\":\"text\",\"text\":\"Chao Cuong, tu gioi thieu that ngan di\"}");
      }
      break;

    case WStype_DISCONNECTED:
      st.wsUp = false;
      st.mode = MODE_IDLE;
      st.lastNote = "mat ket noi server";
      // KHÔNG cắt tiếng đang phát.
      //
      // Trước đây chỗ này gọi playStop() — mất mạng là im bặt giữa
      // chừng, và người dùng thấy đúng triệu chứng "robot nói được 1-2
      // chữ rồi loa tự ngắt". Mà phần tiếng đã nằm sẵn trong đệm PSRAM
      // rồi, mạng có rớt cũng không lấy lại được gì khi vứt nó đi.
      //
      // playEnd() đánh dấu "hết nguồn" để đệm chảy nốt rồi dừng sạch
      // sẽ. Robot nói hết câu đang dở, rồi mới im.
      audio::playEnd();
      upLen = 0;
      Serial.println("[ws] disconnected");
      break;

    case WStype_TEXT: {
      StaticJsonDocument<1024> doc;
      if (deserializeJson(doc, payload, len)) return;
      const char* t = doc["t"] | "";
      if (!strcmp(t, "cmd")) {
        handleCommand(doc);
      } else if (!strcmp(t, "ping")) {
        ws.sendTXT("{\"t\":\"pong\"}");
      } else if (!strcmp(t, "welcome")) {
        st.lastNote = String("deviceId=") + (int)(doc["deviceId"] | 0);
      } else if (!strcmp(t, "say_start")) {
        handleSayStart(doc);
      } else if (!strcmp(t, "say_end")) {
        handleSayEnd();
      } else if (!strcmp(t, "transcript")) {
        const char* role = doc["role"] | "";
        const String text = String(doc["text"] | "");
        if (!strcmp(role, "bot")) st.said = deaccent(text, 60);
        else st.heard = deaccent(text, 60);
      } else if (!strcmp(t, "nak")) {
        // Server nghe thành tiếng ồn chứ không ra câu nào. Báo bằng
        // hai nốt ĐI XUỐNG để bạn biết ngay là phải nói lại — thay vì
        // đứng chờ một câu trả lời không bao giờ tới.
        st.mode = MODE_IDLE;
        st.lastNote = "khong nghe ro - noi lai di";
        // KHÔNG phát tiếng gì. Mọi tiếng báo đã bị gỡ bỏ theo yêu cầu
        // — trong một căn phòng, thứ robot phát ra bằng loa nên chỉ là
        // NỘI DUNG, không phải trạng thái. Trạng thái đã có màn hình.
      } else if (!strcmp(t, "error")) {
        st.mode = MODE_IDLE;
        st.lastNote = String("loi: ") + (const char*)(doc["msg"] | "?");
      }
      break;
    }

    case WStype_BIN:
      audio::playPush(payload, len);
      break;

    default:
      break;
  }
}

/**
 * Nonce cho cú bắt tay WebSocket: 16 byte ngẫu nhiên, mã base64.
 *
 * Sinh tại chỗ chứ không viết sẵn một hằng số. Hai lý do, cả hai đều
 * thật: RFC 6455 đòi nonce phải NGẪU NHIÊN cho mỗi lần bắt tay; và
 * một chuỗi base64 24 ký tự nằm trong mã nguồn trông y hệt một khoá
 * bị lộ — móc pre-commit của repo chặn đúng như vậy, và nó chặn đúng.
 * Lách bằng cách nối chuỗi cho qua mặt máy quét là dạy sai thói quen.
 */
static String wsNonce() {
  static const char* B64 =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  uint8_t r[16];
  for (int i = 0; i < 16; i++) r[i] = (uint8_t)esp_random();

  String out;
  for (int i = 0; i + 2 < 16; i += 3) {  // 5 nhóm đủ 3 byte
    const uint32_t v = ((uint32_t)r[i] << 16) | ((uint32_t)r[i + 1] << 8) | r[i + 2];
    out += B64[(v >> 18) & 63];
    out += B64[(v >> 12) & 63];
    out += B64[(v >> 6) & 63];
    out += B64[v & 63];
  }
  // Byte thứ 16 lẻ ra → một nhóm nữa, đệm "=="
  out += B64[(r[15] >> 2) & 63];
  out += B64[(r[15] << 4) & 63];
  out += "==";
  return out;
}

// ─── Tự chẩn đoán đường mạng ───────────────────────────────
/**
 * Vào được WiFi KHÔNG có nghĩa là ra được internet. Bo vẫn xin được
 * địa chỉ DHCP, sóng vẫn −45 dBm, màn vẫn báo "WiFi OK" — mà mọi kết
 * nối ra ngoài đều chết lặng. Lúc đó thư viện WebSocket chỉ nói được
 * "disconnected", và ta ngồi nghi phần mềm hàng giờ.
 *
 * Ba câu hỏi, hỏi theo đúng thứ tự, mỗi câu loại trừ một tầng:
 *   1. Phân giải được tên miền không?  → hỏng = mạng không có internet/DNS
 *   2. Mở được TCP tới cổng 443 không? → hỏng = ra được DNS nhưng bị chặn
 *   3. Cả hai đều xong                 → lỗi nằm ở TLS hoặc khoá thiết bị
 *
 * Quan trọng: máy tính của bạn cắm mạng khác thì mọi phép thử từ máy
 * tính đều VÔ NGHĨA với bo. Chỉ chính bo mới đo được đường của chính nó.
 */
__attribute__((unused)) static void probeNetwork() {
  IPAddress ip;
  uint32_t t0 = millis();
  if (!WiFi.hostByName(WS_HOST, ip)) {
    st.lastNote = "DNS HONG - wifi nay khong ra internet";
    Serial.printf("[net] DNS %s THAT BAI sau %lums\n", WS_HOST, millis() - t0);
    return;
  }
  const uint32_t dnsMs = millis() - t0;
  Serial.printf("[net] DNS %s -> %s (%lums)\n", WS_HOST, ip.toString().c_str(), dnsMs);

  // Nối TCP NĂM lần chứ không một.
  //
  // Một lần thành công không chứng minh đường mạng tốt — nó chỉ chứng
  // minh lần đó may. Đường chập chờn và đường tốt chỉ phân biệt được
  // qua ĐỘ TẢN của nhiều lần đo: 5/5 lần dưới 100 ms là tốt; 3 lần
  // nhanh 2 lần quá hạn là chập chờn, và chập chờn mới đúng là thứ
  // làm WebSocket rớt liên tục mà nhìn từng lần lại thấy "vẫn nối được".
  uint32_t okCount = 0, msMin = 0xFFFFFFFF, msMax = 0, msSum = 0;
  for (int i = 0; i < 5; i++) {
    WiFiClient c;
    t0 = millis();
    const bool ok = c.connect(ip, WS_PORT, 6000);
    const uint32_t ms = millis() - t0;
    c.stop();
    Serial.printf("[net] TCP lan %d: %s %lums\n", i + 1, ok ? "OK" : "QUA HAN", ms);
    if (ok) {
      okCount++;
      if (ms < msMin) msMin = ms;
      if (ms > msMax) msMax = ms;
      msSum += ms;
    }
    delay(200);
  }
  if (!okCount) {
    st.lastNote = String("TCP ") + ip.toString() + " KHONG NOI DUOC (0/5)";
    return;
  }
  Serial.printf("[net] TCP %lu/5 lan duoc, nhanh nhat %lums, cham nhat %lums, tb %lums\n",
                (unsigned long)okCount, (unsigned long)msMin, (unsigned long)msMax,
                (unsigned long)(msSum / okCount));
  if (okCount < 5 || msMax > 1000) {
    st.lastNote = String("MANG CHAP CHON ") + okCount + "/5, cham nhat " + msMax + "ms";
    Serial.println("[net] >>> duong mang nay CHAP CHON — WebSocket se rot lien tuc");
  }

  // ── Câu hỏi thứ 3: TLS + bắt tay WebSocket ──
  // Thư viện WebSocket chỉ biết nói "disconnected" — không phân biệt
  // được "TLS hỏng" với "server từ chối khoá thiết bị". Tự gửi lấy một
  // yêu cầu nâng cấp rồi đọc dòng đầu tiên thì server nói thẳng:
  //   101 = xong, khoá đúng
  //   401 = tới được server nhưng KHOÁ SAI
  //   404 = sai đường dẫn / bản build cũ chưa gắn gateway
  WiFiClientSecure tls;
  tls.setInsecure();  // như thư viện WS vẫn làm; ghim vân tay để sau
  tls.setTimeout(8);
  t0 = millis();
  if (!tls.connect(WS_HOST, WS_PORT)) {
    st.lastNote = "TLS THAT BAI (TCP thi OK)";
    Serial.printf("[net] TLS that bai sau %lums\n", millis() - t0);
    return;
  }
  Serial.printf("[net] TLS OK sau %lums\n", millis() - t0);

  // Câu hỏi 3a: một yêu cầu HTTPS THƯỜNG có chạy không?
  //
  // Tách bạch hai khả năng mà lần đo trước không phân biệt được: "bo
  // không gửi được byte nào qua TLS" và "bo gửi được nhưng riêng yêu
  // cầu nâng cấp WebSocket bị nuốt". Nếu câu thường trả về 200 thì
  // đường ghi TLS tốt, lỗi nằm đúng ở cú nâng cấp.
  size_t w = 0;
  w += tls.print("GET /api/v1/maker-lab/meta HTTP/1.1\r\n");
  w += tls.print(String("Host: ") + WS_HOST + "\r\n");
  w += tls.print("Connection: close\r\n\r\n");
  Serial.printf("[net] da ghi %u byte cho yeu cau thuong\n", (unsigned)w);

  t0 = millis();
  String first;
  while (millis() - t0 < 8000 && !first.length()) {
    if (tls.available()) first = tls.readStringUntil('\n');
    else delay(10);
  }
  first.trim();
  Serial.printf("[net] HTTPS thuong -> %s\n", first.length() ? first.c_str() : "IM LANG");
  tls.stop();

  // Câu hỏi 3b: cú nâng cấp WebSocket. Kết nối MỚI, vì vừa gửi
  // `Connection: close` ở trên.
  WiFiClientSecure tls2;
  tls2.setInsecure();
  tls2.setTimeout(8);
  if (!tls2.connect(WS_HOST, WS_PORT)) {
    st.lastNote = "TLS lan 2 that bai";
    Serial.println("[net] TLS lan 2 that bai");
    return;
  }

  // ⚠️ KHÔNG in `path` ra serial — nó cõng cả secret của thiết bị.
  String path = String(WS_PATH) + "?key=" + DEVICE_KEY + "&secret=" + DEVICE_SECRET;
  w = 0;
  w += tls2.print(String("GET ") + path + " HTTP/1.1\r\n");
  w += tls2.print(String("Host: ") + WS_HOST + "\r\n");
  w += tls2.print("Upgrade: websocket\r\nConnection: Upgrade\r\n");
  w += tls2.print(String("Sec-WebSocket-Key: ") + wsNonce() + "\r\n");
  w += tls2.print("Sec-WebSocket-Version: 13\r\n\r\n");
  Serial.printf("[net] da ghi %u byte cho yeu cau nang cap (duong dan %u ky tu)\n",
                (unsigned)w, (unsigned)path.length());

  // Chờ 30 giây chứ không 8.
  //
  // "Không trả lời trong 8 giây" và "không bao giờ trả lời" là hai kết
  // luận khác hẳn nhau, mà cửa sổ chờ 8 giây là do CHÍNH TA đặt ra —
  // nó không chứng minh được cái thứ hai. Nếu phản hồi về ở giây thứ
  // 12 thì vấn đề là server CHẬM (bcrypt chặn vòng lặp sự kiện, VPS
  // đang bận build), hoàn toàn khác với server nuốt yêu cầu.
  t0 = millis();
  String line;
  uint32_t bytes = 0;
  while (millis() - t0 < 30000) {
    if (tls2.available()) {
      bytes = tls2.available();
      line = tls2.readStringUntil('\n');
      break;
    }
    if (!tls2.connected()) {
      Serial.printf("[net] server DONG ket noi sau %lums, khong gui gi\n", millis() - t0);
      break;
    }
    delay(10);
  }
  const uint32_t waited = millis() - t0;
  tls2.stop();

  line.trim();
  if (!line.length()) {
    st.lastNote = "TLS OK nhung server IM LANG";
    Serial.printf("[net] cho %lums, khong nhan duoc byte nao\n", waited);
    return;
  }
  Serial.printf("[net] tra loi ve sau %lums (%lu byte cho san)\n", waited,
                (unsigned long)bytes);
  Serial.printf("[net] server tra loi: %s\n", line.c_str());
  if (line.indexOf("101") >= 0) st.lastNote = "bat tay WS OK (101)";
  else if (line.indexOf("401") >= 0) st.lastNote = "SAI KHOA THIET BI (401)";
  else if (line.indexOf("404") >= 0) st.lastNote = "server chua gan /device-ws (404)";
  else st.lastNote = String("server: ") + line.substring(0, 40);
}

// ─── Setup / loop ──────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\nMini-Me Robot — chặng B");

  tft.init();
  tft.setRotation(1);

  // Khuôn mặt chiếm trọn màn, thay cho bảng chữ của chặng A. Bảng chữ
  // hữu ích lúc gỡ lỗi, nhưng một con robot nhìn vào mà thấy bảng
  // thông số thì nó là thiết bị đo, không phải bạn cùng bàn. Thông tin
  // trạng thái rút gọn còn hai chấm tròn ở góc.
  face::begin(&tft);

  if (!psramFound()) {
    st.lastNote = "CANH BAO: khong thay PSRAM";
    Serial.println("!! Không thấy PSRAM — bo này không phải bản N16R8");
  }

  // Cài I2S TRƯỚC khi nối mạng: từ giây này amp đã có dòng số 0 để
  // bám vào, không còn ba chân thả nổi để hứng nhiễu.
  audio::onTurnStart(onTurnStart);
  audio::onChunk(onChunk);
  audio::onTurnEnd(onTurnEnd);
  if (!audio::begin()) {
    st.lastNote = "LOI: khong mo duoc duong tieng";
    Serial.println("!! audio::begin() thất bại — xem log phía trên");
  }

  // ── WiFi ──
  st.lastNote = "dang ket noi WiFi...";
  uiRefresh();
  WiFi.mode(WIFI_STA);

  // ⚠️ TẮT CHẾ ĐỘ NGỦ CỦA WIFI. Một dòng, và nó chữa đúng triệu chứng
  // đã đuổi theo cả ngày.
  //
  // ESP32 mặc định bật modem-sleep: chip tắt bộ thu giữa các nhịp
  // beacon để tiết kiệm điện, và router phải ĐỆM gói tin lại chờ nó
  // tỉnh. Gói đi RA thì không sao — lúc phát là lúc chip thức. Gói đi
  // VÀO thì trễ hoặc rơi.
  //
  // Khớp chính xác những gì đo được: yêu cầu của bo tới được nginx
  // (nginx ghi 101 và gửi 73 byte), mà bo đọc được 0 byte trong 30
  // giây. Gửi được, nhận không được. Và chập chờn — có lúc chạy 77
  // giây liền, có lúc rớt ngay.
  //
  // Giá phải trả: tốn điện hơn. Với robot cắm nguồn thì không đáng kể;
  // khi nào chạy pin mới cân nhắc bật lại.
  WiFi.setSleep(false);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  uint32_t t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 20000) {
    delay(300);
    Serial.print('.');
    uiHeartbeat();
  }

  if (WiFi.status() == WL_CONNECTED) {
    st.wifiUp = true;
    st.ip = WiFi.localIP().toString();
    st.rssi = WiFi.RSSI();
    st.lastNote = "WiFi OK, dang noi server";
    Serial.printf("\nWiFi ok, ip=%s rssi=%d\n", st.ip.c_str(), st.rssi);
  } else {
    st.lastNote = "KHONG VAO DUOC WiFi - kiem SSID/mat khau";
    Serial.println("\nWiFi thất bại");
  }
  uiRefresh();

  // ⚠️ Bộ tự chẩn đoán mạng TẮT theo mặc định.
  //
  // Nó đã làm xong việc của nó (chứng minh DNS/TCP/TLS/HTTPS đều thông),
  // nhưng nó mở thêm hai kết nối TLS trong setup() — và tài nguyên TLS
  // trên ESP32 rất eo hẹp. Nghi nó là thủ phạm khiến WebSocket không
  // đọc nổi phản hồi 101 và rớt sau đúng 5 giây.
  //
  // Bật lại bằng -DPROBE_NETWORK=1 khi cần chẩn đoán mạng, đừng để
  // chạy thường trực.
#if defined(PROBE_NETWORK) && PROBE_NETWORK
  if (st.wifiUp) {
    probeNetwork();
    uiRefresh();
  }
#endif

  // ── WebSocket ──
  //
  // Khoá đi trong HEADER, KHÔNG đi trong đường dẫn.
  //
  // Bản đầu ghép `?key=…&secret=…` vào đường dẫn, và bí mật đó lộ ra ở
  // ba chỗ cùng lúc mà không ai để ý: nhật ký nginx (giữ hàng tháng),
  // log gỡ lỗi trên cổng nối tiếp — ngày 11/08/2026 đã thấy nguyên
  // `?key=mk_…&secret=EEUq…` in ra màn hình — và mọi proxy trên đường.
  //
  // Header thì không nằm trong đường dẫn nên không rơi vào các chỗ đó.
  // Server vẫn nhận cả hai cách một thời gian, để bo chưa kịp nâng cấp
  // không bị khoá ra ngoài (mất kết nối = mất luôn đường OTA).
  ws.setExtraHeaders(
      (String("X-Device-Key: ") + DEVICE_KEY + "\r\nX-Device-Secret: " + DEVICE_SECRET).c_str());
#if WS_USE_TLS
  ws.beginSSL(WS_HOST, WS_PORT, WS_PATH);
#else
  ws.begin(WS_HOST, WS_PORT, WS_PATH);
#endif
  ws.onEvent(onWsEvent);
  ws.setReconnectInterval(WS_RECONNECT_BASE_MS);
  // Nhịp tim bật trong WStype_CONNECTED chứ không phải ở đây: đặt
  // trước khi nối thì mốc `lastPing` tính từ lúc khởi động, nên ngay
  // giây đầu sau khi nối thư viện đã kêu "pong TIMEOUT!" vì so với
  // một mốc từ tám nghìn mili giây trước. Nó tự phục hồi, nhưng một
  // cảnh báo GIẢ trong log là thứ sẽ làm mất thời gian của ai đó về
  // sau — hôm nay tôi đã mất mấy tiếng vì đúng loại nhiễu như vậy.

  // Ưu tiên 1 = thấp hơn loopTask, nên nó không cướp nhịp; nhưng vẫn
  // được chạy vì mọi lời gọi chặn trong loop() đều nhường CPU.
  xTaskCreatePinnedToCore(watchTask, "gac", 3072, nullptr, 1, nullptr, 0);
}

void loop() {
  gLoops++;

  gStage = "ws";
  ws.loop();

  // Bơm cả hai chiều tiếng. Hàm này tự nhịp: lúc nghe thì nó chờ đúng
  // một khối 16 ms, lúc nói thì nó chờ DMA rút bớt — nên loop() không
  // bao giờ quay không tải mà cũng không bao giờ bị giữ quá lâu.
  gStage = "audio";
  // Đang nạp firmware thì ngừng đọc mic hẳn. Không chặn thì bo vẫn bơm
  // 2 KB tiếng mỗi 60 ms lên server suốt lúc tải — tranh băng thông với
  // chính bản firmware đang về, và tệ hơn: mở được một lượt nói mới
  // giữa chừng, để rồi bo reboot khi người dùng đang chờ câu trả lời.
  if (!ota::dangChay()) audio::loop();

  gStage = "ui";
  const uint32_t now = millis();

  // Server im quá lâu sau khi ta chốt lượt → thoát trạng thái "đang
  // nghĩ" để màn hình không đứng hình ở đó mãi.
  if (st.mode == MODE_THINK && now - thinkSinceMs > 12000) {
    st.mode = MODE_IDLE;
    st.lastNote = "server khong tra loi";
  }
  if (st.mode == MODE_TALK && !audio::speaking() && now - thinkSinceMs > 1000) {
    st.mode = MODE_IDLE;
    face::set(face::NEUTRAL);
  }

  if (st.wsUp && now - lastTelemetryMs >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryMs = now;
    sendTelemetry();
  }

  // Khuôn mặt tự lo chớp mắt, đảo con ngươi và hết hạn biểu cảm.
  //
  // ⚠️ NHƯNG KHÔNG VẼ KHI ĐANG PHÁT TIẾNG. Vẽ màn hình đi qua SPI và
  // giữ CPU vài chục mili giây; trong lúc đó không ai bơm dữ liệu vào
  // I2S, mà đệm DMA chỉ đủ 128 ms. Kết quả nghe được ngay: tiếng nói
  // giật một nhịp đúng mỗi lần robot chớp mắt.
  //
  // Nói xong thì mặt vẽ lại ngay ở vòng sau — mắt người không nhận ra
  // vài trăm mili giây đứng hình, còn tai thì nhận ra ngay một nhịp
  // vấp.
  if (!audio::speaking()) {
    gStage = "face";
    face::loop();
  }

  if (now - lastUiMs >= 1000) {
    lastUiMs = now;
    st.uptimeSec = now / 1000;
    st.rssi = WiFi.RSSI();
    st.wifiUp = WiFi.status() == WL_CONNECTED;
    face::setStatus(st.wifiUp, st.wsUp);

    // Nhịp chẩn đoán 1 Hz ra serial.
    //
    // `heap` là tổng còn trống, `khoi` là KHỐI LIỀN MẠCH lớn nhất —
    // và cái thứ hai mới là thứ quyết định. Bắt tay TLS cần một khối
    // liền ~40 KB; heap còn 100 KB nhưng vỡ vụn thành mảnh 8 KB thì
    // vẫn không nối lại được, mà triệu chứng nhìn ra ngoài chỉ là
    // "select timeout" — không hề nói gì tới bộ nhớ.
    Serial.printf("[st] heap=%uKB khoi=%uKB mic=%ld nen=%ld nguong=%ld che=%d ws=%d\n",
                  ESP.getFreeHeap() / 1024,
                  heap_caps_get_largest_free_block(MALLOC_CAP_INTERNAL) / 1024,
                  (long)audio::level(), (long)audio::noise(), (long)audio::gate(),
                  (int)st.mode, st.wsUp ? 1 : 0);
  }
}
