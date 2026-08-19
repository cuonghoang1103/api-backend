/**
 * Trần vòng của app phải RỘNG HƠN mọi trần bước của máy chủ.
 *
 * Sinh ra từ một lỗi thật (19/08/2026): app cắt ở 40 vòng trong khi người
 * dùng đã chọn mức "Ultracode — 260 bước" và trả tiền cho nó. Không ai thấy,
 * vì hai con số nằm ở hai kho mã khác nhau và không có gì nối chúng lại.
 *
 * Nên phép kiểm này ĐỌC THẲNG bảng bên máy chủ thay vì chép lại nó — chép
 * lại chính là cách lỗi cũ sinh ra.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const goc = join(import.meta.dirname, '../../..');

function tranBuocMayChu(): number[] {
  const src = readFileSync(join(goc, '../src/services/agent/turn.ts'), 'utf8');
  const i = src.indexOf('const TRAN_BUOC');
  expect(i, 'không tìm thấy TRAN_BUOC bên máy chủ — bảng đã đổi tên?').toBeGreaterThan(-1);
  const than = src.slice(i, src.indexOf('};', i));
  const so = [...than.matchAll(/:\s*(\d+)\s*,/g)].map((m) => Number(m[1]));
  expect(so.length, 'không đọc được con số nào trong TRAN_BUOC').toBeGreaterThanOrEqual(6);
  return so;
}

function maxVongCuaApp(): number {
  const src = readFileSync(join(goc, 'src/main/agent/loop.ts'), 'utf8');
  const m = src.match(/const MAX_VONG = (\d+);/);
  expect(m, 'không tìm thấy MAX_VONG').not.toBeNull();
  return Number(m![1]);
}

describe('trần vòng của app', () => {
  it('rộng hơn trần bước LỚN NHẤT của máy chủ', () => {
    const tran = tranBuocMayChu();
    const lonNhat = Math.max(...tran);
    expect(
      maxVongCuaApp(),
      `máy chủ cho tới ${lonNhat} bước nhưng app cắt ở ${maxVongCuaApp()} vòng — ` +
        'người dùng chọn mức cao sẽ bị dừng sớm kèm một câu trách oan',
    ).toBeGreaterThan(lonNhat);
  });
});
