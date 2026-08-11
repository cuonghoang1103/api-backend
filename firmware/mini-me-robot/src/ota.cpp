#include "ota.h"

#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <Update.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <mbedtls/sha256.h>

#include "config.h"
#include "secrets.h"

namespace ota {
namespace {

volatile bool g_dangChay = false;
volatile uint8_t g_phanTram = 0;

/** Bộ đệm đọc mạng. 4 KB đủ nhanh mà không ăn nhiều heap — heap còn
 *  phải nuôi TLS (~40 KB) và vòng đệm âm thanh 512 KB ở PSRAM. */
constexpr size_t DOC_BUF = 4096;

/** Bản .bin của bo này cỡ 1,3–1,6 MB. Trần 4 MB để bắt trường hợp URL
 *  trỏ nhầm vào file khổng lồ, chứ không phải để giới hạn thật. */
constexpr size_t TRAN_BYTE = 4u * 1024 * 1024;

String hexTu(const uint8_t* b, size_t n) {
  static const char* H = "0123456789abcdef";
  String s;
  s.reserve(n * 2);
  for (size_t i = 0; i < n; i++) {
    s += H[b[i] >> 4];
    s += H[b[i] & 0x0F];
  }
  return s;
}

/**
 * Mở một kết nối HTTPS.
 *
 * `setInsecure()` — không kiểm chứng thư. Giống hệt cách thư viện
 * WebSocket đang làm ở main.cpp, nên đây không phải chỗ yếu MỚI. Ghim
 * vân tay chứng thư sẽ tốt hơn, nhưng chứng thư Let's Encrypt đổi 60
 * ngày một lần — ghim cứng vào firmware thì mỗi lần gia hạn là robot
 * mất mạng, mà lúc đó lại phải cắm cáp để sửa. Đổi lại: SHA-256 dưới
 * đây chặn được bản .bin bị sửa đổi, tức là thứ đáng lo nhất.
 */
bool moTls(WiFiClientSecure& tls) {
  tls.setInsecure();
  tls.setTimeout(20000);
  return true;
}

}  // namespace

bool dangChay() { return g_dangChay; }
uint8_t phanTram() { return g_phanTram; }

const char* moTa(Result r) {
  switch (r) {
    case OTA_DA_MOI_NHAT: return "Đã là bản mới nhất";
    case OTA_DANG_CHAY:   return "Đang cập nhật";
    case OTA_LOI_MANG:    return "Lỗi mạng khi tải";
    case OTA_LOI_KIEM:    return "Bản tải về hỏng (sai SHA-256)";
    case OTA_LOI_GHI:     return "Không ghi được vào bộ nhớ";
    case OTA_BAN_ROI:     return "Đang có lượt cập nhật khác";
  }
  return "Không rõ";
}

Result capNhat(const char* muonVersion) {
  if (g_dangChay) return OTA_BAN_ROI;
  if (WiFi.status() != WL_CONNECTED) return OTA_LOI_MANG;

  g_dangChay = true;
  g_phanTram = 0;

  // ── 1. Hỏi server có bản nào ──
  String url = String("https://") + WS_HOST + "/api/v1/maker-lab/firmware/" +
               MAKERLAB_PROJECT_SLUG + "/latest";

  WiFiClientSecure tls;
  moTls(tls);
  HTTPClient http;
  http.setTimeout(20000);
  if (!http.begin(tls, url)) {
    g_dangChay = false;
    return OTA_LOI_MANG;
  }
  int ma = http.GET();
  if (ma != 200) {
    Serial.printf("[ota] manifest HTTP %d\n", ma);
    http.end();
    g_dangChay = false;
    return OTA_LOI_MANG;
  }

  JsonDocument doc;
  DeserializationError je = deserializeJson(doc, http.getString());
  http.end();
  if (je) {
    Serial.printf("[ota] manifest hỏng: %s\n", je.c_str());
    g_dangChay = false;
    return OTA_LOI_MANG;
  }

  JsonObject d      = doc["data"];
  const char* ver   = d["version"]   | "";
  const char* sha   = d["sha256"]    | "";
  const char* binUrl= d["url"]       | "";
  size_t co         = d["sizeBytes"] | 0;

  if (!*ver || !*sha || !*binUrl) {
    Serial.println("[ota] manifest thiếu trường");
    g_dangChay = false;
    return OTA_LOI_MANG;
  }

  // ── 2. Có đáng nạp không ──
  //
  // So chuỗi chứ không so thứ tự phiên bản. Cố ý: chuỗi phiên bản ở
  // đây do người đặt ("0.2.0-changA"), không theo semver chặt chẽ, nên
  // mọi phép so sánh lớn-bé đều là đoán. "Khác thì nạp" vừa đơn giản
  // vừa cho phép QUAY LUI bản cũ — thứ mà so lớn-bé sẽ chặn mất, đúng
  // lúc cần nhất là khi bản mới bị lỗi.
  if (!muonVersion && !strcmp(ver, FW_VERSION)) {
    Serial.printf("[ota] đang chạy %s, server cũng %s — bỏ qua\n", FW_VERSION, ver);
    g_dangChay = false;
    return OTA_DA_MOI_NHAT;
  }
  if (muonVersion && *muonVersion && strcmp(ver, muonVersion)) {
    Serial.printf("[ota] server có %s nhưng yêu cầu %s\n", ver, muonVersion);
    g_dangChay = false;
    return OTA_DA_MOI_NHAT;
  }
  if (co == 0 || co > TRAN_BYTE) {
    Serial.printf("[ota] cỡ file vô lý: %u byte\n", (unsigned)co);
    g_dangChay = false;
    return OTA_LOI_MANG;
  }

  Serial.printf("[ota] %s → %s (%u KB)\n", FW_VERSION, ver, (unsigned)(co / 1024));

  // ── 3. Tải và ghi thẳng vào khe app còn trống ──
  WiFiClientSecure tls2;
  moTls(tls2);
  HTTPClient dl;
  dl.setTimeout(30000);
  // R2 trả 302 sang CDN — không theo chuyển hướng là tải về trang lỗi
  // rồi báo "sai SHA-256", một triệu chứng dẫn người ta đi sai hướng.
  dl.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
  if (!dl.begin(tls2, binUrl)) {
    g_dangChay = false;
    return OTA_LOI_MANG;
  }
  // GỌI MỘT LẦN rồi giữ mã lại. Bản đầu tôi viết `dl.GET() != 200` rồi
  // in `dl.GET()` trong thân if — tức gửi thêm nguyên một yêu cầu HTTP
  // thứ hai chỉ để lấy con số hiển thị, và tải lại từ đầu.
  int maTai = dl.GET();
  if (maTai != 200) {
    Serial.printf("[ota] tải .bin HTTP %d\n", maTai);
    dl.end();
    g_dangChay = false;
    return OTA_LOI_MANG;
  }

  // `U_FLASH` = ghi vào khe app KIA, không đè lên bản đang chạy.
  if (!Update.begin(co, U_FLASH)) {
    Serial.printf("[ota] Update.begin hỏng: %s\n", Update.errorString());
    dl.end();
    g_dangChay = false;
    return OTA_LOI_GHI;
  }

  mbedtls_sha256_context sha_ctx;
  mbedtls_sha256_init(&sha_ctx);
  mbedtls_sha256_starts(&sha_ctx, 0);  // 0 = SHA-256, không phải 224

  WiFiClient* stream = dl.getStreamPtr();
  uint8_t buf[DOC_BUF];
  size_t daGhi = 0;
  uint32_t lanCuoi = millis();

  while (daGhi < co) {
    size_t co_san = stream->available();
    if (!co_san) {
      // Ngắt hẳn thì thà bỏ còn hơn treo mãi. Bản dở nằm ở khe kia nên
      // bo vẫn khởi động bằng bản cũ — không mất gì.
      if (millis() - lanCuoi > 20000) {
        Serial.println("[ota] hết giờ chờ dữ liệu");
        Update.abort();
        mbedtls_sha256_free(&sha_ctx);
        dl.end();
        g_dangChay = false;
        return OTA_LOI_MANG;
      }
      delay(10);
      continue;
    }
    size_t n = stream->readBytes(buf, co_san > DOC_BUF ? DOC_BUF : co_san);
    if (!n) continue;

    if (Update.write(buf, n) != n) {
      Serial.printf("[ota] ghi hỏng: %s\n", Update.errorString());
      Update.abort();
      mbedtls_sha256_free(&sha_ctx);
      dl.end();
      g_dangChay = false;
      return OTA_LOI_GHI;
    }
    mbedtls_sha256_update(&sha_ctx, buf, n);
    daGhi += n;
    lanCuoi = millis();
    g_phanTram = (uint8_t)((uint64_t)daGhi * 100 / co);
  }
  dl.end();

  uint8_t tomTat[32];
  mbedtls_sha256_finish(&sha_ctx, tomTat);
  mbedtls_sha256_free(&sha_ctx);
  String daTinh = hexTu(tomTat, 32);

  // ── 4. Đối chiếu SHA-256 TRƯỚC khi đổi khe khởi động ──
  //
  // Đây là chốt chặn quan trọng nhất của cả file. Không có nó thì một
  // bản tải thiếu vài byte vẫn được đánh dấu khởi động, và lần bật máy
  // sau bo không lên nữa — phải cắm cáp cứu, tức mất đúng cái tiện lợi
  // mà OTA sinh ra để có.
  if (!daTinh.equalsIgnoreCase(sha)) {
    Serial.printf("[ota] SHA khác:\n  tính  %s\n  chờ   %s\n", daTinh.c_str(), sha);
    Update.abort();
    g_dangChay = false;
    return OTA_LOI_KIEM;
  }

  if (!Update.end(true)) {  // true = đánh dấu khe mới là khe khởi động
    Serial.printf("[ota] Update.end hỏng: %s\n", Update.errorString());
    g_dangChay = false;
    return OTA_LOI_GHI;
  }

  Serial.printf("[ota] xong %s → %s, khởi động lại\n", FW_VERSION, ver);
  Serial.flush();
  delay(400);       // để dòng log cuối kịp ra khỏi UART
  ESP.restart();    // không bao giờ trở về
  return OTA_DANG_CHAY;
}

}  // namespace ota
