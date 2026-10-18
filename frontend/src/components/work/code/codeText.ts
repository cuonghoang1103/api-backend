/**
 * Trang "Code" — hàm THUẦN cho trình xem mã / diff (test: codeText.test.ts, chạy bằng `npx tsx --test`).
 */

/** Đuôi tệp ⇒ tên ngôn ngữ highlight.js (đúng các ngữ pháp đã đăng ký ở exp-hub/hljsCore). null ⇒ không tô màu. */
export function languageOf(path: string): string | null {
  const name = path.split('/').pop()?.toLowerCase() ?? '';
  if (name === 'dockerfile' || name.startsWith('dockerfile.')) return 'dockerfile';
  if (name === 'makefile') return 'bash';
  if (name === 'nginx.conf') return 'nginx';
  if (name === '.gitignore' || name === '.env.example') return 'ini';
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.') + 1) : '';
  const map: Record<string, string> = {
    js: 'javascript', mjs: 'javascript', cjs: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript', mts: 'typescript',
    py: 'python', java: 'java', jsp: 'xml', sql: 'sql', sh: 'bash', bash: 'bash', zsh: 'bash', json: 'json', yml: 'yaml', yaml: 'yaml',
    xml: 'xml', html: 'xml', htm: 'xml', svg: 'xml', vue: 'xml', css: 'css', scss: 'css', less: 'css', go: 'go', rs: 'rust', php: 'php',
    rb: 'ruby', cs: 'csharp', cpp: 'cpp', cc: 'cpp', hpp: 'cpp', c: 'c', h: 'c', kt: 'kotlin', kts: 'kotlin', swift: 'swift', dart: 'dart',
    md: 'markdown', ps1: 'powershell', ini: 'ini', toml: 'ini', properties: 'properties', gradle: 'groovy', groovy: 'groovy', graphql: 'graphql', gql: 'graphql',
  };
  return map[ext] ?? null;
}

/**
 * Tách HTML đã tô màu (highlight.js) thành từng dòng, GIỮ thẻ <span> mở qua nhiều dòng (chú thích /* … *\/ dài,
 * chuỗi nhiều dòng): cuối dòng đóng hết thẻ đang mở, đầu dòng sau mở lại đúng các thẻ đó.
 */
export function splitHighlighted(html: string): string[] {
  const lines: string[] = [];
  const stack: string[] = [];
  let cur = '';
  const re = /(<span[^>]*>)|(<\/span>)|(\n)|([^<\n]+|<)/g;
  for (const m of html.matchAll(re)) {
    if (m[1]) { stack.push(m[1]); cur += m[1]; }
    else if (m[2]) { stack.pop(); cur += m[2]; }
    else if (m[3]) { cur += '</span>'.repeat(stack.length); lines.push(cur); cur = stack.join(''); }
    else cur += m[4];
  }
  lines.push(cur);
  return lines;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export interface DiffRow { kind: 'hunk' | 'add' | 'del' | 'ctx' | 'meta'; oldNo: number | null; newNo: number | null; text: string }

/** Patch unified (`@@ -a,b +c,d @@`) ⇒ các dòng có số dòng cũ / mới. */
export function parsePatch(patch: string): DiffRow[] {
  const out: DiffRow[] = [];
  let o = 0;
  let n = 0;
  for (const line of patch.replace(/\n$/, '').split('\n')) {
    const h = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)$/.exec(line);
    if (h) { o = Number(h[1]); n = Number(h[2]); out.push({ kind: 'hunk', oldNo: null, newNo: null, text: line }); continue; }
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('diff ') || line.startsWith('index ')) { out.push({ kind: 'meta', oldNo: null, newNo: null, text: line }); continue; }
    if (line.startsWith('\\')) { out.push({ kind: 'meta', oldNo: null, newNo: null, text: line }); continue; }
    if (line.startsWith('+')) { out.push({ kind: 'add', oldNo: null, newNo: n++, text: line.slice(1) }); continue; }
    if (line.startsWith('-')) { out.push({ kind: 'del', oldNo: o++, newNo: null, text: line.slice(1) }); continue; }
    out.push({ kind: 'ctx', oldNo: o++, newNo: n++, text: line.startsWith(' ') ? line.slice(1) : line });
  }
  return out;
}

/** Kích thước dễ đọc: 1.2 KB / 3.4 MB. */
export function sizeLabel(n: number | null | undefined): string {
  if (n == null) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10 * 1024 ? 1 : 0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** Ngày (YYYY-MM-DD theo giờ máy) để nhóm dòng thời gian. */
export function localDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
