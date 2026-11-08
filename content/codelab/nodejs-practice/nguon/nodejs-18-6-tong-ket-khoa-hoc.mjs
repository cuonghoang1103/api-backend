/** Node.js 18.6 — Mười tám chương, một hệ thống: năm ý tưởng, nhật ký khởi động 9 dòng, danh sách kiểm 7 mục trước lần deploy production đầu tiên. */
import { modul, cs, q, qn, ord, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const Y = ['measure, do not guess', 'doing less beats going faster', 'defaults are decisions', 'types are not authorisation', 'fail loudly'];
const E1 = cs({
  ten: 'One number per chapter, five ideas', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Which of the five ideas of the course does each measured number illustrate best?',
  vi: 'Mỗi con số đã đo minh hoạ rõ nhất cho ý tưởng nào trong năm ý tưởng của khoá?',
  bang: [bang1('b1', ['Number → idea', 'Con số → ý tưởng'], [{ ma: 'x', ten: 'Measured' }, { ma: 'i', ten: 'Idea', luaChon: Y }], [
    { o: { x: 'The regexes everyone suspected were 3.2% of CPU (16.1)' }, a: { i: 'measure, do not guess' } },
    { o: { x: 'An index 657×, a cache hit 143.5×, N+1 → 2 queries 6.3×, vs a faster serialiser 1.35×' }, a: { i: 'doing less beats going faster' } },
    { o: { x: 'pino-http logged every header, tokens included; docker stop killed after 3.14 s here' }, a: { i: 'defaults are decisions' } },
    { o: { x: 'typeof threadId === "number" passed, and one user read another’s socket thread (chapter 11)' }, a: { i: 'types are not authorisation' } },
    { o: { x: 'A stale build answered 404 behind a green health check; a missing variable should exit 1 at boot' }, a: { i: 'fail loudly' } },
    { o: { x: 'A healthy p95 of 114.2 ms hid one 8,241 ms request (15.3)' }, a: { i: 'measure, do not guess' } },
  ], ['Every number came from a script that was executed, and several contradicted the documentation (Docker’s stop timeout, brotli’s highest level, the cost of AsyncLocalStorage, the shape of an “LRU” cache). When you do not know, run it.', 'Mọi con số đều đến từ một script đã thật sự chạy, và vài con số mâu thuẫn với tài liệu (thời gian dừng của Docker, mức brotli cao nhất, chi phí AsyncLocalStorage, hình dạng thật của một cache “LRU”). Khi không biết, hãy chạy thử.'])],
  goiY: [['Ask what the number refuted.', 'Hỏi con số đó đã bác bỏ điều gì.'], ['Removing work vs speeding up work.', 'Bỏ bớt việc so với làm cùng việc nhanh hơn.']],
  loi: [['Reading the table as a quiz of numbers: it is a reminder of what each chapter measured.', 'Đọc bảng như bài đố con số: nó là lời nhắc mỗi chương đã đo gì.'], ['Mixing “defaults” with “measure”: a default is a decision someone made for you.', 'Lẫn “mặc định” với “đo”: mặc định là quyết định ai đó đã làm thay bạn.']],
  tns: [tn('default', 'mặc định', 'a decision a library or platform made for you')],
  kn: ['review'],
});

const E2 = cs({
  ten: 'What a real backend does before serving one request', kho: 'EASY', phut: 5, loai: 'order',
  en: 'The production boot log of the website (3.63 s from start to “API running”), in order.',
  vi: 'Nhật ký khởi động production của website (3,63 s từ lúc chạy tới “API running”), theo thứ tự.',
  cau: [
    ord('o1', ['Each line is a chapter; order them as they appear.', 'Mỗi dòng là một chương; sắp theo thứ tự xuất hiện.'], [
      'Sentry initialised (chapter 15)',
      'Redis ready (chapter 12)',
      'Socket.IO Redis adapter attached (chapter 11)',
      'Database connected in 10 ms (chapter 7)',
      'Table and index checks OK (chapter 7)',
      'Embed queue recovery scan (chapter 13)',
      'All cron jobs registered (chapter 13, the per-process flag of 16.4)',
      'API running on port 3001 (chapters 5 and 17)',
    ], ['Read it as a checklist that ran: error tracking first (so a boot failure is reported), shared state, the database, indexes, recovery of half-done jobs, schedules — and only then accepting traffic. If boot fails, the missing line tells you where to look.', 'Đọc nó như một danh sách kiểm đã chạy: theo dõi lỗi trước (để lỗi khởi động cũng được báo), trạng thái chung, CSDL, index, phục hồi job làm dở, lịch chạy — và chỉ khi đó mới nhận lưu lượng. Nếu khởi động hỏng, dòng bị thiếu cho bạn biết phải nhìn vào đâu.']),
  ],
  goiY: [['Error tracking must exist before anything that can fail.', 'Theo dõi lỗi phải có trước mọi thứ có thể hỏng.'], ['“API running” is the last line by definition.', '“API running” là dòng cuối theo định nghĩa.']],
  loi: [['Accepting traffic before the database is connected.', 'Nhận lưu lượng trước khi CSDL kết nối.'], ['Registering cron jobs before the recovery scan.', 'Đăng ký cron trước khi quét phục hồi.']],
  tns: [tn('boot sequence', 'trình tự khởi động')],
  kn: ['review', 'operations'],
});

function bootCheck(logLines) {
  const STEPS = [
    ['Sentry initialised', 'chapter 15: error tracking (SENTRY_DSN)'],
    ['Redis ready', 'chapter 12: REDIS_URL and the redis container'],
    ['Socket.IO Redis adapter attached', 'chapter 11: the adapter needs Redis first'],
    ['Database connected', 'chapter 7 and the environment (17.4): DATABASE_URL'],
    ['Table and index checks OK', 'chapter 7: migrations (prisma migrate status)'],
    ['Embed queue recovery scan', 'chapter 13: the in-process queue'],
    ['Cron jobs registered', 'chapter 13 / 16.4: cron.service'],
    ['API running', 'chapter 5 and 17: read the error just above'],
  ];
  // Mỗi bước phải xuất hiện, và theo đúng thứ tự (tìm tiếp từ sau dòng của bước trước).
  let from = 0;
  for (const [marker, hint] of STEPS) {
    const i = logLines.findIndex((l, k) => k >= from && l.toLowerCase().includes(marker.toLowerCase()));
    if (i < 0) {
      const last = logLines.slice(from).find((l) => /\berror\b|\bfatal\b|missing/i.test(l)) || null;
      return { ok: false, missing: marker, hint, lastError: last };
    }
    from = i + 1;
  }
  return { ok: true, missing: null, hint: null, lastError: null };
}
const BOOT = ['[boot] Sentry initialised', '[boot] Redis ready', '[boot] Socket.IO Redis adapter attached', '[boot] Database connected in 10ms', '[boot] Table and index checks OK', '[boot] Embed queue recovery scan: 0 stuck', '[boot] Cron jobs registered (40)', '[boot] API running on port 3001'];
const E3 = await jsBai({
  ten: 'bootCheck(logLines): which line is missing, and which chapter to reopen', kho: 'MEDIUM', phut: 12,
  en: '<p>The boot log is a checklist that ran. Expected markers, in order: <code>Sentry initialised</code>, <code>Redis ready</code>, <code>Socket.IO Redis adapter attached</code>, <code>Database connected</code>, <code>Table and index checks OK</code>, <code>Embed queue recovery scan</code>, <code>Cron jobs registered</code>, <code>API running</code>. Write <code>bootCheck(logLines)</code>: look for each marker (case-insensitive substring) in a line <b>after</b> the line where the previous marker was found. At the first marker not found, return <code>{ ok: false, missing, hint, lastError }</code> where <code>hint</code> is its chapter hint (copy the table in the starter) and <code>lastError</code> the first line after the last found marker containing the word <code>error</code> or <code>fatal</code>, or <code>missing</code> (case-insensitive), else <code>null</code>. All found: <code>{ ok: true, missing: null, hint: null, lastError: null }</code>.</p>',
  vi: '<p>Nhật ký khởi động là một danh sách kiểm đã chạy. Các mốc mong đợi, theo thứ tự: <code>Sentry initialised</code>, <code>Redis ready</code>, <code>Socket.IO Redis adapter attached</code>, <code>Database connected</code>, <code>Table and index checks OK</code>, <code>Embed queue recovery scan</code>, <code>Cron jobs registered</code>, <code>API running</code>. Viết <code>bootCheck(logLines)</code>: tìm mỗi mốc (chuỗi con, không phân biệt hoa thường) ở một dòng <b>sau</b> dòng đã tìm thấy mốc trước. Ở mốc đầu tiên không tìm thấy, trả <code>{ ok: false, missing, hint, lastError }</code> với <code>hint</code> là gợi ý chương của nó (chép bảng trong code khởi đầu) và <code>lastError</code> là dòng đầu tiên sau mốc tìm thấy cuối cùng có chứa từ <code>error</code> hoặc <code>fatal</code>, hoặc <code>missing</code> (không phân biệt hoa thường), không có thì <code>null</code>. Tìm thấy hết: <code>{ ok: true, missing: null, hint: null, lastError: null }</code>.</p>',
  goiY: [['Keep an index from = (line of the previous marker) + 1 and search with findIndex((l, k) => k >= from && …).', 'Giữ chỉ số from = (dòng của mốc trước) + 1 và tìm bằng findIndex((l, k) => k >= from && …).'], ['The error line that explains a missing step is usually just after the last step that worked.', 'Dòng lỗi giải thích bước bị thiếu thường nằm ngay sau bước cuối cùng chạy được.']],
  loi: [['Searching the whole log for each marker: a line from a previous boot (before a restart) makes a missing step look present.', 'Tìm mỗi mốc trên toàn log: một dòng của lần khởi động trước (trước khi restart) làm bước thiếu trông như có.'], ['Reading only the last line: “API running” is absent, but the reason is several lines up.', 'Chỉ đọc dòng cuối: thiếu “API running”, nhưng lý do nằm vài dòng phía trên.']],
  gt: ['No “Database connected”? Chapter 7 and the environment (17.4). No “API running”? Read the error just above it. A container that dies at boot with its reason is a gift; reading the boot log in order turns that gift into a five-second diagnosis.', 'Không có “Database connected”? Chương 7 và môi trường (17.4). Không có “API running”? Đọc lỗi ngay phía trên. Một container chết lúc khởi động kèm lý do là món quà; đọc nhật ký khởi động theo thứ tự biến món quà đó thành một chẩn đoán năm giây.'],
  kn: ['operations', 'logs'],
  tns: [tn('boot log', 'nhật ký khởi động')],
  dau: `/** which boot step is missing? */
function bootCheck(logLines) {
  const STEPS = [
    ['Sentry initialised', 'chapter 15: error tracking (SENTRY_DSN)'],
    ['Redis ready', 'chapter 12: REDIS_URL and the redis container'],
    ['Socket.IO Redis adapter attached', 'chapter 11: the adapter needs Redis first'],
    ['Database connected', 'chapter 7 and the environment (17.4): DATABASE_URL'],
    ['Table and index checks OK', 'chapter 7: migrations (prisma migrate status)'],
    ['Embed queue recovery scan', 'chapter 13: the in-process queue'],
    ['Cron jobs registered', 'chapter 13 / 16.4: cron.service'],
    ['API running', 'chapter 5 and 17: read the error just above'],
  ];
  // Write your solution here
  const last = logLines[logLines.length - 1] || '';
  if (last.includes('API running')) return { ok: true, missing: null, hint: null, lastError: null };
  return { ok: false, missing: 'API running', hint: STEPS[7][1], lastError: last };
}
`,
  giai: '// Reference solution\n' + nguon(bootCheck),
  cases: [
    { goi: goi('bootCheck', BOOT), moTa: ['The production boot log', 'Nhật ký khởi động production'] },
    { goi: goi('bootCheck', [...BOOT.slice(0, 3), '[boot] connecting to database...', 'Error: P1001 Can\'t reach database server at db:5432', '[boot] exiting with code 1']), moTa: ['The database never answers', 'CSDL không bao giờ trả lời'] },
    { goi: goi('bootCheck', ['MISSING ENVIRONMENT VARIABLES: R2_ACCESS_KEY_ID']), an: true },
    { goi: goi('bootCheck', ['[old] Cron jobs registered (40)', '[old] API running on port 3001', ...BOOT.slice(0, 6), '[boot] TypeError: cron.schedule is not a function']), an: true },
    { goi: goi('bootCheck', [...BOOT.slice(0, 7), '[boot] listen EADDRINUSE: address already in use :::3001']), an: true },
  ],
});

function productionChecklist(c) {
  // Bảy mục, không phải bảy mươi — mỗi mục là một chương có số đo.
  const items = [
    ['secrets', [[c.secretsInImage === false, 'secrets are in the image'], [c.requiredEnvCheckedAtBoot === true, 'required env not checked at boot']]],
    ['auth', [[['argon2', 'bcrypt'].includes(c.passwordHash), 'passwords not hashed with argon2/bcrypt'], [c.jwtExpires === true, 'JWTs do not expire'], [c.authorizeEveryHandler === true, 'ownership not checked in every handler']]],
    ['input', [[c.validateBodies === true, 'bodies not validated'], [c.bodyLimit === true, 'no body size cap'], [c.redactLogs === true, 'secrets not redacted in logs']]],
    ['database', [[c.additiveMigrations === true, 'migrations not additive'], [c.indexesOnFilters === true, 'no index on filtered columns'], [c.poolMeasured === true, 'pool size not measured']]],
    ['observability', [[c.jsonLogsWithRequestId === true, 'no JSON logs with request id'], [c.externalUptimeCheck === true, 'no external uptime check'], [c.diskAlert === true, 'no disk alert']]],
    ['lifecycle', [[c.cmdExecForm === true, 'CMD is not the exec form'], [c.sigtermHandler === true, 'no SIGTERM handler'], [typeof c.stopGracePeriodSec === 'number' && c.stopGracePeriodSec > (c.slowestRequestSec || 0), 'stop_grace_period not set above the slowest request'], [c.livenessTouchesDb === false, 'liveness touches the database']]],
    ['deploy', [[c.proxyOwnsPort === true, 'no proxy owns the port'], [c.smokeTest === true, 'no smoke test'], [!!c.imageTag && c.imageTag !== 'latest', 'image tag is not immutable']]],
  ];
  const result = {};
  let passed = 0;
  for (const [name, checks] of items) {
    const problems = checks.filter(([ok]) => !ok).map(([, why]) => why);
    result[name] = problems.length ? problems : 'ok';
    if (!problems.length) passed++;
  }
  return { passed, of: items.length, items: result };
}
const SITE = { secretsInImage: false, requiredEnvCheckedAtBoot: true, passwordHash: 'bcrypt', jwtExpires: true, authorizeEveryHandler: true, validateBodies: true, bodyLimit: true, redactLogs: true, additiveMigrations: true, indexesOnFilters: true, poolMeasured: true, jsonLogsWithRequestId: true, externalUptimeCheck: false, diskAlert: true, cmdExecForm: true, sigtermHandler: true, stopGracePeriodSec: null, slowestRequestSec: 30, livenessTouchesDb: true, proxyOwnsPort: true, smokeTest: true, imageTag: '7d2e801' };
const E4 = await jsBai({
  ten: 'productionChecklist(config): seven items before your first production deploy', kho: 'HARD', phut: 25,
  en: '<p>Encode the course’s seven-item checklist. <code>config</code> describes a deployment with these fields; a check passes only when the field has exactly the stated value:</p><ol><li><b>secrets</b>: <code>secretsInImage === false</code> (“secrets are in the image”), <code>requiredEnvCheckedAtBoot === true</code> (“required env not checked at boot”);</li><li><b>auth</b>: <code>passwordHash</code> is <code>"argon2"</code> or <code>"bcrypt"</code> (“passwords not hashed with argon2/bcrypt”), <code>jwtExpires</code> (“JWTs do not expire”), <code>authorizeEveryHandler</code> (“ownership not checked in every handler”);</li><li><b>input</b>: <code>validateBodies</code> (“bodies not validated”), <code>bodyLimit</code> (“no body size cap”), <code>redactLogs</code> (“secrets not redacted in logs”);</li><li><b>database</b>: <code>additiveMigrations</code> (“migrations not additive”), <code>indexesOnFilters</code> (“no index on filtered columns”), <code>poolMeasured</code> (“pool size not measured”);</li><li><b>observability</b>: <code>jsonLogsWithRequestId</code> (“no JSON logs with request id”), <code>externalUptimeCheck</code> (“no external uptime check”), <code>diskAlert</code> (“no disk alert”);</li><li><b>lifecycle</b>: <code>cmdExecForm</code> (“CMD is not the exec form”), <code>sigtermHandler</code> (“no SIGTERM handler”), <code>stopGracePeriodSec</code> a number greater than <code>slowestRequestSec</code> (default 0) (“stop_grace_period not set above the slowest request”), <code>livenessTouchesDb === false</code> (“liveness touches the database”);</li><li><b>deploy</b>: <code>proxyOwnsPort</code> (“no proxy owns the port”), <code>smokeTest</code> (“no smoke test”), <code>imageTag</code> non-empty and not <code>"latest"</code> (“image tag is not immutable”).</li></ol><p>(Fields not marked otherwise must be <code>true</code>.) Return <code>{ passed, of: 7, items }</code>: <code>items[name]</code> is <code>"ok"</code> or the list of failure texts in the order above; <code>passed</code> counts the ok items.</p>',
  vi: '<p>Mã hoá danh sách kiểm bảy mục của khoá. <code>config</code> mô tả một lần triển khai với các trường sau; một phép kiểm chỉ đạt khi trường có đúng giá trị đã nêu:</p><ol><li><b>secrets</b>: <code>secretsInImage === false</code> (“secrets are in the image”), <code>requiredEnvCheckedAtBoot === true</code> (“required env not checked at boot”);</li><li><b>auth</b>: <code>passwordHash</code> là <code>"argon2"</code> hoặc <code>"bcrypt"</code> (“passwords not hashed with argon2/bcrypt”), <code>jwtExpires</code> (“JWTs do not expire”), <code>authorizeEveryHandler</code> (“ownership not checked in every handler”);</li><li><b>input</b>: <code>validateBodies</code> (“bodies not validated”), <code>bodyLimit</code> (“no body size cap”), <code>redactLogs</code> (“secrets not redacted in logs”);</li><li><b>database</b>: <code>additiveMigrations</code> (“migrations not additive”), <code>indexesOnFilters</code> (“no index on filtered columns”), <code>poolMeasured</code> (“pool size not measured”);</li><li><b>observability</b>: <code>jsonLogsWithRequestId</code> (“no JSON logs with request id”), <code>externalUptimeCheck</code> (“no external uptime check”), <code>diskAlert</code> (“no disk alert”);</li><li><b>lifecycle</b>: <code>cmdExecForm</code> (“CMD is not the exec form”), <code>sigtermHandler</code> (“no SIGTERM handler”), <code>stopGracePeriodSec</code> là số lớn hơn <code>slowestRequestSec</code> (mặc định 0) (“stop_grace_period not set above the slowest request”), <code>livenessTouchesDb === false</code> (“liveness touches the database”);</li><li><b>deploy</b>: <code>proxyOwnsPort</code> (“no proxy owns the port”), <code>smokeTest</code> (“no smoke test”), <code>imageTag</code> khác rỗng và khác <code>"latest"</code> (“image tag is not immutable”).</li></ol><p>(Trường không ghi khác thì phải là <code>true</code>.) Trả về <code>{ passed, of: 7, items }</code>: <code>items[tên]</code> là <code>"ok"</code> hoặc danh sách chữ lỗi theo thứ tự trên; <code>passed</code> đếm số mục ok.</p>',
  goiY: [['Describe the checklist as data: [[name, [[condition, failure text], …]], …], then loop.', 'Mô tả danh sách kiểm như dữ liệu: [[tên, [[điều kiện, chữ lỗi], …]], …], rồi lặp.'], ['Use === true / === false: a missing field must fail, not pass.', 'Dùng === true / === false: trường bị thiếu phải trượt, không được đạt.']],
  loi: [['Treating an undefined field as “not a problem”: an unknown answer to “are secrets in the image?” is a failed check.', 'Coi trường undefined là “không vấn đề”: câu trả lời không biết cho “bí mật có trong ảnh không?” là một phép kiểm trượt.'], ['Passing the grace period because it is “set”: it must be longer than the slowest request (and than the app’s own force-exit timer).', 'Cho qua thời gian ân hạn vì “đã đặt”: nó phải dài hơn request chậm nhất (và hơn hẹn giờ ép thoát của chính app).']],
  gt: ['Measured on the website on 08/11/2026, honestly: no stop_grace_period on the backend (the app waits up to 30 s), a healthcheck that runs SELECT 1, and an external monitor that would read “ok” through a database outage. Seven items, not seventy — none exotic, each learned by getting it wrong once.', 'Đo trên website ngày 08/11/2026, một cách trung thực: backend không có stop_grace_period (app chờ tới 30 s), healthcheck chạy SELECT 1, và giám sát bên ngoài sẽ đọc “ok” ngay cả khi CSDL sập. Bảy mục, không phải bảy mươi — không mục nào lạ, mỗi mục đều học được bằng một lần làm sai.'],
  kn: ['production', 'review'],
  tns: [tn('checklist', 'danh sách kiểm'), tn('immutable tag', 'thẻ bất biến')],
  dau: `/** the seven-item production checklist */
function productionChecklist(c) {
  // Write your solution here — this only checks a few fields, and treats missing ones as ok
  const items = {
    secrets: c.secretsInImage ? ['secrets are in the image'] : 'ok',
    deploy: c.imageTag === 'latest' ? ['image tag is not immutable'] : 'ok',
  };
  const passed = Object.values(items).filter((v) => v === 'ok').length;
  return { passed, of: 7, items };
}
`,
  giai: '// Reference solution\n' + nguon(productionChecklist),
  cases: [
    { goi: goi('productionChecklist', SITE), moTa: ['The website, as measured on 08/11/2026', 'Website, đo ngày 08/11/2026'] },
    { goi: goi('productionChecklist', { ...SITE, externalUptimeCheck: true, stopGracePeriodSec: 45, livenessTouchesDb: false }), moTa: ['After the three fixes', 'Sau ba bản sửa'] },
    { goi: goi('productionChecklist', {}), an: true },
    { goi: goi('productionChecklist', { ...SITE, passwordHash: 'sha256', imageTag: 'latest', stopGracePeriodSec: 30, cmdExecForm: false, secretsInImage: true }), an: true },
  ],
});

const E5 = cs({
  ten: 'After the course: what was left out, and the trap', kho: 'MEDIUM', phut: 5,
  en: 'Questions on the second part of lesson 18.6.',
  vi: 'Câu hỏi về phần hai của bài 18.6.',
  cau: [
    q('c1', ['GraphQL, gRPC, serverless, Kubernetes, event sourcing and CQRS were left out on purpose. Why?', 'GraphQL, gRPC, serverless, Kubernetes, event sourcing và CQRS được cố ý bỏ ra ngoài. Vì sao?'],
      ['None decides whether a first backend survives; they are easier once the layers underneath are measured', 'They are outdated and no longer used in production', 'They cannot run on a single VPS at all', 'They require a different programming language than Node.js'],
      ['All are real and have a place. The trap after finishing is building the same thing again with more layers — a queue for 8 ms of work, a cache in front of a 2 ms query, three services where one file would do.', 'Tất cả đều có thật và có chỗ của chúng. Cái bẫy sau khi học xong là dựng lại cùng một thứ với nhiều tầng hơn — hàng đợi cho việc 8 ms, cache trước truy vấn 2 ms, ba dịch vụ cho thứ một tệp làm được.']),
    qn('c2', ['What does the course say to carry forward? (choose all that apply)', 'Khoá học bảo mang theo điều gì? (chọn mọi câu đúng)'],
      ['When you do not know, run it', 'Carry the condition with each pattern, and measure that it holds', 'Describe your system accurately, gaps included', 'Adopt every pattern of the course in your next project, from day one'],
      [0, 1, 2],
      ['Two security holes in the real system were found not by an audit but by measuring something for a lesson. Build something real, put it in front of people, then measure it.', 'Hai lỗ hổng bảo mật trong hệ thống thật được tìm ra không phải bởi một đợt kiểm toán mà bởi việc đo một thứ cho bài học. Hãy làm một thứ thật, đưa tới người dùng thật, rồi đo nó.']),
  ],
  goiY: [['Each pattern earns its place under a condition.', 'Mỗi mẫu thiết kế có chỗ đứng dưới một điều kiện.'], ['The habit transfers; the list of tools does not.', 'Thói quen thì mang theo được; danh sách công cụ thì không.']],
  loi: [['A cache in front of a 2 ms query.', 'Cache trước một truy vấn 2 ms.'], ['Splitting into services “because the course showed how”.', 'Tách dịch vụ “vì khoá học đã chỉ cách”.']],
  tns: [tn('over-engineering', 'thiết kế quá tay')],
  kn: ['review'],
});

export default modul('nodejs-18-6-tong-ket-khoa-hoc', '18.6 Eighteen chapters, one system', [E1, E2, E5, E3, E4]);
