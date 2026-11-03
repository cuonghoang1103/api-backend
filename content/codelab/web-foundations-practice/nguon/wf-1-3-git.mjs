/** Bộ luyện bài 1.3 — Git cục bộ. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm không chạy git ⇒ mô phỏng bằng JS: đọc status --short, tính HEAD~n, luật .gitignore, diff theo dòng, quét bí mật
 *  trong phần sẽ commit, và một "git" thu nhỏ có ba vùng (write/add/commit/status/restore/log). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 1.3 — Git cục bộ.</em> Mỗi bài là một phần nhỏ của thứ Git làm — viết lại để thấy ba vùng, .gitignore và lịch sử thật ra hoạt động thế nào.</p>';

export default doiDau({
  slug: 'wf-1-3-git',
  ten: '1.3 Git cục bộ',
  baiHoc: 'Nền tảng Web — Bài 1.3 Git: a time machine for your code',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Đọc git status --short thành các nhóm, tính HEAD~n và mã rút gọn trong log, luật .gitignore (thư mục/, *.log, !, #), diff theo dòng, quét bí mật trong phần đã stage trước khi commit, và một git thu nhỏ có đủ ba vùng — 6 bài.',
  de: [
    {
      tieuDe: 'Đọc git status --short',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['ba vùng', 'mã trạng thái XY'], tienQuyet: ['split', 'switch'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Mỗi dòng ${c('git status --short')} có 2 ký tự trạng thái ${c('XY')}, một dấu cách, rồi tên tệp. X = vùng stage, Y = thư mục làm việc. Viết ${c('readStatus(text)')} trả ${c('{ staged, unstaged, untracked, conflicts }')} (mảng tên tệp theo thứ tự xuất hiện): ${c('??')} ⇒ untracked; ${c('UU')}, ${c('AA')}, ${c('DD')} ⇒ conflicts; còn lại: X khác dấu cách ⇒ staged, Y khác dấu cách ⇒ unstaged (một tệp ${c('MM')} nằm ở CẢ HAI). Dòng rỗng bỏ qua.</p>`,
      yeuCau: ['Đọc đúng cột X và Y.', 'MM thuộc cả hai.', 'Nhận diện xung đột.'],
      dauVao: 'text: string.', dauRa: '{ staged, unstaged, untracked, conflicts }.',
      rangBuoc: ['Tên tệp bắt đầu ở ký tự thứ 4 (index 3).'],
      viDu: [{ input: 'readStatus("M  index.html\\n M style.css\\n?? .env")', output: '{ staged: ["index.html"], unstaged: ["style.css"], untracked: [".env"], conflicts: [] }', explanation: 'Cột trái là stage, cột phải là thư mục làm việc.' }],
      goiY: ['const x = line[0], y = line[1], file = line.slice(3);', 'if (x === "?" && y === "?") … else if (["UU","AA","DD"].includes(x + y)) …'],
      khoiDau: { 'main.js': `// Bài 1.3 — đọc git status --short
function readStatus(text) {
  return { staged: [], unstaged: [], untracked: [], conflicts: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 1.3 — XY: X = vùng stage so với HEAD, Y = thư mục làm việc so với stage
function readStatus(text) {
  const r = { staged: [], unstaged: [], untracked: [], conflicts: [] };
  for (const line of text.split('\\n')) {
    if (line.length < 4) continue;
    const x = line[0], y = line[1], file = line.slice(3);
    if (x === '?' && y === '?') r.untracked.push(file);
    else if (['UU', 'AA', 'DD'].includes(x + y)) r.conflicts.push(file);
    else {
      if (x !== ' ') r.staged.push(file);
      if (y !== ' ') r.unstaged.push(file);
    }
  }
  return r;
}
` },
      giaiThich: `<p>Hai cột chính là hai trong ba vùng của bài: ${c('M ')} = đã sửa và đã ${c('git add')}; ${c(' M')} = đã sửa, chưa add; ${c('MM')} = add rồi lại sửa tiếp — commit lúc này chỉ lấy phần đã stage.</p>`,
      loiHayGap: ['trim() dòng — mất cột X là dấu cách.', 'Coi MM chỉ là staged.'],
      thamKhao: 'https://git-scm.com/docs/git-status#_short_format',
      kiem: [
        { moTa: 'Staged, unstaged, untracked|||Đã stage, chưa stage, chưa theo dõi', goi: 'readStatus("M  index.html\\n M style.css\\n?? .env\\nA  app.js\\n")', mongDoi: { staged: ['index.html', 'app.js'], unstaged: ['style.css'], untracked: ['.env'], conflicts: [] } },
        { moTa: 'MM is in both areas; deletions|||MM ở cả hai vùng; xoá tệp', goi: 'readStatus("MM notes.js\\nD  old.css\\n D README.md")', mongDoi: { staged: ['notes.js', 'old.css'], unstaged: ['notes.js', 'README.md'], untracked: [], conflicts: [] } },
        { moTa: 'Conflicts|||Xung đột', goi: 'readStatus("UU notes.js\\nAA new.js\\nM  ok.js")', mongDoi: { staged: ['ok.js'], unstaged: [], untracked: [], conflicts: ['notes.js', 'new.js'] } },
      ],
    },
    {
      tieuDe: 'HEAD~n và mã rút gọn',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['HEAD', 'mã commit rút gọn'], tienQuyet: ['regex', 'filter'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>${c('log')} là mảng mã commit đầy đủ (40 ký tự hex), MỚI NHẤT trước (như ${c('git log')}). Viết ${c('resolveRef(log, ref)')}: ${c('"HEAD"')} ⇒ phần tử đầu; ${c('"HEAD~n"')} ⇒ n commit trước (${c('HEAD~')} không số = ${c('HEAD~1')}); một tiền tố hex ≥ 4 ký tự ⇒ commit duy nhất bắt đầu bằng nó. Không có ⇒ ném ${c('Error("unknown revision: <ref>")')}; tiền tố khớp nhiều ⇒ ${c('Error("ambiguous: <ref>")')}; tiền tố < 4 ký tự ⇒ cũng "unknown revision".</p>`,
      yeuCau: ['HEAD, HEAD~n.', 'Tiền tố duy nhất.', 'Thông báo lỗi đúng.'],
      dauVao: 'log: string[]; ref: string.', dauRa: 'string (mã đầy đủ).',
      rangBuoc: ['Không phân biệt hoa thường với hex.'],
      viDu: [{ input: 'resolveRef(log, "HEAD~1")', output: 'mã của commit ngay trước', explanation: 'git show HEAD~1:style.css trong bài.' }],
      goiY: ['const m = /^HEAD(?:~(\\d*))?$/.exec(ref);', 'const hits = log.filter((id) => id.startsWith(ref.toLowerCase()));'],
      khoiDau: { 'main.js': `// Bài 1.3 — HEAD~n và mã rút gọn
function resolveRef(log, ref) {
  return log[0];
}
` },
      loiGiai: { 'main.js': `// Bài 1.3 — HEAD = commit hiện tại; ~n = lùi n bước; mã rút gọn = tiền tố đủ dài và duy nhất
function resolveRef(log, ref) {
  const m = /^HEAD(?:~(\\d*))?$/.exec(ref);
  if (m) {
    const n = m[1] === undefined ? 0 : m[1] === '' ? 1 : Number(m[1]);
    if (n >= log.length) throw new Error('unknown revision: ' + ref);
    return log[n];
  }
  if (!/^[0-9a-f]{4,40}$/i.test(ref)) throw new Error('unknown revision: ' + ref);
  const hits = log.filter((id) => id.startsWith(ref.toLowerCase()));
  if (hits.length === 0) throw new Error('unknown revision: ' + ref);
  if (hits.length > 1) throw new Error('ambiguous: ' + ref);
  return hits[0];
}
` },
      giaiThich: `<p>7 ký tự (${c('a5600e9')}) thường đủ để duy nhất trong một dự án nhỏ, nên ${c('git log --oneline')} in 7. Kho lớn có thể cần nhiều hơn — Git tự in dài hơn khi bị trùng.</p>`,
      loiHayGap: ['HEAD~ hiểu thành HEAD~0.', 'Chấp nhận tiền tố 1–3 ký tự.'],
      thamKhao: 'https://git-scm.com/docs/gitrevisions',
      kiem: [
        { moTa: 'HEAD and HEAD~n|||HEAD và HEAD~n', goi: '(() => { const log = ["b151d3e95f28aadee911e5dd68da6d316b702c66", "e0de3f3aa1c2b3d4e5f60718293a4b5c6d7e8f90", "a5600e9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"]; return [resolveRef(log, "HEAD"), resolveRef(log, "HEAD~"), resolveRef(log, "HEAD~2")]; })()', mongDoi: ['b151d3e95f28aadee911e5dd68da6d316b702c66', 'e0de3f3aa1c2b3d4e5f60718293a4b5c6d7e8f90', 'a5600e9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f'] },
        { moTa: 'Short ids, case-insensitive|||Mã rút gọn, không phân biệt hoa', goi: '(() => { const log = ["b151d3e95f28aadee911e5dd68da6d316b702c66", "a5600e9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"]; return [resolveRef(log, "a5600e9"), resolveRef(log, "B151")]; })()', mongDoi: ['a5600e9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f', 'b151d3e95f28aadee911e5dd68da6d316b702c66'] },
        { moTa: 'Unknown, too short, ambiguous|||Không có, quá ngắn, mơ hồ', goi: '(() => { const log = ["abcd1111", "abcd2222"]; const err = (r) => { try { resolveRef(log, r); } catch (e) { return e.message; } }; return [err("HEAD~5"), err("abc"), err("abcd"), err("ffff")]; })()', mongDoi: ['unknown revision: HEAD~5', 'unknown revision: abc', 'ambiguous: abcd', 'unknown revision: ffff'] },
      ],
    },
    {
      tieuDe: 'Luật .gitignore',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['.gitignore', 'mẫu glob'], tienQuyet: ['regex', 'split'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('isIgnored(path, gitignore)')} (đường dẫn tương đối như ${c('"node_modules/left-pad/index.js"')}, nội dung ${c('.gitignore')} nhiều dòng). Luật: dòng rỗng và dòng bắt đầu ${c('#')} bỏ qua; mẫu kết thúc ${c('/')} chỉ khớp THƯ MỤC — một đường dẫn bị bỏ qua nếu một thư mục cha của nó khớp; mẫu không chứa ${c('/')} (ngoài dấu cuối) khớp TÊN ở bất kỳ cấp nào; mẫu chứa ${c('/')} khớp từ gốc (bỏ ${c('/')} đầu nếu có); ${c('*')} khớp mọi ký tự trừ ${c('/')}. Dòng ${c('!mẫu')} bỏ-bỏ-qua. Luật SAU thắng luật trước. Trả ${c('{ ignored, rule }')} — rule là dòng luật quyết định (hoặc ${c('null')}).</p>`,
      yeuCau: ['Thư mục/, *.ext, tên trần, đường dẫn có /.', '! đảo lại.', 'Luật sau thắng.'],
      dauVao: 'path: string; gitignore: string.', dauRa: '{ ignored, rule }.',
      rangBuoc: ['Không cần ** hay [abc].'],
      viDu: [{ input: 'isIgnored(".env", "node_modules/\\n.env\\n*.log")', output: '{ ignored: true, rule: ".env" }', explanation: 'git check-ignore -v .env trong bài.' }],
      goiY: ['Sinh các "ứng viên": mọi thư mục cha (a, a/b, …) đánh dấu isDir, và chính path.', 'Mẫu → regex: thoát ký tự, * → [^/]*; không có / ⇒ so với tên cuối, có / ⇒ so với cả đường dẫn ứng viên.'],
      khoiDau: { 'main.js': `// Bài 1.3 — luật .gitignore
function isIgnored(path, gitignore) {
  return { ignored: gitignore.includes(path), rule: null };
}
` },
      loiGiai: { 'main.js': `// Bài 1.3 — duyệt mọi luật theo thứ tự; luật khớp CUỐI CÙNG quyết định (vì thế "!" ở sau mới có tác dụng)
function toRegex(glob) {
  return new RegExp('^' + glob.replace(/[.+^$(){}|[\\]\\\\]/g, '\\\\$&').replace(/\\*/g, '[^/]*') + '$');
}

function isIgnored(path, gitignore) {
  const parts = path.split('/');
  const candidates = parts.map((_, i) => ({ p: parts.slice(0, i + 1).join('/'), isDir: i < parts.length - 1 }));
  let result = { ignored: false, rule: null };
  for (const raw of gitignore.split('\\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const negate = line.startsWith('!');
    let pat = negate ? line.slice(1) : line;
    const dirOnly = pat.endsWith('/');
    if (dirOnly) pat = pat.slice(0, -1);
    const anchored = pat.includes('/');
    if (pat.startsWith('/')) pat = pat.slice(1);
    const re = toRegex(pat);
    const hit = candidates.some((cd) => (!dirOnly || cd.isDir) && re.test(anchored ? cd.p : cd.p.split('/').pop()));
    if (hit) result = { ignored: !negate, rule: line };
  }
  return result;
}
` },
      giaiThich: `<p>Đây là thứ ${c('git check-ignore -v')} in ra: luật nào, dòng nào. Luật áp cho TỆP CHƯA THEO DÕI — như bài đã cho thấy với ${c('.env')} đã lỡ commit. (Git thật còn quy tắc "không thể bỏ-bỏ-qua tệp nằm trong thư mục đã bị bỏ qua"; bài này đơn giản hoá.)</p>`,
      loiHayGap: ['"node_modules/" không khớp tệp bên trong.', '* khớp qua dấu /.', 'Luật đầu tiên thắng.'],
      thamKhao: 'https://git-scm.com/docs/gitignore#_pattern_format',
      kiem: [
        { moTa: 'The lesson\'s .gitignore|||.gitignore trong bài', goi: '(() => { const g = "node_modules/\\n.env\\n*.log"; return [isIgnored(".env", g), isIgnored("npm-debug.log", g), isIgnored("node_modules/left-pad/index.js", g), isIgnored("index.html", g)]; })()', mongDoi: [{ ignored: true, rule: '.env' }, { ignored: true, rule: '*.log' }, { ignored: true, rule: 'node_modules/' }, { ignored: false, rule: null }] },
        { moTa: 'Comments, any level, anchored paths|||Chú thích, mọi cấp, đường dẫn neo gốc', goi: '(() => { const g = "# build output\\ndist/\\n/config/local.json\\n*.tmp"; return [isIgnored("src/dist/a.js", g).ignored, isIgnored("config/local.json", g).ignored, isIgnored("src/config/local.json", g).ignored, isIgnored("a/b/c.tmp", g).ignored, isIgnored("dist", g).ignored]; })()', mongDoi: [true, true, false, true, false] },
        { moTa: 'Negation and last rule wins|||Đảo luật và luật sau thắng', goi: '(() => { const g = "*.env\\n!.env.example"; return [isIgnored(".env", g), isIgnored(".env.example", g), isIgnored("prod.env", "!prod.env\\n*.env")]; })()', mongDoi: [{ ignored: true, rule: '*.env' }, { ignored: false, rule: '!.env.example' }, { ignored: true, rule: '*.env' }] },
      ],
    },
    {
      tieuDe: 'git diff theo dòng',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['diff', 'dãy con chung dài nhất'], tienQuyet: ['mảng 2 chiều', 'vòng lặp'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('lineDiff(oldText, newText)')} trả mảng dòng dạng diff: ${c('" dòng"')} (giữ nguyên), ${c('"-dòng"')} (bị xoá), ${c('"+dòng"')} (được thêm), dựa trên dãy con chung dài nhất (LCS) của hai mảng dòng. Khi cùng vị trí có cả xoá và thêm, xoá đứng TRƯỚC thêm. Hai văn bản giống hệt ⇒ toàn dòng ${c('" "')}. Văn bản rỗng ${c('""')} là KHÔNG dòng nào.</p>`,
      yeuCau: ['Dựa trên LCS.', 'Xoá trước thêm.', 'Văn bản rỗng = 0 dòng.'],
      dauVao: 'oldText, newText: string.', dauRa: 'string[].',
      rangBuoc: ['Tối đa vài trăm dòng — O(n·m) là đủ.'],
      viDu: [{ input: 'lineDiff("<h1>My shop</h1>", "<h1>My shop</h1>\\n<p>Opening soon</p>")', output: '[" <h1>My shop</h1>", "+<p>Opening soon</p>"]', explanation: 'Đúng phần thân của git diff trong bài.' }],
      goiY: ['L[i][j] = độ dài LCS của a[i..] và b[j..]: a[i] === b[j] ? 1 + L[i+1][j+1] : max(L[i+1][j], L[i][j+1])', 'Đi từ (0,0): bằng nhau ⇒ " "; L[i+1][j] >= L[i][j+1] ⇒ "-a[i]"; ngược lại "+b[j]".'],
      khoiDau: { 'main.js': `// Bài 1.3 — diff theo dòng
function lineDiff(oldText, newText) {
  return newText.split('\\n').map((l) => '+' + l);
}
` },
      loiGiai: { 'main.js': `// Bài 1.3 — bảng LCS rồi đi một đường từ đầu: giữ dòng chung, còn lại là xoá (trước) hoặc thêm
function lineDiff(oldText, newText) {
  const a = oldText === '' ? [] : oldText.split('\\n');
  const b = newText === '' ? [] : newText.split('\\n');
  const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      L[i][j] = a[i] === b[j] ? 1 + L[i + 1][j + 1] : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { out.push(' ' + a[i]); i++; j++; }
    else if (j >= b.length || (i < a.length && L[i + 1][j] >= L[i][j + 1])) { out.push('-' + a[i]); i++; }
    else { out.push('+' + b[j]); j++; }
  }
  return out;
}
` },
      giaiThich: `<p>Git chỉ lưu ảnh chụp toàn bộ; ${c('git diff')} TÍNH sự khác biệt mỗi lần bạn hỏi, bằng thuật toán họ hàng với LCS (Myers). Đó cũng là cơ sở của gộp ba bên ở Bài 10.3.</p>`,
      loiHayGap: ['"" thành một dòng rỗng.', 'Thêm trước xoá.', 'So từng vị trí thay vì LCS — một dòng chèn làm mọi dòng sau "khác".'],
      thamKhao: 'https://en.wikipedia.org/wiki/Longest_common_subsequence',
      kiem: [
        { moTa: 'The lesson\'s diff|||diff trong bài', goi: 'lineDiff("<h1>My shop</h1>", "<h1>My shop</h1>\\n<p>Opening soon</p>")', mongDoi: [' <h1>My shop</h1>', '+<p>Opening soon</p>'] },
        { moTa: 'An insertion does not shift everything|||Chèn một dòng không làm lệch mọi dòng', goi: 'lineDiff("a\\nb\\nc\\nd", "a\\nX\\nb\\nc\\nd")', mongDoi: [' a', '+X', ' b', ' c', ' d'] },
        { moTa: 'Change = delete then add; empty texts|||Sửa = xoá rồi thêm; văn bản rỗng', goi: '[lineDiff("x\\nold\\ny", "x\\nnew\\ny"), lineDiff("", "a"), lineDiff("a", "a")]', mongDoi: [[' x', '-old', '+new', ' y'], ['+a'], [' a']] },
      ],
    },
    {
      tieuDe: 'Chặn bí mật trước khi commit',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['pre-commit hook', 'diff đã stage'], tienQuyet: ['regex', 'split'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('scanStaged(diff)')} đọc output của ${c('git diff --staged')}. Theo dõi tệp hiện tại qua dòng ${c('"+++ b/<tệp>"')} và số dòng mới qua ${c('"@@ -a,b +c,d @@"')} (dòng thêm/giữ đầu tiên của khối là dòng c). Với mỗi dòng THÊM (bắt đầu ${c('+')} nhưng không phải ${c('+++')}), báo nếu: tệp tên là ${c('.env')} hoặc kết thúc ${c('.env')} hoặc ${c('.pem')} ⇒ ${c('"<tệp>: secret file"')} (một lần mỗi tệp); dòng chứa ${c('<TÊN>=<giá trị>')} với TÊN (không phân biệt hoa) chứa ${c('KEY, SECRET, TOKEN, PASSWORD')} và giá trị dài ≥ 6 ký tự, KHÔNG bắt đầu bằng ${c('process.env')} (đọc từ biến môi trường là cách đúng) ⇒ ${c('"<tệp>:<dòng>: possible secret <TÊN>"')}. Trả ${c('{ ok, problems }')}.</p>`,
      yeuCau: ['Theo dõi tệp và số dòng.', 'Tệp bí mật báo một lần.', 'Chỉ xét dòng thêm.'],
      dauVao: 'diff: string.', dauRa: '{ ok, problems }.',
      rangBuoc: ['Dòng xoá (-) không tăng số dòng mới; dòng giữ ( ) và thêm (+) thì tăng.'],
      viDu: [{ input: 'scanStaged(diff thêm .env với API_KEY=dev-only-123)', output: '{ ok: false, problems: [".env: secret file", ".env:1: possible secret API_KEY"] }', explanation: 'Đúng lỗi "commit .env trước khi có .gitignore" trong bài.' }],
      goiY: ['const hunk = /^@@ -\\d+(?:,\\d+)? \\+(\\d+)/.exec(line); if (hunk) lineNo = Number(hunk[1]);', '/\\b([A-Za-z_]*(?:KEY|SECRET|TOKEN|PASSWORD)[A-Za-z_]*)\\s*=\\s*(\\S{6,})/i'],
      khoiDau: { 'main.js': `// Bài 1.3 — chặn bí mật trước khi commit
function scanStaged(diff) {
  return { ok: true, problems: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 1.3 — đọc diff đã stage như một hook pre-commit: tệp nào, dòng mới số mấy, dòng thêm có gì
const SECRET_FILE = /(^|\\/)(\\.env|[^/]*\\.env|[^/]*\\.pem)$/;
const ASSIGN = /\\b([A-Za-z_]*(?:KEY|SECRET|TOKEN|PASSWORD)[A-Za-z_]*)\\s*=\\s*(\\S{6,})/i;

function scanStaged(diff) {
  const problems = [];
  let file = null, lineNo = 0;
  const flagged = new Set();
  for (const line of diff.split('\\n')) {
    if (line.startsWith('+++ ')) { file = line.replace(/^\\+\\+\\+ (b\\/)?/, ''); continue; }
    if (line.startsWith('--- ')) continue;
    const hunk = /^@@ -\\d+(?:,\\d+)? \\+(\\d+)/.exec(line);
    if (hunk) { lineNo = Number(hunk[1]); continue; }
    if (line.startsWith('+')) {
      if (SECRET_FILE.test(file) && !flagged.has(file)) { problems.push(file + ': secret file'); flagged.add(file); }
      const m = ASSIGN.exec(line.slice(1));
      if (m && !m[2].startsWith('process.env')) problems.push(file + ':' + lineNo + ': possible secret ' + m[1]);
      lineNo++;
    } else if (line.startsWith(' ')) {
      lineNo++;
    }
  }
  return { ok: problems.length === 0, problems };
}
` },
      giaiThich: `<p>Bài học: đã commit thì bí mật ở lại lịch sử. Chặn TRƯỚC khi commit — trong hook ${c('pre-commit')} — là cách rẻ nhất; chính kho mã của khoá này chạy một bộ quét như vậy (gitleaks) trước mỗi commit.</p>`,
      loiHayGap: ['Tính cả dòng "+++".', 'Tăng số dòng ở dòng xoá.', 'Báo cùng tệp .env nhiều lần.'],
      thamKhao: 'https://git-scm.com/docs/githooks#_pre_commit',
      kiem: [
        { moTa: 'A committed .env|||Một .env bị commit', goi: 'scanStaged(["diff --git a/.env b/.env", "new file mode 100644", "--- /dev/null", "+++ b/.env", "@@ -0,0 +1,2 @@", "+API_KEY=dev-only-123", "+DEBUG=true"].join("\\n"))', mongDoi: { ok: false, problems: ['.env: secret file', '.env:1: possible secret API_KEY'] } },
        { moTa: 'Line numbers across a hunk|||Số dòng trong một khối', goi: 'scanStaged(["--- a/src/config.js", "+++ b/src/config.js", "@@ -10,3 +10,4 @@", " const port = 3000;", "-const old = 1;", "+const dbPassword = process.env.DB_PASSWORD;", "+const stripeSecret = \\"sk_test_abcdef\\";", " export default {};"].join("\\n"))', mongDoi: { ok: false, problems: ['src/config.js:12: possible secret stripeSecret'] } },
        { moTa: 'Clean diffs pass|||Diff sạch thì qua', goi: 'scanStaged(["--- a/index.html", "+++ b/index.html", "@@ -1 +1,2 @@", " <h1>My shop</h1>", "+<p>Opening soon</p>", "-TOKEN=removed-line-is-fine"].join("\\n"))', mongDoi: { ok: true, problems: [] } },
      ],
    },
    {
      tieuDe: 'Một git thu nhỏ với ba vùng',
      doKho: 'HARD', phut: 35,
      khaiNiem: ['working tree / index / HEAD', 'ảnh chụp'], tienQuyet: ['object', 'spread'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('createRepo()')} trả một object với ba vùng là object ${c('{ tên tệp: nội dung }')}: thư mục làm việc, stage (index), và HEAD (ảnh chụp của commit mới nhất, ban đầu ${c('{}')}). Phương thức: ${c('write(f, text)')}, ${c('remove(f)')} (xoá khỏi thư mục làm việc); ${c('add(f)')} (đưa nội dung hiện tại — hoặc việc xoá — vào stage; tệp không tồn tại ở cả hai ⇒ ném ${c('Error("pathspec \'<f>\' did not match any files")')}); ${c('commit(msg)')} (stage giống HEAD ⇒ ném ${c('Error("nothing to commit")')}; ngược lại lưu ảnh chụp mới, mã = ${c('"c1"')}, ${c('"c2"')}…, trả mã); ${c('status()')} trả MẢNG dòng ${c('git status --short')} sắp theo tên tệp (X: so stage với HEAD — A/M/D; Y: so thư mục làm việc với stage — M/D; tệp chỉ có trong thư mục làm việc ⇒ ${c('??')}); ${c('restore(f)')} (thư mục làm việc ← stage); ${c('restoreStaged(f)')} (stage ← HEAD); ${c('log()')} trả ${c('["c2 msg", "c1 msg"]')}; ${c('show(ref, f)')} với ref ${c('"HEAD"')}/${c('"HEAD~n"')} trả nội dung tệp trong commit đó (không có ⇒ ${c('undefined')}).</p>`,
      yeuCau: ['Ba vùng tách biệt.', 'status đúng XY.', 'restore và restore --staged.', 'show của commit cũ.'],
      dauVao: 'lời gọi phương thức.', dauRa: 'như mô tả.',
      rangBuoc: ['Ảnh chụp phải là bản sao — sửa sau khi commit không đổi lịch sử.'],
      viDu: [{ input: 'r.write("index.html", "<h1>My shop</h1>"); r.status()', output: '["?? index.html"]', explanation: 'Đúng git status sau khi tạo tệp trong bài.' }],
      goiY: ['const work = {}, index = {}; let head = {}; const commits = [];', 'status: với mỗi tên trong hợp của ba vùng: x = !(f in head) && f in index ? "A" : f in head && !(f in index) ? "D" : head[f] !== index[f] ? "M" : " " …'],
      khoiDau: { 'main.js': `// Bài 1.3 — một git thu nhỏ
function createRepo() {
  const files = {};
  return {
    write(f, t) { files[f] = t; },
    add() {},
    commit() { return 'c1'; },
    status() { return []; },
  };
}
` },
      loiGiai: { 'main.js': `// Bài 1.3 — ba vùng = ba object; add chép working → index, commit chụp index → lịch sử
function createRepo() {
  const work = {}, index = {};
  const commits = [];                                   // { id, msg, snap }, mới nhất ở cuối
  const head = () => (commits.length ? commits.at(-1).snap : {});
  const has = (o, f) => Object.hasOwn(o, f);

  return {
    write(f, text) { work[f] = text; },
    remove(f) { delete work[f]; },
    add(f) {
      if (has(work, f)) index[f] = work[f];
      else if (has(index, f)) delete index[f];          // add một tệp đã xoá = stage việc xoá
      else throw new Error("pathspec '" + f + "' did not match any files");
    },
    commit(msg) {
      const h = head();
      const keys = new Set([...Object.keys(h), ...Object.keys(index)]);
      if ([...keys].every((k) => has(h, k) && has(index, k) && h[k] === index[k])) throw new Error('nothing to commit');
      const id = 'c' + (commits.length + 1);
      commits.push({ id, msg, snap: { ...index } });    // bản sao: sửa về sau không đổi lịch sử
      return id;
    },
    status() {
      const h = head();
      const names = [...new Set([...Object.keys(h), ...Object.keys(index), ...Object.keys(work)])].sort();
      const out = [];
      for (const f of names) {
        if (!has(h, f) && !has(index, f)) { out.push('?? ' + f); continue; }
        const x = !has(h, f) && has(index, f) ? 'A' : has(h, f) && !has(index, f) ? 'D' : h[f] !== index[f] ? 'M' : ' ';
        const y = has(index, f) && !has(work, f) ? 'D' : has(index, f) && work[f] !== index[f] ? 'M' : ' ';
        if (x !== ' ' || y !== ' ') out.push(x + y + ' ' + f);
      }
      return out;
    },
    restore(f) { if (has(index, f)) work[f] = index[f]; else delete work[f]; },
    restoreStaged(f) { const h = head(); if (has(h, f)) index[f] = h[f]; else delete index[f]; },
    log() { return commits.map((c) => c.id + ' ' + c.msg).reverse(); },
    show(ref, f) {
      const m = /^HEAD(?:~(\\d+))?$/.exec(ref);
      const c = m ? commits[commits.length - 1 - Number(m[1] ?? 0)] : commits.find((x) => x.id === ref);
      return c ? c.snap[f] : undefined;
    },
  };
}
` },
      giaiThich: `<p>Mọi lệnh của bài đều là phép chép giữa ba object: ${c('add')} working→index, ${c('commit')} index→lịch sử, ${c('restore')} index→working, ${c('restore --staged')} HEAD→index. ${c('status')} chỉ là hai phép so sánh: index với HEAD (cột X), working với index (cột Y).</p>`,
      loiHayGap: ['Commit lưu tham chiếu thay vì bản sao.', 'status so working với HEAD trực tiếp.', 'Cho commit khi không có gì thay đổi.'],
      thamKhao: 'https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified',
      kiem: [
        { moTa: 'First commit, like the lesson|||Commit đầu, như trong bài', goi: '(() => { const r = createRepo(); r.write("index.html", "<h1>My shop</h1>"); const a = r.status(); r.add("index.html"); const b = r.status(); const id = r.commit("Add home page"); return [a, b, id, r.status(), r.log()]; })()', mongDoi: [['?? index.html'], ['A  index.html'], 'c1', [], ['c1 Add home page']] },
        { moTa: 'Three areas: M in each column, MM|||Ba vùng: M ở từng cột, MM', goi: '(() => { const r = createRepo(); r.write("a", "1"); r.add("a"); r.commit("one"); r.write("a", "2"); const s1 = r.status(); r.add("a"); const s2 = r.status(); r.write("a", "3"); const s3 = r.status(); return [s1, s2, s3]; })()', mongDoi: [[' M a'], ['M  a'], ['MM a']] },
        { moTa: 'restore, restore --staged, deletions|||restore, restore --staged, xoá', goi: '(() => { const r = createRepo(); r.write("i", "ok"); r.write("s", "css"); r.add("i"); r.add("s"); r.commit("one"); r.write("i", "BROKEN"); r.restore("i"); const a = r.status(); r.write("i", "footer"); r.add("i"); r.restoreStaged("i"); const b = r.status(); r.remove("s"); const c = r.status(); r.add("s"); return [a, b, c, r.status()]; })()', mongDoi: [[], [' M i'], [' M i', ' D s'], [' M i', 'D  s']] },
        { moTa: 'History is a copy; show; nothing to commit|||Lịch sử là bản sao; show; không có gì để commit', goi: '(() => { const r = createRepo(); r.write("s", "v1"); r.add("s"); r.commit("v1"); r.write("s", "v2"); r.add("s"); r.commit("v2"); let err; try { r.commit("again"); } catch (e) { err = e.message; } let err2; try { r.add("nope"); } catch (e) { err2 = e.message; } return [r.show("HEAD", "s"), r.show("HEAD~1", "s"), r.show("HEAD~2", "s"), err, err2]; })()', mongDoi: ['v2', 'v1', { $js: 'undefined' }, 'nothing to commit', "pathspec 'nope' did not match any files"] },
      ],
    },
  ],
});
