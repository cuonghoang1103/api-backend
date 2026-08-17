#pragma once
/**
 * ============================================================
 * banh_xe — lái hai bánh xích qua hai mạch IBT-2 (BTS7960)
 * ============================================================
 *
 * Nhận lệnh từ server (`move` / `turn` / `stop`) và biến thành xung PWM.
 *
 * ── BA THỨ QUYẾT ĐỊNH THIẾT KẾ MODULE NÀY ──
 *
 * 1. **Động cơ 33GB-520 quay 320 vòng/phút** — với nhông ⌀47 là
 *    **0,79 m/s**, gần bằng tốc độ đi bộ. WALL-E phải lệt bệt bò, nên
 *    tốc độ chạy thật chỉ khoảng 20-30% PWM. Mà động cơ chổi than ở
 *    mức đó KHÔNG TỰ KHỞI ĐỘNG NỔI — nó ù ù rồi mới giật mình quay.
 *    ⇒ phải có nhịp ĐẠP MỒI, xem `DAP_MOI_*`.
 *
 * 2. **KHÔNG có encoder.** Config có khai `PIN_ENC_L/R` nhưng động cơ
 *    thật chỉ ra 2 dây. Nghĩa là không đo được quãng đường, và hai
 *    bánh không bao giờ quay đúng bằng nhau.
 *    ⇒ dùng **con quay MPU6050** giữ hướng. Với xích hay trượt thì
 *    gyro còn ĐÚNG HƠN encoder: encoder đếm đủ vòng trong khi thân đã
 *    lệch, gyro thì thấy ngay.
 *
 * 3. **Dòng kẹt của 520 cao hơn nhiều lần dòng chạy.** Không có gì
 *    chặn thì robot đâm vào chân bàn sẽ è ở đó tới lúc có người gỡ.
 *    ⇒ `MOTION_WATCHDOG_MS`: không có lệnh mới trong 500ms là cắt.
 *    Chốt này nằm TRONG FIRMWARE, không phải trên server — mất mạng
 *    thì robot phải tự dừng, không được chạy tiếp lệnh cuối.
 */

#include <Arduino.h>

namespace banhXe {

/** Dựng PWM, đặt gyro về 0. Gọi một lần trong `setup()`. */
bool begin();

/**
 * Đặt công suất hai bánh, −255…255. Âm = lùi.
 *
 * `ms` = chạy bao lâu rồi TỰ DỪNG. 0 = lấy `MOTION_WATCHDOG_MS`.
 *
 * Hạn dừng được tính NGAY LÚC NHẬN LỆNH và cất trong chip, nên mất mạng
 * giữa chừng không kéo dài được thời gian chạy — đó mới là điều quan
 * trọng, chứ không phải "phải có lệnh mới thì mới chạy tiếp".
 *
 * Cần chạy liên tục (cần điều khiển bằng joystick trên web) thì cứ gửi
 * `move` lặp lại; mỗi lệnh đẩy hạn dừng ra xa, im lặng là robot dừng.
 *
 * `giuHuong` = true thì bật hiệu chỉnh gyro (chỉ có nghĩa khi hai bánh
 * bằng nhau, tức đang đi thẳng).
 */
void datToDo(int trai, int phai, uint32_t ms = 0, bool giuHuong = true);

/** Cắt điện cả hai bánh ngay. */
void dung();

/**
 * Quay tại chỗ tới đúng `goc` độ (dương = chiều kim đồng hồ nhìn từ
 * trên xuống). Không chặn luồng — hỏi `dangQuay()` để biết xong chưa.
 *
 * Dựa hoàn toàn vào gyro. Không có gyro thì rơi về quay theo THỜI GIAN
 * ước lượng, kém chính xác nhưng vẫn quay.
 */
void quayGoc(float goc, int toc = 160);
bool dangQuay();

/** Gọi mỗi vòng `loop()`. Lo watchdog, đạp mồi, giữ hướng, quay góc. */
void tick();

/** Trần tốc độ 10–100 %, chỉnh được từ web (`config maxSpeed`). */
void datTranTocDo(int phanTram);
int tranTocDo();

/** Có đọc được MPU6050 không. False = đang chạy mù, vẫn đi được. */
bool coGyro();

/** Góc đã tích luỹ từ lúc `begin()`, độ. Chỉ để hiện lên Live Console. */
float gocHienTai();

} // namespace banhXe
