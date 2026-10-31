/** API Design · 7.2 — Kiểm hợp đồng: có body hay không (lỗi 415 thật), ghép đường dẫn thật với path mẫu của tài liệu. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Contract checks 1 — What the first run found', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 7.2 (check-drift.mjs against LabFlow, Node fetch and Chromium probed).',
  vi: 'Những điều từ bài 7.2 (check-drift.mjs chạy với LabFlow, dò Node fetch và Chromium).',
  cau: [
    q('c1', ['Why had six chapters of curl never hit the 415 on POST …/cancel?', 'Vì sao sáu chương gõ curl chưa từng gặp 415 ở POST …/cancel?'],
      ['curl sends no Content-Length on an empty POST; fetch sends Content-Length: 0', 'curl always adds Content-Type: application/json to every request it sends', 'The bug only happens over HTTPS, and the lessons used plain HTTP', 'curl retries a 415 automatically, so the error never reached the screen'],
      ['Measured with hdr-probe.mjs: Node fetch and Chromium both sent content-length=0. LabFlow treated any length header as a body.', 'Đo bằng hdr-probe.mjs: fetch của Node và Chromium đều gửi content-length=0. LabFlow coi có header độ dài là có body.']),
    q('c2', ['The document said capacity is a string. Which tool noticed?', 'Tài liệu ghi capacity là string. Công cụ nào nhận ra?'],
      ['Only the contract check — lint saw a valid document', 'Only Redocly lint, through its struct rule for schemas', 'Both, because they read the same openapi.yaml file', 'Neither, because JSON numbers are valid strings'],
      ['Lint checks the document’s structure; it cannot know what the server sends. 4 checks failed with “must be string”.', 'Lint kiểm cấu trúc tài liệu; nó không thể biết server gửi gì. 4 phép kiểm trượt với “must be string”.']),
    q('c3', ['Why does check-drift log in as An, Bin and Lan?', 'Vì sao check-drift đăng nhập bằng An, Bình và cô Lan?'],
      ['One account exercises one branch of each policy; 403/404 answers need another user', 'Because the server limits each account to five requests per minute', 'Because Ajv needs three tokens to compile the components schema', 'To spread the load evenly across three database connections'],
      ['Bin reading bk_1 gives 403 (old endpoint) and 404 (receipt) — documented answers you only see as someone else.', 'Bình đọc bk_1 ra 403 (endpoint cũ) và 404 (biên nhận) — những câu trả lời chỉ thấy khi là người khác.']),
  ],
  goiY: [['What does each tool actually look at?', 'Mỗi công cụ thật sự nhìn vào cái gì?'], ['Which client sends which headers?', 'Client nào gửi header nào?']],
  loi: [['Thinking lint proves the document matches the server.', 'Nghĩ rằng lint chứng minh tài liệu khớp server.'], ['Testing only with curl and one account.', 'Chỉ thử bằng curl và một tài khoản.']],
  tns: [tn('drift', 'tài liệu và server lệch nhau'), tn('contract check', 'kiểm câu trả lời thật theo tài liệu')],
  kn: ['contract testing'],
});

function hasBody(headers) {
  const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  if (h['transfer-encoding'] !== undefined) return true;
  const n = Number(h['content-length'] ?? 0);
  return Number.isFinite(n) && n > 0;
}
const E2 = jsBai({
  ten: 'Contract checks 2 — Write hasBody(headers): the fix for the 415 bug', kho: 'EASY', phut: 10,
  en: `<p>Header names may come in any case. A request has a body when it has a <code>Transfer-Encoding</code> header (any value), or a <code>Content-Length</code> that is a number greater than 0. <code>Content-Length: 0</code>, a missing header, or a value that is not a number ⇒ no body.</p>`,
  vi: `<p>Tên header có thể viết hoa thường bất kỳ. Request có body khi có header <code>Transfer-Encoding</code> (giá trị bất kỳ), hoặc <code>Content-Length</code> là một số lớn hơn 0. <code>Content-Length: 0</code>, thiếu header, hoặc giá trị không phải số ⇒ không có body.</p>`,
  dauVao: ['headers — object of header name ⇒ string', 'headers — object tên header ⇒ chuỗi'],
  dauRa: ['true | false', 'true | false'],
  goiY: [['Lower-case the names first.', 'Hạ chữ thường tên header trước.'], ['Number("abc") is NaN, and NaN > 0 is false.', 'Number("abc") là NaN, và NaN > 0 là false.']],
  loi: [['Checking only whether Content-Length exists — the original LabFlow bug.', 'Chỉ kiểm Content-Length có tồn tại — chính lỗi gốc của LabFlow.'], ['Forgetting chunked bodies (Transfer-Encoding).', 'Quên body gửi theo khúc (Transfer-Encoding).']],
  gt: ['fetch() and Chromium send content-length 0 for an empty POST: false, so the 415 gate no longer fires (lesson 7.2).', 'fetch() và Chromium gửi content-length 0 cho POST rỗng: false, nên cổng 415 không còn bắn nhầm (bài 7.2).'],
  kn: ['HTTP'],
  tns: [tn('Content-Length', 'độ dài body tính bằng byte'), tn('Transfer-Encoding: chunked', 'gửi body thành nhiều khúc, không biết trước độ dài')],
  dau: `/** does this request carry a body? */
function hasBody(headers) {
  // Write your solution here
  return headers['content-length'] !== undefined;
}
`,
  giai: '// Reference solution\n' + nguon(hasBody),
  cases: [
    { goi: goi('hasBody', { 'content-length': '0' }), moTa: ['fetch() POST without a body', 'fetch() POST không body'] },
    { goi: goi('hasBody', { 'content-length': '57', 'content-type': 'application/json' }), moTa: ['A JSON body', 'Một body JSON'] },
    { goi: goi('hasBody', {}), an: true, moTa: ['curl POST without a body', 'curl POST không body'] },
    { goi: goi('hasBody', { 'Transfer-Encoding': 'chunked' }), an: true },
    { goi: goi('hasBody', { 'Content-Length': 'abc' }), an: true },
    { goi: goi('hasBody', { 'CONTENT-LENGTH': '12' }), an: true },
  ],
});

function matchTemplate(templates, path) {
  const segs = path.split('?')[0].split('/');
  const fits = templates.filter((t) => {
    const ts = t.split('/');
    return ts.length === segs.length && ts.every((x, i) => /^\{.+\}$/.test(x) || x === segs[i]);
  });
  const literal = (t) => t.split('/').filter((x) => !/^\{.+\}$/.test(x)).length;
  fits.sort((a, b) => literal(b) - literal(a));
  return fits[0] ?? null;
}
const P = ['/labs', '/labs/{labId}', '/labs/{labId}/waitlist', '/bookings', '/bookings/{id}', '/bookings/{id}/cancel', '/me', '/me/waitlist', '/waitlist/{id}'];
const E3 = jsBai({
  ten: 'Contract checks 3 — Write matchTemplate(templates, path): find the documented path', kho: 'MEDIUM', phut: 15,
  en: `<p>The contract check must find which documented path a real URL belongs to. Ignore the query string. A template fits when it has the same number of <code>/</code>-segments and every segment is either equal or a <code>{placeholder}</code>. If several fit, the one with the most literal (non-placeholder) segments wins — <code>/me/waitlist</code> beats <code>/me/{x}</code>. No fit ⇒ <code>null</code>.</p>`,
  vi: `<p>Bộ kiểm hợp đồng phải biết một URL thật thuộc path nào trong tài liệu. Bỏ phần query. Một path mẫu khớp khi có cùng số đoạn <code>/</code> và mỗi đoạn hoặc bằng nhau hoặc là <code>{chỗ trống}</code>. Nhiều mẫu cùng khớp thì mẫu có nhiều đoạn chữ cố định nhất thắng — <code>/me/waitlist</code> thắng <code>/me/{x}</code>. Không khớp ⇒ <code>null</code>.</p>`,
  dauVao: ['templates — string[]; path — a real path, maybe with ?query', 'templates — string[]; path — đường dẫn thật, có thể kèm ?query'],
  dauRa: ['the matching template or null', 'path mẫu khớp hoặc null'],
  goiY: [['Compare segment by segment after split("/").', 'So từng đoạn sau split("/").'], ['Sort the candidates by number of literal segments.', 'Sắp các ứng viên theo số đoạn chữ cố định.']],
  loi: [['Letting {id} match several segments.', 'Để {id} khớp nhiều đoạn.'], ['Forgetting the query string — /bookings?limit=1 must still match /bookings.', 'Quên phần query — /bookings?limit=1 vẫn phải khớp /bookings.']],
  gt: ['check-drift.mjs needs exactly this to find op = spec.paths[template][method] for POST /bookings/bk_1/cancel.', 'check-drift.mjs cần đúng việc này để tìm op = spec.paths[template][method] cho POST /bookings/bk_1/cancel.'],
  kn: ['contract testing', 'routing'],
  tns: [tn('path template', 'path mẫu có chỗ trống như {id}'), tn('specificity', 'độ cụ thể khi nhiều mẫu cùng khớp')],
  dau: `/** which documented path does this real path belong to? */
function matchTemplate(templates, path) {
  // Write your solution here
  return templates.find((t) => path.startsWith(t.split('{')[0])) ?? null;
}
`,
  giai: '// Reference solution\n' + nguon(matchTemplate),
  cases: [
    { goi: goi('matchTemplate', P, '/bookings/bk_1/cancel'), moTa: ['The cancel request of lesson 7.2', 'Request huỷ của bài 7.2'] },
    { goi: goi('matchTemplate', P, '/bookings?limit=1'), moTa: ['Query string ignored', 'Bỏ qua query'] },
    { goi: goi('matchTemplate', [...P, '/me/{x}'], '/me/waitlist'), an: true, moTa: ['Literal beats placeholder', 'Chữ cố định thắng chỗ trống'] },
    { goi: goi('matchTemplate', P, '/bookings/bk_1/check-in'), an: true, moTa: ['Undocumented', 'Chưa có trong tài liệu'] },
    { goi: goi('matchTemplate', P, '/labs/lab_2/waitlist'), an: true },
    { goi: goi('matchTemplate', P, '/waitlist/wl_1/extra'), an: true },
  ],
});

export default doiDau({ slug: 'api-7-1-kiem-hop-dong', ten: '7.2 Contract checks against the running server', khoa: KHOA, baiHoc: 'api-7-1-kiem-hop-dong', de: [E1, E2, E3] });
