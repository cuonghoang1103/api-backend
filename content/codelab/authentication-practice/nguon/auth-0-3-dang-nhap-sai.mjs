/** Authentication · 0.3 — v0 chạy được mà sai sáu chỗ: lỗ ⇒ bằng chứng thật ⇒ chương; tự viết sessionSearch và signInResponse. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s00/_ma.mjs';

const DOAN = /tried (\d+) ids in ([\d.]+) s \((\d+) requests\/s\)/.exec(OUT['03-doan-phien']);
const BRUTE = /(\d+) attempts in ([\d.]+) s \((\d+) attempts\/s\)/.exec(OUT['03-do-mk-an']);

/* ── 1. Lỗ ⇒ chương ── */
const CH = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 6', 'Chapter 10'];
const S1 = cs({
  ten: '0.3-1 — Six holes, six chapters', kho: 'EASY', phut: 10, loai: 'table',
  en: 'Each row is real evidence from LabFlow ID v0 (lesson 0.3). Pick the chapter that closes the hole first.',
  vi: 'Mỗi dòng là một bằng chứng thật từ LabFlow ID v0 (bài 0.3). Chọn chương đóng lỗ đó trước tiên.',
  bang: [bang1('b1', ['Evidence → chapter', 'Bằng chứng → chương'], [{ ma: 'x', ten: 'Evidence' }, { ma: 'c', ten: 'Fixed in', luaChon: CH }], [
    { o: { x: 'cat data/db.json prints "password": "123456"' }, a: { c: 'Chapter 2' } },
    { o: { x: '"Wrong password" vs "No account with that email" tells a stranger who has an account' }, a: { c: 'Chapter 6' } },
    { o: { x: `The session id is Date.now(): ${DOAN[1]} guesses found An’s session in ${DOAN[2]} s` }, a: { c: 'Chapter 1' } },
    { o: { x: 'POST /sign-out is 404 and the old session id still works' }, a: { c: 'Chapter 3' } },
    { o: { x: 'The session lives in localStorage; one injected script sent it to 127.0.0.1:4801' }, a: { c: 'Chapter 3' } },
    { o: { x: `${BRUTE[1]} password guesses in ${BRUTE[2]} s, every one answered 401, never 429` }, a: { c: 'Chapter 10' } },
  ], ['Chapter 1 already replaces Date.now() with 256 random bits (v0.1). Chapter 2 hashes passwords; Chapter 3 gives sessions expiry, logout and an HttpOnly cookie; Chapter 6 makes every failed login look the same; Chapter 10 limits guessing.', 'Chương 1 đã thay Date.now() bằng 256 bit ngẫu nhiên (v0.1). Chương 2 băm mật khẩu; Chương 3 cho phiên hạn dùng, đăng xuất và cookie HttpOnly; Chương 6 làm mọi lần đăng nhập trượt trông như nhau; Chương 10 giới hạn việc đoán.'])],
  goiY: [['Randomness is a primitive — Chapter 1.', 'Ngẫu nhiên là một nguyên hàm — Chương 1.'], ['Sessions and cookies are one chapter.', 'Phiên và cookie là một chương.']],
  loi: [['“Hash the session id” for hole 3: the problem is that it is guessable, not that it is stored.', '"Băm id phiên" cho lỗ 3: vấn đề là nó đoán được, không phải nó được lưu.'], ['Thinking one message fixes enumeration: timing still differs (Chapter 6).', 'Tưởng một thông báo là sửa xong việc dò tài khoản: thời gian vẫn khác (Chương 6).']],
  tns: [tn('enumeration', 'dò ra tài khoản nào tồn tại')],
  kn: ['threat overview'],
});

/* ── 2. Tự viết: sessionSearch ── */
function sessionSearch(windowMs, rate) {
  var candidates = windowMs;                              // Date.now() moves 1 per millisecond
  var worst = candidates / rate;
  return { candidates: candidates, worstSeconds: Math.round(worst * 100) / 100, averageSeconds: Math.round(worst / 2 * 100) / 100 };
}
const S2 = jsBai({
  ten: '0.3-2 — Write sessionSearch(windowMs, rate)', kho: 'EASY', phut: 8,
  en: `<p>A <code>Date.now()</code> session id is one of <code>windowMs</code> numbers if the attacker knows when the sign-in happened to within that window. Lesson 0.3 measured <b>${DOAN[3]} requests/s</b> on localhost. Return <code>{ candidates, worstSeconds, averageSeconds }</code>: candidates = how many ids are possible, worst = trying all of them, average = half of that; round both times to 2 decimals.</p>`,
  vi: `<p>Id phiên kiểu <code>Date.now()</code> là một trong <code>windowMs</code> số nếu kẻ tấn công biết lúc đăng nhập trong cửa sổ đó. Bài 0.3 đo được <b>${DOAN[3]} request/giây</b> trên localhost. Trả về <code>{ candidates, worstSeconds, averageSeconds }</code>: candidates = số id có thể, worst = thử hết, average = một nửa; làm tròn hai thời gian tới 2 chữ số thập phân.</p>`,
  goiY: [['One millisecond = one candidate.', 'Một mili giây = một ứng viên.'], ['Math.round(x * 100) / 100.', 'Math.round(x * 100) / 100.']],
  loi: [['Counting seconds instead of milliseconds: 60 candidates per minute instead of 60,000.', 'Đếm theo giây thay vì mili giây: 60 ứng viên mỗi phút thay vì 60.000.'], ['Rounding before halving.', 'Làm tròn trước khi chia đôi.']],
  gt: [`One minute is 60,000 candidates; at ${DOAN[3]} requests/s the whole minute takes about ${(60000 / Number(DOAN[3])).toFixed(1)} s — the real run found An after ${DOAN[1]} tries. A 256-bit token has 1.16e77 candidates: the same formula gives a number larger than the age of the universe.`, `Một phút là 60.000 ứng viên; với ${DOAN[3]} request/giây, cả phút mất khoảng ${(60000 / Number(DOAN[3])).toFixed(1)} giây — lần chạy thật tìm ra An sau ${DOAN[1]} lượt. Token 256 bit có 1,16e77 ứng viên: cùng công thức ra một con số lớn hơn tuổi vũ trụ.`],
  kn: ['guessable identifiers'],
  dau: `/** ⇒ { candidates, worstSeconds, averageSeconds } */
function sessionSearch(windowMs, rate) {
  // Write your solution here
  return { candidates: windowMs / 1000, worstSeconds: 0, averageSeconds: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(sessionSearch),
  cases: [
    { goi: goi('sessionSearch', 60000, Number(DOAN[3])), moTa: ['One minute at the measured rate', 'Một phút với tốc độ đo được'] },
    { goi: goi('sessionSearch', 3600000, Number(DOAN[3])), an: true, moTa: ['One hour', 'Một giờ'] },
    { goi: goi('sessionSearch', 1000, 100), an: true },
    { goi: goi('sessionSearch', 60000, 1), an: true },
  ],
});

/* ── 3. Tự viết: signInResponse (nửa đầu của cách sửa lỗ 2) ── */
function signInResponse(users, email, password) {
  var user = users.find(function (u) { return u.email === email; });
  var ok = !!user && typeof password === 'string' && user.password === password; // plain text only in v0 — Chapter 2 hashes it
  if (!ok) return { status: 401, body: { error: 'Email or password is incorrect' } };
  return { status: 200, body: { userId: user.id } };
}
const U = [{ id: 'usr_1', email: 'an@student.labflow.example', password: 'an-lab-2026' }, { id: 'usr_2', email: 'binh@student.labflow.example', password: '123456' }];
const S3 = jsBai({
  ten: '0.3-3 — Write signInResponse(): one answer for every failure', kho: 'EASY', phut: 8,
  en: `<p>v0 answered <code>No account with that email</code> or <code>Wrong password</code> — real output of the enumeration script:</p>${pre(OUT['03-do-email'].split('\n').slice(1, 4))}<p>Write <code>signInResponse(users, email, password)</code>: success ⇒ <code>{ status: 200, body: { userId } }</code>; <b>every</b> failure (unknown email, wrong password, missing fields) ⇒ <code>{ status: 401, body: { error: 'Email or password is incorrect' } }</code>.</p>`,
  vi: `<p>v0 trả <code>No account with that email</code> hoặc <code>Wrong password</code> — output thật của script dò:</p>${pre(OUT['03-do-email'].split('\n').slice(1, 4))}<p>Viết <code>signInResponse(users, email, password)</code>: thành công ⇒ <code>{ status: 200, body: { userId } }</code>; <b>mọi</b> thất bại (email lạ, sai mật khẩu, thiếu trường) ⇒ <code>{ status: 401, body: { error: 'Email or password is incorrect' } }</code>.</p>`,
  goiY: [['Compute one boolean ok, then branch once.', 'Tính một biến ok duy nhất rồi rẽ nhánh một lần.'], ['A missing password must not match a user whose password is also missing.', 'Thiếu mật khẩu không được khớp với người dùng cũng thiếu mật khẩu.']],
  loi: [['Two returns with two messages — the enumeration oracle again.', 'Hai lệnh return với hai thông báo — lại thành cỗ máy dò tài khoản.'], ['Comparing undefined === undefined and logging in someone without a password.', 'So undefined === undefined và cho đăng nhập người không có mật khẩu.']],
  gt: ['Same status, same body for every failure removes the message oracle. Chapter 6 removes the timing oracle too (both branches must cost the same once passwords are hashed).', 'Cùng mã, cùng body cho mọi thất bại xoá cỗ máy dò bằng thông báo. Chương 6 xoá nốt cỗ máy dò bằng thời gian (khi mật khẩu đã băm, hai nhánh phải tốn như nhau).'],
  kn: ['account enumeration'],
  dau: `/** ⇒ { status, body } */
function signInResponse(users, email, password) {
  // Write your solution here
  var user = users.find(function (u) { return u.email === email; });
  if (!user) return { status: 401, body: { error: 'No account with that email' } };
  if (user.password !== password) return { status: 401, body: { error: 'Wrong password' } };
  return { status: 200, body: { userId: user.id } };
}
`,
  giai: '// Reference solution\n' + nguon(signInResponse),
  cases: [
    { goi: goi('signInResponse', U, 'an@student.labflow.example', 'an-lab-2026') },
    { goi: goi('signInResponse', U, 'minh@student.labflow.example', 'x') },
    { goi: goi('signInResponse', U, 'binh@student.labflow.example', 'x'), an: true },
    { goi: `signInResponse(${JSON.stringify([...U, { id: 'usr_9', email: 'nopw@labflow.example' }])}, 'nopw@labflow.example', undefined)`, an: true },
    { goi: `signInResponse(${JSON.stringify(U)})`, an: true },
  ],
});

/* ── 4. Đọc output dò mật khẩu ── */
const S4 = cs({
  ten: '0.3-4 — Reading the brute-force run', kho: 'EASY', phut: 6,
  en: `Real output of demo0/brute.mjs against v0:${pre(OUT['03-do-mk-binh'])}${pre(OUT['03-do-mk-an'])}`,
  vi: `Output thật của demo0/brute.mjs đánh vào v0:${pre(OUT['03-do-mk-binh'])}${pre(OUT['03-do-mk-an'])}`,
  cau: [
    q('c1', ['What protected An, and what did not?', 'Điều gì bảo vệ An, điều gì không?'],
      ['Only luck: her password was not in this particular list', 'A lock-out: the server locked her account after 5 tries', 'Rate limiting: the server answered 429 after a while', 'HTTPS: the guesses could not be read on the network'],
      [`statuses {"401": ${BRUTE[1]}}: no 429, no lock-out. An is safe only from THIS list; Chapter 10 makes guessing itself expensive.`, `statuses {"401": ${BRUTE[1]}}: không 429, không khoá. An chỉ an toàn trước danh sách NÀY; Chương 10 làm chính việc đoán trở nên đắt.`]),
    q('c2', ['Binh fell at attempt 2. What does that say about password policy?', 'Bình đổ ở lượt thứ 2. Điều đó nói gì về chính sách mật khẩu?'],
      ['Reject passwords found in common and breached lists', 'Require at least 8 characters including a symbol', 'Force every user to change the password monthly', 'Nothing: choosing a weak password is Binh’s right'],
      ['123456 is near the top of every list. Composition rules do not stop it; checking against known-bad lists does.', '123456 nằm gần đầu mọi danh sách. Luật "phải có ký tự đặc biệt" không chặn được nó; kiểm với danh sách mật khẩu xấu thì chặn được.']),
  ],
  goiY: [['Look at the statuses object.', 'Nhìn object statuses.'], ['Which list was used?', 'Đã dùng danh sách nào?']],
  loi: [['Reading “not in the list” as “strong password”.', 'Đọc "not in the list" thành "mật khẩu mạnh".'], ['Thinking 401 slows an attacker down.', 'Tưởng 401 làm chậm kẻ tấn công.']],
  kn: ['online guessing'],
});

export default doiDau({ slug: 'auth-0-3-dang-nhap-sai', ten: '0.3 A login that runs, and is wrong in six ways', khoa: KHOA, baiHoc: 'auth-0-3-dang-nhap-sai', de: [S1, S2, S3, S4] });
