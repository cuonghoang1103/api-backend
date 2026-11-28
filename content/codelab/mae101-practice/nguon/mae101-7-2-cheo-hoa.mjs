/** MAE101 · 7.2 — Eigenvalues, eigenvectors, diagonalization (bài mae101-7-2-cheo-hoa). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Eigen 1 — Definitions and fast checks',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on eigenvalues and diagonalization.</p>', '<p>Câu hỏi khái niệm về giá trị riêng và chéo hoá.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['v is an eigenvector of A with eigenvalue λ when …', 'v là vector riêng của A ứng với giá trị riêng λ khi …'], ['Av = λv and v ≠ 0', 'Av = 0', 'Av = λ and v = 0', 'det(A) = λ'], ['The zero vector satisfies A·0 = λ·0 for every λ, so it is excluded by definition.', 'Vector 0 thoả A·0 = λ·0 với mọi λ, nên bị loại theo định nghĩa.']),
    q('c2', ['Eigenvalues are the roots of …', 'Giá trị riêng là nghiệm của …'], ['det(A − λI) = 0', 'A − λ = 0', 'det(A) = 0', 'tr(A) = λ'], ['The characteristic equation; each root λ gives eigenvectors from (A − λI)v = 0.', 'Phương trình đặc trưng; mỗi nghiệm λ cho vector riêng từ (A − λI)v = 0.']),
    q('c3', ['For a 2 × 2 matrix, λ₁ + λ₂ = … and λ₁·λ₂ = …', 'Với ma trận 2 × 2, λ₁ + λ₂ = … và λ₁·λ₂ = …'], ['trace(A) and det(A)', 'det(A) and trace(A)', 'a·d and b·c', '0 and 1'], ['A quick check after solving the characteristic equation.', 'Một phép kiểm nhanh sau khi giải phương trình đặc trưng.']),
    q('c4', ['If A = PDP⁻¹ with D diagonal, then A¹⁰ = …', 'Nếu A = PDP⁻¹ với D chéo thì A¹⁰ = …'], ['P D¹⁰ P⁻¹', 'P¹⁰ D P⁻¹⁰', 'D¹⁰', '10·PDP⁻¹'], ['The inner P⁻¹P pairs cancel; powering D just powers its diagonal entries.', 'Các cặp P⁻¹P bên trong triệt tiêu; luỹ thừa D chỉ là luỹ thừa các phần tử đường chéo.']),
    q('c5', ['A 90° rotation matrix [0 −1; 1 0] has …', 'Ma trận quay 90° [0 −1; 1 0] có …'], ['no real eigenvalues (λ² + 1 = 0)', 'eigenvalues 1 and −1', 'eigenvalue 0', 'eigenvalue 90'], ['No real direction is only scaled by a rotation; the eigenvalues are ±i.', 'Không có phương thực nào chỉ bị co giãn bởi phép quay; giá trị riêng là ±i.']),
  ],
  goiY: ['Characteristic equation, then (A − λI)v = 0.', 'Check with trace and determinant.'],
  loiHayGap: ['Accepting v = 0 as an eigenvector.', 'Mixing up trace and determinant.'],
  thuatNgu: [tn('eigenvalue', 'giá trị riêng'), tn('eigenvector', 'vector riêng'), tn('characteristic equation', 'phương trình đặc trưng'), tn('diagonalization', 'chéo hoá')],
  khaiNiem: ['eigenvalues'],
});

// Giá trị riêng của ma trận 2×2 do MÃ tính: λ = (tr ± √(tr² − 4 det)) / 2
const eig = ([[a, b], [c, d]]) => { const t = a + d, D = a * d - b * c, r = Math.sqrt(t * t - 4 * D); return [(t + r) / 2, (t - r) / 2]; };
const MS = [[[2, 1], [1, 2]], [[4, 1], [2, 3]], [[3, 0], [0, -1]], [[1, 2], [2, 1]], [[5, 4], [1, 2]]];
const hien = (m) => '[' + m.map((r) => r.join(' ')).join('; ').replace(/-/g, '−') + ']';
const E2 = tinh({
  tieuDe: 'Eigen 2 — Eigenvalues of 2 × 2 matrices',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Give the trace, the determinant and the two eigenvalues (larger first) of each matrix.</p>', '<p>Cho vết, định thức và hai giá trị riêng (lớn trước) của mỗi ma trận.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Eigenvalues', 'Giá trị riêng'], [{ ma: 'm', ten: 'Matrix' }, { ma: 't', ten: 'trace' }, { ma: 'd', ten: 'det' }, { ma: 'l', ten: 'λ₁ (larger)' }, { ma: 's', ten: 'λ₂' }],
    MS.map((m) => { const [l1, l2] = eig(m); return { o: { m: hien(m) }, a: { t: so(m[0][0] + m[1][1]), d: so(m[0][0] * m[1][1] - m[0][1] * m[1][0]), l: so(l1), s: so(l2) } }; }),
    [MS.map((m) => { const [l1, l2] = eig(m); return `${hien(m)}: λ² − ${m[0][0] + m[1][1]}λ + ${m[0][0] * m[1][1] - m[0][1] * m[1][0]} = 0 ⇒ ${l1}, ${l2}`; }).join('; ') + '. Check: λ₁ + λ₂ = trace, λ₁λ₂ = det.', MS.map((m) => { const [l1, l2] = eig(m); return `${hien(m)}: λ² − ${m[0][0] + m[1][1]}λ + ${m[0][0] * m[1][1] - m[0][1] * m[1][0]} = 0 ⇒ ${l1}, ${l2}`; }).join('; ') + '. Kiểm: λ₁ + λ₂ = vết, λ₁λ₂ = định thức.'])],
  goiY: ['λ² − (trace)λ + det = 0.', 'A diagonal matrix shows its eigenvalues.'],
  loiHayGap: ['Sign error: the middle term is −(trace)·λ.', 'Reading the off-diagonal entries as eigenvalues.'],
  thuatNgu: [tn('trace', 'vết')],
  khaiNiem: ['2 × 2 eigenvalues'],
});

export default doiDau({
  slug: 'mae101-7-2-cheo-hoa',
  ten: '7.2 Eigenvalues & diagonalization',
  khoa: KHOA,
  baiHoc: 'mae101-7-2-cheo-hoa',
  de: [E1, E2],
});
