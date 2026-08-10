# Giai đoạn 0 — kiểm từng linh kiện trên bàn

Trước khi hàn, trước khi in vỏ, trước cả khi có động cơ: **kiểm từng món một**.

Lý do làm theo thứ tự này: khi cả mạch không chạy, nếu bạn đã biết chắc từng món riêng lẻ đều tốt thì chỉ còn phải tìm lỗi ở chỗ nối. Còn nếu cắm tất cả rồi mới bật, bạn có 8 nghi phạm cùng lúc.

---

## Đấu nối cho giai đoạn 0

Chỉ những gì bạn ĐANG CÓ. Chưa cần động cơ, servo, cảm biến.

### Nguồn

```
Pin 18650 ×2 nối tiếp (7,4 V)
        │
        ├─→ LM2596  IN+    (vặn biến trở tới ĐÚNG 5,0 V TRƯỚC KHI cắm gì)
        │           OUT+ ──┬─→ ESP32-S3 chân 5V
        │                  ├─→ MAX98357A Vin
        │                  └─→ màn hình 3.5" VCC (nếu bản 5 V)
        └─→ GND chung cho tất cả
```

⚠️ **Vặn LM2596 ra đúng 5,0 V trước khi cắm bất cứ thứ gì.** Mạch xuất xưởng thường để sẵn 12 V — cắm thẳng vào là chết ESP32 ngay. Đây là cách nhanh nhất để mất 250 nghìn.

⚠️ **XL6009 để riêng, chưa dùng.** Nó là mạch **tăng** áp; với pin 2S 7,4 V bạn cần **hạ** xuống 5 V, tức là LM2596.

### Micro INMP441 → I2S0

| INMP441 | ESP32-S3 |
|---|---|
| VDD | 3V3 |
| GND | GND |
| SCK | GPIO 4 |
| WS | GPIO 5 |
| SD | GPIO 6 |
| **L/R** | **GND** ← quên là đọc ra toàn số 0 |

### Loa MAX98357A → I2S1

| MAX98357A | ESP32-S3 |
|---|---|
| Vin | **5 V** (không phải 3V3 — cấp 3,3 V thì tiếng nhỏ hẳn) |
| GND | GND |
| BCLK | GPIO 15 |
| LRC | GPIO 16 |
| DIN | GPIO 7 |
| SD | 3V3 |
| + / − | hai chân loa (**đừng nối − xuống đất**) |

### Màn hình 3.5" TFT SPI

| Màn hình | ESP32-S3 |
|---|---|
| VCC | 5 V (một số bản là 3,3 V — xem chữ in trên bo) |
| GND | GND |
| CS | GPIO 10 |
| RESET | GPIO 14 |
| DC / RS | GPIO 13 |
| SDI / MOSI | GPIO 11 |
| SCK | GPIO 12 |
| LED | 3V3 |
| SDO / MISO | bỏ trống |

Ba bus này **không xung đột chân nào** với nhau — cắm cả ba cùng lúc được.

---

## Chạy test

```bash
cd firmware/mini-me-robot/test
pio run -t upload
pio device monitor
```

Mở Serial Monitor, gõ số để chọn phép kiểm:

```
1  Kiểm bo mạch      — PSRAM, flash, tần số, chân còn trống
2  Kiểm micro        — đọc mức âm lượng, nói vào xem số có nhảy không
3  Kiểm loa          — phát chuỗi nốt nhạc
4  Kiểm màn hình     — sọc màu, rồi vẽ thử hai con mắt
5  Kiểm WiFi         — quét mạng, đo cường độ sóng
6  Kiểm nguồn        — đo điện áp pin qua chia áp
7  Chạy TẤT CẢ
```

---

## Thứ tự nên làm

**1. Bấm `1` trước tiên.** Nếu nó báo *không thấy PSRAM* thì bo của bạn không phải bản N16R8 — biết ngay bây giờ tốt hơn biết lúc hết RAM giữa lượt nói.

**2. Bấm `2`, nói vào micro.** Con số phải nhảy từ vài trăm lên vài nghìn. Nếu luôn bằng 0: kiểm chân L/R đã nối đất chưa.

**3. Bấm `3`.** Phải nghe rõ 5 nốt. Nếu im lặng mà mạch không nóng: kiểm chân SD của MAX98357A — nối nhầm xuống đất là chip tắt hoàn toàn, không báo lỗi gì.

**4. Bấm `4`.** Màn hiện sọc màu rồi vẽ hai con mắt. Nếu trắng xoá: sai chân DC hoặc RESET. Nếu hiện sọc nhiễu: hạ tốc độ SPI trong `platformio.ini`.

Xong bốn bước này là bạn đã có **robot biết nghe và biết nói** — phần khó nhất của cả dự án.

---

## Vì sao chưa cần động cơ

Đường đi của giọng nói (micro → server → loa) là phần nhiều rủi ro nhất và cũng là phần làm nên con robot. Động cơ thì ngược lại: dễ, và chỉ cần thêm hai dây PWM khi bạn mua driver về.

Làm phần khó trước, khi bàn còn gọn và bạn còn thấy rõ mọi thứ.
