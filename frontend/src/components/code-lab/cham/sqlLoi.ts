/**
 * Máy chấm SQL (loại 'sql', 29/10/2026) — phần THUẦN: tách câu lệnh, dò cú pháp RIÊNG một hệ, gợi ý lỗi,
 * dựng dữ liệu mẫu cho PostgreSQL ở "chế độ SQL Server". Không DOM, không mạng — test:
 *   npx tsx --test frontend/src/components/code-lab/cham/sql.test.ts
 *
 * ── QUYẾT ĐỊNH PHƯƠNG NGỮ (đọc trước khi sửa) ─────────────────────────────────────────────────────
 * Trường dạy DBI202 trên SQL Server; máy chấm trình duyệt chạy PostgreSQL 18 (PGlite, WASM). Ta chọn
 * phương án (a) "tập con ANSI chung" và KHÔNG dịch mã người học:
 *   1. Đề DBI202 trên Code Lab viết bằng SQL chạy GIỐNG HỆT trên SQL Server 2019+ và PostgreSQL.
 *   2. Mã người học có cú pháp chỉ MỘT hệ hiểu ⇒ KHÔNG chấm, báo rõ vì sao + cách viết chạy cả hai:
 *        - riêng T-SQL (TOP, ISNULL, GETDATE, YEAR(), IDENTITY, NVARCHAR, [tên], biến @, procedure…) —
 *          "chấm bằng máy chủ SQL Server — sắp có";
 *        - riêng PostgreSQL (LIMIT, ILIKE, ::, ||, TRUE/FALSE, NATURAL JOIN, ORDER BY trong truy vấn con…)
 *          — chạy được ở đây nhưng SQL Server sẽ báo lỗi ⇒ chấm đạt là nói dối.
 *   3. Những chỗ CÙNG cú pháp mà KHÁC kết quả thì máy chấm GIẢ LẬP hành vi SQL Server (sqlRunner.ts):
 *        - so sánh chuỗi không phân biệt hoa thường (collation mặc định CI_AS) — cột chữ của dữ liệu mẫu
 *          kiểu NVARCHAR nạp thành CITEXT (cột mã VARCHAR/CHAR giữ nguyên — xem csdlChoPg);
 *        - AVG trên cột INT/SMALLINT trả số nguyên cắt phần lẻ — hàm avg(int) riêng đứng trước pg_catalog;
 *        - GROUP BY chặt: PostgreSQL cho SELECT cột không gộp nếu đã GROUP BY khoá chính (phụ thuộc hàm),
 *          SQL Server thì không ⇒ khoá chính của dữ liệu mẫu nạp thành UNIQUE NOT NULL (PG chỉ nới luật
 *          với PRIMARY KEY).
 *   Còn lệch, KHÔNG giả lập được: thứ tự NULL khi ORDER BY (SQL Server NULL đứng ĐẦU khi ASC, PostgreSQL
 *   đứng CUỐI) ⇒ đề có kiểm thứ tự không được để NULL trong khoá sắp xếp (README Code Lab mục SQL).
 *
 * Loại 'sql-pg' (31/10/2026, khoá PostgreSQL) KHÔNG theo các luật trên: PostgreSQL nguyên bản, không dò phương
 * ngữ trước khi chạy, dữ liệu mẫu nạp nguyên văn (không csdlChoPg). T-SQL chỉ được nhắc khi câu đã lỗi —
 * goiYTsqlChoPg().
 */

// ─── làm sạch: bỏ chú thích / nội dung chuỗi, GIỮ vị trí ký tự ─────────────────────────────────────

/**
 * Thay chú thích (`-- …`, `/* … *\/`) bằng khoảng trắng; nếu `boChuoi` thì cả NỘI DUNG chuỗi '…' và
 * định danh "…" (giữ dấu nháy). Độ dài không đổi ⇒ vị trí lỗi vẫn khớp mã gốc.
 */
export function lamSach(sql: string, boChuoi = true): string {
  const s = String(sql ?? '');
  let out = '';
  let i = 0;
  const trang = (t: string) => t.replace(/[^\n]/g, ' ');
  while (i < s.length) {
    const c = s[i];
    const c2 = s[i + 1];
    if (c === '-' && c2 === '-') {
      const j = s.indexOf('\n', i);
      const het = j < 0 ? s.length : j;
      out += trang(s.slice(i, het));
      i = het;
    } else if (c === '/' && c2 === '*') {
      const j = s.indexOf('*/', i + 2);
      const het = j < 0 ? s.length : j + 2;
      out += trang(s.slice(i, het));
      i = het;
    } else if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === c && s[j + 1] === c) { j += 2; continue; }
        if (s[j] === c) break;
        j++;
      }
      const het = Math.min(s.length, j + 1);
      out += boChuoi ? c + trang(s.slice(i + 1, het - 1)) + (j < s.length ? c : '') : s.slice(i, het);
      i = het;
    } else if (c === '$') {
      // $$ … $$ / $tag$ … $tag$ (PostgreSQL) — coi như chuỗi
      const m = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(s.slice(i));
      if (m) {
        const j = s.indexOf(m[0], i + m[0].length);
        const het = j < 0 ? s.length : j + m[0].length;
        out += boChuoi ? m[0] + trang(s.slice(i + m[0].length, het - (j < 0 ? 0 : m[0].length))) + (j < 0 ? '' : m[0]) : s.slice(i, het);
        i = het;
      } else { out += c; i++; }
    } else { out += c; i++; }
  }
  return out;
}

/** Tách thành các câu lệnh theo `;` ở ngoài chuỗi/chú thích. Bỏ câu rỗng. Trả mã GỐC của từng câu. */
export function tachLenhSql(sql: string): string[] {
  const s = String(sql ?? '');
  const sach = lamSach(s);
  const out: string[] = [];
  let dau = 0;
  for (let i = 0; i <= sach.length; i++) {
    if (i === sach.length || sach[i] === ';') {
      const cau = s.slice(dau, i);
      if (lamSach(cau).trim()) out.push(cau.trim());
      dau = i + 1;
    }
  }
  return out;
}

/** Thay nội dung mọi cặp ngoặc (lồng nhau) bằng khoảng trắng — để xét từ khoá ở MỨC NGOÀI CÙNG. */
export function boNgoac(sach: string): string {
  let sau = 0;
  let out = '';
  for (const c of sach) {
    if (c === '(') { out += sau > 0 ? ' ' : c; sau++; continue; }
    if (c === ')') { sau = Math.max(0, sau - 1); out += sau > 0 ? ' ' : c; continue; }
    out += sau > 0 && c !== '\n' ? ' ' : c;
  }
  return out;
}

/** Nội dung từng cặp ngoặc (mọi độ sâu), mỗi đoạn đã bỏ ngoặc con bên trong. */
function cacDoanNgoac(sach: string): string[] {
  const out: string[] = [];
  const mo: number[] = [];
  for (let i = 0; i < sach.length; i++) {
    if (sach[i] === '(') mo.push(i);
    else if (sach[i] === ')' && mo.length) {
      const a = mo.pop() as number;
      out.push(boNgoac(sach.slice(a + 1, i)));
    }
  }
  return out;
}

// ─── dò cú pháp riêng một hệ ───────────────────────────────────────────────────────────────────

export type PhiaPhuongNgu = 'tsql' | 'pg';
export interface ViPham { ma: string; phia: PhiaPhuongNgu; vi: string; en: string }

interface Luat {
  ma: string;
  phia: PhiaPhuongNgu;
  /** Regex trên mã đã bỏ chú thích + nội dung chuỗi (cả câu). */
  re?: RegExp;
  /** Hàm tự xét: nhận từng câu lệnh đã làm sạch (sach) + bản giữ chuỗi (giuChuoi). */
  xet?: (sach: string, giuChuoi: string) => boolean;
  vi: string;
  en: string;
}

const DDL = /^\s*(CREATE|ALTER)\s+TABLE\b/i;
/** Tên kiểu chỉ tính khi ở chỗ của KIỂU: câu DDL, hoặc CAST(… AS kiểu) — tránh bắt nhầm cột tên "Image", "Money"… */
const viTriKieu = (s: string, ds: string) => (DDL.test(s) && new RegExp(`\\b(${ds})\\b`, 'i').test(s)) || new RegExp(`\\bCAST\\s*\\([^()]*\\bAS\\s+(${ds})\\b`, 'i').test(s);

const LUAT: Luat[] = [
  // ── chỉ SQL Server (T-SQL) hiểu ──
  { ma: 'tsql-top', phia: 'tsql', re: /\bTOP\s*(\(\s*)?\d/i,
    vi: 'TOP n chỉ có ở SQL Server. Viết chuẩn chạy cả hai: ORDER BY … OFFSET 0 ROWS FETCH NEXT n ROWS ONLY.',
    en: 'TOP n is SQL Server only. Portable form: ORDER BY … OFFSET 0 ROWS FETCH NEXT n ROWS ONLY.' },
  { ma: 'tsql-isnull', phia: 'tsql', re: /\bISNULL\s*\(/i,
    vi: 'ISNULL(x, y) là hàm T-SQL. Dùng COALESCE(x, y) — chuẩn SQL, chạy cả SQL Server lẫn PostgreSQL.',
    en: 'ISNULL(x, y) is T-SQL. Use COALESCE(x, y), which is standard SQL.' },
  { ma: 'tsql-getdate', phia: 'tsql', re: /\b(GETDATE|SYSDATETIME|GETUTCDATE|SYSUTCDATETIME)\s*\(/i,
    vi: 'GETDATE() là hàm T-SQL. Dùng CURRENT_TIMESTAMP (chạy cả hai hệ).',
    en: 'GETDATE() is T-SQL. Use CURRENT_TIMESTAMP (works on both).' },
  { ma: 'tsql-datefn', phia: 'tsql', re: /\b(YEAR|MONTH|DAY|DATEPART|DATENAME|DATEADD|DATEDIFF|EOMONTH|DATEFROMPARTS)\s*\(/i,
    vi: 'YEAR()/MONTH()/DATEDIFF()… là hàm ngày của SQL Server (PostgreSQL không có). Lọc theo năm bằng khoảng ngày — chạy cả hai và dùng được chỉ mục: d >= \'2024-01-01\' AND d < \'2025-01-01\'.',
    en: 'YEAR()/MONTH()/DATEDIFF()… are SQL Server date functions. Filter a year with a date range instead (portable and index-friendly): d >= \'2024-01-01\' AND d < \'2025-01-01\'.' },
  { ma: 'tsql-strfn', phia: 'tsql', re: /\b(LEN|DATALENGTH|CHARINDEX|PATINDEX|STUFF|REPLICATE|SPACE|STR|QUOTENAME)\s*\(/i,
    vi: 'LEN/CHARINDEX/STUFF… là hàm chuỗi riêng SQL Server (PostgreSQL đặt tên khác). Bài này giải được bằng LIKE, UPPER/LOWER, SUBSTRING(s, vị trí, độ dài), REPLACE, CONCAT — các hàm có ở cả hai.',
    en: 'LEN/CHARINDEX/STUFF… are SQL Server string functions. Solve it with LIKE, UPPER/LOWER, SUBSTRING(s, start, length), REPLACE, CONCAT, which exist on both.' },
  { ma: 'tsql-convert', phia: 'tsql', re: /\b(CONVERT|TRY_CONVERT|TRY_CAST|PARSE|TRY_PARSE|IIF|CHOOSE|FORMAT)\s*\(/i,
    vi: 'CONVERT/IIF/FORMAT là T-SQL. Dùng CAST(x AS kiểu) và CASE WHEN … THEN … ELSE … END (chuẩn SQL).',
    en: 'CONVERT/IIF/FORMAT are T-SQL. Use CAST(x AS type) and CASE WHEN … THEN … ELSE … END (standard SQL).' },
  { ma: 'tsql-identity', phia: 'tsql', re: /\bIDENTITY\b/i,
    vi: 'IDENTITY(1,1) là cột tự tăng của SQL Server; PostgreSQL viết khác. Bài này ghi giá trị khoá tường minh trong INSERT — không cần cột tự tăng.',
    en: 'IDENTITY(1,1) is SQL Server\'s auto-number; PostgreSQL spells it differently. This task inserts explicit key values, so no auto-number is needed.' },
  { ma: 'tsql-ntype', phia: 'tsql', xet: (s) => viTriKieu(s, 'NVARCHAR|NCHAR|NTEXT'),
    vi: 'NVARCHAR/NCHAR là kiểu riêng SQL Server. Ở máy chấm này viết VARCHAR(n)/CHAR(n) (PostgreSQL lưu UTF-8 nên vẫn chứa tiếng Việt). Đề PE thật trên SQL Server vẫn dùng NVARCHAR — nhớ đổi lại khi thi.',
    en: 'NVARCHAR/NCHAR are SQL Server types. Here use VARCHAR(n)/CHAR(n) (PostgreSQL stores UTF-8). On the real SQL Server PE keep NVARCHAR.' },
  { ma: 'tsql-datetime', phia: 'tsql', xet: (s) => viTriKieu(s, 'DATETIME2?|SMALLDATETIME|DATETIMEOFFSET|ROWVERSION'),
    vi: 'DATETIME là kiểu SQL Server (PostgreSQL không có; còn TIMESTAMP của SQL Server lại là rowversion). Bài này chỉ cần DATE — chạy giống nhau ở cả hai.',
    en: 'DATETIME is a SQL Server type (and TIMESTAMP means rowversion there). This task only needs DATE, which behaves the same on both.' },
  { ma: 'tsql-bit-money', phia: 'tsql', xet: (s) => viTriKieu(s, 'BIT|MONEY|SMALLMONEY|TINYINT|UNIQUEIDENTIFIER|IMAGE'),
    vi: 'BIT/MONEY/TINYINT là kiểu riêng SQL Server. Dùng SMALLINT hoặc CHAR(1) cho cờ, DECIMAL(p,s) cho tiền.',
    en: 'BIT/MONEY/TINYINT are SQL Server types. Use SMALLINT or CHAR(1) for flags and DECIMAL(p,s) for money.' },
  { ma: 'tsql-bracket', phia: 'tsql', re: /\[[A-Za-z_][^\]\n]*\]/,
    vi: '[tên] là cách đặt tên trong ngoặc vuông của SQL Server. Bỏ ngoặc vuông (tên không có dấu cách) — chạy cả hai hệ.',
    en: '[name] is SQL Server bracket quoting. Drop the brackets (names have no spaces) so it runs on both.' },
  { ma: 'tsql-batch', phia: 'tsql', re: /(^|[^@\w])@@?[A-Za-z_]\w*|\bDECLARE\b|\bPRINT\b|^\s*GO\s*$|\bEXEC(UTE)?\b|\bRAISERROR\b|\bTHROW\b|#[A-Za-z_]\w*/im,
    vi: 'Biến @, DECLARE, PRINT, GO, EXEC, bảng tạm #… là T-SQL. Bài này chỉ cần MỘT câu SQL chuẩn. Procedure/function/trigger T-SQL sẽ chấm bằng máy chủ SQL Server — sắp có.',
    en: '@variables, DECLARE, PRINT, GO, EXEC and #temp tables are T-SQL. This task needs one standard SQL statement. T-SQL procedures/functions/triggers will be graded by a real SQL Server — coming soon.' },
  { ma: 'tsql-prog', phia: 'tsql', re: /\bCREATE\s+(OR\s+ALTER\s+)?(PROC|PROCEDURE|TRIGGER|FUNCTION)\b|\bCREATE\s+OR\s+ALTER\b/i,
    vi: 'Procedure/function/trigger (và CREATE OR ALTER) viết bằng T-SQL — máy chấm trình duyệt chạy PostgreSQL nên không chấm được. Chấm bằng máy chủ SQL Server — sắp có; tạm thời luyện ở Phòng thi.',
    en: 'Procedures/functions/triggers (and CREATE OR ALTER) are T-SQL; this in-browser grader runs PostgreSQL. Grading on a real SQL Server is coming soon.' },
  { ma: 'tsql-apply', phia: 'tsql', re: /\b(CROSS|OUTER)\s+APPLY\b|\bOUTPUT\s+(INSERTED|DELETED)\b|\bWITH\s*\(\s*NOLOCK\b|\bPIVOT\s*\(/i,
    vi: 'APPLY / OUTPUT INSERTED / NOLOCK / PIVOT là T-SQL. Viết bằng JOIN, truy vấn con hoặc CASE + GROUP BY.',
    en: 'APPLY / OUTPUT INSERTED / NOLOCK / PIVOT are T-SQL. Use JOINs, subqueries or CASE + GROUP BY.' },
  { ma: 'tsql-alter-col', phia: 'tsql', re: /\bALTER\s+COLUMN\s+\w+\s+(?!TYPE\b|SET\b|DROP\b)[A-Za-z]/i,
    vi: 'ALTER COLUMN cột kiểu-mới là cú pháp SQL Server (PostgreSQL viết ALTER COLUMN … TYPE …). Bài này không cần đổi kiểu cột.',
    en: 'ALTER COLUMN col newtype is SQL Server syntax (PostgreSQL needs ALTER COLUMN … TYPE …). This task does not need a type change.' },
  { ma: 'tsql-alias-quote', phia: 'tsql', xet: (_s, g) => /\bAS\s+'/i.test(g) || /^\s*SELECT\s+'[^']*'\s*=/i.test(g),
    vi: 'Bí danh trong nháy đơn (AS \'Tổng\') chỉ SQL Server nhận. Viết AS TongTien (không dấu cách) — chạy cả hai.',
    en: 'A column alias in single quotes (AS \'Total\') is accepted by SQL Server only. Write AS Total (no spaces) so it runs on both.' },

  // ── chỉ PostgreSQL hiểu (chạy được ở đây nhưng SQL Server báo lỗi / ra khác) ──
  { ma: 'pg-limit', phia: 'pg', re: /\bLIMIT\s+(\d|ALL\b)/i,
    vi: 'LIMIT chạy ở PostgreSQL/MySQL nhưng SQL Server KHÔNG có. Viết chuẩn: ORDER BY … OFFSET 0 ROWS FETCH NEXT n ROWS ONLY.',
    en: 'LIMIT works on PostgreSQL/MySQL but SQL Server rejects it. Standard form: ORDER BY … OFFSET 0 ROWS FETCH NEXT n ROWS ONLY.' },
  { ma: 'pg-ilike', phia: 'pg', re: /\bILIKE\b/i,
    vi: 'ILIKE chỉ PostgreSQL có. So không phân biệt hoa thường mà chạy mọi nơi: LOWER(cot) LIKE \'%abc%\'.',
    en: 'ILIKE is PostgreSQL only. Case-insensitive and portable: LOWER(col) LIKE \'%abc%\'.' },
  { ma: 'pg-cast', phia: 'pg', re: /::/,
    vi: 'Ép kiểu x::kieu chỉ PostgreSQL hiểu. Dùng CAST(x AS kieu).',
    en: 'x::type casts are PostgreSQL only. Use CAST(x AS type).' },
  { ma: 'pg-concat', phia: 'pg', re: /\|\|/,
    vi: 'Nối chuỗi bằng || không chạy trên SQL Server (ở đó là +, mà + lại không chạy trên PostgreSQL). Dùng CONCAT(a, \' \', b) — chạy cả hai.',
    en: 'String concatenation with || fails on SQL Server (which uses +, which PostgreSQL rejects). Use CONCAT(a, \' \', b) on both.' },
  { ma: 'pg-bool', phia: 'pg', re: /\b(TRUE|FALSE)\b/i,
    vi: 'SQL Server không có hằng TRUE/FALSE (kiểu boolean). Viết điều kiện thật (vd 1 = 1) hoặc dùng 1/0.',
    en: 'SQL Server has no TRUE/FALSE literals. Write a real condition (e.g. 1 = 1) or use 1/0.' },
  { ma: 'pg-type', phia: 'pg', xet: (s) => viTriKieu(s, 'SERIAL|BIGSERIAL|SMALLSERIAL|BOOLEAN|BOOL|BYTEA|JSONB?|UUID|TIMESTAMPTZ|INTERVAL|CITEXT') || /\bINTERVAL\s+'/i.test(s),
    vi: 'Kiểu/biểu thức này chỉ PostgreSQL có (SERIAL, BOOLEAN, INTERVAL, JSONB…). Dùng INT, SMALLINT, DATE, DECIMAL, VARCHAR(n), CHAR(n) — có ở cả hai.',
    en: 'This type/expression is PostgreSQL only (SERIAL, BOOLEAN, INTERVAL, JSONB…). Use INT, SMALLINT, DATE, DECIMAL, VARCHAR(n), CHAR(n).' },
  { ma: 'pg-text-ddl', phia: 'pg', xet: (s) => DDL.test(s) && /\bTEXT\b/i.test(s),
    vi: 'Kiểu TEXT trong bảng: SQL Server coi là kiểu cũ (không so sánh = được). Dùng VARCHAR(n).',
    en: 'TEXT columns are legacy on SQL Server (cannot be compared with =). Use VARCHAR(n).' },
  { ma: 'pg-varchar-nolen', phia: 'pg', xet: (s) => DDL.test(s) && /\b(VARCHAR|CHAR|CHARACTER\s+VARYING)\b(?!\s*\()/i.test(s),
    vi: 'VARCHAR/CHAR không ghi độ dài: PostgreSQL hiểu là "không giới hạn", SQL Server hiểu là ĐỘ DÀI 1 (cắt mất dữ liệu). Luôn ghi độ dài: VARCHAR(50).',
    en: 'VARCHAR/CHAR without a length: PostgreSQL means unlimited, SQL Server means LENGTH 1. Always give a length: VARCHAR(50).' },
  { ma: 'pg-datefn', phia: 'pg', re: /\b(NOW|DATE_PART|DATE_TRUNC|AGE|TO_CHAR|TO_DATE|TO_NUMBER|TO_TIMESTAMP|EXTRACT|MAKE_DATE)\s*\(|\bCURRENT_DATE\b|\bDATE\s+'/i,
    vi: 'NOW()/EXTRACT()/CURRENT_DATE/DATE \'…\' là cú pháp PostgreSQL — SQL Server báo lỗi. Lọc ngày bằng khoảng hằng: d >= \'2024-01-01\' AND d < \'2025-01-01\'; thời điểm hiện tại: CURRENT_TIMESTAMP.',
    en: 'NOW()/EXTRACT()/CURRENT_DATE/DATE \'…\' are PostgreSQL syntax and fail on SQL Server. Filter dates with constant ranges; current time is CURRENT_TIMESTAMP.' },
  { ma: 'pg-strfn', phia: 'pg', re: /\b(LENGTH|CHAR_LENGTH|CHARACTER_LENGTH|POSITION|STRPOS|SPLIT_PART|INITCAP|LPAD|RPAD|BTRIM|REGEXP_[A-Z_]+|STRING_TO_ARRAY|ARRAY_AGG)\s*\(|\bSUBSTRING\s*\(\s*[^()]*?\b(FROM|FOR)\b/i,
    vi: 'Hàm chuỗi này chỉ PostgreSQL có (LENGTH, POSITION, SPLIT_PART, SUBSTRING … FROM …). Dùng LIKE, UPPER/LOWER, SUBSTRING(s, vị trí, độ dài), REPLACE, CONCAT — có ở cả hai.',
    en: 'This string function is PostgreSQL only. Use LIKE, UPPER/LOWER, SUBSTRING(s, start, length), REPLACE, CONCAT.' },
  { ma: 'pg-math', phia: 'pg', re: /\b(CEIL|TRUNC|MOD|DIV|RANDOM|GREATEST|LEAST)\s*\(/i,
    vi: 'CEIL/TRUNC/MOD/RANDOM/GREATEST… không có (hoặc chỉ có ở bản mới) trên SQL Server. Dùng CEILING, FLOOR, ROUND(x, n), toán tử %, CASE WHEN.',
    en: 'CEIL/TRUNC/MOD/RANDOM/GREATEST… are missing (or very new) on SQL Server. Use CEILING, FLOOR, ROUND(x, n), the % operator, CASE WHEN.' },
  { ma: 'pg-round1', phia: 'pg', xet: (s) => /\bROUND\s*\(/i.test(s) && cacLoiGoi(s, 'ROUND').some((doan) => !/,/.test(doan)),
    vi: 'ROUND(x) một tham số: SQL Server bắt buộc 2 tham số. Viết ROUND(x, 0) hoặc ROUND(x, 2).',
    en: 'ROUND(x) with one argument fails on SQL Server, which requires two. Write ROUND(x, 0) or ROUND(x, 2).' },
  { ma: 'pg-join', phia: 'pg', re: /\bNATURAL\s+((LEFT|RIGHT|FULL|INNER)\s+)?(OUTER\s+)?JOIN\b|\bJOIN\s+[A-Za-z_][\w.]*(\s+(AS\s+)?[A-Za-z_]\w*)?\s+USING\s*\(|\bLATERAL\b/i,
    vi: 'NATURAL JOIN / JOIN … USING(…) / LATERAL: SQL Server không hỗ trợ. Viết JOIN … ON a.cot = b.cot — chạy mọi nơi và rõ cột nối.',
    en: 'NATURAL JOIN / JOIN … USING(…) / LATERAL are not supported by SQL Server. Write JOIN … ON a.col = b.col.' },
  { ma: 'pg-misc', phia: 'pg', re: /\bDISTINCT\s+ON\b|\bRETURNING\b|\bON\s+CONFLICT\b|\bCREATE\s+OR\s+REPLACE\b|\bWITH\s+RECURSIVE\b|\b(EXCEPT|INTERSECT)\s+ALL\b|\bFILTER\s*\(\s*WHERE\b|\bIF\s+NOT\s+EXISTS\b|\bDEFERRABLE\b|\bRENAME\s+(TO|COLUMN)\b|\bADD\s+COLUMN\b|\bCOMMENT\s+ON\b|\bE'/i,
    vi: 'Cú pháp này chỉ PostgreSQL hiểu (DISTINCT ON, RETURNING, ON CONFLICT, CREATE OR REPLACE, WITH RECURSIVE, EXCEPT ALL, IF NOT EXISTS, ADD COLUMN…). SQL Server báo lỗi — viết bằng phần chuẩn chung (vd ALTER TABLE t ADD cot INT).',
    en: 'PostgreSQL-only syntax (DISTINCT ON, RETURNING, ON CONFLICT, CREATE OR REPLACE, WITH RECURSIVE, EXCEPT ALL, IF NOT EXISTS, ADD COLUMN…). SQL Server rejects it; use the shared standard (e.g. ALTER TABLE t ADD col INT).' },
  { ma: 'pg-groupby-num', phia: 'pg', re: /\bGROUP\s+BY\s+\d/i,
    vi: 'GROUP BY 1 (số thứ tự cột) chỉ PostgreSQL nhận; SQL Server báo lỗi. Ghi rõ tên cột/biểu thức.',
    en: 'GROUP BY 1 (column position) is PostgreSQL only. Name the column or expression.' },
  { ma: 'pg-offset', phia: 'pg', xet: (s) => {
    const ngoai = boNgoac(s);
    if (/\bOFFSET\s+\d+(?!\s*ROWS?\b)/i.test(ngoai)) return true;
    if (/\bFETCH\s+(FIRST|NEXT)\b/i.test(ngoai) && !/\bOFFSET\b/i.test(ngoai)) return true;
    return /\bOFFSET\b/i.test(ngoai) && !/\bORDER\s+BY\b/i.test(ngoai);
  },
    vi: 'SQL Server chỉ nhận dạng đầy đủ: ORDER BY … OFFSET n ROWS FETCH NEXT m ROWS ONLY (bắt buộc ORDER BY, OFFSET và chữ ROWS). FETCH FIRST không có OFFSET chỉ PostgreSQL nhận.',
    en: 'SQL Server only accepts the full form ORDER BY … OFFSET n ROWS FETCH NEXT m ROWS ONLY (ORDER BY, OFFSET and ROWS are required).' },
  { ma: 'pg-order-sub', phia: 'pg', xet: (s) => {
    const laView = /^\s*CREATE\s+VIEW\b/i.test(s);
    const doan = cacDoanNgoac(s).filter((d) => /^\s*(SELECT|WITH)\b/i.test(d));
    if (laView) doan.push(boNgoac(s.replace(/^[\s\S]*?\bAS\b/i, '')));
    return doan.some((d) => /\bORDER\s+BY\b/i.test(d) && !/\b(OFFSET|TOP|FETCH)\b/i.test(d));
  },
    vi: 'ORDER BY bên trong truy vấn con / CTE / VIEW: SQL Server báo lỗi (trừ khi kèm TOP/OFFSET). Đặt ORDER BY ở câu SELECT ngoài cùng.',
    en: 'ORDER BY inside a subquery / CTE / VIEW is an error on SQL Server (unless it has TOP/OFFSET). Put ORDER BY on the outermost SELECT.' },
  { ma: 'pg-groupby-alias', phia: 'pg', xet: (s) => groupByDungBiDanh(s),
    vi: 'GROUP BY theo bí danh cột (đặt ở SELECT … AS ten) chỉ PostgreSQL nhận; SQL Server báo "Invalid column name". Lặp lại nguyên biểu thức trong GROUP BY.',
    en: 'GROUP BY a SELECT alias works on PostgreSQL only; SQL Server says "Invalid column name". Repeat the full expression in GROUP BY.' },
  { ma: 'pg-update-from', phia: 'pg', xet: (s) => {
    const ngoai = boNgoac(s);
    return (/^\s*UPDATE\b/i.test(ngoai) && /\bSET\b[\s\S]*\bFROM\b/i.test(ngoai)) || /^\s*DELETE\s+FROM\s+\S+\s+(AS\s+)?\w*\s*USING\b/i.test(ngoai) || /^\s*DELETE\s+(?!FROM\b)\w+\s+FROM\b/i.test(ngoai);
  },
    vi: 'UPDATE … FROM / DELETE … USING / DELETE t FROM t JOIN …: SQL Server và PostgreSQL viết KHÁC nhau. Dùng truy vấn con: UPDATE t SET … WHERE khoa IN (SELECT …) — chạy cả hai.',
    en: 'UPDATE … FROM / DELETE … USING / DELETE t FROM t JOIN … differ between SQL Server and PostgreSQL. Use a subquery: UPDATE t SET … WHERE key IN (SELECT …).' },
];

/** Nội dung các lời gọi hàm `ten(…)` ở câu đã làm sạch (mức con đã bỏ ngoặc). */
function cacLoiGoi(sach: string, ten: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`\\b${ten}\\s*\\(`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(sach))) {
    let sau = 1;
    let j = m.index + m[0].length;
    const a = j;
    while (j < sach.length && sau > 0) { if (sach[j] === '(') sau++; else if (sach[j] === ')') sau--; j++; }
    out.push(boNgoac(sach.slice(a, j - 1)));
  }
  return out;
}

/** GROUP BY dùng bí danh của SELECT (vd `SELECT a + b AS tong … GROUP BY tong`)? Bí danh trùng tên cột (`x AS x`) thì bỏ qua. */
export function groupByDungBiDanh(sach: string): boolean {
  const ngoai = boNgoac(sach);
  const m = /\bSELECT\b([\s\S]*?)\bFROM\b[\s\S]*?\bGROUP\s+BY\b([\s\S]*?)(\bHAVING\b|\bORDER\s+BY\b|\bUNION\b|\bEXCEPT\b|\bINTERSECT\b|$)/i.exec(ngoai);
  if (!m) return false;
  // danh sách SELECT dùng bản GỐC (cần biểu thức trong ngoặc) — cắt cùng vị trí
  const dauSelect = ngoai.search(/\bSELECT\b/i) + 6;
  const dsSelect = sach.slice(dauSelect, dauSelect + m[1].length);
  const biDanh = new Set<string>();
  let sau = 0;
  let manh = '';
  const cacMuc: string[] = [];
  for (const c of dsSelect) {
    if (c === '(') sau++;
    if (c === ')') sau--;
    if (c === ',' && sau === 0) { cacMuc.push(manh); manh = ''; } else manh += c;
  }
  cacMuc.push(manh);
  for (const muc of cacMuc) {
    const a = /^([\s\S]*?)\s+AS\s+([A-Za-z_]\w*)\s*$/i.exec(muc.trim());
    if (!a) continue;
    const bieuThuc = a[1].trim();
    const ten = a[2].toLowerCase();
    const cotCuoi = /^(?:[A-Za-z_]\w*\.)?([A-Za-z_]\w*)$/.exec(bieuThuc);
    if (cotCuoi && cotCuoi[1].toLowerCase() === ten) continue;
    biDanh.add(ten);
  }
  if (!biDanh.size) return false;
  return m[2].split(',').map((x) => x.trim().toLowerCase()).some((x) => /^[a-z_]\w*$/.test(x) && biDanh.has(x));
}

/** Mọi vi phạm phương ngữ trong mã người học (mỗi luật báo tối đa một lần). */
export function kiemPhuongNgu(sql: string): ViPham[] {
  const out: ViPham[] = [];
  const cauSach = tachLenhSql(sql).map((c) => ({ sach: lamSach(c), giu: lamSach(c, false) }));
  for (const l of LUAT) {
    const trung = l.re
      ? cauSach.some((c) => (l.re as RegExp).test(c.sach))
      : cauSach.some((c) => (l.xet as (a: string, b: string) => boolean)(c.sach, c.giu));
    if (trung) out.push({ ma: l.ma, phia: l.phia, vi: l.vi, en: l.en });
  }
  return out;
}

// ─── chế độ PostgreSQL nguyên bản (loại 'sql-pg', 31/10/2026) ─────────────────────────────────────
//
// Ở loại 'sql-pg' KHÔNG chặn cú pháp nào trước khi chạy: PostgreSQL thật tự báo lỗi. Nhưng người học
// đi từ DBI202 (SQL Server) hay viết T-SQL — khi câu LỖI, dò lại bằng chính LUAT phía 'tsql' rồi chỉ cách viết
// của PostgreSQL (khác lời khuyên "tập con chung" của loại 'sql'). Chỉ dùng khi đã lỗi ⇒ dò nhầm không làm
// trượt bài nào.
const GOI_Y_PG: Record<string, [string, string]> = {
  'tsql-top': ['PostgreSQL không có TOP n: viết ORDER BY … LIMIT n (hoặc FETCH FIRST n ROWS ONLY).', 'PostgreSQL has no TOP n: write ORDER BY … LIMIT n (or FETCH FIRST n ROWS ONLY).'],
  'tsql-isnull': ['ISNULL(x, y) là T-SQL — PostgreSQL dùng COALESCE(x, y).', 'ISNULL(x, y) is T-SQL — PostgreSQL uses COALESCE(x, y).'],
  'tsql-getdate': ['GETDATE() là T-SQL — PostgreSQL dùng now() / CURRENT_TIMESTAMP / CURRENT_DATE.', 'GETDATE() is T-SQL — PostgreSQL uses now() / CURRENT_TIMESTAMP / CURRENT_DATE.'],
  'tsql-datefn': ['YEAR()/DATEDIFF()/DATEADD() là T-SQL — PostgreSQL: EXTRACT(YEAR FROM d), date_trunc(\'month\', d), d + INTERVAL \'7 days\', age(a, b).', 'YEAR()/DATEDIFF()/DATEADD() are T-SQL — PostgreSQL: EXTRACT(YEAR FROM d), date_trunc(\'month\', d), d + INTERVAL \'7 days\', age(a, b).'],
  'tsql-strfn': ['LEN/CHARINDEX/STUFF là T-SQL — PostgreSQL: length(s), position(\'x\' IN s) / strpos(s, \'x\'), overlay(…), repeat(s, n).', 'LEN/CHARINDEX/STUFF are T-SQL — PostgreSQL: length(s), position(\'x\' IN s) / strpos(s, \'x\'), overlay(…), repeat(s, n).'],
  'tsql-convert': ['CONVERT/IIF/FORMAT là T-SQL — PostgreSQL: CAST(x AS kiểu) hoặc x::kiểu, CASE WHEN … END, to_char(x, \'…\').', 'CONVERT/IIF/FORMAT are T-SQL — PostgreSQL: CAST(x AS type) or x::type, CASE WHEN … END, to_char(x, \'…\').'],
  'tsql-identity': ['IDENTITY(1,1) là T-SQL — PostgreSQL: id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY (hoặc SERIAL).', 'IDENTITY(1,1) is T-SQL — PostgreSQL: id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY (or SERIAL).'],
  'tsql-ntype': ['NVARCHAR/NCHAR là kiểu SQL Server — PostgreSQL dùng VARCHAR(n) hoặc TEXT (đã là UTF-8, chứa được tiếng Việt).', 'NVARCHAR/NCHAR are SQL Server types — PostgreSQL uses VARCHAR(n) or TEXT (already UTF-8).'],
  'tsql-datetime': ['DATETIME là kiểu SQL Server — PostgreSQL dùng TIMESTAMP (hoặc TIMESTAMPTZ khi cần múi giờ).', 'DATETIME is a SQL Server type — PostgreSQL uses TIMESTAMP (or TIMESTAMPTZ with a time zone).'],
  'tsql-bit-money': ['BIT/MONEY/TINYINT là kiểu SQL Server — PostgreSQL: BOOLEAN, NUMERIC(12,2), SMALLINT.', 'BIT/MONEY/TINYINT are SQL Server types — PostgreSQL: BOOLEAN, NUMERIC(12,2), SMALLINT.'],
  'tsql-bracket': ['[tên] là cách đặt tên của SQL Server — PostgreSQL dùng nháy kép "tên" (và khi đó phân biệt HOA/thường).', '[name] is SQL Server quoting — PostgreSQL uses double quotes "name" (case-sensitive then).'],
  'tsql-batch': ['@biến, DECLARE, PRINT, GO, EXEC là T-SQL — PostgreSQL viết khối PL/pgSQL: DO $$ DECLARE … BEGIN … END $$; in ra bằng RAISE NOTICE; gọi thủ tục bằng CALL.', '@variables, DECLARE, PRINT, GO, EXEC are T-SQL — PostgreSQL uses PL/pgSQL blocks: DO $$ DECLARE … BEGIN … END $$; print with RAISE NOTICE; call procedures with CALL.'],
  'tsql-prog': ['Hàm/thủ tục/trigger PostgreSQL viết bằng PL/pgSQL: CREATE FUNCTION f(…) RETURNS … LANGUAGE plpgsql AS $$ BEGIN … END $$; trigger = một hàm RETURNS trigger + CREATE TRIGGER … EXECUTE FUNCTION f().', 'PostgreSQL functions/procedures/triggers use PL/pgSQL: CREATE FUNCTION f(…) RETURNS … LANGUAGE plpgsql AS $$ BEGIN … END $$; a trigger is a RETURNS trigger function + CREATE TRIGGER … EXECUTE FUNCTION f().'],
  'tsql-apply': ['CROSS/OUTER APPLY ⇒ JOIN LATERAL; OUTPUT INSERTED ⇒ RETURNING; NOLOCK không cần (MVCC); PIVOT ⇒ SUM(…) FILTER (WHERE …).', 'CROSS/OUTER APPLY ⇒ JOIN LATERAL; OUTPUT INSERTED ⇒ RETURNING; NOLOCK is unnecessary (MVCC); PIVOT ⇒ SUM(…) FILTER (WHERE …).'],
  'tsql-alter-col': ['PostgreSQL đổi kiểu cột: ALTER TABLE t ALTER COLUMN c TYPE kiểu_mới.', 'PostgreSQL changes a column type with ALTER TABLE t ALTER COLUMN c TYPE new_type.'],
  'tsql-alias-quote': ['Bí danh trong nháy ĐƠN là T-SQL — PostgreSQL: AS tong_tien, hoặc nháy KÉP AS "Tổng tiền".', 'Single-quoted aliases are T-SQL — PostgreSQL: AS total, or double quotes AS "Total".'],
};

/** Câu đã LỖI ở chế độ PostgreSQL: các gợi ý "đây là T-SQL, PostgreSQL viết thế này" (rỗng nếu không thấy). */
export function goiYTsqlChoPg(sql: string): Array<{ ma: string; vi: string; en: string }> {
  const out: Array<{ ma: string; vi: string; en: string }> = [];
  for (const v of kiemPhuongNgu(sql)) {
    if (v.phia !== 'tsql' || !GOI_Y_PG[v.ma]) continue;
    // GENERATED … AS IDENTITY là cú pháp PostgreSQL chuẩn — chỉ nhắc khi thấy IDENTITY( kiểu SQL Server
    if (v.ma === 'tsql-identity' && !/\bIDENTITY\s*\(/i.test(lamSach(sql))) continue;
    out.push({ ma: v.ma, vi: GOI_Y_PG[v.ma][0], en: GOI_Y_PG[v.ma][1] });
  }
  return out;
}

/** Câu điều khiển giao dịch (máy chấm tự bọc mỗi kiểm trong một giao dịch rồi huỷ). */
export function coLenhGiaoDich(sql: string): boolean {
  return tachLenhSql(sql).some((c) => /^\s*(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION|SAVEPOINT|RELEASE|END|ABORT|SET\s+TRANSACTION)\b/i.test(lamSach(c)));
}

// ─── lỗi của PostgreSQL ⇒ lời dễ hiểu ──────────────────────────────────────────────────────────

export interface LoiSql { thongDiep: string; ma?: string | null; viTri?: number | null; goiY?: string | null; chiTiet?: string | null }

/** Vị trí (1-based, như PostgreSQL) ⇒ dòng/cột trong mã người học. */
export function dongCot(sql: string, viTri: number | null | undefined): { dong: number; cot: number } | null {
  if (!viTri || viTri < 1) return null;
  const truoc = String(sql).slice(0, viTri - 1);
  const dong = truoc.split('\n').length;
  return { dong, cot: viTri - truoc.lastIndexOf('\n') - 1 };
}

const GOI_Y_THEO_MA: Record<string, [string, string]> = {
  '42601': ['Lỗi cú pháp: xem từ khoá ngay trước vị trí báo lỗi (thiếu dấu phẩy, ngoặc, FROM, hay dư dấu phẩy cuối danh sách cột?).', 'Syntax error: look just before the reported position (missing comma, bracket, FROM, or a trailing comma?).'],
  '42703': ['Không có cột này. Kiểm tra chính tả, tiền tố bảng (e.empName) và bí danh. Bí danh của SELECT KHÔNG dùng được trong WHERE.', 'No such column. Check spelling, the table prefix (e.empName) and aliases. A SELECT alias cannot be used in WHERE.'],
  '42P01': ['Không có bảng này. Xem lại tên bảng trong lược đồ của đề (vd tblEmployee).', 'No such table. Check the table name in the task schema (e.g. tblEmployee).'],
  '42803': ['Lỗi GROUP BY kinh điển: mọi cột trong SELECT không nằm trong hàm gộp (COUNT/SUM/AVG/MIN/MAX) PHẢI có mặt trong GROUP BY. SQL Server cũng báo đúng lỗi này (Msg 8120).', 'Classic GROUP BY error: every SELECT column that is not inside an aggregate (COUNT/SUM/AVG/MIN/MAX) must be listed in GROUP BY. SQL Server raises the same error (Msg 8120).'],
  '42702': ['Tên cột mơ hồ: cột có ở nhiều bảng trong JOIN. Thêm tiền tố bảng/bí danh: d.depNum.', 'Ambiguous column: it exists in several joined tables. Prefix it with the table alias: d.depNum.'],
  '42883': ['Hàm/toán tử này không tồn tại ở đây. Nếu bạn quen T-SQL: nối chuỗi dùng CONCAT(a, b) (không dùng +), thay ISNULL bằng COALESCE.', 'Function/operator does not exist. Coming from T-SQL? Concatenate with CONCAT(a, b) (not +) and use COALESCE instead of ISNULL.'],
  '42804': ['Sai kiểu dữ liệu giữa hai vế (vd so chuỗi với số, hay UNION hai cột khác kiểu).', 'Data type mismatch (e.g. comparing text with a number, or UNION of columns with different types).'],
  '42P10': ['ORDER BY với DISTINCT/UNION: chỉ sắp theo cột có trong danh sách SELECT.', 'With DISTINCT/UNION you can only ORDER BY columns that appear in the SELECT list.'],
  '21000': ['Truy vấn con trả NHIỀU dòng ở chỗ chỉ nhận MỘT giá trị (sau =, >, <). Dùng IN, hoặc gộp (MAX/MIN) trong truy vấn con.', 'A subquery returned more than one row where one value is expected (after =, >, <). Use IN, or aggregate (MAX/MIN) inside the subquery.'],
  '22012': ['Chia cho 0. Dùng NULLIF(mau, 0) ở mẫu số.', 'Division by zero. Use NULLIF(denominator, 0).'],
  '22P02': ['Giá trị không đổi được sang kiểu của cột (vd chữ vào cột số).', 'A value cannot be converted to the column type (e.g. text into a number column).'],
  '22001': ['Chuỗi dài hơn độ dài cột cho phép (VARCHAR(n)).', 'Value too long for the column (VARCHAR(n)).'],
  '22003': ['Số vượt phạm vi của kiểu cột (DECIMAL(p,s) / INT).', 'Number out of range for the column type.'],
  '22008': ['Ngày không hợp lệ. Viết dạng \'YYYY-MM-DD\'.', 'Invalid date. Use \'YYYY-MM-DD\'.'],
  '23505': ['Trùng khoá chính/UNIQUE: giá trị này đã có trong bảng.', 'Duplicate primary key/UNIQUE value.'],
  '23503': ['Vi phạm khoá ngoại: giá trị không có ở bảng cha, hoặc xoá/sửa hàng cha đang có hàng con tham chiếu. Xoá con trước, hoặc khai ON DELETE CASCADE nếu đề yêu cầu.', 'Foreign key violation: the value is missing in the parent table, or a parent row still has children. Delete children first, or declare ON DELETE CASCADE if the task asks for it.'],
  '23502': ['Cột NOT NULL mà không có giá trị. Ghi đủ cột trong INSERT.', 'A NOT NULL column got no value. List all required columns in INSERT.'],
  '23514': ['Vi phạm ràng buộc CHECK.', 'CHECK constraint violated.'],
  '42P07': ['Bảng/view đã tồn tại (tên trùng với bảng của dữ liệu mẫu?).', 'The table/view already exists (same name as a sample table?).'],
  '42710': ['Tên ràng buộc/đối tượng đã tồn tại — đặt tên khác.', 'That constraint/object name already exists.'],
  '42P16': ['Định nghĩa bảng/view không hợp lệ.', 'Invalid table/view definition.'],
  '42809': ['Sai loại đối tượng (vd ALTER TABLE trên một view).', 'Wrong object type (e.g. ALTER TABLE on a view).'],
  '0A000': ['Tính năng này chưa hỗ trợ ở đây.', 'This feature is not supported here.'],
  '44000': ['Vi phạm WITH CHECK OPTION: hàng sau khi sửa/thêm không còn thoả điều kiện WHERE của view.', 'WITH CHECK OPTION violated: the row would fall outside the view\'s WHERE.'],
};

/** Lời giải thích lỗi PostgreSQL cho người học: [vi, en] — gồm vị trí + gợi ý theo mã SQLSTATE. */
export function moTaLoiSql(sql: string, loi: LoiSql): { vi: string; en: string } {
  const vt = dongCot(sql, loi.viTri);
  const viTriVi = vt ? ` (dòng ${vt.dong}, cột ${vt.cot})` : '';
  const viTriEn = vt ? ` (line ${vt.dong}, col ${vt.cot})` : '';
  const gy = loi.ma ? GOI_Y_THEO_MA[loi.ma] : undefined;
  const sach = lamSach(sql);
  let themVi = '';
  let themEn = '';
  if (loi.ma === '42703' && /"/.test(sach)) {
    themVi = ' Tên trong nháy kép "X" phân biệt HOA/thường ở PostgreSQL — bỏ nháy kép.';
    themEn = ' Names in double quotes are case-sensitive in PostgreSQL — drop the quotes.';
  }
  if (loi.ma === '42601' && /\bAS\s+'/i.test(lamSach(sql, false))) {
    themVi = ' Bí danh không đặt trong nháy đơn: viết AS TongTien.';
    themEn = ' Aliases are not single-quoted: write AS Total.';
  }
  return {
    vi: `Lỗi SQL${viTriVi}: ${loi.thongDiep}${loi.chiTiet ? ` — ${loi.chiTiet}` : ''}${gy && gy[0] ? `\nGợi ý: ${gy[0]}${themVi}` : themVi ? `\nGợi ý:${themVi}` : ''}`,
    en: `SQL error${viTriEn}: ${loi.thongDiep}${gy && gy[1] ? `\nHint: ${gy[1]}${themEn}` : themEn ? `\nHint:${themEn}` : ''}`,
  };
}

// ─── dữ liệu mẫu (của TÁC GIẢ đề) ⇒ PostgreSQL chế độ SQL Server ───────────────────────────────

/**
 * Dữ liệu mẫu tác giả viết theo kiểu SQL Server (như DBscript.sql của đề PE: NVARCHAR, N'…', DATETIME…)
 * ⇒ bản nạp vào PostgreSQL mô phỏng hành vi SQL Server. CHỈ áp cho mã của TÁC GIẢ (csdl/themCsdl) —
 * mã người học không bao giờ bị dịch.
 *   - NVARCHAR(n) / NCHAR(n) / NTEXT ⇒ CITEXT: so sánh, LIKE, DISTINCT, GROUP BY, ORDER BY không phân
 *     biệt hoa thường như collation mặc định của SQL Server. VARCHAR/CHAR GIỮ NGUYÊN (phân biệt hoa thường):
 *     cột mã/khoá (CHAR(8)…) phải cùng kiểu với cột khoá ngoại người học tạo — citext ≠ char thì PostgreSQL từ
 *     chối khoá ngoại. Quy ước soạn dữ liệu mẫu: chữ người đọc (tên, địa chỉ, email…) NVARCHAR, mã/khoá VARCHAR/CHAR;
 *   - PRIMARY KEY ⇒ UNIQUE (+ NOT NULL ở dạng cột): PostgreSQL ngừng nới luật GROUP BY theo khoá chính;
 *   - DATETIME/SMALLDATETIME ⇒ TIMESTAMP · BIT ⇒ SMALLINT · MONEY ⇒ DECIMAL(19,4) · TINYINT ⇒ SMALLINT;
 *   - bỏ dòng GO.
 */
export function csdlChoPg(seed: string): string {
  const s = String(seed ?? '');
  const sach = lamSach(s);
  // đổi theo vị trí trên bản sạch (không chạm chuỗi/chú thích)
  const doi: Array<[number, number, string]> = [];
  const quet = (re: RegExp, thay: (m: RegExpExecArray) => string) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(sach))) doi.push([m.index, m.index + m[0].length, thay(m)]);
  };
  quet(/\b(?:NVARCHAR|NCHAR)\s*\(\s*(?:\d+|MAX)\s*\)|\bNTEXT\b|\bNVARCHAR\b|\bNCHAR\b(?!\s*\()/gi, () => 'CITEXT');
  quet(/\bVARCHAR\s*\(\s*MAX\s*\)/gi, () => 'TEXT');
  quet(/\bPRIMARY\s+KEY\b(\s*\()?/gi, (m) => (m[1] ? `UNIQUE${m[1]}` : 'UNIQUE NOT NULL'));
  quet(/\b(?:SMALL)?DATETIME2?\b/gi, () => 'TIMESTAMP');
  quet(/\b(?:BIT|TINYINT)\b/gi, () => 'SMALLINT');
  quet(/\b(?:SMALL)?MONEY\b/gi, () => 'DECIMAL(19,4)');
  quet(/^\s*GO\s*$/gim, (m) => m[0].replace(/GO/i, '  '));
  doi.sort((a, b) => b[0] - a[0]);
  let out = s;
  let chan = Infinity;
  for (const [a, b, t] of doi) {
    if (b > chan) continue; // chồng nhau — giữ cái đứng sau
    out = out.slice(0, a) + t + out.slice(b);
    chan = a;
  }
  return out;
}

/**
 * PostgreSQL gập tên không nháy về chữ thường (`AS TrackID` ⇒ cột "trackid"); SQL Server hiện đúng chữ đã viết.
 * Lấy lại cách viết GỐC của từng tên cột từ chính mã SQL (chỉ để HIỆN — so sánh tên vốn không phân biệt hoa thường).
 */
export function chuGocCot(sql: string, cot: string[]): string[] {
  const sach = lamSach(sql);
  return cot.map((c) => {
    if (!/^[a-z_][a-z0-9_]*$/.test(c)) return c; // có chữ hoa/ký tự lạ ⇒ đã là tên trong nháy kép, giữ nguyên
    const m = new RegExp(`(?<![A-Za-z0-9_])(${c.replace(/[$]/g, '\\$')})(?![A-Za-z0-9_])`, 'i').exec(sach);
    return m ? m[1] : c;
  });
}
