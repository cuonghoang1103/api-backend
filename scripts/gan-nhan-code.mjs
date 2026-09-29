/**
 * gan-nhan-code.mjs — gắn nhãn ngôn ngữ cho khối code CHƯA có nhãn trong nội dung bài học.
 *
 *   node scripts/gan-nhan-code.mjs [--ghi] [thư mục…]        (mặc định: content/academy content/courses)
 *
 * Vì sao (29/09/2026): trang học tô màu kiểu VS Code bằng highlight.js theo `language-*`
 * (`frontend/src/lib/toMauCode.ts`). Khối KHÔNG có nhãn thì bộ tô phải đoán và chỉ nhận
 * khi chắc (relevance ≥ 5) — đoạn code ngắn đoán không ra ⇒ hiện toàn chữ trắng. Hàng nghìn
 * khối ở các môn cũ (PRF192, PRO192, DBI202, PRJ301, FER202…) rơi vào đúng trường hợp đó.
 *
 * Làm gì:
 *   1. `<pre><code>…` không có class  ⇒ `<pre><code class="language-X">…`
 *   2. `<pre>…</pre>` KHÔNG có `<code>` (kiểu cũ: `.tok-*` tô tay) ⇒ bọc `<code class="language-X">`
 *      để có luôn nút "Sao chép" (bộ tô tô lại từ chữ thuần, `.tok-*` bị thay — màu tương đương).
 * Nhận diện ngôn ngữ bằng dấu hiệu CHẮC CHẮN trong chữ của khối; không khớp dấu hiệu nào ⇒ để nguyên
 * (output, sơ đồ ASCII, bảng… không bị tô bậy). Bỏ qua `<pre class=…>` (mermaid, slide…).
 * Chạy không `--ghi` = chỉ đếm.
 */
import fs from 'node:fs';
import path from 'node:path';

const GHI = process.argv.includes('--ghi');
const thuMuc = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const goc = thuMuc.length ? thuMuc : ['content/academy', 'content/courses'];

const giaiMa = (s) => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;|&#x27;/g, "'").replace(/&#96;/g, '`').replace(/&amp;/g, '&').replace(/\\\$\{/g, '${');

/** Dấu hiệu theo thứ tự ưu tiên — chỉ những mẫu gần như không thể nhầm. */
const DAU_HIEU = [
  ['sql', /\b(SELECT\s+[\w*,\s.()]+\s+FROM|INSERT\s+INTO|CREATE\s+(TABLE|VIEW|PROCEDURE|TRIGGER|INDEX|DATABASE)|ALTER\s+TABLE|DELETE\s+FROM|UPDATE\s+\w+\s+SET|PRIMARY\s+KEY|FOREIGN\s+KEY)\b/i],
  ['cpp', /#include\s*<(iostream|vector|string|bits\/stdc\+\+\.h)>|\bstd::|\bcout\s*<</],
  ['c', /#include\s*[<"]|\bprintf\s*\(|\bscanf\s*\(|\bint\s+main\s*\(|\bmalloc\s*\(/],
  ['csharp', /\busing\s+System\b|Console\.Write(Line)?\s*\(|\bnamespace\s+[\w.]+\s*[{;]|\bpublic\s+(async\s+)?Task\b/],
  // Chỉ dấu hiệu RIÊNG của Java — `new X(` và `class X {` cũng có trong JS/TS nên để luật mặc định của môn lo.
  ['java', /\bpublic\s+(static\s+)?(final\s+)?(class|interface|enum|void|int|String|boolean|double|char|long)\b|\bprivate\s+(static\s+)?(final\s+)?(int|String|boolean|double|char|long|List<|Map<)|System\.out\.print|\bimport\s+javax?\.|@Override|String\[\]\s+args|\b(ArrayList|HashMap|Scanner)<?[^>]*>?\s*\w*\s*=\s*new\b|@Test\b|\bvoid\s+\w+\s*\([^)]*\)\s*(throws\s+\w+\s*)?\{/],
  ['python', /^\s*def\s+\w+\s*\(.*\)\s*:|^\s*(from\s+[\w.]+\s+)?import\s+[\w.]+\s*$|\bprint\s*\(|^\s*class\s+\w+(\(.*\))?\s*:/m],
  // web.xml, pom.xml, JSP (<%@ … %>, <jsp:…>) — highlight.js tô chúng bằng 'xml'.
  ['xml', /<\?xml|<%[@=!-]?|<\/?(web-app|servlet|servlet-mapping|jsp-config|context-param|dependency|project|beans?|jsp:[\w-]+|c:[\w-]+)[\s>]/],
  ['html', /<!DOCTYPE\s+html|<html[\s>]|<(head|body|div|form|table|ul|nav|section|button|input|label|span|p)[\s>]/i],
  ['css', /^\s*[.#@]?[a-zA-Z][\w\s.#:>,-]*\{\s*[\w-]+\s*:\s*[^;{}]+;/m],
  // Không dùng `=>` đứng một mình: sơ đồ chữ hay dùng nó làm mũi tên.
  ['javascript', /\b(const|let|var)\s+\w+\s*=\s*[^=]|\bfunction\s+\w*\s*\([^)]*\)\s*\{|\bconsole\.log\s*\(|\bimport\s+.+\s+from\s+['"]|\bexport\s+(default|const|function)\b|\buse(State|Effect)\s*\(|\brequire\s*\(['"]|\bmodule\.exports\b/],
  ['bash', /^\s*\$\s+\w|^\s*(sudo\s+)?(npm|npx|yarn|pnpm|git|docker|cd|ls|mkdir|javac|java|gcc|mvn|pip|curl|ssh|scp|rsync|apt|apt-get|dnf|brew|systemctl|journalctl|echo|cat|export|chmod|chown|psql|pg_dump|nginx|certbot|ufw|kubectl|gh|node|tar|grep|find|awk|sed)\s+[\w.\-'"/$~]/m],
];

const JS_MANH = /\buse(State|Effect|Ref|Memo)\s*\(|\bimport\s+.+\s+from\s+['"]|\bexport\s+(default|const|function)\b|\b(const|let)\s+\w+\s*=\s*[^=]|\bfunction\s+\w+\s*\(|\binterface\s+\w+|\bdeclare\s+/;
function doanNgonNgu(chu, macDinh) {
  const ma0 = DAU_HIEU.find(([, re]) => re.test(chu))?.[0];
  // JSX/TSX (<div> nằm trong hàm React) và `interface {…; }` của TS trông giống HTML/CSS:
  // khối không MỞ ĐẦU bằng thẻ mà có dấu hiệu JS mạnh ⇒ là JS/TS.
  if ((ma0 === 'html' || ma0 === 'css') && JS_MANH.test(chu) && !/^\s*</.test(chu)) return macDinh === 'typescript' ? 'typescript' : 'javascript';
  if (ma0) return ma0;
  // Không có dấu hiệu chắc chắn nhưng trông như CODE (dòng kết thúc bằng `;` hay `{`)
  // ⇒ dùng ngôn ngữ chính của môn (PRF192 = C, PRO192 = Java…). Output/sơ đồ hiếm khi có `;` cuối dòng.
  if (macDinh && /[;{}]\s*(\/\/.*|\/\*.*\*\/|#.*)?\s*$/m.test(chu)) return macDinh;
  return null;
}

/** Ngôn ngữ chính theo mã môn (tên tệp hoặc thư mục con). */
const MAC_DINH = [
  [/\b(prf19\d)\b/i, 'c'],
  [/\b(pro19\d|lab211|csd20\d|prj30\d|swt301|jpd|csd)\b/i, 'java'],
  [/\b(dbi20\d)\b/i, 'sql'],
  [/\b(fer20\d|sdn30\d|mma30\d|wdu20\d)\b/i, 'javascript'],
  [/\b(prn2\d\d)\b/i, 'csharp'],
  [/\b(aip39\d|dap39\d|ads\d+)\b/i, 'python'],
  // Khoá /courses: thư mục khoá = ngôn ngữ chính.
  [/courses (docker|linux bash|deploy vps|git|github actions|nginx)\b/i, 'bash'],
  [/courses (prisma orm|nodejs|typescript|nextjs|authentication|react|socketio|redis)\b/i, 'typescript'],
  [/courses (postgresql|hoc sql)\b/i, 'sql'],
];
const macDinhCho = (f) => (MAC_DINH.find(([re]) => re.test(f.replace(/[/_.-]/g, ' '))) || [])[1] || null;

function duyet(p, out) {
  for (const f of fs.readdirSync(p)) {
    const q = path.join(p, f);
    if (fs.statSync(q).isDirectory()) duyet(q, out);
    else if (f.endsWith('.mjs')) out.push(q);
  }
}

const tep = [];
for (const g of goc) duyet(g, tep);
const dem = {}; let tongSua = 0, tongDeNguyen = 0; const theoTep = [];
for (const f of tep) {
  const cu = fs.readFileSync(f, 'utf8');
  const macDinh = macDinhCho(f);
  let sua = 0;
  const moi = cu.replace(/<pre>([\s\S]*?)<\/pre>/g, (m, trong) => {
    let than = trong, coCode = false;
    const mc = /^<code(\s[^>]*)?>([\s\S]*)<\/code>$/.exec(trong);
    if (mc) { if (mc[1]) return m; coCode = true; than = mc[2]; }       // đã có class ⇒ để nguyên
    if (!coCode && /<code[\s>]/.test(trong)) return m;                    // cấu trúc lạ ⇒ để nguyên
    const ma = doanNgonNgu(giaiMa(than), macDinh);
    if (!ma) { tongDeNguyen++; return m; }
    sua++; dem[ma] = (dem[ma] || 0) + 1;
    return `<pre><code class="language-${ma}">${than}</code></pre>`;
  });
  if (sua) { tongSua += sua; theoTep.push([f, sua]); if (GHI) fs.writeFileSync(f, moi); }
}
theoTep.sort((a, b) => b[1] - a[1]);
for (const [f, n] of theoTep.slice(0, 40)) console.log(String(n).padStart(5), f);
console.log(`\n${GHI ? 'ĐÃ GHI' : 'THỬ (chưa ghi)'} · ${tongSua} khối gắn nhãn trong ${theoTep.length} tệp · ${tongDeNguyen} khối để nguyên (không nhận ra ngôn ngữ)`);
console.log('theo ngôn ngữ:', JSON.stringify(dem));
