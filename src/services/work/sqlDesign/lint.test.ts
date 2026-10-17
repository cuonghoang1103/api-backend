/**
 * Database designer — bộ kiểm "chuẩn thiết kế".   npx tsx --test src/services/work/sqlDesign/lint.test.ts
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { LINT_RULES, lintModel, parseSql, type Dialect } from './index.js';

const NHATRO = readFileSync(fileURLToPath(new URL('./fixtures/nhatrosv.sql', import.meta.url)), 'utf8');
const codes = (sql: string, dialect: Dialect = 'sqlserver') => lintModel(parseSql(sql, { dialect }).model).map((p) => p.code);

describe('lintModel', () => {
  it('NhaTroSV: không lỗi; chỉ ra đúng 2 khoá ngoại chưa có chỉ mục', () => {
    const ps = lintModel(parseSql(NHATRO).model);
    assert.deepEqual(ps.filter((p) => p.severity === 'error'), []);
    assert.deepEqual(ps.filter((p) => p.code === 'FK_NOT_INDEXED').map((p) => p.table).sort(), ['Invoice', 'RentalRequest']);
    assert.ok(!ps.some((p) => p.code === 'NO_PK' || p.code === 'VARCHAR_VIETNAMESE' || p.code === 'MONEY_FLOAT'));
  });
  it('mỗi phát hiện có thông điệp, VÌ SAO và CÁCH SỬA bằng hai thứ tiếng', () => {
    for (const r of LINT_RULES) for (const b of [r.title, r.why, r.fix]) { assert.ok(b.vi.length > 5, r.code); assert.ok(b.en.length > 5, r.code); }
    const ps = lintModel(parseSql('CREATE TABLE T (x FLOAT, price FLOAT);').model);
    for (const p of ps) { assert.ok(p.why?.vi && p.fix?.en, p.code); assert.ok(p.span, p.code); }
  });
  it('bảng không khoá chính; tiền FLOAT; VARCHAR cho tên tiếng Việt (SQL Server)', () => {
    const c = codes('CREATE TABLE Product (id INT, fullName VARCHAR(100), unitPrice FLOAT, note TEXT);');
    assert.ok(c.includes('NO_PK'));
    assert.ok(c.includes('MONEY_FLOAT'));
    assert.equal(c.filter((x) => x === 'VARCHAR_VIETNAMESE').length, 2);
    assert.ok(!codes('CREATE TABLE P (id INT PRIMARY KEY, fullName VARCHAR(100));', 'postgres').includes('VARCHAR_VIETNAMESE'), 'chỉ SQL Server');
  });
  it('khoá ngoại: bảng/cột không có, không phải khoá, sai kiểu, chưa có chỉ mục, cho NULL', () => {
    const sql = `CREATE TABLE P (id INT PRIMARY KEY, code VARCHAR(10));
CREATE TABLE C (id INT PRIMARY KEY, pId BIGINT NOT NULL REFERENCES P(id), pCode VARCHAR(10) REFERENCES P(code), qId INT REFERENCES Q(id), zId INT REFERENCES P(zz));`;
    const c = codes(sql);
    for (const k of ['FK_TYPE_MISMATCH', 'FK_NOT_KEY', 'FK_MISSING_TABLE', 'FK_MISSING_COLUMN', 'FK_NOT_INDEXED', 'FK_NULLABLE']) assert.ok(c.includes(k), k);
    const mm = lintModel(parseSql(sql, { dialect: 'mysql' }).model).find((p) => p.code === 'FK_NOT_INDEXED');
    assert.equal(mm?.severity, 'info', 'InnoDB tự tạo chỉ mục cho khoá ngoại');
  });
  it('1NF: cột danh sách và nhóm cột lặp', () => {
    const c = codes('CREATE TABLE Student (id INT PRIMARY KEY, courseIds VARCHAR(200), phone1 VARCHAR(10), phone2 VARCHAR(10), phone3 VARCHAR(10));');
    assert.ok(c.includes('LIST_IN_COLUMN'));
    assert.equal(c.filter((x) => x === 'REPEATING_GROUP').length, 1);
  });
  it('N–N giả bằng hai khoá ngoại trỏ vào nhau', () => {
    const c = codes('CREATE TABLE A (id INT PRIMARY KEY, bId INT);\nCREATE TABLE B (id INT PRIMARY KEY, aId INT REFERENCES A(id));\nALTER TABLE A ADD CONSTRAINT FK_A_B FOREIGN KEY (bId) REFERENCES B(id);');
    assert.ok(c.includes('M2M_NO_JUNCTION'));
  });
  it('từ khoá dành riêng, mật khẩu thô, VARCHAR không độ dài, DATETIME cũ, khoá tự nhiên, trạng thái không CHECK', () => {
    const c = codes('CREATE TABLE [Order] (id INT PRIMARY KEY, [user] INT, password VARCHAR(50), code VARCHAR, placedAt DATETIME, status VARCHAR(10));');
    for (const k of ['RESERVED_WORD', 'PLAIN_PASSWORD', 'VARCHAR_NO_LENGTH', 'DATETIME_LEGACY', 'NATURAL_KEY_NOT_UNIQUE', 'STATUS_NO_CHECK']) assert.ok(c.includes(k), k);
  });
  it('chỉ mục trùng, khoá trên NVARCHAR(MAX), tên ràng buộc trùng, đặt tên lẫn lộn', () => {
    const c = codes(`CREATE TABLE Users (id INT CONSTRAINT PK_X PRIMARY KEY, bio NVARCHAR(MAX) UNIQUE);
CREATE INDEX IX_dup ON Users(id);
CREATE TABLE order_item (id INT CONSTRAINT PK_X PRIMARY KEY);
CREATE TABLE Product (id INT PRIMARY KEY, unit_price DECIMAL(10,2), stockQty INT, warehouseId INT);`);
    for (const k of ['DUPLICATE_INDEX', 'INDEX_ON_MAX', 'DUPLICATE_CONSTRAINT_NAME', 'NAMING_INCONSISTENT']) assert.ok(c.includes(k), k);
  });
  it('tắt được luật; lỗi xếp trước cảnh báo', () => {
    const ps = lintModel(parseSql('CREATE TABLE T (x INT, r INT REFERENCES Zz(id));').model, { disabled: ['NO_PK'] });
    assert.ok(!ps.some((p) => p.code === 'NO_PK'));
    assert.equal(ps[0].severity, 'error');
  });
  it('bảng đang gõ dở không bị kiểm (tránh báo ồn)', () => {
    assert.deepEqual(codes('CREATE TABLE T (\n x INT,\n y'), []);
  });
});
