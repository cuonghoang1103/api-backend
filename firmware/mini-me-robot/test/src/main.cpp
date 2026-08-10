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
  Serial.println("  3  Kiểm nguồn / ADC");
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
    case '3': testBattery(); break;
    case '9': break;
    default: return;
  }
  menu();
}
