/* eslint-disable */
/**
 * ============================================================
 * Mini-Me Robot — sổ tay làm việc
 * ============================================================
 *
 * Lệnh hay dùng, lỗi đã gặp, đoạn code hay copy. Tích luỹ dần trong
 * lúc làm.
 *
 * Vì sao đáng ghi: ba tháng nữa không ai nhớ vì sao `memory_type` phải
 * là `qio_opi`, hay vì sao đổi schema xong phải giết tiến trình theo
 * CỔNG chứ không theo tên. Những thứ đó tốn hàng giờ để tìm ra và mất
 * 30 giây để quên.
 *
 * Quy ước: mỗi lỗi ghi đủ ba phần — TRIỆU CHỨNG (thấy gì), NGUYÊN NHÂN
 * (vì sao), CÁCH SỬA (làm gì). Thiếu phần triệu chứng thì lần sau gặp
 * lại cũng không tra ra.
 */

export interface NotebookCommand {
  group: string;
  cmd: string;
  what: string;
  note?: string;
}

export interface NotebookError {
  symptom: string;
  cause: string;
  fix: string;
  /** Mất bao lâu mới tìm ra — để biết cái nào đáng nhớ nhất. */
  costMe?: string;
  tags?: string[];
}

export interface NotebookSnippet {
  title: string;
  lang: string;
  why: string;
  code: string;
}

export interface Notebook {
  commands: NotebookCommand[];
  errors: NotebookError[];
  snippets: NotebookSnippet[];
}

export const NOTEBOOK: Notebook = {
  // ══════════════════════════════════════════════════════════
  commands: [
    // ── Nạp firmware ──
    {
      group: 'Firmware',
      cmd: 'pio run -t upload',
      what: 'Biên dịch rồi nạp lên bo đang cắm',
      note: 'Lần đầu tải toolchain ~200 MB, sau đó chỉ vài giây',
    },
    {
      group: 'Firmware',
      cmd: 'pio device monitor',
      what: 'Xem log Serial — tương đương Serial Monitor của Arduino IDE',
      note: 'Thoát bằng Ctrl+C',
    },
    {
      group: 'Firmware',
      cmd: 'pio run -t upload --upload-port /dev/cu.usbmodem2101',
      what: 'Nạp khi có nhiều bo cắm cùng lúc, chỉ rõ cổng nào',
    },
    {
      group: 'Firmware',
      cmd: 'pio run -t clean',
      what: 'Xoá bản build khi có gì đó kỳ lạ mà không giải thích được',
    },
    {
      group: 'Firmware',
      cmd: 'pio pkg exec -p tool-esptoolpy -- esptool.py --port /dev/cu.usbmodem2101 flash_id',
      what: 'Đọc thông tin chip mà KHÔNG cần nạp gì: model, revision, PSRAM, dung lượng flash',
      note: 'Chạy cái này đầu tiên khi cầm một bo lạ về',
    },
    {
      group: 'Firmware',
      cmd: 'pio pkg exec -p tool-esptoolpy -- esptool.py --port /dev/cu.usbmodem2101 erase_flash',
      what: 'Xoá sạch flash khi bo cư xử kỳ quặc sau nhiều lần nạp',
      note: 'Mất hết dữ liệu NVS (WiFi đã lưu, cấu hình)',
    },

    // ── Mac: tìm bo ──
    {
      group: 'macOS',
      cmd: 'ls /dev/cu.*',
      what: 'Liệt kê cổng serial. Bo hiện ra dạng cu.usbmodemXXXX',
      note: 'usbmodem = USB tích hợp trong ESP32-S3, không cần driver. usbserial/wchusbserial = chip chuyển đổi ngoài, có thể cần driver',
    },
    {
      group: 'macOS',
      cmd: 'ioreg -p IOUSB -w0 | grep -i "jtag\\|serial"',
      what: 'Xem macOS nhận bo là thiết bị gì',
      note: '"USB JTAG/serial debug unit" = ESP32-S3 với USB native',
    },
    {
      group: 'macOS',
      cmd: 'brew install platformio',
      what: 'Cài PlatformIO. Không cần Arduino IDE trên Mac',
    },

    // ── Server / Live Console ──
    {
      group: 'Server',
      cmd: 'node tools/fake-device.mjs --key mk_xxx --secret yyy',
      what: 'Giả lập robot để thử Live Console khi chưa có phần cứng',
    },
    {
      group: 'Server',
      cmd: 'node tools/fake-device.mjs --key mk_xxx --secret yyy --host cuongthai.com --tls',
      what: 'Giả lập nối vào production thay vì máy local',
    },
    {
      group: 'Server',
      cmd: 'curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/maker-lab/projects',
      what: 'Kiểm route còn sống không. 200 = ổn, 404 = build cũ/chưa mount',
    },

    // ── Vỏ 3D ──
    {
      group: 'Vỏ 3D',
      cmd: 'node firmware/mini-me-robot/shell/gen-stl.mjs ./stl',
      what: 'Sinh lại 9 file STL sau khi đổi kích thước trong khối tham số P',
    },
  ],

  // ══════════════════════════════════════════════════════════
  errors: [
    {
      symptom: 'Nạp firmware xong, `psramFound()` trả về false dù bo ghi là có PSRAM',
      cause:
        'Sai `memory_type` trong platformio.ini. Bản R8 dùng PSRAM octal (8 dây), bản R2 dùng quad (4 dây) — cấu hình sai thì ESP32 không nói chuyện được với chip PSRAM và báo như không có.',
      fix: 'R8 → `board_build.arduino.memory_type = qio_opi`. R2 → `qio_qspi`. Không chắc thì chạy `esptool.py flash_id` xem dòng "Embedded PSRAM".',
      costMe: 'Có thể mất cả buổi nếu tưởng bo hỏng',
      tags: ['esp32', 'psram', 'platformio'],
    },
    {
      symptom: 'Micro INMP441 đọc ra toàn số 0, hoặc toàn số khổng lồ vô nghĩa',
      cause:
        'Hai lỗi khác nhau. Toàn 0: chân L/R để hở nên micro nói ở kênh PHẢI trong khi code đọc kênh TRÁI. Số khổng lồ: quên dịch phải 8 bit — dữ liệu 24-bit nằm ở phần CAO của từ 32-bit.',
      fix: 'Nối L/R xuống GND, và `int32_t v = sample >> 8;` trước khi dùng.',
      costMe: 'Lỗi phổ biến nhất với con micro này',
      tags: ['inmp441', 'i2s', 'micro'],
    },
    {
      symptom: 'Loa im lặng hoàn toàn, mạch không nóng, không có thông báo lỗi nào',
      cause: 'Chân SD của MAX98357A bị nối xuống GND — đó là chân tắt nguồn chip, không phải chân dữ liệu.',
      fix: 'Để hở chân SD, hoặc nối lên 3V3.',
      tags: ['max98357a', 'loa'],
    },
    {
      symptom: 'ESP32 khởi động lại mỗi khi động cơ bắt đầu quay, hoặc chỉ khi robot xoay tại chỗ',
      cause:
        'Thiếu tụ lọc. Động cơ khởi động rút dòng gấp 5–8 lần lúc chạy đều, kéo tụt điện áp bus xuống dưới ngưỡng sụt áp của ESP32. Xoay tại chỗ nặng hơn đi thẳng vì xích phải trượt ngang trên sàn.',
      fix: 'Hàn tụ 1000 µF NGAY TẠI chân VM và GND của mạch lái động cơ. Đặt cách 10 cm là mất phần lớn tác dụng.',
      costMe: 'Người ta thường debug firmware cả tối trong khi lỗi nằm ở nguồn',
      tags: ['nguồn', 'tụ', 'động cơ'],
    },
    {
      symptom: 'Đổi schema Prisma, chạy generate xong, API vẫn trả thiếu cột mới — không lỗi gì',
      cause:
        '`tsx watch` chỉ reload file nguồn TS. `@prisma/client` nằm trong node_modules và đã vào module cache của Node từ lúc khởi động; generate ghi đè file trên đĩa nhưng tiến trình vẫn giữ bản cũ trong bộ nhớ.',
      fix: 'Restart backend THEO CỔNG: `lsof -ti:3001 | xargs -r kill -9` rồi `npm run dev`. Giết theo tên tiến trình không ăn thua.',
      costMe: '15 phút',
      tags: ['prisma', 'backend', 'cache'],
    },
    {
      symptom: 'Giết backend xong thì frontend dev server cũng chết theo',
      cause: 'Cả hai khởi từ cùng một shell nên nằm chung cây tiến trình.',
      fix: 'Khởi động lại frontend, hoặc chạy hai server từ hai shell riêng ngay từ đầu.',
      tags: ['dev'],
    },
    {
      symptom: 'Edge TTS trả HTTP 403, robot không nói được',
      cause: 'Microsoft siết endpoint read-aloud từ 07/08/2026, nay đòi token Sec-MS-GEC sinh theo đồng hồ.',
      fix: 'Đổi `MAKERLAB_TTS_PROVIDER=google`. Chuỗi dự phòng vẫn cho ra tiếng, nhưng để mặc định là edge thì tốn ~600 ms bắt tay hỏng mỗi lượt nói.',
      tags: ['tts', 'giọng nói'],
    },
    {
      symptom: 'Màn hình SPI hiện sọc nhiễu hoặc trắng xoá',
      cause: 'Trắng xoá: sai chân DC hoặc RESET. Sọc nhiễu: xung SPI quá nhanh so với độ dài dây Dupont.',
      fix: 'Kiểm lại DC/RESET trước. Nếu vẫn sọc, hạ `SPI_FREQUENCY` từ 40 MHz xuống 27 MHz hoặc rút ngắn dây.',
      tags: ['màn hình', 'spi'],
    },
    {
      symptom: 'Mac không thấy cổng nào khi cắm ESP32',
      cause: 'Ba khả năng: cáp chỉ có dây sạc (không có dây dữ liệu), cắm nhầm cổng UART thay vì USB, hoặc chip chuyển đổi cần driver.',
      fix: 'Đổi cáp trước — đây là nguyên nhân phổ biến nhất. Rồi thử cổng USB-C còn lại. `ls /dev/cu.*` để kiểm.',
      tags: ['macos', 'usb'],
    },
    {
      symptom: 'Build lỗi `driver/temperature_sensor.h: No such file or directory`',
      cause:
        'API cảm biến nhiệt trong chip đổi tên giữa hai đời ESP-IDF. Arduino core 2.x dựa trên IDF 4.4 (`driver/temp_sensor.h`, hàm `temp_sensor_read_celsius`), core 3.x dựa trên IDF 5.x (`driver/temperature_sensor.h`, hàm `temperature_sensor_get_celsius`). PlatformIO với `espressif32@^6.9.0` kéo về core 2.0.17, tức nhánh cũ.',
      fix: 'Dò bằng `#if __has_include(<driver/temperature_sensor.h>)` rồi viết cả hai nhánh. Như vậy nâng cấp core sau này không vỡ build.',
      costMe: 'Phát hiện ngay lần build đầu — nhưng chỉ sau 14 phút tải toolchain',
      tags: ['esp-idf', 'platformio', 'build'],
    },
    {
      symptom: 'Lần đầu chạy `pio run` mất hơn 10 phút mà tưởng bị treo',
      cause:
        'PlatformIO tải toolchain Xtensa + RISC-V + framework Arduino, tổng khoảng 500 MB. Thanh tiến trình chỉ hiện phần trăm rời rạc nên trông như đứng im.',
      fix: 'Cứ để chạy. Lần sau chỉ mất vài giây vì đã có cache trong ~/.platformio.',
      tags: ['platformio'],
    },
    {
      symptom: '`tft.init()` TREO CỨNG trên ESP32-S3 — không lỗi, không timeout, chương trình chỉ đứng im giữa chừng',
      cause:
        'TFT_eSPI không được chỉ định bus SPI thì tự chọn bus mặc định, mà chân của bus đó trùng GPIO 33–37 — vốn đã bị PSRAM octal chiếm trên bản N16R8. Xung đột chân không sinh ra lỗi nào, chỉ làm hàm init đứng vĩnh viễn.',
      fix: 'Thêm `-DUSE_HSPI_PORT` vào build_flags. Dấu hiệu nhận ra: log in được dòng ngay TRƯỚC tft.init() rồi im bặt, dòng sau không bao giờ xuất hiện.',
      costMe: 'Ba lần thử lại mới lần ra, vì không có thông báo lỗi nào để bám',
      tags: ['esp32-s3', 'tft_espi', 'spi', 'psram'],
    },
    {
      symptom: 'Gửi lệnh qua serial cho ESP32-S3 nhưng bo không phản ứng',
      cause:
        'Mở cổng serial làm ESP32-S3 (USB CDC tích hợp) RESET. Ký tự gửi ngay sau khi mở cổng rơi vào lúc bo còn đang boot nên bị bỏ qua hoàn toàn.',
      fix: 'Sau khi mở cổng, `sleep(4)` hoặc đọc cho tới khi thấy dấu nhắc rồi mới gửi lệnh. Với script tự động thì gửi lặp vài lần cách nhau ~0,3 s.',
      tags: ['esp32-s3', 'serial', 'usb-cdc'],
    },
    {
      symptom: 'Phép kiểm tự động báo "loa không kêu" nhưng tai nghe rõ mồn một',
      cause:
        'Phép kiểm phát nốt rồi đo mức micro để tự xác nhận loa. Nhưng micro và loa đặt cách nhau vài chục cm và lệch hướng màng, nên tiếng vọng về không vượt nổi mức nền. Phép đo trả về "không nghe thấy" trong khi mạch hoàn toàn đúng.',
      fix: 'Phép đo âm thanh gián tiếp chỉ dùng để XÁC NHẬN DƯƠNG TÍNH: nghe thấy → chắc chắn loa kêu. Không nghe thấy thì KHÔNG kết luận được gì — phải nghe bằng tai. Đã sửa firmware để nói đúng điều đó thay vì báo ❌.',
      costMe: 'Suýt đi tháo lại toàn bộ dây của một mạch vốn đã đúng',
      tags: ['kiểm thử', 'loa', 'bài học'],
    },
    {
      symptom: 'Micro đọc ra mức nền 39000 trong khi bình thường chỉ 1200',
      cause:
        'Đọc I2S ngay sau khi cài driver. Micro MEMS cần vài chục mili giây để ổn định; những khối dữ liệu đầu tiên lệch rất lớn.',
      fix: 'Sau `i2s_driver_install`, đọc và VỨT khoảng 20 khối đầu rồi mới bắt đầu đo. Cũng đừng dùng timeout ngắn cho `i2s_read` khi đang đo — timeout làm `got` về 0 ở phần lớn vòng lặp và trung bình tính ra sai lệch.',
      tags: ['i2s', 'inmp441', 'kiểm thử'],
    },
    {
      symptom: 'MAX98357A: không biết nối chân GAIN vào đâu, và hay nhầm nó với chân SD',
      cause:
        'Cả hai chân đều theo kiểu "nối vào đâu thì ra kết quả khác", lại nằm cạnh nhau. GAIN có 5 mức: GND qua trở 100k=15dB · GND=12dB · ĐỂ HỞ=9dB · Vin=6dB · Vin qua trở 100k=3dB. Còn SD thì nối GND là TẮT HẲN chip.',
      fix: 'Robot dùng GAIN ĐỂ HỞ (9 dB) — đủ to, ít méo, và tiếng loa không to tới mức micro nghe thấy chính robot. Muốn to hơn thì chỉnh phần mềm trước (out->SetGain). SD để hở hoặc nối 3V3, TUYỆT ĐỐI không nối GND.',
      tags: ['max98357a', 'loa'],
    },
    {
      symptom: 'Không biết nối pin vào IN hay OUT của LM2596, và dây đỏ có chắc là dương không',
      cause:
        'IN = nguồn đi vào (pin), OUT = điện đã hạ đi ra tải. Cắm ngược thì mạch không chạy. Màu dây đỏ=dương/đen=âm là quy ước chuẩn nhưng hàng rẻ đôi khi hàn sai từ xưởng.',
      fix: 'Pin vào IN, ESP32 lấy từ OUT. Nhận biết khi chữ mờ: chip LM2596 gần phía IN, cuộn cảm gần phía OUT. Về màu dây: ĐỪNG TIN, đo bằng đồng hồ — đồng hồ số hiện dấu TRỪ khi que cắm ngược, đó chính là câu trả lời. Pin 18650 trần: đầu có núm = dương, đầu phẳng = âm (vỏ pin cũng là âm).',
      tags: ['nguồn', 'lm2596', 'pin'],
    },
    {
      symptom: 'Cấp pin 3,7 V vào LM2596 mà ngõ ra không lên nổi 5 V',
      cause:
        'LM2596 chỉ HẠ áp được, và cần điện áp vào cao hơn điện áp ra ít nhất 1,5 V. Với 3,7 V vào thì ra chỉ khoảng 2 V.',
      fix: '2 pin NỐI TIẾP (7,4 V) → dùng LM2596. 1 pin hoặc 2 pin SONG SONG (3,7 V) → phải dùng XL6009 (mạch tăng áp).',
      tags: ['nguồn', 'lm2596', 'xl6009'],
    },
    {
      symptom: 'Mua nhầm tụ gốm — cầm về mới biết sai trị số',
      cause:
        'Tụ gốm không ghi thẳng giá trị mà ghi mã 3 chữ số tính bằng pF: hai số đầu là trị số, số cuối là số chữ số 0 thêm vào. Nên 104 = 10 rồi thêm 4 số 0 = 100000 pF = 100 nF = 0,1 µF. Người mới hay tưởng 104 nghĩa là 104 pF.',
      fix: 'Cần 100 nF thì chọn mã 104. Bảng nhanh: 101=100pF · 102=1nF · 103=10nF · 104=100nF · 105=1µF.',
      tags: ['tụ', 'linh kiện'],
    },
    {
      symptom: 'Sạc 18650 loại ra 4,2 V không sạc được cụm pin 2S',
      cause:
        'Sạc 4,2 V là loại 1S — chỉ sạc MỘT viên. Cụm 2S nối tiếp cần 8,4 V, sạc 1S không đủ áp để đẩy dòng vào.',
      fix: 'Sạc riêng từng viên bằng đế 1S (cũng chính là cách bắt buộc trước khi nối SONG SONG: sạc riêng đến đầy, đo chênh dưới 0,05 V rồi mới nối). Muốn sạc nguyên cụm 2S trên robot thì cần TP5100.',
      tags: ['pin', 'sạc'],
    },
    {
      symptom: 'Servo kêu è è rồi nóng, sau đó chết',
      cause: 'Bị chặn cơ khí — góc phần mềm cho phép vượt quá giới hạn vật lý, servo cố đẩy mãi vào vật cản.',
      fix: 'Chặn góc trong phần mềm THẤP HƠN giới hạn cơ khí thật vài độ. Riêng khuỷu tay chỉ gập một chiều: giới hạn −120..0, không bao giờ cho vượt 0.',
      costMe: 'Servo cháy trong khoảng một phút',
      tags: ['servo'],
    },
    {
      symptom:
        'Màn hình giật một cái mỗi giây, VÀ loa rè "rẹt" đúng cùng nhịp đó — dù chưa hề phát âm thanh nào',
      cause:
        'Hai triệu chứng, một gốc. Vòng loop() vẽ lại CẢ BẢY vùng của bảng trạng thái mỗi giây bất kể giá trị có đổi hay không → mắt thấy cái nháy. Cùng lúc đó là một cú xả SPI 20 MHz làm sụt nguồn 3V3; mà MAX98357A khi chưa cài driver I2S thì ba chân BCLK/LRC/DIN đang THẢ NỔI, nên nó khuếch đại đúng cú sụt ấy thành tiếng rè theo nhịp vẽ màn.',
      fix: 'Hai việc, làm cả hai. (1) Mỗi ô trên màn nhớ chuỗi nó đang hiện, chỉ vẽ lại khi khác — đứng yên thì màn đứng yên thật. (2) Cài driver I2S TX ngay trong setup() rồi gọi i2s_zero_dma_buffer(): phần cứng I2S phát ra dòng số 0 liên tục, không tốn CPU (DMA tự lặp), amp nhận tín hiệu số hợp lệ báo im lặng nên nó im thật thay vì đoán mò từ chân trôi. Nếu sau hai việc này vẫn còn rè thì phần còn lại là sụt nguồn thật — lúc đó mới đến lượt tụ 1000 µF sát chân amp.',
      costMe: 'Tưởng loa hỏng, suýt tháo ra thay',
      tags: ['loa', 'màn hình', 'nguồn', 'i2s'],
    },
    {
      symptom:
        'Robot nghe được, server nghĩ được, transcript hiện đúng — nhưng robot CÂM. Log server sạch, không một dòng lỗi',
      cause:
        'Image production là `node:22-alpine`, và alpine KHÔNG kèm bộ giải mã MP3 nào. TTS trả MP3, ESP32 chỉ phát được PCM, nên server phải đổi định dạng — không có công cụ thì nó lặng lẽ lùi về gửi nguyên MP3, bo không giải mã được và bỏ qua. Không bên nào coi đó là lỗi nên không bên nào ghi log.',
      fix: 'Khai báo thẳng trong Dockerfile: `RUN apk add --no-cache mpg123` (~400 KB, sinh ra đúng để làm mỗi việc MP3→PCM; ffmpeg cũng được nhưng ~80 MB). Kiểm bằng cách CHẠY THẬT chứ đừng đọc code: đổi một câu TTS rồi soi biên độ PCM — toàn số 0 là hỏng, có đỉnh vài nghìn mới là tiếng thật.',
      costMe: 'Bẫy chưa kịp sập — bắt được lúc đọc Dockerfile trước khi deploy',
      tags: ['docker', 'âm thanh', 'tts'],
    },
    {
      symptom: 'Phát xong một câu thì ~0,1 giây tiếng cuối cùng lặp đi lặp lại mãi không dứt',
      cause:
        'DMA của I2S cứ phát lại vùng đệm khi không được ghi thêm. Ngừng ghi ngay sau mẫu cuối là để nguyên phần đuôi câu nằm trong đệm, và phần cứng vui vẻ phát nó thành vòng lặp vô tận.',
      fix: 'Ghi thêm đủ MỘT VÒNG đệm toàn số 0 sau khi hết dữ liệu (ở đây là 8 × 256 khung). Vừa đẩy nốt phần đuôi thật ra loa, vừa để lại trạng thái im lặng sạch. Đừng gọi i2s_zero_dma_buffer() ngay sau mẫu cuối — làm thế là CẮT CỤT chữ cuối câu.',
      tags: ['loa', 'i2s'],
    },
    {
      symptom:
        'Chép ngưỡng VAD từ chỗ khác về thì mic hoặc không bao giờ kích, hoặc kích liên tục vì tiếng quạt',
      cause:
        'INMP441 là mic 24 bit, mẫu nằm ở 24 bit CAO của khe 32 bit. Mỗi người viết code lại dịch bit một kiểu — `raw>>8` cho thang 24 bit, `raw>>16` cho thang 16 bit — và hai thang cách nhau 256 lần. Con số ngưỡng tách khỏi phép dịch bit thì hoàn toàn vô nghĩa.',
      fix: 'Luôn ghi ngưỡng KÈM phép dịch. Ở dự án này: VAD tính trên `abs(raw >> 8)` (thang 24 bit, ngưỡng 2800), còn mẫu gửi lên server là `raw >> 13` (khuếch đại 8 lần rồi kẹp vào int16). Để nguyên `raw >> 16` mà gửi thì giọng nói chỉ còn biên độ ~35 và Whisper nghe ra im lặng.',
      tags: ['mic', 'vad', 'i2s'],
    },
  ],

  // ══════════════════════════════════════════════════════════
  snippets: [
    {
      title: 'Ngưỡng VAD thật — đo trên phần cứng ngày 10/08/2026',
      lang: 'cpp',
      why: 'Số đo THẬT từ INMP441 trong phòng làm việc, không phải số đoán trong datasheet. Nền im lặng ~1200-2000, nói bình thường 4000-9000, đỉnh 539466. Chọn ngưỡng 2800 nằm giữa nền và giọng nói, đủ xa cả hai phía để không kích nhầm vì tiếng quạt mà cũng không bỏ sót câu nói nhỏ.',
      code: `// Đo được trên bo thật, phòng có tiếng quạt:
//   im lặng      1200 – 2000
//   nói thường   4000 – 9000
//   đỉnh        539466
#define VAD_THRESHOLD    2800   // giữa nền và giọng nói
#define VAD_SILENCE_MS    800   // im bấy nhiêu = hết lượt nói

bool speaking = false;
uint32_t lastLoudMs = 0;

void vadLoop() {
  int32_t level = micLevel();

  if (level > VAD_THRESHOLD) {
    if (!speaking) {
      speaking = true;
      ws.sendTXT("{\\"t\\":\\"audio_start\\"}");   // báo server: bắt đầu lượt
    }
    lastLoudMs = millis();
  } else if (speaking && millis() - lastLoudMs > VAD_SILENCE_MS) {
    speaking = false;
    ws.sendTXT("{\\"t\\":\\"audio_end\\"}");       // hết lượt → server xử lý
  }

  if (speaking) sendAudioChunk();   // chỉ gửi khi có người nói
}`,
    },
    {
      title: 'Kiểm PSRAM ngay lúc khởi động',
      lang: 'cpp',
      why: 'Biết sớm còn hơn hết RAM giữa lượt nói. Đặt ngay đầu setup().',
      code: `if (!psramFound()) {
  Serial.println("!! Không thấy PSRAM — bo này KHÔNG phải bản N16R8");
} else {
  Serial.printf("PSRAM: %u KB trống\\n", ESP.getFreePsram() / 1024);
}

// Bộ đệm lớn phải nằm trong PSRAM, không phải RAM trong chip
uint8_t* buf = (uint8_t*) ps_malloc(160 * 1024);`,
    },
    {
      title: 'Đọc mức âm lượng từ micro I2S',
      lang: 'cpp',
      why: 'Dùng để dò xem có ai đang nói (VAD đơn giản). Nhớ dịch phải 8 bit.',
      code: `int32_t micLevel() {
  int32_t samples[256];
  size_t got = 0;
  i2s_read(I2S_NUM_0, samples, sizeof(samples), &got, portMAX_DELAY);

  int64_t sum = 0;
  int n = got / sizeof(int32_t);
  for (int i = 0; i < n; i++) {
    sum += abs(samples[i] >> 8);   // 24-bit nằm ở phần CAO
  }
  return n ? sum / n : 0;
}`,
    },
    {
      title: 'Chốt an toàn động cơ — phải nằm trong firmware',
      lang: 'cpp',
      why: 'Mất mạng thì robot phải tự dừng, không được chạy tiếp theo lệnh cuối cùng nhận được. Server ở bên kia một đường WiFi có thể biến mất bất cứ lúc nào.',
      code: `void motionWatchdog() {
  // Hết thời gian của lệnh move → cắt
  if (motors.stopAt && millis() >= motors.stopAt) motorStop();

  // Vật cản phía trước → phanh, bất kể server nói gì
  if (tele.distanceMm < OBSTACLE_STOP_MM && motors.left > 0) motorStop();

  // Mất liên lạc quá lâu → cắt và ép kết nối lại
  if (wsConnected && millis() - lastServerMsg > HEARTBEAT_TIMEOUT_MS) {
    motorStop();
    ws.disconnect();
  }
}`,
    },
    {
      title: 'Đếm xung encoder bằng ngắt',
      lang: 'cpp',
      why: 'IRAM_ATTR là bắt buộc. Thiếu nó thì hàm nằm trong flash, và mỗi lần ESP32 nạp từ flash sẽ mất xung — robot lệch dần mà không hiểu vì sao.',
      code: `volatile int32_t tickL = 0;

void IRAM_ATTR onTickL() { tickL++; }

void encoderSetup() {
  pinMode(ENC_L, INPUT_PULLUP);
  attachInterrupt(ENC_L, onTickL, RISING);
}

float distanceMm() {
  noInterrupts();
  int32_t t = tickL;      // chụp nhanh, tránh đọc giữa chừng
  interrupts();
  return t * WHEEL_CIRC_MM / TICKS_PER_REV;
}`,
    },
    {
      title: 'Kết nối lại WebSocket có nhiễu ngẫu nhiên',
      lang: 'javascript',
      why: 'Không có nhiễu thì mọi thiết bị cùng đập vào server một lúc sau khi router khởi động lại.',
      code: `let backoff = 1000;

ws.on('close', () => {
  const wait = Math.min(backoff, 30_000) + Math.random() * 500;
  setTimeout(connect, wait);
  backoff *= 2;
});

ws.on('open', () => { backoff = 1000; });`,
    },
  ],
};
