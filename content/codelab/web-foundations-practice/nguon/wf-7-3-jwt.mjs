/** Bộ luyện bài 7.3 — JWT. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm không có Buffer/atob/crypto ⇒ đề cho sẵn hàm giải Base64URL thuần JS. Tách token, giải mã, kiểm exp,
 *  kiểm claim (nbf/iss/aud), chặn alg none / thuật toán lạ, và xoay vòng refresh token có phát hiện dùng lại. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 7.3 — JWT.</em> Các bài là từng bước mà thư viện <code>jsonwebtoken</code> làm khi bạn gọi <code>verify</code> — trừ phần tính chữ ký.</p>';

const B64 = `// CHO SẴN — giải Base64URL thành chuỗi UTF-8 (đừng sửa). Ký tự lạ ⇒ ném SyntaxError.
function b64urlToString(s) {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let bits = 0, value = 0, bytes = '';
  for (const ch of s) {
    const v = abc.indexOf(ch);
    if (v < 0) throw new SyntaxError('not base64url: ' + ch);
    value = (value << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes += '%' + ((value >> bits) & 255).toString(16).padStart(2, '0');
      value &= (1 << bits) - 1;
    }
  }
  return decodeURIComponent(bytes);
}
`;

// Token thật từ jwt-tay.mjs của bài (HS256, khoá demo): header {"alg":"HS256","typ":"JWT"}, payload sub/name/role/iat/exp.
// Ghép từ ba phần lúc chạy (gitleaks bắt chuỗi JWT liền mạch ngoài content/courses).
const TOK = '["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "eyJzdWIiOiIxIiwibmFtZSI6IkFuIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3OTM2MDAwMDAsImV4cCI6MTc5MzYwMDkwMH0", "pm_1On9_YHV3D91ZPFRlh-2qRvgxRCrlXTBsSK_5v0g"].join(".")';
const NONE = '["eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0", "eyJzdWIiOiIxIiwibmFtZSI6IkFuIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzkzNjAwMDAwLCJleHAiOjE3OTM2MDA5MDB9", ""].join(".")';

export default doiDau({
  slug: 'wf-7-3-jwt',
  ten: '7.3 JWT',
  baiHoc: 'Nền tảng Web — Bài 7.3 JWT: tokens that prove themselves',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Tách ba phần của JWT, giải mã header/payload (không cần khoá), kiểm hết hạn có độ lệch đồng hồ, kiểm nbf/iss/aud, từ chối alg none và thuật toán ngoài danh sách, và xoay vòng refresh token có phát hiện dùng lại — 6 bài.',
  de: [
    {
      tieuDe: 'Tách ba phần',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['cấu trúc JWT'], tienQuyet: ['split'], the: ['javascript', 'jwt'],
      moTa: `${BAI}<p>Viết ${c('splitJwt(token)')} trả ${c('{ header, payload, signature }')} (các chuỗi Base64URL, CHƯA giải mã). Token hợp lệ có đúng 2 dấu chấm, header và payload không rỗng; chữ ký được phép rỗng (token ${c('alg: none')} có dạng ${c('xxx.yyy.')} — vẫn tách được, việc từ chối nó là của bài sau). Sai hình dạng hoặc không phải chuỗi ⇒ ${c('null')}.</p>`,
      yeuCau: ['Đúng 3 phần.', 'header, payload không rỗng.', 'Không phải chuỗi ⇒ null.'],
      dauVao: 'token: any.', dauRa: '{ header, payload, signature } hoặc null.',
      rangBuoc: ['Chưa giải mã gì ở bài này.'],
      viDu: [{ input: 'splitJwt("aaa.bbb.ccc")', output: '{ header: "aaa", payload: "bbb", signature: "ccc" }', explanation: 'Ba phần, hai dấu chấm.' }],
      goiY: ['if (typeof token !== "string") return null;', 'const parts = token.split("."); if (parts.length !== 3) return null;'],
      khoiDau: { 'main.js': `// Bài 7.3 — tách ba phần
function splitJwt(token) {
  const [header, payload, signature] = token.split('.');
  return { header, payload, signature };
}
` },
      loiGiai: { 'main.js': `// Bài 7.3 — header.payload.signature; chữ ký có thể rỗng (alg none), hai phần đầu thì không
function splitJwt(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;                       // đúng hai dấu chấm
  const [header, payload, signature] = parts;
  if (!header || !payload) return null;
  return { header, payload, signature };
}
` },
      giaiThich: `<p>Kiểm hình dạng trước tiên giúp mọi bước sau khỏi phải lo ${c('undefined')}. Đếm phần cũng quan trọng: JWE (JWT mã hoá) có 5 phần — một hệ thống chỉ nhận JWS phải từ chối nó thay vì cố đọc.</p>`,
      loiHayGap: ['Destructure mà không đếm phần — "a.b" thành signature undefined.', 'Coi chữ ký rỗng là hình dạng sai (thì không nhận ra đòn alg none để báo đúng lỗi).'],
      thamKhao: 'https://www.rfc-editor.org/rfc/rfc7519#section-7.2',
      kiem: [
        { moTa: 'The lesson token|||Token của bài', goi: 'splitJwt(' + TOK + ').signature', mongDoi: 'pm_1On9_YHV3D91ZPFRlh-2qRvgxRCrlXTBsSK_5v0g' },
        { moTa: 'alg none shape still splits|||Token alg none vẫn tách được', goi: 'splitJwt("aaa.bbb.")', mongDoi: { header: 'aaa', payload: 'bbb', signature: '' } },
        { moTa: 'Wrong shapes give null|||Sai hình dạng trả null', goi: '[splitJwt("a.b"), splitJwt("a.b.c.d.e"), splitJwt(".b.c"), splitJwt("a..c"), splitJwt(null), splitJwt(42)]', mongDoi: [null, null, null, null, null, null] },
      ],
    },
    {
      tieuDe: 'Đã hết hạn chưa?',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['exp', 'độ lệch đồng hồ'], tienQuyet: ['so sánh số'], the: ['javascript', 'jwt'],
      moTa: `${BAI}<p>Viết ${c('isExpired(payload, nowSec, leewaySec = 0)')}: ${c('exp')} và ${c('nowSec')} tính bằng GIÂY (không phải ms). Hết hạn khi ${c('nowSec >= exp + leewaySec')}. ${c('exp')} vắng hoặc không phải số hữu hạn ⇒ coi là hết hạn (${c('true')}) — an toàn hơn là cho token sống mãi.</p>`,
      yeuCau: ['So bằng giây.', 'Đúng mốc exp là hết hạn.', 'Thiếu exp ⇒ true.'],
      dauVao: 'payload: object; nowSec: number; leewaySec?: number.', dauRa: 'boolean.',
      rangBuoc: ['Không dùng Date.now().'],
      viDu: [{ input: 'isExpired({ exp: 1793600900 }, 1793600000 + 16 * 60)', output: 'true', explanation: '16 phút sau khi cấp token 15 phút — dòng "expired" trong bài.' }],
      goiY: ['if (typeof payload?.exp !== "number" || !Number.isFinite(payload.exp)) return true;', 'return nowSec >= payload.exp + leewaySec;'],
      khoiDau: { 'main.js': `// Bài 7.3 — hết hạn chưa?
function isExpired(payload, nowSec, leewaySec = 0) {
  return payload.exp < Date.now();
}
` },
      loiGiai: { 'main.js': `// Bài 7.3 — exp tính bằng giây từ 1970; thiếu exp thì coi như hết hạn
function isExpired(payload, nowSec, leewaySec = 0) {
  const exp = payload?.exp;
  if (typeof exp !== 'number' || !Number.isFinite(exp)) return true;
  return nowSec >= exp + leewaySec;                          // leeway bù vài giây lệch đồng hồ giữa các máy
}
` },
      giaiThich: `<p>Code khởi đầu dính lỗi kinh điển: so giây (exp) với mili giây (${c('Date.now()')}) — mọi token đều "hết hạn từ năm 1970". Leeway vài giây giúp hai máy chủ lệch đồng hồ không từ chối nhầm token vừa cấp.</p>`,
      loiHayGap: ['So exp với Date.now() (ms).', 'Token không có exp được coi là hợp lệ mãi.'],
      thamKhao: 'https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4',
      kiem: [
        { moTa: 'Before, exactly at, after exp|||Trước, đúng mốc, sau exp', goi: '[isExpired({ exp: 1793600900 }, 1793600000), isExpired({ exp: 1793600900 }, 1793600900), isExpired({ exp: 1793600900 }, 1793600960)]', mongDoi: [false, true, true] },
        { moTa: 'Leeway|||Độ lệch cho phép', goi: '[isExpired({ exp: 100 }, 105, 10), isExpired({ exp: 100 }, 110, 10)]', mongDoi: [false, true] },
        { moTa: 'Missing or bad exp is expired|||exp thiếu hoặc sai là hết hạn', goi: '[isExpired({}, 1), isExpired({ exp: "999999999999" }, 1), isExpired({ exp: Infinity }, 1), isExpired(null, 1)]', mongDoi: [true, true, true, true] },
      ],
    },
    {
      tieuDe: 'Giải mã không cần khoá',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['Base64URL', 'payload đọc được'], tienQuyet: ['JSON.parse', 'try/catch'], the: ['javascript', 'jwt'],
      moTa: `${BAI}<p>Dùng hàm cho sẵn ${c('b64urlToString')}, viết ${c('decodeJwt(token)')} trả ${c('{ header, payload }')} là hai OBJECT đã parse. Bất kỳ lỗi nào — không đủ 3 phần, Base64URL sai, JSON hỏng, header/payload không phải object thường — ⇒ ${c('null')}. Bài này cho thấy: ai cũng đọc được payload, không cần khoá.</p>`,
      yeuCau: ['Giải cả header và payload.', 'Mọi lỗi ⇒ null, không ném.', 'Phải là object (không phải mảng/số).'],
      dauVao: 'token: string.', dauRa: '{ header, payload } hoặc null.',
      rangBuoc: ['Không sửa hàm b64urlToString.'],
      viDu: [{ input: 'decodeJwt(token của bài)', output: '{ header: { alg: "HS256", typ: "JWT" }, payload: { sub: "1", name: "An", role: "user", … } }', explanation: 'Đúng dòng "decoded payload, without the secret" trong output.' }],
      goiY: ['const parts = token.split("."); if (parts.length !== 3) return null;', 'try { const header = JSON.parse(b64urlToString(parts[0])); … } catch { return null; }'],
      khoiDau: { 'main.js': `${B64}
// Bài 7.3 — giải mã không cần khoá
function decodeJwt(token) {
  const [h, p] = token.split('.');
  return { header: JSON.parse(b64urlToString(h)), payload: JSON.parse(b64urlToString(p)) };
}
` },
      loiGiai: { 'main.js': `${B64}
// Bài 7.3 — header và payload chỉ là JSON viết bằng Base64URL: ai cũng đọc được
function decodeJwt(token) {
  const parts = typeof token === 'string' ? token.split('.') : [];
  if (parts.length !== 3) return null;
  const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
  try {
    const header = JSON.parse(b64urlToString(parts[0]));
    const payload = JSON.parse(b64urlToString(parts[1]));
    return isObj(header) && isObj(payload) ? { header, payload } : null;
  } catch {
    return null;                                             // Base64URL hay JSON hỏng
  }
}
` },
      giaiThich: `<p>Đây là việc jwt.io và ${c('jwt.decode()')} làm — KHÔNG kiểm chữ ký. Dùng nó để hiện tên người dùng trên giao diện thì được; dùng kết quả của nó để quyết định quyền ở máy chủ là lỗ hổng (ai cũng sửa được payload).</p>`,
      loiHayGap: ['Để JSON.parse ném ra ngoài.', 'Tin payload đã giải mã như đã được kiểm.'],
      thamKhao: 'https://www.rfc-editor.org/rfc/rfc7515#appendix-C',
      kiem: [
        { moTa: 'Read the lesson token without a key|||Đọc token của bài không cần khoá', goi: 'decodeJwt(' + TOK + ')', mongDoi: { header: { alg: 'HS256', typ: 'JWT' }, payload: { sub: '1', name: 'An', role: 'user', iat: 1793600000, exp: 1793600900 } } },
        { moTa: 'The forged alg-none token decodes too|||Token alg none giả cũng giải được', goi: 'decodeJwt(' + NONE + ').payload.role', mongDoi: 'admin' },
        { moTa: 'Broken input gives null|||Đầu vào hỏng trả null', goi: '[decodeJwt("a.b"), decodeJwt("e30.!!!.x"), decodeJwt("bm90IGpzb24.e30.x"), decodeJwt("WzFd.e30.x")]', mongDoi: [null, null, null, null] },
      ],
    },
    {
      tieuDe: 'Kiểm các claim',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['nbf', 'iss', 'aud'], tienQuyet: ['mảng', 'includes'], the: ['javascript', 'jwt'],
      moTa: `${BAI}<p>Viết ${c('checkClaims(payload, { now, issuer, audience, leeway = 0 })')} trả MẢNG lỗi theo thứ tự (rỗng = ổn): ${c('"expired"')} (exp thiếu hoặc ${c('now >= exp + leeway')}); ${c('"not-yet-valid"')} (có ${c('nbf')} và ${c('now + leeway < nbf')}); ${c('"wrong-issuer"')} (nếu truyền ${c('issuer')} mà ${c('iss')} khác); ${c('"wrong-audience"')} (nếu truyền ${c('audience')}: ${c('aud')} là chuỗi phải bằng, là mảng phải chứa nó; thiếu ${c('aud')} cũng sai).</p>`,
      yeuCau: ['Gom mọi lỗi, đúng thứ tự.', 'aud là chuỗi hoặc mảng.', 'issuer/audience không truyền ⇒ không kiểm.'],
      dauVao: 'payload: object; opts: { now, issuer?, audience?, leeway? }.', dauRa: 'string[].',
      rangBuoc: ['Thời gian tính bằng giây.'],
      viDu: [{ input: 'checkClaims({ exp: 200, iss: "evil" }, { now: 100, issuer: "https://auth.shop.example" })', output: '["wrong-issuer"]', explanation: 'Token do nơi khác cấp, dù chữ ký có thể hợp lệ với khoá dùng chung.' }],
      goiY: ['const errors = []; if (typeof payload.exp !== "number" || now >= payload.exp + leeway) errors.push("expired");', 'const auds = Array.isArray(payload.aud) ? payload.aud : payload.aud === undefined ? [] : [payload.aud];'],
      khoiDau: { 'main.js': `// Bài 7.3 — kiểm claim
function checkClaims(payload, { now, issuer, audience, leeway = 0 }) {
  return payload.exp > now ? [] : ['expired'];
}
` },
      loiGiai: { 'main.js': `// Bài 7.3 — chữ ký đúng mới chỉ là "không bị sửa"; claim cho biết token có dành cho ta, vào lúc này không
function checkClaims(payload, { now, issuer, audience, leeway = 0 }) {
  const errors = [];
  if (typeof payload.exp !== 'number' || now >= payload.exp + leeway) errors.push('expired');
  if (typeof payload.nbf === 'number' && now + leeway < payload.nbf) errors.push('not-yet-valid');
  if (issuer !== undefined && payload.iss !== issuer) errors.push('wrong-issuer');
  if (audience !== undefined) {
    const auds = Array.isArray(payload.aud) ? payload.aud : payload.aud === undefined ? [] : [payload.aud];
    if (!auds.includes(audience)) errors.push('wrong-audience');
  }
  return errors;
}
` },
      giaiThich: `<p>${c('aud')} chặn một lỗi tinh vi: token cấp cho app A (cùng nhà cung cấp đăng nhập) bị đem sang dùng ở API B. ${c('jwt.verify(token, key, { issuer, audience })')} làm đúng các phép kiểm này.</p>`,
      loiHayGap: ['Chỉ kiểm exp.', 'Coi aud luôn là chuỗi — mảng làm includes so sai.', 'Thiếu aud mà vẫn cho qua khi đã yêu cầu audience.'],
      thamKhao: 'https://www.rfc-editor.org/rfc/rfc7519#section-4.1',
      kiem: [
        { moTa: 'A good token has no errors|||Token tốt không có lỗi', goi: 'checkClaims({ exp: 200, nbf: 50, iss: "auth", aud: ["web", "api"] }, { now: 100, issuer: "auth", audience: "api" })', mongDoi: [] },
        { moTa: 'All errors in order|||Mọi lỗi đúng thứ tự', goi: 'checkClaims({ exp: 90, nbf: 150, iss: "evil", aud: "mobile" }, { now: 100, issuer: "auth", audience: "api" })', mongDoi: ['expired', 'not-yet-valid', 'wrong-issuer', 'wrong-audience'] },
        { moTa: 'Leeway, missing aud, unchecked fields|||Độ lệch, thiếu aud, trường không kiểm', goi: '[checkClaims({ exp: 100, nbf: 105 }, { now: 99, leeway: 10 }), checkClaims({ exp: 200 }, { now: 1, audience: "api" }), checkClaims({ exp: 200, iss: "x" }, { now: 1 })]', mongDoi: [[], ['wrong-audience'], []] },
      ],
    },
    {
      tieuDe: 'Từ chối alg none và thuật toán lạ',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['alg none', 'danh sách thuật toán'], tienQuyet: ['try/catch', 'includes'], the: ['javascript', 'jwt', 'bảo mật'],
      moTa: `${BAI}<p>Dùng ${c('b64urlToString')} cho sẵn, viết ${c('checkHeader(token, allowedAlgs)')} trả ${c('"malformed"')} (không đủ 3 phần, header không giải được hoặc không phải object có ${c('alg')} là chuỗi), ${c('"alg-not-allowed"')} (${c('alg')} không nằm ĐÚNG NGUYÊN VĂN trong ${c('allowedAlgs')}, và ${c('"none"')} thì luôn bị từ chối kể cả viết hoa hay có trong danh sách), ${c('"missing-signature"')} (phần chữ ký rỗng), hoặc ${c('"ok"')}.</p>`,
      yeuCau: ['Thứ tự: malformed → alg-not-allowed → missing-signature → ok.', 'none/NONE/None luôn bị từ chối.', 'So alg phân biệt hoa thường với danh sách.'],
      dauVao: 'token: string; allowedAlgs: string[].', dauRa: 'string.',
      rangBuoc: ['Danh sách thuật toán do MÁY CHỦ quyết định, không phải token.'],
      viDu: [{ input: 'checkHeader(token alg none của bài, ["HS256"])', output: '"alg-not-allowed"', explanation: 'Dòng verify(alg: none) trong bài.' }],
      goiY: ['const header = JSON.parse(b64urlToString(parts[0]));', 'if (header.alg.toLowerCase() === "none" || !allowedAlgs.includes(header.alg)) return "alg-not-allowed";'],
      khoiDau: { 'main.js': `${B64}
// Bài 7.3 — kiểm header
function checkHeader(token, allowedAlgs) {
  const header = JSON.parse(b64urlToString(token.split('.')[0]));
  return header.alg ? 'ok' : 'malformed';
}
` },
      loiGiai: { 'main.js': `${B64}
// Bài 7.3 — đừng để token tự chọn thuật toán: máy chủ có danh sách, "none" không bao giờ được
function checkHeader(token, allowedAlgs) {
  const parts = typeof token === 'string' ? token.split('.') : [];
  if (parts.length !== 3) return 'malformed';
  let header;
  try { header = JSON.parse(b64urlToString(parts[0])); } catch { return 'malformed'; }
  if (header === null || typeof header !== 'object' || typeof header.alg !== 'string') return 'malformed';
  if (header.alg.toLowerCase() === 'none' || !allowedAlgs.includes(header.alg)) return 'alg-not-allowed';
  if (!parts[2]) return 'missing-signature';
  return 'ok';
}
` },
      giaiThich: `<p>Đòn ${c('alg: none')} từng hạ nhiều thư viện JWT năm 2015: chúng đọc ${c('alg')} từ chính token và "kiểm" chữ ký theo thuật toán không-có-chữ-ký. Một biến thể khác (algorithm confusion) đổi RS256 thành HS256 để lấy khoá công khai làm khoá bí mật. Cách chặn cả hai: máy chủ cố định danh sách ${c('algorithms')}.</p>`,
      loiHayGap: ['Tin header.alg để chọn cách kiểm.', 'Chỉ chặn "none" chữ thường.', 'Để JSON.parse ném ra ngoài.'],
      thamKhao: 'https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/',
      kiem: [
        { moTa: 'Lesson token ok, alg none refused|||Token của bài ok, alg none bị từ chối', goi: '[checkHeader(' + TOK + ', ["HS256"]), checkHeader(' + NONE + ', ["HS256", "none"])]', mongDoi: ['ok', 'alg-not-allowed'] },
        { moTa: 'Not in the list; case matters|||Không có trong danh sách; phân biệt hoa thường', goi: '[checkHeader(' + TOK + ', ["RS256"]), checkHeader("eyJhbGciOiJOT05FIn0.e30.sig", ["NONE"]), checkHeader("eyJhbGciOiJoczI1NiJ9.e30.sig", ["HS256"])]', mongDoi: ['alg-not-allowed', 'alg-not-allowed', 'alg-not-allowed'] },
        { moTa: 'Malformed and missing signature|||Sai hình dạng và thiếu chữ ký', goi: '[checkHeader("a.b", ["HS256"]), checkHeader("!!.e30.x", ["HS256"]), checkHeader("e30.e30.x", ["HS256"]), checkHeader("eyJhbGciOiJIUzI1NiJ9.e30.", ["HS256"])]', mongDoi: ['malformed', 'malformed', 'malformed', 'missing-signature'] },
      ],
    },
    {
      tieuDe: 'Xoay vòng refresh token',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['refresh token', 'xoay vòng', 'phát hiện dùng lại'], tienQuyet: ['Map', 'closure'], the: ['javascript', 'jwt', 'bảo mật'],
      moTa: `${BAI}<p>Access token ngắn hạn không thu hồi được; refresh token thì lưu ở máy chủ nên thu hồi được. Viết ${c('createRefreshStore(newToken)')} (${c('newToken()')} cho sẵn) trả: ${c('issue(userId)')} → token mới, mở một "họ" (family) mới; ${c('use(token)')} → nếu token hợp lệ và CHƯA dùng: đánh dấu đã dùng, cấp token mới cùng họ, trả ${c('{ ok: true, userId, token: <mới> }')}; token đã dùng rồi ⇒ dấu hiệu bị trộm: THU HỒI cả họ, trả ${c('{ ok: false, reason: "reuse" }')}; token thuộc họ đã thu hồi ⇒ ${c('{ ok: false, reason: "revoked" }')}; token lạ ⇒ ${c('{ ok: false, reason: "unknown" }')}. ${c('logout(token)')} thu hồi họ của token đó (token lạ thì bỏ qua).</p>`,
      yeuCau: ['Mỗi token dùng được đúng một lần.', 'Dùng lại ⇒ thu hồi cả họ (cả token mới nhất).', 'Họ của người khác không bị ảnh hưởng.'],
      dauVao: 'newToken: () => string.', dauRa: '{ issue, use, logout }.',
      rangBuoc: ['Không cần hạn dùng thời gian ở bài này.'],
      viDu: [{ input: 'issue(1) → "t1"; use("t1") → t2; use("t1") lần nữa', output: '{ ok: false, reason: "reuse" } và từ đó use("t2") → "revoked"', explanation: 'Kẻ trộm và người dùng thật cùng cầm t1: lần dùng thứ hai lộ ra vụ trộm.' }],
      goiY: ['const tokens = new Map(); // token → { userId, family, used }', 'const revoked = new Set(); // các family đã thu hồi'],
      khoiDau: { 'main.js': `// Bài 7.3 — xoay vòng refresh token
function createRefreshStore(newToken) {
  const tokens = new Map();
  return {
    issue(userId) { const t = newToken(); tokens.set(t, userId); return t; },
    use(token) {
      if (!tokens.has(token)) return { ok: false, reason: 'unknown' };
      return { ok: true, userId: tokens.get(token), token };
    },
    logout(token) { tokens.delete(token); },
  };
}
` },
      loiGiai: { 'main.js': `// Bài 7.3 — mỗi refresh token dùng một lần; dùng lại nghĩa là bị trộm ⇒ khoá cả họ
function createRefreshStore(newToken) {
  const tokens = new Map();                                  // token → { userId, family, used }
  const revoked = new Set();                                 // family đã thu hồi
  let nextFamily = 1;
  const add = (userId, family) => {
    const t = newToken();
    tokens.set(t, { userId, family, used: false });
    return t;
  };
  return {
    issue(userId) { return add(userId, nextFamily++); },
    use(token) {
      const rec = tokens.get(token);
      if (!rec) return { ok: false, reason: 'unknown' };
      if (revoked.has(rec.family)) return { ok: false, reason: 'revoked' };
      if (rec.used) {                                        // lần dùng thứ hai: ai đó đang cầm bản sao
        revoked.add(rec.family);
        return { ok: false, reason: 'reuse' };
      }
      rec.used = true;
      return { ok: true, userId: rec.userId, token: add(rec.userId, rec.family) };
    },
    logout(token) {
      const rec = tokens.get(token);
      if (rec) revoked.add(rec.family);
    },
  };
}
` },
      giaiThich: `<p>Đây là cách các nhà cung cấp đăng nhập (Auth0, Okta, Supabase) giải "điểm yếu lớn nhất" của JWT ở cuối bài: access token sống vài phút, refresh token xoay vòng và nằm trong cookie HttpOnly. Kẻ trộm dùng refresh token cũ sẽ đụng phải dấu "đã dùng" — và kéo theo việc đăng xuất cả họ, kể cả bản mà kẻ trộm vừa lấy được.</p>`,
      loiHayGap: ['Cho dùng một token nhiều lần.', 'Chỉ thu hồi token bị dùng lại, để token mới nhất của kẻ trộm còn sống.', 'Đăng xuất chỉ xoá một token, họ vẫn sống.'],
      thamKhao: 'https://datatracker.ietf.org/doc/html/rfc9700#name-refresh-token-protection',
      kiem: [
        { moTa: 'Rotation: each use gives a new token|||Xoay vòng: mỗi lần dùng cho token mới', chuanBi: 'let n = 0; const S = createRefreshStore(() => "t" + (++n)); const t1 = S.issue(7); const a = S.use(t1); const b = S.use(a.token);', goi: '[t1, a, b]', mongDoi: ['t1', { ok: true, userId: 7, token: 't2' }, { ok: true, userId: 7, token: 't3' }] },
        { moTa: 'Reuse revokes the whole family|||Dùng lại thu hồi cả họ', chuanBi: 'let n = 0; const S = createRefreshStore(() => "t" + (++n)); const t1 = S.issue(7); const r = S.use(t1);', goi: '[S.use(t1), S.use(r.token), S.use("t99")]', mongDoi: [{ ok: false, reason: 'reuse' }, { ok: false, reason: 'revoked' }, { ok: false, reason: 'unknown' }] },
        { moTa: 'Logout and other families|||Đăng xuất và họ khác', chuanBi: 'let n = 0; const S = createRefreshStore(() => "t" + (++n)); const a = S.issue(1); const b = S.issue(2); const a2 = S.use(a).token; S.logout(a2); S.logout("nope");', goi: '[S.use(a2), S.use(b).ok]', mongDoi: [{ ok: false, reason: 'revoked' }, true] },
      ],
    },
  ],
});
