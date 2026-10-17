/**
 * Database designer — bộ đọc SQL.   npx tsx --test src/services/work/sqlDesign/parser.test.ts
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { analyzeSql, joinMeta, parseSql, relationships, splitMeta } from './index.js';
import { findColumn, findTable } from './model.js';

const NHATRO = readFileSync(fileURLToPath(new URL('./fixtures/nhatrosv.sql', import.meta.url)), 'utf8');

describe('NhaTroSV (setup.sql thật của PRJ301, SQL Server)', () => {
  const r = parseSql(NHATRO);
  const m = r.model;
  it('đọc trọn 11 bảng, không lỗi, dò đúng SQL Server + tên CSDL', () => {
    assert.deepEqual(r.errors, []);
    assert.equal(r.detected, 'sqlserver');
    assert.equal(m.database, 'NhaTroSV');
    assert.deepEqual(m.tables.map((t) => t.name), ['Account', 'Tenant', 'RoomType', 'Room', 'UtilityPrice', 'RentalRequest', 'Contract', 'MeterReading', 'Invoice', 'Payment', 'MaintenanceRequest']);
    assert.ok(m.tables.every((t) => !t.incomplete));
  });
  it('bỏ qua IF/DROP/SET/USE/INSERT/SELECT/PRINT mà vẫn đếm', () => {
    assert.ok((r.skipped.INSERT ?? 0) >= 1);
    assert.ok((r.skipped.SELECT ?? 0) >= 1);
    assert.ok((r.skipped.SET ?? 0) >= 2);
    assert.ok((r.skipped.PRINT ?? 0) >= 1);
  });
  it('cột: kiểu, NULL, IDENTITY, DEFAULT có tên, chú thích cùng dòng', () => {
    const a = findTable(m, 'Account')!;
    assert.equal(a.columns.length, 9);
    const id = findColumn(a, 'accountId')!;
    assert.deepEqual(id.identity && { s: id.identity.start, i: id.identity.increment }, { s: 1, i: 1 });
    assert.equal(id.nullable, false);
    assert.equal(findColumn(a, 'phone')!.nullable, true);
    assert.equal(findColumn(a, 'fullName')!.type.raw, 'NVARCHAR(100)');
    const active = findColumn(a, 'active')!;
    assert.equal(active.default?.text, '1');
    assert.equal(active.defaultName, 'DF_Account_active');
    assert.equal(active.comment, '0 = bị khoá');
    assert.equal(findColumn(a, 'createdAt')!.default?.text, 'SYSDATETIME()');
    assert.equal(findColumn(findTable(m, 'MeterReading'), 'year')!.type.name, 'INT');
  });
  it('ràng buộc có tên: PK / UNIQUE / CHECK / FK', () => {
    const a = findTable(m, 'Account')!;
    assert.deepEqual(a.primaryKey, { ...a.primaryKey, name: 'PK_Account', columns: ['accountId'] });
    assert.deepEqual(a.uniques.map((u) => [u.name, u.columns]), [['UQ_Account_username', ['username']]]);
    assert.deepEqual(a.checks.map((c) => c.name), ['CK_Account_role', 'CK_Account_username', 'CK_Account_phone', 'CK_Account_email']);
    assert.match(a.checks[2].expr.text, /NOT LIKE '%\[\^0-9\]%'/);
    const rr = findTable(m, 'RentalRequest')!;
    assert.deepEqual(rr.foreignKeys.map((f) => [f.name, f.columns, f.refTable, f.refColumns]), [
      ['FK_RentalRequest_Tenant', ['tenantId'], 'Tenant', ['tenantId']],
      ['FK_RentalRequest_Room', ['roomId'], 'Room', ['roomId']],
      ['FK_RentalRequest_DecidedBy', ['decidedBy'], 'Account', ['accountId']],
    ]);
    assert.deepEqual(findTable(m, 'MeterReading')!.uniques[0].columns, ['roomId', 'year', 'month']);
  });
  it('chỉ mục thường + UNIQUE có lọc WHERE', () => {
    const c = findTable(m, 'Contract')!;
    const ux = c.indexes.find((i) => i.name === 'UX_Contract_ActiveRoom')!;
    assert.equal(ux.unique, true);
    assert.equal(ux.where?.text, "status = 'ACTIVE'");
    assert.deepEqual(findTable(m, 'Room')!.indexes.map((i) => [i.name, i.columns.map((x) => x.name)]), [['IX_Room_Status_Price', ['status', 'monthlyPrice']], ['IX_Room_RoomType', ['roomTypeId']]]);
  });
  it('mô tả bảng lấy từ chú thích ngay trên CREATE TABLE (bỏ số mục + tên bảng)', () => {
    assert.match(findTable(m, 'RoomType')!.comment!, /^Danh mục loại phòng/);
    assert.match(findTable(m, 'Tenant')!.comment!, /Quan hệ 1–1 với Account/);
  });
  it('quan hệ: Tenant 1–1 với Account (khoá chính cũng là khoá ngoại), decidedBy không bắt buộc', () => {
    const rels = relationships(m);
    const t = rels.find((x) => x.child === 'Tenant')!;
    assert.equal(t.childCard, 'zeroOrOne');
    assert.equal(t.identifying, true);
    const d = rels.find((x) => x.name === 'FK_RentalRequest_DecidedBy')!;
    assert.equal(d.parentCard, 'zeroOrOne');
    assert.equal(d.childCard, 'many');
    assert.equal(rels.find((x) => x.name === 'FK_Contract_RentalRequest')!.childCard, 'zeroOrOne'); // UQ_Contract_requestId
  });
  it('vị trí: tên bảng và cột trỏ đúng dòng trong tệp', () => {
    const lines = NHATRO.split('\n');
    const room = findTable(m, 'Room')!;
    assert.match(lines[room.nameSpan.line - 1], /CREATE TABLE Room \(/);
    assert.match(lines[findColumn(room, 'monthlyPrice')!.nameSpan.line - 1], /monthlyPrice\s+DECIMAL\(12,0\)/);
    assert.ok(room.span.endLine > room.span.line);
  });
  it('nhanh: < 150 ms cho tệp 360 dòng', () => {
    const t0 = performance.now();
    for (let i = 0; i < 5; i++) parseSql(NHATRO);
    assert.ok((performance.now() - t0) / 5 < 150);
  });
});

describe('PostgreSQL', () => {
  const src = `
CREATE TYPE mood AS ENUM ('happy', 'sad');
CREATE TABLE public.users (
  id bigserial PRIMARY KEY,
  email citext NOT NULL UNIQUE,
  full_name varchar(100),
  feeling mood DEFAULT 'happy'::mood,
  tags text[],
  profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE orders (
  id integer GENERATED ALWAYS AS IDENTITY (START WITH 100 INCREMENT BY 1),
  user_id bigint NOT NULL REFERENCES users ON DELETE CASCADE,
  total numeric(12,2) NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'NEW',
  placed_at timestamp(3) without time zone,
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS orders_open_user ON ONLY orders USING btree (user_id) WHERE status = 'NEW';
COMMENT ON TABLE orders IS 'Đơn hàng';
COMMENT ON COLUMN orders.total IS 'Tổng tiền';
CREATE FUNCTION touch() RETURNS trigger AS $$ BEGIN NEW.placed_at := now(); CREATE TABLE never(x int); RETURN NEW; END $$ LANGUAGE plpgsql;
ALTER TABLE ONLY orders ADD CONSTRAINT orders_status_check CHECK (status IN ('NEW', 'PAID'));
`;
  const r = parseSql(src);
  it('dò đúng PostgreSQL, không lỗi, bỏ qua thân hàm $$…$$', () => {
    assert.equal(r.detected, 'postgres');
    assert.deepEqual(r.errors, []);
    assert.deepEqual(r.model.tables.map((t) => t.name), ['users', 'orders']);
  });
  it('bigserial / GENERATED ALWAYS AS IDENTITY (START WITH) / enum / mảng / timestamptz', () => {
    const u = findTable(r.model, 'users')!;
    assert.equal(findColumn(u, 'id')!.identity?.mode, 'serial');
    assert.equal(findColumn(u, 'tags')!.type.array, true);
    assert.equal(findColumn(u, 'created_at')!.type.name, 'TIMESTAMPTZ');
    assert.deepEqual(r.model.enums.map((e) => [e.name, e.values]), [['mood', ['happy', 'sad']]]);
    const o = findTable(r.model, 'orders')!;
    assert.deepEqual(findColumn(o, 'id')!.identity, { start: 100, increment: 1, mode: 'always' });
    assert.equal(findColumn(o, 'placed_at')!.type.name, 'TIMESTAMP WITHOUT TIME ZONE');
    assert.deepEqual(findColumn(o, 'placed_at')!.type.args, [3]);
  });
  it('REFERENCES không ghi cột ⇒ khoá chính bảng cha; ON DELETE CASCADE; COMMENT ON; ALTER TABLE ONLY', () => {
    const o = findTable(r.model, 'orders')!;
    assert.deepEqual(o.foreignKeys.map((f) => [f.refTable, f.refColumns, f.onDelete]), [['users', [], 'CASCADE']]);
    assert.equal(relationships(r.model)[0].parentColumns[0], 'id');
    assert.equal(o.comment, 'Đơn hàng');
    assert.equal(findColumn(o, 'total')!.comment, 'Tổng tiền');
    assert.ok(o.checks.some((c) => c.name === 'orders_status_check'));
    assert.equal(o.indexes[0].where?.text, "status = 'NEW'");
  });
});

describe('MySQL', () => {
  const src = `
# tạo bảng kiểu mysqldump
DROP TABLE IF EXISTS \`products\`;
CREATE TABLE \`products\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`sku\` varchar(32) NOT NULL COMMENT 'mã hàng',
  \`name\` varchar(200) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  \`kind\` enum('BOOK','PEN') NOT NULL DEFAULT 'BOOK',
  \`active\` tinyint(1) NOT NULL DEFAULT '1',
  \`updated_at\` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uq_sku\` (\`sku\`),
  KEY \`ix_name\` (\`name\`(20)),
  FULLTEXT KEY \`ft_name\` (\`name\`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COMMENT='Sản phẩm';
DELIMITER $$
CREATE PROCEDURE p() BEGIN CREATE TABLE inside_proc (x int); SELECT 1; END$$
DELIMITER ;
CREATE TABLE order_items (product_id int unsigned NOT NULL, qty int NOT NULL, CONSTRAINT fk_p FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT ON UPDATE CASCADE) ENGINE=InnoDB;
`;
  const r = parseSql(src);
  it('dò MySQL; DELIMITER + thủ tục bị bỏ qua; # là chú thích', () => {
    assert.equal(r.detected, 'mysql');
    assert.deepEqual(r.errors, []);
    assert.deepEqual(r.model.tables.map((t) => t.name), ['products', 'order_items']);
  });
  it('AUTO_INCREMENT, UNSIGNED, ENUM, tinyint(1), COMMENT cột + bảng, KEY tiền tố, FULLTEXT', () => {
    const p = findTable(r.model, 'products')!;
    assert.equal(findColumn(p, 'id')!.identity?.mode, 'auto_increment');
    assert.equal(findColumn(p, 'id')!.type.unsigned, true);
    assert.deepEqual(findColumn(p, 'kind')!.type.args, ['BOOK', 'PEN']);
    assert.equal(findColumn(p, 'sku')!.comment, 'mã hàng');
    assert.equal(findColumn(p, 'updated_at')!.default?.text, 'CURRENT_TIMESTAMP(3)');
    assert.equal(p.comment, 'Sản phẩm');
    assert.equal(p.uniques[0].name, 'uq_sku');
    assert.deepEqual(p.indexes.map((i) => [i.name, i.columns[0].length ?? null, i.method ?? null]), [['ix_name', 20, null], ['ft_name', null, 'FULLTEXT']]);
    assert.deepEqual(findTable(r.model, 'order_items')!.foreignKeys[0].onUpdate, 'CASCADE');
  });
});

describe('SSMS "Script Table as CREATE"', () => {
  const src = `
USE [Shop]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 10/17/2026 8:00:00 PM ******/
SET ANSI_NULLS ON
GO
CREATE TABLE [dbo].[Category](
	[categoryId] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED
(
	[categoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
CREATE TABLE [dbo].[Product](
	[productId] [int] IDENTITY(1,1) NOT NULL,
	[categoryId] [int] NULL,
	[price] [decimal](12, 0) NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Category] ADD  CONSTRAINT [DF_Category_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_Category] FOREIGN KEY([categoryId])
REFERENCES [dbo].[Category] ([categoryId])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Category]
GO
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [PK_Product] PRIMARY KEY ([productId]);
`;
  const r = parseSql(src);
  it('[int] ⇒ INT, DEFAULT ((1)) FOR ⇒ DEFAULT 1, WITH CHECK ADD FK, PK thêm bằng ALTER', () => {
    assert.deepEqual(r.errors, []);
    const c = findTable(r.model, 'Category')!;
    assert.equal(findColumn(c, 'categoryId')!.type.name, 'INT');
    assert.equal(findColumn(c, 'isActive')!.default?.text, '1');
    assert.equal(findColumn(c, 'isActive')!.defaultName, 'DF_Category_isActive');
    assert.equal(c.primaryKey?.clustered, true);
    assert.equal(c.comment, undefined, 'dòng "Object: Table" của SSMS không phải mô tả');
    const p = findTable(r.model, 'Product')!;
    assert.equal(p.foreignKeys[0].name, 'FK_Product_Category');
    assert.deepEqual(p.primaryKey?.columns, ['productId']);
    assert.deepEqual(findColumn(p, 'price')!.type.args, [12, 0]);
    assert.equal(r.model.database, 'Shop');
  });
});

describe('đang gõ dở / lỗi — báo đúng dòng, không làm mất bảng khác', () => {
  it('thiếu dấu phẩy: lỗi ở đúng dòng, bảng sau vẫn đọc được', () => {
    const r = parseSql('CREATE TABLE A (\n  id INT PRIMARY KEY\n  name NVARCHAR(50)\n);\nCREATE TABLE B (id INT PRIMARY KEY, aId INT REFERENCES A(id));');
    assert.equal(r.errors[0].code, 'SQL_MISSING_COMMA');
    assert.equal(r.errors[0].span?.line, 2);
    assert.deepEqual(r.model.tables.map((t) => [t.name, t.columns.length]), [['A', 2], ['B', 2]]);
  });
  it('bảng chưa đóng ngoặc rồi tới CREATE TABLE khác: bảng dở có cờ incomplete, bảng sau nguyên vẹn', () => {
    const r = parseSql('CREATE TABLE A (\n  id INT,\n  na\nCREATE TABLE B (id INT PRIMARY KEY);');
    const a = findTable(r.model, 'A')!;
    assert.equal(a.incomplete, true);
    assert.ok(r.errors.length >= 1);
    assert.equal(findTable(r.model, 'B')?.incomplete, undefined);
  });
  it('cột thiếu kiểu', () => {
    const r = parseSql('CREATE TABLE A (id INT, name, x INT);', { dialect: 'sqlserver' });
    assert.equal(r.errors[0].code, 'SQL_COLUMN_TYPE');
    assert.equal(findTable(r.model, 'A')!.columns.length, 3);
  });
  it('chuỗi chưa đóng ⇒ lỗi fatal (trình soạn giữ bản vẽ cũ)', () => {
    const r = parseSql("CREATE TABLE A (s VARCHAR(5) DEFAULT 'abc,\n x INT);");
    assert.ok(r.errors.some((e) => e.fatal && e.code === 'LEX_STRING_OPEN'));
  });
  it('cột trùng, PK nhắc cột không có, chỉ mục trên bảng chưa tạo', () => {
    const r = parseSql('CREATE TABLE A (id INT, id INT, CONSTRAINT PK_A PRIMARY KEY (idx));\nCREATE INDEX IX_Z ON Z (a);');
    assert.deepEqual(r.errors.map((e) => e.code).sort(), ['SQL_DUP_COLUMN', 'SQL_INDEX_TABLE', 'SQL_UNKNOWN_COLUMN']);
  });
  it('T-SQL không có dấu ; giữa các câu', () => {
    const r = parseSql('CREATE TABLE A (id INT PRIMARY KEY)\nCREATE TABLE B (id INT PRIMARY KEY)\nINSERT INTO A VALUES (1)\nCREATE INDEX IX_B ON B(id)');
    assert.deepEqual(r.errors, []);
    assert.deepEqual(r.model.tables.map((t) => t.name), ['A', 'B']);
    assert.equal(findTable(r.model, 'B')!.indexes.length, 1);
  });
  it('thủ tục T-SQL (tới GO) không bị đọc thành bảng', () => {
    const r = parseSql('CREATE TABLE A (id INT PRIMARY KEY);\nGO\nCREATE PROCEDURE dbo.p AS\nBEGIN\n  CREATE TABLE #t (x INT);\n  ALTER TABLE A ADD z INT;\nEND\nGO\nCREATE TABLE B (id INT);', { dialect: 'sqlserver' });
    assert.deepEqual(r.model.tables.map((t) => [t.name, t.columns.length]), [['A', 1], ['B', 1]]);
  });
  it('IF NOT EXISTS (…) BEGIN CREATE TABLE … END vẫn đọc được bảng', () => {
    const r = parseSql("IF OBJECT_ID(N'dbo.A', N'U') IS NULL\nBEGIN\n  CREATE TABLE dbo.A (id INT NOT NULL CONSTRAINT PK_A PRIMARY KEY);\nEND\nGO");
    assert.deepEqual(r.errors, []);
    assert.equal(findTable(r.model, 'A')!.primaryKey?.name, 'PK_A');
  });
});

describe('meta cuối nguồn', () => {
  it('tách / ghép dòng -- ctw:meta', () => {
    const src = joinMeta('CREATE TABLE A (id INT);', { dialect: 'postgres', layout: { A: [10, 20] } });
    assert.match(src, /-- ctw:meta \{"dialect":"postgres","layout":\{"A":\[10,20\]\}\}\n$/);
    const s = splitMeta(src);
    assert.equal(s.sql.trim(), 'CREATE TABLE A (id INT);');
    assert.deepEqual(s.meta, { dialect: 'postgres', layout: { A: [10, 20] } });
    assert.equal(joinMeta(src, {}), 'CREATE TABLE A (id INT);\n');
    assert.equal(analyzeSql(src).parse.dialect, 'postgres');
  });
  it('meta hỏng ⇒ coi như không có', () => {
    assert.deepEqual(splitMeta('SELECT 1;\n-- ctw:meta {oops').meta, {});
  });
});
