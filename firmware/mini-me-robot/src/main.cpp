/**
 * ============================================================
 * Mini-Me Robot — CHẶNG A: robot lên mạng
 * ============================================================
 *
 * Mục tiêu của chặng này: robot xuất hiện ONLINE trên Live Console,
 * gửi telemetry, nhận và thực thi lệnh. Chưa có âm thanh — cái đó là
 * chặng B.
 *
 * Chia hai chặng vì mỗi chặng phải tự kiểm chứng được. Nếu gộp cả
 * audio vào ngay, lúc không chạy thì có tám thứ để nghi ngờ cùng lúc:
 * WiFi, WebSocket, khoá thiết bị, I2S mic, VAD, mã hoá, I2S loa, và
 * chính đường truyền. Tách ra thì mỗi lần chỉ còn một.
 *
 * Màn 3.5" là công cụ gỡ lỗi tốt nhất ở đây: mọi trạng thái hiện
 * ngay trên đó, không phải cắm cáp serial để biết robot đang làm gì.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <TFT_eSPI.h>

#include "config.h"
#include "secrets.h"

static TFT_eSPI tft = TFT_eSPI();
static WebSocketsClient ws;

// ─── Trạng thái ────────────────────────────────────────────
struct State {
  bool wifiUp = false;
  bool wsUp = false;
  String ip = "-";
  int rssi = 0;
  uint32_t uptimeSec = 0;
  uint32_t lastServerMs = 0;
  uint32_t cmdCount = 0;
  String lastCmd = "-";
  String lastNote = "khởi động...";
} st;

static uint32_t lastTelemetryMs = 0;
static uint32_t lastUiMs = 0;
static uint32_t reconnectDelayMs = WS_RECONNECT_BASE_MS;

// ─── Màn hình ──────────────────────────────────────────────
// Vẽ lại TỪNG VÙNG chứ không xoá cả màn rồi vẽ lại: xoá toàn màn ở
// 20 MHz mất ~90 ms và mắt thấy rõ cái nháy. Mỗi ô chỉ tô lại phần
// chữ của chính nó.

#define C_BG      TFT_BLACK
#define C_TITLE   TFT_GREEN
#define C_LABEL   TFT_DARKGREY
#define C_VALUE   TFT_WHITE
#define C_OK      TFT_GREEN
#define C_WARN    TFT_ORANGE
#define C_BAD     TFT_RED
#define C_ACCENT  TFT_CYAN

static void uiFrame() {
  tft.fillScreen(C_BG);

  tft.setTextColor(C_TITLE, C_BG);
  tft.setTextSize(2);
  tft.setCursor(12, 10);
  tft.print("MINI-ME ROBOT");

  tft.setTextSize(1);
  tft.setTextColor(C_LABEL, C_BG);
  tft.setCursor(tft.width() - 96, 16);
  tft.print("chang A");

  tft.drawFastHLine(12, 34, tft.width() - 24, C_LABEL);

  // Nhãn cố định — vẽ một lần, sau đó chỉ cập nhật phần giá trị
  const char* labels[] = {"WiFi", "IP", "Song", "Server", "Uptime", "Lenh"};
  for (int i = 0; i < 6; i++) {
    tft.setTextColor(C_LABEL, C_BG);
    tft.setCursor(12, 48 + i * 22);
    tft.print(labels[i]);
    tft.setCursor(76, 48 + i * 22);
    tft.print(":");
  }

  tft.drawFastHLine(12, 190, tft.width() - 24, C_LABEL);
  tft.setTextColor(C_LABEL, C_BG);
  tft.setCursor(12, 200);
  tft.print("Ghi chu");
}

/** Ghi giá trị vào một dòng, tự xoá phần cũ. */
static void uiValue(int row, const String& text, uint16_t color) {
  const int x = 88;
  const int y = 48 + row * 22;
  tft.fillRect(x, y, tft.width() - x - 12, 10, C_BG);
  tft.setTextSize(1);
  tft.setTextColor(color, C_BG);
  tft.setCursor(x, y);
  tft.print(text);
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

  // Ghi chú — dòng dài nên cho riêng một vùng
  tft.fillRect(12, 214, tft.width() - 24, 12, C_BG);
  tft.setTextColor(st.wsUp ? C_ACCENT : C_WARN, C_BG);
  tft.setCursor(12, 214);
  tft.print(st.lastNote);
}

/** Chấm tròn báo còn sống — nhấp nháy theo giây. */
static void uiHeartbeat() {
  static bool on = false;
  on = !on;
  tft.fillCircle(tft.width() - 22, 18, 5,
                 st.wsUp ? (on ? C_OK : C_BG) : (on ? C_BAD : C_BG));
}

// ─── WebSocket ─────────────────────────────────────────────

static void sendHello() {
  StaticJsonDocument<256> doc;
  doc["t"] = "hello";
  doc["fw"] = FW_VERSION;
  doc["ip"] = WiFi.localIP().toString();
  doc["rssi"] = WiFi.RSSI();
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

/**
 * Chặng A chưa có động cơ nào để quay, nên lệnh chỉ được ghi nhận và
 * hiện lên màn. Nhưng ack vẫn phải gửi thật — nhờ đó Live Console
 * hiện đúng trạng thái ACKED và ta biết đường truyền hai chiều đã
 * thông trước khi đụng tới phần cứng chuyển động.
 */
static void handleCommand(JsonDocument& doc) {
  const uint32_t id = doc["id"] | 0;
  const char* type = doc["type"] | "";

  st.cmdCount++;
  st.lastCmd = String(type);
  st.lastNote = String("nhan lenh: ") + type;

  if (!strcmp(type, "reboot")) {
    sendAck(id, true);
    sendLog("warn", "Dang khoi dong lai theo yeu cau");
    delay(300);
    ESP.restart();
    return;
  }

  // Mọi lệnh khác: ghi nhận, báo rõ là chưa có phần cứng
  sendAck(id, true);
  sendLog("info", String("chang A: ghi nhan lenh '") + type +
                      "' (chua co phan cung de thuc thi)");
}

static void onWsEvent(WStype_t type, uint8_t* payload, size_t len) {
  switch (type) {
    case WStype_CONNECTED:
      st.wsUp = true;
      st.lastServerMs = millis();
      st.lastNote = "da noi server";
      reconnectDelayMs = WS_RECONNECT_BASE_MS;
      Serial.println("[ws] connected");
      sendHello();
      sendLog("info", "Mini-Me chang A da len mang");
      break;

    case WStype_DISCONNECTED:
      st.wsUp = false;
      st.lastNote = "mat ket noi server";
      Serial.println("[ws] disconnected");
      break;

    case WStype_TEXT: {
      st.lastServerMs = millis();
      StaticJsonDocument<512> doc;
      if (deserializeJson(doc, payload, len)) return;
      const char* t = doc["t"] | "";
      if (!strcmp(t, "cmd")) {
        handleCommand(doc);
      } else if (!strcmp(t, "ping")) {
        ws.sendTXT("{\"t\":\"pong\"}");
      } else if (!strcmp(t, "welcome")) {
        st.lastNote = String("deviceId=") + (int)(doc["deviceId"] | 0);
      } else if (!strcmp(t, "say_start")) {
        // Chặng B mới phát được; giờ chỉ hiện lên màn cho biết server
        // đã gửi âm thanh xuống.
        st.lastNote = "server gui am thanh (chang B)";
      }
      break;
    }

    case WStype_BIN:
      st.lastServerMs = millis();
      break;

    default:
      break;
  }
}

// ─── Setup / loop ──────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\nMini-Me Robot — chặng A");

  tft.init();
  tft.setRotation(1);
  uiFrame();
  uiRefresh();

  if (!psramFound()) {
    st.lastNote = "CANH BAO: khong thay PSRAM";
    uiRefresh();
    Serial.println("!! Không thấy PSRAM — bo này không phải bản N16R8");
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
  // Khoá thiết bị đi trong query string. Server bcrypt-compare secret
  // rồi mới cho kết nối; sai thì đóng ngay với mã 4401.
  String path = String(WS_PATH) + "?key=" + DEVICE_KEY + "&secret=" + DEVICE_SECRET;
#if WS_USE_TLS
  ws.beginSSL(WS_HOST, WS_PORT, path.c_str());
#else
  ws.begin(WS_HOST, WS_PORT, path.c_str());
#endif
  ws.onEvent(onWsEvent);
  ws.setReconnectInterval(WS_RECONNECT_BASE_MS);
  // Keepalive của thư viện chồng lên ping của server: một socket
  // nửa-mở sau khi router khởi động lại sẽ bị phát hiện từ cả hai phía.
  ws.enableHeartbeat(15000, 3000, 2);
}

void loop() {
  ws.loop();

  const uint32_t now = millis();

  // Telemetry 1 Hz
  if (st.wsUp && now - lastTelemetryMs >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryMs = now;
    sendTelemetry();
  }

  // Cập nhật màn 1 Hz — đủ mượt cho mắt, không tốn SPI vô ích
  if (now - lastUiMs >= 1000) {
    lastUiMs = now;
    st.uptimeSec = now / 1000;
    st.rssi = WiFi.RSSI();
    st.wifiUp = WiFi.status() == WL_CONNECTED;
    uiRefresh();
    uiHeartbeat();
  }

  delay(2);  // nhường CPU cho ngăn xếp WiFi
}
