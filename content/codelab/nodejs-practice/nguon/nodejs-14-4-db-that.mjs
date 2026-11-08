/** Node.js · 14.4 — Kiểm trên CSDL thật: repo giả nói dối về ràng buộc, 23505/22001 → 409/422, cô lập bằng giao dịch, pg_isready nói dối. */
import { modul, cs, q, tn, jsBai, c } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '14.4 · What only a real database can tell you', kho: 'EASY', phut: 10,
  en: 'A fake repository answers whatever you told it to answer. A real table has opinions: unique constraints, column widths, isolation, and a clock that keeps running between two statements.',
  vi: 'Repository giả trả lời đúng điều bạn bảo nó. Bảng thật có chính kiến: ràng buộc duy nhất, độ rộng cột, mức cô lập, và một đồng hồ vẫn chạy giữa hai câu lệnh.',
  cau: [
    q('c1', ['Five concurrent creates of the same title: the fake repo answers 201 201 201 201 201; the real table answers 500 four times and keeps one row. Why 500 and not 409?', 'Năm lần tạo đồng thời cùng một tiêu đề: repo giả trả 201 201 201 201 201; bảng thật trả 500 bốn lần và giữ một dòng. Vì sao 500 mà không phải 409?'],
      ['The INSERT failed with code 23505 but no status attached', 'PostgreSQL returns HTTP 500 for any constraint violation', 'The fake repo was still used by four of the five requests', 'The pool ran out of connections and answered 500'],
      ['The fix belongs in the repository, where the driver’s vocabulary is in scope: catch 23505, throw SLUG_TAKEN with status 409. The pre-check stays as a courtesy; the constraint is the rule.', 'Cách chữa thuộc về repository, nơi có sẵn từ vựng của driver: bắt 23505, ném SLUG_TAKEN với status 409. Phép kiểm trước giữ lại như một phép lịch sự; ràng buộc mới là luật.']),
    q('c2', ['The first two attempts to reproduce the race produced 201 409 409 409 409 — correct. What hid the bug?', 'Hai lần đầu thử tái hiện cuộc đua cho 201 409 409 409 409 — đúng. Điều gì đã che lỗi?'],
      ['Lazy connection handshakes serialised the requests by accident', 'The database was in serializable isolation by default', 'Node runs async functions one at a time, so there is no race', 'The unique index had not been created yet'],
      ['The race only appeared once five connections were opened and warmed first. A concurrency bug you cannot reproduce may be hiding behind a warm-up cost.', 'Cuộc đua chỉ hiện ra khi năm kết nối được mở và làm ấm trước. Lỗi đồng thời không tái hiện được có thể đang nấp sau một chi phí khởi động.']),
    q('c3', ['Transaction-and-rollback isolation: the app was built around the POOL, the test ran BEGIN/ROLLBACK on a client. What happens?', 'Cô lập bằng giao dịch-và-rollback: app được dựng quanh POOL, test chạy BEGIN/ROLLBACK trên một client. Chuyện gì xảy ra?'],
      ['The app’s queries run on other connections, outside the transaction — the rollback cleans up nothing', 'The rollback also undoes the pool’s queries, because they share one database', 'The test deadlocks, because two connections write the same table', 'pg refuses BEGIN on a client that came from a pool'],
      ['Build the app around the same client that holds the transaction. Cost: one BEGIN and one ROLLBACK per test, well under a millisecond.', 'Dựng app quanh chính client đang giữ giao dịch. Chi phí: một BEGIN và một ROLLBACK mỗi test, dưới một mili-giây.']),
    q('c4', ['Four test files each TRUNCATE notes in beforeAll, insert 20 rows, assert 20. Ten parallel runs: PASS=0 FAIL=10, “expected 76 to be 20”. Which fix keeps the parallelism?', 'Bốn tệp test đều TRUNCATE notes trong beforeAll, chèn 20 dòng, khẳng định 20. Mười lần chạy song song: PASS=0 FAIL=10, "expected 76 to be 20". Cách chữa nào giữ được song song?'],
      ['A schema per worker: 10/10 in 258 ms, the same as the broken parallel run', '--no-file-parallelism: 10/10, and it is free', 'retry: 3 in the config', 'A longer timeout in beforeAll'],
      ['Sequential is correct but turns test time from O(max) into O(sum) forever (731 vs 260 ms on four files). Retrying a reliably broken test is not a fix at all.', 'Chạy tuần tự thì đúng nhưng biến thời gian test từ O(max) thành O(sum) mãi mãi (731 so với 260 ms với bốn tệp). Thử lại một test hỏng chắc chắn không phải là cách chữa.']),
    q('c5', ['A throw-away Postgres container: pg_isready said OK at 954 ms, a real connection worked at 1,149 ms; in between the socket did not exist. What should the test setup wait for?', 'Một container Postgres dùng-một-lần: pg_isready báo OK ở 954 ms, kết nối thật được ở 1.149 ms; ở giữa socket không tồn tại. Phần chuẩn bị test nên chờ cái gì?'],
      ['A real query — SELECT 1 in a retry loop — not the health probe', 'pg_isready twice in a row', 'A fixed sleep of 2 seconds', 'The container’s healthy status in docker ps'],
      ['The entrypoint starts a temporary server for the init scripts, shuts it down, starts the real one — and pg_isready answers during that window. The source of a whole genre of “works locally, fails in CI”.', 'Entrypoint khởi một server tạm cho các script khởi tạo, tắt nó, rồi khởi server thật — và pg_isready trả lời trong khe đó. Nguồn của cả một thể loại "chạy ở máy, hỏng trên CI".']),
    q('c6', ['The suite went red with “expected 2 to be 1” although neither the tests nor the code changed. The defence?', 'Bộ test đỏ với "expected 2 to be 1" dù cả test lẫn code không đổi. Cách phòng?'],
      ['Assert only on rows the test itself created', 'Add a retry, since the failure is random', 'Run the suite twice and keep the second result', 'Delete the assertion on the row count'],
      ['A separate script had left one row behind. Rollback isolates tests from each other, not from state that was already there.', 'Một script khác đã để lại một dòng. Rollback cô lập các test với nhau, không cô lập khỏi trạng thái đã có từ trước.']),
  ],
  goiY: [['A fake has no constraints, no connections, no startup.', 'Đồ giả không có ràng buộc, không có kết nối, không có khởi động.'], ['Every “it passes locally” story here is about state or timing.', 'Mọi chuyện "ở máy thì qua" ở đây đều là về trạng thái hoặc thời điểm.']],
  loi: [['Believing the green unit suite proves uniqueness.', 'Tin bộ unit test xanh chứng minh được tính duy nhất.'], ['Waiting for pg_isready in CI.', 'Chờ pg_isready trên CI.']],
  tns: [tn('23505 unique_violation', 'vi phạm khoá duy nhất', 'mã lỗi PostgreSQL'), tn('22001 string_data_right_truncation', 'chuỗi quá dài', 'giá trị vượt varchar(n)'), tn('isolation', 'cô lập', 'giữ cho test không rò trạng thái sang nhau')],
  kn: ['integration tests', 'PostgreSQL'],
});

const FAKE_PG = `// fake-pg.js — PROVIDED (loaded before answer.js). A pg client against a notes table with
// UNIQUE (slug) "notes_slug_key" and title varchar(200). client.query(sql, params) → { rows }; errors are like pg's:
//   duplicate slug → err.code '23505', err.constraint 'notes_slug_key' · title > 200 chars → err.code '22001'
// client.down = true ⇒ every query rejects with Error('Connection terminated unexpectedly') (no code)
function makeClient() {
  const rows = [];
  const client = { rows, down: false, queries: 0,
    query(sql, params = []) {
      client.queries++;
      return new Promise((ok, no) => setTimeout(() => {
        if (client.down) return no(new Error('Connection terminated unexpectedly'));
        if (/^INSERT INTO notes/i.test(sql)) {
          const [title, slug, body, authorId] = params;
          if (String(title).length > 200) return no(Object.assign(new Error('value too long for type character varying(200)'), { code: '22001' }));
          if (rows.some((r) => r.slug === slug)) return no(Object.assign(new Error('duplicate key value violates unique constraint "notes_slug_key"'), { code: '23505', constraint: 'notes_slug_key' }));
          const row = { id: rows.length + 1, title, slug, body, author_id: authorId };
          rows.push(row);
          return ok({ rows: [{ ...row }] });
        }
        no(new Error('unsupported in this fake: ' + sql));
      }, 2));
    } };
  return client;
}
`;

const E2 = jsBai({
  ten: '14.4 · Teach the repository the driver’s vocabulary', kho: 'MEDIUM', phut: 15,
  en: `<p>In production the duplicate-slug race answered 500, because the PostgreSQL error carried a code but no status. Write ${c('insertNote(client, n)')} for ${c('n = { title, slug, body, authorId }')}:</p><ul><li>run ${c("INSERT INTO notes (title, slug, body, author_id) VALUES ($1,$2,$3,$4) RETURNING *")} with the four values and resolve to the row;</li><li>${c("code '23505'")} (unique violation) ⇒ throw ${c("Error('SLUG_TAKEN')")} with ${c('status: 409')};</li><li>${c("code '22001'")} (value too long — zod and the column disagree after somebody widened one of them) ⇒ throw ${c("Error('TITLE_TOO_LONG')")} with ${c('status: 422')};</li><li>anything else ⇒ re-throw the original error unchanged (a lost connection must stay a 500).</li></ul>`,
  vi: `<p>Trên production cuộc đua slug trùng trả 500, vì lỗi PostgreSQL mang mã nhưng không có status. Viết ${c('insertNote(client, n)')} với ${c('n = { title, slug, body, authorId }')}:</p><ul><li>chạy ${c("INSERT INTO notes (title, slug, body, author_id) VALUES ($1,$2,$3,$4) RETURNING *")} với bốn giá trị và resolve ra dòng;</li><li>${c("code '23505'")} (vi phạm khoá duy nhất) ⇒ ném ${c("Error('SLUG_TAKEN')")} với ${c('status: 409')};</li><li>${c("code '22001'")} (giá trị quá dài — zod và cột lệch nhau sau khi ai đó nới một bên) ⇒ ném ${c("Error('TITLE_TOO_LONG')")} với ${c('status: 422')};</li><li>mọi thứ khác ⇒ ném lại nguyên lỗi gốc (mất kết nối vẫn phải là 500).</li></ul>`,
  yc: [['Parameters, never string concatenation.', 'Dùng tham số, không bao giờ nối chuỗi.'], ['Map by err.code, not by matching the message text.', 'Ánh xạ theo err.code, không theo việc khớp chữ của thông điệp.'], ['Unknown errors are re-thrown as they are.', 'Lỗi lạ được ném lại nguyên trạng.']],
  dauVao: ['client — fake-pg.js · n — { title, slug, body, authorId }', 'client — fake-pg.js · n — { title, slug, body, authorId }'],
  dauRa: ['Promise<row> — or throws { message, status }', 'Promise<row> — hoặc ném { message, status }'],
  goiY: [['try { const r = await client.query(SQL, [n.title, n.slug, n.body, n.authorId]); return r.rows[0]; } catch (e) { … }', 'try { const r = await client.query(SQL, [n.title, n.slug, n.body, n.authorId]); return r.rows[0]; } catch (e) { … }'], ['throw Object.assign(new Error(\'SLUG_TAKEN\'), { status: 409 }); — and a plain throw e for everything else.', 'throw Object.assign(new Error(\'SLUG_TAKEN\'), { status: 409 }); — và throw e thường cho mọi thứ khác.']],
  loi: [['Relying on the pre-check (findBySlug) alone: correct in every unit test, 500 four times out of five under concurrency.', 'Chỉ dựa vào phép kiểm trước (findBySlug): đúng ở mọi unit test, 500 bốn lần trên năm khi đồng thời.'], ['if (e.message.includes(\'duplicate\')): messages are localised and change between versions; codes do not.', 'if (e.message.includes(\'duplicate\')): thông điệp được bản địa hoá và đổi giữa các phiên bản; mã thì không.'], ['Mapping every error to 409: a dropped connection tells the user their title is taken.', 'Ánh xạ mọi lỗi thành 409: mất kết nối lại báo người dùng rằng tiêu đề đã có người dùng.']],
  gt: ['The constraint is what actually enforces uniqueness; the repository is where the driver’s codes are in scope, so it is where 23505 becomes the domain error the HTTP layer already maps to 409. 22001 is the bug no unit test can see — the fake accepts any string — which is the whole argument for a real-database test.', 'Ràng buộc mới là thứ thật sự bảo đảm tính duy nhất; repository là nơi mã của driver nằm trong tầm, nên đó là nơi 23505 thành lỗi miền mà tầng HTTP đã ánh xạ sẵn thành 409. 22001 là lỗi mà không unit test nào thấy — đồ giả nhận mọi chuỗi — đó chính là toàn bộ lý lẽ cho test trên CSDL thật.'],
  kn: ['repository', 'error mapping'], tns: [tn('23505', 'unique_violation', 'vi phạm ràng buộc UNIQUE'), tn('22001', 'string_data_right_truncation', 'giá trị dài hơn varchar(n)')],
  gia: { 'fake-pg.js': FAKE_PG },
  dau: `async function insertNote(client, n) {
  // Write your solution here
  const r = await client.query('INSERT INTO notes (title, slug, body, author_id) VALUES ($1,$2,$3,$4) RETURNING *', [n.title, n.slug, n.body, n.authorId]);
  return r.rows[0];
}
`,
  giai: `const SQL = 'INSERT INTO notes (title, slug, body, author_id) VALUES ($1,$2,$3,$4) RETURNING *';
const domain = (message, status) => Object.assign(new Error(message), { status });

/** The repository speaks the driver's vocabulary — so it is where driver codes become domain errors. */
async function insertNote(client, n) {
  try {
    const r = await client.query(SQL, [n.title, n.slug, n.body, n.authorId]);   // parameters, never concatenation
    return r.rows[0];
  } catch (e) {
    if (e.code === '23505') throw domain('SLUG_TAKEN', 409);       // the constraint IS the rule
    if (e.code === '22001') throw domain('TITLE_TOO_LONG', 422);   // zod and varchar(200) disagree
    throw e;                                                        // unknown: stays a 500, untouched
  }
}
`,
  chung: `const client = makeClient();
const note = (title, slug = title.toLowerCase()) => ({ title, slug, body: '', authorId: 7 });
const outcome = (p) => p.then((r) => ['ok', r.id], (e) => [e.message, e.status ?? null]);`,
  cases: [
    { goi: `[await insertNote(client, note('Hello')), client.queries]`, moTa: ['Inserts and returns the row', 'Chèn và trả về dòng'] },
    { goi: `[await outcome(insertNote(client, note('A', 'a'))), await outcome(insertNote(client, note('A again', 'a')))]`, moTa: ['A duplicate slug → 409 SLUG_TAKEN', 'Slug trùng → 409 SLUG_TAKEN'] },
    { goi: `await outcome(insertNote(client, note('x'.repeat(201), 'long')))`, moTa: ['A 201-character title → 422 TITLE_TOO_LONG', 'Tiêu đề 201 ký tự → 422 TITLE_TOO_LONG'] },
    { goi: `await Promise.all(Array.from({ length: 5 }, () => outcome(insertNote(client, note('Race', 'race')))))`, an: true, moTa: ['Five concurrent duplicates: one ok, four 409 (not 500)', 'Năm bản trùng đồng thời: một ok, bốn 409 (không phải 500)'] },
    { goi: `await (async () => { client.down = true; const r = await outcome(insertNote(client, note('Hi'))); return r; })()`, an: true },
  ],
});

const FAKE_BOOT = `// fake-docker-pg.js — PROVIDED (loaded before answer.js). A throw-away Postgres container that has just been started
// at virtual time 0 (measured in the lesson: pg_isready OK at 954 ms, a real connection only at 1,149 ms):
//   await pgIsReady()     → true from 954 ms on (it LIES between 954 and 1,149 ms)
//   await query('SELECT 1') → rejects before 1,149 ms (socket missing / starting up / shutting down), then { rows: [{ '?column?': 1 }] }
//   boot.queries — number of query attempts · boot.failForever = true ⇒ query never succeeds
const boot = { t0: Date.now(), queries: 0, failForever: false, readyAt: 1149 };
const since = () => Date.now() - boot.t0;
function pgIsReady() { return new Promise((ok) => setTimeout(() => ok(since() >= 954), 5)); }
function query(sql) {
  boot.queries++;
  return new Promise((ok, no) => setTimeout(() => {
    const t = since();
    if (boot.failForever || t < 300) return no(new Error('connect ECONNREFUSED 127.0.0.1:5432'));
    if (t < 954) return no(new Error('the database system is starting up'));
    if (t < 1000) return no(new Error('the database system is shutting down'));
    if (t < boot.readyAt) return no(new Error('connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: No such file or directory'));
    ok({ rows: [{ '?column?': 1 }] });
  }, 3));
}
`;

const E3 = jsBai({
  ten: '14.4 · Wait for a real query, not for pg_isready', kho: 'HARD', phut: 20,
  en: `<p>The test setup starts a throw-away Postgres container and must wait until it can really be used. ${c('pg_isready')} lies during initialisation — it said OK at 954 ms while a real connection only worked at 1,149 ms. Write ${c('waitForDb(query, { intervalMs = 50, timeoutMs = 5000 } = {})')}:</p><ul><li>try ${c("query('SELECT 1')")}; if it rejects, wait ${c('intervalMs')} and try again;</li><li>resolve to the number of milliseconds since ${c('waitForDb')} was called, as soon as one query succeeds;</li><li>if ${c('timeoutMs')} has passed, reject with ${c("Error('DB_NOT_READY: ' + lastError.message)")} — the last real error is what someone will read in the CI log.</li></ul>`,
  vi: `<p>Phần chuẩn bị test khởi một container Postgres dùng-một-lần và phải chờ tới khi thật sự dùng được nó. ${c('pg_isready')} nói dối trong lúc khởi tạo — nó báo OK ở 954 ms trong khi kết nối thật chỉ được ở 1.149 ms. Viết ${c('waitForDb(query, { intervalMs = 50, timeoutMs = 5000 } = {})')}:</p><ul><li>thử ${c("query('SELECT 1')")}; nếu reject, chờ ${c('intervalMs')} rồi thử lại;</li><li>resolve ra số mili-giây kể từ lúc gọi ${c('waitForDb')}, ngay khi có một truy vấn thành công;</li><li>nếu đã quá ${c('timeoutMs')}, reject với ${c("Error('DB_NOT_READY: ' + lastError.message)")} — lỗi thật cuối cùng là thứ người ta sẽ đọc trong log CI.</li></ul>`,
  yc: [['Never trust pgIsReady() — the probe passes 195 ms too early.', 'Không bao giờ tin pgIsReady() — phép dò qua sớm 195 ms.'], ['Wait with a timer between attempts (no busy loop).', 'Chờ bằng hẹn giờ giữa các lần thử (không quay vòng bận).'], ['Time out with the last real error in the message.', 'Hết giờ thì báo kèm lỗi thật cuối cùng trong thông điệp.']],
  dauVao: ['query — async (sql) => result · options', 'query — async (sql) => result · tuỳ chọn'],
  dauRa: ['Promise<number> — ms until the first successful query', 'Promise<number> — số ms tới truy vấn thành công đầu tiên'],
  goiY: [['const t0 = Date.now(); let last; while (Date.now() - t0 < timeoutMs) { try { await query(\'SELECT 1\'); return Date.now() - t0; } catch (e) { last = e; } await new Promise((ok) => setTimeout(ok, intervalMs)); }', 'const t0 = Date.now(); let last; while (Date.now() - t0 < timeoutMs) { try { await query(\'SELECT 1\'); return Date.now() - t0; } catch (e) { last = e; } await new Promise((ok) => setTimeout(ok, intervalMs)); }'], ['After the loop: throw new Error(\'DB_NOT_READY: \' + (last ? last.message : \'timeout\')).', 'Sau vòng lặp: throw new Error(\'DB_NOT_READY: \' + (last ? last.message : \'timeout\')).']],
  loi: [['Waiting for pg_isready and then running the migrations: “No such file or directory” in CI, once in a while.', 'Chờ pg_isready rồi chạy migration: thỉnh thoảng lại "No such file or directory" trên CI.'], ['A fixed sleep(2000): too long on a fast laptop, too short on a loaded CI runner.', 'Một sleep(2000) cố định: quá lâu trên máy nhanh, quá ngắn trên runner CI đang tải nặng.'], ['Timing out with a generic “timeout”: the person reading the CI log has no idea whether the server was down, starting or refusing the password.', 'Hết giờ với một chữ "timeout" chung chung: người đọc log CI không biết server đang tắt, đang khởi động hay từ chối mật khẩu.']],
  gt: ['The only proof that a database can run your tests is that it ran a query. The Postgres entrypoint starts a temporary server for its init scripts, shuts it down and starts the real one; the probe answers during that window. A retry loop on SELECT 1 with a deadline and the last error in the message turns a flaky CI step into a deterministic one — exactly the order the site’s work-db-tests job uses: the health probe only gates the service, the tests start after real queries built the schema.', 'Bằng chứng duy nhất cho việc CSDL chạy được test của bạn là nó đã chạy một truy vấn. Entrypoint của Postgres khởi một server tạm cho các script khởi tạo, tắt nó, rồi khởi server thật; phép dò trả lời trong khe đó. Vòng thử lại trên SELECT 1 có hạn chót và lỗi cuối trong thông điệp biến một bước CI chập chờn thành tất định — đúng thứ tự mà job work-db-tests của website dùng: phép dò sức khoẻ chỉ chặn service, test chạy sau khi các truy vấn thật đã dựng lược đồ.'],
  kn: ['test setup', 'flaky tests'], tns: [tn('pg_isready', 'phép dò sẵn sàng', 'trả lời trong lúc khởi tạo — không chứng minh truy vấn chạy được'), tn('readiness', 'sẵn sàng', 'được chứng minh bằng một truy vấn thật')],
  gia: { 'fake-docker-pg.js': FAKE_BOOT },
  dau: `/** Wait until the database can run a query. */
async function waitForDb(query, { intervalMs = 50, timeoutMs = 5000 } = {}) {
  // Write your solution here — this trusts the health probe
  const t0 = Date.now();
  while (!(await pgIsReady())) await new Promise((ok) => setTimeout(ok, intervalMs));
  return Date.now() - t0;
}
`,
  giai: `/** Wait until the database can run a query — the ONLY proof of readiness. */
async function waitForDb(query, { intervalMs = 50, timeoutMs = 5000 } = {}) {
  const t0 = Date.now();
  let last = null;
  while (Date.now() - t0 < timeoutMs) {
    try {
      await query('SELECT 1');                     // a real round trip through a real connection
      return Date.now() - t0;
    } catch (e) {
      last = e;                                    // keep the REAL reason for the CI log
    }
    await new Promise((ok) => setTimeout(ok, intervalMs));   // wait with a timer, not a busy loop
  }
  throw new Error('DB_NOT_READY: ' + (last ? last.message : 'timeout'));
}
`,
  cases: [
    { goi: `[await waitForDb(query) >= 1149, boot.queries > 1]`, moTa: ['Resolves only once SELECT 1 works (≥ 1,149 ms), after several attempts', 'Chỉ resolve khi SELECT 1 chạy được (≥ 1.149 ms), sau vài lần thử'] },
    { goi: `await (async () => { const ms = await waitForDb(query, { intervalMs: 100 }); const r = await query('SELECT 1'); return [ms >= 1149 && ms < 1300, r.rows[0]]; })()`, moTa: ['The database really answers afterwards', 'Sau đó CSDL thật sự trả lời'] },
    { goi: `await (async () => { boot.failForever = true; try { await waitForDb(query, { timeoutMs: 800 }); return 'resolved'; } catch (e) { return e.message; } })()`, moTa: ['Times out with the last real error', 'Hết giờ kèm lỗi thật cuối cùng'] },
    { goi: `await (async () => { boot.readyAt = 3000; let err; try { await waitForDb(query, { timeoutMs: 2000, intervalMs: 200 }); } catch (e) { err = e.message; } return [err, boot.queries <= 12]; })()`, an: true },
    { goi: `await (async () => { boot.readyAt = 1500; const ms = await waitForDb(query, { intervalMs: 10 }); return [ms >= 1500, ms < 1520]; })()`, an: true },
  ],
});

const FAKE_TX = `// fake-pool.js — PROVIDED (loaded before answer.js). A pg Pool over one notes table, with real transaction semantics:
//   const client = await pool.connect()   — a dedicated connection; client.release() gives it back
//   await client.query('BEGIN' | 'ROLLBACK' | 'COMMIT') · await client.query('INSERT note', [title]) · await client.query('COUNT')
//   await pool.query(…)   — runs on SOME connection of its own, autocommit (outside any client's transaction)
//   writes inside a client's open transaction are only visible to that client until COMMIT; ROLLBACK discards them
//   pool.table — the committed rows · pool.connected / pool.released — counters
function makePool() {
  const pool = { table: [], connected: 0, released: 0 };
  const run = (state, sql, params) => new Promise((ok, no) => setTimeout(() => {
    if (sql === 'BEGIN') { state.tx = []; return ok({ rows: [] }); }
    if (sql === 'ROLLBACK') { state.tx = null; return ok({ rows: [] }); }
    if (sql === 'COMMIT') { if (state.tx) pool.table.push(...state.tx); state.tx = null; return ok({ rows: [] }); }
    if (sql === 'INSERT note') { const row = { title: params[0] }; (state.tx || pool.table).push(row); return ok({ rows: [row] }); }
    if (sql === 'COUNT') return ok({ rows: [{ c: pool.table.length + (state.tx ? state.tx.length : 0) }] });
    no(new Error('unsupported: ' + sql));
  }, 1));
  pool.connect = () => new Promise((ok) => setTimeout(() => {
    pool.connected++;
    const state = { tx: null, released: false };
    ok({ query: (sql, params) => run(state, sql, params), release: () => { if (!state.released) { state.released = true; pool.released++; } } });
  }, 1));
  pool.query = (sql, params) => run({ tx: null }, sql, params);
  return pool;
}
/** what a test's "app" does with whatever db it is given */
async function createTwoNotes(db) { await db.query('INSERT note', ['a']); await db.query('INSERT note', ['b']); return (await db.query('COUNT')).rows[0].c; }
`;

const E4 = jsBai({
  ten: '14.4 · Isolate every test in a transaction that rolls back', kho: 'MEDIUM', phut: 15,
  en: `<p>The fastest correct isolation: ${c('BEGIN')} before each test, ${c('ROLLBACK')} after, and the table is byte-identical afterwards. The critical detail is that the code under test must use the SAME client that holds the transaction — hand it the pool and its queries run on other connections, outside your transaction, and the rollback cleans up nothing. Write ${c('withRollback(pool, fn)')}:</p><ol><li>${c('const client = await pool.connect()')}, then ${c("BEGIN")};</li><li>${c('await fn(client)')} — the test builds its app around ${c('client')};</li><li>ALWAYS (even if ${c('fn')} throws): ${c("ROLLBACK")} and ${c('client.release()')};</li><li>resolve to what ${c('fn')} returned, or re-throw its error.</li></ol>`,
  vi: `<p>Cách cô lập đúng và nhanh nhất: ${c('BEGIN')} trước mỗi test, ${c('ROLLBACK')} sau đó, và bảng giống hệt từng byte như trước. Chi tiết then chốt là code đang test phải dùng CHÍNH client đang giữ giao dịch — đưa nó cái pool thì truy vấn của nó chạy trên kết nối khác, ngoài giao dịch của bạn, và rollback chẳng dọn được gì. Viết ${c('withRollback(pool, fn)')}:</p><ol><li>${c('const client = await pool.connect()')}, rồi ${c("BEGIN")};</li><li>${c('await fn(client)')} — test dựng app của nó quanh ${c('client')};</li><li>LUÔN LUÔN (kể cả khi ${c('fn')} ném lỗi): ${c("ROLLBACK")} và ${c('client.release()')};</li><li>resolve ra thứ ${c('fn')} trả về, hoặc ném lại lỗi của nó.</li></ol>`,
  yc: [['fn receives the client that holds the transaction — never the pool.', 'fn nhận client đang giữ giao dịch — không bao giờ là pool.'], ['ROLLBACK + release in finally.', 'ROLLBACK + release trong finally.'], ['The committed table is unchanged afterwards.', 'Bảng đã commit không đổi sau đó.']],
  dauVao: ['pool — fake-pool.js · fn — async (db) => any', 'pool — fake-pool.js · fn — async (db) => any'],
  dauRa: ['Promise<whatever fn returns>', 'Promise<thứ fn trả về>'],
  goiY: [['const client = await pool.connect(); await client.query(\'BEGIN\'); try { return await fn(client); } finally { … }', 'const client = await pool.connect(); await client.query(\'BEGIN\'); try { return await fn(client); } finally { … }'], ['In finally: await client.query(\'ROLLBACK\'); client.release(); — release even if the ROLLBACK itself fails (a nested try/finally).', 'Trong finally: await client.query(\'ROLLBACK\'); client.release(); — release kể cả khi chính ROLLBACK hỏng (một try/finally lồng).']],
  loi: [['fn(pool): the inserts autocommit on other connections — the next test sees 2, then 4, then 6 rows.', 'fn(pool): các lệnh chèn tự commit trên kết nối khác — test sau thấy 2, rồi 4, rồi 6 dòng.'], ['ROLLBACK only on success: a failing test leaves its rows behind and makes the NEXT test fail with “expected 2 to be 1”.', 'Chỉ ROLLBACK khi thành công: test hỏng để lại các dòng của nó và làm test KẾ TIẾP đỏ với "expected 2 to be 1".'], ['Forgetting release(): after ten tests the pool (max 10) is exhausted and the suite hangs.', 'Quên release(): sau mười test pool (tối đa 10) cạn và bộ test treo.']],
  gt: ['A transaction is per connection, so isolation only works if every query of the test goes through the client that opened it. try/finally guarantees the ROLLBACK and the release whatever the test does — which is what keeps one red test from poisoning the next. Its one limitation: code that manages its own transactions needs savepoints, and a “rolled back on error” test cannot itself run inside a transaction.', 'Giao dịch gắn với từng kết nối, nên cô lập chỉ hoạt động nếu mọi truy vấn của test đi qua client đã mở nó. try/finally bảo đảm ROLLBACK và release bất kể test làm gì — thứ giữ cho một test đỏ không đầu độc test sau. Giới hạn duy nhất: code tự quản giao dịch cần savepoint, và test "đã rollback khi lỗi" không thể tự chạy bên trong một giao dịch.'],
  kn: ['test isolation', 'transactions'], tns: [tn('transaction rollback isolation', 'cô lập bằng rollback', 'BEGIN trước, ROLLBACK sau — bảng y như cũ'), tn('connection pool', 'bể kết nối', 'pool.query chạy trên một kết nối bất kỳ của nó')],
  gia: { 'fake-pool.js': FAKE_TX },
  dau: `/** Run fn inside a transaction that is always rolled back. */
async function withRollback(pool, fn) {
  // Write your solution here — the classic mistake: the code under test gets the pool
  const client = await pool.connect();
  await client.query('BEGIN');
  const result = await fn(pool);
  await client.query('ROLLBACK');
  client.release();
  return result;
}
`,
  giai: `/** Run fn inside a transaction that is always rolled back — fn gets THE client that holds it. */
async function withRollback(pool, fn) {
  const client = await pool.connect();          // one dedicated connection = one transaction
  try {
    await client.query('BEGIN');
    return await fn(client);                    // the code under test must use this client, never the pool
  } finally {
    try {
      await client.query('ROLLBACK');           // success or failure: leave the table byte-identical
    } finally {
      client.release();                         // and give the connection back, even if ROLLBACK failed
    }
  }
}
`,
  chung: `const pool = makePool();
pool.table.push({ title: 'seed' });`,
  cases: [
    { goi: `[await withRollback(pool, createTwoNotes), pool.table.length, pool.released]`, moTa: ['Inside: 3 rows; after: 1 (the seed), connection released', 'Bên trong: 3 dòng; sau đó: 1 (dòng mồi), kết nối được trả'] },
    { goi: `await (async () => { const a = await withRollback(pool, createTwoNotes); const b = await withRollback(pool, createTwoNotes); return [a, b]; })()`, moTa: ['Two tests in a row see the same starting state', 'Hai test liên tiếp thấy cùng trạng thái ban đầu'] },
    { goi: `await (async () => { let err; try { await withRollback(pool, async (db) => { await db.query('INSERT note', ['x']); throw new Error('expected 2 to be 1'); }); } catch (e) { err = e.message; } return [err, pool.table.length, pool.connected, pool.released]; })()`, moTa: ['A failing test still rolls back and releases', 'Test hỏng vẫn rollback và trả kết nối'] },
    { goi: `await (async () => { for (let i = 0; i < 5; i++) await withRollback(pool, createTwoNotes).catch(() => {}); return [pool.table.length, pool.connected, pool.released, (await pool.query('COUNT')).rows[0].c]; })()`, an: true },
    { goi: `await (async () => { const r = await withRollback(pool, async (db) => { await db.query('INSERT note', ['only-here']); return (await pool.query('COUNT')).rows[0].c; }); return [r, pool.table.map((x) => x.title)]; })()`, an: true },
  ],
});

export default modul('nodejs-14-4-db-that', '14.4 Real-database tests: constraints, readiness, rollback isolation', [E1, E2, E3, E4]);
