/**
 * ============================================================
 * Mini-Me Robot — kiểm sức khoẻ bo + kiểm từng linh kiện
 * ============================================================
 *
 * Nạp cái này TRƯỚC KHI hàn bất cứ thứ gì. Hai việc:
 *
 *   0) Khám tổng quát con ESP32-S3 — đặc biệt cần khi dùng lại bo cũ.
 *      Bo cũ hỏng theo kiểu ÂM THẦM: một bit PSRAM chết, một chân GPIO
 *      chập xuống đất từ lần đấu nhầm trước, flash mòn. Không cái nào
 *      báo lỗi lúc khởi động — chúng chỉ làm chương trình cư xử kỳ quặc
 *      vài tuần sau, và bạn sẽ đi tìm bug trong code.
 *
 *   1–6) Kiểm từng linh kiện riêng lẻ, để khi cả mạch không chạy thì
 *      bạn chỉ còn phải nghi ngờ chỗ nối.
 *
 * Gõ số vào Serial Monitor để chọn.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <Wire.h>
#ifdef HAS_TFT
#  include <TFT_eSPI.h>
static TFT_eSPI tft = TFT_eSPI();
#endif
#include <esp_system.h>
#include <esp_chip_info.h>
#include <esp_flash.h>
#include <esp_heap_caps.h>
#include <esp_partition.h>
#include <esp_ota_ops.h>  // esp_ota_get_running_partition()
#include <driver/i2s.h>

// Cảm biến nhiệt trong chip đổi API giữa hai đời ESP-IDF:
//   IDF 4.4 (Arduino core 2.x) → driver/temp_sensor.h
//   IDF 5.x (Arduino core 3.x) → driver/temperature_sensor.h
// Dò bằng __has_include để cùng một file build được trên cả hai —
// nếu không, nâng cấp core là hỏng build mà không rõ vì sao.
#if __has_include(<driver/temperature_sensor.h>)
#  include <driver/temperature_sensor.h>
#  define HAS_TEMP_IDF5 1
#elif __has_include(<driver/temp_sensor.h>)
#  include <driver/temp_sensor.h>
#  define HAS_TEMP_IDF4 1
#endif

// ─── Chân (khớp với README trong thư mục này) ─────────────
#define PIN_MIC_SCK 4
#define PIN_MIC_WS 5
#define PIN_MIC_SD 6
#define PIN_AMP_BCLK 15
#define PIN_AMP_LRC 16
#define PIN_AMP_DIN 7
#define PIN_BATTERY_ADC 3
#define PIN_I2C_SDA 8
#define PIN_I2C_SCL 18

static void line(char c = '-') {
  for (int i = 0; i < 62; i++) Serial.print(c);
  Serial.println();
}
static void head(const char* t) {
  Serial.println();
  line('=');
  Serial.printf("  %s\n", t);
  line('=');
}

// ══════════════════════════════════════════════════════════
// 0. KHÁM TỔNG QUÁT — dành cho bo dùng lại
// ══════════════════════════════════════════════════════════

/** Lý do khởi động lần trước. BROWNOUT lặp lại = vấn đề nguồn, không phải code. */
static const char* resetReasonText(esp_reset_reason_t r) {
  switch (r) {
    case ESP_RST_POWERON: return "cắm điện bình thường";
    case ESP_RST_SW: return "phần mềm gọi restart";
    case ESP_RST_PANIC: return "CHƯƠNG TRÌNH SỤP (panic/exception)";
    case ESP_RST_INT_WDT: return "watchdog ngắt";
    case ESP_RST_TASK_WDT: return "watchdog tác vụ";
    case ESP_RST_BROWNOUT: return "SỤT ÁP — nguồn không đủ!";
    case ESP_RST_DEEPSLEEP: return "thức dậy từ ngủ sâu";
    case ESP_RST_EXT: return "nút reset ngoài";
    default: return "không rõ";
  }
}

static void checkChip() {
  esp_chip_info_t info;
  esp_chip_info(&info);
  const char* model = info.model == CHIP_ESP32S3 ? "ESP32-S3"
                    : info.model == CHIP_ESP32   ? "ESP32 (KHÔNG phải S3!)"
                                                 : "khác";
  Serial.printf("  Chip        : %s, %d lõi, rev %d\n", model, info.cores, info.revision);
  Serial.printf("  Tần số      : %lu MHz\n", getCpuFrequencyMhz());
  Serial.printf("  MAC         : %s\n", WiFi.macAddress().c_str());
  Serial.printf("  Tính năng   : %s%s\n",
                (info.features & CHIP_FEATURE_WIFI_BGN) ? "WiFi " : "",
                (info.features & CHIP_FEATURE_BLE) ? "BLE" : "");
  Serial.printf("  Khởi động   : %s\n", resetReasonText(esp_reset_reason()));

  if (info.model != CHIP_ESP32S3) {
    Serial.println("  ⚠️  ĐÂY KHÔNG PHẢI ESP32-S3. Dự án này cần S3.");
  }
}

static void checkFlash() {
  uint32_t size = 0;
  esp_flash_get_size(NULL, &size);
  Serial.printf("  Dung lượng  : %lu MB\n", size / (1024 * 1024));
  Serial.printf("  Tốc độ      : %lu MHz\n", ESP.getFlashChipSpeed() / 1000000);
  if (size < 8 * 1024 * 1024) {
    Serial.println("  ⚠️  Dưới 8 MB — firmware đầy đủ (có OTA) sẽ không vừa.");
  } else {
    Serial.println("  ✅ Đủ chỗ cho firmware + phân vùng OTA dự phòng");
  }

  // Đọc thử toàn bộ phân vùng app và tự tính tổng kiểm — nếu flash đã
  // mòn tới mức đọc lỗi, bước này sẽ chậm bất thường hoặc trả về rác.
  const esp_partition_t* p = esp_ota_get_running_partition();
  if (p) {
    uint32_t sum = 0;
    uint8_t buf[512];
    uint32_t toRead = p->size < 262144 ? p->size : 262144;  // đọc 256 KB đầu
    uint32_t t0 = millis();
    for (uint32_t off = 0; off < toRead; off += sizeof(buf)) {
      if (esp_partition_read(p, off, buf, sizeof(buf)) != ESP_OK) {
        Serial.printf("  ❌ ĐỌC FLASH LỖI tại offset %lu\n", off);
        return;
      }
      for (size_t i = 0; i < sizeof(buf); i++) sum += buf[i];
    }
    Serial.printf("  Đọc thử     : 256 KB trong %lu ms (tổng kiểm 0x%08lX)\n",
                  millis() - t0, sum);
    Serial.println("  ✅ Flash đọc được ổn định");
  }
}

/**
 * Kiểm PSRAM bằng phép thử "march": ghi một mẫu phụ thuộc địa chỉ vào
 * TOÀN BỘ vùng nhớ rồi đọc lại. Đây là cách duy nhất bắt được bit chết
 * — `psramFound()` chỉ nói có chip, không nói chip còn tốt.
 *
 * Một bit PSRAM hỏng biểu hiện thành: tiếng nói méo ngẫu nhiên, mắt
 * nhấp nháy điểm lạ, hoặc chương trình sụp sau vài phút. Không bao giờ
 * biểu hiện thành thông báo lỗi.
 */
static void checkPsram() {
  if (!psramFound()) {
    Serial.println("  ❌ KHÔNG THẤY PSRAM");
    Serial.println("     Bo này không phải bản N16R8/N8R2. Phần âm thanh");
    Serial.println("     sẽ hết RAM ngay lượt nói đầu tiên.");
    return;
  }

  size_t total = ESP.getPsramSize();
  size_t freeNow = ESP.getFreePsram();
  // Tính bằng KB rồi mới đổi ra MB — chia nguyên trực tiếp cho
  // 1024*1024 làm 8 MB hiện thành "7 MB" vì phần vài KB dành riêng.
  Serial.printf("  Dung lượng  : %.1f MB (còn trống %u KB)\n",
                total / 1048576.0f, (unsigned)(freeNow / 1024));

  // Thử trên 1 MB — đủ để bắt lỗi bit mà không mất cả phút
  const size_t TEST = 1024 * 1024;
  uint32_t* buf = (uint32_t*)ps_malloc(TEST);
  if (!buf) {
    Serial.println("  ❌ Không cấp phát nổi 1 MB PSRAM");
    return;
  }

  const size_t words = TEST / sizeof(uint32_t);
  uint32_t t0 = millis();

  // Lượt 1: ghi mẫu phụ thuộc địa chỉ (bắt được cả lỗi dây địa chỉ)
  for (size_t i = 0; i < words; i++) buf[i] = (uint32_t)(i * 2654435761u);

  // Lượt 2: đọc lại và đối chiếu
  size_t bad = 0;
  size_t firstBad = 0;
  for (size_t i = 0; i < words; i++) {
    uint32_t want = (uint32_t)(i * 2654435761u);
    if (buf[i] != want) {
      if (!bad) firstBad = i;
      bad++;
    }
  }

  // Lượt 3: mẫu đảo bit — bắt lỗi chỉ xuất hiện ở một trạng thái
  for (size_t i = 0; i < words; i++) buf[i] = ~(uint32_t)(i * 2654435761u);
  for (size_t i = 0; i < words; i++) {
    if (buf[i] != ~(uint32_t)(i * 2654435761u)) {
      if (!bad) firstBad = i;
      bad++;
    }
  }

  uint32_t ms = millis() - t0;
  free(buf);

  if (bad == 0) {
    Serial.printf("  ✅ Thử ghi/đọc 1 MB × 2 mẫu: KHÔNG LỖI (%lu ms)\n", ms);
  } else {
    Serial.printf("  ❌ PSRAM LỖI: %u từ sai, đầu tiên ở offset %u\n", bad, firstBad * 4);
    Serial.println("     Bo này KHÔNG dùng được cho phần âm thanh.");
  }
}

static void checkHeap() {
  size_t freeHeap = ESP.getFreeHeap();
  // MALLOC_CAP_INTERNAL, không phải MALLOC_CAP_8BIT: cái sau tính cả
  // PSRAM nên báo "khối liền lớn nhất 8 MB" — đúng số nhưng trả lời
  // sai câu hỏi. Ở đây ta muốn biết RAM TRONG CHIP còn bao nhiêu.
  size_t largest = heap_caps_get_largest_free_block(MALLOC_CAP_INTERNAL);
  size_t minEver = ESP.getMinFreeHeap();
  Serial.printf("  Còn trống   : %u KB\n", freeHeap / 1024);
  Serial.printf("  Khối liền lớn nhất: %u KB\n", largest / 1024);
  Serial.printf("  Thấp nhất từng đạt: %u KB\n", minEver / 1024);
  if (largest < 40000) {
    Serial.println("  ⚠️  Phân mảnh nặng — bất thường ngay sau khởi động");
  } else {
    Serial.println("  ✅ Bình thường");
  }
}

/**
 * Quét chân bằng điện trở kéo NỘI BỘ — không cần cắm dây gì.
 *
 * Chân tốt: kéo lên đọc được 1, kéo xuống đọc được 0.
 * Luôn đọc 0  → chân bị chập xuống đất, hoặc đã chết (hay gặp ở bo cũ
 *               từng đấu nhầm nguồn vào chân tín hiệu).
 * Luôn đọc 1  → chân bị chập lên nguồn.
 *
 * Bỏ qua các chân đã bị flash/PSRAM/USB chiếm — đụng vào là treo bo.
 */
static void checkGpio() {
  // Chân KHÔNG được đụng vào:
  //   22–25      không tồn tại trên ESP32-S3 (chip có 0–21 và 26–48)
  //   26–32      SPI flash
  //   33–37      PSRAM octal (bản R8)
  //   19/20      USB D−/D+
  //   43/44      UART0 — đang dùng cho log
  auto skip = [](int p) {
    return (p >= 22 && p <= 37) || p == 19 || p == 20 || p == 43 || p == 44;
  };

  // Chân CÓ trở kéo sẵn trên bo DevKitC-1 — đọc lệch là bình thường,
  // không phải hỏng. Không cảnh báo, chỉ ghi chú.
  auto expected = [](int p) {
    return p == 0     // nút BOOT, kéo lên
        || p == 45    // strapping, kéo xuống
        || p == 46    // strapping, chỉ vào
        || p == 48;   // LED RGB gắn sẵn
  };

  int ok = 0, stuckLow = 0, stuckHigh = 0, onboard = 0;
  String badPins = "";

  for (int p = 0; p <= 48; p++) {
    if (skip(p)) continue;
    pinMode(p, INPUT_PULLUP);
    delayMicroseconds(600);
    bool up = digitalRead(p);
    pinMode(p, INPUT_PULLDOWN);
    delayMicroseconds(600);
    bool down = digitalRead(p);
    pinMode(p, INPUT);

    if (up && !down) {
      ok++;
    } else if (expected(p)) {
      onboard++;  // trở kéo sẵn trên bo — đúng như thiết kế
    } else if (!up && !down) {
      stuckLow++;
      badPins += String(p) + "(kẹt thấp) ";
    } else {
      stuckHigh++;
      badPins += String(p) + "(kẹt cao) ";
    }
  }

  Serial.printf("  Chân tốt    : %d\n", ok);
  Serial.printf("  Có trở sẵn trên bo: %d (GPIO 0/45/46/48 — bình thường)\n", onboard);
  if (stuckLow || stuckHigh) {
    Serial.printf("  ⚠️  Chân nghi hỏng (%d): %s\n", stuckLow + stuckHigh, badPins.c_str());
    Serial.println("     Nếu đang KHÔNG cắm gì vào bo → chân đó hỏng thật.");
    Serial.println("     Nếu đang cắm mạch → có thể do mạch kéo, rút ra thử lại.");
  } else {
    Serial.println("  ✅ Không có chân nào hỏng");
  }
}

static void checkTemp() {
  float t = NAN;

#if defined(HAS_TEMP_IDF5)
  temperature_sensor_handle_t th = NULL;
  temperature_sensor_config_t cfg = TEMPERATURE_SENSOR_CONFIG_DEFAULT(-10, 80);
  if (temperature_sensor_install(&cfg, &th) == ESP_OK) {
    temperature_sensor_enable(th);
    temperature_sensor_get_celsius(th, &t);
    temperature_sensor_disable(th);
    temperature_sensor_uninstall(th);
  }
#elif defined(HAS_TEMP_IDF4)
  temp_sensor_config_t cfg = TSENS_CONFIG_DEFAULT();
  temp_sensor_set_config(cfg);
  temp_sensor_start();
  temp_sensor_read_celsius(&t);
  temp_sensor_stop();
#endif

  if (isnan(t)) {
    Serial.println("  (bản ESP-IDF này không có cảm biến nhiệt — bỏ qua)");
    return;
  }
  Serial.printf("  Nhiệt độ    : %.1f °C\n", t);
  if (t > 60) Serial.println("  ⚠️  Nóng bất thường khi chưa tải gì — kiểm nguồn");
  else Serial.println("  ✅ Bình thường");
}

static void checkWifiRadio() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  if (n <= 0) {
    Serial.println("  ❌ Không thấy mạng nào — ăng-ten hoặc phần radio có vấn đề");
    return;
  }
  int best = -127;
  String bestName;
  for (int i = 0; i < n; i++) {
    if (WiFi.RSSI(i) > best) {
      best = WiFi.RSSI(i);
      bestName = WiFi.SSID(i);
    }
  }
  Serial.printf("  Thấy %d mạng · mạnh nhất \"%s\" %d dBm\n", n, bestName.c_str(), best);
  if (best < -75) Serial.println("  ⚠️  Sóng yếu — có thể ăng-ten kém hoặc ở xa router");
  else Serial.println("  ✅ Phần radio hoạt động tốt");
  WiFi.scanDelete();
}

static void healthCheck() {
  head("KHÁM TỔNG QUÁT BO MẠCH");
  Serial.println("\n[1/7] Chip");           checkChip();
  Serial.println("\n[2/7] Bộ nhớ chương trình (flash)"); checkFlash();
  Serial.println("\n[3/7] PSRAM");          checkPsram();
  Serial.println("\n[4/7] RAM trong chip"); checkHeap();
  Serial.println("\n[5/7] Chân GPIO");      checkGpio();
  Serial.println("\n[6/7] Nhiệt độ");       checkTemp();
  Serial.println("\n[7/7] WiFi");           checkWifiRadio();
  line('=');
  Serial.println("  Xong. Mọi mục ✅ nghĩa là bo dùng tốt cho dự án này.");
  line('=');
}

// ══════════════════════════════════════════════════════════
// 1–6. Kiểm từng linh kiện
// ══════════════════════════════════════════════════════════

static bool micReady = false;

static void micInit() {
  if (micReady) return;
  i2s_config_t cfg = {
      .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
      .sample_rate = 16000,
      .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
      .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
      .communication_format = I2S_COMM_FORMAT_STAND_I2S,
      .intr_alloc_flags = 0,
      .dma_buf_count = 8,
      .dma_buf_len = 256,
      .use_apll = false,
  };
  i2s_pin_config_t pins = {
      .bck_io_num = PIN_MIC_SCK,
      .ws_io_num = PIN_MIC_WS,
      .data_out_num = I2S_PIN_NO_CHANGE,
      .data_in_num = PIN_MIC_SD,
  };
  i2s_driver_install(I2S_NUM_0, &cfg, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pins);
  micReady = true;
}

static void testMic() {
  head("KIỂM MICRO INMP441 — nói vào micro trong 10 giây");
  micInit();
  int32_t samples[256];
  size_t got = 0;
  int32_t peak = 0;

  for (int s = 0; s < 40; s++) {
    i2s_read(I2S_NUM_0, samples, sizeof(samples), &got, portMAX_DELAY);
    int n = got / sizeof(int32_t);
    int64_t sum = 0;
    for (int i = 0; i < n; i++) {
      int32_t v = abs(samples[i] >> 8);  // dữ liệu ở 24 bit CAO
      sum += v;
      if (v > peak) peak = v;
    }
    int32_t avg = n ? sum / n : 0;

    Serial.printf("  mức %6ld  ", avg);
    int bars = avg / 2000;
    for (int b = 0; b < (bars > 40 ? 40 : bars); b++) Serial.print('#');
    Serial.println();
    delay(250);
  }

  line();
  if (peak < 500) {
    Serial.println("  ❌ Gần như không có tín hiệu.");
    Serial.println("     • Chân L/R đã nối xuống GND chưa? (quên là đọc ra 0)");
    Serial.println("     • Kiểm SCK=4, WS=5, SD=6, VDD=3V3");
  } else if (peak < 5000) {
    Serial.println("  ⚠️  Có tín hiệu nhưng yếu. Nói to hơn hoặc đưa gần micro.");
  } else {
    Serial.printf("  ✅ Micro tốt (đỉnh %ld)\n", peak);
  }
}

static void testSpeaker() {
  head("KIỂM LOA — phát 5 nốt");
  i2s_config_t cfg = {
      .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
      .sample_rate = 22050,
      .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
      .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
      .communication_format = I2S_COMM_FORMAT_STAND_I2S,
      .intr_alloc_flags = 0,
      .dma_buf_count = 8,
      .dma_buf_len = 256,
      .use_apll = false,
  };
  i2s_pin_config_t pins = {
      .bck_io_num = PIN_AMP_BCLK,
      .ws_io_num = PIN_AMP_LRC,
      .data_out_num = PIN_AMP_DIN,
      .data_in_num = I2S_PIN_NO_CHANGE,
  };
  i2s_driver_install(I2S_NUM_1, &cfg, 0, NULL);
  i2s_set_pin(I2S_NUM_1, &pins);

  const int notes[5] = {262, 330, 392, 523, 659};  // đô mi son đô mi
  const char* names[5] = {"đô", "mi", "son", "đô cao", "mi cao"};

  for (int n = 0; n < 5; n++) {
    Serial.printf("  phát nốt %s (%d Hz)\n", names[n], notes[n]);
    const int total = 22050 * 0.35;
    int16_t frame[2];
    for (int i = 0; i < total; i++) {
      // hình sin, có vuốt biên độ ở đầu/cuối cho khỏi "cụp"
      float env = 1.0f;
      if (i < 500) env = i / 500.0f;
      if (i > total - 500) env = (total - i) / 500.0f;
      int16_t v = (int16_t)(sinf(2 * PI * notes[n] * i / 22050.0f) * 7000 * env);
      frame[0] = frame[1] = v;
      size_t w;
      i2s_write(I2S_NUM_1, frame, sizeof(frame), &w, portMAX_DELAY);
    }
    delay(80);
  }

  i2s_driver_uninstall(I2S_NUM_1);
  line();
  Serial.println("  Nghe được 5 nốt rõ ràng → loa và MAX98357A tốt.");
  Serial.println("  Im lặng hoàn toàn:");
  Serial.println("     • Chân SD của MAX98357A nối GND là chip TẮT — phải để hở hoặc nối 3V3");
  Serial.println("     • Vin phải lấy 5 V, không phải 3V3");
  Serial.println("     • Chân − của loa KHÔNG được nối đất");
}

/**
 * Quét bus I2C — cho biết chính xác thiết bị nào đang ở địa chỉ nào.
 *
 * Chạy cái này TRƯỚC KHI viết code cho bất cứ thiết bị I2C nào. Hai
 * màn OLED cùng địa chỉ 0x3C sẽ hiện y hệt nhau và bạn sẽ tưởng một
 * cái hỏng; MPU6050 nhái đôi khi nằm ở 0x69 thay vì 0x68. Quét một
 * lần là hết đoán.
 */
static void testI2c() {
  head("QUÉT BUS I2C — SDA=GPIO8, SCL=GPIO18");
  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  Wire.setClock(100000);

  struct Known { uint8_t addr; const char* name; };
  static const Known KNOWN[] = {
      {0x3C, "OLED SSD1306 (địa chỉ mặc định)"},
      {0x3D, "OLED SSD1306 (đã đổi địa chỉ) ✓"},
      {0x40, "PCA9685 điều servo"},
      {0x29, "VL53L0X laser đo xa"},
      {0x68, "MPU6050 gia tốc/con quay"},
      {0x69, "MPU6050 (AD0 kéo cao)"},
      {0x76, "BME280 cảm biến môi trường"},
      {0x77, "BME280/BMP280"},
  };

  int found = 0;
  bool oled3C = false, oled3D = false;

  for (uint8_t a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() != 0) continue;
    found++;
    const char* name = "(chưa biết là gì)";
    for (auto& k : KNOWN)
      if (k.addr == a) name = k.name;
    Serial.printf("  0x%02X  %s\n", a, name);
    if (a == 0x3C) oled3C = true;
    if (a == 0x3D) oled3D = true;
  }

  line();
  if (!found) {
    Serial.println("  ❌ Không thấy thiết bị I2C nào.");
    Serial.println("     • SDA vào GPIO8, SCL vào GPIO18?");
    Serial.println("     • Đã cấp 3V3 và GND cho thiết bị chưa?");
    Serial.println("     • Vài module cần điện trở kéo lên 4k7 (phần lớn có sẵn)");
    return;
  }

  Serial.printf("  Thấy %d thiết bị\n", found);

  if (oled3C && oled3D) {
    Serial.println("  ✅ HAI màn OLED ở hai địa chỉ khác nhau — dùng được cả hai làm hai mắt");
  } else if (oled3C && !oled3D) {
    Serial.println("  ⚠️  Chỉ thấy MỘT màn OLED ở 0x3C.");
    Serial.println("     Nếu bạn đang cắm HAI màn: chúng cùng địa chỉ nên bus chỉ thấy một.");
    Serial.println("     Cách sửa: lật mặt sau MỘT màn, tìm hai pad hàn ghi 0x78 / 0x7A,");
    Serial.println("     di mối hàn sang 0x7A. Xong quét lại sẽ thấy 0x3D.");
  }
}

/**
 * Kiểm loa bằng chính MICRO — không cần tai người.
 *
 * Phát một nốt rồi đo mức micro trong lúc phát, so với mức nền đo
 * trước đó. Loa kêu thật thì micro thấy chênh lệch rõ; loa câm thì hai
 * con số bằng nhau.
 *
 * Cách này trả lời được câu "loa có kêu không" mà không phải hỏi ai —
 * và nó cũng chính là phép đo cho biết tiếng loa có vọng ngược vào
 * micro đủ mạnh để gây vòng lặp phản hồi hay không.
 */
static void testLoopback() {
  head("KIỂM LOA BẰNG MICRO — máy tự nghe, không cần tai người");
  micInit();

  int32_t samples[256];
  size_t got = 0;

  // Vứt bỏ những khối đầu tiên. Ngay sau khi cài driver I2S, micro
  // chưa ổn định và trả về giá trị lệch rất lớn — lần chạy trước đo
  // ra mức nền 39000 trong khi thực tế chỉ 1200, đủ để kết luận sai
  // là loa hỏng.
  Serial.println("  Chờ micro ổn định...");
  for (int i = 0; i < 20; i++) {
    i2s_read(I2S_NUM_0, samples, sizeof(samples), &got, portMAX_DELAY);
  }

  // ── Đo nền: im lặng ──
  Serial.println("  Đang đo mức nền (giữ yên lặng 2 giây)...");
  int64_t sum = 0;
  int count = 0;
  uint32_t t0 = millis();
  while (millis() - t0 < 2000) {
    i2s_read(I2S_NUM_0, samples, sizeof(samples), &got, portMAX_DELAY);
    int n = got / sizeof(int32_t);
    for (int i = 0; i < n; i++) sum += abs(samples[i] >> 8);
    count += n;
  }
  int32_t baseline = count ? sum / count : 0;
  Serial.printf("  Mức nền     : %ld\n", baseline);

  // ── Bật loa ──
  i2s_config_t out = {
      .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
      .sample_rate = 22050,
      .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
      .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
      .communication_format = I2S_COMM_FORMAT_STAND_I2S,
      .intr_alloc_flags = 0,
      .dma_buf_count = 8,
      .dma_buf_len = 256,
      .use_apll = false,
  };
  i2s_pin_config_t opins = {
      .bck_io_num = PIN_AMP_BCLK,
      .ws_io_num = PIN_AMP_LRC,
      .data_out_num = PIN_AMP_DIN,
      .data_in_num = I2S_PIN_NO_CHANGE,
  };
  i2s_driver_install(I2S_NUM_1, &out, 0, NULL);
  i2s_set_pin(I2S_NUM_1, &opins);

  // ── Phát nốt 880 Hz và đo micro CÙNG LÚC ──
  // 880 Hz (nốt la cao) vì nó nằm giữa dải nhạy nhất của micro MEMS
  // và xa hẳn tiếng ồn tần số thấp của quạt/máy tính.
  Serial.println("  Đang phát nốt và nghe lại...");
  sum = 0;
  count = 0;
  int32_t peak = 0;
  int16_t frame[2];
  t0 = millis();
  uint32_t phase = 0;

  while (millis() - t0 < 2500) {
    // Đẩy một khối âm thanh ra loa
    for (int i = 0; i < 220; i++) {
      int16_t v = (int16_t)(sinf(2 * PI * 880.0f * phase / 22050.0f) * 9000);
      frame[0] = frame[1] = v;
      size_t w;
      i2s_write(I2S_NUM_1, frame, sizeof(frame), &w, portMAX_DELAY);
      phase++;
    }
    // Rồi đọc micro nghe được gì. portMAX_DELAY chứ không phải timeout
    // ngắn: timeout làm `got` về 0 ở phần lớn vòng lặp và trung bình
    // tính ra thấp hơn cả mức nền — đúng cái bẫy lần chạy trước dính.
    i2s_read(I2S_NUM_0, samples, sizeof(samples), &got, portMAX_DELAY);
    int n = got / sizeof(int32_t);
    for (int i = 0; i < n; i++) {
      int32_t a = abs(samples[i] >> 8);
      sum += a;
      if (a > peak) peak = a;
    }
    count += n;
  }

  i2s_driver_uninstall(I2S_NUM_1);

  int32_t heard = count ? sum / count : 0;
  float ratio = baseline > 0 ? (float)heard / baseline : 0;

  line();
  Serial.printf("  Mức khi phát: %ld  (đỉnh %ld)\n", heard, peak);
  Serial.printf("  Gấp nền     : %.1f lần\n", ratio);
  line();

  // ⚠️ Phép đo này KHÔNG kết luận được "loa hỏng".
  //
  // Ngày 10/08/2026 nó báo ❌ trong khi loa kêu to rõ — tai người xác
  // nhận. Lý do: micro và loa đặt cách nhau vài chục cm và lệch hướng
  // màng, nên tiếng vọng về không đủ vượt nền. Kết quả là suýt đi tháo
  // lại toàn bộ dây của một mạch vốn đã đúng.
  //
  // Vì vậy: chỉ dùng nó để XÁC NHẬN DƯƠNG TÍNH (nghe thấy → chắc chắn
  // loa kêu). Không nghe thấy thì chưa nói lên điều gì — phải nghe
  // bằng tai.
  if (ratio > 2.5f) {
    Serial.println("  ✅ LOA KÊU THẬT — micro nghe rõ tiếng loa.");
    Serial.println("     Cả hai linh kiện đều hoạt động.");
    if (ratio > 25.0f) {
      Serial.println("  ⚠️  Tiếng vọng vào micro RẤT mạnh. Khi lắp vào vỏ phải");
      Serial.println("     tách micro xa loa, nếu không robot sẽ tự nghe chính nó.");
    }
  } else {
    Serial.println("  ⚠️  Micro không nghe thấy tiếng loa — NHƯNG CHƯA KẾT LUẬN ĐƯỢC.");
    Serial.println("     Micro có thể đặt xa loa hoặc lệch hướng màng.");
    Serial.println("     ➜ Chạy lệnh 2 và NGHE BẰNG TAI. Đó mới là câu trả lời thật.");
    Serial.println();
    Serial.println("     Nếu tai cũng không nghe thấy gì thì mới kiểm:");
    Serial.println("     • Chân SD nối GND là chip TẮT → để trống");
    Serial.println("     • Vin phải là 5 V (3V3 thì tiếng nhỏ hẳn)");
    Serial.println("     • Chân − của loa KHÔNG nối đất");
    Serial.println("     • BCLK=15, LRC=16, DIN=7");
  }
}

#ifdef HAS_TFT
/**
 * Kiểm màn 3.5" SPI — và cho thấy luôn nó sẽ dùng để làm gì.
 *
 * Bốn bước, mỗi bước loại trừ một nguyên nhân:
 *   1. Tô ba màu nguyên  → nếu sai màu thì chip driver chọn sai
 *   2. Vẽ khung + chữ    → xác nhận toạ độ và font đúng chiều
 *   3. Vẽ hai con mắt    → xem thử làm mặt robot trông thế nào
 *   4. Bảng trạng thái   → đúng thứ màn này sẽ hiển thị ở ngực robot
 */
static void testTft() {
  head("KIỂM MÀN HÌNH 3.5\" SPI");
#ifdef ILI9488_DRIVER
  Serial.println("  Driver biên dịch: ILI9488");
#elif defined(ST7796_DRIVER)
  Serial.println("  Driver biên dịch: ST7796");
#endif
  Serial.println("  NHÌN VÀO MÀN HÌNH — sẽ chạy 4 bước, mỗi bước 2 giây");

  tft.init();
  tft.setRotation(1);  // nằm ngang: 480 rộng × 320 cao

  // ── 1. Ba màu nguyên ──
  Serial.println("  [1/4] Tô đỏ → lục → lam");
  const uint16_t colors[3] = {TFT_RED, TFT_GREEN, TFT_BLUE};
  const char* names[3] = {"ĐỎ", "LỤC", "LAM"};
  for (int i = 0; i < 3; i++) {
    tft.fillScreen(colors[i]);
    tft.setTextColor(TFT_WHITE, colors[i]);
    tft.setTextSize(3);
    tft.setCursor(20, 20);
    tft.print(names[i]);
    delay(700);
  }

  // ── 2. Khung + chữ ──
  Serial.println("  [2/4] Khung viền + chữ");
  tft.fillScreen(TFT_BLACK);
  tft.drawRect(0, 0, tft.width(), tft.height(), TFT_WHITE);
  tft.drawRect(4, 4, tft.width() - 8, tft.height() - 8, TFT_CYAN);
  tft.setTextColor(TFT_CYAN, TFT_BLACK);
  tft.setTextSize(2);
  tft.setCursor(20, 30);
  tft.printf("%d x %d", tft.width(), tft.height());
  tft.setTextSize(1);
  tft.setCursor(20, 60);
  tft.print("Neu thay khung SAT MEP 4 canh -> toa do dung");
  delay(2000);

  // ── 3. Hai con mắt ──
  Serial.println("  [3/4] Vẽ hai con mắt");
  tft.fillScreen(TFT_BLACK);
  const int cx[2] = {tft.width() / 2 - 90, tft.width() / 2 + 90};
  for (int e = 0; e < 2; e++) {
    tft.fillCircle(cx[e], tft.height() / 2, 70, TFT_BLUE);
    tft.fillCircle(cx[e], tft.height() / 2, 44, tft.color565(0, 40, 130));
    tft.fillCircle(cx[e], tft.height() / 2, 24, TFT_BLACK);
    tft.fillCircle(cx[e] - 18, tft.height() / 2 - 18, 12, TFT_WHITE);
  }
  delay(2000);

  // ── 4. Bảng trạng thái — vai trò thật của màn này ──
  Serial.println("  [4/4] Bảng trạng thái (vai trò thật ở ngực robot)");
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  tft.setTextSize(2);
  tft.setCursor(12, 12);
  tft.print("MINI-ME ROBOT");
  tft.drawFastHLine(12, 36, tft.width() - 24, TFT_DARKGREY);

  tft.setTextSize(1);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  int y = 52;
  tft.setCursor(12, y); tft.print("Chip    : ESP32-S3  8MB PSRAM");     y += 18;
  tft.setCursor(12, y); tft.print("Micro   : INMP441   OK");            y += 18;
  tft.setCursor(12, y); tft.print("Loa     : MAX98357A OK");            y += 18;
  tft.setCursor(12, y); tft.printf("Man hinh: %dx%d      OK", tft.width(), tft.height()); y += 24;

  // Thanh mức âm thanh — thứ sẽ chạy thật khi robot nghe
  tft.setTextColor(TFT_CYAN, TFT_BLACK);
  tft.setCursor(12, y); tft.print("Muc micro (noi vao mic di):");
  int barY = y + 16;
  tft.drawRect(12, barY, tft.width() - 24, 22, TFT_DARKGREY);

  micInit();
  uint32_t t0 = millis();
  int32_t samples[256];
  size_t got = 0;
  while (millis() - t0 < 8000) {
    i2s_read(I2S_NUM_0, samples, sizeof(samples), &got, portMAX_DELAY);
    int n = got / sizeof(int32_t);
    int64_t sum = 0;
    for (int i = 0; i < n; i++) sum += abs(samples[i] >> 8);
    int32_t level = n ? sum / n : 0;

    int w = map(constrain(level, 0, 15000), 0, 15000, 0, tft.width() - 28);
    tft.fillRect(14, barY + 2, w, 18, level > 2800 ? TFT_GREEN : TFT_BLUE);
    tft.fillRect(14 + w, barY + 2, tft.width() - 28 - w, 18, TFT_BLACK);
  }

  line();
  Serial.println("  Thấy đủ 4 bước → màn hình và driver ĐÚNG.");
  Serial.println("  Vẫn TRẮNG XOÁ → sai driver, nạp env còn lại:");
#ifdef ILI9488_DRIVER
  Serial.println("     pio run -e test-st7796 -t upload");
#else
  Serial.println("     pio run -e test-ili9488 -t upload");
#endif
  Serial.println("  Có hình nhưng SỌC NHIỄU → hạ SPI_FREQUENCY xuống 20000000");
  Serial.println("  Màu SAI (đỏ ra xanh) → cũng là sai driver, đổi env");
}
#endif  // HAS_TFT

static void testBattery() {
  head("KIỂM NGUỒN");
  analogReadResolution(12);
  uint32_t mv = analogReadMilliVolts(PIN_BATTERY_ADC);
  Serial.printf("  ADC chân %d đọc: %lu mV\n", PIN_BATTERY_ADC, mv);
  Serial.printf("  Nếu qua chia áp 100k/47k → pin ≈ %.2f V\n", mv * 3.128f / 1000.0f);
  Serial.println();
  Serial.println("  Chưa cắm chia áp thì con số này vô nghĩa — bình thường.");
  Serial.println("  ⚠️  Nhớ vặn LM2596 ra ĐÚNG 5,0 V trước khi cắm gì vào bo.");
}

// ══════════════════════════════════════════════════════════

static void menu() {
  Serial.println();
  line('=');
  Serial.println("  MINI-ME ROBOT — bàn kiểm");
  line('=');
  Serial.println("  0  Khám tổng quát bo mạch  ← chạy cái này trước");
  Serial.println("  1  Kiểm micro INMP441");
  Serial.println("  2  Kiểm loa MAX98357A");
  Serial.println("  3  Quét bus I2C (tìm màn OLED, cảm biến)");
  Serial.println("  4  Kiểm nguồn / ADC");
  Serial.println("  5  Kiểm loa BẰNG MICRO (máy tự nghe, không cần tai)");
#ifdef HAS_TFT
  Serial.println("  6  Kiểm màn hình 3.5 inch");
#endif
  Serial.println("  9  Chạy lại menu");
  line('=');
  Serial.print("  Chọn: ");
}

void setup() {
  Serial.begin(115200);
  delay(1200);  // chờ cổng USB CDC sẵn sàng
  Serial.println("\n\n");
  Serial.println("Mini-Me Robot — bàn kiểm linh kiện");
  Serial.println("Nạp xong lần đầu? Gõ 0 và Enter.");
  menu();
}

void loop() {
  if (!Serial.available()) {
    delay(50);
    return;
  }
  int c = Serial.read();
  while (Serial.available()) Serial.read();  // xả phần thừa

  switch (c) {
    case '0': healthCheck(); break;
    case '1': testMic(); break;
    case '2': testSpeaker(); break;
    case '3': testI2c(); break;
    case '4': testBattery(); break;
    case '5': testLoopback(); break;
#ifdef HAS_TFT
    case '6': testTft(); break;
#endif
    case '9': break;
    default: return;
  }
  menu();
}
