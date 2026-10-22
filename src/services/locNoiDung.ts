/**
 * Bộ lọc nội dung phản cảm — MỘT chỗ cho mọi nơi người dùng viết chữ người khác đọc (App Store 1.2, 22/10/2026).
 * ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
 * Apple 1.2 đòi "a method for filtering objectionable material from being posted" TÁCH khỏi báo cáo/chặn. Trước bản này
 * máy chủ lưu nguyên văn mọi bài/bình luận/tin nhắn/tên/giới thiệu. Giờ các cửa ghi gọi `chanNoiDungXau()` và trả
 * 422 `CONTENT_BLOCKED` khi gặp từ NẶNG: lăng mạ sắc tộc/xu hướng tính dục, từ tục tĩu/tình dục trần trụi, câu đe doạ.
 * Từ "nhẹ" (vl, vãi, shit, damn…) KHÔNG chặn — mục tiêu là chặn thứ nặng mà gần như không bao giờ chặn nhầm.
 *
 * Cắm ở: Bảng tin (bài, bình luận, bình chọn, chú thích ảnh), tin nhắn riêng (site Messenger + biệt danh), chat kênh
 * CT Work, bình luận thẻ, bình luận tài liệu, tên hiển thị / họ tên / giới thiệu (hồ sơ, đăng ký).
 *
 * HAI CÁCH KHỚP — vì tiếng Việt bỏ dấu là nơi sinh ra chặn nhầm:
 *   · `dau`   — khớp trên chữ GIỮ dấu (NFC, chữ thường). "lồn", "cặc", "buồi", "địt": bỏ dấu đi thì đụng "lớn", "các",
 *               "buổi", "đít" — nên những từ này CHỈ khớp khi viết đúng dấu.
 *   · `ascii` — khớp trên chữ đã BỎ dấu + đ→d (tiếng Anh, và cụm tiếng Việt không dấu mà không trùng gì: "dit me").
 * Ranh giới từ: KHÔNG dùng `\b` — trong JS `\b` chỉ hiểu [A-Za-z0-9_], chữ có dấu bị coi là "không phải chữ" nên
 * "lồn" trong "lồng" sẽ khớp nhầm (bài học trong CLAUDE.md). Dùng lookaround `\p{L}\p{N}` với cờ `u`.
 * Né lọc đơn giản: lặp chữ ("fuuuck", "lồnnn"), leetspeak ("f4g", "n1gger", "f*ck"), chữ cách quãng ("f u c k",
 * "đ.c.m"). Từ có chữ đôi giữ đúng số tối thiểu ("nigger" cần "gg") để "Niger" không bị chặn.
 *
 * Mở rộng KHÔNG cần sửa mã (env, đọc lại mỗi khi giá trị đổi):
 *   CONTENT_FILTER_EXTRA_TERMS="từ 1,cụm từ 2,word3"  — thêm từ (có dấu ⇒ khớp `dau`, không dấu ⇒ khớp `ascii`)
 *   CONTENT_FILTER_ALLOW_TERMS="retard"               — gỡ một từ có sẵn nếu nó chặn nhầm ngoài đời
 *   CONTENT_FILTER=off                                — tắt hẳn (chỉ để chữa cháy; App Review cần nó BẬT)
 * Muốn sửa danh sách gốc: sửa `TU_GOC` bên dưới + thêm ca vào `locNoiDung.test.ts` (cả ca phải chặn lẫn ca KHÔNG được chặn).
 */
import { AppError } from '../middleware/errorHandler.js';

export type MucLoc = 'slur' | 'sexual' | 'profanity' | 'threat';
type CachKhop = 'dau' | 'ascii';

interface TuCam {
  /** Từ/cụm từ, viết thường. Khoảng trắng trong cụm = một hoặc nhiều dấu cách/dấu chấm/gạch. */
  t: string;
  muc: MucLoc;
  /** Mặc định: có ký tự ngoài ASCII ⇒ `dau`, không ⇒ `ascii`. */
  khop?: CachKhop;
  /** Đuôi được phép (regex, KHÔNG có nhóm bắt), ví dụ `(?:s|ed|ing)?`. Mặc định: không đuôi. */
  duoi?: string;
}

const DUOI_EN = '(?:s|es|ed|er|ers|ing|in|a|ah|az|z)?';

/**
 * Danh sách gốc. Nguyên tắc chọn: CHỈ thêm khi gần như không có nghĩa bình thường nào khác trong cách khớp đã chọn.
 * Những từ cố ý KHÔNG có (để tránh chặn nhầm): "dm" (direct message), "đm" (định mức), "vcl"/"vl"/"vãi" (nhẹ),
 * "clm" (Contract Lifecycle Management), "chink" ("a chink in the armor"), "dick"/"cock"/"pussy" (tên riêng, gà, mèo),
 * "con cac"/"an cac" không dấu ("còn các bạn", "ăn các món"), "giet may"/"tu tu di" không dấu ("giết mấy con gà",
 * "từ từ đi"), "du ma" ("dù mà"), "đít" (mông — nhẹ), "mọi" (= every).
 */
const TU_GOC: TuCam[] = [
  // ── Tiếng Anh: lăng mạ ──
  { t: 'nigger', muc: 'slur', duoi: DUOI_EN }, { t: 'nigga', muc: 'slur', duoi: '(?:s|z|h|hs)?' },
  { t: 'faggot', muc: 'slur', duoi: '(?:s|ry)?' }, { t: 'fag', muc: 'slur', duoi: '(?:s|gy)?' },
  { t: 'kike', muc: 'slur', duoi: '(?:s)?' }, { t: 'spic', muc: 'slur', duoi: '(?:s)?' },
  { t: 'tranny', muc: 'slur' }, { t: 'trannies', muc: 'slur' },
  { t: 'retard', muc: 'slur', duoi: '(?:s|ed)?' }, { t: 'wetback', muc: 'slur', duoi: '(?:s)?' },
  { t: 'gook', muc: 'slur', duoi: '(?:s)?' }, { t: 'raghead', muc: 'slur', duoi: '(?:s)?' },
  { t: 'towelhead', muc: 'slur', duoi: '(?:s)?' }, { t: 'beaner', muc: 'slur', duoi: '(?:s)?' },
  { t: 'heil hitler', muc: 'slur' }, { t: 'sieg heil', muc: 'slur' }, { t: 'gas the jews', muc: 'slur' },
  // ── Tiếng Anh: tục tĩu / tình dục ──
  { t: 'fuck', muc: 'profanity', duoi: '(?:s|ed|er|ers|ing|in|face|head|wit|tard|boy)?' },
  { t: 'motherfuck', muc: 'profanity', duoi: '(?:a|as|er|ers|ing|in)?' },
  { t: 'fuk', muc: 'profanity', duoi: '(?:s|ed|er|ing|in)?' }, { t: 'fck', muc: 'profanity', duoi: '(?:s|ed|er|ing|in)?' },
  { t: 'phuck', muc: 'profanity', duoi: '(?:s|ed|er|ing|in)?' }, { t: 'stfu', muc: 'profanity' },
  { t: 'cunt', muc: 'sexual', duoi: '(?:s)?' }, { t: 'cocksucker', muc: 'sexual', duoi: '(?:s)?' },
  { t: 'dickhead', muc: 'sexual', duoi: '(?:s)?' }, { t: 'blowjob', muc: 'sexual', duoi: '(?:s)?' },
  { t: 'blow job', muc: 'sexual', duoi: '(?:s)?' }, { t: 'handjob', muc: 'sexual', duoi: '(?:s)?' },
  { t: 'rimjob', muc: 'sexual', duoi: '(?:s)?' }, { t: 'cumshot', muc: 'sexual', duoi: '(?:s)?' },
  { t: 'suck my dick', muc: 'sexual' }, { t: 'suck my cock', muc: 'sexual' }, { t: 'send nudes', muc: 'sexual' },
  { t: 'pornhub', muc: 'sexual' }, { t: 'xvideos', muc: 'sexual' }, { t: 'xnxx', muc: 'sexual' },
  // ── Tiếng Anh: đe doạ / quấy rối nặng ──
  { t: 'kill yourself', muc: 'threat' }, { t: 'kill urself', muc: 'threat' }, { t: 'kill your self', muc: 'threat' },
  { t: 'kys', muc: 'threat' }, { t: 'hang yourself', muc: 'threat' }, { t: 'neck yourself', muc: 'threat' },
  { t: 'go die', muc: 'threat' }, { t: 'i will kill you', muc: 'threat' }, { t: 'ill kill you', muc: 'threat' },
  { t: "i'll kill you", muc: 'threat' }, { t: 'im going to kill you', muc: 'threat' }, { t: "i'm going to kill you", muc: 'threat' },
  { t: 'i am going to kill you', muc: 'threat' }, { t: 'im gonna kill you', muc: 'threat' }, { t: "i'm gonna kill you", muc: 'threat' },
  { t: 'i will rape you', muc: 'threat' }, { t: "i'll rape you", muc: 'threat' }, { t: 'gonna rape you', muc: 'threat' },
  { t: 'i will shoot you', muc: 'threat' }, { t: "i'll shoot you", muc: 'threat' },
  // ── Tiếng Việt CÓ DẤU (bỏ dấu là trùng từ thường ⇒ chỉ khớp khi đúng dấu) ──
  { t: 'lồn', muc: 'sexual' }, { t: 'cặc', muc: 'sexual' }, { t: 'buồi', muc: 'sexual' }, { t: 'địt', muc: 'sexual' },
  { t: 'đụ', muc: 'sexual' }, { t: 'chịch', muc: 'sexual' }, { t: 'nứng', muc: 'sexual' }, { t: 'đĩ', muc: 'sexual' },
  { t: 'bú cu', muc: 'sexual' }, { t: 'đéo', muc: 'profanity' }, { t: 'đjt', muc: 'sexual' },
  { t: 'đcm', muc: 'profanity' }, { t: 'đmm', muc: 'profanity' }, { t: 'đkm', muc: 'profanity' },
  { t: 'bê đê', muc: 'slur' }, { t: 'pê đê', muc: 'slur' }, { t: 'khựa', muc: 'slur' }, { t: 'chệt', muc: 'slur' },
  { t: 'giết mày', muc: 'threat' }, { t: 'giết chết mày', muc: 'threat' }, { t: 'giết cả nhà mày', muc: 'threat' },
  { t: 'chém chết mày', muc: 'threat' }, { t: 'đâm chết mày', muc: 'threat' }, { t: 'đánh chết mày', muc: 'threat' },
  { t: 'hiếp dâm mày', muc: 'threat' }, { t: 'hiếp mày', muc: 'threat' },
  { t: 'đi chết đi', muc: 'threat' }, { t: 'mày chết đi', muc: 'threat' }, { t: 'tự tử đi', muc: 'threat' },
  // ── Tiếng Việt KHÔNG DẤU mà không trùng từ thường nào ──
  { t: 'dit me', muc: 'sexual', khop: 'ascii' }, { t: 'dit con me', muc: 'sexual', khop: 'ascii' },
  { t: 'dit cu', muc: 'sexual', khop: 'ascii' }, { t: 'djt', muc: 'sexual', khop: 'ascii' },
  { t: 'djt me', muc: 'sexual', khop: 'ascii' },
];

// ─────────────────────────── Chuẩn hoá ───────────────────────────

const VO_HINH = new RegExp(`[${String.fromCharCode(0x200b)}-${String.fromCharCode(0x200d)}${String.fromCharCode(0x2060, 0xfeff, 0xad)}]`, 'g');
const NHAY_CONG = new RegExp(`[${String.fromCharCode(0x2018, 0x2019, 0x2bc)}\`]`, 'g');

/**
 * Phần chung của hai cách chuẩn hoá: bỏ ký tự vô hình, nháy cong ⇒ nháy thẳng, gộp khoảng trắng, và cắt mọi chuỗi một
 * ký tự lặp > 3 lần xuống 3 ("fuuuuuck" ⇒ "fuuuck" — regex vẫn khớp; "*****" dài vô tận không làm regex chạy bậc hai).
 */
function gon(s: string): string {
  return s.replace(VO_HINH, '').replace(NHAY_CONG, "'").replace(/\s+/g, ' ')
    .replace(/(.)\1{3,}/gsu, '$1$1$1');
}

/** Chữ thường NFC. Giữ dấu tiếng Việt. */
function chuanDau(s: string): string {
  return gon(s.normalize('NFC').toLowerCase());
}

/** Bỏ dấu (NFD + xoá dấu kết hợp), đ→d, chữ thường. Giữ chữ số và ký tự leet (@ $ * …) để regex tự hiểu. */
export function boDau(s: string): string {
  return gon(s.normalize('NFD').replace(/\p{M}+/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase());
}

/** "f u c k", "đ.c.m", "f-u-c-k" ⇒ dính lại thành một từ (chỉ những chuỗi TOÀN ký tự đơn cách nhau 1–2 dấu ngăn). */
function noiChuCachQuang(s: string): string {
  return s.replace(/(?<![\p{L}\p{N}])[\p{L}\p{N}*@$](?:[ ._\-]{1,2}[\p{L}\p{N}*@$](?![\p{L}\p{N}])){1,}/gu, (m) => m.replace(/[ ._\-]/g, ''));
}

// ─────────────────────────── Dựng regex ───────────────────────────

/** Ký tự leet được coi là chữ đó (chỉ khớp `ascii`). `*` = chữ bị che, chỉ ở giữa từ. */
const LEET: Record<string, string> = { a: 'a4@', e: 'e3', i: 'i1!|', o: 'o0', s: 's5$', t: 't7', u: 'uv', g: 'g9', l: 'l1|' };

const thoat = (c: string) => c.replace(/[\\^$.*+?()[\]{}|\-/]/g, '\\$&');

function lopKyTu(c: string, giua: boolean, khop: CachKhop): string {
  if (khop === 'ascii' && /[a-z]/.test(c)) {
    const ds = (LEET[c] ?? c) + (giua ? '*' : '');
    return `[${[...new Set(ds)].map(thoat).join('')}]`;
  }
  return thoat(c);
}

function dungRegex(tu: TuCam): RegExp {
  const khop: CachKhop = tu.khop ?? (/[^\x00-\x7f]/.test(tu.t) ? 'dau' : 'ascii');
  const goc = khop === 'ascii' ? boDau(tu.t) : chuanDau(tu.t);
  const tuDon = goc.split(/[ ]+/).filter(Boolean);
  const phan = tuDon.map((w, wi) => {
    const kyTu = [...w];
    let out = '';
    for (let i = 0; i < kyTu.length;) {
      let j = i;
      while (j < kyTu.length && kyTu[j] === kyTu[i]) j++;
      const soLan = j - i;
      const giua = !(wi === 0 && i === 0) && !(wi === tuDon.length - 1 && j === kyTu.length);
      const lop = kyTu[i] === "'" ? "'?" : lopKyTu(kyTu[i]!, giua, khop);
      // Dấu nháy (i'll) có thể bỏ; chữ lặp ("fuuuck") vẫn khớp; chữ đôi giữ tối thiểu hai lần.
      out += kyTu[i] === "'" ? lop : soLan === 1 ? `${lop}+` : `${lop}{${soLan},}`;
      i = j;
    }
    return out;
  });
  const than = phan.join('[ ._\\-]+') + (tu.duoi ?? '');
  return new RegExp(`(?<![\\p{L}\\p{N}])${than}(?![\\p{L}\\p{N}])`, 'u');
}

interface BoLoc { dau: Array<{ re: RegExp; tu: TuCam }>; ascii: Array<{ re: RegExp; tu: TuCam }> }
let boNho: { khoa: string; bo: BoLoc } | null = null;

function tachDanhSach(v: string | undefined): string[] {
  return (v ?? '').split(/[,\n;]/).map((x) => x.trim().toLowerCase()).filter(Boolean);
}

function boLoc(): BoLoc {
  const them = process.env.CONTENT_FILTER_EXTRA_TERMS ?? '';
  const bo = process.env.CONTENT_FILTER_ALLOW_TERMS ?? '';
  const khoa = `${them}|${bo}`;
  if (boNho?.khoa === khoa) return boNho.bo;
  const goBo = new Set(tachDanhSach(bo).map((t) => t.normalize('NFC')));
  const ds: TuCam[] = [
    ...TU_GOC.filter((t) => !goBo.has(t.t.normalize('NFC'))),
    ...tachDanhSach(them).map((t): TuCam => ({ t, muc: 'profanity' })),
  ];
  const kq: BoLoc = { dau: [], ascii: [] };
  for (const tu of ds) {
    const khop: CachKhop = tu.khop ?? (/[^\x00-\x7f]/.test(tu.t) ? 'dau' : 'ascii');
    kq[khop].push({ re: dungRegex(tu), tu });
  }
  boNho = { khoa, bo: kq };
  return kq;
}

export const locDangBat = (): boolean => !['off', '0', 'false'].includes(String(process.env.CONTENT_FILTER ?? '').trim().toLowerCase());

export interface KetQuaLoc { chan: boolean; muc?: MucLoc; tu?: string }

/** Kiểm MỘT đoạn chữ. Không ném lỗi — dùng `chanNoiDungXau` ở cửa ghi. */
export function kiemNoiDung(text: string | null | undefined): KetQuaLoc {
  if (!text || !locDangBat()) return { chan: false };
  const s = String(text);
  if (!/[\p{L}]/u.test(s)) return { chan: false };
  const bo = boLoc();
  const dau = chuanDau(s);
  for (const ban of [dau, noiChuCachQuang(dau)]) {
    for (const { re, tu } of bo.dau) if (re.test(ban)) return { chan: true, muc: tu.muc, tu: tu.t };
  }
  const ascii = boDau(s);
  for (const ban of [ascii, noiChuCachQuang(ascii)]) {
    for (const { re, tu } of bo.ascii) if (re.test(ban)) return { chan: true, muc: tu.muc, tu: tu.t };
  }
  return { chan: false };
}

export const THONG_BAO_CHAN =
  'Nội dung có từ ngữ không được phép trong CT Work (tục tĩu, xúc phạm, tình dục hoặc đe doạ). Vui lòng sửa lại. · ' +
  "This contains words that aren't allowed in CT Work (profanity, slurs, sexual or threatening language). Please edit it.";

export class NoiDungBiChanError extends AppError {
  constructor(field: string, muc: MucLoc) {
    super(THONG_BAO_CHAN, 422, 'CONTENT_BLOCKED', { field, category: muc });
    this.name = 'NoiDungBiChanError';
  }
}

/**
 * Cửa ghi: kiểm từng trường (tên trường ⇒ chữ), gặp từ nặng thì ném 422 CONTENT_BLOCKED (`data.field`, `data.category`).
 * Không lộ từ nào bị khớp (để danh sách không thành bản đồ né lọc). Giá trị không phải chuỗi bị bỏ qua.
 */
export function chanNoiDungXau(fields: Record<string, unknown>): void {
  for (const [field, v] of Object.entries(fields)) {
    if (typeof v !== 'string' || !v) continue;
    const kq = kiemNoiDung(v);
    if (kq.chan) throw new NoiDungBiChanError(field, kq.muc!);
  }
}
