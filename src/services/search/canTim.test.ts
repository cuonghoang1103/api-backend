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

// ════════════════════════════════════════════════════════════════
// Sinh ra từ lỗi thật 10/09/2026: người dùng hỏi "Hôm nay ở bên Anthropic có
// tin tức gì mới không" và trợ lý trả lời "mình không truy cập được internet"
// — trong khi nó tra web được. Cùng câu đó THÊM DẤU HỎI thì lại tra.
// ════════════════════════════════════════════════════════════════
import { LA_CAU_HOI } from './canTim.js';

test('câu hỏi có/không tiếng Việt KHÔNG cần dấu hỏi', () => {
  // ⚠️ "có gì mới" ĐƠN LẺ cố ý KHÔNG kích hoạt — "có gì mới ở Node 26 không"
  // là hỏi phiên bản, không phải hỏi tin tức. Phải có thêm một dấu hiệu thời
  // gian thật ("hôm nay", "tin tức", "mới nhất"). Xem phép kiểm về số phiên bản.
  // Người Việt hỏi bằng tiểu từ cuối câu, và gõ trên điện thoại thì hiếm ai
  // đánh dấu "?".
  for (const c of [
    'Hôm nay ở bên Anthropic có tin tức gì mới không',
    'Hôm nay có tin gì mới không',
    'Giá vàng hôm nay tăng hay giảm nhỉ',
  ]) {
    assert.equal(canTimWeb(c).can, true, `phải tra web: "${c}"`);
  }
});

test('⛔ `\\b` KHÔNG hiểu chữ có dấu — đây là chỗ đã chết âm thầm', () => {
  // Bằng chứng cho chính cái bẫy: sau `ì` không có ranh giới ASCII nào.
  assert.equal(/\bgì\b/i.test('là gì'), false, 'đây là lý do bản cũ trượt');
  // Bản mới dùng lookaround theo lớp chữ nên khớp được.
  assert.equal(LA_CAU_HOI.test('tin tức mới nhất của anthropic là gì'), true);
  assert.equal(LA_CAU_HOI.test('cái này thế nào'), true);
  assert.equal(LA_CAU_HOI.test('quán đó ở đâu'), true);
});

test('KHÔNG bắt nhầm câu lập trình thường ngày', () => {
  // Nới tay quá thì mỗi câu hỏi code đều tốn vài giây tra web vô ích.
  for (const c of [
    'biến này đang giữ giá trị gì trong vòng lặp',
    'giải thích cho mình con trỏ trong C',
    'viết hàm Java đảo ngược một chuỗi',
  ]) {
    assert.equal(canTimWeb(c).can, false, `KHÔNG được tra web: "${c}"`);
  }
});
