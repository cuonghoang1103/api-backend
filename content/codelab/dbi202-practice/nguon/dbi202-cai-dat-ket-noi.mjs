/**
 * DBI202 · Bắt đầu 2/2 — cài & kết nối SQL Server / PostgreSQL. Ba đề: tự kiểm máy của bạn (chạy trên máy),
 * đọc thông báo lỗi kết nối (trắc nghiệm), chọn image/công cụ theo máy (bảng).
 */
import { mod, cs, q, bang1, tsql, ck, tn } from './_chung.mjs';

const MSG = 'Xin chào, tôi học DBI202';

export default mod('dbi202-cai-dat-ket-noi', '0.2 Install SQL Server and connect — check your setup', [
  tsql({
    t: 'Prove your SQL Server is ready: a Unicode table', k: 'EASY', p: 15,
    kn: ['SQL Server setup', 'NVARCHAR', "N'' literal"], tag: ['setup', 'unicode'],
    lyDo: ['This exercise is about YOUR installation: it only makes sense on the SQL Server you will use for the labs and the PE.', 'Bài này kiểm chính BẢN CÀI của bạn: chỉ có nghĩa khi chạy trên SQL Server bạn sẽ dùng cho lab và PE.'],
    en: `<p>Use this exercise as the smoke test of your setup (lesson "Start here 2/2"). In <code>solution.sql</code> create a table <code>HelloDbi</code> with <code>id INT</code> (primary key) and <code>msg NVARCHAR(50) NOT NULL</code>, then insert the row <code>(1, '${MSG}')</code> so that every Vietnamese letter is stored correctly.</p><p>The self-check also prints your server version: it must be SQL Server 2019 or newer (Azure SQL Edge counts as 2019).</p>`,
    vi: `<p>Dùng bài này để kiểm tra bản cài (bài "Bắt đầu 2/2"). Trong <code>solution.sql</code> tạo bảng <code>HelloDbi</code> gồm <code>id INT</code> (khoá chính) và <code>msg NVARCHAR(50) NOT NULL</code>, rồi thêm dòng <code>(1, '${MSG}')</code> sao cho mọi chữ tiếng Việt được lưu đúng.</p><p>Tệp tự kiểm cũng kiểm phiên bản máy chủ: phải là SQL Server 2019 trở lên (Azure SQL Edge tính là 2019).</p>`,
    yc: [['Table <code>HelloDbi(id INT PRIMARY KEY, msg NVARCHAR(50) NOT NULL)</code>.', 'Bảng <code>HelloDbi(id INT PRIMARY KEY, msg NVARCHAR(50) NOT NULL)</code>.'],
      [`One row: id 1, msg <code>${MSG}</code> — exactly, with diacritics.`, `Một dòng: id 1, msg <code>${MSG}</code> — đúng từng dấu.`]],
    setup: `-- (no sample tables — this exercise starts from an empty database)
SELECT CAST(SERVERPROPERTY('ProductVersion') AS NVARCHAR(30)) AS ServerVersion, CAST(SERVERPROPERTY('Edition') AS NVARCHAR(60)) AS Edition;`,
    khoi: `-- 1) CREATE TABLE HelloDbi (...)
-- 2) INSERT the row (1, 'Xin chào, tôi học DBI202') — think about the N prefix
`,
    giai: `CREATE TABLE HelloDbi (
    id  INT           NOT NULL PRIMARY KEY,
    msg NVARCHAR(50)  NOT NULL               -- N = Unicode: Vietnamese letters survive
);
INSERT INTO HelloDbi (id, msg) VALUES (1, N'${MSG}');   -- N'' = a Unicode literal`,
    kiem: [
      ck(['The server is SQL Server 2019 or newer', 'Máy chủ là SQL Server 2019 trở lên'], `SET @ok = IIF(CAST(PARSENAME(CAST(SERVERPROPERTY('ProductVersion') AS NVARCHAR(30)), 4) AS INT) >= 15, 1, 0);
SET @info = CONCAT(N'your version is ', CAST(SERVERPROPERTY('ProductVersion') AS NVARCHAR(30)), N' — install SQL Server 2019/2022 (or Azure SQL Edge on Apple Silicon)');`),
      ck(['Table HelloDbi has id INT (primary key) and msg NVARCHAR(50) NOT NULL', 'Bảng HelloDbi có id INT (khoá chính) và msg NVARCHAR(50) NOT NULL'], `SET @ok = IIF(OBJECT_ID(N'dbo.HelloDbi', N'U') IS NOT NULL
  AND EXISTS (SELECT 1 FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.HelloDbi') AND c.name = N'id' AND t.name = N'int')
  AND EXISTS (SELECT 1 FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.HelloDbi') AND c.name = N'msg' AND t.name = N'nvarchar' AND c.max_length = 100 AND c.is_nullable = 0)
  AND EXISTS (SELECT 1 FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE i.object_id = OBJECT_ID(N'dbo.HelloDbi') AND i.is_primary_key = 1 AND c.name = N'id'), 1, 0);
SET @info = N'expected HelloDbi(id INT PRIMARY KEY, msg NVARCHAR(50) NOT NULL)';`),
      ck(['Row 1 holds the Vietnamese text exactly (no "?")', 'Dòng 1 giữ đúng chữ tiếng Việt (không thành "?")'], `DECLARE @m NVARCHAR(50) = (SELECT msg FROM dbo.HelloDbi WHERE id = 1);
SET @ok = IIF(@m = N'${MSG}' COLLATE Latin1_General_BIN2, 1, 0);
SET @info = CONCAT(N'found: ', COALESCE(@m, N'(no row 1)'), N' — did you forget the N in N''...''?');`),
    ],
    saiTay: [
      `CREATE TABLE HelloDbi (id INT NOT NULL PRIMARY KEY, msg NVARCHAR(50) NOT NULL);
INSERT INTO HelloDbi (id, msg) VALUES (1, '${MSG}');`,
      `CREATE TABLE HelloDbi (id INT NOT NULL PRIMARY KEY, msg VARCHAR(50) NOT NULL);
INSERT INTO HelloDbi (id, msg) VALUES (1, N'${MSG}');`,
    ],
    gy: [['NVARCHAR stores Unicode; VARCHAR on a default (Latin1) collation cannot store "ọ" or "ư".', 'NVARCHAR lưu Unicode; VARCHAR với collation mặc định (Latin1) không lưu được "ọ", "ư".'], ["The literal needs the N prefix too: N'Xin chào…' — without it the text is converted to the server's code page BEFORE it reaches the column.", "Chuỗi hằng cũng cần tiền tố N: N'Xin chào…' — thiếu N là chữ bị đổi sang bảng mã của máy chủ TRƯỚC khi vào cột."]],
    lhg: [["INSERT … VALUES (1, 'Xin chào, tôi học DBI202') without N — the column is NVARCHAR but the value arrives as 'h?c'.", "INSERT … VALUES (1, 'Xin chào, tôi học DBI202') thiếu N — cột NVARCHAR nhưng giá trị tới nơi đã thành 'h?c'."], ['Declaring msg VARCHAR(50) — even with N\'…\' the column itself cannot hold the letter "ọ".', 'Khai msg VARCHAR(50) — dù có N\'…\' thì bản thân cột cũng không chứa được chữ "ọ".']],
    gt: ['<p>Two things must both be Unicode: the column type (NVARCHAR) and the literal (N\'…\'). The check compares with a binary collation, so a single "?" is caught. If check 1 fails, fix the installation first (lesson "Start here 2/2").</p>', '<p>Hai thứ đều phải là Unicode: kiểu cột (NVARCHAR) và chuỗi hằng (N\'…\'). Kiểm so bằng collation nhị phân nên chỉ một dấu "?" cũng bị bắt. Kiểm 1 trượt thì sửa bản cài trước (bài "Bắt đầu 2/2").</p>'],
    tn: [tn('NVARCHAR', 'chuỗi Unicode', 'Kiểu chữ Unicode của SQL Server — bắt buộc cho tiếng Việt có dấu.'), tn("N'' literal", 'chuỗi hằng Unicode', "Tiền tố N trước chuỗi: N'Đức' — báo cho SQL Server đây là chuỗi Unicode.")],
  }),
  cs({
    t: 'Read the connection error, pick the fix', k: 'EASY', p: 8,
    kn: ['connection errors', 'SQL Server authentication'], tag: ['setup', 'errors'],
    en: '<p>Each question quotes a real message from SSMS or a driver. Pick what it really means / how to fix it (lesson "Start here 2/2", section 3).</p>',
    vi: '<p>Mỗi câu trích một thông báo thật của SSMS hay driver. Chọn ý nghĩa thật / cách sửa (bài "Bắt đầu 2/2", mục 3).</p>',
    cau: [
      q('c1', ['"Login failed for user \'sa\'. (Error: 18456) State: 1" right after installing with Windows Authentication only.', '"Login failed for user \'sa\'. (Error: 18456) State: 1" ngay sau khi cài chỉ bật Windows Authentication.'],
        ['SQL logins are disabled: switch the server to Mixed Mode and restart it', 'The sa password has a typo: retype it carefully in the dialog', 'The SQL Server service is stopped: start it in services.msc', 'The default database is missing: create it, then log in again'],
        ['State 1 hides the real cause; in practice it means the server only accepts Windows logins. Enable Mixed Mode (Server properties → Security) and restart.', 'State 1 che nguyên nhân thật; thực tế là máy chủ chỉ nhận đăng nhập Windows. Bật Mixed Mode (Server properties → Security) rồi khởi động lại dịch vụ.']),
      q('c2', ['"The certificate chain was issued by an authority that is not trusted."', '"The certificate chain was issued by an authority that is not trusted."'],
        ['Tick "Trust server certificate" (or add -C to sqlcmd)', 'Reinstall SQL Server with a new certificate', 'Use the port 1434 instead of 1433', 'Grant the login the sysadmin role'],
        ['New drivers encrypt by default and a local SQL Server only has a self-signed certificate. Trusting it is fine on your own machine.', 'Driver mới mặc định mã hoá, còn SQL Server ở máy chỉ có chứng chỉ tự ký. Tin chứng chỉ đó là ổn trên máy của bạn.']),
      q('c3', ['"Invalid object name \'SinhVien\'." (Msg 208) — but you created the table yesterday.', '"Invalid object name \'SinhVien\'." (Msg 208) — dù hôm qua đã tạo bảng.'],
        ['The window is on another database (often master): USE the right one', 'SQL Server drops tables at night: run the CREATE TABLE again', 'Table names are case-sensitive: write SINHVIEN in capitals', 'The login lost its password: reset it, then reconnect'],
        ['Msg 208 comes after a successful connection: the object is not in the CURRENT database. Check the database drop-down or run USE QuanLyLop first.', 'Msg 208 xảy ra khi đã kết nối được: đối tượng không nằm trong CSDL HIỆN TẠI. Xem ô chọn CSDL hoặc chạy USE QuanLyLop trước.']),
      q('c4', ['"…(provider: TCP Provider, error: 0 — No connection could be made because the target machine actively refused it)"', '"…(provider: TCP Provider, error: 0 — No connection could be made because the target machine actively refused it)"'],
        ['Nothing listens on that TCP port: enable TCP/IP or start the container', 'The sa password expired: set a new one with ALTER LOGIN sa', 'A table is locked by another session: wait and run again', 'The data disk is full: free space, then reconnect again'],
        ['"Actively refused" = the machine answered but no SQL Server listens on that TCP port: TCP/IP disabled, wrong port, or the Docker container is not running.', '"Actively refused" = máy trả lời nhưng không có SQL Server nghe ở cổng TCP đó: TCP/IP bị tắt, sai cổng, hoặc container Docker chưa chạy.']),
      q('c5', ['"String or binary data would be truncated in table \'dbo.Lop\', column \'tenLop\'."', '"String or binary data would be truncated in table \'dbo.Lop\', column \'tenLop\'."'],
        ['The value is longer than the column: widen it or shorten the value', 'The column is NOT NULL and the INSERT sent a NULL value there', 'The foreign key points to a class that does not exist yet', 'The network connection timed out in the middle of the INSERT'],
        ['The value does not fit, e.g. 60 characters into NVARCHAR(50). SQL Server 2019+ names the column for you.', 'Giá trị không vừa cột, vd 60 ký tự vào NVARCHAR(50). SQL Server 2019+ ghi rõ tên cột.']),
      q('c6', ['On a MacBook M2, docker run mcr.microsoft.com/mssql/server:2022-latest exits immediately with "exec format error".', 'Trên MacBook M2, docker run mcr.microsoft.com/mssql/server:2022-latest thoát ngay với "exec format error".'],
        ['The image is x86_64 only: enable Rosetta or use azure-sql-edge', 'The sa password is too short: use at least 8 mixed characters', 'Port 1433 is taken by PostgreSQL: publish another host port', 'Docker has too little memory: give it more than 16 GB of RAM'],
        ['Apple Silicon is arm64; the official image is x86_64. Either enable "Use Rosetta for x86_64/amd64 emulation" (and add --platform linux/amd64) or run mcr.microsoft.com/azure-sql-edge, which is arm64-native.', 'Apple Silicon là arm64; image chính thức là x86_64. Bật "Use Rosetta for x86_64/amd64 emulation" (thêm --platform linux/amd64) hoặc chạy mcr.microsoft.com/azure-sql-edge — bản arm64 gốc.']),
    ],
    gy: [['First ask: did the connection reach the server at all (network / certificate errors) or did it fail later (login, database, object)?', 'Hỏi trước: kết nối có tới được máy chủ chưa (lỗi mạng / chứng chỉ) hay hỏng ở bước sau (đăng nhập, CSDL, đối tượng)?'], ['Error 18456 is always about the LOGIN; Msg 208 is always about the CURRENT DATABASE.', 'Lỗi 18456 luôn về ĐĂNG NHẬP; Msg 208 luôn về CSDL HIỆN TẠI.']],
    lhg: [['Reinstalling SQL Server for a certificate or login-mode problem — both are one setting.', 'Cài lại SQL Server vì lỗi chứng chỉ hay chế độ đăng nhập — cả hai chỉ là một tuỳ chọn.'], ['Thinking Msg 208 means the table is gone — usually the window is still on master.', 'Tưởng Msg 208 là mất bảng — thường là cửa sổ vẫn đang ở master.']],
    tn: [tn('Mixed Mode authentication', 'xác thực hỗn hợp', 'Cho phép cả đăng nhập Windows lẫn đăng nhập SQL (sa + mật khẩu).')],
  }),
  cs({
    t: 'Which server image and which client, on which machine?', k: 'EASY', p: 6, loai: 'table',
    kn: ['Docker', 'SQL Server tools'], tag: ['setup'],
    en: '<p>Fill the table: for each machine, the SQL Server you run and the tool you query it with (lesson "Start here 2/2", sections 1 and 4).</p>',
    vi: '<p>Điền bảng: với mỗi máy, chạy SQL Server nào và truy vấn bằng công cụ nào (bài "Bắt đầu 2/2", mục 1 và 4).</p>',
    bang: [bang1('b1', ['Machine → server → client', 'Máy → máy chủ → công cụ'],
      [{ ma: 'may', ten: 'Machine / Máy' }, { ma: 'sv', ten: 'SQL Server to run / Chạy máy chủ nào', luaChon: ['installer of SQL Server 2022 Developer', 'Docker mcr.microsoft.com/mssql/server:2022-latest', 'Docker mcr.microsoft.com/azure-sql-edge'] }, { ma: 'cc', ten: 'Client / Công cụ', luaChon: ['SSMS', 'VS Code + SQL Server (mssql) extension'] }],
      [{ o: { may: 'Windows 11 laptop (x64)' }, a: { sv: 'installer of SQL Server 2022 Developer', cc: 'SSMS' } },
        { o: { may: 'MacBook Air M3 (arm64)' }, a: { sv: 'Docker mcr.microsoft.com/azure-sql-edge', cc: 'VS Code + SQL Server (mssql) extension' } },
        { o: { may: 'iMac 2019 (Intel x86_64)' }, a: { sv: 'Docker mcr.microsoft.com/mssql/server:2022-latest', cc: 'VS Code + SQL Server (mssql) extension' } }],
      ['SQL Server has no macOS build, so a Mac always runs it in Docker; arm64 Macs use the arm64 Azure SQL Edge image (or Rosetta). SSMS is Windows-only — on a Mac use the VS Code mssql extension.', 'SQL Server không có bản macOS nên Mac luôn chạy trong Docker; Mac arm64 dùng image Azure SQL Edge (hoặc Rosetta). SSMS chỉ có trên Windows — trên Mac dùng extension mssql của VS Code.'])],
    gy: [['SSMS exists only on Windows.', 'SSMS chỉ có trên Windows.'], ['The official mssql/server image is x86_64 only.', 'Image mssql/server chính thức chỉ có x86_64.']],
    lhg: [['Choosing SSMS on a Mac — there is no macOS version.', 'Chọn SSMS trên Mac — không có bản macOS.'], ['Running mssql/server on Apple Silicon without Rosetta — "exec format error".', 'Chạy mssql/server trên Apple Silicon không bật Rosetta — "exec format error".']],
  }),
]);
