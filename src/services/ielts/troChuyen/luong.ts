/**
 * ⚡ ĐƯỜNG ỐNG CHẢY DẦN cho "Trò chuyện cùng CuongMini" — phần THUẦN (test được).
 *
 * Model chảy chữ ⇒ `BoCatCau` cắt theo câu ⇒ câu đầu đi TTS và phát ngay trong khi
 * model còn viết tiếp. Lời đáp có hai phần, ngăn bằng một dòng `###`:
 *   1. LỜI NÓI (đọc to) — `[en]…[/en]` bọc đoạn ngoại ngữ.
 *   2. MỘT dòng JSON (không ai nghe): thẻ sửa lỗi, từ mới, bản dịch, cảm xúc robot.
 * JSON đứng SAU lời nói nên không làm chậm tiếng đầu tiên.
 */
import type { ChuDe, NgonNguTC } from './chuDe.js';

const TEN_TIENG: Record<NgonNguTC, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung' };
const DOC: Record<NgonNguTC, string> = { en: 'IPA ngắn của từ khó (có thể bỏ trống)', ja: 'cách đọc hiragana (furigana) của câu đúng', zh: 'pinyin có dấu thanh của câu đúng' };

/** Prompt hệ thống — NGẮN (ít token vào = chữ đầu sớm hơn) và ỔN ĐỊNH theo chủ đề (đệm prompt trúng). */
export function dungPrompt(nn: NgonNguTC, c: ChuDe): string {
  const t = TEN_TIENG[nn];
  const viet = nn === 'ja' ? ' Tiếng Nhật viết kana/kanji thông dụng, không romaji.' : nn === 'zh' ? ' Tiếng Trung viết giản thể, không pinyin trong lời nói.' : '';
  return [
    `Bạn là CuongMini — robot bạn đồng hành dễ thương, đang TRÒ CHUYỆN BẰNG GIỌNG NÓI giúp người Việt luyện nói ${t}. Xưng "mình", gọi "bạn".`,
    `Trình độ: ${c.capDo}. ${c.vai}`,
    'LỜI NÓI (máy đọc ngay từng câu — càng ngắn càng tốt):',
    c.giamKhao
      ? `- Giữ nhịp phòng thi: đáp bằng ${t}, KHÔNG chen tiếng Việt (lỗi chỉ ghi trong JSON). Người học nói tiếng Việt/bí thì mới giải thích 1 câu tiếng Việt rồi hỏi lại.`
      : `- Người học nói ${t}: đáp 1–2 câu ngắn bằng ${t}. Câu của họ sai ⇒ khen ngắn rồi chen MỘT câu tiếng Việt sửa nhẹ.\n- Người học nói tiếng Việt (bí, hỏi): giải thích 1 câu tiếng Việt + đưa câu mẫu ${t} để nói theo.`,
    `- Luôn kết thúc bằng ĐÚNG MỘT câu hỏi ngắn bằng ${t}.`,
    `- Mọi chữ ${t} bọc trong [en]…[/en].${viet} Tối đa 45 chữ. Không markdown, không emoji, không phiên âm trong lời nói.`,
    'Sau lời nói: xuống dòng, viết ###, rồi MỘT dòng JSON (người học không nghe phần này):',
    `{"sua":null hoặc {"ban":"câu người học vừa nói","dung":"câu đúng tự nhiên","viSao":"lý do, ≤ 15 chữ tiếng Việt","doc":"${DOC[nn]}"},"tu":[tối đa 2 từ/cụm đáng học trong lượt này {"tu":"","doc":"","nghia":""}],"dich":"dịch tiếng Việt phần ${t} trong lời bạn","cam":"khen|sua|hoi|vui"}`,
    '"sua" chỉ khi câu người học có lỗi thật (ngữ pháp, từ, trật tự). Câu đã đúng ⇒ null và "cam":"khen".',
  ].join('\n');
}

/* ── Cắt câu khi chữ đang chảy ─────────────────────────────────────────── */

const KET_CAU = /[.!?。！？…]/;
const DAU_DONG = /["'”’」』）)\]]/;
const MO = '[en]';
const DONG = '[/en]';
const NGAN = '###';

/**
 * Bộ cắt câu cho luồng chữ. `them(delta)` trả các câu ĐÃ TRỌN (đóng/mở lại thẻ
 * `[en]` cho cân), `ket()` trả phần còn lại khi luồng xong. Gặp `###` là hết
 * phần lời nói: mọi chữ sau đó vào `meta` (không cắt câu, không đọc).
 *
 * Câu đầu được cắt SỚM NHẤT có thể (chỉ cần ≥ 2 ký tự) — nó quyết định độ trễ
 * người học cảm thấy. Các câu sau gom tới ≥ `toiThieu` ký tự để TTS ít lượt gọi.
 */
export class BoCatCau {
  private buf = '';
  private trongEn = false;
  private daCat = 0;
  private hetLoi = false;
  meta = '';
  constructor(private toiThieu = 24) {}

  get daHetLoiNoi() { return this.hetLoi; }

  them(delta: string): string[] {
    if (this.hetLoi) { this.meta += delta; return []; }
    this.buf += delta;
    const i = this.buf.indexOf(NGAN);
    if (i >= 0) {
      this.meta += this.buf.slice(i + NGAN.length);
      this.buf = this.buf.slice(0, i);
      this.hetLoi = true;
      const ra = this.cat(true);
      const cuoi = this.layHet();
      return cuoi ? [...ra, cuoi] : ra;
    }
    return this.cat(false);
  }

  /** Luồng xong: trả phần lời còn lại (nếu có). */
  ket(): string[] {
    if (this.hetLoi) return [];
    this.hetLoi = true;
    const ra = this.cat(true);
    const cuoi = this.layHet();
    return cuoi ? [...ra, cuoi] : ra;
  }

  private layHet(): string | null {
    let s = this.buf.trim();
    this.buf = '';
    const dangEn = this.trongEn;
    this.trongEn = false;
    if (!s.replace(/\[\/?en\]/gi, '').trim()) return null;
    if (dangEn && !s.startsWith(MO)) s = MO + s;
    if ((s.match(/\[en\]/gi) ?? []).length > (s.match(/\[\/en\]/gi) ?? []).length) s += DONG;
    this.daCat++;
    return s;
  }

  private cat(xong: boolean): string[] {
    const ra: string[] = [];
    let tu = 0;
    let en = this.trongEn;
    let i = 0;
    const b = this.buf;
    while (i < b.length) {
      if (b.startsWith(MO, i)) { en = true; i += MO.length; continue; }
      if (b.startsWith(DONG, i)) { en = false; i += DONG.length; continue; }
      // Giữ lại đuôi có thể là đầu của "[en]", "[/en]", "###" — chưa đủ chữ để biết.
      if (!xong && (b[i] === '[' || b[i] === '#') && b.length - i < 5) break;
      const ch = b[i]!;
      if (KET_CAU.test(ch) || ch === '\n') {
        let j = i + 1;
        while (j < b.length && (KET_CAU.test(b[j]!) || DAU_DONG.test(b[j]!))) j++;
        let enSau = en;
        if (b.startsWith(DONG, j)) { j += DONG.length; enSau = false; }
        // Dấu chấm giữa số (3.5) hoặc viết tắt dính chữ (e.g.) — không phải hết câu.
        const sau = b[j];
        if (ch === '.' && sau !== undefined && /[0-9A-Za-z]/.test(sau)) { i = j; continue; }
        // Ở đuôi bộ đệm mà luồng chưa xong: chưa biết sau đó là gì ("[/en]"? chữ số?) ⇒ chờ.
        // Riêng dấu câu CJK thì không cần khoảng trắng phía sau.
        const cjk = /[。！？]/.test(ch);
        if (sau === undefined && !xong && !cjk) break;
        if (sau !== undefined && !/\s/.test(sau) && !cjk && ch !== '\n' && !b.startsWith(MO, j)) { i = j; continue; }
        const doan = b.slice(tu, j).trim();
        const chu = doan.replace(/\[\/?en\]/gi, '').trim();
        const du = this.daCat === 0 ? chu.length >= 2 : chu.length >= this.toiThieu;
        if (chu && du) {
          let s = doan;
          const moDau = this.trongEn && !s.startsWith(MO);
          if (moDau) s = MO + s;
          if (enSau && !s.endsWith(DONG)) s += DONG;
          ra.push(s);
          this.daCat++;
          this.trongEn = enSau;
          tu = j;
        }
        en = enSau;
        i = j;
        continue;
      }
      i++;
    }
    // Phần chưa cắt: nếu đang mở thẻ [en] mà ta đã cắt trước đó thì phần còn lại vẫn trong thẻ.
    this.buf = b.slice(tu);
    return ra;
  }
}

/* ── Phần JSON sau `###` ───────────────────────────────────────────────── */

export interface TheSua { ban: string; dung: string; viSao: string; doc?: string }
export interface TuMoi { tu: string; doc?: string; nghia: string }
export type CamXucTC = 'khen' | 'sua' | 'hoi' | 'vui';
export interface MetaLuot { sua: TheSua | null; tu: TuMoi[]; dich: string; cam: CamXucTC }

const s = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

/** Đọc phần JSON (khoan dung: model lỡ bọc ```json, thêm chữ thừa, hay thiếu hẳn). */
export function docMeta(raw: string): MetaLuot {
  const rong: MetaLuot = { sua: null, tu: [], dich: '', cam: 'hoi' };
  const a = raw.indexOf('{');
  const b = raw.lastIndexOf('}');
  if (a < 0 || b <= a) return rong;
  let j: Record<string, unknown>;
  try { j = JSON.parse(raw.slice(a, b + 1)) as Record<string, unknown>; } catch { return rong; }
  const sua = j.sua && typeof j.sua === 'object' ? j.sua as Record<string, unknown> : null;
  const theSua = sua && s(sua.dung, 300) && s(sua.ban, 300) && s(sua.dung, 300) !== s(sua.ban, 300)
    ? { ban: s(sua.ban, 300), dung: s(sua.dung, 300), viSao: s(sua.viSao, 200), ...(s(sua.doc, 300) ? { doc: s(sua.doc, 300) } : {}) }
    : null;
  const tu = (Array.isArray(j.tu) ? j.tu : [])
    .map((x) => (x && typeof x === 'object' ? x as Record<string, unknown> : {}))
    .map((x) => ({ tu: s(x.tu, 60), nghia: s(x.nghia, 120), ...(s(x.doc, 80) ? { doc: s(x.doc, 80) } : {}) }))
    .filter((x) => x.tu && x.nghia)
    .slice(0, 3);
  const cam = (['khen', 'sua', 'hoi', 'vui'] as const).includes(j.cam as CamXucTC) ? j.cam as CamXucTC : theSua ? 'sua' : 'hoi';
  return { sua: theSua, tu, dich: s(j.dich, 400), cam };
}

/** Lời nói sạch (bỏ phần sau ###, bỏ markdown model lỡ viết). */
export function loiNoiSach(full: string): string {
  const i = full.indexOf(NGAN);
  return (i >= 0 ? full.slice(0, i) : full).replace(/```[a-z]*|```/g, '').replace(/\*\*/g, '').trim();
}

/* ── Chọn cổng + trần tiền ─────────────────────────────────────────────── */

export type DuongTC = 'chinh-hang' | 'du-phong';
export interface DieuKienDuong {
  /** Admin bật/tắt cổng chính hãng cho việc này. */
  bat: boolean;
  coKey: boolean;
  daDungNgayUsd: number;
  tranNgayUsd: number;
}
/** Quyết định cổng cho MỘT lượt. Hết trần/không key/tắt ⇒ dự phòng (không chặn người học). */
export function chonDuong(d: DieuKienDuong): { duong: DuongTC; lyDo: 'ok' | 'tat' | 'khong-key' | 'het-tran' } {
  if (!d.bat) return { duong: 'du-phong', lyDo: 'tat' };
  if (!d.coKey) return { duong: 'du-phong', lyDo: 'khong-key' };
  if (d.tranNgayUsd >= 0 && d.daDungNgayUsd >= d.tranNgayUsd) return { duong: 'du-phong', lyDo: 'het-tran' };
  return { duong: 'chinh-hang', lyDo: 'ok' };
}

export const TRAN_NGAY_MAC_DINH = 0.5;
/** Đọc cài đặt admin (JSON trong app_settings) — hỏng/thiếu ⇒ mặc định. */
export function docCaiDat(raw: string | null | undefined): { bat: boolean; tranNgayUsd: number } {
  let j: Record<string, unknown> = {};
  try { j = raw ? JSON.parse(raw) as Record<string, unknown> : {}; } catch { /* mặc định */ }
  const t = Number(j.tranNgayUsd);
  return {
    bat: j.bat !== false,
    tranNgayUsd: Number.isFinite(t) && t >= 0 && t <= 100 ? t : TRAN_NGAY_MAC_DINH,
  };
}

/* ── Lịch sử gửi model ─────────────────────────────────────────────────── */

export function sachLichSu(raw: unknown, toiDa = 10): { ai: boolean; text: string }[] {
  return (Array.isArray(raw) ? raw : [])
    .map((t) => ({ ai: !!(t as { ai?: unknown })?.ai, text: String((t as { text?: unknown })?.text ?? '').slice(0, 500) }))
    .filter((t) => t.text.trim())
    .slice(-toiDa);
}

/** Lịch sử ⇒ messages hợp lệ cho Anthropic: bắt đầu bằng user, không hai lượt cùng vai liền nhau. */
export function thanhTinNhan(ls: { ai: boolean; text: string }[], cauMoi: string): Array<{ role: 'user' | 'assistant'; content: string }> {
  const ra: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const t of [...ls, { ai: false, text: cauMoi }]) {
    const role = t.ai ? 'assistant' as const : 'user' as const;
    const cuoi = ra[ra.length - 1];
    if (cuoi && cuoi.role === role) cuoi.content += `\n${t.text}`;
    else ra.push({ role, content: t.text });
  }
  while (ra.length && ra[0]!.role !== 'user') ra.shift();
  return ra;
}
