/** MAE101 · 9.1 — Subspaces, span, independence, basis, dimension, rank–nullity (bài mae101-9-1-co-so-so-chieu). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1 } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Vector spaces 1 — Span, independence, basis',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on the structure of vector spaces.</p>', '<p>Câu hỏi khái niệm về cấu trúc không gian vector.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A basis of a vector space is a set that is …', 'Một cơ sở của không gian vector là tập …'], ['linearly independent AND spans the space', 'linearly independent only', 'spanning only', 'made of unit vectors'], ['Spanning gives "enough", independence gives "not too many"; the count is the dimension.', 'Sinh ra cho "đủ", độc lập cho "không thừa"; số phần tử là số chiều.']),
    q('c2', ['Which set is a subspace of R³?', 'Tập nào là không gian con của R³?'], ['a plane through the origin', 'a plane not through the origin', 'the unit sphere', 'the first octant (x, y, z ≥ 0)'], ['A subspace must contain 0 and be closed under addition and scaling.', 'Không gian con phải chứa 0 và đóng với phép cộng và nhân vô hướng.']),
    q('c3', ['Four vectors in R³ are …', 'Bốn vector trong R³ …'], ['always linearly dependent', 'always independent', 'a basis of R³', 'never spanning'], ['dim R³ = 3, so at most 3 vectors can be independent.', 'dim R³ = 3, nên nhiều nhất 3 vector độc lập được.']),
    q('c4', ['A is 4 × 6 with rank 3. Its nullity is …', 'A cỡ 4 × 6 có hạng 3. Số khuyết (nullity) của nó là …'], ['3', '1', '4', '6'], ['Rank–nullity: rank + nullity = number of columns = 6.', 'Hạng + số khuyết = số cột = 6.']),
    q('c5', ['n vectors in Rⁿ placed as columns of A are independent exactly when …', 'n vector trong Rⁿ đặt làm cột của A độc lập đúng khi …'], ['det A ≠ 0', 'det A = 0', 'A has a zero row', 'A is symmetric'], ['det ≠ 0 ⟺ rank n ⟺ the columns form a basis of Rⁿ.', 'det ≠ 0 ⟺ hạng n ⟺ các cột lập thành một cơ sở của Rⁿ.']),
  ],
  goiY: ['More vectors than the dimension ⇒ dependent.', 'rank + nullity = number of columns.'],
  loiHayGap: ['Calling a shifted plane a subspace.', 'Using rows instead of columns in rank–nullity.'],
  thuatNgu: [tn('span', 'bao tuyến tính (span)'), tn('linearly independent', 'độc lập tuyến tính'), tn('basis', 'cơ sở'), tn('dimension', 'số chiều'), tn('nullity', 'số khuyết')],
  khaiNiem: ['basis', 'dimension'],
});

// Hạng do MÃ tính (khử Gauss) — cùng thuật toán với lab 9.
function rank(A) {
  const M = A.map((r) => r.slice()); let r = 0;
  for (let c = 0; c < M[0].length && r < M.length; c++) {
    let p = r; for (let i = r + 1; i < M.length; i++) if (Math.abs(M[i][c]) > Math.abs(M[p][c])) p = i;
    if (Math.abs(M[p][c]) < 1e-9) continue;
    [M[p], M[r]] = [M[r], M[p]];
    for (let i = r + 1; i < M.length; i++) { const f = M[i][c] / M[r][c]; for (let k = c; k < M[0].length; k++) M[i][k] -= f * M[r][k]; }
    r++;
  }
  return r;
}
const SETS = [
  ['(1, 2), (2, 4)', [[1, 2], [2, 4]]],
  ['(1, 0), (1, 1)', [[1, 1], [0, 1]]],
  ['(1, 0, 1), (0, 1, 1), (1, 1, 2)', [[1, 0, 1], [0, 1, 1], [1, 1, 2]]],
  ['(1, 0, 0), (1, 1, 0), (1, 1, 1)', [[1, 1, 1], [0, 1, 1], [0, 0, 1]]],
  ['(1, 2, 3), (2, 4, 6), (0, 1, 1), (1, 3, 4)', [[1, 2, 0, 1], [2, 4, 1, 3], [3, 6, 1, 4]]],
];
const E2 = tinh({
  tieuDe: 'Vector spaces 2 — Rank, independence and the dimension of the span',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>For each set of vectors, give the rank of the matrix with these vectors as columns, whether the set is independent, and the dimension of its span.</p>', '<p>Với mỗi tập vector, cho hạng của ma trận có các vector đó làm cột, tập có độc lập không, và số chiều của không gian sinh.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Independence and span', 'Độc lập và không gian sinh'], [{ ma: 's', ten: 'Vectors' }, { ma: 'r', ten: 'rank' }, { ma: 'i', ten: 'Independent?', luaChon: ['yes', 'no'] }, { ma: 'd', ten: 'dim span' }],
    SETS.map(([s, M]) => { const r = rank(M); return { o: { s }, a: { r: String(r), i: r === M[0].length ? 'yes' : 'no', d: String(r) } }; }),
    [SETS.map(([s, M]) => `${s}: rank ${rank(M)} of ${M[0].length} vectors`).join('; ') + '. Independent ⟺ rank = number of vectors; dim span = rank.', SETS.map(([s, M]) => `${s}: hạng ${rank(M)} trên ${M[0].length} vector`).join('; ') + '. Độc lập ⟺ hạng = số vector; số chiều không gian sinh = hạng.'])],
  goiY: ['Put the vectors as columns and row-reduce.', '(1, 1, 2) = (1, 0, 1) + (0, 1, 1).'],
  loiHayGap: ['Declaring a set independent because no vector is a multiple of another.', 'Confusing the dimension of the span with the ambient dimension.'],
  thuatNgu: [],
  khaiNiem: ['rank', 'span'],
});

export default doiDau({
  slug: 'mae101-9-1-co-so-so-chieu',
  ten: '9.1 Subspaces, basis & dimension',
  khoa: KHOA,
  baiHoc: 'mae101-9-1-co-so-so-chieu',
  de: [E1, E2],
});
