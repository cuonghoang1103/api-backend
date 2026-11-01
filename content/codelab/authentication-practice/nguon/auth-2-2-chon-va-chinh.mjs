/** Authentication · 2.2 — Chọn và chỉnh hàm băm bằng phép đo: đọc tune/load thật; tự viết chooseParams (hai ngân sách), parsePhc + needsRehash (đọc theo tên); bảng tình huống → thuật toán. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s02/_ma.mjs';

const TUNE = OUT['22-tune'].split('\n').slice(1);
const LOAD = OUT['22-load'].split('\n').slice(1);
// the real tune table, parsed from the run: [{ mKiB, t, ms }]
const TABLE = TUNE.filter((l) => /^\s*\d+ MiB/.test(l)).flatMap((l) => {
  const [mib, ...cells] = l.trim().split(/\s+/).filter((x) => x !== 'MiB');
  return cells.map((c, i) => ({ mKiB: Number(mib) * 1024, t: i + 1, ms: parseFloat(c) }));
});

/* ── 1. Đọc tune + load thật ── */
const S1 = cs({
  ten: '2.2-1 — Read the tuning run and the 40-login burst', kho: 'MEDIUM', phut: 10,
  en: `Real runs of lesson 2.2 (Apple M1 Max, Node 22.23.3, argon2 0.45.1):${pre(TUNE)}${pre(LOAD)}`,
  vi: `Các lần chạy thật của bài 2.2 (Apple M1 Max, Node 22.23.3, argon2 0.45.1):${pre(TUNE)}${pre(LOAD)}`,
  cau: [
    q('c1', ['Why is 128 MiB, t=1 (85.3 ms) marked # and not chosen?', 'Vì sao 128 MiB, t=1 (85,3 ms) bị đánh # và không được chọn?'],
      ['4 threads × 128 MiB = 512 MiB, over the RAM budget', 'At 85.3 ms it is slower than the 100 ms budget', 'argon2id refuses to allocate more than 64 MiB', 'OWASP forbids t=1 for argon2id in all cases'],
      ['The memory budget is shared by every thread that may hash at once: 256 ÷ 4 = 64 MiB each.', 'Ngân sách bộ nhớ chia cho mọi luồng có thể băm cùng lúc: 256 ÷ 4 = 64 MiB mỗi luồng.']),
    q('c2', ['With 64 threads, 40 logins used +2,498 MiB and the median stayed 537 ms. Best explanation?', 'Với 64 luồng, 40 lượt dùng +2.498 MiB và trung vị vẫn 537 ms. Giải thích đúng nhất?'],
      ['RAM = busy threads × 64 MiB, yet only 10 cores do the work', 'argon2 leaks memory whenever more than 4 threads run', 'libuv silently ignores pool sizes above 10 threads', 'RSS also counts memory freed by earlier logins'],
      ['More threads than cores buys concurrency of memory, not of CPU. Size the pool to the cores.', 'Nhiều luồng hơn số nhân chỉ mua thêm bộ nhớ đồng thời, không mua CPU. Đặt cỡ pool theo số nhân.']),
    q('c3', ['p=4 made one login take 27 ms instead of ~83 ms. Why does LabFlow ID still keep p=1?', 'p=4 làm một lượt chỉ mất 27 ms thay vì ~83 ms. Vì sao LabFlow ID vẫn giữ p=1?'],
      ['One login = one core keeps capacity simple; p=4 uses 4 cores', 'p=4 halves the security of every stored hash', 'OWASP forbids any parallelism above p=1', 'p=4 needs four times the memory per login'],
      ['p splits the same memory into lanes computed in parallel — faster alone, more cores per login. A valid choice with idle cores; LabFlow ID prefers predictable capacity.', 'p chia cùng vùng nhớ thành các làn tính song song — một mình thì nhanh hơn, mỗi lượt tốn nhiều nhân hơn. Hợp lệ khi nhân còn rảnh; LabFlow ID ưu tiên dung lượng dễ đoán.']),
  ],
  goiY: [['Memory per hash × hashes at the same time.', 'Bộ nhớ mỗi lần băm × số lần băm cùng lúc.'], ['Count cores, not threads.', 'Đếm nhân, không đếm luồng.']],
  loi: [['Tuning for one request only.', 'Chỉnh tham số theo đúng một request.'], ['Raising UV_THREADPOOL_SIZE to “make it faster”.', 'Nâng UV_THREADPOOL_SIZE cho "nhanh hơn".']],
  tns: [tn('thread pool', 'bể luồng'), tn('latency budget', 'ngân sách độ trễ')],
  kn: ['argon2 tuning'],
});

/* ── 2. Tự viết: chooseParams ── */
function chooseParams(table, budgetMs, ramMiB, threads) {
  var maxKiB = (ramMiB / threads) * 1024;
  var best = null;
  table.forEach(function (row) {
    if (row.ms > budgetMs || row.mKiB > maxKiB) return;        // over either budget
    if (!best || row.mKiB > best.m || (row.mKiB === best.m && row.t > best.t)) best = { m: row.mKiB, t: row.t };
  });
  return best;
}
const S2 = jsBai({
  ten: '2.2-2 — Write chooseParams(table, budgetMs, ramMiB, threads)', kho: 'MEDIUM', phut: 15,
  en: `<p><code>table</code> is a measured list <code>[{ mKiB, t, ms }]</code> (the cases use the real run of <code>demo2/tune.mjs</code>). Return <code>{ m, t }</code> with the <b>most memory</b>, then the <b>most passes</b>, among rows that fit <b>both</b> budgets: <code>ms ≤ budgetMs</code> and <code>mKiB ≤ ramMiB ÷ threads × 1024</code>. Nothing fits ⇒ <code>null</code>. Real result: budget 100 ms / 256 MiB / 4 threads ⇒ <code>{ m: 65536, t: 2 }</code>.</p>`,
  vi: `<p><code>table</code> là danh sách đã đo <code>[{ mKiB, t, ms }]</code> (các ca dùng lần chạy thật của <code>demo2/tune.mjs</code>). Trả <code>{ m, t }</code> có <b>bộ nhớ lớn nhất</b>, rồi <b>số lượt nhiều nhất</b>, trong các dòng vừa <b>cả hai</b> ngân sách: <code>ms ≤ budgetMs</code> và <code>mKiB ≤ ramMiB ÷ threads × 1024</code>. Không dòng nào vừa ⇒ <code>null</code>. Kết quả thật: ngân sách 100 ms / 256 MiB / 4 luồng ⇒ <code>{ m: 65536, t: 2 }</code>.</p>`,
  goiY: [['Filter by both budgets, then keep the best by (m, t).', 'Lọc theo cả hai ngân sách, rồi giữ dòng tốt nhất theo (m, t).'], ['The memory cap is per thread: ramMiB / threads.', 'Trần bộ nhớ tính cho mỗi luồng: ramMiB / threads.']],
  loi: [['Ignoring the memory budget ⇒ 128 MiB, t=1.', 'Bỏ ngân sách bộ nhớ ⇒ 128 MiB, t=1.'], ['Choosing the fastest row instead of the strongest that fits.', 'Chọn dòng nhanh nhất thay vì dòng mạnh nhất còn vừa.']],
  gt: ['Time alone picks the most memory that is fast enough (128 MiB, t=1); memory alone ignores the user. Both together give the parameters LabFlow ID ships, and the same function re-run on new hardware gives the next ones.', 'Chỉ xét thời gian thì chọn bộ nhớ lớn nhất còn đủ nhanh (128 MiB, t=1); chỉ xét bộ nhớ thì bỏ quên người dùng. Cả hai cùng lúc cho ra tham số LabFlow ID dùng, và chạy lại cùng hàm trên phần cứng mới cho ra tham số kế tiếp.'],
  kn: ['argon2 tuning'],
  tns: [tn('memory budget', 'ngân sách bộ nhớ')],
  dau: `/** table = [{ mKiB, t, ms }] ⇒ { m, t } or null */
function chooseParams(table, budgetMs, ramMiB, threads) {
  // Write your solution here
  var fast = table.filter(function (r) { return r.ms <= budgetMs; });
  fast.sort(function (a, b) { return b.mKiB - a.mKiB; });
  return fast.length ? { m: fast[0].mKiB, t: fast[0].t } : null;
}
`,
  giai: '// Reference solution\n' + nguon(chooseParams),
  cases: [
    { goi: goi('chooseParams', TABLE, 100, 256, 4), moTa: ['Lesson 2.2: 100 ms, 256 MiB, 4 threads', 'Bài 2.2: 100 ms, 256 MiB, 4 luồng'] },
    { goi: goi('chooseParams', TABLE, 100, 1024, 4), moTa: ['Plenty of RAM: time decides', 'Dư RAM: thời gian quyết định'] },
    { goi: goi('chooseParams', TABLE, 250, 512, 4), an: true },
    { goi: goi('chooseParams', TABLE, 50, 256, 10), an: true },
    { goi: goi('chooseParams', TABLE, 5, 256, 4), an: true },
    { goi: goi('chooseParams', TABLE, 100, 64, 4), an: true },
  ],
});

/* ── 3. Tự viết: parsePhc + needsRehash ── */
function needsRehash(stored, want) {
  var m = /^\$argon2id\$v=19\$([^$]+)\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/.exec(typeof stored === 'string' ? stored : '');
  if (!m) return true;                                  // not today's scheme ⇒ upgrade at the next login
  var p = {};
  m[1].split(',').forEach(function (kv) { var i = kv.indexOf('='); p[kv.slice(0, i)] = Number(kv.slice(i + 1)); });
  if (!(p.m > 0 && p.t > 0 && p.p > 0)) return true;
  return p.m < want.m || p.t < want.t || p.p < want.p;
}
const WANT = { m: 65536, t: 2, p: 1 };
const REAL = OUT['22-format'].split('\n')[1];
const S3 = jsBai({
  ten: '2.2-3 — Write needsRehash(stored, want): read the string by name', kho: 'MEDIUM', phut: 15,
  en: `<p>The argon2 package wrote this in lesson 2.2 (real run):</p>${pre(REAL)}<p>Write <code>needsRehash(stored, want)</code> → <code>true</code> when the row should be re-hashed at the next login: not an <code>$argon2id$v=19$&lt;params&gt;$&lt;salt&gt;$&lt;hash&gt;</code> string, parameters unreadable, or any of <code>m</code>, <code>t</code>, <code>p</code> below <code>want</code>. Read the parameters <b>by name</b> — they may come in any order (<code>m=…,p=…,t=…</code> is what the package writes).</p>`,
  vi: `<p>Gói argon2 đã ghi dòng này ở bài 2.2 (chạy thật):</p>${pre(REAL)}<p>Viết <code>needsRehash(stored, want)</code> → <code>true</code> khi dòng nên được băm lại ở lần đăng nhập sau: không phải chuỗi <code>$argon2id$v=19$&lt;tham số&gt;$&lt;muối&gt;$&lt;băm&gt;</code>, tham số không đọc được, hoặc <code>m</code>, <code>t</code>, <code>p</code> nào đó thấp hơn <code>want</code>. Đọc tham số <b>theo tên</b> — chúng có thể theo thứ tự bất kỳ (gói ghi <code>m=…,p=…,t=…</code>).</p>`,
  goiY: [['Split on "$", then split the parameters on "," and "=".', 'Tách theo "$", rồi tách tham số theo "," và "=".'], ['Anything that is not today’s argon2id ⇒ true.', 'Mọi thứ không phải argon2id hiện hành ⇒ true.']],
  loi: [['A regex m=(\\d+),t=(\\d+),p=(\\d+): null on real strings ⇒ every login rehashes.', 'Regex m=(\\d+),t=(\\d+),p=(\\d+): ra null với chuỗi thật ⇒ lượt nào cũng băm lại.'], ['Returning false for bcrypt: legacy rows never upgrade.', 'Trả false cho bcrypt: dòng cũ không bao giờ nâng cấp.']],
  gt: ['The stored string is the single source of truth about how a row was hashed. Parsing it by name survives any library order; treating everything else as “outdated” is what upgrades bcrypt and wrapped MD5 rows in lesson 2.5.', 'Chuỗi lưu là nguồn sự thật duy nhất về cách một dòng được băm. Đọc theo tên thì sống sót với mọi thứ tự của thư viện; coi mọi thứ khác là "đã cũ" chính là cách nâng cấp dòng bcrypt và MD5 đã bọc ở bài 2.5.'],
  kn: ['PHC string format'],
  tns: [tn('self-describing hash', 'chuỗi băm tự mô tả')],
  dau: `/** want = { m, t, p } ⇒ true when the row should be re-hashed */
function needsRehash(stored, want) {
  // Write your solution here
  var m = /m=(\\d+),t=(\\d+),p=(\\d+)/.exec(stored);
  if (!m) return true;
  return Number(m[1]) < want.m || Number(m[2]) < want.t || Number(m[3]) < want.p;
}
`,
  giai: '// Reference solution\n' + nguon(needsRehash),
  cases: [
    { goi: goi('needsRehash', REAL, WANT), moTa: ['The real string from lesson 2.2', 'Chuỗi thật từ bài 2.2'] },
    { goi: goi('needsRehash', '$argon2id$v=19$m=19456,p=1,t=2$c2FsdHNhbHRzYWx0$aGFzaGhhc2hoYXNo', WANT) },
    { goi: goi('needsRehash', '$argon2id$v=19$t=2,m=65536,p=1$c2FsdHNhbHRzYWx0$aGFzaGhhc2hoYXNo', WANT), an: true, moTa: ['Parameters in another order', 'Tham số theo thứ tự khác'] },
    { goi: goi('needsRehash', '$argon2id$v=19$m=131072,p=1,t=3$c2FsdHNhbHRzYWx0$aGFzaGhhc2hoYXNo', WANT), an: true },
    { goi: goi('needsRehash', '$2b$10$abcdefghijklmnopqrstuuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012', WANT), an: true },
    { goi: goi('needsRehash', '$argon2i$v=19$m=65536,p=1,t=2$c2FsdA$aGFzaA', WANT), an: true },
    { goi: goi('needsRehash', '$argon2id$v=19$m=65536,p=1$c2FsdA$aGFzaA', WANT), an: true },
    { goi: 'needsRehash(undefined, ' + JSON.stringify(WANT) + ')', an: true },
  ],
});

/* ── 4. Bảng: tình huống → thuật toán ── */
const ALG = ['argon2id', 'scrypt (raise maxmem)', 'keep bcrypt, cost ≥ 10, cap 72 bytes', 'PBKDF2-HMAC-SHA256, 600,000 iterations'];
const S4 = cs({
  ten: '2.2-4 — Situation → algorithm', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Pick the password hash for each situation (lesson 2.2).',
  vi: 'Chọn hàm băm mật khẩu cho từng tình huống (bài 2.2).',
  bang: [bang1('b1', ['Situation → algorithm', 'Tình huống → thuật toán'], [{ ma: 'x', ten: 'Situation' }, { ma: 'a', ten: 'Algorithm', luaChon: ALG }], [
    { o: { x: 'A new Node.js service, native modules allowed (LabFlow ID)' }, a: { a: 'argon2id' } },
    { o: { x: 'A serverless platform that forbids native modules' }, a: { a: 'scrypt (raise maxmem)' } },
    { o: { x: 'An existing app with 200,000 bcrypt rows, no time to migrate this term' }, a: { a: 'keep bcrypt, cost ≥ 10, cap 72 bytes' } },
    { o: { x: 'A contract that requires FIPS-140 validated algorithms' }, a: { a: 'PBKDF2-HMAC-SHA256, 600,000 iterations' } },
  ], ['argon2id by default; scrypt is built into node:crypto but OWASP’s N needs maxmem above 128 MiB; bcrypt is fine to keep with its 72-byte limit handled; PBKDF2 when FIPS is a hard requirement.', 'Mặc định argon2id; scrypt có sẵn trong node:crypto nhưng N của OWASP cần maxmem trên 128 MiB; bcrypt giữ lại được nếu xử lý giới hạn 72 byte; PBKDF2 khi FIPS là yêu cầu bắt buộc.'])],
  goiY: [['What is forbidden or required in each situation?', 'Mỗi tình huống cấm hay bắt buộc điều gì?'], ['The default needs a reason to change.', 'Mặc định chỉ đổi khi có lý do.']],
  loi: [['scrypt with default maxmem: ERR_CRYPTO_INVALID_SCRYPT_PARAMS.', 'scrypt với maxmem mặc định: ERR_CRYPTO_INVALID_SCRYPT_PARAMS.'], ['Migrating 200,000 bcrypt rows in a panic: bcrypt-10 is still slow.', 'Hoảng hốt chuyển 200.000 dòng bcrypt: bcrypt-10 vẫn chậm.']],
  kn: ['argon2 tuning'],
});

export default doiDau({ slug: 'auth-2-2-chon-va-chinh', ten: '2.2 Choosing and tuning the hash, by measurement', khoa: KHOA, baiHoc: 'auth-2-2-chon-va-chinh', de: [S1, S2, S3, S4] });
