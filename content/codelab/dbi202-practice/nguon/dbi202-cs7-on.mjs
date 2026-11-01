/**
 * DBI202 · ⭐ CS.7 — bài tập bảo mật & vận hành trên SQL Server thật: vá SQL injection trong thủ tục tìm kiếm, tài khoản báo cáo
 * quyền tối thiểu (role + GRANT, thử bằng EXECUTE AS), Row-Level Security nhiều công ty theo SESSION_CONTEXT, phân vùng theo tháng
 * và xoá tháng cũ bằng TRUNCATE … WITH (PARTITIONS); cộng một bộ câu về băm mật khẩu.
 */
import { mod, cs, q, tsql, ck, tn } from './_chung.mjs';

const SP = `CREATE TABLE dbo.SanPham (id INT NOT NULL PRIMARY KEY, ten NVARCHAR(50) NOT NULL, gia DECIMAL(12,0) NOT NULL);
INSERT INTO dbo.SanPham VALUES (1, N'Bút bi', 5000), (2, N'Vở kẻ ngang', 12000), (3, N'Thước kẻ', 8000);`;
const VUNG = `CREATE OR ALTER PROCEDURE dbo.prTimSanPham @tuKhoa NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    -- VULNERABLE: the user's text becomes part of the SQL code
    DECLARE @sql NVARCHAR(MAX) = N'SELECT id, ten, gia FROM dbo.SanPham WHERE ten LIKE N''%' + @tuKhoa + N'%''';
    EXEC (@sql);
END`;
const GIAI_INJ = `CREATE OR ALTER PROCEDURE dbo.prTimSanPham @tuKhoa NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    -- SAFE: @tuKhoa is only ever a VALUE, never part of the SQL text
    SELECT id, ten, gia
    FROM dbo.SanPham
    WHERE ten LIKE N'%' + @tuKhoa + N'%';
END`;
const TIM = (tu) => `DECLARE @r TABLE (id INT, ten NVARCHAR(50), gia DECIMAL(12,0)); DECLARE @e INT = 0;
BEGIN TRY INSERT INTO @r EXEC dbo.prTimSanPham ${tu}; END TRY BEGIN CATCH SET @e = ERROR_NUMBER(); END CATCH;`;

const BC = `CREATE TABLE dbo.KhachHang (id INT NOT NULL PRIMARY KEY, ten NVARCHAR(50) NOT NULL);
CREATE TABLE dbo.DonHang (id INT NOT NULL PRIMARY KEY, khachHangId INT NOT NULL REFERENCES dbo.KhachHang (id), tongTien DECIMAL(12,0) NOT NULL);
CREATE TABLE dbo.NhanVien (id INT NOT NULL PRIMARY KEY, ten NVARCHAR(50) NOT NULL, luong DECIMAL(12,0) NOT NULL);
INSERT INTO dbo.KhachHang VALUES (1, N'An'), (2, N'Bình');
INSERT INTO dbo.DonHang VALUES (1, 1, 150000), (2, 2, 90000), (3, 1, 40000);
INSERT INTO dbo.NhanVien VALUES (1, N'Quang', 30000000), (2, N'Hà', 18000000);`;
const GIAI_BC = `CREATE ROLE rBaoCao;                                    -- permissions go to a ROLE, people join the role
GRANT SELECT ON dbo.DonHang   TO rBaoCao;
GRANT SELECT ON dbo.KhachHang TO rBaoCao;
GO
CREATE USER report_user WITHOUT LOGIN;                   -- a database user (a real setup maps it to a login)
ALTER ROLE rBaoCao ADD MEMBER report_user;`;
const LA = (lenh) => `DECLARE @e INT = 0;
BEGIN TRY
    EXECUTE AS USER = N'report_user';
    ${lenh}
    REVERT;
END TRY
BEGIN CATCH
    SET @e = ERROR_NUMBER();
    IF USER_NAME() = N'report_user' REVERT;
END CATCH;`;

const VE = `CREATE TABLE dbo.Ve (id INT NOT NULL PRIMARY KEY, congTyId INT NOT NULL, tieuDe NVARCHAR(100) NOT NULL);
INSERT INTO dbo.Ve VALUES (1, 1, N'Lỗi đăng nhập'), (2, 1, N'Đổi mật khẩu'), (3, 2, N'Hoá đơn sai'), (4, 2, N'Xuất báo cáo'), (5, 2, N'Thêm người dùng'), (6, 3, N'Hỏi giá');`;
const GIAI_RLS = `CREATE FUNCTION dbo.fnRlsCongTy (@congTyId INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS duoc
       WHERE @congTyId = CAST(SESSION_CONTEXT(N'congTyId') AS INT);   -- set by the app right after login
GO
CREATE SECURITY POLICY dbo.spVeTheoCongTy
    ADD FILTER PREDICATE dbo.fnRlsCongTy(congTyId) ON dbo.Ve,                 -- hides other companies' rows
    ADD BLOCK  PREDICATE dbo.fnRlsCongTy(congTyId) ON dbo.Ve AFTER INSERT     -- cannot write into another company
    WITH (STATE = ON);`;
const NGU_CANH = (v) => `EXEC sp_set_session_context @key = N'congTyId', @value = ${v};`;

const NGUON_DP = `CREATE TABLE dbo.DatPhongNguon (id INT NOT NULL PRIMARY KEY, ngay DATE NOT NULL, phong VARCHAR(10) NOT NULL);
INSERT INTO dbo.DatPhongNguon VALUES
  (1, '2026-01-05', 'P101'), (2, '2026-01-20', 'P102'),
  (3, '2026-02-01', 'P101'), (4, '2026-02-14', 'P103'), (5, '2026-02-28', 'P101'),
  (6, '2026-03-10', 'P102'), (7, '2026-03-31', 'P103'),
  (8, '2026-04-02', 'P101');`;
const GIAI_PV = `CREATE PARTITION FUNCTION pfThang (DATE)
    AS RANGE RIGHT FOR VALUES ('2026-02-01', '2026-03-01', '2026-04-01');   -- 4 partitions: <Feb | Feb | Mar | >=Apr
CREATE PARTITION SCHEME psThang AS PARTITION pfThang ALL TO ([PRIMARY]);
GO
CREATE TABLE dbo.datphong (
    id    INT         NOT NULL,
    ngay  DATE        NOT NULL,
    phong VARCHAR(10) NOT NULL,
    CONSTRAINT pk_datphong PRIMARY KEY (ngay, id)        -- the partitioning column must be part of the clustered key
) ON psThang (ngay);
GO
INSERT INTO dbo.datphong (id, ngay, phong) SELECT id, ngay, phong FROM dbo.DatPhongNguon;
GO
TRUNCATE TABLE dbo.datphong WITH (PARTITIONS (1));       -- purge January: a metadata operation, not 1 log record per row`;

export default mod('dbi202-cs7-on', '⭐ CS.7 Exercises: database security & operations', [
  tsql({
    t: 'Exercise 1 — fix the SQL injection in a product search', k: 'MEDIUM', p: 15,
    kn: ['SQL injection', 'dynamic SQL', 'parameters'], tag: ['advanced', 'security', 'injection'],
    lyDo: ['The vulnerable code is T-SQL dynamic SQL (EXEC of a concatenated string) inside a procedure; the attack and the fix only make sense on a real SQL Server.', 'Mã có lỗ hổng là SQL động T-SQL (EXEC một chuỗi ghép) trong procedure; tấn công và cách vá chỉ có nghĩa trên SQL Server thật.'],
    en: `<p>The search procedure in solution.sql glues the user's text into SQL code. Try it: <code>EXEC dbo.prTimSanPham N'x%'' UNION SELECT id, ten, 1 FROM dbo.SanPham --'</code> shows every product at price 1. Rewrite <code>dbo.prTimSanPham @tuKhoa</code> so that the keyword is only ever a <b>value</b>: normal searches work, the payload returns nothing and raises no error, and <code>'; DROP TABLE …</code> does nothing.</p>`,
    vi: `<p>Thủ tục tìm kiếm trong solution.sql ghép chữ người dùng gõ vào mã SQL. Thử xem: <code>EXEC dbo.prTimSanPham N'x%'' UNION SELECT id, ten, 1 FROM dbo.SanPham --'</code> hiện mọi sản phẩm với giá 1. Viết lại <code>dbo.prTimSanPham @tuKhoa</code> để từ khoá chỉ là <b>giá trị</b>: tìm bình thường vẫn chạy, payload không trả gì và không báo lỗi, còn <code>'; DROP TABLE …</code> không làm gì cả.</p>`,
    yc: [['Simplest fix: no dynamic SQL at all — WHERE ten LIKE N\'%\' + @tuKhoa + N\'%\'.', 'Cách vá đơn giản nhất: bỏ hẳn SQL động — WHERE ten LIKE N\'%\' + @tuKhoa + N\'%\'.'], ['If SQL must be dynamic: sp_executesql with a parameter (@p), never string concatenation.', 'Nếu bắt buộc SQL động: sp_executesql với tham số (@p), không bao giờ ghép chuỗi.']],
    setup: SP,
    khoi: VUNG,
    giai: GIAI_INJ,
    kiem: [
      ck(['A normal search for "kẻ" finds the two rulers/notebooks', 'Tìm bình thường "kẻ" ra hai sản phẩm'], `${TIM("N'kẻ'")}
SET @ok = IIF(@e = 0 AND (SELECT COUNT(*) FROM @r) = 2 AND NOT EXISTS (SELECT 1 FROM @r WHERE id = 1), 1, 0);
SET @info = CONCAT(N'rows = ', (SELECT COUNT(*) FROM @r), N', error = ', @e);`),
      ck(['The UNION payload returns nothing and raises no error', 'Payload UNION không trả gì và không báo lỗi'], `${TIM("N'x%'' UNION SELECT id, ten, 1 FROM dbo.SanPham --'")}
SET @ok = IIF(@e = 0 AND (SELECT COUNT(*) FROM @r) = 0, 1, 0);
SET @info = CONCAT(N'rows = ', (SELECT COUNT(*) FROM @r), N' (fake prices: ', (SELECT COUNT(*) FROM @r WHERE gia = 1), N'), error = ', @e);`),
      ck(['A DROP TABLE payload does nothing', 'Payload DROP TABLE không làm gì'], `DECLARE @t TABLE (x INT); BEGIN TRAN;
${TIM("N'''; DROP TABLE dbo.SanPham; --'")}
SET @ok = IIF(OBJECT_ID(N'dbo.SanPham') IS NOT NULL, 1, 0);
SET @info = IIF(@ok = 1, N'table still there', N'dbo.SanPham was dropped!');
IF @@TRANCOUNT > 0 ROLLBACK;`),
      ck(['A product name with an apostrophe can be searched', 'Tìm được tên có dấu nháy đơn'], `BEGIN TRAN; INSERT INTO dbo.SanPham VALUES (4, N'Bút O''Neil', 9000);
${TIM("N'O''Neil'")}
SET @ok = IIF(@e = 0 AND (SELECT COUNT(*) FROM @r) = 1, 1, 0);
SET @info = CONCAT(N'rows = ', (SELECT COUNT(*) FROM @r), N', error = ', @e);
IF @@TRANCOUNT > 0 ROLLBACK;`),
    ],
    saiTay: [
      GIAI_INJ.replace(`    SELECT id, ten, gia
    FROM dbo.SanPham
    WHERE ten LIKE N'%' + @tuKhoa + N'%';`, `    DECLARE @sql NVARCHAR(MAX) = N'SELECT id, ten, gia FROM dbo.SanPham WHERE ten LIKE N''%' + @tuKhoa + N'%''';
    EXEC sp_executesql @sql;`),
      GIAI_INJ.replace(`    SELECT id, ten, gia
    FROM dbo.SanPham
    WHERE ten LIKE N'%' + @tuKhoa + N'%';`, `    DECLARE @sql NVARCHAR(MAX) = N'SELECT id, ten, gia FROM dbo.SanPham WHERE ten LIKE N''%' + REPLACE(@tuKhoa, N'UNION', N'') + N'%''';
    EXEC (@sql);`),
    ],
    gy: [['The attack works because the quote in the input ends the string literal and the rest is read as SQL.', 'Tấn công chạy được vì dấu nháy trong dữ liệu kết thúc chuỗi và phần còn lại bị đọc thành SQL.'], ['A parameter is never parsed as code, whatever it contains.', 'Tham số không bao giờ bị phân tích thành mã, dù chứa gì.']],
    lhg: [['Switching to sp_executesql but still concatenating — the injection is identical.', 'Chuyển sang sp_executesql nhưng vẫn ghép chuỗi — lỗ hổng y nguyên.'], ['Blacklisting words such as UNION — attackers have endless variants; the apostrophe test also breaks real names.', 'Chặn từ như UNION — kẻ tấn công có vô số biến thể; phép thử dấu nháy còn làm hỏng tên thật.']],
    gt: ['<p>Correct dynamic version, when the SQL text really must be built (e.g. a column chosen from a whitelist): <code>EXEC sp_executesql N\'SELECT id, ten, gia FROM dbo.SanPham WHERE ten LIKE @p\', N\'@p NVARCHAR(102)\', @p = CONCAT(N\'%\', @tuKhoa, N\'%\');</code>. In application code the same rule applies: prepared statements / parameters (Prisma, JDBC PreparedStatement), never template strings.</p>', '<p>Bản động đúng, khi thật sự phải dựng chuỗi SQL (vd cột chọn từ danh sách trắng): <code>EXEC sp_executesql N\'SELECT id, ten, gia FROM dbo.SanPham WHERE ten LIKE @p\', N\'@p NVARCHAR(102)\', @p = CONCAT(N\'%\', @tuKhoa, N\'%\');</code>. Trong mã ứng dụng cùng luật: prepared statement / tham số (Prisma, JDBC PreparedStatement), không bao giờ chuỗi mẫu.</p>'],
    tn: [tn('SQL injection', 'tiêm SQL'), tn('parameterized query', 'truy vấn tham số hoá')],
  }),
  tsql({
    t: 'Exercise 2 — a least-privilege account for the revenue report', k: 'MEDIUM', p: 12,
    kn: ['CREATE ROLE', 'GRANT', 'least privilege', 'EXECUTE AS'], tag: ['advanced', 'security', 'permissions'],
    lyDo: ['Users, roles, GRANT and EXECUTE AS are SQL Server security objects; the browser grader has a single all-powerful user.', 'User, role, GRANT và EXECUTE AS là đối tượng bảo mật của SQL Server; máy chấm trình duyệt chỉ có một người dùng toàn quyền.'],
    en: '<p>A revenue report only needs to READ <code>DonHang</code> and <code>KhachHang</code>. <code>NhanVien</code> (salaries) must stay off-limits, and the report must not change anything. Create the role <code>rBaoCao</code> with exactly those permissions, and the user <code>report_user</code> (<code>WITHOUT LOGIN</code>, so the exercise works on any server) as its only member. check.sql impersonates the user with <code>EXECUTE AS USER</code>.</p>',
    vi: '<p>Báo cáo doanh thu chỉ cần ĐỌC <code>DonHang</code> và <code>KhachHang</code>. <code>NhanVien</code> (lương) phải ngoài tầm, và báo cáo không được sửa gì. Tạo role <code>rBaoCao</code> với đúng các quyền đó, và user <code>report_user</code> (<code>WITHOUT LOGIN</code> để bài chạy trên mọi server) là thành viên duy nhất của nó. check.sql đóng vai user bằng <code>EXECUTE AS USER</code>.</p>',
    yc: [['GRANT to the role, not to the user; add the user to the role with ALTER ROLE … ADD MEMBER.', 'GRANT cho role, không cho user; thêm user vào role bằng ALTER ROLE … ADD MEMBER.'], ['Do NOT use db_datareader: it can read every table, salaries included.', 'KHÔNG dùng db_datareader: nó đọc được mọi bảng, kể cả lương.']],
    setup: BC,
    khoi: `-- CREATE ROLE rBaoCao; GRANT ... TO rBaoCao;
-- CREATE USER report_user WITHOUT LOGIN; ALTER ROLE rBaoCao ADD MEMBER report_user;`,
    giai: GIAI_BC,
    kiem: [
      ck(['report_user can read DonHang joined with KhachHang', 'report_user đọc được DonHang nối KhachHang'], `${LA('DECLARE @n INT = (SELECT COUNT(*) FROM dbo.DonHang d JOIN dbo.KhachHang k ON k.id = d.khachHangId);')}
SET @ok = IIF(@e = 0 AND USER_ID(N'report_user') IS NOT NULL, 1, 0);
SET @info = CONCAT(N'error = ', @e);`),
      ck(['report_user cannot read NhanVien (error 229)', 'report_user không đọc được NhanVien (lỗi 229)'], `${LA('DECLARE @n INT = (SELECT COUNT(*) FROM dbo.NhanVien);')}
SET @ok = IIF(@e = 229, 1, 0);
SET @info = CONCAT(N'error = ', @e, IIF(@e = 0, N' — the salaries are readable!', N''));`),
      ck(['report_user cannot change orders (INSERT, UPDATE, DELETE refused)', 'report_user không sửa được đơn (INSERT, UPDATE, DELETE bị từ chối)'], `DECLARE @bad INT = 0;
BEGIN TRAN;
BEGIN TRY EXECUTE AS USER = N'report_user'; UPDATE dbo.DonHang SET tongTien = 0; REVERT; SET @bad += 1; END TRY BEGIN CATCH IF USER_NAME() = N'report_user' REVERT; IF ERROR_NUMBER() <> 229 SET @bad += 10; END CATCH;
BEGIN TRY EXECUTE AS USER = N'report_user'; INSERT INTO dbo.DonHang VALUES (9, 1, 1); REVERT; SET @bad += 1; END TRY BEGIN CATCH IF USER_NAME() = N'report_user' REVERT; IF ERROR_NUMBER() <> 229 SET @bad += 10; END CATCH;
BEGIN TRY EXECUTE AS USER = N'report_user'; DELETE FROM dbo.DonHang; REVERT; SET @bad += 1; END TRY BEGIN CATCH IF USER_NAME() = N'report_user' REVERT; IF ERROR_NUMBER() <> 229 SET @bad += 10; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@bad = 0, 1, 0);
SET @info = CONCAT(N'writes that went through: ', @bad % 10, N' · other errors: ', @bad / 10);`),
      ck(['The permissions belong to rBaoCao, and report_user is in no other role', 'Quyền thuộc rBaoCao, và report_user không ở role nào khác'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.database_permissions p WHERE p.grantee_principal_id = DATABASE_PRINCIPAL_ID(N'rBaoCao') AND p.permission_name = 'SELECT' AND p.major_id = OBJECT_ID(N'dbo.DonHang'))
  AND NOT EXISTS (SELECT 1 FROM sys.database_permissions p WHERE p.grantee_principal_id = DATABASE_PRINCIPAL_ID(N'report_user') AND p.class = 1)
  AND (SELECT COUNT(*) FROM sys.database_role_members m WHERE m.member_principal_id = DATABASE_PRINCIPAL_ID(N'report_user')) = 1
  AND EXISTS (SELECT 1 FROM sys.database_role_members m WHERE m.member_principal_id = DATABASE_PRINCIPAL_ID(N'report_user') AND m.role_principal_id = DATABASE_PRINCIPAL_ID(N'rBaoCao')), 1, 0);
SET @info = CONCAT(N'roles of report_user: ', (SELECT STRING_AGG(USER_NAME(m.role_principal_id), ', ') FROM sys.database_role_members m WHERE m.member_principal_id = DATABASE_PRINCIPAL_ID(N'report_user')));`),
    ],
    saiTay: [
      GIAI_BC + '\nGO\nALTER ROLE db_datareader ADD MEMBER report_user;',
      GIAI_BC.replace('GRANT SELECT ON dbo.DonHang   TO rBaoCao;', 'GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.DonHang TO rBaoCao;'),
      GIAI_BC.replace('GRANT SELECT ON dbo.DonHang   TO rBaoCao;\nGRANT SELECT ON dbo.KhachHang TO rBaoCao;\nGO\nCREATE USER report_user WITHOUT LOGIN;', 'GO\nCREATE USER report_user WITHOUT LOGIN;\nGRANT SELECT ON dbo.DonHang TO report_user;\nGRANT SELECT ON dbo.KhachHang TO report_user;'),
    ],
    gy: [['Login (server) → user (database) → role (group of permissions).', 'Login (máy chủ) → user (CSDL) → role (nhóm quyền).'], ['Grant to roles: when a new analyst joins, one ALTER ROLE gives them exactly the same rights.', 'Cấp cho role: khi có chuyên viên mới, một lệnh ALTER ROLE cho họ đúng y các quyền.']],
    lhg: [['Adding the account to db_datareader "to save time" — every table, including salaries, becomes readable.', 'Thêm tài khoản vào db_datareader "cho nhanh" — mọi bảng, kể cả lương, đều đọc được.'], ['Granting to the user directly — permissions get scattered and forgotten.', 'Cấp thẳng cho user — quyền bị rải rác và bị quên.']],
    gt: ['<p>Msg 229 "The SELECT permission was denied on the object \'NhanVien\'" is the error the report would see. DENY is stronger than GRANT and wins over any role grant — keep it for explicit exceptions. PostgreSQL: CREATE ROLE … NOLOGIN; GRANT SELECT ON … TO …; GRANT role TO user.</p>', '<p>Msg 229 "The SELECT permission was denied on the object \'NhanVien\'" là lỗi báo cáo sẽ gặp. DENY mạnh hơn GRANT và thắng mọi quyền cấp qua role — giữ cho ngoại lệ tường minh. PostgreSQL: CREATE ROLE … NOLOGIN; GRANT SELECT ON … TO …; GRANT role TO user.</p>'],
    tn: [tn('least privilege', 'quyền tối thiểu'), tn('database role', 'vai trò CSDL')],
  }),
  tsql({
    t: 'Exercise 3 — multi-tenant Row-Level Security with SESSION_CONTEXT', k: 'HARD', p: 20,
    kn: ['Row-Level Security', 'security policy', 'filter predicate', 'block predicate', 'SESSION_CONTEXT'], tag: ['advanced', 'security', 'rls'],
    lyDo: ['Row-Level Security (security policies, inline predicate functions, SESSION_CONTEXT) is a SQL Server engine feature; nothing in the browser grader can enforce it.', 'Row-Level Security (security policy, hàm điều kiện inline, SESSION_CONTEXT) là tính năng của bộ máy SQL Server; máy chấm trình duyệt không thi hành được.'],
    en: '<p><code>Ve(id, congTyId, tieuDe)</code> holds support tickets of several companies. After login the app runs <code>EXEC sp_set_session_context N\'congTyId\', @id</code>. Make the database itself guarantee that a session sees <b>only its company\'s tickets</b> (and none when the context is not set) and cannot <b>insert</b> a ticket for another company — no WHERE clause needed in the app.</p><p>Create the inline function <code>dbo.fnRlsCongTy(@congTyId)</code> and the security policy <code>dbo.spVeTheoCongTy</code> with a FILTER and an AFTER INSERT BLOCK predicate.</p>',
    vi: '<p><code>Ve(id, congTyId, tieuDe)</code> chứa phiếu hỗ trợ của nhiều công ty. Sau khi đăng nhập app chạy <code>EXEC sp_set_session_context N\'congTyId\', @id</code>. Làm cho chính CSDL bảo đảm một phiên chỉ thấy <b>phiếu của công ty mình</b> (và không thấy gì khi chưa đặt ngữ cảnh) và không <b>chèn</b> được phiếu cho công ty khác — app không cần WHERE.</p><p>Tạo hàm inline <code>dbo.fnRlsCongTy(@congTyId)</code> và security policy <code>dbo.spVeTheoCongTy</code> với một FILTER và một BLOCK AFTER INSERT.</p>',
    yc: [['The predicate function: RETURNS TABLE WITH SCHEMABINDING AS RETURN SELECT 1 … WHERE @congTyId = CAST(SESSION_CONTEXT(N\'congTyId\') AS INT).', 'Hàm điều kiện: RETURNS TABLE WITH SCHEMABINDING AS RETURN SELECT 1 … WHERE @congTyId = CAST(SESSION_CONTEXT(N\'congTyId\') AS INT).'], ['CREATE SECURITY POLICY … ADD FILTER PREDICATE … ON dbo.Ve, ADD BLOCK PREDICATE … ON dbo.Ve AFTER INSERT WITH (STATE = ON).', 'CREATE SECURITY POLICY … ADD FILTER PREDICATE … ON dbo.Ve, ADD BLOCK PREDICATE … ON dbo.Ve AFTER INSERT WITH (STATE = ON).']],
    setup: VE,
    khoi: `-- CREATE FUNCTION dbo.fnRlsCongTy (@congTyId INT) RETURNS TABLE WITH SCHEMABINDING AS RETURN ...
-- GO
-- CREATE SECURITY POLICY dbo.spVeTheoCongTy ... WITH (STATE = ON);`,
    giai: GIAI_RLS,
    kiem: [
      ck(['Company 1 sees its 2 tickets, company 2 its 3', 'Công ty 1 thấy 2 phiếu, công ty 2 thấy 3'], `${NGU_CANH(1)} DECLARE @a INT = (SELECT COUNT(*) FROM dbo.Ve), @x INT = (SELECT COUNT(*) FROM dbo.Ve WHERE congTyId <> 1);
${NGU_CANH(2)} DECLARE @b INT = (SELECT COUNT(*) FROM dbo.Ve);
${NGU_CANH('NULL')}
SET @ok = IIF(@a = 2 AND @x = 0 AND @b = 3, 1, 0);
SET @info = CONCAT(N'company 1 sees ', @a, N', company 2 sees ', @b);`),
      ck(['Without a context nothing is visible', 'Không đặt ngữ cảnh thì không thấy gì'], `${NGU_CANH('NULL')} SET @ok = IIF((SELECT COUNT(*) FROM dbo.Ve) = 0, 1, 0);
SET @info = CONCAT(N'rows visible without context: ', (SELECT COUNT(*) FROM dbo.Ve));`),
      ck(['Company 1 cannot insert a ticket for company 2, but can for itself', 'Công ty 1 không chèn được phiếu cho công ty 2, nhưng chèn được cho mình'], `DECLARE @chan INT = 0, @duoc INT = 0;
${NGU_CANH(1)}
BEGIN TRAN;
BEGIN TRY INSERT INTO dbo.Ve VALUES (100, 2, N'Giả mạo'); END TRY BEGIN CATCH SET @chan = ERROR_NUMBER(); END CATCH;
BEGIN TRY INSERT INTO dbo.Ve VALUES (101, 1, N'Thật'); SET @duoc = 1; END TRY BEGIN CATCH END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
${NGU_CANH('NULL')}
SET @ok = IIF(@chan = 33504 AND @duoc = 1, 1, 0);
SET @info = CONCAT(N'cross-company insert error = ', @chan, N' (expected 33504) · own insert ok = ', @duoc);`),
      ck(['A security policy with a FILTER and a BLOCK predicate is ON', 'Security policy có FILTER và BLOCK đang bật'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.security_policies WHERE name = N'spVeTheoCongTy' AND is_enabled = 1)
  AND EXISTS (SELECT 1 FROM sys.security_predicates sp JOIN sys.security_policies p ON p.object_id = sp.object_id WHERE p.name = N'spVeTheoCongTy' AND sp.predicate_type_desc = 'FILTER')
  AND EXISTS (SELECT 1 FROM sys.security_predicates sp JOIN sys.security_policies p ON p.object_id = sp.object_id WHERE p.name = N'spVeTheoCongTy' AND sp.predicate_type_desc = 'BLOCK'), 1, 0);
SET @info = N'expected dbo.spVeTheoCongTy, STATE = ON, one FILTER and one BLOCK predicate';`),
    ],
    saiTay: [
      GIAI_RLS.replace(",                 -- hides other companies' rows\n    ADD BLOCK  PREDICATE dbo.fnRlsCongTy(congTyId) ON dbo.Ve AFTER INSERT     -- cannot write into another company", "                  -- hides other companies' rows"),
      GIAI_RLS.replace("WHERE @congTyId = CAST(SESSION_CONTEXT(N'congTyId') AS INT);", "WHERE @congTyId = CAST(SESSION_CONTEXT(N'congTyId') AS INT) OR SESSION_CONTEXT(N'congTyId') IS NULL;"),
      GIAI_RLS.replace('WITH (STATE = ON);', 'WITH (STATE = OFF);'),
    ],
    gy: [['The filter predicate is applied to every SELECT/UPDATE/DELETE of the table, by everyone — the app cannot forget it.', 'Điều kiện lọc được áp cho mọi SELECT/UPDATE/DELETE của bảng, với mọi người — app không thể quên.'], ['A FILTER hides rows; only a BLOCK predicate stops writes into other tenants.', 'FILTER chỉ giấu dòng; chỉ BLOCK mới chặn việc ghi vào khách thuê khác.']],
    lhg: [['"No context ⇒ see everything" — one missing sp_set_session_context call leaks every company.', '"Không có ngữ cảnh ⇒ thấy hết" — thiếu một lệnh sp_set_session_context là lộ mọi công ty.'], ['Only a FILTER: a session can still insert rows for another company (it just cannot see them afterwards).', 'Chỉ có FILTER: một phiên vẫn chèn được dòng cho công ty khác (chỉ là không thấy lại).']],
    gt: ['<p>RLS is enforced by the engine, which is why it differs from a WHERE: ad hoc tools, reports and forgotten endpoints are all covered. Set the context with @read_only = 1 in the app so the user cannot change it later in the same session. PostgreSQL: ALTER TABLE ve ENABLE ROW LEVEL SECURITY; CREATE POLICY … USING (cong_ty_id = current_setting(\'app.cong_ty_id\')::int) WITH CHECK (…).</p>', '<p>RLS do bộ máy thi hành nên khác WHERE: công cụ tuỳ biến, báo cáo và endpoint bị quên đều được bảo vệ. Đặt ngữ cảnh với @read_only = 1 trong app để người dùng không đổi được trong cùng phiên. PostgreSQL: ALTER TABLE ve ENABLE ROW LEVEL SECURITY; CREATE POLICY … USING (cong_ty_id = current_setting(\'app.cong_ty_id\')::int) WITH CHECK (…).</p>'],
    tn: [tn('Row-Level Security', 'bảo mật mức dòng'), tn('multi-tenant', 'nhiều khách thuê'), tn('session context', 'ngữ cảnh phiên')],
  }),
  cs({
    t: 'Exercise 4 — why two equal passwords must not get equal hashes', k: 'MEDIUM', p: 6,
    kn: ['password hashing', 'salt', 'bcrypt', 'rainbow table'], tag: ['advanced', 'security', 'hashing'],
    en: '<p>Users <code>an</code> and <code>binh</code> both pick the password <code>MatKhau1</code>.</p>', vi: '<p>Người dùng <code>an</code> và <code>binh</code> cùng chọn mật khẩu <code>MatKhau1</code>.</p>',
    cau: [
      q('c1', ['Stored as SHA-256(password), the two rows…', 'Lưu dạng SHA-256(mật khẩu), hai dòng…'], ['hold identical hashes: cracking one cracks both', 'hold different hashes because the usernames differ', 'cannot be compared by anyone who reads the table', 'are encrypted and can be decrypted with the key'], ['Same input, same fast hash — and precomputed (rainbow) tables reverse common passwords instantly.', 'Cùng đầu vào, cùng hàm băm nhanh — và bảng tính sẵn (rainbow) đảo ngược mật khẩu phổ biến ngay lập tức.']),
      q('c2', ['bcrypt stores something like $2b$12$&lt;22-char salt&gt;&lt;hash&gt;. The salt…', 'bcrypt lưu dạng $2b$12$&lt;muối 22 ký tự&gt;&lt;hash&gt;. Muối…'], ['is random per password, so equal passwords get different hashes', 'is a secret kept outside the database', 'is the same for every user of the system', 'makes the hash reversible for the server'], ['The salt is not secret; it defeats precomputed tables and hides equal passwords.', 'Muối không bí mật; nó vô hiệu bảng tính sẵn và che việc hai mật khẩu giống nhau.']),
      q('c3', ['The "12" in $2b$12$ is…', 'Số "12" trong $2b$12$ là…'], ['the cost factor: 2¹² rounds, deliberately slow to slow down guessing', 'the length of the password in characters', 'the number of times the user may log in per day', 'the version of the bcrypt library in use'], ['Fast hashes are good for files; for passwords you want slow (bcrypt, scrypt, Argon2).', 'Hàm băm nhanh tốt cho tệp; với mật khẩu cần chậm (bcrypt, scrypt, Argon2).']),
      q('c4', ['Where should the password hashing happen?', 'Việc băm mật khẩu nên làm ở đâu?'], ['in the application, before the value reaches SQL', 'in a trigger, so the database sees the plain password', 'in a view that hides the password column', 'with ENCRYPTBYPASSPHRASE inside the INSERT'], ['The plain password should never travel to (or be logged by) the database. Encryption is reversible; a password needs a one-way hash.', 'Mật khẩu gốc không nên đi tới (hay bị ghi log bởi) CSDL. Mã hoá là đảo ngược được; mật khẩu cần băm một chiều.']),
    ],
    gy: [['Hash ≠ encryption: a hash cannot be turned back.', 'Băm ≠ mã hoá: hash không đảo ngược được.'], ['Salt per password + a slow algorithm.', 'Muối riêng mỗi mật khẩu + thuật toán chậm.']],
    lhg: [['Storing MD5/SHA-256 of passwords without salt.', 'Lưu MD5/SHA-256 của mật khẩu không muối.'], ['Encrypting passwords — whoever has the key can read them all.', 'Mã hoá mật khẩu — ai có khoá cũng đọc được tất cả.']],
    tn: [tn('salt', 'muối'), tn('key stretching', 'kéo giãn khoá')],
  }),
  tsql({
    t: 'Exercise 5 — partition a bookings table by month, then purge January fast', k: 'HARD', p: 20,
    kn: ['partition function', 'partition scheme', 'partition elimination', 'TRUNCATE … WITH (PARTITIONS)'], tag: ['advanced', 'operations', 'partitioning'],
    lyDo: ['Partition functions, partition schemes and TRUNCATE … WITH (PARTITIONS) are SQL Server storage features; the browser grader cannot create or inspect them.', 'Partition function, partition scheme và TRUNCATE … WITH (PARTITIONS) là tính năng lưu trữ của SQL Server; máy chấm trình duyệt không tạo hay soi được.'],
    en: `<p><code>DatPhongNguon(id, ngay, phong)</code> holds bookings from January to April 2026. Build the partitioned table <code>dbo.datphong(id, ngay, phong)</code>:</p>
<ol><li>partition function <code>pfThang (DATE)</code> — RANGE RIGHT with boundaries 2026-02-01, 2026-03-01, 2026-04-01 (4 partitions);</li>
<li>partition scheme <code>psThang</code> (ALL TO ([PRIMARY]));</li>
<li><code>dbo.datphong</code> on <code>psThang(ngay)</code>, primary key <code>(ngay, id)</code>, filled from DatPhongNguon;</li>
<li>then purge January with <code>TRUNCATE TABLE … WITH (PARTITIONS (1))</code>.</li></ol>`,
    vi: `<p><code>DatPhongNguon(id, ngay, phong)</code> chứa lượt đặt phòng từ tháng 1 tới tháng 4/2026. Dựng bảng phân vùng <code>dbo.datphong(id, ngay, phong)</code>:</p>
<ol><li>partition function <code>pfThang (DATE)</code> — RANGE RIGHT với các mốc 2026-02-01, 2026-03-01, 2026-04-01 (4 phân vùng);</li>
<li>partition scheme <code>psThang</code> (ALL TO ([PRIMARY]));</li>
<li><code>dbo.datphong</code> trên <code>psThang(ngay)</code>, khoá chính <code>(ngay, id)</code>, đổ dữ liệu từ DatPhongNguon;</li>
<li>rồi xoá tháng 1 bằng <code>TRUNCATE TABLE … WITH (PARTITIONS (1))</code>.</li></ol>`,
    yc: [['RANGE RIGHT: each boundary date belongs to the partition on its RIGHT (2026-02-01 is in partition 2).', 'RANGE RIGHT: mỗi ngày mốc thuộc phân vùng bên PHẢI nó (2026-02-01 ở phân vùng 2).'], ['The partitioning column must be part of the clustered primary key.', 'Cột phân vùng phải nằm trong khoá chính cụm.']],
    setup: NGUON_DP,
    khoi: `-- CREATE PARTITION FUNCTION pfThang (DATE) AS RANGE RIGHT FOR VALUES (...);
-- CREATE PARTITION SCHEME psThang AS PARTITION pfThang ALL TO ([PRIMARY]);
-- CREATE TABLE dbo.datphong (...) ON psThang (ngay);
-- INSERT ...; TRUNCATE TABLE dbo.datphong WITH (PARTITIONS (1));`,
    giai: GIAI_PV,
    kiem: [
      ck(['pfThang: RANGE RIGHT, 3 boundaries ⇒ 4 partitions', 'pfThang: RANGE RIGHT, 3 mốc ⇒ 4 phân vùng'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.partition_functions WHERE name = N'pfThang' AND boundary_value_on_right = 1 AND fanout = 4), 1, 0);
SET @info = CONCAT(N'fanout = ', (SELECT fanout FROM sys.partition_functions WHERE name = N'pfThang'), N', right = ', (SELECT boundary_value_on_right FROM sys.partition_functions WHERE name = N'pfThang'));`),
      ck(['1 February falls in partition 2, 15 March in partition 3', 'Ngày 1/2 vào phân vùng 2, ngày 15/3 vào phân vùng 3'], `IF OBJECT_ID(N'dbo.datphong') IS NULL OR NOT EXISTS (SELECT 1 FROM sys.partition_functions WHERE name = N'pfThang') BEGIN SET @ok = 0; SET @info = N'pfThang / dbo.datphong missing'; END
ELSE EXEC sp_executesql N'SELECT @o = IIF($PARTITION.pfThang(''2026-02-01'') = 2 AND $PARTITION.pfThang(''2026-03-15'') = 3 AND $PARTITION.pfThang(''2026-01-31'') = 1, 1, 0)', N'@o BIT OUTPUT', @o = @ok OUTPUT;`),
      ck(['dbo.datphong is stored on psThang by ngay', 'dbo.datphong lưu trên psThang theo ngay'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.indexes i JOIN sys.partition_schemes s ON s.data_space_id = i.data_space_id WHERE i.object_id = OBJECT_ID(N'dbo.datphong') AND i.index_id <= 1 AND s.name = N'psThang')
  AND EXISTS (SELECT 1 FROM sys.index_columns ic JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE ic.object_id = OBJECT_ID(N'dbo.datphong') AND ic.index_id <= 1 AND ic.partition_ordinal = 1 AND c.name = N'ngay'), 1, 0);
SET @info = N'expected CREATE TABLE … ON psThang (ngay)';`),
      ck(['January is gone, February–April (6 rows) are kept', 'Tháng 1 đã xoá, tháng 2–4 (6 dòng) còn'], `SET @ok = IIF(OBJECT_ID(N'dbo.datphong') IS NOT NULL, 1, 0);
IF @ok = 1 EXEC sp_executesql N'SELECT @o = IIF((SELECT COUNT(*) FROM dbo.datphong) = 6 AND NOT EXISTS (SELECT 1 FROM dbo.datphong WHERE ngay < ''2026-02-01'') AND (SELECT SUM(rows) FROM sys.partitions WHERE object_id = OBJECT_ID(N''dbo.datphong'') AND index_id <= 1 AND partition_number = 1) = 0, 1, 0)', N'@o BIT OUTPUT', @o = @ok OUTPUT;
SET @info = N'expected 0 rows in partition 1 and 6 rows in total';`),
    ],
    saiTay: [
      GIAI_PV.replace('AS RANGE RIGHT FOR VALUES', 'AS RANGE LEFT FOR VALUES'),
      GIAI_PV.replace('TRUNCATE TABLE dbo.datphong WITH (PARTITIONS (1));', 'TRUNCATE TABLE dbo.datphong WITH (PARTITIONS (2));'),
      GIAI_PV.replace(') ON psThang (ngay);', ');'),
    ],
    gy: [['RANGE RIGHT for dates: each boundary is the FIRST day of a month.', 'RANGE RIGHT với ngày: mỗi mốc là NGÀY ĐẦU của một tháng.'], ['A report WHERE ngay >= \'2026-03-01\' AND ngay < \'2026-04-01\' touches only partition 3 (partition elimination).', 'Báo cáo WHERE ngay >= \'2026-03-01\' AND ngay < \'2026-04-01\' chỉ chạm phân vùng 3 (loại bỏ phân vùng).']],
    lhg: [['RANGE LEFT with first-of-month boundaries — 1 February lands in the January partition.', 'RANGE LEFT với mốc ngày đầu tháng — ngày 1/2 rơi vào phân vùng tháng 1.'], ['DELETE … WHERE ngay < \'2026-02-01\' on a huge table — one log record per row instead of a metadata change.', 'DELETE … WHERE ngay < \'2026-02-01\' trên bảng khổng lồ — mỗi dòng một bản ghi nhật ký thay vì đổi siêu dữ liệu.']],
    gt: ['<p>Partitioning is a management tool first (purge or archive a whole month instantly, rebuild one partition), a performance tool second (elimination only helps when the query filters on the partitioning column). PostgreSQL: CREATE TABLE datphong (…) PARTITION BY RANGE (ngay); CREATE TABLE datphong_2026_01 PARTITION OF datphong FOR VALUES FROM (\'2026-01-01\') TO (\'2026-02-01\'); purge = DROP TABLE of that partition.</p>', '<p>Phân vùng trước hết là công cụ quản trị (xoá hay lưu trữ cả tháng tức thì, dựng lại một phân vùng), sau mới là công cụ hiệu năng (chỉ giúp khi truy vấn lọc theo cột phân vùng). PostgreSQL: CREATE TABLE datphong (…) PARTITION BY RANGE (ngay); CREATE TABLE datphong_2026_01 PARTITION OF datphong FOR VALUES FROM (\'2026-01-01\') TO (\'2026-02-01\'); xoá = DROP TABLE phân vùng đó.</p>'],
    tn: [tn('partitioning', 'phân vùng'), tn('partition elimination', 'loại bỏ phân vùng')],
  }),
]);
