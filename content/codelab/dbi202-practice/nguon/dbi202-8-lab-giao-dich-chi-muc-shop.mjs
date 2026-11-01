/**
 * DBI202 · Chương 8 — LAB 8: giao dịch, chỉ mục & view cho cửa hàng CT Shop trên SQL Server — đặt hàng nguyên tử (IDENTITY +
 * SCOPE_IDENTITY + tồn kho), chỉ mục phủ cho báo cáo, chỉ mục duy nhất có lọc, view WITH CHECK OPTION, lưu trữ đơn cũ nguyên tử.
 * Chạy trên SQL Server của người học (check.sql chấm từng câu).
 */
import { doiDau, KHOA, tsql, ck, tuChoi, giongNhau, tn } from './_chung.mjs';

const SHOP = `CREATE TABLE Customer (customerID INT NOT NULL PRIMARY KEY, fullName NVARCHAR(50) NOT NULL, email VARCHAR(100) NULL);
CREATE TABLE Product (productID INT NOT NULL PRIMARY KEY, productName NVARCHAR(80) NOT NULL, price DECIMAL(12,0) NOT NULL CHECK (price > 0),
                      stock INT NOT NULL CONSTRAINT ck_product_stock CHECK (stock >= 0));
CREATE TABLE Orders (orderID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, customerID INT NOT NULL REFERENCES Customer (customerID),
                     orderDate DATE NOT NULL, status VARCHAR(10) NOT NULL CHECK (status IN ('NEW', 'PAID', 'CANCELLED')),
                     total DECIMAL(12,0) NOT NULL DEFAULT 0);
CREATE TABLE OrderLine (orderID INT NOT NULL REFERENCES Orders (orderID), productID INT NOT NULL REFERENCES Product (productID),
                        qty INT NOT NULL CHECK (qty > 0), unitPrice DECIMAL(12,0) NOT NULL, PRIMARY KEY (orderID, productID));
CREATE TABLE OrdersArchive (orderID INT NOT NULL PRIMARY KEY, customerID INT NOT NULL, orderDate DATE NOT NULL, status VARCHAR(10) NOT NULL, total DECIMAL(12,0) NOT NULL);
INSERT INTO Customer VALUES (1, N'An', 'an@ctshop.vn'), (2, N'Bình', NULL), (3, N'Chi', 'chi@ctshop.vn');
INSERT INTO Product VALUES (10, N'Bút bi Thiên Long', 5000, 100), (11, N'Máy tính Casio FX-580VN X', 705000, 2), (12, N'Sổ tay Moleskine', 590000, 0);
SET IDENTITY_INSERT Orders ON;
INSERT INTO Orders (orderID, customerID, orderDate, status, total) VALUES
 (1, 1, '2026-08-03', 'PAID', 15000), (2, 2, '2026-08-20', 'CANCELLED', 705000), (3, 1, '2026-09-12', 'NEW', 705000), (4, 3, '2026-10-01', 'PAID', 10000);
SET IDENTITY_INSERT Orders OFF;
INSERT INTO OrderLine VALUES (1, 10, 3, 5000), (2, 11, 1, 705000), (3, 11, 1, 705000), (4, 10, 2, 5000);`;

const GIAI = `-- Q1 ─ place an order atomically
CREATE OR ALTER PROCEDURE prPlaceOrder
    @customerID INT, @productID INT, @qty INT,
    @orderID    INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET @orderID = NULL;
    BEGIN TRY
        BEGIN TRANSACTION;
            DECLARE @price DECIMAL(12,0) = (SELECT price FROM Product WHERE productID = @productID);
            INSERT INTO Orders (customerID, orderDate, status, total)
            VALUES (@customerID, CAST(GETDATE() AS DATE), 'NEW', @qty * @price);
            SET @orderID = SCOPE_IDENTITY();                                   -- the id just generated in THIS scope
            INSERT INTO OrderLine (orderID, productID, qty, unitPrice) VALUES (@orderID, @productID, @qty, @price);
            UPDATE Product SET stock = stock - @qty WHERE productID = @productID; -- CHECK (stock >= 0) refuses an over-sale
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        SET @orderID = NULL;
        RETURN -1;
    END CATCH
END
GO
-- Q2 ─ covering index for "orders of a customer, newest first"
CREATE NONCLUSTERED INDEX ix_orders_customer_date ON Orders (customerID, orderDate) INCLUDE (total);
GO
-- Q3 ─ e-mail optional but unique: filtered unique index (a UNIQUE constraint would allow only one NULL)
CREATE UNIQUE INDEX ux_customer_email ON Customer (email) WHERE email IS NOT NULL;
GO
-- Q4 ─ the order desk only sees and edits NEW orders
CREATE OR ALTER VIEW vOpenOrders AS
SELECT orderID, customerID, orderDate, status, total
FROM Orders
WHERE status = 'NEW'
WITH CHECK OPTION;
GO
-- Q5 ─ move finished orders older than @before into the archive, all or nothing
CREATE OR ALTER PROCEDURE prArchiveOrders
    @before DATE,
    @moved  INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION;
        INSERT INTO OrdersArchive (orderID, customerID, orderDate, status, total)
        SELECT orderID, customerID, orderDate, status, total
        FROM Orders WHERE orderDate < @before AND status IN ('PAID', 'CANCELLED');
        SET @moved = @@ROWCOUNT;
        DELETE FROM OrderLine WHERE orderID IN (SELECT orderID FROM OrdersArchive);
        DELETE FROM Orders    WHERE orderID IN (SELECT orderID FROM OrdersArchive);
    COMMIT TRANSACTION;
END`;
const COLS = `SELECT c.name AS col, ic.key_ordinal, ic.is_included_column FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE i.object_id = OBJECT_ID(N'dbo.Orders') AND i.name = N'ix_orders_customer_date'`;

export default doiDau({
  slug: 'dbi202-8-lab-giao-dich-chi-muc-shop',
  ten: 'Lab 8 — CT Shop on SQL Server: transactions, indexes & views',
  khoa: KHOA,
  baiHoc: 'dbi202-on-ch8',
  de: [
    tsql({
      t: 'Lab 8 — CT Shop: atomic orders, covering & filtered indexes, a checked view, archiving (5 questions)', k: 'HARD', p: 80, dangBai: 'lab', diem: 100,
      kn: ['transaction + SCOPE_IDENTITY', 'covering index', 'filtered unique index', 'WITH CHECK OPTION', 'atomic archive'], tag: ['lab', 'tsql', 'transaction', 'index', 'view'],
      lyDo: ['Transactions, IDENTITY/SCOPE_IDENTITY, INCLUDE and filtered indexes are SQL Server features that the browser grader cannot run or inspect.', 'Giao dịch, IDENTITY/SCOPE_IDENTITY, INCLUDE và chỉ mục có lọc là tính năng SQL Server mà máy chấm trình duyệt không chạy hay soi được.'],
      en: `<p><b>DBI202 · Chapter 8 — Transactions, indexes & views · Suggested time: 80 minutes · 10 marks (5 × 2).</b> CT Shop: <code>Customer(customerID, fullName, email NULL)</code>, <code>Product(productID, productName, price, stock ≥ 0)</code>, <code>Orders(orderID IDENTITY, customerID, orderDate, status NEW/PAID/CANCELLED, total)</code>, <code>OrderLine(orderID, productID, qty, unitPrice)</code>, <code>OrdersArchive</code> (same columns as Orders). Full script: <code>setup.sql</code>.</p>
<ol>
<li><b>Q1</b> — <code>prPlaceOrder @customerID, @productID, @qty, @orderID INT OUTPUT</code>: in ONE transaction insert an order (today, NEW, total = qty × price), its line (with the current price) and decrease the stock. Return the new orderID (SCOPE_IDENTITY()). If anything fails (not enough stock, unknown product…) nothing may remain, <code>@orderID</code> is NULL and the procedure RETURNs -1 without raising an error.</li>
<li><b>Q2</b> — index <code>ix_orders_customer_date</code> that fully covers <code>SELECT orderDate, total FROM Orders WHERE customerID = @c ORDER BY orderDate DESC</code>.</li>
<li><b>Q3</b> — e-mail is optional but never shared: <code>ux_customer_email</code> must allow many customers without e-mail and refuse a duplicate address.</li>
<li><b>Q4</b> — view <code>vOpenOrders</code> (orderID, customerID, orderDate, status, total) of NEW orders only, so that nobody can use it to change an order into another status.</li>
<li><b>Q5</b> — <code>prArchiveOrders @before DATE, @moved INT OUTPUT</code>: move every PAID or CANCELLED order dated before @before (with its lines) out of Orders/OrderLine into OrdersArchive, atomically; @moved = number of orders moved.</li>
</ol>`,
      vi: `<p><b>DBI202 · Chương 8 — Giao dịch, chỉ mục & view · Thời gian gợi ý: 80 phút · 10 điểm (5 × 2).</b> CT Shop: <code>Customer(customerID, fullName, email NULL)</code>, <code>Product(productID, productName, price, stock ≥ 0)</code>, <code>Orders(orderID IDENTITY, customerID, orderDate, status NEW/PAID/CANCELLED, total)</code>, <code>OrderLine(orderID, productID, qty, unitPrice)</code>, <code>OrdersArchive</code> (cùng cột với Orders). Script đầy đủ: <code>setup.sql</code>.</p>
<ol>
<li><b>Q1</b> — <code>prPlaceOrder @customerID, @productID, @qty, @orderID INT OUTPUT</code>: trong MỘT giao dịch chèn đơn (hôm nay, NEW, total = qty × giá), dòng đơn (giá hiện tại) và trừ tồn kho. Trả orderID mới (SCOPE_IDENTITY()). Nếu có gì hỏng (không đủ hàng, sản phẩm lạ…) thì không được còn gì, <code>@orderID</code> là NULL và procedure RETURN -1 mà không ném lỗi.</li>
<li><b>Q2</b> — chỉ mục <code>ix_orders_customer_date</code> phủ trọn <code>SELECT orderDate, total FROM Orders WHERE customerID = @c ORDER BY orderDate DESC</code>.</li>
<li><b>Q3</b> — e-mail không bắt buộc nhưng không dùng chung: <code>ux_customer_email</code> phải cho nhiều khách không có e-mail và từ chối địa chỉ trùng.</li>
<li><b>Q4</b> — view <code>vOpenOrders</code> (orderID, customerID, orderDate, status, total) chỉ các đơn NEW, sao cho không ai dùng nó để đổi đơn sang trạng thái khác.</li>
<li><b>Q5</b> — <code>prArchiveOrders @before DATE, @moved INT OUTPUT</code>: chuyển mọi đơn PAID hoặc CANCELLED trước ngày @before (kèm dòng đơn) ra khỏi Orders/OrderLine vào OrdersArchive, một cách nguyên tử; @moved = số đơn đã chuyển.</li>
</ol>`,
      yc: [['Object names exactly as given; separate the objects with GO in solution.sql.', 'Tên đối tượng đúng như đề; tách các đối tượng bằng GO trong solution.sql.'], ['check.sql prints PASS/FAIL per question.', 'check.sql in PASS/FAIL theo từng câu.']],
      setup: SHOP,
      khoi: `-- Q1: CREATE OR ALTER PROCEDURE prPlaceOrder ...
GO
-- Q2: CREATE NONCLUSTERED INDEX ix_orders_customer_date ...
GO
-- Q3: CREATE UNIQUE INDEX ux_customer_email ...
GO
-- Q4: CREATE OR ALTER VIEW vOpenOrders ...
GO
-- Q5: CREATE OR ALTER PROCEDURE prArchiveOrders ...
`,
      giai: GIAI,
      kiem: [
        ck(['Q1 · a valid order: new id returned, line written, stock 100 → 97, total 15,000', 'Q1 · đơn hợp lệ: trả id mới, có dòng đơn, kho 100 → 97, tổng 15.000'], `DECLARE @id INT, @rc INT; BEGIN TRAN; EXEC @rc = dbo.prPlaceOrder 2, 10, 3, @id OUTPUT;
SET @ok = IIF(@rc = 0 AND @id IS NOT NULL AND EXISTS (SELECT 1 FROM Orders WHERE orderID = @id AND customerID = 2 AND status = 'NEW' AND total = 15000)
  AND EXISTS (SELECT 1 FROM OrderLine WHERE orderID = @id AND productID = 10 AND qty = 3 AND unitPrice = 5000) AND (SELECT stock FROM Product WHERE productID = 10) = 97, 1, 0);
SET @info = CONCAT(N'rc=', @rc, N' orderID=', @id); IF @@TRANCOUNT > 0 ROLLBACK;`),
        ck(['Q1 · not enough stock: -1, NULL id, no order and no line left', 'Q1 · không đủ hàng: -1, id NULL, không sót đơn hay dòng đơn'], `DECLARE @id INT, @rc INT, @before INT = (SELECT COUNT(*) FROM Orders), @thoat BIT = 0;
BEGIN TRY EXEC @rc = dbo.prPlaceOrder 1, 11, 5, @id OUTPUT; END TRY BEGIN CATCH SET @thoat = 1; END CATCH;
WHILE @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@thoat = 0 AND @rc = -1 AND @id IS NULL AND (SELECT COUNT(*) FROM Orders) = @before AND (SELECT stock FROM Product WHERE productID = 11) = 2, 1, 0);
SET @info = CONCAT(N'rc=', @rc, N' id=', COALESCE(CAST(@id AS NVARCHAR(10)), N'NULL'), N' orders=', (SELECT COUNT(*) FROM Orders), IIF(@thoat = 1, N' (an error escaped)', N''));`),
        ck(['Q2 · key (customerID, orderDate), total INCLUDEd', 'Q2 · khoá (customerID, orderDate), total INCLUDE'], `SET @ok = IIF(EXISTS (SELECT 1 FROM (${COLS}) x WHERE x.col = N'customerID' AND x.key_ordinal = 1) AND EXISTS (SELECT 1 FROM (${COLS}) x WHERE x.col = N'orderDate' AND x.key_ordinal = 2)
  AND EXISTS (SELECT 1 FROM (${COLS}) x WHERE x.col = N'total' AND x.is_included_column = 1) AND (SELECT COUNT(*) FROM (${COLS}) x WHERE x.is_included_column = 0) = 2, 1, 0);
SET @info = N'expected ON Orders (customerID, orderDate) INCLUDE (total)';`),
        ck(['Q3 · two customers without e-mail are fine; a duplicate e-mail is refused', 'Q3 · hai khách không e-mail vẫn được; e-mail trùng bị từ chối'], `DECLARE @hai BIT = 0, @trung BIT = 0; BEGIN TRAN;
BEGIN TRY INSERT INTO Customer VALUES (4, N'Dũng', NULL), (5, N'Em', NULL); SET @hai = 1; END TRY BEGIN CATCH END CATCH;
BEGIN TRY INSERT INTO Customer VALUES (6, N'Giang', 'an@ctshop.vn'); END TRY BEGIN CATCH SET @trung = 1; END CATCH;
IF @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@hai = 1 AND @trung = 1 AND EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.Customer') AND name = N'ux_customer_email' AND is_unique = 1 AND has_filter = 1), 1, 0);
SET @info = CONCAT(N'NULLs accepted: ', @hai, N' · duplicate refused: ', @trung);`),
        ck(['Q4 · the view shows only NEW orders', 'Q4 · view chỉ hiện đơn NEW'], giongNhau('SELECT orderID, status FROM vOpenOrders', "SELECT orderID, status FROM Orders WHERE status = 'NEW'")),
        ck(['Q4 · changing an order to PAID through the view is refused', 'Q4 · đổi đơn sang PAID qua view bị từ chối'], tuChoi(["UPDATE vOpenOrders SET status = 'PAID' WHERE orderID = 3"])),
        ck(['Q5 · archive before 2026-09-01: orders 1 and 2 move, @moved = 2', 'Q5 · lưu trữ trước 2026-09-01: đơn 1 và 2 chuyển, @moved = 2'], `DECLARE @m INT; BEGIN TRAN; EXEC dbo.prArchiveOrders '2026-09-01', @m OUTPUT;
SET @ok = IIF(@m = 2 AND (SELECT COUNT(*) FROM OrdersArchive) = 2 AND NOT EXISTS (SELECT 1 FROM Orders WHERE orderID IN (1, 2)) AND NOT EXISTS (SELECT 1 FROM OrderLine WHERE orderID IN (1, 2))
  AND EXISTS (SELECT 1 FROM Orders WHERE orderID = 3), 1, 0);
SET @info = CONCAT(N'@moved = ', @m, N' · archived = ', (SELECT COUNT(*) FROM OrdersArchive)); IF @@TRANCOUNT > 0 ROLLBACK;`),
        ck(['Q5 · a NEW order is never archived, even when old', 'Q5 · đơn NEW không bao giờ bị lưu trữ, kể cả khi cũ'], `DECLARE @m INT; BEGIN TRAN; EXEC dbo.prArchiveOrders '2026-12-31', @m OUTPUT;
SET @ok = IIF(@m = 3 AND EXISTS (SELECT 1 FROM Orders WHERE orderID = 3) AND NOT EXISTS (SELECT 1 FROM OrdersArchive WHERE orderID = 3), 1, 0);
SET @info = CONCAT(N'@moved = ', @m); IF @@TRANCOUNT > 0 ROLLBACK;`),
      ],
      saiTay: [
        GIAI.replace('            SET @orderID = SCOPE_IDENTITY();                                   -- the id just generated in THIS scope', '            SET @orderID = (SELECT MAX(orderID) FROM Orders) + 1;'),
        GIAI.replace('ON Orders (customerID, orderDate) INCLUDE (total);', 'ON Orders (orderDate, customerID);'),
        GIAI.replace('CREATE UNIQUE INDEX ux_customer_email ON Customer (email) WHERE email IS NOT NULL;', 'CREATE UNIQUE INDEX ux_customer_email ON Customer (email);'),
        GIAI.replace("WHERE status = 'NEW'\nWITH CHECK OPTION;", "WHERE status = 'NEW';"),
        GIAI.replace("FROM Orders WHERE orderDate < @before AND status IN ('PAID', 'CANCELLED');", 'FROM Orders WHERE orderDate < @before;'),
        GIAI.replace('        BEGIN TRANSACTION;\n            DECLARE @price', '        DECLARE @price').replace('        COMMIT TRANSACTION;\n        RETURN 0;', '        RETURN 0;').replace('        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;\n        SET @orderID = NULL;', '        SET @orderID = NULL;'),
      ],
      gy: [['Q1: SCOPE_IDENTITY() right after the INSERT; never MAX(id) + 1.', 'Q1: SCOPE_IDENTITY() ngay sau INSERT; không bao giờ MAX(id) + 1.'], ['Q3: CREATE UNIQUE INDEX … WHERE email IS NOT NULL. Q4: … WITH CHECK OPTION at the end of the view.', 'Q3: CREATE UNIQUE INDEX … WHERE email IS NOT NULL. Q4: … WITH CHECK OPTION ở cuối view.']],
      lhg: [['Q1 without a transaction: the order row stays when the stock UPDATE fails.', 'Q1 không có giao dịch: dòng đơn còn lại khi UPDATE kho lỗi.'], ['Q3 with a plain unique index: the second customer without e-mail is refused (NULL counts once).', 'Q3 với chỉ mục duy nhất thường: khách thứ hai không có e-mail bị từ chối (NULL tính một lần).']],
      gt: ['<p>Every question is one of the "practical issues" of school Chapter 7: atomic multi-statement work, indexes shaped by the query, and views that protect data.</p>', '<p>Mỗi câu là một "vấn đề thực tế" của Chương 7 trường: việc nhiều lệnh nguyên tử, chỉ mục theo hình truy vấn, và view bảo vệ dữ liệu.</p>'],
      tn: [tn('SCOPE_IDENTITY()', 'id vừa sinh trong phạm vi'), tn('filtered index', 'chỉ mục có lọc'), tn('covering index', 'chỉ mục phủ')],
    }),
  ],
});
