/**
 * dbi-cs7.mjs — DBI202 ⭐ Chuyên sâu 7: BẢO MẬT & VẬN HÀNH CSDL. Deck tự dựng, không phải slide trường.
 * SQL injection (ghép chuỗi vs tham số hoá) · login/user/role · GRANT/REVOKE/DENY · Row-Level Security ·
 * Dynamic Data Masking · mã hoá & băm mật khẩu · backup/restore (full/diff/log, pg_dump/WAL/PITR) ·
 * quy tắc 3-2-1 · nhân bản (replication) · partitioning/sharding/connection pooling · giám sát vận hành.
 * Mọi bảng/số trên slide lấy từ output THẬT của flm-nguon/DBI202/gen/sql/cs7/*.sql
 * (Azure SQL Edge 15.0 = lõi SQL Server 2019 + PostgreSQL 16).
 * Render: node scripts/_render-slides.mjs --deck scripts/slides-src/dbi-cs7.mjs --out <dir>
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs7', code: 'CS7', title: 'Bảo mật & vận hành CSDL', sub: 'DBI202 · ⭐ Chuyên sâu' };

const C = { cam: '#e08a1e', nau: '#b85a2b', xam: '#404040', nhat: '#fff7ef', xanh: '#2f7d4f', xnhat: '#f1f9f4', lam: '#1b5fa8', lnhat: '#eef5fc', do: '#e02020' };
const sm = (src, lang = 'sql') => code(src, lang, 'sm');


/* ── Slide 10: sơ đồ Login → User → Role → Permission ── */
const soDoQuyen = `<svg width="1080" height="150" viewBox="0 0 1080 150" xmlns="http://www.w3.org/2000/svg" style="font-family:Arial,sans-serif;display:block;margin:0 auto">
${[['Login\n(mức server)', 40], ['User\n(mức CSDL)', 320], ['Role', 600], ['Permission\n(GRANT)', 860]].map(([t, x], i) => `
<rect x="${x}" y="40" width="220" height="70" rx="10" fill="${i % 2 ? C.nhat : '#fff'}" stroke="${C.cam}" stroke-width="2"/>
${t.split('\n').map((l, j) => `<text x="${x + 110}" y="${72 + j * 20}" text-anchor="middle" font-size="18" font-weight="700" fill="${C.xam}">${l}</text>`).join('')}`).join('')}
${[260, 540, 820].map((x) => `<line x1="${x}" y1="75" x2="${x + 40}" y2="75" stroke="#999" stroke-width="2" marker-end="url(#a)"/>`).join('')}
<defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#999"/></marker></defs>
</svg>`;

const ST = '<style>.cs .nd :not(pre)>code{font-size:.84em}</style>';
export const slides = lamDeck('BẢO MẬT & VẬN HÀNH CSDL', [
  /* 1 */ { cover: true, t: 'Bảo mật & vận hành CSDL', sub: 'SQL injection · quyền tối thiểu · Row-Level Security · mã hoá · backup/restore · nhân bản · partitioning — mức đi làm' },

  /* 2 */ { t: 'Vì sao chương này quan trọng hơn nó nghe có vẻ', body: `
<ul>
<li>Trường dạy <b>viết đúng câu SQL</b>. Đi làm còn cần: câu SQL đó có bị lợi dụng để đánh cắp dữ liệu không? Ai được phép chạy nó? Mất dữ liệu thì khôi phục thế nào? Hệ thống chậm dần thì tìm nguyên nhân ở đâu?</li>
<li>Đây là những thứ khiến một hệ thống <b>thật sự chạy được trong đời sống</b>, không chỉ chạy đúng trên máy một người.</li>
<li>Phần 1 (slide 3–13): SQL injection và quyền truy cập. Phần 2 (slide 14–25): Row-Level Security, mã hoá, backup, nhân bản, partitioning, giám sát.</li>
</ul>
<div class="o do2">Mọi lệnh <b>chạy thật</b> được đều đã chạy thật trên SQL Server (Azure SQL Edge) và PostgreSQL 16. Lệnh không chạy được trong môi trường bài học (sao lưu ra file, nhân bản giữa hai máy, cấu hình PgBouncer) được nói rõ là <b>lệnh tham khảo</b>, không tự bịa kết quả.</div>` },

  /* 3 */ { t: 'SQL injection — vì sao xảy ra', body: `
<p style="font-size:23px">Ứng dụng <b>ghép chuỗi</b> dữ liệu người dùng gõ thẳng vào câu lệnh SQL, rồi gửi nguyên câu đó cho CSDL chạy. CSDL không phân biệt được đâu là "câu lệnh của lập trình viên" và đâu là "chữ người dùng vừa gõ" — nó chỉ thấy MỘT chuỗi văn bản.</p>
<div class="hai">
<div class="o do2"><b>Đề bài tưởng vô hại</b><br>Ô tìm "tên đăng nhập" trên trang web, chỉ để so khớp một dòng trong bảng tài khoản.</div>
<div class="o"><b>Kẻ tấn công gõ</b><br><code>' OR 1=1 --</code><br>hai dấu gạch ngang biến phần còn lại của câu lệnh thành chú thích.</div>
</div>
<div class="nho">Đây là lỗ hổng đứng đầu <b>OWASP Top 10</b> nhiều năm liền (nhóm "Injection") — không phải chuyện lý thuyết.</div>` },

  /* 4 */ { t: 'Demo thật: EXEC ghép chuỗi', body: `
${sm(`DECLARE @dauVao NVARCHAR(100) = N''' OR 1=1 --';
DECLARE @cauLenh NVARCHAR(500) =
  N'SELECT taiKhoan FROM TaiKhoan WHERE taiKhoan = ''' + @dauVao + N'''';
EXEC(@cauLenh);`)}
<div class="hai" style="align-items:start">
<table style="font-size:19px"><tr><th>taiKhoan</th></tr><tr><td>admin</td></tr><tr><td>cuong</td></tr></table>
<div class="o do2" style="font-size:20px">Câu lệnh <b>chạy thật</b> trả về <b>CẢ HAI</b> tài khoản — kẻ tấn công không cần biết mật khẩu của ai, chỉ cần "đăng nhập được" ở bước kiểm tra tên đăng nhập.</div>
</div>
<div class="nho">Hai dấu gạch ngang <code>--</code> biến phần còn lại của câu lệnh gốc thành chú thích — điều kiện <code>1=1</code> luôn đúng ⇒ khớp MỌI dòng.</div>` },

  /* 5 */ { t: 'Sửa bằng tham số hoá — sp_executesql', body: `
${sm(`DECLARE @dauVao NVARCHAR(100) = N''' OR 1=1 --';
EXEC sp_executesql
  N'SELECT taiKhoan FROM TaiKhoan WHERE taiKhoan = @tk',
  N'@tk NVARCHAR(100)', @tk = @dauVao;`)}
<table style="font-size:19px"><tr><th>taiKhoan</th></tr><tr><td colspan="1" style="text-align:center;color:#888">(0 dòng)</td></tr></table>
<ul style="font-size:21px">
<li><b>Cùng một chuỗi đầu vào</b>, nhưng đi qua tham số <code>@tk</code> chứ không bị ghép vào văn bản câu lệnh.</li>
<li>CSDL hiểu <code>' OR 1=1 --</code> là <b>một giá trị cần so khớp</b>, không phải cú pháp SQL ⇒ 0 dòng khớp, đúng như mong đợi.</li>
</ul>
<div class="o xanh">Quy tắc: <b>KHÔNG BAO GIỜ</b> nối chuỗi dữ liệu người dùng vào câu SQL. Luôn dùng tham số — <code>sp_executesql</code>, <code>PreparedStatement</code>, hay driver ORM.</div>` },

  /* 6 */ { t: 'PostgreSQL: EXECUTE … USING / format(%L)', body: `
${sm(`-- ghép chuỗi trong PL/pgSQL — CÙNG lỗi
EXECUTE 'SELECT ten FROM tk WHERE ten = ''' || dauVao || '''';

-- USING: tham số đi RIÊNG khỏi văn bản câu lệnh
EXECUTE 'SELECT ten FROM tk WHERE ten = $1' USING dauVao;

-- format(...,'%L'): tự thêm dấu nháy + thoát ký tự đúng cách
EXECUTE format('SELECT ten FROM tk WHERE ten = %L', dauVao);`)}
<table style="font-size:18px"><tr><th>Cách viết</th><th>Input <code>'  OR 1=1 --</code></th></tr>
<tr><td class="do">ghép chuỗi ||</td><td class="do">2 dòng — admin, cuong</td></tr>
<tr><td>USING</td><td>0 dòng</td></tr>
<tr><td>format(%L)</td><td>0 dòng</td></tr></table>
<div class="nho">Kết quả chạy thật khớp hệt bên SQL Server: ghép chuỗi ⇒ lộ dữ liệu; tham số hoá (dù bằng cách nào) ⇒ an toàn.</div>` },

  /* 7 */ { t: 'Tầng ứng dụng: tham số hoá ở mọi driver', body: `
<div class="hai">
${sm(`// Node.js — pg
await pool.query(
  'SELECT * FROM tk WHERE ten = $1',
  [dauVao]);              // driver tự tham số hoá`, 'javascript')}
${sm(`// Java — JDBC
PreparedStatement ps = conn.prepareStatement(
  "SELECT * FROM tk WHERE ten = ?");
ps.setString(1, dauVao);
ps.executeQuery();`, 'java')}
</div>
${sm(`// Prisma (ORM) — tự tham số hoá phía sau
await prisma.tk.findMany({ where: { ten: dauVao } });`, 'javascript')}
<div class="o do2">Có tham số hoá vẫn KHÔNG an toàn nếu sau đó lại tự ghép chuỗi cho <b>tên cột/bảng động</b> hoặc dùng <code>$queryRawUnsafe</code>/<code>string interpolation</code> trong Prisma — injection vẫn xảy ra ở đúng chỗ đó.</div>
<div class="nho">Minh hoạ mã nguồn — không chạy trong bài học này (không có CSDL ứng dụng thật để kết nối).</div>` },

  /* 8 */ { t: 'Login vs User (SQL Server) · Role (PostgreSQL)', body: `${soDoQuyen}
<div class="hai">
<div class="o"><b>SQL Server</b><br><b>Login</b>: xác thực ở mức <i>server</i> (ai được kết nối). <b>User</b>: ánh xạ login đó vào MỘT CSDL cụ thể, là chỗ GRANT quyền. Một login có thể có nhiều user (mỗi CSDL một cái).</div>
<div class="o xanh"><b>PostgreSQL</b><br>Chỉ có <b>ROLE</b> — dùng chung cho cả "đăng nhập được" (<code>LOGIN</code>) lẫn "nhóm quyền" (<code>NOLOGIN</code>). Role sống ở mức <b>CỤM</b> (cluster), không riêng từng CSDL.</div>
</div>
<div class="nho">Ví dụ trong bài dùng <code>CREATE USER … WITHOUT LOGIN</code> (SQL Server) / <code>CREATE ROLE … NOLOGIN</code> (PostgreSQL) — đóng vai một tài khoản ứng dụng mà không cần mật khẩu riêng cho ví dụ.</div>` },

  /* 9 */ { t: 'GRANT / REVOKE / DENY — nguyên tắc quyền tối thiểu', body: `
${sm(`GRANT SELECT ON dbo.DonHang TO app_readonly;   -- cấp thêm quyền
REVOKE SELECT ON dbo.DonHang FROM app_readonly; -- gỡ quyền đã cấp (về "chưa nói gì")
DENY SELECT ON dbo.DonHang TO app_readonly;      -- cấm tuyệt đối, THẮNG mọi GRANT khác`)}
<div class="hai">
<div class="o"><b>Nguyên tắc quyền tối thiểu</b> (principle of least privilege): mỗi tài khoản chỉ có ĐÚNG những quyền nó cần để làm việc — không hơn "phòng khi cần".</div>
<div class="o do2"><b>DENY thắng GRANT.</b> User vừa được GRANT vừa bị DENY trên cùng một quyền ⇒ vẫn bị cấm. Dùng DENY khi cần chặn tuyệt đối, kể cả sau này ai đó lỡ tay GRANT lại.</div>
</div>
<div class="nho">PostgreSQL không có DENY — chỉ GRANT/REVOKE; muốn "cấm tuyệt đối" thì không cấp quyền và cẩn thận với thứ tự role kế thừa (membership).</div>` },

  /* 10 */ { t: 'Demo thật: tài khoản có quyền → chạy được', body: `
${sm(`CREATE USER app_readonly WITHOUT LOGIN;
GRANT SELECT ON dbo.DonHang TO app_readonly;   -- quyền tối thiểu: chỉ đọc, đúng một bảng

EXECUTE AS USER = 'app_readonly';
SELECT * FROM dbo.DonHang ORDER BY id;
SELECT IS_MEMBER('db_owner') AS la_chu_csdl;
REVERT;`)}
<table style="font-size:19px"><tr><th>id</th><th>tien</th></tr><tr><td>1</td><td>100</td></tr><tr><td>2</td><td>200</td></tr></table>
<table style="font-size:19px;margin-top:4px"><tr><th>la_chu_csdl</th></tr><tr><td>0</td></tr></table>
<div class="nho">🐘 PostgreSQL: <code>CREATE ROLE … NOLOGIN; GRANT SELECT … TO …; SET ROLE …;</code> — kết quả giống hệt, chỉ đọc được đúng bảng đã cấp.</div>` },

  /* 11 */ { t: 'Demo thật: thiếu quyền → LỖI thật', body: `
${sm(`CREATE USER app_khac WITHOUT LOGIN;   -- KHÔNG cấp quyền gì

EXECUTE AS USER = 'app_khac';
SELECT * FROM dbo.DonHang;
REVERT;`)}
<div class="o do2" style="font-family:Menlo,monospace;font-size:17px">Msg 229, Level 14, State 5<br>The SELECT permission was denied on the object 'DonHang', database 'DBI202', schema 'dbo'.</div>
<div class="o" style="font-size:20px">🐘 PostgreSQL, cùng tình huống (<code>SET ROLE app_khac; SELECT …;</code>):<br><span style="font-family:Menlo,monospace;font-size:17px">ERROR:  permission denied for table donhang</span></div>
<div class="nho">Thiếu quyền ra LỖI THẬT — không phải bảng rỗng. Ứng dụng phải bắt lỗi này, không được hiểu nhầm thành "không có dữ liệu".</div>` },

  /* 12 */ { t: 'Tài khoản riêng cho ứng dụng + schema tách quyền', body: `
<div class="hai">
<div class="o do2"><b>KHÔNG dùng <code>sa</code> / <code>postgres</code> cho ứng dụng.</b><br>Hai tài khoản đó là chủ CSDL — lộ một chuỗi kết nối là mất TOÀN BỘ hệ thống, kể cả xoá bảng, đổi quyền người khác.</div>
<div class="o xanh"><b>Mỗi ứng dụng/dịch vụ một tài khoản riêng</b>, chỉ cấp đúng bảng/thao tác nó cần — rò rỉ một chuỗi kết nối chỉ ảnh hưởng đúng phạm vi đó.</div>
</div>
<ul style="font-size:21px">
<li><b>Schema</b> (SQL Server: <code>dbo</code>, tuỳ chỉnh thêm; PostgreSQL: <code>public</code>, tuỳ chỉnh thêm) là "thư mục con" gom bảng theo module — cấp quyền theo <i>schema</i> gọn hơn cấp từng bảng một khi hệ thống lớn.</li>
<li>Ví dụ: <code>GRANT SELECT ON SCHEMA::baocao TO app_baocao;</code> (SQL Server) / <code>GRANT USAGE, SELECT ON ALL TABLES IN SCHEMA baocao TO app_baocao;</code> (PostgreSQL).</li>
</ul>
<div class="nho">Quy tắc vận hành phổ biến ở các đội production thật: production luôn có tài khoản ứng dụng riêng, không bao giờ chạy bằng tài khoản chủ CSDL.</div>` },

  /* 13 */ { t: 'Tóm tắt phần 1', body: `
<table style="font-size:18px">
<tr><th>Câu hỏi</th><th>Ý trả lời</th></tr>
<tr><td>SQL injection là gì?</td><td>ghép chuỗi dữ liệu người dùng vào câu lệnh SQL rồi chạy nguyên văn</td></tr>
<tr><td>Cách sửa duy nhất đáng tin?</td><td>tham số hoá — sp_executesql / EXECUTE … USING / PreparedStatement / ORM đúng cách</td></tr>
<tr><td>Login, User, Role khác gì nhau?</td><td>Login = xác thực server (SQL Server) · User = quyền trong một CSDL · Role = cả hai vai trò đó ở PostgreSQL</td></tr>
<tr><td>DENY hơn REVOKE ở điểm nào?</td><td>DENY cấm tuyệt đối, thắng mọi GRANT; REVOKE chỉ đưa về "chưa nói gì"</td></tr>
<tr><td>Vì sao không dùng sa/postgres cho app?</td><td>lộ một chuỗi kết nối là mất toàn quyền CSDL, không giới hạn được thiệt hại</td></tr>
</table>
<div class="o">Phần 2 (slide 14–25): Row-Level Security, mã hoá & băm mật khẩu, backup/restore, nhân bản, partitioning/sharding, giám sát vận hành.</div>` },

  /* 14 */ { t: 'Row-Level Security — PostgreSQL', body: `
${sm(`ALTER TABLE doanhso ENABLE ROW LEVEL SECURITY;
CREATE POLICY chi_xem_hn ON doanhso
  USING (mien = 'HN');   -- mỗi dòng chỉ "lọt qua" nếu điều kiện đúng

SET ROLE nhanvien_hn;
SELECT * FROM doanhso ORDER BY id;`)}
<table style="font-size:19px"><tr><th>id</th><th>mien</th><th>tien</th></tr><tr><td>1</td><td>HN</td><td>100</td></tr></table>
<div class="nho">Bảng có 2 dòng (HN, HCM) — role <code>nhanvien_hn</code> chỉ SELECT được, nhưng CHỈ THẤY 1 dòng. Không phải vì thiếu quyền SELECT, mà vì <b>policy tự thêm điều kiện WHERE</b> vào MỌI câu truy vấn của role đó, kể cả những câu chưa từng biết tới policy này.</div>
<div class="o xanh">Chủ bảng (và superuser) mặc định <b>BYPASS RLS</b> — vẫn thấy đủ mọi dòng.</div>` },

  /* 15 */ { t: 'Row-Level Security — SQL Server (Security Policy)', body: `
${sm(`CREATE FUNCTION fn_locHN(@mien NVARCHAR(10))
    RETURNS TABLE WITH SCHEMABINDING
AS RETURN SELECT 1 AS ok
   WHERE @mien = N'HN' OR IS_MEMBER('db_owner') = 1;

CREATE SECURITY POLICY DoanhSoFilter
    ADD FILTER PREDICATE fn_locHN(mien) ON dbo.DoanhSo
    WITH (STATE = ON);`)}
<table style="font-size:19px"><tr><th>id</th><th>mien</th><th>tien</th></tr><tr><td>1</td><td>HN</td><td>100</td></tr></table>
<div class="nho">Cùng ý tưởng, khác tên gọi: SQL Server không có "policy đọc điều kiện trực tiếp" — phải viết một <b>hàm vị từ</b> (predicate function) trả về "cho qua hay không", rồi gắn vào <code>SECURITY POLICY</code>. Đã chạy thật trên Azure SQL Edge — tính năng này CÓ trên bản build ARM này.</div>
<div class="o">RLS đúng nghĩa "ẩn API" — code tầng ứng dụng không cần nhớ thêm điều kiện, CSDL tự lọc cho mọi câu truy vấn.</div>` },

  /* 16 */ { t: 'Mã hoá khi kết nối & Transparent Data Encryption', body: `
<div class="hai">
<div class="o"><b>TLS khi kết nối</b> (mã hoá "trên đường đi"): chuỗi kết nối có <code>Encrypt=true</code> (SQL Server) / <code>sslmode=require</code> (PostgreSQL) — chặn ai đó nghe lén giữa app và CSDL, ví dụ trên Wi-Fi công cộng.</div>
<div class="o xanh"><b>TDE — Transparent Data Encryption</b> (mã hoá "khi nằm im"): mã hoá TOÀN BỘ file dữ liệu trên đĩa. Đánh cắp ổ cứng vẫn không đọc được dữ liệu nếu không có khoá.</div>
</div>
<ul style="font-size:20px">
<li>TLS bảo vệ dữ liệu <b>đang truyền</b>; TDE bảo vệ dữ liệu <b>đang lưu</b> — cần CẢ HAI, chúng không thay thế nhau.</li>
<li><code>SELECT * FROM sys.dm_database_encryption_keys;</code> — kiểm CSDL nào đang bật TDE (đã thử thật trên Azure SQL Edge: view tồn tại, trả 0 dòng khi chưa CSDL nào bật TDE).</li>
<li>PostgreSQL cộng đồng KHÔNG có TDE dựng sẵn — mã hoá đĩa thường làm ở tầng hệ điều hành/ổ đĩa (LUKS, EBS encryption…) hoặc bằng bản trả phí.</li>
</ul>` },

  /* 17 */ { t: 'KHÔNG lưu mật khẩu thô — băm đúng cách', body: `
${sm(`-- SQL Server: KHÔNG có bcrypt/argon2 sẵn — chỉ có băm NHANH
SELECT HASHBYTES('SHA2_256', N'MatKhau1');
-- cùng input ⇒ CÙNG một mã băm, LUÔN LUÔN — dễ bị "bảng cầu vồng" dò ngược`)}
${sm(`-- PostgreSQL + pgcrypto: CÓ bcrypt, mỗi lần băm một salt RIÊNG
SELECT crypt('MatKhau1', gen_salt('bf'));`)}
<table style="font-size:18px"><tr><th>Người</th><th>Mật khẩu</th><th>SHA-256 (SQL Server)</th></tr>
<tr><td>an</td><td>MatKhau1</td><td class="do">AAD771C4…DE36D3</td></tr>
<tr><td>binh</td><td>MatKhau1</td><td class="do">AAD771C4…DE36D3 — GIỐNG HỆT</td></tr></table>
<div class="o do2">Hai người trùng mật khẩu ⇒ SHA-256 trùng ⇒ lộ ra ngay ai dùng mật khẩu giống ai, và một bảng cầu vồng (rainbow table) dò được cả hai cùng lúc. <b>bcrypt/argon2</b> (mỗi lần một salt) không có vấn đề này — băm mật khẩu LUÔN LÀM Ở TẦNG ỨNG DỤNG (Node <code>bcrypt</code>, Java <code>BCrypt</code>), không phải trong câu SQL.</div>` },

  /* 18 */ { t: 'Dynamic Data Masking', body: `
${sm(`CREATE TABLE dbo.KhachHang (id INT PRIMARY KEY,
  email NVARCHAR(100) MASKED WITH (FUNCTION = 'email()'),
  soCCCD NVARCHAR(20) MASKED WITH (FUNCTION = 'partial(0,"XXX-XX-",4)'));
GRANT SELECT ON dbo.KhachHang TO cskh;   -- chưa cấp UNMASK`)}
<table style="font-size:18px"><tr><th>Vai</th><th>email</th><th>soCCCD</th></tr>
<tr><td>cskh (SELECT, không UNMASK)</td><td class="do">qXXX@XXXX.com</td><td class="do">XXX-XX-6789</td></tr>
<tr><td>sa (chủ CSDL)</td><td>quang@fpt.edu.vn</td><td>123-45-6789</td></tr></table>
<div class="nho">🐘 PostgreSQL <b>không có</b> DDM dựng sẵn — thay bằng VIEW che dữ liệu + chỉ GRANT trên VIEW, không GRANT bảng gốc: kết quả che giống hệt, đã chạy thật.</div>
<div class="o do2">DDM che ở tầng <b>hiển thị</b>, không mã hoá dữ liệu thật — ai có quyền UNMASK hoặc quyền viết truy vấn khéo (<code>WHERE email LIKE 'a%'</code> để dò từng ký tự) vẫn có thể moi được. Không thay thế cho GRANT đúng và mã hoá đúng.</div>` },

  /* 19 */ { t: 'Sao lưu & khôi phục — SQL Server', body: `
${sm(`BACKUP DATABASE DBI202 TO DISK = 'D:\\bak\\full.bak';
BACKUP DATABASE DBI202 TO DISK = 'D:\\bak\\diff.bak' WITH DIFFERENTIAL;
BACKUP LOG      DBI202 TO DISK = 'D:\\bak\\log.trn';

RESTORE DATABASE DBI202 FROM DISK = 'D:\\bak\\full.bak' WITH NORECOVERY;
RESTORE DATABASE DBI202 FROM DISK = 'D:\\bak\\diff.bak' WITH NORECOVERY;
RESTORE LOG      DBI202 FROM DISK = 'D:\\bak\\log.trn'  WITH RECOVERY;`)}
<table style="font-size:18px"><tr><th>Loại</th><th>Chứa gì</th><th>Cần Recovery Model</th></tr>
<tr><td>Full</td><td>toàn bộ CSDL tại một thời điểm</td><td>bất kỳ</td></tr>
<tr><td>Differential</td><td>thay đổi <i>từ lần Full gần nhất</i></td><td>bất kỳ</td></tr>
<tr><td>Log</td><td>mọi giao dịch từ lần backup log trước</td><td><b>FULL</b> (SIMPLE không giữ log để backup)</td></tr></table>
<div class="o do2">Lệnh minh hoạ — <b>không chạy trong bài học này</b> (ghi ra ổ đĩa của máy chạy CSDL, không thuộc bộ chạy SQL tự động).</div>` },

  /* 20 */ { t: 'Sao lưu & khôi phục — PostgreSQL', body: `
${sm(`# sao lưu luận lý (logic) — một file, mọi bản PostgreSQL đọc được
pg_dump -Fc -d dbi202 -f dbi202.dump
pg_restore -d dbi202_moi dbi202.dump

# sao lưu VẬT LÝ + lưu trữ WAL liên tục
pg_basebackup -D /backup/base -Fp -Xs -P
# postgresql.conf: archive_mode = on
#                  archive_command = 'cp %p /archive/%f'
# khôi phục về ĐÚNG một thời điểm (PITR):
#   recovery_target_time = '2026-09-29 14:32:00'`, 'bash')}
<table style="font-size:18px"><tr><th></th><th>SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Logic (một CSDL)</td><td>BACKUP DATABASE</td><td>pg_dump / pg_restore</td></tr>
<tr><td>Vật lý (cả cụm)</td><td>—</td><td>pg_basebackup</td></tr>
<tr><td>Khôi phục về một thời điểm</td><td>Full + Diff + Log, STOPAT</td><td>base backup + WAL, recovery_target_time (PITR)</td></tr></table>
<div class="o do2">Lệnh minh hoạ — <b>không chạy trong bài học này</b> (ghi file ra đĩa, ngoài phạm vi bộ chạy SQL tự động).</div>` },

  /* 21 */ { t: 'Quy tắc 3-2-1 & "sao lưu chưa thử khôi phục = chưa có sao lưu"', body: `
<div class="hai">
<div class="o xanh"><b>Quy tắc 3-2-1</b><br><b>3</b> bản sao dữ liệu (1 gốc + 2 sao lưu) · trên <b>2</b> loại phương tiện khác nhau · <b>1</b> bản để ở nơi khác (offsite) — một sự cố cháy/ngập/hỏng ổ không xoá sạch cả 3 cùng lúc.</div>
<div class="o do2"><b>GitLab, 31/01/2017</b> — kỹ sư xoá NHẦM thư mục dữ liệu PostgreSQL production, tưởng đang ở máy sao lưu. Cả 5 cơ chế sao lưu/nhân bản đang có đều KHÔNG dùng được lúc cần: script backup lỗi âm thầm nhiều tháng, snapshot đĩa không bật đúng, nhân bản đã lệch dữ liệu từ trước. Mất ~6 giờ dữ liệu người dùng, khôi phục từ bản sao <b>tình cờ</b> có người chạy tay 6 tiếng trước sự cố.</div>
</div>
<div class="o" style="font-size:22px">Bài học không phải "backup thường xuyên hơn" — mà là: <b>một quy trình sao lưu chưa từng được THỬ KHÔI PHỤC thì không được coi là có sao lưu.</b> Lịch định kỳ khôi phục thử (restore drill) quan trọng ngang lịch sao lưu.</div>
<div class="nho">(Đã nhắc sự kiện này ở CS.1 — Lịch sử & hệ sinh thái CSDL, phần "sự cố thật".)</div>` },

  /* 22 */ { t: 'Nhân bản & sẵn sàng cao (replication)', body: `
<div class="hai">
<div class="o"><b>PostgreSQL — streaming replication</b><br>Máy phụ (standby) liên tục nhận WAL từ máy chính qua mạng, áp lại gần như ngay lập tức. Đọc được trên standby (<code>hot_standby = on</code>) để giảm tải cho máy chính.</div>
<div class="o xanh"><b>SQL Server — Always On Availability Groups</b><br>Một hoặc nhiều bản sao (replica) đồng bộ/không đồng bộ; có thể tự chuyển đổi (failover) khi máy chính hỏng. Đọc trên "readable secondary" tương tự standby của PostgreSQL.</div>
</div>
<ul style="font-size:20px">
<li><b>Đồng bộ (sync)</b>: máy chính đợi bản sao xác nhận trước khi báo "đã commit" — không mất dữ liệu nhưng chậm hơn. <b>Bất đồng bộ (async)</b>: nhanh hơn, có thể mất vài giao dịch cuối nếu máy chính hỏng đúng lúc.</li>
<li>Đọc-từ-bản-sao (read replica) giảm tải cho máy chính, nhưng dữ liệu đọc được có thể <b>trễ vài mili-giây tới vài giây</b> (replication lag) — không dùng cho việc cần đọc-ngay-sau-khi-ghi.</li>
</ul>
<div class="nho">Nhân bản KHÔNG thay thế backup: xoá nhầm dữ liệu ở máy chính thì máy phụ cũng nhân bản luôn lệnh xoá đó.</div>` },

  /* 23 */ { t: 'Mở rộng: partitioning — chạy thật', body: `
${sm(`-- PostgreSQL
CREATE TABLE donhang (id int, ngay date, tien int) PARTITION BY RANGE (ngay);
CREATE TABLE donhang_2026_09 PARTITION OF donhang
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE donhang_2026_10 PARTITION OF donhang
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');`)}
<table style="font-size:18px"><tr><th>tableoid (phân vùng)</th><th>id</th><th>ngay</th><th>tien</th></tr>
<tr><td>donhang_2026_09</td><td>1</td><td>2026-09-05</td><td>100</td></tr>
<tr><td>donhang_2026_10</td><td>2</td><td>2026-10-12</td><td>200</td></tr></table>
<div class="o xanh"><code>EXPLAIN</code> tìm đơn hàng tháng 10: kế hoạch CHỈ quét <code>donhang_2026_10</code> — <b>partition pruning</b>, không đụng tới phân vùng tháng 9.</div>
<div class="nho">🐘 SQL Server: <code>CREATE PARTITION FUNCTION</code> + <code>PARTITION SCHEME</code> — cũng chạy thật trên Azure SQL Edge, và có thêm <code>SWITCH PARTITION</code> để "thả" nguyên một tháng dữ liệu cũ gần như tức thời.</div>` },

  /* 24 */ { t: 'Mở rộng: sharding & connection pooling', body: `
<div class="hai">
<div class="o"><b>Partitioning</b> (slide 23): chia bảng thành nhiều phần <b>trong CÙNG một CSDL</b>. <b>Sharding</b>: chia dữ liệu ra <b>NHIỀU máy CSDL khác nhau</b> (vd theo <code>id % 4</code>) — cần khi một máy không còn đủ chứa/chịu tải.</div>
<div class="o xanh"><b>Connection pooling</b>: mở sẵn một số kết nối tới CSDL và dùng lại, thay vì mỗi request mở-đóng kết nối mới (tốn, nhất là PostgreSQL — mỗi kết nối là một tiến trình riêng).</div>
</div>
${sm(`# pgbouncer.ini — pool tầng hạ tầng, đứng giữa app và PostgreSQL
[databases]
dbi202 = host=127.0.0.1 port=5432 dbname=dbi202
[pgbouncer]
pool_mode = transaction
max_client_conn = 500
default_pool_size = 20`, 'bash')}
<div class="nho">Prisma/pg driver cũng có pool ngay trong ứng dụng; PgBouncer là pool ở tầng hạ tầng dùng khi nhiều tiến trình ứng dụng chia sẻ một số kết nối giới hạn. Minh hoạ — không chạy trong bài học này.</div>` },

  /* 25 */ { t: 'Giám sát vận hành & checklist đồ án', body: `
${sm(`SET STATISTICS IO ON;                       -- SQL Server: bao nhiêu trang được đọc
SELECT * FROM dbo.KhachHang WHERE email = N'kh1500@vidu.vn';
-- Table 'KhachHang'. logical reads 13   →  sau khi CREATE INDEX: logical reads 2`)}
<table style="font-size:17px"><tr><th>Cần biết</th><th>SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Truy vấn tốn kém</td><td>SET STATISTICS IO / sys.dm_exec_query_stats</td><td>EXPLAIN ANALYZE / pg_stat_statements (cần nạp qua shared_preload_libraries)</td></tr>
<tr><td>Khoá đang giữ/chờ</td><td>sys.dm_tran_locks</td><td>pg_locks</td></tr>
<tr><td>Dung lượng</td><td>sp_spaceused</td><td>pg_size_pretty(pg_total_relation_size(...))</td></tr></table>
<div class="o do2">🐘 Đã thử thật: <code>CREATE EXTENSION pg_stat_statements</code> chạy được, nhưng <code>SELECT … FROM pg_stat_statements</code> báo lỗi <code>must be loaded via shared_preload_libraries</code> — cài xong KHÔNG có nghĩa là dùng được ngay, còn thiếu bước cấu hình + khởi động lại.</div>
<div class="o xanh" style="font-size:19px"><b>Checklist tối thiểu cho đồ án:</b> câu lệnh có tham số hoá? · tài khoản ứng dụng riêng, không phải chủ CSDL? · mật khẩu băm bằng bcrypt/argon2 ở tầng ứng dụng? · có lịch backup VÀ đã thử khôi phục? · chỉ mục cho các cột hay WHERE/JOIN?</div>` },
].map((it) => (it.body ? { ...it, body: ST + it.body } : it)));
