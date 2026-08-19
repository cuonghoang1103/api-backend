/**
 * Máy chủ khởi động lại giữa một lượt agent thì phải THỬ LẠI, không giết lượt.
 *
 * Lỗi thật 19/08/2026: tôi deploy đúng lúc người dùng đang chạy một việc 20
 * bước. Container tráo mất ~10 giây, app nhận "Máy chủ trả về 502", và cả 20
 * bước đã đi đều mất — dù chỉ cần đợi một nhịp. Mã 502/503/504 không phải
 * "cổng AI từ chối" mà là "chỗ nhận đang thay ca".
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const nguon = readFileSync(join(import.meta.dirname, 'loop.ts'), 'utf8');

function maThuLai(): string[] {
  const i = nguon.indexOf('const MA_DANG_THU_LAI');
  expect(i, 'không tìm thấy MA_DANG_THU_LAI').toBeGreaterThan(-1);
  const than = nguon.slice(i, nguon.indexOf(']);', i));
  return [...than.matchAll(/'([A-Z0-9_]+)'/g)].map((m) => m[1]!);
}

describe('thử lại khi đứt', () => {
  it('502/503/504 nằm trong nhóm đáng thử lại', () => {
    const ds = maThuLai();
    for (const ma of ['502', '503', '504']) {
      expect(ds, `thiếu ${ma} ⇒ deploy giữa lượt là mất trắng mọi bước đã đi`).toContain(ma);
    }
  });

  it('KHÔNG thử lại lỗi hỏi lại cũng thế', () => {
    const ds = maThuLai();
    // 401 (hết phiên), 403 (chưa Pro), 429 (hết hạn mức): thử lại chỉ tốn thêm
    // tiền cho cùng một câu trả lời.
    for (const ma of ['401', '403', '429']) {
      expect(ds, `${ma} không nên thử lại`).not.toContain(ma);
    }
  });
});
