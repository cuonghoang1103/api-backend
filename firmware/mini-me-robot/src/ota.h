#pragma once
/**
 * ============================================================
 * Mini-Me Robot — nạp firmware qua WiFi (OTA)
 * ============================================================
 *
 * Hết cảnh bò ra sau bàn rút dây. Bấm nút trên trang web là bo tự tải
 * bản mới về, tự kiểm, tự khởi động lại.
 *
 * ── Cách nó chạy ──
 *
 *   web → lệnh {"t":"cmd","cmd":{"type":"ota"}} → bo
 *   bo  → GET /api/v1/maker-lab/firmware/mini-me-robot/latest
 *      → so version với FW_VERSION đang chạy
 *      → tải .bin từ R2, ghi thẳng vào KHE APP CÒN TRỐNG
 *      → đối chiếu SHA-256
 *      → đổi khe khởi động, reboot
 *
 * ── Vì sao an toàn ──
 *
 * Flash 16 MB chia hai khe app (`default_16MB.csv`, đã đặt từ đầu).
 * Bản đang chạy nằm ở khe này, bản mới ghi vào khe kia — **không bao
 * giờ đè lên chính mình**. Mất điện giữa chừng hay tải hỏng thì khe cũ
 * còn nguyên, bo vẫn khởi động bình thường bằng bản cũ.
 *
 * Đó là lý do phải có hai khe. Bo chỉ một khe thì nạp OTA là ghi đè
 * lên bản đang chạy — hỏng giữa chừng là thành cục chặn giấy, phải cắm
 * cáp cứu.
 *
 * ── Ba điều KHÔNG được quên ──
 *
 * 1. **Lần nạp đầu vẫn phải dùng cáp.** Bản firmware biết OTA phải lên
 *    bo bằng cách nào đó đã.
 * 2. **Giữ cáp làm đường cứu hộ.** OTA nạp nhầm bản không lên được
 *    WiFi thì chỉ cáp mới cứu.
 * 3. **`ota` có `llmAllowed:false` trong bảng lệnh.** LLM tuyệt đối
 *    không được tự kích hoạt cập nhật — nó bịa lệnh thì mất robot.
 */

#include <Arduino.h>

namespace ota {

enum Result : uint8_t {
  OTA_DA_MOI_NHAT,   // server không có bản nào mới hơn
  OTA_DANG_CHAY,     // đã bắt đầu, sẽ reboot nếu xong
  OTA_LOI_MANG,      // không hỏi được manifest hoặc tải hỏng
  OTA_LOI_KIEM,      // SHA-256 không khớp — bản tải về đã hỏng
  OTA_LOI_GHI,       // không ghi được vào khe app
  OTA_BAN_ROI,       // đang có một lượt cập nhật chạy dở
};

/**
 * Chạy một lượt cập nhật. Chặn luồng gọi cho tới khi xong hoặc hỏng.
 *
 * `muonVersion` rỗng nghĩa là "lấy bản mới nhất server có". Truyền tên
 * cụ thể để ép về đúng bản đó — dùng khi cần quay lui bản cũ.
 *
 * Xong tốt đẹp thì hàm này KHÔNG trả về: nó gọi ESP.restart().
 */
Result capNhat(const char* muonVersion = nullptr);

/** Chữ tiếng Việt cho từng mã, để hiện lên màn và gửi về web. */
const char* moTa(Result r);

/** Đang có lượt cập nhật chạy dở không — main loop dùng để tránh chen. */
bool dangChay();

/** 0-100, để vẽ thanh tiến trình lên màn hình. */
uint8_t phanTram();

}  // namespace ota
