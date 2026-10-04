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

const KHEN = ['Tốt lắm, bạn đọc chuẩn rồi!', 'Hay quá, câu này bạn đọc rất rõ!', 'Chuẩn rồi đấy!', 'Giỏi lắm, phát âm rất ổn!'];
const chon = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const NGUONG_DAT = 85;
const SO_LAN_TOI_DA = 3;
const NGUYEN_AM = /[aeiouɪʊəɜɑɒɔæʌ]/;

/** Âm yếu nhất — tên âm gắn theo IPA câu mẫu (chỉ khi số âm khớp với Azure). */
function amYeuNhat(k: KetQuaPhatAm, ipa?: string): { tu: string; am: string | null; diem: number; cuoi: boolean } | null {
  const ipaTu = (ipa ?? '').split(/\s+/).filter(Boolean);
  let vi = 0;
  let best: { tu: string; am: string | null; diem: number; cuoi: boolean } | null = null;
  for (const w of k.tu) {
    if (w.loi === 'Insertion') continue;
    const ten = ipaTu[vi] ? tachAm(ipaTu[vi]) : [];
    vi++;
    if (w.loi === 'Omission') continue;
    if (!w.am.length) {
      if (!best || w.diem < best.diem) best = { tu: w.tu, am: null, diem: w.diem, cuoi: false };
      continue;
    }
    w.am.forEach((a, i) => {
      const am = ten.length === w.am.length ? ten[i] : null;
      if (!best || a.diem < best.diem) best = { tu: w.tu, am, diem: a.diem, cuoi: i === w.am.length - 1 };
    });
  }
  return best;
}

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
export function nhanXet(k: KetQuaPhatAm, mau: CauMau, lanThu: number, diemTruoc?: number): { noi: string; dat: boolean } {
  // Khen tiến bộ so với lần đọc trước CÙNG câu — người học thấy công sức của mình có kết quả.
  const tienBo = diemTruoc != null && k.diem.tong >= diemTruoc + 5
    ? `${chon(TIEN_BO)} Từ ${diemTruoc} lên ${k.diem.tong} điểm. `
    : '';
  if (k.diem.tong >= NGUONG_DAT) return { noi: tienBo ? `${tienBo}Câu này đạt rồi!` : `${chon(KHEN)} Bạn được ${k.diem.tong} điểm.`, dat: true };
  const thieu = k.tu.find((w) => w.loi === 'Omission');
  if (thieu) return { noi: `Bạn đọc thiếu từ [en]${thieu.tu}[/en] rồi. Nghe lại rồi đọc đủ cả câu nhé.`, dat: false };
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
export async function docGiaSu(noi: string): Promise<string | null> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!key) return null;
  const r2 = `ielts/audio/giasu/${crypto.createHash('sha1').update(`${GIONG_GIA_SU}|${noi}`).digest('hex')}.mp3`;
  const dang = dangTao.get(r2);
  if (dang) return dang;
  const p = (async () => {
    if (await objectExists(r2)) return buildPublicUrl(r2);
    const body = tachDoan(noi).map((d) => `<lang xml:lang="${d.en ? 'en-GB' : 'vi-VN'}">${escXml(d.t)}</lang>`).join(' ');
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
const GIONG_ANH = 'en-GB-SoniaNeural';
let nhaNghiDen = 0;

export function docGiong(x: unknown): GiongGoi {
  return x === 'khanh-linh' || x === 'cuong' ? x : 'mac-dinh';
}

/** Một đoạn tiếng Anh bằng Sonia → URL mp3 (lưu R2 theo băm). */
async function docDoanAnh(t: string): Promise<string | null> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!key) return null;
  const r2 = `ielts/audio/giasu/${crypto.createHash('sha1').update(`${GIONG_ANH}|${t}`).digest('hex')}.mp3`;
  if (await objectExists(r2)) return buildPublicUrl(r2);
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'cuongthai-ielts-goi' },
    signal: AbortSignal.timeout(15_000),
    body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-GB"><voice name="${GIONG_ANH}"><prosody rate="-4%">${escXml(t)}</prosody></voice></speak>`,
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
export async function docGiaSuTheoGiong(noi: string, giong: GiongGoi): Promise<{ audioUrl: string | null; audioUrls?: string[]; giongThat: GiongGoi }> {
  if (giong === 'mac-dinh' || Date.now() < nhaNghiDen) return { audioUrl: await docGiaSu(noi), giongThat: 'mac-dinh' };
  const doan = tachDoan(noi);
  const tongViet = doan.filter((d) => !d.en).reduce((n, d) => n + d.t.length, 0);
  // F5 đo thật: ~0,9 s cố định + 0,38 × số giây tiếng (~16,5 ký tự/giây) — cho gấp đôi.
  const hanMs = Math.min(15_000, 3_000 + Math.round((tongViet / 16.5) * 0.38 * 2 * 1000));
  const t0 = Date.now();
  try {
    const urls = await Promise.all(doan.map(async (d) => {
      if (d.en) {
        const u = await docDoanAnh(d.t);
        if (!u) throw new Error('Azure Sonia hỏng');
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
    return { audioUrl: await docGiaSu(noi), giongThat: 'mac-dinh' };
  }
}

/* ── Một lượt luyện ──────────────────────────────────────────────────── */

const CO_DAU = /[ăâđêôơưàáạảãầấậẩẫằắặẳẵèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
const chu = (s: string) => s.toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean);
/** Bao nhiêu phần từ của câu mẫu xuất hiện trong câu nghe được. */
function giongNhau(a: string, b: string) {
  const A = chu(a);
  const B = new Set(chu(b));
  return A.length ? A.filter((w) => B.has(w)).length / A.length : 0;
}

function sachDanhSach(raw: unknown): CauMau[] {
  const ds = (Array.isArray(raw) ? raw : [])
    .map((x) => ({ text: String((x as CauMau)?.text ?? '').trim().slice(0, 160), ipa: (x as CauMau)?.ipa ? String((x as CauMau).ipa).slice(0, 300) : undefined }))
    .filter((x) => x.text)
    .slice(0, 40);
  return ds.length ? ds : NGAN_HANG;
}

/**
 * Một lượt luyện. Không có audio = mở cuộc gọi (chào + câu mẫu đầu).
 * Trả `loai: 'hoi'` khi người học nói tiếng Việt (đang hỏi) — web nói câu đệm
 * rồi gọi `hoiGiaSu`.
 */
export async function goiGiaSu(
  userId: number,
  input: { audio?: Buffer; danhSach?: unknown; viTri?: unknown; lanThu?: unknown; chuDe?: unknown; diemTruoc?: unknown; giong?: unknown },
) {
  if (!demLuot(userId)) return { lyDo: 'het_luot_ngay' as const };
  const giong = docGiong(input.giong);
  const ds = sachDanhSach(input.danhSach);
  let viTri = Math.max(0, Math.min(ds.length - 1, Number(input.viTri) || 0));
  let lanThu = Math.max(0, Number(input.lanThu) || 0);
  const mau = ds[viTri];
  const chuDe = String(input.chuDe ?? '').trim().slice(0, 120);

  if (!input.audio?.length) {
    // Ngắn và CỐ ĐỊNH: đọc tên bài ("Nói: Trả lời câu hỏi Wh- (Part 1 · …)") nghe rất kỳ
    // và kéo lời chào tới 19 giây (đo 03/10). Câu cố định thì lưu R2 một lần, mở là phát ngay.
    void chuDe;
    const noi = 'Chào bạn! Mình là CuongMini, bạn luyện phát âm của bạn đây. Bạn nghe câu mẫu rồi đọc theo, mình chấm và sửa ngay nhé. Muốn hỏi gì cứ nói tiếng Việt. Câu đầu tiên đây.';
    return { loai: 'mo' as const, noi, ...(await docGiaSuTheoGiong(noi, giong)), mau, viTri, lanThu: 0 };
  }
  if (input.audio.length > 1024 * 1024) throw new BadRequestError('Bản ghi quá dài');

  const [tr, pa] = await Promise.all([
    transcribeWithGroq(input.audio, 'luot.wav', 'audio/wav', { language: '', hints: mau.text }).catch(() => null),
    chamPhatAm(userId, { audio: input.audio, cau: mau.text, giong: 'uk' }).catch(() => null),
  ]);
  const nghe = String((tr as { text?: string } | null)?.text ?? '').trim();
  const k = pa?.ketQua ? hieuChinh(pa.ketQua) : null;

  // Nói tiếng Việt và không giống câu mẫu ⇒ đang hỏi gia sư.
  if (nghe && CO_DAU.test(nghe) && giongNhau(mau.text, nghe) < 0.5) {
    // Câu đệm nói NGAY (tệp lưu R2 nên lần sau tức thì) trong lúc web gọi AI ~10 giây.
    const noi = chon(['Câu hỏi hay đấy, để mình giải thích nhé.', 'À, bạn hỏi hay lắm. Đợi mình một chút nhé.', 'Để mình giải thích cho bạn nhé.']);
    return { loai: 'hoi' as const, nghe, noi, ...(await docGiaSuTheoGiong(noi, giong)), mau, viTri, lanThu };
  }
  if (!k) {
    const noi = pa?.lyDo === 'het_luot_thang'
      ? 'Máy chấm phát âm đã hết lượt miễn phí của tháng này. Bạn vẫn có thể hỏi mình bằng tiếng Việt nhé.'
      : 'Mình chưa nghe rõ. Bạn đọc to hơn một chút, gần micro hơn nhé.';
    return { loai: 'luyen' as const, nghe, noi, ...(await docGiaSuTheoGiong(noi, giong)), mau, viTri, lanThu, cham: null, doiCau: false };
  }

  lanThu += 1;
  const diemTruoc = lanThu > 1 && Number.isFinite(Number(input.diemTruoc)) ? Number(input.diemTruoc) : undefined;
  const nx = nhanXet(k, mau, lanThu, diemTruoc);
  let noi = nx.noi;
  let moi = mau;
  if (nx.dat || lanThu >= SO_LAN_TOI_DA) {
    if (!nx.dat) noi = 'Câu này hơi khó, mình để lần sau luyện tiếp nhé.';
    viTri = (viTri + 1) % ds.length;
    moi = ds[viTri];
    lanThu = 0;
    noi += ' Câu tiếp theo đây.';
  }
  return {
    loai: 'luyen' as const,
    nghe,
    noi,
    ...(await docGiaSuTheoGiong(noi, giong)),
    mau: moi,
    viTri,
    lanThu,
    doiCau: moi !== mau,
    cham: { tong: k.diem.tong, tu: k.tu.map((w) => ({ tu: w.tu, diem: w.diem, loi: w.loi })) },
  };
}

/* ── Lượt hỏi (có AI) ────────────────────────────────────────────────── */

const HE_THONG_HOI = [
  'Bạn là CuongMini — robot GIA SƯ PHÁT ÂM TIẾNG ANH dễ thương, xưng "mình", đang nói chuyện qua điện thoại với người Việt mới học. Trả lời BẰNG TIẾNG VIỆT câu người học vừa hỏi.',
  '- 2–4 câu ngắn, dưới 70 chữ. Đây là lời NÓI: không markdown, không gạch đầu dòng, không emoji, không ký hiệu IPA — mô tả khẩu hình bằng lời.',
  '- MỌI từ hay câu tiếng Anh bọc trong [en]…[/en]. Ví dụ: Từ [en]think[/en] có âm th.',
  '- Câu cuối mời người học quay lại đọc câu mẫu đang luyện.',
  'Chỉ trả về lời nói, không gì khác.',
].join('\n');

export async function hoiGiaSu(userId: number, b: { cauHoi?: unknown; mau?: unknown; chuDe?: unknown; giong?: unknown }) {
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
    system: HE_THONG_HOI,
    messages: [{ role: 'user', content: `${chuDe ? `Đang học: ${chuDe}\n` : ''}${mau ? `Câu mẫu đang luyện: "${mau}"\n` : ''}Người học hỏi: "${cauHoi}"` }],
  });
  const noi = (kq.text ?? '').replace(/```[a-z]*|```/g, '').trim();
  if (!noi) return { lyDo: 'loi_ai' as const };
  return { noi, ...(await docGiaSuTheoGiong(noi, docGiong(b.giong))) };
}
