/** Authentication · 10.3 — Session theft: four channels; write stolenByXss(store) over token storage. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '10.3-1 — A stolen session is you', kho: 'EASY', phut: 8,
  en: 'A stolen session cookie IS the user — no password, no second factor. Four channels steal it; where you keep the token decides which can reach it.',
  vi: 'Một cookie phiên bị trộm CHÍNH LÀ người dùng — không mật khẩu, không yếu tố thứ hai. Bốn kênh trộm nó; nơi bạn giữ token quyết định kênh nào với tới.',
  cau: [
    q('c1', ['What does the HttpOnly cookie flag protect against?', 'Cờ cookie HttpOnly bảo vệ trước cái gì?'],
      ['XSS reading the cookie — JavaScript cannot see an HttpOnly cookie, so injected script cannot exfiltrate it', 'The cookie being accidentally transmitted over plain HTTP instead of an encrypted HTTPS connection', 'The cookie growing too large for the browser to store and send it back on subsequent requests', 'The server being able to read the cookie value on every single request the browser makes to it'],
      ['HttpOnly hides the cookie from JavaScript, closing the XSS theft channel (10.3).', 'HttpOnly giấu cookie khỏi JavaScript, đóng kênh trộm XSS (10.3).']),
    q('c2', ['Why is localStorage the worst place for a session token?', 'Vì sao localStorage là chỗ tệ nhất cho một token phiên?'],
      ['It is JavaScript-readable by design, so a single XSS anywhere on the origin exfiltrates it, and it persists on disk', 'It has such a small storage size limit that it silently truncates any reasonably long session token', 'It is automatically shared across every single website the user visits, leaking the token everywhere', 'It is wiped every time the browser tab is closed, which would log the user out far too aggressively'],
      ['localStorage is always JS-readable; one XSS reads it, and HttpOnly cannot help it (10.3).', 'localStorage luôn đọc-được-bằng-JS; một XSS đọc nó, và HttpOnly không giúp được (10.3).']),
    q('c3', ['A token is placed in the URL. Which theft channel does that open?', 'Một token được đặt trong URL. Điều đó mở kênh trộm nào?'],
      ['Logs and the Referer header — the token leaks to server logs, browser history and the Referer', 'Only the network sniffing channel, and only in the case where the connection is not protected by TLS', 'None at all, because URLs are fully protected from leaking by the browser\'s same-origin security policy', 'Only the device channel, through a copy of the token left behind in the browser\'s on-disk page cache'],
      ['A URL token leaks to logs, history and Referer (Chapter 1); keep tokens in cookies, never URLs (10.3).', 'Một token URL rò vào log, lịch sử và Referer (Chương 1); giữ token trong cookie, không bao giờ URL (10.3).']),
  ],
  goiY: [['HttpOnly is a cookie flag; it does nothing for localStorage.', 'HttpOnly là một cờ cookie; nó không làm gì cho localStorage.'], ['A URL is logged, cached and sent in Referer.', 'Một URL bị log, cache và gửi trong Referer.']],
  loi: [['Thinking localStorage is safe with HttpOnly.', 'Tưởng localStorage an toàn với HttpOnly.'], ['Putting a token in a URL.', 'Đặt một token trong một URL.']],
  tns: [tn('HttpOnly', 'HttpOnly'), tn('session theft', 'cắp phiên')],
  kn: ['authentication'],
});

function stolenByXss(store) {
  // XSS = injected JavaScript. It reads whatever JS can reach: localStorage, and any cookie NOT marked HttpOnly.
  if (store === 'localStorage') return true;
  if (store === 'cookie-js') return true;         // a JS-readable cookie (no HttpOnly)
  if (store === 'url') return true;               // token in the page URL is readable by script
  if (store === 'cookie-httponly') return false;  // HttpOnly: invisible to JavaScript
  return true;                                    // unknown store: assume reachable
}
const S2 = jsBai({
  ten: '10.3-2 — Write stolenByXss(store): can injected JS read the token?', kho: 'EASY', phut: 8,
  en: `<p>Return <code>true</code> if an XSS (injected JavaScript) can read a session token kept in <code>store</code>: <code>'localStorage'</code>, a JS-readable <code>'cookie-js'</code>, and a <code>'url'</code> token are all readable (⇒ <code>true</code>); a <code>'cookie-httponly'</code> is invisible to JavaScript (⇒ <code>false</code>). An unknown store ⇒ <code>true</code>.</p>`,
  vi: `<p>Trả <code>true</code> nếu một XSS (JavaScript tiêm vào) đọc được một token phiên giữ trong <code>store</code>: <code>'localStorage'</code>, một <code>'cookie-js'</code> đọc-được-bằng-JS, và một token <code>'url'</code> đều đọc được (⇒ <code>true</code>); một <code>'cookie-httponly'</code> vô hình với JavaScript (⇒ <code>false</code>). Một store lạ ⇒ <code>true</code>.</p>`,
  goiY: [['Only the HttpOnly cookie is invisible to JavaScript.', 'Chỉ cookie HttpOnly vô hình với JavaScript.'], ['localStorage and a JS-readable cookie are both reachable.', 'localStorage và một cookie đọc-được-bằng-JS đều với tới.']],
  loi: [['Returning false for localStorage.', 'Trả false cho localStorage.'], ['Returning true for an HttpOnly cookie.', 'Trả true cho một cookie HttpOnly.']],
  gt: ['XSS reads whatever JavaScript can reach; only the HttpOnly cookie is hidden from it (10.3).', 'XSS đọc bất cứ gì JavaScript với tới; chỉ cookie HttpOnly bị giấu khỏi nó (10.3).'],
  kn: ['authentication'], tns: [tn('XSS', 'XSS')],
  dau: `/** ⇒ true if injected JavaScript (XSS) can read a token kept in store */
function stolenByXss(store) {
  // Write your solution here
  return false;
}
`,
  giai: '// Reference solution\n' + nguon(stolenByXss),
  cases: [
    { goi: goi('stolenByXss', 'cookie-httponly'), moTa: ['HttpOnly cookie ⇒ false', 'cookie HttpOnly ⇒ false'] },
    { goi: goi('stolenByXss', 'localStorage'), an: true, moTa: ['localStorage ⇒ true', 'localStorage ⇒ true'] },
    { goi: goi('stolenByXss', 'cookie-js'), an: true, moTa: ['JS-readable cookie ⇒ true', 'cookie đọc-được-JS ⇒ true'] },
    { goi: goi('stolenByXss', 'url'), an: true, moTa: ['token in URL ⇒ true', 'token trong URL ⇒ true'] },
  ],
});

const S3 = cs({
  ten: '10.3-3 — Channel → what closes it', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each session-theft channel to the control that closes it.',
  vi: 'Ghép mỗi kênh cắp phiên với control đóng nó.',
  bang: [bang1('b1', ['Channel → closed by', 'Kênh → đóng bởi'], [{ ma: 'x', ten: 'Channel' }, { ma: 'q', ten: 'Closed by', luaChon: ['HttpOnly', 'Secure + HTTPS', 'short TTL + device binding', 'cookies not URLs; redact logs'] }], [
    { o: { x: 'XSS' }, a: { q: 'HttpOnly' } },
    { o: { x: 'network sniff' }, a: { q: 'Secure + HTTPS' } },
    { o: { x: 'malware / shared machine' }, a: { q: 'short TTL + device binding' } },
    { o: { x: 'logs / URLs' }, a: { q: 'cookies not URLs; redact logs' } },
  ], ['HttpOnly for XSS, Secure for the network, short TTL/binding for the device, cookies-not-URLs for logs (10.3).', 'HttpOnly cho XSS, Secure cho mạng, TTL ngắn/gắn cho thiết bị, cookie-không-URL cho log (10.3).'])],
  goiY: [['One channel cannot be fully prevented, only shrunk.', 'Một kênh không ngăn hết được, chỉ thu nhỏ.'], ['The URL channel is about where the token travels.', 'Kênh URL về nơi token đi qua.']],
  loi: [['Thinking HttpOnly closes the network channel.', 'Tưởng HttpOnly đóng kênh mạng.'], ['Thinking Secure stops XSS.', 'Tưởng Secure chặn XSS.']],
  tns: [tn('Secure', 'Secure')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-10-3-cap-phien', ten: '10.3 Session theft', khoa: KHOA, baiHoc: 'auth-10-3-cap-phien', de: [S1, S2, S3] });
