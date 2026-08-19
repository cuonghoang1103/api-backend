/**
 * Kiểm bộ bóc HTML → khối, và tên file.
 *
 *   npx tsx --test src/services/noteExport.test.ts
 *
 * Bóc sai thì file xuất ra vẫn mở được bình thường, chỉ là THIẾU nội dung hoặc
 * mất định dạng — không có lỗi nào để lần ra, và người dùng chỉ phát hiện khi
 * đã gửi file đó cho người khác.
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { bocKhoi, raMarkdown, tenFileAnToan } from './noteExport.service.js';

test('bóc đủ tiêu đề, đoạn, danh sách', () => {
  const k = bocKhoi('<h1>Tiêu đề</h1><p>Một đoạn.</p><ul><li>a</li><li>b</li></ul>');
  assert.equal(k.length, 3);
  assert.deepEqual(k[0], { loai: 'tieu-de', muc: 1, chu: 'Tiêu đề' });
  assert.deepEqual(k[2], { loai: 'gach-dau-dong', cac: ['a', 'b'], danhSo: false });
});

test('danh sách có số phân biệt với danh sách chấm', () => {
  const k = bocKhoi('<ol><li>một</li><li>hai</li></ol>');
  assert.equal((k[0] as { danhSo: boolean }).danhSo, true);
});

test('khối mã GIỮ NGUYÊN xuống dòng và thụt lề', () => {
  const k = bocKhoi('<pre><code>if (a) {\n  b();\n}</code></pre>');
  assert.equal(k[0]!.loai, 'ma');
  // Mất thụt lề là mất nghĩa của đoạn mã — đây là lý do <pre> không đi qua
  // `chuThuan` (hàm đó gộp khoảng trắng).
  assert.ok((k[0] as { chu: string }).chu.includes('\n  b();'));
});

test('đổi thực thể HTML về ký tự thật', () => {
  const k = bocKhoi('<p>a &amp; b &lt;tag&gt; &quot;trích&quot;</p>');
  assert.equal((k[0] as { chu: string }).chu, 'a & b <tag> "trích"');
});

test('bỏ qua đoạn rỗng — không đẻ khối trắng trong file xuất', () => {
  assert.equal(bocKhoi('<p></p><p>  </p><p>thật</p>').length, 1);
});

test('<hr> tự đóng vẫn thành khối ngăn cách', () => {
  const k = bocKhoi('<p>a</p><hr><p>b</p>');
  assert.equal(k[1]!.loai, 'ngan-cach');
});

test('<br> trong đoạn thành xuống dòng, không dính chữ', () => {
  const k = bocKhoi('<p>dòng một<br>dòng hai</p>');
  assert.ok((k[0] as { chu: string }).chu.includes('\n'));
});

test('Markdown: tiêu đề trang là h1, tiêu đề trong bài tụt một bậc', () => {
  const md = raMarkdown('Bài của tôi', bocKhoi('<h1>Phần A</h1><p>nội dung</p>'));
  assert.ok(md.startsWith('# Bài của tôi'));
  assert.ok(md.includes('## Phần A'), 'h1 trong bài phải thành ## để không đụng tiêu đề trang');
});

test('Markdown: danh sách có số đánh đúng thứ tự', () => {
  const md = raMarkdown('t', bocKhoi('<ol><li>x</li><li>y</li></ol>'));
  assert.ok(md.includes('1. x'));
  assert.ok(md.includes('2. y'));
});

test('tên file: chặn ký tự Windows cấm và dấu chấm đầu', () => {
  assert.equal(tenFileAnToan('a/b:c*d', 'md'), 'a-b-c-d.md');
  assert.ok(!tenFileAnToan('...ẩn', 'pdf').startsWith('.'));
});

test('tên file: tiêu đề rỗng vẫn ra tên dùng được', () => {
  assert.equal(tenFileAnToan('', 'docx'), 'ghi-chu.docx');
  assert.equal(tenFileAnToan('///', 'md'), 'ghi-chu.md');
});

test('tên file: giữ được chữ có dấu', () => {
  assert.equal(tenFileAnToan('Ghi chú tiếng Việt', 'md'), 'Ghi-chú-tiếng-Việt.md');
});
