/** Bộ luyện bài 7.1 — Xác thực và phân quyền. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Đọc header Authorization, chặn gán vai trò từ client, bảng quyền theo vai trò + chủ sở hữu, luật theo route (401/403/200),
 *  giới hạn số lần đăng nhập sai, và cả luồng đăng nhập (cùng một câu báo lỗi, khoá tạm 429). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 7.1 — Xác thực và phân quyền.</em> Mỗi bài là một quyết định mà máy chủ đưa ra ở MỌI request: bạn là ai, và bạn có được làm việc này không.</p>';

export default doiDau({
  slug: 'wf-7-1-auth-basics',
  ten: '7.1 Xác thực và phân quyền',
  baiHoc: 'Nền tảng Web — Bài 7.1 Authentication vs authorization',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Tách header Authorization, lọc trường client không được gửi (role, id), bảng quyền theo vai trò và chủ sở hữu, luật theo route trả 401/403/200, giới hạn đăng nhập sai theo cửa sổ thời gian, và luồng đăng nhập hoàn chỉnh với cùng một câu báo lỗi và 429 — 6 bài.',
  de: [
    {
      tieuDe: 'Tách header Authorization',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['Authorization', 'Bearer', 'Basic'], tienQuyet: ['chuỗi', 'indexOf'], the: ['javascript', 'http', 'auth'],
      moTa: `${BAI}<p>Viết ${c('parseAuthorization(value)')}: header có dạng ${c('<scheme> <credentials>')}, ví dụ ${c('Bearer eyJhbGciOi…')} hay ${c('Basic YW46c2VjcmV0')}. Trả ${c('{ scheme, credentials }')} với ${c('scheme')} viết THƯỜNG và ${c('credentials')} đã trim. Vắng, rỗng, không có dấu cách, hoặc credentials rỗng ⇒ ${c('null')}.</p>`,
      yeuCau: ['scheme viết thường (Bearer = bearer).', 'Tách ở dấu cách đầu tiên; credentials trim.', 'Thiếu phần nào ⇒ null.'],
      dauVao: 'value: string | undefined.', dauRa: '{ scheme, credentials } hoặc null.',
      rangBuoc: ['Không giải mã credentials.'],
      viDu: [{ input: 'parseAuthorization("Bearer abc.def.ghi")', output: '{ scheme: "bearer", credentials: "abc.def.ghi" }', explanation: 'Tên scheme không phân biệt hoa thường.' }],
      goiY: ['const v = (value ?? "").trim(); const i = v.indexOf(" ");', 'if (i < 0) return null; const credentials = v.slice(i + 1).trim();'],
      khoiDau: { 'main.js': `// Bài 7.1 — tách header Authorization
function parseAuthorization(value) {
  const [scheme, credentials] = value.split(' ');
  return { scheme, credentials };
}
` },
      loiGiai: { 'main.js': `// Bài 7.1 — "<scheme> <credentials>"; scheme không phân biệt hoa thường
function parseAuthorization(value) {
  const v = (value ?? '').trim();
  const i = v.indexOf(' ');
  if (i <= 0) return null;                                  // không có scheme hoặc không có phần sau
  const credentials = v.slice(i + 1).trim();
  if (!credentials) return null;
  return { scheme: v.slice(0, i).toLowerCase(), credentials };
}
` },
      giaiThich: `<p>Middleware xác thực nào cũng bắt đầu bằng bước này. Trả ${c('null')} cho mọi hình dạng lạ giúp nhánh sau chỉ cần một câu ${c('if (!auth) return 401')}.</p>`,
      loiHayGap: ['value.split(" ") ném lỗi khi header vắng (undefined).', 'So scheme === "Bearer" — "bearer" bị từ chối dù hợp lệ.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization',
      kiem: [
        { moTa: 'Bearer and Basic|||Bearer và Basic', goi: '[parseAuthorization("Bearer abc.def.ghi"), parseAuthorization("basic YW46c2VjcmV0")]', mongDoi: [{ scheme: 'bearer', credentials: 'abc.def.ghi' }, { scheme: 'basic', credentials: 'YW46c2VjcmV0' }] },
        { moTa: 'Extra spaces are trimmed|||Khoảng trắng thừa được bỏ', goi: 'parseAuthorization("  BEARER    tok123  ")', mongDoi: { scheme: 'bearer', credentials: 'tok123' } },
        { moTa: 'Missing parts give null|||Thiếu phần trả null', goi: '[parseAuthorization(undefined), parseAuthorization(""), parseAuthorization("Bearer"), parseAuthorization("Bearer   ")]', mongDoi: [null, null, null, null] },
      ],
    },
    {
      tieuDe: 'Không tin trường do client gửi',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['mass assignment', 'danh sách cho phép'], tienQuyet: ['Object.entries', 'filter'], the: ['javascript', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('pickAllowed(body, allowed)')} trả object MỚI chỉ gồm các khoá có trong mảng ${c('allowed')} (khoá RIÊNG của body, không lấy từ prototype). Dùng khi cập nhật hồ sơ: ${c('pickAllowed(req.body, ["name", "avatar"])')} — ai gửi thêm ${c('role: "admin"')} hay ${c('id')} cũng bị bỏ. ${c('body')} không phải object thường ⇒ ${c('{}')}.</p>`,
      yeuCau: ['Chỉ khoá trong allowed.', 'Không sửa body.', 'body null/mảng/chuỗi ⇒ {}.'],
      dauVao: 'body: any; allowed: string[].', dauRa: 'object.',
      rangBuoc: ['Danh sách CHO PHÉP, không phải danh sách cấm.'],
      viDu: [{ input: 'pickAllowed({ name: "An", role: "admin" }, ["name"])', output: '{ name: "An" }', explanation: 'role do người dùng gõ, máy chủ không nhận.' }],
      goiY: ['Object.entries(body).filter(([k]) => allowed.includes(k))', 'Kiểm body: body !== null && typeof body === "object" && !Array.isArray(body).'],
      khoiDau: { 'main.js': `// Bài 7.1 — chỉ nhận trường được phép
function pickAllowed(body, allowed) {
  delete body.role;
  return body;
}
` },
      loiGiai: { 'main.js': `// Bài 7.1 — danh sách cho phép: thứ gì không được nêu tên thì không vào
function pickAllowed(body, allowed) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return {};
  const out = {};
  for (const [key, value] of Object.entries(body)) {      // chỉ khoá riêng, không đi vào prototype
    if (allowed.includes(key)) out[key] = value;
  }
  return out;
}
` },
      giaiThich: `<p>Danh sách cấm (${c('delete body.role')}) luôn sót: hôm sau ai đó thêm cột ${c('isAdmin')} hay ${c('balance')} và nó lọt qua. Danh sách cho phép thì mặc định là "không". Lỗi này có tên: mass assignment — từng cho người dùng GitHub tự thêm mình vào dự án người khác (2012).</p>`,
      loiHayGap: ['Xoá từng trường nguy hiểm — sót trường mới.', 'Sửa trực tiếp req.body.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html',
      kiem: [
        { moTa: 'Role and id are dropped|||role và id bị bỏ', goi: 'pickAllowed({ name: "An", avatar: "a.png", role: "admin", id: 99 }, ["name", "avatar"])', mongDoi: { name: 'An', avatar: 'a.png' } },
        { moTa: 'Body is not changed|||body không bị sửa', chuanBi: 'const b = { name: "An", isAdmin: true }; pickAllowed(b, ["name"]);', goi: 'b', mongDoi: { name: 'An', isAdmin: true } },
        { moTa: 'Non-objects give {}|||Không phải object trả {}', goi: '[pickAllowed(null, ["a"]), pickAllowed(["a"], ["0"]), pickAllowed("x", ["length"])]', mongDoi: [{}, {}, {}] },
      ],
    },
    {
      tieuDe: 'Bảng quyền: vai trò và chủ sở hữu',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['RBAC', 'quyền sở hữu'], tienQuyet: ['object', 'includes'], the: ['javascript', 'auth'],
      moTa: `${BAI}<p>Viết ${c('can(user, action, post)')} cho một blog: ${c('user')} là ${c('{ id, role }')} hoặc ${c('null')}; ${c('action')} là ${c('"read" | "create" | "update" | "delete" | "publish"')}; ${c('post')} là ${c('{ authorId, published }')} (không cần cho create). Luật: ai cũng ${c('read')} được bài ĐÃ đăng; bài chưa đăng chỉ tác giả, editor, admin đọc được. Người đã đăng nhập (mọi vai trò) ${c('create')} được. ${c('update')}: tác giả, editor, admin. ${c('delete')}: tác giả hoặc admin. ${c('publish')}: editor, admin. ${c('null')} user chỉ đọc bài đã đăng. Trả boolean.</p>`,
      yeuCau: ['Tách vai trò và chủ sở hữu.', 'user null không làm gì ngoài đọc bài đã đăng.', 'action lạ ⇒ false.'],
      dauVao: 'user: { id, role } | null; action: string; post?: { authorId, published }.', dauRa: 'boolean.',
      rangBuoc: ['Vai trò: "user", "editor", "admin".'],
      viDu: [{ input: 'can({ id: 1, role: "user" }, "delete", { authorId: 2, published: true })', output: 'false', explanation: 'Không phải tác giả, không phải admin.' }],
      goiY: ['const isAuthor = !!user && !!post && post.authorId === user.id;', 'switch (action) { case "read": … }'],
      khoiDau: { 'main.js': `// Bài 7.1 — bảng quyền
function can(user, action, post) {
  return user !== null;
}
` },
      loiGiai: { 'main.js': `// Bài 7.1 — quyền = vai trò HOẶC quan hệ với tài nguyên (chủ sở hữu)
function can(user, action, post) {
  const role = user ? user.role : null;
  const isAuthor = !!user && !!post && post.authorId === user.id;
  const staff = role === 'editor' || role === 'admin';
  switch (action) {
    case 'read': return !!post && (post.published || isAuthor || staff);
    case 'create': return !!user;
    case 'update': return isAuthor || staff;
    case 'delete': return isAuthor || role === 'admin';
    case 'publish': return staff;
    default: return false;                                  // hành động lạ: mặc định từ chối
  }
}
` },
      giaiThich: `<p>Hầu hết hệ thống thật trộn hai kiểu: theo vai trò (RBAC — editor sửa được mọi bài) và theo quan hệ (tác giả sửa được bài CỦA MÌNH). Đặt mọi luật vào một hàm ${c('can()')} giúp route chỉ hỏi một câu và trả 403 khi false.</p>`,
      loiHayGap: ['Quên kiểm user null ⇒ TypeError.', 'Cho mặc định true với action lạ.', 'So post.authorId == user.id với kiểu khác nhau.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',
      kiem: [
        { moTa: 'Anonymous: only published posts|||Khách: chỉ bài đã đăng', goi: '[can(null, "read", { authorId: 1, published: true }), can(null, "read", { authorId: 1, published: false }), can(null, "create")]', mongDoi: [true, false, false] },
        { moTa: 'Author vs other user|||Tác giả và người khác', goi: '[can({ id: 1, role: "user" }, "update", { authorId: 1, published: false }), can({ id: 2, role: "user" }, "update", { authorId: 1, published: true }), can({ id: 1, role: "user" }, "delete", { authorId: 1 }), can({ id: 1, role: "user" }, "publish", { authorId: 1 })]', mongDoi: [true, false, true, false] },
        { moTa: 'Editor and admin|||Editor và admin', goi: '[can({ id: 5, role: "editor" }, "update", { authorId: 1 }), can({ id: 5, role: "editor" }, "delete", { authorId: 1 }), can({ id: 9, role: "admin" }, "delete", { authorId: 1 }), can({ id: 5, role: "editor" }, "read", { authorId: 1, published: false })]', mongDoi: [true, false, true, true] },
        { moTa: 'Unknown action is denied|||Hành động lạ bị từ chối', goi: 'can({ id: 9, role: "admin" }, "drop-database", {})', mongDoi: false },
      ],
    },
    {
      tieuDe: 'Luật theo route: 401, 403 hay 200',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['401 vs 403', 'mặc định từ chối'], tienQuyet: ['find', 'startsWith'], the: ['javascript', 'auth', 'http'],
      moTa: `${BAI}<p>Viết ${c('checkAccess(rules, user, method, path)')}: ${c('rules')} là mảng ${c('{ method, path, roles }')} theo thứ tự ưu tiên; ${c('path')} của luật có thể kết thúc bằng ${c('/*')} (khớp chính tiền tố đó và mọi thứ bên dưới); ${c('method')} ${c('"*"')} khớp mọi method; ${c('roles')} là ${c('"public"')} (ai cũng được), ${c('"any"')} (phải đăng nhập) hoặc mảng vai trò. Dùng luật ĐẦU TIÊN khớp. Không luật nào khớp ⇒ ${c('403')} (mặc định từ chối). Luật đòi đăng nhập mà ${c('user')} null ⇒ ${c('401')}; sai vai trò ⇒ ${c('403')}; còn lại ${c('200')}.</p>`,
      yeuCau: ['Luật đầu tiên khớp thắng.', '"/*" khớp tiền tố.', 'Không khớp ⇒ 403.', '401 trước 403.'],
      dauVao: 'rules: object[]; user: { role } | null; method, path: string.', dauRa: '200 | 401 | 403.',
      rangBuoc: ['Bỏ query string của path trước khi so.'],
      viDu: [{ input: 'checkAccess([{ method: "GET", path: "/api/admin/*", roles: ["admin"] }], { role: "user" }, "GET", "/api/admin/users")', output: '403', explanation: 'Đúng như /api/admin/users của An trong bài.' }],
      goiY: ['const matchPath = (p, path) => p.endsWith("/*") ? path === p.slice(0, -2) || path.startsWith(p.slice(0, -1)) : p === path;', 'const rule = rules.find((r) => (r.method === "*" || r.method === method) && matchPath(r.path, clean));'],
      khoiDau: { 'main.js': `// Bài 7.1 — luật theo route
function checkAccess(rules, user, method, path) {
  const rule = rules.find((r) => r.path === path);
  if (!rule) return 200;
  return rule.roles.includes(user.role) ? 200 : 401;
}
` },
      loiGiai: { 'main.js': `// Bài 7.1 — luật đầu tiên khớp; không có luật ⇒ từ chối; 401 (ai?) trước 403 (được không?)
function checkAccess(rules, user, method, path) {
  const clean = path.split('?')[0];
  const matchPath = (p) => (p.endsWith('/*')
    ? clean === p.slice(0, -2) || clean.startsWith(p.slice(0, -1))
    : p === clean);
  const rule = rules.find((r) => (r.method === '*' || r.method === method.toUpperCase()) && matchPath(r.path));
  if (!rule) return 403;                                     // mặc định từ chối
  if (rule.roles === 'public') return 200;
  if (!user) return 401;
  if (rule.roles === 'any') return 200;
  return rule.roles.includes(user.role) ? 200 : 403;
}
` },
      giaiThich: `<p>"Mặc định từ chối" là nguyên tắc quan trọng nhất ở đây: route mới quên khai luật sẽ bị chặn (và bạn phát hiện ngay khi thử) thay vì mở toang. Thứ tự luật cho phép viết ngoại lệ trước luật chung, như ${c('/api/admin/health')} công khai trước ${c('/api/admin/*')}.</p>`,
      loiHayGap: ['Không khớp luật ⇒ 200 (mặc định cho phép).', 'Trả 401 cho người đã đăng nhập nhưng sai vai trò.', '"/api/admin/*" khớp nhầm "/api/administrator".'],
      thamKhao: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/',
      kiem: [
        { moTa: 'The lesson app|||App của bài', chuanBi: 'const R = [{ method: "POST", path: "/login", roles: "public" }, { method: "GET", path: "/api/me", roles: "any" }, { method: "*", path: "/api/admin/*", roles: ["admin"] }];', goi: '[checkAccess(R, null, "POST", "/login"), checkAccess(R, null, "GET", "/api/me"), checkAccess(R, { role: "user" }, "GET", "/api/me"), checkAccess(R, { role: "user" }, "GET", "/api/admin/users"), checkAccess(R, { role: "admin" }, "DELETE", "/api/admin/users/3")]', mongDoi: [200, 401, 200, 403, 200] },
        { moTa: 'No matching rule: denied|||Không có luật khớp: từ chối', goi: '[checkAccess([{ method: "GET", path: "/a", roles: "public" }], { role: "admin" }, "GET", "/b"), checkAccess([{ method: "GET", path: "/a", roles: "public" }], null, "POST", "/a")]', mongDoi: [403, 403] },
        { moTa: 'First rule wins; prefix is exact; query ignored|||Luật đầu thắng; tiền tố chính xác; bỏ query', chuanBi: 'const R = [{ method: "GET", path: "/api/admin/health", roles: "public" }, { method: "*", path: "/api/admin/*", roles: ["admin"] }];', goi: '[checkAccess(R, null, "GET", "/api/admin/health?full=1"), checkAccess(R, null, "GET", "/api/admin"), checkAccess(R, { role: "admin" }, "GET", "/api/administrator")]', mongDoi: [200, 401, 403] },
      ],
    },
    {
      tieuDe: 'Giới hạn đăng nhập sai',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['rate limiting', 'cửa sổ thời gian', 'Retry-After'], tienQuyet: ['closure', 'Map', 'filter'], the: ['javascript', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('createLimiter(max, windowMs)')} trả object có hai hàm. ${c('fail(key, now)')} ghi một lần sai cho ${c('key')} (vd email) tại thời điểm ${c('now')} (ms). ${c('check(key, now)')} trả ${c('{ allowed: true }')} nếu trong ${c('windowMs')} ms gần nhất (lần sai có ${c('now - t < windowMs')}) có ÍT HƠN ${c('max')} lần sai; ngược lại ${c('{ allowed: false, retryAfter }')} với ${c('retryAfter')} là số GIÂY (làm tròn lên) tới khi lần sai cũ nhất trong cửa sổ hết hạn. Mỗi key độc lập.</p>`,
      yeuCau: ['Cửa sổ trượt theo thời gian.', 'retryAfter làm tròn lên (Math.ceil).', 'Key độc lập, limiter độc lập.'],
      dauVao: 'max: number; windowMs: number.', dauRa: '{ fail(key, now), check(key, now) }.',
      rangBuoc: ['Không dùng Date.now() — dùng tham số now.'],
      viDu: [{ input: '5 lần fail("an", 0..4000) rồi check("an", 5000) với max 5, window 15 phút', output: '{ allowed: false, retryAfter: 895 }', explanation: 'Lần sai đầu (t=0) hết hạn ở 900 000 ms.' }],
      goiY: ['const log = new Map(); // key → mảng thời điểm', 'const recent = (log.get(key) ?? []).filter((t) => now - t < windowMs);'],
      khoiDau: { 'main.js': `// Bài 7.1 — giới hạn đăng nhập sai
function createLimiter(max, windowMs) {
  let count = 0;
  return {
    fail(key, now) { count++; },
    check(key, now) { return { allowed: count < max }; },
  };
}
` },
      loiGiai: { 'main.js': `// Bài 7.1 — đếm lần sai trong cửa sổ trượt; quá giới hạn thì báo còn chờ bao lâu
function createLimiter(max, windowMs) {
  const log = new Map();                                     // key → thời điểm các lần sai
  const recent = (key, now) => (log.get(key) ?? []).filter((t) => now - t < windowMs);
  return {
    fail(key, now) {
      log.set(key, [...recent(key, now), now]);              // dọn lần cũ khi ghi lần mới
    },
    check(key, now) {
      const r = recent(key, now);
      if (r.length < max) return { allowed: true };
      const oldest = Math.min(...r);
      return { allowed: false, retryAfter: Math.ceil((oldest + windowMs - now) / 1000) };
    },
  };
}
` },
      giaiThich: `<p>Không giới hạn thì một script thử hàng nghìn mật khẩu mỗi phút. Giới hạn theo email chặn dò một tài khoản; hệ thống thật giới hạn thêm theo IP để chặn dò nhiều tài khoản. ${c('retryAfter')} đi vào header ${c('Retry-After')} của response 429 (Bài 6.3).</p>`,
      loiHayGap: ['Một bộ đếm chung cho mọi key.', 'Không bao giờ xoá lần sai cũ — người dùng bị khoá vĩnh viễn.', 'Trả mili giây cho Retry-After.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#login-throttling',
      kiem: [
        { moTa: 'Five failures lock, with seconds to wait|||Năm lần sai thì khoá, kèm số giây chờ', chuanBi: 'const L = createLimiter(5, 15 * 60 * 1000); for (let i = 0; i < 4; i++) L.fail("an", i * 1000);', goi: '[L.check("an", 4500), (L.fail("an", 4000), L.check("an", 5000))]', mongDoi: [{ allowed: true }, { allowed: false, retryAfter: 895 }] },
        { moTa: 'The window slides|||Cửa sổ trượt', chuanBi: 'const L = createLimiter(2, 10000); L.fail("x", 0); L.fail("x", 6000);', goi: '[L.check("x", 9999).allowed, L.check("x", 10000).allowed, L.check("x", 9000).retryAfter]', mongDoi: [false, true, 1] },
        { moTa: 'Keys and limiters are independent|||Key và limiter độc lập', chuanBi: 'const A = createLimiter(1, 1000); const B = createLimiter(1, 1000); A.fail("an", 0);', goi: '[A.check("an", 10).allowed, A.check("binh", 10).allowed, B.check("an", 10).allowed]', mongDoi: [false, true, true] },
      ],
    },
    {
      tieuDe: 'Luồng đăng nhập hoàn chỉnh',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['dò tài khoản', 'khoá tạm', 'một câu báo lỗi'], tienQuyet: ['closure', 'object'], the: ['javascript', 'auth', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('createLogin(users, verify, newSessionId)')} trả hàm ${c('login(email, password, now)')} → ${c('{ status, body, headers }')}. ${c('verify(user, password)')} (cho sẵn) trả boolean; ${c('newSessionId()')} (cho sẵn) trả id mới. Luật: email so KHÔNG phân biệt hoa thường và đã trim. Quá 5 lần sai cho một email trong 15 phút (cửa sổ trượt như bài trước, viết lại bên trong) ⇒ 429 ${c('{ error: "Too many attempts" }')}, header ${c('Retry-After')} (giây, chuỗi), KỂ CẢ khi mật khẩu lần này đúng. Sai email hoặc sai mật khẩu ⇒ 401 ${c('{ error: "Wrong email or password" }')} và ghi một lần sai. Đúng ⇒ 200 ${c('{ name }')}, header ${c('Set-Cookie: sid=<id>; HttpOnly; Secure; SameSite=Lax; Path=/')}, và XOÁ các lần sai của email đó. ${c('headers')} là ${c('{}')} nếu không có gì.</p>`,
      yeuCau: ['Cùng một câu cho sai email và sai mật khẩu.', 'Đếm cả lần sai với email không tồn tại.', 'Bị khoá thì không gọi verify.', 'Đăng nhập đúng xoá bộ đếm.'],
      dauVao: 'users: { email, name }[]; verify: fn; newSessionId: fn.', dauRa: 'login(email, password, now) → { status, body, headers }.',
      rangBuoc: ['Không dùng Date.now().', 'Một hàm tự đủ.'],
      viDu: [{ input: '5 lần sai rồi đăng nhập đúng trong 15 phút', output: '{ status: 429, …, headers: { "Retry-After": "…" } }', explanation: 'Nếu cho qua, kẻ dò chỉ cần thử tiếp tới khi đúng.' }],
      goiY: ['const key = email.trim().toLowerCase();', 'Kiểm giới hạn TRƯỚC khi tìm user và gọi verify.'],
      khoiDau: { 'main.js': `// Bài 7.1 — luồng đăng nhập
function createLogin(users, verify, newSessionId) {
  return function login(email, password, now) {
    const user = users.find((u) => u.email === email);
    if (!user) return { status: 404, body: { error: 'No such user' }, headers: {} };
    if (!verify(user, password)) return { status: 401, body: { error: 'Wrong password' }, headers: {} };
    return { status: 200, body: { name: user.name }, headers: {} };
  };
}
` },
      loiGiai: { 'main.js': `// Bài 7.1 — kiểm giới hạn → tìm người → kiểm mật khẩu → cấp phiên; một câu cho mọi thất bại
function createLogin(users, verify, newSessionId) {
  const WINDOW = 15 * 60 * 1000;
  const MAX = 5;
  const fails = new Map();                                   // email → thời điểm các lần sai
  const recent = (key, now) => (fails.get(key) ?? []).filter((t) => now - t < WINDOW);
  const wrong = { status: 401, body: { error: 'Wrong email or password' }, headers: {} };

  return function login(email, password, now) {
    const key = String(email ?? '').trim().toLowerCase();
    const r = recent(key, now);
    if (r.length >= MAX) {
      const wait = Math.ceil((Math.min(...r) + WINDOW - now) / 1000);
      return { status: 429, body: { error: 'Too many attempts' }, headers: { 'Retry-After': String(wait) } };
    }
    const user = users.find((u) => u.email.trim().toLowerCase() === key);
    if (!user || !verify(user, password)) {
      fails.set(key, [...r, now]);                           // đếm cả email không tồn tại
      return wrong;
    }
    fails.delete(key);
    return {
      status: 200,
      body: { name: user.name },
      headers: { 'Set-Cookie': ´sid=@{newSessionId()}; HttpOnly; Secure; SameSite=Lax; Path=/´ },
    };
  };
}
` },
      giaiThich: `<p>Ba lỗi của code khởi đầu đều có thật ngoài đời: 404 "No such user" cho phép dò email nào đã đăng ký; không giới hạn cho phép đoán mật khẩu vô tận; không có cookie thì đăng nhập vô nghĩa. Thứ tự kiểm quan trọng: kiểm khoá trước để kẻ dò không biết mật khẩu nào đúng ngay cả khi đoán trúng lúc đang bị khoá.</p>`,
      loiHayGap: ['Thông báo khác nhau cho sai email / sai mật khẩu.', 'Chỉ đếm lần sai khi email tồn tại — lộ email qua hành vi khoá.', 'Cho qua mật khẩu đúng khi đang bị khoá.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages',
      kiem: [
        { moTa: 'Same 401 for unknown email and wrong password|||Cùng 401 cho email lạ và sai mật khẩu', chuanBi: 'const login = createLogin([{ email: "an@example.com", name: "An" }], (u, p) => p === "right", () => "S1");', goi: '[login("nobody@example.com", "x", 0), login("an@example.com", "wrong", 1)]', mongDoi: [{ status: 401, body: { error: 'Wrong email or password' }, headers: {} }, { status: 401, body: { error: 'Wrong email or password' }, headers: {} }] },
        { moTa: 'Success sets a safe cookie; email case-insensitive|||Thành công đặt cookie an toàn; email không phân biệt hoa thường', chuanBi: 'const login = createLogin([{ email: "an@example.com", name: "An" }], (u, p) => p === "right", () => "S1");', goi: 'login("  An@Example.com ", "right", 0)', mongDoi: { status: 200, body: { name: 'An' }, headers: { 'Set-Cookie': 'sid=S1; HttpOnly; Secure; SameSite=Lax; Path=/' } } },
        { moTa: 'Locked after 5 failures, even with the right password|||Khoá sau 5 lần sai, kể cả mật khẩu đúng', chuanBi: 'let calls = 0; const login = createLogin([{ email: "an@example.com", name: "An" }], (u, p) => { calls++; return p === "right"; }, () => "S1"); for (let i = 0; i < 5; i++) login("an@example.com", "bad", i * 1000); const before = calls; const r = login("an@example.com", "right", 10000);', goi: '[r, calls - before]', mongDoi: [{ status: 429, body: { error: 'Too many attempts' }, headers: { 'Retry-After': '890' } }, 0] },
        { moTa: 'Unknown emails are counted too; success resets|||Email lạ cũng bị đếm; thành công thì đặt lại', chuanBi: 'const login = createLogin([{ email: "an@example.com", name: "An" }], (u, p) => p === "right", () => "S1"); for (let i = 0; i < 5; i++) login("ghost@example.com", "x", i); for (let i = 0; i < 4; i++) login("an@example.com", "bad", i); login("an@example.com", "right", 10); for (let i = 0; i < 4; i++) login("an@example.com", "bad", 20 + i);', goi: '[login("ghost@example.com", "x", 100).status, login("an@example.com", "right", 100).status]', mongDoi: [429, 200] },
      ],
    },
  ],
});
