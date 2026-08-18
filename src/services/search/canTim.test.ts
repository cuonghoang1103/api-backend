/**
 * Bộ luật quyết định CÓ TÌM WEB HAY KHÔNG.
 *
 * Sai theo hai hướng, và hai hướng đó không đối xứng:
 *  • BỎ SÓT → model trả lời bằng kiến thức cũ. Dở, nhưng người dùng nhận ra.
 *  • TÌM BỪA → rác lọt vào ngữ cảnh, model bịa DỰA TRÊN rác và trích nguồn
 *    đàng hoàng. Nhìn còn đáng tin hơn, mà sai nặng hơn.
 * Nên phần lớn phép kiểm dưới đây là chống TÌM BỪA.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { canTimWeb } from './canTim.js';

test('nói thẳng muốn tra cứu ⇒ tìm', () => {
  for (const q of [
    'tìm giúp tôi giá RTX 3090 cũ',
    'tra cứu bảng giá điện sinh hoạt',
    'lên mạng xem hộ tôi tin này',
  ]) assert.equal(canTimWeb(q).can, true, q);
});

test('hỏi về năm sau ngày cắt dữ liệu ⇒ tìm', () => {
  assert.equal(canTimWeb('bảng giá điện sinh hoạt 2026 thế nào').can, true);
  assert.equal(canTimWeb('có gì mới ở Node 26 không').can, false, 'số phiên bản KHÔNG phải năm');
});

test('có địa chỉ web ⇒ tìm', () => {
  assert.equal(canTimWeb('tóm tắt hộ https://example.com/bai-viet').can, true);
});

test('CHÀO HỎI thì không tìm, dù có chữ chỉ thời gian', () => {
  for (const q of ['chào bạn, hiện tại bạn khoẻ không', 'cảm ơn nhé, giờ tôi đang bận']) {
    assert.equal(canTimWeb(q).can, false, q);
  }
});

test('câu LẬP TRÌNH có chữ "giá"/"đang" KHÔNG được tìm bừa', () => {
  // Đây là nhóm nguy hiểm nhất: từ khoá trùng nhưng ý hoàn toàn khác.
  for (const q of [
    'giá trị của biến này bị ghi đè ở đâu',
    'hàm đang chạy bị treo ở dòng nào',
    'sửa giúp tôi lỗi TypeScript đang báo ở file này',
  ]) assert.equal(canTimWeb(q).can, false, q);
});

test('câu quá ngắn thì không tìm', () => {
  for (const q of ['ok', 'ừ', 'được']) assert.equal(canTimWeb(q).can, false, q);
});

test('dấu hiệu thời gian + là câu HỎI ⇒ mới tìm', () => {
  assert.equal(canTimWeb('giá vàng hôm nay bao nhiêu').can, true);
  // Cùng từ khoá nhưng là câu kể, không phải câu hỏi.
  assert.equal(canTimWeb('hôm nay tôi sửa xong phần đăng nhập rồi').can, false);
});

test('câu tìm được cắt gọn, bỏ xưng hô', () => {
  const d = canTimWeb('bạn ơi, tìm giúp tôi giá RTX 3090 cũ ở Việt Nam');
  assert.ok(!d.cauTim.startsWith('bạn ơi'), d.cauTim);
  assert.ok(d.cauTim.length <= 200);
});

test('luôn kèm LÝ DO để sau này gỡ lỗi được', () => {
  const d = canTimWeb('bảng giá điện 2026');
  assert.ok(d.viSao.length > 0);
});
