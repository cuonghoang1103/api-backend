# Mini-Me Robot — firmware

Firmware cho robot AI chạy ESP32-S3, nối vào server tại `/device-ws`.

Trang dự án đầy đủ (linh kiện, sơ đồ nối dây, sơ đồ hoạt động, bảng điều khiển trực tiếp):
**https://cuongthai.com/maker-lab/mini-me-robot**

---

## Chạy thử KHÔNG cần phần cứng

Trước khi mua linh kiện, kiểm cả đường đi của dữ liệu bằng robot giả lập:

```bash
node tools/fake-device.mjs --key mk_xxx --secret yyy
```

Lấy `key`/`secret` ở tab **Điều khiển** của trang dự án (bấm Đăng ký — chúng chỉ hiện đúng một lần). Giả lập sẽ gửi telemetry, nhận lệnh, và trả ack y như bo mạch thật, nên toàn bộ Live Console sáng lên.

---

## Nạp firmware

```bash
cd firmware/mini-me-robot
cp src/secrets.example.h src/secrets.h    # điền WiFi + device key/secret
pio run -t upload
pio device monitor
```

Cần [PlatformIO](https://platformio.org/install/cli) (`pip install platformio`).

---

## Bo mạch

**Bắt buộc ESP32-S3-DevKitC-1 bản N16R8** (16 MB flash, 8 MB PSRAM octal).

Firmware in cảnh báo to nếu không thấy PSRAM lúc khởi động. Bản không PSRAM vẫn chạy được phần động cơ, nhưng hết RAM ngay lượt nói đầu tiên — cùng lúc phải giữ bộ đệm thu tiếng, hai khung hình 240×240 cho hai mắt, và bộ đệm giải mã MP3.

⚠️ Trên bản R8, **GPIO 33–37 bị PSRAM octal chiếm** và không dùng được. Trên bản quad-PSRAM thì chúng lại tự do — đó là lý do nhiều bài hướng dẫn dùng mấy chân đó vẫn chạy được với người khác mà không chạy với bạn. Bảng chân đầy đủ nằm trong [`src/config.h`](src/config.h).

---

## Trạng thái

Bản này **chạy được ngay**:

- ✅ Kết nối WiFi + WebSocket tới server, tự kết nối lại có backoff
- ✅ Telemetry 1 Hz (pin, sóng, uptime, khoảng cách, nghiêng)
- ✅ Nhận và thực thi lệnh `move` / `stop` / `turn` / `reboot`, có ack
- ✅ Chốt an toàn nằm trong firmware: mất mạng → cắt động cơ trong 500 ms; laser báo vật cản → phanh

Còn TODO (đánh dấu trong `main.cpp`) — cần phần cứng thật để chỉnh:

- ⬜ `audio_in` — I2S mic + dò tiếng nói (VAD)
- ⬜ `audio_out` — giải mã MP3 → loa, có ngắt khi bị nói chen
- ⬜ `face` — vẽ mắt lên hai màn GC9A01
- ⬜ `sensors` — MPU6050 + VL53L0X (khung đã có, chưa đọc thật)
- ⬜ `ota` — cập nhật qua mạng, kiểm SHA-256
- ⬜ `wake_word` — từ đánh thức tại chỗ (ESP-SR); bản đầu dùng nút chạm trên đầu

Ngưỡng VAD và tham số PID **không đoán trước được** — chúng phụ thuộc vị trí micro bên trong vỏ, độ ồn phòng bạn, và ma sát của khung. Chỉnh khi đã cầm robot trên tay.

---

## Kiến trúc: vì sao server làm phần nặng

Con bo chỉ lo nghe, phát tiếng, và cử động. Nhận dạng tiếng nói, mô hình ngôn ngữ, và tổng hợp giọng chạy trên VPS của bạn:

```
mic → VAD tại chỗ → WebSocket → Whisper → LLM(tính cách) → TTS → WebSocket → loa
```

Ngân sách độ trễ, đo thật: ~25 ms mạng + ~320 ms nhận dạng + ~300 ms nghĩ + ~350 ms đọc ≈ **1 giây**.

Chạy mô hình ngay trên ESP32 nghe thì hay nhưng đổi lại: chỉ nhận được vài chục từ khoá cố định thay vì hiểu tự do, và không thể có tính cách riêng. Đường mạng đáng giá đúng một giây đó.
