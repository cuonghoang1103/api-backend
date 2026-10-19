/**
 * 💬⚡ TRÒ CHUYỆN CÙNG CUONGMINI — bản CHẢY DẦN (19/10/2026).
 *
 * Bản cũ (`goiGiaSu.service.ts › troChuyen`) đi TUẦN TỰ từng chặng: Whisper nghe
 * hết → model viết HẾT câu trả lời (modelapi `gpt-6-sol`, không stream, cổng tự
 * nghĩ mức `medium`) → Azure đọc HẾT → lưu R2 → mới trả về. Người học chờ tổng
 * mọi chặng, cộng thêm những lần cổng treo (đo 19/10: 1/15 lượt treo 125 s rồi 524,
 * mà `llmComplete` mặc định chờ 60 s × 4 lần thử).
 *
 * Bản này:
 *  1. Whisper (Groq) — gửi thẳng tệp nén của trình duyệt (webm/mp4), không đổi WAV.
 *  2. Model CHẢY CHỮ: Claude chính hãng **CuongMini Heshin 5.5** (`claude-haiku-5-5`),
 *     không nghĩ (`thinking: disabled`, effort `low`) — lượt nói ngắn không cần nghĩ.
 *     Hỏng / hết credit / chạm trần $/người/ngày ⇒ tự lùi modelapi `gpt-6-sol`
 *     effort `low` (cũng chảy chữ). Cả hai có HẠN CHỮ ĐẦU — quá hạn là bỏ, không treo.
 *  3. `BoCatCau` cắt theo câu ⇒ câu nào trọn là đi TTS NGAY (song song), phát theo
 *     đúng thứ tự — câu đầu đã kêu trong khi model còn đang viết câu sau.
 *  4. Mỗi chặng ghi MỐC thời gian, gửi về web (hiện trong nhật ký, và để đo).
 *
 * Chi tiêu đi sổ `anthropic_usage_logs` với `viec = 'language_tutor'`; trần ngày
 * đọc ở `app_settings` khoá `cuongmini_ngon_ngu` (admin chỉnh, mặc định 0,5 $).
 */
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';
import { isAiAvailable, llmComplete } from '../../interview/llm/index.js';
import { transcribeWithGroq } from '../../interview/voice/stt.js';
import { coKeyKhaDung } from '../../agent/anthropicChinhHang/khoKey.js';
import { goiVanBanChinhHang } from '../../agent/anthropicChinhHang/dinhTuyen.js';
import { dauNgayVn } from '../../agent/anthropicChinhHang/hanMuc.js';
import { docGiaSuTheoGiong, docGiong, type GiongGoi } from '../goiGiaSu.service.js';
import { boSungTheNN } from '../theNgoaiNgu.js';
import { cauMoDau, docNN, timChuDe, type NgonNguTC } from './chuDe.js';
import {
  BoCatCau, chonDuong, docCaiDat, docMeta, dungPrompt, loiNoiSach, sachLichSu, thanhTinNhan,
  type DuongTC, type MetaLuot,
} from './luong.js';

export const MODEL_HESHIN = 'claude-haiku-5-5';
const KHOA_CAI_DAT = 'cuongmini_ngon_ngu';
const HAN_CHU_DAU_MS = 10_000;
const HAN_TONG_MS = 30_000;
const TRAN_NGAY_LUOT = 400;

/* ── Cài đặt admin + trần tiền ─────────────────────────────────────────── */

let nhoCaiDat: { luc: number; v: ReturnType<typeof docCaiDat> } | null = null;
export async function caiDatTroChuyen() {
  if (nhoCaiDat && Date.now() - nhoCaiDat.luc < 30_000) return nhoCaiDat.v;
  const r = await prisma.appSetting.findUnique({ where: { key: KHOA_CAI_DAT } }).catch(() => null);
  const v = docCaiDat(r?.value);
  nhoCaiDat = { luc: Date.now(), v };
  return v;
}
export async function datCaiDatTroChuyen(d: { bat?: unknown; tranNgayUsd?: unknown }) {
  const cu = await caiDatTroChuyen();
  const t = d.tranNgayUsd === undefined ? cu.tranNgayUsd : Number(d.tranNgayUsd);
  if (!Number.isFinite(t) || t < 0 || t > 100) throw new Error('Trần ngày phải là số 0–100 (USD).');
  const v = { bat: typeof d.bat === 'boolean' ? d.bat : cu.bat, tranNgayUsd: t };
  const value = JSON.stringify(v);
  await prisma.appSetting.upsert({ where: { key: KHOA_CAI_DAT }, update: { value }, create: { key: KHOA_CAI_DAT, value } });
  nhoCaiDat = { luc: Date.now(), v };
  return v;
}

/** Đã chi hôm nay (giờ VN) cho việc này. Sổ hỏng ⇒ vô cực (đi dự phòng — tiền thật của chủ app). */
export async function daChiHomNay(userId: number): Promise<number> {
  try {
    const s = await prisma.anthropicUsage.aggregate({
      where: { userId, viec: 'language_tutor', createdAt: { gte: dauNgayVn() } },
      _sum: { costUsd: true },
    });
    return s._sum.costUsd ?? 0;
  } catch (err) {
    logger.warn('[tro-chuyen] không đọc được sổ chi — đi dự phòng', { error: (err as Error).message });
    return Number.POSITIVE_INFINITY;
  }
}

/** Tổng chi của việc này theo ngày (cho admin xem). */
export async function thongKeChi(ngay = 7) {
  const tu = new Date(dauNgayVn().getTime() - (ngay - 1) * 86_400_000);
  const rows = await prisma.anthropicUsage.findMany({
    where: { viec: 'language_tutor', createdAt: { gte: tu } },
    select: { costUsd: true, userId: true, thanhCong: true, ttfbMs: true },
  });
  const ttfb = rows.map((r) => r.ttfbMs).filter((x): x is number => typeof x === 'number').sort((a, b) => a - b);
  return {
    soLuot: rows.length, loi: rows.filter((r) => !r.thanhCong).length,
    tongUsd: Number(rows.reduce((a, r) => a + r.costUsd, 0).toFixed(4)),
    soNguoi: new Set(rows.map((r) => r.userId)).size,
    ttfbTrungVi: ttfb.length ? ttfb[ttfb.length >> 1] : null,
  };
}

const demNgay = new Map<string, number>();
function demLuot(userId: number) {
  const k = `${userId}:${dauNgayVn().toISOString().slice(0, 10)}`;
  const n = (demNgay.get(k) ?? 0) + 1;
  if (n > TRAN_NGAY_LUOT) return false;
  demNgay.set(k, n);
  if (demNgay.size > 5000) demNgay.clear();
  return true;
}

/* ── Sự kiện gửi web ───────────────────────────────────────────────────── */

export type MocTC = Partial<Record<'stt' | 'chuDau' | 'cauDau' | 'ttsDau' | 'het' | 'xong', number>>;
export type SuKienTC =
  | { type: 'nghe'; text: string; ms: number }
  | { type: 'cau'; i: number; text: string; audioUrls: string[]; giongThat: GiongGoi }
  | { type: 'xong'; noi: string; nghe: string; meta: MetaLuot; moc: MocTC; duong: DuongTC | 'mo-dau'; usd?: number }
  | { type: 'loi'; lyDo: string; message: string };

/** Một câu ⇒ dãy tệp âm thanh (giọng máy nhà trả nhiều tệp). */
async function docCau(text: string, giong: GiongGoi, nn: NgonNguTC) {
  const r = await docGiaSuTheoGiong(text, giong, nn);
  return { audioUrls: r.audioUrls?.length ? r.audioUrls : r.audioUrl ? [r.audioUrl] : [], giongThat: r.giongThat };
}

/**
 * Phát các câu TTS ĐÚNG THỨ TỰ dù câu sau đọc xong trước: câu i chỉ được gửi khi
 * câu i−1 đã gửi. `them()` bắt đầu TTS ngay, `doi()` chờ mọi câu đã gửi xong.
 */
export class HangDoc {
  private cuoi: Promise<void> = Promise.resolve();
  private i = 0;
  dauLuc = 0;
  constructor(private docMot: (t: string) => Promise<{ audioUrls: string[]; giongThat: GiongGoi }>, private gui: (e: SuKienTC) => void, private t0: number, private chuan?: (t: string) => string) {}
  them(text: string) {
    if (this.chuan) text = this.chuan(text);
    const i = this.i++;
    const p = this.docMot(text).catch(() => ({ audioUrls: [] as string[], giongThat: 'mac-dinh' as GiongGoi }));
    this.cuoi = this.cuoi.then(async () => {
      const r = await p;
      if (!this.dauLuc) this.dauLuc = Date.now() - this.t0;
      this.gui({ type: 'cau', i, text, ...r });
    });
  }
  doi() { return this.cuoi; }
}

/* ── Một lượt ──────────────────────────────────────────────────────────── */

export interface VaoLuot {
  audio?: Buffer;
  mime?: string;
  ngonNgu?: unknown;
  chuDeId?: unknown;
  tenBai?: unknown;
  giong?: unknown;
  lichSu?: unknown;
  /** Mở lại buổi đã lưu ⇒ câu mở là "quay lại rồi, nói tiếp câu lúc nãy" (không chào lại từ đầu). */
  tiepTuc?: unknown;
}

/** Câu ngoại ngữ CuongMini hỏi gần nhất trong lịch sử (để nói tiếp đúng chỗ). */
export function cauHoiGanNhat(ls: { ai: boolean; text: string }[]): string {
  const ai = [...ls].reverse().find((t) => t.ai)?.text ?? '';
  return ai.match(/\[en\]([\s\S]*?)\[\/en\]/gi)?.pop()?.replace(/\[\/?en\]/gi, '').trim() ?? '';
}

/** Các phụ thuộc ra ngoài (mạng, CSDL) — test thay bằng bản giả để kiểm định tuyến/lùi/trần mà không tốn tiền. */
export interface PhuThuocTC {
  stt: (audio: Buffer, ten: string, mime: string, hints: string) => Promise<string>;
  tts: (text: string, giong: GiongGoi, nn: NgonNguTC) => Promise<{ audioUrls: string[]; giongThat: GiongGoi }>;
  chinhHang: (o: Parameters<typeof goiVanBanChinhHang>[0]) => Promise<{ usd: number }>;
  duPhong: (o: Parameters<typeof llmComplete>[0]) => Promise<unknown>;
  caiDat: () => Promise<{ bat: boolean; tranNgayUsd: number }>;
  coKey: () => Promise<boolean>;
  daChi: (userId: number) => Promise<number>;
  aiSan: () => boolean;
}
const THAT: PhuThuocTC = {
  stt: async (audio, ten, mime, hints) => {
    const tr = await transcribeWithGroq(audio, ten, mime, { language: '', ...(hints ? { hints } : {}) });
    return String((tr as { text?: string } | null)?.text ?? '');
  },
  tts: docCau,
  chinhHang: goiVanBanChinhHang,
  duPhong: llmComplete,
  caiDat: caiDatTroChuyen,
  coKey: coKeyKhaDung,
  daChi: daChiHomNay,
  aiSan: () => isAiAvailable(),
};

/**
 * Chạy MỘT lượt và đẩy sự kiện qua `gui`. Không có audio ⇒ câu mở đầu của chủ đề
 * (chọn ngẫu nhiên, không gọi model). `signal` hủy khi web ngắt (tạm dừng / rời).
 */
export async function chayLuot(userId: number, v: VaoLuot, gui: (e: SuKienTC) => void, signal?: AbortSignal, pt: PhuThuocTC = THAT): Promise<void> {
  const t0 = Date.now();
  const moc: MocTC = {};
  const nn = docNN(v.ngonNgu);
  const giong = docGiong(v.giong);
  const chuDe = timChuDe(nn, v.chuDeId, String(v.tenBai ?? ''));
  // Chuẩn hoá thẻ ngoại ngữ NGAY ở đây: web tô đậm + lưu lịch sử đúng, "tiếp tục buổi trước" tìm đúng câu hỏi.
  const hang = new HangDoc((t) => pt.tts(t, giong, nn), gui, t0, (t) => boSungTheNN(t, nn));

  if (!demLuot(userId)) { gui({ type: 'loi', lyDo: 'het_luot_ngay', message: 'Hôm nay bạn đã trò chuyện hết số lượt — mai mình nói tiếp nhé.' }); return; }

  if (!v.audio?.length) {
    const q = v.tiepTuc ? cauHoiGanNhat(sachLichSu(v.lichSu, 10)) : '';
    const noi = q ? `Chào mừng bạn quay lại! Mình nói tiếp nhé. [en]${q}[/en]` : cauMoDau(chuDe);
    hang.them(noi);
    await hang.doi();
    moc.ttsDau = hang.dauLuc;
    moc.xong = Date.now() - t0;
    gui({ type: 'xong', noi, nghe: '', meta: { sua: null, tu: [], dich: '', cam: 'vui' }, moc, duong: 'mo-dau' });
    return;
  }
  if (v.audio.length > 6 * 1024 * 1024) { gui({ type: 'loi', lyDo: 'qua_dai', message: 'Bản ghi quá dài (tối đa ~3 phút).' }); return; }
  if (!pt.aiSan()) { gui({ type: 'loi', lyDo: 'ai_unavailable', message: 'CuongMini đang tạm nghỉ, bạn thử lại sau nhé.' }); return; }

  // 1) Nghe — gợi ý cho Whisper = câu hỏi CuongMini vừa hỏi (chữ ngoại ngữ), để nó đoán đúng ngữ cảnh.
  const lichSu = sachLichSu(v.lichSu, 10);
  const cauHoiCuoi = cauHoiGanNhat(lichSu);
  const mime = String(v.mime || 'audio/wav');
  const duoi = /mp4|m4a|aac/.test(mime) ? 'mp4' : /ogg/.test(mime) ? 'ogg' : /webm/.test(mime) ? 'webm' : 'wav';
  const nghe = (await pt.stt(v.audio, `noi.${duoi}`, mime, cauHoiCuoi.slice(0, 200)).catch((e) => {
    logger.warn('[tro-chuyen] Whisper lỗi', { error: (e as Error).message });
    return '';
  })).trim().slice(0, 600);
  moc.stt = Date.now() - t0;
  gui({ type: 'nghe', text: nghe, ms: moc.stt });
  if (!nghe) {
    const noi = 'Mình chưa nghe rõ bạn nói gì. Bạn lại gần micro rồi nói lại nhé.';
    hang.them(noi);
    await hang.doi();
    gui({ type: 'xong', noi, nghe: '', meta: { sua: null, tu: [], dich: '', cam: 'hoi' }, moc: { ...moc, xong: Date.now() - t0 }, duong: 'mo-dau' });
    return;
  }
  if (signal?.aborted) return;

  // 2) Model chảy chữ → cắt câu → TTS từng câu.
  const system = dungPrompt(nn, chuDe);
  const messages = thanhTinNhan(lichSu, nghe);
  const bo = new BoCatCau();
  let full = '';
  const onToken = (d: string) => {
    if (!moc.chuDau) moc.chuDau = Date.now() - t0;
    full += d;
    for (const c of bo.them(d)) {
      if (!moc.cauDau) moc.cauDau = Date.now() - t0;
      hang.them(c);
    }
  };

  const cd = await pt.caiDat();
  const [coKey, daChi] = await Promise.all([pt.coKey(), pt.daChi(userId)]);
  let { duong } = chonDuong({ bat: cd.bat, coKey, daDungNgayUsd: daChi, tranNgayUsd: cd.tranNgayUsd });
  let usd: number | undefined;

  const hanChe = (ctl: AbortController) => {
    const a = setTimeout(() => { if (!moc.chuDau) ctl.abort(); }, HAN_CHU_DAU_MS);
    const b = setTimeout(() => ctl.abort(), HAN_TONG_MS);
    const huy = () => ctl.abort();
    signal?.addEventListener('abort', huy, { once: true });
    return () => { clearTimeout(a); clearTimeout(b); signal?.removeEventListener('abort', huy); };
  };

  if (duong === 'chinh-hang') {
    const ctl = new AbortController();
    const don = hanChe(ctl);
    try {
      const kq = await pt.chinhHang({
        system, messages, model: MODEL_HESHIN, hang: 'free', maxTokens: 600, userId, viec: 'language_tutor',
        onToken, signal: ctl.signal, nhanh: { effort: 'low' },
      });
      usd = kq.usd;
    } catch (e) {
      if (signal?.aborted) return;
      logger.warn('[tro-chuyen] Heshin lỗi — lùi gpt-6-sol', { error: (e as Error).message, daCoChu: !!full });
      if (!full) duong = 'du-phong';
    } finally { don(); }
  }
  if (duong === 'du-phong' && !full) {
    const ctl = new AbortController();
    const don = hanChe(ctl);
    try {
      // ⚠️ llmComplete không nhận `signal` — hạn chữ đầu/tổng ở đây là `timeoutMs` + bỏ lượt khi web đã ngắt.
      await pt.duPhong({
        step: 'generation', purpose: 'language_tutor', feature: 'language', userId,
        maxTokens: 1200, maxRetries: 0, timeoutMs: HAN_CHU_DAU_MS + 5_000,
        system, messages, onToken: (d) => { if (!ctl.signal.aborted) onToken(d); },
      });
    } catch (e) {
      if (signal?.aborted) return;
      logger.warn('[tro-chuyen] dự phòng cũng lỗi', { error: (e as Error).message });
    } finally { don(); }
  }
  if (signal?.aborted) return;
  moc.het = Date.now() - t0;
  for (const c of bo.ket()) { if (!moc.cauDau) moc.cauDau = Date.now() - t0; hang.them(c); }
  const noi = boSungTheNN(loiNoiSach(full), nn);
  if (!noi) {
    gui({ type: 'loi', lyDo: 'loi_ai', message: 'CuongMini đang bận nghĩ, bạn nói lại nhé.' });
    return;
  }
  await hang.doi();
  moc.ttsDau = hang.dauLuc;
  moc.xong = Date.now() - t0;
  const meta = docMeta(bo.meta);
  logger.info('[tro-chuyen] lượt', { nn, duong, moc, usd });
  gui({ type: 'xong', noi, nghe, meta, moc, duong, ...(usd !== undefined ? { usd } : {}) });
}

/**
 * MỘT câu trả lời ngắn cho phòng luyện (không chảy chữ) — cùng đường như trò chuyện (20/10/2026, chủ app: "dùng
 * Anthropic chính hãng nhanh, gpt-6-sol modelapi làm dự phòng, tự chuyển khi cổng chính không chạy"):
 * Heshin 5.5 chính hãng (bật + có khoá + chưa chạm trần ngày) ⇒ hỏng/hết hạn ⇒ gpt-6-sol trên modelapi.
 * Dùng cho "hỏi gia sư" của luyện phát âm. Trả '' khi cả hai cổng hỏng (web báo nhẹ, đọc tiếp câu mẫu).
 */
export async function traLoiNhanhLanguage(o: { userId: number; system: string; content: string; maxTokens?: number }, pt: PhuThuocTC = THAT): Promise<{ text: string; duong: DuongTC }> {
  const messages = [{ role: 'user' as const, content: o.content }];
  const cd = await pt.caiDat();
  const [coKey, daChi] = await Promise.all([pt.coKey(), pt.daChi(o.userId)]);
  const { duong } = chonDuong({ bat: cd.bat, coKey, daDungNgayUsd: daChi, tranNgayUsd: cd.tranNgayUsd });
  if (duong === 'chinh-hang') {
    let text = '';
    const ctl = new AbortController();
    const hen = setTimeout(() => ctl.abort(), HAN_TONG_MS);
    try {
      await pt.chinhHang({
        system: o.system, messages, model: MODEL_HESHIN, hang: 'free', maxTokens: o.maxTokens ?? 400, userId: o.userId,
        viec: 'language_tutor', onToken: (d: string) => { text += d; }, signal: ctl.signal, nhanh: { effort: 'low' },
      } as Parameters<typeof goiVanBanChinhHang>[0]);
      if (text.trim()) return { text, duong: 'chinh-hang' };
    } catch (e) {
      logger.warn('[hoi-gia-su] Heshin lỗi — lùi gpt-6-sol', { error: (e as Error).message });
    } finally { clearTimeout(hen); }
  }
  try {
    const kq = await pt.duPhong({
      step: 'generation', purpose: 'language_tutor', feature: 'language', userId: o.userId,
      maxTokens: Math.max(800, o.maxTokens ?? 400), maxRetries: 0, timeoutMs: HAN_TONG_MS,
      system: o.system, messages,
    }) as { text?: string };
    return { text: kq?.text ?? '', duong: 'du-phong' };
  } catch (e) {
    logger.warn('[hoi-gia-su] dự phòng cũng lỗi', { error: (e as Error).message });
    return { text: '', duong: 'du-phong' };
  }
}

/* ── 📊 Ước lượng band / trình độ cho cả buổi ─────────────────────────── */

export interface KetQuaCham {
  thang: 'band' | 'diem';
  tong: number;
  tieuChi: { ma: string; ten: string; diem: number; nhanXet: string }[];
  nhanXet: string;
  goiY: string[];
}

const HE_CHAM: Record<NgonNguTC, string> = {
  en: 'Chấm như giám khảo IELTS Speaking: band 0–9 (bước 0.5) cho 4 tiêu chí FC (Fluency & Coherence), LR (Lexical Resource), GRA (Grammatical Range & Accuracy), PR (Pronunciation). PR chỉ ước lượng từ bản ghi chữ (từ bị nghe sai, câu đứt) — ghi rõ là ước lượng.',
  ja: 'Đánh giá như giám khảo nói JLPT/JPD: điểm 0–100 cho 4 tiêu chí: troi_chay (trôi chảy), tu_vung (từ vựng), ngu_phap (ngữ pháp), phat_am (ước lượng từ bản ghi chữ). Kèm nhận xét trình độ tương đương (N5/N4/N3).',
  zh: 'Đánh giá như giám khảo HSKK: điểm 0–100 cho 4 tiêu chí: troi_chay (trôi chảy), tu_vung (từ vựng), ngu_phap (ngữ pháp), phat_am (ước lượng từ bản ghi chữ). Kèm nhận xét trình độ tương đương (HSK 1–4).',
};

export function docKetQuaCham(raw: string, nn: NgonNguTC): KetQuaCham | null {
  const a = raw.indexOf('{');
  const b = raw.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  let j: Record<string, unknown>;
  try { j = JSON.parse(raw.slice(a, b + 1)) as Record<string, unknown>; } catch { return null; }
  const band = nn === 'en';
  const lam = (x: number) => (band ? Math.round(Math.min(9, Math.max(0, x)) * 2) / 2 : Math.round(Math.min(100, Math.max(0, x))));
  const tieuChi = (Array.isArray(j.tieuChi) ? j.tieuChi : [])
    .map((x) => x as Record<string, unknown>)
    .map((x) => ({ ma: String(x.ma ?? '').slice(0, 20), ten: String(x.ten ?? x.ma ?? '').slice(0, 60), diem: lam(Number(x.diem)), nhanXet: String(x.nhanXet ?? '').slice(0, 300) }))
    .filter((x) => x.ma && Number.isFinite(x.diem))
    .slice(0, 4);
  if (!tieuChi.length) return null;
  const tb = tieuChi.reduce((s, x) => s + x.diem, 0) / tieuChi.length;
  // IELTS: điểm tổng = trung bình 4 tiêu chí, làm tròn tới 0.5 gần nhất (.25 ⇒ lên .5, .75 ⇒ lên số nguyên).
  const tong = band ? Math.floor(tb * 2 + 0.5) / 2 : Math.round(tb);
  return {
    thang: band ? 'band' : 'diem', tong, tieuChi,
    nhanXet: String(j.nhanXet ?? '').slice(0, 600),
    goiY: (Array.isArray(j.goiY) ? j.goiY : []).map((x) => String(x).slice(0, 200)).filter(Boolean).slice(0, 4),
  };
}

export async function chamBuoi(userId: number, b: { ngonNgu?: unknown; chuDeId?: unknown; tenBai?: unknown; luot?: unknown }): Promise<KetQuaCham | { lyDo: string }> {
  const nn = docNN(b.ngonNgu);
  const chuDe = timChuDe(nn, b.chuDeId, String(b.tenBai ?? ''));
  const luot = sachLichSu(b.luot, 30);
  const cuaNguoi = luot.filter((t) => !t.ai);
  if (cuaNguoi.length < 2) return { lyDo: 'it_luot' };
  if (!demLuot(userId)) return { lyDo: 'het_luot_ngay' };
  const system = [
    `Bạn là giám khảo nói ${nn === 'en' ? 'tiếng Anh' : nn === 'ja' ? 'tiếng Nhật' : 'tiếng Trung'} nghiêm túc nhưng tử tế. ${HE_CHAM[nn]}`,
    `Bối cảnh: ${chuDe.capDo}. Chỉ chấm các lượt của NGƯỜI HỌC (chữ do máy nghe ra, có thể sai chính tả).`,
    'Trả về DUY NHẤT một JSON: {"tieuChi":[{"ma":"FC|LR|GRA|PR hoặc troi_chay|tu_vung|ngu_phap|phat_am","ten":"tên tiếng Việt","diem":số,"nhanXet":"1 câu tiếng Việt cụ thể, trích ví dụ"}],"nhanXet":"2 câu tổng quát tiếng Việt","goiY":["3 việc cụ thể để lên điểm"]}',
  ].join('\n');
  const user = luot.map((t) => `${t.ai ? 'Giám khảo' : 'Người học'}: ${t.text.replace(/\[\/?en\]/gi, '')}`).join('\n');
  const cd = await caiDatTroChuyen();
  const [coKey, daChi] = await Promise.all([coKeyKhaDung(), daChiHomNay(userId)]);
  const { duong } = chonDuong({ bat: cd.bat, coKey, daDungNgayUsd: daChi, tranNgayUsd: cd.tranNgayUsd });
  let raw = '';
  if (duong === 'chinh-hang') {
    try {
      raw = (await goiVanBanChinhHang({
        system, messages: [{ role: 'user', content: user }], model: MODEL_HESHIN, hang: 'free', maxTokens: 1500,
        userId, viec: 'language_tutor', nhanh: { effort: 'medium' }, signal: AbortSignal.timeout(40_000),
      })).text;
    } catch (e) { logger.warn('[tro-chuyen] chấm buổi: Heshin lỗi — lùi', { error: (e as Error).message }); }
  }
  if (!raw) {
    raw = (await llmComplete({
      step: 'generation', purpose: 'language_tutor', feature: 'language', userId, maxTokens: 2500, maxRetries: 1, timeoutMs: 45_000,
      system, messages: [{ role: 'user', content: user }],
    }).catch(() => ({ text: '' }))).text ?? '';
  }
  return docKetQuaCham(raw, nn) ?? { lyDo: 'loi_ai' };
}
