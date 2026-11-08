/** SDN302 · 0.3 — Chuẩn đầu ra (CLO1–CLO8): CLO ↔ chương, Progress Test ↔ CLO, việc nào chứng minh CLO nào, và một hàm báo CLO còn thiếu cho dự án. */
import { doiDau, KHOA, bai, cs, q, qn, bang1, tn } from './_sdn.mjs';

const J = String.raw;
const CH = ['Ch1', 'Ch2', 'Ch2 · Ch8', 'Ch3', 'Ch4', 'Ch5', 'Ch6'];

const E1 = cs({
  ten: 'CLOs and the chapters that teach them', kho: 'EASY', phut: 6, loai: 'table',
  en: 'The CLO table of lesson 0.3. For each outcome, choose the chapter(s) where it is taught.',
  vi: 'Bảng CLO của bài 0.3. Với mỗi chuẩn đầu ra, chọn (các) chương dạy nó.',
  bang: [bang1('c1', ['CLO → chapter', 'CLO → chương'], [{ ma: 'clo', ten: 'CLO' }, { ma: 'ch', ten: 'Chapter', luaChon: CH }], [
    { o: { clo: 'CLO1 — Node, modules, APIs, the HTTP server' }, a: { ch: 'Ch1' } },
    { o: { clo: 'CLO2 — Express (and NestJS/Hono), build a web server' }, a: { ch: 'Ch2 · Ch8' } },
    { o: { clo: 'CLO3 — Express Generator' }, a: { ch: 'Ch2' } },
    { o: { clo: 'CLO4 — MongoDB, Node apps working with data' }, a: { ch: 'Ch3' } },
    { o: { clo: 'CLO5 — REST APIs with Express, MongoDB, Mongoose & population' }, a: { ch: 'Ch4' } },
    { o: { clo: 'CLO6 — user authentication' }, a: { ch: 'Ch5' } },
    { o: { clo: 'CLO7 — Backend-as-a-Service' }, a: { ch: 'Ch6' } },
    { o: { clo: 'CLO8 — EJS and Handlebars templating' }, a: { ch: 'Ch4' } },
  ], ['CLO2 spans two chapters: Express in Chapter 2 and the two other prescribed frameworks (NestJS, Hono) in Chapter 8. CLO5 and CLO8 both live in Chapter 4 (REST in MVC + templating).', 'CLO2 trải hai chương: Express ở Chương 2 và hai framework bắt buộc còn lại (NestJS, Hono) ở Chương 8. CLO5 và CLO8 cùng nằm ở Chương 4 (REST theo MVC + templating).'])],
  goiY: [['Follow the order of the course map.', 'Đi theo thứ tự bản đồ môn học.'], ['Templating sits next to the REST API.', 'Templating nằm cạnh REST API.']],
  loi: [['Forgetting that NestJS/Hono belong to CLO2.', 'Quên rằng NestJS/Hono thuộc CLO2.'], ['Putting BaaS in Chapter 5.', 'Đặt BaaS ở Chương 5.']],
  tns: [tn('CLO', 'Course Learning Outcome — chuẩn đầu ra')],
  kn: ['CLO'],
});

const E2 = cs({
  ten: 'Which Progress Test checks which CLO?', kho: 'EASY', phut: 5, loai: 'table',
  en: 'PT1 covers CLO1–5 and CLO8, PT2 covers CLO6, PT3 covers CLO7. Fill in the test for each CLO.',
  vi: 'PT1 gồm CLO1–5 và CLO8, PT2 gồm CLO6, PT3 gồm CLO7. Điền bài test cho mỗi CLO.',
  bang: [bang1('c2', ['CLO → Progress Test', 'CLO → Progress Test'], [{ ma: 'clo', ten: 'CLO' }, { ma: 'pt', ten: 'Progress Test', luaChon: ['PT1', 'PT2', 'PT3'] }], [
    { o: { clo: 'CLO1 (Node, HTTP)' }, a: { pt: 'PT1' } },
    { o: { clo: 'CLO4 (MongoDB)' }, a: { pt: 'PT1' } },
    { o: { clo: 'CLO5 (REST + Mongoose)' }, a: { pt: 'PT1' } },
    { o: { clo: 'CLO6 (authentication)' }, a: { pt: 'PT2' } },
    { o: { clo: 'CLO7 (BaaS)' }, a: { pt: 'PT3' } },
    { o: { clo: 'CLO8 (EJS/Handlebars)' }, a: { pt: 'PT1' } },
  ], ['PT1 is the big one (everything up to the REST API and templating); PT2 is only authentication; PT3 is only BaaS. Plan your revision accordingly.', 'PT1 là bài lớn (mọi thứ tới REST API và templating); PT2 chỉ có xác thực; PT3 chỉ có BaaS. Lên kế hoạch ôn theo đó.'])],
  goiY: [['Only two CLOs are not in PT1.', 'Chỉ hai CLO không nằm trong PT1.'], ['Auth has its own test.', 'Xác thực có bài test riêng.']],
  loi: [['Putting CLO8 in PT3.', 'Đặt CLO8 vào PT3.'], ['Putting CLO6 in PT1.', 'Đặt CLO6 vào PT1.']],
  tns: [tn('Progress Test', 'bài kiểm tra tiến độ')],
  kn: ['CLO'],
});

const E3 = cs({
  ten: 'Which CLO does this piece of work demonstrate?', kho: 'MEDIUM', phut: 8,
  en: '"Understand" and "implement" mean producing working code. Match each task to the CLO it proves.',
  vi: '"Hiểu" và "hiện thực" nghĩa là tạo ra mã chạy được. Ghép mỗi việc với CLO mà nó chứng minh.',
  cau: [
    q('t1', ['<code>GET /api/posts</code> returns every post with its author filled in by <code>.populate(\'author\', \'name\')</code>.', '<code>GET /api/posts</code> trả mọi bài viết kèm tác giả được điền bằng <code>.populate(\'author\', \'name\')</code>.'],
      ['CLO5', 'CLO4', 'CLO2', 'CLO8'], ['REST + Mongoose + population is the headline of CLO5.', 'REST + Mongoose + population là điểm chính của CLO5.']),
    q('t2', ['A register handler that hashes with bcrypt and a JWT <code>requireAuth</code> middleware.', 'Một handler đăng ký băm bằng bcrypt và một middleware <code>requireAuth</code> dùng JWT.'],
      ['CLO6', 'CLO5', 'CLO7', 'CLO1'], ['Authentication mechanisms = CLO6.', 'Cơ chế xác thực = CLO6.']),
    q('t3', ['An admin page rendered with <code>res.render(\'products\', { products })</code> and an EJS loop.', 'Một trang admin render bằng <code>res.render(\'products\', { products })</code> và vòng lặp EJS.'],
      ['CLO8', 'CLO3', 'CLO5', 'CLO2'], ['Templating with EJS/Handlebars = CLO8.', 'Templating với EJS/Handlebars = CLO8.']),
    q('t4', ['A server built with <code>http.createServer</code> that answers <code>GET /api/hello</code>.', 'Một server dựng bằng <code>http.createServer</code> trả lời <code>GET /api/hello</code>.'],
      ['CLO1', 'CLO2', 'CLO3', 'CLO4'], ['The Node HTTP server itself, before Express = CLO1.', 'Chính server HTTP của Node, trước Express = CLO1.']),
    q('t5', ['The app skeleton created by <code>npx express-generator --view=ejs myapp</code>.', 'Bộ khung app tạo bằng <code>npx express-generator --view=ejs myapp</code>.'],
      ['CLO3', 'CLO2', 'CLO8', 'CLO1'], ['Using Express Generator = CLO3.', 'Dùng Express Generator = CLO3.']),
  ],
  goiY: [['Look at the tool: populate, bcrypt, EJS, http, generator.', 'Nhìn công cụ: populate, bcrypt, EJS, http, generator.'], ['Each CLO has one signature technique.', 'Mỗi CLO có một kỹ thuật đặc trưng.']],
  loi: [['Calling a populate task CLO4.', 'Gọi việc populate là CLO4.'], ['Mixing CLO2 and CLO3.', 'Lẫn CLO2 với CLO3.']],
  tns: [tn('outcome', 'kết quả đầu ra')],
  kn: ['CLO'],
});

const E4 = bai({
  ten: 'Which CLOs does my project still miss? missingClos(features)', kho: 'MEDIUM', phut: 12, lib: [],
  en: J`<p>Pair each CLO with something that runs. Given a list of project features (strings) and the table <code>FEATURE_CLOS</code> (given) that says which CLOs a feature demonstrates, write <code>missingClos(features)</code>: the CLOs from <code>CLO1</code> to <code>CLO8</code> that NO feature covers, in numeric order.</p>
<ul><li>features are matched case-insensitively and ignoring surrounding spaces;</li>
<li>unknown features are ignored (but collected: return <code>{ missing, unknown }</code>, unknown in input order, lower-cased, without duplicates).</li></ul>`,
  vi: J`<p>Ghép mỗi CLO với một thứ chạy được. Cho danh sách tính năng dự án (chuỗi) và bảng <code>FEATURE_CLOS</code> (cho sẵn) nói tính năng nào chứng minh CLO nào, viết <code>missingClos(features)</code>: các CLO từ <code>CLO1</code> tới <code>CLO8</code> mà KHÔNG tính năng nào phủ, theo thứ tự số.</p>
<ul><li>tính năng được khớp không phân biệt hoa thường và bỏ khoảng trắng hai đầu;</li>
<li>tính năng lạ bị bỏ qua (nhưng được gom lại: trả <code>{ missing, unknown }</code>, unknown theo thứ tự đầu vào, chữ thường, không trùng).</li></ul>`,
  yc: [['Use a <code>Set</code> of covered CLOs.', 'Dùng một <code>Set</code> các CLO đã phủ.'], ['Build the list CLO1…CLO8 with a loop, not by sorting strings ("CLO10" would sort before "CLO2").', 'Dựng danh sách CLO1…CLO8 bằng vòng lặp, không bằng sắp chuỗi ("CLO10" sẽ đứng trước "CLO2").']],
  viDu: [['missingClos([\'express router\', \'populate\', \'JWT login\'])', '{"missing":["CLO1","CLO3","CLO4","CLO7","CLO8"],"unknown":[]}', 'Router → CLO2, populate → CLO5 + CLO4, JWT → CLO6.', 'Router → CLO2, populate → CLO5 + CLO4, JWT → CLO6.']],
  goiY: [['<code>const key = f.trim().toLowerCase(); const clos = FEATURE_CLOS[key];</code>', '<code>const key = f.trim().toLowerCase(); const clos = FEATURE_CLOS[key];</code>'], ['<code>for (let i = 1; i &lt;= 8; i++) if (!covered.has(\'CLO\' + i)) missing.push(\'CLO\' + i);</code>', '<code>for (let i = 1; i &lt;= 8; i++) if (!covered.has(\'CLO\' + i)) missing.push(\'CLO\' + i);</code>']],
  loi: [['Exact-case lookup: "Populate" is not found.', 'Tra đúng hoa thường: "Populate" không tìm thấy.'], ['Throwing on an unknown feature instead of reporting it.', 'Ném lỗi với tính năng lạ thay vì báo nó.']],
  gt: ['A set records "seen" once per CLO, however many features cover it; walking CLO1…CLO8 afterwards gives the gaps in a stable order. The function turns the advice of the lesson — pair each CLO with a working example — into a checklist you can run on your own project plan.', 'Một set ghi "đã thấy" một lần cho mỗi CLO, dù bao nhiêu tính năng phủ nó; đi CLO1…CLO8 sau đó cho ra các lỗ hổng theo thứ tự ổn định. Hàm biến lời khuyên của bài — ghép mỗi CLO với một ví dụ chạy được — thành một checklist chạy được trên kế hoạch dự án của bạn.'],
  kn: ['Set', 'lookup tables'],
  tns: [tn('coverage', 'độ phủ')],
  dau: J`const FEATURE_CLOS = {
  'http server': ['CLO1'], 'event loop demo': ['CLO1'],
  'express router': ['CLO2'], 'error middleware': ['CLO2'], 'nestjs module': ['CLO2'], 'hono app': ['CLO2'],
  'express generator': ['CLO3'],
  'mongodb crud': ['CLO4'], 'mongoose schema': ['CLO4', 'CLO5'],
  'populate': ['CLO5', 'CLO4'], 'rest crud': ['CLO5'],
  'bcrypt register': ['CLO6'], 'jwt login': ['CLO6'], 'session login': ['CLO6'],
  'firebase auth': ['CLO7'], 'supabase storage': ['CLO7'],
  'ejs view': ['CLO8'], 'handlebars view': ['CLO8'],
};

function missingClos(features) {
  const covered = features.map((f) => FEATURE_CLOS[f]).flat();
  return { missing: ['CLO1', 'CLO2', 'CLO3', 'CLO4', 'CLO5', 'CLO6', 'CLO7', 'CLO8'].filter((c) => !covered.includes(c)), unknown: [] };
}
`,
  giai: J`const FEATURE_CLOS = {
  'http server': ['CLO1'], 'event loop demo': ['CLO1'],
  'express router': ['CLO2'], 'error middleware': ['CLO2'], 'nestjs module': ['CLO2'], 'hono app': ['CLO2'],
  'express generator': ['CLO3'],
  'mongodb crud': ['CLO4'], 'mongoose schema': ['CLO4', 'CLO5'],
  'populate': ['CLO5', 'CLO4'], 'rest crud': ['CLO5'],
  'bcrypt register': ['CLO6'], 'jwt login': ['CLO6'], 'session login': ['CLO6'],
  'firebase auth': ['CLO7'], 'supabase storage': ['CLO7'],
  'ejs view': ['CLO8'], 'handlebars view': ['CLO8'],
};

function missingClos(features) {
  const covered = new Set();
  const unknown = [];
  for (const f of features) {
    const key = String(f).trim().toLowerCase();          // tolerant matching
    const clos = FEATURE_CLOS[key];
    if (!clos) { if (!unknown.includes(key)) unknown.push(key); continue; }
    clos.forEach((c) => covered.add(c));
  }
  const missing = [];
  for (let i = 1; i <= 8; i++) if (!covered.has('CLO' + i)) missing.push('CLO' + i);   // numeric order
  return { missing, unknown };
}
`,
  cases: [
    { goi: `missingClos(['express router', 'populate', 'JWT login'])`, moTa: ['Three features → five gaps', 'Ba tính năng → năm lỗ hổng'] },
    { goi: `missingClos(['  Populate ', 'EJS VIEW', 'blockchain', 'Blockchain'])`, moTa: ['Case/space tolerant, unknown collected once', 'Chịu hoa thường/khoảng trắng, tính năng lạ gom một lần'] },
    { goi: `missingClos([])`, an: true },
    { goi: `missingClos(['http server', 'express generator', 'mongoose schema', 'session login', 'firebase auth', 'handlebars view', 'hono app'])`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-chuan-dau-ra',
  ten: '0.3 Learning outcomes (CLOs)',
  khoa: KHOA,
  baiHoc: 'sdn302-chuan-dau-ra',
  de: [E1, E2, E3, E4],
});
