/**
 * ============================================================
 * Mini-Me Robot — firmware skeleton
 * ============================================================
 *
 * This compiles and runs today: it joins WiFi, opens the WebSocket to
 * your server, streams telemetry, and executes every motion/face/LED
 * command the Live Console sends. That is enough to prove the whole
 * chain end to end the day the parts arrive.
 *
 * The audio path (mic → VAD → server → MP3 → speaker) and the eye
 * rendering are marked TODO rather than guessed at, because both need
 * tuning against real hardware — VAD thresholds depend on your room
 * and your microphone's placement inside the shell, and no amount of
 * writing code without the board makes those numbers right.
 *
 * Two FreeRTOS tasks:
 *   core 1 — audio only, real-time, must never block
 *   core 0 — network, sensors, motors, everything else
 * Sharing one core makes the speaker stutter every time a sensor is
 * read. That is the single most common "my robot sounds broken" bug.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

#include "config.h"
#include "secrets.h"

// ─── State ─────────────────────────────────────────────────
WebSocketsClient ws;

struct MotorState {
  int16_t  left  = 0;
  int16_t  right = 0;
  uint32_t stopAt = 0;   // millis() deadline; 0 = idle
} motors;

struct Telemetry {
  float    battery    = 0;
  int16_t  rssi       = 0;
  uint32_t uptime     = 0;
  uint16_t distanceMm = 9999;
  float    pitch      = 0;
  float    roll       = 0;
} tele;

uint32_t lastTelemetry  = 0;
uint32_t lastServerMsg  = 0;
uint32_t reconnectDelay = WS_RECONNECT_BASE_MS;
bool     wsConnected    = false;

// ─── Motors ────────────────────────────────────────────────
// PWM through the LEDC peripheral: four channels, one per DRV8833
// input, so direction is "which of the pair carries the duty cycle".

void motorSetup() {
  const int pins[4] = {PIN_MOTOR_AIN1, PIN_MOTOR_AIN2, PIN_MOTOR_BIN1, PIN_MOTOR_BIN2};
  for (int i = 0; i < 4; i++) {
    ledcSetup(i, 20000, 8);      // 20 kHz — above hearing, no motor whine
    ledcAttachPin(pins[i], i);
    ledcWrite(i, 0);
  }
}

void motorDrive(int16_t left, int16_t right) {
  left  = constrain(left,  -MAX_MOTOR_DUTY, MAX_MOTOR_DUTY);
  right = constrain(right, -MAX_MOTOR_DUTY, MAX_MOTOR_DUTY);

  ledcWrite(0, left  > 0 ? left  : 0);
  ledcWrite(1, left  < 0 ? -left : 0);
  ledcWrite(2, right > 0 ? right : 0);
  ledcWrite(3, right < 0 ? -right : 0);

  motors.left  = left;
  motors.right = right;
}

void motorStop() {
  motorDrive(0, 0);
  motors.stopAt = 0;
}

/**
 * Safety watchdog. Runs regardless of what the server said, because
 * the server is on the other side of a WiFi link that can vanish
 * mid-command. A robot that keeps driving after losing contact is a
 * robot that drives into a wall.
 */
void motionWatchdog() {
  if (motors.stopAt && millis() >= motors.stopAt) motorStop();

  if (tele.distanceMm < OBSTACLE_STOP_MM && (motors.left > 0 || motors.right > 0)) {
    motorStop();
    // Report it: a stop with no explanation looks like a crash.
    StaticJsonDocument<128> doc;
    doc["t"] = "log";
    doc["level"] = "warn";
    doc["msg"] = String("Vật cản ") + tele.distanceMm + " mm — dừng";
    String out;
    serializeJson(doc, out);
    ws.sendTXT(out);
  }

  if (wsConnected && millis() - lastServerMsg > HEARTBEAT_TIMEOUT_MS) {
    motorStop();
    ws.disconnect();   // stale link; force a clean reconnect
  }
}

// ─── Commands ──────────────────────────────────────────────

void sendAck(uint32_t id, bool ok, const char* err = nullptr) {
  StaticJsonDocument<192> doc;
  doc["t"] = "ack";
  doc["id"] = id;
  doc["ok"] = ok;
  if (err) doc["error"] = err;
  String out;
  serializeJson(doc, out);
  ws.sendTXT(out);
}

void handleCommand(JsonDocument& doc) {
  const uint32_t id   = doc["id"] | 0;
  const char*    type = doc["type"] | "";
  JsonObjectConst p   = doc["payload"];

  if (!strcmp(type, "move")) {
    motorDrive(p["left"] | 0, p["right"] | 0);
    motors.stopAt = millis() + (uint32_t)(p["ms"] | 500);
    sendAck(id, true);

  } else if (!strcmp(type, "stop")) {
    motorStop();
    sendAck(id, true);

  } else if (!strcmp(type, "turn")) {
    // Open-loop for now. Closing the loop needs the encoder counts
    // and the IMU heading — see motion.cpp in the firmware roadmap.
    const int deg   = p["deg"] | 0;
    const int speed = p["speed"] | 160;
    motorDrive(deg > 0 ? speed : -speed, deg > 0 ? -speed : speed);
    motors.stopAt = millis() + (uint32_t)(abs(deg) * 4);
    sendAck(id, true);

  } else if (!strcmp(type, "face")) {
    // TODO(face.cpp): render on the two GC9A01 displays.
    Serial.printf("face → %s\n", p["emotion"] | "neutral");
    sendAck(id, true);

  } else if (!strcmp(type, "led")) {
    // TODO(leds): NeoPixel ring.
    sendAck(id, true);

  } else if (!strcmp(type, "reboot")) {
    sendAck(id, true);
    delay(200);
    ESP.restart();

  } else {
    sendAck(id, false, "lệnh chưa hỗ trợ trong bản firmware này");
  }
}

// ─── WebSocket ─────────────────────────────────────────────

void sendHello() {
  StaticJsonDocument<256> doc;
  doc["t"]       = "hello";
  doc["fw"]      = "0.1.0";
  doc["ip"]      = WiFi.localIP().toString();
  doc["rssi"]    = WiFi.RSSI();
  doc["battery"] = (int)tele.battery;
  String out;
  serializeJson(doc, out);
  ws.sendTXT(out);
}

void sendTelemetry() {
  StaticJsonDocument<256> doc;
  doc["t"]          = "telemetry";
  doc["battery"]    = tele.battery;
  doc["rssi"]       = WiFi.RSSI();
  doc["uptime"]     = millis() / 1000;
  doc["distanceMm"] = tele.distanceMm;
  doc["pitch"]      = tele.pitch;
  doc["roll"]       = tele.roll;
  String out;
  serializeJson(doc, out);
  ws.sendTXT(out);
}

void onWsEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      wsConnected    = true;
      reconnectDelay = WS_RECONNECT_BASE_MS;
      lastServerMsg  = millis();
      Serial.println("[ws] connected");
      sendHello();
      break;

    case WStype_DISCONNECTED:
      wsConnected = false;
      motorStop();          // never coast on unattended
      Serial.println("[ws] disconnected");
      break;

    case WStype_TEXT: {
      lastServerMsg = millis();
      StaticJsonDocument<512> doc;
      if (deserializeJson(doc, payload, length)) return;

      const char* t = doc["t"] | "";
      if      (!strcmp(t, "cmd"))       handleCommand(doc);
      else if (!strcmp(t, "ping"))      ws.sendTXT("{\"t\":\"pong\"}");
      else if (!strcmp(t, "say_start")) { /* TODO(audio_out): open the decoder */ }
      else if (!strcmp(t, "say_end"))   { /* TODO(audio_out): flush + close */ }
      break;
    }

    case WStype_BIN:
      lastServerMsg = millis();
      // TODO(audio_out): feed into the MP3 decoder ring buffer and on
      // to I2S. Must not block — this runs on the network task.
      break;

    default:
      break;
  }
}

// ─── Battery ───────────────────────────────────────────────

void readBattery() {
  const uint32_t mv = analogReadMilliVolts(PIN_BATTERY_ADC) * BATTERY_DIVIDER;
  const float pct =
      100.0f * (float)((int32_t)mv - BATTERY_EMPTY_MV) / (BATTERY_FULL_MV - BATTERY_EMPTY_MV);
  tele.battery = constrain(pct, 0.0f, 100.0f);
}

// ─── Setup / loop ──────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\nMini-Me Robot booting…");

  if (!psramFound()) {
    // Loud, because the fix is buying the right board, not debugging.
    Serial.println("!! Không thấy PSRAM. Bo này KHÔNG phải bản N16R8 —");
    Serial.println("!! phần âm thanh sẽ hết RAM ngay lượt nói đầu tiên.");
  }

  motorSetup();
  pinMode(PIN_TOUCH_HEAD, INPUT);
  pinMode(PIN_CLIFF_L, INPUT);
  pinMode(PIN_CLIFF_R, INPUT);
  analogReadResolution(12);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print('.');
  }
  Serial.printf(" ok, ip=%s rssi=%d\n", WiFi.localIP().toString().c_str(), WiFi.RSSI());

  const String path = String(WS_PATH) + "?key=" + DEVICE_KEY + "&secret=" + DEVICE_SECRET;
#if WS_USE_TLS
  ws.beginSSL(WS_HOST, WS_PORT, path.c_str());
#else
  ws.begin(WS_HOST, WS_PORT, path.c_str());
#endif
  ws.onEvent(onWsEvent);
  ws.setReconnectInterval(WS_RECONNECT_BASE_MS);
  // Library-level keepalive on top of the server's own ping, so a
  // half-open socket after a router reboot is detected either way.
  ws.enableHeartbeat(15000, 3000, 2);

  // TODO(audio_in / audio_out): start the I2S task pinned to core 1.
  //   xTaskCreatePinnedToCore(audioTask, "audio", 8192, nullptr, 5, nullptr, 1);
}

void loop() {
  ws.loop();
  motionWatchdog();

  if (millis() - lastTelemetry >= TELEMETRY_INTERVAL_MS) {
    lastTelemetry = millis();
    readBattery();
    // TODO(sensors): read MPU6050 pitch/roll and VL53L0X distance
    // here. Median-filter the laser over 5 samples — trusting a single
    // bad reading makes the robot brake in an empty room.
    if (wsConnected) sendTelemetry();
  }

  delay(2);   // yield to the WiFi stack
}
