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
static uint32_t playLen = 0;        // số byte đã nhận
static uint32_t playPos = 0;        // con trỏ đọc
static uint32_t playRate = 16000;
static uint32_t lastClip = 0;
static bool playOverflow = false;

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
 * Nên VAD bám theo nền: ngưỡng = nền × 3, kẹp trong [VAD_THRESHOLD,
 * 6 × VAD_THRESHOLD]. Sàn dưới để phòng thật yên cũng không nhạy quá;
 * trần trên để một tiếng ồn kéo dài (quạt, máy hút bụi) không đẩy
 * ngưỡng lên cao đến mức điếc hẳn.
 */
static int32_t noiseFloor = VAD_THRESHOLD / 2;

static int32_t vadGate() {
  int32_t gate = noiseFloor * VAD_GATE_MULT;
  if (gate < VAD_THRESHOLD) gate = VAD_THRESHOLD;
  if (gate > VAD_THRESHOLD * 6) gate = VAD_THRESHOLD * 6;
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
  cfg.dma_buf_count = 8;
  cfg.dma_buf_len = 256;
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

void playBegin(uint32_t sampleRate) {
  if (!ampReady || !playBuf) return;
  if (sampleRate >= 8000 && sampleRate <= 48000 && sampleRate != playRate) {
    playRate = sampleRate;
    i2s_set_clk(I2S_NUM_1, playRate, I2S_BITS_PER_SAMPLE_16BIT, I2S_CHANNEL_STEREO);
  }
  playLen = 0;
  playPos = 0;
  playOverflow = false;
  playState = PLAY_FILLING;

  // Đang nghe dở mà server chen tiếng vào thì bỏ lượt nghe đó — nếu
  // không, phần thu được sẽ có cả tiếng robot lẫn tiếng người.
  micOpen = false;
  prerollCount = 0;
}

bool playPush(const uint8_t* data, size_t len) {
  if (playState != PLAY_FILLING || !playBuf) return false;
  const uint32_t cap = playCapacity();
  if (playLen + len > cap) {
    playOverflow = true;
    const uint32_t room = cap > playLen ? cap - playLen : 0;
    if (room) {
      memcpy(playBuf + playLen, data, room);
      playLen += room;
    }
    return false;
  }
  memcpy(playBuf + playLen, data, len);
  playLen += len;
  return true;
}

void playEnd() {
  if (playState != PLAY_FILLING) return;
  lastClip = playLen;
  if (playOverflow) Serial.printf("[audio] doan noi bi cat bot (%lu byte)\n", playLen);
  if (playLen < 2) {
    playState = PLAY_IDLE;
    micResumeAt = millis() + MIC_RESUME_DELAY_MS;
    return;
  }
  playState = PLAY_DRAINING;
}

void playStop() {
  if (playState == PLAY_IDLE) return;
  playState = PLAY_IDLE;
  playLen = playPos = 0;
  i2s_zero_dma_buffer(I2S_NUM_1);
  micResumeAt = millis() + MIC_RESUME_DELAY_MS;
}

/** Đẩy một lát nhỏ ra loa. Nhỏ để loop() không bị giữ quá lâu. */
static void pumpPlayback() {
  if (playState != PLAY_DRAINING) return;

  const uint32_t left = playLen - playPos;
  const uint32_t take = left < AUDIO_BLOCK_SAMPLES * 2 ? left : AUDIO_BLOCK_SAMPLES * 2;
  const uint32_t n = take / 2;  // số mẫu 16 bit

  if (n) {
    const int16_t* src = (const int16_t*)(playBuf + playPos);
    // Nhân đôi mẫu một kênh thành khung hai kênh. MAX98357A để chân SD
    // thả nổi sẽ tự lấy trung bình (L+R)/2 — hai kênh giống nhau nên
    // trung bình bằng chính nó, âm lượng không đổi.
    for (uint32_t i = 0; i < n; i++) {
      stereoBlock[i * 2] = src[i];
      stereoBlock[i * 2 + 1] = src[i];
    }
    size_t wrote = 0;
    i2s_write(I2S_NUM_1, stereoBlock, n * 2 * sizeof(int16_t), &wrote, portMAX_DELAY);
    playPos += n * 2;
  }

  if (playPos >= playLen) {
    // ⚠️ Đuôi im lặng, KHÔNG được bỏ.
    //
    // DMA của I2S cứ lặp lại vùng đệm khi không được ghi thêm. Dừng
    // ngay sau mẫu cuối thì ~128 ms tiếng cuối cùng sẽ lặp đi lặp lại
    // mãi. Ghi đủ một vòng đệm toàn số 0 vừa đẩy nốt phần đuôi thật ra
    // loa, vừa để lại trạng thái im lặng sạch sẽ.
    memset(stereoBlock, 0, sizeof(stereoBlock));
    for (int i = 0; i < 8; i++) {
      size_t w = 0;
      i2s_write(I2S_NUM_1, stereoBlock, sizeof(stereoBlock), &w, portMAX_DELAY);
    }
    playState = PLAY_IDLE;
    playLen = playPos = 0;
    micResumeAt = millis() + MIC_RESUME_DELAY_MS;
  }
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

  int64_t sum = 0;
  for (int i = 0; i < n; i++) {
    const int32_t raw = rawBlock[i];
    sum += abs(raw >> 8);  // thang 24 bit — cùng thang với VAD_THRESHOLD

    int32_t v = raw >> MIC_GAIN_SHIFT;
    if (v > 32767) v = 32767;
    else if (v < -32768) v = -32768;
    pcmBlock[i] = (int16_t)v;
  }
  micLevel = (int32_t)(sum / n);

  const bool loud = micLevel > vadGate();

  if (!micOpen) {
    // Chỉ học nền khi đang IM — học cả lúc có người nói thì giọng nói
    // tự đẩy ngưỡng lên và câu sau bị bỏ qua.
    if (!loud) noiseFloor += (micLevel - noiseFloor) / 64;

    // Đếm chuỗi khối to liên tiếp. To một hai khối rồi tắt = tiếng
    // động, không phải người nói.
    loudRun = loud ? (uint8_t)(loudRun + 1) : 0;

    if (loudRun < VAD_OPEN_BLOCKS) {
      pushPreroll(pcmBlock);
      return;
    }
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
int32_t gate() { return vadGate(); }
uint32_t lastClipBytes() { return lastClip; }

}  // namespace audio
