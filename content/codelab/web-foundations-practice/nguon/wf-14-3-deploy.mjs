/** Bộ luyện bài 14.3 — Deploy và kiểm chứng. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI".
 *  Mô phỏng phần việc của máy chủ tĩnh / nhà cung cấp hosting: giải đường dẫn, SPA fallback, Cache-Control, chuyển hướng, smoke-test, rollback. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 14.3 — Đưa dist/ lên Internet và chứng minh nó chạy.</em> Mỗi bài cài lại một quyết định mà máy chủ tĩnh trong bài (server.mjs) hay một nhà cung cấp hosting đưa ra.</p>';

export default doiDau({
  slug: 'wf-14-3-deploy',
  ten: '14.3 Deploy và kiểm chứng',
  baiHoc: 'Nền tảng Web — Bài 14.3 Deploy & verify',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Giải đường dẫn an toàn, SPA fallback, chính sách Cache-Control, luật chuyển hướng kiểu _redirects, smoke-test sau deploy, chọn bản để rollback — 6 bài.',
  de: [
    {
      tieuDe: 'Giải đường dẫn yêu cầu thành file',
      doKho: 'EASY', phut: 15,
      khaiNiem: ['URL path', 'chuẩn hoá đường dẫn', 'path traversal'], tienQuyet: ['split', 'mảng'], the: ['javascript', 'deploy', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('resolvePath(urlPath)')} trả tên file trong ${c('dist/')} (không có / ở đầu) mà máy chủ cần đọc: bỏ query ${c('?…')} và ${c('#…')}; giải mã ${c('%20')} bằng ${c('decodeURIComponent')}; bỏ đoạn rỗng và ${c('.')}; ${c('..')} lùi một cấp — nhưng nếu lùi QUÁ gốc thì trả ${c('null')} (yêu cầu bị từ chối, 403); đường dẫn kết thúc bằng ${c('/')} (hoặc rỗng) ⇒ thêm ${c('index.html')}.</p>`,
      yeuCau: ['"/" ⇒ "index.html"; "/docs/" ⇒ "docs/index.html".', '".." vượt gốc ⇒ null.', 'Bỏ query/hash, giải mã %XX.'],
      dauVao: 'urlPath: string bắt đầu bằng "/".', dauRa: 'string | null.',
      rangBuoc: ['Không dùng module path của Node (chạy cả trong trình duyệt).'],
      viDu: [{ input: 'resolvePath("/../../etc/passwd")', output: 'null', explanation: 'Đây là kiểu tấn công path traversal kinh điển.' }],
      goiY: ['const clean = urlPath.split(/[?#]/)[0];', 'Dùng một mảng làm ngăn xếp: ".." ⇒ nếu rỗng thì trả null, ngược lại pop().'],
      khoiDau: { 'main.js': `// Bài 14.3 — giải đường dẫn
function resolvePath(urlPath) {
  return urlPath.slice(1);
}
` },
      loiGiai: { 'main.js': `// Bài 14.3 — giải đường dẫn: chuẩn hoá bằng ngăn xếp, chặn vượt gốc
function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const parts = [];
  for (const seg of clean.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      if (parts.length === 0) return null;          // muốn ra ngoài dist/ ⇒ từ chối
      parts.pop();
    } else parts.push(seg);
  }
  if (clean.endsWith('/') || parts.length === 0) parts.push('index.html');
  return parts.join('/');
}
` },
      giaiThich: `<p>Máy chủ tĩnh nào cũng phải chuẩn hoá đường dẫn trước khi chạm ổ đĩa; không thì ${c('/../.env')} đọc được file ngoài thư mục phục vụ. ${c('server.mjs')} của bài dùng ${c('path.normalize')} rồi kiểm ${c('startsWith(ROOT)')} — cùng ý tưởng.</p>`,
      loiHayGap: ['Ghép chuỗi thẳng vào đường dẫn ổ đĩa.', 'Giải mã SAU khi xử lý ".." — %2e%2e lách được.'],
      thamKhao: 'https://owasp.org/www-community/attacks/Path_Traversal',
      kiem: [
        { moTa: 'Directory index|||Trang chỉ mục thư mục', goi: '[resolvePath("/"), resolvePath("/docs/"), resolvePath("")]', mongDoi: ['index.html', 'docs/index.html', 'index.html'] },
        { moTa: 'Query, hash and encoding|||Query, hash và mã hoá', goi: '[resolvePath("/assets/index-27wt_Xcd.js?v=2"), resolvePath("/my%20file.txt#top")]', mongDoi: ['assets/index-27wt_Xcd.js', 'my file.txt'] },
        { moTa: 'Dot segments inside the root|||Đoạn chấm bên trong gốc', goi: 'resolvePath("/a/./b/../c.css")', mongDoi: 'a/c.css' },
        { moTa: 'Escaping the root is refused|||Vượt gốc bị từ chối', goi: '[resolvePath("/../../etc/passwd"), resolvePath("/%2e%2e/.env"), resolvePath("/a/../../x")]', mongDoi: [null, null, null] },
      ],
    },
    {
      tieuDe: 'SPA fallback: khi nào trả index.html',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['SPA fallback', 'client-side routing', '404'], tienQuyet: ['Set', 'regex'], the: ['javascript', 'deploy'],
      moTa: `${BAI}<p>Viết ${c('serve(urlPath, files, spa)')} trả ${c('{ status, file }')}: ${c('files')} là ${c('Set')} tên file trong dist/ (không có / đầu). Tìm file theo đường dẫn (bỏ query, ${c('/')} ⇒ ${c('index.html')}, ${c('/x/')} ⇒ ${c('x/index.html')}). Có ⇒ ${c('{ status: 200, file }')}. Không có: nếu ${c('spa')} bật VÀ đoạn cuối của đường dẫn KHÔNG có đuôi file (không có dấu chấm) ⇒ ${c('{ status: 200, file: "index.html" }')}; ngược lại ⇒ ${c('{ status: 404, file: null }')}.</p>`,
      yeuCau: ['Route của app (/products/42) ⇒ index.html khi bật SPA.', 'Asset thiếu (/assets/old.js) ⇒ 404 kể cả khi bật SPA.', 'Tắt SPA ⇒ route của app cũng 404.'],
      dauVao: 'urlPath: string; files: Set<string>; spa: boolean.', dauRa: '{ status, file }.',
      rangBuoc: ['Chỉ xét dấu chấm ở đoạn CUỐI ("/v1.2/products" vẫn là route).'],
      viDu: [{ input: 'serve("/products/42", files, true)', output: '{ status: 200, file: "index.html" }', explanation: 'Đúng như smoke-spa trong bài.' }],
      goiY: ['const last = path.split("/").pop(); const hasExt = last.includes(".");', 'Asset thiếu mà trả index.html ⇒ trình duyệt chạy HTML như JS và báo lỗi cú pháp khó hiểu.'],
      khoiDau: { 'main.js': `// Bài 14.3 — SPA fallback
function serve(urlPath, files, spa) {
  const name = urlPath.slice(1) || 'index.html';
  return files.has(name) ? { status: 200, file: name } : { status: 200, file: 'index.html' };
}
` },
      loiGiai: { 'main.js': `// Bài 14.3 — SPA fallback: route của app ⇒ index.html, file thiếu ⇒ 404 thật
function serve(urlPath, files, spa) {
  const path = urlPath.split(/[?#]/)[0];
  let name = path.replace(/^\\/+/, '');
  if (name === '' || name.endsWith('/')) name += 'index.html';
  if (files.has(name)) return { status: 200, file: name };
  const last = path.split('/').pop();
  if (spa && !last.includes('.')) return { status: 200, file: 'index.html' };   // để router phía trình duyệt lo
  return { status: 404, file: null };
}
` },
      giaiThich: `<p>Với SPA, ${c('/products/42')} không có file nào: router chạy trong trình duyệt mới biết trang đó. Máy chủ phải trả ${c('index.html')} cho những đường dẫn đó — nhưng KHÔNG cho file tĩnh bị thiếu, nếu không lỗi 404 thật biến thành lỗi cú pháp bí ẩn.</p>`,
      loiHayGap: ['Fallback mọi thứ về index.html — che mất 404 của asset.', 'Quên bật fallback — F5 ở /products/42 ra 404.'],
      thamKhao: 'https://vite.dev/guide/static-deploy.html',
      kiem: [
        { moTa: 'Existing files and index|||File có sẵn và trang chỉ mục', chuanBi: 'const f = new Set(["index.html", "assets/index-1.js", "robots.txt", "docs/index.html"]);', goi: '[serve("/", f, false), serve("/robots.txt?x=1", f, false), serve("/docs/", f, false)]', mongDoi: [{ status: 200, file: 'index.html' }, { status: 200, file: 'robots.txt' }, { status: 200, file: 'docs/index.html' }] },
        { moTa: 'App route with and without SPA|||Route của app khi bật và tắt SPA', chuanBi: 'const f = new Set(["index.html"]);', goi: '[serve("/products/42", f, true), serve("/products/42", f, false)]', mongDoi: [{ status: 200, file: 'index.html' }, { status: 404, file: null }] },
        { moTa: 'Missing asset stays 404; dots only matter in the last segment|||Asset thiếu vẫn 404; chỉ xét dấu chấm ở đoạn cuối', chuanBi: 'const f = new Set(["index.html"]);', goi: '[serve("/assets/old-abc.js", f, true).status, serve("/v1.2/products", f, true).status]', mongDoi: [404, 200] },
      ],
    },
    {
      tieuDe: 'Chính sách Cache-Control',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['Cache-Control', 'immutable', 'no-cache', 'mã băm trong tên'], tienQuyet: ['regex'], the: ['javascript', 'deploy', 'http'],
      moTa: `${BAI}<p>Viết ${c('cacheHeader(file)')} trả giá trị header ${c('Cache-Control')} cho một file trong dist/: file có mã băm nội dung trong tên (đoạn cuối khớp ${c('/-[A-Za-z0-9_]{8}\\.(js|css|woff2|png|webp|svg)$/')}) ⇒ ${c('"public, max-age=31536000, immutable"')}; file ${c('.html')} ⇒ ${c('"no-cache"')}; ảnh/phông không băm (${c('png jpg webp svg ico woff2')}) ⇒ ${c('"public, max-age=86400"')}; còn lại ⇒ ${c('"public, max-age=0, must-revalidate"')}.</p>`,
      yeuCau: ['Bốn nhóm đúng thứ tự ưu tiên: băm → html → tĩnh không băm → còn lại.', 'Không nhầm "index.html" là file băm.', 'Đuôi không phân biệt hoa thường.'],
      dauVao: 'file: string (có thể có thư mục).', dauRa: 'string.',
      rangBuoc: ['Không dùng thư viện mime.'],
      viDu: [{ input: 'cacheHeader("assets/index-27wt_Xcd.js")', output: '"public, max-age=31536000, immutable"', explanation: 'Đúng như headers.out.txt của bài.' }],
      goiY: ['Kiểm băm trước — "logo-AbCd1234.png" là file băm, không phải "ảnh không băm".', 'Lấy đuôi: (/\\.([a-z0-9]+)$/i.exec(file) || [])[1]?.toLowerCase()'],
      khoiDau: { 'main.js': `// Bài 14.3 — Cache-Control
function cacheHeader(file) {
  return 'public, max-age=31536000';
}
` },
      loiGiai: { 'main.js': `// Bài 14.3 — Cache-Control: tên có mã băm ⇒ giữ một năm; HTML ⇒ luôn hỏi lại
const HASHED = /-[A-Za-z0-9_]{8}\\.(js|css|woff2|png|webp|svg)$/i;
const STATIC = new Set(['png', 'jpg', 'webp', 'svg', 'ico', 'woff2']);

function cacheHeader(file) {
  if (HASHED.test(file)) return 'public, max-age=31536000, immutable';    // nội dung đổi ⇒ tên đổi
  const ext = ((/\\.([a-z0-9]+)$/i.exec(file) || [])[1] || '').toLowerCase();
  if (ext === 'html') return 'no-cache';                                   // HTML trỏ tới tên mới mỗi lần dựng
  if (STATIC.has(ext)) return 'public, max-age=86400';                     // không băm ⇒ giữ ngắn
  return 'public, max-age=0, must-revalidate';
}
` },
      giaiThich: `<p>${c('no-cache')} KHÔNG có nghĩa "đừng lưu": nó nghĩa là "lưu nhưng hỏi lại máy chủ mỗi lần" (ETag ⇒ 304 rất rẻ). Kết hợp với asset băm ${c('immutable')}: người dùng nhận HTML mới ngay sau deploy, còn JS/CSS cũ vẫn dùng lại từ ổ đĩa.</p>`,
      loiHayGap: ['Cache HTML một năm — người dùng kẹt ở bản cũ.', 'Cache file không băm lâu — sửa logo.png không ai thấy.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control',
      kiem: [
        { moTa: 'Hashed assets for a year|||Asset có mã băm giữ một năm', goi: '[cacheHeader("assets/index-27wt_Xcd.js"), cacheHeader("assets/index-BKlmIFzn.css"), cacheHeader("assets/logo-AbCd1234.PNG")]', mongDoi: ['public, max-age=31536000, immutable', 'public, max-age=31536000, immutable', 'public, max-age=31536000, immutable'] },
        { moTa: 'HTML is always revalidated|||HTML luôn được hỏi lại', goi: '[cacheHeader("index.html"), cacheHeader("docs/getting-started.html")]', mongDoi: ['no-cache', 'no-cache'] },
        { moTa: 'Unhashed static files and the rest|||File tĩnh không băm và phần còn lại', goi: '[cacheHeader("favicon.ico"), cacheHeader("og-image.webp"), cacheHeader("robots.txt"), cacheHeader("manifest.json")]', mongDoi: ['public, max-age=86400', 'public, max-age=86400', 'public, max-age=0, must-revalidate', 'public, max-age=0, must-revalidate'] },
      ],
    },
    {
      tieuDe: 'Luật chuyển hướng kiểu _redirects',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['_redirects', 'splat', 'placeholder', '301/302/200'], tienQuyet: ['split', 'regex', 'replace'], the: ['javascript', 'deploy'],
      moTa: `${BAI}<p>Nhiều nhà cung cấp (Netlify, Cloudflare Pages) đọc file ${c('_redirects')}: mỗi dòng ${c('từ đến [mã]')} (mã mặc định 301; dòng trống và ${c('#')} bỏ qua). Viết ${c('matchRedirect(rulesText, urlPath)')} trả ${c('{ to, status }')} của luật ĐẦU TIÊN khớp, hoặc ${c('null')}. Mẫu ${c('từ')} có thể chứa ${c(':tên')} (khớp một đoạn không chứa /) và ${c('*')} ở cuối (khớp phần còn lại, có thể rỗng); trong ${c('đến')}, ${c(':tên')} và ${c(':splat')} được thay bằng giá trị đã khớp.</p>`,
      yeuCau: ['Luật đầu tiên khớp thắng.', ':tên khớp một đoạn; * khớp phần còn lại.', 'Mã mặc định 301; 200 = rewrite.'],
      dauVao: 'rulesText: string; urlPath: string.', dauRa: '{ to, status } | null.',
      rangBuoc: ['Khớp cả đường dẫn (từ đầu tới cuối), không khớp một phần.'],
      viDu: [{ input: 'luật "/blog/:slug /posts/:slug 301" với "/blog/hello"', output: '{ to: "/posts/hello", status: 301 }', explanation: 'Đổi cấu trúc URL mà không làm gãy link cũ.' }],
      goiY: ['Dựng regex từ mẫu: thoát ký tự đặc biệt, rồi ":tên" ⇒ "([^/]+)", "*" cuối ⇒ "(.*)"; nhớ tên theo thứ tự.', 'Thay trong đích: to.replace(/:([a-z]+)/gi, (_, n) => values[n] ?? ":" + n)'],
      khoiDau: { 'main.js': `// Bài 14.3 — _redirects
function matchRedirect(rulesText, urlPath) {
  for (const line of rulesText.split('\\n')) {
    const [from, to] = line.trim().split(/\\s+/);
    if (from === urlPath) return { to, status: 301 };
  }
  return null;
}
` },
      loiGiai: { 'main.js': `// Bài 14.3 — _redirects: luật đầu tiên khớp thắng, :tên và * (splat)
function matchRedirect(rulesText, urlPath) {
  for (const raw of rulesText.split(/\\r?\\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to, code] = line.split(/\\s+/);
    const names = [];
    let pattern = '';
    for (const seg of from.split(/(:[A-Za-z]+|\\*$)/)) {           // tách placeholder và splat ra khỏi phần chữ
      if (seg.startsWith(':')) { names.push(seg.slice(1)); pattern += '([^/]+)'; }
      else if (seg === '*') { names.push('splat'); pattern += '(.*)'; }
      else pattern += seg.replace(/[.+?^\${}()|[\\]\\\\]/g, '\\\\$&');   // thoát ký tự regex
    }
    const m = new RegExp('^' + pattern + '$').exec(urlPath);
    if (!m) continue;
    const values = Object.fromEntries(names.map((n, i) => [n, m[i + 1]]));
    const target = to.replace(/:([A-Za-z]+)/g, (all, n) => (n in values ? values[n] : all));
    return { to: target, status: code ? Number(code) : 301 };
  }
  return null;
}
` },
      giaiThich: `<p>Thứ tự quan trọng: luật cụ thể phải đứng trước luật chung, vì luật đầu tiên khớp thắng. Dòng cuối kinh điển của một SPA trên Netlify là ${c('/* /index.html 200')} — mã 200 nghĩa là "rewrite": URL trên thanh địa chỉ giữ nguyên, nội dung lấy từ index.html.</p>`,
      loiHayGap: ['Đặt "/* /index.html 200" lên đầu — nuốt mọi luật bên dưới.', 'Không thoát dấu chấm — "/a.html" khớp cả "/aXhtml".'],
      thamKhao: 'https://docs.netlify.com/routing/redirects/',
      kiem: [
        { moTa: 'Placeholder and default status|||Placeholder và mã mặc định', goi: 'matchRedirect("# moved\\n/blog/:slug /posts/:slug", "/blog/hello-web")', mongDoi: { to: '/posts/hello-web', status: 301 } },
        { moTa: 'First match wins; SPA rewrite last|||Luật đầu tiên khớp thắng; rewrite SPA ở cuối', chuanBi: 'const R = "/old-shop/* /shop/:splat 302\\n/about.html /about 301\\n/* /index.html 200";', goi: '[matchRedirect(R, "/old-shop/cart/42"), matchRedirect(R, "/about.html"), matchRedirect(R, "/products/7")]', mongDoi: [{ to: '/shop/cart/42', status: 302 }, { to: '/about', status: 301 }, { to: '/index.html', status: 200 }] },
        { moTa: 'Whole-path match, dots are literal|||Khớp cả đường dẫn, dấu chấm là chữ thường', goi: '[matchRedirect("/about.html /about", "/aboutXhtml"), matchRedirect("/a /b", "/a/c")]', mongDoi: [null, null] },
        { moTa: 'Hidden: two placeholders|||Ẩn: hai placeholder', an: true, goi: 'matchRedirect("/u/:user/p/:id /profile/:user?post=:id 301", "/u/an/p/9")', mongDoi: { to: '/profile/an?post=9', status: 301 } },
      ],
    },
    {
      tieuDe: 'Smoke-test sau deploy',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['smoke test', 'fetch', 'async/await', 'kiểm header'], tienQuyet: ['async/await', 'fetch', 'Promise.all'], the: ['javascript', 'deploy', 'kiểm thử'],
      moTa: `${BAI}<p>Viết ${c('async smokeTest(baseUrl, checks)')} như ${c('smoke.mjs')} của bài. Mỗi ${c('check')}: ${c('{ path, status, contains?, header? }')} với ${c('header')} dạng ${c('[tên, chuỗiCon]')}. Với từng check (chạy SONG SONG), ${c('fetch(baseUrl + path)')} rồi so: mã trạng thái, ${c('contains')} có trong thân trả về, header tồn tại và chứa chuỗi con. Trả ${c('{ ok, results }')}: ${c('results[i] = { path, ok, problems }')} (${c('problems')} là mảng chuỗi tiếng Anh: ${c('"status 404, expected 200"')}, ${c('"body does not contain …"')}, ${c('"header cache-control does not contain …"')}; lỗi mạng ⇒ ${c('"network error"')}). ${c('ok')} chung là true khi mọi check đạt.</p>`,
      yeuCau: ['Chạy song song bằng Promise.all.', 'Một check có thể có nhiều problem.', 'Lỗi mạng không làm hàm ném — chỉ ghi problem.'],
      dauVao: 'baseUrl: string; checks: mảng.', dauRa: 'Promise<{ ok, results }>.',
      rangBuoc: ['Chỉ dùng fetch (máy chấm cung cấp fetch giả).'],
      viDu: [{ input: '{ path: "/products/42", status: 200, contains: "CT Shop" }', output: '{ path: "/products/42", ok: true, problems: [] }', explanation: 'SPA fallback đã bật.' }],
      goiY: ['const results = await Promise.all(checks.map(async (ch) => { … }));', 'try { const res = await fetch(…); const body = await res.text(); … } catch { problems.push("network error"); }', 'res.headers.get(name) trả null nếu không có.'],
      fetchGia: {
        'https://ctshop.example/': { status: 200, text: '<title>CT Shop</title>', headers: { 'cache-control': 'no-cache' } },
        'https://ctshop.example/products/42': { status: 200, text: '<title>CT Shop</title>', headers: { 'cache-control': 'no-cache' } },
        'https://ctshop.example/assets/index-27wt_Xcd.js': { status: 200, text: 'console.log(1)', headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
        'https://ctshop.example/nope.js': { status: 404, text: 'Not Found', headers: {} },
        'https://ctshop.example/broken': { loiMang: true },
      },
      khoiDau: { 'main.js': `// Bài 14.3 — smoke-test
async function smokeTest(baseUrl, checks) {
  return { ok: true, results: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 14.3 — smoke-test: gọi song song, gom mọi vấn đề, không bao giờ ném
async function smokeTest(baseUrl, checks) {
  const results = await Promise.all(checks.map(async (ch) => {
    const problems = [];
    try {
      const res = await fetch(baseUrl + ch.path);
      const body = await res.text();
      if (res.status !== ch.status) problems.push('status ' + res.status + ', expected ' + ch.status);
      if (ch.contains && !body.includes(ch.contains)) problems.push('body does not contain ' + ch.contains);
      if (ch.header) {
        const [name, part] = ch.header;
        const value = res.headers.get(name);
        if (value === null || !value.includes(part)) problems.push('header ' + name + ' does not contain ' + part);
      }
    } catch {
      problems.push('network error');                    // máy chủ chết, DNS sai... vẫn là một kết quả
    }
    return { path: ch.path, ok: problems.length === 0, problems };
  }));
  return { ok: results.every((r) => r.ok), results };
}
` },
      giaiThich: `<p>"Deploy thành công" chỉ nghĩa là file đã được chép. Smoke-test hỏi đúng câu cần hỏi: trang chủ có lên không, route SPA có lên không, asset có header cache đúng không. Chạy nó ngay sau mỗi deploy và từ chối đánh dấu xong nếu có problem.</p>`,
      loiHayGap: ['await từng check một — chậm gấp N lần.', 'Để lỗi mạng ném ra ngoài — mất kết quả của các check khác.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
      kiem: [
        { moTa: 'All checks pass|||Mọi kiểm đều đạt', goi: 'await smokeTest("https://ctshop.example", [{ path: "/", status: 200, contains: "CT Shop", header: ["cache-control", "no-cache"] }, { path: "/products/42", status: 200, contains: "CT Shop" }, { path: "/assets/index-27wt_Xcd.js", status: 200, header: ["cache-control", "immutable"] }])', mongDoi: { ok: true, results: [{ path: '/', ok: true, problems: [] }, { path: '/products/42', ok: true, problems: [] }, { path: '/assets/index-27wt_Xcd.js', ok: true, problems: [] }] } },
        { moTa: 'Several problems in one check|||Nhiều vấn đề trong một kiểm', goi: '(await smokeTest("https://ctshop.example", [{ path: "/nope.js", status: 200, contains: "console", header: ["cache-control", "immutable"] }])).results[0].problems', mongDoi: ['status 404, expected 200', 'body does not contain console', 'header cache-control does not contain immutable'] },
        { moTa: 'Network error is a result, not a crash|||Lỗi mạng là một kết quả, không phải sập', goi: 'await smokeTest("https://ctshop.example", [{ path: "/broken", status: 200 }, { path: "/", status: 200 }])', mongDoi: { ok: false, results: [{ path: '/broken', ok: false, problems: ['network error'] }, { path: '/', ok: true, problems: [] }] } },
      ],
    },
    {
      tieuDe: 'Chọn bản để rollback',
      doKho: 'HARD', phut: 18,
      khaiNiem: ['rollback', 'lịch sử deploy', 'bản tốt cuối cùng'], tienQuyet: ['mảng', 'sort', 'Date'], the: ['javascript', 'deploy'],
      moTa: `${BAI}<p>Mỗi lần deploy ghi ${c('{ id, at, commit, smoke }')} (${c('at')} là chuỗi ISO, ${c('smoke')} là ${c('"pass" | "fail" | null')} — null là chưa chạy). Viết ${c('pickRollback(deploys, currentId)')}: trả ${c('id')} của bản MỚI NHẤT có ${c('at')} TRƯỚC bản hiện tại, có ${c('smoke === "pass"')} và có ${c('commit')} KHÁC commit của bản hiện tại (deploy lại cùng commit không sửa được gì). Không có ⇒ ${c('null')}. ${c('currentId')} không tồn tại ⇒ ném ${c("Error('unknown deploy: <id>')")}. Mảng vào có thể không theo thứ tự.</p>`,
      yeuCau: ['Chỉ xét bản cũ hơn bản hiện tại.', 'Bỏ bản smoke fail/null và bản cùng commit.', 'Không giả định thứ tự đầu vào.'],
      dauVao: 'deploys: mảng; currentId: string.', dauRa: 'string | null.',
      rangBuoc: ['Không sửa mảng vào (sort trên bản sao).'],
      viDu: [{ input: 'd3 (lỗi) mới nhất, d2 smoke fail, d1 pass', output: '"d1"', explanation: 'Quay về bản tốt cuối cùng đã được kiểm chứng.' }],
      goiY: ['const cur = deploys.find((d) => d.id === currentId);', '[...deploys].filter(…).sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0]'],
      khoiDau: { 'main.js': `// Bài 14.3 — chọn bản rollback
function pickRollback(deploys, currentId) {
  return deploys[deploys.length - 2].id;
}
` },
      loiGiai: { 'main.js': `// Bài 14.3 — chọn bản rollback: bản tốt cuối cùng, cũ hơn, khác commit
function pickRollback(deploys, currentId) {
  const cur = deploys.find((d) => d.id === currentId);
  if (!cur) throw new Error('unknown deploy: ' + currentId);
  const candidates = deploys
    .filter((d) => Date.parse(d.at) < Date.parse(cur.at))   // chỉ bản cũ hơn
    .filter((d) => d.smoke === 'pass')                       // đã được kiểm chứng là chạy
    .filter((d) => d.commit !== cur.commit)                  // cùng mã thì quay lại cũng vô ích
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at));    // filter đã tạo mảng mới ⇒ không đụng mảng vào
  return candidates.length ? candidates[0].id : null;
}
` },
      giaiThich: `<p>Hosting tĩnh giữ mọi bản dựng cũ, nên rollback chỉ là trỏ lại — nhanh hơn sửa lỗi dưới áp lực. Nhưng phải trỏ về bản ĐÃ được smoke-test, nếu không bạn có thể quay về một bản hỏng khác. Lưu ý: rollback mã không rollback cơ sở dữ liệu.</p>`,
      loiHayGap: ['Lấy "bản trước đó" theo vị trí mảng — dữ liệu không theo thứ tự.', 'Quay về bản smoke chưa chạy.'],
      thamKhao: 'https://docs.netlify.com/site-deploys/manage-deploys/#rollbacks',
      kiem: [
        { moTa: 'Last known good release|||Bản tốt cuối cùng', chuanBi: 'const D = [{ id: "d3", at: "2026-11-01T10:00:00Z", commit: "c3", smoke: "fail" }, { id: "d1", at: "2026-10-30T09:00:00Z", commit: "c1", smoke: "pass" }, { id: "d2", at: "2026-10-31T09:00:00Z", commit: "c2", smoke: "fail" }];', goi: 'pickRollback(D, "d3")', mongDoi: 'd1' },
        { moTa: 'Same commit and unverified releases are skipped|||Bỏ bản cùng commit và bản chưa kiểm', chuanBi: 'const D = [{ id: "a", at: "2026-10-01T00:00:00Z", commit: "x", smoke: "pass" }, { id: "b", at: "2026-10-02T00:00:00Z", commit: "y", smoke: "pass" }, { id: "c", at: "2026-10-03T00:00:00Z", commit: "z", smoke: null }, { id: "d", at: "2026-10-04T00:00:00Z", commit: "y", smoke: "pass" }];', goi: '[pickRollback(D, "d"), pickRollback(D, "a")]', mongDoi: ['a', null] },
        { moTa: 'Unknown deploy throws|||Bản không tồn tại ném lỗi', goi: 'pickRollback([], "zz")', mongDoi: { loi: 'Error', thongDiep: 'unknown deploy: zz' } },
        { moTa: 'Hidden: never picks a newer release|||Ẩn: không bao giờ chọn bản mới hơn', an: true, chuanBi: 'const D = [{ id: "new", at: "2026-10-05T00:00:00Z", commit: "n", smoke: "pass" }, { id: "cur", at: "2026-10-04T00:00:00Z", commit: "c", smoke: "fail" }, { id: "old", at: "2026-10-03T00:00:00Z", commit: "o", smoke: "pass" }];', goi: 'pickRollback(D, "cur")', mongDoi: 'old' },
      ],
    },
  ],
});
