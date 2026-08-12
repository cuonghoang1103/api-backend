#pragma once
/**
 * ============================================================
 * Mini-Me Robot — vào mạng ở bất kỳ đâu
 * ============================================================
 *
 * Trước file này, tên WiFi và mật khẩu bị đóng cứng vào firmware lúc
 * biên dịch (`secrets.h`). Mang robot sang nhà bạn chơi nghĩa là phải
 * xách theo cáp USB và một cái máy tính có PlatformIO. Không dùng được.
 *
 * ── Ba tầng, thử theo thứ tự ──
 *
 *   1. Các mạng ĐÃ LƯU trong bộ nhớ trong của chip, ưu tiên mạng nào
 *      đang bắt được sóng mạnh nhất.
 *   2. Mạng biên dịch sẵn trong `secrets.h` — luôn giữ làm lưới an toàn.
 *   3. Không mạng nào vào được → tự phát ra một WiFi tên `Mini-Me-Setup`
 *      kèm trang cấu hình, để chọn mạng bằng điện thoại.
 *
 * ⚠️ VÌ SAO TẦNG 2 KHÔNG BAO GIỜ BỊ BỎ: đây là đoạn mã đụng vào đường
 * mạng, mà mất mạng thì mất luôn đường nạp firmware qua WiFi — muốn cứu
 * phải cắm cáp. Giữ mạng nhà làm lưới đỡ nghĩa là dù phần lưu mạng mới
 * có hỏng thế nào, mang robot về nhà bật lên là nó lại online và OTA
 * lại được.
 *
 * ── Vì sao cổng cấu hình có hạn giờ ──
 *
 * Router nhà cũng có lúc khởi động lại. Nếu robot bật đúng lúc đó, nó
 * sẽ không thấy mạng nào và mở cổng cấu hình — rồi NGỒI ĐÓ MÃI trong
 * khi router đã lên lại từ lâu. Nên sau CONG_HAN_GIAY, cổng tự đóng và
 * thử lại vòng mới. Không ai phải làm gì cả.
 */

#include <Arduino.h>

namespace net {

/** Kết quả một lần thử vào mạng. */
struct TrangThai {
  bool online = false;
  String ssid;
  int rssi = 0;
  String ip;
  /** Đang mở cổng cấu hình hay không. */
  bool dangMoCong = false;
};

/**
 * Vào mạng. Gọi MỘT lần trong setup(), sau `WiFi.mode(WIFI_STA)`.
 *
 * `veUi` được gọi vài lần mỗi giây trong lúc chờ, để màn hình không
 * đứng hình — hàm này chặn tới vài chục giây là chuyện bình thường.
 */
TrangThai vaoMang(void (*veUi)() = nullptr);

/**
 * Gọi mỗi vòng loop(). Bơm cổng cấu hình khi nó đang mở; ngoài ra rẻ.
 *
 * `bomTay` được gọi liên tục trong những đoạn CHẶN DÀI (thử mật khẩu 14
 * giây, quét mạng vài giây). Bắt buộc phải truyền, và phải là hàm bơm
 * đường tiếng:
 *
 * DMA của I2S không ghi gì thì KHÔNG im lặng — nó lặp lại đoạn đệm cũ.
 * Bỏ đói `audio::loop()` 20 giây là loa kêu "tụt tụt" liên tục suốt 20
 * giây đó, và người dùng nghe thành robot hỏng. Đúng bẫy đã ghi sẵn
 * trong audio.cpp mà tôi vẫn dẫm phải.
 */
void loop(void (*bomTay)() = nullptr);

/** Đang mở cổng cấu hình không — main dùng để đổi những gì hiện lên màn. */
bool dangMoCong();

/**
 * Mở cổng cấu hình NGAY, kể cả khi đang có mạng.
 *
 * Vì sao cần: người dùng đứng ở quán cà phê, muốn dạy robot WiFi chỗ đó.
 * Bảo họ ĐỌC tên WiFi và mật khẩu cho robot nghe là bất khả thi — tên
 * WiFi hay có chữ tiếng Anh, dấu gạch, số, ký tự lạ; mật khẩu còn tệ
 * hơn. Nói sai một ký tự là hỏng, mà không ai biết đã sai ở đâu.
 *
 * Mở cổng thì họ gõ trên bàn phím điện thoại, nhìn thấy từng ký tự, và
 * chọn mạng từ danh sách robot quét được thay vì phải nhớ tên.
 *
 * Dùng chế độ AP_STA nên mạng đang dùng KHÔNG bị ngắt — robot vẫn nói
 * chuyện được trong lúc cổng mở.
 */
void moCongNgay();

/**
 * Có cần kêu một tiếng báo cài WiFi xong không. Đọc một lần rồi tự xoá.
 *
 * Để main gọi audio::beep() chứ net.cpp không tự gọi: module mạng không
 * nên biết gì về loa, và ngược lại. Nối hai thứ đó vào nhau nghĩa là
 * muốn thử phần mạng cũng phải kéo theo cả đường tiếng.
 */
bool canKeu();

/**
 * Kết quả lần thử mật khẩu gần nhất — main vẽ lên màn 3.5".
 *
 * 0 = chưa thử gì, 1 = vào được, 2 = hỏng. `chuKetQua()` cho tên mạng
 * (khi 1) hoặc lý do hỏng (khi 2). Gọi `xoaKetQua()` sau khi vẽ xong.
 *
 * Màn hình là kênh báo tin DUY NHẤT không bị chính phép thử làm đứt —
 * xem ghi chú ở `/luu` trong net.cpp.
 */
uint8_t ketQuaThu();
String chuKetQua();
void xoaKetQua();

/** Tên WiFi và mật khẩu của cổng cấu hình, để hiện lên màn 3.5". */
const char* tenCong();
const char* matKhauCong();

/**
 * Lưu thêm một mạng vào bộ nhớ trong.
 *
 * Dùng cho lệnh từ server: ngồi ở nhà thêm sẵn WiFi chỗ sắp đến, tới
 * nơi bật lên là tự vào, khỏi phải mở cổng cấu hình.
 */
bool luuMang(const String& ssid, const String& pass);

/** Số mạng đang nhớ, và tên mạng thứ i (để hiện ra web). */
uint8_t soMang();
String tenMang(uint8_t i);

/** Xoá sạch danh sách đã nhớ. Mạng trong secrets.h KHÔNG bị đụng tới. */
void quenHet();

/**
 * Đo độ trễ tới server bằng một lần bắt tay TCP.
 *
 * KHÔNG dùng ping ICMP: nhiều mạng công cộng chặn ICMP nhưng vẫn cho
 * TCP đi qua, nên ping tắc không có nghĩa là mạng hỏng — mà robot báo
 * "mất mạng" trong khi nó đang nói chuyện được thì còn tệ hơn không báo.
 * Bắt tay TCP tới đúng cổng ta thật sự dùng mới đo được thứ cần biết.
 *
 * Trả về mili giây, hoặc -1 nếu không nối được.
 */
int32_t doDoTre();

}  // namespace net
