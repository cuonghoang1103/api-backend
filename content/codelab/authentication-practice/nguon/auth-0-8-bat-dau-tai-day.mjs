/** Authentication · Bắt đầu tại đây (1/2) — từ hay nhầm, thẻ có đóng dấu (HMAC 12 dòng chạy thật), lịch sử, tự viết checkCard. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s00/_ma.mjs';

/* ── 1. Những cặp từ hay nhầm ── */
const TU = ['authentication', 'authorization', 'identification', 'encoding', 'encryption', 'hashing', 'session', 'token'];
const S1 = cs({
  ten: 'Start 1 — The words people mix up', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Every row describes one idea from the “Start here” lesson. Pick the word it describes.',
  vi: 'Mỗi dòng mô tả một ý trong bài "Bắt đầu tại đây". Chọn từ đúng với mô tả.',
  bang: [bang1('b1', ['Description → word', 'Mô tả → từ'], [{ ma: 'x', ten: 'Description' }, { ma: 'w', ten: 'Word', luaChon: TU }], [
    { o: { x: 'Typing an email address into the login form: a claim, not yet a proof' }, a: { w: 'identification' } },
    { o: { x: 'Checking the password (or passkey) that proves the claim' }, a: { w: 'authentication' } },
    { o: { x: 'Deciding whether An may cancel Binh’s booking' }, a: { w: 'authorization' } },
    { o: { x: 'base64url: anyone can turn it back, no key involved' }, a: { w: 'encoding' } },
    { o: { x: 'AES-GCM: only the key holder can read it back' }, a: { w: 'encryption' } },
    { o: { x: 'SHA-256 / argon2: one-way, cannot be turned back at all' }, a: { w: 'hashing' } },
    { o: { x: 'A random id the server looks up in its own table on every request' }, a: { w: 'session' } },
    { o: { x: 'A signed string that carries its own claims and is checked without a lookup' }, a: { w: 'token' } },
  ], ['Identification is a claim; authentication proves it; authorization decides what the proven user may do. Encoding hides nothing, encryption hides from everyone without the key, hashing cannot be reversed. A session is looked up; a (signed) token is verified.', 'Định danh là lời khai; xác thực là chứng minh lời khai; phân quyền quyết định người đã chứng minh được làm gì. Mã hoá dạng (encoding) không giấu gì, mã hoá (encryption) giấu với ai không có khoá, băm thì không đảo ngược được. Phiên thì phải tra; token (có ký) thì được kiểm chữ ký.'])],
  goiY: [['Ask: does this step need a key? Can it be reversed?', 'Hỏi: bước này có cần khoá không? Có đảo ngược được không?'], ['“Who are you?” vs “prove it” vs “may you?”', '"Bạn là ai?" — "chứng minh đi" — "bạn có được phép?"']],
  loi: [['Calling base64 “encryption”: a JWT payload is readable by anyone.', 'Gọi base64 là "mã hoá": payload của JWT ai cũng đọc được.'], ['Treating “logged in” as “allowed”: that is the authentication/authorization mix-up behind IDOR.', 'Coi "đã đăng nhập" là "được phép": đó chính là nhầm xác thực/phân quyền dẫn tới IDOR.']],
  tns: [tn('authentication', 'xác thực'), tn('authorization', 'phân quyền'), tn('encoding', 'mã hoá dạng (không bí mật)'), tn('hashing', 'băm')],
  kn: ['vocabulary'],
});

/* ── 2. Thẻ có đóng dấu — output thật ── */
const S2 = cs({
  ten: 'Start 2 — A card the server stamped', kho: 'EASY', phut: 8,
  en: `The first program of the course (demo0/first-proof.mjs, 12 lines of HMAC) printed, for real:${pre(OUT['08-chung-minh-dau-tien'])}and the practice (demo0/th08.mjs):${pre(OUT['08-thuc-hanh'])}`,
  vi: `Chương trình đầu tiên của khoá (demo0/first-proof.mjs, 12 dòng HMAC) đã thật sự in ra:${pre(OUT['08-chung-minh-dau-tien'])}và bài thực hành (demo0/th08.mjs):${pre(OUT['08-thuc-hanh'])}`,
  cau: [
    q('c1', ['Why does “An edits the role” print null?', 'Vì sao dòng "An edits the role" in null?'],
      ['The edited text needs a new stamp, and only the key makes stamps', 'Roles are frozen once the server has issued a card', 'The card expired while An was busy editing it', 'The server looked the card up in its list of issued cards'],
      ['The server recomputes the stamp for the text it receives. Without the key, An cannot produce the stamp for “MANAGER”. Nothing is remembered — the check is pure computation.', 'Máy chủ tính lại con dấu cho đoạn chữ nó nhận. Không có khoá, An không tạo được con dấu cho "MANAGER". Máy chủ chẳng nhớ gì — phép kiểm chỉ là tính toán.']),
    q('c2', ['“old card, new key: null”. What does that mean for real servers?', '"old card, new key: null". Điều đó nghĩa là gì với máy chủ thật?'],
      ['Changing the signing key invalidates every card ever issued — useful after a leak, painful by accident', 'Old cards stay valid forever', 'Only Binh’s card is affected', 'The new key can read the old cards but not write new ones'],
      ['The stamp depends on the key. Rotate the key and all outstanding cards fail at once — which is why Chapter 11 keeps two keys alive during a rotation.', 'Con dấu phụ thuộc khoá. Đổi khoá thì mọi thẻ đang lưu hành hỏng cùng lúc — vì thế Chương 11 giữ hai khoá sống khi xoay khoá.']),
    q('c3', ['Can An READ what is inside her card?', 'An có ĐỌC được bên trong thẻ của mình không?'],
      ['Yes: the stamp stops changes, not reading', 'No: the HMAC stamp encrypts the whole card', 'Only if she also knows the server key', 'Only after decoding it with the server key'],
      ['A MAC gives integrity, not secrecy. Never put secrets inside a signed value (lesson 1.4).', 'MAC cho tính toàn vẹn, không cho bí mật. Đừng bao giờ để bí mật bên trong một giá trị có ký (bài 1.4).']),
  ],
  goiY: [['The stamp is a function of (key, text).', 'Con dấu là hàm của (khoá, đoạn chữ).'], ['Changing either input changes the stamp.', 'Đổi bất kỳ đầu vào nào thì con dấu đổi.']],
  loi: [['Thinking the server stores cards to compare them.', 'Tưởng máy chủ lưu các thẻ để so.'], ['Thinking a signed value is secret.', 'Tưởng giá trị có ký là bí mật.']],
  tns: [tn('HMAC', 'mã xác thực thông điệp có khoá'), tn('integrity', 'tính toàn vẹn')],
  kn: ['HMAC'],
});

/* ── 3. Lịch sử ── */
const S3 = cs({
  ten: 'Start 3 — Put the history in order', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Six milestones of authentication on the web. Put them in the order they happened.',
  vi: 'Sáu mốc của xác thực trên web. Sắp chúng theo thứ tự thời gian.',
  cau: [ord('o1', ['Oldest first', 'Cũ nhất trước'], [
    'MIT’s CTSS time-sharing system asks users for passwords (early 1960s)',
    'Morris and Thompson publish “Password Security: A Case History” about Unix password hashing (1979)',
    'Netscape adds cookies to the browser (1994)',
    'OAuth 2.0 is published as RFC 6749 (2012)',
    'JSON Web Token is published as RFC 7519 (2015)',
    'Web Authentication (WebAuthn) Level 1 becomes a W3C Recommendation (2019)',
  ], ['Passwords are older than the web; storing them as hashes came with Unix; cookies gave HTTP a memory; OAuth and JWT standardised tokens; WebAuthn (passkeys) is the first mainstream login without a shared secret.', 'Mật khẩu có trước cả web; lưu chúng dạng băm đến cùng Unix; cookie cho HTTP trí nhớ; OAuth và JWT chuẩn hoá token; WebAuthn (passkey) là cách đăng nhập phổ biến đầu tiên không cần bí mật dùng chung.'])],
  goiY: [['Mainframes came before browsers, browsers before tokens.', 'Máy tính lớn có trước trình duyệt, trình duyệt có trước token.'], ['RFC numbers grow with time: 6749 < 7519.', 'Số RFC tăng theo thời gian: 6749 < 7519.']],
  loi: [['Putting JWT before OAuth 2.0 — OAuth 2.0 came first.', 'Đặt JWT trước OAuth 2.0 — OAuth 2.0 ra trước.'], ['Thinking passkeys are older than cookies.', 'Tưởng passkey có trước cookie.']],
  tns: [tn('RFC', 'tài liệu chuẩn của IETF')],
  kn: ['history'],
});

/* ── 4. Tự viết: checkCard ── */
function checkCard(card, stamp) {
  if (typeof card !== 'string') return null;
  var i = card.lastIndexOf('.');            // the value itself may contain dots
  if (i <= 0) return null;
  var value = card.slice(0, i);
  var given = card.slice(i + 1);
  var expected = stamp(value);
  if (given.length !== expected.length) return null;
  var diff = 0;                             // compare every character (lesson 1.3)
  for (var k = 0; k < expected.length; k++) diff |= given.charCodeAt(k) ^ expected.charCodeAt(k);
  return diff === 0 ? value : null;
}
// A toy stamp so the exercise runs anywhere (the real one is HMAC-SHA256 — lesson 1.4).
const TOY = 'function (v) { var h = 7; for (var i = 0; i < v.length; i++) h = (h * 31 + v.charCodeAt(i)) % 1000003; return "s" + h.toString(36); }';
const g = (card) => `checkCard(${JSON.stringify(card)}, ${TOY})`;
const S4 = jsBai({
  ten: 'Start 4 — Write checkCard(card, stamp)', kho: 'MEDIUM', phut: 15,
  en: `<p>A card is <code>&lt;value&gt;.&lt;stamp&gt;</code>. The value itself may contain dots (<code>user=An;v=1.2</code>), so the stamp is what follows the <b>last</b> dot. <code>stamp(value)</code> is given to you (a toy function here; HMAC in the real server). Return the value if the stamp fits, otherwise <code>null</code>. Also return <code>null</code> for non-strings, cards without a dot, or an empty value.</p>`,
  vi: `<p>Một thẻ có dạng <code>&lt;giá trị&gt;.&lt;con dấu&gt;</code>. Bản thân giá trị có thể chứa dấu chấm (<code>user=An;v=1.2</code>), nên con dấu là phần sau dấu chấm <b>cuối cùng</b>. Hàm <code>stamp(value)</code> được cho sẵn (ở đây là hàm đồ chơi; máy chủ thật dùng HMAC). Trả về giá trị nếu con dấu khớp, ngược lại <code>null</code>. Cũng trả <code>null</code> khi không phải chuỗi, không có dấu chấm, hoặc giá trị rỗng.</p>`,
  dauVao: ['card — string (or anything); stamp — function(value) ⇒ string', 'card — chuỗi (hoặc bất kỳ); stamp — hàm(value) ⇒ chuỗi'],
  dauRa: ['the value, or null', 'giá trị, hoặc null'],
  goiY: [['lastIndexOf, not indexOf or split.', 'Dùng lastIndexOf, không phải indexOf hay split.'], ['Compare lengths first, then every character (no early exit).', 'So độ dài trước, rồi so mọi ký tự (không thoát sớm).']],
  loi: [['card.split(".") — breaks when the value contains a dot.', 'card.split(".") — hỏng khi giá trị có dấu chấm.'], ['Returning the value when the stamp is missing (stamp is "").', 'Trả giá trị khi thiếu con dấu (con dấu rỗng).']],
  gt: ['The server never stores cards: it recomputes the stamp for the value it receives and compares. lastIndexOf keeps dots inside the value; the XOR loop looks at every character so the time does not reveal how much of a forged stamp was right.', 'Máy chủ không lưu thẻ: nó tính lại con dấu cho giá trị nhận được rồi so. lastIndexOf giữ được dấu chấm trong giá trị; vòng XOR xem hết mọi ký tự nên thời gian không khai ra con dấu giả đúng được bao nhiêu.'],
  kn: ['signed value', 'constant-time comparison'],
  tns: [tn('stamp / tag', 'con dấu / thẻ xác thực')],
  dau: `/** card: "<value>.<stamp>", stamp: function(value) ⇒ string. Return value or null. */
function checkCard(card, stamp) {
  // Write your solution here
  var parts = card.split('.');
  return stamp(parts[0]) === parts[1] ? parts[0] : null;
}
`,
  giai: '// Reference solution\n' + nguon(checkCard),
  cases: [
    { goi: `(function () { var s = ${TOY}; var v = 'user=An;role=STUDENT'; return checkCard(v + '.' + s(v), s); })()`, moTa: ['An’s honest card', 'Thẻ trung thực của An'] },
    { goi: `(function () { var s = ${TOY}; var v = 'user=An;role=STUDENT'; return checkCard((v + '.' + s(v)).replace('STUDENT', 'MANAGER'), s); })()`, moTa: ['An edits her role', 'An sửa vai trò'] },
    { goi: `(function () { var s = ${TOY}; var v = 'user=An;v=1.2'; return checkCard(v + '.' + s(v), s); })()`, an: true, moTa: ['A value that contains a dot', 'Giá trị có dấu chấm'] },
    { goi: g('user=Binh;role=MANAGER.sxyz'), an: true },
    { goi: g('no-dot-at-all'), an: true },
    { goi: `(function () { var s = ${TOY}; return checkCard('.' + s(''), s); })()`, an: true, moTa: ['Empty value', 'Giá trị rỗng'] },
    { goi: `checkCard(42, ${TOY})`, an: true },
    { goi: `(function () { var s = ${TOY}; return checkCard('user=An.', s); })()`, an: true, moTa: ['Missing stamp', 'Thiếu con dấu'] },
  ],
});

export default doiDau({ slug: 'auth-0-8-bat-dau-tai-day', ten: 'Start here 1/2 — What authentication is', khoa: KHOA, baiHoc: 'auth-0-8-bat-dau-tai-day', de: [S1, S2, S3, S4] });
