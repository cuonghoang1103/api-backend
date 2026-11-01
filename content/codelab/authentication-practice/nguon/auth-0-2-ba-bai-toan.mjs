/** Authentication · 0.2 — Ba bài toán trong chữ "đăng nhập": ma trận 401/404/200 thật, 401 vs 403, tự viết getProfile (ba cổng) và canChangeRole. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s00/_ma.mjs';

const MT = Object.fromEntries(OUT['02-ma-tran'].split('\n').slice(1).filter(Boolean).map((l) => {
  const [who, ...cells] = l.trim().split(/\s+/);
  return [who, Object.fromEntries(cells.map((c) => c.split('=')))];
}));

/* ── 1. Ma trận thật ── */
const MA = ['200', '401', '403', '404'];
const S1 = cs({
  ten: '0.2-1 — Fill the real authorization matrix', kho: 'EASY', phut: 10, loai: 'table',
  en: 'demo0/gates.js, route GET /v3/users/:id: you may read your own profile; a LAB_MANAGER may read anyone’s; strangers get 404 (the profile is hidden, not forbidden). Fill in the status codes the real run printed.',
  vi: 'demo0/gates.js, route GET /v3/users/:id: bạn đọc được hồ sơ của chính mình; LAB_MANAGER đọc được của mọi người; người lạ nhận 404 (hồ sơ bị giấu, không phải bị cấm). Điền mã trạng thái mà lần chạy thật đã in ra.',
  bang: [bang1('b1', ['Token × profile ⇒ status', 'Token × hồ sơ ⇒ mã'], [{ ma: 'w', ten: 'Token' }, { ma: 'u1', ten: 'usr_1 (An)', luaChon: MA }, { ma: 'u2', ten: 'usr_2 (Binh)', luaChon: MA }, { ma: 'u3', ten: 'usr_3 (Co Lan)', luaChon: MA }],
    ['none', 'tok_an', 'tok_bin', 'tok_lan'].map((w) => ({ o: { w }, a: { u1: MT[w].usr_1, u2: MT[w].usr_2, u3: MT[w].usr_3 } })),
    ['No token ⇒ 401 everywhere (gate 2). With a token, gate 3 decides: yourself or LAB_MANAGER ⇒ 200; otherwise 404, which does not even confirm the profile exists.', 'Không token ⇒ 401 ở mọi ô (cổng 2). Có token thì cổng 3 quyết định: chính mình hoặc LAB_MANAGER ⇒ 200; còn lại 404, không xác nhận cả việc hồ sơ có tồn tại.'])],
  goiY: [['Gate 2 first: no valid token ⇒ 401 regardless of the id.', 'Cổng 2 trước: không có token hợp lệ ⇒ 401 bất kể id.'], ['Co Lan is a LAB_MANAGER.', 'Cô Lan là LAB_MANAGER.']],
  loi: [['403 for a student reading another student: this route hides with 404.', '403 cho sinh viên đọc hồ sơ sinh viên khác: route này giấu bằng 404.'], ['200 for “none” on your own id: without a token nobody is “you”.', '200 cho "none" ở id của mình: không có token thì chẳng ai là "bạn".']],
  tns: [tn('IDOR', 'tham chiếu đối tượng trực tiếp không kiểm quyền'), tn('gate', 'cổng kiểm')],
  kn: ['authorization'],
});

/* ── 2. 401 vs 403 vs IDOR ── */
const S2 = cs({
  ten: '0.2-2 — Which gate failed?', kho: 'EASY', phut: 8,
  en: `Real outputs of lesson 0.2:${pre(OUT['02-v1-mao'])}${pre(OUT['02-v2-quet'])}${pre(OUT['02-v3-403'].split('\n').slice(0, 2).join('\n'))}`,
  vi: `Output thật của bài 0.2:${pre(OUT['02-v1-mao'])}${pre(OUT['02-v2-quet'])}${pre(OUT['02-v3-403'].split('\n').slice(0, 2).join('\n'))}`,
  cau: [
    q('c1', ['/v1/me returned Co Lan’s profile to anyone who sent X-User-Id: usr_3. What is missing?', '/v1/me trả hồ sơ Cô Lan cho bất kỳ ai gửi X-User-Id: usr_3. Thiếu gì?'],
      ['Authentication: a claim was accepted without any proof', 'Authorization: the role check compares the wrong field', 'Rate limiting: the header can be sent too many times', 'Transport: the header travels without HTTPS'],
      ['Saying who you are is identification. Without proof, anyone can say anything.', 'Nói mình là ai là định danh. Không có bằng chứng thì ai cũng nói được.']),
    q('c2', ['/v2 answered 200 for usr_1, usr_2 and usr_3 to An’s token. Which gate is missing?', '/v2 trả 200 cho usr_1, usr_2 và usr_3 với token của An. Thiếu cổng nào?'],
      ['Gate 3: it knows who An is, not whether she may read that row', 'Gate 2: the bearer token was never really checked', 'Gate 1: the id in the URL was never parsed or validated', 'None: a signed-in user may read every profile'],
      ['Authenticated ≠ allowed. The fix lives in the lookup: yourself or a manager, otherwise 404.', 'Đã xác thực ≠ được phép. Cách sửa nằm ở phép tra: chính mình hoặc quản lý, còn lại 404.']),
    q('c3', ['An tries to make herself LAB_MANAGER and gets 403. Why 403 and not 401?', 'An tự nâng mình thành LAB_MANAGER và nhận 403. Sao 403 mà không 401?'],
      ['The server knows who she is, and the answer is still no', 'Her token expired between the two requests she sent', 'The two codes are interchangeable; 403 is just newer', 'The request body was missing the required role field'],
      ['401 = “I do not know who you are”; 403 = “I know, and no”. Sending 401 for a permission failure sends clients into a login loop.', '401 = "tôi không biết bạn là ai"; 403 = "tôi biết, và không". Gửi 401 cho lỗi quyền khiến client đăng nhập lại mãi.']),
  ],
  goiY: [['Identify → authenticate → authorize.', 'Định danh → xác thực → phân quyền.'], ['Ask: did the server know who the caller was?', 'Hỏi: máy chủ có biết người gọi là ai không?']],
  loi: [['Calling every failure 401.', 'Gọi mọi lỗi là 401.'], ['Thinking requireAuth is authorization.', 'Tưởng requireAuth là phân quyền.']],
  kn: ['401 vs 403'],
});

/* ── 3. Tự viết: getProfile ── */
function getProfile(authorization, id, tokens, users) {
  var m = /^Bearer (\S+)$/.exec(authorization || '');
  var userId = m && Object.prototype.hasOwnProperty.call(tokens, m[1]) ? tokens[m[1]] : null;
  var me = users.find(function (u) { return u.id === userId; });
  if (!me) return { status: 401, body: { error: 'UNAUTHENTICATED' } };          // gate 2
  var allowed = me.id === id || me.role === 'LAB_MANAGER';                        // gate 3, inside the lookup
  var target = allowed ? users.find(function (u) { return u.id === id; }) : undefined;
  if (!target) return { status: 404, body: { error: 'NOT_FOUND' } };              // hidden, not forbidden
  return { status: 200, body: target };
}
const USERS = [
  { id: 'usr_1', name: 'Nguyen Van An', role: 'STUDENT' },
  { id: 'usr_2', name: 'Tran Thi Binh', role: 'STUDENT' },
  { id: 'usr_3', name: 'Co Lan', role: 'LAB_MANAGER' },
];
const TOKENS = { tok_an: 'usr_1', tok_bin: 'usr_2', tok_lan: 'usr_3', tok_old: 'usr_9' };
const S3 = jsBai({
  ten: '0.2-3 — Write getProfile(): the three gates', kho: 'MEDIUM', phut: 15,
  en: `<p>Re-create <code>GET /v3/users/:id</code> as a pure function <code>getProfile(authorization, id, tokens, users)</code>:</p><ol>
<li>Read <code>Authorization: Bearer &lt;token&gt;</code>; look the token up in <code>tokens</code> (token ⇒ user id) and the user in <code>users</code>. No header, wrong scheme, unknown token, or a token whose user no longer exists ⇒ <code>{ status: 401, body: { error: 'UNAUTHENTICATED' } }</code>.</li>
<li>You may read your own profile; a <code>LAB_MANAGER</code> may read anyone’s. Everything else — and ids that do not exist — ⇒ <code>{ status: 404, body: { error: 'NOT_FOUND' } }</code>.</li>
<li>Otherwise <code>{ status: 200, body: &lt;the user object&gt; }</code>.</li></ol>`,
  vi: `<p>Dựng lại <code>GET /v3/users/:id</code> thành hàm thuần <code>getProfile(authorization, id, tokens, users)</code>:</p><ol>
<li>Đọc <code>Authorization: Bearer &lt;token&gt;</code>; tra token trong <code>tokens</code> (token ⇒ id người dùng) và người dùng trong <code>users</code>. Không header, sai lược đồ, token lạ, hoặc token mà người dùng không còn tồn tại ⇒ <code>{ status: 401, body: { error: 'UNAUTHENTICATED' } }</code>.</li>
<li>Bạn đọc được hồ sơ của mình; <code>LAB_MANAGER</code> đọc được của mọi người. Còn lại — kể cả id không tồn tại — ⇒ <code>{ status: 404, body: { error: 'NOT_FOUND' } }</code>.</li>
<li>Ngược lại <code>{ status: 200, body: &lt;object người dùng&gt; }</code>.</li></ol>`,
  goiY: [['Do gate 2 completely before looking at the id.', 'Làm xong cổng 2 rồi mới nhìn tới id.'], ['Put the permission into the lookup, so “not allowed” and “does not exist” look the same.', 'Đặt quyền vào trong phép tra, để "không được phép" và "không tồn tại" trông giống nhau.']],
  loi: [['Fetching the profile first and checking afterwards — easy to forget, and 403 confirms the id exists.', 'Lấy hồ sơ trước rồi mới kiểm — dễ quên, và 403 xác nhận id có tồn tại.'], ['tokens[token] for token "constructor" finds Object’s constructor.', 'tokens[token] với token "constructor" tìm ra constructor của Object.']],
  gt: ['Gate 2 answers “who?” and fails with 401; gate 3 answers “may this person read that row?”. Putting gate 3 inside the lookup makes forgetting it impossible and makes forbidden rows indistinguishable from missing ones.', 'Cổng 2 trả lời "ai?" và trượt bằng 401; cổng 3 trả lời "người này có được đọc dòng đó không?". Đặt cổng 3 vào trong phép tra khiến không thể quên nó và khiến dòng bị cấm trông như dòng không tồn tại.'],
  kn: ['IDOR'],
  tns: [tn('IDOR / BOLA', 'lỗi phân quyền theo đối tượng')],
  dau: `/** ⇒ { status, body } */
function getProfile(authorization, id, tokens, users) {
  // Write your solution here
  var token = (authorization || '').replace('Bearer ', '');
  if (!tokens[token]) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
  var target = users.find(function (u) { return u.id === id; });
  if (!target) return { status: 404, body: { error: 'NOT_FOUND' } };
  return { status: 200, body: target };
}
`,
  giai: '// Reference solution\n' + nguon(getProfile),
  cases: [
    { goi: goi('getProfile', 'Bearer tok_an', 'usr_1', TOKENS, USERS) },
    { goi: goi('getProfile', 'Bearer tok_an', 'usr_2', TOKENS, USERS), moTa: ['An reads Binh — the IDOR', 'An đọc Bình — lỗi IDOR'] },
    { goi: goi('getProfile', 'Bearer tok_lan', 'usr_2', TOKENS, USERS), an: true },
    { goi: `getProfile(undefined, 'usr_1', ${JSON.stringify(TOKENS)}, ${JSON.stringify(USERS)})`, an: true },
    { goi: goi('getProfile', 'Basic tok_an', 'usr_1', TOKENS, USERS), an: true },
    { goi: goi('getProfile', 'Bearer tok_old', 'usr_1', TOKENS, USERS), an: true, moTa: ['Token of a deleted user', 'Token của người dùng đã bị xoá'] },
    { goi: goi('getProfile', 'Bearer constructor', 'usr_1', TOKENS, USERS), an: true },
    { goi: goi('getProfile', 'Bearer tok_lan', 'usr_4', TOKENS, USERS), an: true },
    { goi: goi('getProfile', 'Bearer tok_bin', 'usr_3', TOKENS, USERS), an: true },
  ],
});

/* ── 4. Tự viết: changeRole (403) ── */
function changeRole(me, target, role) {
  if (!me) return 401;
  if (me.role !== 'LAB_MANAGER') return 403;          // we know who you are, and no
  if (!target) return 404;
  if (['STUDENT', 'LECTURER', 'LAB_MANAGER'].indexOf(role) < 0) return 422;
  if (me.id === target.id && role !== 'LAB_MANAGER') return 409; // the last manager cannot demote herself here
  return 200;
}
const S4 = jsBai({
  ten: '0.2-4 — Write changeRole(me, target, role): 401, 403, 404, 422, 409', kho: 'MEDIUM', phut: 10,
  en: `<p><code>PATCH /v3/users/:id/role</code> as a pure decision returning only the status code. <code>me</code> is the authenticated user or <code>null</code>; <code>target</code> the user to change or <code>null</code>. In this order: no <code>me</code> ⇒ 401; <code>me</code> is not a <code>LAB_MANAGER</code> ⇒ 403; no target ⇒ 404; role not one of <code>STUDENT</code>, <code>LECTURER</code>, <code>LAB_MANAGER</code> ⇒ 422; a manager demoting <b>herself</b> ⇒ 409; otherwise 200.</p>`,
  vi: `<p><code>PATCH /v3/users/:id/role</code> dưới dạng hàm quyết định chỉ trả mã trạng thái. <code>me</code> là người đã xác thực hoặc <code>null</code>; <code>target</code> là người cần đổi hoặc <code>null</code>. Theo thứ tự: không có <code>me</code> ⇒ 401; <code>me</code> không phải <code>LAB_MANAGER</code> ⇒ 403; không có target ⇒ 404; vai trò không thuộc <code>STUDENT</code>, <code>LECTURER</code>, <code>LAB_MANAGER</code> ⇒ 422; quản lý tự hạ vai trò <b>của chính mình</b> ⇒ 409; còn lại 200.</p>`,
  goiY: [['The order is the contract: 403 comes before 404 here (a student must not learn which ids exist).', 'Thứ tự là hợp đồng: ở đây 403 đứng trước 404 (sinh viên không được biết id nào tồn tại).'], ['Self-demotion is a state conflict, not a permission problem.', 'Tự hạ vai trò là xung đột trạng thái, không phải chuyện quyền.']],
  loi: [['401 for a student: she is authenticated.', '401 cho sinh viên: cô ấy đã xác thực.'], ['Checking the target before the permission: leaks which ids exist.', 'Kiểm target trước quyền: khai ra id nào tồn tại.']],
  gt: ['Each status tells the client what to do next: 401 log in, 403 stop, 404 fix the id, 422 fix the body, 409 change the state first.', 'Mỗi mã cho client biết làm gì tiếp: 401 đăng nhập, 403 dừng, 404 sửa id, 422 sửa body, 409 đổi trạng thái trước.'],
  kn: ['401 vs 403'],
  dau: `/** ⇒ 200 | 401 | 403 | 404 | 409 | 422 */
function changeRole(me, target, role) {
  // Write your solution here
  if (!me) return 401;
  if (!target) return 404;
  if (me.role !== 'LAB_MANAGER') return 401;
  return 200;
}
`,
  giai: '// Reference solution\n' + nguon(changeRole),
  cases: [
    { goi: goi('changeRole', USERS[0], USERS[0], 'LAB_MANAGER'), moTa: ['An promotes herself (real run: 403)', 'An tự nâng mình (chạy thật: 403)'] },
    { goi: goi('changeRole', USERS[2], USERS[1], 'LAB_MANAGER'), moTa: ['Co Lan promotes Binh (real run: 200)', 'Cô Lan nâng Bình (chạy thật: 200)'] },
    { goi: `changeRole(null, ${JSON.stringify(USERS[1])}, 'STUDENT')`, an: true },
    { goi: `changeRole(${JSON.stringify(USERS[0])}, null, 'STUDENT')`, an: true },
    { goi: `changeRole(${JSON.stringify(USERS[2])}, null, 'STUDENT')`, an: true },
    { goi: goi('changeRole', USERS[2], USERS[1], 'ADMIN'), an: true },
    { goi: goi('changeRole', USERS[2], USERS[2], 'STUDENT'), an: true },
  ],
});

export default doiDau({ slug: 'auth-0-2-ba-bai-toan', ten: '0.2 Three problems hiding in the word “login”', khoa: KHOA, baiHoc: 'auth-0-2-ba-bai-toan', de: [S1, S2, S3, S4] });
