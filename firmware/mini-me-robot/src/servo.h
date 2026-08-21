#pragma once
/**
 * ============================================================
 * servo — sáu khớp qua PCA9685: 2 cổ + 4 tay
 * ============================================================
 *
 * Nhận lệnh `head` / `arm` / `dance` từ server và biến thành xung servo.
 *
 * ── BỐN THỨ QUYẾT ĐỊNH THIẾT KẾ ──
 *
 * 1. **Không lái servo thẳng từ GPIO.** ESP32 phát xung bằng phần mềm
 *    thì WiFi và I2S chen ngang làm lệch độ rộng, và mắt người NHÌN
 *    THẤY cái giật đó — rõ nhất lúc tay đang giơ giữa chừng. PCA9685
 *    phát bằng phần cứng riêng nên đều tuyệt đối, lại trả về 6 chân.
 *
 * 2. **Giới hạn cơ khí phải chặn TRONG FIRMWARE.** `ELBOW_MAX = 0` vì
 *    khuỷu chỉ gập một chiều; cho nó vượt 0° là cẳng tay đâm vào cánh
 *    tay trên, servo kẹt cứng rồi CHÁY trong khoảng một phút. Server có
 *    kiểm cùng chuyện đó, nhưng firmware không được phép tin server —
 *    một gói tin hỏng, một bản server cũ, hay chính tôi gõ nhầm lúc
 *    thử là đủ để mất con servo.
 *
 * 3. **Đi tới đích phải MƯỢT, không nhảy phát một.** Servo nhận xung
 *    mới là lao tới đó bằng tốc độ tối đa của nó. Trông như đồ chơi
 *    hỏng, và cú giật đó rút dòng đủ mạnh để kéo sụt cả rail nguồn.
 *    Nên đích được nội suy theo `ms`, xem `tick()`.
 *
 * 4. **KHÔNG tự động đẩy servo về vị trí nào lúc khởi động.** Xem chú
 *    thích dài ở `begin()` — đây là quyết định an toàn, không phải quên.
 */

#include <Arduino.h>

namespace servo {

/** Dựng PCA9685. Trả về false nếu không thấy nó trên bus I2C. */
bool begin();

/** Có PCA9685 không. False = robot vẫn chạy, chỉ là không cử động được. */
bool co();

/**
 * Gọi mỗi vòng `loop()`. Nội suy chuyển động và chạy bài nhảy.
 * Tự ghìm nhịp ghi I2C xuống 50Hz — servo không đọc nhanh hơn thế, mà
 * bus I2C còn phải chia cho con quay của `banh_xe`.
 */
void tick();

/** Cổ: quay trái phải (`pan`) + gật (`tilt`), độ. */
void dau(float pan, float tilt, uint32_t ms = 400);

/** Tay. `ben`: 0 = trái, 1 = phải, 2 = cả hai. Góc tính bằng độ. */
void tay(int ben, float vai, float khuyu, uint32_t ms = 400);

/** Bài nhảy dựng sẵn: spin · wiggle · nod · shake · celebrate. */
bool mua(const char* ten);
bool dangMua();

/**
 * Cắt xung mọi kênh — servo thả lỏng, không giữ lực nữa.
 *
 * Khác `dau(0,0)`: lệnh kia bảo servo GIỮ ở 0° và nó sẽ gồng chống lại
 * mọi lực đẩy. Còn `nghi()` là buông hẳn. Dùng khi robot đứng im lâu:
 * servo gồng suốt thì nóng, ăn dòng, và rung nhẹ nghe rất phiền.
 */
void nghi();

/** Góc đang giữ của một kênh, để hiện lên Live Console. */
float gocCua(int kenh);

} // namespace servo
