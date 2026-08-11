#pragma once
/**
 * ============================================================
 * Mini-Me Robot — đường tiếng (nghe + nói)
 * ============================================================
 *
 * Gói trọn hai chiều âm thanh vào một chỗ, vì chúng KHÔNG độc lập:
 * lúc loa đang nói thì mic phải câm. Robot nghe thấy chính nó là
 * nghe thấy một câu hoàn chỉnh, đúng ngưỡng, đúng khoảng lặng — nó
 * sẽ trả lời chính mình rồi lại nghe thấy câu trả lời đó, cứ thế
 * đến hết pin. Để hai đường ở hai file thì cái ràng buộc này nằm
 * lửng lơ giữa chúng và sớm muộn cũng bị quên.
 *
 * Cách dùng trong main:
 *
 *     audio::onTurnStart(...)   // VAD thấy có người nói
 *     audio::onChunk(...)       // từng khối PCM 16 bit gửi lên server
 *     audio::onTurnEnd(...)     // im lặng đủ lâu → chốt lượt
 *     audio::begin();
 *     ...
 *     audio::loop();            // gọi mỗi vòng loop()
 *
 * Chiều ngược lại, khi server gửi tiếng nói xuống:
 *
 *     audio::playBegin(16000);  // gói say_start
 *     audio::playPush(...)      // mỗi khung nhị phân
 *     audio::playEnd();         // gói say_end → bắt đầu phát
 */

#include <Arduino.h>

namespace audio {

typedef void (*ChunkFn)(const uint8_t* data, size_t len);
typedef void (*EventFn)();

/** Cài cả hai driver I2S. false = không cài được (xem Serial). */
bool begin();

/** Bơm cả hai chiều. Phải gọi mỗi vòng loop(), không được bỏ nhịp. */
void loop();

void onTurnStart(EventFn fn);
void onChunk(ChunkFn fn);
void onTurnEnd(EventFn fn);

// ─── Phát ────────────────────────────────────────────────
/** Mở một đoạn phát mới. Mic câm ngay từ đây. */
void playBegin(uint32_t sampleRate);
/** Nhận thêm byte PCM. false = đệm đầy, phần thừa bị bỏ. */
bool playPush(const uint8_t* data, size_t len);
/** Hết dữ liệu → bắt đầu đẩy ra loa. */
void playEnd();
/** Cắt ngang (người dùng chen lời). */
void playStop();

/**
 * Âm lượng loa 10-100%. Kẹp trong khoảng đó chứ không cho về 0:
 * "0%" nghe y hệt robot hỏng, mà người ta bảo "nhỏ hết cỡ" là muốn
 * nhỏ chứ không phải câm.
 */
void setVolume(uint8_t pct);
uint8_t volume();

/**
 * Tiếng bíp báo hiệu, phát ngay tại bo.
 * `loudness` 0-100 là mức so với âm lượng đang đặt — tiếng báo nên
 * nhỏ hơn giọng nói, nó là dấu hiệu chứ không phải nội dung.
 */
void beep(uint16_t freq, uint16_t ms, uint8_t loudness = 45);

// ─── Xem trạng thái (cho màn hình) ───────────────────────
bool speaking();
bool listening();

/**
 * Ép mở một lượt nghe ngay, bỏ qua ngưỡng VAD.
 *
 * Dùng cho nút chạm ở đầu robot. VAD phải ĐOÁN xem người ta có đang nói
 * với mình không, và đoán thì có lúc sai — user đã báo ba lần "nói hai
 * ba lần nó mới nghe". Chạm vào đầu thì không còn gì phải đoán.
 *
 * Không thay VAD, chỉ là đường tắt. Đang nghe dở thì không làm gì.
 */
void moLuotNgay();
/** Mức mic gần nhất, thang 24 bit — cùng thang với VAD_THRESHOLD. */
int32_t level();
/** Nền ồn phòng đang tự học được (cùng thang). */
int32_t noise();

/**
 * Chẩn đoán mic. Ba con số này phân biệt "phòng ồn" với "mic hỏng",
 * điều mà mức trung bình một mình không làm được:
 *   dc()         lệch một chiều — mic có điện áp nền chứ không phải tiếng
 *   peakRaw()    đỉnh khối gần nhất; sát 8.388.608 là đang đọc rác
 *   clipBlocks() số khối từng chạm nửa trần, cộng dồn từ lúc bật
 */
int32_t dc();
/** Mức TRƯỚC lọc hạ tần — so với level() thì biết bộ lọc gánh bao nhiêu. */
int32_t rawLevel();
int32_t peakRaw();
uint32_t clipBlocks();
/** Số mẫu bị xén khi đóng gói 16 bit, cộng dồn. Khác 0 là tiếng đã méo. */
uint32_t clippedSamples();
/** Ngưỡng VAD hiện tại = nền × 3, đã kẹp. Vượt mức này là mở lượt nghe. */
int32_t gate();
/** Số byte của đoạn phát gần nhất, để hiện lên màn. */
uint32_t lastClipBytes();
/** Số lần và tổng thời gian đệm cạn trong đoạn vừa phát. */
uint32_t lastUnderruns();
uint32_t lastUnderrunMs();

}  // namespace audio
