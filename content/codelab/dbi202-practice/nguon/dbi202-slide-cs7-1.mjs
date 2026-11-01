/**
 * DBI202 · ⭐ CS.7 phần 1 — SQL injection (vì sao xảy ra, khai thác thật, cách vá), login/user/role, GRANT/REVOKE/DENY, quyền tối thiểu
 * (slide 1–13). Đề tĩnh; phần chạy thật nằm ở CS.7 bài tập.
 */
import { mod, cs, q, ord, bang1, tn } from './_chung.mjs';

export default mod('dbi202-slide-cs7-1', '⭐ CS.7 Security (1): SQL injection, accounts, permissions', [
  cs({
    t: 'SQL injection: spot it, explain it, fix it', k: 'MEDIUM', p: 7,
    kn: ['SQL injection', 'string concatenation', 'parameters'], tag: ['advanced', 'security', 'injection'],
    en: '<p>Five questions on slides 3–7.</p>', vi: '<p>Năm câu về slide 3–7.</p>',
    cau: [
      q('c1', ['Login code: "SELECT * FROM Users WHERE name = \'" + name + "\' AND pass = \'" + pass + "\'". The input name = admin\' -- logs in because…', 'Mã đăng nhập: "SELECT * FROM Users WHERE name = \'" + name + "\' AND pass = \'" + pass + "\'". Nhập name = admin\' -- đăng nhập được vì…'], ['the quote closes the string and -- comments out the password test', 'admin accounts never need a password', 'the database ignores quotes inside names', 'the password column is empty for admin'], ['The data became code. Any value that reaches the SQL text unescaped can change the statement.', 'Dữ liệu đã thành mã. Giá trị nào lọt vào văn bản SQL mà không được xử lý đều có thể đổi câu lệnh.']),
      q('c2', ['The real fix is…', 'Cách vá thật sự là…'], ['parameterized queries: the value is sent separately from the SQL text', 'removing quotes and dashes from every input', 'hiding error messages from the user', 'limiting the input length to 20 characters'], ['Escaping and blacklists are fragile; parameters cannot be parsed as code at all.', 'Escape và danh sách đen rất mong manh; tham số hoàn toàn không bị phân tích thành mã.']),
      q('c3', ['A UNION-based injection needs to match…', 'Tiêm SQL kiểu UNION cần khớp…'], ['the number and types of the columns of the original SELECT', 'the name of the table in the original query', 'the primary key of the target table', 'the database collation and language'], ['That is why attackers first probe the column count (ORDER BY 1, 2, 3…).', 'Vì thế kẻ tấn công dò số cột trước (ORDER BY 1, 2, 3…).']),
      q('c4', ['Which is still vulnerable?', 'Cách nào vẫn có lỗ hổng?'], ['EXEC sp_executesql N\'SELECT … WHERE ten = \'\'\' + @x + N\'\'\'\'', 'EXEC sp_executesql N\'SELECT … WHERE ten = @p\', N\'@p NVARCHAR(50)\', @p = @x', 'SELECT … WHERE ten = @x inside a stored procedure', 'a Prisma findMany({ where: { ten: x } }) call'], ['sp_executesql is only safe when the value is passed as a parameter, not glued into the string.', 'sp_executesql chỉ an toàn khi giá trị được truyền dưới dạng tham số, không ghép vào chuỗi.']),
      q('c5', ['Even with parameters, a column or table NAME chosen by the user must be…', 'Kể cả có tham số, TÊN cột hay bảng do người dùng chọn phải…'], ['checked against a whitelist (and QUOTENAME-d) — identifiers cannot be parameters', 'passed as a parameter like any other value', 'escaped by doubling every quote inside it', 'accepted only if it is shorter than 30 characters'], ['Parameters replace values, never identifiers such as ORDER BY columns.', 'Tham số thay giá trị, không thay định danh như cột ORDER BY.']),
    ],
    gy: [['Ask: can this input change the SQL text?', 'Hỏi: dữ liệu này có đổi được văn bản SQL không?'], ['Values ⇒ parameters; identifiers ⇒ whitelist.', 'Giá trị ⇒ tham số; định danh ⇒ danh sách trắng.']],
    lhg: [['"We escape quotes, so we are safe."', '"Chúng tôi đã escape dấu nháy nên an toàn."'], ['Thinking stored procedures are automatically safe — not if they build dynamic SQL by concatenation.', 'Tưởng stored procedure tự động an toàn — không, nếu nó ghép chuỗi SQL động.']],
    tn: [tn('SQL injection', 'tiêm SQL'), tn('whitelist', 'danh sách trắng')],
  }),
  cs({
    t: 'Least privilege: what does each account really need?', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['GRANT', 'DENY', 'EXECUTE permission', 'least privilege'], tag: ['advanced', 'security', 'permissions'],
    en: '<p>Slides 8–13. Choose the smallest permission set that lets each account do its job.</p>', vi: '<p>Slide 8–13. Chọn tập quyền nhỏ nhất cho mỗi tài khoản làm được việc.</p>',
    bang: [bang1('b1', ['Account → permissions', 'Tài khoản → quyền'],
      [{ ma: 'tk', ten: 'Account / Tài khoản' }, { ma: 'q', ten: 'Permissions', luaChon: ['GRANT SELECT on the two report tables', 'GRANT EXECUTE on the app\'s stored procedures only', 'GRANT SELECT, INSERT, UPDATE on its tables, no DELETE', 'db_owner on its own development database', 'GRANT BACKUP DATABASE (no table access)'] }],
      [{ o: { tk: 'A revenue dashboard that only reads orders and customers' }, a: { q: 'GRANT SELECT on the two report tables' } },
        { o: { tk: 'A web app that only calls stored procedures' }, a: { q: 'GRANT EXECUTE on the app\'s stored procedures only' } },
        { o: { tk: 'A web app with soft delete (it never deletes rows)' }, a: { q: 'GRANT SELECT, INSERT, UPDATE on its tables, no DELETE' } },
        { o: { tk: 'A nightly backup job' }, a: { q: 'GRANT BACKUP DATABASE (no table access)' } },
        { o: { tk: 'A developer on a local copy with fake data' }, a: { q: 'db_owner on its own development database' } }],
      ['EXECUTE on a procedure works through ownership chaining: the app needs no rights on the tables the procedure touches. Never let an application log in as sa / postgres.', 'EXECUTE trên procedure chạy nhờ ownership chaining: app không cần quyền trên các bảng mà procedure chạm tới. Không bao giờ để ứng dụng đăng nhập bằng sa / postgres.'])],
    gy: [['Start from nothing and add only what the job needs.', 'Bắt đầu từ không có gì và chỉ thêm thứ công việc cần.'], ['Procedures are a permission boundary.', 'Procedure là một ranh giới quyền.']],
    lhg: [['Giving the app db_owner "because it is easier".', 'Cho app db_owner "cho dễ".'], ['Granting table access to an app that only uses procedures.', 'Cấp quyền bảng cho app chỉ dùng procedure.']],
    tn: [tn('ownership chaining', 'xâu chuỗi quyền sở hữu'), tn('principle of least privilege', 'nguyên tắc quyền tối thiểu')],
  }),
  cs({
    t: 'From login to permission: set up an account in order', k: 'EASY', p: 5, loai: 'order',
    kn: ['login', 'user', 'role', 'GRANT'], tag: ['advanced', 'security', 'permissions'],
    en: '<p>Slides 9–11. Order the steps that give a new analyst read access to the report tables on SQL Server.</p>', vi: '<p>Slide 9–11. Sắp các bước cho một chuyên viên mới quyền đọc các bảng báo cáo trên SQL Server.</p>',
    cau: [ord('o1', ['First → last', 'Đầu → cuối'], ['CREATE LOGIN analyst WITH PASSWORD = … (server level)', 'USE ShopDB; CREATE USER analyst FOR LOGIN analyst', 'CREATE ROLE rBaoCao', 'GRANT SELECT ON dbo.DonHang TO rBaoCao', 'ALTER ROLE rBaoCao ADD MEMBER analyst', 'EXECUTE AS USER = \'analyst\' to test, then REVERT'],
      ['Login = who can connect to the server; user = who they are inside one database; role = a reusable bundle of permissions. Test as the user before handing over the password.', 'Login = ai được kết nối tới máy chủ; user = họ là ai trong một CSDL; role = gói quyền dùng lại được. Thử bằng chính user trước khi giao mật khẩu.'])],
    gy: [['Server first, then database, then permissions.', 'Máy chủ trước, rồi CSDL, rồi quyền.'], ['The role can exist before anyone is in it.', 'Role có thể tồn tại trước khi có ai trong nó.']],
    lhg: [['CREATE USER before the login exists.', 'CREATE USER trước khi có login.'], ['Skipping the test and discovering error 229 in production.', 'Bỏ bước thử và gặp lỗi 229 trên production.']],
    tn: [tn('login', 'tài khoản đăng nhập máy chủ'), tn('database user', 'người dùng CSDL')],
  }),
]);
