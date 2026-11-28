/** MAE101 · 6.1 — Matrix operations: sizes, product, transpose, identity (bài mae101-6-1-phep-ma-tran). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Matrices 1 — Sizes and the rules of the product',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on matrix algebra.</p>', '<p>Câu hỏi khái niệm về đại số ma trận.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A is 2 × 3 and B is 3 × 4. AB is …', 'A cỡ 2 × 3 và B cỡ 3 × 4. AB có cỡ …'], ['2 × 4', '3 × 3', '4 × 2', 'undefined'], ['Inner sizes must match (3 = 3); the outer sizes give the result.', 'Cỡ trong phải khớp (3 = 3); cỡ ngoài cho kết quả.']),
    q('c2', ['For square matrices, in general AB …', 'Với ma trận vuông, nói chung AB …'], ['≠ BA', '= BA', '= A + B', '= 0'], ['Matrix multiplication is not commutative; it is associative: (AB)C = A(BC).', 'Phép nhân ma trận không giao hoán; nó có tính kết hợp: (AB)C = A(BC).']),
    q('c3', ['(AB)ᵀ = …', '(AB)ᵀ = …'], ['BᵀAᵀ', 'AᵀBᵀ', 'AB', 'BA'], ['The order reverses — the same "socks and shoes" rule as for inverses.', 'Thứ tự đảo ngược — giống quy tắc "tất và giày" của ma trận nghịch đảo.']),
    q('c4', ['The entry (AB)ᵢⱼ is …', 'Phần tử (AB)ᵢⱼ là …'], ['row i of A · column j of B', 'aᵢⱼ · bᵢⱼ', 'row i of B · column j of A', 'aᵢⱼ + bᵢⱼ'], ['A dot product of a row and a column. Entry-by-entry multiplication is a different operation.', 'Tích vô hướng của một hàng và một cột. Nhân từng phần tử là một phép khác.']),
    q('c5', ['The identity matrix I satisfies …', 'Ma trận đơn vị I thoả …'], ['AI = IA = A for square A', 'AI = 0', 'A + I = A', 'Iᵀ = −I'], ['1s on the diagonal, 0s elsewhere: the "1" of matrix multiplication.', 'Số 1 trên đường chéo, 0 ở chỗ khác: "số 1" của phép nhân ma trận.']),
  ],
  goiY: ['(m × n)(n × p) = m × p.', 'Never assume AB = BA.'],
  loiHayGap: ['Multiplying entry by entry.', 'Writing (AB)ᵀ = AᵀBᵀ.'],
  thuatNgu: [tn('transpose', 'chuyển vị'), tn('identity matrix', 'ma trận đơn vị'), tn('commutative', 'giao hoán')],
  khaiNiem: ['matrix product'],
});

// A = [1 2; 3 4], B = [0 1; 1 0]
const E2 = tinh({
  tieuDe: 'Matrices 2 — Compute AB, BA and Aᵀ',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A = [1 2; 3 4] and B = [0 1; 1 0] (rows separated by ";"). Fill in the entries.</p>', '<p>A = [1 2; 3 4] và B = [0 1; 1 0] (các hàng cách nhau bằng ";"). Điền các phần tử.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Entries', 'Các phần tử'], [{ ma: 'm', ten: 'Matrix' }, { ma: 'a', ten: '(1,1)' }, { ma: 'b', ten: '(1,2)' }, { ma: 'c', ten: '(2,1)' }, { ma: 'd', ten: '(2,2)' }], [
    { o: { m: 'AB' }, a: { a: '2', b: '1', c: '4', d: '3' } },
    { o: { m: 'BA' }, a: { a: '3', b: '4', c: '1', d: '2' } },
    { o: { m: 'Aᵀ' }, a: { a: '1', b: '3', c: '2', d: '4' } },
    { o: { m: 'A + B' }, a: { a: '1', b: '3', c: '4', d: '4' } },
    { o: { m: '2A' }, a: { a: '2', b: '4', c: '6', d: '8' } },
  ], ['B swaps: AB swaps the COLUMNS of A ([2 1; 4 3]); BA swaps the ROWS ([3 4; 1 2]) — so AB ≠ BA. Aᵀ turns rows into columns. Sums and scalar multiples are entry by entry.', 'B là phép đổi chỗ: AB đổi CỘT của A ([2 1; 4 3]); BA đổi HÀNG ([3 4; 1 2]) — nên AB ≠ BA. Aᵀ biến hàng thành cột. Tổng và nhân vô hướng làm theo từng phần tử.'])],
  goiY: ['Entry (i, j) = row i · column j.', 'Multiplying by B on the right acts on columns.'],
  loiHayGap: ['Computing BA when AB is asked.', 'Transposing only the diagonal.'],
  thuatNgu: [tn('permutation matrix', 'ma trận hoán vị')],
  khaiNiem: ['matrix arithmetic'],
});

export default doiDau({
  slug: 'mae101-6-1-phep-ma-tran',
  ten: '6.1 Matrix operations',
  khoa: KHOA,
  baiHoc: 'mae101-6-1-phep-ma-tran',
  de: [E1, E2],
});
void so;
