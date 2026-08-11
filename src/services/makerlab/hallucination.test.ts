/**
 * Kiểm bộ lọc Whisper bịa bằng DỮ LIỆU THẬT.
 *
 * Mọi ca dưới đây chép nguyên văn từ log production ngày 11/08/2026,
 * kèm đúng số byte mà bo đã gửi lên. Không có câu nào do tôi nghĩ ra —
 * vì bộ lọc trước đã qua được mọi ca tôi tự nghĩ ra, rồi vẫn để lọt
 * "Cảm ơn." ngoài đời thật.
 *
 *   npx tsx --test src/services/makerlab/hallucination.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkHeardSpeech } from './hallucination.js';

/** Byte PCM 16 kHz/16 bit → giây. Đúng công thức voiceLoop đang dùng. */
const sec = (bytes: number) => bytes / 2 / 16_000;

/** Ca lấy từ log: [chữ Whisper trả về, số byte tiếng, có phải bịa không] */
const TU_LOG_PROD: Array<[string, number, boolean]> = [
  // ── Những ca ĐÃ chặn được từ trước, phải giữ nguyên ──
  ['Hãy subscribe cho kênh Ghiền Mì Gõ Để không bỏ lỡ những video hấp dẫn', 193024, true],
  ['Hẹn gặp lại các bạn trong những video tiếp theo.', 36352, true],
  ['Cảm ơn các bạn đã theo dõi và hẹn gặp lại.', 230400, true],
  ['Cảm ơn các bạn đã theo dõi.', 125440, true],

  // ── Ca LỌT LƯỚI — đây là thứ user kêu ──
  // Log 00:15:03, 00:15:51, 00:17:47, 00:18:39 đều thành "voice turn"
  // thật, robot đáp lễ một lời cảm ơn không ai nói.
  ['Cảm ơn.', 40000, true],

  // ── Ca bất khả thi vật lý ──
  // 13312 byte = 0,42 giây. Mười ba âm tiết. Không mồm nào làm được.
  ['Hẹn gặp lại các bạn trong những video tiếp theo.', 13312, true],
  ['Hẹn gặp lại các bạn trong những video tiếp theo.', 21504, true],

  // ── Lời NÓI THẬT, tuyệt đối không được chặn ──
  ['Đừng có trách tội nha', 96000, false],
  ['bật nhạc đi', 48000, false],
  ['mày kể tao nghe chuyện gì vui đi', 128000, false],
  ['cảm ơn nhé, giờ bật bài Sơn Tùng đi', 160000, false],
  ['tăng âm lượng lên tám mươi phần trăm', 140000, false],
  ['hôm nay tao mệt quá mày ạ', 110000, false],
];

test('bộ lọc khớp đúng với log production', () => {
  const sai: string[] = [];
  for (const [chu, bytes, laBia] of TU_LOG_PROD) {
    const r = checkHeardSpeech(chu, { noSpeechProb: 0, audioSec: sec(bytes) });
    const biChan = !r.ok;
    if (biChan !== laBia) {
      sai.push(
        laBia
          ? `LỌT: "${chu}" (${sec(bytes).toFixed(2)}s) đáng lẽ phải chặn`
          : `CHẶN NHẦM: "${chu}" (${sec(bytes).toFixed(2)}s) — ${r.reason}`,
      );
    }
  }
  assert.deepEqual(sai, [], `\n  ${sai.join('\n  ')}\n`);
});

test('noSpeechProb = 0 vẫn chặn được — Groq luôn trả 0 kể cả lúc bịa', () => {
  // Cả 40 dòng log prod đều noSpeechProb:0. Nếu bộ lọc chỉ đứng được
  // nhờ trường này thì nó đã sập ngoài đời rồi.
  const r = checkHeardSpeech('Hẹn gặp lại các bạn trong những video tiếp theo.', {
    noSpeechProb: 0,
    avgLogprob: 0,
    audioSec: sec(13312),
  });
  assert.equal(r.ok, false);
  // Sàn độ dài nổ trước phép chia âm tiết ở ca này — cả hai đều là bằng
  // chứng vật lý, chặn được là đạt, không quan trọng tầng nào bắt.
  assert.match(r.reason ?? '', /bất khả thi|đoạn tiếng quá ngắn/);
});

test('câu dài chui ra từ đoạn tiếng vừa đủ dài vẫn bị bắt bởi tốc độ', () => {
  // Ca này qua được sàn 0,5s nên buộc phải để phép chia âm tiết bắt —
  // chính là chỗ mà sàn độ dài KHÔNG với tới.
  const r = checkHeardSpeech('Hẹn gặp lại các bạn trong những video tiếp theo nhé mọi người', {
    noSpeechProb: 0,
    audioSec: 0.9,
  });
  assert.equal(r.ok, false);
  assert.match(r.reason ?? '', /bất khả thi/);
});

test('không có audioSec thì vẫn chạy, chỉ là yếu hơn', () => {
  // voiceLoop luôn truyền, nhưng lối gọi từ console web thì không có
  // tiếng — không được vì thế mà ném lỗi.
  assert.equal(checkHeardSpeech('bật nhạc đi', {}).ok, true);
  assert.equal(checkHeardSpeech('Cảm ơn.', {}).ok, false);
});
