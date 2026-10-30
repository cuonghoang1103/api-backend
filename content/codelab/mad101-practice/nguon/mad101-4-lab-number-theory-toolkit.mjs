/** MAD101 · Lab ch.4 — Number-theory toolkit: sieve, factorization, fast powers, inverses, CRT, RSA, LCG. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, dat, bang1, mcNum } from './_md.mjs';

const f2 = (x) => String(x);

function sieve(n) {
  var composite = [], primes = [], i, j;
  for (i = 0; i <= n; i++) composite.push(false);
  for (i = 2; i <= n; i++) {
    if (!composite[i]) { primes.push(i); for (j = i * i; j <= n; j += i) composite[j] = true; }
  }
  return primes;
}
const T1 = jsDe({
  tieuDe: 'Toolkit 1 — Sieve of Eratosthenes',
  doKho: 'EASY', phut: 14,
  moTa: bi('<p>Write <code>sieve(n)</code> returning the array of all primes ≤ n in ascending order (empty when n &lt; 2). Use the sieve: keep a boolean table, and for every prime p start crossing out at p·p. The grader uses n up to 200,000, so trial division of every number would be too slow.</p>', '<p>Viết <code>sieve(n)</code> trả mảng mọi số nguyên tố ≤ n theo thứ tự tăng (rỗng khi n &lt; 2). Dùng sàng: giữ bảng boolean và với mỗi nguyên tố p bắt đầu gạch từ p·p. Bộ chấm dùng n tới 200.000 nên chia thử từng số sẽ quá chậm.</p>'),
  yeuCau: [bi('Time O(n log log n).', 'Thời gian O(n log log n).')],
  viDu: [{ input: 'sieve(30)', output: JSON.stringify(sieve(30)), explanation: 'The ten primes up to 30.|||Mười số nguyên tố đến 30.' }],
  goiY: ['Initialise a table of n + 1 flags; mark multiples of each unmarked i starting at i·i.', 'n < 2 returns an empty array.'],
  loiHayGap: ['Starting the inner loop at p instead of p·p or 2p: p itself would be marked composite.', 'Testing every number for primality by trial division instead of using the table of marks.'],
  giaiThich: '<p>Every composite has a prime factor ≤ its square root, so crossing out from p² removes each composite exactly via its smallest prime factor.</p>',
  khaiNiem: ['sieve', 'primes'],
  fn: 'sieve',
  dau: 'function sieve(n) {\n  return [];\n}\n',
  giaiMa: dat(sieve, 'sieve'),
  ref: (n) => S.sieve(n),
  cases: [{ args: [30] }, { args: [1] }, { args: [2] }, { args: [100] }, { args: [97], an: true }, { args: [200000], an: true }],
});

function primeFactors(n) {
  var out = [], d = 2;
  while (d * d <= n) {
    var e = 0;
    while (n % d === 0) { n = n / d; e++; }
    if (e > 0) out.push([d, e]);
    d++;
  }
  if (n > 1) out.push([n, 1]);
  return out;
}
const T2 = jsDe({
  tieuDe: 'Toolkit 2 — Prime factorization',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>Write <code>primeFactors(n)</code> for an integer n ≥ 2 returning the factorization as an array of <code>[prime, exponent]</code> pairs in increasing prime order, e.g. 360 → <code>[[2,3],[3,2],[5,1]]</code>. Trial division up to √n is enough: when the remaining cofactor is larger than 1 after the loop, it is itself prime.</p>', '<p>Viết <code>primeFactors(n)</code> cho số nguyên n ≥ 2, trả phân tích dạng mảng các cặp <code>[nguyên tố, số mũ]</code> theo thứ tự nguyên tố tăng, ví dụ 360 → <code>[[2,3],[3,2],[5,1]]</code>. Chia thử đến √n là đủ: nếu sau vòng lặp phần còn lại lớn hơn 1 thì nó là số nguyên tố.</p>'),
  yeuCau: [bi('n can be as large as 10¹² (so loop to √n, not to n).', 'n có thể tới 10¹² (nên lặp đến √n, không phải n).')],
  viDu: [{ input: 'primeFactors(360)', output: JSON.stringify(primeFactors(360)), explanation: '360 = 2³·3²·5.|||360 = 2³·3²·5.' }, { input: 'primeFactors(97)', output: JSON.stringify(primeFactors(97)), explanation: 'A prime is its own factorization.|||Số nguyên tố là phân tích của chính nó.' }],
  goiY: ['Divide out each d completely before moving to d + 1, counting the exponent.', 'After the loop, a leftover n > 1 is a prime factor with exponent 1.'],
  loiHayGap: ['Forgetting the leftover prime (e.g. 2·97 = 194 would lose 97).', 'Looping d up to n — too slow for 10¹².'],
  giaiThich: '<p>After removing all factors ≤ √n the cofactor cannot have two prime factors (their product would exceed n), so it is 1 or prime.</p>',
  khaiNiem: ['factorization', 'trial division'],
  fn: 'primeFactors',
  dau: 'function primeFactors(n) {\n  return [];\n}\n',
  giaiMa: dat(primeFactors, 'primeFactors'),
  ref: primeFactors,
  cases: [{ args: [360] }, { args: [97] }, { args: [2] }, { args: [194] }, { args: [999999999989] , an: true }, { args: [1000000007 * 3], an: true }, { args: [2 ** 20], an: true }],
});

function modPow(base, exp, mod) {
  var result = 1 % mod;
  base = ((base % mod) + mod) % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }
  return result;
}
const T3 = jsDe({
  tieuDe: 'Toolkit 3 — Fast modular exponentiation',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Write <code>modPow(base, exp, mod)</code> returning b<sup>e</sup> mod m with the square-and-multiply method. Moduli are below 10⁶ so products stay under 10¹² and are exact in a JavaScript number; exponents go up to 10¹⁵, so multiplying <code>exp</code> times is impossible. <code>mod = 1</code> returns 0.</p>', '<p>Viết <code>modPow(base, exp, mod)</code> trả b<sup>e</sup> mod m bằng phương pháp bình phương–nhân. Mô-đun nhỏ hơn 10⁶ nên tích dưới 10¹² và chính xác trong số JavaScript; số mũ tới 10¹⁵ nên không thể nhân <code>exp</code> lần. <code>mod = 1</code> trả 0.</p>'),
  yeuCau: [bi('O(log exp) multiplications.', 'O(log exp) phép nhân.')],
  viDu: [{ input: 'modPow(7, 222, 11)', output: String(modPow(7, 222, 11)), explanation: 'Matches the Fermat reduction 7² mod 11.|||Khớp phép rút gọn Fermat 7² mod 11.' }],
  goiY: ['Loop while exp > 0: if exp is odd multiply the result by the base; then square the base and halve exp.', 'Reduce every product mod m immediately.'],
  loiHayGap: ['Computing base ** exp first (overflows to Infinity).', 'Using exp >> 1 for exponents above 2³¹ (32-bit truncation) instead of Math.floor(exp / 2).'],
  giaiThich: '<p>Each round either multiplies (odd bit) and always squares, so the number of rounds equals the bit length of exp.</p>',
  khaiNiem: ['fast exponentiation', 'modular arithmetic'],
  fn: 'modPow',
  dau: 'function modPow(base, exp, mod) {\n  return 0;\n}\n',
  giaiMa: dat(modPow, 'modPow'),
  ref: modPow,
  cases: [{ args: [7, 222, 11] }, { args: [2, 10, 1000] }, { args: [5, 0, 13] }, { args: [3, 1000000000000, 999983], an: true }, { args: [10, 5, 1], an: true }, { args: [123456, 987654321, 65537], an: true }, { args: [2, 1000000000000000, 1000003], an: true }],
});

function modInverse(a, m) {
  var r0 = m, r1 = ((a % m) + m) % m, t0 = 0, t1 = 1;
  while (r1 !== 0) {
    var qq = Math.floor(r0 / r1), tmp = r0 - qq * r1;
    r0 = r1; r1 = tmp;
    tmp = t0 - qq * t1; t0 = t1; t1 = tmp;
  }
  if (r0 !== 1) return null;
  return ((t0 % m) + m) % m;
}
const T4 = jsDe({
  tieuDe: 'Toolkit 4 — Modular inverse with extended Euclid',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Write <code>modInverse(a, m)</code> returning the x in 0…m−1 with a·x ≡ 1 (mod m), or <code>null</code> when gcd(a, m) ≠ 1. Use the extended Euclidean algorithm — keep the coefficient of m (or of a) updated along with the remainders. Brute force over 0…m−1 is allowed for tiny moduli but the hidden cases use m up to 10⁹.</p>', '<p>Viết <code>modInverse(a, m)</code> trả x trong 0…m−1 với a·x ≡ 1 (mod m), hoặc <code>null</code> khi gcd(a, m) ≠ 1. Dùng thuật toán Euclid mở rộng — cập nhật hệ số của m (hoặc của a) cùng với số dư. Vét cạn 0…m−1 được phép với mô-đun nhỏ nhưng ca ẩn dùng m tới 10⁹.</p>'),
  yeuCau: [bi('a may be negative or larger than m.', 'a có thể âm hoặc lớn hơn m.')],
  viDu: [{ input: 'modInverse(3, 7)', output: '5', explanation: '3·5 = 15 ≡ 1 (mod 7).|||3·5 = 15 ≡ 1 (mod 7).' }, { input: 'modInverse(4, 10)', output: 'null', explanation: 'gcd(4, 10) = 2.|||gcd(4, 10) = 2.' }],
  goiY: ['Run Euclid on (m, a mod m) and track t such that r ≡ t·a (mod m).', 'At the end the remainder must be 1; otherwise return null. Normalise t into 0…m−1.'],
  loiHayGap: ['Returning a negative coefficient without normalising.', 'Forgetting to reduce a first when a < 0.'],
  giaiThich: '<p>While the remainders shrink, each remainder r_i satisfies r_i ≡ t_i·a (mod m). When r reaches gcd = 1, t is the inverse.</p>',
  khaiNiem: ['extended Euclid', 'modular inverse'],
  fn: 'modInverse',
  dau: 'function modInverse(a, m) {\n  return null;\n}\n',
  giaiMa: dat(modInverse, 'modInverse'),
  ref: modInverse,
  cases: [{ args: [3, 7] }, { args: [4, 10] }, { args: [17, 3120] }, { args: [-3, 7] }, { args: [10, 1000000007], an: true }, { args: [123456789, 998244353], an: true }, { args: [6, 9], an: true }, { args: [1, 1], an: true }],
});

function crt(remainders, moduli) {
  var M = 1, i;
  for (i = 0; i < moduli.length; i++) M *= moduli[i];
  var x = 0;
  for (i = 0; i < moduli.length; i++) {
    var Mi = M / moduli[i], mi = moduli[i], inv = 1, found = false;
    for (var t = 0; t < mi; t++) if (((Mi % mi) * t) % mi === 1 % mi) { inv = t; found = true; break; }
    if (!found) inv = 0;
    x = (x + remainders[i] * Mi * inv) % M;
  }
  return ((x % M) + M) % M;
}
const T5 = jsDe({
  tieuDe: 'Toolkit 5 — Chinese Remainder Theorem',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Write <code>crt(remainders, moduli)</code> solving x ≡ r<sub>i</sub> (mod m<sub>i</sub>) for pairwise coprime moduli (each between 2 and 100, at most four moduli). Return the unique x in 0…M−1 where M is the product of the moduli. Use the formula x = Σ r<sub>i</sub>·M<sub>i</sub>·(M<sub>i</sub>⁻¹ mod m<sub>i</sub>) with M<sub>i</sub> = M / m<sub>i</sub>.</p>', '<p>Viết <code>crt(remainders, moduli)</code> giải x ≡ r<sub>i</sub> (mod m<sub>i</sub>) với các mô-đun đôi một nguyên tố cùng nhau (mỗi cái từ 2 đến 100, tối đa bốn). Trả x duy nhất trong 0…M−1 với M là tích các mô-đun. Dùng công thức x = Σ r<sub>i</sub>·M<sub>i</sub>·(M<sub>i</sub>⁻¹ mod m<sub>i</sub>) với M<sub>i</sub> = M / m<sub>i</sub>.</p>'),
  yeuCau: [bi('Remainders may be ≥ their modulus (reduce them).', 'Số dư có thể ≥ mô-đun (cần rút gọn).')],
  viDu: [{ input: 'crt([2,3,2],[3,5,7])', output: '23', explanation: 'Sun Tzu’s classic: 23 leaves 2, 3, 2 modulo 3, 5, 7.|||Bài cổ Tôn Tử: 23 dư 2, 3, 2 theo 3, 5, 7.' }],
  goiY: ['Compute M first; the inverse of M_i mod m_i can be found by a tiny search over 1…m_i − 1.', 'Take the final sum mod M and make sure it is non-negative.'],
  loiHayGap: ['Using M_i = m_i instead of M / m_i.', 'Forgetting the final mod M (the sum is usually far larger than M).'],
  giaiThich: '<p>M_i is 0 modulo every other modulus and invertible modulo m_i, so each term contributes r_i only to its own congruence.</p>',
  khaiNiem: ['CRT'],
  fn: 'crt',
  dau: 'function crt(remainders, moduli) {\n  return 0;\n}\n',
  giaiMa: dat(crt, 'crt'),
  ref: crt,
  cases: [{ args: [[2, 3, 2], [3, 5, 7]] }, { args: [[1, 2, 3], [3, 4, 5]] }, { args: [[3, 4], [5, 7]] }, { args: [[10, 11], [7, 4]], an: true }, { args: [[0, 0, 0], [3, 5, 7]], an: true }, { args: [[5, 7, 9, 3], [11, 13, 17, 19]], an: true }],
});

/* RSA table */
const RS = [{ p: 11, q: 13, e: 7, m: 9 }, { p: 17, q: 19, e: 5, m: 25 }, { p: 5, q: 11, e: 3, m: 7 }, { p: 61, q: 53, e: 17, m: 65 }];
const rsa = (c) => { const k = S.rsaKey(c.p, c.q, c.e); const ct = S.modPow(c.m, c.e, k.n); return { ...k, ct, back: S.modPow(ct, k.d, k.n) }; };
RS.forEach((c) => { assert.equal(rsa(c).back, c.m); assert.equal(S.gcd(c.e, rsa(c).phi), 1); });
const T6 = tinh({
  tieuDe: 'Toolkit 6 — A toy RSA by hand',
  doKho: 'MEDIUM', phut: 18,
  moTa: bi('<p>Toy RSA: n = p·q, φ = (p − 1)(q − 1), public exponent e (coprime to φ), private exponent d with e·d ≡ 1 (mod φ). Encrypt c = m<sup>e</sup> mod n; decrypt m = c<sup>d</sup> mod n. Fill the table (the last column must reproduce the message).</p>', '<p>RSA đồ chơi: n = p·q, φ = (p − 1)(q − 1), số mũ công khai e (nguyên tố cùng nhau với φ), số mũ bí mật d với e·d ≡ 1 (mod φ). Mã hoá c = m<sup>e</sup> mod n; giải mã m = c<sup>d</sup> mod n. Điền bảng (cột cuối phải trả lại thông điệp).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Toy RSA', 'RSA đồ chơi'], [{ ma: 'in', ten: 'p, q, e, message m' }, { ma: 'n', ten: 'n' }, { ma: 'phi', ten: 'φ(n)' }, { ma: 'd', ten: 'd' }, { ma: 'c', ten: 'cipher c' }, { ma: 'b', ten: 'decrypted m' }],
    RS.map((c) => { const r = rsa(c); return { o: { in: `p = ${c.p}, q = ${c.q}, e = ${c.e}, m = ${c.m}` }, a: { n: String(r.n), phi: String(r.phi), d: String(r.d), c: String(r.ct), b: String(r.back) } }; }),
    [RS.map((c) => { const r = rsa(c); return `(${c.p},${c.q},e=${c.e}): n=${r.n}, φ=${r.phi}, d=${r.d}, c=${r.ct}, back=${r.back}`; }).join('; ') + '.', RS.map((c) => { const r = rsa(c); return `(${c.p},${c.q},e=${c.e}): n=${r.n}, φ=${r.phi}, d=${r.d}, c=${r.ct}, giải mã=${r.back}`; }).join('; ') + '.'])],
  goiY: ['d is the modular inverse of e modulo φ (not modulo n).', 'Use square-and-multiply for c and for the decryption, reducing mod n at each step.'],
  loiHayGap: ['Taking the inverse of e modulo n instead of modulo φ.', 'Using a message m ≥ n.'],
  thuatNgu: [tn('RSA', 'RSA'), tn('public key', 'khoá công khai'), tn('private key', 'khoá bí mật')],
  khaiNiem: ['RSA', 'modular inverse'],
});

/* applications */
const LC = { a: 7, c: 3, m: 20, x0: 4 };
const lcgSeq = (n) => { const out = []; let x = LC.x0; for (let i = 0; i < n; i++) { x = (LC.a * x + LC.c) % LC.m; out.push(x); } return out; };
const T7 = tinh({
  tieuDe: 'Toolkit 7 — Applications: Caesar, check digits, hashing, pseudo-random numbers',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Everyday uses of congruences: shift ciphers, check digits, hash functions and linear congruential generators.</p>', '<p>Ứng dụng thường ngày của đồng dư: mã dịch chuyển, chữ số kiểm tra, hàm băm và bộ sinh số giả ngẫu nhiên đồng dư tuyến tính.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', [`The Caesar cipher f(p) = (p + 3) mod 26 encrypts HELLO as …`, `Mã Caesar f(p) = (p + 3) mod 26 mã hoá HELLO thành …`], [S.caesar('HELLO', 3), S.caesar('HELLO', 13), S.caesar('HELLO', -3), 'KHOOS'], ['Shift every letter 3 places, wrapping Z to C.', 'Dịch mỗi chữ cái 3 vị trí, quay vòng Z sang C.']),
    q('c2', [`Decrypting the Caesar text ${S.caesar('ATTACK', 5)} (shift 5) gives …`, `Giải mã bản mã Caesar ${S.caesar('ATTACK', 5)} (dịch 5) được …`], ['ATTACK', S.caesar('ATTACK', 10), S.caesar('ATTACK', -10), 'DEFEND'], ['Shift back by 5: p = (c − 5) mod 26.', 'Dịch ngược 5: p = (c − 5) mod 26.']),
    q('c3', ['The ISBN-10 starting 0-07-288008 has the check digit …', 'ISBN-10 bắt đầu 0-07-288008 có chữ số kiểm tra …'], [S.isbn10Check('007288008'), '0', '9', 'X'], ['The weighted sum Σ (10 − i)·d_i + check must be ≡ 0 (mod 11).', 'Tổng có trọng số Σ (10 − i)·d_i + chữ số kiểm tra phải ≡ 0 (mod 11).']),
    q('c4', ['A hash table of 11 slots uses h(k) = k mod 11. Keys 15 and 26 …', 'Bảng băm 11 ô dùng h(k) = k mod 11. Khoá 15 và 26 …'], ['collide in slot 4', 'go to slots 5 and 4', 'go to slot 15 and 26', 'do not collide'], ['15 mod 11 = 4 and 26 mod 11 = 4: a collision.', '15 mod 11 = 4 và 26 mod 11 = 4: đụng độ.']),
    mcNum('c5', [`LCG x(n+1) = (${LC.a}·x(n) + ${LC.c}) mod ${LC.m} with x(0) = ${LC.x0}: the 3rd generated value x(3) is …`, `LCG x(n+1) = (${LC.a}·x(n) + ${LC.c}) mod ${LC.m} với x(0) = ${LC.x0}: giá trị thứ 3 x(3) là …`], lcgSeq(3)[2], [lcgSeq(3)[1], lcgSeq(3)[0], lcgSeq(4)[3]], f2, [`Sequence: ${lcgSeq(6).join(', ')}.`, `Dãy: ${lcgSeq(6).join(', ')}.`]),
    mcNum('c6', [`Same LCG: after how many steps does the sequence return to x(0) = ${LC.x0}? (period)`, `Cùng LCG: sau bao nhiêu bước dãy quay về x(0) = ${LC.x0}? (chu kỳ)`], (() => { let x = LC.x0, n = 0; do { x = (LC.a * x + LC.c) % LC.m; n++; } while (x !== LC.x0 && n < 100); return n; })(), [20, 10, 2], f2, ['Iterate until the seed reappears; a generator with a short period is useless for randomness.', 'Lặp đến khi hạt giống xuất hiện lại; bộ sinh chu kỳ ngắn vô dụng cho ngẫu nhiên.']),
  ],
  goiY: ['Caesar: map letters to 0…25, add the key, reduce mod 26.', 'For the LCG, just iterate the recurrence on paper.'],
  loiHayGap: ['Forgetting to wrap around the alphabet.', 'Using weights 1…9 in the ISBN sum instead of 10…2.'],
  thuatNgu: [tn('hash function', 'hàm băm'), tn('pseudo-random', 'giả ngẫu nhiên'), tn('check digit', 'chữ số kiểm tra')],
  khaiNiem: ['applications of congruence'],
});

function lcg(a, c, m, seed, count) {
  var out = [], x = seed;
  for (var i = 0; i < count; i++) { x = (a * x + c) % m; out.push(x); }
  return out;
}
const T8 = jsDe({
  tieuDe: 'Toolkit 8 — Linear congruential generator and its period',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Write <code>lcg(a, c, m, seed, count)</code> returning the first <code>count</code> values generated by x<sub>n+1</sub> = (a·x<sub>n</sub> + c) mod m starting from <code>seed</code> (the seed itself is not part of the output). Keep every product below 2⁵³ (a, m ≤ 10⁶ in the tests).</p>', '<p>Viết <code>lcg(a, c, m, seed, count)</code> trả <code>count</code> giá trị đầu sinh bởi x<sub>n+1</sub> = (a·x<sub>n</sub> + c) mod m bắt đầu từ <code>seed</code> (bản thân hạt giống không nằm trong kết quả). Mọi tích nhỏ hơn 2⁵³ (a, m ≤ 10⁶ trong test).</p>'),
  yeuCau: [bi('count may be 0 (return an empty array).', 'count có thể bằng 0 (trả mảng rỗng).')],
  viDu: [{ input: 'lcg(7,3,20,4,5)', output: JSON.stringify(lcg(7, 3, 20, 4, 5)), explanation: '(7·4+3) mod 20 = 11, then 80 mod 20 = 0 …|||(7·4+3) mod 20 = 11, rồi 80 mod 20 = 0 …' }],
  goiY: ['Keep one running value x and push the new x each round.', 'Take the modulus each step; do not compute the closed form with huge powers.'],
  loiHayGap: ['Pushing the seed as the first value.', 'Computing (a * x + c) without % m, so numbers grow unboundedly.'],
  giaiThich: '<p>A generator is a deterministic walk on the finite set {0, …, m−1}, so it must eventually repeat; its period is at most m.</p>',
  khaiNiem: ['LCG', 'congruence'],
  fn: 'lcg',
  dau: 'function lcg(a, c, m, seed, count) {\n  return [];\n}\n',
  giaiMa: dat(lcg, 'lcg'),
  ref: lcg,
  cases: [{ args: [7, 3, 20, 4, 5] }, { args: [1103515245 % 1000003, 12345, 1000003, 42, 4], an: true }, { args: [5, 1, 16, 0, 20] }, { args: [3, 0, 7, 1, 0], an: true }, { args: [75, 74, 65537, 1, 6], an: true }],
});

export default doiDau({
  slug: 'mad101-4-lab-number-theory-toolkit',
  ten: '4.L Lab: number-theory toolkit in code',
  khoa: KHOA,
  baiHoc: 'mad101-4-1-so-hoc-mo-dun',
  de: [T1, T2, T3, T4, T5, T6, T7, T8],
});
