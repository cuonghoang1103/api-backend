/** API Design · 11.2 — Rút gọn link (1): hợp đồng, Base62, trùng mã (output thật bài 11.2: app.mjs, collisions.mjs). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Shortener 1 — Codes and contract, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 11.2: interview/shortener/collisions.mjs (one million codes, three ways) and the create endpoint of app.mjs.',
  vi: 'Những điều từ bài 11.2: interview/shortener/collisions.mjs (một triệu mã, ba cách) và endpoint tạo link của app.mjs.',
  cau: [
    q('c1', ['One million random 6-character Base62 codes. How many collisions were measured?', 'Một triệu mã Base62 ngẫu nhiên 6 ký tự. Đo được bao nhiêu lần trùng?'],
      ['8–13 per million, close to the N²/2S prediction of 8.8', 'None — 56.8 billion possibilities make collisions impossible', 'About 550, the same as with 5 characters', 'Exactly one, because crypto.randomInt avoids repeats'],
      ['Birthday paradox: collisions come after about √S draws, so a random generator must check and retry.', 'Nghịch lý ngày sinh: trùng tới sau khoảng √S lần rút, nên bộ sinh ngẫu nhiên phải kiểm và rút lại.']),
    q('c2', ['Cutting sha256(url) to 6 characters instead of drawing random codes…', 'Cắt sha256(url) còn 6 ký tự thay vì rút mã ngẫu nhiên…'],
      ['collided just as often (8 per million) and gives the same code to the same URL', 'never collides, because a hash is unique for each input', 'collided ten times more often, because sha256 is designed for passwords', 'is guessable like a counter, because hashes are sequential'],
      ['Truncation throws away uniqueness; the extra property (same URL ⇒ same code) shares statistics between creators.', 'Cắt ngắn làm mất tính duy nhất; tính chất thêm (cùng URL ⇒ cùng mã) làm hai người tạo chung số liệu.']),
    q('c3', ['Why is Base62 of a counter risky for a public shortener?', 'Vì sao Base62 của bộ đếm rủi ro với dịch vụ rút gọn công khai?'],
      ['4C92 reveals that 4C91 and 4C93 exist — anyone can walk other people’s links', 'It collides after 56.8 billion links', 'It is the slowest of the three methods', 'Base62 cannot represent numbers above one million'],
      ['Enumeration: sequential ids leak counts and neighbours (9.4).', 'Dò lần lượt: id tuần tự làm lộ số lượng và hàng xóm (9.4).']),
    q('c4', ['Bình asks for the alias “admin”, Lan asks for an alias another user already took. The answers?', 'Bình xin alias “admin”, Lan xin một alias người khác đã dùng. Trả lời gì?'],
      ['422 INVALID_ALIAS for the reserved word, 409 ALIAS_TAKEN for the taken one', '409 for both, because both conflict with something', '400 for both, because the request body is wrong', '403 for “admin”, 404 for the taken alias'],
      ['A reserved word is a rule violation (422); a taken alias conflicts with existing state (409, lesson 1.3).', 'Từ dành riêng là vi phạm luật (422); alias đã có là xung đột với trạng thái hiện có (409, bài 1.3).']),
  ],
  goiY: [['Remember the birthday paradox: N²/2S.', 'Nhớ nghịch lý ngày sinh: N²/2S.'], ['Separate “breaks a rule” from “conflicts with what exists”.', 'Tách “vi phạm luật” khỏi “xung đột với cái đã có”.']],
  loi: [['Believing a truncated hash is unique.', 'Tin rằng băm cắt ngắn là duy nhất.'], ['Using a public counter for private links.', 'Dùng bộ đếm công khai cho link riêng tư.']],
  tns: [tn('collision', 'trùng mã'), tn('Base62', 'hệ cơ số 62'), tn('enumeration', 'dò lần lượt')],
  kn: ['identifiers', 'interview'],
});

function toBase62(n) {
  const A = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('n must be an integer ≥ 0');
  let s = '';
  do { s = A[n % 62] + s; n = Math.floor(n / 62); } while (n > 0);
  return s;
}
const E2 = jsBai({
  ten: 'Shortener 2 — Write toBase62(n)', kho: 'MEDIUM', phut: 12,
  en: `<p>Write <code>n</code> in base 62 with the alphabet <code>0–9</code>, <code>A–Z</code>, <code>a–z</code> (in that order, so 10 is <code>A</code> and 61 is <code>z</code>). <code>0</code> is <code>"0"</code>. Throw a <code>RangeError</code> if <code>n</code> is negative or not a safe integer.</p>`,
  vi: `<p>Viết <code>n</code> theo cơ số 62 với bảng chữ <code>0–9</code>, <code>A–Z</code>, <code>a–z</code> (đúng thứ tự đó, nên 10 là <code>A</code>, 61 là <code>z</code>). <code>0</code> là <code>"0"</code>. Ném <code>RangeError</code> nếu <code>n</code> âm hoặc không phải số nguyên an toàn.</p>`,
  dauVao: ['n — number', 'n — số'],
  dauRa: ['string', 'chuỗi'],
  goiY: [['Take n % 62 for the last digit, then divide by 62.', 'Lấy n % 62 cho chữ số cuối, rồi chia cho 62.'], ['A do…while loop handles n = 0.', 'Vòng do…while lo được n = 0.']],
  loi: [['A while loop that returns "" for 0.', 'Vòng while trả "" với 0.'], ['Putting the lower-case letters before the upper-case ones.', 'Đặt chữ thường trước chữ hoa.']],
  gt: ['Lesson 11.2: id 1,000,000 → 4C92; 56,800,235,583 → zzzzzz; one more → 1000000 (7 characters). Fast and collision-free — and guessable.', 'Bài 11.2: id 1.000.000 → 4C92; 56.800.235.583 → zzzzzz; thêm một → 1000000 (7 ký tự). Nhanh và không trùng — nhưng đoán được.'],
  kn: ['identifiers'],
  tns: [tn('base 62', 'cơ số 62'), tn('alphabet', 'bảng ký tự')],
  dau: `/** number → short code */
function toBase62(n) {
  // Write your solution here
  return n.toString(36);
}
`,
  giai: '// Reference solution\n' + nguon(toBase62),
  cases: [
    { goi: goi('toBase62', 1000000), moTa: ['id 1,000,000 of the lesson', 'id 1.000.000 trong bài'] },
    { goi: goi('toBase62', 61), moTa: ['The last one-character code', 'Mã một ký tự cuối cùng'] },
    { goi: goi('toBase62', 0), an: true },
    { goi: goi('toBase62', 3844), an: true },
    { goi: goi('toBase62', 56800235583), an: true },
    { goi: goi('toBase62', 56800235584), an: true },
    { goi: goi('toBase62', -1), nem: 'RangeError', an: true },
    { goi: goi('toBase62', 1.5), nem: 'RangeError', an: true },
  ],
});

function codeLength(n, tolerated) {
  for (let len = 1; len <= 12; len++) {
    const expected = (n * n) / (2 * 62 ** len);
    if (expected <= tolerated) return { len, expected: Math.round(expected * 100) / 100 };
  }
  return null;
}
const E3 = jsBai({
  ten: 'Shortener 3 — Write codeLength(n, tolerated): how many characters?', kho: 'HARD', phut: 15,
  en: `<p>For <code>n</code> random codes over 62 symbols the expected number of collisions is <code>n² / (2 · 62^len)</code>. Return the smallest <code>len</code> from 1 to 12 whose expected collisions are ≤ <code>tolerated</code>, as <code>{ len, expected }</code> with <code>expected</code> rounded to 2 decimals; return <code>null</code> if even 12 characters are not enough.</p>`,
  vi: `<p>Với <code>n</code> mã ngẫu nhiên trên 62 ký hiệu, số lần trùng kỳ vọng là <code>n² / (2 · 62^len)</code>. Trả <code>len</code> nhỏ nhất từ 1 tới 12 có số trùng kỳ vọng ≤ <code>tolerated</code>, dạng <code>{ len, expected }</code> với <code>expected</code> làm tròn 2 chữ số; trả <code>null</code> nếu 12 ký tự vẫn chưa đủ.</p>`,
  dauVao: ['n — number of links; tolerated — expected collisions you accept', 'n — số link; tolerated — số trùng kỳ vọng chấp nhận được'],
  dauRa: ['{ len, expected } | null', '{ len, expected } | null'],
  goiY: [['Loop len from 1 upwards and stop at the first that fits.', 'Lặp len từ 1 trở lên và dừng ở giá trị đầu tiên vừa.'], ['62 ** len grows fast — doubles are fine up to 12.', '62 ** len tăng rất nhanh — số thực vẫn đủ tới 12.']],
  loi: [['Using n / 62^len (no square, no 2) — the birthday effect disappears.', 'Dùng n / 62^len (không bình phương, không 2) — mất hiệu ứng ngày sinh.'], ['Returning the largest length instead of the smallest.', 'Trả độ dài lớn nhất thay vì nhỏ nhất.']],
  gt: ['Lesson 11.2 measured 1,000,000 codes: 6 characters 8–13 collisions (8.8 predicted), 7 characters 0–1 (0.14). Working back from the tolerated count picks the length in an interview.', 'Bài 11.2 đo 1.000.000 mã: 6 ký tự trùng 8–13 lần (dự đoán 8,8), 7 ký tự 0–1 (0,14). Tính ngược từ số trùng chấp nhận được là cách chọn độ dài khi phỏng vấn.'],
  kn: ['identifiers', 'estimation'],
  tns: [tn('expected value', 'giá trị kỳ vọng'), tn('tolerance', 'ngưỡng chấp nhận')],
  dau: `/** shortest code length for n links */
function codeLength(n, tolerated) {
  // Write your solution here
  for (let len = 1; len <= 12; len++) {
    const expected = n / 62 ** len;
    if (expected <= tolerated) return { len, expected: Math.round(expected * 100) / 100 };
  }
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(codeLength),
  cases: [
    { goi: goi('codeLength', 1000000, 10), moTa: ['One million links, ten collisions accepted', 'Một triệu link, chấp nhận mười lần trùng'] },
    { goi: goi('codeLength', 1000000, 1), an: true },
    { goi: goi('codeLength', 1000, 0.01), an: true },
    { goi: goi('codeLength', 1e12, 0.000001), an: true },
    { goi: goi('codeLength', 1e30, 1), an: true },
  ],
});

function checkCreate(body, taken, base) {
  const RESERVED = ['v1', 'api', 'admin', 'login', 'health'];
  const url = body && body.url;
  if (typeof url !== 'string' || url.length > 2048 || !/^https?:\/\/[^\s/?#]+(?:[/?#]\S*)?$/i.test(url)) return { status: 422, code: 'INVALID_URL' };
  if (url.toLowerCase().startsWith(base.toLowerCase())) return { status: 422, code: 'INVALID_URL' };
  const alias = body.alias;
  if (alias !== undefined && (typeof alias !== 'string' || !/^[A-Za-z0-9_-]{4,30}$/.test(alias) || RESERVED.includes(alias.toLowerCase()))) return { status: 422, code: 'INVALID_ALIAS' };
  if (alias !== undefined && taken.includes(alias)) return { status: 409, code: 'ALIAS_TAKEN' };
  const t = body.ttlDays;
  if (t !== undefined && !(Number.isInteger(t) && t >= 1 && t <= 365)) return { status: 422, code: 'INVALID_TTL' };
  return null;
}
const B = 'http://localhost:4120';
const E4 = jsBai({
  ten: 'Shortener 4 — Write checkCreate(body, taken, base): the checks of POST /v1/links', kho: 'MEDIUM', phut: 15,
  en: `<p>Return <code>null</code> if the link can be created, otherwise <code>{ status, code }</code> for the <b>first</b> failing rule, in this order:</p><ol><li><code>url</code> must be a string of at most 2048 characters starting with <code>http://</code> or <code>https://</code> followed by a host (no spaces) — else <code>422 INVALID_URL</code>;</li><li>it must not start with <code>base</code> (case-insensitive) — else <code>422 INVALID_URL</code>;</li><li>an <code>alias</code>, if present, must match <code>^[A-Za-z0-9_-]{4,30}$</code> and must not be <code>v1, api, admin, login, health</code> in any case — else <code>422 INVALID_ALIAS</code>;</li><li>an alias in <code>taken</code> — <code>409 ALIAS_TAKEN</code>;</li><li><code>ttlDays</code>, if present, must be an integer 1–365 — else <code>422 INVALID_TTL</code>.</li></ol><p>Do not use <code>new URL</code> (not available here).</p>`,
  vi: `<p>Trả <code>null</code> nếu tạo được link, ngược lại <code>{ status, code }</code> cho luật hỏng <b>đầu tiên</b>, theo thứ tự:</p><ol><li><code>url</code> phải là chuỗi tối đa 2048 ký tự bắt đầu bằng <code>http://</code> hoặc <code>https://</code> rồi tới host (không dấu cách) — sai thì <code>422 INVALID_URL</code>;</li><li>không được bắt đầu bằng <code>base</code> (không phân biệt hoa thường) — sai thì <code>422 INVALID_URL</code>;</li><li><code>alias</code> nếu có phải khớp <code>^[A-Za-z0-9_-]{4,30}$</code> và không là <code>v1, api, admin, login, health</code> ở bất kỳ kiểu chữ nào — sai thì <code>422 INVALID_ALIAS</code>;</li><li>alias nằm trong <code>taken</code> — <code>409 ALIAS_TAKEN</code>;</li><li><code>ttlDays</code> nếu có phải là số nguyên 1–365 — sai thì <code>422 INVALID_TTL</code>.</li></ol><p>Không dùng <code>new URL</code> (ở đây không có).</p>`,
  dauVao: ['body — object; taken — string[]; base — string', 'body — object; taken — string[]; base — chuỗi'],
  dauRa: ['null | { status, code }', 'null | { status, code }'],
  goiY: [['Check in the given order and return at the first failure.', 'Kiểm theo đúng thứ tự và trả ngay ở lỗi đầu tiên.'], ['Lower-case both sides before comparing the base and the reserved words.', 'Chuyển cả hai về chữ thường trước khi so base và từ dành riêng.']],
  loi: [['Accepting javascript: or ftp: URLs.', 'Nhận URL javascript: hay ftp:.'], ['Reserving “admin” but not “Admin”.', 'Chặn “admin” mà để lọt “Admin”.']],
  gt: ['These are the exact answers measured in 11.2: 409 for f-code-k20 a second time, 422 for javascript:alert(1), for a link to the shortener itself and for the alias admin.', 'Đây đúng là các câu trả lời đo ở bài 11.2: 409 cho f-code-k20 lần hai, 422 cho javascript:alert(1), cho link trỏ về chính dịch vụ và cho alias admin.'],
  kn: ['validation', 'errors'],
  tns: [tn('reserved word', 'từ dành riêng'), tn('first failure', 'lỗi đầu tiên')],
  dau: `/** validate POST /v1/links */
function checkCreate(body, taken, base) {
  // Write your solution here
  if (!body.url) return { status: 422, code: 'INVALID_URL' };
  if (taken.includes(body.alias)) return { status: 409, code: 'ALIAS_TAKEN' };
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(checkCreate),
  cases: [
    { goi: goi('checkCreate', { url: 'https://example.com/x', alias: 'f-code-k20' }, ['f-code-k20'], B), moTa: ['The taken alias of the lesson', 'Alias đã có trong bài'] },
    { goi: goi('checkCreate', { url: 'javascript:alert(1)' }, [], B), moTa: ['javascript: URL', 'URL javascript:'] },
    { goi: goi('checkCreate', { url: 'http://localhost:4120/f-code-k20' }, [], B), an: true },
    { goi: goi('checkCreate', { url: 'https://example.com/y', alias: 'Admin' }, [], B), an: true },
    { goi: goi('checkCreate', { url: 'https://club.fpt.edu.vn/form', alias: 'form-k20', ttlDays: 1 }, ['f-code-k20'], B), an: true },
    { goi: goi('checkCreate', { url: 'https://club.fpt.edu.vn/form', ttlDays: 400 }, [], B), an: true },
    { goi: goi('checkCreate', { url: 'https://a.b/' + 'x'.repeat(2050) }, [], B), an: true },
    { goi: goi('checkCreate', { url: 'https://example.com/p', alias: 'abc' }, [], B), an: true },
  ],
});

export default doiDau({ slug: 'api-11-2-rut-gon-link', ten: '11.2 Interview: a URL shortener (1)', khoa: KHOA, baiHoc: 'api-11-2-rut-gon-link', de: [E1, E2, E4, E3] });
