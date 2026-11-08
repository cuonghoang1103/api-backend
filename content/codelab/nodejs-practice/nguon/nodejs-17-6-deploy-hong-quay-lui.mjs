/** Node.js 17.6 — Khi deploy nói dối: 200/401/404/502, smoke test, build cũ, :latest, quay lui ảnh vs quay lui mã, mã ≠ CSDL, set -euo pipefail. */
import { modul, cs, q, qn, ord, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Healthy is a weaker claim than it sounds', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 17.6 and the 2026-07-02 incident (GIF picker dead, “chats disappeared”).',
  vi: 'Câu hỏi về bài 17.6 và sự cố 02/07/2026 (bộ chọn GIF chết, “tin nhắn biến mất”).',
  cau: [
    q('c1', ['Container up, health check 200, dist/routes/gifs.routes.js present in the image — and /gifs returned 404 while /messages/threads returned 401. What was wrong?', 'Container chạy, health check 200, dist/routes/gifs.routes.js có trong ảnh — vậy mà /gifs trả 404 còn /messages/threads trả 401. Sai ở đâu?'],
      ['A stale dist/index.js that never mounted /api/v1/gifs: a 404 next to a 401 is a stale build', 'The GIF route needs a token, so 404 is the normal answer without one', 'nginx cached an old 404 page for /gifs', 'The database lost the GIF table, so Express answered 404'],
      ['401 is good news: it proves the route exists. Every green signal was true for its own narrow question; none asked “is every feature I shipped reachable?”.', '401 là tin tốt: nó chứng minh route tồn tại. Mọi tín hiệu xanh đều đúng với câu hỏi hẹp của riêng nó; không cái nào hỏi “mọi tính năng tôi đưa lên có tới được không?”.']),
    q('c2', ['Why curl -s -o /dev/null -w "%{http_code}" and not the browser?', 'Vì sao dùng curl -s -o /dev/null -w "%{http_code}" mà không dùng trình duyệt?'],
      ['The browser sends cookies, follows redirects, caches, and hides the code', 'The browser cannot reach /api routes at all because of CORS rules', 'curl is faster, and in an incident every second of speed counts', 'The browser hides every status code below 500 from developers'],
      ['You are logged in, so you never see the 401 that proves the route is mounted. curl: no cookies, no cache, no redirects — just the code.', 'Bạn đang đăng nhập nên không bao giờ thấy cái 401 chứng minh route đã gắn. curl: không cookie, không cache, không chuyển hướng — chỉ có mã.']),
    q('c3', ['Yesterday latest and a1f3c9e pointed to image 8058483267b0. After today’s build latest points to 8d4484873ed5. Which rollback is possible?', 'Hôm qua latest và a1f3c9e cùng trỏ ảnh 8058483267b0. Sau bản build hôm nay latest trỏ 8d4484873ed5. Quay lui kiểu nào làm được?'],
      ['To a1f3c9e (one command); “yesterday’s latest” has no name any more', 'To latest~1, Docker keeps the previous value of every tag', 'Neither: once latest moved, yesterday’s image is deleted', 'Only a git revert, because images cannot be rolled back'],
      ['Tag every image with something that never moves (the git SHA); add latest too if you like. Measured: rollback by image 0.82 s, rebuilding the old code 5.05 s; the website: ~40 s re-tag vs a 15-minute rebuild.', 'Gắn thẻ mọi ảnh bằng thứ không bao giờ di chuyển (git SHA); thêm latest nếu muốn. Đo được: quay lui theo ảnh 0,82 s, build lại mã cũ 5,05 s; website: ~40 s gắn lại thẻ so với 15 phút build lại.']),
    qn('c4', ['Which statements are true? (choose all that apply)', 'Những câu nào đúng? (chọn mọi câu đúng)'],
      ['Reverting code does not revert the database', 'A health check runs every 15 s forever; a smoke test runs once after the deploy', 'Under pressure, roll back first and investigate afterwards', 'A smoke test should include POST-only routes like /auth/login'],
      [0, 1, 2],
      ['A GET on a POST-only route is always 404, so every deploy would fail for the wrong reason — and a check that cries wolf gets deleted within a week. Only parameter-less GETs that answer non-404 unauthenticated.', 'GET vào route chỉ có POST luôn là 404, nên mọi lần deploy sẽ hỏng vì lý do sai — và một phép kiểm báo động giả sẽ bị xoá trong một tuần. Chỉ dùng GET không tham số trả về khác 404 khi chưa đăng nhập.']),
  ],
  goiY: [['401 = mounted and wants credentials.', '401 = đã gắn và đòi thông tin đăng nhập.'], ['A tag is a pointer that moves.', 'Thẻ là một con trỏ di chuyển được.']],
  loi: [['Diagnosing a route from the browser.', 'Chẩn đoán route từ trình duyệt.'], ['Deploying only :latest.', 'Chỉ deploy :latest.']],
  tns: [tn('stale build', 'build cũ', 'the running process is older than the code you shipped'), tn('smoke test', 'smoke test', 'one request per module, once, after the deploy'), tn('rollback', 'quay lui')],
  kn: ['deployment', 'HTTP'],
});

function routeVerdict(status) {
  if (status === 200) return 'mounted (public)';
  if (status === 401 || status === 403) return 'mounted (needs credentials)';                 // tin tốt: route tồn tại
  if (status === 404) return 'NOT mounted: stale build or half-finished deploy';
  if (status === 502 || status === 503) return 'proxy alive, app not: read the container logs';
  return 'unexpected: look closer';
}
const E2 = await jsBai({
  ten: 'routeVerdict(status): the five-second diagnosis', kho: 'EASY', phut: 5,
  en: '<p>An unauthenticated curl to a route returns a status code. Write <code>routeVerdict(status)</code>: <code>200</code> → <code>"mounted (public)"</code>; <code>401</code> or <code>403</code> → <code>"mounted (needs credentials)"</code>; <code>404</code> → <code>"NOT mounted: stale build or half-finished deploy"</code>; <code>502</code> or <code>503</code> → <code>"proxy alive, app not: read the container logs"</code>; anything else → <code>"unexpected: look closer"</code>.</p>',
  vi: '<p>Một lệnh curl chưa đăng nhập vào một route trả về một mã trạng thái. Viết <code>routeVerdict(status)</code>: <code>200</code> → <code>"mounted (public)"</code>; <code>401</code> hoặc <code>403</code> → <code>"mounted (needs credentials)"</code>; <code>404</code> → <code>"NOT mounted: stale build or half-finished deploy"</code>; <code>502</code> hoặc <code>503</code> → <code>"proxy alive, app not: read the container logs"</code>; còn lại → <code>"unexpected: look closer"</code>.</p>',
  goiY: [['A chain of if statements is enough.', 'Một chuỗi if là đủ.'], ['403 behaves like 401 for this question: the route exists.', '403 cư xử như 401 với câu hỏi này: route tồn tại.']],
  loi: [['Treating 401 as a failure in a smoke test: it is the proof the route is mounted.', 'Coi 401 là lỗi trong smoke test: nó là bằng chứng route đã gắn.'], ['Treating 502 as “route missing”: the proxy is fine, the app behind it is not running.', 'Coi 502 là “thiếu route”: proxy vẫn ổn, app phía sau không chạy.']],
  gt: ['Worth memorising: it costs five seconds and answers “is my code even running?”. Today the same commands return /gifs 401, /messages/threads 401, a made-up route 404, /system/health 200.', 'Đáng học thuộc: tốn năm giây và trả lời “mã của tôi có đang chạy không?”. Hôm nay cùng các lệnh đó trả /gifs 401, /messages/threads 401, một route bịa 404, /system/health 200.'],
  kn: ['HTTP status codes', 'diagnosis'],
  tns: [tn('mounted', 'đã gắn', 'the router is registered in the running process')],
  dau: `/** what does this status tell you about the route? */
function routeVerdict(status) {
  // Write your solution here
  if (status < 400) return 'mounted (public)';
  return 'NOT mounted: stale build or half-finished deploy';
}
`,
  giai: '// Reference solution\n' + nguon(routeVerdict),
  cases: [
    { goi: '[routeVerdict(200), routeVerdict(401), routeVerdict(404)]', moTa: ['/system/health, /messages/threads, /gifs on 2026-07-02', '/system/health, /messages/threads, /gifs ngày 02/07/2026'] },
    { goi: 'routeVerdict(502)', moTa: ['11/09/2026: both domains 502', '11/09/2026: cả hai tên miền 502'] },
    { goi: '[routeVerdict(403), routeVerdict(503), routeVerdict(500), routeVerdict(301)]', an: true },
  ],
});

function smokeTest(list, statusOf) {
  const lines = [];
  let fail = false;
  for (const r of list) {
    const method = (r.method || 'GET').toUpperCase();
    // luật của danh sách: chỉ GET không tham số — POST-only hay /:id luôn 404 khi GET trơn ⇒ deploy nào cũng hỏng oan
    if (method !== 'GET' || /\/:/.test(r.path)) { lines.push(`SKIP ${r.path} — not a param-less GET`); continue; }
    const code = statusOf[r.path] ?? 404;
    if (code === 404) { lines.push(`FAIL ${r.path} 404 — stale build or half-finished deploy`); fail = true; }
    else lines.push(`ok ${r.path} ${code}`);
  }
  return { lines, exitCode: fail ? 1 : 0 };
}
const LIST = [{ path: '/api/v1/system/health' }, { path: '/api/v1/messages/threads' }, { path: '/api/v1/gifs' }, { path: '/api/v1/notes' }];
const E3 = await jsBai({
  ten: 'smokeTest(list, statusOf): fail the deploy on a 404 — and refuse routes that would cry wolf', kho: 'MEDIUM', phut: 12,
  en: '<p>Write the smoke test that runs once after every swap. <code>list</code> is <code>[{ path, method? }]</code> (method defaults to GET); <code>statusOf</code> maps a path to the code a bare curl got (a path missing from it answered 404). For each entry in order, add one line:</p><ul><li>method not GET, or a path containing a parameter (<code>/:</code>) → <code>"SKIP &lt;path&gt; — not a param-less GET"</code> (do not request it);</li><li>status 404 → <code>"FAIL &lt;path&gt; 404 — stale build or half-finished deploy"</code>;</li><li>otherwise → <code>"ok &lt;path&gt; &lt;status&gt;"</code>.</li></ul><p>Return <code>{ lines, exitCode }</code>: <code>exitCode</code> is 1 if any line is FAIL, else 0.</p>',
  vi: '<p>Viết smoke test chạy một lần sau mỗi lần tráo. <code>list</code> là <code>[{ path, method? }]</code> (method mặc định GET); <code>statusOf</code> ánh xạ đường dẫn ⇒ mã mà curl trơn nhận được (đường dẫn không có trong đó trả 404). Với mỗi mục theo thứ tự, thêm một dòng:</p><ul><li>method không phải GET, hoặc đường dẫn có tham số (<code>/:</code>) → <code>"SKIP &lt;path&gt; — not a param-less GET"</code> (không gọi nó);</li><li>status 404 → <code>"FAIL &lt;path&gt; 404 — stale build or half-finished deploy"</code>;</li><li>còn lại → <code>"ok &lt;path&gt; &lt;status&gt;"</code>.</li></ul><p>Trả về <code>{ lines, exitCode }</code>: <code>exitCode</code> là 1 nếu có dòng FAIL, không thì 0.</p>',
  goiY: [['statusOf[path] ?? 404 gives the default.', 'statusOf[path] ?? 404 cho giá trị mặc định.'], ['Only a 404 fails the deploy here; 401, 200 and others are “ok”.', 'Ở đây chỉ 404 làm hỏng deploy; 401, 200 và mã khác đều “ok”.']],
  loi: [['Failing on 401: every authenticated module would “fail” and the check gets deleted.', 'Hỏng vì 401: mọi module cần đăng nhập đều “hỏng” và phép kiểm bị xoá.'], ['Forgetting to add the new module’s route the day you add the module: the next stale build ships green.', 'Quên thêm route của module mới ngay ngày thêm module: lần build cũ tiếp theo lên xanh.']],
  gt: ['Run against the stale container: /gifs 404 with the FAIL line, exit code 1 — the whole deploy fails loudly. The website runs this over 78 routes after every swap in deploy-nha.sh, and since 11/09 also from outside, through nginx.', 'Chạy với container cũ: /gifs 404 kèm dòng FAIL, mã thoát 1 — cả lần deploy hỏng to tiếng. Website chạy đúng việc này trên 78 route sau mỗi lần tráo trong deploy-nha.sh, và từ 11/09 còn kiểm cả từ bên ngoài, qua nginx.'],
  kn: ['deployment', 'smoke test'],
  tns: [tn('exit code', 'mã thoát', '0 = success, non-zero fails the script')],
  dau: `/** post-deploy smoke test */
function smokeTest(list, statusOf) {
  // Write your solution here
  const lines = list.map((r) => 'ok ' + r.path + ' ' + (statusOf[r.path] ?? 404));
  return { lines, exitCode: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(smokeTest),
  cases: [
    { goi: goi('smokeTest', LIST, { '/api/v1/system/health': 200, '/api/v1/messages/threads': 401, '/api/v1/notes': 401 }), moTa: ['The stale container: /gifs missing', 'Container cũ: thiếu /gifs'] },
    { goi: goi('smokeTest', LIST, { '/api/v1/system/health': 200, '/api/v1/messages/threads': 401, '/api/v1/gifs': 401, '/api/v1/notes': 401 }), moTa: ['After a full rebuild', 'Sau khi build lại đầy đủ'] },
    { goi: goi('smokeTest', [{ path: '/api/v1/auth/login', method: 'POST' }, { path: '/api/v1/stickers', method: 'post' }, { path: '/api/v1/notes/:id' }, { path: '/api/v1/reports' }], {}), an: true },
    { goi: goi('smokeTest', [], {}), an: true },
    { goi: goi('smokeTest', [{ path: '/api/v1/feed', method: 'get' }], { '/api/v1/feed': 502 }), an: true },
  ],
});

function runScript(steps, flags) {
  // Mô phỏng bash: steps = [{ name, exit, pipedTo? }] — pipedTo: lệnh tee (luôn exit 0) nhận output của bước.
  // Trạng thái của một pipeline = lệnh CUỐI, trừ khi pipefail (khi đó là lệnh khác 0 nằm bên phải nhất).
  const ran = [];
  let last = 0;
  for (const s of steps) {
    ran.push(s.name);
    const status = s.pipedTo ? (flags.pipefail ? (s.exit !== 0 ? s.exit : 0) : 0) : s.exit;
    last = status;
    if (status !== 0 && flags.e) return { ran, exitCode: status };   // set -e: dừng ở lệnh hỏng đầu tiên
  }
  return { ran, exitCode: last };                                     // không -e: mã thoát của script = lệnh cuối
}
const DEPLOY = [{ name: 'build', exit: 0 }, { name: 'migrate', exit: 1, pipedTo: 'tee migrate.log' }, { name: 'swap', exit: 0 }, { name: 'smoke-test', exit: 0 }];
const E4 = await jsBai({
  ten: 'runScript(steps, flags): what set -e and pipefail really change (checked with real bash)', kho: 'MEDIUM', phut: 14,
  en: '<p>Simulate a deploy script. Each step is <code>{ name, exit, pipedTo? }</code>; <code>pipedTo</code> means the step’s output is piped into <code>tee</code> (which exits 0). <code>flags = { e, pipefail }</code> (<code>set -e</code>, <code>set -o pipefail</code>). Rules, checked with real bash: the status of a piped step is the status of the <b>last</b> command of the pipe (0 here), unless <code>pipefail</code>, then it is the step’s own non-zero exit; with <code>e</code>, the script stops right after the first step whose status is non-zero and exits with that status; without <code>e</code> every step runs and the script exits with the status of the last step. Return <code>{ ran, exitCode }</code>.</p>',
  vi: '<p>Mô phỏng một script deploy. Mỗi bước là <code>{ name, exit, pipedTo? }</code>; <code>pipedTo</code> nghĩa là output của bước được nối ống vào <code>tee</code> (luôn thoát 0). <code>flags = { e, pipefail }</code> (<code>set -e</code>, <code>set -o pipefail</code>). Luật, đã kiểm bằng bash thật: trạng thái của một bước nối ống là trạng thái của lệnh <b>cuối</b> trong ống (ở đây là 0), trừ khi <code>pipefail</code>, khi đó là mã khác 0 của chính bước; với <code>e</code>, script dừng ngay sau bước đầu tiên có trạng thái khác 0 và thoát với trạng thái đó; không có <code>e</code> thì mọi bước đều chạy và script thoát với trạng thái của bước cuối. Trả về <code>{ ran, exitCode }</code>.</p>',
  goiY: [['Compute each step’s effective status first, then decide whether to stop.', 'Tính trạng thái hiệu lực của mỗi bước trước, rồi quyết định có dừng không.'], ['Without -e the last step decides the exit code, even if an earlier one failed.', 'Không có -e thì bước cuối quyết định mã thoát, kể cả khi bước trước đã hỏng.']],
  loi: [['set -e alone with migrate | tee: the pipe reports success, the script swaps containers anyway.', 'Chỉ set -e với migrate | tee: ống báo thành công, script vẫn tráo container.'], ['No flags at all: migrate fails, swap runs, smoke test passes, exit 0 — new code on the old schema, “column does not exist”.', 'Không cờ nào: migrate hỏng, swap vẫn chạy, smoke test qua, exit 0 — mã mới trên lược đồ cũ, “column does not exist”.']],
  gt: ['Re-run for this exercise with bash: no flags → every step runs, exit 0; set -e → a piped failure is invisible, a plain one stops with 1; set -euo pipefail → stops right after the failing pipeline with 1. The most painful version is a failed migrate followed by a successful swap — every deploy script starts with set -euo pipefail.', 'Đã chạy lại bằng bash cho bài này: không cờ → mọi bước đều chạy, exit 0; set -e → lỗi trong ống bị che, lỗi thường thì dừng với 1; set -euo pipefail → dừng ngay sau pipeline hỏng với 1. Trường hợp đau nhất là migrate hỏng rồi swap thành công — script deploy nào cũng bắt đầu bằng set -euo pipefail.'],
  kn: ['bash', 'deployment'],
  tns: [tn('set -e', 'set -e', 'exit on the first failing command'), tn('pipefail', 'pipefail', 'a pipe fails if any of its commands fails')],
  dau: `/** simulate a bash deploy script */
function runScript(steps, flags) {
  // Write your solution here
  const ran = [];
  for (const s of steps) {
    ran.push(s.name);
    if (s.exit !== 0 && flags.e) return { ran, exitCode: s.exit };
  }
  return { ran, exitCode: steps.some((s) => s.exit !== 0) ? 1 : 0 };
}
`,
  giai: '// Reference solution\n' + nguon(runScript),
  cases: [
    { goi: `[runScript(${JSON.stringify(DEPLOY)}, {}), runScript(${JSON.stringify(DEPLOY)}, { e: true }), runScript(${JSON.stringify(DEPLOY)}, { e: true, pipefail: true })]`, moTa: ['The lesson’s three runs', 'Ba lượt chạy của bài'] },
    { goi: goi('runScript', [{ name: 'build', exit: 0 }, { name: 'migrate', exit: 1 }, { name: 'swap', exit: 0 }], { e: true }), moTa: ['set -e, migrate not piped', 'set -e, migrate không nối ống'] },
    { goi: goi('runScript', [{ name: 'a', exit: 0 }, { name: 'b', exit: 2 }], {}), an: true },
    { goi: goi('runScript', [{ name: 'a', exit: 3, pipedTo: 'tee a.log' }, { name: 'b', exit: 0 }], { pipefail: true }), an: true },
    { goi: goi('runScript', [{ name: 'a', exit: 0, pipedTo: 'tee a.log' }, { name: 'b', exit: 0 }], { e: true, pipefail: true }), an: true },
  ],
});

function rollbackSafety(migrations) {
  // migrations: các câu đã chạy KỂ TỪ phiên bản muốn quay về. Mã cũ chỉ chạy được nếu mọi thay đổi là "cộng thêm".
  const blockers = [];
  for (const sql of migrations) {
    const s = sql.trim().replace(/;$/, '');
    let why = null;
    if (/^DROP\s+(TABLE|COLUMN)/i.test(s) || /\bDROP\s+COLUMN\b/i.test(s)) why = 'drops data the old code reads';
    else if (/\bRENAME\b/i.test(s)) why = 'old code uses the old name';
    else if (/\bALTER\s+COLUMN\s+\S+\s+(SET\s+DATA\s+)?TYPE\b/i.test(s)) why = 'changes a type the old code expects';
    else if (/\bSET\s+NOT\s+NULL\b/i.test(s) || /\bADD\s+COLUMN\b.*\bNOT\s+NULL\b(?!.*\bDEFAULT\b)/i.test(s)) why = 'old code inserts rows without this column';
    if (why) blockers.push({ sql: s, why });
  }
  return { safe: blockers.length === 0, blockers };
}
const E5 = await jsBai({
  ten: 'rollbackSafety(migrations): is “start the previous image” safe?', kho: 'HARD', phut: 16,
  en: '<p>Code rolls back in seconds; data written in the wrong shape stays written. Given the SQL statements applied <b>since</b> the version you want to return to, decide whether the old code can run on the current schema. A statement (trailing <code>;</code> ignored, case-insensitive) is a blocker when it:</p><ul><li>drops a table or a column → <code>"drops data the old code reads"</code>;</li><li>renames anything → <code>"old code uses the old name"</code>;</li><li>changes a column type (<code>ALTER COLUMN x TYPE</code> / <code>SET DATA TYPE</code>) → <code>"changes a type the old code expects"</code>;</li><li>sets NOT NULL, or adds a NOT NULL column <b>without</b> a DEFAULT → <code>"old code inserts rows without this column"</code>.</li></ul><p>Everything else (CREATE TABLE, CREATE INDEX, ADD COLUMN nullable or with a default…) is additive. Return <code>{ safe, blockers: [{ sql, why }] }</code> in input order (<code>sql</code> trimmed, without the <code>;</code>).</p>',
  vi: '<p>Mã quay lui trong vài giây; dữ liệu đã ghi sai hình dạng thì vẫn nằm đó. Cho các câu SQL đã chạy <b>kể từ</b> phiên bản bạn muốn quay về, quyết định mã cũ có chạy được trên lược đồ hiện tại không. Một câu (bỏ <code>;</code> cuối, không phân biệt hoa thường) là vật cản khi nó:</p><ul><li>xoá bảng hoặc cột → <code>"drops data the old code reads"</code>;</li><li>đổi tên bất cứ thứ gì → <code>"old code uses the old name"</code>;</li><li>đổi kiểu cột (<code>ALTER COLUMN x TYPE</code> / <code>SET DATA TYPE</code>) → <code>"changes a type the old code expects"</code>;</li><li>đặt NOT NULL, hoặc thêm cột NOT NULL <b>không có</b> DEFAULT → <code>"old code inserts rows without this column"</code>.</li></ul><p>Mọi thứ khác (CREATE TABLE, CREATE INDEX, ADD COLUMN cho phép null hoặc có default…) là cộng thêm. Trả về <code>{ safe, blockers: [{ sql, why }] }</code> theo thứ tự đầu vào (<code>sql</code> đã cắt khoảng trắng, không có <code>;</code>).</p>',
  goiY: [['Check the rules in the listed order and stop at the first that matches for each statement.', 'Xét các luật theo thứ tự đã liệt kê và dừng ở luật khớp đầu tiên cho mỗi câu.'], ['A negative lookahead (?!.*DEFAULT) lets ADD COLUMN … NOT NULL DEFAULT … through.', 'Lookahead phủ định (?!.*DEFAULT) cho ADD COLUMN … NOT NULL DEFAULT … đi qua.']],
  loi: [['Rolling back the image after a migration that dropped a column: the old code expects it, and it is worse than the bug you were escaping.', 'Quay lui ảnh sau một migration đã xoá cột: mã cũ cần cột đó, và còn tệ hơn lỗi bạn đang tránh.'], ['Treating every ALTER TABLE as dangerous: ADD COLUMN nullable is exactly the additive step chapter 7 recommends.', 'Coi mọi ALTER TABLE là nguy hiểm: ADD COLUMN cho phép null chính là bước cộng thêm chương 7 khuyên dùng.']],
  gt: ['That is why migrations are additive: add a nullable column, write it, backfill, switch reads, and only at the very end remove — each step undoable on its own. When a blocker exists, restore the schema or roll forward with a fix; drops belong last, after nothing reads the column.', 'Đó là lý do migration phải là cộng thêm: thêm cột cho phép null, ghi vào, backfill, đổi chỗ đọc, và chỉ ở cuối cùng mới xoá — mỗi bước tự hoàn tác được. Khi có vật cản, khôi phục lược đồ hoặc sửa tiến lên; xoá phải là bước cuối, sau khi không còn gì đọc cột đó.'],
  kn: ['migrations', 'rollback', 'regex'],
  tns: [tn('additive migration', 'migration cộng thêm'), tn('roll forward', 'sửa tiến lên', 'deploy a fix instead of going back')],
  dau: `/** can the previous image run on this schema? */
function rollbackSafety(migrations) {
  // Write your solution here
  const blockers = migrations.filter((s) => /DROP TABLE/i.test(s)).map((s) => ({ sql: s.trim(), why: 'drops data the old code reads' }));
  return { safe: blockers.length === 0, blockers };
}
`,
  giai: '// Reference solution\n' + nguon(rollbackSafety),
  cases: [
    { goi: goi('rollbackSafety', ['ALTER TABLE notes ADD COLUMN summary text;', 'CREATE INDEX notes_author_idx ON notes(author_id);']), moTa: ['Only additive changes', 'Chỉ thay đổi cộng thêm'] },
    { goi: goi('rollbackSafety', ['ALTER TABLE reports ADD COLUMN owner_id int;', 'ALTER TABLE reports DROP COLUMN legacy_owner;']), moTa: ['The Reports deploy dropped a column', 'Lần deploy Reports đã xoá một cột'] },
    { goi: goi('rollbackSafety', ['alter table notes rename column body to content;', 'ALTER TABLE notes ALTER COLUMN created_at TYPE timestamptz;', 'ALTER TABLE notes ALTER COLUMN title SET NOT NULL;', '  ALTER TABLE notes ADD COLUMN status text NOT NULL DEFAULT \'draft\';  ', 'ALTER TABLE notes ADD COLUMN slug text NOT NULL;']), an: true },
    { goi: goi('rollbackSafety', ['DROP TABLE old_sessions;', 'CREATE TABLE note_shares (id serial PRIMARY KEY);']), an: true },
    { goi: goi('rollbackSafety', []), an: true },
  ],
});

const E6 = cs({
  ten: 'The deploy failed: check in this order', kho: 'EASY', phut: 4, loai: 'order',
  en: 'Lesson 17.6’s order, from the cheapest question to the decision.',
  vi: 'Thứ tự của bài 17.6, từ câu hỏi rẻ nhất tới quyết định.',
  cau: [
    ord('o1', ['Users report errors after a deploy.', 'Người dùng báo lỗi sau một lần deploy.'], [
      'docker ps — is the container running? (exit 137 = killed: OOM or grace period)',
      'docker logs --tail=50 — did it say anything as it died? (a missing env variable shows here)',
      'curl the route — 401 vs 404: is the module mounted?',
      'prisma migrate status — did the migrations apply? (P3009 blocks every later deploy)',
      'Still nothing: roll back first, then reproduce somewhere that is not production',
    ], ['Every minute spent finding the cause in production is a minute of outage. Roll back, confirm healthy, then investigate.', 'Mỗi phút tìm nguyên nhân trên production là một phút sự cố. Quay lui, xác nhận khoẻ, rồi mới điều tra.']),
  ],
  goiY: [['Cheapest, broadest question first.', 'Câu hỏi rẻ nhất, rộng nhất trước.'], ['Rolling back is the last step of the checklist, not the first move.', 'Quay lui là bước cuối của danh sách, không phải nước đi đầu tiên.']],
  loi: [['Starting with the migrations when the container is not even running.', 'Bắt đầu từ migration khi container còn chưa chạy.'], ['Investigating for an hour before rolling back.', 'Điều tra một tiếng rồi mới quay lui.']],
  tns: [tn('P3009', 'P3009', 'Prisma: a failed migration blocks the next ones')],
  kn: ['incident response'],
});

export default modul('nodejs-17-6-deploy-hong-quay-lui', '17.6 When the deploy lies: smoke tests and rollback', [E1, E6, E2, E3, E4, E5]);
