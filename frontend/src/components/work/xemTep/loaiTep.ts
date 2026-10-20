/**
 * Trình xem tệp CT Work — phần THUẦN (không React): nhận loại tệp, tách CSV, đánh số dòng, định dạng JSON.
 * Test: `npx tsx --test frontend/src/components/work/xemTep/loaiTep.test.ts`.
 *
 * Nhận loại theo ĐUÔI trước, mime sau: mime do trình duyệt người tải lên đoán (Windows hay gửi `application/octet-stream`
 * cho .md/.csv, Chrome gửi mime rỗng cho .heic). SVG xếp vào ảnh nhưng CHỈ được vẽ bằng `<img>` (script trong SVG không
 * chạy ở đó) — không bao giờ chèn thẳng vào DOM.
 */

export type LoaiTep = 'image' | 'pdf' | 'video' | 'audio' | 'markdown' | 'csv' | 'json' | 'code' | 'text' | 'docx' | 'xlsx' | 'none';

const ANH = new Set(['png', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'gif', 'webp', 'avif', 'bmp', 'ico', 'svg']);
const VIDEO = new Set(['mp4', 'm4v', 'webm', 'mov', 'ogv']);
const AM_THANH = new Set(['mp3', 'wav', 'ogg', 'oga', 'opus', 'm4a', 'aac', 'flac', 'weba']);
const MARKDOWN = new Set(['md', 'markdown', 'mdx']);
const CSV = new Set(['csv', 'tsv']);
const JSON_ = new Set(['json', 'jsonc', 'json5', 'geojson', 'webmanifest']);
const CHU = new Set(['txt', 'text', 'log', 'out', 'srt', 'vtt', 'rst', 'adoc', 'tex', 'bib', 'ndjson', 'readme', 'license', 'changelog', 'lock']);

/** Đuôi mã ⇒ nhãn ngôn ngữ hiển thị. */
const MA: Record<string, string> = {
  js: 'JavaScript', mjs: 'JavaScript', cjs: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', mts: 'TypeScript', cts: 'TypeScript', tsx: 'TSX',
  py: 'Python', java: 'Java', kt: 'Kotlin', kts: 'Kotlin', scala: 'Scala', groovy: 'Groovy', gradle: 'Gradle', c: 'C', h: 'C', cc: 'C++',
  cpp: 'C++', cxx: 'C++', hpp: 'C++', hh: 'C++', cs: 'C#', go: 'Go', rs: 'Rust', rb: 'Ruby', php: 'PHP', swift: 'Swift', m: 'Objective-C',
  mm: 'Objective-C++', dart: 'Dart', lua: 'Lua', pl: 'Perl', r: 'R', sh: 'Shell', bash: 'Bash', zsh: 'Zsh', fish: 'Fish', ps1: 'PowerShell',
  bat: 'Batch', cmd: 'Batch', sql: 'SQL', graphql: 'GraphQL', gql: 'GraphQL', proto: 'Protobuf', html: 'HTML', htm: 'HTML', xhtml: 'HTML',
  css: 'CSS', scss: 'SCSS', sass: 'Sass', less: 'Less', vue: 'Vue', svelte: 'Svelte', astro: 'Astro', xml: 'XML', yaml: 'YAML', yml: 'YAML',
  toml: 'TOML', ini: 'INI', cfg: 'Config', conf: 'Config', properties: 'Properties', env: 'Env', diff: 'Diff', patch: 'Diff',
  dockerfile: 'Dockerfile', makefile: 'Makefile', '.gitignore': 'Git ignore', '.editorconfig': 'EditorConfig', procfile: 'Procfile', gemfile: 'Ruby',
};

/** Đuôi (chữ thường, không dấu chấm). Tên đặc biệt (Dockerfile, .env.local…) trả nguyên tên. */
export function duoiTep(fileName: string): string {
  const base = (fileName.split(/[\\/]/).pop() ?? '').toLowerCase();
  if (/^(dockerfile|makefile|readme|license|changelog|procfile|gemfile|\.gitignore|\.editorconfig)$/.test(base)) return base;
  if (/^\.env(\..+)?$/.test(base)) return 'env';
  const i = base.lastIndexOf('.');
  return i > 0 || (i === 0 && base.length > 1) ? base.slice(i + 1) : '';
}

const mimeGoc = (mime: string | null | undefined) => (mime ?? '').split(';')[0].trim().toLowerCase();

export function loaiTep(fileName: string, mime?: string | null): LoaiTep {
  const d = duoiTep(fileName);
  const m = mimeGoc(mime);
  if (ANH.has(d)) return 'image';
  if (d === 'pdf') return 'pdf';
  if (d === 'docx') return 'docx';
  if (d === 'xlsx') return 'xlsx';
  if (MARKDOWN.has(d)) return 'markdown';
  if (CSV.has(d)) return 'csv';
  if (JSON_.has(d)) return 'json';
  if (d in MA) return 'code';
  if (CHU.has(d)) return 'text';
  if (VIDEO.has(d)) return m.startsWith('audio/') ? 'audio' : 'video';
  if (AM_THANH.has(d)) return 'audio';
  // Đuôi lạ ⇒ theo mime.
  if (/^image\/(png|jpe?g|gif|webp|avif|bmp|svg\+xml|x-icon|vnd\.microsoft\.icon)$/.test(m)) return 'image';
  if (m === 'application/pdf') return 'pdf';
  if (m.startsWith('video/')) return 'video';
  if (m.startsWith('audio/')) return 'audio';
  if (m === 'text/markdown') return 'markdown';
  if (m === 'text/csv' || m === 'text/tab-separated-values') return 'csv';
  if (m === 'application/json' || m.endsWith('+json')) return 'json';
  if (m.startsWith('text/') || /^application\/(xml|x-yaml|yaml|javascript|x-sh|sql)$/.test(m)) return 'text';
  if (m === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  if (m === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'xlsx';
  return 'none';
}

/** Loại cần đọc byte qua máy chủ (tuyến `/content`). */
export const canNoiDungChu = (l: LoaiTep) => l === 'markdown' || l === 'csv' || l === 'json' || l === 'code' || l === 'text';
/** Loại dựng xem trước ở máy chủ (tuyến `/preview`). */
export const canXemTruoc = (l: LoaiTep) => l === 'docx' || l === 'xlsx';

export function nhanNgonNgu(fileName: string): string | null {
  return MA[duoiTep(fileName)] ?? null;
}

export function laSvg(fileName: string, mime?: string | null): boolean {
  return duoiTep(fileName) === 'svg' || mimeGoc(mime) === 'image/svg+xml';
}

// ─── CSV ─────────────────────────────────────────────────────────

/** Đoán dấu phân cách theo dòng đầu (ngoài ngoặc kép): tab > ; > , (Excel tiếng Việt xuất bằng `;`). */
export function doanDauPhan(text: string, fileName = ''): string {
  if (duoiTep(fileName) === 'tsv') return '\t';
  const dong = text.split(/\r?\n/, 1)[0] ?? '';
  let q = false;
  const dem: Record<string, number> = { '\t': 0, ';': 0, ',': 0 };
  for (const ch of dong) {
    if (ch === '"') q = !q;
    else if (!q && ch in dem) dem[ch]++;
  }
  if (dem['\t'] > 0 && dem['\t'] >= dem[','] && dem['\t'] >= dem[';']) return '\t';
  if (dem[';'] > dem[',']) return ';';
  return ',';
}

/**
 * Tách CSV theo RFC 4180: ô trong ngoặc kép được chứa dấu phân cách/xuống dòng, `""` = một `"`. Bỏ BOM đầu tệp.
 * `maxRows` chặn tệp lớn (bảng chỉ vẽ phần đầu); `truncated` báo còn dòng chưa vẽ.
 */
export function tachCsv(text: string, sep = ',', maxRows = 2000): { rows: string[][]; truncated: boolean } {
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let q = false;
  let i = 0;
  const xongDong = () => { row.push(cell); rows.push(row); row = []; cell = ''; };
  while (i < s.length) {
    const ch = s[i];
    if (q) {
      if (ch === '"') {
        if (s[i + 1] === '"') { cell += '"'; i += 2; continue; }
        q = false; i++; continue;
      }
      cell += ch; i++; continue;
    }
    if (ch === '"' && cell === '') { q = true; i++; continue; }
    if (ch === sep) { row.push(cell); cell = ''; i++; continue; }
    if (ch === '\r' || ch === '\n') {
      xongDong();
      if (ch === '\r' && s[i + 1] === '\n') i++;
      i++;
      if (rows.length >= maxRows) return { rows, truncated: i < s.length };
      continue;
    }
    cell += ch; i++;
  }
  if (cell !== '' || row.length) xongDong();
  return { rows, truncated: false };
}

// ─── Chữ ─────────────────────────────────────────────────────────

/** JSON đẹp (2 dấu cách) nếu đọc được, không thì giữ nguyên văn. */
export function dinhDangJson(text: string): { text: string; ok: boolean } {
  try { return { text: JSON.stringify(JSON.parse(text), null, 2), ok: true }; } catch { return { text, ok: false }; }
}

/** Tách dòng để đánh số (giữ dòng trống cuối nếu tệp kết thúc bằng xuống dòng thì bỏ). */
export function tachDong(text: string): string[] {
  const lines = text.split(/\r\n|\r|\n/);
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/** Giải mã byte ⇒ chữ: UTF-8 (BOM UTF-16 ⇒ UTF-16). Byte hỏng ⇒ ký tự thay thế, không ném lỗi. */
export function giaiMa(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf);
  if (b[0] === 0xff && b[1] === 0xfe) return new TextDecoder('utf-16le').decode(b.subarray(2));
  if (b[0] === 0xfe && b[1] === 0xff) return new TextDecoder('utf-16be').decode(b.subarray(2));
  return new TextDecoder('utf-8').decode(b);
}

// ─── Ảnh: phóng to ───────────────────────────────────────────────

export const ZOOM_MIN = 0.1;
export const ZOOM_MAX = 8;
export const kepZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
