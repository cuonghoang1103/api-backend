/** Node.js · 14.5 — Độ phủ 100% vẫn sót leo thang quyền EDITOR, test chập chờn (bốn nguyên nhân), CI và cổng chặn merge, kiểm thử đột biến. */
import { modul, cs, q, tn, bang1, jsBai, mutBai, c, TN, YC_MUT } from './_node-c12-14.mjs';

const POLICY = `/**
 * Who may edit a note. The rule: the author, or an ADMIN. Anonymous users never.
 * (The lesson's version also let every EDITOR edit every note — at 100 % coverage, with no test noticing.)
 */
export function canEdit(user, note) {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return note.authorId === user.id;
}
`;

const E1 = mutBai({
  ten: '14.5 · 100 % coverage, and the privilege escalation is still there', kho: 'MEDIUM', phut: 15,
  en: `<p>${c('src/policy.js')} decides who may edit a note: the author or an ${c('ADMIN')}; an anonymous user never. The starter tests reach <b>100 % of statements, branches, functions and lines</b> — and one of the 5 mutants, the lesson’s ${c("|| user.role === 'EDITOR'")} that lets every EDITOR edit every note, survives them. Coverage answers “was this line executed?”, not “would a test go red if this line were wrong?”. Add the tests that kill all 5.</p>`,
  vi: `<p>${c('src/policy.js')} quyết định ai được sửa một ghi chú: tác giả hoặc ${c('ADMIN')}; người vô danh thì không bao giờ. Bộ test khởi đầu đạt <b>100% câu lệnh, nhánh, hàm và dòng</b> — vậy mà một trong 5 đột biến, đúng cái ${c("|| user.role === 'EDITOR'")} của bài cho mọi EDITOR sửa mọi ghi chú, vẫn sống sót qua chúng. Độ phủ trả lời "dòng này đã chạy chưa?", không trả lời "nếu dòng này sai thì có test nào đỏ không?". Thêm các test diệt cả 5.</p>`,
  yc: YC_MUT(5, 5),
  dauVao: ['src/policy.test.js (Vitest).', 'src/policy.test.js (Vitest).'],
  dauRa: ['Green on the correct policy; red on each mutant.', 'Xanh với chính sách đúng; đỏ với từng đột biến.'],
  viDu: [{ input: "Mutant: return note.authorId === user.id || user.role === 'EDITOR';|||Đột biến: return note.authorId === user.id || user.role === 'EDITOR';", output: "Killed by: expect(canEdit({ id: 2, role: 'EDITOR' }, { authorId: 1 })).toBe(false)|||Bị diệt bởi: expect(canEdit({ id: 2, role: 'EDITOR' }, { authorId: 1 })).toBe(false)", explanation: 'Branch coverage records that both sides of || were EVALUATED, not that the outcome where the second side is true ever occurred. Only a test with an EDITOR who is not the author produces it.|||Độ phủ nhánh ghi rằng cả hai vế của || đã được TÍNH, không ghi rằng kết cục vế thứ hai đúng đã từng xảy ra. Chỉ test với một EDITOR không phải tác giả mới tạo ra nó.' }],
  goiY: [['List the roles that exist (USER, EDITOR, ADMIN, anonymous) and the two relations (author / not author). Each mutant lives in one cell of that table.', 'Liệt kê các vai trò có thật (USER, EDITOR, ADMIN, vô danh) và hai quan hệ (là tác giả / không phải). Mỗi đột biến sống trong một ô của bảng đó.'], ['The decisive test is the one nobody writes: an EDITOR who is not the author must get false.', 'Test quyết định là cái không ai viết: một EDITOR không phải tác giả phải nhận false.']],
  loi: [['Stopping at 100 % coverage: every line ran, the escalation is still there.', 'Dừng ở độ phủ 100%: mọi dòng đã chạy, lỗ leo thang vẫn còn đó.'], ['Testing only “allowed” cases: a policy that says yes to everyone passes all of them.', 'Chỉ test các ca "được phép": chính sách nói có với mọi người qua hết.'], ['Forgetting the anonymous user: a version without the null guard throws TypeError instead of answering false.', 'Quên người vô danh: bản thiếu chốt null ném TypeError thay vì trả false.']],
  gt: ['Coverage is a smoke detector: a low number is information, a high number is not a certificate. The question that matters — would a test go red if this line were wrong? — is exactly what mutation testing asks, by changing the line. The surviving mutant here is the lesson’s real escalation; one test with a non-author EDITOR kills it.', 'Độ phủ là cái báo khói: con số thấp là thông tin, con số cao không phải chứng chỉ. Câu hỏi quan trọng — nếu dòng này sai thì có test nào đỏ không? — chính là thứ kiểm thử đột biến hỏi, bằng cách đổi dòng đó. Đột biến sống sót ở đây là lỗ leo thang có thật của bài; một test với EDITOR không phải tác giả là diệt được nó.'],
  kn: ['coverage', 'mutation testing', 'authorization'], tns: [TN.mutant, TN.killed, tn('branch coverage', 'độ phủ nhánh', 'mỗi vế của một điều kiện đã được TÍNH — không phải mỗi kết cục đã xảy ra')],
  impl: { 'src/policy.js': POLICY },
  tepTest: 'src/policy.test.js',
  toiThieuTest: 5,
  dau: `import { describe, it, expect } from 'vitest';
import { canEdit } from './policy.js';

// 100 % statements, branches, functions and lines. Submit and see what survives.
describe('canEdit', () => {
  it('rejects an anonymous user', () => {
    expect(canEdit(null, { authorId: 1 })).toBe(false);
  });

  it('allows an admin', () => {
    expect(canEdit({ id: 9, role: 'ADMIN' }, { authorId: 1 })).toBe(true);
  });

  it('allows the author', () => {
    expect(canEdit({ id: 1, role: 'USER' }, { authorId: 1 })).toBe(true);
  });

  it('rejects another user', () => {
    expect(canEdit({ id: 2, role: 'USER' }, { authorId: 1 })).toBe(false);
  });

  it('allows an author who is an editor', () => {
    expect(canEdit({ id: 3, role: 'EDITOR' }, { authorId: 3 })).toBe(true);
  });
});
`,
  giai: `import { describe, it, expect } from 'vitest';
import { canEdit } from './policy.js';

const note = { authorId: 1 };

describe('canEdit — the author or an ADMIN, nobody else', () => {
  it('rejects an anonymous user (and does not crash)', () => {
    expect(canEdit(null, note)).toBe(false);
    expect(canEdit(undefined, note)).toBe(false);
  });

  it('allows an admin on somebody else\\'s note', () => {
    expect(canEdit({ id: 9, role: 'ADMIN' }, note)).toBe(true);
  });

  it('allows the author', () => {
    expect(canEdit({ id: 1, role: 'USER' }, note)).toBe(true);
  });

  it('rejects another user', () => {
    expect(canEdit({ id: 2, role: 'USER' }, note)).toBe(false);
  });

  // the case nobody wrote — kills the EDITOR escalation that survived 100 % coverage
  it('rejects an EDITOR who is not the author', () => {
    expect(canEdit({ id: 2, role: 'EDITOR' }, note)).toBe(false);
  });

  // role names are exact — kills a lowercase 'admin' check
  it('treats the role name exactly', () => {
    expect(canEdit({ id: 9, role: 'admin' }, note)).toBe(false);
  });
});
`,
  dotBien: [
    { file: 'src/policy.js', from: 'return note.authorId === user.id;', to: "return note.authorId === user.id || user.role === 'EDITOR';", label: 'every EDITOR may edit every note', goiY: 'an EDITOR who is NOT the author must get false · một EDITOR KHÔNG phải tác giả phải nhận false' },
    { file: 'src/policy.js', from: '  if (!user) return false;\n', to: '', label: 'no guard for anonymous users', goiY: 'canEdit(null, note) must answer false, not throw · canEdit(null, note) phải trả false, không ném lỗi' },
    { file: 'src/policy.js', from: "  if (user.role === 'ADMIN') return true;\n", to: '', label: 'admins can no longer edit others’ notes', goiY: 'an ADMIN on somebody else’s note → true · ADMIN với ghi chú của người khác → true' },
    { file: 'src/policy.js', from: 'return note.authorId === user.id;', to: 'return note.authorId !== user.id;', label: 'author check inverted', goiY: 'the author → true AND another user → false · tác giả → true VÀ người khác → false' },
    { file: 'src/policy.js', from: "if (user.role === 'ADMIN')", to: "if (String(user.role).toUpperCase() === 'ADMIN')", label: 'role compared case-insensitively', goiY: "a role 'admin' (lowercase) is not ADMIN · vai 'admin' (chữ thường) không phải ADMIN", an: true },
  ],
});

const E2 = cs({
  ten: '14.5 · Flaky tests, retries, and what CI is for', kho: 'EASY', phut: 10,
  en: 'Three things stand between a suite that exists and a suite that protects you: knowing what it does not check, knowing which failures are lies, and running it somewhere that is not your laptop.',
  vi: 'Ba thứ đứng giữa một bộ test tồn tại và một bộ test bảo vệ bạn: biết nó không kiểm gì, biết lần đỏ nào là nói dối, và chạy nó ở nơi không phải máy của bạn.',
  cau: [
    q('c1', ['A test fails 30 % of the time. Someone adds retry: 3. How often does it fail now, and is that a fix?', 'Một test đỏ 30% số lần. Ai đó thêm retry: 3. Giờ nó đỏ bao nhiêu, và đó có phải cách chữa?'],
      ['About 2.7 % (0.3³) — and no: it hides the shared state until it causes an incident', 'Never, because three attempts always include a green one', '10 %, because each retry divides the rate by three', 'Still 30 %, because retries are not counted'],
      ['Retries have one legitimate use: a test that genuinely depends on an external system you do not control. Everything else gets isolated, not retried.', 'Thử lại chỉ có một công dụng chính đáng: test thật sự phụ thuộc vào hệ thống bên ngoài mà bạn không kiểm soát. Mọi thứ khác phải được cô lập, không phải thử lại.']),
    q('c2', ['Ten runs of a suite: PASS=0 FAIL=10. Another suite: PASS=7 FAIL=3. Which is flaky?', 'Mười lần chạy một bộ test: PASS=0 FAIL=10. Bộ khác: PASS=7 FAIL=3. Bộ nào chập chờn?'],
      ['The second — the first is not flaky, it is reliably broken', 'Both — any failure in ten runs is flakiness', 'The first — it fails more often', 'Neither — flakiness needs at least 100 runs to show'],
      ['Run in a loop: probabilistic flakiness shows up as a frequency. Then --sequence.shuffle exposes order dependence in one run.', 'Chạy lặp: chập chờn theo xác suất lộ ra thành tần suất. Rồi --sequence.shuffle phơi bày sự phụ thuộc thứ tự chỉ trong một lần chạy.']),
    q('c3', ['Which is NOT one of the four flaky-test causes measured in chapter 14?', 'Cái nào KHÔNG thuộc bốn nguyên nhân test chập chờn đã đo trong chương 14?'],
      ['Using const instead of let for test fixtures', 'Shared state: four files TRUNCATE the same table', 'Leftover garbage: one row left by another script', 'Non-deterministic concurrency: the 23505 race, 0/5 cold, 4/5 warm'],
      ['The four: shared state, leftover garbage, real time at a boundary, non-deterministic concurrency — each measured somewhere in 14.2–14.4.', 'Bốn cái: trạng thái dùng chung, rác còn sót, giờ thật ở ranh giới, đồng thời không tất định — mỗi cái đã đo ở đâu đó trong 14.2–14.4.']),
    q('c4', ['Why does CI run npm ci and not npm install?', 'Vì sao CI chạy npm ci mà không phải npm install?'],
      ['npm ci installs exactly what the lockfile says', 'npm ci is the only command that works without a network', 'npm install does not install devDependencies in CI', 'npm ci runs the tests automatically'],
      ['The value of CI is a machine with none of your local state: no leftover rows, no node_modules from three branches ago, no variable you exported in October.', 'Giá trị của CI là một cái máy không có chút trạng thái cục bộ nào của bạn: không dòng sót, không node_modules từ ba nhánh trước, không biến bạn export hồi tháng Mười.']),
    q('c5', ['The site’s deploy ends with a smoke test that curls core GET routes and fails on any 404. What class of bug does it catch that no unit test can?', 'Deploy của website kết thúc bằng một smoke test curl các route GET cốt lõi và hỏng nếu có 404. Nó bắt loại lỗi nào mà không unit test nào bắt được?'],
      ['A stale image in which a route was never mounted', 'Slow SQL queries on the production database', 'Wrong HALF_UP rounding in money.ts', 'Missing tests for new routes'],
      ['An end-to-end test wearing a shell script’s clothes — the GIF picker outage of 2026-07-02 was exactly a route that 404’d in a stale image.', 'Một test end-to-end khoác áo script shell — sự cố bộ chọn GIF ngày 2026-07-02 đúng là một route trả 404 trong ảnh cũ.']),
  ],
  goiY: [['A flaky test is worse than no test: it trains the team to re-run CI instead of reading it.', 'Test chập chờn tệ hơn không có test: nó dạy cả đội bấm chạy lại CI thay vì đọc nó.'], ['What does CI have that your laptop does not? Nothing — that is the point.', 'CI có gì mà máy bạn không có? Không có gì — đó chính là điểm mấu chốt.']],
  loi: [['Reaching for --no-file-parallelism or retries as the fix for shared state.', 'Với tay tới --no-file-parallelism hay retry làm cách chữa cho trạng thái dùng chung.'], ['Calling a reliably broken test “flaky” and re-running it.', 'Gọi một test hỏng chắc chắn là "chập chờn" rồi chạy lại.']],
  tns: [tn('flaky test', 'test chập chờn', 'lúc xanh lúc đỏ mà code không đổi'), tn('merge gate', 'cổng chặn merge', 'các kiểm phải xanh trước khi được merge')],
  kn: ['flaky tests', 'CI'],
});

const CHAN = ['Blocks the merge', 'Advisory (does not block)'];
const E3 = cs({
  ten: '14.5 · What should block a merge?', kho: 'MEDIUM', phut: 8, loai: 'table',
  en: 'Every gate a developer cannot fix in under a minute is a gate they will eventually learn to bypass. Decide, for each check of a Notes API pipeline, whether it blocks the merge or is informational — following the lesson and the site’s ci-lint.yml.',
  vi: 'Mỗi cổng mà lập trình viên không sửa được trong dưới một phút là một cổng họ sẽ dần học cách lách qua. Với mỗi bước kiểm của pipeline Notes API, quyết định nó chặn merge hay chỉ để tham khảo — theo bài và theo ci-lint.yml của website.',
  bang: [bang1('b1', ['CI step → gate', 'Bước CI → loại cổng'], [{ ma: 's', ten: 'Step' }, { ma: 'g', ten: 'Gate', luaChon: CHAN }], [
    { o: { s: 'npx tsc --noEmit' }, a: { g: CHAN[0] } },
    { o: { s: 'npm test (unit + HTTP tests)' }, a: { g: CHAN[0] } },
    { o: { s: 'The migrations apply cleanly on an empty schema (once the suite touches the DB)' }, a: { g: CHAN[0] } },
    { o: { s: 'npm run lint (eslint style rules)' }, a: { g: CHAN[1] } },
    { o: { s: 'Coverage must stay above 90 %' }, a: { g: CHAN[1] } },
    { o: { s: 'The golden-set grader eval (no DB, no LLM key needed)' }, a: { g: CHAN[0] } },
  ], ['Block: the type check, tests whose failure means something is wrong rather than untidy (including the deterministic golden sets), and a migration that applies on an empty schema. Advisory: style opinions, lint warnings (continue-on-error: true in the site’s workflow) and coverage thresholds — 100 % coverage did not stop the EDITOR escalation, and a red lint blocking a hotfix teaches the team to ignore CI.', 'Chặn: kiểm kiểu, các test mà đỏ nghĩa là có gì đó sai chứ không phải chỉ lộn xộn (kể cả các bộ vàng tất định), và migration chạy được trên lược đồ rỗng. Tham khảo: ý kiến về phong cách, cảnh báo lint (continue-on-error: true trong workflow của website) và ngưỡng độ phủ — độ phủ 100% không ngăn được lỗ leo thang EDITOR, và lint đỏ chặn một bản vá nóng sẽ dạy cả đội lờ CI đi.'])],
  goiY: [['Does a failure mean the software is wrong, or only untidy?', 'Một lần đỏ có nghĩa phần mềm sai, hay chỉ lộn xộn?'], ['Recall what 100 % coverage proved in this lesson.', 'Nhớ lại độ phủ 100% đã chứng minh được gì trong bài này.']],
  loi: [['Making coverage a blocking gate: people write assertion-free tests to reach the number.', 'Biến độ phủ thành cổng chặn: người ta viết test không khẳng định gì để đạt con số.'], ['Letting lint block hotfixes: the fastest way to make a team bypass CI.', 'Để lint chặn bản vá nóng: cách nhanh nhất làm cả đội lách CI.']],
  tns: [tn('blocking check', 'kiểm chặn', 'đỏ thì không được merge'), tn('advisory check', 'kiểm tham khảo', 'hiện kết quả nhưng không chặn (continue-on-error)')],
  kn: ['CI'],
});

const E4 = jsBai({
  ten: '14.5 · Build a tiny mutation tester', kho: 'HARD', phut: 25,
  en: `<p>“Change the production code on purpose and check that a test goes red” — automated, that is mutation testing (Stryker in Node). Write ${c('mutationScore(tests, original, mutants)')}:</p><ul><li>${c('tests')} — ${c('[{ name, run(impl) }]')}; a test FAILS when ${c('run')} throws or returns a rejected promise;</li><li>${c('original')} — the correct implementation (any object); ${c('mutants')} — ${c('[{ label, impl }]')};</li><li>first run every test against ${c('original')}. If any fails, the suite is invalid: resolve to ${c('{ valid: false, failing: [names], killed: [], survived: [], score: 0 }')};</li><li>otherwise, a mutant is <b>killed</b> if at least one test fails against it, else it <b>survived</b>. ${c('score')} = ${c('Math.round(killed / mutants × 100)')} (100 when there are no mutants).</li></ul>`,
  vi: `<p>"Cố ý đổi code production rồi kiểm xem có test nào chuyển đỏ" — tự động hoá việc đó là kiểm thử đột biến (Stryker trong Node). Viết ${c('mutationScore(tests, original, mutants)')}:</p><ul><li>${c('tests')} — ${c('[{ name, run(impl) }]')}; một test HỎNG khi ${c('run')} ném lỗi hoặc trả promise bị reject;</li><li>${c('original')} — bản cài đặt đúng (object bất kỳ); ${c('mutants')} — ${c('[{ label, impl }]')};</li><li>trước tiên chạy mọi test với ${c('original')}. Nếu có cái hỏng, bộ test không hợp lệ: resolve ra ${c('{ valid: false, failing: [tên], killed: [], survived: [], score: 0 }')};</li><li>ngược lại, đột biến bị <b>diệt</b> nếu ít nhất một test hỏng với nó, không thì nó <b>sống sót</b>. ${c('score')} = ${c('Math.round(killed / mutants × 100)')} (100 khi không có đột biến nào).</li></ul>`,
  yc: [['A test fails by throwing OR by rejecting (await it).', 'Test hỏng khi ném lỗi HOẶC khi reject (hãy await nó).'], ['An invalid suite (red on the correct code) kills nothing.', 'Bộ test không hợp lệ (đỏ với code đúng) không diệt được gì.'], ['killed / survived keep the order of mutants.', 'killed / survived giữ thứ tự của mutants.']],
  dauVao: ['tests — [{ name, run(impl) }] · original — impl · mutants — [{ label, impl }]', 'tests — [{ name, run(impl) }] · original — impl · mutants — [{ label, impl }]'],
  dauRa: ['Promise<{ valid, failing, killed, survived, score }>', 'Promise<{ valid, failing, killed, survived, score }>'],
  goiY: [['const fails = async (t, impl) => { try { await t.run(impl); return false; } catch (e) { return true; } };', 'const fails = async (t, impl) => { try { await t.run(impl); return false; } catch (e) { return true; } };'], ['For each mutant: let dead = false; for (const t of tests) if (await fails(t, m.impl)) { dead = true; break; }', 'Với mỗi đột biến: let dead = false; for (const t of tests) if (await fails(t, m.impl)) { dead = true; break; }']],
  loi: [['Calling t.run(impl) without await: a test that rejects counts as passing — the async version of 14.2’s silent green test.', 'Gọi t.run(impl) thiếu await: test reject lại bị tính là qua — bản async của test xanh câm ở 14.2.'], ['Scoring mutants of an invalid suite: a test that is red on the correct code “kills” every mutant and the score reads 100 %.', 'Chấm đột biến của bộ test không hợp lệ: test đỏ với code đúng "diệt" mọi đột biến và điểm hiện 100%.'], ['Dividing by zero when there are no mutants.', 'Chia cho không khi không có đột biến nào.']],
  gt: ['A mutant is a hypothesis “this line could be wrong”; a killed mutant is evidence that some test watches that line. The validity check first is essential: a suite that is red on the correct code proves nothing about the mutants. This is the question coverage cannot answer — the reason canEdit stayed escalatable at 100 %.', 'Một đột biến là giả thuyết "dòng này có thể sai"; đột biến bị diệt là bằng chứng có test đang canh dòng đó. Kiểm tính hợp lệ trước là thiết yếu: bộ test đỏ với code đúng chẳng chứng minh gì về các đột biến. Đây là câu hỏi mà độ phủ không trả lời được — lý do canEdit vẫn leo thang được ở mức 100%.'],
  kn: ['mutation testing'], tns: [TN.mutant, TN.killed, tn('mutation score', 'điểm đột biến', 'phần trăm đột biến bị diệt')],
  dau: `/** Run the suite against the original and against each mutant. */
async function mutationScore(tests, original, mutants) {
  // Write your solution here
  const killed = [], survived = [];
  for (const m of mutants) {
    let dead = false;
    for (const t of tests) { try { t.run(m.impl); } catch (e) { dead = true; } }
    (dead ? killed : survived).push(m.label);
  }
  return { valid: true, failing: [], killed, survived, score: Math.round((killed.length / mutants.length) * 100) };
}
`,
  giai: `/** Run the suite against the original and against each mutant. */
async function mutationScore(tests, original, mutants) {
  const fails = async (t, impl) => {
    try { await t.run(impl); return false; }      // await: a rejected promise is a failure too
    catch (e) { return true; }
  };
  const failing = [];
  for (const t of tests) if (await fails(t, original)) failing.push(t.name);
  if (failing.length) return { valid: false, failing, killed: [], survived: [], score: 0 };   // red on correct code proves nothing

  const killed = [], survived = [];
  for (const m of mutants) {
    let dead = false;
    for (const t of tests) if (await fails(t, m.impl)) { dead = true; break; }   // one red test is enough
    (dead ? killed : survived).push(m.label);
  }
  const score = mutants.length ? Math.round((killed.length / mutants.length) * 100) : 100;
  return { valid: true, failing, killed, survived, score };
}
`,
  chung: `const eq = (a, b) => { if (a !== b) throw new Error('expected ' + b + ', got ' + a); };
const right = { canEdit: (u, n) => !!u && (u.role === 'ADMIN' || n.authorId === u.id) };
const M = [
  { label: 'EDITOR escalation', impl: { canEdit: (u, n) => !!u && (u.role === 'ADMIN' || n.authorId === u.id || u.role === 'EDITOR') } },
  { label: 'no admin', impl: { canEdit: (u, n) => !!u && n.authorId === u.id } },
  { label: 'no null guard', impl: { canEdit: (u, n) => u.role === 'ADMIN' || n.authorId === u.id } },
];
const coverageSuite = [
  { name: 'anonymous', run: (i) => eq(i.canEdit(null, { authorId: 1 }), false) },
  { name: 'admin', run: (i) => eq(i.canEdit({ id: 9, role: 'ADMIN' }, { authorId: 1 }), true) },
  { name: 'author', run: (i) => eq(i.canEdit({ id: 1, role: 'USER' }, { authorId: 1 }), true) },
];`,
  cases: [
    { goi: `await mutationScore(coverageSuite, right, M)`, moTa: ['The coverage suite: EDITOR escalation survives', 'Bộ test theo độ phủ: lỗ EDITOR sống sót'] },
    { goi: `await mutationScore([...coverageSuite, { name: 'editor not author', run: (i) => eq(i.canEdit({ id: 2, role: 'EDITOR' }, { authorId: 1 }), false) }], right, M)`, moTa: ['One more test kills it: 100 %', 'Thêm một test là diệt được: 100%'] },
    { goi: `await mutationScore([{ name: 'wrong expectation', run: (i) => eq(i.canEdit(null, {}), true) }, ...coverageSuite], right, M)`, moTa: ['A suite red on the correct code is invalid', 'Bộ test đỏ với code đúng là không hợp lệ'] },
    { goi: `await mutationScore([{ name: 'async', run: async (i) => { await new Promise((ok) => setTimeout(ok, 5)); eq(i.canEdit({ id: 2, role: 'EDITOR' }, { authorId: 1 }), false); } }], right, M)`, an: true, moTa: ['Async tests: a rejection counts as a failure', 'Test async: reject được tính là hỏng'] },
    { goi: `[await mutationScore(coverageSuite, right, []), await mutationScore([], right, M)]`, an: true },
  ],
});

export default modul('nodejs-14-5-do-phu-flaky-ci', '14.5 Coverage vs mutation, flaky tests, CI gates', [E1, E2, E3, E4]);
