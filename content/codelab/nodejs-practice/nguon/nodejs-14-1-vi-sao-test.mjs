/** Node.js · 14.1 — Một bài test giá bao nhiêu và mua được gì: ba tầng, chọn runner bằng số đo, test đầu tiên (mutation). */
import { modul, cs, q, tn, bang1, mutBai, c, TN, YC_MUT } from './_node-c12-14.mjs';

const TANG = ['Unit test (fake repo)', 'Integration test (route + service + real DB)', 'End-to-end test (real server on a port)'];
const E1 = cs({
  ten: '14.1 · Which level catches this bug most cheaply?', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Unit ≈ 0.0006 ms, integration ≈ 5.5 ms, e2e ≈ 3.3 ms per test (lesson 14.1). Each level catches a different kind of bug. For each bug from the Notes API, pick the CHEAPEST level that reliably catches it.',
  vi: 'Unit ≈ 0,0006 ms, integration ≈ 5,5 ms, e2e ≈ 3,3 ms mỗi test (bài 14.1). Mỗi tầng bắt một loại lỗi khác nhau. Với mỗi lỗi của Notes API, chọn tầng RẺ NHẤT bắt được nó một cách chắc chắn.',
  bang: [bang1('b1', ['Bug → cheapest level', 'Lỗi → tầng rẻ nhất'], [{ ma: 'b', ten: 'Bug' }, { ma: 'l', ten: 'Level', luaChon: TANG }], [
    { o: { b: 'slugify(\'a\'.repeat(200)) returns 61 characters' }, a: { l: TANG[0] } },
    { o: { b: 'A duplicate slug answers 500 because the 23505 from PostgreSQL is not mapped to 409' }, a: { l: TANG[1] } },
    { o: { b: 'The router was mounted at /note, so POST /notes is a 404 in the deployed build' }, a: { l: TANG[2] } },
    { o: { b: 'HALF_UP rounding of −2.5 gives −2 instead of −3' }, a: { l: TANG[0] } },
    { o: { b: 'The INSERT names a column that the last migration renamed' }, a: { l: TANG[1] } },
    { o: { b: 'The error handler is registered before the routes, so every error becomes Express’s default HTML page' }, a: { l: TANG[2] } },
  ], ['Unit tests catch logic, boundary and arithmetic errors in pure functions. Integration tests (route + service + a real DB) catch SQL errors, constraint violations, status codes and authorisation. End-to-end tests catch assembly errors — middleware in the wrong order, a route never mounted — the class of bug the site’s post-deploy smoke test exists for. (An integration test through the app would also see the last two; e2e is where they are certain, because it runs exactly what was deployed.)', 'Unit test bắt lỗi logic, biên và số học trong hàm thuần. Integration test (route + service + CSDL thật) bắt lỗi SQL, vi phạm ràng buộc, mã trạng thái và phân quyền. End-to-end bắt lỗi lắp ráp — middleware sai thứ tự, route chưa từng được gắn — đúng loại lỗi mà smoke test sau deploy của website tồn tại để bắt. (Integration test qua app cũng thấy được hai lỗi cuối; e2e là chỗ chắc chắn, vì nó chạy đúng thứ đã deploy.)'])],
  goiY: [['Does the bug live in one pure function, below the route, or in how the pieces are assembled?', 'Lỗi nằm trong một hàm thuần, bên dưới route, hay trong cách các mảnh được lắp lại?'], ['A fake repository accepts any SQL and any duplicate.', 'Repo giả nhận mọi SQL và mọi bản trùng.']],
  loi: [['Writing every test end-to-end “to be safe”: a 10-second suite holds 1,800 of them instead of millions of unit assertions.', 'Viết mọi test kiểu end-to-end "cho chắc": bộ test 10 giây chỉ chứa 1.800 cái thay vì hàng triệu khẳng định unit.'], ['Expecting a unit test with a fake repo to catch a constraint violation — the fake answers whatever you told it.', 'Chờ unit test dùng repo giả bắt được vi phạm ràng buộc — repo giả trả lời đúng điều bạn bảo nó.']],
  tns: [tn('unit test', 'test đơn vị', 'một hàm, mọi phụ thuộc là đồ giả'), tn('integration test', 'test tích hợp', 'route + service + CSDL thật'), tn('end-to-end test', 'test đầu-cuối', 'server thật trên một cổng, client HTTP thật')],
  kn: ['test levels'],
});

const E2 = cs({
  ten: '14.1 · Choosing a runner with numbers', kho: 'EASY', phut: 8,
  en: 'The lesson ran the same assertions under node:test, vitest and jest on the same machine. Answer from the measurements, not from the marketing.',
  vi: 'Bài chạy cùng các khẳng định dưới node:test, vitest và jest trên cùng một máy. Trả lời theo số đo, không theo quảng cáo.',
  cau: [
    q('c1', ['End-to-end (3.3 ms) came out CHEAPER than integration (5.5 ms), against every pyramid diagram. Why?', 'End-to-end (3,3 ms) lại RẺ HƠN integration (5,5 ms), trái với mọi sơ đồ kim tự tháp. Vì sao?'],
      ['supertest starts and stops a server per request; e2e reused one', 'The e2e test skipped the database, so it did less work', 'Node caches HTTP responses for repeated identical requests', 'The integration test ran under jest, which is slower'],
      ['A tool detail, not a law of nature (14.3 comes back to it). The lesson: measure your own suite instead of trusting the diagram.', 'Một chi tiết công cụ, không phải định luật (14.3 quay lại chuyện này). Bài học: đo bộ test của chính bạn thay vì tin sơ đồ.']),
    q('c2', ['6 tests: node:test 0.10 s, vitest 0.76 s, jest 0.86 s. Which conclusion matches the lesson’s recommendation for a plain Node backend?', '6 test: node:test 0,10 s, vitest 0,76 s, jest 0,86 s. Kết luận nào khớp khuyến nghị của bài cho một backend Node thuần?'],
      ['node:test — zero dependencies, and fastest on the small suite you run hundreds of times a day', 'vitest — it is always much faster than jest', 'jest — it won at 1,000 tests, so it is the fastest overall', 'Any of them — runners only differ in syntax'],
      ['“vitest is much faster than jest” held only in a Vite front-end; at 1,000 plain tests jest was slightly ahead. node:test beat both at every size. Keep vitest for a Vite front-end, keep jest in an old repo full of jest tests.', '"vitest nhanh hơn jest nhiều" chỉ đúng trong front-end Vite; với 1.000 test thuần jest còn nhỉnh hơn. node:test thắng cả hai ở mọi cỡ. Giữ vitest cho front-end Vite, giữ jest trong repo cũ đầy test jest.']),
    q('c3', ['node --test nodetest/ dies with MODULE_NOT_FOUND. What is wrong?', 'node --test nodetest/ chết với MODULE_NOT_FOUND. Sai ở đâu?'],
      ['A bare directory is treated as a file to run — pass a glob', 'node:test requires a config file in the directory', 'The directory must be called test/, not nodetest/', 'node --test only runs files with a .cjs extension'],
      ['Or let Node discover *.test.* files itself by passing no argument.', 'Hoặc để Node tự tìm các tệp *.test.* bằng cách không truyền đối số nào.']),
    q('c4', ['npx jest on a "type": "module" project prints SyntaxError: Cannot use import statement outside a module. The fix measured in the lesson?', 'npx jest trên dự án "type": "module" in ra SyntaxError: Cannot use import statement outside a module. Cách chữa đã đo trong bài?'],
      ['NODE_OPTIONS=--experimental-vm-modules npx jest', 'Rename every test file to .cjs', 'Add "jest": { "esm": true } to package.json', 'Install babel-jest and remove "type": "module"'],
      ['Friction you pay once per project, plus vi.fn → jest.fn and missing matchers when porting. None of it is hard; all of it is cost.', 'Ma sát trả một lần cho mỗi dự án, cộng vi.fn → jest.fn và matcher thiếu khi chuyển. Không có gì khó; tất cả đều là chi phí.']),
    q('c5', ['The site’s money.test.ts says: “Pure functions — no DB, no network — so they run fast and deterministically in CI.” What did it choose to test?', 'money.test.ts của website ghi: "Hàm thuần — không DB, không mạng — nên chạy nhanh và tất định trong CI." Nó chọn test cái gì?'],
      ['What is expensive to get wrong and cheap to check: money, signatures', 'Every page of the site, so that no regression reaches users', 'Only the slowest endpoints, because they are the riskiest', 'The profile page rendering, because users see it most'],
      ['Nobody wrote a test for “the profile page renders”. 0.1 + 0.2 must be 0.3, not 0.30000000000000004.', 'Không ai viết test cho "trang hồ sơ hiển thị được". 0.1 + 0.2 phải là 0.3, không phải 0.30000000000000004.']),
  ],
  goiY: [['Startup time dominates small suites.', 'Thời gian khởi động chiếm phần lớn ở bộ test nhỏ.'], ['Read the measurement before the diagram.', 'Đọc số đo trước khi đọc sơ đồ.']],
  loi: [['Choosing a runner from a blog benchmark of a different kind of project.', 'Chọn runner theo benchmark trên blog của một loại dự án khác.'], ['Passing a bare directory to node --test.', 'Truyền một thư mục trần cho node --test.']],
  tns: [tn('test runner', 'trình chạy test', 'node:test, vitest, jest'), tn('node:test', 'runner có sẵn của Node', 'không cài gì thêm, có --watch và độ phủ')],
  kn: ['test runners'],
});

const SLUG = `/** Notes API — the slug of a note (lesson 14.1/14.2). */
export function slugify(title) {
  return String(title)
    .toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')   // drop Vietnamese tone marks: "chú" → "chu"
    .replace(/đ/g, 'd')                                  // đ does not decompose — map it by hand
    .replace(/[^a-z0-9]+/g, '-')                         // every run of other characters → ONE dash
    .replace(/^-+|-+$/g, '')                             // no dash at either end
    .slice(0, 60);                                       // URLs stay short
}
`;

const E3 = mutBai({
  ten: '14.1 · Your first tests: pin down slugify', kho: 'EASY', phut: 15,
  en: `<p>Every note’s URL comes from ${c('slugify(title)')} in ${c('src/slug.js')} (open it in the file tabs): lowercase, Vietnamese tone marks removed and ${c('đ')} → ${c('d')}, every run of other characters becomes ONE dash, no dash at either end, at most 60 characters.</p><p>This time <b>you write the tests</b>, in ${c('src/slug.test.js')}. The grader runs them against the correct ${c('slug.js')} (they must pass), then against <b>5 mutants</b> — copies with one planted bug each. A mutant is <b>killed</b> when at least one of your tests fails on it. A test suite is the automated re-check of chapter 8 when you change chapter 12; this is what makes it able to fail.</p>`,
  vi: `<p>URL của mỗi ghi chú lấy từ ${c('slugify(title)')} trong ${c('src/slug.js')} (mở ở tab tệp): chữ thường, bỏ dấu thanh tiếng Việt và ${c('đ')} → ${c('d')}, mọi chuỗi ký tự khác thành MỘT dấu gạch, không có gạch ở hai đầu, tối đa 60 ký tự.</p><p>Lần này <b>bạn viết test</b>, trong ${c('src/slug.test.js')}. Máy chấm chạy chúng với ${c('slug.js')} đúng (phải xanh), rồi với <b>5 đột biến</b> — các bản sao mỗi bản cài một lỗi. Đột biến bị <b>diệt</b> khi ít nhất một test của bạn đỏ với nó. Bộ test là phép kiểm lại tự động chương 8 khi bạn sửa chương 12; đây là thứ làm cho nó có khả năng đỏ.</p>`,
  yc: YC_MUT(4, 5),
  dauVao: ['Your test file src/slug.test.js (Vitest syntax).', 'Tệp test src/slug.test.js của bạn (cú pháp Vitest).'],
  dauRa: ['Green on the correct code; red on each mutant.', 'Xanh với code đúng; đỏ với từng đột biến.'],
  viDu: [{ input: 'Mutant: .slice(0, 59)  (instead of 60)|||Đột biến: .slice(0, 59)  (thay cho 60)', output: "Killed by: expect(slugify('a'.repeat(200))).toHaveLength(60)|||Bị diệt bởi: expect(slugify('a'.repeat(200))).toHaveLength(60)", explanation: 'A test with a short title passes on both versions — it cannot tell them apart. Test the boundary itself.|||Test với tiêu đề ngắn xanh với cả hai bản — nó không phân biệt được. Hãy test đúng cái biên.' }],
  goiY: [['Submit the starter tests first and read which mutants SURVIVE: each one names a rule your tests never looked at.', 'Nộp bộ test khởi đầu trước rồi xem đột biến nào CÒN SỐNG: mỗi cái chỉ đúng một luật mà test của bạn chưa nhìn tới.'], ['One test per rule: double spaces / punctuation runs, a title with ĐẦU and tone marks, digits (“Lab 211”), and the exact length 60.', 'Mỗi luật một test: hai dấu cách / chuỗi dấu câu, tiêu đề có ĐẦU và dấu thanh, chữ số ("Lab 211"), và đúng độ dài 60.']],
  loi: [['Only testing “Hello World”: almost every mutant still produces hello-world.', 'Chỉ test "Hello World": gần như mọi đột biến vẫn ra hello-world.'], ['expect(slugify(long).length <= 60).toBe(true) — the 59-character mutant passes it; assert the exact value.', 'expect(slugify(long).length <= 60).toBe(true) — đột biến 59 ký tự vẫn qua; hãy khẳng định giá trị chính xác.'], ['A test name like it(\'works\'): when it goes red in CI nobody knows which rule broke. Name the rule.', 'Tên test kiểu it(\'works\'): khi nó đỏ trên CI không ai biết luật nào hỏng. Hãy đặt tên theo luật.']],
  gt: ['Each mutant changes exactly one rule, so a suite kills it only if some test observes that rule: a run of separators (one dash, not two), the đ and tone-mark mapping, digits kept, both ends trimmed, the length capped at exactly 60. The habit behind it is the lesson’s: break the code on purpose and watch a test go red.', 'Mỗi đột biến đổi đúng một luật, nên bộ test chỉ diệt được nó khi có test quan sát luật đó: một chuỗi dấu phân cách (một gạch, không phải hai), cách đổi đ và dấu thanh, giữ chữ số, cắt cả hai đầu, giới hạn đúng 60. Thói quen phía sau là của bài: cố ý làm hỏng code và nhìn một test chuyển đỏ.'],
  kn: ['unit tests', 'mutation testing'], tns: [TN.mutant, TN.killed, tn('boundary value', 'giá trị biên', 'giá trị nằm đúng mép luật (60 ký tự) và ±1')],
  impl: { 'src/slug.js': SLUG },
  tepTest: 'src/slug.test.js',
  toiThieuTest: 4,
  dau: `import { describe, it, expect } from 'vitest';
import { slugify } from './slug.js';

// Four tests, all green on the correct code — and still weak. Submit, read which mutants survive, add tests.
// Bốn test, đều xanh với code đúng — mà vẫn yếu. Nộp, xem đột biến nào sống, thêm test.
describe('slugify', () => {
  it('lowercases and joins words with a dash', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('drops leading and trailing separators', () => {
    expect(slugify('  --Hello--  ')).toBe('hello');
  });

  it('keeps a simple lowercase word as it is', () => {
    expect(slugify('notes')).toBe('notes');
  });

  it('lowercases an all-caps title', () => {
    expect(slugify('NOTES API')).toBe('notes-api');
  });
});
`,
  giai: `import { describe, it, expect } from 'vitest';
import { slugify } from './slug.js';

describe('slugify', () => {
  it('lowercases and joins words with a dash', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  // a RUN of separators becomes one dash — kills "[^a-z0-9]" without the +
  it('collapses runs of spaces and punctuation into one dash', () => {
    expect(slugify('Hello,   World!!  Again')).toBe('hello-world-again');
  });

  // both ends — kills the version that only trims the start
  it('drops leading and trailing separators', () => {
    expect(slugify('  --Hello--  ')).toBe('hello');
    expect(slugify('Notes API!!!')).toBe('notes-api');
  });

  // Vietnamese: tone marks AND đ — kills the version that forgets đ
  it('removes Vietnamese tone marks and maps đ to d', () => {
    expect(slugify('Ghi chú đầu tiên')).toBe('ghi-chu-dau-tien');
  });

  // digits are kept — kills "[^a-z]+"
  it('keeps digits', () => {
    expect(slugify('Lab 211 – Week 3')).toBe('lab-211-week-3');
  });

  // the boundary itself, exact value — kills slice(0, 59)
  it('caps the length at exactly 60', () => {
    expect(slugify('a'.repeat(200))).toHaveLength(60);
  });
});
`,
  dotBien: [
    { file: 'src/slug.js', from: '.slice(0, 60);', to: '.slice(0, 59);', label: 'length capped at 59', goiY: 'assert the EXACT length of a long title: 60 · khẳng định ĐÚNG độ dài của tiêu đề dài: 60' },
    { file: 'src/slug.js', from: ".replace(/^-+|-+$/g, '')", to: ".replace(/^-+/g, '')", label: 'only the leading dash is trimmed', goiY: 'a title that ENDS with punctuation, e.g. "Notes API!!!" → "notes-api" · tiêu đề KẾT THÚC bằng dấu câu' },
    { file: 'src/slug.js', from: ".replace(/[^a-z0-9]+/g, '-')", to: ".replace(/[^a-z0-9]/g, '-')", label: 'every separator becomes its own dash', goiY: 'two spaces or ", " between words must still give ONE dash · hai dấu cách hoặc ", " giữa hai từ vẫn chỉ ra MỘT gạch' },
    { file: 'src/slug.js', from: ".replace(/đ/g, 'd')", to: '', label: 'đ is not mapped', goiY: 'a Vietnamese title with đ: "Ghi chú đầu tiên" → "ghi-chu-dau-tien" · tiêu đề tiếng Việt có chữ đ' },
    { file: 'src/slug.js', from: ".replace(/[^a-z0-9]+/g, '-')", to: ".replace(/[^a-z]+/g, '-')", label: 'digits are dropped', goiY: 'a title with digits: "Lab 211" → "lab-211" · tiêu đề có chữ số', an: true },
  ],
});

const MONEY = `/** Money for the Notes API's paid plan — amounts are INTEGERS in đồng, never floats. */

/** HALF_UP = half away from zero (accounting): 2.5 → 3, -2.5 → -3. Math.round is NOT that: Math.round(-2.5) === -2. */
export function roundHalfUp(x) {
  const r = Math.sign(x) * Math.floor(Math.abs(x) + 0.5);
  return r === 0 ? 0 : r;                      // never return -0
}

/** VAT on an integer amount, rounded HALF_UP to a whole đồng: vat(12345, 8) === 988 */
export function vat(amount, ratePercent) {
  if (!Number.isInteger(amount) || amount < 0) throw new RangeError('AMOUNT');
  return roundHalfUp((amount * ratePercent) / 100);
}

/** Sum integer amounts — floats are refused (0.1 + 0.2 is the reason). */
export function sum(amounts) {
  let total = 0;
  for (const a of amounts) {
    if (!Number.isInteger(a)) throw new TypeError('NOT_INTEGER');
    total += a;
  }
  return total;
}
`;

const E4 = mutBai({
  ten: '14.1 · Test what is expensive to get wrong: money', kho: 'MEDIUM', phut: 20,
  en: `<p>The site’s first three test files were money, payments and the CV linter — “expensive to get wrong and cheap to check”. ${c('src/money.js')} has three pure functions:</p><ul><li>${c('roundHalfUp(x)')} — half away from zero: ${c('2.5 → 3')}, ${c('-2.5 → -3')} (JavaScript’s ${c('Math.round(-2.5)')} is ${c('-2')});</li><li>${c('vat(amount, ratePercent)')} — integer đồng in, ${c('roundHalfUp')} of the tax out (${c('vat(12345, 8) === 988')}); a negative or non-integer amount throws ${c('RangeError')};</li><li>${c('sum(amounts)')} — integers only; a float throws ${c('TypeError')}.</li></ul><p>Write ${c('src/money.test.js')} that kills all 5 mutants.</p>`,
  vi: `<p>Ba tệp test đầu tiên của website là tiền, thanh toán và bộ soát CV — "đắt nếu sai và rẻ để kiểm". ${c('src/money.js')} có ba hàm thuần:</p><ul><li>${c('roundHalfUp(x)')} — nửa làm tròn ra xa số 0: ${c('2.5 → 3')}, ${c('-2.5 → -3')} (${c('Math.round(-2.5)')} của JavaScript là ${c('-2')});</li><li>${c('vat(amount, ratePercent)')} — vào là số đồng nguyên, ra là ${c('roundHalfUp')} của tiền thuế (${c('vat(12345, 8) === 988')}); số tiền âm hoặc không nguyên ném ${c('RangeError')};</li><li>${c('sum(amounts)')} — chỉ số nguyên; số thực ném ${c('TypeError')}.</li></ul><p>Viết ${c('src/money.test.js')} diệt cả 5 đột biến.</p>`,
  yc: YC_MUT(4, 5),
  dauVao: ['src/money.test.js (Vitest).', 'src/money.test.js (Vitest).'],
  dauRa: ['Green on the correct code; red on each mutant.', 'Xanh với code đúng; đỏ với từng đột biến.'],
  viDu: [{ input: 'Mutant: roundHalfUp uses Math.round(x)|||Đột biến: roundHalfUp dùng Math.round(x)', output: 'Killed by: expect(roundHalfUp(-2.5)).toBe(-3)|||Bị diệt bởi: expect(roundHalfUp(-2.5)).toBe(-3)', explanation: 'Math.round agrees with HALF_UP on every positive number — only a negative half tells them apart.|||Math.round khớp HALF_UP ở mọi số dương — chỉ một nửa âm mới phân biệt được.' }],
  goiY: [['Exact halves on both sides of zero: 2.5, -2.5, 0.5, -0.5.', 'Đúng các nửa ở hai phía số 0: 2.5, -2.5, 0.5, -0.5.'], ['vat(12345, 8) is 987.6 before rounding — a floor would give 987. And throws: expect(() => vat(10.5, 8)).toThrow(RangeError), expect(() => sum([0.1, 0.2])).toThrow(TypeError).', 'vat(12345, 8) là 987,6 trước khi làm tròn — làm tròn xuống sẽ ra 987. Và các lần ném: expect(() => vat(10.5, 8)).toThrow(RangeError), expect(() => sum([0.1, 0.2])).toThrow(TypeError).']],
  loi: [['Testing rounding with positive numbers only: Math.round passes all of them.', 'Chỉ test làm tròn với số dương: Math.round qua hết.'], ['vat(10000, 8) === 800 as the only VAT test: no rounding happens, so a floor() mutant survives.', 'vat(10000, 8) === 800 là test VAT duy nhất: không có làm tròn nào xảy ra, nên đột biến floor() sống sót.'], ['expect(vat(10.5, 8)).toThrow() without the arrow: the error is thrown before expect runs and the test crashes on the correct code.', 'expect(vat(10.5, 8)).toThrow() thiếu mũi tên: lỗi ném ra trước khi expect chạy và test đỏ ngay với code đúng.']],
  gt: ['Money bugs survive “normal” inputs: positive numbers hide the difference between HALF_UP and Math.round, round amounts hide floor vs round, and integer inputs hide a missing float check. The killing tests are the edges — a negative half, a fractional tax, a float — which is exactly why the site tests 0.1 + 0.2 and HALF_UP explicitly.', 'Lỗi tiền sống sót qua dữ liệu "bình thường": số dương che sự khác nhau giữa HALF_UP và Math.round, số tròn che floor với round, đầu vào nguyên che việc thiếu kiểm số thực. Test diệt được là các cạnh — một nửa âm, tiền thuế có phần lẻ, một số thực — chính vì thế website test 0.1 + 0.2 và HALF_UP một cách tường minh.'],
  kn: ['unit tests', 'money'], tns: [TN.mutant, tn('HALF_UP', 'làm tròn nửa ra xa 0', '2,5 → 3 và −2,5 → −3 (kế toán)')],
  impl: { 'src/money.js': MONEY },
  tepTest: 'src/money.test.js',
  toiThieuTest: 4,
  dau: `import { describe, it, expect } from 'vitest';
import { roundHalfUp, vat, sum } from './money.js';

describe('money', () => {
  it('rounds 2.5 up to 3', () => {
    expect(roundHalfUp(2.5)).toBe(3);
  });

  it('computes 8% VAT', () => {
    expect(vat(10000, 8)).toBe(800);
  });

  it('sums integer amounts', () => {
    expect(sum([1000, 2500])).toBe(3500);
  });

  it('rounds 2.4 down to 2', () => {
    expect(roundHalfUp(2.4)).toBe(2);
  });
});
`,
  giai: `import { describe, it, expect } from 'vitest';
import { roundHalfUp, vat, sum } from './money.js';

describe('roundHalfUp (half away from zero)', () => {
  it('rounds positive halves up', () => {
    expect(roundHalfUp(2.5)).toBe(3);
    expect(roundHalfUp(0.5)).toBe(1);
  });

  // the case Math.round gets wrong: Math.round(-2.5) === -2
  it('rounds negative halves away from zero', () => {
    expect(roundHalfUp(-2.5)).toBe(-3);
  });

  it('keeps values below the half', () => {
    expect(roundHalfUp(2.49)).toBe(2);
  });
});

describe('vat', () => {
  // 987.6 must become 988 — a floor() would give 987
  it('rounds the tax HALF_UP to a whole đồng', () => {
    expect(vat(12345, 8)).toBe(988);
    expect(vat(10000, 8)).toBe(800);
  });

  it('refuses non-integer and negative amounts', () => {
    expect(() => vat(10.5, 8)).toThrow(RangeError);   // wrap the call: expect(fn).toThrow
    expect(() => vat(-1, 8)).toThrow(RangeError);
  });
});

describe('sum', () => {
  it('adds integers exactly', () => {
    expect(sum([1000, 2500])).toBe(3500);
  });

  // 0.1 + 0.2 is the reason money is never a float
  it('refuses floats', () => {
    expect(() => sum([0.1, 0.2])).toThrow(TypeError);
  });
});
`,
  dotBien: [
    { file: 'src/money.js', from: 'const r = Math.sign(x) * Math.floor(Math.abs(x) + 0.5);', to: 'const r = Math.round(x);', label: 'Math.round instead of HALF_UP', goiY: 'a NEGATIVE half: roundHalfUp(-2.5) must be -3 · một nửa ÂM: roundHalfUp(-2.5) phải là -3' },
    { file: 'src/money.js', from: 'Math.floor(Math.abs(x) + 0.5)', to: 'Math.floor(Math.abs(x) + 0.49)', label: 'an exact half rounds down', goiY: 'an EXACT half: 2.5 → 3 · đúng một nửa: 2.5 → 3' },
    { file: 'src/money.js', from: "if (!Number.isInteger(amount) || amount < 0) throw new RangeError('AMOUNT');", to: "if (amount < 0) throw new RangeError('AMOUNT');", label: 'vat accepts a fractional amount', goiY: 'expect(() => vat(10.5, 8)).toThrow(RangeError)' },
    { file: 'src/money.js', from: "if (!Number.isInteger(a)) throw new TypeError('NOT_INTEGER');", to: '', label: 'sum accepts floats', goiY: 'expect(() => sum([0.1, 0.2])).toThrow(TypeError)' },
    { file: 'src/money.js', from: 'return roundHalfUp((amount * ratePercent) / 100);', to: 'return Math.floor((amount * ratePercent) / 100);', label: 'VAT is truncated, not rounded', goiY: 'a tax with a fraction ≥ .5: vat(12345, 8) === 988 · tiền thuế có phần lẻ ≥ ,5', an: true },
  ],
});

export default modul('nodejs-14-1-vi-sao-test', '14.1 Test levels, runners, and your first mutation-graded tests', [E1, E2, E3, E4]);
