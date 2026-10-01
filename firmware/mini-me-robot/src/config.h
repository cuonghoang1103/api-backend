#pragma once
// ============================================================
// Mini-Me Robot — pin map & tunables
// ============================================================
//
// ⚠️ ESP32-S3-DevKitC-1 (N16R8) pin constraints. Getting these wrong
// costs an evening of "why does it reboot at random":
//
//   GPIO 26–32  SPI flash            — NEVER usable
//   GPIO 33–37  OCTAL PSRAM (R8)     — NEVER usable on this variant.
//                                      They ARE free on quad-PSRAM
//                                      boards, which is why every
//                                      tutorial using them "works"
//                                      for someone else.
//   GPIO 19/20  USB D−/D+            — using them kills the USB port
//   GPIO 0/3/45/46  strapping        — sampled at boot; safe as
//                                      outputs/ADC, risky if something
//                                      pulls them at power-up
//
// Everything below stays clear of all of that.

// ─── Nghe: I2S0 ← INMP441 ─────────────────────────────────
// Slug dự án trên web — bo dùng nó để hỏi bản firmware mới:
//   GET /api/v1/maker-lab/firmware/<slug>/latest
// Phải khớp CHÍNH XÁC cột `slug` trong bảng maker_projects, sai một ký
// tự thì server trả 404 và OTA im lặng không làm gì.
#define MAKERLAB_PROJECT_SLUG "mini-me-robot"

#define PIN_MIC_SCK      4
#define PIN_MIC_WS       5
#define PIN_MIC_SD       6
#define MIC_SAMPLE_RATE  16000   // what Whisper wants; higher is wasted bandwidth

// ─── Nói: I2S1 → MAX98357A ────────────────────────────────
#define PIN_AMP_BCLK     15
#define PIN_AMP_LRC      16
#define PIN_AMP_DIN      7

// ─── BA MÀN chung một bus SPI ──────────────────────────────
//
// Màn ngực ILI9488 3.5" + hai mắt GC9A01 1.28" tròn. MOSI/SCLK/DC đi
// chung, mỗi con một chân CS riêng. Chi tiết: `man_hinh.h`.
//
// ⚠️ SỬA 15/08/2026 — GPIO 10 TRƯỚC ĐÂY BỊ DÙNG HAI LẦN: vừa là CS
// màn ngực (`-DTFT_CS=10` cũ) vừa là `PIN_EYE_CS_L`. Hai con màn cùng
// nghe một chân CS thì con nào cũng nhận mọi thứ gửi cho con kia, và
// triệu chứng không phải màn đen mà là hai hình chồng nhau nhấp nháy
// — rất dễ đổ oan cho nhiễu dây rồi đi hạ tốc độ SPI.
//
// Lấy lại GPIO 14 bằng cách nối RST màn ngực thẳng lên 3V3 và reset
// bằng lệnh phần mềm, đúng cách hai con mắt vẫn làm.
//
// ⚠️ VIỆC CẦN LÀM TRÊN BO: rút dây RST của màn 3.5" khỏi GPIO 14, cắm
// sang 3V3. Quên thì KHÔNG cháy gì (một đầu ra nuôi hai đầu vào là
// bình thường) — nhưng GPIO 14 nay bật/tắt theo nhịp chọn chip, nên
// màn ngực bị reset liên tục và không bao giờ hiện được gì.
/**
 * ⛔⛔⛔ MÀN TRÒN GC9A01 CHẠY 3,3 V. CẤP 5 V LÀ CHÁY. Đã cháy thật.
 *
 * Ngày 16/08/2026 một con XY1.28YYFT-S7P **bốc khói và khét** khi cấp
 * 5 V vào `VCC` — cắm ĐÚNG CỰC, và trên bo lúc đó **CHỈ có đúng hai
 * sợi `VCC` với `GND`**, không một dây tín hiệu nào. Bỏ luôn con màn.
 *
 * Chi tiết "chỉ hai sợi" làm kết luận thành chắc chắn: không thể đổ cho
 * chân tín hiệu, không thể đổ cho ESP32. Riêng 5 V vào `VCC` đã đủ giết.
 *
 * CƠ CHẾ THẬT (suy ra từ việc chính con U1 nóng lên trước khi khét):
 * U1 đúng là ổn áp nguồn chính, và bo đúng là nhận được hơn 3,3 V. Cái
 * giết nó là NHIỆT, không phải quá áp:
 *
 *     VCC 3,3 V → LDO nằm vùng sụt áp, gần như không sụt → nguội
 *                 nhưng ra chỉ ~3,05 V → đèn nền mờ
 *     VCC 5,0 V → LDO điều đúng ra 3,3 V → đèn nền sáng hết cỡ
 *                 nhưng phải đốt (5,0−3,3) × dòng ngay trên thân nó
 *
 * Vỏ SOT-23 tản được chừng 0,4 W. Đèn nền sáng hết cỡ kéo đủ dòng để
 * vượt mức đó, U1 nóng dần rồi chết.
 *
 * ⇒ LỐI RA SẠCH, không phải chọn giữa "mờ" và "cháy": cấp **3,8–4,2 V**.
 *   Đủ chênh áp để LDO ra đủ 3,3 V (đèn nền sáng hết), mà chỉ đốt 0,7 V
 *   thay vì 1,7 V — nhiệt giảm hơn hai lần rưỡi. Đúng bằng điện áp MỘT
 *   viên 18650, mà robot thì có sẵn hai viên.
 *
 * ⚠️ Kiểu hỏng này đặc biệt xảo quyệt: cấp 5 V thì đèn nền **sáng rực
 * hẳn lên và hết vệt tối** — trông y như vừa chữa đúng bệnh. Nó không
 * chết ngay, nó chết dần qua vài chục phút. Nên dấu hiệu "tốt lên" lại
 * chính là dấu hiệu đang giết nó.
 *
 * LUẬT: `VCC` màn tròn nối `3V3` (an toàn, hơi mờ) hoặc **3,8–4,2 V**
 * (sáng đủ, vẫn mát). KHÔNG BAO GIỜ 5 V.
 *
 * Mà 3,3 V mờ cũng gần như không ảnh hưởng: mắt WALL-E nền đen tuyền,
 * chỉ mống sáng — điểm ảnh đen không cần đèn nền.
 */
#define PIN_TFT_SCLK     12
#define PIN_TFT_MOSI     11
#define PIN_TFT_DC       13   // DC màn NGỰC — riêng

/**
 * ⚠️ MỖI MÀN MỘT CHÂN `DC` RIÊNG (27/08/2026) — ý của người dùng, và nó
 * đúng hơn cách tôi làm.
 *
 * Trước đây cả ba màn chung `GPIO 13`, nối bằng cách xoắn ba lõi vào
 * nhau rồi cắm chung một lỗ. Mối xoắn trần đó là nghi phạm số một của cả
 * buổi 27/08: màn ngực chạy tốt (lõi của nó ăn chắc) trong khi HAI MẮT
 * tối ngóm, và đo điện áp KHÔNG phát hiện được — đồng hồ 10MΩ đọc đủ áp
 * qua một mối chỉ còn dính vài sợi đồng, mà mối ấy không tải nổi sườn
 * xung SPI.
 *
 * Tách chân thì xoá hẳn mối xoắn thay vì đi chứng minh nó tốt hay xấu.
 * Rẻ hơn dò, chắc hơn hàn, và ESP32-S3 còn thừa chân.
 *
 * ⚠️ `SCLK` và `MOSI` thì KHÔNG tách được — đó là bản chất bus SPI, mọi
 * thiết bị phải nghe chung xung nhịp và chung đường dữ liệu. Chỉ `DC` và
 * `CS` mới là chân riêng của từng màn.
 */
#define PIN_EYE_DC_L     43   // DC mắt TRÁI  — riêng, không xoắn chung
#define PIN_EYE_DC_R     44   // DC mắt PHẢI  — riêng, không xoắn chung
#define PIN_TFT_CS       10   // màn ngực 3.5"
#define PIN_EYE_CS_L      9   // mắt trái

/**
 * RST cả ba màn nối `3V3`, reset bằng lệnh 0x01 gửi tay.
 *
 * ⚠️ Thư viện Arduino_GFX KHÔNG có reset mềm: nhánh `else` trong
 * `Arduino_GC9A01::tftInit()` chỉ có đúng một dòng chú thích
 * `// Software Rest`, không có mã. Nên `man_hinh::resetMem()` tự gửi
 * lệnh `0x01` + chờ 150 ms trước khi khởi tạo. Thiếu bước đó thì con
 * màn không bao giờ được reset sau lần cắm điện đầu, và mỗi lần nạp
 * firmware (ESP32 khởi động lại, màn KHÔNG mất điện) là ra sọc.
 *
 * ⚠️ Ngày 15/08 tôi từng dời RST sang GPIO 14 cho "đúng chuẩn hơn" —
 * ĐANG LÚC HỆ CHẠY ĐƯỢC. Từ đó mất luôn mốc để lùi về và mất cả buổi.
 * Cấu hình dưới đây là cấu hình đã CHỨNG MINH chạy trên phần cứng
 * thật; đừng đổi nó để cho đẹp lý thuyết.
 */
#define PIN_EYE_CS_R     14   // mắt phải — GPIO 14 rảnh vì RST về 3V3

/**
 * ── MÀN NGỰC MỚI (ST7796U, 27/08/2026) CÓ HAI CHÂN MÀ BO CŨ KHÔNG CÓ ──
 *
 * `PIN_TFT_RST` — chân reset THẬT.
 *
 * Bo ILI9488 cũ không đưa RST ra, nên cả ba màn phải nối cứng lên 3V3 và
 * reset bằng lệnh 0x01 gửi tay (xem khối chú thích ngay trên). Cách đó
 * chạy được, nhưng nó có một lớp lỗi riêng: chip chỉ rời trạng thái
 * reset khi chân RST ở mức cao VỮNG, nên mọi cú sụt áp trên đường 3V3 —
 * hay một sợi dây lỏng — đều giữ chip nằm im, không nhận lệnh nào, mà
 * ĐÈN NỀN VẪN SÁNG vì nó nối thẳng nguồn. Đó chính là màn hình trắng đã
 * hành hai ngày 25-26/08.
 *
 * Có chân RST thật thì thư viện tự phát xung reset phần cứng mỗi lần
 * khởi động, và cả lớp lỗi đó biến mất.
 *
 * `PIN_TFT_MISO` — đường chip NÓI NGƯỢC LẠI.
 *
 * ⚠️ Đây là chân đáng giá nhất trên bo mới. `man_hinh.h` có sẵn một khối
 * cảnh báo: "`begin()` gần như KHÔNG BAO GIỜ trả false — chân MISO để
 * trống nên nó không có cách nào biết đầu kia có gì." Vì thế firmware in
 * `3/3 màn khởi tạo xong` trong khi một con đang chết dần, và không ai
 * biết cho tới lúc mở mắt ra nhìn vào kính.
 *
 * Nối MISO thì hỏi được chip "còn sống không" và nhận câu trả lời.
 *
 * GPIO 3 là chân strapping (chọn nguồn JTAG lúc khởi động) nhưng ESP32-S3
 * chỉ đọc nó trong vài chu kỳ đầu rồi thả; dùng làm MISO sau khi boot là
 * an toàn, và nó là chân trống sạch sẽ nhất còn lại.
 */
#define PIN_TFT_RST      47   // màn ngực — chân reset THẬT (bo cũ không có)
#define PIN_TFT_MISO      3   // màn ngực — để hỏi được ID chip

/**
 * ── CẢM ỨNG ĐIỆN DUNG FT6336U trên bo màn ngực (27/08/2026) ──
 *
 * Đi I2C, GHÉP VÀO BUS SẴN CÓ: `CTP_SCL` → `PIN_I2C_SCL` (18),
 * `CTP_SDA` → `PIN_I2C_SDA` (8). Không tốn chân mới.
 * `CTP_RST` nối thẳng **3V3**.
 *
 * ⚠️ `CTP_INT` ĐỂ HỞ — CỐ Ý, và đây là lựa chọn chứ không phải thiếu sót.
 *
 * Chân đó chỉ báo "vừa có người chạm". Hỏi vòng qua I2C 30-60 lần/giây
 * cũng biết đúng điều ấy, mà rẻ hơn theo hai cách:
 *
 *   1. Không tốn chân. Chân trống trên bo này đếm được trên một bàn tay,
 *      và `GPIO 44` (lựa chọn đầu tiên) hoá ra là `RX` của UART0 — trên
 *      bo DevKitC nó in chữ RX chứ không in số, người dùng tìm không ra.
 *   2. Bớt MỘT SỢI DÂY. Robot rung theo bánh xích, và mọi mối nối là một
 *      chỗ hỏng — bài học đắt nhất của cả dự án này đến từ dây, không
 *      đến từ mã.
 *
 * Cái giá: CPU phải hỏi đều đặn thay vì ngồi chờ. Với một con chip đang
 * vẽ 157 khung/giây thì đó không phải chi phí đáng bàn.
 */
#define PIN_CTP_INT      -1   // để hở — hỏi vòng qua I2C, xem chú thích trên

// ─── Cảm biến: I2C (MPU6050 0x68 + VL53L0X 0x29) ──────────
#define PIN_I2C_SDA      8
#define PIN_I2C_SCL      18

// ─── Động cơ: 2× IBT-2 (BTS7960) ──────────────────────────
//
// ĐỔI TỪ DRV8833 (18/08/2026). Lý do: động cơ thật là 33GB-520 12V,
// dòng kẹt của nó vượt xa mức 1,5A mà DRV8833 chịu được — cắm vào là
// cháy mạch chứ không phải chạy chậm.
//
// ⚠️ IBT-2 KHÔNG PHẢI mạch cầu H thường. Mỗi mạch chỉ lái MỘT bánh,
// nên phải mua HAI. Bù lại nó nhận thẳng 12V và chịu 43A.
//
// ⚠️⚠️ CHÂN `VCC` CỦA IBT-2 PHẢI CẮM VÀO **3V3**, KHÔNG PHẢI 5V.
// Chân điều khiển đi qua đệm 74HC244, ngưỡng mức cao của nó là
// 0,7 × VCC. Cấp VCC = 5V thì ngưỡng thành 3,5V, mà ESP32 chỉ ra
// được 3,3V — thấp hơn ngưỡng. Robot sẽ im ru không rõ lý do, đo
// chân nào cũng thấy "có tín hiệu". Cấp 3V3 thì ngưỡng còn 2,31V.
//
// Nối dây mỗi mạch:
//   RPWM ← chân dưới đây (tiến)     LPWM ← chân dưới đây (lùi)
//   R_EN + L_EN → nối cứng 3V3      VCC → 3V3      GND → GND chung
//   B+ / B− → ắc-quy 12V            M+ / M− → động cơ
#define PIN_MOTOR_AIN1   39   // bánh TRÁI  — RPWM (tiến)
#define PIN_MOTOR_AIN2   40   // bánh TRÁI  — LPWM (lùi)
#define PIN_MOTOR_BIN1   41   // bánh PHẢI  — RPWM (tiến)
#define PIN_MOTOR_BIN2   42   // bánh PHẢI  — LPWM (lùi)

// ─── Encoder — KHÔNG CÓ TRÊN PHẦN CỨNG THẬT ───────────────
//
// Giữ lại hai định nghĩa này để khỏi vỡ mã cũ, nhưng động cơ 33GB-520
// mua về chỉ ra **2 dây** (chỉ nguồn), không có encoder. Bản có encoder
// là mã khác, 6 dây. Đừng viết mã dựa vào hai chân này.
//
// Thay cho encoder, `banh_xe.cpp` giữ hướng bằng **con quay MPU6050**.
// Với xe xích thì đó còn là lựa chọn ĐÚNG HƠN: xích trượt, encoder vẫn
// đếm đủ vòng trong khi thân xe đã lệch hướng.
#define PIN_ENC_L        47   // KHÔNG DÙNG
#define PIN_ENC_R        48   // KHÔNG DÙNG
#define ENCODER_TICKS_PER_REV 374   // KHÔNG DÙNG

// ─── Phụ trợ ──────────────────────────────────────────────
#define PIN_LED_RING     21
#define LED_RING_COUNT   16
// ⚠️ KHÔNG dùng GPIO 14 cho chân này: đó là CS của MẮT PHẢI. Một chân
// GPIO chỉ làm được một việc — gán nó cho vòng LED nữa thì mắt phải
// mất chọn chip và tắt ngóm.
//
// GPIO 17 trống thật: 26-37 là flash/PSRAM của bản N16R8, 19/20 là USB,
// 43/44 là UART gỡ lỗi, 0/45/46 là chân định đoạt kiểu khởi động.
#define PIN_TOUCH_HEAD   17
#define PIN_CLIFF_L      38
#define PIN_CLIFF_R      2

// Đo pin qua chia áp **100k/30k** (pack 3S — xem khối "Điện" bên dưới).
//
// GPIO 1 chứ KHÔNG phải GPIO 3, dù cả hai đều thuộc ADC1: GPIO 3 là
// chân định đoạt nguồn JTAG lúc khởi động. Cắm chia áp vào đó nghĩa là
// mỗi lần bật máy, pack pin quyết định hộ con chip một lựa chọn hệ
// thống — lỗi kiểu này chỉ hiện ra vào những hôm xui.
//
// Phải là ADC1 (GPIO 1-10). ADC2 dùng chung phần cứng với WiFi và trả
// về lỗi khi WiFi đang chạy.
#define PIN_BATTERY_ADC  1

/**
 * Đã hàn bộ chia áp chưa? 0 = chưa.
 *
 * Bắt buộc khai bằng tay, không cho firmware "tự nhận ra", vì nó KHÔNG
 * nhận ra được — đo thật trên bo ngày 11/08: chân ADC thả nổi đọc ra
 * hơn 1 V, và chốt chặn "dưới 1 V là chưa cắm" của bản trước để lọt,
 * khiến robot báo "pin 100%" trong khi nó đang cắm cáp USB và trên bo
 * không có lấy một viên pin.
 *
 * Một con số bịa tệ hơn hẳn không có số: người ta sẽ tin nó rồi đi xa
 * nhà mà tưởng còn đầy pin.
 */
#define BAT_DIVIDER_FITTED  0

/**
 * ============================================================
 * CÓ MÀN NGỰC HAY CHƯA
 * ============================================================
 *
 * `0` = chưa cắm màn ngực. Robot chạy ĐỦ: hai mắt, loa, mic, WiFi, máy
 * chủ, bánh xích. Chỉ thiếu bảng hành động ở ngực.
 *
 * ⚠️ VÌ SAO PHẢI CÓ CỜ NÀY, KHÔNG PHẢI CỨ RÚT DÂY RA LÀ XONG.
 *
 * `Arduino_GFX::begin()` gần như KHÔNG BAO GIỜ trả false — chân MISO để
 * trống nên nó không đọc được ID chip, tức không có cách nào biết đầu
 * kia có gì. Rút màn ra thì firmware vẫn tin là có màn, và `drawFace()`
 * vẫn bơm trọn một khung 480×320 vào chỗ trống MỖI LẦN mặt đổi.
 *
 * Cái giá không phải là "phí điện". Xoá cả màn ở 20 MHz tốn ~90 ms SPI,
 * mà đệm DMA của I2S chỉ giữ được 128 ms tiếng — nên mỗi lần chớp mắt
 * là loa bị bỏ đói gần cạn đệm và TIẾNG VẤP. Robot không có màn ngực mà
 * lại nói lắp, vì một con màn không tồn tại.
 *
 * Màn mới về: đổi thành `1`, cắm 7 sợi, nạp lại. Hết.
 */
#define CO_MAN_NGUC  1

/**
 * ============================================================
 * HAI MẮT VẼ TRÊN MÀN NGỰC — bỏ hai màn tròn (01/10/2026)
 * ============================================================
 *
 * `1` = MỘT màn duy nhất (ngực ST7796U 480×320) làm cả khuôn mặt: hai
 * mắt 240×240 đặt CẠNH NHAU chiếm trọn chiều ngang, dải trạng thái 76px
 * bên dưới. Hai màn tròn GC9A01 KHÔNG được khởi tạo.
 *
 * `0` = cách cũ: hai màn tròn làm mắt, màn ngực vẽ mặt riêng.
 *
 * ⚠️ VÌ SAO CHUYỂN. Ngày 27/08/2026 thêm màn ngực mới vào bus thì hai mắt
 * tròn tắt ngóm, và sau nhiều giờ loại trừ (ESP32 khoẻ 6/6 chân, firmware
 * cũ cũng tối, rút màn ngực khỏi bus vẫn tối, nguồn 3,24V, đèn nền sáng,
 * hạ SPI 4 MHz vẫn tối) vẫn không ra thủ phạm. Người dùng quyết định cất
 * hai màn tròn để nghiên cứu sau và cho robot chạy được trước.
 *
 * Đây không phải bản hạ cấp. Bộ vẽ mắt (`eyes.cpp`, 28 biểu cảm, mống
 * mắt 14 lớp, chớp ngẫu nhiên, đồng tử nảy theo tiếng nói) chạy NGUYÊN
 * VẸN — chỉ đổi chỗ nó đẩy điểm ảnh tới. Hai ống kính tròn sát nhau
 * chính là mắt ống nhòm của WALL-E, hình mẫu của con robot này từ đầu.
 *
 * Lợi thêm: màn ngực chỉ cần 11 sợi (MISO để hở — firmware không đọc),
 * và từ ba thiết bị chung một bus SPI còn một. Ít mối nối hơn = ít chỗ hỏng hơn — bài học đắt nhất của cả
 * dự án đều đến từ dây, không đến từ mã.
 */
#define MAT_TREN_NGUC  1

/** Mép trên của hai mắt trên màn ngực. 4 chứ không 0: chạm mép trông chật. */
#define MAT_Y          4
/** Mép trên của dải trạng thái (đồng hồ · nghe/nghĩ/nói · pin). */
#define DAI_Y          (MAT_Y + 240)

#if MAT_TREN_NGUC && !CO_MAN_NGUC
#error "MAT_TREN_NGUC = 1 can CO_MAN_NGUC = 1 — mat ve len man nguc"
#endif

/**
 * ── CẢM ỨNG: GHÉP TRỤC TẤM CẢM ỨNG VỚI MÀN ──
 *
 * Tấm cảm ứng FT6336U có hệ toạ độ RIÊNG — dọc 320×480 — còn màn đang
 * xoay ngang 480×320 (hướng 1). Bốn cách ghép trục đều "trông hợp lý"
 * trên giấy, và chọn nhầm thì ngón tay đi một đằng mắt nhìn một nẻo.
 *
 * ⚠️ GẦN CHẮC ĐÚNG, CHƯA CHỐT BẰNG SỐ. Ngày 03/09 bàn `thu-cham` chạy
 * đúng phép ghép này (log: `thô X=170 Y=341 → màn (341,149)`), và khi được
 * hỏi "chấm xanh có chạy theo ngón không" user đáp "cảm ứng ok" — nhưng
 * chưa ai đọc số ở hai góc. Xác nhận lại: `pio run -e thu-cham -t upload`,
 * chạm GÓC TRÊN-TRÁI rồi GÓC DƯỚI-PHẢI, chấm xanh phải nằm dưới ngón.
 * Lệch thì lật cờ, không sửa mã:
 *
 *   chấm chạy ngang khi ngón chạy dọc → đổi CHAM_DOI_TRUC
 *   chấm ngược trái/phải               → đổi CHAM_LAT_X
 *   chấm ngược trên/dưới               → đổi CHAM_LAT_Y
 */
#define CHAM_DOI_TRUC  1   // 1 = trục NGANG của màn lấy từ trục Y thô của tấm cảm ứng
#define CHAM_LAT_X     0   // 1 = lật trái ↔ phải
#define CHAM_LAT_Y     1   // 1 = lật trên ↔ dưới
// GPIO38 và GPIO45 CÒN TRỐNG — servo đã chuyển hết sang PCA9685.

// ─── Servo qua PCA9685 (I2C 0x40) ─────────────────────────
// Sáu servo: 2 cổ + 4 tay (mỗi tay vai + khuỷu). Điều thẳng từ GPIO
// thì xung PWM lệch mỗi khi WiFi/I2S chen vào — mắt thường thấy rõ
// cái giật, nhất là lúc tay đang giơ giữa chừng. PCA9685 phát xung
// bằng phần cứng riêng nên đều tuyệt đối, và trả lại 6 chân GPIO.
#define PCA9685_ADDR     0x40
#define SERVO_FREQ_HZ    50

#define CH_NECK_PAN      0
#define CH_NECK_TILT     1
#define CH_ARM_L_SHOULDER 2
#define CH_ARM_L_ELBOW   3
#define CH_ARM_R_SHOULDER 4
#define CH_ARM_R_ELBOW   5

// Giới hạn cơ khí. Khuỷu chỉ gập MỘT chiều — cho nó vượt 0° là đẩy
// cẳng tay vào cánh tay trên, servo kẹt cứng rồi cháy trong ~1 phút.
// Nếu lắp xong thấy đụng sớm hơn, nới ELBOW_MIN lên -100.
#define NECK_PAN_MIN     -90
#define NECK_PAN_MAX      90
#define NECK_TILT_MIN    -35
#define NECK_TILT_MAX     35
#define SHOULDER_MIN     -90
#define SHOULDER_MAX      90
#define ELBOW_MIN       -120
#define ELBOW_MAX          0

// ─── Điện ─────────────────────────────────────────────────
/**
 * PACK **3S** — ba viên 18650 nối tiếp. Chốt 23/08/2026.
 *
 * ⛔⛔ BỘ CHIA ÁP CŨ 100k/47k SẼ GIẾT CHÂN ADC VỚI PACK NÀY.
 * Hệ số 3,128 tính cho 2S (8,4V → 2,68V). Với 3S:
 *
 *     10,6V (đo thật) → 3,39V   ← đã vượt trần 3,3V
 *     12,6V (sạc đầy) → 4,03V   ← cháy GPIO 1
 *
 * Bộ đúng là **100k/30k** (hệ số 4,33): 12,6V → 2,91V, còn dư 0,4V
 * biên an toàn. 220k/68k cũng được (4,24 → 2,98V) và ăn ít dòng rò
 * hơn. ĐỪNG dùng 150k/47k — nó ra 3,01V, sát trần quá, chỉ cần một
 * viên pin sạc hơi quá là chạm 3,3V.
 *
 * ⚠️ Ba hằng số dưới đây đi LIỀN VỚI bộ trở đã hàn. Đổi trở mà quên
 * đổi số thì robot báo pin sai — và một con số bịa tệ hơn hẳn không
 * có số, vì người ta sẽ tin nó rồi đi xa nhà mà tưởng còn đầy pin.
 *
 * ⚠️ 3S KHÔNG dùng được BMS 2S lẫn TP5100 (sạc 2S) trong hộp linh
 * kiện. Cần BMS 3S có cân bằng cell, và sạc 12,6V.
 */
#define BATTERY_CELLS     3      // số viên nối tiếp
#define BATTERY_DIVIDER  4.33f   // (100k + 30k) / 30k
#define BATTERY_FULL_MV  12600   // 3 × 4,20V
#define BATTERY_EMPTY_MV  9600   /* 3 × 3,20V — ĐÚNG ngưỡng cắt của BMS đã mua.
                                  * Không phải 9000: bo BMS 3S 20A ghi "điện thế
                                  * xả cạn 9,6V". Để 9000 thì firmware tưởng còn
                                  * dùng được tới 9V và báo ~3% đúng lúc BMS cắt
                                  * nguồn — người dùng thấy "còn pin" mà robot tắt. */

// ─── An toàn ──────────────────────────────────────────────
// Nằm trong FIRMWARE, không phải trên server: mất mạng thì robot
// phải tự dừng, không được chạy tiếp theo lệnh cuối cùng nhận được.
#define MOTION_WATCHDOG_MS   500   // không có lệnh mới → cắt động cơ
#define OBSTACLE_STOP_MM     120   // phanh khi laser báo gần hơn mức này
#define MAX_MOTOR_DUTY       255

// ─── Mạng ─────────────────────────────────────────────────
#define WS_RECONNECT_BASE_MS 3000
#define WS_RECONNECT_MAX_MS  30000
#define TELEMETRY_INTERVAL_MS 1000
#define HEARTBEAT_TIMEOUT_MS  90000  // 3 lần ping của server bị lỡ

// ─── Âm thanh ─────────────────────────────────────────────
//
// ⚠️ MỌI CON SỐ DƯỚI ĐÂY GẮN CHẶT VỚI MỘT PHÉP DỊCH BIT. Đọc kỹ
// đoạn này trước khi chỉnh, nếu không sẽ chỉnh mò.
//
// INMP441 là mic I2S 24 bit. Bo đọc về từ mỗi khe 32 bit, mẫu nằm ở
// 24 bit CAO (bit 31..8), 8 bit thấp là số 0. Từ đó có hai thang:
//
//   raw >> 8   → thang 24 bit, biên độ ±8.388.608   ← VAD dùng thang này
//   raw >> 13  → thang gửi đi, đã khuếch đại 8 lần  ← gửi lên server
//
// Số đo THẬT trên đúng con mic này, 10/08/2026, nói cách ~30 cm
// (thang 24 bit): nền phòng yên **1200** · nói bình thường **9000** ·
// đỉnh **539466**. Ngưỡng 2800 nằm gọn giữa nền và tiếng nói — cao
// gấp đôi nền nên quạt/gõ bàn không kích, thấp hơn tiếng nói nhiều
// lần nên không sót câu.
#define VAD_THRESHOLD        2800   // thang 24 bit (raw >> 8), đo thật

// Ngưỡng = nền × hệ số này. ×3 vẫn để lọt tiếng phòng (đo trên server
// 10/08: 30 lượt/phút toàn tiếng động), ×4 thì tiếng nói bình thường
// vẫn vượt thoải mái vì giọng cách 30 cm cao gấp 6-8 lần nền.
#define VAD_GATE_MULT        4

// ── Trễ hai mức: MỞ thì khó, GIỮ thì dễ ──
//
// ⚠️ MỘT NGƯỠNG CHO CẢ HAI VIỆC LÀ SAI, VÀ NÓ SAI THEO HAI CHIỀU CÙNG LÚC.
//
// Mở lượt và giữ lượt là hai câu hỏi khác nhau:
//   mở  — "có ai đang nói với mình không?" · đoán sai thì tốn một lần
//         gọi Whisper và Whisper nghe tiếng ồn thì BỊA ra phụ đề
//   giữ — "người đang nói đã dứt câu chưa?" · đoán sai thì CẮT NGANG
//         giữa câu, và người dùng phải nói lại từ đầu
//
// Dùng chung một ngưỡng ×4 thì: muốn đủ nhạy phải hạ xuống, mà hạ xuống
// là mở lượt loạn xạ. Bế tắc — và đó là lý do người dùng vừa kêu "nói
// robot không nghe" vừa kêu "nó nghe cả tiếng ồn".
//
// Tách ra thì hết bế tắc. Giữ ở ×2 nghĩa là những âm tiết nhỏ giữa câu
// (phụ âm đầu tiếng Việt gần như im) không bị tính là im lặng, nên câu
// không bị cắt vụn — mà ngưỡng MỞ vẫn nghiêm như cũ.
#define VAD_HOLD_MULT        2

// Bộ đếm RỈ phải đạt bấy nhiêu mới mở lượt nghe (mỗi khối 16 ms).
// Tăng khi to, giảm khi nhỏ — xem chú thích trong audio.cpp.
//
// 5 chứ không phải 8: bắt 8 thì mic "không nhạy, nói 2-3 lần mới
// nghe", vì tiếng Việt có khoảng lặng giữa các âm tiết và phụ âm đầu
// gần như im. 5 khối vẫn loại được tiếng gõ bàn (chỉ to một hai khối
// rồi tắt hẳn nên bộ đếm rỉ hết trước khi chạm ngưỡng).
#define VAD_OPEN_BLOCKS      5
// Im lặng bấy nhiêu = hết lượt nói. 650 chứ không 800: đây là thời
// gian CHẾT cộng thẳng vào mỗi lượt, người dùng cảm nhận nó y hệt độ
// trễ của server. Dưới 600 thì bắt đầu cắt ngang lúc người ta ngập
// ngừng giữa câu.
#define VAD_SILENCE_MS       650
#define VAD_MAX_TURN_MS      15000
#define VAD_COOLDOWN_MS      300    // vừa dứt lượt, đừng kích lại ngay

// Khuếch đại lúc chuyển sang int16 gửi đi. Đỉnh 539466 ở thang 24 bit
// chia 32 còn 16858 — vừa đủ to cho Whisper mà còn thừa chỗ trước khi
// chạm trần 32767. Để nguyên `raw >> 16` (khuếch đại 1 lần) thì tiếng
// nói chỉ còn biên độ ~35, Whisper nghe ra im lặng.
// 13 → 14, tức giảm một nửa biên độ (-6 dB).
//
// Đo trên bo thật 11/08 sau khi tách bộ lọc: mỗi lượt nghe có 25-395
// mẫu bị XÉN (~0,2-0,9%). Xén xảy ra ở đúng những âm to nhất trong câu
// — chỗ mang nhiều thông tin nhất — và Whisper nghe tiếng méo thì đoán
// bừa. Đó là một trong hai nguồn gây sai chữ, bên cạnh chuyện thanh
// điệu đã sửa ở locGui().
//
// Vì sao giảm nửa mà không sợ quá nhỏ: đỉnh đo được ~506.000 trên thang
// 24 bit, chia 2^14 ra ~7.900 trên thang 16 bit = 24% toàn thang. Đó là
// mức thu chuẩn (-12 dBFS) mà phòng thu nào cũng nhắm tới; Whisper tự
// chuẩn hoá biên độ nên nhỏ hơn không hại, còn xén thì hại thật.
#define MIC_GAIN_SHIFT       14
#define AUDIO_BLOCK_SAMPLES  256    // 16 ms mỗi khối @16 kHz

// Đệm trước: lúc VAD nhận ra "có người nói" thì âm đầu ĐÃ trôi qua
// rồi. Giữ sẵn 320 ms gần nhất và gửi kèm khi mở lượt, nếu không
// Whisper mất chữ đầu tiên của mọi câu.
#define AUDIO_PREROLL_BLOCKS 20

// Đệm phát trong PSRAM: 512 KB = 16 giây tiếng @16 kHz 16 bit mono.
// Một câu trả lời thường 3–5 giây, nên đây là mức dư thoải mái.
// 512 KB → 2 MB, tức 16 giây → 64 giây tiếng.
//
// 512 KB dựa trên giả định "giọng nói thì không bao giờ dài quá 16
// giây". Log bo thật 11/08 phá giả định đó ngay: `noi: 637 KB = 20s`,
// `noi: 608 KB = 19s`. Phần thừa bị playPush() VỨT, nghe thành nhảy
// cóc giữa câu rồi tắt ngang — đúng thứ user tả là "giật giật rồi tắt".
//
// Chỗ này nằm trong PSRAM 8 MB, đang dùng chưa tới một phần mười. 2 MB
// vẫn còn thừa mứa, mà 64 giây thì dài hơn mọi câu trả lời model có
// thể sinh ra trong trần token hiện tại.
#define AUDIO_PLAY_BUF_BYTES (2 * 1024 * 1024)

// Nói xong thì đợi tiếng vang trong phòng tắt hẳn rồi hãy nghe lại.
// Không có quãng này thì robot nghe thấy chính nó và tự nói chuyện
// với mình đến hết pin.
#define MIC_RESUME_DELAY_MS  250
