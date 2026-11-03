/** Bộ luyện bài 8.3 — Ghi dữ liệu. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Dựng INSERT/UPDATE có tham số (tên cột theo danh sách cho phép), bắt UPDATE/DELETE thiếu WHERE, chuyển tiền tất-cả-hoặc-không,
 *  tìm kiếm LIKE có thoát % và _, và một tagged template sql`…` biến giá trị thành tham số như $queryRaw của Prisma. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 8.3 — INSERT, UPDATE, DELETE và giao dịch.</em> Các bài là những mảnh giúp mã ghi dữ liệu an toàn: không ghép chuỗi, không quên WHERE, không để lại công việc dở dang.</p>';

export default doiDau({
  slug: 'wf-8-3-crud',
  ten: '8.3 INSERT, UPDATE, DELETE và giao dịch',
  baiHoc: 'Nền tảng Web — Bài 8.3 INSERT, UPDATE, DELETE and transactions',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Dựng câu INSERT và UPDATE có tham số với tên cột kiểm theo danh sách cho phép, phát hiện UPDATE/DELETE thiếu WHERE, chuyển tiền tất-cả-hoặc-không, tìm kiếm LIKE thoát % và _, và tự viết tagged template sql`…` như $queryRaw — 6 bài.',
  de: [
    {
      tieuDe: 'Dựng INSERT có tham số',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['câu lệnh có tham số', 'tên định danh'], tienQuyet: ['Object.keys', 'join'], the: ['javascript', 'sql', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('buildInsert(table, data)')} trả ${c('{ sql, params }')}: ${c('sql')} là ${c('"INSERT INTO <table> (<c1>, <c2>) VALUES (?, ?) RETURNING *"')} theo thứ tự khoá của ${c('data')}, ${c('params')} là các giá trị tương ứng. Tên bảng và tên cột KHÔNG làm tham số được, nên phải khớp ${c('/^[A-Za-z_][A-Za-z0-9_]*$/')}, sai ⇒ ném ${c('TypeError')}. ${c('data')} không có khoá nào ⇒ ném ${c('RangeError')}. Giá trị ${c('undefined')} bị bỏ (để CSDL dùng DEFAULT).</p>`,
      yeuCau: ['Giá trị đi trong params, không bao giờ trong sql.', 'Tên kiểm bằng regex.', 'Bỏ undefined.'],
      dauVao: 'table: string; data: object.', dauRa: '{ sql, params }.',
      rangBuoc: ['Không dùng thư viện query builder.'],
      viDu: [{ input: 'buildInsert("posts", { user_id: 3, title: "My first post" })', output: '{ sql: "INSERT INTO posts (user_id, title) VALUES (?, ?) RETURNING *", params: [3, "My first post"] }', explanation: 'Như lệnh INSERT … RETURNING trong bài.' }],
      goiY: ['const entries = Object.entries(data).filter(([, v]) => v !== undefined);', 'const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;'],
      khoiDau: { 'main.js': `// Bài 8.3 — dựng INSERT
function buildInsert(table, data) {
  const cols = Object.keys(data).join(', ');
  const vals = Object.values(data).map((v) => "'" + v + "'").join(', ');
  return { sql: 'INSERT INTO ' + table + ' (' + cols + ') VALUES (' + vals + ')', params: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 8.3 — giá trị đi riêng (?), tên thì kiểm theo mẫu vì không làm tham số được
const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
function buildInsert(table, data) {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);   // undefined ⇒ để DEFAULT
  if (entries.length === 0) throw new RangeError('nothing to insert');
  for (const name of [table, ...entries.map(([k]) => k)]) {
    if (!IDENT.test(name)) throw new TypeError('bad identifier: ' + name);
  }
  const cols = entries.map(([k]) => k).join(', ');
  const marks = entries.map(() => '?').join(', ');
  return { sql: ´INSERT INTO @{table} (@{cols}) VALUES (@{marks}) RETURNING *´, params: entries.map(([, v]) => v) };
}
` },
      giaiThich: `<p>Code khởi đầu là đúng lỗi injection của bài, cộng thêm một lỗi nữa: mọi giá trị thành chuỗi trong nháy, nên số 3 thành ${c("'3'")} và null thành ${c("'null'")}. Tên cột lấy từ khoá của ${c('req.body')} cũng là đường tấn công — vì thế phải kiểm (tốt hơn nữa: chỉ cho phép danh sách cột cố định, Bài 7.1).</p>`,
      loiHayGap: ['Ghép giá trị vào chuỗi SQL.', 'Không kiểm tên cột.', 'Gửi undefined thành NULL thay vì để DEFAULT.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html',
      kiem: [
        { moTa: 'The lesson insert|||Lệnh chèn của bài', goi: 'buildInsert("posts", { user_id: 3, title: "My first post", created_at: "2026-11-02 10:00:00" })', mongDoi: { sql: 'INSERT INTO posts (user_id, title, created_at) VALUES (?, ?, ?) RETURNING *', params: [3, 'My first post', '2026-11-02 10:00:00'] } },
        { moTa: 'Dangerous values stay in params; undefined dropped|||Giá trị nguy hiểm ở trong params; bỏ undefined', goi: 'buildInsert("notes", { text: "x\'); DROP TABLE users; --", done: undefined, user_id: null })', mongDoi: { sql: 'INSERT INTO notes (text, user_id) VALUES (?, ?) RETURNING *', params: ["x'); DROP TABLE users; --", null] } },
        { moTa: 'Bad identifiers throw TypeError|||Tên sai ném TypeError', goi: 'buildInsert("users", { "name) VALUES (1); --": 1 })', mongDoi: { loi: 'TypeError' } },
        { moTa: 'Nothing to insert throws RangeError|||Không có gì để chèn thì ném RangeError', goi: 'buildInsert("users", { a: undefined })', mongDoi: { loi: 'RangeError' } },
      ],
    },
    {
      tieuDe: 'Dựng UPDATE theo id',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['UPDATE', 'danh sách cột cho phép'], tienQuyet: ['filter', 'map'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('buildUpdate(table, changes, id, allowed)')} trả ${c('{ sql, params }')} dạng ${c('"UPDATE <table> SET a = ?, b = ? WHERE id = ? RETURNING *"')}: chỉ giữ các khoá của ${c('changes')} có trong mảng ${c('allowed')} (bỏ mọi khoá khác, kể cả ${c('id')}), theo thứ tự của ${c('changes')}; ${c('id')} là tham số cuối. Không còn cột nào ⇒ ném ${c('RangeError')}. ${c('id')} không phải số nguyên dương ⇒ ném ${c('TypeError')}.</p>`,
      yeuCau: ['WHERE id = ? luôn có.', 'Chỉ cột trong allowed.', 'id là tham số cuối.'],
      dauVao: 'table: string; changes: object; id: number; allowed: string[].', dauRa: '{ sql, params }.',
      rangBuoc: ['table do lập trình viên truyền (tin được).'],
      viDu: [{ input: 'buildUpdate("posts", { views: 0, role: "admin" }, 7, ["title", "views", "published"])', output: '{ sql: "UPDATE posts SET views = ? WHERE id = ? RETURNING *", params: [0, 7] }', explanation: 'role bị bỏ; không bao giờ thiếu WHERE.' }],
      goiY: ['const cols = Object.keys(changes).filter((k) => allowed.includes(k) && k !== "id");', 'cols.map((k) => k + " = ?").join(", ")'],
      khoiDau: { 'main.js': `// Bài 8.3 — dựng UPDATE
function buildUpdate(table, changes, id, allowed) {
  const sets = Object.keys(changes).map((k) => k + ' = ?').join(', ');
  return { sql: 'UPDATE ' + table + ' SET ' + sets, params: Object.values(changes) };
}
` },
      loiGiai: { 'main.js': `// Bài 8.3 — một hàm không thể sinh ra UPDATE thiếu WHERE
function buildUpdate(table, changes, id, allowed) {
  if (!Number.isInteger(id) || id < 1) throw new TypeError('id must be a positive integer');
  const cols = Object.keys(changes).filter((k) => k !== 'id' && allowed.includes(k));   // danh sách cho phép
  if (cols.length === 0) throw new RangeError('nothing to update');
  return {
    sql: ´UPDATE @{table} SET @{cols.map((k) => k + ' = ?').join(', ')} WHERE id = ? RETURNING *´,
    params: [...cols.map((k) => changes[k]), id],
  };
}
` },
      giaiThich: `<p>Code khởi đầu là đúng câu "UPDATE posts SET views = 0" làm mọi bài về 0 lượt xem trong bài. Cách chắc nhất để không bao giờ quên WHERE là không để con người gõ nó: hàm dựng câu lệnh luôn thêm, và luôn kiểm id.</p>`,
      loiHayGap: ['Quên WHERE.', 'Cho body đổi id hay role.', 'Đặt id ở đầu params.'],
      thamKhao: 'https://sqlite.org/lang_update.html',
      kiem: [
        { moTa: 'Only allowed columns, WHERE always present|||Chỉ cột được phép, luôn có WHERE', goi: 'buildUpdate("posts", { views: 0, role: "admin", id: 1 }, 7, ["title", "views", "published"])', mongDoi: { sql: 'UPDATE posts SET views = ? WHERE id = ? RETURNING *', params: [0, 7] } },
        { moTa: 'Several columns in order|||Nhiều cột theo thứ tự', goi: 'buildUpdate("posts", { published: 1, title: "Hi" }, 2, ["title", "published"])', mongDoi: { sql: 'UPDATE posts SET published = ?, title = ? WHERE id = ? RETURNING *', params: [1, 'Hi', 2] } },
        { moTa: 'Nothing allowed: RangeError|||Không cột nào được phép: RangeError', goi: 'buildUpdate("posts", { role: "admin" }, 2, ["title"])', mongDoi: { loi: 'RangeError' } },
        { moTa: 'Bad id: TypeError|||id sai: TypeError', goi: 'buildUpdate("posts", { title: "x" }, "1 OR 1=1", ["title"])', mongDoi: { loi: 'TypeError' } },
      ],
    },
    {
      tieuDe: 'Bắt UPDATE và DELETE thiếu WHERE',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['câu lệnh nguy hiểm', 'chú thích SQL'], tienQuyet: ['regex', 'replace'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('dangerousStatements(script)')} cho một đoạn SQL có thể gồm nhiều câu lệnh tách bằng ${c(';')}. Trả mảng chuỗi cảnh báo theo thứ tự: ${c('"UPDATE without WHERE: <bảng>"')} và ${c('"DELETE without WHERE: <bảng>"')}. Trước khi xét, bỏ chú thích ${c('-- …')} (tới cuối dòng) và ${c('/* … */')}, và bỏ nội dung bên trong chuỗi nháy đơn (để chữ "where" trong một giá trị không đánh lừa). Không phân biệt hoa thường. Câu không phải UPDATE/DELETE bỏ qua.</p>`,
      yeuCau: ['Tách theo ";".', 'Bỏ chú thích và nội dung chuỗi.', 'Tên bảng sau UPDATE / DELETE FROM.'],
      dauVao: 'script: string.', dauRa: 'string[].',
      rangBuoc: ['Không cần xử lý dấu ";" nằm trong chuỗi.'],
      viDu: [{ input: 'dangerousStatements("UPDATE posts SET views = 0;")', output: '["UPDATE without WHERE: posts"]', explanation: 'Câu đổi cả 6 dòng trong bài.' }],
      goiY: ["const clean = script.replace(/\\/\\*[\\s\\S]*?\\*\\//g, ' ').replace(/--[^\\n]*/g, ' ').replace(/'(?:[^']|'')*'/g, \"''\");", 'const m = /^\\s*update\\s+(\\w+)/i.exec(stmt);'],
      khoiDau: { 'main.js': `// Bài 8.3 — bắt câu lệnh thiếu WHERE
function dangerousStatements(script) {
  return script.includes('WHERE') ? [] : ['missing WHERE'];
}
` },
      loiGiai: { 'main.js': `// Bài 8.3 — UPDATE/DELETE không có WHERE chạm vào MỌI dòng
function dangerousStatements(script) {
  const clean = script
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, ' ')                  // /* chú thích */
    .replace(/--[^\\n]*/g, ' ')                               // -- chú thích
    .replace(/'(?:[^']|'')*'/g, "''");                       // 'giá trị' — bỏ nội dung, giữ dấu nháy
  const warnings = [];
  for (const stmt of clean.split(';')) {
    const up = /^\\s*update\\s+(\\w+)/i.exec(stmt);
    const del = /^\\s*delete\\s+from\\s+(\\w+)/i.exec(stmt);
    const m = up ?? del;
    if (m && !/\\bwhere\\b/i.test(stmt)) {
      warnings.push((up ? 'UPDATE' : 'DELETE') + ' without WHERE: ' + m[1]);
    }
  }
  return warnings;
}
` },
      giaiThich: `<p>Nhiều công cụ quản trị CSDL (và chế độ ${c('--safe-updates')} của MySQL) có đúng phép kiểm này: từ chối UPDATE/DELETE không có WHERE trừ khi bạn nói rõ. Bỏ chú thích và nội dung chuỗi trước tiên vì ${c("-- WHERE id = 1")} hay ${c("SET note = 'where?'")} sẽ đánh lừa một phép tìm chữ đơn giản.</p>`,
      loiHayGap: ['Tìm "WHERE" trong cả đoạn — câu khác có WHERE làm câu này lọt.', 'Bị chú thích "-- WHERE" đánh lừa.', 'Phân biệt hoa thường.'],
      thamKhao: 'https://dev.mysql.com/doc/refman/8.4/en/mysql-tips.html#safe-updates',
      kiem: [
        { moTa: 'The lesson mistake|||Lỗi trong bài', goi: 'dangerousStatements("UPDATE posts SET title = \'Hello World!\' WHERE id = 1; UPDATE posts SET views = 0;")', mongDoi: ['UPDATE without WHERE: posts'] },
        { moTa: 'Comments and strings do not count|||Chú thích và chuỗi không tính', goi: 'dangerousStatements("update notes set text = \'where?\' -- WHERE id = 1\\n; DELETE FROM comments /* where post_id = 4 */;")', mongDoi: ['UPDATE without WHERE: notes', 'DELETE without WHERE: comments'] },
        { moTa: 'Safe statements and other kinds pass|||Câu an toàn và loại khác được qua', goi: 'dangerousStatements("delete from posts where id = 3; SELECT * FROM posts; INSERT INTO t VALUES (1);")', mongDoi: [] },
      ],
    },
    {
      tieuDe: 'Chuyển tiền: tất cả hoặc không',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['giao dịch', 'tính nguyên tử', 'không đột biến'], tienQuyet: ['map', 'spread'], the: ['javascript', 'giao dịch'],
      moTa: `${BAI}<p>Viết ${c('transfer(accounts, fromId, toId, amount)')} trên mảng ${c('{ id, owner, balance }')} và trả MẢNG MỚI sau khi chuyển. Như một giao dịch: nếu có bất kỳ vấn đề nào thì ném lỗi và mảng gốc KHÔNG đổi chút nào — ${c('amount')} không phải số nguyên dương ⇒ ${c('RangeError')}; tài khoản không tồn tại hay ${c('fromId === toId')} ⇒ ${c('Error')}; số dư nguồn sau khi trừ âm ⇒ ${c('Error("CHECK constraint failed: balance >= 0")')}.</p>`,
      yeuCau: ['Không sửa mảng gốc, kể cả khi thành công.', 'Kiểm tất cả trước khi "ghi".', 'Đúng loại lỗi.'],
      dauVao: 'accounts: object[]; fromId, toId, amount: number.', dauRa: 'object[] mới.',
      rangBuoc: ['Không dùng try/catch để "hoàn tác" sau khi đã sửa.'],
      viDu: [{ input: 'transfer(accounts, 2, 1, 700000) khi Minh có 100 000', output: 'ném Error "CHECK constraint failed: balance >= 0", accounts không đổi', explanation: 'Phiên bản (c) của bài, không phải (a) hay (b).' }],
      goiY: ['const from = accounts.find((a) => a.id === fromId);', 'return accounts.map((a) => a.id === fromId ? { ...a, balance: a.balance - amount } : a.id === toId ? { ...a, balance: a.balance + amount } : { ...a });'],
      khoiDau: { 'main.js': `// Bài 8.3 — chuyển tiền
function transfer(accounts, fromId, toId, amount) {
  accounts.find((a) => a.id === toId).balance += amount;
  const from = accounts.find((a) => a.id === fromId);
  if (from.balance - amount < 0) throw new Error('CHECK constraint failed: balance >= 0');
  from.balance -= amount;
  return accounts;
}
` },
      loiGiai: { 'main.js': `// Bài 8.3 — kiểm mọi thứ trước, rồi tạo trạng thái mới một lần: không bao giờ dở dang
function transfer(accounts, fromId, toId, amount) {
  if (!Number.isInteger(amount) || amount <= 0) throw new RangeError('amount must be a positive integer');
  if (fromId === toId) throw new Error('cannot transfer to the same account');
  const from = accounts.find((a) => a.id === fromId);
  const to = accounts.find((a) => a.id === toId);
  if (!from || !to) throw new Error('account not found');
  if (from.balance - amount < 0) throw new Error('CHECK constraint failed: balance >= 0');
  return accounts.map((a) =>                                 // "COMMIT": mảng mới, mảng cũ nguyên vẹn
    a.id === fromId ? { ...a, balance: a.balance - amount }
      : a.id === toId ? { ...a, balance: a.balance + amount }
      : { ...a });
}
` },
      giaiThich: `<p>Code khởi đầu là phiên bản (a) của bài: cộng cho Lan trước, rồi mới phát hiện Minh không đủ tiền — tiền tự sinh ra. Trong CSDL bạn có BEGIN/ROLLBACK; trong mã JS thuần, cách tương đương là kiểm tất cả rồi mới tạo trạng thái mới — không có bước nào để "hoàn tác".</p>`,
      loiHayGap: ['Cộng trước, kiểm sau.', 'Sửa trực tiếp object trong mảng gốc.', 'Cho chuyển số âm (đảo chiều chuyển tiền).'],
      thamKhao: 'https://en.wikipedia.org/wiki/Atomicity_(database_systems)',
      kiem: [
        { moTa: 'A good transfer|||Một lần chuyển hợp lệ', chuanBi: 'const A = [{ id: 1, owner: "Lan", balance: 500000 }, { id: 2, owner: "Minh", balance: 100000 }];', goi: '[transfer(A, 2, 1, 50000), A]', mongDoi: [[{ id: 1, owner: 'Lan', balance: 550000 }, { id: 2, owner: 'Minh', balance: 50000 }], [{ id: 1, owner: 'Lan', balance: 500000 }, { id: 2, owner: 'Minh', balance: 100000 }]] },
        { moTa: 'Insufficient funds: error, nothing changed|||Không đủ tiền: lỗi, không gì đổi', chuanBi: 'const A = [{ id: 1, owner: "Lan", balance: 500000 }, { id: 2, owner: "Minh", balance: 100000 }]; let msg = ""; try { transfer(A, 2, 1, 700000); } catch (e) { msg = e.message; }', goi: '[msg, A[0].balance, A[1].balance]', mongDoi: ['CHECK constraint failed: balance >= 0', 500000, 100000] },
        { moTa: 'Bad amount: RangeError|||Số tiền sai: RangeError', goi: 'transfer([{ id: 1, balance: 5 }, { id: 2, balance: 5 }], 1, 2, -3)', mongDoi: { loi: 'RangeError' } },
        { moTa: 'Unknown or same account: Error|||Tài khoản lạ hoặc trùng: Error', goi: 'transfer([{ id: 1, balance: 5 }], 1, 9, 1)', mongDoi: { loi: 'Error', thongDiep: 'not found' } },
      ],
    },
    {
      tieuDe: 'Tìm kiếm LIKE an toàn',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['LIKE ESCAPE', 'ký tự đại diện do người dùng gõ'], tienQuyet: ['replace'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Tham số chặn injection, nhưng ${c('%')} và ${c('_')} do người dùng gõ vẫn là ký tự đại diện của LIKE (gõ ${c('%')} là khớp mọi thứ). Viết ${c('buildSearch(term)')} trả ${c('{ sql, params }')} với ${c('sql')} cố định ${c("SELECT id, title FROM posts WHERE published = 1 AND title LIKE ? ESCAPE '\\\\' ORDER BY id")} và ${c('params')} là ${c("['%' + term_đã_thoát + '%']")}: thoát ${c('\\\\')} thành ${c('\\\\\\\\')} TRƯỚC, rồi ${c('%')} thành ${c('\\\\%')} và ${c('_')} thành ${c('\\\\_')}. ${c('term')} được trim; rỗng ⇒ ${c('null')} (không tìm).</p>`,
      yeuCau: ['SQL cố định, giá trị trong params.', 'Thoát \\ trước % và _.', 'Rỗng ⇒ null.'],
      dauVao: 'term: string.', dauRa: '{ sql, params } | null.',
      rangBuoc: ['Câu SQL giống hệt mỗi lần gọi (để CSDL dùng lại kế hoạch truy vấn).'],
      viDu: [{ input: "buildSearch(\"%' OR 1=1 --\")", output: "params: [\"%\\\\%' OR 1=1 --%\"]", explanation: 'Vừa không injection, vừa không khớp mọi thứ.' }],
      goiY: ["term.replace(/\\\\/g, '\\\\\\\\').replace(/[%_]/g, '\\\\$&')", 'Đặt ESCAPE ngay sau LIKE ?.'],
      khoiDau: { 'main.js': `// Bài 8.3 — tìm kiếm LIKE an toàn
function buildSearch(term) {
  return { sql: "SELECT id, title FROM posts WHERE title LIKE '%" + term + "%'", params: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 8.3 — tham số chặn injection; ESCAPE chặn ký tự đại diện do người dùng gõ
const SEARCH_SQL = "SELECT id, title FROM posts WHERE published = 1 AND title LIKE ? ESCAPE '\\\\' ORDER BY id";
function buildSearch(term) {
  const t = String(term ?? '').trim();
  if (t === '') return null;
  const escaped = t.replace(/\\\\/g, '\\\\\\\\').replace(/[%_]/g, '\\\\$&');   // \\ trước, rồi % và _
  return { sql: SEARCH_SQL, params: ['%' + escaped + '%'] };
}
` },
      giaiThich: `<p>Khác biệt nhỏ mà thật: không thoát thì người dùng gõ ${c('%')} nhận về mọi bài (vô hại ở đây, nhưng là tìm kiếm sai và có thể là truy vấn rất nặng trên bảng lớn). Thứ tự quan trọng: thoát ${c('\\\\')} trước, nếu không ký tự thoát vừa thêm sẽ bị thoát lần nữa.</p>`,
      loiHayGap: ['Ghép term vào SQL.', 'Thoát % trước \\ — ra \\\\%.', 'Quên ESCAPE trong câu SQL.'],
      thamKhao: 'https://sqlite.org/lang_expr.html#the_like_glob_regexp_match_and_extract_operators',
      kiem: [
        { moTa: 'A normal search|||Tìm kiếm bình thường', goi: 'buildSearch("  SQL ")', mongDoi: { sql: "SELECT id, title FROM posts WHERE published = 1 AND title LIKE ? ESCAPE '\\' ORDER BY id", params: ['%SQL%'] } },
        { moTa: 'The injection becomes a plain value|||Đòn injection thành giá trị thường', goi: 'buildSearch("%\' OR 1=1 --").params', mongDoi: ["%\\%' OR 1=1 --%"] },
        { moTa: 'Wildcards and backslashes escaped in order|||Ký tự đại diện và \\ được thoát đúng thứ tự', goi: '[buildSearch("50%_off").params[0], buildSearch("a\\\\b").params[0], buildSearch("   ")]', mongDoi: ['%50\\%\\_off%', '%a\\\\b%', null] },
      ],
    },
    {
      tieuDe: 'Tagged template sql`…`',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['tagged template', 'tham số', 'mảnh SQL lồng nhau'], tienQuyet: ['template literal', 'rest parameters'], the: ['javascript', 'sql', 'bảo mật'],
      moTa: `${BAI}<p>Đây là cách ${c('prisma.$queryRaw')} và thư viện như ${c('postgres')}/${c('slonik')} làm. Viết hàm tag ${c('sql(strings, ...values)')} trả object ${c('{ text, values }')}: mỗi giá trị thường thành một ${c('?')} và vào ${c('values')}; giá trị là MẢNG thành ${c('(?, ?, ?)')} (cho ${c('IN')}) — mảng rỗng ⇒ ném ${c('RangeError')}; giá trị là một kết quả ${c('sql`…`')} khác thì được NHÚNG (text của nó chèn vào, values nối theo đúng thứ tự). Đánh dấu kết quả bằng ${c('Symbol.for("sql")')} để nhận ra mảnh SQL (chuỗi thường không bao giờ được nhúng).</p>`,
      yeuCau: ['Giá trị → ?.', 'Mảng → (?, ?, …).', 'Mảnh sql lồng được nhúng.', 'Chuỗi thường không bao giờ thành SQL.'],
      dauVao: 'được gọi dạng tag: sql`…${x}…`.', dauRa: '{ text, values }.',
      rangBuoc: ['Thuộc tính đánh dấu là Symbol.for("sql") với giá trị true.'],
      viDu: [{ input: 'sql`SELECT * FROM posts WHERE user_id IN ${[1, 2]} AND title LIKE ${q}`', output: '{ text: "SELECT * FROM posts WHERE user_id IN (?, ?) AND title LIKE ?", values: [1, 2, q] }', explanation: 'Như $queryRaw: mọi ${} là tham số.' }],
      goiY: ['let text = strings[0]; const out = []; values.forEach((v, i) => { … text += strings[i + 1]; });', 'const MARK = Symbol.for("sql"); return { [MARK]: true, text, values: out };'],
      khoiDau: { 'main.js': `// Bài 8.3 — tagged template sql\´…\´
function sql(strings, ...values) {
  let text = strings[0];
  values.forEach((v, i) => { text += v + strings[i + 1]; });
  return { text, values: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 8.3 — mọi @{giá trị} thành tham số; mảng thành (?, ?); mảnh sql\´...\´ lồng được nhúng
const MARK = Symbol.for('sql');
function sql(strings, ...values) {
  let text = strings[0];
  const out = [];
  values.forEach((v, i) => {
    if (v && v[MARK] === true) {                             // mảnh SQL do chính sql\´...\´ tạo ra
      text += v.text;
      out.push(...v.values);
    } else if (Array.isArray(v)) {
      if (v.length === 0) throw new RangeError('empty list in IN (...)');
      text += '(' + v.map(() => '?').join(', ') + ')';
      out.push(...v);
    } else {
      text += '?';                                           // chuỗi, số, null... luôn là tham số
      out.push(v);
    }
    text += strings[i + 1];
  });
  return { [MARK]: true, text, values: out };
}
` },
      giaiThich: `<p>Điểm mấu chốt: hàm tag nhận các mảnh chữ do LẬP TRÌNH VIÊN viết (${c('strings')}) tách riêng khỏi các giá trị — nên nó biết chắc phần nào là SQL, phần nào là dữ liệu. Đó là lý do ${c('$queryRaw')} an toàn còn ${c('$queryRawUnsafe(chuỗi)')} thì không: khi đã ghép thành một chuỗi, ranh giới đó mất. Mảnh lồng nhau cho phép dựng điều kiện tuỳ chọn mà vẫn an toàn.</p>`,
      loiHayGap: ['Nhúng chuỗi thường thành SQL.', 'Quên values của mảnh lồng.', 'IN () rỗng — lỗi cú pháp ở CSDL.'],
      thamKhao: 'https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#queryraw',
      kiem: [
        { moTa: 'Values become placeholders|||Giá trị thành chỗ giữ chỗ', chuanBi: 'const q = "%\' OR 1=1 --"; const r = sql´SELECT id, title FROM Post WHERE title LIKE @{q}´;', goi: '[r.text, r.values]', mongDoi: ['SELECT id, title FROM Post WHERE title LIKE ?', ["%' OR 1=1 --"]] },
        { moTa: 'Arrays expand for IN|||Mảng mở rộng cho IN', chuanBi: 'const r = sql´SELECT * FROM posts WHERE user_id IN @{[1, 2]} AND views > @{40}´;', goi: '[r.text, r.values]', mongDoi: ['SELECT * FROM posts WHERE user_id IN (?, ?) AND views > ?', [1, 2, 40]] },
        { moTa: 'Nested fragments keep order|||Mảnh lồng giữ đúng thứ tự', chuanBi: 'const pub = sql´published = @{1}´; const r = sql´SELECT * FROM posts WHERE @{pub} AND user_id = @{2} LIMIT @{10}´;', goi: '[r.text, r.values]', mongDoi: ['SELECT * FROM posts WHERE published = ? AND user_id = ? LIMIT ?', [1, 2, 10]] },
        { moTa: 'A plain string that looks like SQL is still a value|||Chuỗi trông như SQL vẫn là giá trị', chuanBi: 'const evil = { text: "1=1 --", values: [] }; const r = sql´DELETE FROM posts WHERE id = @{evil}´;', goi: 'r.text', mongDoi: 'DELETE FROM posts WHERE id = ?' },
        { moTa: 'Empty IN list throws|||Danh sách IN rỗng thì ném lỗi', goi: 'sql´SELECT 1 WHERE x IN @{[]}´', mongDoi: { loi: 'RangeError' } },
      ],
    },
  ],
});
