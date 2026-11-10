/**
 * Mẫu ảnh cho bài HỌC trên Bảng tin — thay cho MỘT tấm thẻ gradient tím duy nhất.
 * ─────────────────────────────────────────────────────────────────────────
 * 10/11/2026: người dùng chụp màn hình /feed — mọi bài bot đều cùng một tấm
 * "SO SÁNH CÔNG NGHỆ · A VS B" nền tím/xanh. Ở đây có NHIỀU mẫu khác hẳn nhau
 * về bố cục, màu nền, tỉ lệ khung và kiểu chữ, chọn theo ĐỊNH DẠNG bài:
 *
 *   code      — cửa sổ trình soạn mã tối + bảng Output thật (bài mẹo/TIL)
 *   loi       — terminal đen, dòng lỗi đỏ (bài bug & cách debug)
 *   truocSau  — hai cột TRƯỚC/SAU nền sáng (refactor, sửa lỗi)
 *   quiz      — nền vàng kiểu story, 4 ô đáp án A–D (đố vui có bình chọn)
 *   eli5      — nền trời pastel, chữ tròn to (giải thích như cho trẻ 5 tuổi)
 *   soDo      — giấy kẻ ô, hộp + mũi tên (luồng/kiến trúc)
 *   conSo     — một con số thật cỡ khổng lồ + nguồn (stat card)
 *   trichDan  — giấy kem, chữ serif to (quote card)
 *   sach      — bìa sách/tài nguyên dựng bằng hình (sách/khoá học của tuần)
 *   slide     — slide carousel 4:5 "1/n" (thread nhiều ảnh)
 *   anh       — ẢNH THẬT (Wikimedia Commons…) + dải chú thích & giấy phép
 *
 * Toàn bộ là SVG viết tay → sharp (librsvg) → PNG, như `newsCover.service.ts`.
 * KHÔNG dùng emoji trong SVG: ảnh Docker (Debian) không có phông emoji, librsvg
 * sẽ vẽ ô trống. Mọi "biểu tượng" ở đây là hình vẽ.
 *
 * Phông: prod là Debian + fontconfig ⇒ có DejaVu (Sans/Serif/Mono, đủ dấu tiếng
 * Việt). Máy Mac rơi về Helvetica/Menlo/Georgia — chỉ để xem thử.
 */

export const SANS = "'DejaVu Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const SERIF = "'DejaVu Serif', Georgia, 'Times New Roman', serif";
export const MONO = "'DejaVu Sans Mono', Menlo, Consolas, monospace";

export type MauAnh =
  | 'code' | 'loi' | 'truocSau' | 'quiz' | 'eli5' | 'soDo' | 'conSo' | 'trichDan' | 'sach' | 'slide' | 'anh';

export interface KichThuoc { w: number; h: number }

export function xml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/** Ngắt dòng tham lam theo bề rộng ƯỚC LƯỢNG (librsvg không đo chữ trước được). */
export function ngatDong(text: string, fontSize: number, maxWidth: number, maxLines: number, heSo = 0.53): string[] {
  const perChar = fontSize * heSo;
  const limit = Math.max(6, Math.floor(maxWidth / perChar));
  const out: string[] = [];
  for (const para of text.split('\n')) {
    const words = para.split(/\s+/).filter(Boolean);
    let cur = '';
    for (const w of words) {
      const cand = cur ? `${cur} ${w}` : w;
      if (cand.length <= limit || !cur) cur = cand;
      else { out.push(cur); cur = w; }
    }
    if (cur) out.push(cur);
    if (!words.length) out.push('');
  }
  if (out.length > maxLines) {
    const cut = out.slice(0, maxLines);
    const last = cut[maxLines - 1];
    cut[maxLines - 1] = last.length > limit - 1 ? `${last.slice(0, limit - 1)}…` : `${last}…`;
    return cut;
  }
  return out.map((l) => (l.length > limit ? `${l.slice(0, limit - 1)}…` : l));
}

function textLines(lines: string[], x: number, y: number, lh: number, attrs: string): string {
  return lines.map((l, i) => `<text x="${x}" y="${y + i * lh}" ${attrs}>${xml(l)}</text>`).join('');
}

function svgMo(w: number, h: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

/** Chữ ký nhỏ ở góc — KHÔNG còn dải "cuongthai.com · CuongMini AI" to đùng. */
function chuKy(w: number, h: number, mau: string, ben: 'trai' | 'phai' = 'phai'): string {
  const x = ben === 'phai' ? w - 48 : 48;
  const anchor = ben === 'phai' ? 'end' : 'start';
  return `<text x="${x}" y="${h - 36}" font-family="${SANS}" font-size="22" font-weight="700" fill="${mau}" text-anchor="${anchor}" opacity="0.75">cuongthai.com/feed</text>`;
}

// ─── Tô màu cú pháp tối giản (đủ cho ảnh, không cần chính xác như IDE) ────────
const KW: Record<string, string[]> = {
  js: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'of', 'in', 'while', 'new', 'class', 'extends', 'await', 'async', 'import', 'from', 'export', 'try', 'catch', 'throw', 'typeof', 'null', 'undefined', 'true', 'false', 'this', 'switch', 'case', 'break', 'default'],
  sql: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'INNER', 'ON', 'GROUP', 'BY', 'ORDER', 'CREATE', 'INDEX', 'TABLE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'EXPLAIN', 'ANALYZE', 'AND', 'OR', 'NOT', 'LIKE', 'AS', 'COUNT', 'LIMIT', 'NULL', 'PRIMARY', 'KEY', 'INT', 'TEXT', 'SERIAL', 'USING', 'BEGIN', 'COMMIT'],
  python: ['def', 'return', 'if', 'elif', 'else', 'for', 'in', 'while', 'import', 'from', 'class', 'None', 'True', 'False', 'print', 'lambda', 'with', 'as', 'try', 'except', 'not', 'and', 'or'],
  bash: ['git', 'npm', 'node', 'cd', 'echo', 'sudo', 'export'],
};
const TOK = { kw: '#c792ea', str: '#c3e88d', num: '#f78c6c', cmt: '#697098', fn: '#82aaff', txt: '#e6edf3' };

export function toMauDong(line: string, lang: string): string {
  if (lang === 'text') return `<tspan fill="${TOK.txt}">${xml(line)}</tspan>`;
  const kws = new Set(KW[lang === 'ts' || lang === 'javascript' || lang === 'typescript' ? 'js' : lang] ?? KW.js);
  const isSql = lang === 'sql';
  const cmtRe = lang === 'python' || lang === 'bash' ? /#.*$/ : isSql ? /--.*$/ : /\/\/.*$/;
  let rest = line;
  let comment = '';
  const cm = rest.match(cmtRe);
  // Chỉ coi là chú thích nếu dấu mở không nằm trong chuỗi (ước lượng: số nháy trước đó chẵn).
  if (cm && cm.index !== undefined && ((rest.slice(0, cm.index).match(/['"`]/g) || []).length % 2 === 0)) {
    comment = rest.slice(cm.index);
    rest = rest.slice(0, cm.index);
  }
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(\s*\()?|(\s+)|(.)/g;
  let out = '';
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest)) !== null) {
    if (m[1]) out += `<tspan fill="${TOK.str}">${xml(m[1])}</tspan>`;
    else if (m[2]) out += `<tspan fill="${TOK.num}">${xml(m[2])}</tspan>`;
    else if (m[3]) {
      const word = m[3];
      const isKw = kws.has(isSql ? word.toUpperCase() : word);
      const color = isKw ? TOK.kw : m[4] ? TOK.fn : TOK.txt;
      out += `<tspan fill="${color}">${xml(word)}</tspan>`;
      if (m[4]) out += `<tspan fill="${TOK.txt}">${xml(m[4])}</tspan>`;
    } else if (m[5]) out += xml(m[5]);
    else if (m[6]) out += `<tspan fill="${TOK.txt}">${xml(m[6])}</tspan>`;
  }
  if (comment) out += `<tspan fill="${TOK.cmt}" font-style="italic">${xml(comment)}</tspan>`;
  return out;
}

function khoiCode(code: string, lang: string, x: number, y: number, fs: number, maxLines: number, maxCols: number): { svg: string; h: number } {
  const lh = Math.round(fs * 1.5);
  const lines = code.replace(/\t/g, '  ').split('\n').slice(0, maxLines)
    .map((l) => (l.length > maxCols ? `${l.slice(0, maxCols - 1)}…` : l));
  const svg = lines.map((l, i) =>
    `<text x="${x}" y="${y + i * lh}" font-family="${MONO}" font-size="${fs}" xml:space="preserve">${toMauDong(l, lang)}</text>`,
  ).join('');
  return { svg, h: lines.length * lh };
}

const NHAN_NGON_NGU: Record<string, { ten: string; mau: string }> = {
  js: { ten: 'JavaScript', mau: '#f7df1e' },
  javascript: { ten: 'JavaScript', mau: '#f7df1e' },
  ts: { ten: 'TypeScript', mau: '#3178c6' },
  typescript: { ten: 'TypeScript', mau: '#3178c6' },
  sql: { ten: 'SQL', mau: '#38bdf8' },
  python: { ten: 'Python', mau: '#4ade80' },
  bash: { ten: 'Terminal', mau: '#a3a3a3' },
  java: { ten: 'Java', mau: '#f97316' },
};

// ─── 1. CODE: cửa sổ trình soạn + bảng Output ────────────────────────────────
export interface CodeCardInput { tieuDe: string; code: string; lang: string; output?: string; tenTep?: string }
export function mauCode(i: CodeCardInput): { svg: string; size: KichThuoc } {
  const W = 1200;
  const nhan = NHAN_NGON_NGU[i.lang] ?? { ten: i.lang.toUpperCase(), mau: '#e5e7eb' };
  const tieuDe = ngatDong(i.tieuDe, 40, W - 160, 2);
  const codeLines = Math.min(14, i.code.split('\n').length);
  const outLines = i.output ? Math.min(6, i.output.split('\n').length) : 0;
  const fs = 26;
  const lh = Math.round(fs * 1.5);
  const winY = 70 + tieuDe.length * 52 + 30;
  const winH = 64 + codeLines * lh + 36;
  const outH = outLines ? 56 + outLines * 34 + 24 : 0;
  const H = Math.max(675, winY + winH + (outH ? outH + 24 : 0) + 90);
  const code = khoiCode(i.code, i.lang, 112, winY + 64 + 34, fs, 14, 62);
  const outSvg = outLines
    ? `<rect x="80" y="${winY + winH + 24}" width="${W - 160}" height="${outH}" rx="18" fill="#0b0f17" stroke="#22c55e" stroke-opacity="0.35"/>
       <text x="112" y="${winY + winH + 24 + 40}" font-family="${SANS}" font-size="20" font-weight="700" fill="#22c55e" letter-spacing="3">OUTPUT THẬT</text>
       ${i.output!.split('\n').slice(0, 6).map((l, k) => `<text x="112" y="${winY + winH + 24 + 80 + k * 34}" font-family="${MONO}" font-size="24" fill="#d1fae5" xml:space="preserve">${xml(l.length > 70 ? `${l.slice(0, 69)}…` : l)}</text>`).join('')}`
    : '';
  const body = `
  <rect width="${W}" height="${H}" fill="#111827"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <defs><radialGradient id="g" cx="0.15" cy="0" r="1"><stop offset="0" stop-color="${nhan.mau}" stop-opacity="0.18"/><stop offset="1" stop-color="#111827" stop-opacity="0"/></radialGradient></defs>
  ${textLines(tieuDe, 80, 110, 52, `font-family="${SANS}" font-size="40" font-weight="800" fill="#f9fafb"`)}
  <rect x="80" y="${winY}" width="${W - 160}" height="${winH}" rx="18" fill="#1e2330" stroke="#ffffff" stroke-opacity="0.08"/>
  <circle cx="114" cy="${winY + 32}" r="9" fill="#ff5f57"/><circle cx="142" cy="${winY + 32}" r="9" fill="#febc2e"/><circle cx="170" cy="${winY + 32}" r="9" fill="#28c840"/>
  <text x="${W / 2}" y="${winY + 40}" font-family="${MONO}" font-size="20" fill="#9ca3af" text-anchor="middle">${xml(i.tenTep ?? `vi-du.${i.lang === 'python' ? 'py' : i.lang === 'sql' ? 'sql' : 'js'}`)}</text>
  <rect x="${W - 80 - 160}" y="${winY + 16}" width="140" height="32" rx="16" fill="${nhan.mau}" fill-opacity="0.18"/>
  <text x="${W - 80 - 90}" y="${winY + 39}" font-family="${SANS}" font-size="18" font-weight="700" fill="${nhan.mau}" text-anchor="middle">${xml(nhan.ten)}</text>
  ${code.svg}
  ${outSvg}
  ${chuKy(W, H, '#9ca3af')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 2. LỖI: terminal + thông báo lỗi thật ───────────────────────────────────
export interface LoiCardInput { tieuDe: string; lenh?: string; loi: string; goiY: string }
export function mauLoi(i: LoiCardInput): { svg: string; size: KichThuoc } {
  const W = 1200, H = 900;
  const loi = ngatDong(i.loi, 28, W - 220, 6, 0.62);
  const goiY = ngatDong(i.goiY, 30, W - 220, 3);
  const tieuDe = ngatDong(i.tieuDe, 44, W - 200, 2);
  const body = `
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <rect x="0" y="0" width="${W}" height="10" fill="#ef4444"/>
  <g transform="translate(80,92)"><polygon points="0,40 24,0 48,40" fill="none" stroke="#ef4444" stroke-width="5" stroke-linejoin="round"/><rect x="21" y="13" width="6" height="14" fill="#ef4444"/><rect x="21" y="31" width="6" height="5" fill="#ef4444"/></g>
  <text x="148" y="126" font-family="${SANS}" font-size="22" font-weight="800" fill="#ef4444" letter-spacing="4">BUG &amp; CÁCH DEBUG</text>
  ${textLines(tieuDe, 80, 200, 56, `font-family="${SANS}" font-size="44" font-weight="800" fill="#fafafa"`)}
  <rect x="80" y="${200 + tieuDe.length * 56}" width="${W - 160}" height="${90 + loi.length * 42 + (i.lenh ? 46 : 0)}" rx="14" fill="#171717" stroke="#404040"/>
  ${i.lenh ? `<text x="110" y="${200 + tieuDe.length * 56 + 56}" font-family="${MONO}" font-size="26" fill="#a3a3a3" xml:space="preserve"><tspan fill="#22c55e">$</tspan> ${xml(i.lenh.length > 58 ? `${i.lenh.slice(0, 57)}…` : i.lenh)}</text>` : ''}
  ${textLines(loi, 110, 200 + tieuDe.length * 56 + (i.lenh ? 104 : 60), 42, `font-family="${MONO}" font-size="28" fill="#fca5a5" xml:space="preserve"`)}
  <rect x="80" y="${H - 80 - goiY.length * 42 - 50}" width="8" height="${goiY.length * 42 + 20}" fill="#22c55e"/>
  ${textLines(goiY, 110, H - 80 - goiY.length * 42 - 12, 42, `font-family="${SANS}" font-size="30" font-weight="600" fill="#d4d4d4"`)}
  ${chuKy(W, H, '#737373')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 3. TRƯỚC / SAU: hai cột nền sáng ────────────────────────────────────────
export interface TruocSauInput { tieuDe: string; truoc: string; sau: string; lang: string; nhanTruoc?: string; nhanSau?: string }
export function mauTruocSau(i: TruocSauInput): { svg: string; size: KichThuoc } {
  const W = 1200;
  const tieuDe = ngatDong(i.tieuDe, 42, W - 160, 2);
  const top = 80 + tieuDe.length * 54 + 40;
  const colW = (W - 160 - 32) / 2;
  const dai = Math.max(...`${i.truoc}\n${i.sau}`.split('\n').map((l) => l.length), 10);
  const fs = Math.max(17, Math.min(24, Math.floor((colW - 56) / (dai * 0.61))));
  const soDong = Math.min(16, Math.max(i.truoc.split('\n').length, i.sau.split('\n').length, 6));
  const H = top + 110 + soDong * Math.round(fs * 1.5) + 40 + 110;
  const cot = (x: number, nen: string, vien: string, nhan: string, mauNhan: string, code: string, dau: 'x' | 'v') => {
    const k = khoiCode(code, i.lang, x + 28, top + 110, fs, 16, Math.floor((colW - 56) / (fs * 0.61)));
    const icon = dau === 'x'
      ? `<path d="M${x + 30} ${top + 34} l22 22 M${x + 52} ${top + 34} l-22 22" stroke="${mauNhan}" stroke-width="6" stroke-linecap="round"/>`
      : `<path d="M${x + 28} ${top + 46} l9 10 l18 -22" stroke="${mauNhan}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<rect x="${x}" y="${top}" width="${colW}" height="${H - top - 110}" rx="22" fill="${nen}" stroke="${vien}" stroke-width="3"/>
      ${icon}<text x="${x + 70}" y="${top + 56}" font-family="${SANS}" font-size="28" font-weight="800" fill="${mauNhan}">${xml(nhan)}</text>
      <rect x="${x + 16}" y="${top + 80}" width="${colW - 32}" height="${H - top - 220}" rx="14" fill="#1f2430"/>
      ${k.svg}`;
  };
  const body = `
  <rect width="${W}" height="${H}" fill="#f8fafc"/>
  ${textLines(tieuDe, 80, 118, 54, `font-family="${SANS}" font-size="42" font-weight="800" fill="#0f172a"`)}
  ${cot(80, '#fef2f2', '#fecaca', i.nhanTruoc ?? 'TRƯỚC', '#dc2626', i.truoc, 'x')}
  ${cot(80 + colW + 32, '#f0fdf4', '#bbf7d0', i.nhanSau ?? 'SAU', '#16a34a', i.sau, 'v')}
  ${chuKy(W, H, '#64748b')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 4. QUIZ: nền vàng, 4 ô đáp án ───────────────────────────────────────────
export interface QuizInput { cauHoi: string; luaChon: string[]; code?: string; lang?: string }
export function mauQuiz(i: QuizInput): { svg: string; size: KichThuoc } {
  const W = 1080, H = 1080;
  const q = ngatDong(i.cauHoi, 44, W - 160, i.code ? 2 : 4);
  let y = 210 + q.length * 56;
  let codeSvg = '';
  if (i.code) {
    const n = Math.min(7, i.code.split('\n').length);
    codeSvg = `<rect x="80" y="${y}" width="${W - 160}" height="${n * 36 + 44}" rx="18" fill="#111827"/>` +
      khoiCode(i.code, i.lang ?? 'js', 108, y + 44, 24, 7, 58).svg;
    y += n * 36 + 44 + 30;
  }
  const opts = i.luaChon.slice(0, 4);
  const boxH = Math.min(96, Math.floor((H - y - 110) / opts.length) - 16);
  const optSvg = opts.map((o, k) => {
    const oy = y + k * (boxH + 16);
    return `<rect x="80" y="${oy}" width="${W - 160}" height="${boxH}" rx="${boxH / 2}" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <circle cx="${80 + boxH / 2}" cy="${oy + boxH / 2}" r="${boxH / 2 - 12}" fill="#111827"/>
      <text x="${80 + boxH / 2}" y="${oy + boxH / 2 + 11}" font-family="${SANS}" font-size="30" font-weight="800" fill="#fde047" text-anchor="middle">${'ABCD'[k]}</text>
      <text x="${80 + boxH + 12}" y="${oy + boxH / 2 + 11}" font-family="${MONO}" font-size="30" font-weight="700" fill="#111827">${xml(o.length > 40 ? `${o.slice(0, 39)}…` : o)}</text>`;
  }).join('');
  const body = `
  <rect width="${W}" height="${H}" fill="#fde047"/>
  <circle cx="${W - 60}" cy="70" r="150" fill="#facc15"/>
  <rect x="80" y="80" width="220" height="56" rx="28" fill="#111827"/>
  <text x="190" y="118" font-family="${SANS}" font-size="26" font-weight="800" fill="#fde047" text-anchor="middle" letter-spacing="3">ĐỐ VUI</text>
  ${textLines(q, 80, 210, 56, `font-family="${SANS}" font-size="44" font-weight="800" fill="#111827"`)}
  ${codeSvg}
  ${optSvg}
  <text x="80" y="${H - 36}" font-family="${SANS}" font-size="22" font-weight="700" fill="#111827" opacity="0.7">Bình chọn trong bài · đáp án ở cuối</text>
  ${chuKy(W, H, '#111827')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 5. ELI5: trời pastel, chữ tròn ──────────────────────────────────────────
export interface Eli5Input { khaiNiem: string; viDu: string; dong: string[] }
export function mauEli5(i: Eli5Input): { svg: string; size: KichThuoc } {
  const W = 1080, H = 1080;
  const vd = ngatDong(i.viDu, 38, W - 200, 3);
  const dong = i.dong.slice(0, 4);
  const body = `
  <rect width="${W}" height="${H}" fill="#e0f2fe"/>
  <circle cx="930" cy="150" r="80" fill="#fde68a"/>
  <g fill="#ffffff"><circle cx="160" cy="170" r="46"/><circle cx="215" cy="150" r="60"/><circle cx="275" cy="175" r="42"/><rect x="160" y="170" width="120" height="48"/></g>
  <text x="80" y="330" font-family="${SANS}" font-size="28" font-weight="800" fill="#0369a1" letter-spacing="4">GIẢI THÍCH NHƯ CHO BÉ 5 TUỔI</text>
  <text x="80" y="420" font-family="${SANS}" font-size="76" font-weight="800" fill="#0c4a6e">${xml(i.khaiNiem.length > 22 ? `${i.khaiNiem.slice(0, 21)}…` : i.khaiNiem)}</text>
  <text x="80" y="470" font-family="${SANS}" font-size="32" font-weight="700" fill="#0369a1">giống như…</text>
  ${textLines(vd, 80, 530, 50, `font-family="${SANS}" font-size="38" font-weight="700" fill="#075985"`)}
  ${dong.map((d, k) => {
    const yy = 720 + k * 78;
    return `<rect x="80" y="${yy - 46}" width="${W - 160}" height="64" rx="32" fill="#ffffff"/>
      <circle cx="116" cy="${yy - 14}" r="18" fill="${['#f472b6', '#60a5fa', '#34d399', '#fbbf24'][k]}"/>
      <text x="150" y="${yy - 4}" font-family="${SANS}" font-size="28" font-weight="600" fill="#0f172a">${xml(d.length > 52 ? `${d.slice(0, 51)}…` : d)}</text>`;
  }).join('')}
  ${chuKy(W, H, '#0369a1')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 6. SƠ ĐỒ: giấy kẻ ô, hộp + mũi tên ──────────────────────────────────────
export interface SoDoInput { tieuDe: string; nut: Array<{ ten: string; phu?: string }>; chuThich?: string }
export function mauSoDo(i: SoDoInput): { svg: string; size: KichThuoc } {
  const W = 1200, H = 800;
  const nut = i.nut.slice(0, 6);
  const perRow = nut.length <= 3 ? nut.length : Math.ceil(nut.length / 2);
  const rows = Math.ceil(nut.length / perRow);
  const gap = 70;
  const boxW = Math.min(300, (W - 160 - gap * (perRow - 1)) / perRow);
  const boxH = 150;
  const tieuDe = ngatDong(i.tieuDe, 42, W - 160, 2);
  const top = 120 + tieuDe.length * 54 + 40;
  const rowGap = 90;
  const mauNut = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#059669', '#0891b2'];
  const pos = nut.map((_, k) => {
    const r = Math.floor(k / perRow);
    const c = r % 2 === 0 ? k % perRow : perRow - 1 - (k % perRow); // rắn bò: hàng 2 đi ngược
    const rowCount = Math.min(perRow, nut.length - r * perRow);
    const offset = (W - (rowCount * boxW + (rowCount - 1) * gap)) / 2;
    return { x: offset + (r % 2 === 0 ? c : c - (perRow - rowCount)) * (boxW + gap), y: top + r * (boxH + rowGap) };
  });
  const arrows = pos.slice(1).map((p, k) => {
    const a = pos[k];
    if (Math.abs(a.y - p.y) < 1) {
      const dir = p.x > a.x ? 1 : -1;
      const x1 = dir > 0 ? a.x + boxW + 8 : a.x - 8;
      const x2 = dir > 0 ? p.x - 12 : p.x + boxW + 12;
      const yy = a.y + boxH / 2;
      return `<line x1="${x1}" y1="${yy}" x2="${x2}" y2="${yy}" stroke="#1f2937" stroke-width="4"/><polygon points="${x2},${yy - 10} ${x2 + 14 * dir},${yy} ${x2},${yy + 10}" fill="#1f2937"/>`;
    }
    const xx = a.x + boxW / 2;
    return `<line x1="${xx}" y1="${a.y + boxH + 8}" x2="${xx}" y2="${p.y - 18}" stroke="#1f2937" stroke-width="4"/><polygon points="${xx - 10},${p.y - 18} ${xx},${p.y - 4} ${xx + 10},${p.y - 18}" fill="#1f2937"/>`;
  }).join('');
  const boxes = nut.map((n, k) => {
    const p = pos[k];
    const ten = ngatDong(n.ten, 30, boxW - 60, 2);
    const phu = n.phu ? ngatDong(n.phu, 21, boxW - 30, 2) : [];
    return `<rect x="${p.x}" y="${p.y}" width="${boxW}" height="${boxH}" rx="16" fill="#ffffff" stroke="${mauNut[k % 6]}" stroke-width="4"/>
      <rect x="${p.x}" y="${p.y}" width="${boxW}" height="10" rx="5" fill="${mauNut[k % 6]}"/>
      <circle cx="${p.x + boxW - 22}" cy="${p.y + 34}" r="14" fill="${mauNut[k % 6]}"/><text x="${p.x + boxW - 22}" y="${p.y + 41}" font-family="${SANS}" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">${k + 1}</text>
      ${textLines(ten, p.x + boxW / 2, p.y + 60 + (phu.length ? 0 : 16), 34, `font-family="${SANS}" font-size="30" font-weight="800" fill="#111827" text-anchor="middle"`)}
      ${textLines(phu, p.x + boxW / 2, p.y + 60 + ten.length * 34 + 6, 26, `font-family="${SANS}" font-size="21" fill="#4b5563" text-anchor="middle"`)}`;
  }).join('');
  const realH = Math.max(H, top + rows * (boxH + rowGap) + 60);
  const body = `
  <defs><pattern id="o" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#dbe4f0" stroke-width="1.5"/></pattern></defs>
  <rect width="${W}" height="${realH}" fill="#f8fbff"/><rect width="${W}" height="${realH}" fill="url(#o)"/>
  <text x="80" y="92" font-family="${SANS}" font-size="22" font-weight="800" fill="#2563eb" letter-spacing="4">SƠ ĐỒ</text>
  ${textLines(tieuDe, 80, 150, 54, `font-family="${SANS}" font-size="42" font-weight="800" fill="#0f172a"`)}
  ${arrows}${boxes}
  ${i.chuThich ? `<text x="80" y="${realH - 36}" font-family="${SANS}" font-size="22" fill="#475569">${xml(i.chuThich.slice(0, 80))}</text>` : ''}
  ${chuKy(W, realH, '#475569')}`;
  return { svg: svgMo(W, realH, body), size: { w: W, h: realH } };
}

// ─── 7. CON SỐ: một số liệu thật, cỡ khổng lồ ─────────────────────────────────
export interface ConSoInput { so: string; donVi?: string; yNghia: string; nguon: string; nen?: string }
export function mauConSo(i: ConSoInput): { svg: string; size: KichThuoc } {
  const W = 1080, H = 1080;
  const nen = i.nen ?? '#065f46';
  const y = ngatDong(i.yNghia, 44, W - 160, 4);
  const fsSo = i.so.length <= 3 ? 330 : i.so.length <= 6 ? 220 : 150;
  const body = `
  <rect width="${W}" height="${H}" fill="${nen}"/>
  <g opacity="0.08" fill="#ffffff">${Array.from({ length: 10 }, (_, k) => `<rect x="${k * 120 - 40}" y="0" width="40" height="${H}" transform="rotate(18 ${k * 120} ${H / 2})"/>`).join('')}</g>
  <text x="80" y="140" font-family="${SANS}" font-size="26" font-weight="800" fill="#ffffff" opacity="0.8" letter-spacing="5">CON SỐ HÔM NAY</text>
  <text x="66" y="${180 + fsSo}" font-family="${SANS}" font-size="${fsSo}" font-weight="800" fill="#ffffff">${xml(i.so)}</text>
  ${i.donVi ? `<text x="80" y="${250 + fsSo}" font-family="${SANS}" font-size="52" font-weight="800" fill="#a7f3d0">${xml(i.donVi)}</text>` : ''}
  ${textLines(y, 80, 330 + fsSo + (i.donVi ? 30 : 0), 58, `font-family="${SANS}" font-size="44" font-weight="600" fill="#ffffff"`)}
  <text x="80" y="${H - 90}" font-family="${SANS}" font-size="22" fill="#ffffff" opacity="0.75">Nguồn: ${xml(i.nguon.slice(0, 70))}</text>
  ${chuKy(W, H, '#ffffff')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 8. TRÍCH DẪN: giấy kem, serif ───────────────────────────────────────────
export interface TrichDanInput { cau: string; tacGia: string; xuatXu?: string }
export function mauTrichDan(i: TrichDanInput): { svg: string; size: KichThuoc } {
  const W = 1080, H = 1080;
  const fs = i.cau.length > 160 ? 46 : 56;
  const cau = ngatDong(i.cau, fs, W - 200, 9, 0.5);
  const y0 = 330;
  const body = `
  <rect width="${W}" height="${H}" fill="#f5efe4"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#1c1917" stroke-width="2"/>
  <text x="90" y="290" font-family="${SERIF}" font-size="260" font-weight="700" fill="#c2410c" opacity="0.9">“</text>
  ${textLines(cau, 100, y0, Math.round(fs * 1.3), `font-family="${SERIF}" font-size="${fs}" font-style="italic" fill="#1c1917"`)}
  <rect x="100" y="${y0 + cau.length * Math.round(fs * 1.3) + 20}" width="80" height="4" fill="#c2410c"/>
  <text x="100" y="${y0 + cau.length * Math.round(fs * 1.3) + 76}" font-family="${SANS}" font-size="32" font-weight="800" fill="#1c1917">${xml(i.tacGia)}</text>
  ${i.xuatXu ? `<text x="100" y="${y0 + cau.length * Math.round(fs * 1.3) + 118}" font-family="${SANS}" font-size="24" fill="#57534e">${xml(i.xuatXu.slice(0, 64))}</text>` : ''}
  ${chuKy(W, H - 30, '#57534e')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 9. SÁCH / TÀI NGUYÊN của tuần ───────────────────────────────────────────
export interface SachInput { ten: string; tacGia: string; loai: string; vi: string[]; mauBia?: string }
export function mauSach(i: SachInput): { svg: string; size: KichThuoc } {
  const W = 1200, H = 800;
  const mau = i.mauBia ?? '#1d4ed8';
  const ten = ngatDong(i.ten, 40, 300, 5);
  const vi = i.vi.slice(0, 4);
  const body = `
  <rect width="${W}" height="${H}" fill="#fafaf9"/>
  <rect x="0" y="0" width="520" height="${H}" fill="#e7e5e4"/>
  <rect x="128" y="118" width="300" height="440" rx="8" fill="#000000" opacity="0.15" transform="translate(14,14)"/>
  <rect x="110" y="118" width="300" height="440" rx="8" fill="${mau}"/>
  <rect x="110" y="118" width="22" height="440" fill="#000000" opacity="0.22"/>
  ${textLines(ten, 156, 200, 48, `font-family="${SERIF}" font-size="40" font-weight="700" fill="#ffffff"`)}
  <text x="156" y="520" font-family="${SANS}" font-size="20" font-weight="700" fill="#ffffff" opacity="0.85">${xml(i.tacGia.slice(0, 24))}</text>
  <text x="110" y="640" font-family="${SANS}" font-size="22" font-weight="800" fill="#44403c" letter-spacing="3">${xml(i.loai.toUpperCase())}</text>
  <text x="580" y="160" font-family="${SANS}" font-size="24" font-weight="800" fill="${mau}" letter-spacing="4">VÌ SAO NÊN ĐỌC</text>
  ${vi.map((v, k) => {
    const l = ngatDong(v, 30, W - 680, 2);
    const yy = 230 + k * 120;
    return `<circle cx="596" cy="${yy - 10}" r="16" fill="${mau}"/><text x="596" y="${yy - 2}" font-family="${SANS}" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">${k + 1}</text>
      ${textLines(l, 630, yy, 40, `font-family="${SANS}" font-size="30" font-weight="600" fill="#1c1917"`)}`;
  }).join('')}
  ${chuKy(W, H, '#78716c')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 10. SLIDE carousel 4:5 ──────────────────────────────────────────────────
export interface SlideInput { so: number; tong: number; tieuDe: string; than?: string; code?: string; lang?: string; laBia?: boolean; mau?: string }
export function mauSlide(i: SlideInput): { svg: string; size: KichThuoc } {
  const W = 1080, H = 1350;
  const mau = i.mau ?? '#ea580c';
  if (i.laBia) {
    const t = ngatDong(i.tieuDe, 76, W - 180, 5, 0.55);
    const s = i.than ? ngatDong(i.than, 34, W - 180, 3) : [];
    const body = `
    <rect width="${W}" height="${H}" fill="${mau}"/>
    <circle cx="${W}" cy="0" r="420" fill="#ffffff" opacity="0.08"/><circle cx="0" cy="${H}" r="360" fill="#000000" opacity="0.08"/>
    <text x="90" y="200" font-family="${SANS}" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="5">THREAD · ${i.tong} SLIDE</text>
    ${textLines(t, 90, 420, 92, `font-family="${SANS}" font-size="76" font-weight="800" fill="#ffffff"`)}
    ${textLines(s, 90, 460 + t.length * 92, 46, `font-family="${SANS}" font-size="34" font-weight="500" fill="#ffffff" opacity="0.92"`)}
    <text x="90" y="${H - 110}" font-family="${SANS}" font-size="30" font-weight="800" fill="#ffffff">Vuốt sang để xem tiếp</text>
    <path d="M${W - 190} ${H - 120} h70 m-22 -22 l22 22 l-22 22" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${chuKy(W, H - 10, '#ffffff', 'trai')}`;
    return { svg: svgMo(W, H, body), size: { w: W, h: H } };
  }
  const t = ngatDong(i.tieuDe, 62, W - 180, 3);
  let y = 330 + t.length * 76;
  const than = i.than ? ngatDong(i.than, 42, W - 180, i.code ? 6 : 12, 0.52) : [];
  const thanSvg = textLines(than, 90, y + 30, 62, `font-family="${SANS}" font-size="42" fill="#1f2937"`);
  y += 30 + than.length * 62 + 30;
  let codeSvg = '';
  if (i.code) {
    const n = Math.min(12, i.code.split('\n').length);
    codeSvg = `<rect x="70" y="${y}" width="${W - 140}" height="${n * 45 + 60}" rx="20" fill="#111827"/>` +
      khoiCode(i.code, i.lang ?? 'js', 100, y + 56, 30, 12, 50).svg;
  }
  const body = `
  <rect width="${W}" height="${H}" fill="#fffbf5"/>
  <rect x="0" y="0" width="${W}" height="16" fill="${mau}"/>
  <text x="90" y="190" font-family="${SANS}" font-size="110" font-weight="800" fill="${mau}" opacity="0.9">${i.so}</text>
  <text x="${90 + String(i.so).length * 64}" y="190" font-family="${SANS}" font-size="44" font-weight="800" fill="#9ca3af">/${i.tong}</text>
  ${textLines(t, 90, 330, 76, `font-family="${SANS}" font-size="62" font-weight="800" fill="#111827"`)}
  ${thanSvg}${codeSvg}
  <g>${Array.from({ length: i.tong }, (_, k) => `<circle cx="${W / 2 - (i.tong - 1) * 14 + k * 28}" cy="${H - 60}" r="${k + 1 === i.so ? 9 : 6}" fill="${k + 1 === i.so ? mau : '#d1d5db'}"/>`).join('')}</g>
  ${chuKy(W, H - 50, '#9ca3af')}`;
  return { svg: svgMo(W, H, body), size: { w: W, h: H } };
}

// ─── 11. ẢNH THẬT + chú thích (ghép bằng sharp ở tầng render) ─────────────────
export interface AnhKhungInput { chuThich: string; giayPhep: string; w: number; h: number }
/** Lớp phủ SVG đặt lên ảnh thật đã resize về w×h (dải chú thích dưới đáy). */
export function lopPhuAnh(i: AnhKhungInput): string {
  const cap = ngatDong(i.chuThich, 30, i.w - 120, 2);
  const bandH = 60 + cap.length * 40 + 40;
  return svgMo(i.w, i.h, `
  <defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.85"/></linearGradient></defs>
  <rect x="0" y="${i.h - bandH - 80}" width="${i.w}" height="${bandH + 80}" fill="url(#f)"/>
  ${textLines(cap, 56, i.h - bandH + 40, 40, `font-family="${SANS}" font-size="30" font-weight="700" fill="#ffffff"`)}
  <text x="56" y="${i.h - 30}" font-family="${SANS}" font-size="18" fill="#e5e7eb" opacity="0.9">${xml(i.giayPhep.slice(0, 110))}</text>`);
}
