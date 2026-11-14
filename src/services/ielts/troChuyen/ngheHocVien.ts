/**
 * NGHE người học trong cuộc gọi CuongMini (14/11/2026 — app CT Language, user: "mình nói tiếng Nhật nó lại ra tiếng
 * Anh… nhiều lúc nó cứ ra 'Thank you for watching'").
 *
 * Trước: một lượt Whisper TỰ DÒ ngôn ngữ (`language: ''`). Hai lỗi cùng gốc:
 *   1. Tiếng Nhật/Trung của người Việt mới học (giọng lơ lớ, câu ngắn) bị dò thành tiếng Anh ⇒ chữ ra là "dịch bừa".
 *   2. Ghi âm im lặng / ồn nền ⇒ Whisper không bao giờ nói "không nghe thấy" mà BỊA câu hay gặp nhất trong dữ liệu
 *      huấn luyện — phụ đề YouTube: "Thank you for watching.", "ご視聴ありがとうございました", "请不吝点赞 订阅".
 *      Câu bịa trông tự tin y như thật, AI trả lời câu bịa ⇒ cuộc gọi lạc đề.
 *
 * Nay:
 *   · Lượt 1 tự dò + `verbose_json` (lấy `language`, `no_speech_prob`). Dò ra đúng ngoại ngữ đang học HOẶC tiếng Việt
 *     (người học hỏi lại bằng tiếng Việt là chuyện thường) ⇒ dùng luôn.
 *   · Dò ra thứ tiếng KHÁC ⇒ lượt 2 ÉP `language` = ngoại ngữ đang học. Chỉ tốn thêm một lời gọi ở đúng ca lỗi.
 *   · Lọc câu bịa (mẫu phụ đề ba thứ tiếng + Việt, `no_speech_prob` cao) ⇒ trả '' ⇒ phòng nói "chưa nghe rõ" + hoàn lượt.
 */
import { transcribeWithGroq, type TranscriptResult } from '../../interview/voice/stt.js';

export type NnNghe = 'en' | 'ja' | 'zh';

/** Groq trả tên ngôn ngữ đầy đủ ("japanese") ở `verbose_json`; đôi khi là mã ("ja"). */
const TEN: Record<string, string> = {
  english: 'en', en: 'en', japanese: 'ja', ja: 'ja', chinese: 'zh', zh: 'zh', mandarin: 'zh', cantonese: 'zh', yue: 'zh',
  vietnamese: 'vi', vi: 'vi',
};
export const maNgonNgu = (ten?: string): string => TEN[String(ten ?? '').toLowerCase().trim()] ?? String(ten ?? '').toLowerCase().trim();

/** Ngưỡng `no_speech_prob` trung bình: trên mức này Whisper tự nhận đoạn tiếng không có người nói. */
const KHONG_LOI_MAX = 0.6;

const MAU_BIA: RegExp[] = [
  // Phụ đề YouTube tiếng Anh
  /thanks?\s*(you\s*)?(so much\s*)?for\s*watching/i,
  /(please\s*)?(like\s*(and|&)\s*)?subscribe/i,
  /see you (in the )?next (video|time)/i,
  /subtitles?\s*(by|created)/i,
  /amara\.org/i,
  // Nhật
  /ご視聴(いただき)?(、)?ありがとうございました/,
  /チャンネル登録/,
  /最後まで(ご覧|ご視聴)/,
  /(字幕|翻訳)(:|：|は)/,
  // Trung
  /(请|請)不吝(点赞|點讚)/,
  /(订阅|訂閱).{0,6}(转发|轉發)/,
  /(谢谢|謝謝|感谢|感謝)(大家)?(观看|觀看|收看)/,
  /(明镜|明鏡)(与|與)?(点点|點點)/,
  /字幕(由|提供|志愿者)/,
  // Việt
  /(cảm|cám) ơn các bạn đã (xem|theo dõi)/i,
  /đăng ký kênh/i,
  /hẹn gặp lại (các bạn )?(ở|trong) (video|tập)/i,
  // Nga (đã gặp thật trên robot 13/08/2026)
  /продолжение следует/i,
  // Nhãn phi lời nói / chỉ dấu câu
  /^\s*[[(（【]?\s*(music|音楽|音乐|nhạc|applause|拍手|鼓掌|laughter|笑)\s*[\])）】]?\s*$/i,
  /^[\s.,!?…♪♫\-–—。、！？「」]*$/,
];

/** `true` = chữ này là Whisper bịa chứ không phải người học nói. Thuần — test được. */
export function laCauBia(text: string, kq?: Pick<TranscriptResult, 'noSpeechProb'>): boolean {
  const t = text.trim();
  if (!t) return true;
  if (typeof kq?.noSpeechProb === 'number' && kq.noSpeechProb > KHONG_LOI_MAX) return true;
  return MAU_BIA.some((re) => re.test(t));
}

/** Có cần nghe lại với `language` ép về ngoại ngữ đang học không. */
export function canEpNgonNgu(daDo: string | undefined, nn: NnNghe): boolean {
  if (!daDo) return false;
  const m = maNgonNgu(daDo);
  return m !== nn && m !== 'vi';
}

type Nghe = (audio: Buffer, ten: string, mime: string, o: { language: string; hints?: string; detail?: boolean }) => Promise<TranscriptResult>;

export async function ngheHocVien(audio: Buffer, ten: string, mime: string, hints: string, nn: NnNghe, nghe: Nghe = transcribeWithGroq): Promise<string> {
  const goi = (language: string) => nghe(audio, ten, mime, { language, detail: true, ...(hints ? { hints } : {}) });
  let kq = await goi('');
  if (canEpNgonNgu(kq.language, nn)) {
    const lai = await goi(nn).catch(() => null);
    if (lai) kq = lai;
  }
  const text = String(kq.text ?? '').trim();
  return laCauBia(text, kq) ? '' : text;
}
