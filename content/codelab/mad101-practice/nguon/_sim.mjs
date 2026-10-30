/**
 * MAD101 practice — BỘ TÍNH dùng để sinh số trong đề (không tính nhẩm). Mỗi hàm TỰ CHỨA (không gọi hàm khác của tệp)
 * để dùng luôn làm "lời giải" (dat(fn,'tên')). Kiểm với ví dụ sách (Rosen): node _kiem-sim.mjs
 */

/* ═════════ Chương 1 · logic ═════════ */
/** Đánh giá công thức AST: ['var','p'] ['not',A] ['and',A,B] ['or',A,B] ['xor',A,B] ['imp',A,B] ['iff',A,B] ['T'] ['F']. */
export function evalF(f, env) {
  switch (f[0]) {
    case 'var': return !!env[f[1]];
    case 'T': return true;
    case 'F': return false;
    case 'not': return !evalF(f[1], env);
    case 'and': return evalF(f[1], env) && evalF(f[2], env);
    case 'or': return evalF(f[1], env) || evalF(f[2], env);
    case 'xor': return evalF(f[1], env) !== evalF(f[2], env);
    case 'imp': return !evalF(f[1], env) || evalF(f[2], env);
    case 'iff': return evalF(f[1], env) === evalF(f[2], env);
    default: throw new Error('toán tử lạ ' + f[0]);
  }
}
/** Tên biến (đã sắp) xuất hiện trong công thức. */
export function varsOf(f) {
  var s = {};
  (function w(x) { if (x[0] === 'var') s[x[1]] = 1; else for (var i = 1; i < x.length; i++) if (Array.isArray(x[i])) w(x[i]); })(f);
  return Object.keys(s).sort();
}
/** Cột chân trị của công thức (hàng theo thứ tự TTT, TTF, … với T đứng trước), trả mảng 'T'/'F'. */
export function column(f) {
  var vs = varsOf(f), n = vs.length, out = [];
  for (var m = 0; m < (1 << n); m++) {
    var env = {};
    for (var i = 0; i < n; i++) env[vs[i]] = ((m >> (n - 1 - i)) & 1) === 0;
    out.push(evalF(f, env) ? 'T' : 'F');
  }
  return out;
}
/** 'tautology' | 'contradiction' | 'contingent'. */
export function classify(f) {
  var c = column(f), t = c.filter(function (x) { return x === 'T'; }).length;
  return t === c.length ? 'tautology' : t === 0 ? 'contradiction' : 'contingent';
}
/** Hai công thức tương đương (cùng tập biến)? */
export function equiv(f, g) {
  var vs = varsOf(['and', f, g]), n = vs.length;
  for (var m = 0; m < (1 << n); m++) {
    var env = {};
    for (var i = 0; i < n; i++) env[vs[i]] = ((m >> i) & 1) === 1;
    if (evalF(f, env) !== evalF(g, env)) return false;
  }
  return true;
}
/** Hệ quả: premises ⊨ conclusion? */
export function entails(premises, conclusion) {
  var all = premises.concat([conclusion]), s = {};
  all.forEach(function (f) { varsOf(f).forEach(function (v) { s[v] = 1; }); });
  var vs = Object.keys(s).sort(), n = vs.length;
  for (var m = 0; m < (1 << n); m++) {
    var env = {};
    for (var i = 0; i < n; i++) env[vs[i]] = ((m >> i) & 1) === 1;
    var ok = true;
    for (var k = 0; k < premises.length; k++) if (!evalF(premises[k], env)) ok = false;
    if (ok && !evalF(conclusion, env)) return false;
  }
  return true;
}
/** Hiển thị công thức dạng chữ (ký hiệu Unicode, ngoặc đầy đủ cho nhị phân). */
export function show(f, top) {
  var sym = { and: ' ∧ ', or: ' ∨ ', xor: ' ⊕ ', imp: ' → ', iff: ' ↔ ' };
  if (f[0] === 'var') return f[1];
  if (f[0] === 'T') return 'T';
  if (f[0] === 'F') return 'F';
  if (f[0] === 'not') return '¬' + show(f[1], false);
  var s = show(f[1], false) + sym[f[0]] + show(f[2], false);
  return top ? s : '(' + s + ')';
}
/** Số hàng chân trị = 2^n ; số công thức khác nhau theo bảng chân trị = 2^(2^n). */
export function rows(n) { return Math.pow(2, n); }
/** Vị từ trên miền hữu hạn: ∀ và ∃. */
export function forall(domain, p) { for (var i = 0; i < domain.length; i++) if (!p(domain[i])) return false; return true; }
export function exists(domain, p) { for (var i = 0; i < domain.length; i++) if (p(domain[i])) return true; return false; }

/* ═════════ Chương 2 · tập hợp, hàm, quan hệ, ma trận ═════════ */
export function setOp(op, A, B) {
  var a = A.slice().sort(function (x, y) { return x - y; }), r = [];
  if (op === 'union') r = A.concat(B.filter(function (x) { return A.indexOf(x) < 0; }));
  if (op === 'inter') r = A.filter(function (x) { return B.indexOf(x) >= 0; });
  if (op === 'diff') r = A.filter(function (x) { return B.indexOf(x) < 0; });
  if (op === 'symdiff') r = A.filter(function (x) { return B.indexOf(x) < 0; }).concat(B.filter(function (x) { return A.indexOf(x) < 0; }));
  void a;
  return r.slice().sort(function (x, y) { return x - y; });
}
/** Chuỗi bit của tập S trong vũ trụ U (U đã sắp). */
export function bits(U, S) { return U.map(function (x) { return S.indexOf(x) >= 0 ? '1' : '0'; }).join(''); }
/** Các tập con (theo thứ tự bit), mỗi tập là mảng. */
export function powerSet(A) {
  var out = [];
  for (var m = 0; m < (1 << A.length); m++) { var s = []; for (var i = 0; i < A.length; i++) if (m & (1 << i)) s.push(A[i]); out.push(s); }
  return out;
}
/** |A∪B∪C| bằng bao hàm–loại trừ từ các đại lượng cho trước. */
export function incExc3(a, b, c, ab, ac, bc, abc) { return a + b + c - ab - ac - bc + abc; }
export function incExc2(a, b, ab) { return a + b - ab; }
/** Tích Descartes kích thước và số quan hệ. */
export function numRelations(m, n) { return Math.pow(2, m * n); }
/** Số hàm A→B, đơn ánh, toàn ánh (|A|=m, |B|=n). */
export function numFunctions(m, n) { return Math.pow(n, m); }
export function numInjective(m, n) { var r = 1; for (var i = 0; i < m; i++) r *= (n - i); return r < 0 ? 0 : (m > n ? 0 : r); }
export function numSurjective(m, n) {
  var tot = 0;
  for (var i = 0; i <= n; i++) {
    var c = 1;
    for (var j = 1; j <= i; j++) c = c * (n - j + 1) / j;
    tot += (i % 2 ? -1 : 1) * Math.round(c) * Math.pow(n - i, m);
  }
  return tot;
}
/** Tính chất hàm hữu hạn cho bởi mảng ảnh (f[i] = ảnh của i) với miền 0..n-1 và đích 0..m-1. */
export function funcProps(f, m) {
  var seen = {}, inj = true, i;
  for (i = 0; i < f.length; i++) { if (seen[f[i]]) inj = false; seen[f[i]] = 1; }
  var sur = true;
  for (i = 0; i < m; i++) if (!seen[i]) sur = false;
  return { injective: inj, surjective: sur, bijective: inj && sur };
}
/** Hợp hàm (g∘f)(i) = g[f[i]]. */
export function compose(g, f) { return f.map(function (x) { return g[x]; }); }
/** Tính chất quan hệ R (cặp [a,b]) trên tập A. */
export function relProps(A, R) {
  var has = function (a, b) { return R.some(function (p) { return p[0] === a && p[1] === b; }); };
  var refl = A.every(function (a) { return has(a, a); });
  var irrefl = A.every(function (a) { return !has(a, a); });
  var sym = R.every(function (p) { return has(p[1], p[0]); });
  var anti = R.every(function (p) { return p[0] === p[1] || !has(p[1], p[0]); });
  var trans = R.every(function (p) { return R.every(function (q) { return p[1] !== q[0] || has(p[0], q[1]); }); });
  return { reflexive: refl, irreflexive: irrefl, symmetric: sym, antisymmetric: anti, transitive: trans, equivalence: refl && sym && trans, partialOrder: refl && anti && trans };
}
/** Bao đóng bắc cầu (Warshall) của R trên phần tử 0..n-1, trả danh sách cặp đã sắp. */
export function transClosure(n, R) {
  var m = [], i, j, k;
  for (i = 0; i < n; i++) { m.push([]); for (j = 0; j < n; j++) m[i].push(false); }
  R.forEach(function (p) { m[p[0]][p[1]] = true; });
  for (k = 0; k < n; k++) for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (m[i][k] && m[k][j]) m[i][j] = true;
  var out = [];
  for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (m[i][j]) out.push([i, j]);
  return out;
}
/** Bao đóng phản xạ / đối xứng, trả số cặp. */
export function closureCount(n, R, kind) {
  var set = {};
  R.forEach(function (p) { set[p[0] + ',' + p[1]] = 1; });
  var i;
  if (kind === 'refl') for (i = 0; i < n; i++) set[i + ',' + i] = 1;
  if (kind === 'sym') R.forEach(function (p) { set[p[1] + ',' + p[0]] = 1; });
  return Object.keys(set).length;
}
/** Số lớp tương đương của quan hệ đồng dư mod m trên {0..n-1} và kích thước các lớp. */
export function modClasses(n, m) {
  var c = [];
  for (var r = 0; r < m; r++) { var s = 0; for (var x = 0; x < n; x++) if (x % m === r) s++; if (s) c.push(s); }
  return c;
}
/** Tích ma trận số nguyên. */
export function matMul(A, B) {
  var n = A.length, m = B[0].length, k = B.length, C = [], i, j, t;
  for (i = 0; i < n; i++) { C.push([]); for (j = 0; j < m; j++) { var s = 0; for (t = 0; t < k; t++) s += A[i][t] * B[t][j]; C[i].push(s); } }
  return C;
}
/** Tích Boole (∨,∧) của ma trận 0/1. */
export function boolMul(A, B) {
  var n = A.length, m = B[0].length, k = B.length, C = [], i, j, t;
  for (i = 0; i < n; i++) { C.push([]); for (j = 0; j < m; j++) { var s = 0; for (t = 0; t < k; t++) if (A[i][t] && B[t][j]) s = 1; C[i].push(s); } }
  return C;
}
export function matPow(A, e) {
  var n = A.length, R = [], i, j, k;
  for (i = 0; i < n; i++) { R.push([]); for (j = 0; j < n; j++) R[i].push(i === j ? 1 : 0); }
  for (var t = 0; t < e; t++) {
    var C = [];
    for (i = 0; i < n; i++) { C.push([]); for (j = 0; j < n; j++) { var s = 0; for (k = 0; k < n; k++) s += R[i][k] * A[k][j]; C[i].push(s); } }
    R = C;
  }
  return R;
}
export function transpose(A) { return A[0].map(function (_, j) { return A.map(function (r) { return r[j]; }); }); }
/** Tổng thường gặp. */
export function sumArith(a, d, n) { return n * (2 * a + (n - 1) * d) / 2; }
export function sumGeom(a, r, n) { var s = 0, t = a; for (var i = 0; i < n; i++) { s += t; t *= r; } return s; }
export function sumPow(k, n) { var s = 0; for (var i = 1; i <= n; i++) s += Math.pow(i, k); return s; }
export function seqTerm(rule, n) { return rule(n); }
export function floorDiv(a, b) { return Math.floor(a / b); }
export function ceilDiv(a, b) { return Math.ceil(a / b); }
/** Phần dư không âm a mod m (m>0), kể cả a âm. */
export function mod(a, m) { return ((a % m) + m) % m; }

/* ═════════ Chương 3 · độ phức tạp ═════════ */
/** Số phép gán/lần lặp của các mẫu vòng lặp điển hình (đếm bằng cách CHẠY). */
export function loopCount(kind, n) {
  var c = 0, i, j;
  if (kind === 'single') { for (i = 0; i < n; i++) c++; }
  if (kind === 'double') { for (i = 0; i < n; i++) for (j = 0; j < n; j++) c++; }
  if (kind === 'triangle') { for (i = 0; i < n; i++) for (j = 0; j < i; j++) c++; }
  if (kind === 'doubling') { for (i = 1; i < n; i *= 2) c++; }
  if (kind === 'n-log-n') { for (i = 0; i < n; i++) for (j = 1; j < n; j *= 2) c++; }
  if (kind === 'halving-sum') { for (i = n; i >= 1; i = Math.floor(i / 2)) for (j = 0; j < i; j++) c++; }
  if (kind === 'triple') { for (i = 0; i < n; i++) for (j = 0; j < n; j++) for (var k = 0; k < n; k++) c++; }
  if (kind === 'sqrt') { for (i = 1; i * i <= n; i++) c++; }
  return c;
}
/** Số phép so sánh tối đa: tìm tuyến tính / nhị phân (mảng n phần tử). */
export function searchCost(kind, n) {
  if (kind === 'linear') return n;
  var c = 0, lo = 0, hi = n - 1;
  while (lo <= hi) { c++; var mid = Math.floor((lo + hi) / 2); lo = mid + 1; }
  return c; // tìm phần tử cuối: số lần so sánh tối đa ≈ ⌊log2 n⌋ + 1
}
/** n nhỏ nhất để f(n) > g(n) (so sánh tốc độ tăng) trong [1, giới hạn]. */
export function crossover(f, g, limit) { for (var n = 1; n <= limit; n++) if (f(n) > g(n)) return n; return -1; }
/** Số lần so sánh của sắp xếp nổi bọt (luôn n(n−1)/2) và chèn (xấu nhất, tốt nhất). */
export function sortCost(kind, n) {
  if (kind === 'bubble') return n * (n - 1) / 2;
  if (kind === 'insertion-worst') return n * (n - 1) / 2;
  if (kind === 'insertion-best') return n - 1;
  return 0;
}
/** Số lần so sánh mà sắp xếp chèn thực sự dùng trên mảng a. */
export function insertionComparisons(a) {
  var arr = a.slice(), c = 0;
  for (var i = 1; i < arr.length; i++) {
    var key = arr[i], j = i - 1;
    while (j >= 0) { c++; if (arr[j] > key) { arr[j + 1] = arr[j]; j--; } else break; }
    arr[j + 1] = key;
  }
  return c;
}
/** Số lần so sánh của sắp xếp nổi bọt tối ưu (dừng sớm) trên mảng a. */
export function bubbleComparisons(a) {
  var arr = a.slice(), c = 0, swapped = true, n = arr.length;
  while (swapped) {
    swapped = false;
    for (var i = 0; i + 1 < n; i++) { c++; if (arr[i] > arr[i + 1]) { var t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t; swapped = true; } }
    n--;
  }
  return c;
}

/* ═════════ Chương 4 · số học ═════════ */
export function gcdSteps(a, b) {
  var st = [];
  while (b !== 0) { var q = Math.floor(a / b), r = a % b; st.push([a, b, q, r]); a = b; b = r; }
  return { gcd: a, steps: st };
}
export function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
export function lcm(a, b) { var x = Math.abs(a), y = Math.abs(b), t; while (y) { t = x % y; x = y; y = t; } return Math.abs(a * b) / x; }
/** Euclid mở rộng: g = a·x + b·y. */
export function extGcd(a, b) {
  var x0 = 1, y0 = 0, x1 = 0, y1 = 1;
  while (b !== 0) {
    var q = Math.floor(a / b), t = a - q * b; a = b; b = t;
    t = x0 - q * x1; x0 = x1; x1 = t;
    t = y0 - q * y1; y0 = y1; y1 = t;
  }
  return { g: a, x: x0, y: y0 };
}
export function modPow(base, exp, m) {
  var r = 1n, b = BigInt(base) % BigInt(m), e = BigInt(exp), M = BigInt(m);
  if (b < 0n) b += M;
  while (e > 0n) { if (e & 1n) r = r * b % M; b = b * b % M; e >>= 1n; }
  return Number(r % M);
}
export function modInverse(a, m) {
  var x0 = 1, x1 = 0, aa = ((a % m) + m) % m, mm = m;
  while (mm !== 0) { var q = Math.floor(aa / mm), t = aa - q * mm; aa = mm; mm = t; t = x0 - q * x1; x0 = x1; x1 = t; }
  return aa === 1 ? ((x0 % m) + m) % m : null;
}
/** Nghiệm của a·x ≡ b (mod m) trong [0,m). */
export function solveCong(a, b, m) {
  var out = [];
  for (var x = 0; x < m; x++) if ((((a * x - b) % m) + m) % m === 0) out.push(x);
  return out;
}
/** Định lý số dư Trung Hoa: x ≡ r_i (mod m_i), các m_i nguyên tố cùng nhau ⇒ x trong [0, M). */
export function crt(rs, ms) {
  var M = 1, i;
  for (i = 0; i < ms.length; i++) M *= ms[i];
  var x = 0;
  for (i = 0; i < ms.length; i++) {
    var Mi = M / ms[i], aa = ((Mi % ms[i]) + ms[i]) % ms[i], inv = null;
    for (var t = 1; t < ms[i]; t++) if ((aa * t) % ms[i] === 1) { inv = t; break; }
    if (ms[i] === 1) inv = 0;
    x += rs[i] * Mi * inv;
  }
  return ((x % M) + M) % M;
}
/** Sàng Eratosthenes: danh sách số nguyên tố ≤ n. */
export function sieve(n) {
  var is = [], p, k, out = [];
  for (p = 0; p <= n; p++) is.push(p >= 2);
  for (p = 2; p * p <= n; p++) if (is[p]) for (k = p * p; k <= n; k += p) is[k] = false;
  for (p = 2; p <= n; p++) if (is[p]) out.push(p);
  return out;
}
/** Các số nguyên tố p mà sàng thực sự dùng để gạch (p² ≤ n). */
export function sieveSievers(n) {
  var out = [], ps = [], p, k, is = [];
  for (p = 0; p <= n; p++) is.push(p >= 2);
  for (p = 2; p * p <= n; p++) if (is[p]) { out.push(p); for (k = p * p; k <= n; k += p) is[k] = false; }
  void ps;
  return out;
}
export function isPrime(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
export function factor(n) {
  var out = [], d = 2;
  while (d * d <= n) { var e = 0; while (n % d === 0) { n /= d; e++; } if (e) out.push([d, e]); d++; }
  if (n > 1) out.push([n, 1]);
  return out;
}
export function phi(n) { var r = n, d = 2, m = n; while (d * d <= m) { if (m % d === 0) { while (m % d === 0) m /= d; r -= r / d; } d++; } if (m > 1) r -= r / m; return r; }
export function numDivisors(n) { var f = factor(n), r = 1; f.forEach(function (p) { r *= p[1] + 1; }); return r; }
export function sumDivisors(n) { var s = 0; for (var d = 1; d <= n; d++) if (n % d === 0) s += d; return s; }
export function toBase(n, b) { if (n === 0) return '0'; var d = '0123456789ABCDEF', s = ''; var neg = n < 0; n = Math.abs(n); while (n > 0) { s = d[n % b] + s; n = Math.floor(n / b); } return (neg ? '-' : '') + s; }
export function fromBase(s, b) { var d = '0123456789ABCDEF', v = 0; for (var i = 0; i < s.length; i++) v = v * b + d.indexOf(s[i].toUpperCase()); return v; }
/** Số lần chia của Euclid (số hàng trong bảng) cho cặp (a,b). */
export function euclidSteps(a, b) { var c = 0; while (b !== 0) { var t = a % b; a = b; b = t; c++; } return c; }
/** Chữ số kiểm tra ISBN-10 (cho 9 chữ số đầu). */
export function isbn10Check(d9) {
  var s = 0;
  for (var i = 0; i < 9; i++) s += (10 - i) * Number(d9[i]);
  var c = (11 - (s % 11)) % 11;
  return c === 10 ? 'X' : String(c);
}
/** Caesar: dịch chữ in hoa k vị trí. */
export function caesar(text, k) {
  return text.split('').map(function (ch) {
    var c = ch.charCodeAt(0);
    return c >= 65 && c <= 90 ? String.fromCharCode(((c - 65 + k) % 26 + 26) % 26 + 65) : ch;
  }).join('');
}
/** Sinh khoá RSA nhỏ từ p,q,e: trả {n, phi, d}. */
export function rsaKey(p, q, e) {
  var n = p * q, ph = (p - 1) * (q - 1), d = null;
  for (var t = 1; t < ph; t++) if ((e * t) % ph === 1) { d = t; break; }
  return { n: n, phi: ph, d: d };
}

/* ═════════ Chương 5 · quy nạp & đệ quy ═════════ */
/** Dãy truy hồi tuyến tính hệ số hằng: a_n = c[0]·a_{n−1} + c[1]·a_{n−2} + … (+ g(n)), init = a_0.. */
export function recurrence(c, init, n, g) {
  var a = init.slice();
  while (a.length <= n) { var i = a.length, s = 0; for (var k = 0; k < c.length; k++) s += c[k] * (i - 1 - k >= 0 ? a[i - 1 - k] : 0); if (g) s += g(i); a.push(s); }
  return a[n];
}
export function fib(n) { var a = 0, b = 1; for (var i = 0; i < n; i++) { var t = a + b; a = b; b = t; } return a; }
export function hanoiMoves(n) { return Math.pow(2, n) - 1; }
export function factorial(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
/** Số lần gọi đệ quy của fib(n) ngây thơ (gồm cả lời gọi gốc). */
export function fibCalls(n) { var c = 0; (function f(k) { c++; if (k > 1) { f(k - 1); f(k - 2); } })(n); return c; }
/** Nghiệm đặc trưng a_n = c1·a_{n−1} + c2·a_{n−2}: biệt thức Δ = c1² + 4·c2. */
export function charDiscriminant(c1, c2) { return c1 * c1 + 4 * c2; }
export function charRoots(c1, c2) {
  var d = c1 * c1 + 4 * c2;
  if (d < 0) return null;
  var s = Math.sqrt(d);
  return [(c1 + s) / 2, (c1 - s) / 2];
}
/** Số xâu nhị phân độ dài n không có hai số 0 liền nhau (đếm bằng vét cạn). */
export function noTwoZeros(n) {
  var c = 0;
  for (var m = 0; m < (1 << n); m++) { var ok = true; for (var i = 0; i + 1 < n; i++) if (!((m >> i) & 1) && !((m >> (i + 1)) & 1)) ok = false; if (ok) c++; }
  return c;
}
/** Số cách lát hình chữ nhật 2×n bằng domino 2×1. */
export function dominoTilings(n) { return fib(n + 1); }
/** Số cách leo n bậc, mỗi lần 1, 2 hoặc 3 bậc. */
export function climb3(n) { var a = [1, 1, 2]; for (var i = 3; i <= n; i++) a.push(a[i - 1] + a[i - 2] + a[i - 3]); return a[n]; }
/** Kết quả hàm đệ quy mẫu f(0)=2, f(n)=3 f(n−1)+1. */
export function fRec(n) { var v = 2; for (var i = 1; i <= n; i++) v = 3 * v + 1; return v; }
/** Số xâu nhị phân thuộc tập định nghĩa đệ quy: λ ∈ S; x ∈ S ⇒ 0x1, 1x0 ∈ S… (độ dài n). Không dùng — thay bằng 2^k. */
export function ackermann(m, n) { if (m === 0) return n + 1; if (n === 0) return ackermann(m - 1, 1); return ackermann(m - 1, ackermann(m, n - 1)); }
/** Tổng ước chung bằng chia để trị: T(n) = 2T(n/2) + n, T(1) = 1 với n = 2^k. */
export function masterTwoHalves(k) { var t = 1; for (var i = 1; i <= k; i++) t = 2 * t + Math.pow(2, i); return t; }

/* ═════════ Chương 6 · đếm ═════════ */
export function nPr(n, r) { var v = 1; for (var i = 0; i < r; i++) v *= (n - i); return r > n ? 0 : v; }
export function nCr(n, r) { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); var v = 1; for (var i = 1; i <= r; i++) v = v * (n - r + i) / i; return Math.round(v); }
export function multinomial(counts) { var n = 0, i; for (i = 0; i < counts.length; i++) n += counts[i]; var v = 1, rem = n; for (i = 0; i < counts.length; i++) { var c = 1; var r = Math.min(counts[i], rem - counts[i]); for (var j = 1; j <= r; j++) c = c * (rem - r + j) / j; v *= Math.round(c); rem -= counts[i]; } return v; }
/** Số nghiệm nguyên không âm của x1+…+xk = n. */
export function starsBars(n, k) { return nCr(n + k - 1, k - 1); }
export function derangements(n) { var a = 1, b = 0; if (n === 0) return 1; for (var i = 2; i <= n; i++) { var t = (i - 1) * (a + b); a = b; b = t; } return b; }
export function catalan(n) { return nCr(2 * n, n) / (n + 1); }
/** Hệ số của x^k trong (x + y)^n tại hệ số của x^k y^(n−k) với x→a, y→b: C(n,k) a^k b^(n−k). */
export function binomTerm(n, k, a, b) { return nCr(n, k) * Math.pow(a, k) * Math.pow(b, n - k); }
/** Nguyên lý chuồng bồ câu: số tối thiểu để chắc chắn có ít nhất k đồ vật cùng ngăn (n ngăn): n(k−1)+1. */
export function pigeon(boxes, k) { return boxes * (k - 1) + 1; }
/** Số cách xếp n người quanh bàn tròn. */
export function circular(n) { return factorial(n - 1); }
/** Số xâu độ dài n trên bảng chữ cái k ký tự không có hai ký tự giống nhau liền kề. */
export function noAdjacentSame(n, k) { return k * Math.pow(k - 1, n - 1); }
/** Số cách chọn r phần tử có lặp từ n loại. */
export function combWithRep(n, r) { return nCr(n + r - 1, r); }
/** Đếm số số nguyên trong [1,N] chia hết cho ít nhất một trong các số (bao hàm–loại trừ, các số tuỳ ý). */
export function countDivisibleByAny(N, ds) {
  var c = 0;
  for (var x = 1; x <= N; x++) for (var i = 0; i < ds.length; i++) if (x % ds[i] === 0) { c++; break; }
  return c;
}
/** Xác suất rời rạc: số kết quả thuận lợi / tổng, trả phân số tối giản [tử, mẫu]. */
export function fraction(a, b) { var x = a, y = b, t; while (y) { t = x % y; x = y; y = t; } return [a / x, b / x]; }
/** Số dãy nhị phân độ dài n có đúng k số 1 và không có hai số 1 liền nhau. */
export function noAdjOnes(n, k) { return k > Math.ceil(n / 2) ? 0 : nCr(n - k + 1, k); }
/** Đếm vét cạn số cách chọn 3 số trong 1..n có tổng chia hết cho 3. */
export function triplesDiv3(n) {
  var c = 0;
  for (var a = 1; a <= n; a++) for (var b = a + 1; b <= n; b++) for (var d = b + 1; d <= n; d++) if ((a + b + d) % 3 === 0) c++;
  return c;
}

/* ═════════ Chương 7 · đồ thị ═════════ */
/** Danh sách kề từ danh sách cạnh [u,v,w?] vô hướng (hoặc có hướng khi dir). Đỉnh sắp theo chữ. */
export function adjList(edges, dir) {
  var g = {};
  edges.forEach(function (e) { g[e[0]] = g[e[0]] || []; g[e[1]] = g[e[1]] || []; });
  edges.forEach(function (e) { g[e[0]].push(e[1]); if (!dir) g[e[1]].push(e[0]); });
  Object.keys(g).forEach(function (k) { g[k].sort(); });
  return g;
}
export function degrees(edges) {
  var d = {};
  edges.forEach(function (e) { d[e[0]] = (d[e[0]] || 0) + 1; d[e[1]] = (d[e[1]] || 0) + 1; });
  return d;
}
export function bfsOrder(edges, start, dir) {
  var g = {};
  edges.forEach(function (e) { g[e[0]] = g[e[0]] || []; g[e[1]] = g[e[1]] || []; });
  edges.forEach(function (e) { g[e[0]].push(e[1]); if (!dir) g[e[1]].push(e[0]); });
  Object.keys(g).forEach(function (k) { g[k].sort(); });
  var seen = {}, q = [start], out = [];
  seen[start] = 1;
  while (q.length) { var u = q.shift(); out.push(u); for (var i = 0; i < g[u].length; i++) { var v = g[u][i]; if (!seen[v]) { seen[v] = 1; q.push(v); } } }
  return out;
}
export function dfsOrder(edges, start, dir) {
  var g = {};
  edges.forEach(function (e) { g[e[0]] = g[e[0]] || []; g[e[1]] = g[e[1]] || []; });
  edges.forEach(function (e) { g[e[0]].push(e[1]); if (!dir) g[e[1]].push(e[0]); });
  Object.keys(g).forEach(function (k) { g[k].sort(); });
  var seen = {}, out = [];
  (function go(u) { seen[u] = 1; out.push(u); for (var i = 0; i < g[u].length; i++) if (!seen[g[u][i]]) go(g[u][i]); })(start);
  return out;
}
export function components(edges, vertices) {
  var parent = {};
  vertices.forEach(function (v) { parent[v] = v; });
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  edges.forEach(function (e) { parent[find(e[0])] = find(e[1]); });
  var roots = {};
  vertices.forEach(function (v) { roots[find(v)] = 1; });
  return Object.keys(roots).length;
}
/** 'circuit' (mọi bậc chẵn, liên thông) | 'path' (đúng 2 bậc lẻ) | 'none'. */
export function eulerType(edges, vertices) {
  var d = {};
  vertices.forEach(function (v) { d[v] = 0; });
  edges.forEach(function (e) { d[e[0]]++; d[e[1]]++; });
  var odd = vertices.filter(function (v) { return d[v] % 2; }).length;
  var parent = {};
  vertices.forEach(function (v) { parent[v] = v; });
  function find(x) { while (parent[x] !== x) x = parent[x]; return x; }
  edges.forEach(function (e) { parent[find(e[0])] = find(e[1]); });
  var active = vertices.filter(function (v) { return d[v] > 0; });
  var roots = {};
  active.forEach(function (v) { roots[find(v)] = 1; });
  if (Object.keys(roots).length > 1) return 'none';
  return odd === 0 ? 'circuit' : odd === 2 ? 'path' : 'none';
}
export function isBipartite(edges, vertices) {
  var g = {}, color = {};
  vertices.forEach(function (v) { g[v] = []; });
  edges.forEach(function (e) { g[e[0]].push(e[1]); g[e[1]].push(e[0]); });
  for (var s = 0; s < vertices.length; s++) {
    if (color[vertices[s]] !== undefined) continue;
    color[vertices[s]] = 0;
    var q = [vertices[s]];
    while (q.length) {
      var u = q.shift();
      for (var i = 0; i < g[u].length; i++) {
        var v = g[u][i];
        if (color[v] === undefined) { color[v] = 1 - color[u]; q.push(v); } else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}
/** Dijkstra: edges [u,v,w] vô hướng (hoặc có hướng khi dir). Trả { dist, prev, order } (order = thứ tự chốt đỉnh). */
export function dijkstra(edges, src, dir) {
  var g = {}, dist = {}, prev = {}, done = {}, order = [];
  edges.forEach(function (e) { g[e[0]] = g[e[0]] || []; g[e[1]] = g[e[1]] || []; });
  edges.forEach(function (e) { g[e[0]].push([e[1], e[2]]); if (!dir) g[e[1]].push([e[0], e[2]]); });
  Object.keys(g).forEach(function (v) { dist[v] = Infinity; });
  dist[src] = 0;
  for (;;) {
    var best = null;
    Object.keys(g).sort().forEach(function (v) { if (!done[v] && dist[v] < Infinity && (best === null || dist[v] < dist[best])) best = v; });
    if (best === null) break;
    done[best] = 1; order.push(best);
    g[best].forEach(function (p) { if (dist[best] + p[1] < dist[p[0]]) { dist[p[0]] = dist[best] + p[1]; prev[p[0]] = best; } });
  }
  return { dist: dist, prev: prev, order: order };
}
export function pathTo(prev, dst) { var p = [dst]; while (prev[p[0]] !== undefined) p.unshift(prev[p[0]]); return p; }
/** Ma trận kề từ cạnh vô hướng theo thứ tự đỉnh cho trước. */
export function adjMatrix(edges, vertices, dir) {
  var idx = {}, m = [];
  vertices.forEach(function (v, i) { idx[v] = i; m.push(vertices.map(function () { return 0; })); });
  edges.forEach(function (e) { m[idx[e[0]]][idx[e[1]]]++; if (!dir) m[idx[e[1]]][idx[e[0]]]++; });
  return m;
}
/** Số đường đi (walk) độ dài k từ i tới j = phần tử [i][j] của A^k. */
export function walks(A, k, i, j) {
  var n = A.length, R = [], a, b, c, t;
  for (a = 0; a < n; a++) { R.push([]); for (b = 0; b < n; b++) R[a].push(a === b ? 1 : 0); }
  for (t = 0; t < k; t++) { var C = []; for (a = 0; a < n; a++) { C.push([]); for (b = 0; b < n; b++) { var s = 0; for (c = 0; c < n; c++) s += R[a][c] * A[c][b]; C[a].push(s); } } R = C; }
  return R[i][j];
}
/** Công thức Euler cho đồ thị phẳng liên thông: v − e + f = 2 ⇒ f. */
export function planarFaces(v, e) { return 2 - v + e; }
/** Số cạnh của K_n, K_{m,n}, C_n, W_n (n đỉnh), Q_n. */
export function edgesOf(kind, a, b) {
  if (kind === 'K') return a * (a - 1) / 2;
  if (kind === 'Kmn') return a * b;
  if (kind === 'C') return a;
  if (kind === 'W') return 2 * (a - 1);
  if (kind === 'Q') return a * Math.pow(2, a - 1);
  return 0;
}
/** Sắp xếp tô pô (Kahn) với hàng đợi theo thứ tự chữ; trả null nếu có chu trình. */
export function topoSort(edges, vertices) {
  var indeg = {}, g = {}, out = [];
  vertices.forEach(function (v) { indeg[v] = 0; g[v] = []; });
  edges.forEach(function (e) { g[e[0]].push(e[1]); indeg[e[1]]++; });
  var ready = vertices.filter(function (v) { return indeg[v] === 0; }).sort();
  while (ready.length) {
    var u = ready.shift(); out.push(u);
    g[u].forEach(function (v) { indeg[v]--; if (indeg[v] === 0) { ready.push(v); ready.sort(); } });
  }
  return out.length === vertices.length ? out : null;
}

/* ═════════ Chương 8 · cây ═════════ */
/** Cây nhị phân dạng lồng nhau [giá trị, trái, phải] (null = rỗng). */
export function traverse(t, kind) {
  var out = [];
  (function w(n) { if (!n) return; if (kind === 'pre') out.push(n[0]); w(n[1]); if (kind === 'in') out.push(n[0]); w(n[2]); if (kind === 'post') out.push(n[0]); })(t);
  return out;
}
export function bstBuild(values) {
  var root = null;
  values.forEach(function (v) {
    if (!root) { root = [v, null, null]; return; }
    var cur = root;
    for (;;) { if (v < cur[0]) { if (!cur[1]) { cur[1] = [v, null, null]; break; } cur = cur[1]; } else { if (!cur[2]) { cur[2] = [v, null, null]; break; } cur = cur[2]; } }
  });
  return root;
}
export function treeHeight(t) { if (!t) return -1; return 1 + Math.max(treeHeight(t[1]), treeHeight(t[2])); }
export function treeSize(t) { return t ? 1 + treeSize(t[1]) + treeSize(t[2]) : 0; }
export function leaves(t) { if (!t) return 0; if (!t[1] && !t[2]) return 1; return leaves(t[1]) + leaves(t[2]); }
/** Cây m-phân đầy đủ: i nút trong ⇒ n = m·i + 1 nút, l = (m−1)·i + 1 lá. */
export function fullTree(m, internal) { return { n: m * internal + 1, leaves: (m - 1) * internal + 1 }; }
/** Chiều cao tối thiểu của cây m-phân có l lá: ⌈log_m l⌉. */
export function minHeight(m, l) { var h = 0, c = 1; while (c < l) { c *= m; h++; } return h; }
/** Cây khung nhỏ nhất (Kruskal): trả { weight, picked } với picked là các cạnh theo thứ tự thêm. */
export function kruskal(edges, vertices) {
  var parent = {}, w = 0, picked = [];
  vertices.forEach(function (v) { parent[v] = v; });
  function find(x) { while (parent[x] !== x) x = parent[x]; return x; }
  var es = edges.slice().sort(function (a, b) { return a[2] - b[2] || (a[0] + a[1] < b[0] + b[1] ? -1 : 1); });
  es.forEach(function (e) { var a = find(e[0]), b = find(e[1]); if (a !== b) { parent[a] = b; w += e[2]; picked.push(e); } });
  return { weight: w, picked: picked };
}
/** Prim bắt đầu từ s: trả { weight, picked } theo thứ tự thêm cạnh. */
export function prim(edges, vertices, s) {
  var inT = {}, w = 0, picked = [];
  inT[s] = 1;
  while (picked.length < vertices.length - 1) {
    var best = null;
    edges.forEach(function (e) {
      if (!!inT[e[0]] !== !!inT[e[1]]) { if (best === null || e[2] < best[2] || (e[2] === best[2] && (e[0] + e[1]) < (best[0] + best[1]))) best = e; }
    });
    if (!best) break;
    inT[best[0]] = 1; inT[best[1]] = 1; w += best[2]; picked.push(best);
  }
  return { weight: w, picked: picked };
}
/** Huffman: freq = {ký tự: tần số}. Trả { cost (tổng bit), lengths }. Hoà thì chọn nhóm có ký hiệu nhỏ hơn. */
export function huffman(freq) {
  var items = Object.keys(freq).sort().map(function (k) { return { w: freq[k], syms: [k], key: k }; });
  var len = {};
  Object.keys(freq).forEach(function (k) { len[k] = 0; });
  var cost = 0;
  while (items.length > 1) {
    items.sort(function (a, b) { return a.w - b.w || (a.key < b.key ? -1 : 1); });
    var a = items.shift(), b = items.shift();
    a.syms.concat(b.syms).forEach(function (s) { len[s]++; });
    cost += a.w + b.w;
    items.push({ w: a.w + b.w, syms: a.syms.concat(b.syms), key: a.key < b.key ? a.key : b.key });
  }
  var total = 0;
  Object.keys(freq).forEach(function (k) { total += freq[k] * len[k]; });
  return { cost: total, lengths: len, internalSum: cost };
}
/** Thứ tự duyệt cây tổng quát (preorder) từ danh sách cha-con. */
export function expressionEval(t) {
  if (typeof t === 'number') return t;
  var a = expressionEval(t[1]), b = expressionEval(t[2]);
  return t[0] === '+' ? a + b : t[0] === '-' ? a - b : t[0] === '*' ? a * b : a / b;
}
export function exprString(t, kind) {
  if (typeof t === 'number') return String(t);
  var a = exprString(t[1], kind), b = exprString(t[2], kind);
  return kind === 'prefix' ? t[0] + ' ' + a + ' ' + b : kind === 'postfix' ? a + ' ' + b + ' ' + t[0] : '(' + a + ' ' + t[0] + ' ' + b + ')';
}
