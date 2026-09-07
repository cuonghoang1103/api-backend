/**
 * Bóc khối bài giảng Code Lab — chỗ đã ÂM THẦM ăn mất nội dung.
 *
 * 07/09/2026 người dùng báo bài giảng "bị ngắt". Đo trong DB production: bài
 * `lab211-j1-s-p0080-shapes` lưu đúng 9 khối và khối CUỐI là một TIÊU ĐỀ TRỐNG
 * — phần thân của nó nằm trong đoạn mảng JSON bị cắt. Đường "cứu vãn" ở đây
 * giữ lại phần đầu (đúng, vì vứt hết thì mất cả bài) nhưng KHÔNG hề nói rằng
 * nó vừa vứt phần đuôi, nên "26 khối đủ cả" và "9 khối mất 17" trả về hình
 * dạng y hệt nhau.
 *
 * Phép kiểm này canh đúng cái cờ đó.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseBlocks } from './codeLab.explain.service.js';

const KHOI = (i: number) => `{"type":"paragraph","text":"a${i}","textVi":"b${i}"}`;

describe('parseBlocks', () => {
  it('mảng ĐẦY ĐỦ ⇒ không báo cứu vãn', () => {
    const kq = parseBlocks(`[${KHOI(1)},${KHOI(2)}]`);
    assert.equal(kq.daCuuVan, false);
    assert.equal((kq.blocks as unknown[]).length, 2);
  });

  it('bọc trong ```json cũng bóc được, vẫn không phải cứu vãn', () => {
    const kq = parseBlocks('Đây là kết quả:\n```json\n[' + KHOI(1) + ']\n```\ncảm ơn');
    assert.equal(kq.daCuuVan, false);
    assert.equal((kq.blocks as unknown[]).length, 1);
  });

  it('cắt GIỮA MẢNG ⇒ giữ phần đầu VÀ báo cứu vãn', () => {
    // Khối 3 cụt: thiếu dấu đóng và thiếu `]`.
    const kq = parseBlocks(`[${KHOI(1)},${KHOI(2)},{"type":"heading","text":"Các API`);
    assert.equal(kq.daCuuVan, true, 'phải báo là đã cứu vãn');
    assert.equal((kq.blocks as unknown[]).length, 2, 'giữ đúng hai khối trọn vẹn');
  });

  it('đúng ca người dùng gặp: khối cuối là tiêu đề, phần thân nằm ở đoạn bị cắt', () => {
    const kq = parseBlocks(
      `[${KHOI(1)},{"type":"heading","text":"Java APIs","textVi":"Các API Java"},{"type":"para`,
    );
    assert.equal(kq.daCuuVan, true);
    const b = kq.blocks as Array<{ type: string }>;
    assert.equal(b.length, 2);
    assert.equal(b[1]!.type, 'heading', 'khối cuối đúng là tiêu đề trống — triệu chứng đã thấy');
  });

  it('không có mảng nào ⇒ rỗng, và KHÔNG báo cứu vãn (không có gì để cứu)', () => {
    const kq = parseBlocks('Xin lỗi, tôi không tạo được.');
    assert.deepEqual(kq.blocks, []);
    assert.equal(kq.daCuuVan, false);
  });

  it('chuỗi rỗng không nổ', () => {
    assert.deepEqual(parseBlocks('').blocks, []);
  });

  it('dấu ngoặc trong CHUỖI không làm lệch bộ đếm', () => {
    const kq = parseBlocks('[{"type":"code","text":"if (x) { y[0]; }","textVi":"vi"}]');
    assert.equal(kq.daCuuVan, false);
    assert.equal((kq.blocks as unknown[]).length, 1);
  });
});
