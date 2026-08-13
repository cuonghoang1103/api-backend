#include "audio.h"

#include <driver/i2s.h>

#include "config.h"

namespace audio {

// ─── Trạng thái phát ───────────────────────────────────────
enum PlayState : uint8_t {
  PLAY_IDLE,     // im lặng, DMA đang lặp toàn số 0
  PLAY_FILLING,  // đang nhận byte từ server
  PLAY_DRAINING  // đang đẩy ra loa
};

static PlayState playState = PLAY_IDLE;
static uint8_t* playBuf = nullptr;  // trong PSRAM

/**
 * ĐỆM VÒNG. Hai con trỏ đếm TỔNG số byte từ đầu đoạn, không phải vị
 * trí trong mảng — vị trí thật là `% AUDIO_PLAY_BUF_BYTES`.
 *
 * ⚠️ Trước đây đây là đệm THẲNG: `playLen` chỉ tăng, và phần nằm sau
 * con trỏ đọc không bao giờ được dùng lại. Hậu quả: mọi đoạn tiếng dài
 * quá 512 KB (16 giây) bị cắt cụt, dù robot đã phát xong quá nửa và
 * chỗ trống thì thừa mứa. Người dùng nghe robot nói dở câu rồi im, kèm
 * dòng "đã đọc 512 KB" — vừa hụt hẫng vừa khó hiểu.
 *
 * Với nhạc thì đệm thẳng là bất khả thi luôn: một bài bốn phút là
 * 7,7 MB, gấp mười lăm lần cả vùng đệm.
 */
static uint32_t writePos = 0;  // tổng byte đã nhận
static uint32_t readPos = 0;   // tổng byte đã phát
static uint32_t playRate = 16000;
static uint32_t lastClip = 0;
static bool playOverflow = false;
// Bao nhiêu byte đã bị VỨT vì đệm đầy. Phải đếm và phải BÁO LÊN SERVER:
// bản trước chỉ in ra Serial, nên suốt một buổi đọc log tôi không hề
// thấy nó và đi đuổi ba giả thuyết sai. Một lỗi không nhìn thấy được
// thì không tồn tại — với người sửa nó.
static uint32_t playDroppedBytes = 0;

/**
 * Server đã gửi hết chưa (`say_end`).
 *
 * Cần biết để phân biệt hai tình huống trông giống hệt nhau khi con
 * trỏ đọc đuổi kịp con trỏ ghi: "phát xong cả câu" và "phát nhanh hơn
 * mạng, phải chờ thêm". Nhầm cái thứ hai thành cái thứ nhất là cắt cụt
 * câu nói giữa chừng.
 */
static bool playEnded = false;

/**
 * Số khối trong vòng đệm DMA của loa.
 *
 * Đặt tên thay vì viết 16 ở hai chỗ: đoạn đổ im lặng lúc đói đệm PHẢI
 * ghi đủ cả vòng, nên nó cần đúng con số này. Hai chỗ lệch nhau thì lỗi
 * quay lại y hệt mà nhìn mã vẫn thấy "đã vá rồi".
 */
static constexpr int SPK_DMA_COUNT = 16;

/**
 * Mốc bắt đầu GOM. Nếu gom mãi mà không đủ ngưỡng phát thì phải tự gỡ
 * kẹt — nguồn có thể đã chết giữa chừng (tải nhạc hỏng, mạng đứt), và
 * ngồi đợi vĩnh viễn nghĩa là robot câm cho tới lúc reset.
 */
static uint32_t fillingSince = 0;

// Đếm để BIẾT chứ không đoán: bao nhiêu lần đệm cạn giữa lúc phát, và
// tổng cộng bao lâu. Suốt mấy vòng sửa vừa rồi tôi toàn suy luận xem
// tiếng bị lặp ở đâu; hai con số này trả lời thẳng câu đó.
static uint32_t underruns = 0;
static uint32_t underrunMs = 0;
static uint32_t underrunSince = 0;

/**
 * Phát khi mới nhận được bấy nhiêu byte, KHÔNG đợi nhận đủ cả câu.
 *
 * 40 KB = 1,25 giây tiếng. Đây là chỗ cắt được nhiều thời gian chờ
 * nhất trong cả chuỗi: trước đây robot đợi LLM viết xong, đợi TTS đọc
 * xong, đợi truyền xong rồi mới mở miệng — đo được 4,5 giây từ lúc
 * người ta nói xong. Phát sớm thì nó bắt đầu nói ngay khi có đủ nửa
 * giây đầu, phần sau chảy tới trong lúc đang phát.
 *
 * Vì sao 1,25 giây chứ không phải nửa giây như bản đầu: mạng nhanh
 * hơn loa rất nhiều, nhưng khoảng nghỉ THẬT không nằm ở mạng — nó nằm
 * ở chỗ server phải đọc câu tiếp theo thành tiếng, mất 300-1000 ms.
 * Nửa giây đệm không nuốt nổi khoảng đó, nên loa hụt hơi giữa hai câu.
 * Đổi lại: chờ thêm 0,75 giây trước khi robot mở miệng.
 */
// 40 KB → 64 KB, tức 1,25 giây → 2 giây tiếng gom trước khi mở miệng.
//
// Đo trên bo thật 12/08/2026, sau khi robot chuyển sang đọc bằng máy ở
// nhà qua đường hầm: `hut dem 1 lan / 974 ms` và `/ 1092 ms` — đệm CẠN
// giữa chừng, tức ngược hẳn lỗi tràn đệm hôm qua.
//
// Vì sao đổi: giọng máy nhà sinh tiếng chậm hơn Google trong ngữ cảnh
// phát trực tiếp, không phải vì máy yếu mà vì mỗi mẩu phải nhận việc →
// hỏi lại → truyền qua đường hầm. Bo phát hết mẩu đầu trước khi mẩu sau
// kịp về. Gom 2 giây cho bo thêm 0,75 giây đường lùi — đúng cỡ khoảng
// hụt đo được, cộng với 190 ms cắt được ở nhịp hỏi phía server.
//
// Cái giá: robot mở miệng chậm hơn 0,75 giây. Đó là đánh đổi CÓ CHỦ Ý —
// một khoảng lặng ở đầu câu nghe như "nó đang nghĩ", còn một khoảng lặng
// GIỮA câu nghe như hỏng.
//
// ── 64 KB → 16 KB (12/08/2026, tối) ──
//
// Hai điều kiện khiến đánh đổi trên không còn đúng nữa:
//
// 1. Lý do gom 2 giây là đói đệm giữa câu. Từ khi máy chủ đọc theo LUỒNG
//    (gửi tới đâu sinh tới đó thay vì đợi xong cả mẩu), log của bo cho
//    `hut dem 0 lan / 0 ms` ở MỌI lượt — kể cả một lượt 77 giây. Không
//    còn cái để phòng, mà vẫn trả đủ giá.
//
// 2. Máy chủ giờ phát một tiếng đệm "Ừmmm" (~0,7 giây = 22 KB) ngay khi
//    nghe xong, trong lúc model đang nghĩ. Với ngưỡng 64 KB thì tiếng đó
//    NẰM IM trong đệm chờ câu trả lời thật — tức là thứ sinh ra để lấp
//    khoảng lặng lại bị chính khoảng lặng nuốt mất.
//
// 16 KB = 0,5 giây, nhỏ hơn tiếng đệm nên nó phát được ngay. Và nếu có
// đói thật thì hậu quả cũng đã nhẹ đi: bản vá cùng ngày đổ IM LẶNG đầy
// vòng DMA, nên đói nghe thành một quãng lặng ngắn chứ không còn là
// tiếng lặp chữ.
static const uint32_t PLAY_START_BYTES = 16 * 1024;

/**
 * Âm lượng 10-100%, nhân vào mẫu tiếng trước khi đẩy vào I2S.
 *
 * MAX98357A KHÔNG có chân chỉnh âm lượng — chân GAIN chỉ đặt được bốn
 * mức cố định bằng điện trở, không đổi lúc chạy được. Nên chỉnh phải
 * làm bằng phần mềm, ngay tại đây.
 *
 * Nhân số nguyên rồi dịch bit chứ không dùng số thực: vòng này chạy
 * 16.000 lần mỗi giây, và ESP32-S3 không có bộ tính số thực đủ nhanh
 * để phung phí.
 */
static uint8_t volumePct = 50;   // mặc định 50% — server gửi lại mức đã lưu ngay khi bo nối được

void setVolume(uint8_t pct) {
  if (pct < 10) pct = 10;
  if (pct > 100) pct = 100;
  volumePct = pct;
}

uint8_t volume() { return volumePct; }

static inline int16_t applyVolume(int16_t s) {
  if (volumePct >= 100) return s;
  return (int16_t)(((int32_t)s * volumePct) / 100);
}

// ─── Trạng thái nghe ───────────────────────────────────────
static bool micOpen = false;      // VAD đang trong một lượt nói
static uint32_t micQuietAt = 0;   // mốc bắt đầu im lặng
static uint32_t micTurnAt = 0;    // mốc mở lượt (để chặn lượt quá dài)
static uint32_t micResumeAt = 0;  // trước mốc này thì không nghe
static int32_t micLevel = 0;

/**
 * Nền ồn của phòng, tự học.
 *
 * Ngưỡng CỐ ĐỊNH là sai cách, và số đo trên chính bo này chứng minh:
 * hôm đo lần đầu nền phòng ~1200 nên chọn 2800; đo lại buổi tối thì
 * nền đã lên 700–2600 và robot tự mở lượt nghe suốt dù không ai nói.
 * Cùng căn phòng, cùng con mic — chỉ khác giờ.
 *
 * ⚠️ BẢN TRƯỚC CHỈ HỌC KHI KHÔNG "TO", VÀ ĐÓ LÀ MỘT VÒNG LUẨN QUẨN.
 *
 * "To" nghĩa là vượt ngưỡng, mà ngưỡng lại tính TỪ nền. Nên nếu nền
 * thật của phòng cao hơn 4 lần nền đang lưu, mọi khối đều bị coi là to,
 * không khối nào được dùng để học, và nền đứng nguyên chỗ cũ mãi mãi.
 * Nền chỉ tụt xuống được chứ không leo lên nổi.
 *
 * Đo trên bo thật 11/08, 40 giây liền, có nhạc bật trong phòng:
 *
 *     nen=1400  nguong=5600   (cả hai đứng im, đúng giá trị khởi tạo)
 *     mic = 61.000 … 940.000  (gấp 11 tới 168 lần ngưỡng, không nghỉ)
 *
 * Tức là VAD mở toang suốt. Robot mở lượt nghe liên tục vào tiếng ồn,
 * nên lúc người ta nói thật thì nó đang bận nghĩ hoặc đang nói dở một
 * lượt rác — và mic thì câm trong lúc loa chạy. Người dùng thấy đúng
 * như vậy: "lúc nghe được lúc không, nói đi nói lại nó vẫn không đáp".
 *
 * Cách sửa: bám nền theo kiểu KHÔNG ĐỐI XỨNG và KHÔNG hỏi "có to
 * không" nữa — xuống thì nhanh, lên thì chậm. Tiếng nói là những cụm
 * ngắn nên nó gần như không kéo nền lên được; tiếng ồn kéo dài thì có.
 * Không còn vòng luẩn quẩn vì phép học không phụ thuộc vào ngưỡng nữa.
 */
static int32_t noiseFloor = VAD_THRESHOLD / 2;

/**
 * Đã đo nền lúc khởi động chưa.
 *
 * Bám dần từ 1400 lên 250.000 mất khoảng hai chục giây — hai chục giây
 * robot điếc hoặc mở lượt loạn xạ ngay sau khi bật. Nên giây đầu tiên
 * dành riêng để ĐO: chưa nghe ai cả, chỉ ghi lại xem phòng này ồn cỡ
 * nào, rồi mới bắt đầu làm việc.
 */
static uint16_t calibBlocks = 0;
static int64_t calibSum = 0;
static const uint16_t CALIB_BLOCKS = 60;   // 60 × 16 ms ≈ 1 giây

static int32_t vadGate() {
  int32_t gate = noiseFloor * VAD_GATE_MULT;
  if (gate < VAD_THRESHOLD) gate = VAD_THRESHOLD;

  // ⚠️ Trần CŨ là `VAD_THRESHOLD * 6` = 16.800, một con số tuyệt đối.
  //
  // Ý định thì đúng — đừng để tiếng quạt kéo ngưỡng cao đến mức điếc —
  // nhưng một trần tuyệt đối lại hỏng đúng theo chiều ngược lại, và
  // hỏng nặng hơn: phòng nào ồn hơn 16.800 thì ngưỡng bị ghim dưới nền,
  // VAD mở vĩnh viễn, robot nghe tiếng ồn cả ngày. Đo được 940.000
  // trong phòng có nhạc — gấp 56 lần cái trần đó.
  //
  // Trần mới tính theo TOÀN THANG (mic 24 bit ⇒ 8.388.608), không theo
  // một ngưỡng đoán từ trước. Vượt một phần tư toàn thang thì không còn
  // là "nền phòng" nữa, đó là ai đó đang hét vào mic.
  const int32_t TRAN = 8388608 / 4;
  if (gate > TRAN) gate = TRAN;
  return gate;
}

/**
 * Đếm số khối to LIÊN TIẾP — phải đủ dài mới mở lượt nghe.
 *
 * Đây là thứ phân biệt tiếng nói với tiếng phòng, và nó quan trọng hơn
 * cả cái ngưỡng. Đo trên server ngày 10/08: chỉ dựa vào biên độ thì
 * robot mở 30 lượt mỗi phút — tiếng gõ bàn, đóng cửa, ho, xe ngoài
 * đường, cái nào cũng vượt ngưỡng trong một hai khối rồi tắt. Mỗi lượt
 * như vậy là một lần gọi Whisper tốn tiền, và Whisper nghe tiếng ồn
 * thì bịa ra phụ đề YouTube.
 *
 * Tiếng nói thì khác: một âm tiết tiếng Việt đã dài hơn 100 ms. Bắt
 * phải to liên tục 128 ms mới mở lượt là loại sạch tiếng thoáng qua
 * mà không cắt mất chữ nào — phần âm đầu vẫn nằm nguyên trong đệm
 * trước, nên chữ đầu tiên không mất.
 */
static uint8_t loudRun = 0;

/** Cờ "mở lượt ngay lượt sau", do chạm đầu bật lên. Xem chỗ dùng ở
 *  hàm nghe — nó bỏ qua ngưỡng VAD đúng một lần rồi tự tắt. */
static volatile bool epMoLuot = false;

// Chẩn đoán mic — xem chỗ tính ở pumpMic().
static int32_t micDc = 0;
static int32_t micTho = 0;
static int32_t micPeak = 0;
static uint32_t micClipBlocks = 0;
// Số mẫu bị XÉN khi đóng gói 16 bit. Tiếng xén thì Whisper đoán bừa.
static uint32_t xenSamples = 0;

/**
 * Lọc bỏ tiếng ầm hạ tần, hai tầng, cắt quanh 160 Hz.
 *
 * ── Vì sao cần ──
 *
 * Đo trên bo thật 11/08, phòng đã tắt nhạc và ngồi im. Byte thô cho
 * thấy mic gửi hoàn toàn chuẩn (8 bit thấp luôn 00 = đúng khuôn
 * 24-trong-32), nhưng nội dung thì:
 *
 *     e759da00 e76e8000 e7884a00 e78ee800
 *
 * Bốn mẫu liền nhau chỉ lệch nhau ~1%, và qua 192 mẫu (12 ms) giá trị
 * bò từ -1.606.182 lên -915.884. Mượt, liên tục, biên độ ±1,6 triệu
 * trên toàn thang 8,4 triệu. Đó là một tín hiệu cỡ 20 Hz.
 *
 * Con số vạch mặt nó là `dc`: trung bình CÓ DẤU bằng đúng trung bình
 * TRỊ TUYỆT ĐỐI, tức cả 256 mẫu trong khối cùng một dấu — tín hiệu
 * không cắt qua vạch 0 lấy một lần trong 16 ms. Âm thanh thật thì cắt
 * qua 0 hàng trăm lần; kể cả tiếng trầm 100 Hz cũng cắt ba lần.
 *
 * Nguồn của nó là quạt, điều hoà, rung mặt bàn, gợn nguồn — thứ tai
 * người gần như không nghe, mà mic MEMS thì nghe rất rõ. VAD đo tổng
 * năng lượng nên nó đếm cả đống ầm đó là "có người đang nói".
 *
 * ── Vì sao HAI tầng ──
 *
 * Một tầng cắt 160 Hz chỉ ghìm tín hiệu 20 Hz xuống còn 13% — vẫn dư
 * sức vượt ngưỡng. Hai tầng nối tiếp cho 1,7%, đưa 1,6 triệu về ~28
 * nghìn. Còn tiếng nói ở 500 Hz thì qua hai tầng vẫn giữ 91%.
 *
 * Lọc TRƯỚC khi tính mức VAD, và lọc luôn cả tiếng gửi lên server:
 * cùng một dòng tiếng thì VAD với Whisper mới nói cùng một chuyện, và
 * bỏ được đống ầm là trả lại chỗ cho giọng người trong 16 bit.
 */
static int32_t hpXa = 0, hpYa = 0, hpXb = 0, hpYb = 0;
static int32_t hpXg = 0, hpYg = 0;

/**
 * ⚠️ HAI bộ lọc KHÁC NHAU, cho hai việc khác nhau. Đừng gộp lại.
 *
 * Bản trước dùng CHUNG một bộ lọc mạnh (hai tầng, cắt 160 Hz) cho cả
 * hai, và cái giá phải trả chỉ lộ ra khi đọc log Whisper:
 *
 *   "Được không? Thế em đã tặng em nhé Chúc tệ"
 *   "Thì đây là năm cháu thì lái, năm cháu thì đổ đi"
 *
 * Chữ vô nghĩa. Robot không ngắt lời ai cả — nó đang trả lời tử tế một
 * câu hỏi khác hẳn, vì thứ nó nghe được đã hỏng.
 *
 * TIẾNG VIỆT LÀ NGÔN NGỮ CÓ THANH ĐIỆU, và thanh điệu nằm ở tần số cơ
 * bản của giọng — khoảng 85-255 Hz. Cắt hai tầng ở 160 Hz là ghìm đúng
 * dải đó xuống 9-12 dB. "dài" với "dạng", "tặng" với "từng" chỉ khác
 * nhau ở đường cong cao độ, mà đường cong đó vừa bị bào mòn.
 *
 * Nên tách ra:
 *
 *   locVad()  hai tầng 160 Hz — chỉ để QUYẾT ĐỊNH có ai đang nói không.
 *             Ở đây cắt mạnh là đúng: nó chỉ cần một con số năng lượng,
 *             không cần nghe ra chữ gì.
 *
 *   locGui()  MỘT tầng ~80 Hz — cho dòng tiếng GỬI LÊN Whisper. Vừa đủ
 *             dọn điện áp trôi (nếu để nguyên, biên độ ±1,6 triệu chia
 *             cho 32 thành 50.000, vượt trần 32.767 ⇒ tiếng bị xén méo,
 *             và Whisper nghe tiếng méo thì đoán bừa), vừa giữ lại
 *             78-88% năng lượng ở dải thanh điệu.
 */
static inline int32_t locVad(int32_t x) {
  // y[n] = x[n] - x[n-1] + a·y[n-1], a = 1 - 1/16 ⇒ cắt ≈ 160 Hz
  // Chia thay vì dịch bit: dịch phải làm tròn về phía âm vô cực nên nó
  // tự bơm vào một độ lệch một chiều — đúng thứ bộ lọc này sinh ra để
  // dọn đi.
  const int32_t ya = x - hpXa + hpYa - (hpYa / 16);
  hpXa = x; hpYa = ya;
  const int32_t yb = ya - hpXb + hpYb - (hpYb / 16);
  hpXb = ya; hpYb = yb;
  return yb;
}

static inline int32_t locGui(int32_t x) {
  // a = 1 - 1/32 ⇒ cắt ≈ 80 Hz. Ở 20 Hz còn 24%, ở 100 Hz giữ 78%.
  const int32_t y = x - hpXg + hpYg - (hpYg / 32);
  hpXg = x; hpYg = y;
  return y;
}

static ChunkFn cbChunk = nullptr;
static EventFn cbStart = nullptr;
static EventFn cbEnd = nullptr;

// Bộ đệm cố định — KHÔNG để trên ngăn xếp. Vòng loop() của Arduino chỉ
// có 8 KB, mà riêng khối đọc thô đã 1 KB; cộng thêm đệm phát nữa là
// tràn ngăn xếp, và tràn ngăn xếp trên ESP32 biểu hiện ra ngoài thành
// "tự khởi động lại lúc đang nói" chứ không thành lỗi biên dịch.
static int32_t rawBlock[AUDIO_BLOCK_SAMPLES];
static int16_t pcmBlock[AUDIO_BLOCK_SAMPLES];
static int16_t stereoBlock[AUDIO_BLOCK_SAMPLES * 2];

// Đệm trước: vòng tròn giữ AUDIO_PREROLL_BLOCKS khối gần nhất.
static int16_t preroll[AUDIO_PREROLL_BLOCKS][AUDIO_BLOCK_SAMPLES];
static uint8_t prerollHead = 0;
static uint8_t prerollCount = 0;

static bool micReady = false;
static bool ampReady = false;

// ─── Cài driver ────────────────────────────────────────────

static bool micInit() {
  i2s_config_t cfg = {};
  cfg.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX);
  cfg.sample_rate = MIC_SAMPLE_RATE;
  // INMP441 là mic 24 bit, dữ liệu nằm ở 24 bit cao của khe 32 bit.
  // Đọc ở 32 bit rồi tự dịch — đọc thẳng 16 bit sẽ lấy nhầm nửa dưới
  // toàn số 0 và mic "chết" mà không báo gì.
  cfg.bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT;
  cfg.channel_format = I2S_CHANNEL_FMT_ONLY_LEFT;  // chân L/R nối GND
  cfg.communication_format = I2S_COMM_FORMAT_STAND_I2S;
  cfg.intr_alloc_flags = 0;
  cfg.dma_buf_count = 8;
  cfg.dma_buf_len = 256;
  cfg.use_apll = false;

  i2s_pin_config_t pins = {};
  pins.bck_io_num = PIN_MIC_SCK;
  pins.ws_io_num = PIN_MIC_WS;
  pins.data_out_num = I2S_PIN_NO_CHANGE;
  pins.data_in_num = PIN_MIC_SD;

  if (i2s_driver_install(I2S_NUM_0, &cfg, 0, NULL) != ESP_OK) return false;
  if (i2s_set_pin(I2S_NUM_0, &pins) != ESP_OK) return false;
  return true;
}

static bool ampInit() {
  i2s_config_t cfg = {};
  cfg.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX);
  cfg.sample_rate = playRate;
  cfg.bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT;
  // Khung âm thanh nổi dù nguồn là một kênh. Bài kiểm loa chạy đúng
  // với cấu hình này trên chính bo và chính con MAX98357A đang cắm —
  // đổi sang ONLY_LEFT để "tiết kiệm" là đổi thứ đã kiểm chứng lấy
  // thứ chưa kiểm chứng.
  cfg.channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT;
  cfg.communication_format = I2S_COMM_FORMAT_STAND_I2S;
  cfg.intr_alloc_flags = 0;
  // 16 x 512 khung = 512 ms tiếng nằm sẵn trong phần cứng, gấp bốn lần
  // bản đầu (8 x 256 = 128 ms).
  //
  // 128 ms quá mỏng: chỉ cần một cú vẽ màn hình, một khung WebSocket
  // to, hay một lần thu gom bộ nhớ là đệm cạn và loa lặp lại mẩu vừa
  // phát. Nửa giây thì nuốt được mọi cú khựng của vòng loop() mà vẫn
  // chưa đủ dài để tai nhận ra độ trễ.
  //
  // Giá: 32 KB RAM trong. Bo còn 190 KB khối liền mạch, thừa sức.
  cfg.dma_buf_count = SPK_DMA_COUNT;
  cfg.dma_buf_len = 512;
  cfg.use_apll = false;

  i2s_pin_config_t pins = {};
  pins.bck_io_num = PIN_AMP_BCLK;
  pins.ws_io_num = PIN_AMP_LRC;
  pins.data_out_num = PIN_AMP_DIN;
  pins.data_in_num = I2S_PIN_NO_CHANGE;

  if (i2s_driver_install(I2S_NUM_1, &cfg, 0, NULL) != ESP_OK) return false;
  if (i2s_set_pin(I2S_NUM_1, &pins) != ESP_OK) return false;

  // ⚠️ Đây là dòng chữa tiếng "rè rè" theo nhịp.
  //
  // Không cài driver thì BCLK/LRC/DIN thả nổi, và MAX98357A khuếch
  // đại đúng cái nhiễu bắt được trên ba chân đó — mỗi cú xả SPI ra
  // màn hình làm sụt nguồn 3V3 một nhịp, tai nghe thành tiếng rè
  // đúng nhịp vẽ màn.
  //
  // Cài driver rồi xoá sạch đệm DMA thì phần cứng I2S phát ra một
  // dòng số 0 LIÊN TỤC, không tốn một chút CPU nào (DMA cứ lặp lại
  // vùng đệm). Amp nhận tín hiệu số hợp lệ báo "im lặng" nên nó im
  // thật, thay vì đoán mò từ chân trôi.
  i2s_zero_dma_buffer(I2S_NUM_1);
  return true;
}

bool begin() {
  micReady = micInit();
  if (!micReady) Serial.println("[audio] KHONG cai duoc I2S mic (I2S_NUM_0)");

  ampReady = ampInit();
  if (!ampReady) Serial.println("[audio] KHONG cai duoc I2S loa (I2S_NUM_1)");

  playBuf = (uint8_t*)ps_malloc(AUDIO_PLAY_BUF_BYTES);
  if (!playBuf) {
    // Không có PSRAM thì lùi về RAM trong với đệm nhỏ hơn nhiều: nói
    // được câu ngắn còn hơn không nói được câu nào.
    playBuf = (uint8_t*)malloc(64 * 1024);
    Serial.println(playBuf ? "[audio] khong co PSRAM — dem phat chi 64 KB"
                           : "[audio] KHONG cap phat duoc dem phat");
  }
  return micReady && ampReady && playBuf != nullptr;
}

// ─── Đăng ký callback ──────────────────────────────────────

void onTurnStart(EventFn fn) { cbStart = fn; }
void onChunk(ChunkFn fn) { cbChunk = fn; }
void onTurnEnd(EventFn fn) { cbEnd = fn; }

// ─── Phát ──────────────────────────────────────────────────

static uint32_t playCapacity() { return playBuf ? AUDIO_PLAY_BUF_BYTES : 0; }

/** Byte đang chờ phát. */
static inline uint32_t buffered() { return writePos - readPos; }
/** Chỗ trống còn lại — chính là thứ đệm thẳng không bao giờ đòi lại được. */
static inline uint32_t freeSpace() { return playCapacity() - buffered(); }

void playBegin(uint32_t sampleRate) {
  if (!ampReady || !playBuf) return;

  // ⚠️ CÂM DMA NGAY, trước khi xoá đệm.
  //
  // Đây là lỗi "lặp hai từ cuối mãi, phải reset mới tắt". Trình tự gây
  // ra nó: robot đang nói "bật đây" thì lệnh nhạc tới, server gửi
  // say_start mới, hàm này xoá đệm và về trạng thái GOM — và
  // pumpPlayback lập tức trả về vì chưa phải trạng thái PHÁT. Không ai
  // ghi vào I2S nữa, mà DMA thì LẶP LẠI vùng đệm cũ khi không được
  // ghi. Hai từ cuối cùng của câu vừa rồi kêu mãi.
  //
  // Xoá đệm DMA cắt đứt vòng đó ngay: im lặng còn hơn một mẩu tiếng
  // lặp vô tận, và nếu nhạc không bao giờ tới thì robot chỉ im chứ
  // không hoá thành cái loa hỏng.
  i2s_zero_dma_buffer(I2S_NUM_1);
  if (sampleRate >= 8000 && sampleRate <= 48000 && sampleRate != playRate) {
    playRate = sampleRate;
    i2s_set_clk(I2S_NUM_1, playRate, I2S_BITS_PER_SAMPLE_16BIT, I2S_CHANNEL_STEREO);
  }
  writePos = 0;
  readPos = 0;
  playOverflow = false;
  playDroppedBytes = 0;
  playEnded = false;
  underruns = 0;
  underrunMs = 0;
  underrunSince = 0;
  fillingSince = millis();
  playState = PLAY_FILLING;

  // Đang nghe dở mà server chen tiếng vào thì bỏ lượt nghe đó — nếu
  // không, phần thu được sẽ có cả tiếng robot lẫn tiếng người.
  micOpen = false;
  prerollCount = 0;
}

bool playPush(const uint8_t* data, size_t len) {
  // ⚠️ PHẢI nhận cả khi ĐANG PHÁT, không riêng lúc đang gom.
  //
  // Đây từng là lỗi: cơ chế "phát sớm khi có nửa giây tiếng" đổi trạng
  // thái sang PHÁT ở mốc 16 KB, mà dòng gác này vẫn chỉ cho qua khi
  // đang GOM — nên mọi mẩu tiếng gửi tới sau đó bị vứt thẳng, im lặng,
  // không một dòng log. Robot phát đúng 16 KB đầu rồi tắt: nửa giây,
  // một hai chữ.
  //
  // Bài học: đổi máy trạng thái thì phải rà LẠI mọi chỗ đang so sánh
  // với trạng thái cũ, không chỉ chỗ mình vừa sửa.
  if ((playState != PLAY_FILLING && playState != PLAY_DRAINING) || !playBuf) return false;
  if (playEnded) return false;  // byte tới sau say_end là của lượt sau

  const uint32_t cap = playCapacity();
  if (len > freeSpace()) {
    // Đệm đầy THẬT — nghĩa là mạng đổ vào nhanh hơn loa phát ra suốt
    // 16 giây liền. Với giọng nói thì gần như không xảy ra; với nhạc
    // thì server đã tự ghìm ở mốc 256 KB nên cũng hiếm. Bỏ mẩu này
    // còn hơn ghi đè lên phần chưa phát.
    playOverflow = true;
    playDroppedBytes += len;
    return false;
  }

  // Chép vòng: có thể phải cắt làm hai đoạn ở chỗ nối cuối-đầu mảng.
  const uint32_t at = writePos % cap;
  const uint32_t first = (at + len > cap) ? (cap - at) : (uint32_t)len;
  memcpy(playBuf + at, data, first);
  if (first < len) memcpy(playBuf, data + first, len - first);
  writePos += len;

  // Đủ đệm rồi thì phát NGAY, đừng đợi `say_end`. Phần còn lại chảy
  // tới trong lúc đang phát.
  if (playState == PLAY_FILLING && buffered() >= PLAY_START_BYTES) {
    playState = PLAY_DRAINING;
    fillingSince = 0;
  }
  return true;
}

void playEnd() {
  if (playState == PLAY_IDLE) return;
  playEnded = true;
  lastClip = writePos;
  if (playOverflow)
    Serial.printf("[audio] mang do vao nhanh hon loa phat ra, bi bo bot (%lu byte)\n", writePos);
  if (writePos < 2) {
    playState = PLAY_IDLE;
    micResumeAt = millis() + MIC_RESUME_DELAY_MS;
    return;
  }
  // Câu ngắn hơn ngưỡng đệm thì chưa kịp chuyển sang phát — chuyển giờ.
  playState = PLAY_DRAINING;
}

void playStop() {
  if (playState == PLAY_IDLE) return;
  playState = PLAY_IDLE;
  writePos = readPos = 0;
  playEnded = false;
  i2s_zero_dma_buffer(I2S_NUM_1);
  micResumeAt = millis() + MIC_RESUME_DELAY_MS;
}

/** Đẩy một lát nhỏ ra loa. Nhỏ để loop() không bị giữ quá lâu. */
static void pumpPlayback() {
  // Kẹt ở trạng thái GOM: nguồn chết giữa chừng. Có gì phát nấy sau 3
  // giây, còn không có gì thì bỏ hẳn sau 12 giây. Không có hai lối
  // thoát này thì một lần tải nhạc hỏng là robot câm tới lúc reset.
  if (playState == PLAY_FILLING && fillingSince) {
    const uint32_t waited = millis() - fillingSince;
    if (buffered() > 0 && waited > 3000) {
      playState = PLAY_DRAINING;
    } else if (waited > 12000) {
      playState = PLAY_IDLE;
      writePos = readPos = 0;
      playEnded = false;
      fillingSince = 0;
      i2s_zero_dma_buffer(I2S_NUM_1);
      micResumeAt = millis() + MIC_RESUME_DELAY_MS;
      Serial.println("[audio] cho mai khong thay tieng, bo luot phat");
      return;
    }
  }

  if (playState != PLAY_DRAINING) return;

  const uint32_t cap = playCapacity();

  // ⚠️ NHỒI ĐẦY DMA MỖI VÒNG, không nhỏ giọt một khối.
  //
  // Bản trước ghi đúng MỘT khối 256 mẫu (16 ms) mỗi vòng loop(). Vòng
  // chạy khoảng 60 lần/giây, tức 960 ms tiếng cho mỗi 1000 ms thực —
  // nạp CHẬM HƠN thời gian thực 4%. Nghe ra hai kiểu khác nhau:
  //
  //   giọng nói : DMA cạn định kỳ rồi lặp lại mẩu vừa phát
  //               ("tôi tôi tôi tôi tới tới chơi chơi")
  //   nhạc      : nguồn vẫn chảy đều nên đệm TRÀN, mẩu bị bỏ,
  //               bài nhảy cóc rồi hết sớm
  //
  // Cách đúng là ghi tới khi DMA no: dùng hạn chờ 0 và dừng lại khi
  // nó không nhận thêm. Nhịp phát khi đó do phần cứng quyết định, chứ
  // không phụ thuộc vòng loop() chạy nhanh hay chậm — mà vòng loop()
  // thì luôn co giãn theo mạng và màn hình.
  for (int round = 0; round < 24; round++) {
    const uint32_t have = buffered();

    // ⚠️ HẾT TIẾNG THÌ ĐỔ IM LẶNG, đừng chỉ ngừng ghi.
    //
    // Ngừng ghi thì DMA lặp lại mẩu vừa phát — người nghe thành "tôi tôi
    // tôi tới tới chơi chơi". Đổ im lặng thì thành một khoảng lặng ngắn.
    //
    // Cùng một sự cố, hai cảm nhận khác hẳn: khoảng lặng nghe như robot
    // đang NGHĨ, còn lặp chữ nghe như robot HỎNG. Đo hôm nay: `hut dem
    // 2 lan / 2052 ms` trong một lượt 10 giây — hai giây đó có thể là
    // hai lần ngập ngừng, hoặc hai lần lắp bắp. Cách xử lý quyết định
    // người ta nghe ra cái nào.
    //
    // Không chữa được nguyên nhân (mẩu tiếng sau chưa kịp về), nhưng
    // nguyên nhân thì nằm ở tốc độ máy chủ, còn cái này nằm ở đây.
    // ⚠️⚠️ PHẢI ĐỔ ĐẦY CẢ VÒNG DMA, KHÔNG PHẢI MỘT KHỐI.
    //
    // Bản vá đầu (12/08, `0.5.0-imlang`) ghi đúng MỘT khối im lặng rồi
    // `break` — và người dùng vẫn nghe lặp y như cũ. Lý do: đệm DMA của
    // I2S là một VÒNG `SPK_DMA_COUNT` khối. Ghi một khối chỉ thay được
    // 1 trong 16 chỗ; 15 khối kia vẫn giữ tiếng cũ, và DMA quay vòng
    // phát lại chúng. 16 × 512 mẫu ở 16 kHz = 512 ms — đúng bằng "một
    // hai ba từ" lặp đi lặp lại mà tai nghe thấy.
    //
    // Nên phải ghi tới khi phần cứng không nhận nữa (`w == 0`), giống
    // hệt cách vòng chính ở trên đẩy tiếng thật.
    //
    // KHÔNG dùng `i2s_zero_dma_buffer()` ở đây dù nó xoá sạch vòng chỉ
    // bằng một lệnh: lúc này DMA vẫn đang giữ tới 512 ms tiếng THẬT
    // chưa kịp phát ra loa. Xoá sạch là cắt cụt giữa chừng — đổi lỗi
    // lặp chữ lấy lỗi nuốt chữ, tệ ngang nhau. Ghi dần thì im lặng chỉ
    // thế chỗ những khối đã phát xong.
    if (have < 2) {
      // ⚠️⚠️ MỘT BYTE LẺ LÀ KẸT VĨNH VIỄN, VÀ KHÔNG BỘ ĐẾM NÀO THẤY.
      //
      // Mẫu tiếng là 16-bit nên `readPos` chỉ tăng theo bội số 2. Đệm
      // còn lẻ đúng 1 byte thì: vòng này thoát ngay (`have < 2`), mà
      // chỗ đổ đầy vòng DMA ở cuối hàm lại đòi `buffered() == 0` — nên
      // KHÔNG chỗ nào chạy, và byte lẻ đó không bao giờ tiêu được.
      // DMA hết dữ liệu, quay vòng phát lại 512 ms cũ: đúng tiếng "lặp
      // một hai ba từ".
      //
      // Tệ nhất là bộ đếm `underruns` cũng gác ở `buffered() == 0` nên
      // nó ghi `hut dem 0 lan` — log sạch bong trong khi tai nghe rõ
      // tiếng lặp. Suốt mấy vòng sửa tôi đọc đúng cái log đó rồi kết
      // luận "không đói đệm". Xem [[feedback_error_counter_must_reach_the_log_you_read]].
      //
      // Mẩu tiếng đi qua mạng bị cắt ở đâu là chuyện của tầng dưới, nên
      // đừng mong nó luôn chẵn — vứt nửa mẫu lẻ đi. 1/32000 giây, không
      // tai nào nghe ra.
      if (have == 1) readPos++;

      if (!playEnded) {
        memset(stereoBlock, 0, AUDIO_BLOCK_SAMPLES * 2 * sizeof(int16_t));
        for (int k = 0; k < SPK_DMA_COUNT + 2; k++) {
          size_t w = 0;
          i2s_write(I2S_NUM_1, stereoBlock,
                    AUDIO_BLOCK_SAMPLES * 2 * sizeof(int16_t), &w, 0);
          if (w == 0) break;   // vòng DMA đã no — để phần cứng phát nốt
        }
      }
      break;
    }

    const uint32_t take = have < AUDIO_BLOCK_SAMPLES * 2 ? have : AUDIO_BLOCK_SAMPLES * 2;
    const uint32_t n = take / 2;
    if (!n) break;

    const uint32_t at = readPos % cap;
    for (uint32_t i = 0; i < n; i++) {
      const uint32_t o = (at + i * 2) % cap;
      const int16_t raw =
          (int16_t)((uint16_t)playBuf[o] | ((uint16_t)playBuf[(o + 1) % cap] << 8));
      const int16_t v = applyVolume(raw);
      stereoBlock[i * 2] = v;
      stereoBlock[i * 2 + 1] = v;
    }

    size_t wrote = 0;
    i2s_write(I2S_NUM_1, stereoBlock, n * 2 * sizeof(int16_t), &wrote, 0);
    if (wrote == 0) return;  // DMA đã no — để dành vòng sau

    // `wrote` đếm byte khung STEREO; mỗi mẫu một kênh cõng 4 byte.
    readPos += (wrote / 4) * 2;
    if (wrote < n * 2 * sizeof(int16_t)) return;  // ghi dở → DMA sắp no
  }

  // ⚠️ HỤT ĐỆM: phải bơm IM LẶNG, không được bỏ mặc DMA.
  //
  // Đây là tiếng "giật giật" người dùng nghe thấy. DMA của I2S lặp
  // lại vùng đệm cũ khi không được ghi thêm — nên mỗi lần đợi câu
  // tiếp theo, loa phát lại 128 ms vừa rồi, lặp đi lặp lại. Nghe như
  // đĩa xước.
  //
  // Và nó xảy ra ở MỌI khoảng nghỉ giữa hai câu, vì server đọc từng
  // câu một, mỗi câu mất 300-1000 ms tổng hợp.
  //
  // Bơm số 0 thì khoảng nghỉ thành im lặng sạch — vẫn là khoảng nghỉ,
  // nhưng tai người bỏ qua một quãng lặng dễ hơn nhiều so với một mẩu
  // tiếng lặp lại.
  // `< 2` chứ KHÔNG phải `== 0`: còn lẻ 1 byte thì cũng là hết tiếng để
  // phát (mẫu 16-bit cần 2 byte), nhưng `== 0` bỏ sót đúng ca đó — và
  // đó là ca gây tiếng lặp mà log vẫn báo sạch. Bộ đếm phải thấy được
  // thứ người dùng nghe thấy, nếu không nó chỉ làm mình yên tâm nhầm.
  if (buffered() < 2 && !playEnded) {
    if (!underrunSince) {
      underrunSince = millis();
      underruns++;
    }
    // Bơm im lặng cho tới khi DMA no, KHÔNG phải một khối rồi thôi —
    // một khối là 16 ms, mà vòng loop() chỉ chạy 60 lần/giây nên vẫn
    // nạp chậm hơn thời gian thực và DMA vẫn kịp cạn để lặp.
    memset(stereoBlock, 0, AUDIO_BLOCK_SAMPLES * 2 * sizeof(int16_t));
    for (int i = 0; i < 24; i++) {
      size_t w = 0;
      i2s_write(I2S_NUM_1, stereoBlock, AUDIO_BLOCK_SAMPLES * 2 * sizeof(int16_t), &w, 0);
      if (w < AUDIO_BLOCK_SAMPLES * 2 * sizeof(int16_t)) break;
    }
    return;
  }
  if (underrunSince) {
    underrunMs += millis() - underrunSince;
    underrunSince = 0;
  }

  if (buffered() == 0) {
    // ⚠️ Đuôi im lặng, KHÔNG được bỏ.
    //
    // DMA của I2S cứ lặp lại vùng đệm khi không được ghi thêm. Dừng
    // ngay sau mẫu cuối thì ~128 ms tiếng cuối cùng sẽ lặp đi lặp lại
    // mãi. Ghi đủ một vòng đệm toàn số 0 vừa đẩy nốt phần đuôi thật ra
    // loa, vừa để lại trạng thái im lặng sạch sẽ.
    memset(stereoBlock, 0, sizeof(stereoBlock));
    for (int i = 0; i < 32; i++) {  // đủ phủ hết vòng đệm DMA mới
      size_t w = 0;
      i2s_write(I2S_NUM_1, stereoBlock, sizeof(stereoBlock), &w, portMAX_DELAY);
    }
    playState = PLAY_IDLE;
    writePos = readPos = 0;
    micResumeAt = millis() + MIC_RESUME_DELAY_MS;

    // Mở tai lại cho SẠCH sau khi nói xong.
    //
    // Người dùng báo: "trả lời xong, hỏi câu tiếp theo phải nói 2-3
    // lần nó mới nghe". Vì hai thứ còn sót lại từ trước khi nói:
    //   - `loudRun` giữ nguyên số đếm cũ, có thể đang dở dang
    //   - đệm trước còn giữ 320 ms cuối của chính giọng robot
    // Câu hỏi tiếp theo bị dính đuôi giọng robot ở đầu, hoặc VAD mở
    // lượt nhầm lúc rồi đóng ngay. Xoá sạch cả hai.
    loudRun = 0;
    prerollCount = 0;
    micOpen = false;
    micQuietAt = 0;
  }
}

// ─── Tiếng báo ─────────────────────────────────────────────
/**
 * Một tiếng "bíp" ngắn phát thẳng ra I2S.
 *
 * Vì sao cần: người dùng nói xong KHÔNG biết robot đã nghe được hay
 * chưa. Câu trả lời mất một hai giây mới tới, và trong khoảng im lặng
 * đó người ta tự động hỏi lại — rồi câu hỏi thứ hai đè lên lượt đang
 * xử lý, làm hỏng cả hai. Một tiếng bíp ngay lúc khép lượt cắt đứt
 * vòng đó: "nghe rồi, đang nghĩ".
 *
 * Phát TẠI CHỖ chứ không xin server, vì thứ cần khẳng định là "MIC đã
 * bắt được", và điều đó bo tự biết trước cả khi gói tin rời ăng-ten.
 * Bíp qua server thì mất luôn ý nghĩa lúc mạng chậm — đúng lúc cần
 * nhất.
 *
 * Có vuốt biên độ hai đầu: cắt cụt sóng sin là nghe thành tiếng "cụp"
 * chứ không phải tiếng bíp.
 */
void beep(uint16_t freq, uint16_t ms, uint8_t loudness) {
  if (!ampReady || playState != PLAY_IDLE) return;

  const uint32_t total = (uint32_t)playRate * ms / 1000;
  const uint32_t fade = total / 6;
  const float amp = 9000.0f * (loudness / 100.0f) * (volumePct / 100.0f);

  uint32_t done = 0;
  while (done < total) {
    const uint32_t n = (total - done) < AUDIO_BLOCK_SAMPLES ? (total - done) : AUDIO_BLOCK_SAMPLES;
    for (uint32_t i = 0; i < n; i++) {
      const uint32_t k = done + i;
      float env = 1.0f;
      if (k < fade) env = (float)k / fade;
      else if (k > total - fade) env = (float)(total - k) / fade;
      const int16_t v = (int16_t)(sinf(2.0f * PI * freq * k / playRate) * amp * env);
      stereoBlock[i * 2] = v;
      stereoBlock[i * 2 + 1] = v;
    }
    size_t w = 0;
    i2s_write(I2S_NUM_1, stereoBlock, n * 2 * sizeof(int16_t), &w, portMAX_DELAY);
    done += n;
  }

  // Đuôi im lặng, nếu không DMA lặp lại tiếng bíp mãi.
  //
  // ⚠️ BỐN KHỐI LÀ KHÔNG ĐỦ, và tôi đã tính sai đúng tám lần. Đệm DMA
  // của amp là 16 × 512 = 8.192 mẫu (xem ampInit), còn bốn khối ở đây
  // mới 4 × 256 = 1.024 mẫu. Bảy phần tám vùng đệm vẫn giữ nguyên tiếng
  // bíp, và phần cứng cứ quay vòng phát lại — người dùng nghe thành
  // "tụt tụt" đều đặn không bao giờ dứt.
  //
  // Chú thích cũ nhận đúng nguyên nhân nhưng đổ thiếu. Nên giờ dùng
  // `i2s_zero_dma_buffer()` — hàm của driver, xoá TOÀN BỘ vùng đệm bất
  // kể nó to bao nhiêu. Không còn con số nào để tính sai.
  i2s_zero_dma_buffer(I2S_NUM_1);

  // ⚠️ CÂM MIC sau khi bíp, nếu không robot nghe thấy chính tiếng bíp
  // của mình.
  //
  // Vòng lặp nó tạo ra: khép lượt → bíp → mic nghe tiếng bíp → mở
  // lượt mới → khép lượt → bíp… Người dùng nghe thành "tịt tịt inh
  // ỏi liên tục", và mỗi vòng còn tốn một lần gọi Whisper.
  //
  // Đây đúng cái bẫy đã dựng hàng rào ở đường phát tiếng nói mà lại
  // quên ở đường tiếng báo — vì lúc viết chỉ nghĩ nó "ngắn quá, không
  // sao đâu".
  loudRun = 0;
  micOpen = false;
  micQuietAt = 0;
  prerollCount = 0;
  micResumeAt = millis() + MIC_RESUME_DELAY_MS;
}

// ─── Nghe ──────────────────────────────────────────────────

/** Vứt sạch những gì DMA thu được trong lúc robot đang nói. */
static void micDrain() {
  size_t got = 0;
  for (int i = 0; i < 16; i++) {
    if (i2s_read(I2S_NUM_0, rawBlock, sizeof(rawBlock), &got, 0) != ESP_OK) break;
    if (got == 0) break;
  }
}

static void pushPreroll(const int16_t* block) {
  memcpy(preroll[prerollHead], block, AUDIO_BLOCK_SAMPLES * sizeof(int16_t));
  prerollHead = (prerollHead + 1) % AUDIO_PREROLL_BLOCKS;
  if (prerollCount < AUDIO_PREROLL_BLOCKS) prerollCount++;
}

static void flushPreroll() {
  if (!cbChunk || !prerollCount) return;
  // Đọc vòng tròn từ khối cũ nhất tới mới nhất.
  uint8_t idx = (prerollHead + AUDIO_PREROLL_BLOCKS - prerollCount) % AUDIO_PREROLL_BLOCKS;
  for (uint8_t i = 0; i < prerollCount; i++) {
    cbChunk((const uint8_t*)preroll[idx], AUDIO_BLOCK_SAMPLES * sizeof(int16_t));
    idx = (idx + 1) % AUDIO_PREROLL_BLOCKS;
  }
  prerollCount = 0;
}

static void endTurn() {
  loudRun = 0;
  micOpen = false;
  prerollCount = 0;
  micResumeAt = millis() + VAD_COOLDOWN_MS;
  if (cbEnd) cbEnd();
}

static void pumpMic() {
  if (!micReady) return;

  const uint32_t now = millis();

  // Loa đang chạy (hoặc vừa dứt) → không nghe. Vẫn phải dọn DMA, nếu
  // không thì lúc mở lại sẽ đọc phải chính giọng robot còn tồn trong
  // vùng đệm.
  if (playState != PLAY_IDLE || now < micResumeAt) {
    micDrain();
    micLevel = 0;
    return;
  }

  size_t got = 0;
  // Chờ hẳn một khối: 16 ms, đủ ngắn để ws.loop() vẫn chạy ~60 lần/giây.
  if (i2s_read(I2S_NUM_0, rawBlock, sizeof(rawBlock), &got, portMAX_DELAY) != ESP_OK) return;
  const int n = got / sizeof(int32_t);
  if (n <= 0) return;

  // ── Thống kê mẫu THÔ, để phân biệt "phòng ồn" với "mic hỏng" ──
  //
  // `micLevel` là trung bình trị tuyệt đối — nó cao thì biết là cao,
  // nhưng KHÔNG cho biết vì sao. Ba con số dưới đây thì cho:
  //
  //   lệch một chiều lớn  → mic có điện áp nền, không phải tiếng
  //   đỉnh sát 8.388.608  → dây dữ liệu chập chờn/thả nổi, đang đọc rác
  //   đỉnh cao mà lệch ~0 → tiếng thật, phòng ồn thật
  int64_t dcSum = 0;
  int64_t thoSum = 0;
  int32_t peak = 0;

  int64_t sum = 0;
  for (int i = 0; i < n; i++) {
    const int32_t raw = rawBlock[i];
    const int32_t s0 = raw >> 8;
    thoSum += abs(s0);                    // trước lọc, để so sánh

    // Quyết định "có ai nói không" — lọc mạnh, chỉ cần năng lượng.
    const int32_t sVad = locVad(s0);
    dcSum += sVad;
    if (abs(sVad) > peak) peak = abs(sVad);
    sum += abs(sVad);      // thang 24 bit — cùng thang với VAD_THRESHOLD

    // Tiếng GỬI ĐI — lọc nhẹ, giữ thanh điệu cho Whisper.
    int32_t v = locGui(s0) >> (MIC_GAIN_SHIFT - 8);
    if (v > 32767) { v = 32767; xenSamples++; }
    else if (v < -32768) { v = -32768; xenSamples++; }
    pcmBlock[i] = (int16_t)v;
  }
  micLevel = (int32_t)(sum / n);
  micDc = (int32_t)(dcSum / n);
  micTho = (int32_t)(thoSum / n);

  // Đổ 8 mẫu THÔ 32 bit mỗi giây. Đây là thứ duy nhất phân biệt được
  // "mic gửi sai" với "ta đọc sai":
  //   8 bit thấp toàn 0    → đúng khuôn 24-trong-32, mic gửi chuẩn
  //   8 bit thấp lung tung → lệch khuôn/lệch bit, ta đang đọc sai chỗ
  //   toàn 0 hoặc toàn F   → dây dữ liệu không có ai lái
  {
    static uint32_t lanCuoi = 0;
    if (millis() < 20000 && millis() - lanCuoi > 1000) {  // chỉ 20 giây đầu
      lanCuoi = millis();
      Serial.printf("[raw] %08lx %08lx %08lx %08lx %08lx %08lx %08lx %08lx\n",
                    (unsigned long)rawBlock[0], (unsigned long)rawBlock[1],
                    (unsigned long)rawBlock[2], (unsigned long)rawBlock[3],
                    (unsigned long)rawBlock[64], (unsigned long)rawBlock[65],
                    (unsigned long)rawBlock[128], (unsigned long)rawBlock[192]);
    }
  }
  micPeak = peak;
  if (peak > 8388608 / 2) micClipBlocks++;   // sát trần = nghi rác

  // ── Giây đầu: ĐO, chưa nghe ai ──
  //
  // Đặt trước mọi phép xét khác, kể cả cờ chạm đầu: mở lượt nghe trong
  // lúc còn chưa biết phòng ồn cỡ nào thì lượt đó chắc chắn hỏng.
  if (calibBlocks < CALIB_BLOCKS) {
    calibSum += micLevel;
    if (++calibBlocks == CALIB_BLOCKS) {
      noiseFloor = (int32_t)(calibSum / CALIB_BLOCKS);
      if (noiseFloor < VAD_THRESHOLD / 4) noiseFloor = VAD_THRESHOLD / 4;
      Serial.printf("[vad] do nen phong: %ld, nguong %ld\n", (long)noiseFloor,
                    (long)vadGate());
    }
    pushPreroll(pcmBlock);
    return;
  }

  const bool loud = micLevel > vadGate();

  if (!micOpen) {
    // Bám nền KHÔNG ĐỐI XỨNG: tụt nhanh, leo chậm.
    //
    // Không hỏi `loud` nữa — chính câu hỏi đó tạo ra vòng luẩn quẩn ở
    // trên. Thay vào đó dựa vào chênh lệch thời gian: một câu nói dài
    // ba giây cũng chỉ là 187 khối, với nhịp leo 1/512 thì nó nhích nền
    // lên vài phần trăm rồi thôi; còn tiếng quạt chạy hai chục giây thì
    // kéo được nền lên hẳn. Hết tiếng ồn, nền tụt lại trong 0,13 giây.
    if (micLevel < noiseFloor) noiseFloor += (micLevel - noiseFloor) / 8;
    else noiseFloor += (micLevel - noiseFloor) / 512 + 1;

    // Bộ đếm RỈ, không phải chuỗi liên tiếp.
    //
    // Bản trước xoá sạch bộ đếm mỗi khi có một khối nhỏ — và tiếng
    // Việt thì KHÔNG liên tục: giữa các âm tiết có khoảng lặng, phụ
    // âm đầu gần như im, "th", "kh", "s" đều tụt xuống dưới ngưỡng.
    // Chỉ một nhịp hụt là về 0 và không bao giờ đủ 8 khối. Người dùng
    // thấy đúng như vậy: "mic không nhạy, nói 2-3 lần mới nghe".
    //
    // Tăng khi to, GIẢM DẦN khi nhỏ. Một tiếng gõ bàn vẫn bị loại vì
    // nó chỉ to một hai khối rồi tắt hẳn nên bộ đếm rỉ hết trước khi
    // chạm ngưỡng; còn một câu nói thì các khoảng lặng ngắn không đủ
    // xoá công của những khối to trước đó.
    if (loud) loudRun++;
    else if (loudRun > 0) loudRun--;

    // Chạm đầu = ÉP MỞ lượt, khỏi cần đủ to.
    //
    // Đây là đường vòng qua toàn bộ phép đo độ ồn ở trên. VAD phải đoán
    // "người này có đang nói với mình không" từ mỗi mức âm lượng, và
    // đoán thì có lúc sai — user đã báo ba lần "nói hai ba lần nó mới
    // nghe". Chạm vào đầu robot thì không còn gì phải đoán nữa.
    //
    // Giữ nguyên VAD chứ không thay thế: robot vẫn tự nghe như cũ, chạm
    // chỉ là đường tắt cho lúc nó lơ đễnh hoặc phòng ồn.
    if (!epMoLuot && loudRun < VAD_OPEN_BLOCKS) {
      pushPreroll(pcmBlock);
      return;
    }
    epMoLuot = false;
    micOpen = true;
    micTurnAt = now;
    micQuietAt = 0;
    if (cbStart) cbStart();
    flushPreroll();  // gửi cả phần âm đầu đã trôi qua trước khi VAD kịp nhận ra
  }

  if (cbChunk) cbChunk((const uint8_t*)pcmBlock, n * sizeof(int16_t));

  if (loud) {
    micQuietAt = 0;
  } else if (micQuietAt == 0) {
    micQuietAt = now;
  } else if (now - micQuietAt >= VAD_SILENCE_MS) {
    endTurn();
    return;
  }

  // Chặn trên: ai đó để robot cạnh cái TV thì lượt nói sẽ không bao
  // giờ tự kết thúc, và server có trần đệm 30 giây rồi vứt cả lượt.
  if (now - micTurnAt >= VAD_MAX_TURN_MS) endTurn();
}

// ─── Vòng chính ────────────────────────────────────────────

void loop() {
  pumpPlayback();
  pumpMic();
}

bool speaking() { return playState != PLAY_IDLE; }
bool listening() { return micOpen; }
int32_t level() { return micLevel; }
int32_t noise() { return noiseFloor; }
int32_t dc() { return micDc; }
int32_t rawLevel() { return micTho; }
int32_t peakRaw() { return micPeak; }
uint32_t clipBlocks() { return micClipBlocks; }
uint32_t clippedSamples() { return xenSamples; }
int32_t gate() { return vadGate(); }
uint32_t lastClipBytes() { return lastClip; }
uint32_t lastUnderruns() { return underruns; }
uint32_t droppedBytes() { return playDroppedBytes; }
uint32_t lastUnderrunMs() { return underrunMs + (underrunSince ? millis() - underrunSince : 0); }

}  // namespace audio

namespace audio {
/**
 * Ép mở một lượt nghe ở khối tiếng kế tiếp, bỏ qua ngưỡng VAD.
 *
 * Dùng cho nút chạm: người ta chạm vào robot nghĩa là "tôi đang nói
 * với mày đây", và đó là tín hiệu chắc chắn hơn mọi phép đo âm lượng.
 *
 * Đang nghe rồi thì không làm gì — chạm giữa lượt không nên cắt ngang.
 */
void moLuotNgay() {
  if (!listening()) epMoLuot = true;
}
}  // namespace audio
