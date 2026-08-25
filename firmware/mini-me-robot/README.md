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
- ✅ `eyes` — hai mắt trên 2 màn tròn GC9A01, 28 biểu cảm (xem mục dưới)
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

---

## Ba màn: ngực + hai mắt

| Màn | Chip | CS | Việc |
|---|---|---|---|
| Ngực 3.5" 480×320 | ILI9488 | **GPIO 10** | bảng trạng thái — như tấm pin mặt trời trên ngực WALL-E |
| Mắt trái ⌀1.28" 240×240 | GC9A01 | **GPIO 9** | biểu cảm |
| Mắt phải ⌀1.28" 240×240 | GC9A01 | **GPIO 14** | biểu cảm |

Chung `MOSI 11 · SCLK 12 · DC 13`. Cả ba `RST` nối **3V3**.

⚠️ **Thư viện KHÔNG có reset mềm dù chú thích nói có** — nhánh `else` trong `Arduino_GC9A01::tftInit()` chỉ chứa một dòng `// Software Rest`, không có mã. Nên `man_hinh::resetMem()` **tự gửi lệnh `0x01` + chờ 150 ms** trước khi khởi tạo. Thiếu bước đó thì con màn không bao giờ được reset sau lần cắm điện đầu, và mỗi lần nạp firmware (ESP32 khởi động lại, màn KHÔNG mất điện) là ra sọc.

⚠️ **GPIO 10 trước đây bị dùng hai lần** — vừa là CS màn ngực vừa là CS mắt trái. Triệu chứng không phải màn đen mà là hai hình chồng nhau nhấp nháy, rất dễ đổ oan cho nhiễu dây rồi đi hạ tốc độ SPI. Mắt trái nay ở GPIO 9, mắt phải GPIO 14.

⚠️ **Cả ba màn nay chạy Arduino_GFX, không còn TFT_eSPI.** TFT_eSPI chốt loại chip màn lúc *biên dịch* nên một bản build chỉ nói chuyện được với một driver — không thể vừa ILI9488 vừa GC9A01. Chân và tốc độ nay khai trong [`src/config.h`](src/config.h) + [`src/man_hinh.h`](src/man_hinh.h) chứ không phải trong cờ biên dịch, tức git thấy được và sửa một chỗ.

## Hai mắt — 2× GC9A01 tròn

```bash
pio run -e mat-demo -t upload && pio device monitor
```

Bàn thử chạy **độc lập**: chỉ cần bo + hai màn, không WiFi, không mic, không loa, không động cơ. Nó dạo hết **28 biểu cảm** và nhận lệnh gõ qua Serial Monitor (`?` để xem bảng lệnh). Đấu dây ghi đầy đủ ở đầu [`src/demo_mat.cpp`](src/demo_mat.cpp).

| | |
|---|---|
| Cảm xúc | vui · buồn · giận · ngạc nhiên · yêu (trái tim) · phấn khích (ngôi sao) · tò mò · nghi ngờ · khó chịu · ngại · sợ · chán · choáng (xoáy ốc) · tự hào · khó hiểu · buồn ngủ · đang ngủ · nháy mắt |
| Trạng thái | đang nghe · đang nói · đang quét · đang sạc · khởi động · lỗi · pin yếu · tắt |
| Sống động | chớp ngẫu nhiên 2,4–6,2 s (khép nhanh, mở chậm) · liếc vi mô · con ngươi **nảy theo biên độ tiếng** khi đang nói · mống thở khi đang nghe |

⚠️ **Ba thứ dễ sai lúc đấu dây**, đọc trước khi cắm:

> ## ⛔⛔⛔ 25/08/2026 — CHÁY CON THỨ HAI, MÀN NGỰC ILI9488 3.5"
>
> Cùng một sai lầm, chín ngày sau, trên bo khác. `VCC` chuyển từ 3V3 lên
> 5V → nóng → bốc khói → chết.
>
> **Nhưng bệnh gốc KHÔNG phải điện áp — bo đã hỏng sẵn.** Đo dứt điểm
> 26/08: tháo `VCC` thì `U1` nguội, cắm lại `VCC` vào **3V3** thì nó
> **nóng tiếp**. Ổn áp 3,3V với đầu vào 3,3V rụng gần 0V, tức đốt gần 0W
> — không có cách nào nóng. Nóng nghĩa là đã chập bên trong.
>
> Nhiều khả năng `U1` **suy yếu dần từ trước**, và 5V chỉ kết liễu. Nó
> khớp cả bốn quan sát: tối trước chạy rồi hôm sau trắng · chạy đúng một
> lượt rồi thôi (đầu ra nằm sát ngưỡng) · bốn sợi tín hiệu đo đủ 3,28V
> (dây chưa bao giờ có lỗi) · 5V làm nó chạy lại (bù phần áp `U1` đánh
> mất).
>
> ⛔ **PHÉP ĐO ĐẦU TIÊN CHO MỘT MÀN CÂM LÀ ĐẦU RA CỦA ỔN ÁP, KHÔNG PHẢI
> DÂY.** Vào 3,3V mà ra dưới 3,0V, hoặc `U1` ấm tay, là bo hỏng — hết,
> không cần dò dây, không cần đổi thư viện, không cần sáu cấu hình. Hai
> ngày 25–26/08 mất vì phép đo hai mươi giây ấy không được làm.
>
> ✅ **Bo mới về thì kiểm TRƯỚC KHI bắt vào vỏ:** cắm mỗi `VCC`(3V3) +
> `GND`, bật nguồn, sờ `U1` sau một phút. Phải NGUỘI. Ấm là trả hàng.
> Rồi mới cắm bốn sợi tín hiệu.
>
> Điều đáng ghi không phải "5V làm cháy" — dòng ngay dưới đã nói rồi.
> Điều đáng ghi là **vì sao lời cảnh báo có sẵn vẫn không chặn được**:
>
> - Triệu chứng thật là **màn trắng, chạy đúng MỘT lượt rồi thôi**. Đó là
>   chữ ký của TIẾP XÚC CHẬP CHỜN. Thiếu áp thì thiếu đều, không cho chạy
>   trọn một lượt. Nhận định này đã được viết ra, rồi vẫn đi làm việc khác.
> - **Đo điện áp KHÔNG kiểm được dây.** Bốn sợi tín hiệu đo đủ 3,28V nên
>   bị kết luận là "sạch". Sai: đồng hồ ~10MΩ đọc đủ áp qua một mối bấm
>   chỉ còn dính vài sợi đồng, mà mối ấy không tải nổi xung SPI 20MHz.
>   Phép đúng là đo **Ω** (thang `200Ω`, rút điện, ngoáy đầu cắm trong lúc
>   đo). Phép ấy đến lúc màn cháy vẫn chưa được làm.
> - Lời khuyên đưa ra dạng **"5V an toàn NẾU cầu J1 hở"** — biến một phép
>   chặn thành phép kiểm điều kiện rồi giao cho người dùng tự gác. Với
>   thứ hỏng là không hoàn tác được, phải trả lời **"không"**, không trả
>   lời "được nếu…".
>
> **Luật từ nay: không nâng `VCC` của bất kỳ bo màn nào** trừ khi đọc
> được chữ trên thân IC ổn áp, hoặc có datasheet đúng bo, hoặc đo được
> đầu ra ổn áp. Cần thêm chênh áp thì dùng **3,8–4,2V** (một diode
> `1N4007` nối tiếp rụng 0,7V), không bao giờ 5V.
>
> ⚠️ Chip cháy thường chết dạng **CHẬP**. Tháo hẳn bo hỏng khỏi bus dùng
> chung NGAY — bốn sợi `CS`·`DC`·`SCK`·`MOSI` đi chung với hai mắt và với
> GPIO của ESP32.

1. ⛔ **`VCC` màn tròn nối `3V3`. Cấp 5V là CHÁY — đã cháy thật 16/08/2026.**

   Một con XY1.28YYFT-S7P **bốc khói và khét** khi cấp 5V vào `VCC`, cắm đúng cực. Lúc đó trên bo **chỉ có đúng hai sợi `VCC` và `GND`**, không một dây tín hiệu nào — nên không thể đổ cho chân tín hiệu hay cho ESP32. Riêng 5V vào `VCC` đã đủ giết.

   **Cơ chế thật** — suy ra từ việc chính con U1 nóng lên trước khi khét. U1 đúng là ổn áp nguồn chính; cái giết nó là **nhiệt**, không phải quá áp:

   | `VCC` | LDO | Kết quả |
   |---|---|---|
   | 3,3 V | nằm vùng sụt áp, gần như không sụt → **nguội** | ra ~3,05 V → đèn nền **mờ** |
   | 5,0 V | điều đúng ra 3,3 V | đèn nền **sáng hết cỡ**, nhưng LDO phải đốt (5,0−3,3)×dòng trên thân nó |

   Vỏ SOT-23 to bằng hạt gạo tản được chừng 0,4 W. Đèn nền sáng hết cỡ kéo đủ dòng để vượt mức đó → nóng dần → chết.

   ✅ **Lối ra sạch, không phải chọn giữa "mờ" và "cháy": cấp 3,8–4,2 V.** Đủ chênh áp để LDO ra đủ 3,3V (sáng hết), mà chỉ đốt 0,7V thay vì 1,7V — nhiệt giảm hơn hai lần rưỡi. Đúng bằng điện áp **một viên 18650**, mà robot có sẵn hai viên.

   Tệ hơn nữa: cấp 5V làm đèn nền **sáng rực hẳn lên và hết vệt tối**, trông y như vừa chữa trúng bệnh. Nó chết dần sau vài chục phút. **Dấu hiệu "tốt lên" chính là dấu hiệu đang giết nó.**

   Đèn nền ở 3,3V mờ hơn — chấp nhận. Mắt WALL-E nền đen tuyền, chỉ mống sáng, nên đèn nền yếu gần như không ảnh hưởng.
2. **Hai chân CS phải RIÊNG** (GPIO 9 và 14). Đấu chung thì hai màn hiện y hệt nhau — trông "chạy được" nên rất dễ tưởng đúng, cho tới lúc thử nháy một mắt và cả hai cùng nhắm.
3. Màn ra **sọc hoặc nhiễu hạt** → hạ `man_hinh::TOC_DO` trong [`src/man_hinh.h`](src/man_hinh.h) xuống `27000000` rồi `20000000`. Dây Dupont dài đủ sinh nhiễu ở tốc độ cao.

Bàn thử in **số đo thật** mỗi 2 giây (`[do] ... vong/giay · dinh N us`). Đỉnh phải dưới ~5 ms; nó tự cảnh báo nếu vượt 8 ms.

### Vì sao mã vẽ trông phức tạp hơn cần thiết

`main.cpp` bơm I2S ngay trong `loop()`, và đệm DMA của loa chỉ giữ **128 ms** tiếng. Hàm vẽ nào giữ CPU lâu hơn thế là loa đói đệm và nghe thấy ngay một nhịp vấp — màn ngực đã đụng đúng chuyện này và tới giờ vẫn phải **ngừng vẽ trong lúc robot nói**.

Nên `eyes.cpp` vẽ theo **dải ngang 24 hàng**, mỗi lần `loop()` chỉ đẩy vài dải rồi trả CPU lại (`eyes::loop(budgetUs)`, mặc định 4 ms). Nhờ vậy **hai mắt vẫn sống trong lúc robot đang nói** — mà đó chính là lúc người ta nhìn vào mắt nó nhiều nhất — còn tiếng thì không vấp.

Mắt bám theo màn ngực qua đúng MỘT chỗ: `face::set()` tự chuyển tiếp xuống `eyes::set()`. `main.cpp` gọi `face::set()` từ tám nơi; thêm một dòng cạnh mỗi nơi thì chỉ cần quên một chỗ là mắt và mặt nói hai chuyện khác nhau, mà không có gì báo lỗi.

### Xem trước trên máy tính, không cần phần cứng

[`xem-truoc/`](xem-truoc/) có bộ giả lập (`./chay.sh`, 3 giây một vòng) chạy **đúng mã vẽ đó** trên máy Mac rồi xuất ảnh PNG. Nó đã bắt được ba lỗi trước khi lên bo — trong đó có một lỗi mà đọc mã không thấy: mặt nạ dải bẩn dùng `0xFFFF` trong khi chỉ có 10 dải, khiến sáu bit cao không bao giờ xoá được và **cả 28 biểu cảm đều vẽ lại ảnh chụp đầu tiên**. Trên màn thì mắt vẫn đẹp và vẫn chớp, chỉ là không bao giờ đổi biểu cảm.
