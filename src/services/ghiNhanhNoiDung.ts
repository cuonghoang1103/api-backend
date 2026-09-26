/**
 * Ghi nhanh — phần NỘI DUNG thuần (không đụng CSDL, nên test được không cần DB).
 * ────────────────────────────────────────────────────────────────────────────
 * Mọi thứ ghi vào `Note.contentJson` ở đây đều đi qua ĐÚNG MỘT đường:
 *
 *     markdown ──marked──▶ HTML ──generateJSON(noteRealtimeExtensions)──▶ JSON
 *                                                   JSON ──generateHTML──▶ contentHtml
 *
 * `noteRealtimeExtensions` là schema mà cổng cộng tác thời gian thực dùng để
 * nạp `contentJson` vào Yjs. Dựng JSON bằng CHÍNH schema đó nghĩa là:
 *   • thứ gì schema không biết (thẻ <script>, <iframe>, style lạ…) bị bỏ ngay
 *     lúc parse — đây cũng là lớp lọc HTML, không cần sanitize riêng;
 *   • ghi chú tạo ra ở đây mở được trong trình soạn thời gian thực.
 *
 * ⚠️ Schema đó KHÔNG có mark `link` (đo 26/09/2026: `toYdoc` ném "There is no
 * mark type link in this schema"). Nên ở đây KHÔNG BAO GIỜ sinh mark link —
 * đường dẫn về bài học được ghi thành chữ thường. `generateJSON` tự rơi mark
 * link khi nhập markdown (giữ chữ, mất href).
 */
import { generateHTML, generateJSON } from '@tiptap/html';
import { marked } from 'marked';
import type { JSONContent } from '@tiptap/core';
import { noteRealtimeExtensions } from './notesRealtimeSchema.js';

export type TiptapDoc = JSONContent & { type: 'doc'; content: JSONContent[] };

// ─── Chuyển đổi cơ bản ───────────────────────────────────────

/** HTML (bất kỳ) → JSON TipTap đúng schema Notes. Thứ ngoài schema bị bỏ. */
export function htmlToDoc(html: string): TiptapDoc {
  const json = generateJSON(html || '<p></p>', noteRealtimeExtensions) as TiptapDoc;
  if (!Array.isArray(json.content) || json.content.length === 0) {
    json.content = [{ type: 'paragraph' }];
  }
  // `marked` ghi ngôn ngữ vào class của <code>; codeBlock phía máy chủ không đọc
  // class đó. Gán lại theo THỨ TỰ xuất hiện — ProseMirror duyệt cây theo đúng
  // thứ tự tài liệu, cùng thứ tự với regex quét chuỗi HTML.
  const langs = [...html.matchAll(/<pre[^>]*>\s*<code(?:\s+class="([^"]*)")?/g)].map((m) => {
    const cls = m[1] ?? '';
    const found = /(?:^|\s)language-([\w+#.-]{1,30})/.exec(cls);
    return found ? found[1] : '';
  });
  let i = 0;
  walk(json, (n) => {
    if (n.type === 'codeBlock') {
      const lang = langs[i++] ?? '';
      n.attrs = { ...(n.attrs ?? {}), language: lang };
    }
  });
  return json;
}

/** JSON → HTML cache (`contentHtml`), cùng hàm cổng realtime dùng. */
export function docToHtml(doc: TiptapDoc): string {
  return generateHTML(doc, noteRealtimeExtensions);
}

/**
 * Markdown → HTML. `breaks: true` vì người dùng ghi nhanh gõ Enter là muốn
 * xuống dòng thật, không phải chờ một dòng trống.
 */
export function markdownToHtml(md: string): string {
  return marked.parse(md ?? '', { gfm: true, breaks: true, async: false }) as string;
}

export function markdownToDoc(md: string): TiptapDoc {
  return htmlToDoc(markdownToHtml(md));
}

export function walk(node: JSONContent, fn: (n: JSONContent, parent: JSONContent | null) => void, parent: JSONContent | null = null): void {
  fn(node, parent);
  for (const c of node.content ?? []) walk(c, fn, node);
}

/** Toàn bộ chữ trong một nút (nối các text node). */
export function nodeText(node: JSONContent | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.text ?? '';
  if (node.type === 'hardBreak') return '\n';
  const kids = node.content ?? [];
  // Con là khối (đoạn, dòng bảng…) thì nối bằng xuống dòng; con là chữ thì nối liền.
  const sep = kids.some((k) => k.type !== 'text' && k.type !== 'hardBreak' && k.type !== 'math') ? '\n' : '';
  return kids.map(nodeText).join(sep);
}

/** Tiêu đề từ markdown: dòng `# ...` đầu tiên, không có thì null. */
export function titleFromMarkdown(md: string): string | null {
  const m = /^\s{0,3}#\s+(.+?)\s*#*\s*$/m.exec(md);
  return m ? m[1].replace(/[*_`]/g, '').trim().slice(0, 300) || null : null;
}

// ─── Mẫu trang ───────────────────────────────────────────────

export type TemplateKey = 'ghi-chu-bai-hoc' | 'so-lenh' | 'nhat-ky-loi';

export interface NoteTemplate {
  key: TemplateKey;
  title: string;
  icon: string;
  description: string;
  /** HTML đúng schema Notes — frontend chèn thẳng bằng `insertContent`. */
  html: string;
}

// ─── Sổ lệnh ─────────────────────────────────────────────────
//
// Bố cục (26/09/2026, theo ảnh người dùng: bảng dẹt một cục, lệnh trùng,
// `mkdir` và `mkdir -p` nằm rời nhau):
//
//   ## 💻 Terminal                       ← mỗi NHÓM một tiêu đề + một bảng
//   | Lệnh  | Tuỳ chọn | Nghĩa | Ví dụ | Lỗi từng gặp |
//   | mkdir |          | tạo thư mục …                 |   ← dòng lệnh gốc
//   |  (gộp)| -p       | tạo cả chuỗi …                |   ← ô "Lệnh" gộp
//   |  (gộp)| -v       | in ra …                       |     (rowspan)
//
// Trang này do máy DỰNG LẠI mỗi lần thêm lệnh: đọc mọi dòng (cả bảng kiểu cũ
// 5 cột có cột "Nhóm"), gom theo nhóm → lệnh gốc → tuỳ chọn, gộp dòng trùng,
// rồi thay các bảng + tiêu đề nhóm cũ bằng bản mới. Chữ người dùng viết ở
// chỗ khác trên trang giữ nguyên. Dựng lại là idempotent: đọc bản vừa dựng
// rồi dựng tiếp ra đúng bản đó.

/** Tên cột của Sổ lệnh — nhận diện bảng bằng tên cột, không bằng vị trí. */
export const SO_LENH_COT = ['Lệnh', 'Tuỳ chọn', 'Nghĩa', 'Ví dụ', 'Lỗi từng gặp'] as const;
export const SO_LENH_NHOM = ['Terminal', 'Git', 'npm', 'HTML', 'CSS', 'JavaScript', 'SQL', 'Docker', 'Khác'] as const;
const NHOM_ICON: Record<string, string> = {
  Terminal: '💻', Git: '🌿', npm: '📦', HTML: '🧱', CSS: '🎨', JavaScript: '⚡', SQL: '🗄️', Docker: '🐳', Khác: '📌',
};

export interface DongLenh {
  /** Cả câu lệnh như người dùng gõ, vd `mkdir -p a/b` — tách gốc/tuỳ chọn bằng `tachLenh`. */
  lenh: string;
  nghia: string;
  viDu?: string;
  nhom?: string;
  loi?: string;
}

const VI_DU_SO_LENH: DongLenh[] = [
  { lenh: 'pwd', nghia: 'in ra thư mục đang đứng', viDu: 'pwd → /Users/cuong/hoc', nhom: 'Terminal' },
  { lenh: 'ls', nghia: 'liệt kê file trong thư mục', nhom: 'Terminal' },
  { lenh: 'ls -la', nghia: 'liệt kê mọi file, kể cả file ẩn, kèm chi tiết', viDu: 'ls -la ~/Downloads', nhom: 'Terminal' },
  { lenh: 'cd <thư-mục>', nghia: 'chuyển sang thư mục khác', viDu: 'cd ..  (lùi một cấp)', nhom: 'Terminal', loi: 'cd: no such file or directory — gõ sai tên, dùng Tab để tự điền' },
];

function chuanHoa(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
}

/** Công cụ có lệnh con: `git commit`, `npm run`… — lệnh gốc gồm 2 từ. */
const CONG_CU_CO_LENH_CON = new Set(['git', 'npm', 'npx', 'pnpm', 'yarn', 'docker', 'gh', 'brew', 'kubectl', 'prisma', 'systemctl', 'pip', 'pip3']);

export interface LenhDaTach {
  goc: string;
  /** Chữ hiện ở cột "Tuỳ chọn": cờ + chỗ điền kiểu `<tên>`; rỗng = dòng lệnh gốc. */
  tuyChon: string;
  /** Khoá gộp dòng trùng trong cùng một lệnh gốc. */
  khoa: string;
  /** Câu lệnh có đối số cụ thể (`a/b/c`) — bị bỏ khỏi cột Tuỳ chọn nên đẩy sang Ví dụ. */
  viDuTuLenh: string;
}

/**
 * `mkdir -p a/b/c` → gốc `mkdir`, tuỳ chọn `-p`, ví dụ `mkdir -p a/b/c`.
 * `mkdir -p <tên>` → gốc `mkdir`, tuỳ chọn `-p <tên>` (chỗ điền giữ lại), gộp cùng dòng trên.
 * `cd ..`          → gốc `cd`, tuỳ chọn `..` (không có cờ thì đối số CHÍNH là thứ đáng nhớ).
 */
export function tachLenh(lenh: string): LenhDaTach {
  const tu = lenh.trim().split(/\s+/).filter(Boolean);
  if (tu.length === 0) return { goc: '', tuyChon: '', khoa: '', viDuTuLenh: '' };
  let n = 1;
  if (CONG_CU_CO_LENH_CON.has(tu[0].toLowerCase()) && tu[1] && /^[a-z][\w:.-]*$/i.test(tu[1])) n = 2;
  const goc = tu.slice(0, n).join(' ');
  const con = tu.slice(n);
  const co = con.filter((t) => t.startsWith('-'));
  if (co.length === 0) {
    const tuyChon = con.join(' ');
    return { goc, tuyChon, khoa: tuyChon, viDuTuLenh: '' };
  }
  const choDien = (t: string) => /^<.*>$|^\[.*\]$|^\.\.\.$/.test(t);
  const hien = con.filter((t) => t.startsWith('-') || choDien(t));
  const coDoiSoThat = con.some((t) => !t.startsWith('-') && !choDien(t));
  return { goc, tuyChon: hien.join(' '), khoa: co.join(' '), viDuTuLenh: coDoiSoThat ? tu.join(' ') : '' };
}

/** Nhóm người dùng gõ → tên nhóm chuẩn (so không dấu, không hoa thường). */
function nhomChuan(nhom: string | undefined): string {
  const t = chuanHoa(nhom ?? '');
  if (!t) return 'Khác';
  return SO_LENH_NHOM.find((g) => chuanHoa(g) === t) ?? (nhom ?? '').trim();
}

/** Tiêu đề `## 💻 Terminal` → 'Terminal'; không phải tiêu đề nhóm thì null. */
function nhomCuaTieuDe(text: string, nhomDaBiet: Set<string>): string | null {
  const bo = text.replace(/^[^\p{L}\p{N}]+/u, '').trim();
  const t = chuanHoa(bo);
  for (const g of [...SO_LENH_NHOM, ...nhomDaBiet]) if (chuanHoa(g) === t) return g;
  return null;
}

type CotKey = 'lenh' | 'tuyChon' | 'nghia' | 'viDu' | 'nhom' | 'loi';

function cotCuaTieuDe(text: string): CotKey | null {
  const t = chuanHoa(text);
  if (t === 'lenh' || t.startsWith('lenh ')) return 'lenh';
  if (t.startsWith('tuy chon') || t.startsWith('tuy chon') || t.startsWith('option')) return 'tuyChon';
  if (t.startsWith('nghia')) return 'nghia';
  if (t.startsWith('vi du')) return 'viDu';
  if (t.startsWith('nhom')) return 'nhom';
  if (t.startsWith('loi')) return 'loi';
  return null;
}

function laBangSoLenh(n: JSONContent): (CotKey | null)[] | null {
  if (n.type !== 'table') return null;
  const header = n.content?.[0];
  if (!header) return null;
  const cot = (header.content ?? []).map((c) => cotCuaTieuDe(nodeText(c)));
  return cot.includes('lenh') && cot.includes('nghia') ? cot : null;
}

/** Bảng Sổ lệnh đầu tiên (nhận theo TÊN cột "Lệnh" + "Nghĩa"). */
export function timBangSoLenh(doc: JSONContent): { table: JSONContent; cot: (CotKey | null)[] } | null {
  let found: { table: JSONContent; cot: (CotKey | null)[] } | null = null;
  walk(doc, (n) => {
    if (found) return;
    const cot = laBangSoLenh(n);
    if (cot) found = { table: n, cot };
  });
  return found;
}

/** Các dòng của một bảng, tính cả ô gộp dọc (rowspan). */
function dongCuaBang(table: JSONContent, cot: (CotKey | null)[], nhomTieuDe: string | null): DongLenh[] {
  const keo: { con: number; gt: string }[] = cot.map(() => ({ con: 0, gt: '' }));
  const out: DongLenh[] = [];
  for (const r of (table.content ?? []).slice(1)) {
    const o = [...(r.content ?? [])];
    const gt: Partial<Record<CotKey, string>> = {};
    for (let i = 0; i < cot.length; i++) {
      let v: string;
      if (keo[i].con > 0) {
        keo[i].con--;
        v = keo[i].gt;
      } else {
        const c = o.shift();
        v = nodeText(c).trim();
        const span = Number(c?.attrs?.rowspan ?? 1);
        if (span > 1) keo[i] = { con: span - 1, gt: v };
      }
      const k = cot[i];
      if (k) gt[k] = v;
    }
    const lenh = [gt.lenh ?? '', gt.tuyChon ?? ''].filter(Boolean).join(' ').trim();
    if (!lenh) continue;
    const d: DongLenh = { lenh, nghia: gt.nghia ?? '' };
    if (gt.viDu !== undefined) d.viDu = gt.viDu;
    const nhom = gt.nhom || nhomTieuDe;
    if (nhom) d.nhom = nhom;
    if (gt.loi !== undefined) d.loi = gt.loi;
    out.push(d);
  }
  return out;
}

/** Mọi dòng của Sổ lệnh trên trang, theo thứ tự xuất hiện. Nhóm lấy từ cột "Nhóm" (bảng kiểu cũ) hoặc tiêu đề đứng trên bảng. */
export function docSoLenh(doc: JSONContent): DongLenh[] {
  const out: DongLenh[] = [];
  let nhom: string | null = null;
  const daBiet = new Set<string>();
  for (const n of doc.content ?? []) {
    if (n.type === 'heading') {
      nhom = nhomCuaTieuDe(nodeText(n), daBiet);
      continue;
    }
    const cot = laBangSoLenh(n);
    if (cot) {
      for (const d of dongCuaBang(n, cot, nhom)) {
        if (d.nhom) daBiet.add(d.nhom);
        out.push(d);
      }
    }
  }
  // Bảng lồng trong khối khác (callout, cột…) — hiếm, đọc theo kiểu cũ.
  if (out.length === 0) {
    const b = timBangSoLenh(doc);
    if (b) out.push(...dongCuaBang(b.table, b.cot, null));
  }
  return out;
}

interface DongGop { tuyChon: string; nghia: string; viDu: string[]; loi: string[] }

function themDongKhongTrung(ds: string[], text: string | undefined) {
  for (const l of (text ?? '').split('\n').map((x) => x.trim()).filter(Boolean)) {
    if (!ds.some((c) => chuanHoa(c) === chuanHoa(l))) ds.push(l);
  }
}

/** Nhóm → lệnh gốc → dòng (khoá tuỳ chọn). Map giữ thứ tự thêm vào. */
type SoGop = Map<string, Map<string, Map<string, DongGop>>>;

function gopDong(so: SoGop, d: DongLenh) {
  const t = tachLenh(d.lenh);
  if (!t.goc) return;
  const nhom = nhomChuan(d.nhom);
  if (!so.has(nhom)) so.set(nhom, new Map());
  const theoGoc = so.get(nhom)!;
  if (!theoGoc.has(t.goc)) theoGoc.set(t.goc, new Map());
  const dong = theoGoc.get(t.goc)!;
  let g = dong.get(t.khoa);
  if (!g) {
    g = { tuyChon: t.tuyChon, nghia: '', viDu: [], loi: [] };
    dong.set(t.khoa, g);
  } else if (t.tuyChon.length > g.tuyChon.length) {
    g.tuyChon = t.tuyChon; // `-p` rồi `-p <tên>` → giữ bản nói rõ cú pháp hơn
  }
  const nghia = (d.nghia ?? '').trim();
  if (nghia && !chuanHoa(g.nghia).includes(chuanHoa(nghia))) g.nghia = g.nghia ? `${g.nghia} · ${nghia}` : nghia;
  themDongKhongTrung(g.viDu, t.viDuTuLenh);
  themDongKhongTrung(g.viDu, d.viDu);
  themDongKhongTrung(g.loi, d.loi);
}

function oBang(type: 'tableCell' | 'tableHeader', text: string, opts: { code?: boolean; rowspan?: number } = {}): JSONContent {
  const content: JSONContent[] = [];
  text.split('\n').forEach((l, i) => {
    if (i > 0) content.push({ type: 'hardBreak' });
    if (l) content.push({ type: 'text', text: l, ...(opts.code ? { marks: [{ type: 'code' }] } : {}) });
  });
  const para: JSONContent = { type: 'paragraph' };
  if (content.length) para.content = content;
  return { type, attrs: { colspan: 1, rowspan: opts.rowspan ?? 1, colwidth: null }, content: [para] };
}

function thuTuNhom(so: SoGop): string[] {
  const biet = SO_LENH_NHOM.filter((g) => so.has(g) && g !== 'Khác');
  const la = [...so.keys()].filter((g) => !(SO_LENH_NHOM as readonly string[]).includes(g));
  return [...biet, ...la, ...(so.has('Khác') ? ['Khác'] : [])];
}

/** Khối tiêu đề + bảng cho từng nhóm. */
function dungKhoiSoLenh(so: SoGop): JSONContent[] {
  const out: JSONContent[] = [];
  for (const nhom of thuTuNhom(so)) {
    const theoGoc = so.get(nhom)!;
    const rows: JSONContent[] = [{ type: 'tableRow', content: SO_LENH_COT.map((c) => oBang('tableHeader', c)) }];
    for (const [goc, dong] of theoGoc) {
      // Dòng lệnh gốc (không tuỳ chọn) luôn đứng đầu khối.
      const ds = [...dong.values()].sort((a, b) => Number(Boolean(a.tuyChon)) - Number(Boolean(b.tuyChon)));
      ds.forEach((g, i) => {
        const cells: JSONContent[] = [];
        if (i === 0) cells.push(oBang('tableCell', goc, { code: true, rowspan: ds.length }));
        cells.push(
          oBang('tableCell', g.tuyChon, { code: true }),
          oBang('tableCell', g.nghia),
          oBang('tableCell', g.viDu.join('\n')),
          oBang('tableCell', g.loi.join('\n')),
        );
        rows.push({ type: 'tableRow', content: cells });
      });
    }
    out.push(
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: `${NHOM_ICON[nhom] ?? '📌'} ${nhom}` }] },
      { type: 'table', content: rows },
    );
  }
  return out;
}

/**
 * Dựng lại phần Sổ lệnh của trang (đổi tại chỗ), có thể kèm dòng mới. Bảng
 * Sổ lệnh + tiêu đề nhóm cũ bị thay bằng bản gom nhóm; mọi thứ khác giữ nguyên
 * chỗ. Trang chưa có bảng nào thì thêm vào cuối.
 */
export function sapXepSoLenh(doc: TiptapDoc, them?: DongLenh): TiptapDoc {
  const dong = docSoLenh(doc);
  if (them) dong.push(them);
  const so: SoGop = new Map();
  for (const d of dong) gopDong(so, d);
  const nhomCo = new Set(so.keys());

  const giu: JSONContent[] = [];
  let viTri = -1;
  for (const n of doc.content) {
    const laTieuDeNhom = n.type === 'heading' && nhomCuaTieuDe(nodeText(n), nhomCo) !== null;
    if (laBangSoLenh(n) || laTieuDeNhom) {
      if (viTri < 0) viTri = giu.length;
      continue;
    }
    giu.push(n);
  }
  const khoi = dungKhoiSoLenh(so);
  if (viTri < 0) {
    viTri = giu.length;
    khoi.push({ type: 'paragraph' });
  }
  giu.splice(viTri, 0, ...khoi);
  doc.content = giu;
  return doc;
}

/** Thêm một lệnh: gộp vào dòng cũ nếu trùng lệnh gốc + cờ, rồi dựng lại cả sổ. */
export function themDongSoLenh(doc: TiptapDoc, d: DongLenh): TiptapDoc {
  return sapXepSoLenh(doc, d);
}

function soLenhHtml(): string {
  const so: SoGop = new Map();
  for (const d of VI_DU_SO_LENH) gopDong(so, d);
  return [
    '<aside data-type="callout" data-kind="tip"><p>Gõ cả lệnh lẫn tuỳ chọn, vd <code>mkdir -p</code> — sổ tự gom vào lệnh gốc <code>mkdir</code>, trong nhóm 💻 Terminal. Ghi trùng thì gộp vào dòng cũ. Cột <strong>Nghĩa</strong> viết bằng lời của bạn — nút “Ôn bằng flashcard” sẽ hỏi ngược: “Lệnh nào để &lt;nghĩa&gt;?”. Ghi nhanh từ bất kỳ trang nào: <strong>Alt+Shift+N</strong> (Mac: ⌥⇧N) → thẻ “Sổ lệnh”.</p></aside>',
    docToHtml({ type: 'doc', content: dungKhoiSoLenh(so) }),
    '<p></p>',
  ].join('');
}


export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    key: 'ghi-chu-bai-hoc',
    title: 'Ghi chú bài học',
    icon: '📝',
    description: 'Tóm tắt · Lệnh/khái niệm mới · Lỗi gặp · Câu còn thắc mắc',
    html: [
      '<h2>Tóm tắt</h2><p></p>',
      '<h2>Lệnh / khái niệm mới</h2><ul><li><p></p></li></ul>',
      '<h2>Lỗi gặp</h2><ul><li><p></p></li></ul>',
      '<h2>Câu còn thắc mắc</h2><ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p></p></li></ul>',
    ].join(''),
  },
  {
    key: 'so-lenh',
    title: 'Sổ lệnh',
    icon: '⌨️',
    description: 'Bảng Lệnh · Nghĩa · Ví dụ · Nhóm · Lỗi từng gặp — ôn lại bằng flashcard',
    html: soLenhHtml(),
  },
  {
    key: 'nhat-ky-loi',
    title: 'Nhật ký lỗi',
    icon: '🐞',
    description: 'Lỗi → Nguyên nhân → Cách sửa → Bài học',
    html: [
      '<h2>Lỗi</h2><pre><code></code></pre>',
      '<h2>Nguyên nhân</h2><p></p>',
      '<h2>Cách sửa</h2><p></p>',
      '<h2>Bài học</h2><aside data-type="callout" data-kind="tip"><p></p></aside>',
    ].join(''),
  },
];

export function findTemplate(key: unknown): NoteTemplate | null {
  return NOTE_TEMPLATES.find((t) => t.key === key) ?? null;
}

/** Mặt trước thẻ ôn: "Lệnh nào để <nghĩa>?" */
export function matTruocThe(nghia: string): string {
  const n = nghia.trim().replace(/[.?!…]+$/, '');
  return `Lệnh nào để ${n}?`;
}

// ─── Đoạn lưu từ bài học ─────────────────────────────────────

/**
 * Khối nội dung cho MỘT đoạn lưu từ bài học: trích dẫn (hoặc khối code nếu
 * người dùng bôi đen trong <pre>) + một dòng nhỏ ghi giờ lưu.
 */
export function doanLuuBlocks(text: string, laCode: boolean, luc: Date): JSONContent[] {
  const gio = luc.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
  const khoi: JSONContent = laCode
    ? { type: 'codeBlock', attrs: { language: '' }, content: text ? [{ type: 'text', text }] : undefined }
    : {
      type: 'blockquote',
      content: text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => {
        const lines = p.split('\n');
        const content: JSONContent[] = [];
        lines.forEach((l, i) => {
          if (i > 0) content.push({ type: 'hardBreak' });
          if (l) content.push({ type: 'text', text: l });
        });
        return { type: 'paragraph', content: content.length ? content : undefined };
      }),
    };
  if (khoi.type === 'blockquote' && (khoi.content ?? []).length === 0) khoi.content = [{ type: 'paragraph' }];
  return [khoi, { type: 'paragraph', content: [{ type: 'text', text: `🕒 Lưu lúc ${gio}`, marks: [{ type: 'italic' }] }] }];
}

/** Các đoạn đã lưu = mọi trích dẫn / khối code ở cấp cao nhất của trang bài. */
export function docDoanDaLuu(doc: JSONContent | null | undefined): { text: string; laCode: boolean }[] {
  if (!doc) return [];
  return (doc.content ?? [])
    .filter((n) => n.type === 'blockquote' || n.type === 'codeBlock')
    .map((n) => ({
      laCode: n.type === 'codeBlock',
      text: n.type === 'codeBlock'
        ? nodeText(n)
        : (n.content ?? []).map((p) => (p.content ?? []).map((c) => (c.type === 'hardBreak' ? '\n' : c.text ?? '')).join('')).join('\n\n'),
    }))
    .filter((s) => s.text.trim().length > 0);
}
