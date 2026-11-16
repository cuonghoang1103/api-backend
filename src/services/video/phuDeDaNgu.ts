/**
 * PHỤ ĐỀ ĐA NGÔN NGỮ cho "Học qua video" (CT Language, 16/11/2026) — phần THUẦN (không mạng, không CSDL), test ở
 * `phuDeDaNgu.test.ts`.
 *
 *   · `nnTuMa`      — mã ngôn ngữ của YouTube/TikTok/yt-dlp ('en-US', 'ja-orig', 'zh-Hant', 'cmn-Hans-CN', 'jpn-JP'…)
 *                     ⇒ 'en' | 'ja' | 'zh' (ngoài ba thứ tiếng này ⇒ null).
 *   · `chonTrack`   — từ `info.json` của yt-dlp chọn ĐÚNG MỘT track để học:
 *                       1. phụ đề do NGƯỜI làm của ngôn ngữ cần (zh: ưu tiên giản thể),
 *                       2. phụ đề TỰ ĐỘNG chỉ khi video THẬT SỰ nói ngôn ngữ đó (track `-orig`, hoặc `language` của
 *                          video khớp) — track tự động của ngôn ngữ khác là BẢN MÁY DỊCH của YouTube: học tiếng Nhật
 *                          bằng bản máy dịch từ tiếng Anh là học sai.
 *   · `lamSachCjk`  — làm sạch phụ đề Nhật/Trung: KHÔNG tách theo khoảng trắng (chữ CJK không có), khử chồng lấn
 *                     "cửa sổ trượt" của phụ đề tự động theo TỪNG CHỮ, cắt câu theo 。！？ / khoảng lặng / độ dài.
 *   · `chuanHoaMoc` — SRT (`00:00:01,000`) và VTT thiếu giờ (`01:02.500`) ⇒ dạng `HH:MM:SS.mmm` mà bộ làm sạch tiếng
 *                     Anh cũ (`lamSachVtt`) đọc được.
 */
import type { CauPhuDe } from './phuDe.service.js';

export type NnVideo = 'en' | 'ja' | 'zh';
export const NN_VIDEO: readonly NnVideo[] = ['en', 'ja', 'zh'];

export function laNnVideo(s: unknown): s is NnVideo {
  return typeof s === 'string' && (NN_VIDEO as readonly string[]).includes(s);
}

/** Mã ngôn ngữ bất kỳ ⇒ en/ja/zh. Tiếng Quảng (`yue`) KHÔNG phải tiếng Trung phổ thông ⇒ null. */
export function nnTuMa(ma: string | null | undefined): NnVideo | null {
  const s = String(ma ?? '').trim().toLowerCase();
  if (!s) return null;
  const dau = s.split(/[-_.]/)[0];
  if (dau === 'en' || dau === 'eng') return 'en';
  if (dau === 'ja' || dau === 'jpn' || dau === 'jp') return 'ja';
  if (dau === 'zh' || dau === 'cmn' || dau === 'zho' || dau === 'chi') return 'zh';
  return null;
}

/** Track tiếng Trung PHỒN THỂ (app tự chuyển giản thể bằng ICU `Hant-Hans` trên máy). */
export function laPhonThe(ma: string | null | undefined): boolean {
  return /(^|[-_])(hant|tw|hk|mo)($|[-_])/i.test(String(ma ?? ''));
}

/** Đoán ngôn ngữ theo CHỮ (tiêu đề): có kana ⇒ ja; nhiều chữ Hán ⇒ zh; nhiều chữ Latin ⇒ en. */
export function doanNnTheoChu(s: string | null | undefined): NnVideo | null {
  const t = String(s ?? '');
  if (/[\u3040-\u30ff]/.test(t)) return 'ja';
  const han = (t.match(/\p{Script=Han}/gu) ?? []).length;
  const latin = (t.match(/[A-Za-z]/g) ?? []).length;
  if (han >= 2 && han * 2 >= latin) return 'zh';
  if (latin >= 4) return 'en';
  return null;
}

export type TrackChon = {
  /** Mã đúng như khoá trong `subtitles` / `automatic_captions` — đưa thẳng cho `--sub-langs`. */
  ma: string;
  nn: NnVideo;
  tuDong: boolean;
  phonThe: boolean;
};

export type InfoPhuDe = {
  language?: string | null;
  title?: string | null;
  subtitles?: Record<string, unknown> | null;
  automatic_captions?: Record<string, unknown> | null;
};

/** Khoá không phải phụ đề lời nói (chat trực tiếp, bình luận chạy). */
const BO_QUA = new Set(['live_chat', 'danmaku', 'comments', 'rechat']);

/** Điểm ưu tiên trong CÙNG một ngôn ngữ — nhỏ hơn = tốt hơn. */
function hangTrongNn(ma: string, nn: NnVideo): number {
  const s = ma.toLowerCase();
  if (nn === 'zh') {
    if (laPhonThe(s)) return 5;
    if (/hans|cn|sg/.test(s)) return 0;
    return s === 'zh' || s === 'cmn' ? 1 : 2;
  }
  if (nn === 'en') {
    if (s === 'en') return 0;
    if (s === 'en-us' || s === 'en-gb') return 1;
    return 2;
  }
  return s === 'ja' ? 0 : 1;
}

function tot(ds: string[], nn: NnVideo): string | null {
  const hop = ds.filter((m) => nnTuMa(m) === nn);
  hop.sort((a, b) => hangTrongNn(a, nn) - hangTrongNn(b, nn) || a.length - b.length);
  return hop[0] ?? null;
}

/**
 * Chọn track. `nnYeuCau = 'auto'` ⇒ học đúng ngôn ngữ video ĐANG NÓI (ngôn ngữ gốc), không có thì ngôn ngữ duy nhất
 * có phụ đề người làm. Trả `nnGoc` (đoán được) để báo lỗi rõ khi video nói thứ tiếng khác.
 */
export function chonTrack(info: InfoPhuDe, nnYeuCau: NnVideo | 'auto'):
    { chon: TrackChon | null; nnGoc: NnVideo | null; maGoc: string | null } {
  const tay = Object.keys(info.subtitles ?? {}).filter((k) => !BO_QUA.has(k));
  const tuDong = Object.keys(info.automatic_captions ?? {}).filter((k) => !BO_QUA.has(k));

  // Ngôn ngữ GỐC: `language` video tự khai → track `-orig` (nhận dạng giọng nói gốc của YouTube).
  const orig = tuDong.find((k) => /-orig$/i.test(k)) ?? null;
  const maGoc = (info.language ? String(info.language) : null) ?? (orig ? orig.replace(/-orig$/i, '') : null);
  let nnGoc = nnTuMa(maGoc);
  if (!nnGoc && !maGoc) {
    const nnTay = [...new Set(tay.map(nnTuMa).filter((x): x is NnVideo => !!x))];
    nnGoc = nnTay.length === 1 ? nnTay[0] : doanNnTheoChu(info.title);
  }

  let nn: NnVideo | null = nnYeuCau === 'auto' ? nnGoc : nnYeuCau;
  if (!nn && nnYeuCau === 'auto') {
    // Gốc là thứ tiếng khác (Hàn, Pháp…) nhưng có phụ đề NGƯỜI làm bằng en/ja/zh ⇒ vẫn học được bằng phụ đề đó.
    nn = (['en', 'ja', 'zh'] as NnVideo[]).find((x) => tot(tay, x)) ?? null;
  }
  if (!nn) return { chon: null, nnGoc, maGoc };

  const maTay = tot(tay, nn);
  if (maTay) return { chon: { ma: maTay, nn, tuDong: false, phonThe: laPhonThe(maTay) }, nnGoc, maGoc };

  // Tự động: CHỈ khi video nói đúng ngôn ngữ này (không lấy bản máy dịch).
  if (nnGoc === nn || (!maGoc && !nnGoc)) {
    const ungVien = tuDong.filter((k) => nnTuMa(k) === nn);
    const ma = ungVien.find((k) => /-orig$/i.test(k))
      ?? (maGoc ? ungVien.find((k) => k.toLowerCase() === maGoc.toLowerCase()) : undefined)
      ?? (orig ? undefined : tot(ungVien, nn) ?? undefined);
    if (ma) return { chon: { ma, nn, tuDong: true, phonThe: laPhonThe(ma) }, nnGoc, maGoc };
  }
  return { chon: null, nnGoc, maGoc };
}

// ════════════════════════════════════════════════════════════════
// Mốc thời gian
// ════════════════════════════════════════════════════════════════

/**
 * SRT ⇒ dấu chấm thập phân; mốc thiếu giờ ⇒ thêm `00:`; bỏ `\r`. Chỉ đụng DÒNG MỐC (có `-->`), không đụng lời.
 */
export function chuanHoaMoc(raw: string): string {
  const moc = (m: string) => {
    let s = m.replace(',', '.');
    if (/^\d{1,2}:\d\d\.\d{1,3}$/.test(s)) s = `00:${s}`;
    const [hms, ms = '000'] = s.split('.');
    const [h, mi, se] = hms.split(':');
    return `${h.padStart(2, '0')}:${mi.padStart(2, '0')}:${se.padStart(2, '0')}.${ms.padEnd(3, '0').slice(0, 3)}`;
  };
  return String(raw ?? '').replace(/\r\n?/g, '\n').split('\n').map((d) => {
    if (!d.includes('-->')) return d;
    return d.replace(/(\d{1,2}:)?\d{1,2}:\d\d[.,]\d{1,3}/g, (m) => moc(m));
  }).join('\n');
}

function giay(t: string): number {
  const [h, m, s] = t.split(':');
  return Math.round((Number(h) * 3600 + Number(m) * 60 + Number(s)) * 100) / 100;
}

// ════════════════════════════════════════════════════════════════
// Làm sạch tiếng Nhật / Trung
// ════════════════════════════════════════════════════════════════

const RE_KHOI = /(\d\d:\d\d:\d\d\.\d\d\d) --> (\d\d:\d\d:\d\d\.\d\d\d)[^\n]*\n([\s\S]*?)(?=\n\s*\n|$)/g;
const RE_CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々〆〇]/u;
/** Một "đơn vị": một chữ CJK · một từ Latin/số · một dấu câu. */
const RE_DON_VI = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々〆〇]|[\p{Script=Latin}\p{N}][\p{Script=Latin}\p{N}'’\-]*|[^\s]/gu;
const KET_CAU = /^[。！？!?…]$/u;
const NGAT_PHU = /^[、，,；;：:]$/u;
/** Nhãn âm thanh: [音楽] [Music] ［拍手］ (笑) 【字幕】 — ngắn, nằm trong ngoặc. */
const RE_NHAN = /[[［【(（〔][^\]］】)）〕\n]{0,16}[\]］】)）〕]/gu;

export function tachDonVi(s: string): string[] {
  return s.match(RE_DON_VI) ?? [];
}

const laLatin = (u: string) => /[\p{L}\p{N}]/u.test(u) && !RE_CJK.test(u);

/** Nối đơn vị: CHỈ chèn dấu cách giữa hai từ Latin/số (“iPhone 15を” giữ được dấu cách, chữ CJK liền nhau). */
export function noiDonVi(ds: string[]): string {
  let ra = '';
  for (let i = 0; i < ds.length; i++) {
    if (i > 0 && laLatin(ds[i - 1]) && laLatin(ds[i])) ra += ' ';
    ra += ds[i];
  }
  return ra;
}

/** Số "chữ" để báo cáo/so ngưỡng: chữ CJK + từ Latin, không đếm dấu câu. */
export function demChu(ds: string[]): number {
  return ds.filter((u) => RE_CJK.test(u) || /[\p{L}\p{N}]/u.test(u)).length;
}

type Khoi = { bd: number; doan: Array<{ t: number; chu: string }> };

/** Đọc các khối VTT (đã chuẩn hoá mốc). Mỗi khối tách theo mốc nội dòng `<00:00:01.234>` (phụ đề tự động). */
function docKhoi(raw: string): Khoi[] {
  const ra: Khoi[] = [];
  for (const m of chuanHoaMoc(raw).matchAll(RE_KHOI)) {
    const bd = giay(m[1]);
    // Dòng đầu của khối "cửa sổ trượt" là lời CŨ không có mốc nội dòng — giữ, khử chồng lấn lo phần còn lại.
    const manh = m[3].split(/<(\d\d:\d\d:\d\d\.\d\d\d)>/);
    const doan: Khoi['doan'] = [];
    let t = bd;
    for (let i = 0; i < manh.length; i++) {
      if (i % 2 === 1) { t = giay(manh[i]); continue; }
      const chu = manh[i].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        .replace(RE_NHAN, ' ').replace(/[♪♫]/g, ' ');
      if (chu.trim()) doan.push({ t, chu });
    }
    if (doan.length) ra.push({ bd, doan });
  }
  return ra;
}

export type TuyChonCjk = { nn: 'ja' | 'zh'; tuDong: boolean };

/** Độ dài tối đa một câu (đơn vị) — câu dài hơn thì cắt ở dấu ngắt phụ gần nhất. */
const TRAN_CAU: Record<'ja' | 'zh', number> = { ja: 36, zh: 30 };
const KHOANG_LANG = 0.9;
const TOI_THIEU = 5;

export function lamSachCjk(raw: string, o: TuyChonCjk): { cues: CauPhuDe[]; soTu: number } {
  const khoi = docKhoi(raw);
  const tran = TRAN_CAU[o.nn];
  const cues: CauPhuDe[] = [];
  let tong = 0;

  let cum: Array<{ t: number; u: string }> = [];
  const chot = () => {
    // Bỏ dấu ngắt phụ ở đầu câu (、，) — sót lại từ chỗ cắt.
    while (cum.length && NGAT_PHU.test(cum[0].u)) cum.shift();
    if (!cum.length) return;
    const ds = cum.map((x) => x.u);
    tong += demChu(ds);
    cues.push({ t: cum[0].t, en: noiDonVi(ds) });
    cum = [];
  };
  /** Cắt câu quá dài ở dấu ngắt phụ gần cuối nhất (không có thì cắt cứng). */
  const catNeuDai = () => {
    if (cum.length < tran) return;
    let k = -1;
    for (let i = cum.length - 1; i >= Math.floor(tran / 3); i--) if (NGAT_PHU.test(cum[i].u)) { k = i; break; }
    if (k < 0) { chot(); return; }
    const sau = cum.slice(k + 1);
    cum = cum.slice(0, k + 1);
    chot();
    cum = sau;
  };
  const them = (t: number, u: string) => {
    if (cum.length >= TOI_THIEU && t - cum[cum.length - 1].t >= KHOANG_LANG && !KET_CAU.test(u) && !NGAT_PHU.test(u)) chot();
    cum.push({ t, u });
    if (KET_CAU.test(u)) chot();
    else catNeuDai();
  };

  if (o.tuDong) {
    // Cửa sổ trượt: mỗi khối lặp đuôi khối trước rồi thêm vài chữ — chỉ lấy phần MỚI (so theo đơn vị, đuôi 80).
    let daCo: string[] = [];
    for (const k of khoi) {
      const moi: Array<{ t: number; u: string }> = [];
      for (const d of k.doan) for (const u of tachDonVi(d.chu)) moi.push({ t: d.t, u });
      if (!moi.length) continue;
      const n = Math.min(daCo.length, moi.length);
      let chong = 0;
      for (let len = n; len > 0; len--) {
        let khop = true;
        for (let j = 0; j < len; j++) if (daCo[daCo.length - len + j] !== moi[j].u) { khop = false; break; }
        if (khop) { chong = len; break; }
      }
      const moiThat = moi.slice(chong);
      for (const x of moiThat) them(x.t, x.u);
      daCo.push(...moiThat.map((x) => x.u));
      if (daCo.length > 80) daCo = daCo.slice(-80);
    }
    chot();
  } else {
    // Phụ đề người làm: tôn trọng ranh giới khối (người làm đã ngắt theo ý), chỉ gộp khối quá ngắn và cắt khối quá dài.
    let cu = '';
    for (const k of khoi) {
      const chu = k.doan.map((d) => d.chu).join(' ').replace(/\s+/g, ' ').trim();
      if (!chu || chu === cu) continue;   // khối lặp nguyên văn (bản "đứng hình" 10 ms)
      cu = chu;
      for (const u of tachDonVi(chu)) them(k.bd, u);
      if (demChu(cum.map((x) => x.u)) >= 4) chot();
    }
    chot();
  }
  return { cues, soTu: tong };
}

/** Chữ thuần của phụ đề (để đoán ngôn ngữ khi không có nhãn): ghép lời các khối. */
export function chuCuaVtt(raw: string, toiDa = 4000): string {
  return docKhoi(raw).flatMap((k) => k.doan.map((d) => d.chu)).join(' ').slice(0, toiDa);
}
