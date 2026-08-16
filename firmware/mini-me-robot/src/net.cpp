#include "net.h"

#include <DNSServer.h>
#include <Preferences.h>
#include <WebServer.h>
#include <WiFi.h>
#include <WiFiClient.h>

#include "config.h"
#include "secrets.h"

namespace net {

// ─── Bộ nhớ mạng đã biết ───────────────────────────────────
//
// `Preferences` ghi vào phân vùng NVS — KHÁC phân vùng chứa firmware,
// nên nạp lại firmware (kể cả qua OTA) không xoá mất mạng đã lưu. Đó
// đúng là thứ ta cần: sửa mã bao nhiêu lần cũng không bắt người dùng
// khai lại WiFi.
static const uint8_t TOI_DA_MANG = 6;
static Preferences kho;

static String khoaSsid(uint8_t i) { return String("s") + i; }
static String khoaPass(uint8_t i) { return String("p") + i; }

uint8_t soMang() {
  kho.begin("wifi", true);
  const uint8_t n = kho.getUChar("n", 0);
  kho.end();
  return n > TOI_DA_MANG ? TOI_DA_MANG : n;
}

String tenMang(uint8_t i) {
  kho.begin("wifi", true);
  const String s = kho.getString(khoaSsid(i).c_str(), "");
  kho.end();
  return s;
}

static String matKhauMang(uint8_t i) {
  kho.begin("wifi", true);
  const String s = kho.getString(khoaPass(i).c_str(), "");
  kho.end();
  return s;
}

bool luuMang(const String& ssid, const String& pass) {
  if (!ssid.length() || ssid.length() > 32) return false;

  kho.begin("wifi", false);
  uint8_t n = kho.getUChar("n", 0);

  // Đã có tên này rồi thì GHI ĐÈ mật khẩu chứ đừng thêm dòng thứ hai —
  // người ta đổi mật khẩu WiFi là chuyện thường, và một danh sách có
  // hai dòng cùng tên với hai mật khẩu khác nhau thì lần sau vào mạng
  // sẽ tuỳ may rủi.
  for (uint8_t i = 0; i < n && i < TOI_DA_MANG; i++) {
    if (kho.getString(khoaSsid(i).c_str(), "") == ssid) {
      kho.putString(khoaPass(i).c_str(), pass);
      kho.end();
      Serial.printf("[net] cap nhat mat khau cho '%s'\n", ssid.c_str());
      return true;
    }
  }

  // Đầy thì đẩy mạng CŨ NHẤT ra. Danh sách xếp theo thứ tự thêm vào,
  // nên vị trí 0 là cũ nhất.
  if (n >= TOI_DA_MANG) {
    for (uint8_t i = 0; i + 1 < TOI_DA_MANG; i++) {
      kho.putString(khoaSsid(i).c_str(), kho.getString(khoaSsid(i + 1).c_str(), ""));
      kho.putString(khoaPass(i).c_str(), kho.getString(khoaPass(i + 1).c_str(), ""));
    }
    n = TOI_DA_MANG - 1;
  }

  kho.putString(khoaSsid(n).c_str(), ssid);
  kho.putString(khoaPass(n).c_str(), pass);
  kho.putUChar("n", n + 1);
  kho.end();
  Serial.printf("[net] da nho mang '%s' (tong %u)\n", ssid.c_str(), n + 1);
  return true;
}

void quenHet() {
  kho.begin("wifi", false);
  kho.clear();
  kho.end();
  Serial.println("[net] da quen het mang da luu");
}

// ─── Cổng cấu hình ─────────────────────────────────────────
// Đổi 16/08/2026 cùng lúc robot được đặt tên Odin. Nạp bản này xong
// thì tên mạng cũ BIẾN MẤT — lần cài WiFi sau phải tìm "Odin-Setup",
// và điện thoại đã nhớ "Mini-Me-Setup" sẽ không tự nối lại nữa.
static const char* CONG_SSID = "Odin-Setup";
static const char* CONG_PASS = "12345678";  // WPA2 đòi tối thiểu 8 ký tự
/**
 * Cổng tự đóng sau ngần này giây.
 *
 * Router nhà cũng có lúc khởi động lại. Robot bật đúng lúc đó sẽ không
 * thấy mạng nào và mở cổng — rồi ngồi đó mãi trong khi router đã lên
 * lại từ lâu. Hết hạn thì đóng cổng, thử lại vòng mới, không ai phải
 * làm gì cả.
 */
static const uint32_t CONG_HAN_GIAY = 180;

static WebServer* web = nullptr;
static DNSServer* dns = nullptr;
static bool congDangMo = false;
static uint32_t congMoLuc = 0;
static String dsMangQuet;
/** Hàm bơm đường tiếng trong lúc chờ — main truyền vào qua loop(). */
static void (*bomKhiCho)() = nullptr;
/** Loa kêu một tiếng báo cài xong — loop() đọc rồi tự xoá. */
static bool keuMotTieng = false;
/** Mốc khởi động lại sau khi cài xong; 0 = chưa hẹn. */
static uint32_t khoiDongLucNao = 0;
/** Mật khẩu đang chờ thử — đặt bởi handler, xử ở loop(). */
static String choSsid, choPass;
static bool dangThu = false;
/** Kết quả lần thử gần nhất, để main vẽ lên màn: 0 chưa có, 1 xong, 2 hỏng. */
static uint8_t ketQua = 0;
static String ketQuaChu;

const char* tenCong() { return CONG_SSID; }
const char* matKhauCong() { return CONG_PASS; }
bool dangMoCong() { return congDangMo; }

/**
 * Trang báo kết quả. Xanh có dấu tích, đỏ có dấu X — và nói rõ phải làm
 * gì tiếp, chứ không chỉ báo "thất bại".
 */
static String trangKetQua(bool ok, const String& loi) {
  const String mau = ok ? "#22c55e" : "#ef4444";
  const String bieu = ok ? "&#10004;" : "&#10005;";
  const String tieu = ok ? "Xong" : "Chua duoc";
  String h =
      "<!doctype html><html><head><meta charset=utf-8>"
      "<meta name=viewport content='width=device-width,initial-scale=1'>"
      "<title>Mini-Me</title><style>"
      "body{font-family:-apple-system,system-ui,sans-serif;background:#0f172a;color:#f8fafc;"
      "margin:0;padding:40px 24px;text-align:center;line-height:1.6}"
      ".v{width:76px;height:76px;border-radius:50%;margin:0 auto 20px;display:flex;"
      "align-items:center;justify-content:center;font-size:40px;color:#fff;background:" + mau + "}"
      "h1{font-size:22px;margin:0 0 8px}p{color:#94a3b8;font-size:15px;margin:0 0 24px}"
      "a{display:inline-block;padding:12px 24px;border-radius:10px;background:#334155;"
      "color:#f8fafc;text-decoration:none;font-size:15px}"
      "</style></head><body>"
      "<div class=v>" + bieu + "</div><h1>" + tieu + "</h1><p>" + loi + "</p>";
  if (!ok) h += "<a href=/>Thu lai</a>";
  h += "</body></html>";
  return h;
}

static String trangHtml() {
  String h =
      "<!doctype html><html><head><meta charset=utf-8>"
      "<meta name=viewport content='width=device-width,initial-scale=1'>"
      "<title>Mini-Me — chon WiFi</title><style>"
      "body{font-family:-apple-system,system-ui,sans-serif;background:#0f172a;color:#f8fafc;"
      "margin:0;padding:24px;line-height:1.6}"
      "h1{font-size:20px;margin:0 0 4px}p{color:#94a3b8;font-size:14px;margin:0 0 20px}"
      "label{display:block;font-size:13px;color:#cbd5e1;margin:14px 0 6px}"
      "select,input{width:100%;box-sizing:border-box;padding:12px;border-radius:10px;"
      "border:1px solid #334155;background:#1e293b;color:#f8fafc;font-size:16px}"
      "button{width:100%;margin-top:20px;padding:14px;border:0;border-radius:10px;"
      "background:#6366f1;color:#fff;font-size:16px;font-weight:600}"
      "</style></head><body>"
      "<h1>Mini-Me can WiFi</h1>"
      "<p>Chon mang roi go mat khau. Robot se tu khoi dong lai va nho mang nay cho lan sau.</p>"
      "<form method=POST action=/luu>"
      "<label>Mang WiFi</label><select name=ssid>";
  h += dsMangQuet;
  h +=
      "</select>"
      "<label>Mat khau</label><input name=pass type=password autocomplete=off>"
      "<button type=submit>Ket noi</button></form></body></html>";
  return h;
}

static void quetMang() {
  if (bomKhiCho) bomKhiCho();
  const int n = WiFi.scanNetworks();
  if (bomKhiCho) bomKhiCho();
  dsMangQuet = "";
  for (int i = 0; i < n && i < 20; i++) {
    String s = WiFi.SSID(i);
    if (!s.length()) continue;
    s.replace("<", "&lt;");   // tên WiFi do người khác đặt — đừng tin
    s.replace("\"", "&quot;");
    dsMangQuet += "<option value=\"" + s + "\">" + s + " (" + WiFi.RSSI(i) + " dBm)</option>";
  }
  if (!dsMangQuet.length()) dsMangQuet = "<option value=''>(khong thay mang nao)</option>";
  WiFi.scanDelete();
}

static void moCong() {
  if (congDangMo) return;
  Serial.println("[net] khong vao duoc mang nao — mo cong cau hinh");

  WiFi.mode(WIFI_AP_STA);   // AP_STA chứ không AP: vẫn quét được mạng xung quanh
  quetMang();
  WiFi.softAP(CONG_SSID, CONG_PASS);
  delay(300);

  dns = new DNSServer();
  // Trỏ MỌI tên miền về chính mình — đó là thứ khiến điện thoại tự bật
  // trang cấu hình lên như WiFi khách sạn, thay vì bắt người dùng tự gõ
  // một địa chỉ IP mà họ không biết.
  dns->start(53, "*", WiFi.softAPIP());

  web = new WebServer(80);
  web->on("/", HTTP_GET, []() {
    Serial.println("[net] dien thoai mo trang cai dat");
    web->send(200, "text/html", trangHtml());
  });
  web->on("/luu", HTTP_POST, []() {
    const String ssid = web->arg("ssid");
    const String pass = web->arg("pass");
    if (!ssid.length()) {
      web->send(400, "text/html", trangKetQua(false, "Chua chon mang nao."));
      return;
    }

    // ⚠️ TRẢ LỜI NGAY, THỬ SAU — và báo kết quả lên MÀN HÌNH ROBOT.
    //
    // Bản trước thử ngay trong hàm này rồi mới trả lời, để người dùng
    // ngồi nhìn kết quả trên điện thoại. Không chạy được, vì lý do phần
    // cứng: ESP32 chỉ có MỘT bộ thu phát. Muốn thử nối vào mạng khác,
    // nó phải nhảy sang kênh của mạng đó — và cái WiFi nó đang phát cho
    // điện thoại NHẢY THEO. Điện thoại rớt ngay giữa chừng, trang web
    // ngồi chờ một câu trả lời không bao giờ tới.
    //
    // Người dùng gặp đúng vậy: "đơ ở chỗ nhập mật khẩu mãi", rồi thoát
    // ra cũng không vào lại được.
    //
    // Nên: trả lời trong một phần nghìn giây, dặn họ NHÌN MÀN HÌNH
    // ROBOT, rồi mới thử ở vòng loop(). Màn hình là kênh báo tin duy
    // nhất không bị chính phép thử làm đứt.
    Serial.printf("[net] nhan yeu cau noi '%s' (mat khau %u ky tu)\n", ssid.c_str(),
                  (unsigned)pass.length());
    choSsid = ssid;
    choPass = pass;
    dangThu = true;
    web->send(200, "text/html",
              trangKetQua(true, String("Dang thu vao mang \"") + ssid +
                                    "\". NHIN MAN HINH ROBOT de biet ket qua — khoang 15 giay."
                                    "<br><br>WiFi cua robot SE TAT trong luc thu (no chi co mot "
                                    "ang-ten). Trang nay se khong tu tai lai — do la binh thuong, "
                                    "khong phai loi. Neu sai mat khau, vao Cai dat &gt; WiFi chon "
                                    "lai Odin-Setup de go lai."));
  });

  // Mọi đường dẫn lạ đều trả về trang chính — điện thoại thăm dò cổng
  // bằng những URL riêng của hãng (`/generate_204`, `/hotspot-detect.html`),
  // trả 404 cho chúng là trang cấu hình không tự bật lên.
  web->onNotFound([]() { web->send(200, "text/html", trangHtml()); });
  web->begin();

  congDangMo = true;
  congMoLuc = millis();
  Serial.printf("[net] cong mo: SSID=%s pass=%s ip=%s\n", CONG_SSID, CONG_PASS,
                WiFi.softAPIP().toString().c_str());
}

static void dongCong() {
  if (!congDangMo) return;
  if (web) { web->stop(); delete web; web = nullptr; }
  if (dns) { dns->stop(); delete dns; dns = nullptr; }
  WiFi.softAPdisconnect(true);
  WiFi.mode(WIFI_STA);
  congDangMo = false;
  Serial.println("[net] dong cong cau hinh, thu lai cac mang da biet");
}

// ─── Thử vào một mạng ──────────────────────────────────────
static bool thuMot(const char* ssid, const char* pass, uint32_t hanMs, void (*veUi)()) {
  Serial.printf("[net] thu '%s' ...", ssid);
  WiFi.begin(ssid, pass);
  const uint32_t t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < hanMs) {
    delay(250);
    Serial.print('.');
    if (veUi) veUi();
  }
  const bool ok = WiFi.status() == WL_CONNECTED;
  Serial.println(ok ? " OK" : " that bai");
  if (!ok) WiFi.disconnect(true);
  return ok;
}

TrangThai vaoMang(void (*veUi)()) {
  TrangThai tt;
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);

  const uint8_t n = soMang();

  // Vòng 1: các mạng đã lưu. 8 giây mỗi mạng — đủ cho một router bình
  // thường, và đủ ngắn để thử hết sáu mạng vẫn dưới một phút.
  for (uint8_t i = 0; i < n; i++) {
    const String s = tenMang(i);
    if (!s.length()) continue;
    if (thuMot(s.c_str(), matKhauMang(i).c_str(), 8000, veUi)) {
      tt.online = true;
      tt.ssid = s;
      break;
    }
  }

  // Vòng 2: mạng biên dịch sẵn — LƯỚI AN TOÀN, không bao giờ bỏ.
  // Xem lý do dài trong net.h: mất mạng là mất luôn đường nạp OTA.
  if (!tt.online && strlen(WIFI_SSID)) {
    if (thuMot(WIFI_SSID, WIFI_PASSWORD, 15000, veUi)) {
      tt.online = true;
      tt.ssid = WIFI_SSID;
    }
  }

  if (tt.online) {
    tt.rssi = WiFi.RSSI();
    tt.ip = WiFi.localIP().toString();
    return tt;
  }

  moCong();
  tt.dangMoCong = true;
  return tt;
}

void moCongNgay() { moCong(); }

/** Số điện thoại đang nối vào WiFi của robot. Main dùng để biết khi nào
 *  người dùng đã quay lại, rồi mới thôi hiện thông báo lỗi. */
uint8_t soDienThoaiNoi() { return congDangMo ? WiFi.softAPgetStationNum() : 0; }

uint8_t ketQuaThu() { return ketQua; }
String chuKetQua() { return ketQuaChu; }
void xoaKetQua() { ketQua = 0; }

bool canKeu() {
  if (!keuMotTieng) return false;
  keuMotTieng = false;
  return true;
}

void loop(void (*bomTay)()) {
  bomKhiCho = bomTay;
  if (khoiDongLucNao && millis() > khoiDongLucNao) ESP.restart();

  // Thử mật khẩu Ở ĐÂY chứ không trong handler HTTP — xem lý do dài ở
  // `/luu`. Chặn vài giây trong loop() là chấp nhận được: lúc này robot
  // chưa có mạng, không có gì khác để làm.
  if (dangThu) {
    dangThu = false;
    Serial.printf("[net] thu mat khau cho '%s' ...\n", choSsid.c_str());
    ketQua = 0;

    WiFi.begin(choSsid.c_str(), choPass.c_str());
    const uint32_t t0 = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - t0 < 14000) {
      if (bomTay) bomTay();   // giữ đường tiếng sống — xem net.h
      delay(20);
    }

    if (WiFi.status() == WL_CONNECTED) {
      luuMang(choSsid, choPass);
      ketQua = 1;
      ketQuaChu = choSsid;
      keuMotTieng = true;
      khoiDongLucNao = millis() + 5000;
      Serial.printf("[net] OK, da nho '%s', ip=%s\n", choSsid.c_str(),
                    WiFi.localIP().toString().c_str());
    } else {
      const wl_status_t st = (wl_status_t)WiFi.status();
      ketQua = 2;
      ketQuaChu = (st == WL_NO_SSID_AVAIL) ? "Khong thay mang" : "Sai mat khau";
      Serial.printf("[net] that bai (status=%d): %s\n", (int)st, ketQuaChu.c_str());
      WiFi.disconnect(true);
      // Mở LẠI cổng để họ thử tiếp — sau khi thử, kênh đã đổi nên cổng
      // cũ coi như chết dù cờ vẫn báo đang mở.
      //
      // ⚠️ PHẢI gọi dongCong() chứ KHÔNG được chỉ hạ cờ rồi gọi moCong().
      // Bản trước làm thế: `congDangMo = false; moCong();`. Hậu quả là
      // WebServer cũ chưa hề `stop()`, nó vẫn ôm cổng 80 — nên WebServer
      // MỚI không bám được vào đó và không phục vụ trang nào cả. Người
      // dùng nối lại WiFi của robot thành công, nhưng phía sau không còn
      // ai trả lời. Kèm theo là rò bộ nhớ vì con trỏ cũ bị ghi đè.
      dongCong();
      moCong();
    }
    return;
  }

  if (!congDangMo) return;
  if (!congDangMo) return;

  // Nhịp tim mỗi 5 giây. Không có nó thì cổng mở = cổng Serial IM HOÀN
  // TOÀN, và im lặng không phân biệt được "bo treo" với "bo đang chờ
  // người ta cài đặt" — tôi đã mất một vòng chẩn đoán vì chuyện đó.
  {
    static uint32_t nhip = 0;
    if (millis() - nhip > 5000) {
      nhip = millis();
      Serial.printf("[net] cong dang mo, %lu giay nua tu dong, %d dien thoai dang noi\n",
                    (unsigned long)(CONG_HAN_GIAY - (millis() - congMoLuc) / 1000),
                    WiFi.softAPgetStationNum());
    }
  }

  dns->processNextRequest();
  web->handleClient();

  if (millis() - congMoLuc > CONG_HAN_GIAY * 1000UL) {
    dongCong();
    // Chỉ thử lại vòng mạng khi đang MẤT mạng. Nếu cổng được mở theo
    // yêu cầu trong lúc vẫn online thì đóng cổng là xong — gọi vaoMang()
    // lúc đó sẽ ngắt kết nối đang chạy để thử lại từ đầu, tức tự tay
    // làm rớt mạng đúng lúc mọi thứ đang chạy tốt.
    if (WiFi.status() != WL_CONNECTED && !vaoMang(nullptr).online) moCong();
  }
}

int32_t doDoTre() {
  if (WiFi.status() != WL_CONNECTED) return -1;
  WiFiClient c;
  const uint32_t t0 = millis();
  if (!c.connect(WS_HOST, 443)) return -1;
  const int32_t ms = (int32_t)(millis() - t0);
  c.stop();
  return ms;
}

}  // namespace net
