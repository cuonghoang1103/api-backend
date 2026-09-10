/**
 * ⛔ KHÔNG NĂNG LỰC NÀO CỦA AGENT ĐƯỢC PHỤ THUỘC HỆ ĐIỀU HÀNH.
 *
 * ─── Vì sao cần canh ───
 * Người dùng báo 10/09/2026: "macOS mở được YouTube, Windows/Linux thì không".
 * Lần đó nguyên nhân nằm ở PROMPT (thiếu nhánh `else` khi trình duyệt tắt),
 * không phải ở danh sách năng lực. Nhưng câu hỏi họ đặt ra là câu đúng: có chỗ
 * nào trong app cho Windows/Linux ÍT hơn macOS không?
 *
 * Hôm nay là không, và phép kiểm này giữ cho nó tiếp tục là không. Một `if
 * (process.platform === 'darwin')` lọt vào chỗ tính năng lực sẽ tạo ra đúng
 * kiểu lỗi khó thấy nhất: app chạy bình thường trên máy người viết mã, và
 * thiếu tính năng trên máy người dùng — không lỗi, không log, chỉ là model
 * bảo "tôi không làm được".
 *
 * Khác biệt theo nền tảng ở VẺ NGOÀI (thanh tiêu đề, `type: 'panel'`) thì
 * hoàn toàn hợp lệ — chúng nằm ở `window.ts`/`robotNoi.ts`, không phải ở đây.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const loop = readFileSync(join(__dirname, 'loop.ts'), 'utf8');

/** Khối tính `capabilities` — từ chỗ khai mảng tới chỗ dùng nó. */
function khoiNangLuc(): string {
  const dau = loop.indexOf('const capabilities: string[] = [];');
  expect(dau, 'không tìm thấy chỗ tính năng lực — đổi tên rồi?').toBeGreaterThan(-1);
  const cuoi = loop.indexOf('capabilities,', dau);
  return loop.slice(dau, cuoi > dau ? cuoi : dau + 4000);
}

describe('năng lực agent không rẽ theo hệ điều hành', () => {
  it('⛔ khối tính `capabilities` KHÔNG nhắc tới `process.platform`', () => {
    expect(
      khoiNangLuc(),
      'Một nhánh nền tảng ở đây nghĩa là Windows/Linux nhận ÍT tool hơn macOS, '
      + 'và triệu chứng duy nhất là model nói "tôi không làm được".',
    ).not.toMatch(/process\.platform/);
  });

  it('BỘ DÒ CÓ HOẠT ĐỘNG — nó thật sự đọc đúng khối', () => {
    // Một phép dò cắt trúng chuỗi rỗng thì chứng nhận mọi thứ.
    const k = khoiNangLuc();
    expect(k.length).toBeGreaterThan(200);
    expect(k).toContain("capabilities.push('browser')");
    expect(k).toContain("capabilities.push('fs_write')");
  });

  it('mọi năng lực đều mở được trên MỌI nền tảng — không có danh sách loại trừ', () => {
    // Nếu có ngày cần chặn thật (một tool chỉ chạy trên macOS chẳng hạn), phép
    // kiểm này sẽ đỏ và bắt người viết phải nói rõ lý do ở đây thay vì lặng lẽ
    // để người dùng hai hệ kia tự đoán.
    expect(loop).not.toMatch(/capabilities[\s\S]{0,200}(win32|darwin|linux)/);
  });
});
