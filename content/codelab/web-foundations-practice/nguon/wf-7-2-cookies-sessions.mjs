/** Bộ luyện bài 7.2 — Cookie và phiên. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Đọc header Cookie, dựng/đọc Set-Cookie, kho phiên có hạn + đăng xuất mọi nơi, luật SameSite của trình duyệt, chặn CSRF. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 7.2 — Cookie và phiên.</em> Các bài dựng lại từng mảnh mà app 80 dòng của bài (và <code>express-session</code>) làm.</p>';

export default doiDau({
  slug: 'wf-7-2-cookies-sessions',
  ten: '7.2 Cookie và phiên',
  baiHoc: 'Nền tảng Web — Bài 7.2 Cookies and sessions',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Đọc header Cookie, dựng Set-Cookie đúng thứ tự cờ, đọc ngược Set-Cookie, kho phiên có hạn dùng và "đăng xuất mọi thiết bị", mô phỏng luật SameSite Strict/Lax/None của trình duyệt, và kiểm CSRF bằng Origin + token — 6 bài.',
  de: [
    {
      tieuDe: 'Đọc header Cookie',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['header Cookie', 'decodeURIComponent'], tienQuyet: ['split', 'object'], the: ['javascript', 'cookie'],
      moTa: `${BAI}<p>Viết ${c('parseCookies(header)')} cho header ${c('Cookie')} mà trình duyệt gửi, ví dụ ${c('sid=abc123; theme=dark')}. Trả object tên → giá trị: tách theo ${c(';')}, trim; tách tên/giá trị ở dấu ${c('=')} ĐẦU TIÊN; giá trị được ${c('decodeURIComponent')} (giải mã hỏng thì giữ nguyên); bỏ mục không có ${c('=')} hoặc tên rỗng; tên lặp ⇒ giữ giá trị ĐẦU TIÊN (trình duyệt gửi cookie cụ thể hơn trước). Vắng/rỗng ⇒ ${c('{}')}.</p>`,
      yeuCau: ['Tách ở "=" đầu tiên (giá trị base64 có "=").', 'Giải mã an toàn.', 'Tên lặp giữ giá trị đầu.'],
      dauVao: 'header: string | undefined.', dauRa: 'object.',
      rangBuoc: ['Không dùng thư viện cookie của npm.'],
      viDu: [{ input: 'parseCookies("sid=abc; theme=dark")', output: '{ sid: "abc", theme: "dark" }', explanation: 'Đúng thứ app của bài làm ở parseCookies.' }],
      goiY: ['const i = part.indexOf("="); if (i <= 0) continue;', 'try { v = decodeURIComponent(v); } catch {}'],
      khoiDau: { 'main.js': `// Bài 7.2 — đọc header Cookie
function parseCookies(header) {
  return Object.fromEntries(header.split('; ').map((p) => p.split('=')));
}
` },
      loiGiai: { 'main.js': `// Bài 7.2 — "a=1; b=2" → { a: "1", b: "2" }; tách ở "=" đầu, giải mã an toàn
function parseCookies(header) {
  const out = {};
  for (const raw of (header ?? '').split(';')) {
    const part = raw.trim();
    const i = part.indexOf('=');
    if (i <= 0) continue;                                    // không có "=" hoặc tên rỗng
    const name = part.slice(0, i).trim();
    let value = part.slice(i + 1).trim();
    try { value = decodeURIComponent(value); } catch { /* giữ nguyên chuỗi hỏng */ }
    if (!(name in out)) out[name] = value;                   // tên lặp: giữ cái đầu
  }
  return out;
}
` },
      giaiThich: `<p>App ở bài dùng một dòng ${c('Object.fromEntries(… split("="))')} — đủ cho id phiên base64url, nhưng hỏng với giá trị có ${c('=')} (base64 thường) hay ký tự mã hoá. Thư viện ${c('cookie')} của npm (Express dùng) làm đúng những việc trong bài này.</p>`,
      loiHayGap: ['split("=") cắt mất phần sau dấu = thứ hai.', 'decodeURIComponent ném URIError với "%E0%A4%A".', 'Header vắng ⇒ TypeError.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cookie',
      kiem: [
        { moTa: 'Basic header|||Header cơ bản', goi: 'parseCookies("sid=abc123; theme=dark")', mongDoi: { sid: 'abc123', theme: 'dark' } },
        { moTa: '= inside values, decoding, junk|||Dấu = trong giá trị, giải mã, rác', goi: 'parseCookies("token=YWJj==; name=%C4%90%E1%BB%A9c; junk; =x;  bad=%E0%A4%A ")', mongDoi: { token: 'YWJj==', name: 'Đức', bad: '%E0%A4%A' } },
        { moTa: 'Duplicates keep the first; empty header|||Tên lặp giữ cái đầu; header rỗng', goi: '[parseCookies("a=1; a=2"), parseCookies(""), parseCookies(undefined)]', mongDoi: [{ a: '1' }, {}, {}] },
      ],
    },
    {
      tieuDe: 'Dựng Set-Cookie',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['Set-Cookie', 'HttpOnly', 'SameSite', 'Max-Age'], tienQuyet: ['mảng', 'join'], the: ['javascript', 'cookie'],
      moTa: `${BAI}<p>Viết ${c('serializeCookie(name, value, opts = {})')} trả giá trị header ${c('Set-Cookie')}: ${c('name=<encodeURIComponent(value)>')}, rồi các thuộc tính theo ĐÚNG thứ tự ${c('HttpOnly')}, ${c('Secure')}, ${c('SameSite=<…>')}, ${c('Path=<…>')}, ${c('Max-Age=<…>')}, nối bằng ${c('"; "')}, chỉ thêm khi có trong ${c('opts')} (${c('httpOnly')}, ${c('secure')}: boolean; ${c('sameSite')}: ${c('"Strict" | "Lax" | "None"')}; ${c('path')}; ${c('maxAge')}: số giây, kể cả 0). ${c('sameSite: "None"')} mà thiếu ${c('secure')} ⇒ ném ${c('TypeError')} (trình duyệt sẽ từ chối cookie đó).</p>`,
      yeuCau: ['Thứ tự cờ cố định.', 'maxAge 0 vẫn in (dùng để xoá cookie).', 'None không Secure ⇒ TypeError.'],
      dauVao: 'name, value: string; opts?: object.', dauRa: 'string.',
      rangBuoc: ['Không cần Domain hay Expires.'],
      viDu: [{ input: 'serializeCookie("sid", "abc", { httpOnly: true, sameSite: "Lax", path: "/", maxAge: 3600 })', output: '"sid=abc; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600"', explanation: 'Đúng header app của bài gửi.' }],
      goiY: ['const parts = [name + "=" + encodeURIComponent(value)];', 'if (opts.maxAge !== undefined) parts.push("Max-Age=" + opts.maxAge);'],
      khoiDau: { 'main.js': `// Bài 7.2 — dựng Set-Cookie
function serializeCookie(name, value, opts = {}) {
  let s = name + '=' + value;
  if (opts.maxAge) s += '; Max-Age=' + opts.maxAge;
  return s;
}
` },
      loiGiai: { 'main.js': `// Bài 7.2 — tên=giá trị rồi các cờ theo thứ tự cố định
function serializeCookie(name, value, opts = {}) {
  if (opts.sameSite === 'None' && !opts.secure) {
    throw new TypeError('SameSite=None requires Secure');  // trình duyệt từ chối cookie này
  }
  const parts = [name + '=' + encodeURIComponent(value)];
  if (opts.httpOnly) parts.push('HttpOnly');
  if (opts.secure) parts.push('Secure');
  if (opts.sameSite) parts.push('SameSite=' + opts.sameSite);
  if (opts.path) parts.push('Path=' + opts.path);
  if (opts.maxAge !== undefined) parts.push('Max-Age=' + opts.maxAge);   // 0 nghĩa là "xoá ngay"
  return parts.join('; ');
}
` },
      giaiThich: `<p>${c('if (opts.maxAge)')} là lỗi kinh điển: 0 là falsy nên cookie đăng xuất không bao giờ nhận ${c('Max-Age=0')} và trình duyệt cứ giữ nó. Mã hoá giá trị tránh cho dấu ${c(';')} hay dấu cách phá header.</p>`,
      loiHayGap: ['if (opts.maxAge) bỏ mất Max-Age=0.', 'Không mã hoá giá trị có ";".', 'Cho phép SameSite=None không Secure.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie',
      kiem: [
        { moTa: 'The lesson cookie|||Cookie của bài', goi: 'serializeCookie("sid", "abc", { httpOnly: true, sameSite: "Lax", path: "/", maxAge: 3600 })', mongDoi: 'sid=abc; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600' },
        { moTa: 'Logout cookie: Max-Age=0; value encoded|||Cookie đăng xuất: Max-Age=0; giá trị được mã hoá', goi: '[serializeCookie("sid", "", { httpOnly: true, path: "/", maxAge: 0 }), serializeCookie("note", "a; b")]', mongDoi: ['sid=; HttpOnly; Path=/; Max-Age=0', 'note=a%3B%20b'] },
        { moTa: 'Fixed order; None needs Secure|||Thứ tự cố định; None cần Secure', goi: 'serializeCookie("x", "1", { maxAge: 60, path: "/a", sameSite: "None", secure: true, httpOnly: true })', mongDoi: 'x=1; HttpOnly; Secure; SameSite=None; Path=/a; Max-Age=60' },
        { moTa: 'SameSite=None without Secure throws|||SameSite=None không Secure thì ném lỗi', goi: 'serializeCookie("x", "1", { sameSite: "None" })', mongDoi: { loi: 'TypeError' } },
      ],
    },
    {
      tieuDe: 'Đọc ngược Set-Cookie',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['thuộc tính cookie', 'mặc định'], tienQuyet: ['split', 'toLowerCase'], the: ['javascript', 'cookie'],
      moTa: `${BAI}<p>Viết ${c('parseSetCookie(header)')} trả ${c('{ name, value, httpOnly, secure, sameSite, path, maxAge }')} như trình duyệt hiểu: phần đầu là ${c('tên=giá trị')} (tách ở ${c('=')} đầu); các thuộc tính sau không phân biệt hoa thường tên. Mặc định: ${c('httpOnly: false')}, ${c('secure: false')}, ${c('sameSite: "Lax"')} (mặc định của trình duyệt hiện đại), ${c('path: "/"')}, ${c('maxAge: null')} (cookie theo phiên trình duyệt). Giá trị SameSite chuẩn hoá thành ${c('"Strict" | "Lax" | "None"')}; giá trị lạ ⇒ ${c('"Lax"')}. ${c('Max-Age')} là số nguyên.</p>`,
      yeuCau: ['Tên thuộc tính không phân biệt hoa thường.', 'Mặc định đúng như trình duyệt.', 'maxAge là number.'],
      dauVao: 'header: string.', dauRa: 'object.',
      rangBuoc: ['Bỏ qua Domain, Expires và thuộc tính lạ.'],
      viDu: [{ input: 'parseSetCookie("sid=xyz; HttpOnly; samesite=strict")', output: '{ name: "sid", value: "xyz", httpOnly: true, secure: false, sameSite: "Strict", path: "/", maxAge: null }', explanation: 'samesite=strict → "Strict".' }],
      goiY: ['const [first, ...attrs] = header.split(";").map((s) => s.trim());', 'const [k, v] = a.split("="); switch (k.toLowerCase()) { … }'],
      khoiDau: { 'main.js': `// Bài 7.2 — đọc ngược Set-Cookie
function parseSetCookie(header) {
  const [name, value] = header.split('=');
  return { name, value, httpOnly: header.includes('HttpOnly') };
}
` },
      loiGiai: { 'main.js': `// Bài 7.2 — "tên=giá trị; Cờ; Thuộc-tính=giá trị" → object với mặc định của trình duyệt
function parseSetCookie(header) {
  const [first, ...attrs] = header.split(';').map((s) => s.trim());
  const i = first.indexOf('=');
  const out = { name: first.slice(0, i), value: first.slice(i + 1), httpOnly: false, secure: false, sameSite: 'Lax', path: '/', maxAge: null };
  for (const a of attrs) {
    const j = a.indexOf('=');
    const key = (j < 0 ? a : a.slice(0, j)).trim().toLowerCase();
    const val = j < 0 ? '' : a.slice(j + 1).trim();
    if (key === 'httponly') out.httpOnly = true;
    else if (key === 'secure') out.secure = true;
    else if (key === 'path') out.path = val || '/';
    else if (key === 'max-age') out.maxAge = parseInt(val, 10);
    else if (key === 'samesite') {
      const v = val.toLowerCase();
      out.sameSite = v === 'strict' ? 'Strict' : v === 'none' ? 'None' : 'Lax';
    }
  }
  return out;
}
` },
      giaiThich: `<p>Đây là cách DevTools điền cột HttpOnly, Secure, SameSite trong tab Application. ${c('header.includes("HttpOnly")')} của code khởi đầu sai với chữ thường và nhầm cả khi giá trị cookie tình cờ chứa chữ đó.</p>`,
      loiHayGap: ['includes("HttpOnly") — nhầm với giá trị, trượt với "httponly".', 'Quên mặc định SameSite=Lax.', 'maxAge là chuỗi.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie',
      kiem: [
        { moTa: 'The lesson cookie|||Cookie của bài', goi: 'parseSetCookie("sid=tNtMMY6E7GUf3Zn-iOVJPO5ZlGkIhmB8Lb9U5Fqalds; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600")', mongDoi: { name: 'sid', value: 'tNtMMY6E7GUf3Zn-iOVJPO5ZlGkIhmB8Lb9U5Fqalds', httpOnly: true, secure: false, sameSite: 'Lax', path: '/', maxAge: 3600 } },
        { moTa: 'Defaults for a bare cookie|||Mặc định cho cookie trần', goi: 'parseSetCookie("theme=dark")', mongDoi: { name: 'theme', value: 'dark', httpOnly: false, secure: false, sameSite: 'Lax', path: '/', maxAge: null } },
        { moTa: 'Case-insensitive, = in value, odd SameSite|||Không phân biệt hoa thường, = trong giá trị, SameSite lạ', goi: '[parseSetCookie("t=YQ==; secure; SAMESITE=none; path=/api; httponly"), parseSetCookie("x=1; SameSite=weird").sameSite]', mongDoi: [{ name: 't', value: 'YQ==', httpOnly: true, secure: true, sameSite: 'None', path: '/api', maxAge: null }, 'Lax'] },
      ],
    },
    {
      tieuDe: 'Kho phiên có hạn dùng',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['phiên', 'hạn dùng', 'thu hồi'], tienQuyet: ['Map', 'closure'], the: ['javascript', 'phiên'],
      moTa: `${BAI}<p>Viết ${c('createSessionStore(ttlMs, newId)')} (${c('newId()')} cho sẵn, trả id mới) trả object: ${c('create(userId, now)')} → id, lưu ${c('{ userId, expires: now + ttlMs }')}; ${c('get(id, now)')} → ${c('userId')} hoặc ${c('null')} nếu không có / đã hết hạn (${c('now >= expires')}; xoá luôn phiên hết hạn); ${c('touch(id, now)')} gia hạn phiên còn sống thêm ${c('ttlMs')} tính từ ${c('now')}, trả boolean; ${c('destroy(id)')}; ${c('destroyAllFor(userId)')} xoá mọi phiên của người đó (đăng xuất mọi thiết bị), trả số phiên đã xoá; ${c('size()')} số phiên đang lưu.</p>`,
      yeuCau: ['Hết hạn ⇒ null và bị xoá.', 'touch chỉ gia hạn phiên còn sống.', 'destroyAllFor trả số đã xoá.'],
      dauVao: 'ttlMs: number; newId: () => string.', dauRa: 'object.',
      rangBuoc: ['Không dùng Date.now().'],
      viDu: [{ input: 'create(1, 0) → "s1"; get("s1", 3600000) với ttl 1 giờ', output: 'null', explanation: 'Đúng mốc expires là đã hết hạn.' }],
      goiY: ['const map = new Map(); // id → { userId, expires }', 'for (const [id, s] of map) if (s.userId === userId) { map.delete(id); n++; }'],
      khoiDau: { 'main.js': `// Bài 7.2 — kho phiên
function createSessionStore(ttlMs, newId) {
  const map = new Map();
  return {
    create(userId, now) { const id = newId(); map.set(id, userId); return id; },
    get(id, now) { return map.get(id) ?? null; },
    touch(id, now) { return true; },
    destroy(id) {},
    destroyAllFor(userId) { return 0; },
    size() { return map.size; },
  };
}
` },
      loiGiai: { 'main.js': `// Bài 7.2 — sự thật nằm trên máy chủ: hết hạn, gia hạn, đăng xuất một nơi hay mọi nơi
function createSessionStore(ttlMs, newId) {
  const map = new Map();                                     // id → { userId, expires }
  const alive = (id, now) => {
    const s = map.get(id);
    if (!s) return null;
    if (now >= s.expires) { map.delete(id); return null; }   // hết hạn thì dọn luôn
    return s;
  };
  return {
    create(userId, now) {
      const id = newId();
      map.set(id, { userId, expires: now + ttlMs });
      return id;
    },
    get(id, now) { return alive(id, now)?.userId ?? null; },
    touch(id, now) {
      const s = alive(id, now);
      if (!s) return false;
      s.expires = now + ttlMs;                               // gia hạn trượt khi người dùng còn hoạt động
      return true;
    },
    destroy(id) { map.delete(id); },
    destroyAllFor(userId) {
      let n = 0;
      for (const [id, s] of map) if (s.userId === userId) { map.delete(id); n++; }
      return n;
    },
    size() { return map.size; },
  };
}
` },
      giaiThich: `<p>Đây là thứ JWT không làm được dễ dàng (Bài 7.3): máy chủ quyết định phiên nào còn sống, nên "đăng xuất mọi thiết bị" chỉ là một vòng lặp. Trong production kho này nằm ở Redis hay cơ sở dữ liệu để nhiều máy chủ dùng chung và không mất khi khởi động lại.</p>`,
      loiHayGap: ['Không kiểm hạn ⇒ phiên sống mãi.', 'touch hồi sinh phiên đã hết hạn.', 'Xoá trong khi duyệt bằng chỉ số mảng — bỏ sót phần tử.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-expiration',
      kiem: [
        { moTa: 'Create, get, expire exactly at ttl|||Tạo, đọc, hết hạn đúng mốc ttl', chuanBi: 'let n = 0; const S = createSessionStore(3600000, () => "s" + (++n)); const id = S.create(7, 0);', goi: '[id, S.get(id, 3599999), S.get(id, 3600000), S.size()]', mongDoi: ['s1', 7, null, 0] },
        { moTa: 'touch extends only live sessions|||touch chỉ gia hạn phiên còn sống', chuanBi: 'let n = 0; const S = createSessionStore(1000, () => "s" + (++n)); const a = S.create(1, 0); const b = S.create(2, 0);', goi: '[S.touch(a, 900), S.get(a, 1500), S.touch(b, 1000), S.get(b, 1000)]', mongDoi: [true, 1, false, null] },
        { moTa: 'Log out everywhere|||Đăng xuất mọi thiết bị', chuanBi: 'let n = 0; const S = createSessionStore(1000, () => "s" + (++n)); S.create(1, 0); S.create(1, 0); const other = S.create(2, 0); const mine = S.create(1, 0);', goi: '[S.destroyAllFor(1), S.get(mine, 10), S.get(other, 10), S.size()]', mongDoi: [3, null, 2, 1] },
        { moTa: 'destroy and unknown ids|||destroy và id lạ', chuanBi: 'let n = 0; const S = createSessionStore(1000, () => "s" + (++n)); const a = S.create(1, 0); S.destroy(a);', goi: '[S.get(a, 1), S.get("nope", 1), S.touch("nope", 1)]', mongDoi: [null, null, false] },
      ],
    },
    {
      tieuDe: 'Trình duyệt có gửi cookie không? (SameSite)',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['SameSite', 'same-site vs cross-site', 'điều hướng cấp cao'], tienQuyet: ['toán tử logic'], the: ['javascript', 'cookie', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('willSend(cookie, request)')} mô phỏng trình duyệt: ${c('cookie')} là ${c('{ sameSite, secure }')}; ${c('request')} là ${c('{ crossSite, topLevel, method, https }')} (${c('topLevel')}: người dùng điều hướng cả trang, vd bấm link hay gửi form; ${c('false')} cho fetch, ảnh, iframe). Luật: ${c('secure')} mà ${c('https')} false ⇒ không gửi. Cùng site ⇒ gửi. Khác site: ${c('Strict')} ⇒ không; ${c('Lax')} ⇒ chỉ khi ${c('topLevel')} VÀ method an toàn (GET, HEAD); ${c('None')} ⇒ gửi nếu ${c('secure')}, không thì cookie không hợp lệ ⇒ không gửi.</p>`,
      yeuCau: ['Secure chỉ qua HTTPS.', 'Lax: chỉ điều hướng cấp cao bằng GET/HEAD.', 'None cần Secure.'],
      dauVao: 'cookie: { sameSite, secure }; request: { crossSite, topLevel, method, https }.', dauRa: 'boolean.',
      rangBuoc: ['method có thể viết thường.'],
      viDu: [{ input: 'willSend({ sameSite: "Lax", secure: false }, { crossSite: true, topLevel: true, method: "POST", https: false })', output: 'false', explanation: 'Form chuyển tiền trong bài: Lax chặn ⇒ 401.' }],
      goiY: ['if (cookie.secure && !request.https) return false;', 'if (!request.crossSite) return true;'],
      khoiDau: { 'main.js': `// Bài 7.2 — trình duyệt có gửi cookie không?
function willSend(cookie, request) {
  return cookie.sameSite !== 'Strict';
}
` },
      loiGiai: { 'main.js': `// Bài 7.2 — SameSite quyết định cookie có đi cùng request do trang KHÁC khởi động không
function willSend(cookie, request) {
  if (cookie.secure && !request.https) return false;           // Secure: chỉ qua HTTPS
  if (!request.crossSite) return true;                          // cùng site: luôn gửi
  const safe = ['GET', 'HEAD'].includes(request.method.toUpperCase());
  switch (cookie.sameSite) {
    case 'Strict': return false;
    case 'Lax': return request.topLevel && safe;                // bấm link: được; POST/fetch khác site: không
    case 'None': return cookie.secure === true;                 // None không Secure là cookie hỏng
    default: return request.topLevel && safe;                   // không ghi gì: trình duyệt coi như Lax
  }
}
` },
      giaiThich: `<p>Hai dòng trong output CSRF của bài chính là hai lời gọi hàm này: Lax + POST khác site ⇒ ${c('false')} ⇒ máy chủ thấy "(no cookie)" ⇒ 401; None + Secure ⇒ ${c('true')} ⇒ tiền chuyển đi. Lax vẫn gửi cho GET cấp cao — lý do GET không bao giờ được đổi dữ liệu.</p>`,
      loiHayGap: ['Cho Lax gửi cookie với POST khác site.', 'Quên rằng fetch khác site không phải điều hướng cấp cao.', 'Cho None hoạt động khi thiếu Secure.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value',
      kiem: [
        { moTa: 'The CSRF demo: Lax blocks, None sends|||Demo CSRF: Lax chặn, None gửi', goi: '[willSend({ sameSite: "Lax", secure: false }, { crossSite: true, topLevel: true, method: "POST", https: false }), willSend({ sameSite: "None", secure: true }, { crossSite: true, topLevel: true, method: "POST", https: true })]', mongDoi: [false, true] },
        { moTa: 'Lax: link click yes, fetch no|||Lax: bấm link có, fetch không', goi: '[willSend({ sameSite: "Lax", secure: true }, { crossSite: true, topLevel: true, method: "get", https: true }), willSend({ sameSite: "Lax", secure: true }, { crossSite: true, topLevel: false, method: "GET", https: true })]', mongDoi: [true, false] },
        { moTa: 'Strict, same-site, Secure over http, broken None|||Strict, cùng site, Secure qua http, None hỏng', goi: '[willSend({ sameSite: "Strict", secure: true }, { crossSite: true, topLevel: true, method: "GET", https: true }), willSend({ sameSite: "Strict", secure: false }, { crossSite: false, topLevel: false, method: "POST", https: false }), willSend({ sameSite: "Lax", secure: true }, { crossSite: false, topLevel: true, method: "GET", https: false }), willSend({ sameSite: "None", secure: false }, { crossSite: true, topLevel: true, method: "GET", https: true })]', mongDoi: [false, true, false, false] },
      ],
    },
    {
      tieuDe: 'Chặn CSRF: Origin + token',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['CSRF token', 'header Origin', 'so sánh thời gian cố định'], tienQuyet: ['object', 'includes'], the: ['javascript', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('checkCsrf(req, session, allowedOrigins)')} trả ${c('"ok"')}, ${c('"bad-origin"')} hoặc ${c('"bad-token"')}. ${c('req')} là ${c('{ method, headers, body }')} (tên header có thể hoa thường lộn xộn), ${c('session')} là ${c('{ csrfToken }')}. Luật: method an toàn (GET, HEAD, OPTIONS) ⇒ ${c('"ok"')}. Với method khác: nếu có header ${c('Origin')} mà không nằm trong ${c('allowedOrigins')} ⇒ ${c('"bad-origin"')}; rồi token lấy từ header ${c('X-CSRF-Token')} hoặc ${c('body._csrf')} phải bằng ${c('session.csrfToken')} (không rỗng), so bằng hàm so sánh thời gian cố định tự viết (duyệt hết chuỗi, không thoát sớm) ⇒ khác ⇒ ${c('"bad-token"')}.</p>`,
      yeuCau: ['Method an toàn bỏ qua.', 'Origin sai ⇒ bad-origin (kiểm trước token).', 'Token từ header hoặc body.', 'Token rỗng/thiếu ⇒ bad-token.'],
      dauVao: 'req: object; session: object; allowedOrigins: string[].', dauRa: '"ok" | "bad-origin" | "bad-token".',
      rangBuoc: ['Không so token bằng === trực tiếp — tự viết so sánh thời gian cố định.'],
      viDu: [{ input: 'form từ http://127.0.0.1:5000 POST /api/transfer', output: '"bad-origin"', explanation: 'Trang "trúng thưởng" trong bài bị chặn ngay cả khi SameSite=None.' }],
      goiY: ['const h = Object.fromEntries(Object.entries(req.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));', 'let diff = a.length ^ b.length; for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0); return diff === 0;'],
      khoiDau: { 'main.js': `// Bài 7.2 — chặn CSRF
function checkCsrf(req, session, allowedOrigins) {
  if (req.body._csrf === session.csrfToken) return 'ok';
  return 'bad-token';
}
` },
      loiGiai: { 'main.js': `// Bài 7.2 — hai lớp: Origin phải là của ta, VÀ token mà site khác không đọc được phải khớp
function safeEqual(a, b) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0); // không thoát sớm
  }
  return diff === 0;
}

function checkCsrf(req, session, allowedOrigins) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method.toUpperCase())) return 'ok';
  const h = Object.fromEntries(Object.entries(req.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
  if (h.origin !== undefined && !allowedOrigins.includes(h.origin)) return 'bad-origin';
  const sent = String(h['x-csrf-token'] ?? req.body?._csrf ?? '');
  const expected = String(session?.csrfToken ?? '');
  if (!sent || !expected || !safeEqual(sent, expected)) return 'bad-token';
  return 'ok';
}
` },
      giaiThich: `<p>Trang của kẻ tấn công gửi được form tới bạn nhưng không ĐỌC được trang của bạn (chính sách cùng origin, Bài 7.5), nên nó không biết token nằm trong form thật. Kiểm ${c('Origin')} chặn sớm phần lớn request khác site; token là lớp dự phòng khi Origin vắng (vài trình duyệt cũ, một số điều hướng).</p>`,
      loiHayGap: ['Chấp nhận token rỗng khi session cũng chưa có token ("" === "").', 'Bỏ qua Origin vì "đã có token".', 'Kiểm CSRF cả cho GET — làm hỏng link thường.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
      kiem: [
        { moTa: 'Safe methods pass|||Method an toàn được qua', goi: 'checkCsrf({ method: "get", headers: { Origin: "https://evil.example" }, body: {} }, { csrfToken: "t1" }, ["https://shop.example"])', mongDoi: 'ok' },
        { moTa: 'The prize page is stopped by Origin|||Trang trúng thưởng bị chặn bởi Origin', goi: 'checkCsrf({ method: "POST", headers: { origin: "http://127.0.0.1:5000" }, body: { to: "attacker", _csrf: "t1" } }, { csrfToken: "t1" }, ["http://localhost:3457"])', mongDoi: 'bad-origin' },
        { moTa: 'Token from header or body|||Token từ header hoặc body', goi: '[checkCsrf({ method: "DELETE", headers: { Origin: "https://shop.example", "X-CSRF-Token": "t1" }, body: {} }, { csrfToken: "t1" }, ["https://shop.example"]), checkCsrf({ method: "POST", headers: {}, body: { _csrf: "t1" } }, { csrfToken: "t1" }, ["https://shop.example"])]', mongDoi: ['ok', 'ok'] },
        { moTa: 'Wrong, missing or empty tokens|||Token sai, thiếu hoặc rỗng', goi: '[checkCsrf({ method: "POST", headers: {}, body: { _csrf: "t2" } }, { csrfToken: "t1" }, []), checkCsrf({ method: "POST", headers: {}, body: {} }, { csrfToken: "t1" }, []), checkCsrf({ method: "POST", headers: {}, body: { _csrf: "" } }, { csrfToken: "" }, []), checkCsrf({ method: "PUT", headers: {}, body: { _csrf: "t1x" } }, { csrfToken: "t1" }, [])]', mongDoi: ['bad-token', 'bad-token', 'bad-token', 'bad-token'] },
        { moTa: 'No === between the two tokens|||Không so hai token bằng ===', kiem: 'ma-nguon', tep: 'main.js', khop: '(sent|expected)\\s*===\\s*(sent|expected)', phuDinh: true },
      ],
    },
  ],
});
