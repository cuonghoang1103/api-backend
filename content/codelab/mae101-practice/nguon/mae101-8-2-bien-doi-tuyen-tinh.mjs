/** MAE101 · 8.2 — A matrix is a transformation: rotation, scaling, reflection, composition (bài mae101-8-2-bien-doi-tuyen-tinh). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Transformations 1 — What makes a map linear',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on linear transformations.</p>', '<p>Câu hỏi khái niệm về biến đổi tuyến tính.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['T is linear when …', 'T là tuyến tính khi …'], ['T(u + v) = T(u) + T(v) and T(kv) = kT(v)', 'T(0) = 1', 'T maps lines to circles', 'T(u·v) = T(u)·T(v)'], ['Additivity and homogeneity; together they force T(0) = 0.', 'Tính cộng và tính thuần nhất; hai tính chất này buộc T(0) = 0.']),
    q('c2', ['Column j of the matrix of T is …', 'Cột j của ma trận của T là …'], ['T(eⱼ), the image of the j-th unit vector', 'the j-th row of T', 'T applied to the zero vector', 'the eigenvector of T'], ['A = [T(e₁) | T(e₂) | …] — build the matrix from where the basis lands.', 'A = [T(e₁) | T(e₂) | …] — dựng ma trận từ nơi các vector cơ sở rơi vào.']),
    q('c3', ['"Do B, then A" is the single matrix …', '"Làm B, rồi làm A" là ma trận …'], ['AB', 'BA', 'A + B', 'A⁻¹B'], ['Matrices act on the vector on their right: A(Bv) = (AB)v — read right to left.', 'Ma trận tác động lên vector ở bên phải: A(Bv) = (AB)v — đọc từ phải sang trái.']),
    q('c4', ['Why can a 2 × 2 matrix not translate points of the plane?', 'Vì sao ma trận 2 × 2 không tịnh tiến được các điểm trên mặt phẳng?'], ['A linear map always sends 0 to 0', 'Its determinant is always 1', 'Translation needs complex numbers', 'It can, with the right entries'], ['T(0) = 0, so the origin cannot move; graphics adds a coordinate (homogeneous coordinates) and uses 3 × 3 matrices.', 'T(0) = 0 nên gốc toạ độ không di chuyển được; đồ hoạ thêm một toạ độ (toạ độ thuần nhất) và dùng ma trận 3 × 3.']),
    q('c5', ['[−1 0; 0 1] reflects the plane across …', '[−1 0; 0 1] lấy đối xứng mặt phẳng qua …'], ['the y-axis', 'the x-axis', 'the line y = x', 'the origin'], ['(x, y) ↦ (−x, y): x changes sign, so the mirror is the y-axis.', '(x, y) ↦ (−x, y): x đổi dấu, nên gương là trục y.']),
  ],
  goiY: ['Linear ⇒ T(0) = 0.', 'Composition reads right to left.'],
  loiHayGap: ['Writing BA for "B then A".', 'Building the matrix with images as rows.'],
  thuatNgu: [tn('linear transformation', 'biến đổi tuyến tính'), tn('composition', 'hợp thành'), tn('homogeneous coordinates', 'toạ độ thuần nhất')],
  khaiNiem: ['linear maps'],
});

const apply = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];
const mul = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
const R = [[0, -1], [1, 0]], S = [[2, 0], [0, 2]], F = [[-1, 0], [0, 1]], H = [[1, 1], [0, 1]];
const ROWS = [
  ['R (rotate 90°) · (2, 0)', R, [2, 0]],
  ['S (scale 2) · (1, 3)', S, [1, 3]],
  ['F (reflect in y-axis) · (4, −1)', F, [4, -1]],
  ['H (shear) · (2, 3)', H, [2, 3]],
  ['R·S (scale, then rotate) · (1, 0)', mul(R, S), [1, 0]],
  ['S·F·R · (0, 1)', mul(S, mul(F, R)), [0, 1]],
];
const E2 = tinh({
  tieuDe: 'Transformations 2 — Apply and compose',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>R = [0 −1; 1 0], S = [2 0; 0 2], F = [−1 0; 0 1], H = [1 1; 0 1]. Give the image of each point.</p>', '<p>R = [0 −1; 1 0], S = [2 0; 0 2], F = [−1 0; 0 1], H = [1 1; 0 1]. Cho ảnh của mỗi điểm.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Images', 'Ảnh'], [{ ma: 't', ten: 'Transformation · point' }, { ma: 'x', ten: 'x′' }, { ma: 'y', ten: 'y′' }],
    ROWS.map(([t, M, p]) => { const [x, y] = apply(M, p); return { o: { t }, a: { x: so(x), y: so(y) } }; }),
    [ROWS.map(([t, M, p]) => { const r = apply(M, p); return `${t} = (${r.join(', ')})`; }).join('; ') + '. The rightmost matrix acts first.', ROWS.map(([t, M, p]) => { const r = apply(M, p); return `${t} = (${r.join(', ')})`; }).join('; ') + '. Ma trận bên phải nhất tác động trước.'])],
  goiY: ['Row of the matrix · the point gives each coordinate.', 'For a product, apply the rightmost first.'],
  loiHayGap: ['Applying the left matrix first.', 'Sign of the rotation (counter-clockwise is positive).'],
  thuatNgu: [tn('shear', 'phép trượt')],
  khaiNiem: ['applying transformations'],
});

export default doiDau({
  slug: 'mae101-8-2-bien-doi-tuyen-tinh',
  ten: '8.2 Linear transformations',
  khoa: KHOA,
  baiHoc: 'mae101-8-2-bien-doi-tuyen-tinh',
  de: [E1, E2],
});
