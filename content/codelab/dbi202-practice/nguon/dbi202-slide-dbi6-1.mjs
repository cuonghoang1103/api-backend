/**
 * DBI202 · 2.C Slide trường Chương 5 (1–14) — quan hệ là TÚI: ∪ ∩ − π σ × ⋈ khi có bộ trùng (đếm bản sao).
 */
import { mod, de, cs, q, bang1, kq, kqAn, ma, TN, tn } from './_chung.mjs';

const RS = String.raw`
CREATE TABLE R (A INT NOT NULL, B INT NOT NULL);   -- no key: a bag
CREATE TABLE S (A INT NOT NULL, B INT NOT NULL);
INSERT INTO R VALUES (1, 2), (3, 4), (1, 2), (1, 2);
INSERT INTO S VALUES (1, 2), (3, 4), (3, 4), (5, 6);
`;
const LD = {
  en: '<p><b>Two bags</b> (slide 4, tab <code>Bags.sql</code>): <code>R(A, B)</code> = {(1,2), (3,4), (1,2), (1,2)} and <code>S(A, B)</code> = {(1,2), (3,4), (3,4), (5,6)} — no keys, so the same tuple may appear several times.</p>',
  vi: '<p><b>Hai túi</b> (slide 4, tab <code>Bags.sql</code>): <code>R(A, B)</code> = {(1,2), (3,4), (1,2), (1,2)} và <code>S(A, B)</code> = {(1,2), (3,4), (3,4), (5,6)} — không có khoá nên một bộ có thể xuất hiện nhiều lần.</p>',
};
const B = { csdl: RS, tenCsdl: 'Bags', ld: LD };
const THEM = `INSERT INTO R VALUES (5, 6), (5, 6), (7, 8); INSERT INTO S VALUES (1, 2), (7, 8)`;

export default mod('dbi202-slide-dbi6-1', '2.C Relations as bags (slides 1–14)', [
  cs({
    t: 'Count the copies: bag ∪, ∩, − by hand', k: 'EASY', p: 8, loai: 'table',
    kn: ['bag union', 'bag intersection', 'bag difference'], tag: ['bags', 'slide'],
    en: '<p>With R = {(1,2), (3,4), (1,2), (1,2)} and S = {(1,2), (3,4), (3,4), (5,6)}, write how many copies of each tuple are in each result. Rule (slide 8): ∪ adds the counts, ∩ takes the minimum, − subtracts and stops at 0.</p>',
    vi: '<p>Với R = {(1,2), (3,4), (1,2), (1,2)} và S = {(1,2), (3,4), (3,4), (5,6)}, ghi số bản sao của mỗi bộ trong từng kết quả. Luật (slide 8): ∪ cộng số lần, ∩ lấy nhỏ nhất, − trừ đi và dừng ở 0.</p>',
    bang: [bang1('b1', ['Copies of each tuple', 'Số bản sao của mỗi bộ'],
      [{ ma: 'bo', ten: 'Tuple / Bộ' }, { ma: 'hop', ten: 'R ∪ S' }, { ma: 'giao', ten: 'R ∩ S' }, { ma: 'hieu', ten: 'R − S' }, { ma: 'hieu2', ten: 'S − R' }],
      [{ o: { bo: '(1,2)' }, a: { hop: '4', giao: '1', hieu: '2', hieu2: '0' } },
        { o: { bo: '(3,4)' }, a: { hop: '3', giao: '1', hieu: '0', hieu2: '1' } },
        { o: { bo: '(5,6)' }, a: { hop: '1', giao: '0', hieu: '0', hieu2: '1' } }],
      ['(1,2): R has 3, S has 1 ⇒ ∪ 4, ∩ 1, R−S 2, S−R 0. (3,4): R 1, S 2 ⇒ 3, 1, 0, 1. (5,6): R 0, S 1 ⇒ 1, 0, 0, 1.', '(1,2): R có 3, S có 1 ⇒ ∪ 4, ∩ 1, R−S 2, S−R 0. (3,4): R 1, S 2 ⇒ 3, 1, 0, 1. (5,6): R 0, S 1 ⇒ 1, 0, 0, 1.'])],
    gy: [['Count n (copies in R) and m (copies in S) first.', 'Đếm n (số bản trong R) và m (số bản trong S) trước.'], ['∪ = n + m, ∩ = min(n, m), R − S = max(0, n − m).', '∪ = n + m, ∩ = min(n, m), R − S = max(0, n − m).']],
    lhg: [['Using set rules (every count 0 or 1) on bags.', 'Dùng luật tập (mọi số đếm 0 hoặc 1) cho túi.'], ['Writing a negative count for R − S — it stops at 0.', 'Ghi số âm cho R − S — nó dừng ở 0.']],
    tn: [tn('bag (multiset)', 'túi (đa tập)')],
  }),
  de({
    ...B, t: 'How many times does each tuple appear?', k: 'EASY', p: 6,
    kn: ['bag', 'GROUP BY', 'COUNT'], tag: ['bags', 'group-by', 'slide'],
    en: '<p>Turn the bag R into a "set with counts": every distinct tuple of R once, with the number of times it appears.</p>',
    vi: '<p>Biến túi R thành "tập kèm số đếm": mỗi bộ khác nhau của R một lần, kèm số lần nó xuất hiện.</p>',
    yc: [['Columns: <code>A, B, times</code>.', 'Cột: <code>A, B, times</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT A, B, COUNT(*) AS times     -- one row per distinct tuple, with its multiplicity
FROM R
GROUP BY A, B;`,
    kiem: [kq(['Each tuple of R with its count', 'Mỗi bộ của R kèm số đếm']), kqAn(['More copies added to R', 'Thêm bản sao vào R'], THEM), ma(['Uses GROUP BY', 'Dùng GROUP BY'], '\\bGROUP\\s+BY\\b')],
    sai: [`SELECT DISTINCT A, B, 1 AS times FROM R`, `SELECT A, B, COUNT(DISTINCT A) AS times FROM R GROUP BY A, B`],
    gy: [['GROUP BY A, B makes one group per distinct tuple.', 'GROUP BY A, B tạo một nhóm cho mỗi bộ khác nhau.'], ['COUNT(*) counts the rows in each group.', 'COUNT(*) đếm số dòng trong mỗi nhóm.']],
    lhg: [['SELECT DISTINCT … — loses the counts, which is exactly what makes a bag a bag.', 'SELECT DISTINCT … — mất số đếm, mà số đếm chính là thứ làm nên túi.'], ['COUNT(DISTINCT A) — always 1 inside a group of identical tuples.', 'COUNT(DISTINCT A) — luôn là 1 trong nhóm các bộ giống hệt.']],
    gt: ['<p>A bag is fully described by (tuple, multiplicity). DISTINCT turns a bag into a set (the δ operator of 2.D); GROUP BY + COUNT keeps the information.</p>', '<p>Một túi được mô tả đủ bằng (bộ, số lần). DISTINCT biến túi thành tập (phép δ của 2.D); GROUP BY + COUNT giữ lại thông tin.</p>'],
    tn: [TN.groupBy, tn('multiplicity', 'số lần xuất hiện')],
  }),
  de({
    ...B, t: 'Bag union with UNION ALL', k: 'EASY', p: 6,
    kn: ['bag union', 'UNION ALL'], tag: ['bags', 'union-all', 'slide'],
    en: '<p>Compute the <b>bag</b> union R ∪ S (every copy of every tuple of both bags).</p>',
    vi: '<p>Tính hợp <b>túi</b> R ∪ S (mọi bản sao của mọi bộ ở cả hai túi).</p>',
    yc: [['Columns: <code>A, B</code>.', 'Cột: <code>A, B</code>.'], ['Expected 8 rows; row order does not matter.', 'Mong đợi 8 dòng; thứ tự dòng không quan trọng.']],
    giai: `SELECT A, B FROM R
UNION ALL                -- bag union: counts add up
SELECT A, B FROM S;`,
    kiem: [kq(['R ∪ S as a bag (8 rows)', 'R ∪ S dạng túi (8 dòng)']), kqAn(['More rows in both', 'Thêm dòng ở cả hai'], THEM), ma(['Uses UNION ALL', 'Dùng UNION ALL'], '\\bUNION\\s+ALL\\b')],
    sai: [`SELECT A, B FROM R UNION SELECT A, B FROM S`],
    gy: [['UNION removes duplicates (set union); UNION ALL keeps them (bag union).', 'UNION bỏ trùng (hợp tập); UNION ALL giữ trùng (hợp túi).'], ['SELECT A, B FROM R UNION ALL SELECT A, B FROM S', 'SELECT A, B FROM R UNION ALL SELECT A, B FROM S']],
    lhg: [['UNION — 3 rows instead of 8.', 'UNION — 3 dòng thay vì 8.'], ['Thinking UNION ALL is "UNION with extra checks" — it is the cheaper one: no duplicate removal.', 'Tưởng UNION ALL là "UNION kiểm thêm" — nó rẻ hơn: không phải loại trùng.']],
    gt: ['<p>Bag union adds multiplicities: (1,2) appears 3 + 1 = 4 times. SQL Server has only UNION ALL as a bag operator; bag ∩ and − need a trick (next exercise) because INTERSECT ALL / EXCEPT ALL exist in PostgreSQL but not in SQL Server.</p>', '<p>Hợp túi cộng số lần: (1,2) xuất hiện 3 + 1 = 4 lần. SQL Server chỉ có UNION ALL là phép trên túi; ∩ và − trên túi cần mẹo (bài sau) vì INTERSECT ALL / EXCEPT ALL có ở PostgreSQL mà không có ở SQL Server.</p>'],
    tn: [TN.setOp],
  }),
  de({
    ...B, t: 'Bag difference R − S without EXCEPT ALL', k: 'HARD', p: 12,
    kn: ['bag difference', 'ROW_NUMBER', 'EXCEPT'], tag: ['bags', 'window-function', 'slide'],
    en: '<p>SQL Server has no <code>EXCEPT ALL</code>. Compute the <b>bag</b> difference R − S anyway: (1,2) must appear twice (3 copies in R − 1 in S), (3,4) zero times. Trick from the lesson: number the copies of each tuple with <code>ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A)</code> on both sides, then use a plain EXCEPT on (A, B, copyNo).</p>',
    vi: '<p>SQL Server không có <code>EXCEPT ALL</code>. Vẫn tính hiệu <b>túi</b> R − S: (1,2) phải xuất hiện hai lần (3 bản trong R − 1 trong S), (3,4) không lần nào. Mẹo của bài: đánh số các bản sao của mỗi bộ bằng <code>ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A)</code> ở cả hai vế, rồi EXCEPT thường trên (A, B, sốBản).</p>',
    yc: [['Columns: <code>A, B</code> (one row per remaining copy).', 'Cột: <code>A, B</code> (mỗi bản sao còn lại một dòng).'], ['No EXCEPT ALL (SQL Server does not have it). Row order does not matter.', 'Không dùng EXCEPT ALL (SQL Server không có). Thứ tự dòng không quan trọng.']],
    giai: `SELECT A, B
FROM (
    SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM R   -- copies 1, 2, 3 of (1,2)
    EXCEPT
    SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM S   -- copy 1 of (1,2) cancels one
) AS T;`,
    kiem: [kq(['R − S as a bag', 'R − S dạng túi']), kqAn(['Different multiplicities', 'Số lần khác'], THEM), ma(['Numbers the copies with ROW_NUMBER', 'Đánh số bản sao bằng ROW_NUMBER'], '\\bROW_NUMBER\\s*\\(')],
    sai: [`SELECT A, B FROM R EXCEPT SELECT A, B FROM S`, `SELECT A, B FROM (SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM S EXCEPT SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM R) AS T`],
    gy: [['After numbering, R has (1,2,1), (1,2,2), (1,2,3), (3,4,1); S has (1,2,1), (3,4,1), (3,4,2), (5,6,1).', 'Sau khi đánh số, R có (1,2,1), (1,2,2), (1,2,3), (3,4,1); S có (1,2,1), (3,4,1), (3,4,2), (5,6,1).'], ['Set EXCEPT on the numbered tuples leaves (1,2,2), (1,2,3) — then drop the number.', 'EXCEPT tập trên các bộ đã đánh số còn (1,2,2), (1,2,3) — rồi bỏ cột số.']],
    lhg: [['Plain EXCEPT — set difference: (1,2) is in S, so it disappears completely; result empty.', 'EXCEPT thường — hiệu tập: (1,2) có trong S nên mất hẳn; kết quả rỗng.'], ['Swapping the sides — that computes S − R.', 'Đảo hai vế — đó là S − R.']],
    gt: ['<p>Numbering turns each copy into a distinct tuple, so set operators now count copies. The same trick with INTERSECT gives the bag ∩ (min of the counts). PostgreSQL simply writes <code>EXCEPT ALL</code>.</p>', '<p>Đánh số biến mỗi bản sao thành một bộ riêng, nên phép tập giờ đếm được bản sao. Cùng mẹo với INTERSECT ra ∩ túi (min các số đếm). PostgreSQL chỉ cần viết <code>EXCEPT ALL</code>.</p>'],
    tn: [tn('ROW_NUMBER()', 'đánh số thứ tự dòng', 'Hàm cửa sổ: đánh số 1, 2, 3… trong mỗi nhóm PARTITION BY.')],
  }),
  cs({
    t: 'Sets vs bags: which laws survive?', k: 'MEDIUM', p: 6,
    kn: ['algebraic laws', 'bags vs sets', 'AVG on bags'], tag: ['bags', 'slide'],
    en: '<p>Some identities of set algebra are false on bags (slides 11–14).</p>', vi: '<p>Một số đẳng thức của đại số tập sai trên túi (slide 11–14).</p>',
    cau: [
      q('c1', ['Is R ∪ R = R true on bags?', 'R ∪ R = R có đúng trên túi?'], ['No — on bags R ∪ R doubles every count', 'Yes — union is idempotent everywhere', 'Only if R has a key', 'Only for empty R'], ['Bag union adds counts, so R ∪ R has every tuple twice as often. (If R has a key it is a set and has no duplicates — but R ∪ R still duplicates it.)', 'Hợp túi cộng số lần nên R ∪ R có mỗi bộ gấp đôi.']),
      q('c2', ['R = {1, 1, 2}. What is AVG over the bag, and over the set?', 'R = {1, 1, 2}. AVG trên túi và trên tập là bao nhiêu?'], ['4/3 on the bag, 3/2 on the set', '3/2 on both', '4/3 on both', '1 on the bag, 2 on the set'], ['Bag: (1+1+2)/3 = 4/3. Set {1, 2}: 3/2. In SQL: AVG(x) vs AVG(DISTINCT x).', 'Túi: (1+1+2)/3 = 4/3. Tập {1, 2}: 3/2. Trong SQL: AVG(x) vs AVG(DISTINCT x).']),
      q('c3', ['Why does SQL use bags by default?', 'Vì sao SQL mặc định dùng túi?'], ['Removing duplicates costs a sort or hash, and counts are often meaningful', 'Because sets cannot be stored on disk', 'Because the relational model forbids sets', 'Because primary keys require duplicates'], ['Projection and union are cheaper without de-duplication; and "how many times" (cups sold) is information.', 'Phép chiếu và hợp rẻ hơn khi không loại trùng; và "bao nhiêu lần" (số ly bán) là thông tin.']),
      q('c4', ['π<sub>A</sub>(R) on the bag R = {(1,2), (3,4), (1,2), (1,2)} has how many tuples?', 'π<sub>A</sub>(R) trên túi R = {(1,2), (3,4), (1,2), (1,2)} có bao nhiêu bộ?'], ['4', '2', '3', '1'], ['Bag projection keeps one output tuple per input tuple: 1, 3, 1, 1.', 'Phép chiếu túi giữ mỗi bộ vào một bộ ra: 1, 3, 1, 1.']),
    ],
    gy: [['On bags, every operator keeps track of counts.', 'Trên túi, mọi phép đều theo dõi số lần.'], ['Idempotence (R ∪ R = R) and some distributive laws fail on bags.', 'Tính luỹ đẳng (R ∪ R = R) và vài luật phân phối sai trên túi.']],
    lhg: [['Applying set intuition ("duplicates vanish") to SQL results.', 'Áp trực giác tập ("trùng tự biến mất") cho kết quả SQL.'], ['Forgetting DISTINCT changes AVG and COUNT.', 'Quên rằng DISTINCT làm đổi AVG và COUNT.']],
    tn: [tn('bag semantics', 'ngữ nghĩa túi')],
  }),
]);
