/** MAD101 · 4.1 — Divisibility, modular arithmetic, primes, Euclid, congruences. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, q, tn, ord, bang1, mcNum, listAns, factorAns } from './_md.mjs';

const f2 = (x) => String(x);
const N1 = tinh({
  tieuDe: 'Number theory 1 — Divisibility and modular vocabulary',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Definitions from Rosen §4.1–4.3: divisibility, mod, congruence, primes, gcd and relative primality.</p>', '<p>Định nghĩa từ Rosen §4.1–4.3: chia hết, mod, đồng dư, số nguyên tố, ƯCLN và nguyên tố cùng nhau.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['a | b means …', 'a | b nghĩa là …'], ['b = a·k for some integer k', 'a = b·k for some integer k', 'a < b', 'a and b are coprime'], ['a divides b when b is an integer multiple of a (a ≠ 0).', 'a chia hết b khi b là bội nguyên của a (a ≠ 0).']),
    q('c2', ['a ≡ b (mod m) means …', 'a ≡ b (mod m) nghĩa là …'], ['m divides a − b', 'a = b', 'a mod m < b mod m', 'a·b is a multiple of m'], ['Equivalent: a and b leave the same remainder when divided by m.', 'Tương đương: a và b có cùng số dư khi chia cho m.']),
    q('c3', ['−7 mod 3 equals …', '−7 mod 3 bằng …'], ['2', '−1', '1', '−2'], ['−7 = 3·(−3) + 2, and a remainder is never negative.', '−7 = 3·(−3) + 2, số dư không bao giờ âm.']),
    q('c4', ['Integers a and b are relatively prime when …', 'Hai số nguyên a, b nguyên tố cùng nhau khi …'], ['gcd(a, b) = 1', 'both are prime', 'a | b', 'lcm(a, b) = 1'], ['They share no prime factor — even if neither number is prime (e.g. 8 and 15).', 'Chúng không có thừa số nguyên tố chung — dù cả hai không nguyên tố (vd 8 và 15).']),
    q('c5', ['For positive a, b: gcd(a, b)·lcm(a, b) equals …', 'Với a, b dương: gcd(a, b)·lcm(a, b) bằng …'], ['a·b', 'a + b', 'gcd(a, b)²', 'a/b'], ['This identity gives lcm quickly once gcd is known.', 'Đẳng thức này cho BCNN nhanh khi đã biết ƯCLN.']),
    q('c6', ['The Fundamental Theorem of Arithmetic says every integer n > 1 …', 'Định lý cơ bản của số học nói mọi số nguyên n > 1 …'], ['is a product of primes, uniquely up to order', 'is prime', 'has exactly two divisors', 'can be written as a sum of two primes'], ['Existence and uniqueness of prime factorization.', 'Tồn tại và duy nhất phân tích thừa số nguyên tố.']),
  ],
  goiY: ['Think of congruence as “same remainder”.', 'The remainder in a division by m is always in 0…m−1, even for negative dividends.'],
  loiHayGap: ['Writing −7 mod 3 = −1 (that is the remainder of truncating division in C/Java, not the mathematical mod).', 'Assuming relatively prime numbers must themselves be prime.'],
  thuatNgu: [tn('congruence', 'đồng dư'), tn('relatively prime', 'nguyên tố cùng nhau'), tn('gcd', 'ƯCLN'), tn('lcm', 'BCNN')],
  khaiNiem: ['divisibility', 'modular arithmetic'],
});

/* div/mod */
const DM = [[47, 5], [-47, 5], [100, 7], [-13, 4], [0, 9], [1234, 100], [-1, 26]];
const N2 = tinh({
  tieuDe: 'Number theory 2 — Quotient and remainder (including negatives)',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>For a = m·q + r with 0 ≤ r &lt; m give q = a div m (rounded <em>down</em>) and r = a mod m.</p>', '<p>Với a = m·q + r và 0 ≤ r &lt; m hãy cho q = a div m (làm tròn <em>xuống</em>) và r = a mod m.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['div and mod', 'div và mod'], [{ ma: 'a', ten: 'a, m' }, { ma: 'q', ten: 'a div m' }, { ma: 'r', ten: 'a mod m' }],
    DM.map(([a, m]) => ({ o: { a: `a = ${a},  m = ${m}` }, a: { q: String(Math.floor(a / m)), r: String(S.mod(a, m)) } })),
    [DM.map(([a, m]) => `${a} = ${m}·(${Math.floor(a / m)}) + ${S.mod(a, m)}`).join('; ') + '.', DM.map(([a, m]) => `${a} = ${m}·(${Math.floor(a / m)}) + ${S.mod(a, m)}`).join('; ') + '.'])],
  goiY: ['The quotient is ⌊a/m⌋; the remainder is a − m·q.', 'For negative a, the quotient goes further down so that the remainder stays non-negative.'],
  loiHayGap: ['Writing −47 = 5·(−9) − 2 (negative remainder).', 'Truncating toward zero for negative dividends.'],
  thuatNgu: [tn('quotient', 'thương'), tn('remainder', 'số dư')],
  khaiNiem: ['division algorithm'],
});

/* gcd lcm factorization */
const GP = [[84, 36], [360, 150], [1001, 143], [17, 51], [2310, 1155]];
const N3 = tinh({
  tieuDe: 'Number theory 3 — gcd, lcm and prime factorization',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Factorize each number into primes (write like <code>2^3*3^2*5</code>), then give gcd and lcm of the pair. For lcm take the larger exponent of each prime, for gcd the smaller.</p>', '<p>Phân tích mỗi số ra thừa số nguyên tố (viết dạng <code>2^3*3^2*5</code>), rồi cho ƯCLN và BCNN của cặp. BCNN lấy số mũ lớn hơn của mỗi nguyên tố, ƯCLN lấy số mũ nhỏ hơn.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Factorizations, gcd, lcm', 'Phân tích, ƯCLN, BCNN'], [{ ma: 'ab', ten: 'a, b' }, { ma: 'fa', ten: 'a factorized' }, { ma: 'fb', ten: 'b factorized' }, { ma: 'g', ten: 'gcd' }, { ma: 'l', ten: 'lcm' }],
    GP.map(([a, b]) => ({ o: { ab: `a = ${a},  b = ${b}` }, a: { fa: factorAns(a), fb: factorAns(b), g: String(S.gcd(a, b)), l: String(S.lcm(a, b)) } })),
    [GP.map(([a, b]) => `${a} = ${factorAns(a)[1]}, ${b} = ${factorAns(b)[1]}, gcd ${S.gcd(a, b)}, lcm ${S.lcm(a, b)}`).join('; ') + '.', GP.map(([a, b]) => `${a} = ${factorAns(a)[1]}, ${b} = ${factorAns(b)[1]}, gcd ${S.gcd(a, b)}, lcm ${S.lcm(a, b)}`).join('; ') + '.'])],
  goiY: ['Divide by 2, 3, 5, 7, … until the quotient is 1.', 'Check: gcd·lcm = a·b.'],
  loiHayGap: ['Taking the larger exponent for gcd.', 'Stopping the factorization before the quotient is 1 (leaving a composite factor).'],
  thuatNgu: [tn('prime factorization', 'phân tích thừa số nguyên tố')],
  khaiNiem: ['factorization', 'gcd', 'lcm'],
});
GP.forEach(([a, b]) => assert.equal(S.gcd(a, b) * S.lcm(a, b), a * b));

/* Euclid trace */
const EA = 1071, EB = 462;
const TR = S.gcdSteps(EA, EB).steps;
const N4 = tinh({
  tieuDe: 'Number theory 4 — Trace the Euclidean algorithm',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Compute gcd(${EA}, ${EB}) by repeated division: at each step a = b·q + r, then continue with (a, b) ← (b, r) until r = 0. Fill each row; the last non-zero remainder is the gcd.</p>`, `<p>Tính gcd(${EA}, ${EB}) bằng chia liên tiếp: mỗi bước a = b·q + r, rồi tiếp tục với (a, b) ← (b, r) đến khi r = 0. Điền từng dòng; số dư khác 0 cuối cùng là ƯCLN.</p>`),
  loai: 'table',
  bang: [bang1('b1', [`Euclid on (${EA}, ${EB})`, `Euclid trên (${EA}, ${EB})`], [{ ma: 'a', ten: 'a' }, { ma: 'b', ten: 'b' }, { ma: 'q', ten: 'q = a div b' }, { ma: 'r', ten: 'r = a mod b' }],
    TR.map((s, i) => ({ o: i === 0 ? { a: String(s[0]), b: String(s[1]) } : {}, a: { ...(i === 0 ? {} : { a: String(s[0]), b: String(s[1]) }), q: String(s[2]), r: String(s[3]) } })),
    [`Rows: ${TR.map((s) => `${s[0]} = ${s[1]}·${s[2]} + ${s[3]}`).join('; ')}. gcd = ${S.gcd(EA, EB)}.`, `Các dòng: ${TR.map((s) => `${s[0]} = ${s[1]}·${s[2]} + ${s[3]}`).join('; ')}. ƯCLN = ${S.gcd(EA, EB)}.`])],
  goiY: ['The new a is the old b, and the new b is the old remainder.', 'Stop when the remainder reaches 0; the gcd is the last non-zero remainder (= the last b).'],
  loiHayGap: ['Reusing the old a instead of the old b in the next row.', 'Reporting the last remainder (0) as the gcd.'],
  thuatNgu: [tn('Euclidean algorithm', 'thuật toán Euclid')],
  khaiNiem: ['Euclid'],
});

/* inverses */
const INV = [[3, 7], [5, 12], [17, 3120], [4, 10], [10, 21], [9, 26]];
const N5 = tinh({
  tieuDe: 'Number theory 5 — Modular inverses and Bézout',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>The inverse of a modulo m exists exactly when gcd(a, m) = 1; it is the x in 0…m−1 with a·x ≡ 1 (mod m). Write <code>none</code> when no inverse exists.</p>', '<p>Nghịch đảo của a theo mô-đun m tồn tại khi và chỉ khi gcd(a, m) = 1; đó là x trong 0…m−1 với a·x ≡ 1 (mod m). Viết <code>none</code> khi không tồn tại.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Modular inverses', 'Nghịch đảo mô-đun'], [{ ma: 'am', ten: 'a, m' }, { ma: 'g', ten: 'gcd(a, m)' }, { ma: 'inv', ten: 'a⁻¹ mod m' }],
    INV.map(([a, m]) => ({ o: { am: `a = ${a},  m = ${m}` }, a: { g: String(S.gcd(a, m)), inv: S.modInverse(a, m) === null ? ['none', 'no inverse', 'does not exist'] : String(S.modInverse(a, m)) } })),
    [INV.map(([a, m]) => `${a}⁻¹ mod ${m}: ${S.modInverse(a, m) === null ? 'none (gcd ' + S.gcd(a, m) + ')' : S.modInverse(a, m)}`).join('; ') + '. The inverse is the Bézout coefficient of a in 1 = a·x + m·y.', INV.map(([a, m]) => `${a}⁻¹ mod ${m}: ${S.modInverse(a, m) === null ? 'không có (gcd ' + S.gcd(a, m) + ')' : S.modInverse(a, m)}`).join('; ') + '.'])],
  goiY: ['If gcd(a, m) ≠ 1, answer none immediately.', 'Otherwise back-substitute through the Euclidean steps to write 1 = a·x + m·y; then x mod m is the inverse. You can also verify a·x mod m = 1.'],
  loiHayGap: ['Giving a negative x without reducing mod m.', 'Searching for an inverse when gcd(a, m) > 1.'],
  thuatNgu: [tn('modular inverse', 'nghịch đảo mô-đun'), tn('Bézout’s theorem', 'đẳng thức Bézout')],
  khaiNiem: ['modular inverse', 'extended Euclid'],
});
INV.forEach(([a, m]) => { const r = S.modInverse(a, m); if (r !== null) assert.equal((a * r) % m, 1); });

/* congruences and CRT */
const LC = [[3, 4, 7], [6, 4, 10], [4, 6, 10], [5, 1, 12], [14, 7, 21]];
const CR = [{ r: [2, 3, 2], m: [3, 5, 7] }, { r: [1, 2, 3], m: [3, 4, 5] }, { r: [3, 4], m: [5, 7] }];
const N6 = tinh({
  tieuDe: 'Number theory 6 — Linear congruences and the Chinese Remainder Theorem',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Solve a·x ≡ b (mod m): list <em>all</em> solutions in 0…m−1 in ascending order (<code>none</code> if there is no solution). Then solve the CRT systems: the unique x modulo the product of the moduli.</p>', '<p>Giải a·x ≡ b (mod m): liệt kê <em>mọi</em> nghiệm trong 0…m−1 theo thứ tự tăng (<code>none</code> nếu vô nghiệm). Sau đó giải hệ CRT: x duy nhất theo mô-đun tích các mô-đun.</p>'),
  loai: 'table',
  bang: [
    bang1('b1', ['a·x ≡ b (mod m)', 'a·x ≡ b (mod m)'], [{ ma: 'c', ten: 'Congruence' }, { ma: 'sol', ten: 'Solutions in 0…m−1' }],
      LC.map(([a, b, m]) => { const s = S.solveCong(a, b, m); return { o: { c: `${a}x ≡ ${b} (mod ${m})` }, a: { sol: s.length ? listAns(s) : ['none', 'no solution', '∅'] } }; }),
      [LC.map(([a, b, m]) => `${a}x ≡ ${b} (mod ${m}): ${S.solveCong(a, b, m).join(',') || 'none'}`).join('; ') + '. With g = gcd(a, m): solutions exist iff g | b, and then there are g of them.', LC.map(([a, b, m]) => `${a}x ≡ ${b} (mod ${m}): ${S.solveCong(a, b, m).join(',') || 'không có'}`).join('; ') + '.']),
    bang1('b2', ['CRT systems', 'Hệ CRT'], [{ ma: 's', ten: 'System' }, { ma: 'x', ten: 'x mod M' }],
      CR.map((c) => ({ o: { s: c.r.map((r, i) => `x ≡ ${r} (mod ${c.m[i]})`).join(',  ') }, a: { x: String(S.crt(c.r, c.m)) } })),
      [CR.map((c) => `${c.r.map((r, i) => `x≡${r}(${c.m[i]})`).join(',')} ⇒ x = ${S.crt(c.r, c.m)} mod ${c.m.reduce((a, b) => a * b, 1)}`).join('; ') + '.', CR.map((c) => `x = ${S.crt(c.r, c.m)} mod ${c.m.reduce((a, b) => a * b, 1)}`).join('; ') + '.']),
  ],
  goiY: ['gcd(a, m) = g: no solution unless g | b; if it divides, divide everything by g and solve with the inverse.', 'CRT: x = Σ r_i·M_i·(M_i⁻¹ mod m_i) mod M with M_i = M/m_i.'],
  loiHayGap: ['Listing only one solution when g > 1 (there are g solutions mod m).', 'Mixing up which modulus each inverse is taken with.'],
  thuatNgu: [tn('Chinese Remainder Theorem', 'định lý số dư Trung Hoa')],
  khaiNiem: ['linear congruence', 'CRT'],
});

/* modular exponentiation & friends */
const N7 = tinh({
  tieuDe: 'Number theory 7 — Fermat, modular powers, φ and base conversion',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Computation questions of the kind that fill a discrete-math exam. Use Fermat’s little theorem (a^(p−1) ≡ 1 mod p for prime p ∤ a) to shorten exponents.</p>', '<p>Các câu tính toán hay gặp trong đề toán rời rạc. Dùng định lý Fermat nhỏ (a^(p−1) ≡ 1 mod p với p nguyên tố, p ∤ a) để rút gọn số mũ.</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['7²²² mod 11 = ?', '7²²² mod 11 = ?'], S.modPow(7, 222, 11), [1, 7, 3], f2, ['Fermat: 7¹⁰ ≡ 1 (mod 11), 222 = 22·10 + 2, so 7²²² ≡ 7² = 49 ≡ 5 (mod 11).', 'Fermat: 7¹⁰ ≡ 1 (mod 11), 222 = 22·10 + 2 nên 7²²² ≡ 49 ≡ 5.']),
    mcNum('c2', ['3²⁰⁰ mod 13 = ?', '3²⁰⁰ mod 13 = ?'], S.modPow(3, 200, 13), [1, 3, 12], f2, [`3³ = 27 ≡ 1 (mod 13), 200 = 3·66 + 2, so 3²⁰⁰ ≡ 3² = 9.`, `3³ = 27 ≡ 1 (mod 13), 200 = 3·66 + 2 nên 3²⁰⁰ ≡ 9.`]),
    mcNum('c3', ['φ(36) (the number of integers 1…36 coprime to 36) = ?', 'φ(36) (số số nguyên 1…36 nguyên tố cùng nhau với 36) = ?'], S.phi(36), [18, 36, 6], f2, ['36 = 2²·3²: φ = 36·(1 − ½)(1 − ⅓) = 12.', '36 = 2²·3²: φ = 36·(1 − ½)(1 − ⅓) = 12.']),
    mcNum('c4', ['How many positive divisors does 360 have?', '360 có bao nhiêu ước nguyên dương?'], S.numDivisors(360), [12, 30, 18], f2, ['360 = 2³·3²·5: (3 + 1)(2 + 1)(1 + 1) = 24.', '360 = 2³·3²·5: (3 + 1)(2 + 1)(1 + 1) = 24.']),
    mcNum('c5', ['(177)₁₀ written in binary has … ones.', '(177)₁₀ viết nhị phân có … chữ số 1.'], S.toBase(177, 2).split('1').length - 1, [3, 6, 5], f2, [`177 = ${S.toBase(177, 2)}₂ (128 + 32 + 16 + 1).`, `177 = ${S.toBase(177, 2)}₂ (128 + 32 + 16 + 1).`]),
    mcNum('c6', ['(2AE0B)₁₆ in decimal is …', '(2AE0B)₁₆ trong hệ thập phân là …'], S.fromBase('2AE0B', 16), [175627 + 16, 175627 - 4096, 2 * 16 ** 4 + 10 * 16 ** 3], f2, [`2·16⁴ + 10·16³ + 14·16² + 0·16 + 11 = ${S.fromBase('2AE0B', 16)}.`, `2·16⁴ + 10·16³ + 14·16² + 0·16 + 11 = ${S.fromBase('2AE0B', 16)}.`]),
  ],
  goiY: ['Reduce the exponent by the order of the base (p − 1 for Fermat, or a smaller cycle you find).', 'Binary: repeatedly divide by 2 and read remainders upward.'],
  loiHayGap: ['Forgetting to reduce the base first.', 'Using φ(n) = n − 1 for composite n.'],
  thuatNgu: [tn('Fermat’s little theorem', 'định lý Fermat nhỏ'), tn('Euler’s totient', 'hàm φ Euler')],
  khaiNiem: ['modular exponentiation', 'totient', 'bases'],
});
assert.equal(S.modPow(7, 222, 11), 5);

/* order: Sieve and square-and-multiply */
const N8 = tinh({
  tieuDe: 'Number theory 8 — Order the algorithm steps',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Put the steps of two classic number-theory algorithms in order.</p>', '<p>Sắp các bước của hai thuật toán số học kinh điển.</p>'),
  loai: 'order',
  cauHoi: [
    ord('q1', ['The sieve of Eratosthenes for primes ≤ n.', 'Sàng Eratosthenes cho số nguyên tố ≤ n.'], ['List the integers 2, 3, …, n.', 'Take the smallest unmarked number p; it is prime.', 'Cross out p², p² + p, p² + 2p, … up to n.', 'Repeat while p² ≤ n.', 'The unmarked numbers left are the primes.'], [`Only primes up to √n need to sieve: for n = 100 these are ${S.sieveSievers(100).join(', ')}.`, `Chỉ cần sàng bằng các số nguyên tố ≤ √n: với n = 100 là ${S.sieveSievers(100).join(', ')}.`], 2),
    ord('q2', ['Fast modular exponentiation (square-and-multiply) for b^e mod m.', 'Luỹ thừa mô-đun nhanh (bình phương–nhân) cho b^e mod m.'], ['Set result = 1 and reduce b mod m.', 'While e > 0: if e is odd, result = result·b mod m.', 'Square the base: b = b·b mod m.', 'Halve the exponent: e = ⌊e/2⌋.', 'When e = 0 return result.'], ['It needs only ⌊log₂ e⌋ + 1 rounds, each with at most two modular multiplications.', 'Chỉ cần ⌊log₂ e⌋ + 1 vòng, mỗi vòng tối đa hai phép nhân mô-đun.'], 3),
    ord('q3', ['Euclid’s algorithm for gcd(a, b).', 'Thuật toán Euclid cho gcd(a, b).'], ['While b ≠ 0 do the following:', 'Compute r = a mod b.', 'Set a = b and b = r.', 'When b = 0 the answer is a.'], ['Each step shrinks the pair; the last non-zero remainder is the gcd.', 'Mỗi bước thu nhỏ cặp số; số dư khác 0 cuối cùng là ƯCLN.'], 1),
  ],
  goiY: ['The sieve starts marking at p², because smaller multiples were crossed out by smaller primes.', 'In square-and-multiply, the odd test happens before squaring.'],
  loiHayGap: ['Starting to cross out at 2p instead of p².', 'Squaring before using the current bit.'],
  thuatNgu: [tn('sieve', 'sàng')],
  khaiNiem: ['algorithms'],
});

export default doiDau({
  slug: 'mad101-4-1-so-hoc-mo-dun',
  ten: '4.1 Division & modular arithmetic',
  khoa: KHOA,
  baiHoc: 'mad101-4-1-so-hoc-mo-dun',
  de: [N1, N2, N3, N4, N5, N6, N7, N8],
});
