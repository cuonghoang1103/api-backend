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
    // 401 (hết phiên), 403 (chưa Pro): thử lại chỉ tốn thêm một lượt cho cùng
    // một câu trả lời.
    for (const ma of ['401', '403']) {
      expect(ds, `${ma} không nên thử lại`).not.toContain(ma);
    }
  });

  /**
   * ⚠️ `429` ĐÃ ĐƯỢC CHUYỂN SANG NHÓM THỬ LẠI (15/09/2026), và đây là lý do —
   * phép kiểm cũ chặn nó, có cơ sở, nên không được lật mà không giải thích.
   *
   * Lý lẽ cũ: "429 = hết hạn mức, thử lại chỉ tốn thêm tiền cho cùng một câu
   * trả lời". Đúng — NHƯNG hết hạn mức KHÔNG tới app dưới dạng `429`. Backend
   * gắn mã riêng cho nó (`AGENT_BUDGET_EXCEEDED`, `BUDGET_EXCEEDED`,
   * `CHAT_BUDGET_EXCEEDED`), và `loop.ts` đọc `than.code ?? String(res.status)`
   * — tức mã của backend được ưu tiên.
   *
   * Nên một `429` TRẦN chỉ có thể tới từ CỔNG AI ĐANG QUÁ TẢI. Đo thật
   * 14/09/2026: rambo trả 429/529 suốt 45-60 phút, và vì `429` nằm ngoài danh
   * sách nên mọi lượt agent đang chạy chết ngay, mất sạch bước đã đi.
   *
   * Phép kiểm dưới giữ nguyên ý định CŨ (đừng đốt tiền cho hạn mức đã cạn)
   * bằng cách khoá đúng những mã thật sự mang nghĩa đó.
   */
  it('mã HẾT HẠN MỨC vẫn KHÔNG được thử lại — đó mới là thứ tốn tiền', () => {
    const ds = maThuLai();
    for (const ma of ['AGENT_BUDGET_EXCEEDED', 'BUDGET_EXCEEDED', 'CHAT_BUDGET_EXCEEDED', 'PRO_REQUIRED']) {
      expect(ds, `${ma} bị thử lại ⇒ đốt lượt cho một hạn mức đã cạn`).not.toContain(ma);
    }
  });

  it('cổng AI quá tải (429/529) thì PHẢI thử lại', () => {
    const ds = maThuLai();
    for (const ma of ['429', '529']) {
      expect(ds, `thiếu ${ma} ⇒ cổng nghẽn một nhịp là mất cả việc đang dở`).toContain(ma);
    }
  });
});
