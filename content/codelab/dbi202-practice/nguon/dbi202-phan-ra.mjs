/**
 * DBI202 · 4.3 Phân rã: nối không mất & bảo toàn phụ thuộc — tìm bộ thừa của phân rã sai bằng SQL, bảng kiểm lossless/
 * bảo toàn (tính bằng _fd.mjs), ca street–city–zip.
 */
import { mod, de, cs, q, bang1, kq, kqAn, ma, tn } from './_chung.mjs';
import { F, lossless, preserves } from './_fd.mjs';

const LOSSY = String.raw`
CREATE TABLE Supply (                       -- the original relation
  supplier NVARCHAR(20) NOT NULL,
  part     NVARCHAR(20) NOT NULL,
  city     NVARCHAR(20) NOT NULL,
  CONSTRAINT pk_supply PRIMARY KEY (supplier, part)
);
INSERT INTO Supply VALUES
 (N'Acme', N'bolt', N'Hanoi'), (N'Acme', N'nut', N'Hanoi'),
 (N'Bravo', N'bolt', N'Danang'), (N'Cobra', N'screw', N'Hue');
-- a careless decomposition on part (part does NOT determine anything)
CREATE TABLE SP (supplier NVARCHAR(20) NOT NULL, part NVARCHAR(20) NOT NULL);
CREATE TABLE PC (part NVARCHAR(20) NOT NULL, city NVARCHAR(20) NOT NULL);
INSERT INTO SP SELECT supplier, part FROM Supply;
INSERT INTO PC SELECT DISTINCT part, city FROM Supply;
`;
const LD = {
  en: '<p><b>Tables</b> (tab <code>Lossy.sql</code>): <code>Supply(supplier, part, city)</code> with supplier → city, and a careless decomposition <code>SP(supplier, part)</code>, <code>PC(part, city)</code> — the common attribute <code>part</code> determines nothing.</p>',
  vi: '<p><b>Bảng</b> (tab <code>Lossy.sql</code>): <code>Supply(supplier, part, city)</code> với supplier → city, và một phân rã cẩu thả <code>SP(supplier, part)</code>, <code>PC(part, city)</code> — thuộc tính chung <code>part</code> không xác định được gì.</p>',
};
const FZ = F('SC->Z', 'Z->C');             // street, city → zip; zip → city
const FR = F('A->B', 'B->C', 'CD->A');

export default mod('dbi202-phan-ra', '4.3 Decomposition: lossless join & dependency preservation', [
  de({
    csdl: LOSSY, tenCsdl: 'Lossy', ld: LD,
    t: 'Find the spurious tuples of a lossy decomposition', k: 'MEDIUM', p: 10,
    kn: ['lossy join', 'spurious tuples', 'EXCEPT'], tag: ['normalization', 'decomposition', 'except'],
    en: '<p>Join SP and PC back on <code>part</code>. Return the tuples that the join produces but that were <b>not</b> in Supply — the spurious tuples that prove the decomposition is lossy.</p>',
    vi: '<p>Nối SP và PC lại trên <code>part</code>. Trả các bộ mà phép nối sinh ra nhưng <b>không</b> có trong Supply — các bộ thừa chứng minh phân rã bị mất thông tin.</p>',
    yc: [['Columns: <code>supplier, part, city</code>.', 'Cột: <code>supplier, part, city</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT sp.supplier, sp.part, pc.city
FROM SP sp JOIN PC pc ON pc.part = sp.part      -- SP ⋈ PC
EXCEPT
SELECT supplier, part, city FROM Supply;          -- minus the truth = spurious tuples`,
    kiem: [kq(['Spurious tuples', 'Các bộ thừa']), kqAn(['Another shared part', 'Thêm một linh kiện dùng chung'], `INSERT INTO Supply VALUES (N'Delta', N'nut', N'Cantho'); INSERT INTO SP VALUES (N'Delta', N'nut'); INSERT INTO PC VALUES (N'nut', N'Cantho')`), ma(['Uses EXCEPT or NOT EXISTS', 'Dùng EXCEPT hoặc NOT EXISTS'], '\\bEXCEPT\\b|\\bNOT\\s+EXISTS\\b|\\bNOT\\s+IN\\b|\\bIS\\s+NULL\\b')],
    sai: [`SELECT sp.supplier, sp.part, pc.city FROM SP sp JOIN PC pc ON pc.part = sp.part`, `SELECT supplier, part, city FROM Supply EXCEPT SELECT sp.supplier, sp.part, pc.city FROM SP sp JOIN PC pc ON pc.part = sp.part`],
    gy: [['First compute SP ⋈ PC, then subtract Supply.', 'Tính SP ⋈ PC trước, rồi trừ Supply.'], ['A lossy join never loses tuples — it ADDS wrong ones.', 'Nối mất thông tin không làm mất bộ — nó THÊM bộ sai.']],
    lhg: [['Returning the whole join — the true tuples are in it too.', 'Trả cả phép nối — bộ đúng cũng nằm trong đó.'], ['Subtracting in the wrong direction (Supply − join) — always empty.', 'Trừ ngược chiều (Supply − phép nối) — luôn rỗng.']],
    gt: ['<p>Expected: (Acme, bolt, Danang) and (Bravo, bolt, Hanoi) — "bolt" links Acme with Bravo\'s city. The decomposition is lossless only if the common attribute determines one side; here part → city is false.</p>', '<p>Kết quả: (Acme, bolt, Danang) và (Bravo, bolt, Hanoi) — "bolt" nối nhầm Acme với thành phố của Bravo. Phân rã chỉ không mất khi thuộc tính chung xác định được một phía; ở đây part → city sai.</p>'],
    tn: [tn('spurious tuple', 'bộ thừa (giả)'), tn('lossy decomposition', 'phân rã mất thông tin')],
  }),
  cs({
    t: 'Lossless? Preserving? Check five decompositions', k: 'HARD', p: 12, loai: 'table',
    kn: ['lossless join test', 'dependency preservation test', 'chase'], tag: ['normalization', 'decomposition'],
    en: '<p>R(A, B, C, D), F = {A → B, B → C, CD → A}. For each decomposition answer yes/no (use the two-piece shortcut or the chase for three pieces).</p>',
    vi: '<p>R(A, B, C, D), F = {A → B, B → C, CD → A}. Với mỗi phân rã trả lời yes/no (dùng mẹo hai mảnh hoặc chase cho ba mảnh).</p>',
    bang: [bang1('b1', ['Decomposition properties', 'Tính chất phân rã'],
      [{ ma: 'pr', ten: 'Decomposition / Phân rã' }, { ma: 'll', ten: 'Lossless?', luaChon: ['yes', 'no'] }, { ma: 'bt', ten: 'Preserves F?', luaChon: ['yes', 'no'] }],
      [['{AB, ACD}', ['AB', 'ACD']], ['{AB, BCD}', ['AB', 'BCD']], ['{AD, AC, BCD}', ['AD', 'AC', 'BCD']], ['{AB, BC, CD}', ['AB', 'BC', 'CD']], ['{ABC, ACD}', ['ABC', 'ACD']]]
        .map(([ten, ps]) => ({ o: { pr: ten }, a: { ll: lossless('ABCD', ps, FR) ? 'yes' : 'no', bt: preserves(ps, FR) ? 'yes' : 'no' } })),
      ['Two pieces: lossless iff the common attributes determine one piece (AB ∩ ACD = A, A → B ✓; AB ∩ BCD = B, B → C but not B → A or B → D ✗). Three pieces need the chase. Preservation: can each FD be checked inside one piece or derived from the projections?', 'Hai mảnh: không mất khi và chỉ khi thuộc tính chung xác định một mảnh (AB ∩ ACD = A, A → B ✓; AB ∩ BCD = B, B → C nhưng không có B → A hay B → D ✗). Ba mảnh cần chase. Bảo toàn: mỗi FD kiểm được trong một mảnh hoặc suy ra từ các phép chiếu không?'])],
    gy: [['R1 ∩ R2 → R1 or R1 ∩ R2 → R2 (in F⁺) ⇔ lossless for two pieces.', 'R1 ∩ R2 → R1 hoặc R1 ∩ R2 → R2 (trong F⁺) ⇔ không mất với hai mảnh.'], ['Preservation and losslessness are independent — answer them separately.', 'Bảo toàn và không mất là độc lập — trả lời riêng từng cái.']],
    lhg: [['Concluding "lossless" because every attribute appears in some piece — that is only a requirement, not a proof.', 'Kết luận "không mất" vì thuộc tính nào cũng có mặt ở một mảnh — đó chỉ là điều kiện cần.'], ['Checking only FDs that fit literally inside a piece and missing ones derived through other pieces.', 'Chỉ kiểm FD nằm gọn trong một mảnh và bỏ sót FD suy ra qua các mảnh khác.']],
    tn: [tn('chase test', 'phép kiểm chase')],
  }),
  cs({
    t: 'The classic case: street, city, zip', k: 'MEDIUM', p: 8,
    kn: ['BCNF vs 3NF', 'dependency preservation'], tag: ['normalization', 'bcnf'],
    en: '<p>Address(street, city, zip) with street, city → zip and zip → city (lesson 4.3 worked example).</p>',
    vi: '<p>Address(street, city, zip) với street, city → zip và zip → city (ví dụ có lời giải bài 4.3).</p>',
    cau: [
      q('z1', ['Highest normal form of Address?', 'Dạng chuẩn cao nhất của Address?'], ['3NF', 'BCNF', '2NF', '1NF'], ['Keys (street, city) and (street, zip); zip → city has a non-superkey left side but city is prime.', 'Khoá (street, city) và (street, zip); zip → city có vế trái không là siêu khoá nhưng city là thuộc tính khoá.']),
      q('z2', ['The BCNF decomposition is {(zip, city), (street, zip)}. Is it lossless?', 'Phân rã BCNF là {(zip, city), (street, zip)}. Có không mất?'], [lossless('SCZ', ['ZC', 'SZ'], FZ) ? 'Yes — the common attribute zip is the key of (zip, city)' : 'No', 'No — street is missing from one piece', 'No — zip is not a key of R', 'It depends on the data'], ['zip → city makes zip a key of the first piece.', 'zip → city làm zip thành khoá của mảnh thứ nhất.']),
      q('z3', ['Which FD can no longer be checked inside one table after that decomposition?', 'Sau phân rã đó, FD nào không còn kiểm được trong một bảng?'], [preserves(['ZC', 'SZ'], FZ) ? 'none' : 'street, city → zip', 'zip → city', 'street → zip', 'city → street'], ['street and city are now in different tables; enforcing "one zip per street and city" needs a join (or a trigger).', 'street và city giờ ở hai bảng khác nhau; muốn bảo đảm "mỗi (street, city) một zip" phải nối (hoặc trigger).']),
      q('z4', ['So which design keeps every FD AND is lossless?', 'Vậy thiết kế nào giữ mọi FD VÀ không mất?'], ['keeping Address as it is (3NF)', 'the BCNF decomposition', 'splitting into three single-column tables', 'none exists'], ['3NF is always reachable with both properties; here R itself is already 3NF.', '3NF luôn đạt được với cả hai tính chất; ở đây chính R đã ở 3NF.']),
    ],
    gy: [['Find both keys first.', 'Tìm cả hai khoá trước.'], ['Lossless ≠ dependency-preserving.', 'Không mất ≠ bảo toàn phụ thuộc.']],
    lhg: [['Assuming BCNF is always better — here it costs an FD.', 'Cho rằng BCNF luôn tốt hơn — ở đây nó tốn một FD.'], ['Calling the BCNF split lossy.', 'Gọi phép tách BCNF là mất thông tin.']],
    tn: [tn('dependency preservation', 'bảo toàn phụ thuộc')],
  }),
]);
