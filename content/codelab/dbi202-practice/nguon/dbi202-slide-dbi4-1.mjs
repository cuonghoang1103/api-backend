/**
 * DBI202 · 4.A Slide trường Chương 3 (1–19) — phụ thuộc hàm, kiểm FD trên dữ liệu (SQL), luật tách/gộp/tầm thường,
 * bao đóng, cơ sở tối thiểu. Đáp án bao đóng/khoá tính bằng _fd.mjs.
 */
import { mod, de, cs, q, bang1, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { F, closure, minimalCover, bienThe } from './_fd.mjs';

export const MOVIES1 = String.raw`
CREATE TABLE Movies1 (
  title      NVARCHAR(40) NOT NULL,
  year       INT          NOT NULL,
  length     INT          NULL,
  genre      NVARCHAR(10) NULL,
  studioName NVARCHAR(20) NULL,
  starName   NVARCHAR(30) NOT NULL,
  CONSTRAINT pk_movies1 PRIMARY KEY (title, year, starName)
);
INSERT INTO Movies1 VALUES
 (N'Star Wars', 1977, 124, N'SciFi', N'Fox', N'Carrie Fisher'),
 (N'Star Wars', 1977, 124, N'SciFi', N'Fox', N'Mark Hamill'),
 (N'Star Wars', 1977, 124, N'SciFi', N'Fox', N'Harrison Ford'),
 (N'Gone With the Wind', 1939, 231, N'drama', N'MGM', N'Vivien Leigh'),
 (N'Wayne''s World', 1992, 95, N'comedy', N'Paramount', N'Dana Carvey'),
 (N'Wayne''s World', 1992, 95, N'comedy', N'Paramount', N'Mike Meyers');
`;
export const LD_MOVIES1 = {
  en: '<p><b>The relation of slides 5 and 21</b> (tab <code>Movies1.sql</code>): <code>Movies1(title, year, length, genre, studioName, starName)</code>, key (title, year, starName) — one row per (movie, star), so every movie fact is repeated once per star.</p>',
  vi: '<p><b>Quan hệ của slide 5 và 21</b> (tab <code>Movies1.sql</code>): <code>Movies1(title, year, length, genre, studioName, starName)</code>, khoá (title, year, starName) — mỗi (phim, diễn viên) một dòng, nên mọi thông tin của phim lặp lại theo số diễn viên.</p>',
};
const M1 = { csdl: MOVIES1, tenCsdl: 'Movies1', ld: LD_MOVIES1 };

const FA = F('AB->C', 'C->A', 'BC->D', 'ACD->B', 'D->EG', 'BE->C', 'CG->BD', 'CE->AG');
const R1 = { l: 'A', fds: F('A->B', 'B->C', 'C->D') };
const FM = F('A->BC', 'AB->D', 'B->C', 'AC->E', 'D->E');

export default mod('dbi202-slide-dbi4-1', '4.A Functional dependencies, closures & minimal bases (slides 1–19)', [
  de({
    ...M1, t: 'Does title, year → starName hold? Find the counter-examples', k: 'EASY', p: 7,
    kn: ['functional dependency', 'checking an FD on data'], tag: ['fd', 'group-by', 'slide'],
    en: '<p>An FD X → Y holds on an instance when no two tuples agree on X but differ on Y. Return every (title, year) whose tuples disagree on <code>starName</code> — the counter-examples to <code>title, year → starName</code> — with the number of different stars.</p>',
    vi: '<p>FD X → Y đúng trên một thể hiện khi không có hai bộ trùng X mà khác Y. Trả mọi (title, year) có các bộ khác nhau ở <code>starName</code> — phản ví dụ của <code>title, year → starName</code> — kèm số diễn viên khác nhau.</p>',
    yc: [['Columns: <code>title, year, stars</code>.', 'Cột: <code>title, year, stars</code>.'], ['Only the groups that break the FD; row order does not matter.', 'Chỉ các nhóm phá FD; thứ tự dòng không quan trọng.']],
    giai: `SELECT title, year, COUNT(DISTINCT starName) AS stars
FROM Movies1
GROUP BY title, year                      -- tuples that agree on X = title, year …
HAVING COUNT(DISTINCT starName) > 1;      -- … but differ on Y = starName`,
    kiem: [kq(['Groups violating title, year → starName', 'Các nhóm vi phạm title, year → starName']), kqAn(['A one-star movie and a two-star movie added', 'Thêm phim một diễn viên và phim hai diễn viên'], `INSERT INTO Movies1 VALUES (N'Jaws', 1975, 124, N'drama', N'Universal', N'Roy Scheider'), (N'Alien', 1979, 117, N'SciFi', N'Fox', N'Sigourney Weaver'), (N'Alien', 1979, 117, N'SciFi', N'Fox', N'Tom Skerritt')`), ma(['Uses COUNT(DISTINCT …) with HAVING', 'Dùng COUNT(DISTINCT …) với HAVING'], '\\bCOUNT\\s*\\(\\s*DISTINCT\\b[\\s\\S]*\\bHAVING\\b|\\bHAVING\\b[\\s\\S]*\\bCOUNT\\s*\\(\\s*DISTINCT\\b')],
    sai: [`SELECT title, year, COUNT(*) AS stars FROM Movies1 GROUP BY title, year`, `SELECT title, year, COUNT(DISTINCT length) AS stars FROM Movies1 GROUP BY title, year HAVING COUNT(DISTINCT length) > 1`],
    gy: [['Group the tuples by the left side X.', 'Gộp các bộ theo vế trái X.'], ['A group violates X → Y when it contains more than one distinct Y: HAVING COUNT(DISTINCT Y) &gt; 1.', 'Một nhóm vi phạm X → Y khi nó có hơn một giá trị Y khác nhau: HAVING COUNT(DISTINCT Y) &gt; 1.']],
    lhg: [['No HAVING — Gone With the Wind (one star) is listed though it breaks nothing.', 'Không HAVING — Gone With the Wind (một diễn viên) hiện dù không phá gì.'], ['Testing length instead of starName — title, year → length DOES hold, so the result is empty.', 'Kiểm length thay vì starName — title, year → length ĐÚNG nên kết quả rỗng.']],
    gt: ['<p>Expected: Star Wars 3, Wayne\'s World 2. An instance can only refute an FD; that title, year → length holds here is evidence, not proof — FDs come from the meaning of the data.</p>', '<p>Kết quả: Star Wars 3, Wayne\'s World 2. Một thể hiện chỉ bác bỏ được FD; việc title, year → length đúng ở đây là bằng chứng, không phải chứng minh — FD đến từ ý nghĩa dữ liệu.</p>'],
    tn: [tn('functional dependency (FD)', 'phụ thuộc hàm')],
  }),
  cs({
    t: 'Splitting, combining, trivial FDs and Armstrong\'s axioms', k: 'EASY', p: 7,
    kn: ['splitting rule', 'combining rule', 'trivial FD', 'Armstrong axioms'], tag: ['fd', 'slide'],
    en: '<p>Slides 6–14.</p>', vi: '<p>Slide 6–14.</p>',
    cau: [
      q('c1', ['title, year → length, genre is equivalent to…', 'title, year → length, genre tương đương với…'], ['title, year → length AND title, year → genre', 'title → length AND year → genre', 'title, year, length → genre only', 'length, genre → title, year'], ['Splitting/combining applies to the RIGHT side only.', 'Tách/gộp chỉ áp dụng cho vế PHẢI.']),
      q('c2', ['Can we split the LEFT side: from title, year → length conclude title → length?', 'Có tách được vế TRÁI: từ title, year → length suy ra title → length?'], ['No — remakes share a title but not a length', 'Yes — splitting works on both sides', 'Yes, but only for keys', 'Only if length is numeric'], ['Left sides cannot be split: King Kong 1933 and 2005 have different lengths.', 'Không tách được vế trái: King Kong 1933 và 2005 dài khác nhau.']),
      q('c3', ['Which FD is trivial?', 'FD nào là tầm thường?'], ['title, year → title', 'title → year', 'title, year → length', 'starName → title'], ['Trivial = the right side is a subset of the left side; it holds in every relation.', 'Tầm thường = vế phải là tập con của vế trái; đúng trong mọi quan hệ.']),
      q('c4', ['From A → B and B → C we conclude A → C by…', 'Từ A → B và B → C suy ra A → C bằng…'], ['transitivity', 'reflexivity', 'augmentation', 'splitting'], ['Armstrong: reflexivity (Y ⊆ X ⇒ X → Y), augmentation (X → Y ⇒ XZ → YZ), transitivity.', 'Armstrong: phản xạ (Y ⊆ X ⇒ X → Y), tăng trưởng (X → Y ⇒ XZ → YZ), bắc cầu.']),
      q('c5', ['From A → B, augmentation with C gives…', 'Từ A → B, tăng trưởng với C cho…'], ['AC → BC', 'A → BC', 'C → B', 'AB → C'], ['Add the same attributes to both sides.', 'Thêm cùng thuộc tính vào cả hai vế.']),
    ],
    gy: [['Right sides split and combine; left sides never split.', 'Vế phải tách và gộp được; vế trái không bao giờ tách.'], ['Trivial: Y ⊆ X.', 'Tầm thường: Y ⊆ X.']],
    lhg: [['Splitting the left side.', 'Tách vế trái.'], ['Confusing augmentation with transitivity.', 'Nhầm tăng trưởng với bắc cầu.']],
    tn: [tn('trivial FD', 'FD tầm thường'), tn('Armstrong\'s axioms', 'hệ tiên đề Armstrong')],
  }),
  cs({
    t: 'Compute the closures (slide 15 algorithm)', k: 'MEDIUM', p: 10, loai: 'table',
    kn: ['attribute closure'], tag: ['fd', 'closure', 'slide'],
    en: '<p>R(A, B, C, D, E, G), F = {AB → C, C → A, BC → D, ACD → B, D → EG, BE → C, CG → BD, CE → AG}. Compute each closure. Write the attributes in alphabetical order, e.g. <code>ADEG</code> (or <code>{A, D, E, G}</code>). Keep looping over F until nothing changes.</p>',
    vi: '<p>R(A, B, C, D, E, G), F như trên. Tính từng bao đóng. Viết thuộc tính theo thứ tự chữ cái, vd <code>ADEG</code> (hoặc <code>{A, D, E, G}</code>). Lặp qua F tới khi không còn gì thay đổi.</p>',
    bang: [bang1('b1', ['X⁺', 'X⁺'],
      [{ ma: 'x', ten: 'X' }, { ma: 'cl', ten: 'X⁺' }],
      ['BD', 'CE', 'AD', 'C', 'BE'].map((x) => ({ o: { x: `{${x.split('').join(', ')}}` }, a: { cl: bienThe(closure(x, FA)) } })),
      [`Answers: ${['BD', 'CE', 'AD', 'C', 'BE'].map((x) => `(${x})⁺ = ${closure(x, FA).join('')}`).join('; ')}. (CE)⁺ needs a second pass: CG → BD fires only after CE → AG has added G.`, `Đáp án: ${['BD', 'CE', 'AD', 'C', 'BE'].map((x) => `(${x})⁺ = ${closure(x, FA).join('')}`).join('; ')}. (CE)⁺ cần lượt thứ hai: CG → BD chỉ chạy sau khi CE → AG thêm G.`])],
    gy: [['Start with X; add the right side of every FD whose left side is inside the current set.', 'Bắt đầu từ X; thêm vế phải của mọi FD có vế trái nằm trong tập hiện tại.'], ['Repeat full passes until a pass adds nothing.', 'Lặp cả lượt tới khi một lượt không thêm được gì.']],
    lhg: [['Stopping after one pass — (CE)⁺ looks like ACEG instead of all of R.', 'Dừng sau một lượt — (CE)⁺ thành ACEG thay vì cả R.'], ['Firing an FD whose left side is only partly present (ACD → B with only A, D).', 'Cho FD chạy khi vế trái mới có một phần (ACD → B khi chỉ có A, D).']],
    tn: [tn('closure X⁺', 'bao đóng X⁺')],
  }),
  cs({
    t: 'Minimal basis of a set of FDs', k: 'HARD', p: 10,
    kn: ['minimal basis', 'redundant FD', 'extraneous attribute'], tag: ['fd', 'minimal-cover', 'slide'],
    en: `<p>Slides 16–19: a minimal basis has single-attribute right sides, no extraneous left-side attribute and no redundant FD.</p>`,
    vi: `<p>Slide 16–19: cơ sở tối thiểu có vế phải một thuộc tính, không thuộc tính thừa ở vế trái và không FD thừa.</p>`,
    cau: [
      q('c1', ['F = {A → BC, AB → D, B → C, AC → E, D → E}. A minimal basis is…', 'F = {A → BC, AB → D, B → C, AC → E, D → E}. Một cơ sở tối thiểu là…'], [`{${minimalCover(FM).join(', ').replace(/->/g, ' → ')}}`, '{A → B, A → C, A → D, B → C, D → E}', '{A → B, AB → D, B → C, D → E}', '{A → BCDE}'], ['Split, then shrink AB → D to A → D and AC → E to A → E, then drop A → C (via A → B, B → C) and A → E (via A → D, D → E).', 'Tách, rồi rút AB → D thành A → D và AC → E thành A → E, rồi bỏ A → C (qua A → B, B → C) và A → E (qua A → D, D → E).']),
      q('c2', [`F = {${R1.fds.map((f) => `${f.l.join('')} → ${f.r.join('')}`).join(', ')}, A → D}. Which FD is redundant?`, `F = {A → B, B → C, C → D, A → D}. FD nào thừa?`], ['A → D', 'A → B', 'B → C', 'C → D'], ['A⁺ without A → D still reaches D through B and C.', 'A⁺ khi bỏ A → D vẫn tới được D qua B và C.']),
      q('c3', ['In AB → C with A → C also in F, the attribute B is…', 'Trong AB → C khi F còn có A → C, thuộc tính B là…'], ['extraneous: AB → C can be replaced by A → C', 'essential: AB → C needs both A and B', 'a key attribute that must stay in AB', 'trivial, because B is on both sides'], ['A⁺ already contains C, so B adds nothing to the left side.', 'A⁺ đã chứa C nên B không thêm gì cho vế trái.']),
      q('c4', ['Why must step 2 (shrink left sides) come before step 3 (drop redundant FDs)?', 'Vì sao bước 2 (rút vế trái) phải trước bước 3 (bỏ FD thừa)?'], ['A shrunk FD can make another FD redundant that was not redundant before', 'Because step 3 needs single-attribute left sides', 'The order does not matter', 'Because step 2 adds new FDs'], ['Exercise 3 of 4.5: A → E only becomes removable after AC → E has been shrunk.', 'Bài 3 của 4.5: A → E chỉ bỏ được sau khi AC → E đã rút gọn.']),
    ],
    gy: [['Three steps: split right sides; remove extraneous left attributes; remove redundant FDs.', 'Ba bước: tách vế phải; bỏ thuộc tính thừa vế trái; bỏ FD thừa.'], ['To test an FD X → A for redundancy, compute X⁺ WITHOUT it.', 'Để kiểm X → A có thừa không, tính X⁺ KHI BỎ nó.']],
    lhg: [['Keeping A → C — it follows from A → B and B → C.', 'Giữ A → C — nó suy ra từ A → B và B → C.'], ['Merging everything into A → BCDE — that is not a minimal basis (right side not single, information lost about B and D).', 'Gộp tất cả thành A → BCDE — không phải cơ sở tối thiểu (vế phải không đơn, mất thông tin về B và D).']],
    tn: [tn('minimal basis / minimal cover', 'phủ tối thiểu')],
  }),
]);
