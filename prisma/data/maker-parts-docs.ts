/* eslint-disable */
/**
 * ============================================================
 * Maker Lab — tài liệu kỹ thuật từng linh kiện
 * ============================================================
 *
 * Thứ bạn thường phải đi lục trong một file PDF 80 trang và bốn
 * thread diễn đàn: con này là gì, nó hoạt động ra sao, chân nào nối
 * đi đâu, dùng thế nào, và cái gì sẽ làm hỏng việc.
 *
 * Khoá theo `svgKey` của dòng BOM. `sim` trỏ tới một mô phỏng tương
 * tác mà frontend dựng ra để giải thích nguyên lý — xem
 * components/maker-lab/PartSimulation.tsx.
 *
 * Nguồn: datasheet chính hãng (link ở mỗi mục) + kinh nghiệm dùng
 * thật. Chỗ nào là ý kiến chứ không phải thông số thì nói rõ.
 */

export type PinType = 'power' | 'gnd' | 'in' | 'out' | 'io' | 'analog' | 'nc';

export interface PinDoc {
  pin: string;
  name: string;
  type: PinType;
  desc: string;
  /** Nối vào đâu trong con robot này. */
  to?: string;
}

export interface PartDocs {
  /** Nó là cái gì, dùng làm gì — 2–3 câu, không thuật ngữ thừa. */
  overview: string;
  /** Nguyên lý: vì sao nó làm được việc đó. */
  howItWorks: string;
  pinout?: PinDoc[];
  /** Dùng cụ thể trong con robot này. */
  usage: string;
  code?: { lang: string; caption: string; body: string };
  /** Lỗi thật, không phải cảnh báo chung chung. */
  gotchas: string[];
  datasheetUrl?: string;
  /** Khoá mô phỏng tương tác, nếu có. */
  sim?: string;
}

export const PART_DOCS: Record<string, PartDocs> = {
  // ══════════════════════════════════════════════════════════
  // NÃO
  // ══════════════════════════════════════════════════════════
  esp32s3: {
    overview:
      'Vi điều khiển hai lõi 240 MHz có sẵn WiFi và Bluetooth, đóng vai trò bộ não tại chỗ của robot: đọc micro, phát tiếng ra loa, quay động cơ, vẽ mắt, và giữ một kết nối WebSocket tới server. Bản N16R8 có 16 MB bộ nhớ chương trình và 8 MB RAM ngoài (PSRAM).',
    howItWorks:
      'Hai lõi Xtensa LX7 chạy song song. Trong con robot này ta ghim tác vụ âm thanh vào lõi 1 và mọi thứ khác vào lõi 0 — vì âm thanh là thời gian thực: trễ vài mili giây là tiếng bị rè, trong khi đọc cảm biến trễ 20 ms thì không ai nhận ra.\n\nPSRAM là RAM gắn ngoài chip, nối qua bus octal (8 dây dữ liệu). Nó chậm hơn RAM trong chip khoảng 3–4 lần nhưng nhiều gấp 15 lần, nên ta để những khối lớn mà không cần nhanh ở đó: bộ đệm thu tiếng, khung hình hai mắt, bộ đệm giải mã MP3. Cái giá phải trả là 5 chân GPIO bị bus octal chiếm vĩnh viễn.',
    pinout: [
      { pin: '5V', name: '5V IN', type: 'power', desc: 'Cấp nguồn 5 V khi không cắm USB', to: 'ngõ ra mạch hạ áp MP1584' },
      { pin: '3V3', name: '3.3V OUT', type: 'power', desc: 'Ngõ ra 3,3 V từ ổn áp trên bo, tối đa ~500 mA', to: 'INMP441, MPU6050, VL53L0X, hai màn hình' },
      { pin: 'GND', name: 'Ground', type: 'gnd', desc: 'Đất chung — mọi mạch phải nối chung điểm này', to: 'đất chung toàn robot' },
      { pin: 'GPIO4/5/6', name: 'I2S0', type: 'io', desc: 'Bus âm thanh vào: SCK, WS, SD', to: 'INMP441' },
      { pin: 'GPIO15/16/7', name: 'I2S1', type: 'out', desc: 'Bus âm thanh ra: BCLK, LRC, DIN', to: 'MAX98357A' },
      { pin: 'GPIO11/12/13', name: 'SPI', type: 'out', desc: 'MOSI, SCLK, DC — dùng chung cho hai màn hình', to: '2× GC9A01' },
      { pin: 'GPIO9/10', name: 'CS', type: 'out', desc: 'Chọn chip: mỗi màn hình một chân', to: 'CS mắt trái / phải' },
      { pin: 'GPIO8/18', name: 'I2C', type: 'io', desc: 'SDA, SCL — dùng chung cho mọi thiết bị I2C', to: 'MPU6050 0x68, VL53L0X 0x29, PCA9685 0x40' },
      { pin: 'GPIO39–42', name: 'Motor PWM', type: 'out', desc: 'Bốn kênh PWM điều hai động cơ', to: 'DRV8833' },
      { pin: 'GPIO47/48', name: 'Encoder', type: 'in', desc: 'Đếm xung Hall từ hai động cơ', to: 'encoder trái / phải' },
      { pin: 'GPIO3', name: 'ADC1_CH2', type: 'analog', desc: 'Đọc điện áp pin qua chia áp', to: 'điểm giữa chia áp 100k/47k' },
      { pin: 'GPIO19/20', name: 'USB D−/D+', type: 'nc', desc: 'ĐỪNG DÙNG — dùng là mất cổng USB', to: '(để trống)' },
      { pin: 'GPIO26–32', name: 'SPI Flash', type: 'nc', desc: 'Bị bộ nhớ chương trình chiếm', to: '(không dùng được)' },
      { pin: 'GPIO33–37', name: 'PSRAM octal', type: 'nc', desc: 'Bị RAM ngoài chiếm TRÊN BẢN R8', to: '(không dùng được)' },
    ],
    usage:
      'Nạp firmware qua cổng USB-C bên phải (cổng "USB", không phải "UART" — cổng USB dùng chip USB tích hợp trong ESP32-S3 nên vừa nạp vừa xem log bằng một sợi cáp). Trong robot, bo nằm giữa THÂN chứ không phải trên đầu, cổng USB quay về phía nắp sau để bạn cắm cáp mà không phải tháo gì.',
    code: {
      lang: 'cpp',
      caption: 'Kiểm PSRAM ngay lúc khởi động — nếu thiếu thì biết sớm còn hơn hết RAM giữa chừng',
      body: `void setup() {
  Serial.begin(115200);
  delay(300);

  if (!psramFound()) {
    Serial.println("!! Không thấy PSRAM — bo này KHÔNG phải bản N16R8");
    Serial.println("!! Phần âm thanh sẽ hết RAM ngay lượt nói đầu tiên");
  } else {
    Serial.printf("PSRAM: %u KB trống\\n", ESP.getFreePsram() / 1024);
  }

  // Cấp phát bộ đệm lớn TRONG PSRAM, không phải RAM trong chip
  uint8_t* audioBuf = (uint8_t*) ps_malloc(160 * 1024);
  if (!audioBuf) Serial.println("cấp phát PSRAM thất bại");
}`,
    },
    gotchas: [
      'GPIO 33–37 dùng được trên bản R2 (PSRAM quad) nhưng KHÔNG dùng được trên bản R8 (PSRAM octal). Đây là lý do bài hướng dẫn trên mạng "chạy được với người ta mà không chạy với mình".',
      'Có hai cổng USB-C. Cổng "USB" nạp được và xem log được; cổng "UART" đi qua chip CH340 riêng, chỉ nạp. Cắm nhầm thì Serial Monitor im lặng.',
      'Ổn áp 3,3 V trên bo chỉ chịu khoảng 500 mA. Đừng cấp servo hay đèn LED từ chân 3V3 — lấy 5 V riêng từ mạch hạ áp.',
      'GPIO0, 3, 45, 46 là chân strapping: mức điện áp trên chúng lúc khởi động quyết định bo boot kiểu gì. Dùng làm ngõ ra hoặc đọc ADC thì được, nhưng đừng treo thứ gì kéo chúng lên/xuống lúc bật nguồn.',
    ],
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf',
  },

  // ══════════════════════════════════════════════════════════
  // NGHE
  // ══════════════════════════════════════════════════════════
  inmp441: {
    overview:
      'Micro MEMS xuất tín hiệu SỐ theo chuẩn I2S. Khác với micro thường (xuất điện áp analog rồi phải qua bộ chuyển đổi), con này tự số hoá ngay bên trong và đẩy thẳng dữ liệu 24-bit vào ESP32.',
    howItWorks:
      'Bên trong là một màng silicon siêu mỏng treo trên một bản cực cố định — về bản chất là một tụ điện mà áp suất âm thanh làm thay đổi điện dung. Mạch tích hợp đọc thay đổi đó, khuếch đại, rồi chuyển thành số ngay trong vỏ chip.\n\nVì việc số hoá xảy ra cách màng vài milimét thay vì cuối một sợi dây, nhiễu điện từ (mà robot có rất nhiều: động cơ, WiFi, mạch xung) không kịp bám vào tín hiệu. Đó là lý do micro số ăn đứt micro analog trong môi trường này, chứ không phải vì "chất âm hay hơn".',
    pinout: [
      { pin: 'VDD', name: 'Nguồn', type: 'power', desc: '1,8–3,3 V', to: 'chân 3V3 của ESP32' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'SCK', name: 'Serial Clock', type: 'in', desc: 'Xung nhịp bit, ESP32 phát ra. 16 kHz × 32 bit × 2 kênh = 1,024 MHz', to: 'GPIO4' },
      { pin: 'WS', name: 'Word Select', type: 'in', desc: 'Chọn kênh trái/phải. Mức thấp = trái, cao = phải', to: 'GPIO5' },
      { pin: 'SD', name: 'Serial Data', type: 'out', desc: 'Dữ liệu âm thanh 24-bit đi ra', to: 'GPIO6' },
      { pin: 'L/R', name: 'Chọn kênh', type: 'in', desc: 'Nối đất = micro nói ở kênh TRÁI. Để hở = kênh phải', to: 'GND' },
    ],
    usage:
      'Đặt hai con ở hai bên đầu robot, ngay sau hai lỗ nhỏ khoan trên vỏ. Khoảng cách giữa hai micro tạo ra độ trễ vài chục micro giây giữa hai kênh khi có tiếng từ một phía — về sau dùng để đoán hướng người nói và quay đầu về phía đó.\n\nRobot lấy mẫu 16 kHz vì đó là thứ Whisper cần. Lấy 44,1 kHz chỉ tốn gấp ba băng thông mà mô hình vẫn hạ xuống 16 kHz trước khi xử lý.',
    code: {
      lang: 'cpp',
      caption: 'Đọc micro qua I2S và tính mức âm lượng để dò xem có ai đang nói',
      body: `#include <driver/i2s.h>

void micSetup() {
  i2s_config_t cfg = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,  // INMP441 đẩy ra 32 bit
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,   // vì L/R nối đất
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .dma_buf_count = 8,
    .dma_buf_len = 512,
  };
  i2s_pin_config_t pins = {
    .bck_io_num = 4, .ws_io_num = 5,
    .data_out_num = I2S_PIN_NO_CHANGE, .data_in_num = 6,
  };
  i2s_driver_install(I2S_NUM_0, &cfg, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pins);
}

// Trả về mức âm lượng trung bình — so với ngưỡng để biết có tiếng nói
int32_t micLevel() {
  int32_t samples[256];
  size_t got = 0;
  i2s_read(I2S_NUM_0, samples, sizeof(samples), &got, portMAX_DELAY);

  int64_t sum = 0;
  int n = got / sizeof(int32_t);
  for (int i = 0; i < n; i++) {
    // Dữ liệu nằm ở 24 bit CAO, phải dịch phải 8 bit
    sum += abs(samples[i] >> 8);
  }
  return n ? sum / n : 0;
}`,
    },
    gotchas: [
      'Dữ liệu nằm ở 24 bit CAO của mỗi từ 32 bit. Quên dịch phải 8 bit là ra toàn số khổng lồ vô nghĩa — lỗi phổ biến nhất với con này.',
      'Chân L/R để hở nghĩa là micro nói ở kênh PHẢI. Nếu cấu hình ESP32 đọc kênh trái mà quên nối L/R xuống đất, bạn sẽ đọc ra toàn số 0 và tưởng micro hỏng.',
      'Đừng bịt kín lỗ micro bằng vỏ. Cần một lỗ thông ⌀1–2 mm; dán băng dính lên là mất hết tần số cao và giọng nghe như qua điện thoại bàn.',
      'Đặt micro càng xa loa càng tốt. Chung một hộp nhỏ thì tiếng loa vọng ngược vào micro và robot tự nghe chính nó nói.',
    ],
    datasheetUrl: 'https://invensense.tdk.com/wp-content/uploads/2015/02/INMP441.pdf',
    sim: 'i2s',
  },

  // ══════════════════════════════════════════════════════════
  // NÓI
  // ══════════════════════════════════════════════════════════
  max98357a: {
    overview:
      'Vừa là bộ chuyển đổi số-sang-analog, vừa là mạch khuếch đại công suất 3 W — gộp vào một con. Nhận thẳng luồng I2S từ ESP32 và đẩy ra loa, không cần thêm gì ở giữa.',
    howItWorks:
      'Khuếch đại lớp D: thay vì tạo ra sóng âm bằng cách cho transistor dẫn một phần (và biến phần dư thành nhiệt như lớp AB), nó bật/tắt hoàn toàn ở tần số ~300 kHz và thay đổi tỉ lệ thời gian bật. Cuộn cảm và tụ ở ngõ ra làm phẳng chuỗi xung đó thành sóng âm thật.\n\nVì transistor luôn ở trạng thái bật hẳn hoặc tắt hẳn, nó gần như không tiêu tán công suất — hiệu suất trên 90%, không cần tản nhiệt, và không ăn pin vô ích. Đó là lý do mọi thiết bị chạy pin đều dùng lớp D.',
    pinout: [
      { pin: 'Vin', name: 'Nguồn', type: 'power', desc: '2,5–5,5 V. Dùng 5 V mới đủ 3 W', to: '5 V từ mạch hạ áp' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'DIN', name: 'Data In', type: 'in', desc: 'Dữ liệu âm thanh I2S', to: 'GPIO7' },
      { pin: 'BCLK', name: 'Bit Clock', type: 'in', desc: 'Xung nhịp bit', to: 'GPIO15' },
      { pin: 'LRC', name: 'L/R Clock', type: 'in', desc: 'Xung chọn kênh, bằng tần số lấy mẫu', to: 'GPIO16' },
      { pin: 'SD', name: 'Shutdown / chọn kênh', type: 'in', desc: 'Nối đất = tắt. Để hở = phát (L+R)/2. Nối 3V3 qua trở = chọn kênh', to: '3V3' },
      { pin: 'GAIN', name: 'Khuếch đại', type: 'in', desc: 'Để hở = 9 dB (mặc định). Nối đất = 12 dB. Nối Vin = 6 dB', to: '(để hở)' },
      { pin: '+ / −', name: 'Ngõ ra loa', type: 'out', desc: 'Ngõ ra vi sai — KHÔNG nối chân − xuống đất', to: 'loa 4 Ω' },
    ],
    usage:
      'Gắn áp vào mặt sau tấm ngực robot, loa hướng thẳng ra trước qua phần lưới khoét sẵn. Cấp 5 V lấy từ mạch hạ áp, không lấy từ chân 3V3 của ESP32 — cấp 3,3 V thì công suất tụt xuống còn khoảng 1 W và tiếng nhỏ hẳn.',
    code: {
      lang: 'cpp',
      caption: 'Phát MP3 từ luồng WebSocket ra loa',
      body: `#include <AudioGeneratorMP3.h>
#include <AudioOutputI2S.h>
#include <AudioFileSourceBuffer.h>

AudioOutputI2S* out;
AudioGeneratorMP3* mp3;

void speakerSetup() {
  out = new AudioOutputI2S(I2S_NUM_1);   // bus I2S RIÊNG, không dùng chung với mic
  out->SetPinout(15 /*BCLK*/, 16 /*LRC*/, 7 /*DIN*/);
  out->SetGain(0.8);                     // 0.0–1.0; 1.0 dễ méo tiếng
  mp3 = new AudioGeneratorMP3();
}

// Gọi liên tục trong vòng lặp của task âm thanh
void speakerLoop() {
  if (mp3->isRunning() && !mp3->loop()) {
    mp3->stop();
  }
}`,
    },
    gotchas: [
      'Ngõ ra là VI SAI: hai chân + và − đều dao động. Nối chân − xuống đất (theo thói quen từ amply thường) là làm chập một nửa cầu ra và con chip sẽ nóng rồi tự ngắt.',
      'Phải dùng bus I2S KHÁC với micro. ESP32-S3 có hai bộ; dùng I2S_NUM_0 cho micro và I2S_NUM_1 cho loa. Dùng chung một bộ thì chỉ chạy được một chiều.',
      'Chân GAIN để hở là 9 dB — đủ cho hầu hết trường hợp. Nối đất lên 12 dB thì to hơn nhưng dễ méo và ăn pin hơn hẳn.',
      'Không nghe thấy gì mà mạch không nóng: kiểm chân SD trước. Nối nhầm xuống đất là chip tắt hoàn toàn, im lặng và không báo lỗi gì.',
    ],
    datasheetUrl: 'https://www.analog.com/media/en/technical-documentation/data-sheets/MAX98357A-MAX98357B.pdf',
    sim: 'i2s',
  },

  speaker: {
    overview:
      'Loa 3 W trở kháng 4 Ω đường kính 40 mm, có khoang cộng hưởng phía sau. Đây là bộ phận phát ra tiếng nói của robot.',
    howItWorks:
      'Dòng điện xoay chiều chạy qua cuộn dây đặt trong từ trường nam châm vĩnh cửu, đẩy màng loa tới lui theo đúng dạng sóng. Phần quan trọng nhưng hay bị bỏ qua là KHOANG phía sau: khi màng đẩy ra trước, nó đồng thời hút không khí ở mặt sau. Nếu mặt sau hở, hai luồng khí đó triệt tiêu nhau ở tần số thấp — hiện tượng gọi là đoản mạch âm học, và đó là lý do loa trần nghe mỏng dính.\n\nMột hộp kín cỡ 30–50 cm³ phía sau chặn luồng khí đó lại, và dải trầm của giọng người (100–300 Hz) mới nghe ra hồn.',
    pinout: [
      { pin: '+', name: 'Cực dương', type: 'in', desc: 'Nối chân + của mạch khuếch đại', to: 'MAX98357A +' },
      { pin: '−', name: 'Cực âm', type: 'in', desc: 'Nối chân − của mạch khuếch đại, KHÔNG nối đất', to: 'MAX98357A −' },
    ],
    usage:
      'Áp mặt loa vào tấm ngực đã khoét lưới, chèn một vòng xốp mỏng quanh mép để bịt rò khí. Phần khoang phía sau chính là khoảng trống trong thân robot — nhớ chừa ít nhất 30 cm³ và đừng nhét dây điện chật cứng vào đó.',
    gotchas: [
      'Rò khí quanh mép loa giết dải trầm nhanh hơn mọi thứ khác. Một vòng xốp 2 mm rẻ hơn việc đổi loa đắt tiền.',
      'Loa 8 Ω cắm vào mạch thiết kế cho 4 Ω sẽ chạy, nhưng chỉ ra được nửa công suất. Ngược lại (4 Ω vào mạch 8 Ω) thì quá dòng.',
      'Đừng gắn loa cứng vào cùng tấm với micro. Rung truyền qua khung vào micro và robot sẽ nghe chính giọng mình.',
    ],
  },

  // ══════════════════════════════════════════════════════════
  // MẶT
  // ══════════════════════════════════════════════════════════
  gc9a01: {
    overview:
      'Màn hình LCD TRÒN 1,28 inch, 240×240 điểm ảnh, 65 nghìn màu, giao tiếp SPI. Hai cái làm thành hai con mắt của robot — đây là bộ phận quyết định robot có "hồn" hay không.',
    howItWorks:
      'GC9A01 là chip điều khiển nằm ngay sau tấm kính. Nó có bộ nhớ khung hình riêng: ESP32 gửi dữ liệu điểm ảnh qua SPI vào bộ nhớ đó, và chip tự lo việc quét màn hình liên tục. Nhờ vậy ESP32 chỉ tốn thời gian khi có gì đó THAY ĐỔI, chứ không phải vẽ lại 60 lần mỗi giây.\n\nSPI là bus một chiều tốc độ cao: ESP32 phát xung nhịp trên SCLK và đẩy bit ra MOSI. Chân DC nói cho màn hình biết byte đang gửi là LỆNH hay DỮ LIỆU. Chân CS chọn màn hình nào đang được nói chuyện — đó là cách hai màn hình dùng chung ba dây mà không giẫm chân nhau.',
    pinout: [
      { pin: 'VCC', name: 'Nguồn', type: 'power', desc: '3,3 V', to: '3V3' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'SCL', name: 'SPI Clock', type: 'in', desc: 'Xung nhịp, tới 40 MHz. Dùng chung hai màn', to: 'GPIO12' },
      { pin: 'SDA', name: 'MOSI', type: 'in', desc: 'Dữ liệu vào. Dùng chung hai màn', to: 'GPIO11' },
      { pin: 'DC', name: 'Data/Command', type: 'in', desc: 'Mức thấp = byte lệnh, cao = byte dữ liệu. Dùng chung', to: 'GPIO13' },
      { pin: 'CS', name: 'Chip Select', type: 'in', desc: 'Kéo xuống thấp để chọn màn này. RIÊNG mỗi màn', to: 'GPIO10 (trái) / GPIO9 (phải)' },
      { pin: 'RST', name: 'Reset', type: 'in', desc: 'Kéo thấp để reset cứng. Nối 3V3 rồi reset bằng phần mềm', to: '3V3' },
      { pin: 'BLK', name: 'Đèn nền', type: 'in', desc: 'Để hở = sáng luôn. Nối PWM để chỉnh độ sáng', to: '(để hở)' },
    ],
    usage:
      'Hai màn lồng trong hai ống ⌀48 mm ở mặt trước đầu robot. Dùng thư viện TFT_eSPI với sprite dựng trong PSRAM: vẽ toàn bộ con mắt vào sprite rồi đẩy một lần, thay vì vẽ từng hình lên màn — cách sau sẽ thấy rõ hiện tượng nháy.\n\nChi tiết làm nên khác biệt lớn nhất không phải độ phân giải mà là CHỚP MẮT NGẪU NHIÊN mỗi 3–7 giây khi robot rảnh. Đúng một dòng code đó biến "màn hình có vẽ mắt" thành "nó đang nhìn mình".',
    code: {
      lang: 'cpp',
      caption: 'Hai màn dùng chung bus SPI, chỉ khác chân CS',
      body: `#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();
TFT_eSprite eye = TFT_eSprite(&tft);

#define CS_LEFT  10
#define CS_RIGHT  9

void eyesSetup() {
  pinMode(CS_LEFT, OUTPUT);
  pinMode(CS_RIGHT, OUTPUT);
  digitalWrite(CS_LEFT, HIGH);   // bỏ chọn cả hai
  digitalWrite(CS_RIGHT, HIGH);

  selectBoth();
  tft.init();
  tft.fillScreen(TFT_BLACK);
  deselectBoth();

  // Sprite nằm trong PSRAM — 240×240×2 byte = 115 KB, quá lớn cho RAM trong chip
  eye.setColorDepth(16);
  eye.createSprite(240, 240);
}

void drawEye(int cs, int pupilX, int pupilY) {
  eye.fillSprite(TFT_BLACK);
  eye.fillCircle(120, 120, 100, TFT_BLUE);      // mống mắt
  eye.fillCircle(120 + pupilX, 120 + pupilY, 42, TFT_NAVY);
  eye.fillCircle(120 + pupilX, 120 + pupilY, 24, TFT_BLACK);
  eye.fillCircle(100 + pupilX, 100 + pupilY, 12, TFT_WHITE);  // đốm sáng

  digitalWrite(cs, LOW);
  eye.pushSprite(0, 0);
  digitalWrite(cs, HIGH);
}

// Chớp mắt ngẫu nhiên — chi tiết nhỏ này làm khác biệt nhiều nhất
uint32_t nextBlink = 0;
void eyesLoop() {
  if (millis() > nextBlink) {
    blinkOnce();
    nextBlink = millis() + random(3000, 7000);
  }
}`,
    },
    gotchas: [
      'PCB của module là 40,4 mm VUÔNG dù phần kính tròn chỉ ⌀32,4 mm. Thiết kế ống mắt theo 32,4 mm là board không lọt — đây là sai lầm khiến phải in lại cả bộ vỏ.',
      'Hai màn phải có chân CS RIÊNG. Nối chung là cả hai cùng nhận lệnh và bạn không bao giờ vẽ được hai mắt khác nhau.',
      'Sprite 240×240 chiếm 115 KB. Không có PSRAM thì createSprite trả về NULL và màn hình đứng im — mà không báo lỗi gì.',
      'SPI trên 40 MHz với dây Dupont dài sẽ ra nhiễu và màn hình hiện sọc. Nếu thấy sọc, hạ xuống 27 MHz hoặc rút ngắn dây.',
    ],
    datasheetUrl: 'https://www.buydisplay.com/download/ic/GC9A01A.pdf',
    sim: 'spi',
  },

  ws2812ring: {
    overview:
      'Vòng 16 đèn LED RGB, mỗi đèn có chip điều khiển riêng bên trong. Cả vòng chỉ cần MỘT dây dữ liệu duy nhất.',
    howItWorks:
      'Mỗi LED chứa một mạch nhỏ đọc 24 bit đầu tiên đến với nó (8 bit cho mỗi màu xanh lá, đỏ, xanh dương), giữ lại, rồi chuyển tiếp phần còn lại cho LED kế tiếp. Muốn điều khiển 16 đèn thì gửi 16 × 24 = 384 bit liền một mạch.\n\nBit được mã hoá bằng ĐỘ RỘNG XUNG: xung cao ngắn (~0,4 µs) là bit 0, xung cao dài (~0,8 µs) là bit 1. Sai số cho phép chỉ khoảng 150 nano giây — quá chặt để dùng lệnh digitalWrite thông thường, nên thư viện phải dùng phần cứng RMT của ESP32.',
    pinout: [
      { pin: '5V', name: 'Nguồn', type: 'power', desc: '5 V. 16 LED sáng trắng full = ~0,9 A', to: '5 V từ mạch hạ áp' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'DIN', name: 'Data In', type: 'in', desc: 'Dây dữ liệu duy nhất', to: 'GPIO21' },
      { pin: 'DOUT', name: 'Data Out', type: 'out', desc: 'Nối sang vòng tiếp theo nếu muốn mở rộng', to: '(để trống)' },
    ],
    usage:
      'Gắn quanh mặt hoặc trên đỉnh đầu. Dùng làm ngôn ngữ trạng thái đọc được từ đầu kia phòng, nơi mắt 1,28 inch quá nhỏ: xanh dương xoay = đang nghe, vàng thở = đang nghĩ, đỏ nháy = mất WiFi, xanh lá = sẵn sàng.',
    code: {
      lang: 'cpp',
      caption: 'Hiệu ứng xoay tròn báo "đang nghe"',
      body: `#include <Adafruit_NeoPixel.h>

Adafruit_NeoPixel ring(16, 21, NEO_GRB + NEO_KHZ800);

void ledSetup() {
  ring.begin();
  ring.setBrightness(60);   // 255 vừa chói mắt vừa ăn gần 1 A
  ring.show();
}

void spinBlue(uint8_t head) {
  ring.clear();
  for (int i = 0; i < 5; i++) {                 // đuôi sao chổi 5 đèn
    int idx = (head - i + 16) % 16;
    uint8_t fade = 255 >> i;                     // mờ dần về đuôi
    ring.setPixelColor(idx, ring.Color(0, fade / 3, fade));
  }
  ring.show();
}`,
    },
    gotchas: [
      'Đừng bao giờ để độ sáng 255 với cả 16 đèn màu trắng: gần 1 A, đủ để kéo sụt nguồn và làm ESP32 khởi động lại. Giới hạn 60–80 là quá đủ trong nhà.',
      'LED cần 5 V nhưng chân dữ liệu nhận mức 3,3 V từ ESP32 — thường vẫn chạy, nhưng nếu nhấp nháy lung tung thì thêm mạch nâng mức hoặc nối một điốt nối tiếp vào chân 5V của vòng để hạ ngưỡng logic xuống.',
      'Thêm tụ 470 µF ngay tại chân nguồn của vòng và một điện trở 330 Ω nối tiếp chân dữ liệu. Cả hai đều rẻ và đều cứu LED đầu tiên khỏi chết vì xung dòng lúc bật.',
    ],
    datasheetUrl: 'https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf',
  },

  // ══════════════════════════════════════════════════════════
  // CHUYỂN ĐỘNG
  // ══════════════════════════════════════════════════════════
  motor: {
    overview:
      'Động cơ điện một chiều 6 V gắn hộp số kim loại tỉ số 1:34, kèm encoder Hall đếm vòng quay. Hai con kéo hai dải xích của robot.',
    howItWorks:
      'Phần động cơ là loại chổi than thông thường: cấp điện là quay, đảo cực là quay ngược, điện áp càng cao thì càng nhanh. Hộp số 1:34 đổi tốc độ cao mô-men thấp thành tốc độ vừa mô-men cao — điều bắt buộc, vì động cơ trần quay 7000 vòng/phút mà gần như không kéo nổi gì.\n\nPhần đáng tiền là ENCODER ở đuôi: một đĩa nam châm gắn trên trục và hai cảm biến Hall đọc từ trường. Mỗi vòng trục động cơ cho 11 xung; nhân với tỉ số 34 là 374 xung mỗi vòng bánh xe. Đếm xung là biết chính xác robot đã đi bao xa — không cần đoán bằng thời gian, vốn sai ngay khi pin yếu đi hoặc sàn đổi chất liệu.',
    pinout: [
      { pin: 'M+', name: 'Động cơ +', type: 'power', desc: 'Cuộn dây động cơ. Đảo với M− để quay ngược', to: 'DRV8833 AOUT1' },
      { pin: 'M−', name: 'Động cơ −', type: 'power', desc: 'Cuộn dây động cơ', to: 'DRV8833 AOUT2' },
      { pin: 'VCC', name: 'Nguồn encoder', type: 'power', desc: '3,3–5 V, chỉ nuôi mạch Hall', to: '3V3' },
      { pin: 'GND', name: 'Đất encoder', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'C1', name: 'Kênh A', type: 'out', desc: 'Xung Hall. 11 xung mỗi vòng trục động cơ', to: 'GPIO47 (trái) / GPIO48 (phải)' },
      { pin: 'C2', name: 'Kênh B', type: 'out', desc: 'Lệch pha 90° so với C1 — cho biết CHIỀU quay', to: '(không dùng: ta đã biết chiều vì ta ra lệnh)' },
    ],
    usage:
      'Bắt vít vào giá bên trong khoang đế, trục xuyên qua thành thân nối vào bánh dẫn xích. Chỉ dùng một kênh encoder mỗi động cơ để tiết kiệm chân — biết chiều quay là thừa vì chính firmware ra lệnh chiều nào.\n\nĐọc xung bằng NGẮT (interrupt), không bằng cách hỏi liên tục trong vòng lặp: ở tốc độ tối đa xung tới khoảng 1,3 kHz, vòng lặp chính bận vẽ mắt hay xử lý âm thanh là bỏ sót ngay.',
    code: {
      lang: 'cpp',
      caption: 'Đếm xung encoder bằng ngắt và tính quãng đường thật',
      body: `#define ENC_L 47
#define ENC_R 48
#define TICKS_PER_REV  374        // 11 xung × tỉ số 34
#define WHEEL_CIRC_MM  204        // bánh ⌀65 mm → chu vi π×65

volatile int32_t tickL = 0, tickR = 0;

// IRAM_ATTR: hàm ngắt phải nằm trong RAM, không phải flash —
// nếu không, một lần đọc flash chậm sẽ làm mất xung.
void IRAM_ATTR onTickL() { tickL++; }
void IRAM_ATTR onTickR() { tickR++; }

void encoderSetup() {
  pinMode(ENC_L, INPUT_PULLUP);
  pinMode(ENC_R, INPUT_PULLUP);
  attachInterrupt(ENC_L, onTickL, RISING);
  attachInterrupt(ENC_R, onTickR, RISING);
}

float distanceMm() {
  noInterrupts();                  // chụp nhanh, tránh đọc giữa chừng
  int32_t l = tickL, r = tickR;
  interrupts();
  return ((l + r) / 2.0f) * WHEEL_CIRC_MM / TICKS_PER_REV;
}

// Đây mới là chỗ encoder trả tiền: giữ hai bánh cùng tốc độ
int16_t balance(int16_t base) {
  int32_t err = tickL - tickR;     // lệch dương = bánh trái đi nhanh hơn
  return base - err * 2;           // hệ số 2 là điểm khởi đầu, chỉnh theo thực tế
}`,
    },
    gotchas: [
      'Hàm ngắt PHẢI có IRAM_ATTR. Thiếu nó thì hàm nằm trong flash, và mỗi lần ESP32 phải nạp từ flash sẽ mất xung — biểu hiện là robot đi được một đoạn rồi lệch dần mà không hiểu vì sao.',
      'Đừng cấp nguồn encoder từ cùng đường với động cơ. Xung nhiễu từ chổi than sẽ vào thẳng mạch Hall và sinh ra xung ma.',
      'Hai động cơ cùng lô vẫn lệch tốc độ 5–10% ở cùng mức PWM. Đó chính là lý do phải có encoder — không có nó thì không cách nào đi thẳng.',
      'Chổi than sinh nhiễu điện từ mạnh. Hàn một tụ gốm 100 nF ngay trên hai chân động cơ, sát vỏ động cơ nhất có thể.',
    ],
    sim: 'encoder',
  },

  track: {
    overview:
      'Bộ bánh xích kiểu xe tăng: hai dải xích cao su, bánh dẫn có răng, bánh đỡ và các bánh tì. Đây là thứ tạo nên dáng WALL-E.',
    howItWorks:
      'Bánh dẫn có răng ăn khớp vào lỗ trên dải xích, kéo cả dải đi. Toàn bộ đoạn xích nằm dưới đáy tiếp xúc với sàn, thay vì chỉ hai điểm như bánh tròn — diện tích tiếp xúc lớn hơn hàng chục lần.\n\nHệ quả tốt: vượt được thảm dày, ngưỡng cửa, dây điện trên sàn. Hệ quả xấu: khi xoay tại chỗ, cả dải xích phải TRƯỢT NGANG trên sàn thay vì lăn, nên ma sát lớn gấp đôi và dòng động cơ tăng vọt. Đó là lý do robot xích ăn pin hơn và cần tụ lọc lớn hơn.',
    usage:
      'Bánh dẫn đặt phía SAU (nối trục động cơ), bánh đỡ phía trước — giống bản gốc. Căng xích vừa đủ: ấn ngón tay vào giữa đoạn trên thấy võng khoảng 3–5 mm là đúng. Căng quá thì động cơ ì và hộp số mòn nhanh; lỏng quá thì xích tuột khi xoay.',
    gotchas: [
      'Xoay tại chỗ ăn dòng gấp đôi đi thẳng. Nếu ESP32 chỉ reset khi robot quay đầu chứ không khi đi thẳng, thủ phạm gần như chắc chắn là thiếu tụ lọc chứ không phải lỗi phần mềm.',
      'Xích tuột thường là do lệch trục, không phải do lỏng. Kiểm bánh dẫn và bánh đỡ có thẳng hàng không trước khi căng thêm.',
      'Trên sàn gạch bóng, xích cao su bám tốt tới mức robot có thể tự lật ngửa nếu tăng tốc đột ngột. Giới hạn gia tốc trong firmware, đừng nhảy thẳng từ 0 lên PWM tối đa.',
    ],
  },

  servo: {
    overview:
      'Động cơ servo góc: bảo nó quay tới bao nhiêu độ thì nó tự đi tới đó và giữ nguyên. Robot dùng sáu con — hai cho cổ (xoay, gật), bốn cho tay (vai và khuỷu mỗi bên).',
    howItWorks:
      'Bên trong có ba thứ: động cơ nhỏ, hộp số, và một biến trở gắn trên trục ra. Mạch điều khiển đọc biến trở để biết trục đang ở góc nào, so với góc bạn yêu cầu, rồi quay động cơ theo hướng làm sai lệch nhỏ lại. Đây là vòng phản hồi kín — chính nó cho phép servo GIỮ vị trí ngay cả khi bị đẩy.\n\nGóc được truyền bằng độ rộng xung, lặp mỗi 20 ms: xung 1,0 ms = 0°, 1,5 ms = 90°, 2,0 ms = 180°. Chỉ mỗi độ rộng có ý nghĩa; phần còn lại của chu kỳ là im lặng.',
    pinout: [
      { pin: 'Nâu/Đen', name: 'GND', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'Đỏ', name: 'V+', type: 'power', desc: '4,8–6 V. SG90 đỉnh ~700 mA khi khởi động', to: '5 V từ mạch hạ áp (KHÔNG lấy từ ESP32)' },
      { pin: 'Cam/Vàng', name: 'Tín hiệu', type: 'in', desc: 'Xung 1,0–2,0 ms lặp mỗi 20 ms', to: 'PCA9685 kênh 0–5' },
    ],
    usage:
      'Cổ dùng MG90S bánh răng kim loại vì phải đỡ cụm đầu ~180 g treo trước trục. Tay dùng SG90 nhựa vì chỉ vẫy, không nâng gì — và nhẹ mới quan trọng: mô-men đè lên vai tỉ lệ với khối lượng nhân chiều dài cánh tay.\n\nQuan trọng khi lắp: đưa servo về vị trí gốc bằng phần mềm TRƯỚC rồi mới gắn cần vào trục. Gắn trước là lệch, và cách sửa duy nhất là tháo ra làm lại.',
    code: {
      lang: 'cpp',
      caption: 'Điều sáu servo qua PCA9685, có chặn giới hạn cơ khí',
      body: `#include <Adafruit_PWMServoDriver.h>

Adafruit_PWMServoDriver pca(0x40);

#define CH_ARM_L_SHOULDER 2
#define CH_ARM_L_ELBOW    3

void servoSetup() {
  pca.begin();
  pca.setPWMFreq(50);        // servo chuẩn: 50 Hz = chu kỳ 20 ms
}

// PCA9685 chia chu kỳ thành 4096 nấc.
// 20 ms / 4096 ≈ 4,88 µs mỗi nấc.
// 1,0 ms ≈ nấc 205 (0°) · 2,0 ms ≈ nấc 410 (180°)
void servoAngle(uint8_t ch, int deg) {
  deg = constrain(deg, 0, 180);
  uint16_t tick = map(deg, 0, 180, 205, 410);
  pca.setPWM(ch, 0, tick);
}

void setArm(int shoulder, int elbow) {
  // Khuỷu CHỈ gập một chiều. Cho vượt 0 là đẩy cẳng tay vào
  // cánh tay trên, servo kẹt cứng rồi cháy trong khoảng một phút.
  shoulder = constrain(shoulder, -90, 90);
  elbow    = constrain(elbow, -120, 0);

  servoAngle(CH_ARM_L_SHOULDER, 90 + shoulder);
  servoAngle(CH_ARM_L_ELBOW,    90 + elbow);
}`,
    },
    gotchas: [
      'Servo kẹt cơ khí (đụng vỏ, đụng cánh tay) sẽ kêu è è và cháy trong khoảng một phút. Luôn chặn góc trong phần mềm THẤP HƠN giới hạn cơ khí thật vài độ.',
      'Sáu servo khởi động cùng lúc rút quá 2 A. Cấp nguồn riêng từ mạch hạ áp — chung với ESP32 là bo reset ngay giữa lúc robot đang chào.',
      'SG90 rẻ có độ rơ khoảng 2–3°, tích lại qua hai khớp thành 5° ở bàn tay. Chấp nhận được cho cử chỉ, không đủ cho việc cần chính xác.',
      'Đừng dùng servo 360° ("servo quay liên tục") cho khớp: loại đó chỉ điều được TỐC ĐỘ chứ không điều được GÓC, vì nhà sản xuất đã tháo biến trở phản hồi ra.',
    ],
    datasheetUrl: 'https://components101.com/motors/servo-motor-basics-pinout-datasheet',
    sim: 'servo',
  },

  // ══════════════════════════════════════════════════════════
  // MẠCH LÁI
  // ══════════════════════════════════════════════════════════
  drv8833: {
    overview:
      'Mạch lái động cơ hai kênh dùng MOSFET, dòng 1,5 A liên tục mỗi kênh. Nó đứng giữa ESP32 (điều khiển bằng tín hiệu yếu 3,3 V) và động cơ (cần dòng lớn 7,4 V).',
    howItWorks:
      'Mỗi kênh là một CẦU H: bốn transistor xếp thành hình chữ H với động cơ nằm ở thanh ngang. Bật cặp chéo trên-trái và dưới-phải thì dòng chạy một chiều; bật cặp chéo còn lại thì dòng chạy ngược — đó là cách đảo chiều quay mà không cần nguồn âm.\n\nTốc độ điều bằng cách bật/tắt rất nhanh (PWM): bật 50% thời gian thì động cơ nhận trung bình một nửa điện áp. DRV8833 dùng MOSFET nên khi dẫn, điện trở chỉ vài chục milliôm — sụt áp khoảng 0,2 V. L298N cũ dùng transistor lưỡng cực, sụt tới 2 V, và 2 V đó biến thành nhiệt, chính là lý do nó cần tản nhiệt to đùng.',
    pinout: [
      { pin: 'VM', name: 'Nguồn động cơ', type: 'power', desc: '2,7–10,8 V. Lấy THẲNG từ pin, không qua mạch hạ áp', to: 'pin 7,4 V (kèm tụ 1000 µF sát chân này)' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung — bắt buộc chung với ESP32', to: 'GND' },
      { pin: 'AIN1', name: 'Điều khiển A1', type: 'in', desc: 'Kênh A. Cùng AIN2 quyết định chiều và tốc độ', to: 'GPIO39' },
      { pin: 'AIN2', name: 'Điều khiển A2', type: 'in', desc: 'Xem bảng trạng thái bên dưới', to: 'GPIO40' },
      { pin: 'BIN1', name: 'Điều khiển B1', type: 'in', desc: 'Kênh B', to: 'GPIO41' },
      { pin: 'BIN2', name: 'Điều khiển B2', type: 'in', desc: 'Kênh B', to: 'GPIO42' },
      { pin: 'AOUT1/2', name: 'Ngõ ra A', type: 'out', desc: 'Nối động cơ trái', to: 'động cơ trái' },
      { pin: 'BOUT1/2', name: 'Ngõ ra B', type: 'out', desc: 'Nối động cơ phải', to: 'động cơ phải' },
      { pin: 'nSLEEP', name: 'Ngủ', type: 'in', desc: 'Mức thấp = ngủ. Kéo lên 3V3 để luôn thức', to: '3V3' },
      { pin: 'nFAULT', name: 'Báo lỗi', type: 'out', desc: 'Kéo thấp khi quá dòng hoặc quá nhiệt', to: '(để trống, hoặc nối GPIO nếu muốn biết)' },
    ],
    usage:
      'Bảng trạng thái mỗi kênh — đây là thứ cần nhớ:\n\n• IN1=PWM, IN2=0 → quay thuận, tốc độ theo PWM\n• IN1=0, IN2=PWM → quay ngược\n• IN1=0, IN2=0 → thả trôi (động cơ quay tự do theo quán tính)\n• IN1=1, IN2=1 → phanh (nối tắt hai đầu cuộn dây, dừng gắt)\n\nTrong robot, lệnh `stop` dùng chế độ PHANH chứ không phải thả trôi — dừng dứt khoát khi gặp vật cản quan trọng hơn là dừng êm.',
    code: {
      lang: 'cpp',
      caption: 'Điều hai động cơ bằng bốn kênh PWM phần cứng',
      body: `#define AIN1 39
#define AIN2 40
#define BIN1 41
#define BIN2 42

void motorSetup() {
  const int pins[4] = {AIN1, AIN2, BIN1, BIN2};
  for (int i = 0; i < 4; i++) {
    ledcSetup(i, 20000, 8);    // 20 kHz — trên ngưỡng nghe, không rít
    ledcAttachPin(pins[i], i);
    ledcWrite(i, 0);
  }
}

// speed: -255..255. Dấu quyết định chiều.
void drive(int16_t left, int16_t right) {
  left  = constrain(left,  -255, 255);
  right = constrain(right, -255, 255);

  ledcWrite(0, left  > 0 ? left  : 0);   // AIN1
  ledcWrite(1, left  < 0 ? -left : 0);   // AIN2
  ledcWrite(2, right > 0 ? right : 0);   // BIN1
  ledcWrite(3, right < 0 ? -right : 0);  // BIN2
}

void brake() {
  for (int i = 0; i < 4; i++) ledcWrite(i, 255);  // cả 4 chân cao = phanh
}`,
    },
    gotchas: [
      'Tần số PWM phải trên 20 kHz. Dưới ngưỡng đó bạn sẽ nghe động cơ rít lên đúng tần số PWM — âm thanh rất khó chịu và lọt cả vào micro.',
      'VM lấy THẲNG từ pin, không qua mạch hạ áp 5 V. Mạch hạ áp chỉ chịu 3 A còn động cơ khởi động rút hơn thế, và nó sẽ tự ngắt bảo vệ giữa chừng.',
      'Bắt buộc có tụ 1000 µF ngay tại chân VM. Không có nó thì mỗi lần khởi động động cơ, điện áp bus sụt xuống dưới ngưỡng và ESP32 khởi động lại — bạn sẽ ngồi debug firmware cả tối trong khi lỗi nằm ở nguồn.',
      'Đất của mạch lái và đất của ESP32 phải nối chung. Quên là tín hiệu điều khiển không có điểm tham chiếu và động cơ chạy loạn.',
    ],
    datasheetUrl: 'https://www.ti.com/lit/ds/symlink/drv8833.pdf',
    sim: 'hbridge',
  },

  pca9685: {
    overview:
      'Mạch phát xung PWM 16 kênh, độ phân giải 12 bit, giao tiếp I2C. Nó lo toàn bộ sáu servo của robot, giải phóng sáu chân GPIO cho ESP32.',
    howItWorks:
      'Bên trong có bộ dao động riêng và 16 bộ đếm độc lập. Bạn gửi qua I2C con số "bật ở nấc bao nhiêu, tắt ở nấc bao nhiêu" cho mỗi kênh, rồi nó tự phát xung mãi mãi mà không cần ESP32 can thiệp nữa.\n\nĐây mới là điểm mấu chốt: xung do PHẦN CỨNG phát nên tuyệt đối đều. Nếu để ESP32 tự phát xung servo bằng phần mềm, mỗi lần ngăn xếp WiFi hay bộ điều khiển I2S xen vào là xung lệch vài chục micro giây — mắt thường thấy rõ cái giật đó, nhất là khi tay robot đang giơ giữa chừng.',
    pinout: [
      { pin: 'VCC', name: 'Nguồn logic', type: 'power', desc: '3,3–5 V cho phần mạch số', to: '3V3' },
      { pin: 'V+', name: 'Nguồn servo', type: 'power', desc: 'Nguồn RIÊNG cấp cho servo, tới 6 V', to: '5 V từ mạch hạ áp' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'SDA', name: 'I2C Data', type: 'io', desc: 'Dùng chung bus với cảm biến', to: 'GPIO8' },
      { pin: 'SCL', name: 'I2C Clock', type: 'in', desc: 'Dùng chung bus', to: 'GPIO18' },
      { pin: 'OE', name: 'Output Enable', type: 'in', desc: 'Mức thấp = bật ngõ ra. Để hở là đã bật', to: '(để hở)' },
      { pin: 'A0–A5', name: 'Chọn địa chỉ', type: 'in', desc: 'Hàn nối để đổi địa chỉ, cho phép gắn nhiều bo', to: '(để nguyên: 0x40)' },
      { pin: '0–15', name: '16 cổng servo', type: 'out', desc: 'Mỗi cổng 3 chân: GND, V+, tín hiệu', to: 'kênh 0–1 cổ, 2–5 tay' },
    ],
    usage:
      'Cắm thẳng servo vào cổng ba chân, đúng chiều màu dây (nâu ra ngoài mép bo). Đặt tần số 50 Hz cho servo chuẩn. Còn dư 10 kênh cho nâng cấp sau — thêm ngón tay, thêm khớp cổ tay, hoặc đèn điều được độ sáng.',
    gotchas: [
      'V+ và VCC là HAI đường nguồn khác nhau. VCC nuôi mạch số (3,3 V từ ESP32 là đủ), V+ nuôi servo (phải là 5 V dòng lớn từ mạch hạ áp). Nối chung là ESP32 reset mỗi lần servo động.',
      'Đừng cắm servo ngược chiều. Dây nâu (đất) phải quay ra phía mép bo — cắm ngược thì servo không chạy và có thể hỏng.',
      'Địa chỉ mặc định 0x40. Nếu bạn có thiết bị I2C khác cùng địa chỉ thì phải hàn nối chân chọn địa chỉ — quét bus bằng đoạn code I2C scanner để kiểm tra trước.',
      'Đặt tần số 50 Hz cho servo. Để mặc định (1000 Hz như PWM đèn LED) thì servo giật liên hồi rồi nóng.',
    ],
    datasheetUrl: 'https://www.nxp.com/docs/en/data-sheet/PCA9685.pdf',
    sim: 'servo',
  },

  // ══════════════════════════════════════════════════════════
  // CẢM BIẾN
  // ══════════════════════════════════════════════════════════
  mpu6050: {
    overview:
      'Cảm biến sáu trục: ba trục gia tốc và ba trục con quay hồi chuyển, trong một con chip 4×4 mm. Cho robot biết nó đang nghiêng bao nhiêu, có bị nhấc lên không, và vừa đâm vào cái gì chưa.',
    howItWorks:
      'Cả hai loại cảm biến đều là kết cấu cơ khí siêu nhỏ khắc trên silicon. Phần đo gia tốc là một khối nhỏ treo trên lò xo silicon: gia tốc làm khối lệch đi, và mạch đo sự thay đổi điện dung giữa khối với các bản cực cố định.\n\nPhần con quay dùng hiệu ứng Coriolis: một kết cấu rung liên tục, khi cả chip bị xoay thì lực Coriolis đẩy kết cấu đó lệch sang ngang một chút, và độ lệch tỉ lệ với tốc độ xoay.\n\nĐiểm quan trọng: gia tốc kế cho biết GÓC NGHIÊNG tuyệt đối (nhờ luôn cảm nhận được trọng lực) nhưng nhiễu; con quay cho biết TỐC ĐỘ XOAY rất mượt nhưng trôi dần theo thời gian. Trộn hai cái lại — bộ lọc bù — thì được góc vừa chính xác vừa mượt.',
    pinout: [
      { pin: 'VCC', name: 'Nguồn', type: 'power', desc: '3,3–5 V (module có ổn áp sẵn)', to: '3V3' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'SDA', name: 'I2C Data', type: 'io', desc: 'Địa chỉ 0x68 (0x69 nếu AD0 kéo cao)', to: 'GPIO8' },
      { pin: 'SCL', name: 'I2C Clock', type: 'in', desc: 'Tới 400 kHz', to: 'GPIO18' },
      { pin: 'INT', name: 'Ngắt', type: 'out', desc: 'Báo có dữ liệu mới hoặc phát hiện chuyển động', to: '(không dùng)' },
      { pin: 'AD0', name: 'Chọn địa chỉ', type: 'in', desc: 'Thấp = 0x68, cao = 0x69', to: 'GND (0x68)' },
      { pin: 'XDA/XCL', name: 'I2C phụ', type: 'io', desc: 'Để nối thêm la bàn từ. Không dùng ở đây', to: '(để trống)' },
    ],
    usage:
      'Dán phẳng trong đầu robot, trục Z hướng lên. Ba việc nó làm trong con robot này:\n\n1. Lệnh "xoay 90 độ" xoay đúng 90 độ — tích phân tốc độ xoay quanh trục Z thay vì đoán bằng thời gian chạy động cơ (cách đoán sai ngay khi pin yếu).\n2. Phát hiện bị nhấc lên: gia tốc tổng khác 1 g rõ rệt → robot biết mình đang lơ lửng và tắt động cơ.\n3. Phát hiện va chạm: gia tốc đột biến → dừng và báo.',
    code: {
      lang: 'cpp',
      caption: 'Đọc góc nghiêng bằng bộ lọc bù giữa gia tốc kế và con quay',
      body: `#include <Adafruit_MPU6050.h>

Adafruit_MPU6050 mpu;
float pitch = 0;
uint32_t lastUs = 0;

void imuSetup() {
  mpu.begin();
  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  lastUs = micros();
}

void imuLoop() {
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);

  uint32_t now = micros();
  float dt = (now - lastUs) / 1e6f;
  lastUs = now;

  // Gia tốc kế: chính xác lâu dài nhưng nhiễu vì mọi rung đều vào
  float accPitch = atan2(a.acceleration.y, a.acceleration.z) * 57.2958f;

  // Con quay: mượt nhưng trôi dần
  float gyroRate = g.gyro.x * 57.2958f;

  // Bộ lọc bù: tin con quay trong ngắn hạn, gia tốc kế trong dài hạn
  pitch = 0.98f * (pitch + gyroRate * dt) + 0.02f * accPitch;
}

bool beingLifted() {
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  float mag = sqrt(a.acceleration.x * a.acceleration.x +
                   a.acceleration.y * a.acceleration.y +
                   a.acceleration.z * a.acceleration.z);
  return fabs(mag - 9.81f) > 3.0f;   // khác trọng lực nhiều = đang bị nhấc
}`,
    },
    gotchas: [
      'Con quay TRÔI. Để yên một chỗ 10 phút, góc tích phân từ con quay có thể lệch vài chục độ. Bắt buộc phải trộn với gia tốc kế, không dùng riêng con quay.',
      'Rung động cơ đi thẳng vào gia tốc kế. Đặt bộ lọc thông thấp (setFilterBandwidth) và dán chip lên một miếng xốp mỏng thay vì bắt vít cứng.',
      'Cần hiệu chuẩn độ lệch không (offset) lúc khởi động: giữ robot đứng yên vài giây, lấy trung bình rồi trừ đi. Bỏ qua bước này thì robot tưởng mình đang nghiêng dù đang đứng thẳng.',
      'Chip này đã ngừng sản xuất từ lâu và hàng trên thị trường phần lớn là hàng nhái. Chúng vẫn chạy nhưng nhiễu hơn thông số công bố — đừng kỳ vọng đúng như datasheet.',
    ],
    datasheetUrl: 'https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf',
  },

  vl53l0x: {
    overview:
      'Cảm biến đo khoảng cách bằng tia laser hồng ngoại, tầm 3 cm đến 2 m. Đây là "mắt tránh vật cản" của robot — khác hoàn toàn với hai màn hình làm mắt biểu cảm.',
    howItWorks:
      'Đo THỜI GIAN BAY: phát một xung laser 940 nm, đếm xem bao lâu thì photon phản xạ quay lại. Ánh sáng đi 1 mm mất khoảng 3,3 pico giây, nên con chip phải đo được khoảng thời gian nhỏ tới mức đó — nó làm được nhờ một mảng cảm biến quang tử đếm từng photon một.\n\nVì đo bằng thời gian chứ không đo cường độ phản xạ, nó gần như không quan tâm vật cản màu gì hay chất liệu gì. Đây chính là chỗ nó ăn đứt cảm biến siêu âm: sóng âm bị vải và mút xốp HÚT gần hết, và bị mặt phẳng nghiêng dội đi hướng khác — nên robot dùng siêu âm sẽ đâm thẳng vào rèm cửa và chân ghế sofa.',
    pinout: [
      { pin: 'VIN', name: 'Nguồn', type: 'power', desc: '3,3–5 V (module có ổn áp)', to: '3V3' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'SDA', name: 'I2C Data', type: 'io', desc: 'Địa chỉ mặc định 0x29', to: 'GPIO8' },
      { pin: 'SCL', name: 'I2C Clock', type: 'in', desc: 'Tới 400 kHz', to: 'GPIO18' },
      { pin: 'GPIO1', name: 'Ngắt', type: 'out', desc: 'Báo có kết quả đo mới', to: '(không dùng)' },
      { pin: 'XSHUT', name: 'Tắt', type: 'in', desc: 'Kéo thấp để tắt. Dùng khi cần nhiều cảm biến cùng bus', to: '(để hở)' },
    ],
    usage:
      'Gắn sau tấm ngực, nhìn ra qua lỗ ⌀8 mm, cách sàn 95 mm — ngang tầm chân bàn ghế. Firmware dừng động cơ khi đọc dưới 120 mm.\n\nBắt buộc lọc trung vị 5 mẫu. Một lần đọc lỗi mà tin ngay là robot phanh gấp giữa phòng trống, và bạn sẽ tưởng phần mềm có bug.',
    code: {
      lang: 'cpp',
      caption: 'Đọc khoảng cách có lọc trung vị chống nhiễu',
      body: `#include <Adafruit_VL53L0X.h>

Adafruit_VL53L0X lox;
uint16_t ring[5] = {2000, 2000, 2000, 2000, 2000};
uint8_t ringIdx = 0;

void tofSetup() {
  if (!lox.begin()) {
    Serial.println("Không thấy VL53L0X — kiểm dây I2C");
  }
}

uint16_t readDistanceMm() {
  VL53L0X_RangingMeasurementData_t m;
  lox.rangingTest(&m, false);

  // Trạng thái 4 = ngoài tầm đo. Coi như "xa" chứ không phải 0 —
  // trả về 0 là robot tưởng có vật ngay trước mặt và phanh gấp.
  uint16_t d = (m.RangeStatus != 4) ? m.RangeMilliMeter : 2000;

  ring[ringIdx++ % 5] = d;

  // Trung vị 5 mẫu: một lần đọc lỗi không kéo được kết quả đi
  uint16_t s[5];
  memcpy(s, ring, sizeof(s));
  for (int i = 0; i < 5; i++)
    for (int j = i + 1; j < 5; j++)
      if (s[j] < s[i]) { uint16_t t = s[i]; s[i] = s[j]; s[j] = t; }
  return s[2];
}`,
    },
    gotchas: [
      'Trạng thái RangeStatus = 4 nghĩa là NGOÀI TẦM, không phải khoảng cách bằng 0. Nhiều người quên kiểm và robot phanh gấp mỗi khi trước mặt trống trải.',
      'Nắng mặt trời trực tiếp chứa rất nhiều hồng ngoại và làm nhiễu nặng, tầm đo tụt còn vài chục cm. Trong nhà thì không sao.',
      'Lỗ nhìn trên vỏ phải đủ rộng (⌀8 mm) và KHÔNG dán kính hay mica lên. Bề mặt trong suốt ngay trước cảm biến gây phản xạ nội bộ và mọi phép đo đều sai.',
      'Muốn dùng nhiều con cùng lúc phải điều khiển chân XSHUT để bật từng con rồi đổi địa chỉ — vì cả ba đều mặc định 0x29.',
    ],
    datasheetUrl: 'https://www.st.com/resource/en/datasheet/vl53l0x.pdf',
    sim: 'tof',
  },

  touch: {
    overview:
      'Cảm biến chạm điện dung: chạm vào là chân ngõ ra lên mức cao. Gắn dưới đỉnh đầu robot để "vuốt đầu" được.',
    howItWorks:
      'Bản đồng trên mạch tạo thành một tụ điện với môi trường xung quanh. Ngón tay người dẫn điện và nối đất qua cơ thể, nên khi lại gần, điện dung tăng lên vài picofarad. Chip đo sự thay đổi đó bằng cách đếm thời gian nạp tụ, và tự hiệu chuẩn lại nền liên tục để chống trôi theo nhiệt độ và độ ẩm.\n\nVì cảm nhận qua điện trường chứ không cần tiếp xúc kim loại, nó xuyên được qua lớp nhựa mỏng — dán mặt sau vỏ vẫn nhạy, không phải khoét lỗ.',
    pinout: [
      { pin: 'VCC', name: 'Nguồn', type: 'power', desc: '2–5,5 V', to: '3V3' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'I/O', name: 'Ngõ ra', type: 'out', desc: 'Mức cao khi có người chạm', to: 'GPIO14' },
      { pin: 'A (jumper)', name: 'Chế độ giữ', type: 'in', desc: 'Hàn nối = giữ trạng thái đến lần chạm sau', to: '(để nguyên)' },
      { pin: 'B (jumper)', name: 'Mức tích cực', type: 'in', desc: 'Hàn nối = đảo ngược mức ngõ ra', to: '(để nguyên)' },
    ],
    usage:
      'Dán mặt sau nắp đầu, không cần khoét lỗ. Firmware coi một lần chạm là tín hiệu "đánh thức" — thay cho từ khoá đánh thức ở bản đầu tiên, vì làm nút bấm dễ hơn nhiều so với nhận dạng giọng nói tại chỗ.',
    gotchas: [
      'Vỏ dày quá 3 mm là độ nhạy tụt hẳn. Nếu phải dày hơn, khoét mỏng vùng ngay trên cảm biến.',
      'Cần khoảng 0,5 giây sau khi cấp nguồn để chip tự hiệu chuẩn nền. Đừng chạm vào trong lúc đó, nếu không nó lấy luôn ngón tay bạn làm mức nền.',
      'Dây dài quá 20 cm nối tới cảm biến sẽ hoạt động như một ăng-ten và sinh ra chạm ma. Đặt cảm biến gần bo, kéo dài dây nguồn chứ đừng kéo dài dây tín hiệu.',
    ],
    datasheetUrl: 'https://www.tontek.com.tw/uploads/product/106/TTP223-BA6_V1.0_EN.pdf',
  },

  irsensor: {
    overview:
      'Cảm biến hồng ngoại phản xạ: một đèn LED hồng ngoại và một transistor quang đặt cạnh nhau. Gắn chúc xuống ở mép trước đế xe để phát hiện vực — không thấy sàn nghĩa là sắp rơi.',
    howItWorks:
      'Đèn LED phát hồng ngoại xuống dưới. Nếu có sàn ở khoảng cách gần (dưới ~15 mm), ánh sáng dội lại và transistor quang dẫn điện. Nếu robot ra tới mép bàn, không còn gì để dội, transistor không dẫn, ngõ ra đổi trạng thái.\n\nCùng nguyên lý đó cũng dùng để dò vạch đen trên nền trắng — vạch đen hấp thụ hồng ngoại nên phản xạ yếu hẳn.',
    pinout: [
      { pin: 'VCC', name: 'Nguồn', type: 'power', desc: '3,3–5 V', to: '3V3' },
      { pin: 'GND', name: 'Đất', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'D0', name: 'Ngõ ra số', type: 'out', desc: 'Cao/thấp theo ngưỡng chỉnh bằng biến trở', to: 'GPIO1 (trái) / GPIO2 (phải)' },
      { pin: 'A0', name: 'Ngõ ra analog', type: 'analog', desc: 'Điện áp tỉ lệ độ phản xạ, dùng khi cần đo mức xám', to: '(không dùng)' },
    ],
    usage:
      'Hai con ở mép trước đế, cách nhau khoảng 8 cm, chúc thẳng xuống và cách sàn 10–15 mm. Firmware dừng ngay khi một trong hai báo mất sàn. Đây là linh kiện 18 nghìn cứu được cả con robot 2,5 triệu khỏi cú rơi từ mép bàn.',
    gotchas: [
      'Phải chỉnh biến trở theo đúng sàn nhà bạn. Sàn gỗ sẫm phản xạ yếu hơn gạch men trắng nhiều — chỉnh ở nhà rồi mang sang nhà khác là phải chỉnh lại.',
      'Nắng chiếu trực tiếp vào cảm biến làm nó luôn báo "có sàn" vì ánh nắng thừa hồng ngoại. Che chắn hoặc chỉ chạy trong nhà.',
      'Khoảng cách tới sàn quan trọng hơn người ta tưởng: xa quá 20 mm là không đọc được sàn tối màu, gần quá 5 mm là vùng nhìn quá hẹp và bỏ sót mép bàn hẹp.',
    ],
    datasheetUrl: 'https://www.vishay.com/docs/83760/tcrt5000.pdf',
  },

  // ══════════════════════════════════════════════════════════
  // NGUỒN
  // ══════════════════════════════════════════════════════════
  cell18650: {
    overview:
      'Pin lithium-ion hình trụ, 18 mm đường kính × 65 mm dài, 3,7 V danh định, 3000 mAh thật. Hai viên nối tiếp cho 7,4 V nuôi toàn bộ robot.',
    howItWorks:
      'Khi xả, ion lithium di chuyển từ cực âm (graphite) sang cực dương (oxit kim loại) qua dung dịch điện phân, đẩy electron chạy vòng ngoài qua mạch. Nạp thì ngược lại.\n\nĐiện áp không phẳng: đầy là 4,2 V, cạn là 3,0 V, và phần lớn dung lượng nằm quanh 3,6–3,7 V. Nghĩa là bus 2S của robot đi từ 8,4 V xuống 6,0 V trong một lần dùng — firmware phải tính tới điều đó khi ước lượng phần trăm pin, và đó cũng là lý do phải có mạch hạ áp cho những thứ cần đúng 5 V.\n\nChỉ số quan trọng thứ hai là DÒNG XẢ. Samsung 30Q xả được 15 A liên tục. Pin dỏm ghi "9900 mAh" thực tế chỉ ra nổi 2–3 A, và khi hai động cơ khởi động cùng lúc thì điện áp sụt mạnh tới mức ESP32 khởi động lại.',
    pinout: [
      { pin: '+', name: 'Cực dương', type: 'power', desc: 'Đầu có núm nhô lên', to: 'nối tiếp sang viên kia / vào BMS' },
      { pin: '−', name: 'Cực âm', type: 'gnd', desc: 'Đầu phẳng, chính là vỏ pin', to: 'BMS B−' },
    ],
    usage:
      'Hai viên nằm ngang sát đáy thân robot — vị trí này chọn có chủ đích: pin là thứ nặng nhất (~90 g), đặt thấp giúp hạ trọng tâm để robot không lật khi phanh gấp. Đi qua mạch bảo vệ BMS 2S trước khi tới bất cứ mạch nào khác.',
    gotchas: [
      'Pin 18650 ghi trên 3500 mAh gần như chắc chắn là hàng giả. Dung lượng thật thường 800–1200 mAh và dòng xả không đủ. Mua hàng có tên tuổi: Samsung, LG, Sony, Molicel.',
      'Xả xuống dưới 2,5 V mỗi viên là hỏng VĨNH VIỄN, không cứu được. Đó là việc của BMS, đừng bỏ qua nó.',
      'Đừng bao giờ hàn trực tiếp lên thân pin bằng mỏ hàn thường. Nhiệt phá hỏng lớp ngăn cách bên trong. Dùng pin có sẵn lá hàn, hoặc hộp đựng có lò xo.',
      'Hai viên nối tiếp phải CÙNG loại, cùng dung lượng, cùng tuổi. Ghép viên cũ với viên mới thì viên yếu bị xả sâu hơn và chết trước.',
    ],
    datasheetUrl: 'https://www.orbtronic.com/content/Samsung-INR18650-30Q-datasheet-rev.pdf',
    sim: 'battery',
  },

  bms: {
    overview:
      'Mạch bảo vệ pin 2S dòng 10 A. Đứng giữa cụm pin và phần còn lại của robot, ngắt mạch khi có gì đó vượt giới hạn an toàn.',
    howItWorks:
      'Theo dõi liên tục bốn thứ: điện áp từng viên, điện áp tổng, dòng điện, và (ở bản có) nhiệt độ. Khi bất kỳ cái nào vượt ngưỡng, nó ngắt một MOSFET công suất nối tiếp với đường xả.\n\nBốn lớp bảo vệ:\n• Quá xả — cắt khi một viên xuống dưới 2,5 V, ngăn hỏng vĩnh viễn\n• Quá nạp — cắt khi một viên lên trên 4,25 V, ngăn phồng và cháy\n• Quá dòng — cắt khi vượt 10 A, ngăn cháy dây\n• Ngắn mạch — cắt trong vài micro giây\n\nBản 2S còn có chức năng CÂN BẰNG: nếu một viên đầy trước, nó xả bớt qua điện trở để viên kia đuổi kịp. Không có cân bằng thì sau vài chục chu kỳ hai viên lệch nhau và dung lượng dùng được tụt hẳn.',
    pinout: [
      { pin: 'B+', name: 'Pin +', type: 'power', desc: 'Cực dương viên trên cùng', to: 'cực + viên 2' },
      { pin: 'BM', name: 'Điểm giữa', type: 'power', desc: 'Nối giữa hai viên — DÙNG ĐỂ CÂN BẰNG', to: 'điểm nối tiếp giữa 2 viên' },
      { pin: 'B−', name: 'Pin −', type: 'gnd', desc: 'Cực âm viên dưới cùng', to: 'cực − viên 1' },
      { pin: 'P+', name: 'Tải +', type: 'power', desc: 'Ngõ ra tới robot (và ngõ vào khi sạc)', to: 'công tắc nguồn → mạch hạ áp + DRV8833' },
      { pin: 'P−', name: 'Tải −', type: 'gnd', desc: 'Đất tới robot', to: 'đất chung' },
    ],
    usage:
      'Dây B+ / BM / B− phải nối ĐÚNG thứ tự, không được nhầm. Nối sai là mạch không cân bằng được và có thể hỏng ngay. Nối xong đo giữa P+ và P− phải thấy khoảng 7,4 V trước khi cắm bất cứ thứ gì vào.',
    gotchas: [
      'Nhầm thứ tự B+ / BM / B− là lỗi phổ biến nhất và có thể làm hỏng mạch ngay lần cấp nguồn đầu tiên. Kiểm bằng đồng hồ trước khi cắm.',
      'BMS bảo vệ pin, KHÔNG phải cầu chì cho robot. Vẫn nên có cầu chì 3 A riêng trên đường ra.',
      'Sau khi BMS cắt vì quá xả, nhiều bản cần cắm sạc mới "thức" lại. Robot đột nhiên không lên nguồn dù pin còn — cắm sạc thử trước khi nghĩ đến hỏng hóc.',
      'Dòng cân bằng rất nhỏ (khoảng 60 mA). Nếu hai viên lệch nhiều, để robot cắm sạc qua đêm cho nó cân bằng lại.',
    ],
  },

  charger: {
    overview:
      'Mạch sạc pin 2S theo chuẩn dòng-không-đổi rồi áp-không-đổi, dòng sạc tới 2 A. Cho phép sạc cả cụm ngay trên robot qua một jack, khỏi tháo pin ra ngoài.',
    howItWorks:
      'Sạc lithium đúng cách có hai giai đoạn. Giai đoạn đầu — dòng không đổi — giữ dòng cố định trong khi điện áp pin từ từ dâng lên; giai đoạn này nạp khoảng 80% dung lượng và nhanh. Khi điện áp chạm 8,4 V (4,2 V mỗi viên), mạch chuyển sang giai đoạn áp không đổi: giữ nguyên 8,4 V và để dòng tự giảm dần. Khi dòng tụt xuống khoảng 1/10 giá trị ban đầu thì coi như đầy và ngắt.\n\nGiai đoạn thứ hai là thứ nhiều mạch rẻ tiền làm sai — chúng cắt luôn ở 8,4 V, khiến pin chỉ nạp được khoảng 85% và bạn tưởng dung lượng pin kém.',
    pinout: [
      { pin: 'IN+', name: 'Nguồn vào +', type: 'power', desc: '9–12 V một chiều. Dùng adapter 12 V/2 A', to: 'jack DC ngoài vỏ' },
      { pin: 'IN−', name: 'Nguồn vào −', type: 'gnd', desc: 'Đất nguồn sạc', to: 'jack DC' },
      { pin: 'BAT+', name: 'Pin +', type: 'power', desc: 'Nối P+ của BMS', to: 'BMS P+' },
      { pin: 'BAT−', name: 'Pin −', type: 'gnd', desc: 'Nối P− của BMS', to: 'BMS P−' },
      { pin: 'LED', name: 'Báo trạng thái', type: 'out', desc: 'Đỏ = đang sạc, xanh = đầy', to: '(trên bo)' },
    ],
    usage:
      'Đặt gần nắp sau để nhìn thấy đèn báo. Sạc qua BMS chứ không nối thẳng vào pin — như vậy bảo vệ quá nạp vẫn có hiệu lực.',
    gotchas: [
      'Cần nguồn vào ÍT NHẤT 9 V. Cắm adapter 5 V thì mạch không đủ áp để nạp cụm 2S và đèn báo sẽ nhấp nháy vô nghĩa.',
      'Mạch nóng lên đáng kể khi sạc 2 A. Chừa khe thoáng, đừng bọc kín trong bọt xốp.',
      'Đừng vừa sạc vừa cho robot chạy. Dòng động cơ làm mạch sạc hiểu nhầm trạng thái pin và có thể không bao giờ chuyển sang giai đoạn hai.',
    ],
  },

  buck: {
    overview:
      'Mạch hạ áp xung từ 7,4 V xuống 5 V, dòng tới 3 A, hiệu suất khoảng 92%. Nuôi servo, mạch khuếch đại loa và vòng LED.',
    howItWorks:
      'Bật/tắt điện áp vào ở tần số cao (khoảng 500 kHz) qua một cuộn cảm. Khi bật, cuộn cảm tích năng lượng vào từ trường; khi tắt, từ trường sụp xuống và đẩy dòng tiếp tục chảy qua tải. Tỉ lệ thời gian bật quyết định điện áp ra.\n\nVì transistor luôn ở trạng thái bật hẳn hoặc tắt hẳn, gần như không có công suất biến thành nhiệt — đó là lý do hiệu suất trên 90%.\n\nSo sánh cụ thể với ổn áp tuyến tính LM7805: nó hoạt động như một điện trở tự điều chỉnh, "đốt" phần điện áp dư thành nhiệt. Hạ 7,4 V xuống 5 V ở dòng 1 A nghĩa là 2,4 W biến thành nhiệt — mất 32% năng lượng pin và con chip nóng tới mức không cầm được.',
    pinout: [
      { pin: 'IN+', name: 'Vào +', type: 'power', desc: '4,5–28 V. Ở đây là 7,4 V từ pin', to: 'sau công tắc nguồn' },
      { pin: 'IN−', name: 'Vào −', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'OUT+', name: 'Ra +', type: 'power', desc: '5 V sau khi chỉnh biến trở', to: 'servo V+, MAX98357A Vin, vòng LED, chân 5V ESP32' },
      { pin: 'OUT−', name: 'Ra −', type: 'gnd', desc: 'Đất chung', to: 'GND' },
      { pin: 'VR', name: 'Biến trở chỉnh', type: 'in', desc: 'Vặn để đặt điện áp ra. PHẢI chỉnh trước khi cắm tải', to: '(vặn bằng tua vít)' },
    ],
    usage:
      'Bước bắt buộc trước tiên: cấp nguồn vào, KHÔNG cắm tải, vặn biến trở đến khi đồng hồ đo được đúng 5,0 V ở ngõ ra. Mạch xuất xưởng thường để sẵn 12 V hoặc một giá trị ngẫu nhiên — cắm thẳng vào là chết cả loạt linh kiện 3,3 V.',
    gotchas: [
      'CHỈNH ĐIỆN ÁP RA TRƯỚC KHI CẮM BẤT CỨ THỨ GÌ. Đây là cách nhanh nhất để giết ESP32, và người ta mắc lỗi này thường xuyên.',
      'Biến trở nhiều vòng — phải vặn khoảng 15–20 vòng mới đi hết dải. Vặn nửa vòng thấy không đổi gì đừng vội kết luận mạch hỏng.',
      'Ghi 3 A nhưng đó là con số lý tưởng có tản nhiệt. Thực tế trên 2 A liên tục là nó nóng rát. Sáu servo cùng khởi động vượt qua ngưỡng đó — thêm tụ 470 µF ở ngõ ra để hấp thụ đỉnh dòng.',
      'Mạch xung sinh nhiễu tần số cao. Đặt xa micro và ăng-ten WiFi, và đừng chạy dây tín hiệu âm thanh song song sát dây nguồn từ nó.',
    ],
  },

  capacitor: {
    overview:
      'Tụ hoá 1000 µF 16 V, cộng vài tụ gốm 100 nF. Đây là linh kiện rẻ nhất trong toàn bộ danh sách và là thứ hay bị bỏ qua nhất — nhưng thiếu nó thì robot không chạy nổi.',
    howItWorks:
      'Tụ điện tích trữ điện tích và nhả ra rất nhanh. Trong mạch nguồn, nó đóng vai một cái bình chứa đặt ngay cạnh nơi tiêu thụ.\n\nVấn đề nó giải quyết: động cơ lúc khởi động rút dòng gấp 5–8 lần lúc chạy đều — gọi là dòng khoá rotor. Pin và dây dẫn đều có điện trở trong, nên cú giật dòng đó kéo tụt điện áp trên cả bus. Nếu tụt xuống dưới ngưỡng phát hiện sụt áp của ESP32 (khoảng 2,8 V ở chân 3,3 V), con chip khởi động lại NGAY GIỮA CÂU ĐANG NÓI.\n\nTụ 1000 µF đặt sát chân nguồn mạch lái động cơ cấp phần dòng đỉnh đó trong vài mili giây đầu, đủ để pin kịp phản ứng. Các tụ gốm 100 nF lo phần nhiễu tần số cao mà tụ hoá quá chậm để xử lý.',
    pinout: [
      { pin: '+', name: 'Cực dương', type: 'power', desc: 'Chân DÀI hơn. Nối vào đường dương', to: 'chân VM của DRV8833' },
      { pin: '−', name: 'Cực âm', type: 'gnd', desc: 'Chân ngắn, phía thân tụ có vạch sọc', to: 'GND' },
    ],
    usage:
      'Vị trí quan trọng hơn giá trị: hàn tụ 1000 µF NGAY TẠI chân VM và GND của mạch lái động cơ, dây càng ngắn càng tốt. Đặt cách 10 cm là điện cảm của đoạn dây đó làm mất phần lớn tác dụng.\n\nThêm một tụ 470 µF ở ngõ ra mạch hạ áp (cho servo) và một tụ gốm 100 nF sát chân nguồn của mỗi mạch số.',
    gotchas: [
      'ĐÂY LÀ LỖI SỐ MỘT CỦA NGƯỜI MỚI LÀM ROBOT. Triệu chứng: ESP32 khởi động lại mỗi khi động cơ bắt đầu quay, hoặc chỉ khi robot xoay tại chỗ. Bạn sẽ ngồi debug firmware cả tối trong khi nguyên nhân nằm ở nguồn.',
      'Tụ hoá CÓ CỰC. Cắm ngược là nó phồng lên rồi nổ, bắn điện phân ra khắp mạch. Chân dài là cực dương; thân tụ có vạch sọc chỉ về phía cực âm.',
      'Điện áp chịu đựng phải cao hơn điện áp thật ít nhất 50%. Bus 8,4 V thì dùng tụ 16 V, đừng dùng tụ 10 V.',
      'Tụ 1000 µF nạp đầy tích khá nhiều năng lượng. Sau khi tắt nguồn, chờ vài giây trước khi chạm tay vào mạch.',
    ],
    sim: 'brownout',
  },

  switch: {
    overview:
      'Công tắc gạt, jack cắm nguồn ngoài, và cầu chì 3 A. Cụm ngắt nguồn cứng của robot.',
    howItWorks:
      'Công tắc gạt cắt vật lý đường dương giữa BMS và phần còn lại. Cầu chì là một đoạn dây kim loại tính toán để nóng chảy trước khi bất cứ thứ gì khác kịp cháy — nó bảo vệ DÂY DẪN, không phải bảo vệ linh kiện.',
    pinout: [
      { pin: 'Chân giữa', name: 'Chung', type: 'power', desc: 'Đường dương từ BMS P+', to: 'BMS P+' },
      { pin: 'Chân bên', name: 'Bật', type: 'power', desc: 'Đi tới mạch hạ áp và mạch lái động cơ', to: 'cầu chì → tải' },
    ],
    usage:
      'Đặt nơi với tới được mà không phải tháo vỏ. Nghe hiển nhiên cho tới lần đầu bạn phải tháo bảy con ốc để rút pin ra vì firmware treo trong vòng lặp vô hạn.',
    gotchas: [
      'Công tắc phải chịu được dòng đỉnh, không phải dòng trung bình. Robot xoay tại chỗ có thể rút 3 A — công tắc ghi 1 A sẽ cháy tiếp điểm và sinh ra chập chờn khó chẩn đoán.',
      'Cầu chì bảo vệ dây, không bảo vệ ESP32. Chip cháy nhanh hơn cầu chì đứt nhiều lần.',
    ],
  },

  // ══════════════════════════════════════════════════════════
  // CƠ KHÍ & DỤNG CỤ
  // ══════════════════════════════════════════════════════════
  chassis: {
    overview:
      'Chín mảnh vỏ in 3D bằng nhựa PLA: thân, nắp sau, tấm ngực, đầu, hai ống mắt, hai cánh tay (mỗi tay hai đốt), hai ốp xích. Tổng kích thước 150 × 205 × 145 mm.',
    howItWorks:
      'In FDM đắp từng lớp nhựa nóng chảy dày 0,2 mm. Hệ quả cần biết khi thiết kế: chi tiết BỀN theo phương ngang lớp nhưng YẾU theo phương vuông góc — nó tách lớp. Vì vậy chi tiết chịu lực phải in sao cho lực tác động nằm trong mặt phẳng lớp.\n\nĐộ dày thành 2,4 mm (6 đường in với đầu phun 0,4 mm) là điểm cân bằng giữa cứng và nhẹ. Mỏng hơn thì vỏ oằn khi cầm; dày hơn chỉ tốn nhựa và thời gian.',
    usage:
      'In ống mắt và giá cổ TRƯỚC — hai mảnh này sai dung sai là hỏng cả bộ. Nhét thử màn hình vào ống, nhét thử servo vào giá. Vừa rồi mới in phần còn lại.\n\nNắp sau bắt bằng bốn vít M3 là cửa bảo trì duy nhất. Đừng dán keo bất cứ mảnh nào cho tới khi robot chạy đúng ít nhất một tuần.',
    gotchas: [
      'PLA bị mềm ở khoảng 60 °C. Để robot trong ô tô đậu ngoài nắng là vỏ biến dạng. Cần chịu nhiệt thì in PETG.',
      'Lỗ in ra luôn nhỏ hơn kích thước thiết kế khoảng 0,2 mm do nhựa co. Thiết kế lỗ vít M3 ở 3,2 mm chứ đừng 3,0 mm.',
      'Chi tiết mỏng và dài (như cẳng tay) nên in dựng đứng để tiết kiệm vật liệu đỡ, nhưng như vậy lại yếu theo phương uốn. Với cánh tay, in nằm và chấp nhận tốn vật liệu đỡ.',
    ],
  },

  paint: {
    overview:
      'Sơn lót bám nhựa, sơn vàng RAL 1023 (vàng giao thông) và sơn xám RAL 7016. Đây là thứ biến một khối nhựa in thành con robot trông ra dáng.',
    howItWorks:
      'PLA có bề mặt năng lượng thấp nên sơn thường không bám. Lớp lót chứa dung môi làm mềm nhẹ bề mặt nhựa để tạo liên kết cơ học, đồng thời lấp các rãnh giữa các lớp in.\n\nMàu vàng RAL 1023 là màu vàng công trường chuẩn — đúng tông của xe cẩu, máy xúc, và WALL-E.',
    usage:
      'Trình tự: chà nhám 400 → thổi sạch bụi → 2 lớp lót mỏng → chà nhám 800 → 2–3 lớp màu mỏng → 1 lớp bóng mờ bảo vệ. Mỗi lớp cách nhau 15 phút, xịt cách 25–30 cm.\n\nSơn khi vỏ còn RỖNG, trước khi lắp linh kiện — sau đó bạn sẽ không dám xịt nữa.',
    gotchas: [
      'Bỏ lớp lót là sơn tróc ra từng mảng ngay lần đầu bạn cầm robot lên.',
      'Xịt dày một lớp thì chảy và đọng vũng. Nhiều lớp mỏng luôn thắng một lớp dày.',
      'Che kỹ mặt kính hai màn hình. Sơn bám vào là hỏng cả cái mắt 135 nghìn, và không lau ra được.',
      'Xịt trong phòng kín là đau đầu và hại phổi. Ra ngoài trời hoặc chỗ thoáng, đeo khẩu trang than hoạt tính.',
    ],
  },

  standoff: {
    overview:
      'Bộ trụ đồng ren M3 các chiều dài, kèm vít và long đền. Dùng để chồng các tầng mạch lên nhau, có khoảng hở và tháo ra được.',
    howItWorks:
      'Trụ đồng có ren trong ở cả hai đầu (hoặc một đầu ren ngoài, một đầu ren trong). Xoáy vào lỗ bắt vít trên mạch, mạch được giữ cách bề mặt một khoảng cố định — đủ để không chạm chập mặt dưới và đủ cho khí lưu thông.',
    usage:
      'Dùng trụ 10 mm giữa các tầng mạch trong thân. Đặt long đền dưới đầu vít để lực ép phân bố đều, tránh nứt mạch.',
    gotchas: [
      'Bắt vít trực tiếp vào nhựa in là cách nhanh nhất để tước ren lỗ ở lần tháo thứ ba. Dùng trụ đồng, hoặc ép ecu đồng vào nhựa bằng mỏ hàn.',
      'Đừng siết quá tay. Mạch in nứt là hỏng đường mạch bên trong mà nhìn ngoài không thấy gì.',
    ],
  },

  breadboard: {
    overview:
      'Bảng cắm thử 830 lỗ kèm bộ dây nối ba loại đầu. Để chạy thử toàn bộ mạch trước khi hàn.',
    howItWorks:
      'Bên dưới là các dải kim loại đàn hồi nối các lỗ theo nhóm: hai hàng ngoài cùng chạy dọc (dùng cho nguồn và đất), phần giữa nối theo cột 5 lỗ và bị chia đôi bởi rãnh giữa — rãnh đó vừa đúng bề ngang một con chip DIP.',
    usage:
      'Chạy thử TOÀN BỘ mạch trên breadboard trước khi in vỏ, trước khi hàn. Đổi một chân GPIO trên breadboard mất 5 giây; đổi sau khi đã hàn và lắp vào vỏ mất một buổi tối và một lần hút thiếc.',
    gotchas: [
      'Breadboard không chịu được dòng lớn. Đừng cho dòng động cơ đi qua nó — nối động cơ trực tiếp, chỉ để tín hiệu điều khiển trên bảng.',
      'Tiếp xúc breadboard chập chờn theo thời gian, nhất là ở các lỗ đã cắm nhiều lần. Lỗi "lúc chạy lúc không" thường là do bảng chứ không phải code.',
      'Dây Dupont dài làm nhiễu SPI ở tốc độ cao. Nếu màn hình hiện sọc trên breadboard nhưng hết sọc sau khi hàn, đó chính là nguyên nhân.',
    ],
  },

  solder: {
    overview:
      'Mỏ hàn chỉnh nhiệt loại T12, thiếc hàn có lõi nhựa thông, và nhựa thông rời. Mua một lần dùng cả đời.',
    howItWorks:
      'Đầu T12 có cảm biến nhiệt gắn ngay trong lõi đầu hàn, nên nhiệt độ được điều chỉnh tại chính điểm tiếp xúc thay vì ở thân mỏ hàn. Kết quả là nhiệt phục hồi rất nhanh sau mỗi mối hàn — điều quyết định khi hàn liên tiếp nhiều chân.\n\nNhựa thông không phải để "dính" mà để LÀM SẠCH: nó khử lớp oxit trên bề mặt kim loại ngay tại thời điểm nóng chảy, cho thiếc bám vào kim loại sạch.',
    usage:
      'Đặt 320–350 °C cho thiếc chì, 360–380 °C cho thiếc không chì. Nguyên tắc: làm nóng CHÂN LINH KIỆN và MẶT ĐỒNG trước, rồi mới đưa thiếc vào — đừng chảy thiếc trên đầu mỏ hàn rồi bôi lên, mối hàn kiểu đó là mối nguội.',
    gotchas: [
      'Mối hàn nguội (xỉn màu, sần) là kiểu lỗi tệ nhất: nó dẫn điện lúc được lúc không, và bạn sẽ đi tìm bug trong phần mềm. Mối hàn tốt phải sáng bóng và có hình nón lõm.',
      'Mỏ hàn 60 nghìn không chỉnh nhiệt hoặc không đủ nóng (mối nguội), hoặc quá nóng (bong lớp đồng khỏi mạch in).',
      'Lau đầu hàn vào bùi nhùi đồng, đừng lau vào bọt biển ướt liên tục — sốc nhiệt làm nứt lớp mạ đầu hàn.',
    ],
  },

  multimeter: {
    overview:
      'Đồng hồ vạn năng số. Khi mạch không chạy, câu hỏi đầu tiên luôn là "chân này có điện không?" — không có đồng hồ thì bạn chỉ đang đoán.',
    howItWorks:
      'Đo điện áp bằng cách mắc SONG SONG với điểm cần đo, với điện trở vào rất lớn (khoảng 10 MΩ) để gần như không lấy dòng từ mạch. Đo dòng bằng cách mắc NỐI TIẾP, tức phải cắt mạch ra và cho dòng chạy qua đồng hồ. Đo thông mạch bằng cách phát một dòng nhỏ và kêu bíp nếu điện trở dưới vài chục ôm.',
    usage:
      'Ba phép đo dùng nhiều nhất trong dự án này:\n\n1. **Trước khi cắm bất cứ gì**: đo ngõ ra mạch hạ áp có đúng 5,0 V không.\n2. **Khi mạch không chạy**: đo thông mạch giữa hai điểm đáng ra phải nối — tìm mối hàn nguội.\n3. **Khi ESP32 reset bất thường**: đo điện áp bus lúc động cơ khởi động; sụt dưới 3 V là thiếu tụ.',
    gotchas: [
      'Đo dòng mà để que ở lỗ "A" rồi vô tình đo điện áp là chập nguồn qua đồng hồ — đứt cầu chì trong đồng hồ, đôi khi hỏng luôn. Sau khi đo dòng, luôn chuyển que về lỗ "V" ngay.',
      'Đo thông mạch phải làm khi mạch KHÔNG có điện. Còn điện thì kết quả vô nghĩa và có thể hỏng đồng hồ.',
      'Đồng hồ rẻ đọc điện áp một chiều khá chính xác nhưng đo dòng và tần số thì rất kém. Đừng tin số đo dòng tới từng miliampe.',
    ],
  },

  tools: {
    overview:
      'Ống co nhiệt, băng keo cách điện, kìm cắt, kìm tuốt dây. Nhóm dụng cụ nhỏ mà thiếu là làm chậm mọi thứ.',
    howItWorks:
      'Ống co nhiệt là nhựa polyolefin được kéo giãn khi sản xuất; gặp nhiệt khoảng 100 °C nó co lại về kích thước gốc, khoảng một nửa đường kính ban đầu, ôm chặt lấy mối nối.',
    usage:
      'Lồng ống co nhiệt vào dây TRƯỚC khi hàn — quên thì phải cắt mối hàn ra làm lại, và ai cũng quên ít nhất một lần. Dùng máy sấy hoặc thân mỏ hàn để làm co, đừng dí đầu mỏ hàn vào.',
    gotchas: [
      'Băng keo cách điện bong ra trong môi trường rung và nóng. Dùng ống co nhiệt cho mọi mối nối bên trong robot; băng keo chỉ để tạm.',
      'Kìm cắt loại rẻ để lại đầu dây sắc nhọn có thể chọc thủng lớp cách điện của dây bên cạnh. Kiểm lại các đầu cắt trước khi nhét bó dây vào thân.',
    ],
  },
};
