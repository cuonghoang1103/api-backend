/**
 * ============================================================
 * Maker Lab — lọc câu Whisper BỊA
 * ============================================================
 *
 * Whisper không bao giờ trả về "tôi không nghe thấy gì". Cho nó nghe
 * tiếng quạt, nó vẫn phải sinh ra chữ — và chữ nó sinh ra là thứ nó
 * gặp nhiều nhất lúc huấn luyện. Dữ liệu huấn luyện tiếng Việt phần
 * lớn là phụ đề YouTube, nên tiếng ồn biến thành:
 *
 *   "Hãy subscribe cho kênh Ghiền Mì Gõ để không bỏ lỡ video hấp dẫn"
 *   "Cảm ơn các bạn đã xem video, hẹn gặp lại ở video tiếp theo"
 *   "Ừ, ừ, ừ..."   ·   "..."   ·   "[nhạc]"
 *
 * Người dùng nghe robot tự nhiên nói "đừng quên đăng ký kênh" và kết
 * luận là con AI bị ngu. Nó không ngu — nó đang trả lời rất tử tế một
 * câu hỏi mà không ai từng hỏi. Đổi sang model mạnh hơn cũng vô ích,
 * vì lỗi nằm trước LLM một bước.
 *
 * Hai tầng, vì một tầng không đủ:
 *
 *   1. `no_speech_prob` — chính Whisper tự chấm khả năng đoạn tiếng
 *      này KHÔNG có người nói. Đây là chỗ duy nhất model chịu thừa
 *      nhận nó đang đoán; phần chữ thì lúc nào cũng tự tin như nhau.
 *      Bắt được phần lớn, và bắt đúng nguyên nhân.
 *
 *   2. Danh sách mẫu câu — bắt nốt phần lọt lưới. Cứng nhắc và phải
 *      bổ sung dần, nhưng những câu này KHÔNG BAO GIỜ là thứ người ta
 *      nói với robot để bàn, nên chặn nhầm gần như không xảy ra.
 */

/**
 * Trên mức này coi như không có tiếng người.
 *
 * 0,6 chứ không phải 0,5: đặt quá thấp thì câu nói thật trong phòng
 * ồn cũng bị vứt, mà bỏ sót một câu người dùng đã nói khó chịu hơn
 * nhiều so với thỉnh thoảng lọt một câu bịa.
 */
const NO_SPEECH_MAX = 0.6;

/** Dưới mức này là model đoán mò chứ không phải nghe ra. */
const AVG_LOGPROB_MIN = -1.0;

/**
 * Mẫu câu Whisper hay bịa. Gom từ phụ đề YouTube — cả tiếng Việt lẫn
 * tiếng Anh, vì model trượt sang tiếng Anh khi tín hiệu quá yếu.
 */
const BOILERPLATE = [
  // YouTube tiếng Việt
  /subscribe/i,
  /đăng ký kênh/i,
  /like\s*(,|và|and)?\s*share/i,
  /bấm chuông/i,
  /ghiền mì gõ/i,
  /cảm ơn các bạn đã (xem|theo dõi)/i,
  /hẹn gặp lại (các bạn )?(ở|trong) video/i,
  /video (tiếp theo|hấp dẫn|sau)/i,
  /không bỏ lỡ/i,
  /kênh của (tôi|mình|chúng tôi)/i,
  // YouTube tiếng Anh
  /thanks? (you )?for watching/i,
  /don'?t forget to subscribe/i,
  /see you (in the )?next video/i,
  /subtitles? by/i,
  /amara\.org/i,
  // Nhãn phi lời nói
  /^\s*[\[(【]?\s*(nhạc|music|âm nhạc|applause|vỗ tay|tiếng cười|laughter)\s*[\])】]?\s*$/i,
  /^[\s.,!?…♪♫\-–—]*$/,
];

/** Câu quá ngắn thì không đủ chất liệu để tin. */
const MIN_CHARS = 3;

export interface SpeechCheck {
  ok: boolean;
  /** Vì sao bỏ — ghi vào log để còn chỉnh ngưỡng bằng số liệu thật. */
  reason?: string;
}

export function checkHeardSpeech(
  text: string,
  stats: { noSpeechProb?: number; avgLogprob?: number } = {},
): SpeechCheck {
  const t = text.trim();

  if (t.length < MIN_CHARS) return { ok: false, reason: `quá ngắn (${t.length} ký tự)` };

  if (typeof stats.noSpeechProb === 'number' && stats.noSpeechProb > NO_SPEECH_MAX)
    return { ok: false, reason: `Whisper tự chấm không có tiếng người (${stats.noSpeechProb.toFixed(2)})` };

  if (typeof stats.avgLogprob === 'number' && stats.avgLogprob < AVG_LOGPROB_MIN)
    return { ok: false, reason: `độ tin cậy giải mã quá thấp (${stats.avgLogprob.toFixed(2)})` };

  for (const re of BOILERPLATE)
    if (re.test(t)) return { ok: false, reason: `khớp mẫu phụ đề YouTube (${re.source.slice(0, 40)})` };

  // Một chữ lặp lại mãi — dạng bịa kinh điển khi gặp tiếng ồn đều đều.
  const words = t.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length >= 4 && new Set(words).size === 1)
    return { ok: false, reason: `lặp một chữ ${words.length} lần` };

  return { ok: true };
}
