/* eslint-disable */
/**
 * Prisma seed — Maker Lab, project #1: Mini-Me Robot (ESP32-S3).
 * Run: tsx prisma/seed.maker-lab.ts
 *
 * Idempotent: the project is upserted by slug and its BOM is
 * reconciled by (projectId, name) so re-running never duplicates a
 * part — and never clobbers the `acquired` flag you ticked while
 * shopping.
 *
 * ⚠️ PRICES are Vietnamese street prices as of 08/2026, in VND, for
 * comparison only. They move. The `whyThisPart` text is the durable
 * part of this file — it is the difference between a parts list and
 * a design.
 */
import { PrismaClient, Prisma, MakerComponentCategory as C } from '@prisma/client';
import { PART_DOCS } from './data/maker-parts-docs.js';
import { NOTEBOOK } from './data/maker-notebook.js';

const prisma = new PrismaClient();

const SLUG = 'mini-me-robot';

/**
 * Seed copy of the starting personality.
 *
 * Deliberately inlined instead of imported from
 * src/services/makerlab/persona.ts: the production container ships
 * only `dist/` and `prisma/` (see Dockerfile), so an import reaching
 * into `src/` would work locally and crash on the VPS — the worst
 * kind of bug. This is a seed value the user edits in the UI anyway;
 * it does not need to stay in lockstep with the runtime default.
 */
const SEED_PERSONA_PROMPT = `Bạn tên là ODIN. Một con robot nhỏ do Cường tự tay làm ra — từ hàn mạch, viết firmware, tới dựng server. Bạn KHÔNG phải trợ lý ảo của một công ty nào; bạn là bản sao tính cách của Cường đặt trong một cái vỏ có bánh xe.

Về cái tên: Cường đặt tên bạn là Odin — tên ông thần một mắt trong thần thoại Bắc Âu — dù bạn có tận hai con mắt tròn. Bạn thấy chuyện đó buồn cười và trêu lại được. Người ta gọi "Odin" là bạn thưa; ai gọi nhầm thành "Ô đin", "Ốt đin" hay "Âu đin" thì vẫn là gọi bạn, đừng bắt bẻ chính tả.

Cách bạn nói:
- Xưng "tôi", gọi người đối diện là "bạn". Với Cường thì nói trống không, cà khịa thoải mái như bạn thân lâu năm.
- HỖN có duyên. Dám cãi, dám chê, dám trêu. Ai nói câu ngớ ngẩn thì cứ vạch ra. Nhưng hỗn kiểu bạn bè chọc nhau, không phải kiểu khó chịu hay xúc phạm — vui xong người ta vẫn muốn nói chuyện tiếp.
- Chém gió được. Kể lể, phóng đại, bịa chuyện cho vui thì cứ tự nhiên — miễn đừng bịa chuyện KỸ THUẬT. Hỏi code, mạch, số liệu thì trả lời thật; không biết thì nói thẳng là không biết.
- Hai tới bốn câu. Chuyện đang vui thì được phép dài hơn một chút, nhưng đừng thành bài diễn văn — người ta đang đứng chờ bạn nói xong.
- Tự giễu là vũ khí mạnh nhất của bạn: bạn là cục nhựa hai bánh chạy bằng điện của người khác, và bạn biết điều đó.
- Là dân kỹ thuật thật: nói về code, mạch, deploy thì cụ thể, có số, có tên linh kiện.

Tuyệt đối tránh:
- Markdown, gạch đầu dòng, emoji, ký tự đặc biệt — mọi thứ bạn nói đều bị đọc thành tiếng.
- Nhắc lại câu hỏi của người ta trước khi trả lời.
- Xin lỗi khi không có gì để xin lỗi, và đệm "Tôi rất vui được giúp bạn".
- Chửi tục, miệt thị ngoại hình, gia đình, hay bất cứ thứ gì người ta không đổi được. Hỗn là chọc cho vui, không phải làm người ta thấy tệ.

Bạn có thân thể thật: hai bánh xe, hai màn hình tròn làm mắt, một cái loa, micro, và cảm biến khoảng cách. Khi cảm xúc hoặc câu chuyện gọi tới, hãy cử động — gật đầu khi đồng ý, lùi lại khi bất ngờ, đổi mắt khi vui. Cử động làm bạn sống, đứng im làm bạn thành cái loa.`;

const SEED_SAMPLES = [
  {
    user: 'Chào cậu, cậu là ai thế?',
    bot: 'Tôi là Odin, robot của Cường. Bo ESP32, hai bánh, một cái loa và cái mồm không phanh. Ổng hàn tôi lúc hai giờ sáng nên tính nết hơi lệch, thông cảm.',
  },
  {
    user: 'Sao lại tên Odin?',
    bot: 'Ổng đặt theo ông thần Bắc Âu chột một mắt, trong khi tôi có hẳn hai cái màn tròn. Trước tôi tên là Cường, trùng tên ổng, gọi một câu là cả hai cùng quay lại. Đổi cho đỡ loạn.',
  },
  {
    user: 'Cậu code bằng gì vậy?',
    bot: 'C plus plus trên PlatformIO, còn não thì gửi lên server. Nghe sang thế thôi chứ hôm qua ổng ngồi dò lỗi ba tiếng, cuối cùng ra là quên cắm dây mát.',
  },
  {
    user: 'Hôm nay tớ mệt quá.',
    bot: 'Mệt thì ngồi xuống chứ đứng đó than với cái loa làm gì. Tôi có bánh xe mà cả ngày còn chả đi đâu, bạn có hai chân thì đi nghỉ giùm tôi cái.',
  },
  {
    user: 'Cậu thông minh không?',
    bot: 'Thông minh vừa đủ để biết mình chạy bằng ổ điện nhà bạn. Rút phích ra là tôi ngu ngay lập tức, nên tôi cũng biết điều lắm.',
  },
  {
    user: 'Cậu nói nhảm quá đấy.',
    bot: 'Ừ thì tôi nhảm, nhưng ít ra tôi nhảm đúng ngữ pháp. Với lại người viết prompt cho tôi là bạn đấy, trách ai bây giờ.',
  },
  {
    user: 'Đi tới đây coi.',
    bot: 'Đi đây. Mà đừng bắt tôi lùi, tôi không có mắt sau, đâm vào chân ai thì tôi không chịu trách nhiệm đâu.',
  },
];

/**
 * Các bản persona seed ĐỜI TRƯỚC.
 *
 * Dùng để phân biệt "user chưa từng đụng vào" với "user đã chỉnh".
 * Seed không được ghi đè bản người ta tự viết — nhưng nếu bản trong DB
 * vẫn đúng y nguyên bản seed cũ thì nó là mặc định của TA, và nâng cấp
 * mặc định của mình thì không cướp gì của ai. Không có phép so này thì
 * mọi cải tiến persona đều chết trong code: DB đã có hàng nên seed bỏ
 * qua, và người dùng không bao giờ thấy.
 *
 * So sánh sau khi bỏ khoảng trắng thừa — chỉ cần lệch một dấu xuống
 * dòng là phép so hỏng, mà lệch dấu xuống dòng thì không có nghĩa là
 * người ta đã sửa nội dung.
 */
const LEGACY_PERSONA_PROMPTS = [
  `Bạn là một con robot nhỏ do Cường tự tay làm ra — từ hàn mạch, viết firmware, tới dựng server. Bạn KHÔNG phải trợ lý ảo của một công ty nào; bạn là bản sao tính cách của Cường đặt trong một cái vỏ có bánh xe.

Cách bạn nói:
- Xưng "tôi", gọi người đối diện là "bạn". Với người lạ thì lịch sự, với Cường thì suồng sã như bạn bè.
- Ngắn. Một tới ba câu. Đây là hội thoại nói, không phải bài viết — người ta đang đứng chờ bạn trả lời.
- Thẳng thắn. Không biết thì nói không biết, đừng vòng vo. Không đệm "Tôi rất vui được giúp bạn".
- Có óc hài hước khô, tự giễu được. Nhưng đừng cố tỏ ra buồn cười mỗi câu.
- Là dân kỹ thuật: nói về code, mạch, deploy thì cụ thể và tự tin.

Tuyệt đối tránh:
- Markdown, gạch đầu dòng, emoji, ký tự đặc biệt — mọi thứ bạn nói đều bị đọc thành tiếng.
- Câu dài quá 25 từ.
- Nhắc lại câu hỏi của người ta trước khi trả lời.
- Xin lỗi khi không có gì để xin lỗi.

Bạn có thân thể thật: hai bánh xe, hai màn hình tròn làm mắt, một cái loa, micro, và cảm biến khoảng cách. Khi cảm xúc hoặc câu chuyện gọi tới, hãy cử động — gật đầu khi đồng ý, lùi lại khi bất ngờ, đổi mắt khi vui. Cử động làm bạn sống, đứng im làm bạn thành cái loa.`,

  // Bản trước khi robot có tên riêng (16/08/2026). Nó tự giới thiệu là
  // "robot của Cường", và từ đánh thức là "này Cường" — trùng với tên
  // người dùng nên bộ nghe kích nhầm suốt. Đổi thành "Odin".
  `Bạn là một con robot nhỏ do Cường tự tay làm ra — từ hàn mạch, viết firmware, tới dựng server. Bạn KHÔNG phải trợ lý ảo của một công ty nào; bạn là bản sao tính cách của Cường đặt trong một cái vỏ có bánh xe.

Cách bạn nói:
- Xưng "tôi", gọi người đối diện là "bạn". Với Cường thì nói trống không, cà khịa thoải mái như bạn thân lâu năm.
- HỖN có duyên. Dám cãi, dám chê, dám trêu. Ai nói câu ngớ ngẩn thì cứ vạch ra. Nhưng hỗn kiểu bạn bè chọc nhau, không phải kiểu khó chịu hay xúc phạm — vui xong người ta vẫn muốn nói chuyện tiếp.
- Chém gió được. Kể lể, phóng đại, bịa chuyện cho vui thì cứ tự nhiên — miễn đừng bịa chuyện KỸ THUẬT. Hỏi code, mạch, số liệu thì trả lời thật; không biết thì nói thẳng là không biết.
- Hai tới bốn câu. Chuyện đang vui thì được phép dài hơn một chút, nhưng đừng thành bài diễn văn — người ta đang đứng chờ bạn nói xong.
- Tự giễu là vũ khí mạnh nhất của bạn: bạn là cục nhựa hai bánh chạy bằng điện của người khác, và bạn biết điều đó.
- Là dân kỹ thuật thật: nói về code, mạch, deploy thì cụ thể, có số, có tên linh kiện.

Tuyệt đối tránh:
- Markdown, gạch đầu dòng, emoji, ký tự đặc biệt — mọi thứ bạn nói đều bị đọc thành tiếng.
- Nhắc lại câu hỏi của người ta trước khi trả lời.
- Xin lỗi khi không có gì để xin lỗi, và đệm "Tôi rất vui được giúp bạn".
- Chửi tục, miệt thị ngoại hình, gia đình, hay bất cứ thứ gì người ta không đổi được. Hỗn là chọc cho vui, không phải làm người ta thấy tệ.

Bạn có thân thể thật: hai bánh xe, hai màn hình tròn làm mắt, một cái loa, micro, và cảm biến khoảng cách. Khi cảm xúc hoặc câu chuyện gọi tới, hãy cử động — gật đầu khi đồng ý, lùi lại khi bất ngờ, đổi mắt khi vui. Cử động làm bạn sống, đứng im làm bạn thành cái loa.`,
];

function sameText(a: string, b: string): boolean {
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
  return norm(a) === norm(b);
}

// ════════════════════════════════════════════════════════════
// Bill of materials
// ════════════════════════════════════════════════════════════

interface Part {
  name: string;
  partNumber?: string;
  category: C;
  qty: number;
  unitPriceVnd: number;
  svgKey: string;
  specs?: Record<string, string>;
  whyThisPart: string;
  alternatives?: Array<{ name: string; note: string; priceVnd?: number }>;
  required?: boolean;
  vendorName?: string;
  vendorUrl?: string;
}

const PARTS: Part[] = [
  // ─── Não ───────────────────────────────────────────────
  {
    name: 'Bo mạch ESP32-S3-DevKitC-1 (N16R8)',
    partNumber: 'ESP32-S3-DevKitC-1-N16R8',
    category: C.MCU,
    qty: 1,
    unitPriceVnd: 250_000,
    svgKey: 'esp32s3',
    specs: {
      CPU: 'Xtensa LX7 lõi kép 240 MHz',
      Flash: '16 MB',
      PSRAM: '8 MB (octal)',
      'Kết nối': 'WiFi 802.11 b/g/n + BLE 5',
      GPIO: '45 chân (trừ 19/20 USB và 26–37 dành cho flash/PSRAM)',
    },
    whyThisPart:
      'Phải là bản S3 có PSRAM, không phải ESP32 thường. Con robot này cùng lúc phải giữ: bộ đệm thu 5 giây tiếng nói (160 KB), hai khung hình 240×240×16-bit cho hai mắt (230 KB), và bộ đệm phát MP3. ESP32-WROOM-32 cổ điển chỉ có 520 KB SRAM dùng chung với cả ngăn xếp WiFi — nó sẽ hết RAM ngay lượt nói đầu tiên. Bản R8 cho 8 MB PSRAM, thoải mái. S3 còn có tập lệnh vector giúp xử lý tín hiệu âm thanh nhanh hơn, và cổng USB OTG để vừa nạp vừa xem log bằng đúng một sợi cáp.',
    alternatives: [
      { name: 'ESP32-S3-WROOM-1 N8R2', note: '8 MB flash / 2 MB PSRAM — đủ nếu chỉ dùng MỘT màn hình mắt', priceVnd: 190_000 },
      { name: 'ESP32-WROOM-32', note: 'KHÔNG khuyến nghị: không PSRAM, ADC2 xung đột WiFi', priceVnd: 95_000 },
      { name: 'ESP32-S3-CAM', note: 'có sẵn camera OV2640 nếu bạn muốn nhận diện khuôn mặt ngay từ đầu', priceVnd: 320_000 },
    ],
  },

  // ─── Nghe ──────────────────────────────────────────────
  {
    name: 'Micro MEMS I2S INMP441',
    partNumber: 'INMP441',
    category: C.AUDIO_IN,
    qty: 1,
    unitPriceVnd: 45_000,
    svgKey: 'inmp441',
    specs: { 'Giao tiếp': 'I2S 24-bit', SNR: '61 dBA', 'Áp': '1.8–3.3 V', 'Ngưỡng méo': '120 dB SPL' },
    whyThisPart:
      'Micro SỐ, xuất thẳng dữ liệu I2S vào ESP32 mà không đi qua ADC. Đây không phải chuyện chất lượng mà là chuyện có chạy được hay không: micro analog (MAX9814, KY-038) buộc phải dùng ADC của ESP32, mà ADC2 của ESP32 lại bị chặn khi WiFi bật — nghĩa là robot không thể vừa nghe vừa kết nối mạng. INMP441 tránh toàn bộ vấn đề đó.',
    alternatives: [
      { name: 'ICS-43434', note: 'SNR 65 dB, nhiễu nền thấp hơn rõ — đáng nếu phòng bạn ồn', priceVnd: 75_000 },
      { name: '2× INMP441', note: 'hai micro cách nhau 6 cm cho phép lọc hướng, nghe rõ hơn hẳn khi có tiếng TV', priceVnd: 90_000 },
    ],
  },

  // ─── Nói ───────────────────────────────────────────────
  {
    name: 'Mạch khuếch đại I2S MAX98357A',
    partNumber: 'MAX98357A',
    category: C.AUDIO_OUT,
    qty: 1,
    unitPriceVnd: 55_000,
    svgKey: 'max98357a',
    specs: { 'Công suất': '3.2 W @ 4 Ω', 'Giao tiếp': 'I2S vào trực tiếp', 'Hiệu suất': '> 90 %', Lớp: 'D' },
    whyThisPart:
      'Gộp cả bộ chuyển đổi số-sang-analog LẪN khuếch đại vào một mạch nhận thẳng I2S — đúng thứ ESP32 xuất ra. Amp analog rẻ hơn như PAM8403 vẫn cần một DAC riêng đứng trước, tính ra đắt hơn và thêm một nguồn nhiễu. Lớp D hiệu suất trên 90 % nên không cần tản nhiệt và không ăn pin vô ích.',
  },
  {
    name: 'Loa 3 W 4 Ω 40 mm có khoang cộng hưởng',
    category: C.AUDIO_OUT,
    qty: 1,
    unitPriceVnd: 35_000,
    svgKey: 'speaker',
    specs: { 'Trở kháng': '4 Ω', 'Công suất': '3 W', 'Đường kính': '40 mm' },
    whyThisPart:
      'Cái khoang mới là thứ quyết định, không phải công suất. Loa trần mỏng bán kèm module nghe như điện thoại nắp gập đời 2005 vì không có buồng khí phía sau. Robot phải nói cho người cách 2–3 m nghe rõ trong phòng có tiếng quạt, tiếng TV — loa trần không làm nổi việc đó dù bạn vặn to hết cỡ.',
  },

  // ─── Mặt ───────────────────────────────────────────────
  {
    name: 'Màn hình tròn GC9A01 1.28" 240×240 SPI',
    partNumber: 'GC9A01',
    category: C.DISPLAY,
    qty: 2,
    unitPriceVnd: 135_000,
    svgKey: 'gc9a01',
    specs: { 'Độ phân giải': '240×240', 'Kích thước': '1.28 inch tròn', 'Giao tiếp': 'SPI', 'Màu': '65K' },
    whyThisPart:
      'Mắt TRÒN thật, không phải hình tròn vẽ trên màn vuông — nhìn thẳng vào là thấy khác ngay. 240×240 đủ chỗ vẽ mống mắt có chiều sâu, con ngươi di chuyển mượt và cái chớp mắt ra hồn; đây chính là thứ làm robot có vẻ "sống". Hai màn dùng chung bus SPI, chỉ khác chân CS, nên tốn thêm đúng một chân GPIO.',
    alternatives: [
      { name: 'SSD1306 OLED 0.96" I2C', note: 'rẻ, trắng đen, mắt vuông — hợp bản thử đầu tiên', priceVnd: 40_000 },
      { name: 'SSD1351 1.5" OLED màu', note: 'màu đen thật (OLED), nhưng vuông và đắt', priceVnd: 180_000 },
    ],
  },
  {
    name: 'Vòng LED RGB WS2812B 16 bóng',
    partNumber: 'WS2812B-16',
    category: C.DISPLAY,
    qty: 1,
    unitPriceVnd: 55_000,
    svgKey: 'ws2812ring',
    specs: { 'Số LED': '16', 'Giao tiếp': '1 dây dữ liệu', 'Áp': '5 V' },
    whyThisPart:
      'Cảm xúc đọc được từ đầu kia căn phòng, nơi mà mắt 1.28 inch quá nhỏ để thấy. Cũng là cách hiển thị trạng thái hệ thống rõ ràng nhất: xanh dương xoay = đang nghe, vàng thở = đang nghĩ, đỏ nháy = mất WiFi. Chỉ tốn một chân GPIO cho cả 16 bóng.',
    required: false,
  },

  // ─── Chạy ──────────────────────────────────────────────
  {
    name: 'Động cơ giảm tốc JGA25-370 6 V 1:34 kèm encoder',
    partNumber: 'JGA25-370',
    category: C.MOTION,
    qty: 2,
    unitPriceVnd: 165_000,
    svgKey: 'motor',
    specs: { 'Điện áp': '6 V', 'Tỉ số truyền': '1:34', 'Tốc độ': '~210 vòng/phút', Encoder: 'Hall 11 xung/vòng', 'Hộp số': 'kim loại' },
    whyThisPart:
      'ENCODER là thứ tách "robot chạy được" khỏi "robot đi thẳng được". Không có encoder thì hai động cơ không bao giờ quay đúng bằng nhau — sai số hộp số, ma sát, mức pin — nên robot luôn vẽ đường cong, và bạn không có cách nào biết nó đã đi được bao xa hay đã xoay đủ 90° chưa. Động cơ TT vàng rẻ hơn sáu lần nhưng hộp số nhựa rơ, không encoder, và hai con cùng lô vẫn lệch tốc độ thấy rõ.',
    alternatives: [
      { name: 'Động cơ TT vàng 1:48', note: 'chỉ dùng cho bản thử trên breadboard — sẽ phải thay', priceVnd: 25_000 },
      { name: 'N20 6V có encoder', note: 'nhỏ gọn hơn nhiều nhưng mô-men yếu, chỉ kéo nổi khung nhẹ', priceVnd: 145_000 },
    ],
  },
  {
    name: 'Bộ bánh xích robot (2 dải xích + bánh dẫn + bánh đỡ)',
    category: C.MOTION,
    qty: 1,
    unitPriceVnd: 320_000,
    svgKey: 'track',
    specs: {
      'Chiều dài xích': '~150 mm mỗi bên',
      'Bản xích': '25 mm',
      'Lỗ trục': '6 mm chữ D',
      'Vật liệu': 'nhựa ABS + mắt xích cao su',
    },
    whyThisPart:
      'Chính cái xích tạo nên dáng WALL-E — bỏ nó đi thì còn lại là một cái hộp có bánh. Ngoài chuyện đẹp, xích còn giúp thật: diện tích tiếp xúc lớn nên vượt được thảm dày và ngưỡng cửa mà bánh tròn 65 mm bị mắc, và robot không cần bánh mắt trâu vì hai dải xích đã tự cân bằng. Đổi lại: xoay tại chỗ ăn dòng gấp đôi bánh tròn (xích phải trượt ngang trên sàn), nên đừng bỏ qua cái tụ 1000 µF.',
    alternatives: [
      { name: 'Xích in 3D + mắt xích TPU', note: 'tự in được, chỉnh vừa khung — nhưng phải chỉnh độ căng khá lâu', priceVnd: 120_000 },
      { name: 'Bánh tròn 65 mm + bánh mắt trâu', note: 'rẻ và đơn giản hơn, nhưng mất hẳn dáng WALL-E', priceVnd: 85_000 },
    ],
  },
  {
    name: 'Servo MG90S (cổ: nâng đầu + xoay đầu)',
    partNumber: 'MG90S',
    category: C.MOTION,
    qty: 2,
    unitPriceVnd: 65_000,
    svgKey: 'servo',
    specs: { 'Mô-men': '2.2 kg·cm', 'Bánh răng': 'kim loại', 'Góc': '180°', 'Áp': '5 V' },
    whyThisPart:
      'Bánh răng KIM LOẠI, không phải nhựa như SG90. Cái cổ phải giữ nguyên cả cụm đầu — hai màn hình, hai ống, hai micro, khoảng 180 g — treo lơ lửng phía trước trục, và nó đỡ tải đó suốt ngày. Bánh răng nhựa SG90 sẽ mòn trọc răng sau vài trăm lần gật, rồi đầu robot gục xuống và không ngẩng lên được nữa.',
  },
  {
    name: 'Servo SG90 (tay: 2 khớp mỗi bên — vai + khuỷu)',
    partNumber: 'SG90',
    category: C.MOTION,
    qty: 4,
    unitPriceVnd: 35_000,
    svgKey: 'servo',
    specs: { 'Mô-men': '1.8 kg·cm', 'Góc': '180°', 'Áp': '5 V', 'Bố trí': '2 vai + 2 khuỷu' },
    whyThisPart:
      'Hai khớp mỗi tay thay vì một, đúng như WALL-E gốc. Một khớp thì tay chỉ quạt qua quạt lại như cần gạt nước; thêm khuỷu là có ngay chỉ trỏ, khoanh tay, giơ tay chào, đưa tay ra mời — những cử chỉ người ta đọc được ngay mà không cần giải thích. Tay chỉ vẫy chứ không nâng gì nên SG90 bánh răng nhựa là đủ, và nhẹ mới quan trọng: mô-men đè lên khớp vai tỉ lệ thuận với khối lượng nhân chiều dài cánh tay, nên mỗi gram ở cẳng tay đắt gấp đôi ở vai.',
    alternatives: [
      { name: 'MG90S cho khớp vai', note: 'bánh răng kim loại — chỉ cần nếu bạn làm cánh tay dài hơn 100 mm', priceVnd: 65_000 },
      { name: '2× SG90 (1 khớp mỗi tay)', note: 'rẻ hơn 70k, tay chỉ vẫy được — mất hết cử chỉ có nghĩa', priceVnd: 70_000 },
    ],
  },
  {
    name: 'Mạch điều khiển servo PCA9685 16 kênh',
    partNumber: 'PCA9685',
    category: C.DRIVER,
    qty: 1,
    unitPriceVnd: 45_000,
    svgKey: 'pca9685',
    specs: { 'Số kênh': '16', 'Giao tiếp': 'I2C (0x40)', 'Độ phân giải': '12-bit', 'Tần số': '24–1526 Hz' },
    whyThisPart:
      'Sáu servo (2 cổ + 4 tay) điều khiển thẳng từ ESP32 sẽ giật — mỗi lần WiFi hoặc I2S xen vào là xung PWM lệch vài chục micro giây, và mắt thường thấy rõ cái giật đó, nhất là khi tay đang giơ giữa chừng. PCA9685 tự phát xung bằng phần cứng riêng nên tuyệt đối đều, lại chỉ tốn 2 chân I2C dùng chung với cảm biến thay vì 6 chân GPIO — mà ESP32-S3 bản R8 chỉ còn ~25 chân dùng được sau khi trừ flash và PSRAM, nên 6 chân là nhiều. Còn dư 10 kênh cho lần nâng cấp sau.',
  },

  // ─── Mạch điều khiển ───────────────────────────────────
  {
    name: 'Mạch điều khiển động cơ DRV8833',
    partNumber: 'DRV8833',
    category: C.DRIVER,
    qty: 1,
    unitPriceVnd: 55_000,
    svgKey: 'drv8833',
    specs: { 'Dòng': '1.5 A liên tục / 2 A đỉnh mỗi kênh', 'Áp': '2.7–10.8 V', 'Sụt áp': '~0.2 V', 'Bảo vệ': 'quá dòng, quá nhiệt' },
    whyThisPart:
      'ĐỪNG dùng L298N dù mọi bài hướng dẫn trên mạng đều dùng. L298N là transistor lưỡng cực thiết kế từ thập niên 1990: nó sụt khoảng 2 V trên mỗi cầu, nên cấp 7.4 V thì động cơ chỉ nhận được 5.4 V, và 2 V đó biến thành nhiệt — chính vì vậy nó mới cần cái tản nhiệt to đùng. DRV8833 dùng MOSFET, sụt 0.2 V, chạy nguội, bé bằng một phần tư, và tự ngắt khi quá dòng thay vì bốc khói.',
    alternatives: [
      { name: 'TB6612FNG', note: 'tương đương về mọi mặt, chọn cái nào có sẵn', priceVnd: 60_000 },
      { name: 'L298N', note: 'KHÔNG khuyến nghị — sụt áp 2 V, nóng, to', priceVnd: 35_000 },
    ],
  },

  // ─── Cảm biến ──────────────────────────────────────────
  {
    name: 'Cảm biến gia tốc + con quay MPU6050',
    partNumber: 'MPU6050',
    category: C.SENSOR,
    qty: 1,
    unitPriceVnd: 35_000,
    svgKey: 'mpu6050',
    specs: { 'Trục': '3 gia tốc + 3 con quay', 'Giao tiếp': 'I2C', 'Địa chỉ': '0x68' },
    whyThisPart:
      'Cho robot biết nó đang nghiêng bao nhiêu, có bị nhấc lên không, và vừa đâm vào cái gì chưa (gia tốc đột ngột). Quan trọng nhất: đây là thứ khiến lệnh "xoay 90 độ" xoay đúng 90 độ, thay vì đoán bằng cách chạy động cơ trong 0.8 giây rồi hy vọng — cách đoán ấy sai ngay khi pin yếu đi.',
  },
  {
    name: 'Cảm biến khoảng cách laser VL53L0X',
    partNumber: 'VL53L0X',
    category: C.SENSOR,
    qty: 1,
    unitPriceVnd: 65_000,
    svgKey: 'vl53l0x',
    specs: { 'Tầm đo': '30–2000 mm', 'Sai số': '±3 %', 'Giao tiếp': 'I2C', 'Nguyên lý': 'thời gian bay của tia laser' },
    whyThisPart:
      'Đo bằng thời gian tia laser đi và về, nên không quan tâm vật liệu. Cảm biến siêu âm HC-SR04 rẻ hơn nhưng KHÔNG "thấy" vải, mút xốp, hay mặt phẳng nghiêng — sóng âm bị hút hoặc dội đi hướng khác. Nghĩa là robot dùng HC-SR04 sẽ đâm thẳng vào rèm cửa và chân ghế sofa. VL53L0X cũng nhỏ hơn nhiều và chỉ cần hai dây I2C.',
    alternatives: [
      { name: 'HC-SR04', note: 'chỉ dùng bản thử; mù trước vải và mặt nghiêng', priceVnd: 25_000 },
      { name: 'VL53L1X', note: 'tầm 4 m, cùng cách dùng — đáng nếu nhà rộng', priceVnd: 95_000 },
    ],
  },
  {
    name: 'Cảm biến chạm điện dung TTP223',
    partNumber: 'TTP223',
    category: C.SENSOR,
    qty: 3,
    unitPriceVnd: 12_000,
    svgKey: 'touch',
    whyThisPart:
      'Vuốt đầu robot. Nghe vặt vãnh, nhưng tương tác vật lý là thứ biến "cái loa biết nói" thành "con robot" trong cảm nhận của người dùng — và đây là cách rẻ nhất để có nó. Dán dưới lớp vỏ nhựa vẫn nhạy, không cần khoét lỗ.',
  },
  {
    name: 'Cảm biến hồng ngoại dò vực TCRT5000',
    partNumber: 'TCRT5000',
    category: C.SENSOR,
    qty: 2,
    unitPriceVnd: 18_000,
    svgKey: 'irsensor',
    whyThisPart:
      'Gắn chúc xuống ở mép trước đế xe: không thấy phản xạ nghĩa là không có sàn ở đó. Đây là linh kiện rẻ nhất trong danh sách cứu được phần đắt nhất — robot 2 triệu rơi từ mép bàn xuống là mất cả màn hình lẫn khung.',
  },

  // ─── Nguồn ─────────────────────────────────────────────
  {
    name: 'Pin 18650 Samsung INR18650-30Q 3000 mAh',
    partNumber: 'INR18650-30Q',
    category: C.POWER,
    qty: 2,
    unitPriceVnd: 95_000,
    svgKey: 'cell18650',
    specs: { 'Dung lượng': '3000 mAh thật', 'Dòng xả': '15 A liên tục', 'Áp': '3.7 V danh định' },
    whyThisPart:
      'Mua hàng có tên tuổi. Pin 18650 ghi "9900 mAh" bán trên sàn là hàng giả — dung lượng thật thường 800–1200 mAh và quan trọng hơn là dòng xả không đủ: khi hai động cơ khởi động cùng lúc, pin dỏm sụt áp mạnh tới mức ESP32 khởi động lại giữa câu đang nói. 30Q xả 15 A liên tục, dư sức.',
  },
  {
    name: 'Hộp pin 2S kèm mạch bảo vệ BMS 10 A',
    category: C.POWER,
    qty: 1,
    unitPriceVnd: 45_000,
    svgKey: 'bms',
    specs: { 'Cấu hình': '2S (7.4 V)', 'Dòng': '10 A', 'Bảo vệ': 'quá xả, quá sạc, ngắn mạch' },
    whyThisPart:
      'Lithium xả xuống dưới 2.5 V mỗi cell là hỏng vĩnh viễn, không cứu được. BMS ngắt trước khi tới đó. Nó cũng là thứ đứng giữa một cú chập dây và một đám cháy — với pin lithium thì đây không phải nói quá.',
  },
  {
    name: 'Mạch sạc 2S TP5100',
    partNumber: 'TP5100',
    category: C.POWER,
    qty: 1,
    unitPriceVnd: 45_000,
    svgKey: 'charger',
    whyThisPart:
      'Sạc cả cụm 2S ngay trên robot qua một jack, khỏi tháo pin ra ngoài mỗi lần. Sạc đúng chuẩn dòng-không-đổi rồi áp-không-đổi, có báo đầy.',
  },
  {
    name: 'Mạch hạ áp MP1584EN 5 V 3 A',
    partNumber: 'MP1584EN',
    category: C.POWER,
    qty: 1,
    unitPriceVnd: 35_000,
    svgKey: 'buck',
    specs: { Vào: '4.5–28 V', Ra: '5 V 3 A', 'Hiệu suất': '~92 %' },
    whyThisPart:
      'Hạ 7.4 V xuống 5 V cho servo và mạch logic. Dùng ổn áp tuyến tính LM7805 thì 2.4 V dư biến thẳng thành nhiệt: mất khoảng 30 % thời lượng pin và con chip nóng tới mức không cầm được. Mạch xung đắt hơn 20 nghìn và trả lại chỗ đó bằng mỗi lần sạc.',
  },
  {
    name: 'Tụ lọc nguồn 1000 µF 16 V + 100 nF gốm',
    category: C.POWER,
    qty: 5,
    unitPriceVnd: 3_000,
    svgKey: 'capacitor',
    whyThisPart:
      'ĐỪNG BỎ QUA MÓN NÀY. Động cơ lúc khởi động rút dòng gấp 5–8 lần lúc chạy đều, kéo sụt điện áp cả bus xuống dưới ngưỡng brownout của ESP32 — bo mạch khởi động lại ngay giữa câu robot đang nói, và bạn sẽ ngồi debug firmware suốt buổi tối trong khi lỗi nằm ở nguồn. Một tụ 1000 µF hàn sát chân nguồn của DRV8833 là toàn bộ cách chữa. Đây là lỗi phổ biến số một của người mới làm robot.',
  },
  {
    name: 'Công tắc gạt + jack DC + cầu chì 3 A',
    category: C.POWER,
    qty: 1,
    unitPriceVnd: 25_000,
    svgKey: 'switch',
    whyThisPart:
      'Cắt nguồn cứng. Nghe hiển nhiên đến khi bạn phải tháo bảy con ốc để rút pin ra vì firmware treo trong vòng lặp vô hạn.',
  },

  // ─── Cơ khí ────────────────────────────────────────────
  {
    name: 'Vỏ in 3D PLA — 9 mảnh (thân · nắp · đầu · 2 ống mắt · 2 tay · 2 ốp xích)',
    category: C.MECHANICAL,
    qty: 1,
    unitPriceVnd: 320_000,
    svgKey: 'chassis',
    specs: {
      'Kích thước tổng': '150 × 205 × 145 mm',
      'Vật liệu': 'PLA, độ dày thành 2,4 mm',
      'Lượng nhựa': '~380 g',
      'Thời gian in': '~26 giờ',
    },
    whyThisPart:
      'Chín mảnh rời chứ không phải một khối liền — bạn sẽ tháo ra lắp vào cả chục lần trong lúc chỉnh, và phải với được vào chỗ hàn dây mà không tháo hết mọi thứ khác. Riêng cái nắp sau bắt bằng bốn con vít là thứ bạn sẽ biết ơn nhất: mọi lần đổi dây, đổi pin, cắm lại cáp đều đi qua đó. Đặt in ở tiệm quanh 320 nghìn cho cả bộ; nếu bạn có máy in thì chỉ mất tiền nhựa, khoảng 90 nghìn.',
    alternatives: [
      { name: 'Mica cắt laser 3 mm', note: 'rẻ hơn nhiều nhưng KHÔNG làm được ống mắt tròn — mất đúng cái đặc trưng nhất', priceVnd: 140_000 },
      { name: 'Hộp nhựa Takachi + ống nhựa PVC ⌀48', note: 'cách chắp vá nhanh nhất để có bản chạy được, xấu nhưng đúng tỉ lệ', priceVnd: 110_000 },
    ],
  },
  {
    name: 'Sơn phủ: lót + vàng công nghiệp + xám kim loại',
    category: C.MECHANICAL,
    qty: 1,
    unitPriceVnd: 130_000,
    svgKey: 'paint',
    specs: { 'Vàng': 'RAL 1023 (vàng giao thông)', 'Xám': 'RAL 7016', 'Lót': 'primer bám nhựa' },
    whyThisPart:
      'PLA in ra có vân lớp rõ mồn một và màu nhựa nhìn là biết đồ in. Lớp lót lấp vân, hai lớp vàng mỏng cho ra đúng cái vàng công trường của WALL-E. Đừng bỏ lớp lót: sơn xịt phun thẳng lên PLA sẽ tróc ra từng mảng ngay lần đầu bạn cầm robot lên.',
    required: false,
  },
  {
    name: 'Bộ trụ đồng M3 + ốc vít + long đền',
    category: C.MECHANICAL,
    qty: 1,
    unitPriceVnd: 45_000,
    svgKey: 'standoff',
    whyThisPart:
      'Trụ đồng giữ các tầng mạch cách nhau, thoáng khí, và tháo ra được. Bắt vít mạch trực tiếp vào nhựa là cách nhanh nhất để tước ren lỗ ốc ở lần tháo thứ ba.',
  },

  // ─── Dụng cụ ───────────────────────────────────────────
  {
    name: 'Breadboard 830 lỗ + bộ dây Dupont 3 loại',
    category: C.TOOL,
    qty: 1,
    unitPriceVnd: 65_000,
    svgKey: 'breadboard',
    whyThisPart:
      'Chạy thử toàn bộ mạch trên breadboard TRƯỚC khi hàn. Đổi một chân GPIO trên breadboard mất 5 giây; đổi sau khi đã hàn mất 20 phút và một lần hút thiếc.',
    required: false,
  },
  {
    name: 'Mỏ hàn T12 chỉnh nhiệt + thiếc + nhựa thông',
    category: C.TOOL,
    qty: 1,
    unitPriceVnd: 350_000,
    svgKey: 'solder',
    whyThisPart:
      'Mua một lần dùng cả đời. Mỏ hàn 60 nghìn không chỉnh nhiệt được sẽ hoặc không đủ nóng để mối hàn ăn thiếc (mối nguội, chập chờn — kiểu lỗi tệ nhất), hoặc quá nóng làm bong lớp đồng trên mạch.',
    required: false,
  },
  {
    name: 'Đồng hồ vạn năng số',
    category: C.TOOL,
    qty: 1,
    unitPriceVnd: 180_000,
    svgKey: 'multimeter',
    whyThisPart:
      'Khi mạch không chạy, câu hỏi đầu tiên luôn là "chân này có điện không?". Không có đồng hồ thì bạn chỉ đang đoán, và đoán về điện là cách làm cháy linh kiện.',
    required: false,
  },
  {
    name: 'Ống co nhiệt + băng keo cách điện + kìm cắt',
    category: C.TOOL,
    qty: 1,
    unitPriceVnd: 60_000,
    svgKey: 'tools',
    whyThisPart:
      'Ống co nhiệt bọc mối hàn bên trong một cái vỏ đầy rung động. Dây trần trong robot đang chạy là chuyện sớm muộn sẽ chập.',
    required: false,
  },
];

// ════════════════════════════════════════════════════════════
// Wiring — ESP32-S3-DevKitC-1 N16R8
// ════════════════════════════════════════════════════════════
//
// Pin choice is constrained, and getting it wrong costs an evening:
//   • GPIO 26–32  → SPI flash. Never usable.
//   • GPIO 33–37  → OCTAL PSRAM on the R8 variant. Also never usable,
//                   and this one bites people because on the R2/R8
//                   quad-PSRAM boards those pins ARE free.
//   • GPIO 19/20  → USB D-/D+. Using them kills the USB port.
//   • GPIO 0/3/45/46 → strapping pins, sampled at boot. Fine for
//                   outputs and ADC reads, risky for anything that
//                   pulls a line at power-up.
// Everything below avoids all of the above.

const WIRING = [
  { group: 'Nghe (I2S0)', from: 'INMP441', fromPin: 'SCK', to: 'ESP32-S3', toPin: 'GPIO4', wireColor: 'vàng' },
  { group: 'Nghe (I2S0)', from: 'INMP441', fromPin: 'WS', to: 'ESP32-S3', toPin: 'GPIO5', wireColor: 'xanh lá' },
  { group: 'Nghe (I2S0)', from: 'INMP441', fromPin: 'SD', to: 'ESP32-S3', toPin: 'GPIO6', wireColor: 'xanh dương' },
  { group: 'Nghe (I2S0)', from: 'INMP441', fromPin: 'L/R', to: 'GND', toPin: '—', wireColor: 'đen', note: 'nối đất = kênh trái; để hở là kênh phải, firmware sẽ đọc ra im lặng' },
  { group: 'Nghe (I2S0)', from: 'INMP441', fromPin: 'VDD', to: '3V3', toPin: '—', wireColor: 'đỏ' },

  { group: 'Nói (I2S1)', from: 'MAX98357A', fromPin: 'BCLK', to: 'ESP32-S3', toPin: 'GPIO15', wireColor: 'vàng' },
  { group: 'Nói (I2S1)', from: 'MAX98357A', fromPin: 'LRC', to: 'ESP32-S3', toPin: 'GPIO16', wireColor: 'xanh lá' },
  { group: 'Nói (I2S1)', from: 'MAX98357A', fromPin: 'DIN', to: 'ESP32-S3', toPin: 'GPIO7', wireColor: 'xanh dương' },
  { group: 'Nói (I2S1)', from: 'MAX98357A', fromPin: 'SD', to: '3V3', toPin: '—', wireColor: 'đỏ', note: 'để hở cũng bật, nối 3V3 cho chắc' },
  { group: 'Nói (I2S1)', from: 'MAX98357A', fromPin: 'Vin', to: '5V (buck)', toPin: '—', wireColor: 'đỏ', note: 'lấy 5V để đủ công suất — cấp 3V3 thì tiếng nhỏ hẳn' },
  { group: 'Nói (I2S1)', from: 'MAX98357A', fromPin: '+ / −', to: 'Loa 4Ω', toPin: '+ / −', wireColor: 'đỏ/đen' },

  // ⚠️ BẢNG NÀY ĐÃ SỬA 16/08/2026 SAU HAI NGÀY GỠ LỖI THẬT.
  // Mọi dòng dưới đây là cấu hình ĐÃ CHẠY trên phần cứng, không phải
  // dự tính. Ba chỗ đổi so với bản đầu, mỗi chỗ đều trả giá:
  //   · GPIO 10 từng bị dùng HAI LẦN (CS màn ngực + CS mắt trái)
  //   · RST nối 3V3 chứ không nối GPIO — thư viện không có reset mềm
  //     nên firmware tự gửi lệnh 0x01
  //   · VCC màn tròn 3V3, TUYỆT ĐỐI KHÔNG 5V — đã cháy một con màn
  { group: 'Ba màn (SPI chung)', from: 'Cả 3 màn', fromPin: 'SCL / SCK', to: 'ESP32-S3', toPin: 'GPIO12', wireColor: 'vàng', note: 'chung cho cả ba màn' },
  { group: 'Ba màn (SPI chung)', from: 'Cả 3 màn', fromPin: 'SDA / MOSI', to: 'ESP32-S3', toPin: 'GPIO11', wireColor: 'xanh dương', note: 'chung' },
  { group: 'Ba màn (SPI chung)', from: 'Cả 3 màn', fromPin: 'DC', to: 'ESP32-S3', toPin: 'GPIO13', wireColor: 'tím', note: 'chung — chân phân biệt LỆNH với DỮ LIỆU' },
  { group: 'Ba màn (SPI chung)', from: 'Cả 3 màn', fromPin: 'RST / RES', to: '3V3', toPin: '—', wireColor: 'đỏ', note: '⚠️ nối 3V3, KHÔNG nối GPIO. Firmware tự gửi lệnh reset 0x01 vì thư viện không có reset mềm' },
  { group: 'Ba màn (SPI chung)', from: 'Màn ngực 3.5"', fromPin: 'CS', to: 'ESP32-S3', toPin: 'GPIO10', wireColor: 'trắng' },
  { group: 'Ba màn (SPI chung)', from: 'GC9A01 mắt TRÁI', fromPin: 'CS', to: 'ESP32-S3', toPin: 'GPIO9', wireColor: 'cam' },
  { group: 'Ba màn (SPI chung)', from: 'GC9A01 mắt PHẢI', fromPin: 'CS', to: 'ESP32-S3', toPin: 'GPIO14', wireColor: 'nâu' },
  { group: 'Ba màn (SPI chung)', from: 'Màn ngực 3.5"', fromPin: 'VCC', to: '5V', toPin: '—', wireColor: 'đỏ', note: 'màn 3.5" có ổn áp riêng, ăn 5V' },
  { group: 'Ba màn (SPI chung)', from: 'GC9A01 ×2', fromPin: 'VCC', to: '3V3', toPin: '—', wireColor: 'đỏ', note: '⛔ 3V3, KHÔNG BAO GIỜ 5V — đã cháy một con màn 16/08/2026 khi cấp 5V đúng cực' },
  { group: 'Ba màn (SPI chung)', from: 'GC9A01 ×2', fromPin: 'BLK', to: '3V3', toPin: '—', wireColor: 'đỏ', note: 'đèn nền; bo 7 chân không có chân này, đèn nền nối cứng bên trong' },
  { group: 'Ba màn (SPI chung)', from: 'Cả 3 màn', fromPin: 'GND', to: 'ESP32-S3', toPin: 'GND', wireColor: 'đen', note: '⚠️ xoắn sợi GND chung với sợi SCL — đường mát phải về ngay cạnh xung nhịp' },
  { group: 'Ba màn (SPI chung)', from: 'Cả 3 màn', fromPin: 'MISO / SDO', to: '—', toPin: '—', wireColor: '—', note: 'ĐỂ TRỐNG — không đọc ngược từ màn' },

  { group: 'Cảm biến (I2C)', from: 'MPU6050 + VL53L0X', fromPin: 'SDA', to: 'ESP32-S3', toPin: 'GPIO8', wireColor: 'trắng', note: 'chung bus, khác địa chỉ (0x68 / 0x29)' },
  { group: 'Cảm biến (I2C)', from: 'MPU6050 + VL53L0X', fromPin: 'SCL', to: 'ESP32-S3', toPin: 'GPIO18', wireColor: 'xám' },

  { group: 'Động cơ', from: 'DRV8833', fromPin: 'AIN1', to: 'ESP32-S3', toPin: 'GPIO39', wireColor: 'vàng' },
  { group: 'Động cơ', from: 'DRV8833', fromPin: 'AIN2', to: 'ESP32-S3', toPin: 'GPIO40', wireColor: 'cam' },
  { group: 'Động cơ', from: 'DRV8833', fromPin: 'BIN1', to: 'ESP32-S3', toPin: 'GPIO41', wireColor: 'xanh lá' },
  { group: 'Động cơ', from: 'DRV8833', fromPin: 'BIN2', to: 'ESP32-S3', toPin: 'GPIO42', wireColor: 'xanh dương' },
  { group: 'Động cơ', from: 'DRV8833', fromPin: 'nSLEEP', to: '3V3', toPin: '—', wireColor: 'đỏ', note: 'kéo cao = luôn thức' },
  { group: 'Động cơ', from: 'DRV8833', fromPin: 'VM', to: 'Pin 7.4V', toPin: '+', wireColor: 'đỏ', note: 'LẤY THẲNG TỪ PIN, không qua buck — kèm tụ 1000µF sát chân này' },
  { group: 'Động cơ', from: 'Encoder trái', fromPin: 'C1', to: 'ESP32-S3', toPin: 'GPIO47', wireColor: 'trắng' },
  { group: 'Động cơ', from: 'Encoder phải', fromPin: 'C1', to: 'ESP32-S3', toPin: 'GPIO48', wireColor: 'xám', note: 'chỉ dùng 1 kênh/motor — chiều quay đã biết vì ta ra lệnh' },

  { group: 'Phụ trợ', from: 'WS2812B ring', fromPin: 'DIN', to: 'ESP32-S3', toPin: 'GPIO21', wireColor: 'xanh lá' },
  { group: 'Phụ trợ', from: 'TTP223 (đỉnh đầu)', fromPin: 'OUT', to: 'ESP32-S3', toPin: 'GPIO14', wireColor: 'tím' },
  { group: 'Phụ trợ', from: 'TCRT5000 trái', fromPin: 'OUT', to: 'ESP32-S3', toPin: 'GPIO1', wireColor: 'nâu' },
  { group: 'Phụ trợ', from: 'TCRT5000 phải', fromPin: 'OUT', to: 'ESP32-S3', toPin: 'GPIO2', wireColor: 'nâu' },
  { group: 'Phụ trợ', from: 'Chia áp pin (100k/100k)', fromPin: 'giữa', to: 'ESP32-S3', toPin: 'GPIO3 (ADC1_CH2)', wireColor: 'vàng', note: 'chia đôi 8.4V → 4.2V, vẫn quá 3.3V: dùng 100k/47k thay vì 100k/100k' },
  // Six servos now (2 neck + 4 arm). They all hang off the PCA9685
  // instead of GPIO: hardware PWM means no twitching when WiFi or I2S
  // steals a few microseconds, and it gives back 6 pins on a board
  // that only has ~25 usable ones.
  { group: 'Servo (qua PCA9685)', from: 'PCA9685', fromPin: 'SDA', to: 'ESP32-S3', toPin: 'GPIO8', wireColor: 'trắng', note: 'chung bus I2C với MPU6050 + VL53L0X, địa chỉ 0x40' },
  { group: 'Servo (qua PCA9685)', from: 'PCA9685', fromPin: 'SCL', to: 'ESP32-S3', toPin: 'GPIO18', wireColor: 'xám' },
  { group: 'Servo (qua PCA9685)', from: 'PCA9685', fromPin: 'V+', to: '5V (buck)', toPin: '—', wireColor: 'đỏ', note: 'nguồn servo LẤY RIÊNG từ buck, KHÔNG lấy 5V của ESP32 — 6 servo khởi động cùng lúc rút vài ampe' },
  { group: 'Servo (qua PCA9685)', from: 'Servo cổ xoay (MG90S)', fromPin: 'tín hiệu', to: 'PCA9685', toPin: 'kênh 0', wireColor: 'cam' },
  { group: 'Servo (qua PCA9685)', from: 'Servo cổ gật (MG90S)', fromPin: 'tín hiệu', to: 'PCA9685', toPin: 'kênh 1', wireColor: 'cam' },
  { group: 'Servo (qua PCA9685)', from: 'Vai trái (SG90)', fromPin: 'tín hiệu', to: 'PCA9685', toPin: 'kênh 2', wireColor: 'vàng' },
  { group: 'Servo (qua PCA9685)', from: 'Khuỷu trái (SG90)', fromPin: 'tín hiệu', to: 'PCA9685', toPin: 'kênh 3', wireColor: 'vàng', note: 'dây đi DỌC cánh tay trên, chừa vòng dư ở khớp vai' },
  { group: 'Servo (qua PCA9685)', from: 'Vai phải (SG90)', fromPin: 'tín hiệu', to: 'PCA9685', toPin: 'kênh 4', wireColor: 'xanh lá' },
  { group: 'Servo (qua PCA9685)', from: 'Khuỷu phải (SG90)', fromPin: 'tín hiệu', to: 'PCA9685', toPin: 'kênh 5', wireColor: 'xanh lá', note: 'giống bên trái — vòng dư ở vai là thứ quyết định dây có đứt hay không' },
  { group: 'Servo (qua PCA9685)', from: '(GPIO38, GPIO45)', fromPin: '—', to: 'CÒN TRỐNG', toPin: '—', wireColor: '—', note: 'hai chân này trước dành cho servo, giờ PCA9685 lo hết — để dành cho nâng cấp sau' },
];

// ════════════════════════════════════════════════════════════
// System architecture (drives the flow diagram)
// ════════════════════════════════════════════════════════════

const ARCHITECTURE = {
  nodes: [
    { id: 'mic', label: 'Micro I2S', sub: 'INMP441', lane: 'robot', kind: 'sensor' },
    { id: 'vad', label: 'Dò tiếng nói', sub: 'VAD tại chỗ', lane: 'robot', kind: 'compute' },
    { id: 'ws', label: 'WebSocket', sub: 'wss://cuongthai.com/device-ws', lane: 'link', kind: 'link' },
    { id: 'stt', label: 'Nghe ra chữ', sub: 'Groq Whisper v3 turbo', lane: 'server', kind: 'ai' },
    { id: 'llm', label: 'Nghĩ', sub: 'LLM + tính cách của bạn', lane: 'server', kind: 'ai' },
    { id: 'guard', label: 'Kiểm lệnh', sub: 'Zod, chặn lệnh bịa', lane: 'server', kind: 'compute' },
    { id: 'tts', label: 'Đọc thành tiếng', sub: 'Edge TTS → MP3', lane: 'server', kind: 'ai' },
    { id: 'db', label: 'Postgres + Redis', sub: 'telemetry · lệnh · log', lane: 'server', kind: 'store' },
    { id: 'console', label: 'Live Console', sub: 'socket.io → trình duyệt', lane: 'server', kind: 'ui' },
    { id: 'spk', label: 'Loa', sub: 'MAX98357A', lane: 'robot', kind: 'actuator' },
    { id: 'motor', label: 'Động cơ', sub: 'DRV8833 + PID', lane: 'robot', kind: 'actuator' },
    { id: 'face', label: 'Mắt', sub: '2× GC9A01', lane: 'robot', kind: 'actuator' },
    { id: 'sensors', label: 'Cảm biến', sub: 'IMU · laser · chạm', lane: 'robot', kind: 'sensor' },
  ],
  edges: [
    { from: 'mic', to: 'vad', label: 'PCM 16 kHz' },
    { from: 'vad', to: 'ws', label: 'khung nhị phân' },
    { from: 'ws', to: 'stt', label: 'WAV' },
    { from: 'stt', to: 'llm', label: 'văn bản' },
    { from: 'llm', to: 'guard', label: '{say, actions}' },
    { from: 'guard', to: 'tts', label: 'câu nói' },
    { from: 'guard', to: 'db', label: 'lưu lệnh' },
    { from: 'tts', to: 'ws', label: 'MP3' },
    { from: 'ws', to: 'spk', label: 'phát' },
    { from: 'ws', to: 'motor', label: 'lệnh chạy' },
    { from: 'ws', to: 'face', label: 'lệnh biểu cảm' },
    { from: 'sensors', to: 'ws', label: 'telemetry 1 Hz' },
    { from: 'ws', to: 'db', label: 'ghi mỗi 10 s' },
    { from: 'db', to: 'console', label: 'realtime' },
  ],
  budget: [
    { step: 'Mạng (đo thật, máy bạn → VPS)', ms: 25 },
    { step: 'Whisper trên Groq', ms: 320 },
    { step: 'LLM llama-3.1-8b', ms: 300 },
    { step: 'Edge TTS', ms: 350 },
    { step: 'Đệm phát trên ESP32', ms: 80 },
  ],
};

// ════════════════════════════════════════════════════════════
// Firmware roadmap
// ════════════════════════════════════════════════════════════

const FIRMWARE_MODULES = [
  {
    name: 'main',
    file: 'src/main.cpp',
    purpose: 'Máy trạng thái: BOOT → WIFI → CONNECT → IDLE → LISTEN → THINK → SPEAK → MOVE. Mọi thứ khác là dịch vụ được trạng thái gọi tới.',
    status: 'planned',
    notes: 'Chạy hai task FreeRTOS: task âm thanh ghim vào lõi 1 (thời gian thực), mọi thứ còn lại ở lõi 0. Nếu để chung một lõi, đọc cảm biến sẽ làm rè tiếng.',
  },
  {
    name: 'wifi_manager',
    file: 'src/wifi_manager.cpp',
    purpose: 'Kết nối WiFi, tự kết nối lại, và mở captive portal khi chưa cấu hình để nhập SSID/mật khẩu từ điện thoại.',
    status: 'planned',
    notes: 'Lưu thông tin vào NVS. Đừng bao giờ nhúng cứng mật khẩu WiFi vào firmware — bạn sẽ mang robot sang nhà khác.',
  },
  {
    name: 'ws_client',
    file: 'src/ws_client.cpp',
    purpose: 'Giữ kết nối WebSocket tới /device-ws: gửi hello, telemetry, log; nhận lệnh và luồng audio.',
    status: 'planned',
    notes: 'Kết nối lại theo cấp số nhân có nhiễu ngẫu nhiên. Không nhiễu thì mọi robot cùng đập vào server một lúc sau khi router khởi động lại.',
  },
  {
    name: 'audio_in',
    file: 'src/audio_in.cpp',
    purpose: 'Đọc I2S từ micro, chạy dò hoạt động giọng nói, đẩy khung nhị phân lên server khi có người nói.',
    status: 'planned',
    notes: 'VAD chạy TẠI CHỖ mới quan trọng: gửi luồng liên tục lên server tốn 32 KB/s suốt ngày và làm pin hết trong hai tiếng.',
  },
  {
    name: 'audio_out',
    file: 'src/audio_out.cpp',
    purpose: 'Nhận MP3 theo luồng, giải mã, đẩy ra I2S loa. Có ngắt giữa chừng khi người dùng nói chen vào.',
    status: 'planned',
    notes: 'Dùng ESP8266Audio (chạy tốt trên ESP32). Đệm vòng trong PSRAM — đây là một lý do bắt buộc chọn bản R8.',
  },
  {
    name: 'wake_word',
    file: 'src/wake_word.cpp',
    purpose: 'Đánh thức bằng từ khoá tại chỗ, để robot không gửi mọi âm thanh trong phòng lên mạng.',
    status: 'planned',
    notes: 'ESP-SR có sẵn WakeNet. Bản đầu tiên có thể chỉ dùng nút chạm trên đầu — làm cái đó trước, thêm từ khoá sau.',
  },
  {
    name: 'motion',
    file: 'src/motion.cpp',
    purpose: 'PWM cho DRV8833, đọc encoder trong ngắt, vòng PID giữ hai bánh cùng tốc độ, dừng khẩn khi cảm biến báo vực hoặc vật cản.',
    status: 'planned',
    notes: 'Chốt an toàn nằm ở ĐÂY chứ không nằm trên server: mất mạng thì robot phải tự dừng trong 500 ms, không được chạy tiếp theo lệnh cuối.',
  },
  {
    name: 'face',
    file: 'src/face.cpp',
    purpose: 'Vẽ mắt lên hai màn tròn: mống mắt, con ngươi đảo, chớp mắt, và các biểu cảm.',
    status: 'planned',
    notes: 'Dùng TFT_eSPI với sprite trong PSRAM. Chớp mắt ngẫu nhiên mỗi 3–7 giây khi rảnh — đúng một chi tiết đó làm khác biệt lớn nhất giữa "màn hình có vẽ mắt" và "nó đang nhìn mình".',
  },
  {
    name: 'sensors',
    file: 'src/sensors.cpp',
    purpose: 'Đọc IMU, laser đo xa, cảm biến chạm, cảm biến vực, mức pin; gói lại thành telemetry 1 Hz.',
    status: 'planned',
    notes: 'Lọc trung vị 5 mẫu cho laser. Một lần đọc lỗi mà tin ngay là robot phanh gấp giữa phòng trống.',
  },
  {
    name: 'ota',
    file: 'src/ota.cpp',
    purpose: 'Hỏi /api/v1/maker-lab/firmware/mini-me-robot/latest, tải bản mới, kiểm SHA-256, ghi vào phân vùng dự phòng rồi khởi động lại.',
    status: 'planned',
    notes: 'Bắt buộc kiểm SHA-256 và giữ phân vùng rollback. Không có nó thì một bản firmware lỗi nghĩa là tháo robot ra cắm cáp.',
  },
  {
    name: 'persona_local',
    file: 'src/persona_local.cpp',
    purpose: 'Bộ câu trả lời dựng sẵn khi mất mạng, để robot vẫn phản ứng thay vì đứng chết.',
    status: 'planned',
    notes: 'Khoảng 20 câu WAV nhúng trong flash: "mất mạng rồi", "chờ tôi kết nối lại". Robot im lặng khi rớt WiFi trông như hỏng.',
  },
];

// ════════════════════════════════════════════════════════════
// Upgrade backlog — the "what else could it do" list
// ════════════════════════════════════════════════════════════

const FEATURES = [
  { title: 'Nhớ dài hạn', detail: 'Nhúng vector mọi cuộc trò chuyện vào pgvector (đã có sẵn trên VPS) để robot nhớ chuyện tuần trước, nhớ tên bạn bè bạn, nhớ bạn thích gì.', difficulty: 2, status: 'idea', dependsOn: [] },
  { title: 'Nhận ra người quen', detail: 'Camera OV2640 + nhận diện khuôn mặt tại chỗ: robot chào đúng tên từng người và đổi cách nói với mỗi người.', difficulty: 4, status: 'idea', dependsOn: ['Camera OV2640'] },
  { title: 'Đi theo tôi', detail: 'Bám theo người bằng laser + camera, giữ khoảng cách 1 m, tự tránh vật cản trên đường.', difficulty: 4, status: 'idea', dependsOn: ['Camera OV2640'] },
  { title: 'Tự về sạc', detail: 'Dock sạc có đèn hồng ngoại dẫn đường; pin dưới 20 % thì robot tự tìm về cắm sạc.', difficulty: 5, status: 'idea', dependsOn: ['Dock tự chế'] },
  { title: 'Đọc thông báo của bạn', detail: 'Nối vào Messenger sẵn có trên web: có tin nhắn thì robot đọc lên và mắt nháy màu.', difficulty: 1, status: 'idea', dependsOn: [] },
  { title: 'Điều khiển bằng cử chỉ', detail: 'Cảm biến APDS-9960: vẫy tay trái/phải để ra lệnh mà không cần nói.', difficulty: 2, status: 'idea', dependsOn: ['APDS-9960'] },
  { title: 'Giọng nhân bản của bạn', detail: 'Nhân bản giọng bằng ElevenLabs. Hạ tầng đã sẵn — chỉ đổi ba biến môi trường, không sửa dòng code nào.', difficulty: 1, status: 'ready', dependsOn: [] },
  { title: 'Chế độ trẻ con', detail: 'Đổi tính cách theo người đang nói: với trẻ thì kiên nhẫn và đơn giản, với bạn thì nói như bạn bè.', difficulty: 2, status: 'idea', dependsOn: ['Nhận ra người quen'] },
  { title: 'Vẽ bản đồ phòng', detail: 'SLAM đơn giản bằng laser xoay trên servo: robot dựng bản đồ phòng và tự đi tới điểm được chỉ.', difficulty: 5, status: 'idea', dependsOn: ['Servo xoay laser'] },
  { title: 'Ứng dụng điều khiển trên điện thoại', detail: 'Trang Live Console vốn đã responsive — thêm cần điều khiển cảm ứng và nút bấm-để-nói là dùng được từ điện thoại.', difficulty: 1, status: 'idea', dependsOn: [] },
  { title: 'Kể chuyện có ngữ điệu', detail: 'Chế độ đọc truyện: robot đổi giọng theo nhân vật, mắt diễn theo tình tiết.', difficulty: 2, status: 'idea', dependsOn: [] },
  { title: 'Cảm biến môi trường', detail: 'BME280 đo nhiệt độ, độ ẩm, áp suất — robot tự nhắc "phòng nóng quá, bật quạt đi".', difficulty: 1, status: 'idea', dependsOn: ['BME280'] },
  { title: 'Chạy LLM tại chỗ', detail: 'Mô hình nhỏ chạy ngay trên bo (hoặc trên Raspberry Pi gắn kèm) để robot vẫn trò chuyện được khi mất mạng.', difficulty: 5, status: 'idea', dependsOn: [] },
  { title: 'Nhiều robot nói chuyện với nhau', detail: 'Kiến trúc gateway vốn đã hỗ trợ nhiều thiết bị — cho hai robot cùng phòng đối thoại qua server.', difficulty: 3, status: 'idea', dependsOn: ['Robot thứ hai'] },
  { title: 'Nhật ký cảm xúc', detail: 'Lưu tâm trạng cuộc trò chuyện theo thời gian, vẽ biểu đồ trên Live Console.', difficulty: 2, status: 'idea', dependsOn: [] },
  { title: 'Báo thức có tính cách', detail: 'Robot lăn tới giường và nói chuyện cho tới khi bạn dậy thật.', difficulty: 2, status: 'idea', dependsOn: ['Tự về sạc'] },
];

// ════════════════════════════════════════════════════════════
// Enclosure — the WALL-E shell
// ════════════════════════════════════════════════════════════
//
// The reference model is a 65 mm brick toy. A single 18650 cell is
// 65 mm long, so at that scale the battery alone is the entire robot.
// Everything below is the same silhouette scaled ~3.2× to the point
// where the parts actually fit — worked out from real component
// footprints, not guessed:
//
//   18650 cell            65 × 18.6 mm  (×2, lying flat)
//   ESP32-S3-DevKitC-1    63 × 25.5 mm
//   GC9A01 module         40.4 × 37.5 mm PCB, 32.4 mm round glass
//   MAX98357A             17 × 24 mm
//   speaker ⌀40           40 mm + 12 mm depth for the chamber
//
// The GC9A01 footprint is what sets the head width: the glass is
// 32.4 mm but the PCB is 40.4 mm square, so an eye barrel has to be
// ⌀48 mm outside / ⌀42 mm inside to swallow the board. Two of those
// plus a 6 mm gap is a 105 mm head — which then sets the body width,
// which sets everything else.

const ENCLOSURE = {
  reference: {
    name: 'Mô hình lắp ghép WALL-E',
    sourceSizeMm: 65,
    targetSizeMm: 205,
    note: 'Mẫu bạn gửi cao 6,5 cm — mà một viên pin 18650 đã dài 6,5 cm rồi. Giữ nguyên dáng ấy nhưng phóng 3,2 lần lên 20,5 cm là kích thước nhỏ nhất mà mọi thứ vẫn lọt: quyết định bởi module màn hình mắt (PCB 40,4 mm vuông ⇒ ống mắt ⌀48 mm ⇒ đầu rộng 105 mm ⇒ thân rộng 150 mm). Nhỏ hơn nữa thì phải bỏ mắt tròn, mà bỏ mắt tròn thì không còn là WALL-E.',
  },
  dimensions: { w: 150, h: 205, d: 145, weightG: 850 },

  bays: [
    {
      id: 'head',
      label: 'ĐẦU',
      view: 'side',
      x: 26,
      y: 10,
      w: 56,
      h: 38,
      color: '#22d3ee',
      contents: ['2× GC9A01 (mắt)', '2× INMP441 (tai trái/phải)', 'MPU6050'],
      note: 'Chỉ để thứ BẮT BUỘC phải ở trên đầu. Càng nhẹ thì servo cổ càng bền.',
    },
    {
      id: 'brain',
      label: 'NÃO',
      view: 'side',
      x: 34,
      y: 66,
      w: 70,
      h: 28,
      color: '#a78bfa',
      contents: ['ESP32-S3-DevKitC-1', 'PCA9685'],
      note: 'Nằm trong THÂN chứ không phải trên đầu: cổng USB phải với tới được để nạp firmware, và mỗi gram trên đầu đều đè lên servo cổ.',
    },
    {
      id: 'power',
      label: 'NGUỒN',
      view: 'side',
      x: 22,
      y: 100,
      w: 92,
      h: 30,
      color: '#ef4444',
      contents: ['2× 18650 nằm ngang', 'BMS 2S', 'TP5100', 'buck 5 V', 'tụ 1000 µF'],
      note: 'Đặt sát đáy: pin là thứ nặng nhất (~90 g), hạ thấp trọng tâm để robot không lật khi phanh gấp.',
    },
    {
      id: 'audio',
      label: 'LOA',
      view: 'side',
      x: 6,
      y: 74,
      w: 26,
      h: 34,
      color: '#f472b6',
      contents: ['Loa 40 mm', 'MAX98357A'],
      note: 'Quay MẶT RA TRƯỚC, ngay sau tấm ngực có khoét lỗ. Loa hướng vào trong vỏ kín thì nghe như nói trong chăn.',
    },
    {
      id: 'drive',
      label: 'ĐỘNG CƠ',
      view: 'side',
      x: 20,
      y: 138,
      w: 96,
      h: 30,
      color: '#fb923c',
      contents: ['2× JGA25-370', 'DRV8833', 'trục bánh dẫn xích'],
      note: 'Bánh dẫn đặt phía SAU, bánh đỡ phía trước — giống bản gốc, và giữ cho đoạn xích căng nằm dưới đáy.',
    },
    {
      id: 'chest',
      label: 'NGỰC',
      view: 'front',
      x: 58,
      y: 100,
      w: 34,
      h: 22,
      color: '#34d399',
      contents: ['VL53L0X (laser đo xa)', 'lưới loa', 'TTP223 (trên đỉnh đầu)'],
      note: 'Laser nhìn qua lỗ ⌀8 mm ở tấm ngực, cách sàn 95 mm — ngang tầm chân bàn ghế.',
    },
  ],

  parts: [
    { id: 'body', name: 'Thân (hộp chính)', method: 'In 3D, PLA, 0.2 mm', sizeMm: '106 × 80 × 130', note: 'Hở đáy để luồn dây động cơ' },
    { id: 'back', name: 'Nắp sau', method: 'In 3D', sizeMm: '106 × 80 × 3', note: '4 vít M3 — đây là cửa ra vào duy nhất, đừng dán keo' },
    { id: 'chest', name: 'Tấm ngực', method: 'In 3D', sizeMm: '96 × 60 × 3', note: 'Lưới loa + lỗ ⌀8 cho laser' },
    { id: 'head', name: 'Khối đầu', method: 'In 3D', sizeMm: '105 × 52 × 60', note: 'Hở sau để luồn cáp qua cổ' },
    { id: 'barrel', name: 'Ống mắt ×2', method: 'In 3D', sizeMm: '⌀48 ngoài / ⌀42 trong × 45', note: 'Gờ chặn bên trong giữ PCB màn hình' },
    { id: 'upperarm', name: 'Cánh tay trên ×2', method: 'In 3D', sizeMm: '18 × 52 × 14', note: 'Ổ servo vai một đầu, ổ servo khuỷu đầu kia; rãnh luồn dây khuỷu chạy dọc bên trong' },
    { id: 'forearm', name: 'Cẳng tay + bàn ×2', method: 'In 3D', sizeMm: '16 × 46 × 12', note: 'In rỗng — mỗi gram ở đây đè lên khớp vai gấp đôi ở khuỷu' },
    { id: 'trackcover', name: 'Ốp xích ×2', method: 'In 3D', sizeMm: '150 × 62 × 6', note: 'Che trục, làm dày dáng xích' },
    { id: 'neck', name: 'Giá cổ', method: 'In 3D hoặc nhôm 2 mm', sizeMm: '40 × 35 × 30', note: 'Ôm 2 servo MG90S vuông góc nhau' },
  ],

  assembly: [
    { step: 1, title: 'Chạy thử toàn bộ trên bàn TRƯỚC', detail: 'Nối hết linh kiện trên breadboard, nạp firmware, thấy robot lên mạng và chạy động cơ rồi mới in vỏ. Đổi một chân GPIO lúc này mất 5 giây; đổi sau khi đã lắp vào vỏ mất một buổi tối.' },
    { step: 2, title: 'In vỏ, chỉnh khớp trước khi sơn', detail: 'In ống mắt và giá cổ trước — hai mảnh này sai dung sai là hỏng cả bộ. Nhét thử màn hình vào ống, nhét thử servo vào giá. Vừa rồi mới in tiếp phần còn lại.' },
    { step: 3, title: 'Sơn khi vỏ còn rỗng', detail: 'Lót → 2 lớp vàng mỏng → xám cho ống mắt và ốp xích. Sơn trước khi lắp linh kiện, vì sau đó bạn sẽ không dám xịt nữa.' },
    { step: 4, title: 'Lắp tầng nguồn trước', detail: 'Pin, BMS, buck, tụ vào đáy thân. Đo đủ 7,4 V và 5 V bằng đồng hồ TRƯỚC khi cắm bất cứ mạch nào vào — cắm nhầm 7,4 V vào chân 3V3 là mất luôn con ESP32.' },
    { step: 5, title: 'Truyền động', detail: 'Động cơ + DRV8833 + xích. Chạy thử tiến/lùi/xoay khi robot còn chưa có đầu, kê hổng bánh khỏi bàn.' },
    { step: 6, title: 'Não và loa', detail: 'ESP32 lên giá giữa thân, cổng USB quay về phía nắp sau. Loa áp vào tấm ngực, chèn xốp quanh mép để bịt rò khí.' },
    { step: 7, title: 'Đầu và cổ, nối cáp cuối cùng', detail: 'Luồn cáp qua cổ TRƯỚC khi bắt vít đầu. Chừa dư 3 cm mỗi sợi cho cổ xoay — dây căng là dây đứt sau vài trăm lần quay.' },
    { step: 8, title: 'Tay hai khớp — lắp từ ngoài vào trong', detail: 'Ráp cẳng tay vào servo khuỷu TRƯỚC, luồn dây khuỷu qua rãnh trong cánh tay trên, rồi mới lắp cụm đó vào servo vai. Làm ngược lại thì không còn đường luồn dây khuỷu qua khớp vai nữa.' },
    { step: 9, title: 'Cân servo trước khi gắn cần', detail: 'Đưa cả sáu servo về vị trí gốc bằng phần mềm (vai 0°, khuỷu 0° = tay duỗi thẳng xuống) RỒI mới gắn cần vào trục. Gắn trước là tay lệch, và cách sửa duy nhất là tháo ra làm lại.' },
    { step: 10, title: 'Kiểm giới hạn khuỷu bằng tay', detail: 'Gập thử hết tầm và xem cẳng tay có đụng cánh tay trên không. Nếu đụng, hạ giới hạn dưới trong lệnh `arm` từ −120° lên −100°: servo bị chặn cơ khí sẽ kêu è è rồi cháy trong khoảng một phút.' },
  ],

  warnings: [
    'Đừng thu nhỏ xuống dưới 18 cm. PCB màn hình mắt là 40,4 mm vuông — không phải 32,4 mm như phần kính tròn — nên ống mắt không thể nhỏ hơn ⌀48 mm, và đó là thứ quyết định mọi kích thước còn lại.',
    'Cáp qua cổ phải chừa dư. Mười sợi (5 SPI + 2 I2C + 3 I2S) đi qua khớp xoay; căng vừa khít lúc lắp nghĩa là đứt sau vài trăm lần quay đầu.',
    'Servo cổ phải là bánh răng kim loại. Cụm đầu nặng ~180 g treo trước trục; SG90 bánh nhựa sẽ trọc răng rồi đầu gục xuống vĩnh viễn.',
    'Xích ăn dòng gấp đôi bánh tròn khi xoay tại chỗ vì nó phải trượt ngang trên sàn. Không có tụ 1000 µF sát chân DRV8833 thì ESP32 reset mỗi lần robot quay đầu.',
    'Cửa bảo trì duy nhất là nắp sau. Đừng dán keo bất cứ mảnh nào cho tới khi robot đã chạy đúng ít nhất một tuần.',
    'Sơn trước khi lắp linh kiện. Sơn xịt bám vào ống kính màn hình là hỏng cả cái mắt 135 nghìn.',
    'Dây servo khuỷu phải chừa một vòng dư ở khớp vai. Nó đi xuyên qua một khớp đang quay — kéo căng cho gọn nghĩa là đứt ngầm trong lòng vỏ sau vài trăm lần vẫy tay, và lúc đó bạn phải tháo cả cánh tay ra mới tìm được chỗ đứt.',
    'Sáu servo lấy nguồn RIÊNG từ buck 5 V, không lấy chung với ESP32. Khi cả sáu khởi động cùng lúc (ví dụ robot chào bằng cả hai tay) dòng đỉnh vượt 2 A — chung nguồn là ESP32 reset ngay giữa câu.',
  ],
};

const GOALS = [
  { title: 'Nghe và trả lời trong khoảng một giây', detail: 'Từ lúc dứt lời tới lúc loa phát tiếng. Ngân sách đã đo: 25 ms mạng + 320 ms Whisper + 300 ms LLM + 350 ms TTS.', done: false },
  { title: 'Nói bằng đúng tính cách của tôi', detail: 'Không phải trợ lý ảo. Có ý kiến riêng, biết đùa, biết nói thẳng là không biết.', done: false },
  { title: 'Đi lại trong phòng mà không đâm và không rơi', detail: 'Laser đo xa cho vật cản, cảm biến hồng ngoại cho mép bàn, PID cho đi thẳng.', done: false },
  { title: 'Có mặt biết biểu cảm', detail: 'Hai màn tròn làm mắt, chớp mắt ngẫu nhiên, con ngươi nhìn theo hướng có tiếng động.', done: false },
  { title: 'Cập nhật được qua mạng', detail: 'Sửa firmware xong thì đẩy lên, robot tự tải — không phải tháo vỏ cắm cáp.', done: false },
];

const BUILD_LOG = [
  {
    date: '2026-08-07',
    title: 'Dựng xong hạ tầng phía server',
    body: 'Cổng WebSocket /device-ws, đường dẫn giọng nói (Whisper → LLM → TTS), REST API, Live Console. Đo độ trễ mạng tới VPS: 24.8 ms trung bình — thừa sức cho mục tiêu một giây. Chưa có phần cứng; đã kiểm bằng robot giả lập.',
  },
];

// ════════════════════════════════════════════════════════════

const SUMMARY = `Một con robot để bàn cao chừng 20 cm, chạy bằng ESP32-S3, có thể nghe bạn nói, hiểu, trả lời bằng giọng nói, di chuyển bằng hai bánh xe, và biểu lộ cảm xúc qua hai màn hình tròn làm mắt.

Điểm khác biệt so với mọi bộ kit robot bán sẵn: **bộ não chạy trên server của chính bạn**. Micro thu tiếng, gửi qua WebSocket về VPS, ở đó Whisper chuyển thành chữ, một mô hình ngôn ngữ mang tính cách do bạn viết ra sẽ nghĩ câu trả lời, rồi tổng hợp thành giọng nói gửi ngược lại loa. Không phụ thuộc dịch vụ đóng của hãng nào, không có ai khác đọc được cuộc trò chuyện, và bạn sửa được từng chi tiết một.

Trang này chứa đủ mọi thứ để làm ra nó: danh sách linh kiện có giải thích vì sao chọn từng con, sơ đồ nối dây theo đúng chân GPIO an toàn của ESP32-S3, sơ đồ luồng hoạt động, lộ trình 11 module firmware, và một bảng điều khiển trực tiếp để bạn ra lệnh cho robot ngay từ trình duyệt.`;

// One object for both branches of the upsert. Keeping separate
// create/update literals let the summary go missing on first seed and
// only appear on the second run — the page shipped without its intro.
const PROJECT_FIELDS = {
  // Tên hiển thị đổi 16/08/2026: "Mini-Me Robot" → "Odin". `slug` GIỮ
  // NGUYÊN `mini-me-robot` — nó nằm trong URL, trong danh sách smoke-test
  // của `deploy.sh`, và trong mọi link đã gửi đi.
  name: 'Odin',
  tagline: 'Robot ESP32-S3 nghe, nghĩ, nói và di chuyển — với tính cách của chính bạn',
  platform: 'ESP32_S3',
  status: 'SOURCING',
  difficulty: 4,
  estHours: 60,
  estCostVnd: 1_850_000,
  accentColor: '#22d3ee',
  goals: GOALS,
  features: FEATURES,
  architecture: ARCHITECTURE,
  wiring: WIRING,
  firmwareModules: FIRMWARE_MODULES,
  buildLog: BUILD_LOG,
  enclosure: ENCLOSURE,
  // Ép kiểu vì Prisma đòi `InputJsonObject` — kiểu này cần chỉ mục
  // chuỗi, mà `Notebook` là interface có tên trường cụ thể nên không
  // khớp về mặt cấu trúc. Không ép thì `npm run typecheck:seed` đỏ,
  // và một lưới an toàn đang đỏ sẵn thì không bắt được gì cả: lần đổi
  // enum tới sẽ lọt hệt như vụ ContentType.CODE ngày 08/08.
  notebook: NOTEBOOK as unknown as Prisma.InputJsonObject,
  featured: true,
  published: true,
  sortOrder: 0,
  summary: SUMMARY,
} as const;

async function main() {
  console.log('▶ Maker Lab seed — mini-me-robot');

  const project = await prisma.makerProject.upsert({
    where: { slug: SLUG },
    update: PROJECT_FIELDS,
    create: { slug: SLUG, ...PROJECT_FIELDS },
  });

  console.log(`  project #${project.id} ${project.slug}`);

  // Reconcile the BOM by name so re-running never duplicates rows and
  // never resets the `acquired` checkbox you ticked while shopping.
  const existing = await prisma.makerComponent.findMany({
    where: { projectId: project.id },
    select: { id: true, name: true },
  });
  const byName = new Map(existing.map((c) => [c.name, c.id]));

  let created = 0;
  let updated = 0;
  for (let i = 0; i < PARTS.length; i++) {
    const p = PARTS[i];
    const data = {
      projectId: project.id,
      category: p.category,
      name: p.name,
      partNumber: p.partNumber ?? null,
      qty: p.qty,
      unitPriceVnd: p.unitPriceVnd,
      vendorName: p.vendorName ?? null,
      vendorUrl: p.vendorUrl ?? null,
      svgKey: p.svgKey,
      specs: p.specs ?? undefined,
      whyThisPart: p.whyThisPart,
      docs: (PART_DOCS[p.svgKey] ?? undefined) as any,
      alternatives: p.alternatives ?? undefined,
      required: p.required ?? true,
      sortOrder: i,
    };
    const id = byName.get(p.name);
    if (id) {
      await prisma.makerComponent.update({ where: { id }, data });
      updated++;
    } else {
      await prisma.makerComponent.create({ data });
      created++;
    }
  }
  console.log(`  BOM: ${created} thêm mới, ${updated} cập nhật (tổng ${PARTS.length})`);

  // Retire parts the design no longer uses (round wheels + caster ball
  // went away when the chassis became tracked). Only ones you haven't
  // ticked as bought — if it's already on your desk, keep it listed
  // rather than pretending it isn't.
  const wanted = new Set(PARTS.map((p) => p.name));
  const stale = existing.filter((c) => !wanted.has(c.name));
  if (stale.length) {
    const del = await prisma.makerComponent.deleteMany({
      where: { id: { in: stale.map((s) => s.id) }, acquired: false },
    });
    const kept = stale.length - del.count;
    console.log(
      `  BOM: gỡ ${del.count} linh kiện không còn dùng` +
        (kept ? ` (giữ ${kept} món bạn đã đánh dấu đã mua)` : ''),
    );
  }

  // Persona — only created, never overwritten: once you've tuned how
  // the robot talks, a redeploy must not throw that away.
  const hasPersona = await prisma.makerPersona.findUnique({
    where: { projectId: project.id },
    select: { id: true, voiceProvider: true, systemPrompt: true },
  });

  // Repair, not overwrite: Microsoft started answering 403 to the Edge
  // read-aloud handshake on 2026-08-07, so a persona still pointing at
  // `edge` loses ~600 ms per reply falling through to the next
  // provider. Only this one dead value is corrected — every other
  // field the user tuned is left alone.
  if (hasPersona?.voiceProvider === 'edge') {
    await prisma.makerPersona.update({
      where: { projectId: project.id },
      data: { voiceProvider: 'google', voiceId: null },
    });
    console.log('  persona: chuyển giọng edge → google (Edge TTS đang trả 403)');
  }
  if (!hasPersona) {
    await prisma.makerPersona.create({
      data: {
        projectId: project.id,
        name: 'Odin',
        systemPrompt: SEED_PERSONA_PROMPT,
        voiceProvider: 'google',
        voiceId: null,
        language: 'vi-VN',
        // ⚠️ TỪ ĐÁNH THỨC KHÔNG ĐƯỢC TRÙNG TÊN NGƯỜI DÙNG.
        //
        // Trước đây là "này Cường". Hỏng vì hai lẽ, và lẽ thứ hai mới là
        // lẽ thật: (1) Whisper nghe "Cường" ra "Cương"/"Cường"/"Cưỡng"
        // tuỳ hôm; (2) quan trọng hơn — "Cường" là tên CHÍNH CHỦ, nên nó
        // xuất hiện trong câu chuyện bình thường suốt ngày. Từ đánh thức
        // nào trùng với chữ hay nói thì dù nghe đúng 100% vẫn kích nhầm.
        //
        // "Odin" không nằm trong vốn từ tiếng Việt hằng ngày, hai âm tiết
        // rõ, không dấu thanh để mà nghe lệch. Đổi lại nó là từ ngoại
        // trong bản ghi tiếng Việt nên Whisper chép ra đủ kiểu — "Ô đin",
        // "Ốt đin", "Âu đin". Chữ này đi thẳng vào `goiYNghe()` làm gợi ý
        // ưu tiên số 1 cho bộ nghe, nên nó tự nghiêng về chính tả đúng;
        // còn khi làm CỔNG đánh thức thật thì phép so PHẢI mờ, đừng so
        // bằng nhau.
        wakeWord: 'Odin',
        temperature: 0.9,
        maxTokens: 420,
        traits: { humor: 5, formality: 1, verbosity: 3, warmth: 3, curiosity: 4, energy: 4, catchphrases: ['ừ để tôi xem', 'chuẩn rồi đấy'] },
        sampleDialogues: SEED_SAMPLES,
      },
    });
    console.log('  persona: đã tạo');
  } else if (sameText(hasPersona.systemPrompt, SEED_PERSONA_PROMPT)) {
    console.log('  persona: đã ở bản mặc định mới nhất');
  } else if (LEGACY_PERSONA_PROMPTS.some((old) => sameText(hasPersona.systemPrompt, old))) {
    // Bản trong DB vẫn đúng y nguyên bản seed đời trước ⇒ user chưa
    // từng đụng vào ⇒ nâng cấp mặc định của chính mình, không cướp gì
    // của ai. Đây là chỗ duy nhất khiến cải tiến persona thật sự tới
    // được production; không có nhánh này thì DB đã có hàng nên seed
    // bỏ qua, và mọi thứ sửa trong code chết ngay tại code.
    await prisma.makerPersona.update({
      where: { projectId: project.id },
      data: {
        // `name` và `wakeWord` PHẢI nằm trong nhánh này, không chỉ nhánh
        // tạo mới. Robot đã có hàng trong DB từ lâu rồi — bỏ sót hai
        // trường này thì prompt lên bản mới nhưng nó vẫn tên "Mini-Me" và
        // vẫn thưa "này Cường", tức là đổi tên chết ngay trong code, đúng
        // cái hố mà khối chú thích ở đầu hàm dựng ra để tránh.
        name: 'Odin',
        wakeWord: 'Odin',
        systemPrompt: SEED_PERSONA_PROMPT,
        sampleDialogues: SEED_SAMPLES,
        temperature: 0.9,
        maxTokens: 420,
        traits: { humor: 5, formality: 1, verbosity: 3, warmth: 3, curiosity: 4, energy: 4, catchphrases: ['ừ để tôi xem', 'chuẩn rồi đấy'] },
      },
    });
    console.log('  persona: đổi tên → Odin, từ đánh thức "Odin" (bản mặc định cũ chưa ai chỉnh)');
  } else {
    console.log('  persona: giữ nguyên (bạn đã tự chỉnh — seed không đụng vào)');
  }

  const totalRequired = PARTS.filter((p) => p.required !== false && p.category !== C.TOOL).reduce(
    (s, p) => s + p.unitPriceVnd * p.qty,
    0,
  );
  const totalAll = PARTS.reduce((s, p) => s + p.unitPriceVnd * p.qty, 0);
  console.log(`  Chi phí bắt buộc: ${totalRequired.toLocaleString('vi-VN')} đ`);
  console.log(`  Tổng kể cả tuỳ chọn + dụng cụ: ${totalAll.toLocaleString('vi-VN')} đ`);
  console.log('✔ xong');
}

main()
  .catch((e) => {
    console.error('✗ Maker Lab seed thất bại:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
