/**
 * Database designer — bộ sinh script.   npx tsx --test src/services/work/sqlDesign/generate.test.ts
 *
 * Phép kiểm chính: SINH rồi ĐỌC LẠI bằng chính bộ đọc ở hệ đích ⇒ cùng số bảng / cột / khoá / chỉ mục, không lỗi.
 * (Chạy thật trên SQL Server 2022 / PostgreSQL 16 / MySQL 8.4 / MongoDB 7 / SQLite 3.54 — xem báo cáo đợt này.)
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintMermaid } from '../diagram.js';
import { creationOrder, exportModel, findColumn, findTable, likeToRegex, parseSql, snakeCase, toMermaid, type DbModel } from './index.js';

const NHATRO = readFileSync(fileURLToPath(new URL('./fixtures/nhatrosv.sql', import.meta.url)), 'utf8');
const model = parseSql(NHATRO).model;
const NOW = new Date('2026-10-17T00:00:00Z');
const gen = (m: DbModel, target: Parameters<typeof exportModel>[1]['target'], o: Partial<Parameters<typeof exportModel>[1]> = {}) => exportModel(m, { target, title: 'NhaTroSV', now: NOW, ...o });

const shape = (m: DbModel) => m.tables.map((t) => `${t.name}:${t.columns.length}c/${t.primaryKey ? 'pk' : '-'}/${t.foreignKeys.length}fk/${t.uniques.length}uq/${t.checks.length}ck`).sort();

describe('sinh rồi đọc lại (NhaTroSV)', () => {
  for (const target of ['sqlserver', 'postgres', 'mysql', 'sqlite'] as const) {
    it(`${target}: đọc lại không lỗi, giữ nguyên bảng/cột/khoá/CHECK`, () => {
      const out = gen(model, target);
      const back = parseSql(out.text, { dialect: target });
      assert.deepEqual(back.errors, [], out.text.slice(0, 400));
      assert.deepEqual(shape(back.model), shape(model));
      const ixCount = (m: DbModel) => m.tables.reduce((s, t) => s + t.indexes.length, 0);
      assert.equal(ixCount(back.model), ixCount(model));
    });
  }
  it('thứ tự tạo: cha trước con', () => {
    const order = creationOrder(model).order.map((t) => t.name);
    assert.ok(order.indexOf('Account') < order.indexOf('Tenant'));
    assert.ok(order.indexOf('Contract') < order.indexOf('Invoice'));
    assert.ok(order.indexOf('Invoice') < order.indexOf('Payment'));
  });
  it('SQL Server: IDENTITY, DEFAULT có tên, chỉ mục lọc, SET QUOTED_IDENTIFIER, BOM', () => {
    const o = gen(model, 'sqlserver', { database: 'NhaTroSV' });
    assert.equal(o.bom, true);
    assert.match(o.text, /SET QUOTED_IDENTIFIER ON;/);
    assert.match(o.text, /IF DB_ID\(N'NhaTroSV'\) IS NULL CREATE DATABASE NhaTroSV;/);
    assert.match(o.text, /accountId\s+INT IDENTITY\(1,1\) NOT NULL/);
    assert.match(o.text, /CONSTRAINT DF_Account_active DEFAULT 1/);
    assert.match(o.text, /CREATE UNIQUE INDEX UX_Contract_ActiveRoom ON dbo\.Contract \(roomId\) WHERE status = 'ACTIVE';/);
    assert.match(o.text, /DROP TABLE IF EXISTS dbo\.MaintenanceRequest;[\s\S]*DROP TABLE IF EXISTS dbo\.Account;/);
  });
  it('PostgreSQL: NVARCHAR→VARCHAR, BIT→BOOLEAN (DEFAULT TRUE), DATETIME2→TIMESTAMP, IDENTITY→GENERATED ALWAYS, LIKE [..]→ !~, partial index', () => {
    const o = gen(model, 'postgres');
    assert.match(o.text, /"fullName"\s+VARCHAR\(100\) NOT NULL/);
    assert.match(o.text, /active\s+BOOLEAN NOT NULL DEFAULT TRUE/);
    assert.match(o.text, /"createdAt"\s+TIMESTAMP\(0\) NOT NULL DEFAULT CURRENT_TIMESTAMP/);
    assert.match(o.text, /"accountId"\s+INTEGER GENERATED ALWAYS AS IDENTITY/);
    assert.match(o.text, /"monthlyPrice"\s+NUMERIC\(12,0\)/);
    assert.match(o.text, /phone !~ '\[\^0-9\]'/);
    assert.match(o.text, /LENGTH\(username\) BETWEEN 4 AND 30/);
    assert.match(o.text, /CREATE UNIQUE INDEX "UX_Contract_ActiveRoom" ON "Contract" \("roomId"\) WHERE status = 'ACTIVE';/);
    assert.match(o.text, /DROP TABLE IF EXISTS .* CASCADE;/);
    assert.match(o.text, /COMMENT ON COLUMN "Account".active IS '0 = bị khoá';/);
    assert.match(o.text, /SET client_encoding = 'UTF8';/);
  });
  it('PostgreSQL snake_case: đổi tên ở MỌI chỗ (cột, khoá, CHECK, chỉ mục)', () => {
    const o = gen(model, 'postgres', { naming: 'snake' });
    assert.match(o.text, /CREATE TABLE rental_request \(/);
    assert.match(o.text, /decided_by\s+INTEGER NULL/);
    assert.match(o.text, /CONSTRAINT fk_rental_request_decided_by FOREIGN KEY \(decided_by\) REFERENCES account \(account_id\)/);
    assert.match(o.text, /CHECK \(\(status = 'PENDING' AND decided_at IS NULL/);
    assert.doesNotMatch(o.text, /"account_id"/, 'snake_case không cần bọc nháy');
    const back = parseSql(o.text, { dialect: 'postgres' });
    assert.deepEqual(back.errors, []);
    assert.ok(findTable(back.model, 'meter_reading'));
  });
  it('MySQL: AUTO_INCREMENT, utf8mb4, CHAR_LENGTH, REGEXP, chỉ mục lọc ⇒ UNIQUE trên CASE WHEN', () => {
    const o = gen(model, 'mysql');
    assert.match(o.text, /`accountId`\s+INT NOT NULL AUTO_INCREMENT/);
    assert.match(o.text, /ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_ci/);
    assert.match(o.text, /CHAR_LENGTH\(`username`\) BETWEEN 4 AND 30/);
    assert.match(o.text, /`phone` NOT REGEXP '\[\^0-9\]'/);
    assert.match(o.text, /CREATE UNIQUE INDEX `UX_Contract_ActiveRoom` ON `Contract` \(\(CASE WHEN `status` = 'ACTIVE' THEN `roomId` END\)\);/);
    assert.match(o.text, /SET FOREIGN_KEY_CHECKS = 0;/);
    assert.ok(o.notes.some((n) => /filtered/.test(n.en)));
  });
  it('SQLite: INTEGER PRIMARY KEY AUTOINCREMENT, GLOB, chỉ mục một phần', () => {
    const o = gen(model, 'sqlite');
    assert.match(o.text, /accountId\s+INTEGER CONSTRAINT PK_Account PRIMARY KEY AUTOINCREMENT/);
    assert.match(o.text, /phone NOT GLOB '\*\[\^0-9\]\*'/);
    assert.match(o.text, /CREATE UNIQUE INDEX UX_Contract_ActiveRoom ON Contract \(roomId\) WHERE status = 'ACTIVE';/);
  });
  it('MongoDB: một collection mỗi bảng, enum/min/max/pattern từ CHECK, partialFilterExpression, cú pháp JS hợp lệ', () => {
    const o = gen(model, 'mongodb');
    assert.equal((o.text.match(/db\.createCollection\(/g) ?? []).length, 11);
    assert.match(o.text, /enum: \["ADMIN", "MANAGER", "TENANT"\]/);
    assert.match(o.text, /minLength: 4/);
    assert.match(o.text, /not: \{ pattern: "\[\^0-9\]" \}/);
    assert.match(o.text, /createIndex\(\{ roomId: 1 \}, \{ name: "UX_Contract_ActiveRoom", unique: true, partialFilterExpression: \{ status: "ACTIVE" \} \}\)/);
    assert.match(o.text, /minimum: 0,\s+exclusiveMinimum: true/);
    assert.match(o.text, /THAM CHIẾU/);
    // eslint-disable-next-line no-new-func
    assert.doesNotThrow(() => new Function('db', 'print', 'NumberDecimal', o.text));
  });
  it('Mermaid ERD qua được bộ kiểm Mermaid của máy chủ; có PK/FK/UK và quan hệ 1–1', () => {
    const mm = toMermaid(model);
    const lint = lintMermaid(mm);
    assert.deepEqual(lint.errors, []);
    assert.match(mm, /INT accountId PK "auto"/);
    assert.match(mm, /INT tenantId PK, FK/);
    assert.match(mm, /Account \|\|--o\| Tenant : "tenantId"/);
    assert.match(mm, /Account \|o\.\.o\{ RentalRequest : "decidedBy"/);
  });
  it('DBML + JSON', () => {
    const d = gen(model, 'dbml').text;
    assert.match(d, /Table Account \{/);
    assert.match(d, /accountId INT \[pk, increment\]/);
    assert.match(d, /Ref FK_Tenant_Account: Tenant\.tenantId - Account\.accountId/);
    const j = JSON.parse(gen(model, 'json').text) as { tables: unknown[]; relationships: unknown[] };
    assert.equal(j.tables.length, 11);
    assert.equal(j.relationships.length, 13);
  });
});

describe('chuyển hệ khác ⇒ SQL Server / MySQL', () => {
  const pg = parseSql(`
CREATE TABLE customer (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  email varchar(120) UNIQUE,
  is_vip boolean NOT NULL DEFAULT false,
  note text DEFAULT 'Khách mới',
  joined_at timestamp(3) NOT NULL DEFAULT now(),
  token uuid DEFAULT gen_random_uuid()
);
CREATE TABLE a (id int PRIMARY KEY, b_id int);
CREATE TABLE b (id int PRIMARY KEY, a_id int REFERENCES a(id) ON DELETE RESTRICT);
ALTER TABLE a ADD CONSTRAINT fk_a_b FOREIGN KEY (b_id) REFERENCES b(id);
`, { dialect: 'postgres' }).model;
  it('SQL Server: UNIQUE cho NULL ⇒ chỉ mục lọc, text ⇒ NVARCHAR(MAX) khi là chữ, false ⇒ 0, N\'…\', RESTRICT ⇒ NO ACTION, vòng FK ⇒ ALTER sau', () => {
    const o = gen(pg, 'sqlserver');
    assert.match(o.text, /CREATE UNIQUE INDEX UQ_customer_email ON dbo\.customer \(email\) WHERE email IS NOT NULL;/);
    assert.match(o.text, /full_name\s+NVARCHAR\(MAX\) NOT NULL/);
    assert.match(o.text, /is_vip\s+BIT NOT NULL DEFAULT 0/);
    assert.match(o.text, /DEFAULT N'Khách mới'/);
    assert.match(o.text, /token\s+UNIQUEIDENTIFIER NULL DEFAULT NEWID\(\)/);
    assert.match(o.text, /joined_at\s+DATETIME2\(3\) NOT NULL DEFAULT SYSDATETIME\(\)/);
    assert.match(o.text, /ALTER TABLE dbo\.\w+ ADD CONSTRAINT \w+ FOREIGN KEY/);
    assert.ok(o.notes.some((n) => /RESTRICT/.test(n.en)));
    const back = parseSql(o.text, { dialect: 'sqlserver' });
    assert.deepEqual(back.errors, []);
  });
  it('MySQL: DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3), TEXT có DEFAULT ⇒ (…), UUID ⇒ (UUID())', () => {
    const o = gen(pg, 'mysql');
    assert.match(o.text, /`joined_at`\s+DATETIME\(3\) NOT NULL DEFAULT CURRENT_TIMESTAMP\(3\)/);
    assert.match(o.text, /`note`\s+(LONGTEXT|TEXT) (NULL )?DEFAULT \('Khách mới'\)/);
    assert.match(o.text, /`token`\s+CHAR\(36\) (NULL )?DEFAULT \(UUID\(\)\)/);
    assert.match(o.text, /`is_vip`\s+BOOLEAN NOT NULL DEFAULT FALSE/);
  });
});

describe('tiện ích', () => {
  it('LIKE ⇒ regex', () => {
    assert.equal(likeToRegex('%[^0-9]%'), '[^0-9]');
    assert.equal(likeToRegex('%_@_%._%'), '.@..*\\..');
    assert.equal(likeToRegex('P1%'), '^P1');
    assert.equal(likeToRegex('a.b'), '^a\\.b$');
  });
  it('snake_case', () => {
    assert.equal(snakeCase('accountId'), 'account_id');
    assert.equal(snakeCase('RentalRequest'), 'rental_request');
    assert.equal(snakeCase('UX_Contract_ActiveRoom'), 'ux_contract_active_room');
    assert.equal(snakeCase('HTMLParser'), 'html_parser');
  });
  it('cột tính toán T-SQL sang PostgreSQL ⇒ để dạng chú thích kèm ghi chú', () => {
    const m = parseSql('CREATE TABLE L (qty INT NOT NULL, price DECIMAL(10,0) NOT NULL, amount AS (qty * price) PERSISTED);').model;
    const o = gen(m, 'postgres');
    assert.match(o.text, /-- amount <type> GENERATED ALWAYS AS \(qty \* price\) STORED/);
    assert.equal(findColumn(findTable(m, 'L'), 'amount')!.computed?.stored, true);
    assert.match(gen(m, 'sqlserver').text, /amount AS \(qty \* price\) PERSISTED/);
  });
});
