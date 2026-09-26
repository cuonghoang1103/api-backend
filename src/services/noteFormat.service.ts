/**
 * Notes — "✨ Sắp xếp lại trang này".
 *
 * Người dùng ghi vội (sai dấu, lệnh terminal lẫn trong câu, ý nhảy lung tung),
 * bấm một nút, AI trả về CÙNG nội dung đó nhưng có mục, bảng, khối code, tóm
 * tắt. Người dùng xem so sánh hai cột rồi mới quyết định giữ hay bỏ.
 *
 * ─── Vì sao đi bằng TipTap JSON + Markdown, không đưa HTML cho AI ───
 * 1. Trang có những khối AI không được đụng: ảnh, video, tệp, bookmark, nhúng,
 *    bảng dữ liệu, khối dùng chung, callout, toggle, công thức, khối code có
 *    sẵn, bảng có sẵn, checklist. Mỗi khối như thế được thay bằng một mã giữ
 *    chỗ `⟦K3⟧` và NÚT GỐC được cất lại ở đây. AI chỉ được dời mã đi chỗ khác;
 *    lúc ráp lại ta cắm đúng nút gốc vào — từng thuộc tính, từng byte.
 * 2. AI viết Markdown giỏi hơn mọi định dạng khác, còn Markdown → TipTap JSON
 *    do MÃ dựng (marked lexer → nút), nên đầu ra luôn hợp lệ với schema của
 *    editor và KHÔNG có đường nào cho HTML lạ lọt vào trang (mọi chữ AI viết
 *    chỉ thành nút `text`, không bao giờ thành HTML).
 *
 * ─── Luật cứng, do MÃ canh chứ không trông vào lời dặn ───
 * Lời dặn "đừng thêm ý, đừng xoá ý" nằm trong prompt, nhưng model vẫn có lúc
 * làm rơi một khối hay bịa một liên kết. Nên sau khi AI trả về:
 *   • khối giữ chỗ bị rơi  ⇒ gắn lại cuối trang + cảnh báo
 *   • khối bị nhân đôi     ⇒ giữ lần đầu, bỏ bản sao
 *   • liên kết AI tự thêm  ⇒ gỡ liên kết (giữ chữ) + cảnh báo
 *   • liên kết bị rơi      ⇒ gắn lại cuối trang + cảnh báo
 *   • số liệu không có trong bản gốc ⇒ cảnh báo, chỉ ra đúng con số
 *   • mất quá nhiều chữ / trả rỗng   ⇒ TỪ CHỐI hẳn, không đưa ra xem trước
 * Thống kê trong khối Tóm tắt (số mục, số khối code…) do MÃ đếm, không để
 * model tự đếm — model đếm sai mà nói rất tự tin.
 */
import { Lexer, type Token, type Tokens } from 'marked';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';

// ─── Kiểu nút TipTap (ProseMirror JSON) ─────────────────────────────

export interface PmMark { type: string; attrs?: Record<string, unknown> }
export interface PmNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PmNode[];
  marks?: PmMark[];
  text?: string;
}

/** Trần chữ Markdown gửi đi. Quá trần thì báo rõ, không cắt lén. */
export const MAX_INPUT_CHARS = 15_000;

/** Khối "đơn giản" — AI được sắp xếp lại, sửa chữ bên trong. */
const KHOI_CHUA = new Set(['bulletList', 'orderedList', 'listItem', 'blockquote']);
const KHOI_CHU = new Set(['paragraph', 'heading']);
/** Dấu định dạng ta chuyển được hai chiều. Dấu khác ⇒ giữ nguyên đoạn chữ đó. */
const DAU_BIET = new Set(['bold', 'italic', 'strike', 'code', 'link']);

/** Ngôn ngữ khối code mà editor có (NOTE_CODE_LANGS ở NoteCodeBlock.tsx). */
const NGON_NGU_CODE = new Set([
  'typescript', 'tsx', 'javascript', 'jsx', 'python', 'java', 'go', 'rust', 'prisma',
  'sql', 'bash', 'json', 'yaml', 'css', 'html', 'markdown',
]);
const BI_DANH_NGON_NGU: Record<string, string> = {
  sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash', terminal: 'bash', cmd: 'bash',
  powershell: 'bash', ps1: 'bash', bat: 'bash', dockerfile: 'bash', docker: 'bash',
  js: 'javascript', mjs: 'javascript', cjs: 'javascript', node: 'javascript',
  ts: 'typescript', py: 'python', yml: 'yaml', md: 'markdown', postgres: 'sql',
  postgresql: 'sql', mysql: 'sql', psql: 'sql', plpgsql: 'sql', rs: 'rust', golang: 'go',
  htm: 'html', xml: 'html', jsonc: 'json',
};

export function chuanNgonNgu(lang: string | undefined | null): string {
  const l = String(lang ?? '').trim().toLowerCase().split(/\s+/)[0] ?? '';
  if (NGON_NGU_CODE.has(l)) return l;
  return BI_DANH_NGON_NGU[l] ?? '';
}

// ─── Chiều đi: TipTap JSON → Markdown + mã giữ chỗ ──────────────────

export interface BanDi {
  markdown: string;
  /** `K1` → nút khối gốc. */
  khoi: Map<string, PmNode>;
  /** `N1` → nút nội dòng gốc (công thức nội dòng, chữ mang dấu lạ…). */
  noiDong: Map<string, PmNode>;
  /** Mô tả ngắn từng khối cho AI biết nó là gì (để xếp vào đúng mục). */
  chuGiai: string[];
  /** Mọi href nằm trong phần AI được sửa. */
  lienKet: string[];
  /** Chữ thuần của phần AI được sửa (không cú pháp Markdown, không URL của liên kết). */
  chuThuan: string;
}

function chuCuaNut(n: PmNode): string {
  if (n.type === 'text') return n.text ?? '';
  return (n.content ?? []).map(chuCuaNut).join(n.type === 'paragraph' || n.type === 'heading' ? '' : ' ');
}

function moTaKhoi(n: PmNode): string {
  const tom = (s: string, max = 70) => {
    const t = s.replace(/\s+/g, ' ').trim();
    return t.length > max ? `${t.slice(0, max)}…` : t;
  };
  const a = n.attrs ?? {};
  switch (n.type) {
    case 'codeBlock': return `khối code${a.language ? ` (${String(a.language)})` : ''}: ${tom(chuCuaNut(n))}`;
    case 'table': return `bảng: ${tom(chuCuaNut(n))}`;
    case 'taskList': return `checklist: ${tom(chuCuaNut(n))}`;
    case 'image': return `ảnh${a.alt ? `: ${tom(String(a.alt))}` : ''}`;
    case 'media': return `${a.kind === 'video' ? 'video' : 'tệp đính kèm'}${a.name ? `: ${tom(String(a.name))}` : ''}`;
    case 'bookmark': return `thẻ liên kết: ${tom(String(a.title || a.url || ''))}`;
    case 'embed': return `khối nhúng: ${tom(String(a.src ?? ''))}`;
    case 'callout': return `callout: ${tom(chuCuaNut(n))}`;
    case 'toggle': return `khối thu gọn: ${tom(chuCuaNut(n))}`;
    case 'math': return `công thức: ${tom(chuCuaNut(n))}`;
    case 'databaseBlock': case 'database-block': return 'bảng dữ liệu nhúng';
    default: return `khối ${n.type}${chuCuaNut(n).trim() ? `: ${tom(chuCuaNut(n))}` : ''}`;
  }
}

/** Khối này AI có được đụng vào không (đệ quy xuống cả cây). */
function laKhoiDonGian(n: PmNode): boolean {
  if (n.type === 'horizontalRule') return true;
  if (KHOI_CHU.has(n.type)) return true; // con nội dòng lạ ⇒ mã giữ chỗ nội dòng
  if (KHOI_CHUA.has(n.type)) return (n.content ?? []).every(laKhoiDonGian);
  return false;
}

function boc(text: string, trai: string, phai = trai): string {
  // Markdown không nhận `** chữ**` — dời khoảng trắng hai đầu ra ngoài dấu.
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text)!;
  if (!m[2]) return text;
  return `${m[1]}${trai}${m[2]}${phai}${m[3]}`;
}

export function docToMarkdown(doc: PmNode): BanDi {
  const khoi = new Map<string, PmNode>();
  const noiDong = new Map<string, PmNode>();
  const chuGiai: string[] = [];
  const lienKet: string[] = [];
  const chu: string[] = [];

  const giuKhoi = (n: PmNode): string => {
    const id = `K${khoi.size + 1}`;
    khoi.set(id, n);
    chuGiai.push(`⟦${id}⟧ = ${moTaKhoi(n)}`);
    return `⟦${id}⟧`;
  };
  const giuNoiDong = (n: PmNode): string => {
    const id = `N${noiDong.size + 1}`;
    noiDong.set(id, n);
    return `⟦${id}⟧`;
  };

  const noiDongMd = (content: PmNode[] | undefined): string => {
    let out = '';
    for (const n of content ?? []) {
      if (n.type === 'hardBreak') { out += '\n'; continue; }
      if (n.type !== 'text') { out += giuNoiDong(n); continue; }
      const marks = n.marks ?? [];
      if (marks.some((m) => !DAU_BIET.has(m.type))) { out += giuNoiDong(n); continue; }
      let t = n.text ?? '';
      chu.push(t);
      const co = (k: string) => marks.find((m) => m.type === k);
      if (co('code')) t = t.includes('`') ? `\`\` ${t} \`\`` : `\`${t}\``;
      if (co('strike')) t = boc(t, '~~');
      if (co('italic')) t = boc(t, '*');
      if (co('bold')) t = boc(t, '**');
      const link = co('link');
      if (link) {
        const href = String(link.attrs?.href ?? '');
        if (href) { lienKet.push(href); t = /[\s()<>]/.test(href) ? `[${t}](<${href}>)` : `[${t}](${href})`; }
      }
      out += t;
    }
    return out;
  };

  const thutLe = (s: string, pad: string) => s.split('\n').map((l, i) => (i === 0 || !l ? l : pad + l)).join('\n');

  const khoiMd = (n: PmNode): string => {
    switch (n.type) {
      case 'paragraph': return noiDongMd(n.content);
      case 'heading': {
        const lv = Math.min(3, Math.max(1, Number(n.attrs?.level) || 2));
        return `${'#'.repeat(lv)} ${noiDongMd(n.content).replace(/\n/g, ' ')}`;
      }
      case 'horizontalRule': return '---';
      case 'blockquote':
        return (n.content ?? []).map(khoiMd).filter((s) => s.trim()).join('\n\n')
          .split('\n').map((l) => (l ? `> ${l}` : '>')).join('\n');
      case 'bulletList':
      case 'orderedList': {
        const start = Number(n.attrs?.start) || 1;
        return (n.content ?? []).map((item, i) => {
          const dau = n.type === 'orderedList' ? `${start + i}. ` : '- ';
          const pad = ' '.repeat(dau.length);
          const than = (item.content ?? []).map(khoiMd).filter((s) => s.trim()).join('\n');
          return dau + thutLe(than, pad);
        }).join('\n');
      }
      default: return giuKhoi(n);
    }
  };

  const phan: string[] = [];
  for (const n of doc.content ?? []) {
    const md = laKhoiDonGian(n) ? khoiMd(n) : giuKhoi(n);
    if (md.trim()) phan.push(md); // đoạn trống chỉ là khoảng cách, không phải ý
  }
  return { markdown: phan.join('\n\n'), khoi, noiDong, chuGiai, lienKet, chuThuan: chu.join(' ') };
}

// ─── Chiều về: Markdown của AI → TipTap JSON ────────────────────────

const MA_GIU_CHO = /⟦([KN])(\d+)⟧/g;

function boThoatHtml(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

const HREF_HOP_LE = /^(https?:|mailto:)/i;

interface NguCanhVe {
  khoi: Map<string, PmNode>;
  noiDong: Map<string, PmNode>;
  /** href được phép (có trong bản gốc — dạng liên kết hoặc chữ URL trần). */
  hrefDuocPhep: (href: string) => boolean;
  daDungKhoi: Set<string>;
  daDungNoiDong: Set<string>;
  canhBao: string[];
  hrefBiGo: string[];
  khoiTrung: number;
}

/** Nút tạm: một khối giữ chỗ nằm giữa dòng chữ — sẽ được tách ra khỏi đoạn. */
const KHOI_TAM = '__khoi__';

function themDau(marks: PmMark[], m: PmMark): PmMark[] {
  if (marks.some((x) => x.type === m.type)) return marks;
  return [...marks, m];
}

function nutChu(text: string, marks: PmMark[]): PmNode[] {
  if (!text) return [];
  // Code loại trừ mọi dấu khác trong TipTap — giữ đúng luật đó để JSON hợp lệ.
  const mk = marks.some((m) => m.type === 'code') ? [{ type: 'code' }] : marks;
  return [{ type: 'text', text, ...(mk.length ? { marks: mk } : {}) }];
}

function chuVoiMaGiuCho(raw: string, marks: PmMark[], ctx: NguCanhVe): PmNode[] {
  const out: PmNode[] = [];
  const dong = raw.split('\n');
  dong.forEach((line, i) => {
    if (i > 0) out.push({ type: 'hardBreak' });
    let last = 0;
    for (const m of line.matchAll(MA_GIU_CHO)) {
      out.push(...nutChu(line.slice(last, m.index), marks));
      last = (m.index ?? 0) + m[0].length;
      const id = `${m[1]}${m[2]}`;
      if (m[1] === 'K') {
        if (!ctx.khoi.has(id)) continue;                 // mã bịa ⇒ bỏ
        if (ctx.daDungKhoi.has(id)) { ctx.khoiTrung++; continue; }
        ctx.daDungKhoi.add(id);
        out.push({ type: KHOI_TAM, attrs: { id } });
      } else {
        const goc = ctx.noiDong.get(id);
        if (!goc || ctx.daDungNoiDong.has(id)) continue;
        ctx.daDungNoiDong.add(id);
        out.push(goc);
      }
    }
    out.push(...nutChu(line.slice(last), marks));
  });
  return out;
}

function noiDongVe(tokens: Token[] | undefined, marks: PmMark[], ctx: NguCanhVe): PmNode[] {
  const out: PmNode[] = [];
  for (const t of tokens ?? []) {
    switch (t.type) {
      case 'text': {
        const tt = t as Tokens.Text;
        if (tt.tokens?.length) out.push(...noiDongVe(tt.tokens, marks, ctx));
        else out.push(...chuVoiMaGiuCho(boThoatHtml(tt.text), marks, ctx));
        break;
      }
      case 'escape': out.push(...chuVoiMaGiuCho((t as Tokens.Escape).text, marks, ctx)); break;
      case 'strong': out.push(...noiDongVe((t as Tokens.Strong).tokens, themDau(marks, { type: 'bold' }), ctx)); break;
      case 'em': out.push(...noiDongVe((t as Tokens.Em).tokens, themDau(marks, { type: 'italic' }), ctx)); break;
      case 'del': out.push(...noiDongVe((t as Tokens.Del).tokens, themDau(marks, { type: 'strike' }), ctx)); break;
      case 'codespan': {
        out.push(...nutChu(boThoatHtml((t as Tokens.Codespan).text), [{ type: 'code' }]));
        break;
      }
      case 'br': out.push({ type: 'hardBreak' }); break;
      case 'link': {
        const lt = t as Tokens.Link;
        const href = boThoatHtml(lt.href ?? '');
        if (HREF_HOP_LE.test(href) && ctx.hrefDuocPhep(href)) {
          out.push(...noiDongVe(lt.tokens, themDau(marks, { type: 'link', attrs: { href } }), ctx));
        } else {
          if (href) ctx.hrefBiGo.push(href);
          out.push(...noiDongVe(lt.tokens, marks, ctx));
        }
        break;
      }
      case 'image': {
        // Ảnh thật luôn đi bằng mã giữ chỗ. Ảnh AI tự viết ra là ảnh bịa ⇒ chỉ giữ chữ mô tả.
        const alt = (t as Tokens.Image).text;
        if (alt) out.push(...nutChu(alt, marks));
        break;
      }
      case 'html': {
        const raw = (t as Tokens.HTML).text;
        if (/^<br\s*\/?>$/i.test(raw.trim())) out.push({ type: 'hardBreak' });
        else out.push(...chuVoiMaGiuCho(raw, marks, ctx));
        break;
      }
      default: {
        const raw = (t as { text?: string }).text;
        if (raw) out.push(...chuVoiMaGiuCho(boThoatHtml(raw), marks, ctx));
      }
    }
  }
  return out;
}

/** Tách một dãy nội dòng thành các khối: đoạn chữ xen khối giữ chỗ. */
function tachDoan(inl: PmNode[], taoDoan: (c: PmNode[]) => PmNode, ctx: NguCanhVe): PmNode[] {
  const out: PmNode[] = [];
  let buf: PmNode[] = [];
  const xa = () => {
    // Bỏ hardBreak thừa hai đầu — chúng là dấu xuống dòng quanh mã giữ chỗ.
    while (buf[0]?.type === 'hardBreak') buf.shift();
    while (buf[buf.length - 1]?.type === 'hardBreak') buf.pop();
    const coChu = buf.some((n) => n.type !== 'text' || (n.text ?? '').trim());
    if (coChu) out.push(taoDoan(buf));
    buf = [];
  };
  for (const n of inl) {
    if (n.type === KHOI_TAM) {
      xa();
      out.push(ctx.khoi.get(String(n.attrs?.id))!);
    } else buf.push(n);
  }
  xa();
  return out;
}

function khoiVe(tokens: Token[], ctx: NguCanhVe): PmNode[] {
  const out: PmNode[] = [];
  for (const t of tokens) {
    switch (t.type) {
      case 'space': case 'def': break;
      case 'heading': {
        const h = t as Tokens.Heading;
        const level = Math.min(3, Math.max(1, h.depth));
        out.push(...tachDoan(noiDongVe(h.tokens, [], ctx),
          (c) => ({ type: 'heading', attrs: { level }, content: c.filter((n) => n.type !== 'hardBreak') }), ctx));
        break;
      }
      case 'paragraph':
        out.push(...tachDoan(noiDongVe((t as Tokens.Paragraph).tokens, [], ctx), (c) => ({ type: 'paragraph', content: c }), ctx));
        break;
      case 'text': {
        const tt = t as Tokens.Text;
        const inl = tt.tokens?.length ? noiDongVe(tt.tokens, [], ctx) : chuVoiMaGiuCho(boThoatHtml(tt.text), [], ctx);
        out.push(...tachDoan(inl, (c) => ({ type: 'paragraph', content: c }), ctx));
        break;
      }
      case 'code': {
        const c = t as Tokens.Code;
        const text = c.text.replace(/\n+$/, '');
        // Mã giữ chỗ lọt vào trong khối code thì đó vẫn là khối gốc — đưa nó ra ngoài.
        const chiMa = /^\s*(⟦K\d+⟧\s*)+$/.test(text);
        if (chiMa) { out.push(...tachDoan(chuVoiMaGiuCho(text, [], ctx), (x) => ({ type: 'paragraph', content: x }), ctx)); break; }
        out.push({ type: 'codeBlock', attrs: { language: chuanNgonNgu(c.lang) }, ...(text ? { content: [{ type: 'text', text }] } : {}) });
        break;
      }
      case 'blockquote': {
        const inner = khoiVe((t as Tokens.Blockquote).tokens, ctx);
        if (inner.length) out.push({ type: 'blockquote', content: inner });
        break;
      }
      case 'hr': out.push({ type: 'horizontalRule' }); break;
      case 'list': {
        const l = t as Tokens.List;
        const laTask = l.items.length > 0 && l.items.every((it) => it.task);
        const items: PmNode[] = l.items.map((it) => {
          // `checkbox` là token ảo marked chèn vào đầu mục task — không phải chữ.
          const con = khoiVe(it.tokens.filter((x) => x.type !== 'checkbox'), ctx);
          if (con[0]?.type !== 'paragraph') con.unshift({ type: 'paragraph' });
          return laTask
            ? { type: 'taskItem', attrs: { checked: !!it.checked }, content: con }
            : { type: 'listItem', content: con };
        });
        if (!items.length) break;
        if (laTask) out.push({ type: 'taskList', content: items });
        else if (l.ordered) out.push({ type: 'orderedList', attrs: { start: Number(l.start) || 1 }, content: items });
        else out.push({ type: 'bulletList', content: items });
        break;
      }
      case 'table': {
        const tb = t as Tokens.Table;
        const o = (cell: Tokens.TableCell, type: 'tableHeader' | 'tableCell'): PmNode => {
          const blocks = tachDoan(noiDongVe(cell.tokens, [], ctx), (c) => ({ type: 'paragraph', content: c }), ctx);
          return { type, content: blocks.length ? blocks : [{ type: 'paragraph' }] };
        };
        const rows: PmNode[] = [
          { type: 'tableRow', content: tb.header.map((c) => o(c, 'tableHeader')) },
          ...tb.rows.map((r) => ({ type: 'tableRow', content: r.map((c) => o(c, 'tableCell')) })),
        ];
        out.push({ type: 'table', content: rows });
        break;
      }
      case 'html': {
        const raw = (t as Tokens.HTML).text.trim();
        if (raw && !/^<br\s*\/?>$/i.test(raw)) out.push(...tachDoan(chuVoiMaGiuCho(raw, [], ctx), (c) => ({ type: 'paragraph', content: c }), ctx));
        break;
      }
      default: {
        const raw = (t as { text?: string }).text;
        if (raw?.trim()) out.push(...tachDoan(chuVoiMaGiuCho(boThoatHtml(raw), [], ctx), (c) => ({ type: 'paragraph', content: c }), ctx));
      }
    }
  }
  return out;
}

/**
 * Markdown → danh sách nút khối TipTap, không có mã giữ chỗ nào.
 * Dùng cho menu AI trên đoạn bôi đen (bảng, checklist, sổ lệnh…).
 */
export function markdownThanhNut(md: string, hrefDuocPhep: (href: string) => boolean): PmNode[] {
  const ctx: NguCanhVe = {
    khoi: new Map(), noiDong: new Map(), hrefDuocPhep,
    daDungKhoi: new Set(), daDungNoiDong: new Set(), canhBao: [], hrefBiGo: [], khoiTrung: 0,
  };
  return khoiVe(Lexer.lex(md, { gfm: true }), ctx);
}

// ─── Luật cứng + thống kê ───────────────────────────────────────────

/** Bỏ dấu + thường hoá: "dong goi" phải khớp "đóng gói" (AI sửa dấu là việc được phép). */
export function boDau(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/**
 * Hư từ — sắp xếp lại câu thì chúng rụng/đổi là chuyện bình thường ("xong … rồi"
 * thành danh sách bước). Tính cả chúng thì cảnh báo "mất chữ" kêu ở mọi trang và
 * người dùng học cách lờ nó đi — đúng lúc nó kêu thật (mất "trong thư mục") thì
 * không ai đọc nữa.
 */
const HU_TU = new Set([
  'la', 'va', 'thi', 'ma', 'de', 'cua', 'cho', 'voi', 'con', 'nhung', 'khi', 'dc', 'duoc',
  'nay', 'do', 'se', 'da', 'dang', 'co', 'khong', 'ko', 'cac', 'mot', 'roi', 'xong', 'muon',
  'can', 'phai', 'nen', 'hay', 'hoac', 'vi', 'nen', 'neu', 'thi', 'ra', 'vao', 'len', 'tu',
  've', 'di', 'lai', 'nhe', 'nha', 'a', 'oi', 'ay', 'kia', 'the', 'vay', 'nhu', 'cung', 'deu',
  'the', 'an', 'of', 'to', 'in', 'on', 'is', 'are', 'and', 'or', 'it', 'be', 'as', 'at',
]);

function tuCua(s: string): string[] {
  return boDau(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 2 && !HU_TU.has(w));
}

function soCua(s: string): string[] {
  return [...s.matchAll(/\d+(?:[.,]\d+)*/g)].map((m) => m[0].replace(/[.,]/g, ''));
}

function duyet(n: PmNode, f: (n: PmNode) => void): void {
  f(n);
  for (const c of n.content ?? []) duyet(c, f);
}

export interface ThongKe {
  muc: number;
  khoiCode: number;
  dongLenh: number;
  bang: number;
  lienKet: number;
}

export function demThongKe(nodes: PmNode[]): ThongKe {
  const tk: ThongKe = { muc: 0, khoiCode: 0, dongLenh: 0, bang: 0, lienKet: 0 };
  const hrefs = new Set<string>();
  for (const root of nodes) {
    duyet(root, (n) => {
      if (n.type === 'heading') tk.muc++;
      if (n.type === 'table') tk.bang++;
      if (n.type === 'codeBlock') {
        tk.khoiCode++;
        if (n.attrs?.language === 'bash') {
          tk.dongLenh += chuCuaNut(n).split('\n').filter((l) => l.trim() && !l.trim().startsWith('#')).length;
        }
      }
      for (const m of n.marks ?? []) if (m.type === 'link' && m.attrs?.href) hrefs.add(String(m.attrs.href));
    });
  }
  tk.lienKet = hrefs.size;
  return tk;
}

export function cauThongKe(tk: ThongKe): string {
  const p: string[] = [];
  if (tk.muc) p.push(`${tk.muc} mục`);
  if (tk.khoiCode) p.push(`${tk.khoiCode} khối code${tk.dongLenh ? ` (${tk.dongLenh} dòng lệnh)` : ''}`);
  if (tk.bang) p.push(`${tk.bang} bảng`);
  if (tk.lienKet) p.push(`${tk.lienKet} liên kết`);
  return p.join(' · ');
}

const TIEU_DE_TOM_TAT = new Set(['tom tat', 'summary', 'tong quan', 'tldr', 'tl;dr']);

export interface KetQuaSapXep {
  doc: PmNode;
  canhBao: string[];
  thongKe: ThongKe;
  /** Tỉ lệ từ của bản gốc còn thấy trong bản mới (0–1). */
  doPhu: number;
}

export interface TuyChonRap {
  /** Chữ thuần của phần AI được sửa trong bản gốc — để so từ & số. */
  chuGoc: string;
}

/**
 * Ráp Markdown AI trả về thành doc TipTap + áp mọi luật cứng.
 * Ném `BadRequestError` khi kết quả không thể dùng (rỗng, mất quá nhiều chữ).
 */
export function rapKetQua(markdownAi: string, di: BanDi, opts: TuyChonRap): KetQuaSapXep {
  let md = markdownAi.trim();
  // Model hay bọc cả bài trong ```markdown … ``` dù đã dặn không.
  const rao = /^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i.exec(md);
  if (rao) md = rao[1].trim();
  if (!md) throw new BadRequestError('AI trả về rỗng — trang giữ nguyên. Thử lại sau ít phút.', 'AI_EMPTY');

  // Chữ thuần được phép có liên kết: href gốc + URL trần có trong chữ gốc.
  const hrefGoc = new Set(di.lienKet);
  const chuGoc = opts.chuGoc;
  const ctx: NguCanhVe = {
    khoi: di.khoi,
    noiDong: di.noiDong,
    hrefDuocPhep: (h) => hrefGoc.has(h) || chuGoc.includes(h),
    daDungKhoi: new Set(),
    daDungNoiDong: new Set(),
    canhBao: [],
    hrefBiGo: [],
    khoiTrung: 0,
  };

  let nodes = khoiVe(Lexer.lex(md, { gfm: true }), ctx);

  // Tách khối Tóm tắt (nếu có) ra để gói vào callout ở đầu trang.
  let tomTat: PmNode[] = [];
  if (nodes[0]?.type === 'heading' && TIEU_DE_TOM_TAT.has(boDau(chuCuaNut(nodes[0])).replace(/[^a-z; ]/g, '').trim())) {
    let i = 1;
    while (i < nodes.length && nodes[i].type !== 'heading') i++;
    // Khối gốc (mã giữ chỗ) lỡ nằm trong phần tóm tắt thì trả nó về thân trang.
    const phanTom = nodes.slice(1, i);
    tomTat = phanTom.filter((n) => ![...di.khoi.values()].includes(n));
    nodes = [...phanTom.filter((n) => [...di.khoi.values()].includes(n)), ...nodes.slice(i)];
  }

  // ── Luật: khối gốc bị rơi ⇒ gắn lại cuối trang
  const roiKhoi = [...di.khoi.keys()].filter((id) => !ctx.daDungKhoi.has(id));
  if (roiKhoi.length) {
    nodes.push(...roiKhoi.map((id) => di.khoi.get(id)!));
    ctx.canhBao.push(`AI làm rơi ${roiKhoi.length} khối (ảnh/bảng/code…) — đã gắn lại nguyên vẹn ở cuối trang.`);
  }
  if (ctx.khoiTrung) ctx.canhBao.push(`AI lặp lại ${ctx.khoiTrung} khối — đã bỏ bản lặp, giữ một bản.`);
  const roiNoiDong = [...di.noiDong.keys()].filter((id) => !ctx.daDungNoiDong.has(id));
  if (roiNoiDong.length) {
    nodes.push({ type: 'paragraph', content: roiNoiDong.flatMap((id, i) => (i ? [{ type: 'text', text: ' ' }, di.noiDong.get(id)!] : [di.noiDong.get(id)!])) });
    ctx.canhBao.push(`AI làm rơi ${roiNoiDong.length} mẩu định dạng đặc biệt (công thức…) — đã gắn lại cuối trang.`);
  }

  // ── Luật: liên kết
  if (ctx.hrefBiGo.length) {
    ctx.canhBao.push(`Đã gỡ ${ctx.hrefBiGo.length} liên kết không có trong bản gốc: ${[...new Set(ctx.hrefBiGo)].slice(0, 3).join(', ')}`);
  }
  const hrefMoi = new Set<string>();
  for (const n of [...nodes, ...tomTat]) duyet(n, (x) => { for (const m of x.marks ?? []) if (m.type === 'link') hrefMoi.add(String(m.attrs?.href)); });
  // Liên kết nằm trong khối gốc vẫn còn nguyên — chỉ xét liên kết của phần AI được sửa.
  const roiLink = [...hrefGoc].filter((h) => !hrefMoi.has(h));
  if (roiLink.length) {
    nodes.push({
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Liên kết giữ lại: ', marks: [{ type: 'bold' }] },
        ...roiLink.flatMap((h, i) => [
          ...(i ? [{ type: 'text', text: ' · ' }] : []),
          { type: 'text', text: h, marks: [{ type: 'link', attrs: { href: h } }] },
        ]),
      ],
    });
    ctx.canhBao.push(`AI làm rơi ${roiLink.length} liên kết — đã gắn lại ở cuối trang.`);
  }

  // ── Luật: rỗng / mất chữ
  // Chỉ chữ AI viết ra — chữ trong khối/nút gốc cắm lại không tính (nó không đổi,
  // và đếm vào thì "E=mc^2" trong công thức gốc bị báo là "số liệu mới").
  const goc = new Set<PmNode>([...di.khoi.values(), ...di.noiDong.values()]);
  const chuAi = (n: PmNode): string => (goc.has(n) ? ' ' : n.type === 'text' ? (n.text ?? '') : (n.content ?? []).map(chuAi).join(' '));
  const chuMoi = [...tomTat, ...nodes].map(chuAi).join(' ');
  const chuThan = nodes.map(chuAi).join(' ');
  const tuGoc = [...new Set(tuCua(chuGoc))];
  const tuMoi = new Set(tuCua(chuMoi));
  const doPhu = tuGoc.length ? tuGoc.filter((w) => tuMoi.has(w)).length / tuGoc.length : 1;
  if (!chuThan.trim()) {
    throw new BadRequestError('AI trả về rỗng — trang giữ nguyên. Thử lại sau ít phút.', 'AI_EMPTY');
  }
  if (tuGoc.length >= 15 && doPhu < 0.5) {
    throw new BadRequestError(
      `AI làm mất quá nhiều nội dung (chỉ còn ${Math.round(doPhu * 100)}% từ của bản gốc) — đã bỏ kết quả, trang giữ nguyên.`,
      'AI_LOST_CONTENT',
    );
  }
  if (tuGoc.length >= 15 && doPhu < 0.85) {
    const mat = tuGoc.filter((w) => !tuMoi.has(w)).slice(0, 8);
    ctx.canhBao.push(`Bản mới chỉ còn ${Math.round(doPhu * 100)}% từ của bản gốc — kiểm lại xem có mất ý không (vd: ${mat.join(', ')}).`);
  }

  // ── Luật: số liệu mới (không tính số trong khối gốc — chúng không đổi)
  const soGoc = new Set(soCua(chuGoc));
  const soLa = [...new Set(soCua(chuMoi))].filter((s) => !soGoc.has(s));
  if (soLa.length) ctx.canhBao.push(`Có số không thấy trong bản gốc: ${soLa.slice(0, 6).join(', ')} — kiểm lại trước khi giữ.`);

  // ── Tóm tắt + thống kê (MÃ đếm)
  const thongKe = demThongKe(nodes);
  const cau = cauThongKe(thongKe);
  const khoiDau: PmNode[] = [];
  if (tomTat.length || cau) {
    khoiDau.push({
      type: 'callout',
      attrs: { kind: 'tip' },
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Tóm tắt', marks: [{ type: 'bold' }] }] },
        ...tomTat,
        ...(cau ? [{ type: 'paragraph', content: [{ type: 'text', text: `📊 ${cau}`, marks: [{ type: 'italic' }] }] }] : []),
      ],
    });
  }

  const content = [...khoiDau, ...nodes];
  return {
    doc: { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] },
    canhBao: ctx.canhBao,
    thongKe,
    doPhu,
  };
}

// ─── Prompt ─────────────────────────────────────────────────────────

export const SYSTEM_SAP_XEP = `Bạn là người BIÊN TẬP ghi chú học tập. Bạn nhận một trang ghi chú viết vội (dạng Markdown) và trả về CHÍNH NỘI DUNG ĐÓ được sắp xếp lại cho dễ đọc.

VIỆC PHẢI LÀM
1. Sửa chính tả, bỏ/thêm dấu tiếng Việt cho đúng ("hom nay hoc" → "Hôm nay học"), viết hoa đầu câu và tên riêng (Docker, PostgreSQL, GitHub…), ngắt câu và xuống dòng hợp lý.
2. Gom các ý cùng chủ đề thành mục có tiêu đề "## " (mục lớn) và "### " (mục con). Tiêu đề ngắn, lấy từ chính nội dung. KHÔNG đánh số vào tiêu đề.
3. Danh sách: gạch đầu dòng "- " cho ý rời, "1. " cho các bước có thứ tự. Thụt lề danh sách con 2 dấu cách.
4. Chỗ SO SÁNH hoặc liệt kê nhiều thứ có cùng thuộc tính (A vs B, lệnh – tác dụng, khái niệm – ý nghĩa) → BẢNG Markdown.
5. Quy trình / luồng làm việc → danh sách đánh số "1. 2. 3." (có thể dùng "→" trong một bước). Không dùng mermaid.
6. Lệnh terminal, đoạn code, đường dẫn tệp nằm lẫn trong câu → tách ra khối code có ngôn ngữ đúng (\`\`\`bash, \`\`\`sql, \`\`\`python, \`\`\`javascript, \`\`\`typescript, \`\`\`json, \`\`\`yaml, \`\`\`java…). Lời giải thích để NGOÀI khối code, khối code chỉ chứa lệnh/code. Tên lệnh ngắn trong câu thì dùng \`inline code\`.
7. Mở đầu bằng mục "## Tóm tắt" gồm 2–4 gạch đầu dòng nói trang này có gì. Tóm tắt chỉ được nói lại ý ĐÃ CÓ, không kết luận thêm. Không tự đếm số mục/số lệnh (hệ thống sẽ tự đếm).

LUẬT CỨNG — vi phạm là hỏng việc
- KHÔNG thêm ý, sự kiện, giải thích, ví dụ, số liệu hay liên kết nào không có trong bản gốc. Không "bổ sung cho đầy đủ".
- KHÔNG xoá ý nào của người viết, kể cả ý lặp hay ý dở dang (ý lặp thì gộp lại, không bỏ).
- GIỮ NGUYÊN ngôn ngữ người viết dùng: viết tiếng Việt thì trả tiếng Việt, câu tiếng Anh thì để tiếng Anh. Không dịch.
- Lệnh và code giữ NGUYÊN từng ký tự (kể cả khi trông như sai chính tả): chỉ sửa chữ thường, không sửa code.
- Liên kết [chữ](url) giữ nguyên url.
- Các mã dạng ⟦K1⟧, ⟦K2⟧… là khối đặc biệt (ảnh, video, bảng, code, công thức…) — mỗi mã phải xuất hiện ĐÚNG MỘT LẦN, đứng MỘT MÌNH trên một dòng, KHÔNG sửa, KHÔNG bọc trong khối code. Bạn được dời mã sang mục phù hợp.
- Các mã dạng ⟦N1⟧, ⟦N2⟧… nằm giữa câu: giữ nguyên tại chỗ trong câu tương ứng.

ĐẦU RA: CHỈ trả về Markdown của trang đã sắp xếp. Không lời dẫn, không giải thích, không bọc cả bài trong \`\`\`.

VÍ DỤ
Bản gốc:
hom nay hoc docker. docker la cong cu dong goi app chay dc moi noi
chay docker ps de xem container dang chay con docker images de xem image
image vs container: image la khuon chi doc, container la ban chay cua image co the ghi
cach lam: viet Dockerfile roi docker build -t app . xong docker run -p 3000:3000 app
⟦K1⟧
tai lieu https://docs.docker.com

Kết quả:
## Tóm tắt
- Docker là công cụ đóng gói ứng dụng để chạy được mọi nơi.
- Các lệnh xem container và image.
- Khác nhau giữa image và container, và các bước build – run.

## Docker là gì
Hôm nay học Docker. Docker là công cụ đóng gói app, chạy được mọi nơi.

## Lệnh xem trạng thái
| Lệnh | Tác dụng |
|---|---|
| \`docker ps\` | Xem container đang chạy |
| \`docker images\` | Xem image |

## Image và container
| | Image | Container |
|---|---|---|
| Bản chất | Khuôn | Bản chạy của image |
| Ghi được không | Chỉ đọc | Có thể ghi |

## Các bước build và chạy
1. Viết Dockerfile.
2. Build image:
   \`\`\`bash
   docker build -t app .
   \`\`\`
3. Chạy container:
   \`\`\`bash
   docker run -p 3000:3000 app
   \`\`\`

⟦K1⟧

## Tài liệu
- https://docs.docker.com`;

export function dungLoiNhac(di: BanDi): string {
  const chuGiai = di.chuGiai.length
    ? `\n\nCHÚ GIẢI MÃ KHỐI (chỉ để bạn biết mỗi mã là gì, KHÔNG chép phần này vào kết quả):\n${di.chuGiai.join('\n')}`
    : '';
  return `Sắp xếp lại trang ghi chú dưới đây theo đúng các yêu cầu.${chuGiai}\n\n===== TRANG GHI CHÚ =====\n${di.markdown}\n===== HẾT =====`;
}

// ─── Điểm vào ───────────────────────────────────────────────────────

export interface KetQuaTraVe {
  doc: PmNode;
  canhBao: string[];
  thongKe: ThongKe;
  doPhu: number;
  soKyTuVao: number;
}

function laDoc(v: unknown): v is PmNode {
  return !!v && typeof v === 'object' && (v as PmNode).type === 'doc' && Array.isArray((v as PmNode).content ?? []);
}

/**
 * Sắp xếp lại một trang. `doc` là JSON hiện tại TRONG EDITOR (không đọc từ DB):
 * ở chế độ cộng tác, bản trong DB có thể trễ vài giây so với Y.Doc đang mở.
 * `noteId` dùng để kiểm quyền SỬA — người chỉ được xem không được nhờ AI viết đè.
 */
export async function sapXepTrangGhiChu(
  userId: number,
  noteId: unknown,
  doc: unknown,
  onProgress?: (kyTu: number) => void,
): Promise<KetQuaTraVe> {
  const id = Number(noteId);
  if (!Number.isInteger(id) || id <= 0) throw new BadRequestError('Thiếu noteId');
  if (!laDoc(doc)) throw new BadRequestError('Nội dung trang không hợp lệ');

  const { resolveNoteAccess, canEditSharedNote } = await import('./notesShare.service.js');
  const access = await resolveNoteAccess(userId, id);
  if (!canEditSharedNote(access.permission)) throw new AppError('Bạn chỉ có quyền xem trang này', 403, 'READ_ONLY');

  const di = docToMarkdown(doc);
  const chuGoc = di.chuThuan;
  if (!chuGoc.trim()) throw new BadRequestError('Trang chưa có chữ nào để sắp xếp.', 'EMPTY_PAGE');
  if (di.markdown.length > MAX_INPUT_CHARS) {
    throw new BadRequestError(
      `Trang dài ${di.markdown.length.toLocaleString('vi-VN')} ký tự, tối đa ${MAX_INPUT_CHARS.toLocaleString('vi-VN')}. `
      + 'Tách trang thành hai trang nhỏ, hoặc bôi đen từng phần rồi dùng menu AI.',
      'PAGE_TOO_LONG',
    );
  }

  if (!isAiAvailable()) throw new BadRequestError('Tính năng AI chưa được cấu hình hoặc đang tạm ngắt.', 'AI_UNAVAILABLE');
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.', 429, 'QUOTA_EXCEEDED');
  }

  let daNhan = 0;
  let res: { text?: unknown };
  try {
    res = await llmComplete({
      step: 'generation',
      feature: 'notes',
      purpose: 'note_format',
      system: SYSTEM_SAP_XEP,
      messages: [{ role: 'user', content: dungLoiNhac(di) }],
      // Đầu ra ≈ đầu vào + bảng/tiêu đề/tóm tắt. Tiếng Việt ~2,5 ký tự/token.
      maxTokens: Math.min(14_000, Math.max(1_500, Math.ceil(di.markdown.length * 0.8) + 1_200)),
      maxRetries: 1,
      timeoutMs: 180_000,
      userId,
      onToken: onProgress ? (d: string) => { daNhan += d.length; onProgress(daNhan); } : undefined,
    } as never);
  } catch (e) {
    const err = e as { message?: string; statusCode?: number; code?: string };
    // Lỗi có mã 4xx (hết ngân sách…) đi thẳng — câu của nó đã viết cho người đọc.
    if (err.statusCode && err.statusCode < 500) throw e;
    // Còn lại: nói đúng lỗi gì (hết giờ, HTTP mấy), đừng gộp thành một câu cố định.
    // 424 < 500 nên errorHandler không thay câu này bằng "Internal Server Error".
    throw new AppError(`AI chưa sắp xếp được trang: ${String(err.message ?? e).slice(0, 200)}`, 424, 'AI_FAILED');
  }

  const kq = rapKetQua(String(res.text ?? ''), di, { chuGoc });
  return { ...kq, soKyTuVao: di.markdown.length };
}
