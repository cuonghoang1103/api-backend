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
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <TFT_eSPI.h>

#include "audio.h"
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
    case MODE_TALK:  s = "DANG NOI";   c = C_ACCENT; break;
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

static void upFlush() {
  if (!upLen) return;
  if (st.wsUp) ws.sendBIN(upBuf, upLen);
  upLen = 0;
}

static void onTurnStart() {
  upLen = 0;
  st.mode = MODE_HEAR;
  st.lastNote = "nghe thay tieng noi";
  if (st.wsUp) ws.sendTXT("{\"t\":\"audio_start\"}");
}

static void onChunk(const uint8_t* data, size_t len) {
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
  st.mode = MODE_THINK;
  thinkSinceMs = millis();
  st.lastNote = "dang cho server tra loi";
  if (st.wsUp) ws.sendTXT("{\"t\":\"audio_end\"}");
}

// ─── Lệnh từ server ────────────────────────────────────────

static void handleCommand(JsonDocument& doc) {
  const uint32_t id = doc["id"] | 0;
  const char* type = doc["type"] | "";

  st.cmdCount++;
  st.lastCmd = String(type);

  if (!strcmp(type, "reboot")) {
    sendAck(id, true);
    sendLog("warn", "Dang khoi dong lai theo yeu cau");
    delay(300);
    ESP.restart();
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
  audio::playBegin(rate);
}

static void handleSayEnd() {
  audio::playEnd();
  st.turns++;
  st.lastNote = String("da noi ") + (audio::lastClipBytes() / 1024) + " KB";
}

static void onWsEvent(WStype_t type, uint8_t* payload, size_t len) {
  switch (type) {
    case WStype_CONNECTED:
      st.wsUp = true;
      st.lastNote = "da noi server";
      Serial.println("[ws] connected");
      sendHello();
      sendLog("info", "Mini-Me chang B: da co tai va mieng");
      break;

    case WStype_DISCONNECTED:
      st.wsUp = false;
      st.mode = MODE_IDLE;
      st.lastNote = "mat ket noi server";
      audio::playStop();
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

// ─── Setup / loop ──────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\nMini-Me Robot — chặng B");

  tft.init();
  tft.setRotation(1);
  uiFrame();
  uiRefresh();

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

  // ── WebSocket ──
  String path = String(WS_PATH) + "?key=" + DEVICE_KEY + "&secret=" + DEVICE_SECRET;
#if WS_USE_TLS
  ws.beginSSL(WS_HOST, WS_PORT, path.c_str());
#else
  ws.begin(WS_HOST, WS_PORT, path.c_str());
#endif
  ws.onEvent(onWsEvent);
  ws.setReconnectInterval(WS_RECONNECT_BASE_MS);
  ws.enableHeartbeat(15000, 3000, 2);
}

void loop() {
  ws.loop();

  // Bơm cả hai chiều tiếng. Hàm này tự nhịp: lúc nghe thì nó chờ đúng
  // một khối 16 ms, lúc nói thì nó chờ DMA rút bớt — nên loop() không
  // bao giờ quay không tải mà cũng không bao giờ bị giữ quá lâu.
  audio::loop();

  const uint32_t now = millis();

  // Server im quá lâu sau khi ta chốt lượt → thoát trạng thái "đang
  // nghĩ" để màn hình không đứng hình ở đó mãi.
  if (st.mode == MODE_THINK && now - thinkSinceMs > 12000) {
    st.mode = MODE_IDLE;
    st.lastNote = "server khong tra loi";
  }
  if (st.mode == MODE_TALK && !audio::speaking() && now - thinkSinceMs > 1000) {
    st.mode = MODE_IDLE;
  }

  if (st.wsUp && now - lastTelemetryMs >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryMs = now;
    sendTelemetry();
  }

  // Thanh mức mic cần nhịp nhanh mới theo kịp giọng nói; phần còn lại
  // của bảng thì 1 Hz là đủ. Cả hai đều bỏ qua nếu không có gì đổi.
  static uint32_t lastBarMs = 0;
  if (now - lastBarMs >= 80) {
    lastBarMs = now;
    uiLevelBar();
    uiMode();
  }

  if (now - lastUiMs >= 1000) {
    lastUiMs = now;
    st.uptimeSec = now / 1000;
    st.rssi = WiFi.RSSI();
    st.wifiUp = WiFi.status() == WL_CONNECTED;
    uiRefresh();
    uiHeartbeat();
  }
}
