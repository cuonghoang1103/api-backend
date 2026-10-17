/**
 * MARKDOWN ⇒ chữ terminal (ANSI). Dùng bộ tách token của `marked` rồi tự vẽ:
 * tiêu đề, danh sách (lồng, việc ☐/☑), bảng khung, trích dẫn, khối code tô
 * màu cú pháp, link, `code` trong dòng.
 *
 * TỰ XUỐNG DÒNG ở đây (wrap-ansi) thay vì để Ink làm: Ink bọc dòng là mất thụt
 * lề — dòng thứ hai của một gạch đầu dòng chạy về cột 0, bảng vỡ khung.
 */
import { Lexer, type Token, type Tokens } from 'marked';
import wrapAnsi from 'wrap-ansi';
import { THUONG_HIEU, capMau, catVua, chuyenSac, dam, doRong, gachChan, gachNgang, mau, mo, nghieng } from './mau';
import { toMauCode } from './toMau';

export interface TuyChonMd {
  /** Số cột tối đa. */
  rong: number;
}

const MAU = {
  h1: THUONG_HIEU.timNhat,
  h2: '#a78bfa',
  h3: '#93c5fd',
  codeDong: '#7dd3fc',
  link: '#60a5fa',
  vien: '#4b5563',
  tick: '#22c55e',
  trich: THUONG_HIEU.tim,
  dau: '#a78bfa',
};

const THUC_THE: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&nbsp;': ' ' };
const giaiMa = (s: string): string => s.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp);/g, (m) => THUC_THE[m] ?? m);

/** Bọc một chuỗi đã tô màu cho vừa `rong` cột. */
export function bocDong(s: string, rong: number): string[] {
  if (rong < 4) return s.split('\n');
  return wrapAnsi(s, rong, { hard: true, trim: false, wordWrap: true }).split('\n');
}

// ─── Trong dòng ──────────────────────────────────────────────────

function trongDong(tokens: Token[] | undefined, chuThuong?: string): string {
  if (!tokens) return giaiMa(chuThuong ?? '');
  return tokens.map((t) => motTrongDong(t)).join('');
}

function motTrongDong(t: Token): string {
  switch (t.type) {
    case 'text': {
      const tt = t as Tokens.Text;
      return tt.tokens?.length ? trongDong(tt.tokens) : giaiMa(tt.text);
    }
    case 'escape': return giaiMa((t as Tokens.Escape).text);
    case 'strong': return dam(trongDong((t as Tokens.Strong).tokens));
    case 'em': return nghieng(trongDong((t as Tokens.Em).tokens));
    case 'del': return gachNgang(trongDong((t as Tokens.Del).tokens));
    case 'codespan': {
      const chu = giaiMa((t as Tokens.Codespan).text);
      return capMau() === 0 ? `\`${chu}\`` : mau(MAU.codeDong)(chu);
    }
    case 'br': return '\n';
    case 'link': {
      const l = t as Tokens.Link;
      const chu = trongDong(l.tokens, l.text);
      const href = l.href ?? '';
      const giongNhau = href === l.text || href === `mailto:${l.text}` || href.replace(/\/$/, '') === l.text.replace(/\/$/, '');
      const nhan = capMau() === 0 ? chu : gachChan(mau(MAU.link)(chu));
      return giongNhau || !href ? nhan : `${nhan}${mo(` (${href})`)}`;
    }
    case 'image': {
      const im = t as Tokens.Image;
      return mo(`[ảnh: ${im.text || im.href}]`);
    }
    case 'html': return mo((t as Tokens.HTML).text);
    default: {
      const x = t as { text?: string; raw?: string };
      return giaiMa(x.text ?? x.raw ?? '');
    }
  }
}

// ─── Khối ────────────────────────────────────────────────────────

const DAU_DS = ['•', '◦', '▪'];

function khoiCode(t: Tokens.Code, rong: number): string[] {
  const ngonNgu = (t.lang ?? '').trim().split(/\s+/)[0] ?? '';
  const vien = (s: string) => mau(MAU.vien)(s);
  const than = toMauCode(t.text.replace(/\n$/, ''), ngonNgu || null).split('\n');
  const ra = [vien(`┌─${ngonNgu ? ` ${mau('#a78bfa')(ngonNgu)}` : ''}`)];
  for (const d of than) {
    // Dòng code dài: CẮT (kèm `…`) thay vì bọc — bọc làm sai thụt lề của code.
    const chi = doRong(d) > rong - 2 ? catAnsi(d, rong - 2) : d;
    ra.push(`${vien('│')} ${chi}`);
  }
  ra.push(vien('└─'));
  return ra;
}

/** Cắt chuỗi CÓ MÀU theo số cột (giữ mã màu, thêm … ). */
function catAnsi(s: string, n: number): string {
  const tron = wrapAnsi(s, Math.max(1, n - 1), { hard: true, trim: false, wordWrap: false }).split('\n');
  return `${tron[0] ?? ''}${mo('…')}`;
}

function bang(t: Tokens.Table, rong: number): string[] {
  const dau = t.header.map((o) => dam(trongDong(o.tokens, o.text)));
  const hang = t.rows.map((r) => r.map((o) => trongDong(o.tokens, o.text)));
  const cot = dau.length;
  const be = Array.from({ length: cot }, (_, i) => Math.max(doRong(dau[i] ?? ''), ...hang.map((r) => doRong(r[i] ?? ''))));
  const tong = be.reduce((a, b) => a + b, 0) + cot * 3 + 1;
  // Không vừa màn hình ⇒ in dạng thẻ "Tiêu đề: giá trị" cho từng hàng — bảng vỡ khung còn khó đọc hơn.
  if (tong > rong) {
    const ra: string[] = [];
    for (const r of hang) {
      ra.push(...bocDong(`${mau(MAU.dau)('•')} ${r.map((o, i) => `${dau[i] ?? ''}: ${o}`).join(mo(' · '))}`, rong));
    }
    return ra;
  }
  const v = (s: string) => mau(MAU.vien)(s);
  const can = (s: string, i: number): string => {
    const du = (be[i] ?? 0) - doRong(s);
    const a = t.align[i];
    if (a === 'right') return ' '.repeat(du) + s;
    if (a === 'center') return ' '.repeat(Math.floor(du / 2)) + s + ' '.repeat(Math.ceil(du / 2));
    return s + ' '.repeat(du);
  };
  const ke = (trai: string, giua: string, phai: string) => v(trai + be.map((b) => '─'.repeat(b + 2)).join(giua) + phai);
  const dong = (o: string[]) => `${v('│')}${o.map((x, i) => ` ${can(x, i)} `).join(v('│'))}${v('│')}`;
  return [ke('┌', '┬', '┐'), dong(dau), ke('├', '┼', '┤'), ...hang.map(dong), ke('└', '┴', '┘')];
}

function danhSach(t: Tokens.List, rong: number, cap: number): string[] {
  const ra: string[] = [];
  let so = typeof t.start === 'number' ? t.start : 1;
  for (const muc of t.items) {
    let dau: string;
    if (muc.task) dau = muc.checked ? mau(MAU.tick)('☑') : mo('☐');
    else if (t.ordered) dau = mau(MAU.dau)(`${so}.`);
    else dau = mau(MAU.dau)(DAU_DS[cap % DAU_DS.length]!);
    so += 1;
    const thut = doRong(dau) + 1;
    const than = khoi(muc.tokens.filter((x) => x.type !== 'checkbox'), rong - thut, cap + 1, true);
    than.forEach((d, i) => ra.push(i === 0 ? `${dau} ${d}` : `${' '.repeat(thut)}${d}`));
    if (!than.length) ra.push(dau);
  }
  return ra;
}

function motKhoi(t: Token, rong: number, cap: number): string[] | null {
  switch (t.type) {
    case 'space': case 'def': return null;
    case 'heading': {
      const h = t as Tokens.Heading;
      const chu = trongDong(h.tokens, h.text);
      if (capMau() === 0) return bocDong(`${'#'.repeat(h.depth)} ${chu}`, rong);
      if (h.depth === 1) return bocDong(dam(chuyenSac(chu.replace(/\x1b\[[0-9;]*m/g, ''))), rong);
      if (h.depth === 2) return bocDong(dam(mau(MAU.h2)(chu)), rong);
      if (h.depth === 3) return bocDong(dam(mau(MAU.h3)(chu)), rong);
      return bocDong(dam(chu), rong);
    }
    case 'paragraph': {
      const p = t as Tokens.Paragraph;
      return bocDong(trongDong(p.tokens, p.text), rong);
    }
    case 'text': {
      const x = t as Tokens.Text;
      return bocDong(x.tokens?.length ? trongDong(x.tokens) : giaiMa(x.text), rong);
    }
    case 'code': return khoiCode(t as Tokens.Code, rong);
    case 'blockquote': {
      const b = t as Tokens.Blockquote;
      const trong = khoi(b.tokens, rong - 2, cap, false);
      return trong.map((d) => `${mau(MAU.trich)('▎')} ${capMau() ? nghieng(d) : d}`);
    }
    case 'list': return danhSach(t as Tokens.List, rong, cap);
    case 'table': return bang(t as Tokens.Table, rong);
    case 'hr': return [mau(MAU.vien)('─'.repeat(Math.max(3, Math.min(rong, 60))))];
    case 'html': return bocDong(mo((t as Tokens.HTML).text.trimEnd()), rong);
    default: {
      const x = t as { text?: string; raw?: string };
      return bocDong(giaiMa(x.text ?? x.raw ?? ''), rong);
    }
  }
}

/** `chat` = trong mục danh sách: các khối dính nhau, không dòng trống ở giữa. */
function khoi(tokens: Token[], rong: number, cap: number, chat: boolean): string[] {
  const ra: string[] = [];
  for (const t of tokens) {
    const d = motKhoi(t, Math.max(8, rong), cap);
    if (!d) continue;
    if (ra.length && !chat) ra.push('');
    ra.push(...d);
  }
  return ra;
}

/** Markdown ⇒ chuỗi nhiều dòng đã tô màu. */
export function veMarkdown(md: string, o: TuyChonMd = { rong: 80 }): string {
  if (!md.trim()) return '';
  let tokens: Token[];
  try {
    tokens = new Lexer({ gfm: true }).lex(md);
  } catch {
    return bocDong(md, o.rong).join('\n');
  }
  return khoi(tokens, o.rong, 0, false).join('\n').replace(/\n+$/, '');
}

/** Bản "cắt đuôi" cho chữ đang chảy: chỉ giữ `n` dòng cuối (màn hình động không được cao hơn terminal). */
export function duoiMarkdown(md: string, rong: number, n: number): { dong: string[]; anBot: number } {
  const tat = veMarkdown(md, { rong }).split('\n');
  if (tat.length <= n) return { dong: tat, anBot: 0 };
  return { dong: tat.slice(-n), anBot: tat.length - n };
}

export { catVua };
