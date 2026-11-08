/** Node.js 3.1 — path và fs: path.parse / path.join tự viết, đọc file bằng thử-rồi-bắt ENOENT, chặn path traversal. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, goi } from './_node-c3-5.mjs';

/* ─── 1. trắc nghiệm ─── */
const E1 = cs({
  ten: '3.1 · path and fs: predict before you run', kho: 'EASY', phut: 6,
  en: 'Four questions straight from the lesson’s programs. Each answer was checked by running the code with Node 22.',
  vi: 'Bốn câu lấy thẳng từ các chương trình của bài. Mọi đáp án đã được kiểm bằng cách chạy code với Node 22.',
  cau: [
    q('c1', ['What does <code>path.join(\'/var/www\', \'uploads\', \'..\', \'images\', \'a.png\')</code> print?', '<code>path.join(\'/var/www\', \'uploads\', \'..\', \'images\', \'a.png\')</code> in ra gì?'],
      ['/var/www/images/a.png', '/var/www/uploads/../images/a.png', '/images/a.png', 'var/www/images/a.png'],
      ['join glues the pieces AND normalises them: the .. cancels uploads. It keeps the leading / because the first piece is absolute.', 'join nối các mảnh VÀ chuẩn hoá: .. triệt tiêu uploads. Nó giữ dấu / đầu vì mảnh đầu là đường tuyệt đối.']),
    q('c2', ['<code>path.join(\'/var/www\', \'/uploads\')</code> and <code>path.resolve(\'/var/www\', \'/uploads\')</code> give…', '<code>path.join(\'/var/www\', \'/uploads\')</code> và <code>path.resolve(\'/var/www\', \'/uploads\')</code> cho ra…'],
      ['/var/www/uploads and /uploads', '/var/www/uploads both times', '/uploads both times', '/var/www//uploads and /uploads'],
      ['join only glues (the double slash collapses). resolve walks right to left and stops at the first ABSOLUTE piece, so /uploads wins — one reason a user-supplied name that starts with / is dangerous.', 'join chỉ nối (dấu // gộp lại). resolve đi từ phải sang trái và dừng ở mảnh TUYỆT ĐỐI đầu tiên, nên /uploads thắng — một lý do tên do người dùng gửi mà bắt đầu bằng / là nguy hiểm.']),
    q('c3', ['When is <code>readFileSync</code> acceptable in a server?', 'Khi nào dùng <code>readFileSync</code> trong server là chấp nhận được?'],
      ['At startup, loading config before the server starts listening', 'Inside a request handler, if the file is smaller than 1 MB', 'Never — the Sync API was removed from fs in Node 22', 'Inside a handler, as long as you wrap it in try/catch'],
      ['While a Sync call runs, the whole process serves nobody. Before listen() nobody is waiting yet, so it is fine there; inside a handler it is always a bug.', 'Trong lúc lệnh Sync chạy, cả tiến trình không phục vụ ai. Trước listen() chưa ai chờ nên không sao; trong handler thì luôn là lỗi.']),
    q('c4', ['Why is <code>if (existsSync(p)) await fs.readFile(p)</code> wrong?', 'Vì sao <code>if (existsSync(p)) await fs.readFile(p)</code> sai?'],
      ['The file can vanish between the check and the read — just read and handle ENOENT', 'existsSync throws ENOENT when the file is missing, so the if never runs', 'readFile needs an absolute path, and existsSync only accepts relative ones', 'It is correct; it is the recommended way to avoid ENOENT'],
      ['Check-then-act is a race: another process (or request) can delete the file in between, and readFile still throws. Try it, and branch on err.code.', 'Kiểm-rồi-làm là một cuộc đua: tiến trình (hay request) khác có thể xoá file ở giữa, và readFile vẫn ném lỗi. Cứ đọc, rồi rẽ nhánh theo err.code.']),
    q('c5', ['Inside Docker your app gets <code>EACCES</code> writing to <code>/app/uploads</code>. What does it most likely mean?', 'Trong Docker, app nhận <code>EACCES</code> khi ghi vào <code>/app/uploads</code>. Nhiều khả năng nhất là gì?'],
      ['The process runs as a non-root user that has no write permission there', 'The folder does not exist yet; mkdir with recursive: true fixes it', 'Too many files are open; a file handle is leaking somewhere', 'You passed a directory where a file was expected'],
      ['EACCES = permission denied. Missing folder is ENOENT, too many handles is EMFILE, file/dir confusion is EISDIR / ENOTDIR.', 'EACCES = không có quyền. Thiếu thư mục là ENOENT, quá nhiều handle là EMFILE, nhầm file/thư mục là EISDIR / ENOTDIR.']),
  ],
  goiY: [['Run the lesson’s first program in your head: what does .. do inside join?', 'Chạy chương trình đầu của bài trong đầu: .. làm gì bên trong join?'], ['Match each error code to its one-line meaning in the lesson table.', 'Ghép mỗi mã lỗi với nghĩa một dòng trong bảng của bài.']],
  loi: [['Thinking join and resolve treat an absolute second piece the same way.', 'Tưởng join và resolve xử lý mảnh thứ hai tuyệt đối giống nhau.'], ['Using existsSync “to be safe” before reading.', 'Dùng existsSync “cho chắc” trước khi đọc.']],
  tns: [tn('normalise', 'chuẩn hoá', 'remove . and .., collapse repeated slashes'), tn('race condition', 'điều kiện đua', 'the result depends on timing between two actors')],
  kn: ['path', 'fs'],
});

/* ─── 2. parsePath ─── */
function parsePath(p) {
  // the root is "/" for an absolute path, "" for a relative one
  const root = p.startsWith('/') ? '/' : '';
  // trailing slashes do not count: "notes/" is the folder "notes" (but "/" stays "/")
  let end = p.length;
  while (end > 1 && p[end - 1] === '/') end--;
  const t = p.slice(0, end);
  if (t === '/') return { root: '/', dir: '/', base: '', ext: '', name: '' };
  const cut = t.lastIndexOf('/');
  const base = t.slice(cut + 1);
  const dir = cut < 0 ? '' : cut === 0 ? '/' : t.slice(0, cut);
  // the extension starts at the LAST dot — but a leading dot (".env") is part of the name, not an extension
  const dot = base.lastIndexOf('.');
  const ext = dot <= 0 ? '' : base.slice(dot);
  const name = base.slice(0, base.length - ext.length);
  return { root, dir, base, ext, name };
}
const E2 = nodeBai({
  ten: '3.1 · Take a path apart like path.parse', kho: 'EASY', phut: 12,
  en: `<p>The lesson prints <code>path.parse('/tmp/anh/meo.jpg')</code> → <code>{"root":"/","dir":"/tmp/anh","base":"meo.jpg","ext":".jpg","name":"meo"}</code> and says: use these helpers instead of <code>split('.')</code>. To see why, write <code>parsePath(p)</code> that returns the same five fields as <code>path.posix.parse</code>:</p>
<ul><li><code>root</code>: <code>"/"</code> for an absolute path, else <code>""</code>;</li><li><code>dir</code>: everything before the last <code>/</code> (<code>"/"</code> if that slash is the first character, <code>""</code> if there is none);</li><li><code>base</code>: the last segment — trailing slashes are ignored, so <code>"notes/"</code> has base <code>"notes"</code>;</li><li><code>ext</code>: from the <b>last</b> dot of base to the end — but a dot at position 0 (<code>.env</code>) is not an extension;</li><li><code>name</code>: base without ext.</li></ul><p>Special case: <code>"/"</code> → root and dir <code>"/"</code>, the other three empty.</p>`,
  vi: `<p>Bài học in <code>path.parse('/tmp/anh/meo.jpg')</code> → <code>{"root":"/","dir":"/tmp/anh","base":"meo.jpg","ext":".jpg","name":"meo"}</code> và dặn: dùng các hàm này thay vì <code>split('.')</code>. Để thấy vì sao, viết <code>parsePath(p)</code> trả về đúng năm trường như <code>path.posix.parse</code>:</p>
<ul><li><code>root</code>: <code>"/"</code> nếu là đường tuyệt đối, ngược lại <code>""</code>;</li><li><code>dir</code>: mọi thứ trước dấu <code>/</code> cuối (<code>"/"</code> nếu dấu đó là ký tự đầu, <code>""</code> nếu không có);</li><li><code>base</code>: đoạn cuối — bỏ qua dấu / ở cuối, nên <code>"notes/"</code> có base <code>"notes"</code>;</li><li><code>ext</code>: từ dấu chấm <b>cuối</b> của base tới hết — nhưng dấu chấm ở vị trí 0 (<code>.env</code>) không phải phần mở rộng;</li><li><code>name</code>: base bỏ ext.</li></ul><p>Trường hợp riêng: <code>"/"</code> → root và dir là <code>"/"</code>, ba trường còn lại rỗng.</p>`,
  dauVao: ['p — a POSIX path (no "." or ".." segments, no repeated slashes)', 'p — đường dẫn POSIX (không có đoạn "." hay "..", không có dấu / lặp)'],
  dauRa: ['{ root, dir, base, ext, name } — all strings', '{ root, dir, base, ext, name } — đều là chuỗi'],
  goiY: [['Strip trailing slashes first, then use lastIndexOf(\'/\') once for dir/base and lastIndexOf(\'.\') once for ext.', 'Bỏ dấu / ở cuối trước, rồi dùng lastIndexOf(\'/\') một lần cho dir/base và lastIndexOf(\'.\') một lần cho ext.'], ['dot <= 0 means “no extension”: -1 is no dot, 0 is a dotfile like .env.', 'dot <= 0 nghĩa là “không có phần mở rộng”: -1 là không có dấu chấm, 0 là file ẩn như .env.']],
  loi: [['split(\'.\')[1] — "bao-cao.final.pdf" gives "final", not ".pdf".', 'split(\'.\')[1] — "bao-cao.final.pdf" cho "final", không phải ".pdf".'], ['Treating ".env" as name "" + ext ".env".', 'Coi ".env" là name "" + ext ".env".'], ['Forgetting that "notes/" ends with a slash, so base comes out empty.', 'Quên "notes/" có dấu / ở cuối nên base ra rỗng.']],
  gt: ['Every expected value here was produced by Node’s own <code>path.posix.parse</code> on the same input. The two rules people miss are the ones the lesson hints at: the extension is from the <b>last</b> dot (so <code>archive.tar.gz</code> has ext <code>.gz</code>, name <code>archive.tar</code>), and a leading dot belongs to the name.', 'Mọi giá trị mong đợi ở đây đều do chính <code>path.posix.parse</code> của Node cho ra trên cùng đầu vào. Hai luật hay bị quên là đúng hai điều bài gợi ý: phần mở rộng tính từ dấu chấm <b>cuối</b> (nên <code>archive.tar.gz</code> có ext <code>.gz</code>, name <code>archive.tar</code>), và dấu chấm ở đầu thuộc về tên.'],
  kn: ['path'], tns: [tn('extension', 'phần mở rộng', 'the part after the last dot: .pdf, .gz'), tn('dotfile', 'file ẩn (bắt đầu bằng dấu chấm)', '.env, .gitignore')],
  dau: `/** take a POSIX path apart: { root, dir, base, ext, name } */
function parsePath(p) {
  // Write your solution here — this version is the classic split() mistake
  const parts = p.split('/');
  const base = parts[parts.length - 1];
  const [name, ext] = base.split('.');
  return { root: p[0] === '/' ? '/' : '', dir: parts.slice(0, -1).join('/'), base, ext: ext ? '.' + ext : '', name };
}
`,
  giai: '// Reference solution — mirrors path.posix.parse for paths without . / .. segments\n' + nguon(parsePath),
  cases: [
    { goi: goi('parsePath', '/tmp/anh/meo.jpg'), moTa: ['The lesson’s example', 'Ví dụ của bài'] },
    { goi: goi('parsePath', 'bao-cao.final.pdf'), moTa: ['Two dots: the extension is from the last one', 'Hai dấu chấm: phần mở rộng tính từ dấu cuối'] },
    { goi: goi('parsePath', '.env'), moTa: ['A dotfile has no extension', 'File ẩn không có phần mở rộng'] },
    { goi: goi('parsePath', '/srv/archive.tar.gz'), an: true },
    { goi: goi('parsePath', 'notes/'), an: true },
    { goi: goi('parsePath', 'Makefile'), an: true },
    { goi: goi('parsePath', '/'), an: true },
    { goi: goi('parsePath', '/a/.hidden.txt'), an: true },
    { goi: goi('parsePath', 'src/app.test.mjs'), an: true },
    { goi: goi('parsePath', '/var/www/'), an: true },
  ],
});

/* ─── 3. joinPath ─── */
function joinPath(...segments) {
  // 1. glue the non-empty pieces with "/" (path.join ignores empty strings)
  const parts = segments.filter((s) => s !== '');
  if (parts.length === 0) return '.';
  const joined = parts.join('/');
  // 2. normalise: remove ".", resolve "..", collapse "//"
  const absolute = joined.startsWith('/');
  const trailing = joined.endsWith('/');
  const stack = [];
  for (const seg of joined.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      if (stack.length && stack[stack.length - 1] !== '..') stack.pop();
      else if (!absolute) stack.push('..');      // a relative path may climb above its start; "/.." is still "/"
    } else stack.push(seg);
  }
  let out = (absolute ? '/' : '') + stack.join('/');
  if (out === '') out = absolute ? '/' : '.';
  if (trailing && !out.endsWith('/')) out += '/';   // join keeps a trailing slash
  return out;
}
const E3 = nodeBai({
  ten: '3.1 · Write path.join yourself', kho: 'MEDIUM', phut: 18,
  en: `<p>The lesson’s output:</p><pre>manual  : /var/www//uploads
join    : /var/www/uploads</pre><p>Manual concatenation doubled the slash; <code>path.join</code> did not, and it also resolved <code>..</code>. Write <code>joinPath(...segments)</code> that returns exactly what <code>path.posix.join</code> returns:</p>
<ol><li>drop empty strings; if nothing is left return <code>"."</code>;</li><li>glue the rest with <code>/</code>;</li><li>normalise: skip empty and <code>.</code> segments; <code>..</code> removes the previous segment — for an absolute path it can never go above <code>/</code>, for a relative path an extra <code>..</code> is kept;</li><li>an empty result is <code>"/"</code> (absolute) or <code>"."</code> (relative); a trailing slash in the input is kept.</li></ol>`,
  vi: `<p>Output của bài:</p><pre>manual  : /var/www//uploads
join    : /var/www/uploads</pre><p>Nối chuỗi bằng tay làm dấu / bị đôi; <code>path.join</code> thì không, và còn xử lý <code>..</code>. Viết <code>joinPath(...segments)</code> trả về đúng như <code>path.posix.join</code>:</p>
<ol><li>bỏ chuỗi rỗng; không còn gì thì trả <code>"."</code>;</li><li>nối phần còn lại bằng <code>/</code>;</li><li>chuẩn hoá: bỏ đoạn rỗng và <code>.</code>; <code>..</code> xoá đoạn trước nó — với đường tuyệt đối không bao giờ lên quá <code>/</code>, với đường tương đối thì <code>..</code> thừa được giữ lại;</li><li>kết quả rỗng là <code>"/"</code> (tuyệt đối) hoặc <code>"."</code> (tương đối); dấu / ở cuối đầu vào được giữ.</li></ol>`,
  dauVao: ['segments — any number of strings', 'segments — số chuỗi tuỳ ý'],
  dauRa: ['string — the normalised POSIX path', 'chuỗi — đường POSIX đã chuẩn hoá'],
  goiY: [['Split the glued string on "/" and walk it with a stack: push names, pop on "..".', 'Tách chuỗi đã nối theo "/" rồi đi qua bằng một ngăn xếp: push tên, pop khi gặp "..".'], ['Remember the two flags before you split: does it start with "/"? does it end with "/"?', 'Nhớ hai cờ trước khi tách: có bắt đầu bằng "/" không? có kết thúc bằng "/" không?'], ['A ".." can only cancel a real name — never another ".." (relative paths like "../../x").', '".." chỉ triệt tiêu được một tên thật — không triệt tiêu một ".." khác (đường tương đối như "../../x").']],
  loi: [['parts.join(\'/\') alone: /var/www//uploads keeps the double slash.', 'Chỉ parts.join(\'/\'): /var/www//uploads giữ nguyên dấu đôi.'], ['Letting ".." climb above "/" — joinPath("/a", "../..", "b") is "/b", not "/../b".', 'Cho ".." leo quá "/" — joinPath("/a", "../..", "b") là "/b", không phải "/../b".'], ['Returning "" instead of "." for joinPath("a", "..").', 'Trả "" thay vì "." cho joinPath("a", "..").']],
  gt: ['Expected values come from Node’s own <code>path.posix.join</code>. Join is just “glue, then normalise” — the normalise step is a stack, and the only subtle parts are the edges: empty result, a relative path that climbs (<code>../../y</code>), and the trailing slash that join deliberately keeps.', 'Giá trị mong đợi lấy từ chính <code>path.posix.join</code> của Node. Join chỉ là “nối, rồi chuẩn hoá” — bước chuẩn hoá là một ngăn xếp, và chỗ tinh tế chỉ ở các biên: kết quả rỗng, đường tương đối leo lên (<code>../../y</code>), và dấu / cuối mà join cố ý giữ.'],
  kn: ['path'], tns: [tn('segment', 'đoạn đường dẫn', 'the text between two slashes'), tn('separator', 'dấu phân cách', '"/" on POSIX, "\\\\" on Windows')],
  dau: `/** path.posix.join, by hand */
function joinPath(...segments) {
  // Write your solution here — concatenation is exactly what the lesson warns against
  return segments.join('/');
}
`,
  giai: '// Reference solution — glue, then normalise with a stack\n' + nguon(joinPath),
  cases: [
    { goi: goi('joinPath', '/var/www', 'uploads', '..', 'images', 'a.png'), moTa: ['The lesson’s example', 'Ví dụ của bài'] },
    { goi: goi('joinPath', '/var/www', '/uploads'), moTa: ['No double slash', 'Không có dấu đôi'] },
    { goi: goi('joinPath', 'a', '..'), moTa: ['Empty relative result is "."', 'Kết quả tương đối rỗng là "."'] },
    { goi: goi('joinPath', '/a', '../..', 'b'), an: true },
    { goi: goi('joinPath', '..', 'x'), an: true },
    { goi: goi('joinPath'), an: true },
    { goi: goi('joinPath', 'a', '', 'b'), an: true },
    { goi: goi('joinPath', '/var/www', 'uploads/'), an: true },
    { goi: goi('joinPath', './a', './b'), an: true },
    { goi: goi('joinPath', 'a//b', '/c/'), an: true },
    { goi: goi('joinPath', '../../x', '../y'), an: true },
    { goi: goi('joinPath', 'a/../'), an: true },
  ],
});

/* ─── 4. readNote: thử rồi bắt lỗi ─── */
async function readNote(fs, name) {
  // no existsSync / stat / access first — the file could vanish in between. Just try it.
  try {
    const text = await fs.readFile(name, 'utf8');
    return { status: 200, text };
  } catch (err) {
    // translate the error codes a client should hear about; anything else is OUR bug → rethrow
    if (err.code === 'ENOENT') return { status: 404, error: 'NOT_FOUND' };
    if (err.code === 'EACCES') return { status: 403, error: 'FORBIDDEN' };
    if (err.code === 'EISDIR') return { status: 400, error: 'IS_A_DIRECTORY' };
    throw err;
  }
}
const FAKE_FS = `function mkFs(files) { var calls = [];
function fail(code, msg, p) { var e = new Error(code + ': ' + msg + ", open '" + p + "'"); e.code = code; return e; }
function look(p) { var v = files[p]; if (v === undefined) throw fail('ENOENT', 'no such file or directory', p); if (v === '#EACCES') throw fail('EACCES', 'permission denied', p); if (v === '#EMFILE') throw fail('EMFILE', 'too many open files', p); return v; }
return { calls: calls,
  readFile: function (p, enc) { calls.push('readFile ' + p); return new Promise(function (ok, no) { setTimeout(function () { try { var v = look(p); if (v === '#EISDIR') throw fail('EISDIR', 'illegal operation on a directory, read', p); ok(v); } catch (e) { no(e); } }, 2); }); },
  stat: function (p) { calls.push('stat ' + p); return new Promise(function (ok, no) { setTimeout(function () { try { var v = look(p); ok({ size: String(v).length, isDirectory: function () { return v === '#EISDIR'; } }); } catch (e) { no(e); } }, 1); }); },
  access: function (p) { calls.push('access ' + p); return this.stat(p).then(function () {}); },
}; }`;
const E4 = nodeBai({
  ten: '3.1 · Read a note without checking first', kho: 'MEDIUM', phut: 15,
  en: `<p>The lesson’s rule: <b>do not check existence, just try it and handle the failure</b>. Write <code>async readNote(fs, name)</code>, where <code>fs</code> has the same <code>readFile(path, 'utf8')</code> as <code>node:fs/promises</code> (it also has <code>stat</code> and <code>access</code> — you should not need them):</p>
<ul><li>success → <code>{ status: 200, text }</code>;</li><li><code>err.code === 'ENOENT'</code> → <code>{ status: 404, error: 'NOT_FOUND' }</code>;</li><li><code>'EACCES'</code> → <code>{ status: 403, error: 'FORBIDDEN' }</code>; <code>'EISDIR'</code> → <code>{ status: 400, error: 'IS_A_DIRECTORY' }</code>;</li><li>any other error (e.g. <code>EMFILE</code>) is not the client’s problem: <b>rethrow it</b>.</li></ul><p>The grader counts the calls you make on <code>fs</code>, and one hidden test deletes the file between a <code>stat</code> and a <code>readFile</code> — exactly the race in the lesson.</p>`,
  vi: `<p>Luật của bài: <b>đừng kiểm có tồn tại không, cứ thử rồi xử lý thất bại</b>. Viết <code>async readNote(fs, name)</code>, với <code>fs</code> có <code>readFile(path, 'utf8')</code> giống <code>node:fs/promises</code> (nó cũng có <code>stat</code> và <code>access</code> — bạn không cần tới):</p>
<ul><li>đọc được → <code>{ status: 200, text }</code>;</li><li><code>err.code === 'ENOENT'</code> → <code>{ status: 404, error: 'NOT_FOUND' }</code>;</li><li><code>'EACCES'</code> → <code>{ status: 403, error: 'FORBIDDEN' }</code>; <code>'EISDIR'</code> → <code>{ status: 400, error: 'IS_A_DIRECTORY' }</code>;</li><li>lỗi khác (vd <code>EMFILE</code>) không phải lỗi của client: <b>ném lại</b>.</li></ul><p>Máy chấm đếm các lời gọi lên <code>fs</code>, và một kiểm ẩn xoá file giữa <code>stat</code> và <code>readFile</code> — đúng cuộc đua trong bài.</p>`,
  yc: [['Call fs.readFile exactly once per call of readNote; no stat/access/exists first.', 'Mỗi lần gọi readNote chỉ gọi fs.readFile đúng một lần; không stat/access/exists trước.'], ['Branch on err.code, never on the message text.', 'Rẽ nhánh theo err.code, không theo chữ trong message.']],
  goiY: [['await inside try { } — a rejected promise becomes a throw you can catch.', 'await bên trong try { } — Promise bị reject thành một throw bắt được.'], ['In catch, compare err.code with the three known codes; the last line of catch is throw err.', 'Trong catch, so err.code với ba mã đã biết; dòng cuối của catch là throw err.']],
  loi: [['Checking with stat/access first: the file can be deleted in between, and readFile still throws — now uncaught.', 'Kiểm bằng stat/access trước: file có thể bị xoá ở giữa, và readFile vẫn ném — giờ không ai bắt.'], ['catch { return 404 } for every error: EMFILE (a handle leak on OUR side) is hidden as “not found”.', 'catch { return 404 } cho mọi lỗi: EMFILE (rò handle phía MÌNH) bị giấu thành “không tìm thấy”.'], ['Matching err.message.includes("no such file") — messages change, codes do not.', 'So err.message.includes("no such file") — thông điệp đổi được, mã thì không.']],
  gt: ['The error codes and messages of the fake fs are the real ones (<code>ENOENT: no such file or directory, open \'x\'</code>). Trying first removes the race completely: there is only one disk operation, so there is nothing to happen “in between”. Rethrowing the unknown codes keeps real bugs loud — the lesson’s EMFILE means you are leaking handles, and a 404 would bury it.', 'Mã lỗi và thông điệp của fs giả là thật (<code>ENOENT: no such file or directory, open \'x\'</code>). Thử trước loại bỏ hoàn toàn cuộc đua: chỉ có một thao tác đĩa, nên không có gì xảy ra “ở giữa”. Ném lại các mã lạ giữ cho lỗi thật luôn lộ ra — EMFILE trong bài nghĩa là bạn đang rò handle, và trả 404 sẽ chôn nó.'],
  kn: ['fs', 'error codes'], tns: [tn('ENOENT', 'không có file hay thư mục'), tn('check-then-act', 'kiểm rồi mới làm', 'two steps with a gap where the world can change'), tn('rethrow', 'ném lại', 'let an error you cannot handle continue upwards')],
  chung: FAKE_FS,
  dau: `/** read one note: 200 / 404 / 403 / 400, rethrow anything else */
async function readNote(fs, name) {
  // Write your solution here — this is the check-then-act version the lesson warns about
  try {
    await fs.access(name);
  } catch {
    return { status: 404, error: 'NOT_FOUND' };
  }
  const text = await fs.readFile(name, 'utf8');
  return { status: 200, text };
}
`,
  giai: '// Reference solution — try, then branch on err.code\n' + nguon(readNote),
  cases: [
    { chuanBi: "const fs = mkFs({ 'note.txt': 'hello' });", goi: 'Object.assign(await readNote(fs, "note.txt"), { calls: fs.calls })', moTa: ['Found: 200 and exactly one readFile call', 'Có file: 200 và đúng một lần gọi readFile'] },
    { chuanBi: 'const fs = mkFs({});', goi: 'await readNote(fs, "missing.txt")', moTa: ['ENOENT → 404', 'ENOENT → 404'] },
    { chuanBi: "const fs = mkFs({ 'secret.txt': '#EACCES' });", goi: 'await readNote(fs, "secret.txt")', moTa: ['EACCES → 403', 'EACCES → 403'] },
    { chuanBi: "const fs = mkFs({ 'uploads': '#EISDIR' });", goi: 'Object.assign(await readNote(fs, "uploads"), { calls: fs.calls })', an: true },
    { chuanBi: "const fs = mkFs({ 'a.txt': '#EMFILE' });", goi: 'await readNote(fs, "a.txt")', nem: 'Error', thongDiep: 'EMFILE', an: true },
    { chuanBi: "const files = { 'race.txt': 'soon gone' }; const fs = mkFs(files); const real = fs.stat; fs.stat = function (p) { return real(p).then(function (s) { delete files[p]; return s; }); };", goi: 'await readNote(fs, "race.txt").then((r) => r, (e) => ({ crashed: e.code }))', moTa: ['Race: the file is deleted right after stat — no crash', 'Đua: file bị xoá ngay sau stat — không sập'], an: true },
    { chuanBi: "const fs = mkFs({ 'b.txt': 'hai' });", goi: '(await readNote(fs, "b.txt"), fs.calls)', an: true },
  ],
});

/* ─── 5. safeResolve: chặn path traversal ─── */
function normalizeAbs(p) {
  // collapse "//", drop ".", resolve ".." — never above "/"
  const stack = [];
  for (const seg of p.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') stack.pop();
    else stack.push(seg);
  }
  return '/' + stack.join('/');
}
function safeResolve(root, name) {
  // path.resolve(root, name): an absolute name REPLACES the root, a relative one is appended
  const full = normalizeAbs(name.startsWith('/') ? name : root + '/' + name);
  const base = normalizeAbs(root);
  // inside means "starts with root + /" — plain startsWith(root) lets /srv/uploads-evil through
  if (!full.startsWith(base + '/')) throw new Error('invalid path');
  return full;
}
const E5 = nodeBai({
  ten: '3.1 · Stop path traversal with resolve + startsWith', kho: 'HARD', phut: 25,
  en: `<p>The lesson’s security box: <i>never do <code>path.join(uploadDir, req.params.filename)</code> with a user-supplied name</i> — <code>../../etc/passwd</code> escapes. The fix it gives:</p><pre>const full = path.resolve(uploadDir, name);
if (!full.startsWith(path.resolve(uploadDir) + path.sep)) throw new Error('invalid path');</pre><p>There is no <code>node:path</code> in the grader, so write <code>safeResolve(root, name)</code> that does exactly that on POSIX paths:</p>
<ul><li><code>root</code> is absolute. If <code>name</code> starts with <code>/</code> it <b>replaces</b> the root (that is what <code>resolve</code> does); otherwise it is appended;</li><li>normalise the result: drop empty and <code>.</code> segments, <code>..</code> removes the previous one and never goes above <code>/</code>; no trailing slash;</li><li>the result must start with <code>normalised root + "/"</code>, else <code>throw new Error('invalid path')</code>. Return the full path.</li></ul>`,
  vi: `<p>Khung bảo mật của bài: <i>đừng bao giờ <code>path.join(uploadDir, req.params.filename)</code> với tên do người dùng gửi</i> — <code>../../etc/passwd</code> thoát ra ngoài. Cách sửa bài đưa:</p><pre>const full = path.resolve(uploadDir, name);
if (!full.startsWith(path.resolve(uploadDir) + path.sep)) throw new Error('invalid path');</pre><p>Máy chấm không có <code>node:path</code>, nên hãy viết <code>safeResolve(root, name)</code> làm đúng điều đó trên đường POSIX:</p>
<ul><li><code>root</code> là đường tuyệt đối. Nếu <code>name</code> bắt đầu bằng <code>/</code> nó <b>thay</b> root (đó là việc <code>resolve</code> làm); ngược lại nó được nối vào sau;</li><li>chuẩn hoá kết quả: bỏ đoạn rỗng và <code>.</code>, <code>..</code> xoá đoạn trước và không lên quá <code>/</code>; không có dấu / ở cuối;</li><li>kết quả phải bắt đầu bằng <code>root đã chuẩn hoá + "/"</code>, ngược lại <code>throw new Error('invalid path')</code>. Trả về đường đầy đủ.</li></ul>`,
  dauVao: ['root — absolute POSIX path; name — any string from the client', 'root — đường POSIX tuyệt đối; name — chuỗi bất kỳ từ client'],
  dauRa: ['the absolute path inside root, or throw Error("invalid path")', 'đường tuyệt đối nằm trong root, hoặc ném Error("invalid path")'],
  goiY: [['Write one helper normalize(p) for absolute paths (a stack over p.split("/")) and use it on BOTH the result and the root.', 'Viết một hàm normalize(p) cho đường tuyệt đối (ngăn xếp trên p.split("/")) và dùng cho CẢ kết quả lẫn root.'], ['Do not look for ".." in the input: "2026/../cat.png" is legal and stays inside. Decide AFTER normalising.', 'Đừng tìm ".." trong đầu vào: "2026/../cat.png" hợp lệ và vẫn ở trong. Quyết định SAU khi chuẩn hoá.'], ['Try root "/srv/uploads" with name "../uploads-evil/x.png" — why does the check need the "/"?', 'Thử root "/srv/uploads" với name "../uploads-evil/x.png" — vì sao phép kiểm cần dấu "/"?']],
  loi: [['if (name.includes("..")) throw — blocks legal names and misses "/etc/passwd".', 'if (name.includes("..")) throw — chặn tên hợp lệ mà lọt "/etc/passwd".'], ['full.startsWith(root) without the separator: "/srv/uploads-evil" starts with "/srv/uploads".', 'full.startsWith(root) thiếu dấu phân cách: "/srv/uploads-evil" bắt đầu bằng "/srv/uploads".'], ['Not normalising the root: "/srv/uploads/" + "/" is "/srv/uploads//" and nothing ever matches.', 'Không chuẩn hoá root: "/srv/uploads/" + "/" thành "/srv/uploads//" và không gì khớp nổi.']],
  gt: ['Every case was compared with Node’s <code>path.posix.resolve</code> + the lesson’s check. Deciding on the <b>normalised</b> result is the whole trick: a blocklist on the raw input is always one encoding or one leading slash behind. The <code>+ path.sep</code> is not decoration — without it a sibling folder whose name starts the same way slips through.', 'Mọi ca đã được so với <code>path.posix.resolve</code> của Node + phép kiểm của bài. Quyết định trên kết quả <b>đã chuẩn hoá</b> là toàn bộ mấu chốt: danh sách chặn trên đầu vào thô luôn chậm hơn một kiểu mã hoá hay một dấu / ở đầu. <code>+ path.sep</code> không phải trang trí — thiếu nó, một thư mục anh em có tên bắt đầu giống hệt sẽ lọt qua.'],
  kn: ['path', 'security'], tns: [tn('path traversal', 'duyệt ngược thư mục', 'escaping a folder with ../'), tn('resolve', 'phân giải thành đường tuyệt đối'), tn('blocklist', 'danh sách chặn')],
  dau: `/** the full path of name inside root, or throw Error('invalid path') */
function safeResolve(root, name) {
  // Write your solution here — a blocklist on the raw input, the mistake the lesson warns about
  if (name.includes('..')) throw new Error('invalid path');
  return root + '/' + name;
}
`,
  giai: '// Reference solution — normalise first, then check "root + /"\n' + nguon(normalizeAbs, safeResolve),
  cases: [
    { goi: goi('safeResolve', '/srv/uploads', 'cat.png'), moTa: ['A plain name', 'Tên bình thường'] },
    { goi: goi('safeResolve', '/srv/uploads', '../../etc/passwd'), nem: 'Error', thongDiep: 'invalid path', moTa: ['The lesson’s attack', 'Đòn tấn công trong bài'] },
    { goi: goi('safeResolve', '/srv/uploads', '2026/../cat.png'), moTa: ['".." that stays inside is legal', '".." vẫn ở bên trong là hợp lệ'] },
    { goi: goi('safeResolve', '/srv/uploads', '/etc/passwd'), nem: 'Error', an: true },
    { goi: goi('safeResolve', '/srv/uploads', '../uploads-evil/x.png'), nem: 'Error', an: true },
    { goi: goi('safeResolve', '/srv/uploads', 'a/b/../../..'), nem: 'Error', an: true },
    { goi: goi('safeResolve', '/srv/uploads', ''), nem: 'Error', an: true },
    { goi: goi('safeResolve', '/srv/uploads/', 'x.png'), an: true },
    { goi: goi('safeResolve', '/srv/uploads', './2026//07/./a.png'), an: true },
    { goi: goi('safeResolve', '/srv/uploads', '/srv/uploads/ok.png'), an: true },
  ],
});

export default doiDau({ slug: 'nodejs-3-1-path-fs', ten: '3.1 path and fs', khoa: KHOA, baiHoc: 'nodejs-3-1-path-fs', de: [E1, E2, E3, E4, E5] });
