/**
 * DBI202 · 4.2 Luật Armstrong, bao đóng & tìm khoá — bao đóng thuộc tính, tìm MỌI khoá có hệ thống, kiểm một FD / hai tập FD
 * tương đương. Mọi đáp án tính bằng _fd.mjs.
 */
import { mod, cs, q, bang1, tn } from './_chung.mjs';
import { F, closure, keys, implies, bienThe } from './_fd.mjs';

const F1 = F('A->B', 'BC->D', 'D->E', 'E->C');          // R(A, B, C, D, E)
const F2 = F('AB->C', 'C->D', 'D->A');                   // R(A, B, C, D)
const F3 = F('A->BC', 'B->D', 'CD->E', 'E->A');          // R(A, B, C, D, E)
const G1 = F('A->B', 'B->C');
const G2 = F('A->B', 'B->C', 'A->C');
const G3 = F('A->BC', 'B->C');
const kc = (R, f) => keys(R, f);
const fmt = (ks) => ks.join(', ');

export default mod('dbi202-bao-dong-tim-khoa', '4.2 Armstrong rules, closures & finding keys', [
  cs({
    t: 'Attribute closures, pass by pass', k: 'EASY', p: 10, loai: 'table',
    kn: ['attribute closure'], tag: ['fd', 'closure'],
    en: '<p>R(A, B, C, D, E), F = {A → B, BC → D, D → E, E → C}. Compute each closure; letters in alphabetical order (e.g. <code>ABCDE</code>).</p>',
    vi: '<p>R(A, B, C, D, E), F = {A → B, BC → D, D → E, E → C}. Tính từng bao đóng; chữ theo thứ tự (vd <code>ABCDE</code>).</p>',
    bang: [bang1('b1', ['X⁺', 'X⁺'], [{ ma: 'x', ten: 'X' }, { ma: 'cl', ten: 'X⁺' }],
      ['A', 'AC', 'AD', 'BE', 'D'].map((x) => ({ o: { x: `{${x.split('').join(', ')}}` }, a: { cl: bienThe(closure(x, F1)) } })),
      [`${['A', 'AC', 'AD', 'BE', 'D'].map((x) => `(${x})⁺ = ${closure(x, F1).join('')}`).join('; ')}. AC and AD reach every attribute, so both are superkeys.`, `${['A', 'AC', 'AD', 'BE', 'D'].map((x) => `(${x})⁺ = ${closure(x, F1).join('')}`).join('; ')}. AC và AD tới được mọi thuộc tính nên cả hai là siêu khoá.`])],
    gy: [['Fire every FD whose left side is already inside the set; repeat until stable.', 'Cho chạy mọi FD có vế trái đã nằm trong tập; lặp tới khi ổn định.'], ['(BE)⁺: E → C gives C, then BC → D gives D.', '(BE)⁺: E → C cho C, rồi BC → D cho D.']],
    lhg: [['Firing BC → D from B alone.', 'Cho BC → D chạy khi chỉ có B.'], ['Forgetting that X ⊆ X⁺ (the closure always contains X itself).', 'Quên rằng X ⊆ X⁺ (bao đóng luôn chứa chính X).']],
    tn: [tn('closure', 'bao đóng')],
  }),
  cs({
    t: 'Find ALL candidate keys', k: 'HARD', p: 12,
    kn: ['candidate keys', 'left-only / right-only attributes'], tag: ['fd', 'keys'],
    en: '<p>The systematic method of lesson 4.2: attributes that never appear on a right side are in every key; attributes only on the right are in no key; try the rest one by one.</p>',
    vi: '<p>Phương pháp có hệ thống của bài 4.2: thuộc tính không bao giờ ở vế phải nằm trong mọi khoá; chỉ ở vế phải thì không thuộc khoá nào; thử phần còn lại từng cái.</p>',
    cau: [
      q('k1', ['R(A, B, C, D, E), F = {A → B, BC → D, D → E, E → C}. All candidate keys:', 'R(A, B, C, D, E), F = {A → B, BC → D, D → E, E → C}. Mọi khoá ứng viên:'], [fmt(kc('ABCDE', F1)), 'A', 'AC', 'AB, AC, AD'], [`A is in every key (never on a right side) but A⁺ = ${closure('A', F1).join('')}. Adding C, D or E reaches everything: keys ${fmt(kc('ABCDE', F1))}.`, `A nằm trong mọi khoá (không bao giờ ở vế phải) nhưng A⁺ = ${closure('A', F1).join('')}. Thêm C, D hoặc E là tới hết: khoá ${fmt(kc('ABCDE', F1))}.`]),
      q('k2', ['R(A, B, C, D), F = {AB → C, C → D, D → A}. All candidate keys:', 'R(A, B, C, D), F = {AB → C, C → D, D → A}. Mọi khoá ứng viên:'], [fmt(kc('ABCD', F2)), 'AB', 'B', 'AB, BC'], [`B is never on a right side; B⁺ = B. With one more attribute: ${fmt(kc('ABCD', F2))} all reach ABCD.`, `B không bao giờ ở vế phải; B⁺ = B. Thêm một thuộc tính: ${fmt(kc('ABCD', F2))} đều tới ABCD.`]),
      q('k3', ['R(A, B, C, D, E), F = {A → BC, B → D, CD → E, E → A}. How many candidate keys?', 'R(A, B, C, D, E), F = {A → BC, B → D, CD → E, E → A}. Có bao nhiêu khoá ứng viên?'], [String(kc('ABCDE', F3).length), String(kc('ABCDE', F3).length + 1), '1', '2'], [`Keys: ${fmt(kc('ABCDE', F3))}. A and E are keys; BC and CD reach E and therefore A.`, `Khoá: ${fmt(kc('ABCDE', F3))}. A và E là khoá; BC và CD tới E rồi tới A.`]),
      q('k4', ['Which attributes can NEVER be part of a key?', 'Thuộc tính nào KHÔNG BAO GIỜ nằm trong khoá?'], ['those that appear only on right sides (and are not left-only)', 'those that appear only on left sides', 'those that appear on both sides', 'none — any attribute can be part of a key'], ['A right-only attribute is always derivable from the others, so a minimal key never needs it.', 'Thuộc tính chỉ ở vế phải luôn suy ra được từ thuộc tính khác nên khoá tối thiểu không bao giờ cần nó.']),
    ],
    gy: [['Classify every attribute: left-only, right-only, both, neither.', 'Phân loại mọi thuộc tính: chỉ trái, chỉ phải, cả hai, không bên nào.'], ['Close the left-only core; if it is not everything, add one "both" attribute at a time.', 'Tính bao đóng phần lõi chỉ-trái; chưa đủ thì thêm từng thuộc tính "cả hai".']],
    lhg: [['Stopping at the first key.', 'Dừng ở khoá đầu tiên.'], ['Listing a superkey (AB… with an extra attribute) as a candidate key.', 'Ghi một siêu khoá (thừa thuộc tính) như khoá ứng viên.']],
    tn: [tn('candidate key', 'khoá ứng viên')],
  }),
  cs({
    t: 'Does F imply this FD? Are two FD sets equivalent?', k: 'MEDIUM', p: 10, loai: 'table',
    kn: ['FD implication', 'equivalent FD sets'], tag: ['fd', 'closure'],
    en: '<p>Use closures: F ⊨ X → Y exactly when Y ⊆ X⁺ (computed under F). Two sets are equivalent when each implies every FD of the other.</p>',
    vi: '<p>Dùng bao đóng: F ⊨ X → Y khi và chỉ khi Y ⊆ X⁺ (tính theo F). Hai tập tương đương khi mỗi tập suy ra mọi FD của tập kia.</p>',
    bang: [bang1('b1', ['yes or no', 'yes hay no'],
      [{ ma: 'hoi', ten: 'Question / Câu hỏi' }, { ma: 'dap', ten: 'Answer', luaChon: ['yes', 'no'] }],
      [{ o: { hoi: 'F = {A → B, BC → D, D → E, E → C}: does AE → D follow?' }, a: { dap: implies(F1, 'AE', 'D') ? 'yes' : 'no' } },
        { o: { hoi: 'Same F: does BD → A follow?' }, a: { dap: implies(F1, 'BD', 'A') ? 'yes' : 'no' } },
        { o: { hoi: 'Same F: does BE → D follow?' }, a: { dap: implies(F1, 'BE', 'D') ? 'yes' : 'no' } },
        { o: { hoi: 'Are {A → B, B → C} and {A → B, B → C, A → C} equivalent?' }, a: { dap: G2.every((f) => implies(G1, f.l, f.r)) && G1.every((f) => implies(G2, f.l, f.r)) ? 'yes' : 'no' } },
        { o: { hoi: 'Are {A → B, B → C} and {A → BC, B → C} equivalent?' }, a: { dap: G3.every((f) => implies(G1, f.l, f.r)) && G1.every((f) => implies(G3, f.l, f.r)) ? 'yes' : 'no' } },
        { o: { hoi: 'Does {A → BC} imply AB → C?' }, a: { dap: implies(F('A->BC'), 'AB', 'C') ? 'yes' : 'no' } }],
      [`(AE)⁺ = ${closure('AE', F1).join('')} ∋ D; (BD)⁺ = ${closure('BD', F1).join('')} ∌ A; (BE)⁺ = ${closure('BE', F1).join('')} ∋ D. A → C follows by transitivity, so the first pair is equivalent; A → BC is just A → B plus A → C, so the second pair too. AB → C follows from A → BC by augmentation/decomposition.`, `(AE)⁺ = ${closure('AE', F1).join('')} có D; (BD)⁺ = ${closure('BD', F1).join('')} không có A; (BE)⁺ = ${closure('BE', F1).join('')} có D. A → C suy ra bằng bắc cầu nên cặp thứ nhất tương đương; A → BC chỉ là A → B cộng A → C nên cặp thứ hai cũng vậy. AB → C suy ra từ A → BC bằng tăng trưởng/tách.`])],
    gy: [['Compute X⁺ under F, then look for Y inside it.', 'Tính X⁺ theo F, rồi tìm Y trong đó.'], ['For equivalence, test both directions.', 'Với tương đương, kiểm cả hai chiều.']],
    lhg: [['Testing only one direction of equivalence.', 'Chỉ kiểm một chiều của tương đương.'], ['Thinking an FD must appear literally in F to be implied.', 'Tưởng FD phải xuất hiện nguyên văn trong F mới được suy ra.']],
    tn: [tn('logical implication', 'suy diễn logic')],
  }),
  cs({
    t: 'Armstrong\'s axioms: which rule was used?', k: 'EASY', p: 6,
    kn: ['reflexivity', 'augmentation', 'transitivity', 'union', 'decomposition'], tag: ['fd', 'armstrong'],
    en: '<p>Name the rule behind each derivation.</p>', vi: '<p>Gọi tên luật đứng sau mỗi bước suy diễn.</p>',
    cau: [
      q('a1', ['AB → A', 'AB → A'], ['reflexivity', 'augmentation', 'transitivity', 'union'], ['Y ⊆ X ⇒ X → Y (a trivial FD).', 'Y ⊆ X ⇒ X → Y (FD tầm thường).']),
      q('a2', ['From A → B derive AC → BC', 'Từ A → B suy ra AC → BC'], ['augmentation', 'reflexivity', 'transitivity', 'decomposition'], ['Add C to both sides.', 'Thêm C vào hai vế.']),
      q('a3', ['From A → B and B → C derive A → C', 'Từ A → B và B → C suy ra A → C'], ['transitivity', 'union', 'augmentation', 'reflexivity'], ['Chain the two FDs.', 'Nối hai FD.']),
      q('a4', ['From A → B and A → C derive A → BC', 'Từ A → B và A → C suy ra A → BC'], ['union (combining)', 'decomposition (splitting)', 'transitivity', 'reflexivity'], ['Same left side ⇒ combine the right sides.', 'Cùng vế trái ⇒ gộp vế phải.']),
      q('a5', ['From A → BC derive A → B', 'Từ A → BC suy ra A → B'], ['decomposition (splitting)', 'union (combining)', 'augmentation', 'transitivity'], ['Split the right side.', 'Tách vế phải.']),
    ],
    gy: [['Three axioms: reflexivity, augmentation, transitivity. Union and decomposition are derived from them.', 'Ba tiên đề: phản xạ, tăng trưởng, bắc cầu. Hợp và tách được suy ra từ chúng.'], ['Look at what changed: a side grew, two FDs chained, or right sides merged/split.', 'Xem cái gì đổi: một vế lớn lên, hai FD nối nhau, hay vế phải gộp/tách.']],
    lhg: [['Calling AC → BC "transitivity".', 'Gọi AC → BC là "bắc cầu".'], ['Thinking union and decomposition are separate axioms rather than consequences.', 'Tưởng hợp và tách là tiên đề riêng chứ không phải hệ quả.']],
    tn: [tn('Armstrong\'s axioms', 'hệ tiên đề Armstrong')],
  }),
]);
