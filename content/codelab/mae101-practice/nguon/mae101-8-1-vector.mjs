/** MAE101 · 8.1 — Vectors in R² and R³: length, dot product, angle, cross product (bài mae101-8-1-vector). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Vectors 1 — Dot and cross product',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on vectors.</p>', '<p>Câu hỏi khái niệm về vector.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['u · v = 0 (both non-zero) means u and v are …', 'u · v = 0 (cả hai khác 0) nghĩa là u và v …'], ['perpendicular (orthogonal)', 'parallel', 'equal', 'of equal length'], ['u · v = |u||v|cos θ, so cos θ = 0 ⇒ θ = 90°.', 'u · v = |u||v|cos θ, nên cos θ = 0 ⇒ θ = 90°.']),
    q('c2', ['The dot product of two vectors is …', 'Tích vô hướng của hai vector là …'], ['a number', 'a vector', 'a matrix', 'an angle'], ['The cross product (in R³) is the one that gives a vector.', 'Tích có hướng (trong R³) mới cho ra vector.']),
    q('c3', ['u × v is …', 'u × v là …'], ['perpendicular to both u and v', 'parallel to u', 'equal to v × u', 'a number'], ['Its direction follows the right-hand rule, its length is the area of the parallelogram, and v × u = −(u × v).', 'Hướng theo quy tắc bàn tay phải, độ dài là diện tích hình bình hành, và v × u = −(u × v).']),
    q('c4', ['|u| for u = (3, 4) is …', '|u| với u = (3, 4) là …'], ['5', '7', '25', '12'], ['√(3² + 4²) = √25 = 5.', '√(3² + 4²) = √25 = 5.']),
    q('c5', ['The projection of u onto v has length …', 'Hình chiếu của u lên v có độ dài …'], ['|u · v| / |v|', 'u · v', '|u| · |v|', '|u × v|'], ['proj_v u = (u · v / |v|²) v; its length is |u · v| / |v|.', 'proj_v u = (u · v / |v|²) v; độ dài của nó là |u · v| / |v|.']),
  ],
  goiY: ['Dot → number, cross → vector.', 'Zero dot product ⇔ right angle.'],
  loiHayGap: ['Treating u × v = v × u.', 'Forgetting the square root in the length.'],
  thuatNgu: [tn('dot product', 'tích vô hướng'), tn('cross product', 'tích có hướng'), tn('orthogonal', 'trực giao')],
  khaiNiem: ['vectors'],
});

const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const len = (a) => Math.sqrt(dot(a, a));
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const PAIRS = [[[1, 2, 2], [2, 0, 1]], [[3, 0, 4], [0, 5, 0]], [[1, 1, 0], [1, 0, 1]], [[2, -1, 3], [1, 4, -2]]];
const v = (a) => '(' + a.join(', ').replace(/-/g, '−') + ')';
const E2 = tinh({
  tieuDe: 'Vectors 2 — Compute u · v, |u|, u × v and the angle',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>For each pair give u · v, |u| (2 decimals), the components of u × v, and the angle between u and v in degrees (2 decimals).</p>', '<p>Với mỗi cặp cho u · v, |u| (2 chữ số thập phân), các thành phần của u × v, và góc giữa u và v theo độ (2 chữ số thập phân).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Vector computations', 'Tính toán vector'], [{ ma: 'p', ten: 'u ; v' }, { ma: 'd', ten: 'u · v' }, { ma: 'n', ten: '|u|' }, { ma: 'x', ten: '(u × v)₁' }, { ma: 'y', ten: '(u × v)₂' }, { ma: 'z', ten: '(u × v)₃' }, { ma: 'g', ten: 'angle (°)' }],
    PAIRS.map(([a, b]) => { const c = cross(a, b); const ang = (Math.acos(dot(a, b) / (len(a) * len(b))) * 180) / Math.PI; return { o: { p: v(a) + ' ; ' + v(b) }, a: { d: so(dot(a, b)), n: so(len(a)), x: so(c[0]), y: so(c[1]), z: so(c[2]), g: so(ang) } }; }),
    [PAIRS.map(([a, b]) => { const c = cross(a, b); const ang = (Math.acos(dot(a, b) / (len(a) * len(b))) * 180) / Math.PI; return `${v(a)}·${v(b)} = ${dot(a, b)}, |u| = ${len(a).toFixed(2)}, u × v = ${v(c)}, θ = ${ang.toFixed(2)}°`; }).join('; ') + '. cos θ = u · v / (|u||v|).', PAIRS.map(([a, b]) => { const c = cross(a, b); const ang = (Math.acos(dot(a, b) / (len(a) * len(b))) * 180) / Math.PI; return `${v(a)}·${v(b)} = ${dot(a, b)}, |u| = ${len(a).toFixed(2)}, u × v = ${v(c)}, θ = ${ang.toFixed(2)}°`; }).join('; ') + '. cos θ = u · v / (|u||v|).'])],
  goiY: ['Cross product: (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁).', 'θ = arccos(u · v / (|u||v|)).'],
  loiHayGap: ['Sign of the middle component of u × v.', 'Giving the angle in radians.'],
  thuatNgu: [],
  khaiNiem: ['dot', 'cross', 'angle'],
});

export default doiDau({
  slug: 'mae101-8-1-vector',
  ten: '8.1 Vectors in R² and R³',
  khoa: KHOA,
  baiHoc: 'mae101-8-1-vector',
  de: [E1, E2],
});
