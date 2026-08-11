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
 * ── Bài học 11/08/2026: ĐỪNG tin `no_speech_prob` ──────────
 *
 * Bản đầu dựng quanh `no_speech_prob`, vì trên giấy đó là chỗ duy nhất
 * model chịu thừa nhận nó đang đoán. Log production nói ngược lại —
 * bốn mươi dòng bịa liên tiếp, TẤT CẢ đều `noSpeechProb: 0.00`:
 *
 *   "heard":"Hẹn gặp lại các bạn trong những video tiếp theo."
 *   "noSpeechProb":0,"bytes":13312
 *
 * 13.312 byte ở 16 kHz/16 bit là **0,42 giây**. Không ai đọc được câu
 * mười ba âm tiết trong 0,42 giây. Whisper vừa bịa nguyên một câu vừa
 * chấm cho mình 0% khả năng "không có tiếng người".
 *
 * Nên tầng đó còn giữ lại (không tốn gì, và có ngày Groq sẽ trả số
 * thật) nhưng KHÔNG được là chỗ dựa. Ba tầng thay nó:
 *
 *   1. BẤT KHẢ THI VẬT LÝ — số âm tiết chia cho số giây. Miệng người
 *      có trần tốc độ; câu dài chui ra từ đoạn tiếng ngắn là bịa, và
 *      đây là bằng chứng cứng chứ không phải danh sách từ khoá phải
 *      đuổi theo mãi.
 *
 *   2. SÀN ĐỘ DÀI — đoạn ngắn hơn nửa giây không chứa nổi một câu
 *      lệnh nào. Chặn TRƯỚC khi gọi Whisper còn tiết kiệm được cả
 *      hạn mức Groq.
 *
 *   3. Danh sách mẫu câu — bắt nốt phần lọt lưới, gồm cả dạng CỤT
 *      ("Cảm ơn." trơ trọi), thứ đã lọt suốt vì mẫu cũ đòi phải có đủ
 *      "cảm ơn các bạn đã xem".
 */

/**
 * Trên mức này coi như không có tiếng người.
 *
 * Thực tế Groq trả 0 kể cả lúc bịa trắng trợn, nên tầng này gần như
 * không bao giờ nổ. Giữ lại vì nó đúng về mặt nguyên lý và không tốn
 * gì — nhưng đừng bao giờ tính nó là một lớp bảo vệ.
 */
const NO_SPEECH_MAX = 0.6;

/**
 * Trần tốc độ nói, âm tiết mỗi giây.
 *
 * Tiếng Việt bình thường 4-6 âm tiết/giây, nói nhanh chạm 7-8. Đặt 9
 * là đã nới rất rộng: vượt qua mức này thì không phải người nói nhanh,
 * mà là chữ không đến từ đoạn tiếng đó. Tiếng Việt viết rời từng âm
 * tiết nên đếm chữ cách nhau bằng khoảng trắng là đếm đúng âm tiết.
 */
const MAX_SYLLABLES_PER_SEC = 9;

/**
 * Ngắn hơn mức này thì không chứa nổi câu lệnh nào.
 *
 * "bật nhạc đi" mất khoảng một giây. Nửa giây chỉ đủ một tiếng động —
 * mà một tiếng động thì Whisper luôn biến thành phụ đề YouTube.
 */
const MIN_SPEECH_SEC = 0.5;

/**
 * Câu xã giao TRƠ TRỌI — nghĩa là cả đoạn chỉ có đúng chừng này chữ.
 *
 * Đây là dạng bịa hay gặp nhất và cũng khó chịu nhất: robot đáp lễ một
 * lời cảm ơn không ai nói, lặp đi lặp lại. Chặn nguyên câu chứ không
 * chặn từ "cảm ơn", nên "cảm ơn nhé, giờ bật nhạc đi" vẫn chạy bình
 * thường.
 *
 * Đánh đổi có thật: nói đúng hai chữ "cảm ơn" rồi thôi thì robot sẽ
 * lờ đi. Đổi lại là hết hẳn kiểu tự dưng đáp lễ giữa lúc yên tĩnh —
 * mà cái đó xảy ra hàng chục lần mỗi giờ.
 */
const BARE_PLEASANTRIES = [
  /^(xin )?(cảm|cám) ơn( (bạn|nhé|nha|ạ|nhiều|các bạn))*$/i,
  /^(thank you|thanks|thank you very much)$/i,
  /^hẹn gặp lại( các bạn)?$/i,
  /^(ừ|à|ờ|ok|okay|vâng|dạ)$/i,
];

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
  // Dạng cụt — chính những câu này lọt lưới suốt vì mẫu ở trên đòi đủ
  // vế. Log prod 11/08 bắt được cả ba.
  /^(cảm|cám) ơn các bạn( đã)?[.!…]*$/i,
  /^hẹn gặp lại các bạn/i,
  /chúc các bạn (xem )?(vui vẻ|ngon miệng)/i,
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
  stats: {
    noSpeechProb?: number;
    avgLogprob?: number;
    /** Độ dài đoạn tiếng đã gửi đi nhận dạng, tính bằng giây. */
    audioSec?: number;
  } = {},
): SpeechCheck {
  const t = text.trim();

  if (t.length < MIN_CHARS) return { ok: false, reason: `quá ngắn (${t.length} ký tự)` };

  // ── Tầng 1: bất khả thi vật lý ──
  //
  // Đặt TRƯỚC mọi thứ khác vì đây là bằng chứng cứng nhất, và nó không
  // cần biết Whisper bịa ra câu gì — chỉ cần biết miệng người không đọc
  // nổi chừng đó chữ trong chừng đó thời gian.
  const amTiet = t.split(/\s+/).filter(Boolean).length;
  if (typeof stats.audioSec === 'number' && stats.audioSec > 0) {
    if (stats.audioSec < MIN_SPEECH_SEC)
      return { ok: false, reason: `đoạn tiếng quá ngắn (${stats.audioSec.toFixed(2)}s)` };

    const tocDo = amTiet / stats.audioSec;
    if (tocDo > MAX_SYLLABLES_PER_SEC)
      return {
        ok: false,
        reason: `bất khả thi: ${amTiet} âm tiết trong ${stats.audioSec.toFixed(2)}s (${tocDo.toFixed(1)} âm tiết/giây)`,
      };
  }

  // ── Tầng 2: câu xã giao trơ trọi ──
  for (const re of BARE_PLEASANTRIES)
    if (re.test(t.replace(/[.!?…,]+$/, '').trim()))
      return { ok: false, reason: `câu xã giao trơ trọi ("${t.slice(0, 24)}")` };

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
