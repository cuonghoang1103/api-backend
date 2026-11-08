/** Node.js · 14.2 — Unit test, hàng giả (dummy/stub/spy/mock/fake), tiêm phụ thuộc, đồng hồ giả, và những test không kiểm gì. */
import { modul, cs, q, tn, jsBai, mutBai, c, TN, YC_MUT } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '14.2 · Four tests that pass while checking nothing', kho: 'MEDIUM', phut: 10,
  en: 'Each of these looks like a test, is counted as a test, can turn the suite green and verify nothing. The lesson ran all four under vitest 4.1.10 and under node:test.',
  vi: 'Mỗi cái dưới đây trông như một test, được đếm là một test, có thể làm bộ test xanh mà không kiểm gì. Bài chạy cả bốn dưới vitest 4.1.10 và dưới node:test.',
  cau: [
    q('c1', ['it(\'…\', () => { [].forEach(() => { expect(1).toBe(2); }); }) — what does vitest report, and what catches it?', 'it(\'…\', () => { [].forEach(() => { expect(1).toBe(2); }); }) — vitest báo gì, và cái gì bắt được nó?'],
      ['✓ passed — no assertion ran; expect.assertions(1) (vitest) or t.plan(1) (node:test) turns it red', '× failed — vitest notices the callback was never called', '✓ passed, and nothing can ever catch it', '× failed, because an empty array is an error in forEach'],
      ['From the runner’s point of view nothing bad happened: no assertion ran, none failed. Counting assertions is the guard.', 'Từ góc nhìn của runner chẳng có gì xấu xảy ra: không khẳng định nào chạy, không cái nào đỏ. Đếm số khẳng định là chốt chặn.']),
    q('c2', ['try { expect(await computeTotal()).toBe(999); } catch { } — with expect.assertions(1) added, does the test go red?', 'try { expect(await computeTotal()).toBe(999); } catch { } — thêm expect.assertions(1), test có đỏ không?'],
      ['No — the assertion DID run (and failed); the catch swallowed it, so the counter reads 1', 'Yes — expect.assertions detects the swallowed failure', 'Yes — vitest forbids catch blocks around expect', 'No — but t.plan(1) in node:test would catch it'],
      ['No runner flag saves you from catch {} around your own assertion. The only defence: break the code on purpose and watch the test go red.', 'Không cờ nào của runner cứu được bạn khỏi catch {} bọc quanh khẳng định của chính mình. Cách phòng duy nhất: cố ý làm hỏng code và xem test chuyển đỏ.']),
    q('c3', ['expect(chuyenTien()).rejects.toThrow(\'WRONG MESSAGE\') without await. vitest vs node:test (assert.rejects without await)?', 'expect(chuyenTien()).rejects.toThrow(\'SAI THÔNG ĐIỆP\') thiếu await. vitest so với node:test (assert.rejects thiếu await)?'],
      ['vitest flags it (red); node:test lets assert.rejects without await pass silently', 'Both pass silently', 'Both fail, because a missing await is a syntax error', 'node:test flags it; vitest lets it pass'],
      ['The one place the runners genuinely differ. In exchange, node:test ships t.plan(n), which caught the never-run callback that vitest missed.', 'Chỗ duy nhất hai runner thật sự khác nhau. Đổi lại, node:test có t.plan(n), bắt được callback không bao giờ chạy mà vitest bỏ sót.']),
    q('c4', ['“A duplicate slug must not reach the database at all.” Which assertion expresses that behaviour?', '"Slug trùng không được chạm tới CSDL." Khẳng định nào diễn đạt hành vi đó?'],
      ['The 409 AND expect(repo.insert).not.toHaveBeenCalled()', 'expect(repo.findBySlug).toHaveBeenCalledTimes(1) only', 'expect(svc.create(…)).toBeDefined()', 'expect(repo).toEqual(fakeRepo())'],
      ['Assert on the outcome when you can; assert on “was this called” only when the call itself is the behaviour — here, NOT inserting is the rule.', 'Khẳng định trên kết quả khi có thể; chỉ khẳng định "có được gọi không" khi chính lời gọi là hành vi — ở đây, KHÔNG chèn mới là luật.']),
    q('c5', ['What made createNotesService unit-testable in the first place?', 'Điều gì khiến createNotesService test đơn vị được ngay từ đầu?'],
      ['It takes its repository as an argument instead of importing db.mjs — tests pass an object literal', 'It was rewritten in TypeScript, which allows mocking imports', 'vitest can intercept any import automatically', 'The repository was moved into the same file as the service'],
      ['Testability is something the application code allows or forbids. Production wires createNotesRepo(pool); tests wire a fake — same service, two speeds.', 'Khả năng test là thứ code ứng dụng cho phép hay cấm. Production nối createNotesRepo(pool); test nối đồ giả — cùng một service, hai tốc độ.']),
    q('c6', ['Which kind of test double is a repository backed by a Map that really stores and returns notes?', 'Một repository dựa trên Map, thật sự lưu và trả ghi chú, là loại hàng giả nào?'],
      ['A fake — a miniature but genuinely working implementation', 'A stub — it returns a canned value', 'A dummy — it only fills a parameter slot', 'A spy — it records calls to the real database'],
      ['Dummy fills a slot, stub returns a canned value, spy records calls, mock adds an expectation about the calls, fake actually works (in memory).', 'Dummy lấp một chỗ tham số, stub trả giá trị dựng sẵn, spy ghi lại lời gọi, mock thêm kỳ vọng về lời gọi, fake thật sự chạy (trong bộ nhớ).']),
  ],
  goiY: [['Ask: did an assertion run, and could it fail?', 'Hỏi: có khẳng định nào chạy không, và nó có thể đỏ không?'], ['The habit that catches all four: break the code, watch the test go red.', 'Thói quen bắt được cả bốn: làm hỏng code, nhìn test chuyển đỏ.']],
  loi: [['A new test that has never been red — it may be asserting nothing.', 'Một test mới chưa từng đỏ — có thể nó không khẳng định gì.'], ['Asserting only that functions were called: a refactor that breaks the behaviour keeps it green.', 'Chỉ khẳng định rằng hàm đã được gọi: một lần tái cấu trúc làm hỏng hành vi vẫn để nó xanh.']],
  tns: [TN.double, tn('expect.assertions(n)', 'đếm khẳng định', 'test đỏ nếu số khẳng định đã chạy khác n'), tn('t.plan(n)', 'kế hoạch khẳng định (node:test)', 'tương đương expect.assertions')],
  kn: ['test doubles', 'assertions'],
});

const E2 = jsBai({
  ten: '14.2 · Build a spy', kho: 'EASY', phut: 12,
  en: `<p>A spy calls through for real but records the call so you can inspect it later — what ${c('vi.fn(impl)')} gives you. Write ${c('createSpy(impl)')} returning a function ${c('spy')} that:</p><ul><li>calls ${c('impl(...args)')} (default: returns ${c('undefined')}) and returns its result — or re-throws its error;</li><li>records every call in ${c('spy.calls')} as the array of arguments, and every outcome in ${c('spy.results')} as ${c("{ type: 'return', value }")} or ${c("{ type: 'throw', value: error.message }")};</li><li>exposes ${c('spy.callCount')} (a number kept up to date) and ${c('spy.calledWith(...args)')} → ${c('true')} if some call had exactly these arguments (compare with ${c('JSON.stringify')}).</li></ul>`,
  vi: `<p>Spy gọi xuyên qua hàm thật nhưng ghi lại lời gọi để bạn soi sau — thứ ${c('vi.fn(impl)')} đưa cho bạn. Viết ${c('createSpy(impl)')} trả về một hàm ${c('spy')}:</p><ul><li>gọi ${c('impl(...args)')} (mặc định: trả ${c('undefined')}) và trả kết quả của nó — hoặc ném lại lỗi của nó;</li><li>ghi mọi lời gọi vào ${c('spy.calls')} dưới dạng mảng đối số, và mọi kết cục vào ${c('spy.results')} dạng ${c("{ type: 'return', value }")} hoặc ${c("{ type: 'throw', value: error.message }")};</li><li>có ${c('spy.callCount')} (số luôn được cập nhật) và ${c('spy.calledWith(...args)')} → ${c('true')} nếu có lời gọi đúng các đối số này (so bằng ${c('JSON.stringify')}).</li></ul>`,
  yc: [['The call is recorded even when impl throws.', 'Lời gọi vẫn được ghi kể cả khi impl ném lỗi.'], ['The spy is transparent: same return value, same error.', 'Spy trong suốt: cùng giá trị trả về, cùng lỗi.'], ['Each spy has its own records.', 'Mỗi spy có sổ ghi riêng.']],
  dauVao: ['impl — function (optional)', 'impl — hàm (không bắt buộc)'],
  dauRa: ['spy — function with calls, results, callCount, calledWith', 'spy — hàm có calls, results, callCount, calledWith'],
  goiY: [['function spy(...args) { spy.calls.push(args); spy.callCount++; try { const value = impl(...args); spy.results.push({ type: \'return\', value }); return value; } catch (e) { … throw e; } }', 'function spy(...args) { spy.calls.push(args); spy.callCount++; try { const value = impl(...args); spy.results.push({ type: \'return\', value }); return value; } catch (e) { … throw e; } }'], ['spy.calledWith = (...a) => spy.calls.some((c) => JSON.stringify(c) === JSON.stringify(a));', 'spy.calledWith = (...a) => spy.calls.some((c) => JSON.stringify(c) === JSON.stringify(a));']],
  loi: [['Recording the call after impl(...): a throwing call is never recorded, so “was it called?” lies exactly when it matters.', 'Ghi lời gọi sau impl(...): lời gọi ném lỗi không bao giờ được ghi, nên "đã được gọi chưa?" nói dối đúng lúc cần.'], ['Swallowing the error to record it: the code under test no longer sees the failure it must handle.', 'Nuốt lỗi để ghi lại: code đang test không còn thấy lỗi mà nó phải xử lý.'], ['Storing the arguments array by reference and the caller mutates it later.', 'Lưu mảng đối số theo tham chiếu rồi nơi gọi sửa nó sau.']],
  gt: ['A spy must not change behaviour — same value out, same error out — or the test measures a different program. Recording before calling and pushing the outcome in both branches is what makes interaction assertions like “insert was not called” trustworthy.', 'Spy không được đổi hành vi — cùng giá trị ra, cùng lỗi ra — không thì test đo một chương trình khác. Ghi trước khi gọi và đẩy kết cục ở cả hai nhánh là thứ làm cho các khẳng định tương tác như "insert không được gọi" đáng tin.'],
  kn: ['test doubles', 'spy'], tns: [tn('spy', 'gián điệp', 'gọi hàm thật nhưng ghi lại lời gọi'), TN.double],
  dau: `/** A minimal vi.fn(): calls through, records everything. */
function createSpy(impl = () => undefined) {
  // Write your solution here
  function spy(...args) {
    const value = impl(...args);
    spy.calls.push(args);
    spy.results.push({ type: 'return', value });
    return value;
  }
  spy.calls = [];
  spy.results = [];
  spy.callCount = 0;
  spy.calledWith = () => spy.calls.length > 0;
  return spy;
}
`,
  giai: `/** A minimal vi.fn(): calls through, records everything, changes nothing. */
function createSpy(impl = () => undefined) {
  function spy(...args) {
    spy.calls.push([...args]);                 // record FIRST: a throwing call is still a call
    spy.callCount = spy.calls.length;
    try {
      const value = impl(...args);
      spy.results.push({ type: 'return', value });
      return value;                            // transparent: same value out
    } catch (e) {
      spy.results.push({ type: 'throw', value: e && e.message });
      throw e;                                 // transparent: same error out
    }
  }
  spy.calls = [];
  spy.results = [];
  spy.callCount = 0;
  spy.calledWith = (...a) => spy.calls.some((c) => JSON.stringify(c) === JSON.stringify(a));
  return spy;
}
`,
  cases: [
    { goi: `(() => { const s = createSpy((a, b) => a + b); return [s(1, 2), s(3, 4), s.calls, s.callCount, s.results]; })()`, moTa: ['Calls through and records arguments and results', 'Gọi xuyên qua và ghi đối số lẫn kết quả'] },
    { goi: `(() => { const s = createSpy((x) => { if (x < 0) throw new RangeError('NEG'); return x; }); let err; try { s(-1); } catch (e) { err = e.name; } return [err, s.callCount, s.results]; })()`, moTa: ['A throwing call is recorded AND re-thrown', 'Lời gọi ném lỗi được ghi VÀ được ném lại'] },
    { goi: `(() => { const s = createSpy(); s({ id: 3 }, 'x'); return [s.calledWith({ id: 3 }, 'x'), s.calledWith({ id: 4 }, 'x'), s.calledWith({ id: 3 }), s()]; })()`, moTa: ['calledWith compares the whole argument list', 'calledWith so toàn bộ danh sách đối số'] },
    { goi: `(() => { const a = createSpy(), b = createSpy(); a(1); a(2); b(3); const arr = [9]; a(arr); arr.push(10); return [a.callCount, b.callCount, a.calls[2], b.calledWith(1)]; })()`, an: true },
    { goi: `(() => { const s = createSpy(() => { throw new Error('boom'); }); try { s('a'); } catch (e) {} try { s('b'); } catch (e) {} return [s.calls, s.results.map((r) => r.type + ':' + r.value), s.calledWith('b')]; })()`, an: true },
  ],
});

const E3 = jsBai({
  ten: '14.2 · A fake repository that really works', kho: 'MEDIUM', phut: 15,
  en: `<p>A <b>fake</b> is a miniature but genuinely working implementation — the Map-backed repository the service tests run against at 0.0006 ms a call. Write ${c('createFakeNotesRepo(seed = [])')} with the same async methods as the real one:</p><ul><li>${c('insert(note)')} → stores ${c('{ ...note, id }')} with the next id (one more than the highest id so far, starting at 1) and resolves to a COPY;</li><li>${c('findById(id)')} / ${c('findBySlug(slug)')} → a copy or ${c('null')};</li><li>${c('update(id, patch)')} → merges ${c('patch')} into the stored note and resolves to a copy, or ${c('null')} if the id does not exist;</li><li>${c('listByAuthor(authorId)')} → copies, sorted by id.</li></ul><p>Copies matter: a test that mutates a returned object must not change what is stored.</p>`,
  vi: `<p><b>Fake</b> là một bản cài đặt thu nhỏ nhưng chạy thật — repository dựa trên Map mà các test service chạy với nó ở mức 0,0006 ms mỗi lời gọi. Viết ${c('createFakeNotesRepo(seed = [])')} với cùng các phương thức async như repository thật:</p><ul><li>${c('insert(note)')} → lưu ${c('{ ...note, id }')} với id kế tiếp (lớn hơn id cao nhất hiện có một đơn vị, bắt đầu từ 1) và resolve ra một BẢN SAO;</li><li>${c('findById(id)')} / ${c('findBySlug(slug)')} → bản sao hoặc ${c('null')};</li><li>${c('update(id, patch)')} → trộn ${c('patch')} vào ghi chú đã lưu và resolve ra bản sao, hoặc ${c('null')} nếu id không tồn tại;</li><li>${c('listByAuthor(authorId)')} → các bản sao, sắp theo id.</li></ul><p>Bản sao quan trọng: test sửa object được trả về không được làm đổi thứ đã lưu.</p>`,
  yc: [['All methods are async (return Promises), like the real repository.', 'Mọi phương thức đều async (trả Promise), như repository thật.'], ['Never hand out the stored object itself.', 'Không bao giờ đưa ra chính object đã lưu.'], ['Ids continue after the highest seeded id.', 'Id tiếp nối sau id cao nhất trong dữ liệu mồi.']],
  dauVao: ['seed — notes with ids', 'seed — các ghi chú có id'],
  dauRa: ['{ insert, findById, findBySlug, update, listByAuthor }', '{ insert, findById, findBySlug, update, listByAuthor }'],
  goiY: [['const rows = new Map(seed.map((n) => [n.id, { ...n }])); let last = Math.max(0, ...seed.map((n) => n.id));', 'const rows = new Map(seed.map((n) => [n.id, { ...n }])); let last = Math.max(0, ...seed.map((n) => n.id));'], ['const copy = (n) => (n ? { ...n } : null); — use it on every way out.', 'const copy = (n) => (n ? { ...n } : null); — dùng nó ở mọi lối ra.']],
  loi: [['Returning the stored object: one test mutates it and the next test sees a different database.', 'Trả chính object đã lưu: một test sửa nó và test sau thấy một CSDL khác.'], ['Synchronous methods: the service awaits them anyway, but a test that checks for a Promise (or uses .then) breaks — and the fake no longer behaves like the real thing.', 'Phương thức đồng bộ: service đằng nào cũng await, nhưng test kiểm Promise (hoặc dùng .then) sẽ hỏng — và đồ giả không còn cư xử như đồ thật.'], ['Ids starting at 1 although the seed already has id 1: two notes with the same id.', 'Id bắt đầu từ 1 dù dữ liệu mồi đã có id 1: hai ghi chú cùng id.']],
  gt: ['A fake earns its place by behaving like the real repository in every way the service can observe — async, ids, nulls, copies — while running in memory. Lesson 14.4 measures where it still lies: it has no unique constraint, so five concurrent duplicates all get 201 against it.', 'Fake có giá trị nhờ cư xử như repository thật ở mọi khía cạnh service quan sát được — async, id, null, bản sao — trong khi chạy trong bộ nhớ. Bài 14.4 đo chỗ nó vẫn nói dối: nó không có ràng buộc duy nhất, nên năm bản trùng đồng thời đều nhận 201 khi chạy với nó.'],
  kn: ['test doubles', 'fake'], tns: [tn('fake', 'đồ giả chạy thật', 'bản cài đặt thu nhỏ nhưng thật sự hoạt động, ví dụ repo dựa trên Map'), TN.double],
  dau: `/** A Map-backed notes repository for unit tests. */
function createFakeNotesRepo(seed = []) {
  // Write your solution here
  const rows = new Map(seed.map((n) => [n.id, n]));
  let last = 0;
  return {
    async insert(note) { const n = { ...note, id: ++last }; rows.set(n.id, n); return n; },
    async findById(id) { return rows.get(id) || null; },
    async findBySlug(slug) { return [...rows.values()].find((n) => n.slug === slug) || null; },
    async update(id, patch) { const n = rows.get(id); Object.assign(n, patch); return n; },
    async listByAuthor(authorId) { return [...rows.values()].filter((n) => n.authorId === authorId); },
  };
}
`,
  giai: `/** A Map-backed notes repository for unit tests — a FAKE: small, but genuinely working. */
function createFakeNotesRepo(seed = []) {
  const rows = new Map(seed.map((n) => [n.id, { ...n }]));
  let last = Math.max(0, ...seed.map((n) => n.id));          // continue after the seeded ids
  const copy = (n) => (n ? { ...n } : null);                 // never hand out the stored object
  return {
    async insert(note) {
      const n = { ...note, id: ++last };
      rows.set(n.id, n);
      return copy(n);
    },
    async findById(id) { return copy(rows.get(id)); },
    async findBySlug(slug) { return copy([...rows.values()].find((n) => n.slug === slug)); },
    async update(id, patch) {
      const n = rows.get(id);
      if (!n) return null;                                    // like UPDATE … RETURNING with 0 rows
      Object.assign(n, patch);
      return copy(n);
    },
    async listByAuthor(authorId) {
      return [...rows.values()].filter((n) => n.authorId === authorId).sort((a, b) => a.id - b.id).map(copy);
    },
  };
}
`,
  chung: `const repo = createFakeNotesRepo([{ id: 1, title: 'Hello', slug: 'hello', authorId: 7 }, { id: 3, title: 'Later', slug: 'later', authorId: 8 }]);`,
  cases: [
    { goi: `[await repo.insert({ title: 'New', slug: 'new', authorId: 7 }), await repo.findBySlug('new'), await repo.findBySlug('nope')]`, moTa: ['insert continues after the highest seeded id (3 → 4)', 'insert tiếp nối sau id mồi cao nhất (3 → 4)'] },
    { goi: `await (async () => { const n = await repo.findById(1); n.title = 'HACKED'; return [(await repo.findById(1)).title, await repo.update(99, { title: 'x' })]; })()`, moTa: ['Returned objects are copies; unknown id → null', 'Object trả về là bản sao; id lạ → null'] },
    { goi: `[repo.findById(1) instanceof Promise, await repo.update(1, { title: 'Hi' }), (await repo.listByAuthor(7)).map((n) => n.id)]`, moTa: ['Methods are async; update merges', 'Phương thức là async; update trộn dữ liệu'] },
    { goi: `await (async () => { const r = createFakeNotesRepo(); const a = await r.insert({ slug: 'a', authorId: 1 }); await r.insert({ slug: 'b', authorId: 2 }); await r.insert({ slug: 'c', authorId: 1 }); const l = await r.listByAuthor(1); l[0].slug = 'x'; return [a.id, (await r.listByAuthor(1)).map((n) => n.slug), (await r.listByAuthor(3))]; })()`, an: true },
    { goi: `await (async () => { const seed = [{ id: 10, slug: 's', authorId: 1 }]; const r = createFakeNotesRepo(seed); seed[0].slug = 'changed'; const u = await r.update(10, { body: 'b' }); u.slug = 'y'; return [await r.findById(10), (await r.insert({ slug: 'n' })).id]; })()`, an: true },
  ],
});

const SLUG2 = `export function slugify(title) {
  return String(title).toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
`;
const SERVICE = `import { slugify } from './slug.js';

const fail = (message, status) => Object.assign(new Error(message), { status });

/** The Notes service takes its repository as an ARGUMENT — that is what makes it unit-testable. */
export function createNotesService(repo) {
  return {
    async create(actor, input) {
      const slug = slugify(input.title);
      if (!slug) throw fail('EMPTY_SLUG', 400);
      const existing = await repo.findBySlug(slug);
      if (existing) throw fail('SLUG_TAKEN', 409);
      return repo.insert({ title: input.title, slug, body: input.body ?? '', authorId: actor.id });
    },

    async update(actor, id, patch) {
      const note = await repo.findById(id);
      // somebody else's note answers 404, not 403 — a 403 would confirm that it exists (chapter 8)
      if (!note || note.authorId !== actor.id) throw fail('NOT_FOUND', 404);
      return repo.update(id, { title: patch.title ?? note.title, body: patch.body ?? note.body });
    },
  };
}
`;

const E4 = mutBai({
  ten: '14.2 · Unit-test the Notes service with a fake repository', kho: 'MEDIUM', phut: 25,
  en: `<p>${c('src/notes.service.js')} takes its repository as an argument. Write ${c('src/notes.service.test.js')} that drives it with a fake built from ${c('vi.fn')} and pins down its rules:</p><ul><li>${c('create(actor, input)')}: an empty slug ⇒ ${c('400 EMPTY_SLUG')}; a taken slug ⇒ ${c('409 SLUG_TAKEN')} and <b>the database is not written</b>; otherwise ${c('repo.insert({ title, slug, body, authorId: actor.id })')} — the author is always the ACTOR, never something from the input;</li><li>${c('update(actor, id, patch)')}: a missing note or somebody else’s note ⇒ ${c('404 NOT_FOUND')} (not 403), and ${c('repo.update')} is not called.</li></ul><p>Errors are ${c('Error')} objects with a ${c('status')} property — assert them with ${c('await expect(promise).rejects.toMatchObject({ status: 409 })')}. Seven mutants, plus one harmless refactor your tests must survive.</p>`,
  vi: `<p>${c('src/notes.service.js')} nhận repository qua đối số. Viết ${c('src/notes.service.test.js')} điều khiển nó bằng đồ giả dựng từ ${c('vi.fn')} và ghim chặt các luật của nó:</p><ul><li>${c('create(actor, input)')}: slug rỗng ⇒ ${c('400 EMPTY_SLUG')}; slug đã có ⇒ ${c('409 SLUG_TAKEN')} và <b>CSDL không bị ghi</b>; ngược lại ${c('repo.insert({ title, slug, body, authorId: actor.id })')} — tác giả luôn là NGƯỜI THỰC HIỆN, không bao giờ lấy từ đầu vào;</li><li>${c('update(actor, id, patch)')}: ghi chú không có hoặc của người khác ⇒ ${c('404 NOT_FOUND')} (không phải 403), và ${c('repo.update')} không được gọi.</li></ul><p>Lỗi là đối tượng ${c('Error')} có thuộc tính ${c('status')} — khẳng định bằng ${c('await expect(promise).rejects.toMatchObject({ status: 409 })')}. Bảy đột biến, cộng một lần tái cấu trúc vô hại mà test của bạn phải vẫn xanh.</p>`,
  yc: [...YC_MUT(6, 7), ['A harmless refactor of the code must keep your tests green — assert the rules, not incidental details.', 'Một lần tái cấu trúc vô hại phải giữ test của bạn xanh — khẳng định luật, không khẳng định chi tiết vụn vặt.']],
  dauVao: ['src/notes.service.test.js (Vitest; vi.fn for the repository).', 'src/notes.service.test.js (Vitest; vi.fn cho repository).'],
  dauRa: ['Green on the correct code and on the refactor; red on each mutant.', 'Xanh với code đúng và với bản tái cấu trúc; đỏ với từng đột biến.'],
  viDu: [{ input: "Mutant: update writes the change BEFORE the ownership check (still answers 404)|||Đột biến: update ghi thay đổi TRƯỚC khi kiểm chủ sở hữu (vẫn trả 404)", output: 'Killed by: expect(repo.update).not.toHaveBeenCalled()|||Bị diệt bởi: expect(repo.update).not.toHaveBeenCalled()', explanation: 'Checking only the 404 lets this mutant through: the answer is right, the effect is not.|||Chỉ kiểm 404 thì đột biến này lọt: câu trả lời đúng, tác dụng thì sai.' }],
  goiY: [['A factory keeps tests short: const fakeRepo = (o = {}) => ({ findBySlug: vi.fn(async () => null), findById: vi.fn(async () => null), insert: vi.fn(async (n) => ({ id: 1, ...n })), update: vi.fn(async (id, p) => ({ id, ...p })), ...o });', 'Một hàm nhà máy giữ test ngắn: const fakeRepo = (o = {}) => ({ findBySlug: vi.fn(async () => null), findById: vi.fn(async () => null), insert: vi.fn(async (n) => ({ id: 1, ...n })), update: vi.fn(async (id, p) => ({ id, ...p })), ...o });'], ['For the author rule: call create with input { title: \'Hi\', authorId: 99 } as actor { id: 7 } and expect(repo.insert).toHaveBeenCalledWith(expect.objectContaining({ authorId: 7 })).', 'Cho luật tác giả: gọi create với input { title: \'Hi\', authorId: 99 } dưới actor { id: 7 } và expect(repo.insert).toHaveBeenCalledWith(expect.objectContaining({ authorId: 7 })).'], ['Status AND effect for every refusal: rejects.toMatchObject({ status }) plus expect(repo.insert / repo.update).not.toHaveBeenCalled().', 'Trạng thái VÀ tác dụng cho mỗi lần từ chối: rejects.toMatchObject({ status }) cộng expect(repo.insert / repo.update).not.toHaveBeenCalled().']],
  loi: [['expect(svc.create(…)).rejects.toMatchObject(…) without await: vitest flags it, but the habit loses errors in other runners.', 'expect(svc.create(…)).rejects.toMatchObject(…) thiếu await: vitest bắt được, nhưng thói quen đó làm mất lỗi ở runner khác.'], ['Asserting toHaveBeenCalledWith({ title, slug, body: \'\', authorId: 7 }) exactly, byte for byte: correct today, but a harmless refactor (or a new column) turns it red.', 'Khẳng định toHaveBeenCalledWith({ title, slug, body: \'\', authorId: 7 }) chính xác từng byte: đúng hôm nay, nhưng một lần tái cấu trúc vô hại (hay một cột mới) làm nó đỏ.'], ['Testing only the 404 status of the IDOR case: a version that updates first and then answers 404 survives.', 'Chỉ test mã 404 của ca IDOR: bản cập nhật trước rồi mới trả 404 vẫn sống sót.']],
  gt: ['Each mutant breaks one rule the service exists to enforce: the 409, not reaching the database on a duplicate, 404-not-403, the ownership check itself, the author taken from the actor (mass assignment), and the empty-slug guard. A suite kills them only by asserting both the answer (rejects.toMatchObject) and the effect (not.toHaveBeenCalled / objectContaining) — while staying loose enough that the harmless refactor stays green.', 'Mỗi đột biến phá một luật mà service tồn tại để giữ: mã 409, không chạm CSDL khi trùng, 404-không-phải-403, bản thân phép kiểm chủ sở hữu, tác giả lấy từ người thực hiện (gán hàng loạt), và chốt slug rỗng. Bộ test chỉ diệt được chúng khi khẳng định cả câu trả lời (rejects.toMatchObject) lẫn tác dụng (not.toHaveBeenCalled / objectContaining) — mà vẫn đủ lỏng để bản tái cấu trúc vô hại giữ xanh.'],
  kn: ['test doubles', 'dependency injection', 'authorization test'], tns: [TN.double, TN.mutant, tn('mass assignment', 'gán hàng loạt', 'để client đặt trường mà lẽ ra server quyết định, như authorId')],
  impl: { 'src/notes.service.js': SERVICE, 'src/slug.js': SLUG2 },
  tepTest: 'src/notes.service.test.js',
  toiThieuTest: 6,
  dau: `import { describe, it, expect, vi } from 'vitest';
import { createNotesService } from './notes.service.js';

const actor = { id: 7 };
const fakeRepo = (overrides = {}) => ({
  findBySlug: vi.fn(async () => null),
  findById: vi.fn(async () => null),
  insert: vi.fn(async (n) => ({ id: 1, ...n })),
  update: vi.fn(async (id, p) => ({ id, ...p })),
  ...overrides,
});

// Six tests, all green — and most mutants survive them. Submit and read the table.
describe('create', () => {
  it('creates a note', async () => {
    const repo = fakeRepo();
    const note = await createNotesService(repo).create(actor, { title: 'Hello World' });
    expect(note.slug).toBe('hello-world');
  });

  it('rejects a duplicate slug', async () => {
    const repo = fakeRepo({ findBySlug: vi.fn(async () => ({ id: 3 })) });
    await expect(createNotesService(repo).create(actor, { title: 'Hello World' })).rejects.toThrow();
  });

  it('keeps the title', async () => {
    const note = await createNotesService(fakeRepo()).create(actor, { title: 'Hi' });
    expect(note.title).toBe('Hi');
  });
});

describe('update', () => {
  it('updates my own note', async () => {
    const repo = fakeRepo({ findById: vi.fn(async () => ({ id: 5, authorId: 7, title: 'a', body: '' })) });
    const n = await createNotesService(repo).update(actor, 5, { title: 'b' });
    expect(n.title).toBe('b');
  });

  it('refuses a missing note', async () => {
    await expect(createNotesService(fakeRepo()).update(actor, 5, { title: 'b' })).rejects.toThrow();
  });

  it('keeps the body when only the title changes', async () => {
    const repo = fakeRepo({ findById: vi.fn(async () => ({ id: 5, authorId: 7, title: 'a', body: 'old' })) });
    const n = await createNotesService(repo).update(actor, 5, { title: 'b' });
    expect(n.body).toBe('old');
  });
});
`,
  giai: `import { describe, it, expect, vi } from 'vitest';
import { createNotesService } from './notes.service.js';

const actor = { id: 7 };
const fakeRepo = (overrides = {}) => ({
  findBySlug: vi.fn(async () => null),
  findById: vi.fn(async () => null),
  insert: vi.fn(async (n) => ({ id: 1, ...n })),
  update: vi.fn(async (id, p) => ({ id, ...p })),
  ...overrides,
});
const mine = { id: 5, authorId: 7, title: 'a', body: 'old' };
const theirs = { id: 5, authorId: 99, title: 'a', body: 'old' };

describe('create', () => {
  it('derives the slug and stores the note under the actor', async () => {
    const repo = fakeRepo();
    const note = await createNotesService(repo).create(actor, { title: 'Hello World' });
    expect(note).toMatchObject({ slug: 'hello-world', authorId: 7 });     // the fields the contract promises
  });

  // the author is the ACTOR — kills "authorId taken from the input" (mass assignment)
  it('ignores an authorId sent by the client', async () => {
    const repo = fakeRepo();
    await createNotesService(repo).create(actor, { title: 'Hi', authorId: 99 });
    expect(repo.insert).toHaveBeenCalledWith(expect.objectContaining({ authorId: 7 }));
  });

  // status AND effect — kills "409 → 400" and "insert anyway"
  it('rejects a duplicate slug with 409 and does not touch the database', async () => {
    const repo = fakeRepo({ findBySlug: vi.fn(async () => ({ id: 3 })) });
    await expect(createNotesService(repo).create(actor, { title: 'Hello World' })).rejects.toMatchObject({ status: 409, message: 'SLUG_TAKEN' });
    expect(repo.insert).not.toHaveBeenCalled();
  });

  // kills "EMPTY_SLUG guard removed"
  it('rejects a title with nothing sluggable with 400', async () => {
    const repo = fakeRepo();
    await expect(createNotesService(repo).create(actor, { title: '!!!' })).rejects.toMatchObject({ status: 400 });
    expect(repo.insert).not.toHaveBeenCalled();
  });
});

describe('update', () => {
  it('updates my own note, keeping the fields I did not send', async () => {
    const repo = fakeRepo({ findById: vi.fn(async () => mine) });
    const n = await createNotesService(repo).update(actor, 5, { title: 'b' });
    expect(n).toMatchObject({ title: 'b', body: 'old' });
  });

  // the authorization test that is worth more than the rest — kills 403 and "no ownership check"
  it('answers 404 (not 403) for somebody else\\'s note, and changes nothing', async () => {
    const repo = fakeRepo({ findById: vi.fn(async () => theirs) });
    await expect(createNotesService(repo).update(actor, 5, { title: 'hack' })).rejects.toMatchObject({ status: 404 });
    expect(repo.update).not.toHaveBeenCalled();                            // kills "write first, 404 after"
  });

  it('answers 404 for a missing note', async () => {
    const repo = fakeRepo();
    await expect(createNotesService(repo).update(actor, 5, { title: 'b' })).rejects.toMatchObject({ status: 404 });
    expect(repo.update).not.toHaveBeenCalled();
  });
});
`,
  dotBien: [
    { file: 'src/notes.service.js', from: "if (existing) throw fail('SLUG_TAKEN', 409);", to: "if (existing) throw fail('SLUG_TAKEN', 400);", label: 'duplicate slug answers 400', goiY: 'assert the STATUS of the duplicate: rejects.toMatchObject({ status: 409 }) · khẳng định MÃ của lỗi trùng' },
    { file: 'src/notes.service.js', from: 'const existing = await repo.findBySlug(slug);', to: 'const existing = await repo.findBySlug(slug); if (existing) await repo.insert({ title: input.title, slug, authorId: actor.id });', label: 'duplicate is written before the 409', goiY: 'after the 409: expect(repo.insert).not.toHaveBeenCalled() · sau 409: insert không được gọi' },
    { file: 'src/notes.service.js', from: "throw fail('NOT_FOUND', 404);", to: "throw fail('FORBIDDEN', 403);", label: 'somebody else’s note answers 403', goiY: 'another user’s note must be 404, not 403 — a 403 confirms it exists · ghi chú của người khác phải 404' },
    { file: 'src/notes.service.js', from: 'if (!note || note.authorId !== actor.id)', to: 'if (!note)', label: 'no ownership check', goiY: 'update a note whose authorId is NOT the actor · cập nhật một ghi chú mà authorId KHÔNG phải người thực hiện' },
    { file: 'src/notes.service.js', from: "const note = await repo.findById(id);", to: "const note = await repo.findById(id); if (note) await repo.update(id, { title: patch.title ?? note.title });", label: 'update writes first, answers 404 after', goiY: 'IDOR case: also expect(repo.update).not.toHaveBeenCalled() · ca IDOR: kiểm thêm update không được gọi' },
    { file: 'src/notes.service.js', from: 'authorId: actor.id });', to: 'authorId: input.authorId ?? actor.id });', label: 'authorId taken from the input', goiY: 'send { authorId: 99 } as actor 7 — the stored author must be 7 · gửi { authorId: 99 } dưới actor 7', an: true },
    { file: 'src/notes.service.js', from: "if (!slug) throw fail('EMPTY_SLUG', 400);", to: '', label: 'empty slug accepted', goiY: 'a title like "!!!" has no slug: 400 · tiêu đề "!!!" không có slug: 400', an: true },
  ],
  voHai: [{ file: 'src/notes.service.js', from: "body: input.body ?? '', authorId: actor.id", to: "authorId: actor.id, body: input.body === undefined || input.body === null ? '' : input.body", label: 'harmless refactor: field order and ?? spelled out' }],
});

const SESSION = `/** Sessions expire 15 minutes after creation; a sweeper removes expired ones every 5 minutes. */
export const TTL_MS = 15 * 60 * 1000;

/** The clock is a defaulted PARAMETER — the enabling detail that makes the boundary testable. */
export function isExpired(session, now = Date.now()) {
  return now - session.createdAt >= TTL_MS;
}

/** Starts the sweeper; returns a function that stops it. */
export function startSweeper(store, everyMs = 5 * 60 * 1000) {
  const timer = setInterval(() => {
    for (const [id, s] of store) if (isExpired(s)) store.delete(id);
  }, everyMs);
  return () => clearInterval(timer);
}
`;

const E5 = mutBai({
  ten: '14.2 · Time is a dependency: test 20 minutes in milliseconds', kho: 'MEDIUM', phut: 20,
  en: `<p>${c('src/session.js')}: a session expires exactly 15 minutes after ${c('createdAt')} (${c('isExpired')} at 14:59.999 is false, at 15:00.000 true), and ${c('startSweeper(store)')} deletes expired sessions from a ${c('Map')} every 5 minutes, returning a ${c('stop')} function. Testing that with real time takes twenty minutes; with ${c('vi.useFakeTimers()')}, ${c("vi.setSystemTime(new Date('2026-07-28T10:00:00Z'))")} and ${c('vi.advanceTimersByTime(ms)')} it takes milliseconds — and you can assert the exact boundary. Write ${c('src/session.test.js')}.</p>`,
  vi: `<p>${c('src/session.js')}: phiên hết hạn đúng 15 phút sau ${c('createdAt')} (${c('isExpired')} ở 14:59.999 là false, ở 15:00.000 là true), và ${c('startSweeper(store)')} xoá phiên đã hết hạn khỏi một ${c('Map')} mỗi 5 phút, trả về hàm ${c('stop')}. Test việc đó bằng giờ thật mất hai mươi phút; với ${c('vi.useFakeTimers()')}, ${c("vi.setSystemTime(new Date('2026-07-28T10:00:00Z'))")} và ${c('vi.advanceTimersByTime(ms)')} chỉ mất vài mili-giây — và bạn khẳng định được đúng cái biên. Viết ${c('src/session.test.js')}.</p>`,
  yc: [...YC_MUT(4, 5), ['Restore real timers after each test (afterEach(() => vi.useRealTimers())).', 'Trả lại đồng hồ thật sau mỗi test (afterEach(() => vi.useRealTimers())).']],
  dauVao: ['src/session.test.js (Vitest fake timers).', 'src/session.test.js (đồng hồ giả của Vitest).'],
  dauRa: ['Green on the correct code; red on each mutant.', 'Xanh với code đúng; đỏ với từng đột biến.'],
  viDu: [{ input: 'Mutant: now - createdAt > TTL_MS   (instead of >=)|||Đột biến: now - createdAt > TTL_MS   (thay cho >=)', output: 'Killed by: advance TTL_MS - 1 → false, then 1 more → expect(isExpired(s)).toBe(true)|||Bị diệt bởi: tiến TTL_MS - 1 → false, rồi thêm 1 → expect(isExpired(s)).toBe(true)', explanation: 'Only a test that sits exactly on 15:00.000 separates > from >=. A real-time test cannot hit that millisecond reliably.|||Chỉ test đứng đúng 15:00.000 mới tách được > khỏi >=. Test giờ thật không trúng được mili-giây đó một cách chắc chắn.' }],
  goiY: [['beforeEach: vi.useFakeTimers(); vi.setSystemTime(new Date(\'2026-07-28T10:00:00Z\')). afterEach: vi.useRealTimers().', 'beforeEach: vi.useFakeTimers(); vi.setSystemTime(new Date(\'2026-07-28T10:00:00Z\')). afterEach: vi.useRealTimers().'], ['Sweeper: put one session created now into a Map, advance 15 min → still there (the sweep at 15:00 runs exactly then — check what you expect), advance to 20 min → gone; a fresh session created at minute 10 must survive the sweep at minute 15.', 'Sweeper: đặt một phiên tạo lúc này vào Map, tiến 15 phút → kiểm điều bạn chờ đợi (lần quét ở 15:00 chạy đúng lúc đó), tiến tới 20 phút → đã mất; một phiên mới tạo ở phút 10 phải sống qua lần quét ở phút 15.'], ['stop(): call it, advance 30 minutes, the expired session must still be in the Map.', 'stop(): gọi nó, tiến 30 phút, phiên hết hạn vẫn phải còn trong Map.']],
  loi: [['Waiting with real time (await new Promise(r => setTimeout(r, 1500))): 1.6 s for one third of the coverage, and the boundary is never hit.', 'Chờ bằng giờ thật (await new Promise(r => setTimeout(r, 1500))): 1,6 s cho một phần ba độ phủ, và không bao giờ trúng cái biên.'], ['Forgetting vi.useRealTimers(): the next test file inherits a frozen clock.', 'Quên vi.useRealTimers(): tệp test kế thừa một đồng hồ bị đóng băng.'], ['Testing the sweeper only with an obviously expired session: a sweeper that deletes EVERYTHING passes.', 'Chỉ test sweeper với một phiên rõ ràng đã hết hạn: sweeper xoá TẤT CẢ cũng qua.']],
  gt: ['Fake timers make the clock an input: twenty simulated minutes cost a few milliseconds, and the test can stand on 14:59.999 and 15:00.000 — the only place > and >= differ. The sweeper needs three observations: an expired session is removed on schedule, a fresh one is not, and stop() really stops. The enabling detail is in the application: isExpired(session, now = Date.now()).', 'Đồng hồ giả biến thời gian thành một đầu vào: hai mươi phút mô phỏng tốn vài mili-giây, và test đứng được ở 14:59.999 và 15:00.000 — chỗ duy nhất > và >= khác nhau. Sweeper cần ba quan sát: phiên hết hạn bị xoá đúng lịch, phiên mới thì không, và stop() thật sự dừng. Chi tiết cho phép làm điều đó nằm trong ứng dụng: isExpired(session, now = Date.now()).'],
  kn: ['fake timers', 'boundary'], tns: [tn('fake timers', 'đồng hồ giả', 'vi.useFakeTimers / setSystemTime / advanceTimersByTime — thời gian thành đầu vào'), TN.mutant],
  impl: { 'src/session.js': SESSION },
  tepTest: 'src/session.test.js',
  toiThieuTest: 4,
  dau: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isExpired, startSweeper, TTL_MS } from './session.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-28T10:00:00Z'));
});
afterEach(() => vi.useRealTimers());

describe('isExpired', () => {
  it('a new session is not expired', () => {
    expect(isExpired({ createdAt: Date.now() })).toBe(false);
  });

  it('a session from yesterday is expired', () => {
    expect(isExpired({ createdAt: Date.now() - 24 * 3600 * 1000 })).toBe(true);
  });

  it('TTL is a positive number', () => {
    expect(TTL_MS).toBeGreaterThan(0);
  });
});

describe('startSweeper', () => {
  it('returns a stop function', () => {
    const stop = startSweeper(new Map());
    expect(typeof stop).toBe('function');
    stop();
  });
});
`,
  giai: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isExpired, startSweeper, TTL_MS } from './session.js';

const MIN = 60 * 1000;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-28T10:00:00Z'));
});
afterEach(() => vi.useRealTimers());       // never leak a frozen clock into the next test

describe('isExpired', () => {
  // the exact boundary — kills ">" and "16 minutes"
  it('expires exactly at the 15 minute mark', () => {
    const s = { createdAt: Date.now() };
    vi.advanceTimersByTime(TTL_MS - 1);
    expect(isExpired(s)).toBe(false);      // 14:59.999 — still alive
    vi.advanceTimersByTime(1);
    expect(isExpired(s)).toBe(true);       // 15:00.000 — expired
  });

  it('TTL is 15 minutes', () => {
    expect(TTL_MS).toBe(15 * MIN);
  });

  it('accepts the clock as a parameter', () => {
    expect(isExpired({ createdAt: 0 }, 15 * MIN)).toBe(true);
    expect(isExpired({ createdAt: 0 }, 15 * MIN - 1)).toBe(false);
  });
});

describe('startSweeper', () => {
  // the schedule — kills "every 6 minutes"
  it('removes an expired session at the next 5-minute sweep', () => {
    const store = new Map([['old', { createdAt: Date.now() - 20 * MIN }]]);
    const stop = startSweeper(store);
    vi.advanceTimersByTime(5 * MIN - 1);
    expect(store.has('old')).toBe(true);   // no sweep yet
    vi.advanceTimersByTime(1);
    expect(store.has('old')).toBe(false);  // swept at exactly 5:00
    stop();
  });

  // a fresh session must survive — kills "deletes the wrong ones"
  it('keeps sessions that are still valid', () => {
    const store = new Map([['fresh', { createdAt: Date.now() }]]);
    const stop = startSweeper(store);
    vi.advanceTimersByTime(10 * MIN);      // two sweeps, the session is 10 minutes old
    expect(store.has('fresh')).toBe(true);
    stop();
  });

  // kills "stop does nothing"
  it('stops sweeping after stop()', () => {
    const store = new Map([['old', { createdAt: Date.now() - 20 * MIN }]]);
    const stop = startSweeper(store);
    stop();
    vi.advanceTimersByTime(30 * MIN);
    expect(store.has('old')).toBe(true);
  });
});
`,
  dotBien: [
    { file: 'src/session.js', from: 'return now - session.createdAt >= TTL_MS;', to: 'return now - session.createdAt > TTL_MS;', label: 'expires one millisecond late (> instead of >=)', goiY: 'stand on the boundary: advance TTL_MS - 1 (false), then 1 more (true) · đứng đúng biên' },
    { file: 'src/session.js', from: 'export const TTL_MS = 15 * 60 * 1000;', to: 'export const TTL_MS = 16 * 60 * 1000;', label: 'TTL is 16 minutes', goiY: 'assert the TTL itself, or a session at exactly 15:00 · khẳng định chính TTL, hoặc một phiên đúng 15:00' },
    { file: 'src/session.js', from: 'export function startSweeper(store, everyMs = 5 * 60 * 1000) {', to: 'export function startSweeper(store, everyMs = 6 * 60 * 1000) {', label: 'sweeps every 6 minutes', goiY: 'an expired session must be gone after exactly 5 minutes · phiên hết hạn phải mất sau đúng 5 phút' },
    { file: 'src/session.js', from: 'if (isExpired(s)) store.delete(id);', to: 'if (!isExpired(s)) store.delete(id);', label: 'the sweeper deletes the valid sessions', goiY: 'a FRESH session must survive a sweep · một phiên MỚI phải sống qua lần quét' },
    { file: 'src/session.js', from: 'return () => clearInterval(timer);', to: 'return () => {};', label: 'stop() does nothing', goiY: 'call stop(), advance 30 minutes, an expired session must still be there · gọi stop(), tiến 30 phút', an: true },
  ],
});

export default modul('nodejs-14-2-unit-test', '14.2 Unit tests, test doubles, fake timers', [E1, E2, E3, E4, E5]);
