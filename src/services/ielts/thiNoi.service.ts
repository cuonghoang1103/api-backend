/**
 * PHÒNG THI SPEAKING với giám khảo AI (12/11/2026) — docs/ielts-lo-trinh-0-8.md mục 4.1 / 4.3 / 1.3.
 * ─────────────────────────────────────────────────────────────────────────
 * Hai đường:
 *  1. `luotNoi` — MỘT câu trả lời (WAV 16 kHz web gửi sau mỗi câu, không chờ hết bài): Whisper (Groq) ra chữ
 *     + Azure chấm phát âm (unscripted, 45 giây đầu — REST short-audio trần 60 s, gói F0 5 giờ/tháng) chạy
 *     song song. Trả ngay, web giữ lại và đi tiếp câu sau; không gọi model chữ (giữ độ trễ ≈ 2–3 s).
 *  2. `chamNoi` — khi xong cả bài: MỘT lời gọi model chữ (purpose `exam_grade`, như chấm Writing) chấm
 *     FC · LR · GRA · P theo band descriptors từ bản phiên âm của mọi câu; P = trung bình band model ước lượng
 *     và band quy từ điểm Azure (có Azure). Chạy NỀN (Cloudflare cắt 100 s) — web hỏi lại `ketQuaChamNoi`.
 *     Xong thì tự lưu `ielts_cdt_attempts` (kyNang 'noi') để tab Result mở lại được.
 *
 * Band tổng Speaking = trung bình 4 tiêu chí làm tròn XUỐNG .5 (mục 4.3: "W/S = AI, làm tròn .5 xuống"
 * — cũng là cách IELTS thật tính Speaking). Không nói được (dưới 25 từ cả bài) ⇒ band 3.0, không gọi model.
 *
 * ⚠️ AUDIO KHÔNG LƯU: đi từ RAM sang Whisper/Azure rồi bỏ; CSDL chỉ giữ chữ + điểm.
 * Trần: `IELTS_NOI_TRAN_LUOT_NGAY` câu/người/ngày (mặc định 120) · `IELTS_NOI_TRAN_CHAM_NGAY` bài chấm/người/ngày
 * (mặc định 4, đếm trong CSDL + việc đang chạy) · `IELTS_NOI_AZURE=0` tắt Azure (P chỉ từ model).
 */
import { laAdmin } from '../pro.service.js';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import { isAiAvailable, llmComplete, checkTokenQuota } from '../interview/llm/index.js';
import { transcribeWithGroq } from '../interview/voice/stt.js';
import { chamPhatAm } from './phatAm.service.js';
import { docJsonCham } from './thiMay.service.js';
import { dauNgayVn } from '../agent/anthropicChinhHang/hanMuc.js';
import { logger } from '../../utils/logger.js';

const TRAN_LUOT_NGAY = () => Math.max(1, Number(process.env.IELTS_NOI_TRAN_LUOT_NGAY ?? 120) || 120);
const TRAN_CHAM_NGAY = () => Math.max(1, Number(process.env.IELTS_NOI_TRAN_CHAM_NGAY ?? 4) || 4);
const AZURE_BAT = () => process.env.IELTS_NOI_AZURE !== '0' && !!process.env.AZURE_SPEECH_KEY;
const AZURE_GIAY = 45;
const TOI_DA_GIAY = 150;
const TOI_DA_BYTE = 8 * 1024 * 1024;

const demNgay = new Map<string, number>();
function demLuot(userId: number): boolean {
  const k = `${userId}:${dauNgayVn().toISOString().slice(0, 10)}`;
  const n = (demNgay.get(k) ?? 0) + 1;
  if (n > TRAN_LUOT_NGAY()) return false;
  demNgay.set(k, n);
  if (demNgay.size > 5000) demNgay.clear();
  return true;
}

/* ── WAV ──────────────────────────────────────────────────────────────── */

/** Độ dài giây của WAV PCM (đọc header; không tin trình duyệt). null = không phải WAV. */
export function giayWav(buf: Buffer): number | null {
  if (buf.length < 44 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') return null;
  const byteRate = buf.readUInt32LE(28);
  return byteRate > 0 ? (buf.length - 44) / byteRate : null;
}

/** Cắt WAV PCM (header 44 byte chuẩn của wav.ts) lấy `giay` giây đầu — sửa lại hai ô kích thước. */
export function catWav(buf: Buffer, giay: number): Buffer {
  const byteRate = buf.readUInt32LE(28);
  const toiDa = Math.floor(byteRate * giay) & ~1;
  if (buf.length - 44 <= toiDa) return buf;
  const ra = Buffer.concat([buf.subarray(0, 44), buf.subarray(44, 44 + toiDa)]);
  ra.writeUInt32LE(36 + toiDa, 4);
  ra.writeUInt32LE(toiDa, 40);
  return ra;
}

/* ── Một câu trả lời ────────────────────────────────────────────────────── */

export type PhatAmCau = { chinhXac: number; troiChay: number; tong: number; soTu: number };
export type KetQuaLuotNoi = {
  transcript: string;
  imLang: boolean;
  giay: number;
  phatAm: PhatAmCau | null;
  lyDo?: 'stt_unavailable' | 'het_luot_ngay';
};

export async function luotNoi(userId: number, input: { audio: Buffer; part?: unknown; cau?: unknown }): Promise<KetQuaLuotNoi> {
  if (!input.audio?.length) throw new BadRequestError('Thiếu audio');
  if (input.audio.length > TOI_DA_BYTE) throw new BadRequestError('Bản ghi quá lớn');
  const giay = giayWav(input.audio);
  if (giay == null) throw new BadRequestError('Âm thanh phải là WAV PCM 16 kHz (web tự đổi trước khi gửi)');
  if (giay > TOI_DA_GIAY) throw new BadRequestError(`Mỗi câu tối đa ${TOI_DA_GIAY} giây`);
  const part = [1, 2, 3].includes(Number(input.part)) ? Number(input.part) : 1;
  const cau = String(input.cau ?? '').slice(0, 400);
  // Admin (chủ web) KHÔNG bị trần — user 12/11/2026: "admin đừng giới hạn gì hết".
  const admin = await laAdmin(userId).catch(() => false);
  if (!admin && !demLuot(userId)) return { transcript: '', imLang: true, giay, phatAm: null, lyDo: 'het_luot_ngay' };
  if (giay < 0.5) return { transcript: '', imLang: true, giay, phatAm: null };

  const [tr, pa] = await Promise.all([
    transcribeWithGroq(input.audio, 'cau.wav', 'audio/wav', {
      language: 'en',
      hints: `IELTS Speaking Part ${part} answer.${cau ? ` Question: ${cau}` : ''}`,
      detail: true,
    }).catch((e: unknown) => { logger.warn('[thi-noi] Whisper lỗi', { error: (e as Error).message }); return null; }),
    AZURE_BAT()
      ? chamPhatAm(userId, { audio: catWav(input.audio, AZURE_GIAY), cau: '', tuDo: true, toiDaGiay: AZURE_GIAY, giong: 'uk' })
        .catch((e: unknown) => { logger.warn('[thi-noi] Azure lỗi', { error: (e as Error).message }); return null; })
      : Promise.resolve(null),
  ]);
  if (!tr) return { transcript: '', imLang: true, giay, phatAm: null, lyDo: 'stt_unavailable' };
  const transcript = (tr.text ?? '').trim().slice(0, 4000);
  // Whisper không bao giờ nói "không nghe thấy gì" — clip phòng trống vẫn ra một câu phổ biến ⇒ tự nhận im lặng.
  const im = (tr as { noSpeechProb?: number }).noSpeechProb;
  const imLang = transcript.split(/\s+/).filter(Boolean).length < 3 || (typeof im === 'number' && im > 0.6);
  const k = pa?.ketQua;
  const phatAm: PhatAmCau | null = k && !imLang
    ? { chinhXac: k.diem.chinhXac, troiChay: k.diem.troiChay, tong: k.diem.tong, soTu: k.tu.filter((w) => w.loi !== 'Insertion' && w.loi !== 'Omission').length }
    : null;
  return { transcript: imLang ? '' : transcript, imLang, giay, phatAm };
}

/* ── Chấm cả bài ────────────────────────────────────────────────────────── */

export type BanGhiVao = { part: 1 | 2 | 3; cau: string; transcript: string; giay?: number; phatAm?: PhatAmCau | null };
export type TieuChiNoi = { fc: number; lr: number; gra: number; p: number };
export type KetQuaChamNoi = {
  band: number;
  tieuChi: TieuChiNoi;
  nhanXetTieuChi: Record<keyof TieuChiNoi, string>;
  nhanXet: string;
  loi: { part: 1 | 2 | 3; goc: string; sua: string; vi: string }[];
  noiLai: { part: 1 | 2 | 3; cau: string; goc: string; tot: string }[];
  /** P lấy từ đâu: Azure + model, hay chỉ model (không có khoá Azure / clip hỏng). */
  pNguon: 'azure+ai' | 'ai' | 'im-lang';
  banGhi: BanGhiVao[];
  luotId: number | null;
};

/** Band tổng Speaking: trung bình 4 tiêu chí làm tròn XUỐNG .5 (mục 4.3 + cách IELTS thật tính Speaking). */
export function lamTronXuongNua(x: number): number {
  return Math.max(0, Math.min(9, Math.floor(x * 2 + 1e-9) / 2));
}

/** Điểm Azure (0–100) → band Pronunciation ước lượng (bảng nội bộ, hiệu chỉnh theo đo thật dần). */
export function bandTuAzure(diem: number): number {
  const bang: [number, number][] = [[92, 8], [88, 7.5], [84, 7], [79, 6.5], [74, 6], [68, 5.5], [60, 5], [50, 4.5], [40, 4]];
  for (const [nguong, b] of bang) if (diem >= nguong) return b;
  return 3.5;
}

/** Điểm P tổng hợp từ Azure của mọi câu: 70 % chính xác + 30 % trôi chảy, nặng theo số từ của từng câu. */
export function diemAzureTong(banGhi: BanGhiVao[]): number | null {
  const co = banGhi.filter((b) => b.phatAm && b.phatAm.soTu > 0);
  if (!co.length) return null;
  const tongTu = co.reduce((s, b) => s + b.phatAm!.soTu, 0);
  return co.reduce((s, b) => s + (b.phatAm!.chinhXac * 0.7 + b.phatAm!.troiChay * 0.3) * b.phatAm!.soTu, 0) / tongTu;
}

const kep = (x: unknown): number | null => {
  const v = Number(x);
  return Number.isFinite(v) ? Math.max(0, Math.min(9, Math.round(v * 2) / 2)) : null;
};
const sachBanGhi = (raw: unknown): BanGhiVao[] => (Array.isArray(raw) ? raw : [])
  .slice(0, 30)
  .map((x) => {
    const b = (x ?? {}) as Partial<BanGhiVao>;
    const part = [1, 2, 3].includes(Number(b.part)) ? (Number(b.part) as 1 | 2 | 3) : 1;
    const pa = b.phatAm && typeof b.phatAm === 'object' ? b.phatAm : null;
    return {
      part, cau: String(b.cau ?? '').slice(0, 400), transcript: String(b.transcript ?? '').slice(0, 4000),
      giay: Math.max(0, Math.min(TOI_DA_GIAY, Math.round(Number(b.giay) || 0))),
      phatAm: pa ? { chinhXac: Math.round(Number(pa.chinhXac) || 0), troiChay: Math.round(Number(pa.troiChay) || 0), tong: Math.round(Number(pa.tong) || 0), soTu: Math.round(Number(pa.soTu) || 0) } : null,
    };
  })
  .filter((b) => b.cau);

const RUBRIC = [
  'Bạn là giám khảo IELTS Speaking nghiêm túc, chấm theo band descriptors công khai (Fluency & Coherence · Lexical Resource · Grammatical Range & Accuracy · Pronunciation).',
  'Người học là người Việt, đích band 8.0. Nhận xét bằng TIẾNG VIỆT; trích câu của người học bằng tiếng Anh nguyên văn.',
  'Bạn nhận BẢN PHIÊN ÂM máy (Whisper) của từng câu trả lời ở 3 Part, kèm độ dài giây và (nếu có) điểm phát âm Azure 0–100 của câu đó.',
  'Mỗi tiêu chí một band thang 0.5 (0–9). Cột mốc: band 5 = giữ mạch nhờ lặp/tự sửa, câu phức ít và sai nhiều; band 6 = sẵn lòng nói dài, trộn câu đơn + phức, lỗi hiếm gây hiểu sai; band 7 = nói dài không gắng sức, có từ ít gặp/idiom, nhiều câu phức thường không lỗi; band 8 = ngắt chỉ vì nội dung, idiom dùng khéo, đa số câu không lỗi.',
  'FC: nhìn độ dài câu trả lời so với giây (nói ngắn trong Part 2 < 60 giây là thiếu), câu bỏ trống/im lặng, lặp từ, filler, từ nối. Câu im lặng ("(im lặng)") kéo FC xuống mạnh.',
  'P: bạn KHÔNG nghe được giọng — chỉ ước lượng từ dấu vết trong chữ (từ bị nghe nhầm, câu đứt) và điểm Azure nếu có; nếu không có Azure thì cho P bằng trung bình FC/LR/GRA trừ 0.5 và nói rõ là ước lượng.',
  'Không nâng điểm để động viên. Một band 7 cần phần lớn câu không lỗi và từ vựng ít phổ biến dùng chính xác.',
  'Trả về DUY NHẤT một JSON hợp lệ, không markdown, đúng khuôn:',
  '{"fc":{"band":6,"nhanXet":"1–2 câu, trích dẫn"},"lr":{"band":6,"nhanXet":"…"},"gra":{"band":6,"nhanXet":"…"},"p":{"band":6,"nhanXet":"…"},',
  ' "nhanXet":"3–4 câu tổng kết: điểm mạnh, ưu tiên sửa gì trước để lên band",',
  ' "loi":[{"part":1,"goc":"cụm/câu sai nguyên văn","sua":"bản sửa","vi":"vì sao sai, 1 câu"}],',
  ' "noiLai":[{"part":2,"cau":"câu hỏi","goc":"câu người học nói (nguyên văn, rút gọn)","tot":"cách nói tự nhiên hơn ở mức band cao hơn 1 band, GIỮ ý của người học"}]}',
  '"loi" tối đa 8 mục (lỗi ảnh hưởng band nhiều nhất); "noiLai" 3 mục — một cho mỗi Part nếu có câu trả lời.',
  'Khi trích câu của người học BÊN TRONG một giá trị chuỗi, dùng dấu nháy đơn \'…\' — KHÔNG dùng dấu " (làm hỏng JSON).',
].join('\n');

/** Chuẩn hoá JSON model trả về + ghép Azure vào P + band tổng. Ném lỗi khi thiếu tiêu chí. */
export function chuanKetQuaNoi(raw: unknown, banGhi: BanGhiVao[]): Omit<KetQuaChamNoi, 'luotId' | 'banGhi'> {
  const j = (raw ?? {}) as Record<string, unknown>;
  const lay = (k: string) => {
    const x = (j[k] ?? {}) as { band?: unknown; nhanXet?: unknown };
    return { band: kep(x.band), nhanXet: String(x.nhanXet ?? '').slice(0, 800) };
  };
  const fc = lay('fc'), lr = lay('lr'), gra = lay('gra'), p = lay('p');
  if (fc.band == null || lr.band == null || gra.band == null) throw new Error('thiếu tiêu chí');
  const azure = diemAzureTong(banGhi);
  let pBand = p.band ?? lamTronXuongNua((fc.band + lr.band + gra.band) / 3 - 0.5);
  let pNguon: KetQuaChamNoi['pNguon'] = 'ai';
  if (azure != null) {
    pBand = Math.round(((pBand + bandTuAzure(azure)) / 2) * 2) / 2;
    pNguon = 'azure+ai';
  }
  const tieuChi: TieuChiNoi = { fc: fc.band, lr: lr.band, gra: gra.band, p: pBand };
  const part = (x: unknown): 1 | 2 | 3 => ([1, 2, 3].includes(Number(x)) ? (Number(x) as 1 | 2 | 3) : 1);
  const loi = (Array.isArray(j.loi) ? j.loi as Record<string, unknown>[] : []).slice(0, 8)
    .map((l) => ({ part: part(l.part), goc: String(l.goc ?? '').slice(0, 400), sua: String(l.sua ?? '').slice(0, 400), vi: String(l.vi ?? '').slice(0, 400) }))
    .filter((l) => l.goc && l.sua);
  const noiLai = (Array.isArray(j.noiLai) ? j.noiLai as Record<string, unknown>[] : []).slice(0, 4)
    .map((l) => ({ part: part(l.part), cau: String(l.cau ?? '').slice(0, 400), goc: String(l.goc ?? '').slice(0, 1200), tot: String(l.tot ?? '').slice(0, 2000) }))
    .filter((l) => l.tot);
  return {
    band: lamTronXuongNua((tieuChi.fc + tieuChi.lr + tieuChi.gra + tieuChi.p) / 4),
    tieuChi,
    nhanXetTieuChi: { fc: fc.nhanXet, lr: lr.nhanXet, gra: gra.nhanXet, p: p.nhanXet + (azure != null ? ` (Azure chấm phát âm ${Math.round(azure)}/100 ⇒ band ≈ ${bandTuAzure(azure).toFixed(1)}; P là trung bình hai nguồn.)` : '') },
    nhanXet: String(j.nhanXet ?? '').slice(0, 1500),
    loi, noiLai, pNguon,
  };
}

/** Bài gần như không nói được ⇒ band 3.0 mọi tiêu chí (mục 4.3), không gọi model. */
export function ketQuaImLang(banGhi: BanGhiVao[]): Omit<KetQuaChamNoi, 'luotId' | 'banGhi'> {
  const noi = banGhi.filter((b) => b.transcript.trim()).length;
  return {
    band: 3, tieuChi: { fc: 3, lr: 3, gra: 3, p: 3 },
    nhanXetTieuChi: { fc: 'Hầu hết câu hỏi không có câu trả lời.', lr: 'Chưa đủ lời nói để chấm.', gra: 'Chưa đủ lời nói để chấm.', p: 'Chưa đủ lời nói để chấm.' },
    nhanXet: `Bạn trả lời được ${noi}/${banGhi.length} câu và tổng số từ quá ít để chấm — band 3.0 (mục 4.3: không nói được 20 giây ⇒ chuyển câu). Bắt đầu từ Part 1 với công thức Trả lời → Lý do → Ví dụ (Tập 1), tập nói 20–30 giây cho mỗi câu quen thuộc.`,
    loi: [], noiLai: [], pNguon: 'im-lang',
  };
}

type Viec = { userId: number; luc: number; xong: boolean; kq?: KetQuaChamNoi; loi?: string; lyDo?: 'parse_failed' | 'loi_ai' };
const VIEC = new Map<string, Viec>();
const VIEC_TTL = 30 * 60_000;
function donViec() { const han = Date.now() - VIEC_TTL; for (const [k, v] of VIEC) if (v.luc < han) VIEC.delete(k); }

async function daChamHomNay(userId: number): Promise<number> {
  const db = await prisma.ieltsCdtAttempt.count({ where: { userId, kyNang: 'noi', createdAt: { gte: dauNgayVn() } } });
  const dang = [...VIEC.values()].filter((v) => v.userId === userId && !v.xong).length;
  return db + dang;
}

async function chamThat(userId: number, deId: string, cheDo: 'full' | 'practice', banGhi: BanGhiVao[], giay: number): Promise<KetQuaChamNoi> {
  const tongTu = banGhi.reduce((s, b) => s + b.transcript.split(/\s+/).filter(Boolean).length, 0);
  let kq: Omit<KetQuaChamNoi, 'luotId' | 'banGhi'>;
  if (tongTu < 25) {
    kq = ketQuaImLang(banGhi);
  } else {
    const user = banGhi.map((b, i) => `[${i + 1}] Part ${b.part} — Hỏi: ${b.cau}\n`
      + `   Trả lời (${b.giay ?? 0}s${b.phatAm ? `, Azure phát âm ${b.phatAm.tong}/100` : ''}): ${b.transcript.trim() || '(im lặng)'}`).join('\n');
    const r = await llmComplete({
      step: 'generation', purpose: 'exam_grade', feature: 'chat', userId,
      maxTokens: 3500, timeoutMs: 180_000, maxRetries: 1,
      system: RUBRIC,
      messages: [{ role: 'user', content: `Đề ${deId} — IELTS Speaking, ${banGhi.length} câu.\n\n${user}` }],
    });
    try {
      kq = chuanKetQuaNoi(docJsonCham(r?.text ?? ''), banGhi);
    } catch (e) {
      logger.warn('[thi-noi] không đọc được JSON của model', { dai: r?.text?.length ?? 0, duoi: (r?.text ?? '').slice(-160), loi: (e as Error).message });
      throw Object.assign(new Error('parse_failed'), { lyDo: 'parse_failed' });
    }
  }
  const luot = await prisma.ieltsCdtAttempt.create({
    data: {
      userId, deId, kyNang: 'noi', cheDo, dung: null, tong: null, band: kq.band, giay: Math.max(0, Math.min(3600, giay)),
      chiTiet: { ...kq, banGhi } as object,
    },
    select: { id: true },
  }).catch((e: unknown) => { logger.warn('[thi-noi] không lưu được lượt', { error: (e as Error).message }); return null; });
  return { ...kq, banGhi, luotId: luot?.id ?? null };
}

/** POST — trả `viecId` ngay; model chạy nền. */
export async function chamNoi(userId: number, b: { deId?: unknown; cheDo?: unknown; banGhi?: unknown; giay?: unknown }) {
  const deId = String(b.deId ?? '').trim();
  if (!/^[a-z0-9-]{2,40}$/.test(deId)) throw new BadRequestError('deId không hợp lệ');
  const cheDo = b.cheDo === 'luyen' ? 'practice' : 'full';
  const banGhi = sachBanGhi(b.banGhi);
  if (!banGhi.length) throw new BadRequestError('Chưa có câu trả lời nào');
  const giay = Math.round(Number(b.giay) || 0);
  if (!isAiAvailable()) return { viecId: null, ketQua: null, lyDo: 'ai_unavailable' as const };
  if (!(await checkTokenQuota(userId))) throw new AppError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.', 429);
  donViec();
  if (!(await laAdmin(userId).catch(() => false)) && (await daChamHomNay(userId)) >= TRAN_CHAM_NGAY()) {
    throw new AppError(`Mỗi ngày chấm tối đa ${TRAN_CHAM_NGAY()} bài Speaking (mỗi bài tốn Whisper + Azure + model). Mai thi tiếp nhé.`, 429);
  }
  const viecId = `${userId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const v: Viec = { userId, luc: Date.now(), xong: false };
  VIEC.set(viecId, v);
  void chamThat(userId, deId, cheDo, banGhi, giay)
    .then((kq) => { v.kq = kq; })
    .catch((e: unknown) => {
      const err = e as Error & { lyDo?: 'parse_failed' };
      v.lyDo = err.lyDo ?? 'loi_ai';
      v.loi = (err.message || 'Máy chấm lỗi').slice(0, 300);
    })
    .finally(() => { v.xong = true; });
  return { viecId, soCau: banGhi.length };
}

export function ketQuaChamNoi(userId: number, viecId: string) {
  const v = VIEC.get(viecId);
  if (!v || v.userId !== userId) return { xong: true, ketQua: null, lyDo: 'khong_thay' as const };
  if (!v.xong) return { xong: false, giay: Math.round((Date.now() - v.luc) / 1000) };
  if (!v.kq) return { xong: true, ketQua: null, lyDo: v.lyDo ?? ('loi_ai' as const), thongBao: v.loi };
  return { xong: true, ketQua: v.kq };
}
