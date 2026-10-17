// ⛔ BẢN CHÉP — sửa ở src/services/work/sqlDesign/ rồi chạy scripts/dong-bo-sql-design.mjs
/**
 * Database designer — KIỂM "CHUẨN THIẾT KẾ" (công cụ dạy học): mỗi phát hiện có thông điệp, VÌ SAO, và CÁCH SỬA, bằng
 * tiếng Việt và tiếng Anh. Mức độ: error = CSDL thật sẽ từ chối / chắc chắn sai · warning = gần như chắc là nên sửa ·
 * info = gợi ý / câu hỏi để người thiết kế tự quyết.
 */

import {
  bi, findColumn, findTable, isCandidateKey, relationships, resolvedRefColumns, sameName,
  type Bi, type Column, type DbModel, type Dialect, type Problem, type Severity, type Span, type Table,
} from './model';
import { reservedIn } from './reserved';
import { canonOf, typesCompatible } from './types';

export interface LintOptions {
  /** Bỏ qua các mã này (người dùng tắt). */
  disabled?: string[];
}

interface Rule { code: string; severity: Severity; title: Bi; why: Bi; fix: Bi }

const R = (code: string, severity: Severity, title: Bi, why: Bi, fix: Bi): Rule => ({ code, severity, title, why, fix });

/** Danh mục luật (để trang trợ giúp liệt kê + người dùng bật/tắt). */
export const LINT_RULES: Rule[] = [
  R('NO_PK', 'warning', bi('Bảng không có khoá chính', 'Table without a primary key'),
    bi('Khoá chính là cách DUY NHẤT chắc chắn trỏ đúng một dòng: UPDATE/DELETE theo khoá, khoá ngoại từ bảng khác, DAO/JPA đều cần nó. Không có khoá thì hai dòng giống hệt nhau không xoá riêng được.', 'A primary key is the ONLY reliable way to point at exactly one row: UPDATE/DELETE by key, foreign keys from other tables and DAO/JPA all need it. Without one, two identical rows cannot be told apart.'),
    bi('Thêm cột <bảng>Id INT IDENTITY(1,1) và CONSTRAINT PK_<bảng> PRIMARY KEY (<bảng>Id); bảng nối thì dùng khoá ghép PRIMARY KEY (aId, bId).', 'Add <table>Id INT IDENTITY(1,1) and CONSTRAINT PK_<table> PRIMARY KEY (<table>Id); for a junction table use a composite key PRIMARY KEY (aId, bId).')),
  R('FK_MISSING_TABLE', 'error', bi('Khoá ngoại trỏ tới bảng không có', 'Foreign key to a table that does not exist'),
    bi('CSDL sẽ từ chối câu CREATE/ALTER này: bảng cha phải được tạo TRƯỚC bảng con.', 'The database rejects this CREATE/ALTER: the parent table must be created BEFORE the child.'),
    bi('Sửa tên bảng trong REFERENCES, hoặc thêm CREATE TABLE của bảng cha lên trên.', 'Fix the table name after REFERENCES, or add the parent CREATE TABLE above.')),
  R('FK_MISSING_COLUMN', 'error', bi('Khoá ngoại trỏ tới cột không có', 'Foreign key to a column that does not exist'),
    bi('Cột được tham chiếu phải có thật trong bảng cha.', 'The referenced column must exist in the parent table.'),
    bi('Sửa tên cột trong REFERENCES <bảng>(<cột>).', 'Fix the column name in REFERENCES <table>(<column>).')),
  R('FK_NOT_KEY', 'error', bi('Khoá ngoại trỏ tới cột không phải khoá', 'Foreign key to a column that is not a key'),
    bi('Khoá ngoại chỉ được trỏ tới PRIMARY KEY hoặc UNIQUE của bảng cha (SQL Server báo lỗi 1776). Nếu không, một giá trị có thể khớp NHIỀU dòng cha.', 'A foreign key may only point at the parent\'s PRIMARY KEY or a UNIQUE key (SQL Server error 1776). Otherwise one value could match MANY parent rows.'),
    bi('Trỏ tới khoá chính của bảng cha, hoặc thêm UNIQUE cho cột đó ở bảng cha.', 'Reference the parent\'s primary key, or make that column UNIQUE in the parent.')),
  R('FK_COLUMN_COUNT', 'error', bi('Số cột khoá ngoại không khớp', 'Foreign key column count mismatch'),
    bi('Khoá ngoại có bao nhiêu cột thì cột được tham chiếu phải đúng bấy nhiêu, theo đúng thứ tự.', 'A foreign key needs exactly as many referenced columns as it has columns, in the same order.'),
    bi('Liệt kê đủ cột ở cả hai phía: FOREIGN KEY (a, b) REFERENCES T (x, y).', 'List the columns on both sides: FOREIGN KEY (a, b) REFERENCES T (x, y).')),
  R('FK_TYPE_MISMATCH', 'warning', bi('Kiểu cột khoá ngoại khác kiểu cột được tham chiếu', 'Foreign key type differs from the referenced column'),
    bi('SQL Server từ chối khoá ngoại khác kiểu (INT ↔ BIGINT, VARCHAR ↔ NVARCHAR — lỗi 1778); hệ khác thì chậm và dễ sai khi JOIN vì phải đổi kiểu từng dòng.', 'SQL Server rejects foreign keys of a different type (INT ↔ BIGINT, VARCHAR ↔ NVARCHAR — error 1778); elsewhere joins get slower and error-prone because every row is converted.'),
    bi('Cho cột khoá ngoại cùng kiểu (và cùng độ dài) với cột khoá của bảng cha.', 'Give the foreign key column the same type (and length) as the parent key.')),
  R('FK_NOT_INDEXED', 'warning', bi('Cột khoá ngoại chưa có chỉ mục', 'Foreign key column is not indexed'),
    bi('SQL Server và PostgreSQL KHÔNG tự tạo chỉ mục cho khoá ngoại. Thiếu nó thì mỗi JOIN theo khoá và mỗi lần xoá/sửa dòng cha đều phải quét cả bảng con.', 'SQL Server and PostgreSQL do NOT index foreign keys automatically. Without an index every join on the key, and every delete/update of a parent row, scans the whole child table.'),
    bi('CREATE INDEX IX_<bảng>_<cột> ON <bảng>(<cột>); (không cần nếu cột đã đứng ĐẦU một PRIMARY KEY/UNIQUE/INDEX khác).', 'CREATE INDEX IX_<table>_<column> ON <table>(<column>); (not needed if the column already LEADS another PRIMARY KEY/UNIQUE/INDEX).')),
  R('FK_NULLABLE', 'info', bi('Khoá ngoại cho phép NULL', 'Foreign key allows NULL'),
    bi('Cột khoá ngoại cho NULL nghĩa là quan hệ KHÔNG BẮT BUỘC (dòng con có thể không có cha). Đúng ý thì giữ; nếu mọi dòng con đều phải có cha thì thiếu NOT NULL là lỗ hổng.', 'A nullable foreign key means the relationship is OPTIONAL (a child row may have no parent). Keep it if that is intended; if every child must have a parent, the missing NOT NULL is a hole.'),
    bi('Quan hệ bắt buộc ⇒ thêm NOT NULL cho cột khoá ngoại.', 'Mandatory relationship ⇒ add NOT NULL to the foreign key column.')),
  R('MONEY_FLOAT', 'warning', bi('Tiền lưu bằng FLOAT/REAL', 'Money stored as FLOAT/REAL'),
    bi('FLOAT/REAL là số dấu chấm động nhị phân: 0.1 + 0.2 ≠ 0.3. Tiền cộng dồn sẽ lệch vài đồng và so sánh bằng (=) sai.', 'FLOAT/REAL are binary floating point: 0.1 + 0.2 ≠ 0.3. Summed money drifts by small amounts and equality checks fail.'),
    bi('Dùng DECIMAL(p,s): tiền VND DECIMAL(12,0) (hoặc BIGINT), tiền có xu DECIMAL(19,4).', 'Use DECIMAL(p,s): VND DECIMAL(12,0) (or BIGINT), currencies with cents DECIMAL(19,4).')),
  R('VARCHAR_VIETNAMESE', 'warning', bi('Chữ tiếng Việt lưu bằng VARCHAR', 'Vietnamese text stored as VARCHAR'),
    bi('Trong SQL Server, VARCHAR/CHAR/TEXT dùng bảng mã của collation (thường Latin1) ⇒ "Nguyễn" thành "Nguy?n". NVARCHAR lưu Unicode.', 'In SQL Server VARCHAR/CHAR/TEXT use the collation\'s code page (usually Latin1) ⇒ "Nguyễn" becomes "Nguy?n". NVARCHAR stores Unicode.'),
    bi('Đổi sang NVARCHAR(n) và chèn bằng N\'…\' (hoặc dùng collation _UTF8 của SQL Server 2019+).', 'Use NVARCHAR(n) and insert with N\'…\' (or a _UTF8 collation on SQL Server 2019+).')),
  R('LIST_IN_COLUMN', 'warning', bi('Một cột chứa danh sách (vi phạm 1NF)', 'A column holding a list (violates 1NF)'),
    bi('Dạng chuẩn 1 (1NF): mỗi ô chỉ MỘT giá trị. Lưu "1,4,7" trong một cột thì không JOIN, không khoá ngoại, không chỉ mục được, sửa một phần tử phải cắt chuỗi.', 'First normal form (1NF): one value per cell. Storing "1,4,7" in a column cannot be joined, foreign-keyed or indexed, and editing one item means string surgery.'),
    bi('Tách thành bảng con (một dòng cho mỗi phần tử), hoặc bảng nối nếu phần tử là khoá của bảng khác.', 'Move it to a child table (one row per item), or a junction table if the items are keys of another table.')),
  R('REPEATING_GROUP', 'warning', bi('Nhóm cột lặp (phone1, phone2, phone3…)', 'Repeating column group (phone1, phone2, phone3…)'),
    bi('Cột đánh số là danh sách trá hình: số phần tử bị giới hạn cứng, tìm "có số X không" phải hỏi từng cột.', 'Numbered columns are a disguised list: the number of items is hard-capped and "does it contain X" must check every column.'),
    bi('Tách thành bảng con: <bảng>Phone(<bảng>Id, phone, …).', 'Move them to a child table: <table>Phone(<table>Id, phone, …).')),
  R('M2M_NO_JUNCTION', 'info', bi('Có vẻ là quan hệ nhiều–nhiều chưa có bảng nối', 'Looks like a many-to-many without a junction table'),
    bi('Hai bảng trỏ khoá ngoại vào nhau (A → B và B → A) thường là cố gắng biểu diễn N–N bằng hai khoá ngoại; mỗi dòng chỉ trỏ được MỘT dòng bên kia.', 'Two tables with foreign keys to each other (A → B and B → A) are usually an attempt at N–N with two foreign keys; each row can point at only ONE row on the other side.'),
    bi('Tạo bảng nối A_B(aId, bId) với PRIMARY KEY (aId, bId) và hai khoá ngoại.', 'Create a junction table A_B(aId, bId) with PRIMARY KEY (aId, bId) and two foreign keys.')),
  R('NAMING_INCONSISTENT', 'info', bi('Cách đặt tên không thống nhất', 'Inconsistent naming'),
    bi('Trộn PascalCase / camelCase / snake_case hoặc số ít / số nhiều làm người đọc phải đoán tên mỗi lần viết truy vấn, và dễ gõ sai.', 'Mixing PascalCase / camelCase / snake_case or singular / plural makes everyone guess names when writing queries, and typos follow.'),
    bi('Chọn một quy ước cho cả nhóm (vd: bảng PascalCase số ít, cột camelCase) và đổi tên cho đồng bộ.', 'Pick one convention for the team (e.g. tables PascalCase singular, columns camelCase) and rename to match.')),
  R('RESERVED_WORD', 'warning', bi('Tên trùng từ khoá dành riêng', 'Name is a reserved word'),
    bi('Tên trùng từ khoá (USER, ORDER, GROUP, KEY…) phải bọc [ ] / " " / ` ` ở MỌI câu truy vấn; quên một chỗ là lỗi cú pháp khó hiểu.', 'Reserved names (USER, ORDER, GROUP, KEY…) must be quoted [ ] / " " / ` ` in EVERY query; forgetting once gives a confusing syntax error.'),
    bi('Đổi tên (Order ⇒ OrderHeader / SalesOrder, user ⇒ Account), hoặc chấp nhận và luôn bọc tên.', 'Rename (Order ⇒ OrderHeader / SalesOrder, user ⇒ Account), or accept it and always quote the name.')),
  R('VARCHAR_NO_LENGTH', 'warning', bi('VARCHAR không ghi độ dài', 'VARCHAR without a length'),
    bi('Trong SQL Server, VARCHAR/NVARCHAR không ghi (n) ở câu CREATE TABLE nghĩa là ĐỘ DÀI 1 ⇒ chèn "abc" bị lỗi cắt chuỗi.', 'In SQL Server, VARCHAR/NVARCHAR without (n) in CREATE TABLE means LENGTH 1 ⇒ inserting "abc" fails with a truncation error.'),
    bi('Ghi rõ độ dài: VARCHAR(100), NVARCHAR(255)…', 'Give a length: VARCHAR(100), NVARCHAR(255)…')),
  R('PLAIN_PASSWORD', 'warning', bi('Cột mật khẩu có vẻ lưu mật khẩu thô', 'Password column looks like plain text'),
    bi('Lộ CSDL một lần là lộ mật khẩu của mọi người (và họ dùng lại ở nơi khác). Chỉ lưu CHUỖI BĂM có muối (bcrypt / PBKDF2 / Argon2).', 'One database leak exposes everyone\'s password (which they reuse elsewhere). Store only a salted HASH (bcrypt / PBKDF2 / Argon2).'),
    bi('Đổi tên thành passwordHash VARCHAR(255) và băm trong code trước khi lưu.', 'Rename to passwordHash VARCHAR(255) and hash in code before saving.')),
  R('NATURAL_KEY_NOT_UNIQUE', 'info', bi('Cột trông như khoá tự nhiên nhưng chưa UNIQUE', 'Looks like a natural key but is not UNIQUE'),
    bi('username / email / mã (code) thường không được trùng. Chỉ kiểm trong Java là chưa đủ: hai yêu cầu cùng lúc vẫn lọt; UNIQUE ở CSDL chặn được.', 'username / email / codes usually must not repeat. Checking only in Java is not enough: two simultaneous requests slip through; a database UNIQUE stops them.'),
    bi('Thêm CONSTRAINT UQ_<bảng>_<cột> UNIQUE (<cột>) nếu đúng là không được trùng.', 'Add CONSTRAINT UQ_<table>_<column> UNIQUE (<column>) if it really must be unique.')),
  R('STATUS_NO_CHECK', 'info', bi('Cột trạng thái/vai trò không giới hạn giá trị', 'Status/role column accepts any value'),
    bi('Không có CHECK thì "ACTIVE", "active", "Actve" đều lọt vào và mọi báo cáo theo trạng thái đều sai.', 'Without a CHECK, "ACTIVE", "active" and "Actve" all get in and every report by status is wrong.'),
    bi('Thêm CHECK (<cột> IN (\'A\', \'B\', …)) hoặc bảng danh mục + khoá ngoại.', 'Add CHECK (<column> IN (\'A\', \'B\', …)) or a lookup table + foreign key.')),
  R('DUPLICATE_INDEX', 'info', bi('Chỉ mục trùng', 'Duplicate index'),
    bi('Chỉ mục giống hệt (cùng cột, cùng thứ tự) một PRIMARY KEY/UNIQUE/INDEX khác không giúp truy vấn nào mà làm chậm mọi INSERT/UPDATE.', 'An index identical (same columns, same order) to another PRIMARY KEY/UNIQUE/INDEX helps no query and slows every INSERT/UPDATE.'),
    bi('Xoá chỉ mục thừa.', 'Drop the redundant index.')),
  R('DATETIME_LEGACY', 'info', bi('DATETIME cũ của SQL Server', 'Legacy SQL Server DATETIME'),
    bi('DATETIME làm tròn tới 1/300 giây (…,997) và chiếm 8 byte; DATETIME2(0..7) chính xác hơn, gọn hơn, khớp chuẩn SQL.', 'DATETIME rounds to 1/300 s (…,997) and takes 8 bytes; DATETIME2(0..7) is more precise, smaller and matches standard SQL.'),
    bi('Dùng DATETIME2(0) (tới giây) hoặc DATETIME2(3) (mili giây).', 'Use DATETIME2(0) (seconds) or DATETIME2(3) (milliseconds).')),
  R('INDEX_ON_MAX', 'error', bi('Khoá/chỉ mục trên cột (MAX)/TEXT', 'Key/index on a (MAX)/TEXT column'),
    bi('SQL Server không cho PRIMARY KEY/UNIQUE/INDEX trên NVARCHAR(MAX)/VARCHAR(MAX)/TEXT (khoá tối đa 900–1700 byte).', 'SQL Server does not allow PRIMARY KEY/UNIQUE/INDEX on NVARCHAR(MAX)/VARCHAR(MAX)/TEXT (keys are limited to 900–1700 bytes).'),
    bi('Giới hạn độ dài cột (NVARCHAR(255)…), hoặc đánh chỉ mục trên cột băm của nó.', 'Limit the column length (NVARCHAR(255)…), or index a hash of it.')),
  R('DUPLICATE_CONSTRAINT_NAME', 'error', bi('Tên ràng buộc bị trùng', 'Duplicate constraint name'),
    bi('Tên ràng buộc (PK_/FK_/UQ_/CK_/DF_) phải duy nhất trong cả schema — tạo cái thứ hai sẽ lỗi.', 'Constraint names (PK_/FK_/UQ_/CK_/DF_) must be unique in the whole schema — creating the second one fails.'),
    bi('Đặt tên theo mẫu <loại>_<bảng>_<cột> để không bao giờ trùng.', 'Name them <kind>_<table>_<column> so they never collide.')),
  R('EMPTY_TABLE', 'error', bi('Bảng không có cột', 'Table without columns'),
    bi('Mọi hệ quản trị đều từ chối CREATE TABLE không có cột.', 'Every database rejects a CREATE TABLE without columns.'),
    bi('Thêm ít nhất cột khoá chính.', 'Add at least the primary key column.')),
];

const RULE = new Map(LINT_RULES.map((r) => [r.code, r]));

const MONEY = /(price|amount|fee|total|cost|salary|balance|money|wage|payment|charge|revenue|deposit|rent|gia|tien|luong|phi|thanhtien|tongtien|dongia|sotien)/i;
const VI_TEXT = /(^|_)(name|title|description|desc|address|note|notes|comment|content|fullname|firstname|lastname|ten|hoten|diachi|mota|ghichu|noidung|tieude|school|hometown|city|ward|district|province|reason|lydo)$|(Name|Title|Description|Address|Note|Comment|Content|Reason)$/;
const LIST = /(ids|_ids|list|_list|csv|tags|danhsach|danh_sach|array|arr)$/i;
const PASSWORD = /^(password|passwd|pwd|pass|matkhau|mat_khau|mk|userpassword|user_password)$/i;
const NATURAL = /^(username|user_name|email|login|loginname|code|sku|slug|cccd|cmnd|idcardno|idcard|id_card_no|taxcode|masothue|isbn|barcode)$/i;
const STATUS = /^(status|state|role|kind|level|trangthai|trang_thai|vaitro|vai_tro)$/i;

function problem(code: string, message: Bi, extra: Partial<Problem> = {}): Problem {
  const r = RULE.get(code);
  return { code, severity: extra.severity ?? r?.severity ?? 'warning', message, ...(r ? { why: r.why, fix: r.fix } : {}), ...extra };
}

function style(name: string): 'snake' | 'pascal' | 'camel' | 'lower' | 'upper' | 'mixed' {
  if (/^[a-z][a-z0-9]*$/.test(name)) return 'lower';
  if (/^[A-Z][A-Z0-9_]*$/.test(name)) return 'upper';
  if (/^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(name)) return 'snake';
  if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) return 'pascal';
  if (/^[a-z][a-zA-Z0-9]*$/.test(name)) return 'camel';
  return 'mixed';
}

const plural = (s: string) => /[^s]s$/i.test(s) && !/(status|address|class|process|access|business|news|series|canvas|bus|gas|campus|virus|bonus|census|alias|basis|analysis|thesis)$/i.test(s);

export function lintModel(model: DbModel, opts: LintOptions = {}): Problem[] {
  const out: Problem[] = [];
  const d: Dialect = model.dialect;
  const off = new Set(opts.disabled ?? []);
  const add = (p: Problem) => { if (!off.has(p.code)) out.push(p); };
  const tspan = (t: Table): Span => t.nameSpan;
  const cspan = (c: Column): Span => c.nameSpan;

  for (const t of model.tables) {
    if (t.incomplete) continue;
    if (!t.columns.length) { add(problem('EMPTY_TABLE', bi(`Bảng ${t.name} chưa có cột nào`, `Table ${t.name} has no columns`), { span: tspan(t), table: t.name })); continue; }
    if (!t.primaryKey) add(problem('NO_PK', bi(`Bảng ${t.name} không có khoá chính`, `Table ${t.name} has no primary key`), { span: tspan(t), table: t.name }));

    for (const c of t.columns) {
      const canon = canonOf(c.type, model.enums, d);
      if (canon.k === 'float' && MONEY.test(c.name)) add(problem('MONEY_FLOAT', bi(`${t.name}.${c.name} là tiền nhưng dùng ${c.type.raw}`, `${t.name}.${c.name} holds money but uses ${c.type.raw}`), { span: cspan(c), table: t.name, column: c.name }));
      if (d === 'sqlserver' && (canon.k === 'char' || canon.k === 'text') && !canon.unicode && VI_TEXT.test(c.name) && !/utf8/i.test(c.collate ?? ''))
        add(problem('VARCHAR_VIETNAMESE', bi(`${t.name}.${c.name} (${c.type.raw}) có thể chứa chữ có dấu — nên là N${c.type.raw.toUpperCase().startsWith('TEXT') ? 'VARCHAR(MAX)' : c.type.raw.toUpperCase()}`, `${t.name}.${c.name} (${c.type.raw}) may hold accented Vietnamese text — use N${c.type.raw.toUpperCase().startsWith('TEXT') ? 'VARCHAR(MAX)' : c.type.raw.toUpperCase()}`), { span: cspan(c), table: t.name, column: c.name }));
      if ((canon.k === 'char' || canon.k === 'text') && LIST.test(c.name)) add(problem('LIST_IN_COLUMN', bi(`${t.name}.${c.name} trông như lưu một danh sách trong một ô`, `${t.name}.${c.name} looks like a list stored in one cell`), { span: cspan(c), table: t.name, column: c.name }));
      if (d === 'sqlserver' && canon.k === 'char' && canon.n === undefined && !canon.max) add(problem('VARCHAR_NO_LENGTH', bi(`${t.name}.${c.name}: ${c.type.raw} không có độ dài ⇒ SQL Server hiểu là độ dài 1`, `${t.name}.${c.name}: ${c.type.raw} has no length ⇒ SQL Server reads it as length 1`), { span: cspan(c), table: t.name, column: c.name }));
      if (PASSWORD.test(c.name)) add(problem('PLAIN_PASSWORD', bi(`${t.name}.${c.name}: đừng lưu mật khẩu thô`, `${t.name}.${c.name}: never store raw passwords`), { span: cspan(c), table: t.name, column: c.name }));
      if (d === 'sqlserver' && canon.k === 'datetime' && canon.legacy === 'datetime') add(problem('DATETIME_LEGACY', bi(`${t.name}.${c.name} dùng DATETIME — nên dùng DATETIME2`, `${t.name}.${c.name} uses DATETIME — prefer DATETIME2`), { span: cspan(c), table: t.name, column: c.name }));
      const res = reservedIn(c.name);
      if (res.length) add(problem('RESERVED_WORD', bi(`Cột ${t.name}.${c.name} trùng từ khoá của ${res.map(lbl).join(', ')}`, `Column ${t.name}.${c.name} is reserved in ${res.map(lbl).join(', ')}`), { span: cspan(c), table: t.name, column: c.name, severity: res.includes(d as never) ? 'warning' : 'info' }));
      const isUnique = isCandidateKey(t, [c.name]);
      const own = c.name.toLowerCase().replace(/_/g, '') === `${t.name.toLowerCase()}code`;
      if ((NATURAL.test(c.name) || own) && !isUnique && (canon.k === 'char' || canon.k === 'text')) add(problem('NATURAL_KEY_NOT_UNIQUE', bi(`${t.name}.${c.name} có được trùng không? Nếu không ⇒ thêm UNIQUE`, `Can ${t.name}.${c.name} repeat? If not ⇒ add UNIQUE`), { span: cspan(c), table: t.name, column: c.name }));
      if (STATUS.test(c.name) && (canon.k === 'char' || canon.k === 'text')) {
        const hasCheck = t.checks.some((ck) => ck.expr.toks.some((x) => (x.t === 'word' || x.t === 'qident') && sameName(x.v, c.name)));
        const isFk = t.foreignKeys.some((f) => f.columns.some((x) => sameName(x, c.name)));
        if (!hasCheck && !isFk) add(problem('STATUS_NO_CHECK', bi(`${t.name}.${c.name} nhận mọi chuỗi — giới hạn bằng CHECK (… IN (…)) hoặc bảng danh mục`, `${t.name}.${c.name} accepts any string — restrict it with CHECK (… IN (…)) or a lookup table`), { span: cspan(c), table: t.name, column: c.name }));
      }
    }
    // nhóm cột lặp: phone1, phone2…
    const groups = new Map<string, Column[]>();
    for (const c of t.columns) { const m = /^(.*?[A-Za-z])_?(\d)$/.exec(c.name); if (m) { const k = m[1].toLowerCase(); groups.set(k, [...(groups.get(k) ?? []), c]); } }
    for (const [base, cs] of groups) if (cs.length >= 2) add(problem('REPEATING_GROUP', bi(`${t.name}: ${cs.map((c) => c.name).join(', ')} là nhóm cột lặp "${base}"`, `${t.name}: ${cs.map((c) => c.name).join(', ')} is a repeating "${base}" group`), { span: cspan(cs[0]), table: t.name, column: cs[0].name }));
    const tres = reservedIn(t.name);
    if (tres.length) add(problem('RESERVED_WORD', bi(`Tên bảng ${t.name} trùng từ khoá của ${tres.map(lbl).join(', ')}`, `Table name ${t.name} is reserved in ${tres.map(lbl).join(', ')}`), { span: tspan(t), table: t.name, severity: tres.includes(d as never) ? 'warning' : 'info' }));

    // Khoá ngoại
    for (const fk of t.foreignKeys) {
      const parent = findTable(model, fk.refTable);
      const span = fk.span ?? tspan(t);
      if (!parent) { add(problem('FK_MISSING_TABLE', bi(`${t.name}: khoá ngoại ${fk.name ?? fk.columns.join(', ')} trỏ tới bảng "${fk.refTable}" không có trong thiết kế`, `${t.name}: foreign key ${fk.name ?? fk.columns.join(', ')} references table "${fk.refTable}", which is not in the design`), { span, table: t.name })); continue; }
      const ref = resolvedRefColumns(model, fk);
      if (!ref.length) { add(problem('FK_NOT_KEY', bi(`${t.name}: ${fk.refTable} không có khoá chính để khoá ngoại trỏ tới`, `${t.name}: ${fk.refTable} has no primary key for the foreign key to reference`), { span, table: t.name })); continue; }
      const missing = ref.filter((r) => !findColumn(parent, r));
      if (missing.length) { add(problem('FK_MISSING_COLUMN', bi(`${t.name}: ${fk.refTable} không có cột ${missing.join(', ')}`, `${t.name}: ${fk.refTable} has no column ${missing.join(', ')}`), { span, table: t.name })); continue; }
      if (ref.length !== fk.columns.length) { add(problem('FK_COLUMN_COUNT', bi(`${t.name}: khoá ngoại có ${fk.columns.length} cột nhưng trỏ tới ${ref.length} cột`, `${t.name}: the foreign key has ${fk.columns.length} column(s) but references ${ref.length}`), { span, table: t.name })); continue; }
      if (!isCandidateKey(parent, ref)) add(problem('FK_NOT_KEY', bi(`${t.name}: ${fk.refTable}(${ref.join(', ')}) không phải PRIMARY KEY hay UNIQUE`, `${t.name}: ${fk.refTable}(${ref.join(', ')}) is neither a PRIMARY KEY nor UNIQUE`), { span, table: t.name }));
      fk.columns.forEach((cn, i) => {
        const c = findColumn(t, cn); const p = findColumn(parent, ref[i]);
        if (!c || !p) return;
        const a = canonOf(c.type, model.enums, d); const b = canonOf(p.type, model.enums, d);
        if (!typesCompatible(a, b)) add(problem('FK_TYPE_MISMATCH', bi(`${t.name}.${c.name} (${c.type.raw}) khác kiểu ${parent.name}.${p.name} (${p.type.raw})`, `${t.name}.${c.name} (${c.type.raw}) differs from ${parent.name}.${p.name} (${p.type.raw})`), { span: cspan(c), table: t.name, column: c.name, severity: d === 'sqlserver' ? 'error' : 'warning' }));
      });
      const lead = (cols: string[]) => fk.columns.every((c, i) => cols[i] !== undefined && sameName(cols[i], c));
      const indexed = (t.primaryKey && lead(t.primaryKey.columns)) || t.uniques.some((u) => lead(u.columns)) || t.indexes.some((ix) => !ix.where && lead(ix.columns.map((c) => c.name)));
      if (!indexed) add(problem('FK_NOT_INDEXED', bi(`${t.name}(${fk.columns.join(', ')}) → ${parent.name}: chưa có chỉ mục${d === 'mysql' ? ' (InnoDB của MySQL tự tạo — các hệ khác thì không)' : ''}`, `${t.name}(${fk.columns.join(', ')}) → ${parent.name}: not indexed${d === 'mysql' ? ' (MySQL InnoDB creates one itself — other databases do not)' : ''}`), { span, table: t.name, column: fk.columns[0], severity: d === 'mysql' ? 'info' : 'warning' }));
      const nullable = fk.columns.map((cn) => findColumn(t, cn)).filter((c) => c?.nullable);
      if (nullable.length) add(problem('FK_NULLABLE', bi(`${t.name}.${nullable.map((c) => c!.name).join(', ')} cho NULL ⇒ quan hệ với ${parent.name} không bắt buộc — đúng ý chưa?`, `${t.name}.${nullable.map((c) => c!.name).join(', ')} allows NULL ⇒ the link to ${parent.name} is optional — intended?`), { span: cspan(nullable[0]!), table: t.name, column: nullable[0]!.name }));
    }

    // Chỉ mục trùng / chỉ mục trên MAX
    const keys: Array<{ name: string; cols: string }> = [];
    if (t.primaryKey) keys.push({ name: t.primaryKey.name ?? 'PRIMARY KEY', cols: t.primaryKey.columns.join(',').toLowerCase() });
    for (const u of t.uniques) keys.push({ name: u.name ?? 'UNIQUE', cols: u.columns.join(',').toLowerCase() });
    for (const ix of t.indexes) {
      if (ix.where || ix.columns.some((c) => c.expr)) continue;
      const cols = ix.columns.map((c) => `${c.name}${c.desc ? ' desc' : ''}`).join(',').toLowerCase();
      const dup = keys.find((k) => k.cols === cols);
      if (dup) add(problem('DUPLICATE_INDEX', bi(`${t.name}: chỉ mục ${ix.name ?? ''} trùng với ${dup.name}`, `${t.name}: index ${ix.name ?? ''} duplicates ${dup.name}`), { span: ix.span ?? tspan(t), table: t.name }));
      keys.push({ name: ix.name ?? 'INDEX', cols });
    }
    if (d === 'sqlserver') {
      const keyed = [...(t.primaryKey?.columns ?? []), ...t.uniques.flatMap((u) => u.columns), ...t.indexes.flatMap((i) => i.columns.map((c) => c.name))];
      for (const k of new Set(keyed.map((x) => x.toLowerCase()))) {
        const c = findColumn(t, k);
        if (!c) continue;
        const canon = canonOf(c.type, model.enums, d);
        if ((canon.k === 'char' && canon.max) || canon.k === 'text' || (canon.k === 'binary' && canon.max)) add(problem('INDEX_ON_MAX', bi(`${t.name}.${c.name} (${c.type.raw}) không làm khoá/chỉ mục được`, `${t.name}.${c.name} (${c.type.raw}) cannot be a key or index column`), { span: cspan(c), table: t.name, column: c.name }));
      }
    }
  }

  // Quan hệ hai chiều A ↔ B (N–N giả)
  const rels = relationships(model).filter((r) => !r.self);
  const seen = new Set<string>();
  for (const r of rels) {
    const back = rels.find((x) => sameName(x.child, r.parent) && sameName(x.parent, r.child));
    const key = [r.child, r.parent].map((s) => s.toLowerCase()).sort().join('|');
    if (back && !seen.has(key) && r.childCard === 'many' && back.childCard === 'many') {
      seen.add(key);
      const t = findTable(model, r.child)!;
      add(problem('M2M_NO_JUNCTION', bi(`${r.child} và ${r.parent} trỏ khoá ngoại vào nhau — nếu là quan hệ nhiều–nhiều, cần bảng nối`, `${r.child} and ${r.parent} reference each other — if this is many-to-many, it needs a junction table`), { span: t.nameSpan, table: t.name }));
    }
  }

  // Trùng tên ràng buộc (cả schema)
  const names = new Map<string, Array<{ table: Table; span?: Span }>>();
  const reg = (n: string | undefined, table: Table, span?: Span) => { if (!n) return; const k = n.toLowerCase(); names.set(k, [...(names.get(k) ?? []), { table, span }]); };
  for (const t of model.tables) {
    reg(t.primaryKey?.name, t, t.primaryKey?.span);
    for (const u of t.uniques) reg(u.name, t, u.span);
    for (const f of t.foreignKeys) reg(f.name, t, f.span);
    for (const c of t.checks) reg(c.name, t, c.span);
    for (const c of t.columns) reg(c.defaultName, t, c.span);
  }
  for (const [k, xs] of names) if (xs.length > 1) add(problem('DUPLICATE_CONSTRAINT_NAME', bi(`Tên ràng buộc "${k}" dùng ${xs.length} lần (${[...new Set(xs.map((x) => x.table.name))].join(', ')})`, `Constraint name "${k}" is used ${xs.length} times (${[...new Set(xs.map((x) => x.table.name))].join(', ')})`), { span: xs[1].span ?? xs[1].table.nameSpan, table: xs[1].table.name }));

  // Đặt tên
  const complete = model.tables.filter((t) => !t.incomplete);
  if (complete.length >= 3) {
    // Tên một từ viết thường (customer) hợp với cả snake_case lẫn camelCase ⇒ không tính.
    const styled = complete.filter((t) => style(t.name) !== 'lower');
    const tstyles = countBy(styled.map((t) => style(t.name)));
    if (tstyles.size > 1) {
      const [main] = [...tstyles.entries()].sort((a, b) => b[1].length - a[1].length);
      const odd = styled.filter((t) => style(t.name) !== main[0]).map((t) => t.name);
      if (odd.length) add(problem('NAMING_INCONSISTENT', bi(`Tên bảng trộn nhiều kiểu: phần lớn ${main[0]}, nhưng ${odd.slice(0, 4).join(', ')} khác`, `Table names mix styles: mostly ${main[0]}, but ${odd.slice(0, 4).join(', ')} differ`), { span: findTable(model, odd[0])!.nameSpan, table: odd[0] }));
    }
    const pl = complete.filter((t) => plural(t.name));
    if (pl.length && pl.length < complete.length) {
      const minority = pl.length <= complete.length / 2 ? pl : complete.filter((t) => !plural(t.name));
      add(problem('NAMING_INCONSISTENT', bi(`Tên bảng trộn số ít và số nhiều (${minority.slice(0, 4).map((t) => t.name).join(', ')} khác phần còn lại)`, `Table names mix singular and plural (${minority.slice(0, 4).map((t) => t.name).join(', ')} differ from the rest)`), { span: minority[0].nameSpan, table: minority[0].name }));
    }
    const cols = complete.flatMap((t) => t.columns.filter((c) => /[A-Z_]/.test(c.name.slice(1))).map((c) => ({ t, c, s: style(c.name) })));
    const cstyles = countBy(cols.map((x) => x.s).filter((s) => s === 'snake' || s === 'camel' || s === 'pascal'));
    if (cstyles.size > 1) {
      const [main] = [...cstyles.entries()].sort((a, b) => b[1].length - a[1].length);
      const odd = cols.filter((x) => (x.s === 'snake' || x.s === 'camel' || x.s === 'pascal') && x.s !== main[0]);
      if (odd.length) add(problem('NAMING_INCONSISTENT', bi(`Tên cột trộn nhiều kiểu: phần lớn ${main[0]}, nhưng ${odd.slice(0, 4).map((x) => `${x.t.name}.${x.c.name}`).join(', ')} khác`, `Column names mix styles: mostly ${main[0]}, but ${odd.slice(0, 4).map((x) => `${x.t.name}.${x.c.name}`).join(', ')} differ`), { span: odd[0].c.nameSpan, table: odd[0].t.name, column: odd[0].c.name }));
    }
  }
  const rank: Record<Severity, number> = { error: 0, warning: 1, info: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity] || (a.span?.start ?? 0) - (b.span?.start ?? 0));
}

function countBy<T extends string>(xs: T[]): Map<T, T[]> {
  const m = new Map<T, T[]>();
  for (const x of xs) m.set(x, [...(m.get(x) ?? []), x]);
  return m;
}

const lbl = (d: string) => ({ sqlserver: 'SQL Server', postgres: 'PostgreSQL', mysql: 'MySQL', sqlite: 'SQLite' } as Record<string, string>)[d] ?? d;
