/**
 * Mã model app chấp nhận phải PHỦ mọi mã máy chủ có thể gửi về.
 *
 * Thiếu một mã thì `zod` chặn ở cầu nối và nút chọn model im lặng không có
 * tác dụng — không lỗi, không log. Đây đúng họ lỗi "hai con số ở hai kho,
 * không ai nối lại" đã gây bốn sự cố ngày 19/08/2026, nên phép kiểm này ĐỌC
 * THẲNG bảng bên máy chủ thay vì chép lại nó.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const goc = join(import.meta.dirname, '../../..');

function maBenMayChu(): string[] {
  const src = readFileSync(join(goc, '../src/services/agent/models.ts'), 'utf8');
  const ma = [...src.matchAll(/^\s*id: '([a-z0-9-]+)',$/gm)].map((m) => m[1]!);
  expect(ma.length, 'không đọc được mã nào bên máy chủ — bảng đã đổi hình dạng?')
    .toBeGreaterThanOrEqual(6);
  return [...new Set(ma)];
}

function maAppNhan(): string[] {
  const src = readFileSync(join(goc, 'src/shared/ipc.ts'), 'utf8');
  const i = src.indexOf('export const modelAgentSchema');
  const than = src.slice(i, src.indexOf(']);', i));
  return [...than.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]!);
}

describe('mã model AI Code', () => {
  it('app nhận MỌI mã máy chủ có thể gửi', () => {
    const app = new Set(maAppNhan());
    const thieu = maBenMayChu().filter((m) => !app.has(m));
    expect(thieu, `app không nhận: ${thieu.join(', ')} ⇒ nút chọn model sẽ im lặng`).toEqual([]);
  });

  it('danh sách trong main khớp với schema', () => {
    const src = readFileSync(join(goc, 'src/main/ipc/agent.ts'), 'utf8');
    const i = src.indexOf('const MODEL_HOP_LE');
    const than = src.slice(i, src.indexOf(']);', i));
    const main = new Set([...than.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]!));
    const thieu = maAppNhan().filter((m) => !main.has(m));
    expect(thieu, `MODEL_HOP_LE thiếu: ${thieu.join(', ')}`).toEqual([]);
  });
});
