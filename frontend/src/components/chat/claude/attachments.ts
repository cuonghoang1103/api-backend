/**
 * Đính kèm của ô soạn kiểu Claude — chép luật từ `ChatInput.tsx` (giới hạn khớp backend `ai.routes.ts`):
 * 4 ảnh (nén cạnh dài ≤1568px, JPEG 0.85) + 3 tài liệu ≤6MB (PDF/Word/Excel/PowerPoint/txt/md/csv).
 */
export const MAX_IMAGES = 4;
export const MAX_DOCS = 3;
export const MAX_DOC_BYTES = 6 * 1024 * 1024;
const MAX_DIM = 1568;

const DOC_TYPE_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
  md: 'text/markdown',
  markdown: 'text/markdown',
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};
export const FILE_ACCEPT =
  'image/png,image/jpeg,image/webp,image/gif,.pdf,.docx,.xlsx,.pptx,.txt,.md,.csv,.zip';

/** Media type chuẩn của một tài liệu (theo ĐUÔI trước — `file.type` của .md là chuỗi rỗng). */
export function docMediaType(file: File): string | null {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (DOC_TYPE_BY_EXT[ext]) return DOC_TYPE_BY_EXT[ext];
  const t = (file.type || '').toLowerCase();
  return Object.values(DOC_TYPE_BY_EXT).includes(t) ? t : null;
}

export function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('read failed'));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode failed'));
    img.src = src;
  });
}

/** Thu nhỏ + nén JPEG; lỗi gì cũng trả lại bản gốc. */
export async function compressImage(file: File): Promise<string> {
  const original = await readAsDataURL(file);
  try {
    const img = await loadImage(original);
    let { width, height } = img;
    if (Math.max(width, height) > MAX_DIM) {
      const k = MAX_DIM / Math.max(width, height);
      width = Math.round(width * k);
      height = Math.round(height * k);
    }
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return original;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return c.toDataURL('image/jpeg', 0.85);
  } catch {
    return original;
  }
}

/* ───────────────── Kéo FOLDER / tải .ZIP (11/11/2026) ─────────────────
   Gói cả thư mục/zip thành MỘT tài liệu text (header đường dẫn) ⇒ tái dùng pipeline <file> của backend.
   Lọc: giữ code/text, bỏ nhị phân + node_modules/.git/dist/lockfile; trần 100KB/file · 300KB tổng · 50 file. */
import { unzipSync } from 'fflate';

// ⚠️ Backend cắt MỖI tài liệu ở 60k ký tự (MAX_DOC_CHARS_DEFAULT, ~15k token, vì chi phí). Gói cả dự án
// là MỘT tài liệu ⇒ trần tổng phải < 60k để không mất file âm thầm. 55KB chừa chỗ cho header đường dẫn.
// (Muốn đưa CẢ repo lớn cho AI thì dùng app desktop AI Code — nó đọc file trực tiếp, không qua trần này.)
export const PACK_CAP_TOTAL = 55 * 1024;
export const PACK_CAP_FILE = 100 * 1024;
export const PACK_CAP_N = 50;

const SKIP_DIR = /(^|\/)(node_modules|\.git|\.next|dist|build|out|coverage|vendor|target|__pycache__|\.cache|\.venv|venv|\.idea|\.vscode|\.turbo|\.svn)\//i;
const SKIP_FILE = /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|composer\.lock|Cargo\.lock|poetry\.lock|\.DS_Store)$/i;
const MINIFIED = /\.min\.(js|css)$|\.map$/i;
const CODE_EXT = new Set('js jsx ts tsx mjs cjs py java c cc cpp h hpp cs go rs rb php swift kt kts scala sh bash zsh sql html htm css scss sass less json jsonc yaml yml toml xml md markdown txt csv tsv ini cfg conf env gitignore dockerignore editorconfig vue svelte astro r lua dart ex exs clj cljs pl pm ps1 bat gradle properties graphql gql proto tf hcl prisma'.split(' '));
const BIN_EXT = new Set('png jpg jpeg gif webp bmp ico svg pdf zip gz tar rar 7z exe dll so dylib bin dat woff woff2 ttf otf eot mp3 mp4 mov avi mkv wav flac psd ai class jar war o a lib node wasm pyc pyo db sqlite'.split(' '));
const NO_EXT_CODE = new Set(['dockerfile', 'makefile', 'readme', 'license', 'procfile', 'gemfile', 'rakefile', '.gitignore', '.env', '.env.example', '.npmrc', '.prettierrc', '.eslintrc', '.babelrc']);

function keepFile(path: string, size: number): boolean {
  const low = path.toLowerCase();
  const base = low.split('/').pop() || low;
  const ext = base.includes('.') ? base.split('.').pop()! : '';
  if (SKIP_DIR.test('/' + low)) return false;
  if (SKIP_FILE.test('/' + low)) return false;
  if (MINIFIED.test(low)) return false;
  if (ext && BIN_EXT.has(ext)) return false;
  if (size > PACK_CAP_FILE) return false;
  return (ext && CODE_EXT.has(ext)) || NO_EXT_CODE.has(base) || !ext;
}

const _dec = new TextDecoder('utf-8', { fatal: false });

/** Mọi file từ một thao tác kéo-thả, đệ quy vào thư mục con (webkitGetAsEntry). */
export async function filesFromDrop(dt: DataTransfer): Promise<{ path: string; file: File }[]> {
  const out: { path: string; file: File }[] = [];
  const items = dt.items ? Array.from(dt.items) : [];
  const entries = items
    .map((it) => (typeof it.webkitGetAsEntry === 'function' ? it.webkitGetAsEntry() : null))
    .filter((e): e is FileSystemEntry => !!e);
  if (entries.length) {
    for (const e of entries) await walkEntry(e, '', out);
  } else {
    for (const f of Array.from(dt.files)) out.push({ path: f.name, file: f });
  }
  return out;
}
function walkEntry(entry: FileSystemEntry, prefix: string, out: { path: string; file: File }[]): Promise<void> {
  return new Promise((resolve) => {
    if ((entry as FileSystemFileEntry).isFile) {
      (entry as FileSystemFileEntry).file((f) => { out.push({ path: prefix + entry.name, file: f }); resolve(); }, () => resolve());
    } else if ((entry as FileSystemDirectoryEntry).isDirectory) {
      if (SKIP_DIR.test('/' + (prefix + entry.name + '/').toLowerCase())) { resolve(); return; }
      const rd = (entry as FileSystemDirectoryEntry).createReader();
      const all: FileSystemEntry[] = [];
      const read = () => rd.readEntries(async (es) => {
        if (!es.length) { for (const c of all) await walkEntry(c, prefix + entry.name + '/', out); resolve(); }
        else { all.push(...es); read(); }
      }, () => resolve());
      read();
    } else resolve();
  });
}

/** Giải nén .zip → [{path, bytes}] (bỏ thư mục rỗng). */
export async function filesFromZip(file: File): Promise<{ path: string; bytes: Uint8Array }[]> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const un = unzipSync(buf);
  const top = file.name.replace(/\.zip$/i, '') || 'zip';
  return Object.entries(un).filter(([p]) => !p.endsWith('/')).map(([p, bytes]) => ({ path: `${top}/${p}`, bytes }));
}

export interface ProjectDoc { name: string; dataUrl: string; fileCount: number; skipped: number; truncated: boolean }

/** Gói các file (folder/zip) thành MỘT tài liệu markdown. Lọc + đọc text + trần dung lượng. null nếu không có file hợp lệ. */
export async function buildProjectDoc(
  name: string,
  items: { path: string; file?: File; bytes?: Uint8Array; size: number }[],
): Promise<ProjectDoc | null> {
  items.sort((a, b) => a.path.localeCompare(b.path));
  const parts: string[] = [];
  let total = 0, n = 0, skipped = 0, truncated = false;
  for (const it of items) {
    if (!keepFile(it.path, it.size)) { skipped++; continue; }
    if (n >= PACK_CAP_N || total + it.size > PACK_CAP_TOTAL) { truncated = true; skipped++; continue; }
    let text: string;
    try { text = it.bytes ? _dec.decode(it.bytes) : it.file ? await it.file.text() : ''; } catch { skipped++; continue; }
    parts.push(`\n// ===== ${it.path} =====\n${text}`);
    total += it.size; n++;
  }
  if (!n) return null;
  const head = `# Dự án đính kèm: ${name} — ${n} file${truncated ? ' (đã rút gọn theo trần dung lượng)' : ''}\n`;
  const content = head + parts.join('\n');
  const b64 = btoa(unescape(encodeURIComponent(content)));
  return { name: `${name} · ${n} file`, dataUrl: `data:text/markdown;base64,${b64}`, fileCount: n, skipped, truncated };
}
