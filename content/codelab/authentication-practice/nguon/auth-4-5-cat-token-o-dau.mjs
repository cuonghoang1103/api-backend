/** Authentication · 4.5 — Cất token ở đâu: đọc output thật (localStorage/cookie trộm được, HttpOnly không); tự viết storageRisk; xếp hạng + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s04/_ma.mjs';

const ST = OUT['45-storage'].split('\n').slice(1);

const S1 = cs({
  ten: '4.5-1 — Where a browser keeps a token: read the real run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.4 in Chromium 156 (real run):${pre(ST)}`,
  vi: `LabFlow ID v0.4 trong Chromium 156 (chạy thật):${pre(ST)}`,
  cau: [
    q('c1', ['The injected script read the localStorage token and the plain cookie, but not the HttpOnly cookie. Why?', 'Script bị tiêm đọc được token localStorage và cookie thường, nhưng không đọc cookie HttpOnly. Vì sao?'],
      ['HttpOnly cookies never appear in document.cookie', 'HttpOnly cookies are stored on disk in an encrypted form', 'localStorage is simply faster for a script to read than cookies', 'The HttpOnly cookie had already expired by the time the script ran'],
      ['HttpOnly takes the cookie off the JavaScript table (3.2); localStorage and non-HttpOnly cookies are readable by any script on the page.', 'HttpOnly gạt cookie khỏi bàn của JavaScript (3.2); localStorage và cookie không HttpOnly thì mọi script trên trang đọc được.']),
    q('c2', ['So should every token go in an HttpOnly cookie?', 'Vậy có nên để mọi token trong một cookie HttpOnly?'],
      ['It stops XSS theft but is auto-sent, so you still need CSRF defence', 'Yes — an HttpOnly cookie is completely safe for storing any token', 'No — an HttpOnly cookie is not able to hold a JWT in the first place', 'Yes — an HttpOnly cookie is immune to both XSS and CSRF attacks'],
      ['HttpOnly trades “a script reads the token” for “another site spends it” (CSRF, Chapter 3). No storage is free; you choose the attack to defend.', 'HttpOnly đánh đổi "một script đọc token" lấy "một site khác tiêu nó" (CSRF, Chương 3). Không chỗ cất nào miễn phí; bạn chọn cú tấn công để chống.']),
    q('c3', ['What is the common safe pattern for the access token?', 'Mẫu an toàn phổ biến cho access token là gì?'],
      ['Keep it in memory and send it as an Authorization: Bearer header', 'Keep it in localStorage for convenience', 'Put it in the URL as a query parameter', 'Store it in a plain, readable cookie'],
      ['A short access token in memory cannot be read by a later-injected script and expires fast; the refresh token goes in an HttpOnly cookie (Chapter 5). A token in a URL leaks via history, logs and Referer.', 'Một access token ngắn trong bộ nhớ không bị một script tiêm sau đọc và hết hạn nhanh; refresh token đi trong một cookie HttpOnly (Chương 5). Một token trong URL rò qua lịch sử, log và Referer.']),
  ],
  goiY: [['document.cookie never shows HttpOnly cookies.', 'document.cookie không bao giờ hiện cookie HttpOnly.'], ['Automatic sending is what enables CSRF.', 'Việc tự gửi là thứ cho phép CSRF.']],
  loi: [['“Just put the JWT in localStorage.”', '"Cứ để JWT trong localStorage."'], ['Passing a token in the URL.', 'Truyền token trong URL.']],
  tns: [tn('HttpOnly cookie'), tn('XSS')],
  kn: ['token storage'],
});

function storageRisk(place) {
  if (place === 'localStorage') return 'XSS';
  if (place === 'plain-cookie') return 'XSS_AND_CSRF';
  if (place === 'httponly-cookie') return 'CSRF';
  if (place === 'memory') return 'LOST_ON_REFRESH';
  return 'UNKNOWN';
}
const S2 = jsBai({
  ten: '4.5-2 — Write storageRisk(place): the main risk of each place', kho: 'EASY', phut: 10,
  en: `<p>Return the main risk for where a browser keeps a token: <code>'localStorage'</code> ⇒ <code>'XSS'</code> (any script reads it); <code>'plain-cookie'</code> ⇒ <code>'XSS_AND_CSRF'</code> (readable AND sent automatically); <code>'httponly-cookie'</code> ⇒ <code>'CSRF'</code> (unreadable but sent automatically); <code>'memory'</code> ⇒ <code>'LOST_ON_REFRESH'</code>; anything else ⇒ <code>'UNKNOWN'</code>.</p>`,
  vi: `<p>Trả về rủi ro chính của nơi trình duyệt cất một token: <code>'localStorage'</code> ⇒ <code>'XSS'</code> (mọi script đọc được); <code>'plain-cookie'</code> ⇒ <code>'XSS_AND_CSRF'</code> (đọc được VÀ tự gửi); <code>'httponly-cookie'</code> ⇒ <code>'CSRF'</code> (không đọc được nhưng tự gửi); <code>'memory'</code> ⇒ <code>'LOST_ON_REFRESH'</code>; còn lại ⇒ <code>'UNKNOWN'</code>.</p>`,
  goiY: [['Readable by a script ⇒ XSS; sent automatically ⇒ CSRF.', 'Script đọc được ⇒ XSS; tự gửi ⇒ CSRF.'], ['A plain cookie has both problems.', 'Một cookie thường có cả hai vấn đề.']],
  loi: [['Thinking an HttpOnly cookie has no risk.', 'Tưởng một cookie HttpOnly không rủi ro.'], ['Forgetting that a plain cookie is readable AND auto-sent.', 'Quên rằng một cookie thường vừa đọc được vừa tự gửi.']],
  gt: ['Readable-by-script is the XSS surface; sent-by-the-browser is the CSRF surface. localStorage has the first, an HttpOnly cookie the second, a plain cookie both, and memory neither but it forgets on refresh (4.5).', 'Đọc-được-bởi-script là bề mặt XSS; được-trình-duyệt-gửi là bề mặt CSRF. localStorage có cái đầu, cookie HttpOnly có cái sau, cookie thường có cả hai, và bộ nhớ không cái nào nhưng quên khi tải lại (4.5).'],
  kn: ['token storage'], tns: [tn('XSS'), tn('CSRF')],
  dau: `/** ⇒ 'XSS' | 'XSS_AND_CSRF' | 'CSRF' | 'LOST_ON_REFRESH' | 'UNKNOWN' */
function storageRisk(place) {
  // Write your solution here
  if (place === 'localStorage') return 'XSS';
  return 'CSRF';
}
`,
  giai: '// Reference solution\n' + nguon(storageRisk),
  cases: [
    { goi: goi('storageRisk', 'localStorage'), moTa: ['localStorage', 'localStorage'] },
    { goi: goi('storageRisk', 'plain-cookie'), an: true, moTa: ['plain cookie', 'cookie thường'] },
    { goi: goi('storageRisk', 'httponly-cookie'), an: true, moTa: ['HttpOnly cookie', 'cookie HttpOnly'] },
    { goi: goi('storageRisk', 'memory'), an: true, moTa: ['in memory', 'trong bộ nhớ'] },
    { goi: goi('storageRisk', 'the-url'), an: true, moTa: ['unknown place', 'nơi lạ'] },
  ],
});

const S3 = cs({
  ten: '4.5-3 — Rank the places by exposure to an injected script', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order from MOST readable by an injected script to LEAST.',
  vi: 'Xếp từ ĐỌC ĐƯỢC NHẤT bởi một script bị tiêm tới ÍT NHẤT.',
  cau: [ord('o1', ['Most → least readable by a script', 'Đọc được nhiều → ít nhất'], [
    'localStorage (any script reads it, survives refresh)',
    'a plain cookie (readable in document.cookie)',
    'an in-memory variable (only the running page, not a later script)',
    'an HttpOnly cookie (never in document.cookie)',
  ], ['localStorage and a plain cookie are both fully readable; a memory variable is readable only within the same page load; an HttpOnly cookie is never readable by any script (4.5).', 'localStorage và một cookie thường đều đọc được hoàn toàn; một biến bộ nhớ chỉ đọc được trong cùng lần tải trang; một cookie HttpOnly không bao giờ đọc được bởi script nào (4.5).'])],
  goiY: [['Which survive a refresh AND are readable?', 'Cái nào sống qua tải lại VÀ đọc được?'], ['HttpOnly is the one a script can never see.', 'HttpOnly là cái một script không bao giờ thấy.']],
  loi: [['Ranking HttpOnly as readable.', 'Xếp HttpOnly là đọc được.'], ['Thinking memory is as exposed as localStorage.', 'Tưởng bộ nhớ phơi ra như localStorage.']],
  tns: [tn('in-memory token', 'token trong bộ nhớ')],
  kn: ['token storage'],
});

const PROP = ['readable by any script; survives refresh', 'readable by a script AND sent automatically', 'unreadable by a script, lost on refresh', 'unreadable by a script, but sent automatically'];
const S4 = cs({
  ten: '4.5-4 — Each place and its properties', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each storage place with its properties.',
  vi: 'Ghép mỗi nơi cất với các tính chất của nó.',
  bang: [bang1('b1', ['Place → properties', 'Nơi → tính chất'], [{ ma: 'x', ten: 'Place' }, { ma: 'q', ten: 'Properties', luaChon: PROP }], [
    { o: { x: 'localStorage' }, a: { q: 'readable by any script; survives refresh' } },
    { o: { x: 'plain cookie' }, a: { q: 'readable by a script AND sent automatically' } },
    { o: { x: 'in-memory variable' }, a: { q: 'unreadable by a script, lost on refresh' } },
    { o: { x: 'HttpOnly cookie' }, a: { q: 'unreadable by a script, but sent automatically' } },
  ], ['Readable-by-script is the XSS surface; sent-automatically is the CSRF surface. The safe pattern puts the short access token in memory and the refresh token in an HttpOnly cookie (4.5).', 'Đọc-được-bởi-script là bề mặt XSS; tự-gửi là bề mặt CSRF. Mẫu an toàn đặt access token ngắn trong bộ nhớ và refresh token trong một cookie HttpOnly (4.5).'])],
  goiY: [['Two columns: can a script read it, and is it auto-sent.', 'Hai cột: script đọc được không, và có tự gửi không.'], ['Memory forgets on refresh.', 'Bộ nhớ quên khi tải lại.']],
  loi: [['Thinking a plain cookie is only a CSRF risk.', 'Tưởng một cookie thường chỉ là rủi ro CSRF.'], ['Thinking memory is sent automatically.', 'Tưởng bộ nhớ tự gửi.']],
  kn: ['token storage'],
});

export default doiDau({ slug: 'auth-4-5-cat-token-o-dau', ten: '4.5 Where to keep a token', khoa: KHOA, baiHoc: 'auth-4-5-cat-token-o-dau', de: [S1, S2, S3, S4] });
