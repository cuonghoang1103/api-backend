/**
 * DBI202 · 5.4 Thực hành Chương 5 — luyện như câu 1–2 đề PE: CSDL bán hàng từ đoạn mô tả (SQL Server thật: IDENTITY,
 * DEFAULT GETDATE, UNIQUE có lọc), ALTER bảng đã có dữ liệu, thêm luật cho FUHCompany, xoá cả FUHCompany đúng thứ tự,
 * NULL/LIKE/ngày, đề PE mini câu lạc bộ (SQL Server thật: mẫu LIKE '[0-9]').
 */
import { mod, de, cs, q, kq, kqAn, sau, chan, duoc, ma, tsql, ck, FUH, TN, tn } from './_chung.mjs';

const BAN_HANG = `CREATE TABLE Customer (
    customerID CHAR(5)       NOT NULL,
    fullName   NVARCHAR(50)  NOT NULL,
    email      VARCHAR(100)  NULL,
    city       NVARCHAR(30)  NOT NULL CONSTRAINT df_customer_city DEFAULT N'Hà Nội',
    CONSTRAINT pk_customer PRIMARY KEY (customerID)
);
-- "optional but never shared": a UNIQUE constraint would allow only ONE NULL on SQL Server ⇒ filtered unique index
CREATE UNIQUE INDEX uq_customer_email ON Customer (email) WHERE email IS NOT NULL;
CREATE TABLE Product (
    productID   INT IDENTITY(1,1) NOT NULL,
    productName NVARCHAR(100) NOT NULL,
    price       DECIMAL(12,0) NOT NULL,
    stock       INT           NOT NULL CONSTRAINT df_product_stock DEFAULT 0,
    CONSTRAINT pk_product       PRIMARY KEY (productID),
    CONSTRAINT uq_product_name  UNIQUE (productName),
    CONSTRAINT ck_product_price CHECK (price > 0),
    CONSTRAINT ck_product_stock CHECK (stock >= 0)
);
CREATE TABLE Orders (
    orderID    INT IDENTITY(1,1) NOT NULL,
    customerID CHAR(5)     NOT NULL,
    orderDate  DATE        NOT NULL CONSTRAINT df_orders_date DEFAULT CAST(GETDATE() AS DATE),
    status     VARCHAR(10) NOT NULL CONSTRAINT df_orders_status DEFAULT 'NEW',
    CONSTRAINT pk_orders          PRIMARY KEY (orderID),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customerID) REFERENCES Customer (customerID),
    CONSTRAINT ck_orders_status   CHECK (status IN ('NEW', 'PAID', 'CANCELLED'))
);
CREATE TABLE OrderLine (
    orderID   INT           NOT NULL,
    productID INT           NOT NULL,
    quantity  INT           NOT NULL,
    unitPrice DECIMAL(12,0) NOT NULL,
    CONSTRAINT pk_orderline         PRIMARY KEY (orderID, productID),
    CONSTRAINT fk_orderline_orders  FOREIGN KEY (orderID)   REFERENCES Orders (orderID),
    CONSTRAINT fk_orderline_product FOREIGN KEY (productID) REFERENCES Product (productID),
    CONSTRAINT ck_orderline_qty     CHECK (quantity > 0)
);`;
// thân kiểm: n lệnh phải bị từ chối
const BI_CHAN = (lenh) => `DECLARE @n INT = 0;
BEGIN TRAN;
${lenh.map((l) => `BEGIN TRY ${l}; END TRY BEGIN CATCH SET @n += 1; END CATCH;`).join('\n')}
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@n = ${lenh.length}, 1, 0); SET @info = CONCAT(@n, N' of ${lenh.length} invalid statements were rejected');`;

const CLB = `CREATE TABLE Club (
    clubID      INT          NOT NULL,
    clubName    NVARCHAR(60) NOT NULL,
    foundedDate DATE         NULL,
    CONSTRAINT pk_club      PRIMARY KEY (clubID),
    CONSTRAINT uq_club_name UNIQUE (clubName)
);
CREATE TABLE Student (
    studentID CHAR(8)      NOT NULL,
    fullName  NVARCHAR(50) NOT NULL,
    CONSTRAINT pk_student    PRIMARY KEY (studentID),
    CONSTRAINT ck_student_id CHECK (studentID LIKE 'SE[0-9][0-9][0-9][0-9][0-9][0-9]')   -- T-SQL character class
);
CREATE TABLE Membership (
    studentID CHAR(8)      NOT NULL,
    clubID    INT          NOT NULL,
    joinDate  DATE         NOT NULL CONSTRAINT df_membership_join DEFAULT CAST(GETDATE() AS DATE),
    role      NVARCHAR(20) NOT NULL CONSTRAINT df_membership_role DEFAULT N'Thành viên',
    CONSTRAINT pk_membership         PRIMARY KEY (studentID, clubID),
    CONSTRAINT fk_membership_student FOREIGN KEY (studentID) REFERENCES Student (studentID),
    CONSTRAINT fk_membership_club    FOREIGN KEY (clubID)    REFERENCES Club (clubID),
    CONSTRAINT ck_membership_role    CHECK (role IN (N'Chủ nhiệm', N'Phó chủ nhiệm', N'Thành viên'))
);
CREATE TABLE Event (
    clubID    INT           NOT NULL,
    eventNo   INT           NOT NULL,
    title     NVARCHAR(100) NOT NULL,
    eventDate DATE          NOT NULL,
    CONSTRAINT pk_event      PRIMARY KEY (clubID, eventNo),
    CONSTRAINT fk_event_club FOREIGN KEY (clubID) REFERENCES Club (clubID) ON DELETE CASCADE
);`;

const KH = String.raw`
CREATE TABLE Customer (
  customerID CHAR(5)      NOT NULL PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL,
  email      VARCHAR(100) NULL
);
INSERT INTO Customer VALUES ('KH001', N'Trang', 'trang@gmail.com'), ('KH002', N'Hải', 'hai.tran'), ('KH003', N'Long', NULL);
`;

export default mod('dbi202-on-ch5', '5.4 Practice: SQL DDL like PE questions 1 and 2', [
  tsql({
    t: 'Exercise 1 — a small sales database from a description', k: 'HARD', p: 25,
    kn: ['IDENTITY', 'named DEFAULT', 'CHECK IN', 'filtered unique index', 'M:N table'], tag: ['ddl', 'pe-q1', 'identity'],
    lyDo: ['The description needs SQL Server features — IDENTITY, DEFAULT CAST(GETDATE() AS DATE), NVARCHAR and a filtered unique index — and the behaviour of UNIQUE with NULLs is exactly where SQL Server differs from the browser engine.', 'Đoạn mô tả cần tính năng của SQL Server — IDENTITY, DEFAULT CAST(GETDATE() AS DATE), NVARCHAR và chỉ mục duy nhất có lọc — và cách UNIQUE xử lý NULL chính là chỗ SQL Server khác máy chấm trình duyệt.'],
    en: '<p>A shop stores its <b>customers</b> (code of exactly 5 characters, full name compulsory, e-mail — optional but never shared by two customers, city — Hà Nội if not given), its <b>products</b> (number generated automatically, name compulsory and unique, price greater than 0, stock never negative and 0 by default), its <b>orders</b> (number generated automatically, the customer who ordered — compulsory, order date — today by default, status NEW / PAID / CANCELLED, NEW by default) and the <b>order lines</b> (which product, in which order, quantity greater than 0, unit price). A product appears at most once in an order.</p><p>Tables: <code>Customer(customerID, fullName, email, city)</code>, <code>Product(productID, productName, price, stock)</code>, <code>Orders(orderID, customerID, orderDate, status)</code>, <code>OrderLine(orderID, productID, quantity, unitPrice)</code>.</p>',
    vi: '<p>Một cửa hàng lưu <b>khách hàng</b> (mã đúng 5 ký tự, họ tên bắt buộc, e-mail — không bắt buộc nhưng không hai khách dùng chung, thành phố — Hà Nội nếu không ghi), <b>sản phẩm</b> (số tự sinh, tên bắt buộc và không trùng, giá &gt; 0, tồn kho không âm mặc định 0), <b>đơn hàng</b> (số tự sinh, khách đặt — bắt buộc, ngày đặt — mặc định hôm nay, trạng thái NEW / PAID / CANCELLED, mặc định NEW) và <b>dòng đơn</b> (sản phẩm nào, đơn nào, số lượng &gt; 0, đơn giá). Một sản phẩm xuất hiện tối đa một lần trong một đơn.</p><p>Bảng như bản tiếng Anh.</p>',
    yc: [['IDENTITY(1,1) for productID and orderID; named DEFAULTs; CHECK … IN for status.', 'IDENTITY(1,1) cho productID và orderID; DEFAULT có tên; CHECK … IN cho status.'], ['"Optional but never shared": two customers WITHOUT e-mail must be allowed — think about what a UNIQUE constraint does with NULLs on SQL Server.', '"Không bắt buộc nhưng không dùng chung": phải cho phép hai khách KHÔNG có e-mail — nghĩ xem ràng buộc UNIQUE xử lý NULL thế nào trên SQL Server.']],
    setup: `-- (no sample tables — you create the four tables yourself)`,
    khoi: `-- CREATE TABLE Customer ( ... );
-- CREATE TABLE Product  ( ... );
-- CREATE TABLE Orders   ( ... );
-- CREATE TABLE OrderLine ( ... );
`,
    giai: BAN_HANG,
    kiem: [
      ck(['Defaults: city Hà Nội, stock 0, status NEW, orderDate today; ids generated', 'Mặc định: city Hà Nội, stock 0, status NEW, orderDate hôm nay; id tự sinh'], `BEGIN TRAN;
INSERT INTO dbo.Customer (customerID, fullName) VALUES ('KH001', N'An');
INSERT INTO dbo.Product (productName, price) VALUES (N'Bút bi', 5000);
INSERT INTO dbo.Orders (customerID) VALUES ('KH001');
SET @ok = IIF((SELECT city FROM dbo.Customer WHERE customerID = 'KH001') = N'Hà Nội'
  AND (SELECT stock FROM dbo.Product WHERE productName = N'Bút bi') = 0
  AND EXISTS (SELECT 1 FROM dbo.Orders WHERE customerID = 'KH001' AND status = 'NEW' AND orderDate = CAST(GETDATE() AS DATE) AND orderID IS NOT NULL), 1, 0);
SET @info = N'a row inserted with only the compulsory columns must get the defaults';
ROLLBACK;`),
      ck(['Two customers without e-mail are allowed; a shared e-mail is rejected', 'Hai khách không e-mail được phép; e-mail dùng chung bị từ chối'], `DECLARE @hai BIT = 0, @trung BIT = 0;
BEGIN TRAN;
BEGIN TRY INSERT INTO dbo.Customer (customerID, fullName) VALUES ('KH001', N'An'), ('KH002', N'Bình'); SET @hai = 1; END TRY BEGIN CATCH END CATCH;
BEGIN TRY INSERT INTO dbo.Customer (customerID, fullName, email) VALUES ('KH003', N'Chi', 'x@a.vn'), ('KH004', N'Dũng', 'x@a.vn'); END TRY BEGIN CATCH SET @trung = 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@hai = 1 AND @trung = 1, 1, 0);
SET @info = CONCAT(N'two NULL e-mails accepted: ', @hai, N' · duplicate e-mail rejected: ', @trung, N' — a UNIQUE constraint allows only one NULL on SQL Server');`),
      ck(['Product rules: price 0, negative stock and a duplicate name are rejected', 'Luật sản phẩm: giá 0, tồn âm, tên trùng bị từ chối'], BI_CHAN(["INSERT INTO dbo.Product (productName, price) VALUES (N'A', 0)", "INSERT INTO dbo.Product (productName, price, stock) VALUES (N'B', 10, -1)", "INSERT INTO dbo.Product (productName, price) VALUES (N'C', 10), (N'C', 20)"])),
      ck(['Order rules: unknown customer, status SHIPPED, quantity 0, same product twice are rejected', 'Luật đơn: khách lạ, trạng thái SHIPPED, số lượng 0, trùng sản phẩm bị từ chối'], `BEGIN TRAN;
INSERT INTO dbo.Customer (customerID, fullName) VALUES ('KH001', N'An');
INSERT INTO dbo.Product (productName, price) VALUES (N'Bút', 5000);
INSERT INTO dbo.Orders (customerID) VALUES ('KH001');
DECLARE @o INT = SCOPE_IDENTITY(), @p INT = (SELECT MAX(productID) FROM dbo.Product);
DECLARE @n INT = 0;
BEGIN TRY INSERT INTO dbo.Orders (customerID) VALUES ('KH999'); END TRY BEGIN CATCH SET @n += 1; END CATCH;
BEGIN TRY INSERT INTO dbo.Orders (customerID, status) VALUES ('KH001', 'SHIPPED'); END TRY BEGIN CATCH SET @n += 1; END CATCH;
BEGIN TRY INSERT INTO dbo.OrderLine VALUES (@o, @p, 0, 5000); END TRY BEGIN CATCH SET @n += 1; END CATCH;
BEGIN TRY INSERT INTO dbo.OrderLine VALUES (@o, @p, 1, 5000), (@o, @p, 2, 5000); END TRY BEGIN CATCH SET @n += 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@n = 4, 1, 0); SET @info = CONCAT(@n, N' of 4 invalid statements were rejected');`),
      ck(['customerID is exactly CHAR(5); productID and orderID are IDENTITY', 'customerID đúng CHAR(5); productID và orderID là IDENTITY'], `SET @ok = IIF(EXISTS (SELECT 1 FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.Customer') AND c.name = N'customerID' AND t.name = N'char' AND c.max_length = 5)
  AND COLUMNPROPERTY(OBJECT_ID(N'dbo.Product'), 'productID', 'IsIdentity') = 1
  AND COLUMNPROPERTY(OBJECT_ID(N'dbo.Orders'), 'orderID', 'IsIdentity') = 1, 1, 0);
SET @info = N'expected customerID CHAR(5), productID and orderID IDENTITY';`),
    ],
    saiTay: [
      BAN_HANG.replace("CREATE UNIQUE INDEX uq_customer_email ON Customer (email) WHERE email IS NOT NULL;", "ALTER TABLE Customer ADD CONSTRAINT uq_customer_email UNIQUE (email);"),
      BAN_HANG.replace("CONSTRAINT df_orders_status DEFAULT 'NEW'", ''),
      BAN_HANG.replace('    CONSTRAINT pk_orderline         PRIMARY KEY (orderID, productID),\n', ''),
    ],
    gy: [['Read the paragraph phrase by phrase: "generated automatically" ⇒ IDENTITY, "by default" ⇒ DEFAULT, "never negative" ⇒ CHECK, "at most once" ⇒ a key.', 'Đọc từng cụm: "tự sinh" ⇒ IDENTITY, "mặc định" ⇒ DEFAULT, "không âm" ⇒ CHECK, "tối đa một lần" ⇒ khoá.'], ['Optional + unique on SQL Server: CREATE UNIQUE INDEX … ON Customer (email) WHERE email IS NOT NULL.', 'Không bắt buộc + duy nhất trên SQL Server: CREATE UNIQUE INDEX … ON Customer (email) WHERE email IS NOT NULL.']],
    lhg: [['CONSTRAINT … UNIQUE (email) — the second customer without an e-mail is rejected ("duplicate key value is (NULL)").', 'CONSTRAINT … UNIQUE (email) — khách thứ hai không có e-mail bị từ chối ("duplicate key value is (NULL)").'], ['Forgetting PRIMARY KEY (orderID, productID) on OrderLine — a product can appear twice in an order.', 'Quên PRIMARY KEY (orderID, productID) trên OrderLine — một sản phẩm xuất hiện hai lần trong đơn.']],
    gt: ['<p>On SQL Server a UNIQUE constraint treats NULLs as equal (only one allowed); the filtered unique index ignores NULL rows. PostgreSQL\'s UNIQUE allows many NULLs by default — a real portability trap.</p>', '<p>Trên SQL Server ràng buộc UNIQUE coi các NULL là bằng nhau (chỉ cho một); chỉ mục duy nhất có lọc bỏ qua dòng NULL. UNIQUE của PostgreSQL mặc định cho nhiều NULL — một cái bẫy chuyển đổi thật.</p>'],
    tn: [tn('filtered index', 'chỉ mục có lọc'), tn('named DEFAULT constraint', 'ràng buộc mặc định có tên')],
  }),
  de({
    csdl: KH, tenCsdl: 'Customer', ld: { en: '<p><b>Table</b> (tab <code>Customer.sql</code>): <code>Customer(customerID, fullName, email)</code> with KH001 (trang@gmail.com), KH002 (\'hai.tran\' — no @) and KH003 (no e-mail).</p>', vi: '<p><b>Bảng</b> (tab <code>Customer.sql</code>): <code>Customer(customerID, fullName, email)</code> với KH001 (trang@gmail.com), KH002 (\'hai.tran\' — thiếu @) và KH003 (không e-mail).</p>' },
    t: 'Exercise 3 — ALTER a table that already has rows', k: 'MEDIUM', p: 10,
    kn: ['ALTER TABLE ADD', 'fix data before adding a CHECK'], tag: ['ddl', 'alter'],
    en: "<p>(1) Add a column <code>phone VARCHAR(15)</code>. (2) Add the rule named <code>ck_customer_email</code>: an e-mail contains @ with something before and after it (<code>LIKE '%_@_%'</code>). It is refused while KH002 breaks it — so (3) first correct KH002 (its real address is <code>hai.tran@fpt.edu.vn</code>), then add the rule.</p>",
    vi: "<p>(1) Thêm cột <code>phone VARCHAR(15)</code>. (2) Thêm luật tên <code>ck_customer_email</code>: e-mail chứa @ có ký tự trước và sau (<code>LIKE '%_@_%'</code>). Luật bị từ chối khi KH002 còn vi phạm — nên (3) sửa KH002 trước (địa chỉ thật là <code>hai.tran@fpt.edu.vn</code>), rồi mới thêm luật.</p>",
    yc: [['Three statements in the right order: ALTER … ADD phone; UPDATE KH002; ALTER … ADD CONSTRAINT.', 'Ba câu đúng thứ tự: ALTER … ADD phone; UPDATE KH002; ALTER … ADD CONSTRAINT.'], ['KH003 (no e-mail) must stay valid — CHECK lets NULL through.', 'KH003 (không e-mail) phải vẫn hợp lệ — CHECK cho NULL qua.']],
    giai: `ALTER TABLE Customer ADD phone VARCHAR(15) NULL;
UPDATE Customer SET email = 'hai.tran@fpt.edu.vn' WHERE customerID = 'KH002';        -- fix the data first …
ALTER TABLE Customer ADD CONSTRAINT ck_customer_email CHECK (email LIKE '%_@_%');   -- … then the rule is accepted`,
    kiem: [
      sau(['Data after the change', 'Dữ liệu sau khi đổi'], 'SELECT customerID, email, phone FROM Customer'),
      chan(['A new bad e-mail is rejected', 'E-mail sai mới bị từ chối'], "INSERT INTO Customer (customerID, fullName, email) VALUES ('KH004', 'Ha', 'ha.gmail.com')", '23514'),
      chan(['An address with nothing after @ is rejected', 'Địa chỉ không có gì sau @ bị từ chối'], "INSERT INTO Customer (customerID, fullName, email) VALUES ('KH006', 'Minh', 'minh@')", '23514'),
      duoc(['A customer without e-mail is still accepted', 'Khách không e-mail vẫn được nhận'], "INSERT INTO Customer (customerID, fullName) VALUES ('KH005', 'Lan')"),
      sau(['The constraint has the required name', 'Ràng buộc có đúng tên'], "SELECT lower(constraint_name) AS name FROM information_schema.table_constraints WHERE lower(table_name) = 'customer' AND lower(constraint_name) = 'ck_customer_email'", { an: true }),
    ],
    sai: [
      "ALTER TABLE Customer ADD phone VARCHAR(15) NULL; DELETE FROM Customer WHERE customerID = 'KH002'; ALTER TABLE Customer ADD CONSTRAINT ck_customer_email CHECK (email LIKE '%_@_%');",
      "ALTER TABLE Customer ADD phone VARCHAR(15) NULL; UPDATE Customer SET email = 'hai.tran@fpt.edu.vn' WHERE customerID = 'KH002'; ALTER TABLE Customer ADD CONSTRAINT ck_customer_email CHECK (email LIKE '%@%');",
    ],
    gy: [["Find the offenders first: SELECT … WHERE NOT (email LIKE '%_@_%').", "Tìm dòng vi phạm trước: SELECT … WHERE NOT (email LIKE '%_@_%')."], ['Fix them with UPDATE, then ADD CONSTRAINT.', 'Sửa bằng UPDATE, rồi ADD CONSTRAINT.']],
    lhg: [['Deleting KH002 to make the rule pass — you lose a customer.', 'Xoá KH002 cho luật qua — mất một khách hàng.'], ["'%@%' — accepts '@' alone or 'x@'; the rule needs a character on each side.", "'%@%' — nhận cả '@' trơ trọi hay 'x@'; luật cần một ký tự ở mỗi bên."]],
    gt: ['<p>SQL Server checks a new constraint against every existing row (Msg 547 when one fails). Fix the data, never weaken the rule. (SQL Server also has WITH NOCHECK to skip old rows — avoid it: the optimizer then cannot trust the constraint.)</p>', '<p>SQL Server kiểm ràng buộc mới với mọi dòng đang có (Msg 547 khi có dòng hỏng). Sửa dữ liệu, đừng nới luật. (SQL Server có WITH NOCHECK để bỏ qua dòng cũ — tránh dùng: bộ tối ưu sẽ không tin ràng buộc đó nữa.)</p>'],
    tn: [TN.check],
  }),
  de({
    t: 'Exercise 4 — add business rules to FUHCompany', k: 'MEDIUM', p: 10,
    kn: ['ALTER TABLE ADD CONSTRAINT', 'table-level CHECK'], tag: ['ddl', 'constraints', 'fuhcompany'],
    en: "<p>Add two named rules to the live FUHCompany data: <code>ck_department_mgrdate</code> — a manager assignment date, when known, is not before 2000-01-01; <code>ck_workson_maxhours</code> — work hours are at most 60 per week (they are already ≥ 0).</p>",
    vi: "<p>Thêm hai luật có tên cho dữ liệu FUHCompany đang chạy: <code>ck_department_mgrdate</code> — ngày nhận chức trưởng phòng, nếu biết, không trước 2000-01-01; <code>ck_workson_maxhours</code> — giờ làm tối đa 60 mỗi tuần (đã ≥ 0 sẵn).</p>",
    yc: [['Two ALTER TABLE … ADD CONSTRAINT … CHECK (…).', 'Hai câu ALTER TABLE … ADD CONSTRAINT … CHECK (…).'], ['Existing rows satisfy both rules.', 'Các dòng đang có đều thoả hai luật.']],
    giai: `ALTER TABLE tblDepartment ADD CONSTRAINT ck_department_mgrdate CHECK (mgrAssDate >= '2000-01-01');  -- NULL passes (UNKNOWN)
ALTER TABLE tblWorksOn    ADD CONSTRAINT ck_workson_maxhours      CHECK (workHours <= 60);`,
    kiem: [
      chan(['An assignment date in 1999 is rejected', 'Ngày nhận chức năm 1999 bị từ chối'], "UPDATE tblDepartment SET mgrAssDate = '1999-12-31' WHERE depNum = 1", '23514'),
      chan(['61 hours is rejected', '61 giờ bị từ chối'], 'UPDATE tblWorksOn SET workHours = 61 WHERE empSSN = 30121050001 AND proNum = 1', '23514'),
      duoc(['A department without a manager date is still fine; 60 hours is fine', 'Phòng chưa có ngày nhận chức vẫn ổn; 60 giờ vẫn ổn'], "UPDATE tblDepartment SET mgrAssDate = NULL WHERE depNum = 5; UPDATE tblWorksOn SET workHours = 60 WHERE empSSN = 30121050001 AND proNum = 1"),
      sau(['Both constraints exist with their names', 'Cả hai ràng buộc có đúng tên'], "SELECT lower(constraint_name) AS name FROM information_schema.table_constraints WHERE lower(constraint_name) IN ('ck_department_mgrdate', 'ck_workson_maxhours')", { an: true }),
    ],
    sai: [
      "ALTER TABLE tblDepartment ADD CONSTRAINT ck_department_mgrdate CHECK (mgrAssDate >= '2000-01-01');",
      "ALTER TABLE tblDepartment ADD CONSTRAINT ck_department_mgrdate CHECK (mgrAssDate >= '2000-01-01' AND mgrAssDate IS NOT NULL); ALTER TABLE tblWorksOn ADD CONSTRAINT ck_workson_maxhours CHECK (workHours <= 60);",
    ],
    gy: [['ALTER TABLE t ADD CONSTRAINT name CHECK (condition).', 'ALTER TABLE t ADD CONSTRAINT tên CHECK (điều kiện).'], ['"When known" ⇒ do not forbid NULL — CHECK already lets UNKNOWN through.', '"Nếu biết" ⇒ đừng cấm NULL — CHECK vốn đã cho UNKNOWN qua.']],
    lhg: [['Adding IS NOT NULL to the CHECK — departments without a manager date are now rejected.', 'Thêm IS NOT NULL vào CHECK — phòng chưa có ngày nhận chức bị từ chối.'], ['Forgetting the second rule.', 'Quên luật thứ hai.']],
    gt: ['<p>Rules in the database protect every application at once. Name them: an error "conflicted with the CHECK constraint ck_workson_maxhours" explains itself.</p>', '<p>Luật nằm trong CSDL bảo vệ mọi ứng dụng cùng lúc. Đặt tên cho chúng: lỗi "conflicted with the CHECK constraint ck_workson_maxhours" tự giải thích.</p>'],
    tn: [TN.check],
  }),
  cs({
    t: 'Exercise 5 — drop the whole FUHCompany in a legal order', k: 'MEDIUM', p: 7,
    kn: ['DROP order', 'circular foreign key'], tag: ['ddl', 'drop', 'fuhcompany'],
    en: '<p>tblEmployee references tblDepartment (depNum) AND tblDepartment references tblEmployee (mgrSSN) — a cycle. Plan the teardown.</p>',
    vi: '<p>tblEmployee tham chiếu tblDepartment (depNum) VÀ tblDepartment tham chiếu tblEmployee (mgrSSN) — một vòng. Lên kế hoạch xoá.</p>',
    cau: [
      q('c1', ['Which statement must come before you can drop tblEmployee or tblDepartment?', 'Câu nào phải chạy trước khi xoá được tblEmployee hay tblDepartment?'], ['ALTER TABLE tblDepartment DROP CONSTRAINT fk_department_manager', 'DROP TABLE tblLocation', 'DELETE FROM tblEmployee', 'ALTER TABLE tblEmployee ADD CONSTRAINT …'], ['Break the cycle by dropping one of the two foreign keys; deleting rows does not remove a constraint.', 'Phá vòng bằng cách bỏ một trong hai khoá ngoại; xoá dòng không bỏ được ràng buộc.']),
      q('c2', ['Which table can be dropped FIRST without any error?', 'Bảng nào xoá ĐẦU TIÊN được mà không lỗi?'], ['tblDependent (nobody references it)', 'tblEmployee', 'tblDepartment', 'tblLocation'], ['A table that no foreign key points to can always be dropped.', 'Bảng không bị khoá ngoại nào trỏ tới thì luôn xoá được.']),
      q('c3', ['tblLocation is referenced by…', 'tblLocation bị bảng nào tham chiếu?'], ['tblDepLocation and tblProject', 'tblEmployee only', 'nothing', 'tblDependent'], ['Drop tblDepLocation and tblProject (after tblWorksOn) before tblLocation.', 'Xoá tblDepLocation và tblProject (sau tblWorksOn) trước tblLocation.']),
      q('c4', ['Why is "DELETE FROM tblEmployee" not enough to drop the table?', 'Vì sao "DELETE FROM tblEmployee" không đủ để xoá bảng?'], ['DROP is blocked by the foreign key constraints themselves, even on empty tables', 'Because DELETE without a WHERE is refused by SQL Server', 'Because DELETE is a DDL statement and cannot be undone', 'It is enough: an empty table can always be dropped'], ['Constraints, not rows, block a DROP.', 'Ràng buộc, không phải dữ liệu, chặn DROP.']),
    ],
    gy: [['List every FK and draw the arrows.', 'Liệt kê mọi khoá ngoại và vẽ mũi tên.'], ['A cycle must be cut with ALTER TABLE … DROP CONSTRAINT first.', 'Vòng phải được cắt bằng ALTER TABLE … DROP CONSTRAINT trước.']],
    lhg: [['Trying to drop tblDepartment while tblEmployee and tblProject still reference it.', 'Cố xoá tblDepartment khi tblEmployee và tblProject còn tham chiếu nó.'], ['Thinking an empty table can always be dropped.', 'Tưởng bảng rỗng thì luôn xoá được.']],
    tn: [tn('circular reference', 'tham chiếu vòng')],
  }),
  de({
    t: 'Exercise 6 — NULL, LIKE and dates on FUHCompany', k: 'MEDIUM', p: 9,
    kn: ['NOT LIKE and NULL', 'date range'], tag: ['null', 'like', 'date', 'fuhcompany'],
    en: '<p>Employees born before 1990 who do <b>not</b> live in TP Hồ Chí Minh — an unknown address counts as "not in TP Hồ Chí Minh".</p>',
    vi: '<p>Nhân viên sinh trước 1990 và <b>không</b> sống ở TP Hồ Chí Minh — địa chỉ chưa biết tính là "không ở TP Hồ Chí Minh".</p>',
    yc: [['Columns: <code>empName, empAddress, empBirthdate</code>.', 'Cột: <code>empName, empAddress, empBirthdate</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT empName, empAddress, empBirthdate
FROM tblEmployee
WHERE empBirthdate < '1990-01-01'
  AND (empAddress IS NULL OR empAddress NOT LIKE N'%Hồ Chí Minh%');   -- NOT LIKE on NULL is UNKNOWN`,
    kiem: [kq(['Born before 1990, not in HCMC', 'Sinh trước 1990, không ở TP HCM']), kqAn(['An older employee with no address', 'Một nhân viên lớn tuổi chưa có địa chỉ'], "INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum) VALUES (30121050093, N'Tạ Văn Cao', NULL, 60000, 'M', '1970-01-01', 4)"), ma(['Uses NOT LIKE', 'Dùng NOT LIKE'], '\\bNOT\\s+LIKE\\b')],
    sai: [`SELECT empName, empAddress, empBirthdate FROM tblEmployee WHERE empBirthdate < '1990-01-01' AND empAddress NOT LIKE N'%Hồ Chí Minh%'`, `SELECT empName, empAddress, empBirthdate FROM tblEmployee WHERE empBirthdate < '1990-01-01' AND (empAddress IS NULL OR empAddress NOT LIKE N'%Hồ Chí Minh%') OR empBirthdate IS NULL`],
    gy: [['NOT LIKE on a NULL address is UNKNOWN — the row disappears.', 'NOT LIKE trên địa chỉ NULL là UNKNOWN — dòng biến mất.'], ['Parenthesise the OR: AND (addr IS NULL OR addr NOT LIKE …).', 'Đặt OR trong ngoặc: AND (addr IS NULL OR addr NOT LIKE …).']],
    lhg: [['Forgetting the NULL address case.', 'Quên trường hợp địa chỉ NULL.'], ['Mixing AND/OR without parentheses — AND binds tighter than OR.', 'Trộn AND/OR không có ngoặc — AND ưu tiên hơn OR.']],
    gt: ['<p>FUH data: Bùi Văn Nam has no address but was born in 1998, so the sample answer does not contain him; the hidden employee (born 1970, no address) must appear.</p>', '<p>Dữ liệu FUH: Bùi Văn Nam không có địa chỉ nhưng sinh 1998 nên không có trong đáp án mẫu; nhân viên ẩn (sinh 1970, không địa chỉ) phải xuất hiện.</p>'],
    tn: [TN.null],
  }),
  tsql({
    t: 'Exercise 7 — mini PE: student clubs, from ERD to tested tables', k: 'HARD', p: 20,
    kn: ["LIKE 'SE[0-9]…'", 'DEFAULT GETDATE', 'weak entity with CASCADE', 'M:N with attributes'], tag: ['ddl', 'pe-q1'],
    lyDo: ["The student-ID rule uses the T-SQL character class LIKE 'SE[0-9][0-9]…' and the join date defaults to GETDATE() — both SQL Server only.", "Luật mã sinh viên dùng lớp ký tự T-SQL LIKE 'SE[0-9][0-9]…' và ngày tham gia mặc định GETDATE() — cả hai chỉ có ở SQL Server."],
    en: '<p>A club has a number, a unique name and a founding date. A student has an ID of the form <b>SE + 6 digits</b> and a name. A student joins many clubs and a club has many members; for each membership store the join date (today by default) and the role (Chủ nhiệm, Phó chủ nhiệm or Thành viên — Thành viên by default). A club organises events numbered 1, 2, 3… inside each club (every club has its own event 1) with a title and a date; when a club is deleted its events disappear with it.</p><p>Tables: <code>Club(clubID, clubName, foundedDate)</code>, <code>Student(studentID CHAR(8), fullName)</code>, <code>Membership(studentID, clubID, joinDate, role)</code>, <code>Event(clubID, eventNo, title, eventDate)</code>.</p>',
    vi: '<p>CLB có số, tên duy nhất và ngày thành lập. Sinh viên có mã dạng <b>SE + 6 chữ số</b> và tên. Sinh viên tham gia nhiều CLB, CLB có nhiều thành viên; mỗi lần tham gia lưu ngày tham gia (mặc định hôm nay) và vai trò (Chủ nhiệm, Phó chủ nhiệm hoặc Thành viên — mặc định Thành viên). CLB tổ chức sự kiện đánh số 1, 2, 3… trong từng CLB (CLB nào cũng có sự kiện 1) với tiêu đề và ngày; xoá CLB thì các sự kiện mất theo.</p><p>Bảng như bản tiếng Anh.</p>',
    yc: [["CHECK (studentID LIKE 'SE[0-9][0-9][0-9][0-9][0-9][0-9]').", "CHECK (studentID LIKE 'SE[0-9][0-9][0-9][0-9][0-9][0-9]')."], ['Event is weak: key (clubID, eventNo), FK to Club ON DELETE CASCADE.', 'Event là thực thể yếu: khoá (clubID, eventNo), FK tới Club ON DELETE CASCADE.']],
    setup: `-- (no sample tables)`,
    khoi: `-- CREATE TABLE Club ( ... );
-- CREATE TABLE Student ( ... );
-- CREATE TABLE Membership ( ... );
-- CREATE TABLE Event ( ... );
`,
    giai: CLB,
    kiem: [
      ck(['A valid student, membership with defaults, and events of two clubs', 'Sinh viên hợp lệ, tham gia với mặc định, sự kiện của hai CLB'], `BEGIN TRAN;
INSERT INTO dbo.Club (clubID, clubName, foundedDate) VALUES (1, N'CLB Guitar', '2015-09-01'), (2, N'CLB Lập trình', '2018-03-15');
INSERT INTO dbo.Student VALUES ('SE123456', N'Nguyễn Văn Cường');
INSERT INTO dbo.Membership (studentID, clubID) VALUES ('SE123456', 2);
INSERT INTO dbo.Event VALUES (2, 1, N'Hackathon', '2026-10-20'), (1, 1, N'Đêm nhạc', '2026-11-05');
SET @ok = IIF(EXISTS (SELECT 1 FROM dbo.Membership WHERE studentID = 'SE123456' AND clubID = 2 AND role = N'Thành viên' AND joinDate = CAST(GETDATE() AS DATE)), 1, 0);
SET @info = N'the membership must get role Thành viên and today''s date by default';
ROLLBACK;`),
      ck(['Student IDs that are not SE + 6 digits are rejected', 'Mã sinh viên không đúng SE + 6 chữ số bị từ chối'], BI_CHAN(["INSERT INTO dbo.Student VALUES ('SE12AB56', N'Sai định dạng')", "INSERT INTO dbo.Student VALUES ('HE123456', N'Sai tiền tố')"])),
      ck(['An unknown role and a duplicate club name are rejected', 'Vai trò lạ và tên CLB trùng bị từ chối'], `BEGIN TRAN;
INSERT INTO dbo.Club (clubID, clubName) VALUES (1, N'CLB Guitar');
INSERT INTO dbo.Student VALUES ('SE123456', N'An');
DECLARE @n INT = 0;
BEGIN TRY INSERT INTO dbo.Membership (studentID, clubID, role) VALUES ('SE123456', 1, N'Thủ quỹ'); END TRY BEGIN CATCH SET @n += 1; END CATCH;
BEGIN TRY INSERT INTO dbo.Club (clubID, clubName) VALUES (2, N'CLB Guitar'); END TRY BEGIN CATCH SET @n += 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@n = 2, 1, 0); SET @info = CONCAT(@n, N' of 2 invalid statements were rejected');`),
      ck(['Deleting a club deletes its events; event numbers restart in each club', 'Xoá CLB thì xoá sự kiện; số sự kiện bắt đầu lại ở mỗi CLB'], `BEGIN TRAN;
INSERT INTO dbo.Club (clubID, clubName) VALUES (1, N'A'), (2, N'B');
INSERT INTO dbo.Event VALUES (1, 1, N'x', '2026-01-01'), (1, 2, N'y', '2026-01-02'), (2, 1, N'z', '2026-01-03');
DELETE FROM dbo.Club WHERE clubID = 1;
SET @ok = IIF((SELECT COUNT(*) FROM dbo.Event) = 1, 1, 0);
SET @info = CONCAT(N'events left: ', (SELECT COUNT(*) FROM dbo.Event), N' (expected 1)');
IF @@TRANCOUNT > 0 ROLLBACK;`),
    ],
    saiTay: [
      CLB.replace("CHECK (studentID LIKE 'SE[0-9][0-9][0-9][0-9][0-9][0-9]')", "CHECK (studentID LIKE 'SE%')"),
      CLB.replace('REFERENCES Club (clubID) ON DELETE CASCADE', 'REFERENCES Club (clubID)'),
      CLB.replace("CONSTRAINT df_membership_role DEFAULT N'Thành viên'", ''),
    ],
    gy: [["T-SQL LIKE accepts character classes: [0-9] = one digit.", "LIKE của T-SQL nhận lớp ký tự: [0-9] = một chữ số."], ['Membership = M:N with attributes; Event = weak entity (owner key + number).', 'Membership = M:N có thuộc tính; Event = thực thể yếu (khoá chủ + số).']],
    lhg: [["LIKE 'SE%' — accepts SE12AB56.", "LIKE 'SE%' — nhận cả SE12AB56."], ['No ON DELETE CASCADE on Event — a club with events cannot be deleted.', 'Không ON DELETE CASCADE ở Event — CLB có sự kiện không xoá được.']],
    gt: ["<p>On PostgreSQL the same ID rule is written with a regular expression: <code>CHECK (studentID ~ '^SE[0-9]{6}$')</code>.</p>", "<p>Trên PostgreSQL cùng luật mã viết bằng biểu thức chính quy: <code>CHECK (studentID ~ '^SE[0-9]{6}$')</code>.</p>"],
    tn: [tn('character class [0-9]', 'lớp ký tự [0-9]')],
  }),
]);
