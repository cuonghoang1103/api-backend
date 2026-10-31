/** API Design · 0.2 — Bộ công cụ: mười cờ curl, bẫy PowerShell/dấu nháy, HTTPie/Postman/Bruno; tự viết buildCurl. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Cờ curl ── */
const NGHIA = ['include response headers', 'show the full exchange, both directions', 'choose the method', 'add a header (repeatable)', 'send JSON + set Content-Type and Accept', 'HEAD: status and headers only', 'silent: no progress meter', 'print chosen facts after the transfer', 'follow redirects (3xx)', 'write the body to a file'];
const CO = ['-i', '-v', '-X', '-H', '--json', '-I', '-s', '-w', '-L', '-o'];
const T1 = cs({
  ten: 'Tools 1 — The ten curl flags', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Lesson 0.2 says ten curl flags are enough for the whole course. Match each task to the flag.',
  vi: 'Bài 0.2 nói mười cờ curl là đủ cho cả khoá. Ghép mỗi việc với cờ tương ứng.',
  bang: [bang1('b1', ['Task → flag', 'Việc → cờ'], [{ ma: 'x', ten: 'Task' }, { ma: 'f', ten: 'Flag', luaChon: CO }], NGHIA.map((n, i) => ({ o: { x: n }, a: { f: CO[i] } })),
    ['-i vs -v: -i shows the response headers, -v also shows what you sent. -I (capital) is a different request (HEAD). --json needs curl ≥ 7.82 and replaces -H Content-Type + -H Accept + -d.', '-i và -v: -i hiện header của response, -v hiện thêm cả thứ bạn gửi. -I (hoa) là một request khác (HEAD). --json cần curl ≥ 7.82 và thay cho -H Content-Type + -H Accept + -d.'])],
  goiY: [['Lower-case -i and upper-case -I are different flags.', '-i thường và -I hoa là hai cờ khác nhau.'], ['-o /dev/null + -w "%{http_code}" is the smoke-test pattern.', '-o /dev/null + -w "%{http_code}" là mẫu smoke test.']],
  loi: [['Using -I when you wanted to see headers of a GET: -I changes the method to HEAD.', 'Dùng -I khi muốn xem header của GET: -I đổi phương thức sang HEAD.'], ['Writing -H "Content-Type: application/json" and forgetting the body flag.', 'Viết -H "Content-Type: application/json" mà quên cờ body.']],
  tns: [tn('flag', 'cờ (tuỳ chọn dòng lệnh)'), tn('smoke test', 'kiểm tra nhanh còn sống')],
  kn: ['curl'],
});

/* ── 2. Bẫy ── */
const T2 = cs({
  ten: 'Tools 2 — Traps in real terminals', kho: 'MEDIUM', phut: 10,
  en: 'Each situation happened while students followed the lessons. Choose the real cause.',
  vi: 'Mỗi tình huống đã xảy ra khi sinh viên làm theo bài. Chọn nguyên nhân thật.',
  cau: [
    q('c1', ['On Windows PowerShell 5.1, curl -i http://localhost:4000/labs complains about a parameter “i”. Why?', 'Trên Windows PowerShell 5.1, curl -i http://localhost:4000/labs báo lỗi tham số "i". Vì sao?'], ['curl there is an alias of Invoke-WebRequest; type curl.exe for the real curl', 'Windows does not support HTTP/1.1', 'The LabFlow server rejected the -i flag', 'PowerShell needs administrator rights to open port 4000'], ['Microsoft documents curl, wget and iwr as aliases of Invoke-WebRequest in PowerShell 5.1. curl.exe ships with Windows 10/11. PowerShell 7 removed the alias.', 'Microsoft ghi rõ curl, wget và iwr là bí danh của Invoke-WebRequest trong PowerShell 5.1. curl.exe có sẵn trên Windows 10/11. PowerShell 7 đã bỏ bí danh này.']),
    q('c2', ['In zsh: curl --json "{"labId":"lab_1"}" … — the mirror server shows body {labId:lab_1}. Cause?', 'Trong zsh: curl --json "{"labId":"lab_1"}" … — máy gương hiện body {labId:lab_1}. Nguyên nhân?'], ['The shell ate the inner double quotes; use single quotes outside', 'curl strips quotes from JSON on purpose', 'Express removed the quotes when parsing', 'zsh cannot send JSON at all'], ['Each inner " closes/opens a shell string, so it is removed before curl sees it. Single quotes outside, double inside — or @file.', 'Mỗi dấu " bên trong đóng/mở một chuỗi shell nên bị bỏ trước khi curl thấy. Nháy đơn bên ngoài, nháy kép bên trong — hoặc dùng @file.']),
    q('c3', ['curl http://localhost:4000/labs?building=Alpha&minCapacity=25 (no quotes) prints a job number and the filter is ignored. Why?', 'curl http://localhost:4000/labs?building=Alpha&minCapacity=25 (không có nháy) in ra số job và bộ lọc bị bỏ qua. Vì sao?'], ['& sent curl to the background and cut the URL; quote the whole URL', 'The server only accepts one query parameter', 'curl does not support query strings', 'minCapacity must be written in upper case'], ['In the shell, & means “run in background” and ? is a glob character. Always quote URLs with a query.', 'Trong shell, & nghĩa là "chạy nền" và ? là ký tự glob. Luôn đặt URL có query trong nháy.']),
    q('c4', ['You need the team to share requests through git and review them in pull requests. Which tool fits best?', 'Nhóm cần chia sẻ request qua git và review trong pull request. Công cụ nào hợp nhất?'], ['Bruno — collections are plain files in the repo', 'Postman — collections live in a cloud workspace', 'The browser address bar', 'HTTPie — it re-sorts headers in its output'], ['Bruno stores each request as a text file next to your code, so git diff and review work. Postman syncs to its cloud workspace instead.', 'Bruno lưu mỗi request thành một tệp chữ cạnh code, nên git diff và review dùng được. Postman thì đồng bộ lên workspace đám mây.']),
    q('c5', ['HTTPie shows headers in a different order from curl -i for the same response. Which output reflects the bytes on the wire?', 'HTTPie hiện header khác thứ tự với curl -i cho cùng response. Output nào phản ánh đúng byte trên đường truyền?'], ['curl -i — HTTPie formats and re-sorts what it prints', 'HTTPie — curl re-sorts headers alphabetically', 'Neither — HTTP has no header order', 'Both — the server sends two orders'], ['HTTPie pretty-prints for humans. When the exact message matters (debugging, a bug report), use curl -i or -v.', 'HTTPie trình bày đẹp cho người đọc. Khi cần chính xác thông điệp (gỡ lỗi, báo lỗi), dùng curl -i hoặc -v.']),
  ],
  goiY: [['When output looks impossible, suspect the shell before the server.', 'Khi output trông vô lý, hãy nghi shell trước server.'], ['Use the mirror server (echo.mjs) to see what really arrived.', 'Dùng máy gương (echo.mjs) để xem thật sự cái gì tới nơi.']],
  loi: [['Blaming the API for a 400 that the shell caused.', 'Đổ lỗi cho API về một lỗi 400 do shell gây ra.'], ['Using Invoke-WebRequest output to read status lines.', 'Đọc dòng trạng thái từ output của Invoke-WebRequest.']],
  tns: [tn('alias', 'bí danh'), tn('quoting', 'đặt trong dấu nháy'), tn('collection', 'bộ sưu tập request')],
  kn: ['shell', 'API clients'],
});

/* ── 3. Tự viết: buildCurl ── */
function buildCurl(req) {
  var q = function (s) { return "'" + String(s).replace(/'/g, "'\\''") + "'"; }; // safe single quotes for bash/zsh
  var parts = ['curl', '-i'];
  var hasBody = req.json !== undefined;
  var method = (req.method || (hasBody ? 'POST' : 'GET')).toUpperCase();
  if (method !== (hasBody ? 'POST' : 'GET')) parts.push('-X', method);
  Object.keys(req.headers || {}).forEach(function (k) { parts.push('-H', q(k + ': ' + req.headers[k])); });
  if (hasBody) parts.push('--json', q(JSON.stringify(req.json)));
  parts.push(q(req.url));
  return parts.join(' ');
}
const T3 = jsBai({
  ten: 'Tools 3 — Write buildCurl(req): a copy-pasteable command', kho: 'MEDIUM', phut: 15,
  en: `<p>Bug reports and API docs need one line anyone can paste. Write <code>buildCurl(req)</code> for <code>req = { method?, url, headers?, json? }</code> that returns a curl command for bash/zsh, in exactly this order:</p><ol>
<li><code>curl -i</code></li>
<li><code>-X METHOD</code> only when needed: the default is <code>POST</code> when there is a <code>json</code> body, otherwise <code>GET</code>. Method is upper-cased.</li>
<li>one <code>-H 'Name: value'</code> per header, in object order</li>
<li><code>--json '…'</code> with <code>JSON.stringify(json)</code> when <code>json</code> is present (even <code>null</code> or <code>false</code>)</li>
<li>the URL in single quotes (it may contain <code>?</code> and <code>&amp;</code>)</li></ol>
<p>Every quoted piece must survive a single quote inside it: write <code>'</code> as <code>'\\''</code> (close, escaped quote, reopen) — e.g. a purpose like <code>Cường's lab</code>.</p>`,
  vi: `<p>Báo lỗi và tài liệu API cần một dòng ai cũng dán được. Viết <code>buildCurl(req)</code> với <code>req = { method?, url, headers?, json? }</code>, trả về lệnh curl cho bash/zsh, đúng thứ tự:</p><ol>
<li><code>curl -i</code></li>
<li><code>-X METHOD</code> chỉ khi cần: mặc định là <code>POST</code> khi có body <code>json</code>, ngược lại <code>GET</code>. Phương thức viết hoa.</li>
<li>mỗi header một <code>-H 'Name: value'</code>, theo thứ tự trong object</li>
<li><code>--json '…'</code> với <code>JSON.stringify(json)</code> khi có <code>json</code> (kể cả <code>null</code> hay <code>false</code>)</li>
<li>URL trong nháy đơn (có thể chứa <code>?</code> và <code>&amp;</code>)</li></ol>
<p>Mọi phần trong nháy phải chịu được dấu nháy đơn bên trong: viết <code>'</code> thành <code>'\\''</code> (đóng, nháy thoát, mở lại) — ví dụ mục đích <code>Cường's lab</code>.</p>`,
  dauVao: ['req — { method?, url, headers?, json? }', 'req — { method?, url, headers?, json? }'],
  dauRa: ['One command string, parts separated by one space.', 'Một chuỗi lệnh, các phần cách nhau một dấu cách.'],
  goiY: [['Collect the parts in an array and join(" ") at the end.', 'Gom các phần vào một mảng rồi join(" ") ở cuối.'], ['Test for a body with req.json !== undefined — null is a valid JSON body.', 'Kiểm có body bằng req.json !== undefined — null là body JSON hợp lệ.']],
  loi: [['Always writing -X POST together with --json: harmless but noisy, and the task says “only when needed”.', 'Luôn viết -X POST kèm --json: vô hại nhưng thừa, và đề nói "chỉ khi cần".'], ['Using double quotes: $ and ! inside the body get expanded by the shell.', 'Dùng nháy kép: $ và ! trong body bị shell khai triển.']],
  gt: ['--json already implies POST, so -X appears only for PUT/PATCH/DELETE or a GET-with-body edge case. Single quotes stop the shell from touching anything inside; the only character they cannot contain is the single quote itself, hence the \'\\\'\' trick.', '--json đã ngầm là POST, nên -X chỉ xuất hiện với PUT/PATCH/DELETE hoặc trường hợp hiếm GET có body. Nháy đơn chặn shell đụng vào mọi thứ bên trong; ký tự duy nhất nó không chứa được là chính dấu nháy đơn, nên mới có mẹo \'\\\'\'.'],
  kn: ['curl', 'shell quoting'],
  tns: [tn('escape', 'thoát ký tự'), tn('reproducible', 'tái hiện được')],
  dau: `/** { method?, url, headers?, json? } ⇒ "curl -i …" */
function buildCurl(req) {
  // Write your solution here
  var cmd = 'curl -i -X ' + (req.method || 'GET');
  if (req.json) cmd += " --json '" + JSON.stringify(req.json) + "'";
  return cmd + ' ' + req.url;
}
`,
  giai: '// Reference solution\n' + nguon(buildCurl),
  cases: [
    { goi: goi('buildCurl', { url: 'http://localhost:4000/labs/lab_1' }) },
    { goi: goi('buildCurl', { url: 'http://localhost:4000/bookings', headers: { Authorization: 'Bearer tok_an' }, json: { labId: 'lab_1', startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' } }) },
    { goi: goi('buildCurl', { method: 'delete', url: 'http://localhost:4000/labs/lab_3', headers: { Authorization: 'Bearer tok_lan' } }) },
    { goi: goi('buildCurl', { method: 'PATCH', url: 'http://localhost:4000/labs/lab_1', json: { capacity: 32 } }), an: true },
    { goi: goi('buildCurl', { url: 'http://localhost:4000/labs?building=Alpha&minCapacity=25' }), an: true },
    { goi: goi('buildCurl', { url: 'http://localhost:4000/bookings', json: { purpose: "Cường's lab" } }), an: true },
    { goi: goi('buildCurl', { method: 'post', url: 'http://localhost:4000/bookings/bk_1/cancel', headers: { Authorization: 'Bearer tok_an', 'Accept-Language': 'en' } }), an: true },
    { goi: goi('buildCurl', { method: 'PUT', url: 'http://localhost:4000/x', json: null }), an: true },
  ],
});

export default doiDau({ slug: 'api-0-2-bo-cong-cu', ten: '0.2 Tools: curl, HTTPie, Postman and Bruno', khoa: KHOA, baiHoc: 'api-0-2-bo-cong-cu', de: [T1, T2, T3] });
