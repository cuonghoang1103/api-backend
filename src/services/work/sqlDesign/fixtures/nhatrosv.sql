/* =====================================================================
   setup.sql — CSDL "NhaTroSV" (PRJ301 — Quản lý nhà trọ sinh viên)
   ---------------------------------------------------------------------
   Chạy được NHIỀU LẦN: mỗi lần chạy sẽ XOÁ CSDL cũ rồi tạo lại từ đầu
   (dữ liệu tự gõ lúc thử sẽ mất — dữ liệu mẫu chung nằm ở cuối file này).

   Cách chạy:
     • SSMS (Windows): File → Open → setup.sql → Execute (F5).
     • Azure Data Studio / DBeaver (Mac): mở file → Run.
     • Dòng lệnh: sqlcmd -S localhost -U sa -P <mật khẩu> -C -i setup.sql

   File lưu dạng UTF-8 CÓ BOM để SSMS đọc đúng chữ tiếng Việt.
   Nếu thấy chữ "PhÃ²ng" thay vì "Phòng" ⇒ file bị mở sai mã hoá.

   Thứ tự trong file:
     0. Xoá CSDL cũ (nếu có) → tạo mới
     1. Tạo 11 bảng: bảng CHA trước, bảng CON sau
        Account → Tenant → RoomType → Room → UtilityPrice → RentalRequest
        → Contract → MeterReading → Invoice → Payment → MaintenanceRequest
     2. Chỉ mục (index) — gồm 4 chỉ mục UNIQUE CÓ LỌC ("luật không bao giờ phá")
     3. Dữ liệu mẫu
     4. Kiểm tra nhanh

   Quy ước đặt tên (cả nhóm thống nhất):
     • Bảng: số ít, viết hoa chữ đầu (Room). Cột: camelCase (roomCode).
     • Khoá chính: <tênBảng>Id, INT IDENTITY(1,1) (tự tăng từ 1).
     • Ràng buộc: PK_ khoá chính, FK_ khoá ngoại, UQ_ duy nhất, CK_ kiểm tra,
       DF_ mặc định, IX_ chỉ mục thường, UX_ chỉ mục duy nhất.
       Đặt tên rõ ràng để khi lỗi, thông báo của SQL Server nói luôn luật nào bị vi phạm.
   ===================================================================== */

-- Hai dòng SET này BẮT BUỘC với chỉ mục có lọc (filtered index).
-- SSMS và JDBC mặc định đã bật; riêng sqlcmd mặc định TẮT QUOTED_IDENTIFIER
-- ⇒ thiếu dòng này thì sqlcmd báo lỗi 1934 khi INSERT vào bảng Contract.
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* ---------------------------------------------------------------------
   0. XOÁ CSDL CŨ → TẠO MỚI
   --------------------------------------------------------------------- */
USE master;   -- phải đứng ở master: không xoá được CSDL mình đang đứng trong
GO
IF DB_ID(N'NhaTroSV') IS NOT NULL
BEGIN
    -- Đá mọi kết nối đang mở (NetBeans, cửa sổ SSMS khác…) rồi mới xoá được
    ALTER DATABASE NhaTroSV SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE NhaTroSV;
END
GO
-- Ghi rõ collation để máy cả nhóm giống hệt nhau (CI = không phân biệt hoa/thường)
CREATE DATABASE NhaTroSV COLLATE SQL_Latin1_General_CP1_CI_AS;
GO
USE NhaTroSV;
GO

/* ---------------------------------------------------------------------
   1. TẠO BẢNG
   Kiểu dữ liệu:
     INT            số nguyên, khoá
     NVARCHAR(n)    chữ tiếng Việt có dấu (INSERT phải viết N'…')
     VARCHAR(n)     chữ không dấu: mã, username, email, trạng thái
     DECIMAL(12,0)  tiền VND (KHÔNG dùng FLOAT — FLOAT làm tròn sai)
     DATE           chỉ ngày;  DATETIME2(0) ngày + giờ, chính xác tới giây
     BIT            đúng/sai (1/0)
   --------------------------------------------------------------------- */

-- 1.1 Account — MỌI người đăng nhập (admin, quản lý, người thuê) chung MỘT bảng, phân biệt bằng role
CREATE TABLE Account (
    accountId    INT IDENTITY(1,1) NOT NULL,
    username     VARCHAR(30)   NOT NULL,
    passwordHash VARCHAR(255)  NOT NULL,          -- chuỗi băm PBKDF2, KHÔNG BAO GIỜ lưu mật khẩu thô
    fullName     NVARCHAR(100) NOT NULL,
    phone        VARCHAR(10)   NULL,
    email        VARCHAR(100)  NULL,
    role         VARCHAR(10)   NOT NULL,
    active       BIT           NOT NULL CONSTRAINT DF_Account_active    DEFAULT 1,   -- 0 = bị khoá
    createdAt    DATETIME2(0)  NOT NULL CONSTRAINT DF_Account_createdAt DEFAULT SYSDATETIME(),
    CONSTRAINT PK_Account          PRIMARY KEY (accountId),
    CONSTRAINT UQ_Account_username UNIQUE (username),
    CONSTRAINT CK_Account_role     CHECK (role IN ('ADMIN', 'MANAGER', 'TENANT')),
    CONSTRAINT CK_Account_username CHECK (LEN(username) BETWEEN 4 AND 30),
    -- Điện thoại: đúng 10 chữ số. '%[^0-9]%' nghĩa là "có ký tự nào KHÔNG phải số"
    CONSTRAINT CK_Account_phone    CHECK (phone IS NULL OR (LEN(phone) = 10 AND phone NOT LIKE '%[^0-9]%')),
    CONSTRAINT CK_Account_email    CHECK (email IS NULL OR email LIKE '%_@_%._%')
);
GO

-- 1.2 Tenant — thông tin riêng của NGƯỜI THUÊ. Quan hệ 1–1 với Account:
--     tenantId vừa là khoá chính, vừa là khoá ngoại trỏ về Account.accountId
CREATE TABLE Tenant (
    tenantId    INT           NOT NULL,
    idCardNo    VARCHAR(12)   NOT NULL,           -- số CCCD 12 chữ số
    school      NVARCHAR(100) NULL,
    dateOfBirth DATE          NULL,
    hometown    NVARCHAR(100) NULL,
    CONSTRAINT PK_Tenant          PRIMARY KEY (tenantId),
    CONSTRAINT FK_Tenant_Account  FOREIGN KEY (tenantId) REFERENCES Account(accountId),
    CONSTRAINT UQ_Tenant_idCardNo UNIQUE (idCardNo),
    CONSTRAINT CK_Tenant_idCardNo CHECK (LEN(idCardNo) = 12 AND idCardNo NOT LIKE '%[^0-9]%')
);
GO

-- 1.3 RoomType — danh mục loại phòng
CREATE TABLE RoomType (
    roomTypeId  INT IDENTITY(1,1) NOT NULL,
    name        NVARCHAR(50)  NOT NULL,
    capacity    INT           NOT NULL,           -- số người tối đa
    description NVARCHAR(255) NULL,
    CONSTRAINT PK_RoomType          PRIMARY KEY (roomTypeId),
    CONSTRAINT UQ_RoomType_name     UNIQUE (name),
    CONSTRAINT CK_RoomType_capacity CHECK (capacity BETWEEN 1 AND 8)
);
GO

-- 1.4 Room — từng phòng. KHÔNG có cột "đang có người thuê":
--     điều đó suy ra từ Contract (có hợp đồng ACTIVE hay không) ⇒ một thông tin chỉ lưu một chỗ.
CREATE TABLE Room (
    roomId       INT IDENTITY(1,1) NOT NULL,
    roomCode     VARCHAR(10)   NOT NULL,
    roomTypeId   INT           NOT NULL,
    floor        INT           NOT NULL,
    area         DECIMAL(5,1)  NULL,              -- m², ví dụ 18.5
    monthlyPrice DECIMAL(12,0) NOT NULL,          -- giá niêm yết HIỆN TẠI (hợp đồng chụp lại lúc ký)
    status       VARCHAR(12)   NOT NULL CONSTRAINT DF_Room_status DEFAULT 'ACTIVE',
    imageUrl     VARCHAR(255)  NULL,
    description  NVARCHAR(500) NULL,
    CONSTRAINT PK_Room              PRIMARY KEY (roomId),
    CONSTRAINT UQ_Room_roomCode     UNIQUE (roomCode),
    CONSTRAINT FK_Room_RoomType     FOREIGN KEY (roomTypeId) REFERENCES RoomType(roomTypeId),
    CONSTRAINT CK_Room_floor        CHECK (floor >= 1),
    CONSTRAINT CK_Room_area         CHECK (area IS NULL OR area > 0),
    CONSTRAINT CK_Room_monthlyPrice CHECK (monthlyPrice > 0),
    -- ACTIVE = đang mở cho thuê · MAINTENANCE = đang sửa · HIDDEN = ẩn (thay cho XOÁ)
    CONSTRAINT CK_Room_status       CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'HIDDEN'))
);
GO

-- 1.5 UtilityPrice — bảng giá điện, nước, dịch vụ. Đổi giá = THÊM dòng mới có ngày hiệu lực mới,
--     KHÔNG sửa dòng cũ ⇒ hoá đơn tháng cũ vẫn tính đúng giá lúc đó.
CREATE TABLE UtilityPrice (
    priceId             INT IDENTITY(1,1) NOT NULL,
    electricPrice       DECIMAL(12,0) NOT NULL,   -- đồng / kWh
    waterPrice          DECIMAL(12,0) NOT NULL,   -- đồng / m³
    serviceFeePerPerson DECIMAL(12,0) NOT NULL,   -- đồng / người / tháng (rác, wifi, vệ sinh)
    effectiveFrom       DATE          NOT NULL,   -- áp dụng từ ngày này
    createdAt           DATETIME2(0)  NOT NULL CONSTRAINT DF_UtilityPrice_createdAt DEFAULT SYSDATETIME(),
    CONSTRAINT PK_UtilityPrice               PRIMARY KEY (priceId),
    CONSTRAINT UQ_UtilityPrice_effectiveFrom UNIQUE (effectiveFrom),
    CONSTRAINT CK_UtilityPrice_prices        CHECK (electricPrice >= 0 AND waterPrice >= 0 AND serviceFeePerPerson >= 0)
);
GO

-- 1.6 RentalRequest — yêu cầu thuê phòng do người thuê gửi
--     Trạng thái: PENDING → APPROVED (quản lý duyệt) / REJECTED (quản lý từ chối) / CANCELLED (người thuê tự huỷ)
CREATE TABLE RentalRequest (
    requestId    INT IDENTITY(1,1) NOT NULL,
    tenantId     INT           NOT NULL,
    roomId       INT           NOT NULL,
    moveInDate   DATE          NOT NULL,
    months       INT           NOT NULL,          -- số tháng muốn thuê
    numPeople    INT           NOT NULL,          -- số người ở (≤ sức chứa: kiểm trong Java)
    note         NVARCHAR(500) NULL,              -- ghi chú của người thuê
    status       VARCHAR(10)   NOT NULL CONSTRAINT DF_RentalRequest_status    DEFAULT 'PENDING',
    createdAt    DATETIME2(0)  NOT NULL CONSTRAINT DF_RentalRequest_createdAt DEFAULT SYSDATETIME(),
    decidedAt    DATETIME2(0)  NULL,              -- lúc rời PENDING (duyệt / từ chối / huỷ)
    decidedBy    INT           NULL,              -- quản lý nào duyệt/từ chối (NULL nếu người thuê tự huỷ)
    decisionNote NVARCHAR(255) NULL,              -- lý do từ chối
    CONSTRAINT PK_RentalRequest           PRIMARY KEY (requestId),
    CONSTRAINT FK_RentalRequest_Tenant    FOREIGN KEY (tenantId)  REFERENCES Tenant(tenantId),
    CONSTRAINT FK_RentalRequest_Room      FOREIGN KEY (roomId)    REFERENCES Room(roomId),
    CONSTRAINT FK_RentalRequest_DecidedBy FOREIGN KEY (decidedBy) REFERENCES Account(accountId),
    CONSTRAINT CK_RentalRequest_months    CHECK (months BETWEEN 1 AND 24),
    CONSTRAINT CK_RentalRequest_numPeople CHECK (numPeople BETWEEN 1 AND 8),
    CONSTRAINT CK_RentalRequest_status    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    -- Trạng thái và cột "quyết định" phải khớp nhau:
    CONSTRAINT CK_RentalRequest_decision  CHECK (
           (status = 'PENDING'                 AND decidedAt IS NULL     AND decidedBy IS NULL)
        OR (status IN ('APPROVED', 'REJECTED') AND decidedAt IS NOT NULL AND decidedBy IS NOT NULL)
        OR (status = 'CANCELLED'               AND decidedAt IS NOT NULL AND decidedBy IS NULL))
);
GO

-- 1.7 Contract — hợp đồng thuê: GIAO DỊCH TRUNG TÂM, nối người thuê + phòng + yêu cầu đã duyệt.
--     monthlyRent là giá CHỤP LẠI lúc ký (mai giá phòng tăng, hợp đồng cũ không đổi theo).
--     Trạng thái: ACTIVE → ENDED
CREATE TABLE Contract (
    contractId         INT IDENTITY(1,1) NOT NULL,
    requestId          INT           NOT NULL,    -- duyệt từ yêu cầu nào (UNIQUE: 1 yêu cầu ⇒ tối đa 1 hợp đồng)
    tenantId           INT           NOT NULL,
    roomId             INT           NOT NULL,
    startDate          DATE          NOT NULL,
    endDate            DATE          NOT NULL,    -- ngày hết hạn dự kiến
    monthlyRent        DECIMAL(12,0) NOT NULL,    -- giá thuê chốt lúc ký
    deposit            DECIMAL(12,0) NOT NULL CONSTRAINT DF_Contract_deposit   DEFAULT 0,  -- tiền cọc
    numPeople          INT           NOT NULL,    -- số người ở ⇒ tính phí dịch vụ
    startElectricIndex INT           NOT NULL,    -- chỉ số điện lúc nhận phòng (tháng đầu dùng làm "chỉ số cũ")
    startWaterIndex    INT           NOT NULL,    -- chỉ số nước lúc nhận phòng
    status             VARCHAR(10)   NOT NULL CONSTRAINT DF_Contract_status    DEFAULT 'ACTIVE',
    createdAt          DATETIME2(0)  NOT NULL CONSTRAINT DF_Contract_createdAt DEFAULT SYSDATETIME(),
    endedAt            DATETIME2(0)  NULL,        -- lúc quản lý bấm "Kết thúc hợp đồng"
    CONSTRAINT PK_Contract               PRIMARY KEY (contractId),
    CONSTRAINT FK_Contract_RentalRequest FOREIGN KEY (requestId) REFERENCES RentalRequest(requestId),
    CONSTRAINT FK_Contract_Tenant        FOREIGN KEY (tenantId)  REFERENCES Tenant(tenantId),
    CONSTRAINT FK_Contract_Room          FOREIGN KEY (roomId)    REFERENCES Room(roomId),
    CONSTRAINT UQ_Contract_requestId     UNIQUE (requestId),
    CONSTRAINT CK_Contract_dates         CHECK (endDate > startDate),
    CONSTRAINT CK_Contract_money         CHECK (monthlyRent > 0 AND deposit >= 0),
    CONSTRAINT CK_Contract_numPeople     CHECK (numPeople BETWEEN 1 AND 8),
    CONSTRAINT CK_Contract_startIndex    CHECK (startElectricIndex >= 0 AND startWaterIndex >= 0),
    CONSTRAINT CK_Contract_status        CHECK (status IN ('ACTIVE', 'ENDED')),
    CONSTRAINT CK_Contract_endedAt       CHECK ((status = 'ACTIVE' AND endedAt IS NULL)
                                             OR (status = 'ENDED'  AND endedAt IS NOT NULL))
);
GO

-- 1.8 MeterReading — chỉ số điện nước CUỐI THÁNG của từng PHÒNG (đồng hồ gắn với phòng, không gắn người)
CREATE TABLE MeterReading (
    readingId     INT IDENTITY(1,1) NOT NULL,
    roomId        INT          NOT NULL,
    [year]        INT          NOT NULL,          -- year/month là từ khoá của T-SQL nên bọc [ ] cho chắc
    [month]       INT          NOT NULL,
    electricIndex INT          NOT NULL,          -- số trên đồng hồ điện (kWh)
    waterIndex    INT          NOT NULL,          -- số trên đồng hồ nước (m³)
    recordedAt    DATETIME2(0) NOT NULL CONSTRAINT DF_MeterReading_recordedAt DEFAULT SYSDATETIME(),
    CONSTRAINT PK_MeterReading               PRIMARY KEY (readingId),
    CONSTRAINT FK_MeterReading_Room          FOREIGN KEY (roomId) REFERENCES Room(roomId),
    CONSTRAINT UQ_MeterReading_RoomYearMonth UNIQUE (roomId, [year], [month]),   -- mỗi phòng ghi 1 lần mỗi tháng
    CONSTRAINT CK_MeterReading_period        CHECK ([year] BETWEEN 2020 AND 2100 AND [month] BETWEEN 1 AND 12),
    CONSTRAINT CK_MeterReading_index         CHECK (electricIndex >= 0 AND waterIndex >= 0)
    -- "chỉ số mới ≥ chỉ số tháng trước" là luật GIỮA 2 DÒNG ⇒ kiểm trong Java (BillingService)
);
GO

-- 1.9 Invoice — hoá đơn tháng của một hợp đồng. Mọi khoản tiền là số CHỤP LẠI lúc lập hoá đơn.
--     Trạng thái: UNPAID → PAID (CHỈ IPN của VNPay được chuyển sang PAID).
--     "Quá hạn" KHÔNG phải trạng thái lưu: quá hạn = UNPAID và dueDate < hôm nay (tính lúc truy vấn).
CREATE TABLE Invoice (
    invoiceId    INT IDENTITY(1,1) NOT NULL,
    contractId   INT           NOT NULL,
    priceId      INT           NOT NULL,          -- bảng giá điện nước đã dùng để tính
    [year]       INT           NOT NULL,
    [month]      INT           NOT NULL,
    roomFee      DECIMAL(12,0) NOT NULL,          -- = Contract.monthlyRent
    electricUsed INT           NOT NULL,          -- số kWh = chỉ số mới − chỉ số cũ
    electricFee  DECIMAL(12,0) NOT NULL,          -- = electricUsed × electricPrice
    waterUsed    INT           NOT NULL,          -- số m³
    waterFee     DECIMAL(12,0) NOT NULL,          -- = waterUsed × waterPrice
    serviceFee   DECIMAL(12,0) NOT NULL,          -- = serviceFeePerPerson × Contract.numPeople
    total        DECIMAL(12,0) NOT NULL,          -- = tổng 4 khoản (CHECK bên dưới bắt buộc khớp)
    status       VARCHAR(10)   NOT NULL CONSTRAINT DF_Invoice_status    DEFAULT 'UNPAID',
    dueDate      DATE          NOT NULL,          -- hạn trả: mặc định ngày 10 tháng sau
    createdAt    DATETIME2(0)  NOT NULL CONSTRAINT DF_Invoice_createdAt DEFAULT SYSDATETIME(),
    paidAt       DATETIME2(0)  NULL,              -- CHỈ IPN VNPay ghi cột này
    CONSTRAINT PK_Invoice                   PRIMARY KEY (invoiceId),
    CONSTRAINT FK_Invoice_Contract          FOREIGN KEY (contractId) REFERENCES Contract(contractId),
    CONSTRAINT FK_Invoice_UtilityPrice      FOREIGN KEY (priceId)    REFERENCES UtilityPrice(priceId),
    CONSTRAINT UQ_Invoice_ContractYearMonth UNIQUE (contractId, [year], [month]),   -- 1 hợp đồng 1 hoá đơn mỗi tháng
    CONSTRAINT CK_Invoice_period            CHECK ([year] BETWEEN 2020 AND 2100 AND [month] BETWEEN 1 AND 12),
    CONSTRAINT CK_Invoice_amounts           CHECK (roomFee >= 0 AND electricUsed >= 0 AND electricFee >= 0
                                               AND waterUsed >= 0 AND waterFee >= 0 AND serviceFee >= 0),
    CONSTRAINT CK_Invoice_total             CHECK (total = roomFee + electricFee + waterFee + serviceFee),
    CONSTRAINT CK_Invoice_status            CHECK (status IN ('UNPAID', 'PAID')),
    CONSTRAINT CK_Invoice_paidAt            CHECK ((status = 'UNPAID' AND paidAt IS NULL)
                                                OR (status = 'PAID'   AND paidAt IS NOT NULL))
);
GO

-- 1.10 Payment — mỗi LẦN THỬ thanh toán VNPay là một dòng (thử hỏng rồi thử lại ⇒ nhiều dòng).
--      Trạng thái: PENDING (vừa chuyển sang VNPay) → SUCCESS / FAILED (theo IPN)
CREATE TABLE Payment (
    paymentId        INT IDENTITY(1,1) NOT NULL,
    invoiceId        INT           NOT NULL,
    txnRef           VARCHAR(50)   NOT NULL,      -- vnp_TxnRef mình gửi đi, ví dụ 'INV5-20261003084000'
    amount           DECIMAL(12,0) NOT NULL,      -- số tiền VND thật (gửi VNPay thì nhân 100 thành vnp_Amount)
    status           VARCHAR(10)   NOT NULL CONSTRAINT DF_Payment_status    DEFAULT 'PENDING',
    vnpTransactionNo VARCHAR(20)   NULL,          -- mã giao dịch phía VNPay trả về
    bankCode         VARCHAR(20)   NULL,          -- ví dụ 'NCB'
    responseCode     VARCHAR(5)    NULL,          -- vnp_ResponseCode: '00' thành công, '24' khách huỷ…
    createdAt        DATETIME2(0)  NOT NULL CONSTRAINT DF_Payment_createdAt DEFAULT SYSDATETIME(),
    paidAt           DATETIME2(0)  NULL,          -- lúc IPN xác nhận thành công
    CONSTRAINT PK_Payment         PRIMARY KEY (paymentId),
    CONSTRAINT FK_Payment_Invoice FOREIGN KEY (invoiceId) REFERENCES Invoice(invoiceId),
    CONSTRAINT UQ_Payment_txnRef  UNIQUE (txnRef),
    CONSTRAINT CK_Payment_amount  CHECK (amount > 0),
    CONSTRAINT CK_Payment_status  CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    CONSTRAINT CK_Payment_paidAt  CHECK ((status = 'SUCCESS' AND paidAt IS NOT NULL)
                                      OR (status <> 'SUCCESS' AND paidAt IS NULL))
);
GO

-- 1.11 MaintenanceRequest — sự cố người thuê báo (gắn với HỢP ĐỒNG ⇒ biết phòng nào, ai báo)
--      Trạng thái: OPEN → IN_PROGRESS → DONE
CREATE TABLE MaintenanceRequest (
    ticketId    INT IDENTITY(1,1) NOT NULL,
    contractId  INT            NOT NULL,
    title       NVARCHAR(150)  NOT NULL,
    description NVARCHAR(1000) NULL,
    status      VARCHAR(12)    NOT NULL CONSTRAINT DF_MaintenanceRequest_status    DEFAULT 'OPEN',
    managerNote NVARCHAR(500)  NULL,              -- ghi chú của quản lý (người thuê xem được)
    createdAt   DATETIME2(0)   NOT NULL CONSTRAINT DF_MaintenanceRequest_createdAt DEFAULT SYSDATETIME(),
    resolvedAt  DATETIME2(0)   NULL,              -- ghi khi chuyển sang DONE
    CONSTRAINT PK_MaintenanceRequest          PRIMARY KEY (ticketId),
    CONSTRAINT FK_MaintenanceRequest_Contract FOREIGN KEY (contractId) REFERENCES Contract(contractId),
    CONSTRAINT CK_MaintenanceRequest_status   CHECK (status IN ('OPEN', 'IN_PROGRESS', 'DONE')),
    CONSTRAINT CK_MaintenanceRequest_resolved CHECK ((status = 'DONE' AND resolvedAt IS NOT NULL)
                                                  OR (status <> 'DONE' AND resolvedAt IS NULL))
);
GO

/* ---------------------------------------------------------------------
   2. CHỈ MỤC (INDEX)
   PRIMARY KEY và UNIQUE TỰ có chỉ mục. Cột KHOÁ NGOẠI thì KHÔNG tự có
   ⇒ tạo cho những cột hay dùng để JOIN / lọc.
   (Invoice.contractId, MeterReading.roomId không cần tạo thêm: chúng đứng ĐẦU
    trong UNIQUE (contractId, year, month) / (roomId, year, month) nên đã có sẵn.)
   --------------------------------------------------------------------- */

-- 2.1 BỐN CHỈ MỤC UNIQUE CÓ LỌC — "luật không bao giờ phá".
--     UNIQUE thường cấm trùng trên MỌI dòng; UNIQUE có lọc chỉ cấm trùng trong các dòng thoả WHERE.

-- (1) Một phòng tại một thời điểm chỉ có MỘT hợp đồng ACTIVE.
--     (UNIQUE(roomId) thường sẽ cấm cả hợp đồng cũ đã ENDED — sai, vì phòng cho thuê nhiều lần.)
--     Chặn được cả trường hợp 2 quản lý cùng bấm "Duyệt" trong cùng một giây.
CREATE UNIQUE INDEX UX_Contract_ActiveRoom   ON Contract(roomId)   WHERE status = 'ACTIVE';
-- (2) Một người thuê chỉ có MỘT hợp đồng ACTIVE.
CREATE UNIQUE INDEX UX_Contract_ActiveTenant ON Contract(tenantId) WHERE status = 'ACTIVE';
-- (3) Một người thuê chỉ có MỘT yêu cầu thuê đang chờ (PENDING) — bấm "Gửi" 2 lần liền cũng không lọt.
CREATE UNIQUE INDEX UX_RentalRequest_PendingTenant ON RentalRequest(tenantId) WHERE status = 'PENDING';
-- (4) Một hoá đơn chỉ có MỘT lần thanh toán SUCCESS — IPN VNPay gọi 2 lần cũng không ghi 2 lần.
CREATE UNIQUE INDEX UX_Payment_SuccessInvoice ON Payment(invoiceId) WHERE status = 'SUCCESS';
GO

-- 2.2 Chỉ mục thường cho các tra cứu chính
CREATE INDEX IX_Room_Status_Price      ON Room(status, monthlyPrice);           -- UC01 tìm phòng theo giá
CREATE INDEX IX_Room_RoomType          ON Room(roomTypeId);                     -- UC01 lọc loại phòng
CREATE INDEX IX_RentalRequest_RoomStat ON RentalRequest(roomId, status);        -- UC09 yêu cầu PENDING của 1 phòng
CREATE INDEX IX_RentalRequest_Tenant   ON RentalRequest(tenantId);              -- UC05 yêu cầu của tôi
CREATE INDEX IX_Contract_Tenant        ON Contract(tenantId);                   -- UC05/UC06 hợp đồng của tôi (cả cũ)
CREATE INDEX IX_Contract_Room          ON Contract(roomId);                     -- lịch sử thuê của 1 phòng
CREATE INDEX IX_Invoice_Status_Due     ON Invoice(status, dueDate);             -- UC14 nợ quá hạn
CREATE INDEX IX_Invoice_PaidAt         ON Invoice(paidAt);                      -- UC14 doanh thu theo tháng
CREATE INDEX IX_Payment_Invoice        ON Payment(invoiceId);                   -- UC07 các lần thử trả của 1 hoá đơn
CREATE INDEX IX_Maintenance_Contract   ON MaintenanceRequest(contractId);       -- UC08 sự cố của tôi
CREATE INDEX IX_Maintenance_Status     ON MaintenanceRequest(status);           -- UC12 lọc theo trạng thái
GO

/* ---------------------------------------------------------------------
   (Bản rút gọn cho bộ test: phần dữ liệu mẫu + truy vấn kiểm tra của tệp gốc được thay bằng vài câu đại diện — bộ đọc
   phải bỏ qua chúng mà không báo lỗi.)
   --------------------------------------------------------------------- */
SET IDENTITY_INSERT RoomType ON;
INSERT INTO RoomType (roomTypeId, name, capacity, description) VALUES
 (1, N'Phòng đơn', 1, N'Giường đơn, bàn học; WC riêng — CREATE TABLE trong chuỗi không phải câu lệnh'),
 (2, N'Phòng đôi', 2, NULL);
SET IDENTITY_INSERT RoomType OFF;
GO
SELECT r.roomCode, rt.name AS loaiPhong,
       CASE WHEN r.status = 'ACTIVE' THEN N'Trống' ELSE N'Không cho thuê' END AS tinhTrang
FROM Room r JOIN RoomType rt ON rt.roomTypeId = r.roomTypeId
ORDER BY r.roomCode;
PRINT N'✔ setup.sql chạy xong — CSDL NhaTroSV đã sẵn sàng.';
GO
