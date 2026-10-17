/**
 * Database designer — Mermaid erDiagram ⇒ SQL.   npx tsx --test src/services/work/sqlDesign/mermaidErd.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { findColumn, findTable, generateSql, mermaidErdToModel, parseSql, toMermaid } from './index.js';

const LAB = `erDiagram
  USER ||--o{ RESERVATION : makes
  LAB ||--o{ RESERVATION : "is booked in"
  LAB ||--o{ EQUIPMENT : contains
  RESERVATION }o--o{ EQUIPMENT : uses
  USER {
    bigint id PK
    string email UK
    string full_name
    string role
  }
  LAB {
    bigint id PK
    string name UK
    int capacity
  }
  RESERVATION {
    bigint id PK
    bigint user_id FK
    bigint lab_id FK
    datetime start_at
    string status
  }
  EQUIPMENT {
    bigint id PK
    bigint lab_id FK
    string serial UK
  }`;

describe('mermaidErdToModel', () => {
  const { model, notes } = mermaidErdToModel(LAB, 'sqlserver');
  it('thực thể ⇒ bảng, khoá ngoại dùng đúng cột FK có sẵn, N–N ⇒ bảng nối', () => {
    assert.deepEqual(model.tables.map((t) => t.name), ['USER', 'RESERVATION', 'LAB', 'EQUIPMENT', 'RESERVATION_EQUIPMENT']);
    const r = findTable(model, 'RESERVATION')!;
    assert.deepEqual(r.foreignKeys.map((f) => [f.columns[0], f.refTable]), [['user_id', 'USER'], ['lab_id', 'LAB']]);
    assert.equal(findColumn(r, 'user_id')!.nullable, false);
    const j = findTable(model, 'RESERVATION_EQUIPMENT')!;
    assert.equal(j.primaryKey?.columns.length, 2);
    assert.ok(notes.some((n) => /junction/.test(n.en)));
    assert.equal(findColumn(findTable(model, 'USER'), 'email')!.type.raw, 'NVARCHAR(255)');
    assert.ok(findColumn(findTable(model, 'USER'), 'id')!.identity);
  });
  it('sinh SQL Server ⇒ đọc lại không lỗi; vòng ngược Mermaid giữ quan hệ', () => {
    const sql = generateSql(model, { target: 'sqlserver', drop: false }).text;
    const back = parseSql(sql, { dialect: 'sqlserver' });
    assert.deepEqual(back.errors, []);
    assert.equal(back.model.tables.length, 5);
    assert.equal(back.model.tables.reduce((s, t) => s + t.foreignKeys.length, 0), 5);
    assert.match(toMermaid(back.model), /RESERVATION \|\|--o\{ RESERVATION_EQUIPMENT/);
  });
  it('PostgreSQL + thiếu PK ⇒ thêm cột id tự tăng; 1–1 ⇒ UNIQUE', () => {
    const r = mermaidErdToModel('erDiagram\n  PERSON ||--|| PASSPORT : has\n  PERSON {\n    string name\n  }\n  PASSPORT {\n    string number UK\n  }', 'postgres');
    const p = findTable(r.model, 'PASSPORT')!;
    assert.deepEqual(findTable(r.model, 'PERSON')!.primaryKey?.columns, ['personId']);
    assert.equal(p.foreignKeys[0].refTable, 'PERSON');
    assert.ok(p.uniques.some((u) => u.columns[0] === p.foreignKeys[0].columns[0]));
    assert.deepEqual(parseSql(generateSql(r.model, { target: 'postgres' }).text, { dialect: 'postgres' }).errors, []);
  });
});
