import type { MssqlRow } from './types';

/**
 * Bảng tra cứu SQL Server → PostgreSQL.
 *
 * Sắp theo THỨ TỰ NGƯỜI TA GẶP khi chuyển từ trường ra làm web, không sắp theo
 * bảng chữ cái: kiểu dữ liệu trước (gặp ngay lúc tạo bảng), rồi phân trang và
 * chuỗi (gặp ngay ngày đầu viết query), cuối cùng mới tới quản trị.
 *
 * Mỗi dòng là một thứ đã thực sự làm ai đó vấp — không liệt kê cho đủ số.
 */
export const MSSQL_ROWS: MssqlRow[] = [
  // ── Kiểu dữ liệu ────────────────────────────────────────────────
  { group: 'Kiểu dữ liệu', topic: 'Văn bản dài, có tiếng Việt', ms: 'NVARCHAR(MAX)', pg: 'text', note: 'Postgres đã UTF-8 toàn bộ, không cần tiền tố N\'…\'' },
  { group: 'Kiểu dữ liệu', topic: 'Văn bản giới hạn độ dài', ms: 'NVARCHAR(100)', pg: 'varchar(100)', note: 'Trong Postgres, text và varchar nhanh như nhau — chỉ giới hạn khi là luật nghiệp vụ thật' },
  { group: 'Kiểu dữ liệu', topic: 'Văn bản ASCII', ms: 'VARCHAR(100)', pg: 'varchar(100)', note: 'Bên SQL Server VARCHAR không lưu được tiếng Việt có dấu đầy đủ; bên Postgres thì được' },
  { group: 'Kiểu dữ liệu', topic: 'Số nguyên', ms: 'INT', pg: 'integer / int4', note: '' },
  { group: 'Kiểu dữ liệu', topic: 'Số nguyên lớn', ms: 'BIGINT', pg: 'bigint / int8', note: 'Nên dùng cho khoá chính ngay từ đầu' },
  { group: 'Kiểu dữ liệu', topic: 'Số nguyên nhỏ', ms: 'TINYINT (0–255)', pg: 'smallint (−32768…32767)', note: 'Postgres KHÔNG có kiểu 1 byte — tinyint không tồn tại' },
  { group: 'Kiểu dữ liệu', topic: 'Tiền', ms: 'DECIMAL(12,2) / MONEY', pg: 'numeric(12,2)', note: 'Tránh kiểu money của cả hai hệ; numeric/decimal mới đúng' },
  { group: 'Kiểu dữ liệu', topic: 'Số thực', ms: 'FLOAT / REAL', pg: 'double precision / real', note: 'Không dùng cho tiền' },
  { group: 'Kiểu dữ liệu', topic: 'Đúng/sai', ms: 'BIT (0/1)', pg: 'boolean (true/false)', note: 'Postgres có kiểu boolean thật; SQL Server phải dùng BIT' },
  { group: 'Kiểu dữ liệu', topic: 'Thời điểm không múi giờ', ms: 'DATETIME2', pg: 'timestamp', note: '' },
  { group: 'Kiểu dữ liệu', topic: 'Thời điểm CÓ múi giờ', ms: 'DATETIMEOFFSET', pg: 'timestamptz', note: 'Luôn dùng cái này cho mốc thời gian thật' },
  { group: 'Kiểu dữ liệu', topic: 'Chỉ ngày', ms: 'DATE', pg: 'date', note: '' },
  { group: 'Kiểu dữ liệu', topic: 'Khoảng thời lượng', ms: '(không có)', pg: 'interval', note: "Postgres tính được: now() - interval '7 days'" },
  { group: 'Kiểu dữ liệu', topic: 'GUID / UUID', ms: 'UNIQUEIDENTIFIER', pg: 'uuid', note: 'Postgres cần extension pgcrypto để sinh: gen_random_uuid()' },
  { group: 'Kiểu dữ liệu', topic: 'Dữ liệu nhị phân', ms: 'VARBINARY(MAX)', pg: 'bytea', note: '' },
  { group: 'Kiểu dữ liệu', topic: 'JSON', ms: 'NVARCHAR(MAX) + JSON_VALUE()', pg: 'jsonb', note: 'Postgres có kiểu JSON thật, đánh index GIN được — SQL Server chỉ lưu chuỗi' },
  { group: 'Kiểu dữ liệu', topic: 'Mảng', ms: '(không có)', pg: 'integer[] / text[]', note: 'Đặc sản Postgres' },
  { group: 'Kiểu dữ liệu', topic: 'Danh sách giá trị cố định', ms: 'CHECK constraint / bảng tra', pg: 'CREATE TYPE … AS ENUM', note: 'Postgres có enum thật, nhưng thêm giá trị mới khá phiền' },
  { group: 'Kiểu dữ liệu', topic: 'Khoảng số/ngày', ms: '(không có)', pg: 'int4range / daterange / tstzrange', note: 'Chống trùng lịch bằng ràng buộc EXCLUDE' },

  // ── Khoá & tự tăng ───────────────────────────────────────────────
  { group: 'Khoá & tự tăng', topic: 'Cột tự tăng (nên dùng)', ms: 'id INT IDENTITY(1,1)', pg: 'id bigint GENERATED ALWAYS AS IDENTITY', note: 'Cú pháp chuẩn ANSI, Postgres 10+' },
  { group: 'Khoá & tự tăng', topic: 'Cột tự tăng (kiểu cũ)', ms: 'IDENTITY(1,1)', pg: 'id bigserial', note: 'serial/bigserial là cách cũ, vẫn chạy nhưng không còn được khuyến nghị' },
  { group: 'Khoá & tự tăng', topic: 'Lấy id vừa sinh', ms: 'SCOPE_IDENTITY() hoặc OUTPUT INSERTED.id', pg: 'INSERT … RETURNING id', note: 'RETURNING của Postgres gọn hơn nhiều' },
  { group: 'Khoá & tự tăng', topic: 'Sinh UUID', ms: 'NEWID() / NEWSEQUENTIALID()', pg: 'gen_random_uuid()', note: 'Postgres 13+ có sẵn, cũ hơn thì cần pgcrypto' },
  { group: 'Khoá & tự tăng', topic: 'Đặt lại bộ đếm', ms: 'DBCC CHECKIDENT', pg: "ALTER SEQUENCE … RESTART WITH 1", note: '' },

  // ── Phân trang & giới hạn ────────────────────────────────────────
  { group: 'Phân trang', topic: 'Lấy N dòng đầu', ms: 'SELECT TOP 10 …', pg: 'SELECT … LIMIT 10', note: 'LIMIT luôn đứng CUỐI câu' },
  { group: 'Phân trang', topic: 'Phân trang', ms: 'ORDER BY id OFFSET 40 ROWS FETCH NEXT 20 ROWS ONLY', pg: 'ORDER BY id LIMIT 20 OFFSET 40', note: 'Postgres cũng hiểu cú pháp OFFSET…FETCH' },
  { group: 'Phân trang', topic: 'Lấy N phần trăm', ms: 'SELECT TOP 10 PERCENT …', pg: '(không có, phải tự tính)', note: '' },
  { group: 'Phân trang', topic: 'Mỗi nhóm một dòng', ms: 'ROW_NUMBER() OVER (PARTITION BY …) = 1', pg: 'DISTINCT ON (cột)', note: 'DISTINCT ON gọn hơn hẳn, là đặc sản Postgres' },

  // ── Chuỗi ────────────────────────────────────────────────────────
  { group: 'Chuỗi', topic: 'Nối chuỗi', ms: "a + b  hoặc  CONCAT(a, b)", pg: "a || b  hoặc  CONCAT(a, b)", note: 'Dấu + KHÔNG nối chuỗi trong Postgres' },
  { group: 'Chuỗi', topic: 'Độ dài', ms: 'LEN(s)', pg: 'length(s)', note: 'LEN của SQL Server bỏ khoảng trắng cuối, length thì không' },
  { group: 'Chuỗi', topic: 'Cắt chuỗi', ms: 'SUBSTRING(s, 1, 5)', pg: 'substring(s from 1 for 5) hoặc substr(s,1,5)', note: '' },
  { group: 'Chuỗi', topic: 'Lấy từ trái/phải', ms: 'LEFT(s, 3) / RIGHT(s, 3)', pg: 'left(s, 3) / right(s, 3)', note: '' },
  { group: 'Chuỗi', topic: 'Thay thế', ms: 'REPLACE(s, a, b)', pg: 'replace(s, a, b)', note: '' },
  { group: 'Chuỗi', topic: 'Hoa/thường', ms: 'UPPER(s) / LOWER(s)', pg: 'upper(s) / lower(s)', note: '' },
  { group: 'Chuỗi', topic: 'Cắt khoảng trắng', ms: 'LTRIM(RTRIM(s)) hoặc TRIM(s)', pg: 'trim(s)', note: '' },
  { group: 'Chuỗi', topic: 'Tìm vị trí', ms: 'CHARINDEX(tim, trong)', pg: 'position(tim in trong) hoặc strpos(trong, tim)', note: 'Thứ tự tham số NGƯỢC nhau — rất dễ nhầm' },
  { group: 'Chuỗi', topic: 'So khớp không phân biệt hoa thường', ms: "LIKE '%x%'  (mặc định đã không phân biệt)", pg: "ILIKE '%x%'", note: 'Postgres PHÂN BIỆT hoa thường — khác biệt gây vấp nhiều nhất' },
  { group: 'Chuỗi', topic: 'Lớp ký tự trong LIKE', ms: "LIKE '[abc]%'", pg: "~ '^[abc]'  (biểu thức chính quy)", note: 'Postgres không hỗ trợ [] trong LIKE' },
  { group: 'Chuỗi', topic: 'Biểu thức chính quy', ms: '(rất hạn chế)', pg: "~ , ~* , regexp_replace(), regexp_matches()", note: 'Postgres mạnh hơn hẳn' },
  { group: 'Chuỗi', topic: 'Gom nhiều dòng thành chuỗi', ms: "STRING_AGG(s, ',') WITHIN GROUP (ORDER BY s)", pg: "string_agg(s, ',' ORDER BY s)", note: 'Vị trí ORDER BY khác nhau' },
  { group: 'Chuỗi', topic: 'Tách chuỗi thành dòng', ms: 'STRING_SPLIT(s, \',\')', pg: "unnest(string_to_array(s, ','))", note: '' },
  { group: 'Chuỗi', topic: 'Bỏ dấu tiếng Việt', ms: 'COLLATE Latin1_General_CI_AI', pg: 'unaccent(s)  — cần extension unaccent', note: '' },

  // ── Ngày giờ ─────────────────────────────────────────────────────
  { group: 'Ngày giờ', topic: 'Thời điểm hiện tại', ms: 'GETDATE() / SYSDATETIME()', pg: 'now() / current_timestamp', note: '' },
  { group: 'Ngày giờ', topic: 'Hôm nay (chỉ ngày)', ms: 'CAST(GETDATE() AS DATE)', pg: 'current_date', note: '' },
  { group: 'Ngày giờ', topic: 'Cộng ngày', ms: 'DATEADD(day, 7, d)', pg: "d + interval '7 days'", note: 'Postgres cộng trực tiếp bằng interval, dễ đọc hơn' },
  { group: 'Ngày giờ', topic: 'Hiệu hai ngày', ms: 'DATEDIFF(day, a, b)', pg: '(b::date - a::date)  → ra số nguyên ngày', note: 'Trừ hai timestamp thì ra interval' },
  { group: 'Ngày giờ', topic: 'Lấy năm/tháng', ms: 'YEAR(d) / MONTH(d)', pg: "extract(year from d) / date_part('month', d)", note: '' },
  { group: 'Ngày giờ', topic: 'Làm tròn về đầu tháng', ms: 'DATEFROMPARTS(YEAR(d), MONTH(d), 1)', pg: "date_trunc('month', d)", note: 'date_trunc gọn hơn nhiều, dùng rất nhiều khi làm báo cáo' },
  { group: 'Ngày giờ', topic: 'Định dạng ngày', ms: 'FORMAT(d, \'dd/MM/yyyy\')', pg: "to_char(d, 'DD/MM/YYYY')", note: 'Ký tự định dạng khác nhau: MM là tháng ở cả hai, nhưng mm của Postgres là phút' },
  { group: 'Ngày giờ', topic: 'Đổi múi giờ', ms: 'AT TIME ZONE \'SE Asia Standard Time\'', pg: "d AT TIME ZONE 'Asia/Ho_Chi_Minh'", note: 'Postgres dùng tên IANA' },

  // ── NULL & điều kiện ─────────────────────────────────────────────
  { group: 'NULL & điều kiện', topic: 'Thay NULL', ms: 'ISNULL(a, b)', pg: 'COALESCE(a, b)', note: 'COALESCE có ở cả hai và nhận nhiều tham số — nên dùng' },
  { group: 'NULL & điều kiện', topic: 'Bằng nhau thì NULL', ms: 'NULLIF(a, b)', pg: 'NULLIF(a, b)', note: 'Giống nhau' },
  { group: 'NULL & điều kiện', topic: 'Rẽ nhánh', ms: 'CASE WHEN … THEN … END', pg: 'CASE WHEN … THEN … END', note: 'Giống nhau' },
  { group: 'NULL & điều kiện', topic: 'Rẽ nhánh ngắn', ms: 'IIF(dk, a, b)', pg: '(không có) → dùng CASE', note: '' },
  { group: 'NULL & điều kiện', topic: 'NULL khi sắp xếp', ms: 'NULL được coi là NHỎ NHẤT', pg: 'NULL được coi là LỚN NHẤT', note: 'Nói rõ bằng NULLS FIRST / NULLS LAST' },
  { group: 'NULL & điều kiện', topic: 'Đếm có điều kiện', ms: 'COUNT(CASE WHEN … THEN 1 END)', pg: 'COUNT(*) FILTER (WHERE …)', note: 'Cú pháp CASE cũng chạy trên Postgres' },

  // ── Ép kiểu ──────────────────────────────────────────────────────
  { group: 'Ép kiểu', topic: 'Ép kiểu', ms: 'CAST(x AS INT) / CONVERT(INT, x)', pg: 'x::integer  hoặc  CAST(x AS integer)', note: 'Cú pháp :: là lối viết tắt riêng của Postgres' },
  { group: 'Ép kiểu', topic: 'Chia số nguyên', ms: '5 / 2 = 2', pg: '5 / 2 = 2', note: 'Cả hai đều cắt phần thập phân — nhớ ép kiểu: 5::numeric / 2' },
  { group: 'Ép kiểu', topic: 'Làm tròn', ms: 'ROUND(x, 2)', pg: 'round(x::numeric, 2)', note: 'Postgres cần numeric mới nhận tham số số chữ số' },

  // ── Định danh & cú pháp ──────────────────────────────────────────
  { group: 'Định danh', topic: 'Bọc tên có dấu cách', ms: '[Tên Cột]', pg: '"Tên Cột"', note: 'Postgres dùng nháy KÉP; ngoặc vuông không có nghĩa đó' },
  { group: 'Định danh', topic: 'Chuỗi văn bản', ms: "'chuỗi' hoặc N'chuỗi'", pg: "'chuỗi'", note: 'Nháy ĐƠN. Nhầm nháy đơn/kép là lỗi cú pháp phổ biến nhất' },
  { group: 'Định danh', topic: 'Chữ hoa trong tên', ms: 'Giữ nguyên như bạn gõ', pg: 'Tự hạ thành chữ thường nếu không bọc nháy kép', note: 'Cứ đặt tên snake_case là hết rắc rối' },
  { group: 'Định danh', topic: 'Phân biệt hoa thường khi so chuỗi', ms: 'Mặc định KHÔNG phân biệt', pg: 'CÓ phân biệt', note: 'Khác biệt lớn nhất về hành vi giữa hai hệ' },
  { group: 'Định danh', topic: 'Ghi chú', ms: '-- một dòng   /* nhiều dòng */', pg: '-- một dòng   /* nhiều dòng */', note: 'Giống nhau' },
  { group: 'Định danh', topic: 'Kết thúc lô lệnh', ms: 'GO', pg: '(không có, chỉ dùng ;)', note: 'GO là của công cụ SSMS, không phải của T-SQL' },
  { group: 'Định danh', topic: 'Truy vấn không cần bảng', ms: 'SELECT 1 + 1', pg: 'SELECT 1 + 1', note: 'Oracle mới cần FROM DUAL' },

  // ── Thêm/sửa/xoá ─────────────────────────────────────────────────
  { group: 'Thêm/sửa/xoá', topic: 'Upsert', ms: 'MERGE INTO … WHEN MATCHED …', pg: 'INSERT … ON CONFLICT (cột) DO UPDATE SET …', note: 'ON CONFLICT đơn giản và an toàn hơn MERGE' },
  { group: 'Thêm/sửa/xoá', topic: 'Lấy lại dòng vừa ghi', ms: 'OUTPUT INSERTED.* / DELETED.*', pg: 'RETURNING *', note: '' },
  { group: 'Thêm/sửa/xoá', topic: 'UPDATE kèm JOIN', ms: 'UPDATE t SET … FROM t JOIN u ON …', pg: 'UPDATE t SET … FROM u WHERE t.id = u.id', note: 'Postgres KHÔNG lặp lại tên bảng đích trong FROM' },
  { group: 'Thêm/sửa/xoá', topic: 'Xoá sạch bảng', ms: 'TRUNCATE TABLE t', pg: 'TRUNCATE t', note: 'Cả hai đều hoàn tác được nếu nằm trong transaction' },
  { group: 'Thêm/sửa/xoá', topic: 'Chép bảng sang bảng mới', ms: 'SELECT … INTO moi FROM cu', pg: 'CREATE TABLE moi AS SELECT … FROM cu', note: 'Cú pháp SELECT INTO của Postgres có nghĩa khác (dùng trong PL/pgSQL)' },

  // ── Transaction & khoá ───────────────────────────────────────────
  { group: 'Transaction', topic: 'Bắt đầu', ms: 'BEGIN TRANSACTION', pg: 'BEGIN', note: '' },
  { group: 'Transaction', topic: 'Mức cô lập mặc định', ms: 'READ COMMITTED (có khoá đọc)', pg: 'READ COMMITTED (MVCC, đọc không khoá)', note: 'Cùng tên nhưng cơ chế khác hẳn — Postgres đọc không bao giờ chặn ghi' },
  { group: 'Transaction', topic: 'Đọc bỏ qua khoá', ms: 'WITH (NOLOCK)', pg: '(không cần, và không có)', note: 'Postgres không cần vì đọc vốn đã không bị chặn' },
  { group: 'Transaction', topic: 'Khoá dòng để sửa', ms: 'WITH (UPDLOCK, ROWLOCK)', pg: 'SELECT … FOR UPDATE', note: '' },
  { group: 'Transaction', topic: 'DDL trong transaction', ms: 'Được', pg: 'Được', note: 'MySQL thì không — đây là điểm cộng của cả hai' },

  // ── Quản trị ─────────────────────────────────────────────────────
  { group: 'Quản trị', topic: 'Liệt kê bảng', ms: 'SELECT * FROM sys.tables', pg: '\\dt  (trong psql) hoặc information_schema.tables', note: '' },
  { group: 'Quản trị', topic: 'Xem cấu trúc bảng', ms: 'sp_help \'products\'', pg: '\\d products  (trong psql)', note: '' },
  { group: 'Quản trị', topic: 'Xem kế hoạch truy vấn', ms: 'SET SHOWPLAN_ALL ON / Ctrl+M trong SSMS', pg: 'EXPLAIN (ANALYZE, BUFFERS) SELECT …', note: 'EXPLAIN của Postgres đọc bằng chữ, không cần công cụ đồ hoạ' },
  { group: 'Quản trị', topic: 'Cập nhật thống kê', ms: 'UPDATE STATISTICS', pg: 'ANALYZE', note: '' },
  { group: 'Quản trị', topic: 'Dọn dẹp không gian', ms: '(tự động)', pg: 'VACUUM / autovacuum', note: 'Khái niệm Postgres-riêng, sinh ra từ cơ chế MVCC' },
  { group: 'Quản trị', topic: 'Xem phiên đang chạy', ms: 'sp_who2 / sys.dm_exec_requests', pg: 'SELECT * FROM pg_stat_activity', note: '' },
  { group: 'Quản trị', topic: 'Câu query ngốn nhất', ms: 'Query Store', pg: 'pg_stat_statements  (extension)', note: '' },
  { group: 'Quản trị', topic: 'Sao lưu', ms: 'BACKUP DATABASE …', pg: 'pg_dump / pg_basebackup', note: 'Chạy từ dòng lệnh, không phải câu SQL' },
  { group: 'Quản trị', topic: 'Gộp nhóm bảng theo tên', ms: 'Schema (dbo, sales…)', pg: 'Schema (public, sales…)', note: 'Khái niệm giống nhau; Postgres mặc định là public' },
  { group: 'Quản trị', topic: 'Nhiều database trong một kết nối', ms: 'Được — USE database', pg: 'KHÔNG — mỗi kết nối một database', note: 'Muốn nối database khác phải mở kết nối mới, hoặc dùng dblink/postgres_fdw' },
];

/** Các nhóm theo đúng thứ tự xuất hiện — dùng làm bộ lọc trên giao diện. */
export const MSSQL_GROUPS: string[] = Array.from(new Set(MSSQL_ROWS.map((r) => r.group)));
