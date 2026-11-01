/**
 * DBI202 · 4.5 Thực hành Chương 4 — bao đóng & FD kéo theo, tìm MỌI khoá, phủ tối thiểu, dạng chuẩn cao nhất, chase.
 * Đáp án tính bằng _fd.mjs. Bài 8 (bảng đơn hàng → CREATE TABLE) là Lab 4.
 */
import { mod, cs, q, bang1, tn } from './_chung.mjs';
import { F, closure, keys, implies, nf, minimalCover, lossless, bienThe, bienTheKhoa } from './_fd.mjs';

const F1 = F('AB->C', 'C->A', 'BC->D', 'ACD->B', 'D->EG', 'BE->C', 'CG->BD', 'CE->AG');
const F2 = F('A->B', 'BC->E', 'ED->A');
const F3 = F('A->BC', 'AB->D', 'B->C', 'AC->E', 'D->E');
const F7 = F('A->B', 'B->C', 'CD->A');
const NF4 = [
  ['(a) R(A, B, C, D), {AB → C, B → D}', 'ABCD', F('AB->C', 'B->D')],
  ['(b) R(A, B, C, D), {A → B, B → C, A → D}', 'ABCD', F('A->B', 'B->C', 'A->D')],
  ['(c) R(A, B, C), {AB → C, C → B}', 'ABC', F('AB->C', 'C->B')],
  ['(d) R(A, B, C, D), {A → BCD, BC → A}', 'ABCD', F('A->BCD', 'BC->A')],
  ['(e) R(A, B, C, D, E), {A → B, BC → E, ED → A}', 'ABCDE', F2],
];
const yn = (b) => (b ? 'yes' : 'no');

export default mod('dbi202-on-ch4', '4.5 Practice: FDs, keys & normalization', [
  cs({
    t: 'Exercise 1 — closures and implied FDs', k: 'MEDIUM', p: 10, loai: 'table',
    kn: ['closure', 'implication', 'key test'], tag: ['fd', 'closure'],
    en: '<p>R(A, B, C, D, E, G), F = {AB → C, C → A, BC → D, ACD → B, D → EG, BE → C, CG → BD, CE → AG}. Closures: letters in alphabetical order.</p>',
    vi: '<p>R(A, B, C, D, E, G), F như trên. Bao đóng: chữ theo thứ tự bảng chữ cái.</p>',
    bang: [bang1('b1', ['Exercise 1', 'Bài 1'], [{ ma: 'hoi', ten: 'Question / Câu hỏi' }, { ma: 'dap', ten: 'Answer / Đáp án' }],
      [{ o: { hoi: '(a) (BD)⁺' }, a: { dap: bienThe(closure('BD', F1)) } },
        { o: { hoi: '(b) does BD → AC follow? (yes/no)' }, a: { dap: yn(implies(F1, 'BD', 'AC')) } },
        { o: { hoi: '(c) is BD a key? (yes/no)' }, a: { dap: yn(keys('ABCDEG', F1).includes('BD')) } },
        { o: { hoi: '(d) (CE)⁺' }, a: { dap: bienThe(closure('CE', F1)) } },
        { o: { hoi: '(e) does AD → B follow? (yes/no)' }, a: { dap: yn(implies(F1, 'AD', 'B')) } },
        { o: { hoi: '(f) how many candidate keys does R have?' }, a: { dap: String(keys('ABCDEG', F1).length) } }],
      [`(BD)⁺ = ${closure('BD', F1).join('')}; (CE)⁺ = ${closure('CE', F1).join('')} (needs a second pass); (AD)⁺ = ${closure('AD', F1).join('')} has no B. Keys: ${keys('ABCDEG', F1).join(', ')}.`, `(BD)⁺ = ${closure('BD', F1).join('')}; (CE)⁺ = ${closure('CE', F1).join('')} (cần lượt hai); (AD)⁺ = ${closure('AD', F1).join('')} không có B. Khoá: ${keys('ABCDEG', F1).join(', ')}.`])],
    gy: [['Keep looping until a whole pass adds nothing.', 'Lặp tới khi cả một lượt không thêm được gì.'], ['BD is a key if (BD)⁺ = R and neither B⁺ nor D⁺ is R.', 'BD là khoá nếu (BD)⁺ = R và cả B⁺ lẫn D⁺ đều chưa là R.']],
    lhg: [['Stopping (CE)⁺ after one pass.', 'Dừng (CE)⁺ sau một lượt.'], ['Answering "2 keys" — this F has 7.', 'Trả lời "2 khoá" — F này có 7 khoá.']],
    tn: [tn('closure', 'bao đóng')],
  }),
  cs({
    t: 'Exercises 2–3 — all keys, prime attributes, minimal cover', k: 'HARD', p: 12,
    kn: ['candidate keys', 'prime attributes', 'minimal cover'], tag: ['fd', 'keys', 'minimal-cover'],
    en: '<p>Exercise 2: R(A, B, C, D, E), F = {A → B, BC → E, ED → A}. Exercise 3: R(A, B, C, D, E), F = {A → BC, AB → D, B → C, AC → E, D → E}.</p>',
    vi: '<p>Bài 2: R(A, B, C, D, E), F = {A → B, BC → E, ED → A}. Bài 3: R(A, B, C, D, E), F = {A → BC, AB → D, B → C, AC → E, D → E}.</p>',
    cau: [
      q('k1', ['Exercise 2: the candidate keys are…', 'Bài 2: các khoá ứng viên là…'], [keys('ABCDE', F2).join(', '), 'CD', 'ACD', 'ACD, BCD'], ['C and D are left-only (in every key) but (CD)⁺ = CD; adding A, B or E gives a key each.', 'C và D chỉ ở vế trái (trong mọi khoá) nhưng (CD)⁺ = CD; thêm A, B hoặc E đều ra một khoá.']),
      q('k2', ['Exercise 2: which attributes are prime?', 'Bài 2: thuộc tính nào là thuộc tính khoá?'], ['A, B, C, D, E — all of them', 'C, D only', 'A, C, D only', 'none'], ['Every attribute appears in some key (ACD, BCD, CDE).', 'Thuộc tính nào cũng nằm trong một khoá (ACD, BCD, CDE).']),
      q('k3', ['Exercise 2: highest normal form?', 'Bài 2: dạng chuẩn cao nhất?'], [nf('ABCDE', F2), 'BCNF', '2NF', '1NF'], ['All attributes are prime ⇒ 3NF holds; A → B has a non-superkey left side ⇒ not BCNF.', 'Mọi thuộc tính đều là khoá ⇒ đạt 3NF; A → B có vế trái không là siêu khoá ⇒ không BCNF.']),
      q('k4', ['Exercise 3: a minimal cover is…', 'Bài 3: một phủ tối thiểu là…'], [`{${minimalCover(F3).join(', ').replace(/->/g, ' → ')}}`, '{A → B, A → C, A → D, A → E, B → C, D → E}', '{A → BCDE}', '{A → B, AB → D, B → C, D → E}'], ['Split, shrink AB → D and AC → E to A → D and A → E, drop A → C and A → E as redundant.', 'Tách, rút AB → D và AC → E thành A → D và A → E, bỏ A → C và A → E vì thừa.']),
      q('k5', ['Exercise 3: the key of R and its normal form?', 'Bài 3: khoá của R và dạng chuẩn?'], [`${keys('ABCDE', F3).join(', ')} — ${nf('ABCDE', F3)}`, 'AB — 1NF', 'A — 3NF', 'AD — BCNF'], ['A⁺ = ABCDE ⇒ key A; B → C and D → E are transitive ⇒ 2NF only.', 'A⁺ = ABCDE ⇒ khoá A; B → C và D → E là bắc cầu ⇒ chỉ 2NF.']),
    ],
    gy: [['Classify attributes (left-only / right-only / both) to find keys quickly.', 'Phân loại thuộc tính (chỉ trái / chỉ phải / cả hai) để tìm khoá nhanh.'], ['Minimal cover: split → shrink left sides → drop redundant FDs, in that order.', 'Phủ tối thiểu: tách → rút vế trái → bỏ FD thừa, đúng thứ tự.']],
    lhg: [['Thinking CD is a key because C, D are in every key.', 'Tưởng CD là khoá vì C, D có trong mọi khoá.'], ['Dropping redundant FDs before shrinking left sides.', 'Bỏ FD thừa trước khi rút vế trái.']],
    tn: [tn('prime attribute', 'thuộc tính khoá'), tn('minimal cover', 'phủ tối thiểu')],
  }),
  cs({
    t: 'Exercise 4 — keys and highest normal form', k: 'HARD', p: 12, loai: 'table',
    kn: ['normal forms'], tag: ['normalization', 'normal-forms'],
    en: '<p>For each relation write ALL keys (shortest first, comma-separated) and the highest normal form.</p>',
    vi: '<p>Với mỗi quan hệ ghi MỌI khoá (ngắn trước, cách bằng dấu phẩy) và dạng chuẩn cao nhất.</p>',
    bang: [bang1('b1', ['Keys and NF', 'Khoá và dạng chuẩn'],
      [{ ma: 'r', ten: 'Relation / Quan hệ' }, { ma: 'k', ten: 'Keys / Khoá' }, { ma: 'nf', ten: 'Highest NF', luaChon: ['1NF', '2NF', '3NF', 'BCNF'] }],
      NF4.map(([ten, R, f]) => ({ o: { r: ten }, a: { k: bienTheKhoa(keys(R, f)), nf: nf(R, f) } })),
      [NF4.map(([ten, R, f]) => `${ten.slice(0, 3)} keys ${keys(R, f).join(', ')} → ${nf(R, f)}`).join('; '), 'Như trên. (c): C⁺ = BC nên C không là siêu khoá, nhưng B là thuộc tính khoá (khoá AB, AC) ⇒ 3NF. (d): BC là khoá thứ hai ⇒ BCNF.'])],
    gy: [['All keys first — (c) has two keys, which makes B prime.', 'Mọi khoá trước — (c) có hai khoá nên B là thuộc tính khoá.'], ['Then test each FD against 2NF, 3NF, BCNF in turn.', 'Rồi xét từng FD theo 2NF, 3NF, BCNF lần lượt.']],
    lhg: [['Answering 2NF for (c) with only AB in mind.', 'Trả 2NF cho (c) khi chỉ nghĩ tới khoá AB.'], ['Missing BC as a key of (d).', 'Bỏ sót BC là khoá của (d).']],
    tn: [tn('highest normal form', 'dạng chuẩn cao nhất')],
  }),
  cs({
    t: 'Exercise 7 — the chase test', k: 'HARD', p: 10, loai: 'table',
    kn: ['chase', 'lossless join'], tag: ['normalization', 'chase'],
    en: '<p>R(A, B, C, D), F = {A → B, B → C, CD → A}. Run the chase (one row per piece) and decide whether each decomposition is lossless.</p>',
    vi: '<p>R(A, B, C, D), F = {A → B, B → C, CD → A}. Chạy chase (mỗi mảnh một dòng) và quyết định mỗi phân rã có không mất không.</p>',
    bang: [bang1('b1', ['Chase', 'Chase'], [{ ma: 'pr', ten: 'Decomposition' }, { ma: 'll', ten: 'Lossless?', luaChon: ['yes', 'no'] }],
      [['{AD, AC, BCD}', ['AD', 'AC', 'BCD']], ['{AB, BC, CD}', ['AB', 'BC', 'CD']], ['{ABC, CD}', ['ABC', 'CD']], ['{ACD, AB}', ['ACD', 'AB']]]
        .map(([ten, ps]) => ({ o: { pr: ten }, a: { ll: yn(lossless('ABCD', ps, F7)) } })),
      ['A decomposition is lossless when some row of the tableau becomes all plain letters. {AD, AC, BCD}: A → B, B → C, CD → A, A → B fill row AD ⇒ yes. {AB, BC, CD}: rows agree on C but never on CD ⇒ no. {ABC, CD}: common C determines neither piece ⇒ no. {ACD, AB}: common A → B ⇒ yes.', 'Phân rã không mất khi có một dòng của bảng trở thành toàn chữ không chỉ số. Xem lời giải chi tiết ở bài 4.5.'])],
    gy: [['Start: each row has plain letters on its piece\'s attributes, subscripts elsewhere.', 'Bắt đầu: mỗi dòng có chữ không chỉ số ở thuộc tính của mảnh mình, chữ có chỉ số ở chỗ khác.'], ['Apply FDs: rows equal on the left side ⇒ make the right side equal (prefer the plain letter).', 'Áp FD: các dòng bằng nhau ở vế trái ⇒ cho vế phải bằng nhau (ưu tiên chữ không chỉ số).']],
    lhg: [['Stopping after one pass of FDs.', 'Dừng sau một lượt áp FD.'], ['Declaring lossless because every attribute is covered.', 'Kết luận không mất chỉ vì thuộc tính nào cũng được phủ.']],
    tn: [tn('chase', 'phép chase')],
  }),
]);
