/**
 * CT Language — TRANG TỪ "DÀY" (Đợt A, 14/11/2026 — docs/ct-language-khao-sat-hanzii.md mục 3). Phần THUẦN: khoá băm,
 * lời nhắc cho model, và phép KIỂM JSON model trả về. Không CSDL, không mạng ⇒ test bằng `npx tsx --test`.
 *
 * Nguyên tắc: dữ liệu thật trước (ctl_tu · ctl_chu_han · lang_vocab_*), AI chỉ lấp chỗ trống. Thứ AI viết phải qua
 * `kiemMoRong` — thiếu / hỏng / sai chữ viết ⇒ trả `null`, KHÔNG lưu, app không hiện nửa vời.
 */
import { createHash } from 'node:crypto';
import { coKana, laChuHan, romaji } from './tuDienChuan.js';

export type NnSau = 'en' | 'ja' | 'zh';

/** Đổi số này = bỏ toàn bộ kho đã sinh (khoá băm đổi theo). Chỉ tăng khi hình dạng JSON đổi không tương thích. */
export const PHIEN_BAN_MO_RONG = 1;

/** Khoá R2 của phần mở rộng cho (ngôn ngữ, chữ, cách đọc). Cùng chữ khác âm (日 にち / ひ) ⇒ hai khoá khác nhau. */
export function khoaMoRong(nn: NnSau, chu: string, doc?: string | null): string {
  const sach = (s: string) => s.normalize('NFC').trim().replace(/\s+/g, ' ');
  const goc = [`v${PHIEN_BAN_MO_RONG}`, nn, nn === 'en' ? sach(chu).toLowerCase() : sach(chu), sach(doc ?? '').toLowerCase()].join('\n');
  return `ctlanguage/tu-mo-rong/${nn}/${createHash('sha256').update(goc).digest('hex').slice(0, 32)}.json`;
}

// ─── Hình dạng ───────────────────────────────────────────────

export interface ViDuSau { cau: string; doc: string | null; vi: string }
export interface NghiaSau { loai: string | null; vi: string; donNgu: string | null; viDu: ViDuSau[] }
/** Chip từ liên quan. `id` = mục có thật trong từ điển (máy chủ điền sau khi kiểm); không có ⇒ app tra theo chữ. */
export interface TuLienQuan { chu: string; doc: string | null; hanViet: string | null; vi: string; id?: number | null; /** `vi` là nghĩa TIẾNG ANH của nguồn mở (mục chưa có nghĩa Việt) — app xếp sau. */ nghiaAnh?: boolean }
export interface KetHopSau { cum: string; doc: string | null; vi: string }
export interface PhanBietSau { voi: string; doc: string | null; hanViet: string | null; vi: string | null; giong: string[]; khac: string[]; id?: number | null }
export interface GiaiThichSau { cachDung: string; sacThai: string | null; loiHayMac: string[]; meoNho: string | null }
export interface ChuHanSau { chu: string; lucThu: string | null; hinhThai: string | null; giaiNghia: string | null; meoNho: string | null }
export interface MoRongTu {
  nghia: NghiaSau[];
  tuGhep: TuLienQuan[];
  canNghia: TuLienQuan[];
  traiNghia: TuLienQuan[];
  ketHop: KetHopSau[];
  phanBiet: PhanBietSau[];
  giaiThich: GiaiThichSau;
  chuDe: string[];
  /** Nhãn cấp độ đã chuẩn hoá: "HSK 2" · "TOCFL 1" · "JLPT N5" · "CEFR A2". */
  capDo: string[];
  chuHan: ChuHanSau[];
}

export interface TuGoc {
  nn: NnSau; chu: string; doc?: string | null; hanViet?: string | null; nghiaVi?: string | null; nghiaEn?: string | null;
  loai?: string | null; viDu?: string | null;
}

// ─── Lời nhắc ────────────────────────────────────────────────

const TEN: Record<NnSau, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung' };
const LUC_THU = ['tượng hình', 'chỉ sự', 'hội ý', 'hình thanh', 'chuyển chú', 'giả tá'] as const;

export function nhacMoRong(nn: NnSau): string {
  const doc = nn === 'zh' ? 'pinyin CÓ DẤU THANH (jiànkāng)' : nn === 'ja' ? 'cách đọc viết bằng HIRAGANA (べんきょう) — KHÔNG romaji, máy chủ tự đổi' : 'phiên âm IPA (/teɪk/)';
  const docCau = nn === 'zh' ? 'pinyin có dấu thanh của CẢ CÂU' : nn === 'ja' ? 'CẢ CÂU viết lại hoàn toàn bằng hiragana, CÓ DẤU CÁCH giữa các cụm từ (まいにち にほんごを べんきょうします)' : 'null (câu tiếng Anh không cần phiên âm)';
  const donNgu = nn === 'zh' ? 'tiếng Trung giản thể' : nn === 'ja' ? 'tiếng Nhật' : 'tiếng Anh đơn giản (kiểu từ điển cho người học)';
  const capDo = nn === 'zh' ? '"HSK 1"…"HSK 9" (chuẩn HSK 3.0) và "TOCFL 1"…"TOCFL 6" nếu biết' : nn === 'ja' ? '"JLPT N5"…"JLPT N1"' : '"CEFR A1"…"CEFR C2"';
  const han = nn === 'en' ? '"chuHan": []' : [
    '"chuHan": mỗi CHỮ HÁN có trong từ một mục {"chu","lucThu","hinhThai","giaiNghia","meoNho"}:',
    `   · lucThu: một hoặc hai trong ${LUC_THU.join(' / ')} (hai thì nối bằng " & ");`,
    '   · hinhThai: tách bộ phận kiểu "亻+建" (chữ độc thể thì ghi chính nó);',
    '   · giaiNghia: 1 câu tiếng Việt — bộ phận nào gợi nghĩa, bộ phận nào gợi âm;',
    '   · meoNho: 1–2 câu chuyện nhỏ dễ nhớ bằng tiếng Việt, bám vào hình các bộ phận.',
  ].join('\n');
  return [
    `Bạn là người biên soạn từ điển ${TEN[nn]} – Việt cho người Việt tự học (app CT Language). Viết CHÍNH XÁC, ngắn, dễ hiểu.`,
    'Chỉ trả về MỘT đối tượng JSON hợp lệ, không lời dẫn, không ```; mọi lời giải thích bằng tiếng Việt. Không chắc thì BỎ mục đó (mảng rỗng / null) — KHÔNG bịa.',
    'Các khoá:',
    `"nghia": 1–5 nghĩa THÔNG DỤNG nhất, gom theo từ loại: {"loai" (tiếng Việt: danh từ / động từ / tính từ / phó từ / lượng từ / cụm từ…), "vi" (nghĩa Việt ngắn), "donNgu" (1 câu giải thích bằng ${donNgu}), "viDu": 1–3 câu {"cau","doc","vi"}}. "cau" là câu ${TEN[nn]} tự nhiên, ngắn, CÓ chứa từ đang tra; "doc" = ${docCau}; "vi" = dịch Việt.`,
    `"tuGhep": tối đa 8 từ ghép / cụm cố định chứa từ này — {"chu","doc","vi"}; "doc" = ${doc}.`,
    '"canNghia": tối đa 6 từ gần nghĩa; "traiNghia": tối đa 6 từ trái nghĩa — cùng dạng {"chu","doc","vi"}. Không có thì [].',
    `"ketHop": tối đa 8 kết hợp từ (collocation) hay gặp nhất — {"cum","doc","vi"} (vd ${nn === 'en' ? '"take a break"' : nn === 'ja' ? '"勉強をする"' : '"身体健康"'}).`,
    '"phanBiet": 0–2 từ người học HAY NHẦM với từ này — {"voi","doc","vi","giong": [1–3 gạch đầu dòng điểm GIỐNG], "khac": [2–4 gạch đầu dòng điểm KHÁC, có ví dụ ngắn nếu cần]}.',
    '"giaiThich": {"cachDung" (2–4 câu: dùng khi nào, đi với gì, trang trọng hay thân mật), "sacThai" (1–2 câu hoặc null), "loiHayMac": [1–3 lỗi NGƯỜI VIỆT hay mắc với từ này, mỗi lỗi một câu có ví dụ sai → đúng], "meoNho" (1–2 câu mẹo nhớ, có thể liên hệ âm Hán Việt / từ tiếng Việt)}.',
    '"chuDe": 1–3 thẻ chủ đề tiếng Việt ngắn (Sức khoẻ, Trường học, Công việc…).',
    `"capDo": mảng nhãn cấp độ ƯỚC LƯỢNG sát nhất theo bảng từ vựng chuẩn: ${capDo}. Chỉ để [] khi từ hiếm / nằm ngoài các bảng đó.`,
    han,
  ].join('\n');
}

export function cauHoiMoRong(t: TuGoc): string {
  const dong = [
    `Từ: ${t.chu}`,
    t.doc && `Cách đọc: ${t.doc}`,
    t.hanViet && `Âm Hán Việt: ${t.hanViet}`,
    t.loai && `Từ loại (từ điển gốc): ${t.loai}`,
    t.nghiaVi && `Nghĩa Việt (từ điển gốc): ${t.nghiaVi.slice(0, 300)}`,
    t.nghiaEn && `Nghĩa Anh (từ điển gốc): ${t.nghiaEn.slice(0, 300)}`,
    t.viDu && `Ví dụ đã có (đừng lặp lại): ${t.viDu.slice(0, 160)}`,
  ].filter(Boolean);
  return `${dong.join('\n')}\n\nSoạn mục từ mở rộng (JSON) cho từ ${TEN[t.nn]} trên, đúng với cách đọc và nghĩa đã cho.`;
}

// ─── Kiểm JSON model trả về ──────────────────────────────────

/** Lấy khối JSON đầu tiên trong văn bản (model đôi khi bọc ```json … ```). `null` khi không phân tích được. */
export function tachJson(text: string): unknown {
  const s = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch { return null; }
}

const chuoi = (v: unknown, tran: number): string | null => {
  if (typeof v !== 'string') return null;
  const s = v.replace(/\*\*(.+?)\*\*/g, '$1').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').replace(/[ \t]+/g, ' ').trim();
  if (!s || /^(null|undefined|n\/a|không có|—|-)$/i.test(s)) return null;
  return s.length > tran ? `${s.slice(0, tran - 1).trimEnd()}…` : s;
};
const mang = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const dsChuoi = (v: unknown, tranMuc: number, tranDai: number): string[] =>
  [...new Set(mang(v).map((x) => chuoi(x, tranDai)).filter((x): x is string => !!x).map((x) => x.replace(/^[•\-–]\s*/, '')))].slice(0, tranMuc);

const CJK = /[㐀-䶿一-鿿぀-ヿ]/;
/** Chữ của ngôn ngữ đích: zh/ja phải có chữ Hán/kana; en phải có chữ Latin và KHÔNG có chữ Hán/kana. */
export function dungChuViet(nn: NnSau, s: string): boolean {
  return nn === 'en' ? /[A-Za-z]/.test(s) && !CJK.test(s) : CJK.test(s);
}
const cungTu = (nn: NnSau, a: string, b: string) => (nn === 'en' ? a.trim().toLowerCase() === b.trim().toLowerCase() : a.trim() === b.trim());

/**
 * Cách đọc để HIỆN: ja ⇒ "かな · romaji" khi model trả kana; zh/en giữ nguyên. Câu (model viết kana CÓ DẤU CÁCH giữa các
 * cụm) ⇒ đổi từng cụm, trợ từ cuối cụm đọc đúng âm: は → wa · へ → e · を → o (こんにちは → konnichiwa).
 */
export function docHien(nn: NnSau, doc: string | null): string | null {
  if (!doc) return null;
  if (nn !== 'ja' || !coKana(doc)) return doc;
  const cum = doc.replace(/[、。！？「」，．!?]/g, ' ').split(/[\s\u3000]+/).filter(Boolean);
  const r = cum.map((c) => {
    if (cum.length === 1) return romaji(c);
    const m = /^(.+)([はへ])$/.exec(c);
    return m ? `${romaji(m[1])}${m[2] === 'は' ? 'wa' : 'e'}` : romaji(c);
  }).join(' ').trim();
  return r && r !== doc ? `${doc} · ${r}` : doc;
}

function dsTu(nn: NnSau, v: unknown, goc: string, tran: number): TuLienQuan[] {
  const ra: TuLienQuan[] = [];
  for (const x of mang(v)) {
    const o = (x ?? {}) as Record<string, unknown>;
    const chu = chuoi(o.chu, 40);
    const vi = chuoi(o.vi, 80);
    if (!chu || !vi || !dungChuViet(nn, chu) || cungTu(nn, chu, goc) || ra.some((r) => cungTu(nn, r.chu, chu))) continue;
    ra.push({ chu, doc: docHien(nn, chuoi(o.doc, 60)), hanViet: null, vi });
    if (ra.length >= tran) break;
  }
  return ra;
}

const CAP_DO: Record<NnSau, RegExp[]> = {
  zh: [/^HSK\s?([1-9]|7-9)$/i, /^TOCFL\s?[1-6]$/i],
  ja: [/^(?:JLPT\s?)?N[1-5]$/i],
  en: [/^(?:CEFR\s?)?[ABC][12]$/i],
};
/** "hsk2" → "HSK 2" · "N5" → "JLPT N5" · "b1" → "CEFR B1"; nhãn lạ ⇒ null. Dùng cho CẢ dữ liệu thật lẫn AI. */
export function chuanCapDo(nn: NnSau, v: unknown): string | null {
  const s = typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '';
  if (!s || !CAP_DO[nn].some((r) => r.test(s))) return null;
  const tren = s.toUpperCase().replace(/\s/g, '');
  if (nn === 'zh') return tren.replace(/^(HSK|TOCFL)/, '$1 ');
  if (nn === 'ja') return `JLPT ${tren.replace(/^JLPT/, '')}`;
  return `CEFR ${tren.replace(/^CEFR/, '')}`;
}

function lucThu(v: unknown): string | null {
  const s = chuoi(v, 60)?.toLowerCase();
  if (!s) return null;
  const phan = s.split(/\s*(?:&|và|,|\/|\+)\s*/).map((p) => p.trim()).filter(Boolean);
  const hop = [...new Set(phan.filter((p) => (LUC_THU as readonly string[]).includes(p)))].slice(0, 2);
  return hop.length ? hop.join(' & ') : null;
}

/**
 * Kiểm + làm sạch JSON của model. Trả `null` khi KHÔNG đủ tốt để lưu: không có nghĩa nào hợp lệ, không có ví dụ nào,
 * hoặc thiếu "cách dùng". Mục lẻ hỏng (chip sai chữ viết, ví dụ tiếng Trung không chứa từ…) bị BỎ riêng mục đó.
 */
export function kiemMoRong(nn: NnSau, tu: Pick<TuGoc, 'chu'>, tho: unknown): MoRongTu | null {
  if (!tho || typeof tho !== 'object' || Array.isArray(tho)) return null;
  const o = tho as Record<string, unknown>;
  const goc = tu.chu.trim();

  const nghia: NghiaSau[] = [];
  for (const x of mang(o.nghia)) {
    const n = (x ?? {}) as Record<string, unknown>;
    const vi = chuoi(n.vi, 160);
    if (!vi) continue;
    const viDu: ViDuSau[] = [];
    for (const y of mang(n.viDu)) {
      const d = (y ?? {}) as Record<string, unknown>;
      const cau = chuoi(d.cau, 200);
      const dich = chuoi(d.vi, 240);
      if (!cau || !dich || !dungChuViet(nn, cau)) continue;
      // Tiếng Trung không biến hình ⇒ câu ví dụ PHẢI chứa đúng từ (Nhật/Anh chia động từ nên không ép).
      if (nn === 'zh' && !cau.includes(goc)) continue;
      const doc = nn === 'en' ? null : chuoi(d.doc, 320);
      // Nhật: "doc" phải là kana (không lẫn chữ Hán) thì mới đổi romaji đúng; sai dạng ⇒ bỏ cách đọc, giữ câu.
      viDu.push({ cau, doc: nn === 'ja' && doc && [...doc].some(laChuHan) ? null : docHien(nn, doc), vi: dich });
      if (viDu.length >= 3) break;
    }
    const donNgu = chuoi(n.donNgu, 200);
    nghia.push({ loai: chuoi(n.loai, 30)?.toLowerCase() ?? null, vi, donNgu: donNgu && dungChuViet(nn, donNgu) ? donNgu : null, viDu });
    if (nghia.length >= 5) break;
  }
  if (!nghia.length || !nghia.some((n) => n.viDu.length)) return null;

  const g = (o.giaiThich ?? {}) as Record<string, unknown>;
  const cachDung = chuoi(g.cachDung, 700);
  if (!cachDung) return null;
  const giaiThich: GiaiThichSau = { cachDung, sacThai: chuoi(g.sacThai, 400), loiHayMac: dsChuoi(g.loiHayMac, 3, 320), meoNho: chuoi(g.meoNho, 400) };

  const ketHop: KetHopSau[] = [];
  for (const x of mang(o.ketHop)) {
    const k = (x ?? {}) as Record<string, unknown>;
    const cum = chuoi(k.cum, 60);
    const vi = chuoi(k.vi, 100);
    if (!cum || !vi || !dungChuViet(nn, cum) || ketHop.some((r) => r.cum === cum)) continue;
    ketHop.push({ cum, doc: nn === 'en' ? null : docHien(nn, chuoi(k.doc, 100)), vi });
    if (ketHop.length >= 8) break;
  }

  const phanBiet: PhanBietSau[] = [];
  for (const x of mang(o.phanBiet)) {
    const p = (x ?? {}) as Record<string, unknown>;
    const voi = chuoi(p.voi, 40);
    const khac = dsChuoi(p.khac, 4, 260);
    if (!voi || !dungChuViet(nn, voi) || cungTu(nn, voi, goc) || khac.length < 1) continue;
    phanBiet.push({ voi, doc: docHien(nn, chuoi(p.doc, 60)), hanViet: null, vi: chuoi(p.vi, 80), giong: dsChuoi(p.giong, 3, 220), khac });
    if (phanBiet.length >= 2) break;
  }

  const chuHan: ChuHanSau[] = [];
  if (nn !== 'en') {
    const coTrongTu = new Set([...goc].filter(laChuHan));
    for (const x of mang(o.chuHan)) {
      const c = (x ?? {}) as Record<string, unknown>;
      const chu = chuoi(c.chu, 2);
      if (!chu || !coTrongTu.has(chu) || chuHan.some((r) => r.chu === chu)) continue;
      const muc: ChuHanSau = { chu, lucThu: lucThu(c.lucThu), hinhThai: chuoi(c.hinhThai, 40), giaiNghia: chuoi(c.giaiNghia, 260), meoNho: chuoi(c.meoNho, 360) };
      if (muc.lucThu || muc.hinhThai || muc.meoNho) chuHan.push(muc);
    }
  }

  return {
    nghia,
    tuGhep: dsTu(nn, o.tuGhep, goc, 8).filter((t) => nn !== 'zh' || t.chu.includes(goc)),
    canNghia: dsTu(nn, o.canNghia, goc, 6),
    traiNghia: dsTu(nn, o.traiNghia, goc, 6),
    ketHop, phanBiet, giaiThich,
    chuDe: dsChuoi(o.chuDe, 3, 24),
    capDo: [...new Set(mang(o.capDo).map((x) => chuanCapDo(nn, x)).filter((x): x is string => !!x))].slice(0, 2),
    chuHan,
  };
}

/** Toàn bộ chữ tiếng Việt AI viết — đưa qua bộ lọc từ xấu trước khi lưu. */
export function chuVietCuaMoRong(m: MoRongTu): string {
  return [
    ...m.nghia.flatMap((n) => [n.vi, ...n.viDu.map((v) => v.vi)]),
    ...[...m.tuGhep, ...m.canNghia, ...m.traiNghia].map((t) => t.vi),
    ...m.ketHop.map((k) => k.vi),
    ...m.phanBiet.flatMap((p) => [...p.giong, ...p.khac]),
    m.giaiThich.cachDung, m.giaiThich.sacThai ?? '', ...m.giaiThich.loiHayMac, m.giaiThich.meoNho ?? '',
    ...m.chuDe,
    ...m.chuHan.flatMap((c) => [c.giaiNghia ?? '', c.meoNho ?? '']),
  ].filter(Boolean).join('\n');
}
