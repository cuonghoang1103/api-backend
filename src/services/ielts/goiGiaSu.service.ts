/**
 * 📞 LUYỆN PHÁT ÂM CÙNG GIA SƯ BẰNG GIỌNG — gia sư dạy phát âm tiếng Anh
 * BẰNG TIẾNG VIỆT, nói chuyện qua loa/micro (03/10/2026).
 * ─────────────────────────────────────────────────────────────────────────
 * Hai loại lượt — vì cổng AI duy nhất dùng được (modelapi) mất 8–12 giây mỗi
 * câu trả lời (đo 03/10 với claude-sonnet-5 / sonnet-4-6 / gpt-6-sol; haiku
 * không có trên cổng). Gọi AI mỗi lượt thì cuộc gọi chết đứng 10 giây một lần.
 *
 *  1. LƯỢT LUYỆN (~2–3 giây, KHÔNG gọi AI): người học đọc câu mẫu → song song
 *     Whisper (nghe ra chữ, tự nhận Việt/Anh) + Azure chấm từng âm → câu nhận
 *     xét tiếng Việt soạn sẵn theo ĐÚNG âm yếu nhất (tên âm gắn từ IPA của câu
 *     mẫu, mẹo khẩu hình ở MEO bên dưới) → câu mẫu kế tiếp từ danh sách.
 *  2. LƯỢT HỎI (~10 giây, có AI): Whisper nghe ra TIẾNG VIỆT và không giống câu
 *     mẫu ⇒ người học đang hỏi. Trả `loai: 'hoi'` ngay để web nói câu đệm, rồi
 *     web gọi `hoiGiaSu()` (AI trả lời ngắn, cũng bằng tiếng Việt).
 *
 * Giọng gia sư: Azure en-GB-AdaMultilingualNeural, SSML đổi <lang> theo đoạn
 * [en]…[/en]. Đo 03/10 bằng "đọc rồi nghe lại": giọng Việt thuần (HoaiMy) đọc
 * "think" thành "thiên"; giọng đa ngôn ngữ: phần Việt nghe lại gần nguyên văn,
 * phần Anh đúng từng từ. Tệp lưu R2 theo băm nội dung — câu nhận xét lặp lại
 * nhiều (khen, mẹo cố định) nên lần sau phát tức thì. Câu MẪU để đọc theo thì
 * web phát bằng giọng Anh của khoá (POST /ielts/doc, Sonia).
 *
 * Âm thanh của người học KHÔNG lưu.
 */
import crypto from 'node:crypto';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { objectExists, putObject, buildPublicUrl } from '../../config/r2.js';
import { isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { transcribeWithGroq } from '../interview/voice/stt.js';
import { chamPhatAm, type KetQuaPhatAm } from './phatAm.service.js';
import { synthesizeCuongMini } from '../makerlab/tts.js';
import { logger } from '../../utils/logger.js';

const GIONG_GIA_SU = 'en-GB-AdaMultilingualNeural';

/* ── Thứ tiếng của cuộc gọi (05/10/2026: khoá JP + CH) ───────────────────
 * Cùng một cuộc gọi CuongMini cho ba khoá. `[en]…[/en]` trong lời gia sư giữ
 * nguyên tên (đã dùng khắp nơi) nhưng nghĩa là "đoạn NGOẠI NGỮ của khoá" — đọc
 * bằng locale/giọng của thứ tiếng đó. Ada Multilingual đọc được cả ja-JP, zh-CN. */
export type NgonNgu = 'en' | 'ja' | 'zh';
export function docNgonNgu(x: unknown): NgonNgu { return x === 'ja' || x === 'zh' ? x : 'en'; }
const LOCALE: Record<NgonNgu, string> = { en: 'en-GB', ja: 'ja-JP', zh: 'zh-CN' };
/** Giọng đọc ĐOẠN ngoại ngữ khi gia sư dùng giọng máy nhà (F5 chỉ đọc tiếng Việt). */
const GIONG_NGOAI: Record<NgonNgu, string> = { en: 'en-GB-SoniaNeural', ja: 'ja-JP-NanamiNeural', zh: 'zh-CN-XiaoxiaoNeural' };
const TEN_TIENG: Record<NgonNgu, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung' };
/** Bỏ furigana/pinyin dạng `{漢字|かな}` → chữ gốc (Azure cần câu mẫu trần). */
export const chuTran = (s: string) => s.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
const TRAN_NGAY = 300;
const daGoi = new Map<string, number>();
function demLuot(userId: number) {
  const k = `${userId}:${new Date().toISOString().slice(0, 10)}`;
  const n = (daGoi.get(k) ?? 0) + 1;
  if (n > TRAN_NGAY) return false;
  daGoi.set(k, n);
  if (daGoi.size > 5000) daGoi.clear();
  return true;
}

/* ── Câu mẫu ─────────────────────────────────────────────────────────── */

export type CauMau = { text: string; ipa?: string };

/** Ngân hàng mặc định khi bài đang mở không có khối luyện phát âm — từ dễ tới khó, phủ lỗi người Việt hay mắc. */
const NGAN_HANG: CauMau[] = [
  { text: 'My name is Lan.', ipa: 'maɪ neɪm ɪz læn' },
  { text: 'I like books.', ipa: 'aɪ laɪk bʊks' },
  { text: 'Go home.', ipa: 'ɡəʊ həʊm' },
  { text: 'Sit in this seat.', ipa: 'sɪt ɪn ðɪs siːt' },
  { text: 'I think so.', ipa: 'aɪ θɪŋk səʊ' },
  { text: 'She works here.', ipa: 'ʃi wɜːks hɪə' },
  { text: 'They love their job.', ipa: 'ðeɪ lʌv ðeə dʒɒb' },
  { text: 'He watches TV at night.', ipa: 'hi wɒtʃɪz tiːviː ət naɪt' },
  { text: 'I live in a big city.', ipa: 'aɪ lɪv ɪn ə bɪɡ sɪti' },
  { text: 'Three friends played football.', ipa: 'θriː frendz pleɪd fʊtbɔːl' },
  { text: 'I go home by train every day.', ipa: 'aɪ ɡəʊ həʊm baɪ treɪn evri deɪ' },
  { text: 'The bird heard a word.', ipa: 'ðə bɜːd hɜːd ə wɜːd' },
];

/** Ngân hàng mặc định khoá JP / CH — câu chào hỏi cơ bản, từ dễ tới khó. */
const NGAN_HANG_NN: Record<'ja' | 'zh', CauMau[]> = {
  ja: [
    { text: 'こんにちは。' }, { text: 'ありがとうございます。' }, { text: 'はじめまして。' },
    { text: 'わたしはベトナムじんです。' }, { text: 'よろしくおねがいします。' }, { text: 'すみません、もういちどおねがいします。' },
    { text: 'これはなんですか。' }, { text: 'がっこうはどこですか。' }, { text: 'まいにちにほんごをべんきょうします。' },
    { text: 'きのう、ともだちとえいがをみました。' },
  ],
  zh: [
    { text: '你好！' }, { text: '谢谢！' }, { text: '再见！' }, { text: '我是越南人。' }, { text: '你叫什么名字？' },
    { text: '我叫小明。' }, { text: '很高兴认识你。' }, { text: '这是什么？' }, { text: '我每天学习汉语。' },
    { text: '我想喝一杯茶。' },
  ],
};

/** Mẹo chung khi không biết đúng âm nào sai (tiếng Nhật/Trung: Azure không trả tên âm dùng được). */
const MEO_NN: Record<'ja' | 'zh', string[]> = {
  ja: [
    'Chú ý độ dài âm: âm kéo dài như おう, ええ phải giữ đủ hai nhịp.',
    'Âm ngắt っ là một nhịp lặng ngắn, đừng bỏ qua nó.',
    'Đọc đều từng nhịp, tiếng Nhật không lên xuống mạnh như tiếng Việt.',
    'Âm ん là một nhịp riêng, giữ hơi mũi đủ lâu.',
  ],
  zh: [
    'Chú ý thanh điệu: thanh 1 giữ cao và phẳng, thanh 4 hạ mạnh từ cao xuống.',
    'Thanh 3 hạ thấp rồi mới lên; đứng trước thanh 3 khác thì đọc thành thanh 2.',
    'Phân biệt zh, ch, sh (uốn lưỡi) với z, c, s (đầu lưỡi thẳng).',
    'Âm ü đọc như u nhưng môi tròn và lưỡi đẩy về trước, gần giống uy.',
  ],
};

/* ── Tên âm & mẹo khẩu hình ──────────────────────────────────────────── */

const GHEP = ['eɪ', 'aɪ', 'ɔɪ', 'aʊ', 'əʊ', 'oʊ', 'ɪə', 'eə', 'ʊə', 'tʃ', 'dʒ'];
/** Giống tachAm của web (PhatAm.tsx): nhị trùng âm, tʃ/dʒ, nguyên âm dài là MỘT âm. */
export function tachAm(ipa: string): string[] {
  const t = ipa.replace(/[ˈˌ./]/g, '');
  const out: string[] = [];
  for (let i = 0; i < t.length;) {
    let a = GHEP.find((x) => t.startsWith(x, i)) ?? t[i];
    i += a.length;
    if (t[i] === 'ː') { a += 'ː'; i += 1; }
    out.push(a);
  }
  return out;
}

/** Mẹo khẩu hình — lời NÓI (không ký hiệu). */
const MEO: Record<string, string> = {
  'θ': 'Âm th trong từ này: đặt đầu lưỡi giữa hai hàm răng rồi thổi hơi ra, cổ không rung. Đừng đọc thành t hay s.',
  'ð': 'Âm th trong từ này rung cổ: đầu lưỡi giữa hai hàm răng, thổi hơi và để cổ họng rung. Đừng đọc thành d hay z.',
  's': 'Âm s: để hơi xì ra rõ, nhất là ở cuối từ, đừng nuốt mất.',
  'z': 'Âm z: rung cổ như tiếng ong vo ve, đừng bỏ mất.',
  't': 'Âm t: chạm đầu lưỡi lên lợi trên rồi bật nhẹ, đừng nuốt mất.',
  'd': 'Âm d: chạm đầu lưỡi lên lợi trên và rung nhẹ, đừng bỏ.',
  'k': 'Âm k: chặn hơi ở cuống lưỡi rồi bật nhẹ ra, đừng nuốt.',
  'ɡ': 'Âm g: chặn ở cuống lưỡi, rung cổ, bật ra rõ.',
  'p': 'Âm p: mím môi rồi bật hơi ra.',
  'b': 'Âm b: mím môi, rung cổ rồi bật ra.',
  'm': 'Âm m: khép hai môi lại và giữ một chút, đừng bỏ lửng.',
  'n': 'Âm n: chạm đầu lưỡi lên lợi trên và giữ, đừng biến thành ng.',
  'ŋ': 'Âm ng: cuống lưỡi chạm vòm mềm, giữ hơi qua mũi, đừng bật thêm g.',
  'l': 'Âm l: đầu lưỡi chạm lợi trên; l ở cuối từ phải giữ lưỡi lại, đừng bỏ.',
  'r': 'Âm r tiếng Anh: cong lưỡi lùi vào trong, không chạm vòm miệng, không rung lưỡi.',
  'v': 'Âm v: răng trên chạm nhẹ môi dưới và rung cổ, đừng đọc thành b.',
  'f': 'Âm f: răng trên chạm môi dưới, thổi hơi ra.',
  'w': 'Âm w: chu tròn môi rồi mở ra nhanh.',
  'ʃ': 'Âm sh: chu môi về trước và đẩy hơi ra, nghe như suỵt.',
  'tʃ': 'Âm ch tiếng Anh: chu môi, chặn lưỡi rồi bật ra mạnh.',
  'dʒ': 'Âm j: chu môi, chặn lưỡi rồi bật ra có rung cổ.',
  'h': 'Âm h: thở hơi ra nhẹ từ cổ họng.',
  'j': 'Âm y: miệng như cười, lướt nhanh sang nguyên âm sau.',
  'iː': 'Âm i dài: kéo hai khoé môi sang bên như đang cười và kéo dài âm.',
  'ɪ': 'Âm i ngắn: môi thả lỏng, bật ra thật nhanh, đừng kéo dài.',
  'i': 'Âm i: môi thả lỏng, đọc nhẹ và nhanh.',
  'uː': 'Âm u dài: chu tròn môi về trước và giữ lâu.',
  'ʊ': 'Âm u ngắn: môi hơi tròn, thả lỏng và bật nhanh.',
  'u': 'Âm u: môi hơi tròn, đọc nhẹ.',
  'æ': 'Âm a bẹt: mở miệng rộng, kéo khoé môi sang ngang, giữa a và e.',
  'e': 'Âm e ngắn: miệng hé vừa, bật nhanh.',
  'ʌ': 'Âm ă ngắn: miệng hé vừa, lưỡi ở giữa, bật nhanh.',
  'ɑː': 'Âm a dài: mở miệng to, lưỡi hạ thấp, kéo dài.',
  'ɒ': 'Âm o ngắn: môi hơi tròn, miệng mở khá rộng, bật nhanh.',
  'ɔː': 'Âm o dài: môi tròn, kéo dài âm.',
  'ɜː': 'Âm ơ dài: môi và lưỡi thả lỏng, kéo dài, không đọc thành ơ ngắn.',
  'ə': 'Âm ơ nhẹ: đọc thật nhẹ và nhanh, không nhấn.',
  'eɪ': 'Đây là âm đôi ây: bắt đầu từ e rồi trượt sang i, đừng đọc thành e đơn.',
  'aɪ': 'Đây là âm đôi ai: mở miệng ở a rồi trượt sang i.',
  'ɔɪ': 'Đây là âm đôi oi: bắt đầu môi tròn ở o rồi trượt sang i.',
  'aʊ': 'Đây là âm đôi ao: mở miệng ở a rồi chu môi trượt sang u.',
  'əʊ': 'Đây là âm đôi âu: bắt đầu ở ơ rồi chu môi trượt sang u, đừng đọc thành ô đơn.',
  'oʊ': 'Đây là âm đôi ôu: bắt đầu ở ô rồi chu môi trượt sang u.',
  'ɪə': 'Đây là âm đôi ia: bắt đầu ở i rồi trượt nhẹ sang ơ.',
  'eə': 'Đây là âm đôi e-ơ: bắt đầu ở e rồi trượt sang ơ.',
  'ʊə': 'Đây là âm đôi ua: bắt đầu ở u rồi trượt sang ơ.',
};

const CHUA_NGHE = [
  'Mình chưa nghe thấy bạn nói gì cả. Bạn nghe câu mẫu rồi đọc to theo mình nhé.',
  'Hình như bạn chưa nói gì. Không sao, mình đọc lại câu mẫu, bạn đọc theo nhé.',
  'Mình chưa nghe rõ tiếng bạn. Bạn lại gần micro hơn một chút rồi đọc to nhé.',
];
const KHEN = ['Tốt lắm, bạn đọc chuẩn rồi!', 'Hay quá, câu này bạn đọc rất rõ!', 'Chuẩn rồi đấy!', 'Giỏi lắm, phát âm rất ổn!'];
const chon = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const NGUONG_DAT = 85;
const SO_LAN_TOI_DA = 3;
const NGUYEN_AM = /[aeiouɪʊəɜɑɒɔæʌ]/;

/** Âm yếu nhất — tên âm gắn theo IPA câu mẫu (chỉ khi số âm khớp với Azure). */
type AmYeu = { tu: string; am: string | null; diem: number; cuoi: boolean; ipa?: string; amTu: string[]; diemTu: number; viTri?: number };
function amYeuNhat(k: KetQuaPhatAm, ipa?: string): AmYeu | null {
  const ipaTu = (ipa ?? '').split(/\s+/).filter(Boolean);
  let vi = 0;
  let best: AmYeu | null = null;
  for (const w of k.tu) {
    if (w.loi === 'Insertion') continue;
    const ipaW = ipaTu[vi];
    const ten = ipaW ? tachAm(ipaW) : [];
    vi++;
    if (w.loi === 'Omission') continue;
    if (!w.am.length) {
      if (!best || w.diem < best.diem) best = { tu: w.tu, am: null, diem: w.diem, cuoi: false, ipa: ipaW, amTu: ten, diemTu: w.diem };
      continue;
    }
    w.am.forEach((a, i) => {
      const am = ten.length === w.am.length ? ten[i] : null;
      if (!best || a.diem < best.diem) best = { tu: w.tu, am, diem: a.diem, cuoi: i === w.am.length - 1, ipa: ipaW, amTu: ten, diemTu: w.diem, viTri: ten.length === w.am.length ? i : undefined };
    });
  }
  return best;
}

/* ── Hướng dẫn SÂU (05/10/2026) ──────────────────────────────────────────
 * Người dùng: "con robot hướng dẫn sâu hơn… sai chỗ nào user gặp nhiều thì hướng dẫn
 * từ đó, đọc được chuẩn rồi mới ghép cả đoạn… hướng dẫn rồi đọc mẫu + nhấn mạnh đuôi,
 * hơi". Âm cuối là lỗi số một của người Việt (tiếng Việt không bật phụ âm cuối) ⇒ có
 * lời dạy riêng cho phụ âm cuối và CỤM phụ âm cuối, kèm cách đọc phiên kiểu Việt. */
const CUOI_VIET: Record<string, string> = {
  s: 'xì', z: 'dzzz', t: 'tờ nhẹ', d: 'đờ nhẹ', k: 'cờ nhẹ', ɡ: 'gờ nhẹ', p: 'pờ nhẹ', b: 'bờ nhẹ',
  v: 'vờ rung', f: 'phờ', θ: 'thờ thổi hơi', ð: 'đờ rung qua răng', ʃ: 'suỵt', tʃ: 'chờ', dʒ: 'giờ', l: 'giữ lưỡi lờ', m: 'ngậm môi mờ', n: 'giữ lưỡi nờ',
};
const CUM_CUOI: Record<string, string> = {
  dz: 'Đuôi dz: đặt lưỡi chạm lợi trên như chữ đ, rồi chuyển ngay sang rung zzz như tiếng ong. Đừng tắt hơi ở chữ đ.',
  ts: 'Đuôi ts: chạm lưỡi bật t thật nhẹ rồi xì ngay s, như tiếng tàu "tsss".',
  st: 'Đuôi st: xì s trước rồi chạm lưỡi bật t nhẹ ở cuối, đừng bỏ chữ t.',
  ks: 'Đuôi ks: chặn hơi ở cuống lưỡi như chữ c, rồi xì s ngay sau.',
  nd: 'Đuôi nd: giữ lưỡi ở n rồi bật nhẹ d, đừng dừng ở n.',
  nt: 'Đuôi nt: giữ lưỡi ở n rồi bật t thật nhẹ.',
  vz: 'Đuôi vz: răng trên chạm môi dưới rung v, rồi trượt sang zzz.',
  lz: 'Đuôi lz: giữ lưỡi ở l rồi rung tiếp zzz.',
  mz: 'Đuôi mz: ngậm môi m rồi rung tiếp zzz.',
  nz: 'Đuôi nz: giữ lưỡi ở n rồi rung tiếp zzz.',
  ŋz: 'Đuôi ngz: giữ ng qua mũi rồi rung tiếp zzz.',
  ld: 'Đuôi ld: giữ lưỡi ở l rồi bật nhẹ d.',
  kt: 'Đuôi kt: chặn ở cuống lưỡi rồi bật t nhẹ, ví dụ looked.',
  pt: 'Đuôi pt: mím môi chữ p rồi bật t nhẹ.',
  ðz: 'Đuôi thz: lưỡi giữa hai răng rung, rồi trượt sang zzz.',
  θs: 'Đuôi ths: lưỡi giữa hai răng thổi hơi, rồi xì s.',
};
const PHU_AM = /^(p|b|t|d|k|ɡ|f|v|θ|ð|s|z|ʃ|ʒ|tʃ|dʒ|m|n|ŋ|l|r|h|w|j)$/;

/** Lời dạy cho ĐÚNG chỗ yếu nhất — ưu tiên phụ âm cuối / cụm phụ âm cuối. */
export function huongDan(y: AmYeu): string {
  const am = y.am ?? '';
  const n = y.amTu.length;
  // Cụm phụ âm CUỐI = mọi âm sau nguyên âm cuối cùng (reads → d z). Âm yếu nằm trong cụm đó
  // (kể cả /d/ ở GIỮA "dz" — Azure hay chấm âm này thấp nhất) ⇒ dạy cả cụm đuôi.
  let nguyenAmCuoi = -1;
  y.amTu.forEach((a, i) => { if (!PHU_AM.test(a)) nguyenAmCuoi = i; });
  const trongDuoi = y.viTri != null ? y.viTri > nguyenAmCuoi : y.cuoi || (!!am && y.amTu[n - 1] === am);
  const laCuoi = trongDuoi && PHU_AM.test(am);
  if (laCuoi && n >= 2) {
    const duoi = y.amTu.slice(nguyenAmCuoi + 1);
    const cum = duoi.length >= 2 ? duoi.slice(-2).join('') : '';
    if (cum && CUM_CUOI[cum]) return `${CUM_CUOI[cum]} Người Việt rất hay nuốt mất đuôi này.`;
    const viet = CUOI_VIET[am];
    return `Bạn đang nuốt âm cuối của từ [en]${y.tu}[/en]. ${MEO[am] ?? ''}${viet ? ` Hãy đọc trọn từ rồi thêm rõ "${viet}" ở cuối.` : ''}`.trim();
  }
  return MEO[am] ?? 'Nghe kỹ mẫu, để ý khẩu hình rồi đọc chậm lại.';
}

/** Từ luyện thêm cho âm người học HAY sai (đếm trong buổi gọi) — âm ở vị trí khó nhất (thường là cuối). */
const TU_LUYEN: Record<string, CauMau[]> = {
  z: [{ text: 'buzz', ipa: 'bʌz' }, { text: 'goes', ipa: 'ɡəʊz' }, { text: 'reads', ipa: 'riːdz' }],
  s: [{ text: 'bus', ipa: 'bʌs' }, { text: 'likes', ipa: 'laɪks' }, { text: 'nice', ipa: 'naɪs' }],
  d: [{ text: 'need', ipa: 'niːd' }, { text: 'played', ipa: 'pleɪd' }, { text: 'good', ipa: 'ɡʊd' }],
  t: [{ text: 'cat', ipa: 'kæt' }, { text: 'night', ipa: 'naɪt' }, { text: 'worked', ipa: 'wɜːkt' }],
  k: [{ text: 'book', ipa: 'bʊk' }, { text: 'like', ipa: 'laɪk' }, { text: 'black', ipa: 'blæk' }],
  v: [{ text: 'live', ipa: 'lɪv' }, { text: 'five', ipa: 'faɪv' }, { text: 'very', ipa: 'veri' }],
  l: [{ text: 'feel', ipa: 'fiːl' }, { text: 'school', ipa: 'skuːl' }, { text: 'all', ipa: 'ɔːl' }],
  θ: [{ text: 'think', ipa: 'θɪŋk' }, { text: 'three', ipa: 'θriː' }, { text: 'month', ipa: 'mʌnθ' }],
  ð: [{ text: 'this', ipa: 'ðɪs' }, { text: 'mother', ipa: 'mʌðə' }, { text: 'they', ipa: 'ðeɪ' }],
  ʃ: [{ text: 'she', ipa: 'ʃi' }, { text: 'fish', ipa: 'fɪʃ' }, { text: 'wash', ipa: 'wɒʃ' }],
  r: [{ text: 'red', ipa: 'red' }, { text: 'right', ipa: 'raɪt' }, { text: 'room', ipa: 'ruːm' }],
  tʃ: [{ text: 'watch', ipa: 'wɒtʃ' }, { text: 'teacher', ipa: 'tiːtʃə' }, { text: 'much', ipa: 'mʌtʃ' }],
  dʒ: [{ text: 'job', ipa: 'dʒɒb' }, { text: 'page', ipa: 'peɪdʒ' }, { text: 'large', ipa: 'lɑːdʒ' }],
  'iː': [{ text: 'sheep', ipa: 'ʃiːp' }, { text: 'meet', ipa: 'miːt' }, { text: 'tea', ipa: 'tiː' }],
  'ɪ': [{ text: 'ship', ipa: 'ʃɪp' }, { text: 'sit', ipa: 'sɪt' }, { text: 'big', ipa: 'bɪɡ' }],
  'æ': [{ text: 'cat', ipa: 'kæt' }, { text: 'bad', ipa: 'bæd' }, { text: 'apple', ipa: 'æpl' }],
  'ɜː': [{ text: 'bird', ipa: 'bɜːd' }, { text: 'work', ipa: 'wɜːk' }, { text: 'learn', ipa: 'lɜːn' }],
  'əʊ': [{ text: 'go', ipa: 'ɡəʊ' }, { text: 'home', ipa: 'həʊm' }, { text: 'phone', ipa: 'fəʊn' }],
  'eɪ': [{ text: 'day', ipa: 'deɪ' }, { text: 'name', ipa: 'neɪm' }, { text: 'play', ipa: 'pleɪ' }],
  n: [{ text: 'nine', ipa: 'naɪn' }, { text: 'phone', ipa: 'fəʊn' }, { text: 'green', ipa: 'ɡriːn' }],
  ŋ: [{ text: 'sing', ipa: 'sɪŋ' }, { text: 'long', ipa: 'lɒŋ' }, { text: 'morning', ipa: 'mɔːnɪŋ' }],
};
const NGUONG_TU = 80;
const SO_LAN_TU = 3;
const LAN_SAI_THI_NHAC = 3;
const boDau = (t: string) => t.replace(/[.,!?;:"“”'’]+$/g, '').replace(/^[“"'‘]+/, '');

/**
 * Chấm CHẶT HƠN mà vẫn công bằng (04/10/2026). Azure chấm cả từ khá dễ: đo bằng giọng
 * Việt đọc "I think this is the third one" — âm k cuối của think 29 điểm, ð của this
 * 36, d cuối của third 45 (đúng lỗi nuốt âm cuối của người Việt), vậy mà điểm cả từ
 * vẫn 88–91 và hiện xanh. Ở đây: từ nào có MỘT âm sai rõ (< 60) thì điểm từ kéo về
 * trung bình của điểm từ và âm tệ nhất; tổng không cao hơn trung bình các từ đã chỉnh.
 * Âm ≥ 60 (lệch nhẹ) KHÔNG bị phạt — người dùng dặn đừng chặt tới mức làm nản.
 * Đọc chuẩn (mọi âm ≥ 90) ra điểm y như cũ.
 */
export function hieuChinh(k: KetQuaPhatAm): KetQuaPhatAm {
  const tu = k.tu.map((w) => {
    if (!w.am.length || w.loi === 'Omission' || w.loi === 'Insertion') return w;
    const thapNhat = Math.min(...w.am.map((a) => a.diem));
    return thapNhat < 60 ? { ...w, diem: Math.min(w.diem, Math.round((w.diem + thapNhat) / 2)) } : w;
  });
  const tinh = tu.filter((w) => w.loi !== 'Insertion');
  const tb = tinh.length ? Math.round(tinh.reduce((t, w) => t + (w.loi === 'Omission' ? 0 : w.diem), 0) / tinh.length) : k.diem.tong;
  return { ...k, tu, diem: { ...k.diem, tong: Math.min(k.diem.tong, tb) } };
}

const TIEN_BO = ['Tiến bộ rồi đấy!', 'Khá hơn lần trước rồi!', 'Bạn tiến bộ nhanh ghê!'];

/** Câu nhận xét tiếng Việt cho một lượt luyện — soạn sẵn, không gọi AI. */
export function nhanXet(k: KetQuaPhatAm, mau: CauMau, lanThu: number, diemTruoc?: number, nn: NgonNgu = 'en'): { noi: string; dat: boolean } {
  // Khen tiến bộ so với lần đọc trước CÙNG câu — người học thấy công sức của mình có kết quả.
  const tienBo = diemTruoc != null && k.diem.tong >= diemTruoc + 5
    ? `${chon(TIEN_BO)} Từ ${diemTruoc} lên ${k.diem.tong} điểm. `
    : '';
  if (k.diem.tong >= NGUONG_DAT) return { noi: tienBo ? `${tienBo}Câu này đạt rồi!` : `${chon(KHEN)} Bạn được ${k.diem.tong} điểm.`, dat: true };
  const thieu = k.tu.find((w) => w.loi === 'Omission');
  if (thieu) return { noi: `Bạn đọc thiếu từ [en]${thieu.tu}[/en] rồi. Nghe lại rồi đọc đủ cả câu nhé.`, dat: false };
  if (nn !== 'en') {
    // Tiếng Nhật/Trung: Azure không trả tên âm đọc được ⇒ chỉ ra TỪ yếu nhất + một mẹo chung.
    const yeu = k.tu.filter((w) => w.loi !== 'Insertion').sort((a, b) => a.diem - b.diem)[0];
    const loiMo = tienBo || (lanThu >= 2 ? 'Gần được rồi.' : `Được ${k.diem.tong} điểm.`);
    const tuYeu = yeu && yeu.diem < NGUONG_DAT ? ` Chữ [en]${yeu.tu}[/en] chưa chuẩn.` : '';
    return { noi: `${loiMo}${tuYeu} ${chon(MEO_NN[nn])} Đọc lại theo mình nhé.`, dat: false };
  }
  const y = amYeuNhat(k, mau.ipa);
  if (!y) return { noi: `Được ${k.diem.tong} điểm. Bạn đọc chậm và rõ hơn một chút nhé.`, dat: false };
  const meo = y.am ? MEO[y.am] : undefined;
  const cuoi = y.cuoi && y.am && !NGUYEN_AM.test(y.am) ? ' Đây là âm cuối, người Việt rất hay nuốt mất.' : '';
  const loiMo = tienBo || (lanThu >= 2 ? 'Gần được rồi.' : `Được ${k.diem.tong} điểm.`);
  return {
    noi: `${loiMo} Từ [en]${y.tu}[/en] chưa chuẩn. ${meo ?? 'Nghe kỹ mẫu rồi đọc chậm lại.'}${cuoi} Đọc lại theo mình nhé.`,
    dat: false,
  };
}

/* ── Giọng gia sư ────────────────────────────────────────────────────── */

const escXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** "[en]…[/en]" → các đoạn. */
export function tachDoan(noi: string): { en: boolean; t: string }[] {
  const out: { en: boolean; t: string }[] = [];
  const re = /\[en\]([\s\S]*?)\[\/en\]/gi;
  let i = 0;
  for (let m = re.exec(noi); m; m = re.exec(noi)) {
    if (m.index > i) out.push({ en: false, t: noi.slice(i, m.index) });
    out.push({ en: true, t: m[1] });
    i = m.index + m[0].length;
  }
  if (i < noi.length) out.push({ en: false, t: noi.slice(i) });
  return out.map((d) => ({ ...d, t: d.t.replace(/\s+/g, ' ') })).filter((d) => d.t.trim());
}

const dangTao = new Map<string, Promise<string | null>>();

/** Đọc lời gia sư → URL mp3 trên R2 (lưu theo băm; câu lặp lại phát tức thì). */
export async function docGiaSu(noi: string, nn: NgonNgu = 'en'): Promise<string | null> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!key) return null;
  // Khoá băm của tiếng Anh giữ y như cũ ⇒ tệp đã lưu R2 vẫn dùng lại được.
  const r2 = `ielts/audio/giasu/${crypto.createHash('sha1').update(`${GIONG_GIA_SU}|${nn === 'en' ? '' : `${nn}|`}${noi}`).digest('hex')}.mp3`;
  const dang = dangTao.get(r2);
  if (dang) return dang;
  const p = (async () => {
    if (await objectExists(r2)) return buildPublicUrl(r2);
    const body = tachDoan(noi).map((d) => `<lang xml:lang="${d.en ? LOCALE[nn] : 'vi-VN'}">${escXml(d.t)}</lang>`).join(' ');
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="vi-VN">`
      + `<voice name="${GIONG_GIA_SU}"><prosody rate="-4%">${body}</prosody></voice></speak>`;
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'cuongthai-ielts-goi',
      },
      signal: AbortSignal.timeout(20_000),
      body: ssml,
    });
    if (!res.ok) {
      console.warn('[ielts/goi] Azure TTS', res.status, (await res.text().catch(() => '')).slice(0, 160));
      return null;
    }
    const { url } = await putObject(r2, Buffer.from(await res.arrayBuffer()), 'audio/mpeg');
    return url;
  })();
  dangTao.set(r2, p);
  try { return await p; } catch { return null; } finally { dangTao.delete(r2); }
}

/* ── Chọn giọng CuongMini (04/10/2026) ───────────────────────────────────
 * Mặc định = Azure Ada đa ngôn ngữ (ở trên) — người dùng duyệt "chuẩn, oke".
 * Hai giọng MÁY NHÀ (F5 trên máy GPU ở nhà, qua `synthesizeCuongMini`):
 *   khanh-linh → `f5-khanh-linh` (nhân bản, nền 1000h)
 *   cuong      → `f5-cuong-nghiem` (nghiêm túc, giảng giải)
 * F5 chỉ đọc tiếng VIỆT — đoạn [en]…[/en] để nó đọc là ra tiếng bồi, nên phần
 * tiếng Anh vẫn đọc bằng giọng Anh của khoá (Sonia). Kết quả là MỘT DÃY tệp phát
 * nối nhau (`audioUrls`).
 *
 * ⚠️ Máy nhà có thể tắt/bận. Mỗi lượt có HẠN theo độ dài; quá hạn hoặc lỗi ⇒ trả
 * NGAY giọng mặc định (người dùng dặn: đừng để ảnh hưởng trải nghiệm) và nghỉ thử
 * máy nhà 2 phút — để các lượt sau không phải chờ hạn thêm lần nào nữa.
 */
export type GiongGoi = 'mac-dinh' | 'khanh-linh' | 'cuong';
const GIONG_NHA: Record<Exclude<GiongGoi, 'mac-dinh'>, string> = { 'khanh-linh': 'f5-khanh-linh', cuong: 'f5-cuong-nghiem' };
let nhaNghiDen = 0;

export function docGiong(x: unknown): GiongGoi {
  return x === 'khanh-linh' || x === 'cuong' ? x : 'mac-dinh';
}

/** Một đoạn ngoại ngữ (Anh: Sonia · Nhật: Nanami · Trung: Xiaoxiao) → URL mp3 (lưu R2 theo băm). */
async function docDoanAnh(t: string, nn: NgonNgu = 'en'): Promise<string | null> {
  const GIONG_ANH = GIONG_NGOAI[nn];
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!key) return null;
  const r2 = `ielts/audio/giasu/${crypto.createHash('sha1').update(`${GIONG_ANH}|${t}`).digest('hex')}.mp3`;
  if (await objectExists(r2)) return buildPublicUrl(r2);
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'cuongthai-ielts-goi' },
    signal: AbortSignal.timeout(15_000),
    body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${LOCALE[nn]}"><voice name="${GIONG_ANH}"><prosody rate="-4%">${escXml(t)}</prosody></voice></speak>`,
  });
  if (!res.ok) return null;
  return (await putObject(r2, Buffer.from(await res.arrayBuffer()), 'audio/mpeg')).url;
}

/** Một đoạn tiếng Việt bằng giọng máy nhà → URL wav (lưu R2 theo băm). Ném lỗi khi hỏng. */
async function docDoanNha(t: string, voice: string, hanMs: number): Promise<string> {
  const r2 = `ielts/audio/giasu-nha/${crypto.createHash('sha1').update(`${voice}|${t}`).digest('hex')}.wav`;
  if (await objectExists(r2)) return buildPublicUrl(r2);
  let hen: ReturnType<typeof setTimeout> | undefined;
  const wav = await Promise.race([
    synthesizeCuongMini(t, voice),
    new Promise<never>((_, loi) => { hen = setTimeout(() => loi(new Error(`máy nhà quá ${hanMs}ms`)), hanMs); }),
  ]).finally(() => clearTimeout(hen));
  return (await putObject(r2, wav, 'audio/wav')).url;
}

/**
 * Đọc lời gia sư theo giọng người dùng chọn. Luôn trả được tiếng (trừ khi cả Azure
 * hỏng): giọng máy nhà hỏng thì `giongThat` = 'mac-dinh' để web báo nhẹ một dòng.
 */
export async function docGiaSuTheoGiong(noi: string, giong: GiongGoi, nn: NgonNgu = 'en'): Promise<{ audioUrl: string | null; audioUrls?: string[]; giongThat: GiongGoi }> {
  if (giong === 'mac-dinh' || Date.now() < nhaNghiDen) return { audioUrl: await docGiaSu(noi, nn), giongThat: 'mac-dinh' };
  const doan = tachDoan(noi);
  const tongViet = doan.filter((d) => !d.en).reduce((n, d) => n + d.t.length, 0);
  // F5 đo thật: ~0,9 s cố định + 0,38 × số giây tiếng (~16,5 ký tự/giây) — cho gấp đôi.
  const hanMs = Math.min(15_000, 3_000 + Math.round((tongViet / 16.5) * 0.38 * 2 * 1000));
  const t0 = Date.now();
  try {
    const urls = await Promise.all(doan.map(async (d) => {
      if (d.en) {
        const u = await docDoanAnh(d.t, nn);
        if (!u) throw new Error('Azure giọng ngoại ngữ hỏng');
        return u;
      }
      // F5 đọc chữ Latin không dấu theo kiểu đoán: "CuongMini" ra "cuồng mini" / "Cung Ngô Mini"
      // (đo bằng Whisper 05/10) ⇒ viết lại theo cách ĐỌC trước khi đưa cho máy nhà.
      return docDoanNha(d.t.replace(/CuongMini/g, 'Cường Mi-ni'), GIONG_NHA[giong], hanMs);
    }));
    logger.info('[ielts/goi] giọng máy nhà', { giong, ms: Date.now() - t0, kyTu: tongViet });
    return { audioUrl: urls[0] ?? null, audioUrls: urls, giongThat: giong };
  } catch (e) {
    nhaNghiDen = Date.now() + 120_000;
    logger.warn('[ielts/goi] giọng máy nhà hỏng — dùng giọng mặc định', { giong, ms: Date.now() - t0, loi: e instanceof Error ? e.message : String(e) });
    return { audioUrl: await docGiaSu(noi, nn), giongThat: 'mac-dinh' };
  }
}

/* ── Một lượt luyện ──────────────────────────────────────────────────── */

const CO_DAU = /[ăâđêôơưàáạảãầấậẩẫằắặẳẵèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
const chu = (s: string) => s.toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean);
/** Bao nhiêu phần từ của câu mẫu xuất hiện trong câu nghe được. */
const CJK = /[\u3040-\u30ff\u3400-\u9fff]/;
/** Chữ Nhật/Trung không cách từ ⇒ so theo TỪNG CHỮ (bỏ dấu câu). */
const kyTu = (s: string) => [...chuTran(s)].filter((c) => CJK.test(c));
function giongNhau(a: string, b: string) {
  if (CJK.test(a)) {
    const A2 = kyTu(a);
    const B2 = new Set(kyTu(b));
    return A2.length ? A2.filter((c) => B2.has(c)).length / A2.length : 0;
  }
  const A = chu(a);
  const B = new Set(chu(b));
  return A.length ? A.filter((w) => B.has(w)).length / A.length : 0;
}

function sachDanhSach(raw: unknown, nn: NgonNgu = 'en'): CauMau[] {
  const ds = (Array.isArray(raw) ? raw : [])
    .map((x) => ({ text: String((x as CauMau)?.text ?? '').trim().slice(0, 160), ipa: (x as CauMau)?.ipa ? String((x as CauMau).ipa).slice(0, 300) : undefined }))
    .filter((x) => x.text)
    .slice(0, 40);
  return ds.length ? ds : nn === 'en' ? NGAN_HANG : NGAN_HANG_NN[nn];
}

/**
 * Một lượt luyện. Không có audio = mở cuộc gọi (chào + câu mẫu đầu).
 * Trả `loai: 'hoi'` khi người học nói tiếng Việt (đang hỏi) — web nói câu đệm
 * rồi gọi `hoiGiaSu`.
 */
export async function goiGiaSu(
  userId: number,
  input: {
    audio?: Buffer; danhSach?: unknown; viTri?: unknown; lanThu?: unknown; chuDe?: unknown; diemTruoc?: unknown; giong?: unknown; ngonNgu?: unknown; imLang?: unknown;
    /** 05/10/2026 — luyện sâu: 'cau' = đọc cả câu, 'tu' = đang luyện riêng một từ (mau là từ đó, mauGoc là câu). */
    che?: unknown; mauGoc?: unknown; mauTu?: unknown; lanTu?: unknown;
    /** Đếm âm người học sai trong buổi (web giữ) + những âm đã giảng riêng rồi. */
    thongKe?: unknown; daNhac?: unknown;
  },
) {
  if (!demLuot(userId)) return { lyDo: 'het_luot_ngay' as const };
  const giong = docGiong(input.giong);
  const nn = docNgonNgu(input.ngonNgu);
  const ds = sachDanhSach(input.danhSach, nn);
  let viTri = Math.max(0, Math.min(ds.length - 1, Number(input.viTri) || 0));
  let lanThu = Math.max(0, Number(input.lanThu) || 0);
  // Chế độ luyện riêng một từ: câu mẫu đang đọc là TỪ đó, câu gốc giữ ở mauGoc để ghép lại.
  const mauGocIn = input.mauGoc && typeof input.mauGoc === 'object' ? sachDanhSach([input.mauGoc], nn)[0] : undefined;
  const che: 'cau' | 'tu' = input.che === 'tu' && mauGocIn ? 'tu' : 'cau';
  let lanTu = Math.max(0, Number(input.lanTu) || 0);
  const thongKe: Record<string, number> = {};
  if (input.thongKe && typeof input.thongKe === 'object') for (const [k2, v] of Object.entries(input.thongKe as Record<string, unknown>)) { const n = Number(v); if (k2.length <= 4 && n > 0) thongKe[k2] = Math.min(99, n); }
  const daNhac = Array.isArray(input.daNhac) ? (input.daNhac as unknown[]).map(String).slice(0, 20) : [];
  // Từ đang luyện riêng (che 'tu') đi trong trangThai dưới tên `mauTu`.
  const mauTu = che === 'tu' && input.mauTu && typeof input.mauTu === 'object' ? sachDanhSach([input.mauTu], nn)[0] : undefined;
  const mau = che === 'tu' && mauTu ? mauTu : ds[viTri];
  const chuDe = String(input.chuDe ?? '').trim().slice(0, 120);

  // Web đo micro thấy CẢ LƯỢT không có tiếng nói (bấm nhầm, chưa kịp nói) ⇒ không chấm gì,
  // không tính lượt đọc — chỉ nhắc tự nhiên (05/10/2026: trước đây im lặng bị chấm "đọc thiếu").
  if (input.imLang === true) {
    const noi = chon(CHUA_NGHE);
    return { loai: 'luyen' as const, nghe: '', noi, ...(await docGiaSuTheoGiong(noi, giong, nn)), mau, viTri, lanThu, cham: null, doiCau: false, che, mauGoc: mauGocIn ?? null, mauTu: mauTu ?? null, lanTu };
  }
  if (!input.audio?.length) {
    // Ngắn và CỐ ĐỊNH: đọc tên bài ("Nói: Trả lời câu hỏi Wh- (Part 1 · …)") nghe rất kỳ
    // và kéo lời chào tới 19 giây (đo 03/10). Câu cố định thì lưu R2 một lần, mở là phát ngay.
    void chuDe;
    const noi = nn === 'en'
      ? 'Chào bạn! Mình là CuongMini, bạn luyện phát âm của bạn đây. Bạn nghe câu mẫu rồi đọc theo, mình chấm và sửa ngay nhé. Muốn hỏi gì cứ nói tiếng Việt. Câu đầu tiên đây.'
      : `Chào bạn! Mình là CuongMini, hôm nay mình cùng luyện nói ${TEN_TIENG[nn]} nhé. Bạn nghe câu mẫu rồi đọc theo, mình chấm và sửa ngay. Muốn hỏi gì cứ nói tiếng Việt. Câu đầu tiên đây.`;
    return { loai: 'mo' as const, noi, ...(await docGiaSuTheoGiong(noi, giong, nn)), mau, viTri, lanThu: 0 };
  }
  if (input.audio.length > 1024 * 1024) throw new BadRequestError('Bản ghi quá dài');

  const [tr, pa] = await Promise.all([
    transcribeWithGroq(input.audio, 'luot.wav', 'audio/wav', { language: '', hints: chuTran(mau.text) }).catch(() => null),
    chamPhatAm(userId, { audio: input.audio, cau: chuTran(mau.text), giong: nn === 'en' ? 'uk' : nn }).catch(() => null),
  ]);
  const nghe = String((tr as { text?: string } | null)?.text ?? '').trim();
  let k = pa?.ketQua ? hieuChinh(pa.ketQua) : null;
  // Có tiếng (tiếng ồn, tiếng thở) nhưng không đọc chữ nào: Azure trả mọi từ "Omission" ⇒
  // trước đây thành "Bạn đọc thiếu từ…". Coi như chưa nghe thấy.
  if (k && (k.tu.length === 0 || k.tu.every((w) => w.loi === 'Omission') || k.diem.dayDu < 15)) k = null;

  // Nói tiếng Việt và không giống câu mẫu ⇒ đang hỏi gia sư.
  if (nghe && CO_DAU.test(nghe) && giongNhau(mau.text, nghe) < 0.5) {
    // Câu đệm nói NGAY (tệp lưu R2 nên lần sau tức thì) trong lúc web gọi AI ~10 giây.
    const noi = chon(['Câu hỏi hay đấy, để mình giải thích nhé.', 'À, bạn hỏi hay lắm. Đợi mình một chút nhé.', 'Để mình giải thích cho bạn nhé.']);
    return { loai: 'hoi' as const, nghe, noi, ...(await docGiaSuTheoGiong(noi, giong, nn)), mau, viTri, lanThu, che, mauGoc: mauGocIn ?? null, mauTu: mauTu ?? null, lanTu };
  }
  if (!k) {
    const noi = pa?.lyDo === 'het_luot_thang'
      ? 'Máy chấm phát âm đã hết lượt miễn phí của tháng này. Bạn vẫn có thể hỏi mình bằng tiếng Việt nhé.'
      : chon(CHUA_NGHE);
    return { loai: 'luyen' as const, nghe, noi, ...(await docGiaSuTheoGiong(noi, giong, nn)), mau, viTri, lanThu, cham: null, doiCau: false, che, mauGoc: mauGocIn ?? null, mauTu: mauTu ?? null, lanTu };
  }

  // ── Đang LUYỆN RIÊNG một từ ─────────────────────────────────────────────
  if (che === 'tu' && mauGocIn) {
    lanTu += 1;
    const y = amYeuNhat(k, mau.ipa);
    const amSai = y && y.diem < 70 ? y.am : null;
    if (k.diem.tong >= NGUONG_TU || lanTu >= SO_LAN_TU) {
      const dat = k.diem.tong >= NGUONG_TU;
      const noi = dat
        ? `${chon(['Chuẩn rồi!', 'Đúng rồi đấy!', 'Hay lắm!'])} Từ [en]${mau.text}[/en] được ${k.diem.tong} điểm. Giờ mình ghép lại cả câu nhé, nhớ giữ đúng như vừa rồi.`
        : `Được ${k.diem.tong} điểm, gần được rồi. Mình ghép lại cả câu nhé, đọc chậm và nhớ chỗ vừa luyện.`;
      return {
        loai: 'luyen' as const, nghe, noi, ...(await docGiaSuTheoGiong(noi, giong, nn)),
        mau: mauGocIn, viTri, lanThu: 0, doiCau: false, che: 'cau' as const, mauGoc: null, mauTu: null, lanTu: 0, amSai, ghepLai: true,
        cham: { tong: k.diem.tong, tu: k.tu.map((w) => ({ tu: w.tu, diem: w.diem, loi: w.loi })) },
      };
    }
    const noi = `Được ${k.diem.tong} điểm. ${y ? huongDan(y) : 'Nghe kỹ mẫu rồi đọc chậm lại.'} Nghe mình đọc thật chậm rồi đọc lại theo nhé.`;
    return {
      loai: 'luyen' as const, nghe, noi, ...(await docGiaSuTheoGiong(noi, giong, nn)),
      mau, viTri, lanThu, doiCau: false, che: 'tu' as const, mauGoc: mauGocIn, mauTu: mau, lanTu, amSai, tocMau: 0.65,
      cham: { tong: k.diem.tong, tu: k.tu.map((w) => ({ tu: w.tu, diem: w.diem, loi: w.loi })) },
    };
  }

  // ── Đọc CẢ CÂU ──────────────────────────────────────────────────────────
  lanThu += 1;
  const diemTruoc = lanThu > 1 && Number.isFinite(Number(input.diemTruoc)) ? Number(input.diemTruoc) : undefined;
  const nx = nhanXet(k, mau, lanThu, diemTruoc, nn);
  const y = amYeuNhat(k, mau.ipa);
  const amSai = !nx.dat && y && y.diem < 70 ? y.am : null;
  const soTu = k.tu.filter((w) => w.loi !== 'Insertion').length;

  // Câu nhiều từ mà có MỘT từ yếu hẳn ⇒ tách từ đó ra luyện riêng (không bắt đọc lại cả câu mãi).
  if (!nx.dat && y && y.diemTu < 70 && soTu >= 2) {
    const tuLuyen: CauMau = { text: boDau(y.tu), ...(y.ipa ? { ipa: y.ipa } : {}) };
    const loiMo = diemTruoc != null && k.diem.tong >= diemTruoc + 5 ? `Tiến bộ rồi, ${k.diem.tong} điểm.` : `Câu này được ${k.diem.tong} điểm.`;
    const noi = `${loiMo} Chỗ cần sửa là từ [en]${tuLuyen.text}[/en]. ${nn === 'en' ? huongDan(y) : chon(MEO_NN[nn])} Mình tách riêng từ này luyện trước nhé. Nghe mình đọc chậm, rồi đọc theo.`;
    return {
      loai: 'luyen' as const, nghe, noi, ...(await docGiaSuTheoGiong(noi, giong, nn)),
      mau: tuLuyen, viTri, lanThu, doiCau: false, che: 'tu' as const, mauGoc: mau, mauTu: tuLuyen, lanTu: 0, amSai, tocMau: 0.65, tachTu: true,
      cham: { tong: k.diem.tong, tu: k.tu.map((w) => ({ tu: w.tu, diem: w.diem, loi: w.loi })) },
    };
  }

  let noi = nx.noi;
  let moi = mau;
  let nhacAm: string | null = null;
  if (nx.dat || lanThu >= SO_LAN_TOI_DA) {
    if (!nx.dat) noi = 'Câu này hơi khó, mình để lần sau luyện tiếp nhé.';
    viTri = (viTri + 1) % ds.length;
    moi = ds[viTri];
    lanThu = 0;
    // Âm người học sai LẶP LẠI trong buổi ⇒ giảng riêng một lần + luyện một từ chứa đúng âm đó.
    const tk = { ...thongKe };
    if (amSai) tk[amSai] = (tk[amSai] ?? 0) + 1;
    const hay = Object.entries(tk).filter(([a, c]) => c >= LAN_SAI_THI_NHAC && !daNhac.includes(a) && TU_LUYEN[a]).sort((a, b) => b[1] - a[1])[0];
    if (nn === 'en' && hay) {
      nhacAm = hay[0];
      const tuThem = chon(TU_LUYEN[hay[0]]!);
      const loi = `${noi} Mình để ý bạn hay vấp cùng một âm, đã ${hay[1]} lần rồi. ${MEO[hay[0]] ?? ''} Mình luyện riêng một từ có âm này nhé: [en]${tuThem.text}[/en].`;
      return {
        loai: 'luyen' as const, nghe, noi: loi, ...(await docGiaSuTheoGiong(loi, giong, nn)),
        mau: tuThem, viTri, lanThu: 0, doiCau: true, che: 'tu' as const, mauGoc: moi, mauTu: tuThem, lanTu: 0, amSai, nhacAm, tocMau: 0.65,
        cham: { tong: k.diem.tong, tu: k.tu.map((w) => ({ tu: w.tu, diem: w.diem, loi: w.loi })) },
      };
    }
    noi += ' Câu tiếp theo đây.';
  }
  return {
    loai: 'luyen' as const,
    nghe,
    noi,
    ...(await docGiaSuTheoGiong(noi, giong, nn)),
    mau: moi,
    viTri,
    lanThu,
    doiCau: moi !== mau,
    che: 'cau' as const, mauGoc: null, mauTu: null, lanTu: 0, amSai, nhacAm,
    cham: { tong: k.diem.tong, tu: k.tu.map((w) => ({ tu: w.tu, diem: w.diem, loi: w.loi })) },
  };
}

/* ── Lượt hỏi (có AI) ────────────────────────────────────────────────── */

const heThongHoi = (nn: NgonNgu) => [
  `Bạn là CuongMini — robot GIA SƯ PHÁT ÂM ${TEN_TIENG[nn].toUpperCase()} dễ thương, xưng "mình", đang nói chuyện qua điện thoại với người Việt mới học. Trả lời BẰNG TIẾNG VIỆT câu người học vừa hỏi.`,
  '- 2–4 câu ngắn, dưới 70 chữ. Đây là lời NÓI: không markdown, không gạch đầu dòng, không emoji, không ký hiệu IPA — mô tả khẩu hình bằng lời.',
  `- MỌI từ hay câu ${TEN_TIENG[nn]} bọc trong [en]…[/en] (giữ đúng tên thẻ này). Ví dụ: ${nn === 'ja' ? 'Chữ [en]ありがとう[/en] đọc kéo dài âm cuối.' : nn === 'zh' ? 'Chữ [en]谢谢[/en] đọc thanh 4 rồi thanh nhẹ.' : 'Từ [en]think[/en] có âm th.'}`,
  '- Câu cuối mời người học quay lại đọc câu mẫu đang luyện.',
  'Chỉ trả về lời nói, không gì khác.',
].join('\n');

export async function hoiGiaSu(userId: number, b: { cauHoi?: unknown; mau?: unknown; chuDe?: unknown; giong?: unknown; ngonNgu?: unknown }) {
  const nn = docNgonNgu(b.ngonNgu);
  if (!isAiAvailable()) return { lyDo: 'ai_unavailable' as const };
  if (!demLuot(userId)) return { lyDo: 'het_luot_ngay' as const };
  const cauHoi = String(b.cauHoi ?? '').trim().slice(0, 500);
  if (!cauHoi) throw new BadRequestError('Thiếu câu hỏi');
  const mau = String(b.mau ?? '').trim().slice(0, 160);
  const chuDe = String(b.chuDe ?? '').trim().slice(0, 300);
  const kq = await llmComplete({
    step: 'generation',
    purpose: 'language_tutor',
    feature: 'chat',
    userId,
    maxTokens: 300,
    system: heThongHoi(nn),
    messages: [{ role: 'user', content: `${chuDe ? `Đang học: ${chuDe}\n` : ''}${mau ? `Câu mẫu đang luyện: "${mau}"\n` : ''}Người học hỏi: "${cauHoi}"` }],
  });
  const noi = (kq.text ?? '').replace(/```[a-z]*|```/g, '').trim();
  if (!noi) return { lyDo: 'loi_ai' as const };
  return { noi, ...(await docGiaSuTheoGiong(noi, docGiong(b.giong), nn)) };
}

/* ── 💬 TRÒ CHUYỆN SONG NGỮ (05/10/2026) ─────────────────────────────────
 * Người dùng: "robot nói được bằng tiếng Việt VÀ ngôn ngữ đang học… dựa vào voice, mic".
 * Khác lượt luyện phát âm (đọc câu mẫu): ở đây người học NÓI TỰ DO bằng ngôn ngữ đang học;
 * CuongMini trả lời ngắn đúng trình độ, sửa lỗi nhẹ, bí thì giải thích bằng tiếng Việt, và
 * luôn hỏi lại một câu để cuộc trò chuyện tiếp diễn. Phần ngoại ngữ bọc [en]…[/en] để giọng
 * Ada đa ngôn ngữ đọc đúng locale (docGiaSuTheoGiong). Âm thanh người học KHÔNG lưu. */
const troChuyenHeThong = (nn: NgonNgu, chuDe: string) => [
  `Bạn là CuongMini — robot bạn đồng hành dễ thương, đang TRÒ CHUYỆN bằng giọng nói để giúp người Việt luyện nói ${TEN_TIENG[nn]}. Xưng "mình", gọi người học là "bạn".`,
  `Trình độ người học: mới bắt đầu.${chuDe ? ` Họ đang học bài: ${chuDe} — ưu tiên dùng từ và mẫu câu của bài này.` : ''}`,
  `- Nếu người học nói bằng ${TEN_TIENG[nn]}: trả lời 1–2 câu NGẮN, ĐƠN GIẢN bằng ${TEN_TIENG[nn]}. Nếu câu của họ có lỗi, thêm một câu tiếng Việt ngắn chỉ ra lỗi và đưa câu đúng.`,
  `- Nếu người học nói tiếng Việt (hỏi, bí, không hiểu): giải thích ngắn bằng tiếng Việt, rồi đưa một câu mẫu ${TEN_TIENG[nn]} để họ nói theo.`,
  `- LUÔN kết thúc bằng MỘT câu hỏi đơn giản bằng ${TEN_TIENG[nn]} để người học trả lời tiếp.`,
  `- MỌI từ/câu ${TEN_TIENG[nn]} bọc trong [en]…[/en] (giữ đúng tên thẻ này)${nn === 'ja' ? '; tiếng Nhật viết bằng kana/kanji thông dụng, không romaji' : nn === 'zh' ? '; tiếng Trung viết chữ giản thể, không pinyin' : ''}.`,
  '- Đây là lời NÓI: tối đa 60 chữ, không markdown, không gạch đầu dòng, không emoji, không ký hiệu phiên âm.',
  'Chỉ trả về lời nói, không gì khác.',
].join('\n');

const MO_TRO_CHUYEN: Record<NgonNgu, string> = {
  en: 'Mình là CuongMini. Mình cùng trò chuyện bằng tiếng Anh nhé, bí thì cứ nói tiếng Việt. [en]Hi! How are you today?[/en]',
  ja: 'Mình là CuongMini. Mình cùng nói chuyện bằng tiếng Nhật nhé, bí thì cứ nói tiếng Việt. [en]こんにちは！今日は元気ですか。[/en]',
  zh: 'Mình là CuongMini. Mình cùng nói chuyện bằng tiếng Trung nhé, bí thì cứ nói tiếng Việt. [en]你好！你今天好吗？[/en]',
};

export async function troChuyen(
  userId: number,
  input: { audio?: Buffer; lichSu?: unknown; ngonNgu?: unknown; chuDe?: unknown; giong?: unknown },
) {
  if (!demLuot(userId)) return { lyDo: 'het_luot_ngay' as const };
  const nn = docNgonNgu(input.ngonNgu);
  const giong = docGiong(input.giong);
  const chuDe = String(input.chuDe ?? '').trim().slice(0, 160);
  if (!input.audio?.length) {
    const noi = MO_TRO_CHUYEN[nn];
    return { noi, nghe: '', ...(await docGiaSuTheoGiong(noi, giong, nn)) };
  }
  if (input.audio.length > 2 * 1024 * 1024) throw new BadRequestError('Bản ghi quá dài');
  if (!isAiAvailable()) return { lyDo: 'ai_unavailable' as const };
  const tr = await transcribeWithGroq(input.audio, 'noi.wav', 'audio/wav', { language: '' }).catch(() => null);
  const nghe = String((tr as { text?: string } | null)?.text ?? '').trim().slice(0, 400);
  if (!nghe) {
    const noi = chon(CHUA_NGHE);
    return { noi, nghe: '', ...(await docGiaSuTheoGiong(noi, giong, nn)) };
  }
  const lichSu = (Array.isArray(input.lichSu) ? input.lichSu : [])
    .slice(-8)
    .map((t) => ({ ai: !!(t as { ai?: unknown }).ai, text: String((t as { text?: unknown }).text ?? '').slice(0, 400) }))
    .filter((t) => t.text);
  const kq = await llmComplete({
    step: 'generation',
    purpose: 'language_tutor',
    feature: 'chat',
    userId,
    maxTokens: 320,
    system: troChuyenHeThong(nn, chuDe),
    messages: [
      ...lichSu.map((t) => ({ role: (t.ai ? 'assistant' : 'user') as 'assistant' | 'user', content: t.text })),
      { role: 'user' as const, content: nghe },
    ],
  });
  const noi = (kq.text ?? '').replace(/```[a-z]*|```/g, '').replace(/\*\*/g, '').trim();
  if (!noi) return { lyDo: 'loi_ai' as const, nghe };
  return { noi, nghe, ...(await docGiaSuTheoGiong(noi, giong, nn)) };
}
